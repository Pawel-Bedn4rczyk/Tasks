import { Badge, Box, Group, Stack, Text } from "@mantine/core";
import { colors } from "../../colors";
import { Task, type ITask } from "../Task/Task";

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

const tasks: ITask[] = [
  {
    id: 1,
    column: "todo",
    title: "Update the Design System to Support Dark Mode",
    description:
      "Define adaptable color tokens and styles that maintain visual harmony and sufficient contrast ratios.",
    priority: "High",
    created_at: "2025-04-10",
  },
  {
    id: 2,
    column: "todo",
    title: "Optimize color contrast for accessibility",
    description:
      "Ensure all UI elements meet WCAG 2.1 AA contrast requirements.",
    priority: "Medium",
    created_at: "2025-04-15",
    updated_at: "2025-05-01",
  },
  {
    id: 3,
    column: "in_progress",
    title: "Sketch out initial wireframes for the main screen",
    description: "Create low-fidelity wireframes covering the main user flows.",
    priority: "Medium",
    created_at: "2025-04-20",
  },
  {
    id: 4,
    column: "in_progress",
    title: "Update prototype links for usability testing",
    description:
      "Fix broken links in the Figma prototype before the next user testing session.",
    priority: "Low",
    created_at: "2025-04-22",
    updated_at: "2025-05-10",
  },
  {
    id: 5,
    column: "done",
    title: "Add micro-interactions to prototype for user feedback",
    description:
      "Implement subtle animations to improve perceived responsiveness.",
    priority: "Medium",
    created_at: "2025-03-15",
    updated_at: "2025-04-27",
  },
  {
    id: 6,
    column: "done",
    title: "Prepare handoff files for the development team",
    description:
      "Export all assets and annotate specs in Figma for developer handoff.",
    priority: "High",
    created_at: "2025-04-01",
  },
];

export function Board() {
  return (
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
                <Task key={task.id} {...task} />
              ))}
            </Stack>
          </Stack>
        );
      })}
    </Group>
  );
}
