import {
  DndContext,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Badge, Box, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getTasks, moveTask } from "../../api";
import { colors } from "../../colors";
import { Task, type ITask } from "../Task/Task";
import { TaskDrawer } from "../TaskDrawer/TaskDrawer";

interface IColumn {
  id: ITask["column"];
  label: string;
  color: string;
}

const columns: IColumn[] = [
  { id: "todo", label: "To Do", color: colors.gray },
  { id: "in_progress", label: "In Progress", color: colors.yellow },
  { id: "done", label: "Done", color: colors.green },
];

function DroppableColumn({
  col,
  children,
}: {
  col: IColumn;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <Stack
      ref={setNodeRef}
      gap="sm"
      style={{
        minHeight: 100,
        borderRadius: 8,
        outline: isOver ? `2px dashed ${col.color}` : "2px solid transparent",
        transition: "outline 0.15s",
        padding: 4,
      }}
    >
      {children}
    </Stack>
  );
}

export function Board() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [drawerColumn, setDrawerColumn] = useState<ITask["column"] | null>(
    null,
  );
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function fetchTasks() {
    getTasks().then(setTasks);
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.data.current?.column === over.id) return;

    const taskId = active.id as number;
    const prevColumn = active.data.current?.column as ITask["column"];
    const newColumn = over.id as ITask["column"];

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, column: newColumn } : t)),
    );

    const result = await moveTask(taskId, newColumn);

    if (!result) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, column: prevColumn } : t)),
      );
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Group align="flex-start" gap="lg" style={{ flexDirection: isMobile ? "column" : "row" }}>
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.column === col.id);

          return (
            <Stack key={col.id} style={{ flex: 1 }} gap="sm">
              <Group gap="xs">
                <Box
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: col.color,
                  }}
                />
                <Text
                  fw={600}
                  size="sm"
                  c="gray.3"
                  tt="uppercase"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {col.label}
                </Text>
                <Badge size="sm" circle variant="light" color="gray">
                  {colTasks.length}
                </Badge>
              </Group>
              <DroppableColumn col={col}>
                {colTasks.map((task) => (
                  <Task
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    priority={task.priority}
                    column={task.column}
                    created_at={task.created_at}
                    updated_at={task.updated_at}
                    onDeleted={fetchTasks}
                    onEdit={setEditingTask}
                  />
                ))}
                {col.id === "todo" && (
                  <UnstyledButton
                    onClick={() => setDrawerColumn("todo")}
                    style={{
                      border: `1px dashed ${colors.border}`,
                      borderRadius: 8,
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      color: colors.gray,
                      width: "100%",
                    }}
                  >
                    <IconPlus size={14} />
                    <Text size="xs">Add task</Text>
                  </UnstyledButton>
                )}
              </DroppableColumn>
            </Stack>
          );
        })}
      </Group>

      <TaskDrawer
        opened={drawerColumn !== null || editingTask !== null}
        column={drawerColumn ?? "todo"}
        task={editingTask ?? undefined}
        onClose={() => {
          setDrawerColumn(null);
          setEditingTask(null);
        }}
        onCreated={fetchTasks}
      />
    </DndContext>
  );
}
