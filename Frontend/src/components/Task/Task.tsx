import { Badge, Card, Stack, Text } from "@mantine/core";
import { colors } from "../../colors";

export interface ITask {
  id: number;
  column: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  created_at: string;
  updated_at?: string;
}

const priorityColors: Record<ITask["priority"], string> = {
  High: colors.red,
  Medium: colors.yellow,
  Low: colors.green,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function Task({
  title,
  description,
  priority,
  created_at,
  updated_at,
}: ITask) {
  const priorityColor = priorityColors[priority];
  const wasEdited = updated_at && updated_at !== created_at;

  return (
    <Card
      radius="md"
      p="md"
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        cursor: "pointer",
      }}
    >
      <Stack gap="xs">
        <Badge
          size="xs"
          radius="sm"
          style={{
            backgroundColor: priorityColor + "22",
            color: priorityColor,
            border: "none",
            alignSelf: "flex-start",
          }}
        >
          {priority}
        </Badge>
        <Text size="sm" fw={500} c="gray.2" lh={1.4}>
          {title}
        </Text>
        <Text size="xs" c="dimmed" lh={1.4}>
          {description}
        </Text>
        <Stack gap={2}>
          <Text size="xs" c="dimmed">
            Created: {formatDate(created_at)}
          </Text>
          {wasEdited && (
            <Text size="xs" c="dimmed">
              Modified: {formatDate(updated_at!)}
            </Text>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
