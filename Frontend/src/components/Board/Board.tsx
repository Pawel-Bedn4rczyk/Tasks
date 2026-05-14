import { Badge, Box, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getTasks } from "../../api";
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

export function Board() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [drawerColumn, setDrawerColumn] = useState<ITask["column"] | null>(
    null,
  );
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  function fetchTasks() {
    getTasks().then(setTasks);
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <Group align="flex-start" gap="lg">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.column === col.id);

          return (
            <Stack key={col.id} style={{ flex: 1, minWidth: 280 }} gap="sm">
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
              <Stack gap="sm">
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
              </Stack>
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
    </>
  );
}
