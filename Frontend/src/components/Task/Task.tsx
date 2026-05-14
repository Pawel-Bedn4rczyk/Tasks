import { ActionIcon, Badge, Card, Group, Stack, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { deleteTask } from "../../api";
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

interface ITaskProps extends ITask {
  onDeleted: () => void;
  onEdit: (task: ITask) => void;
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
  id,
  title,
  description,
  priority,
  column,
  created_at,
  updated_at,
  onDeleted,
  onEdit,
}: ITaskProps) {
  const priorityColor = priorityColors[priority];
  const wasEdited = updated_at && updated_at !== created_at;

  function handleDelete() {
    deleteTask(id).then((success) => {
      if (success) onDeleted();
    });
  }

  return (
    <Card
      radius="md"
      p="md"
      onClick={() =>
        onEdit({
          id,
          title,
          description,
          priority,
          column,
          created_at,
          updated_at,
        })
      }
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        cursor: "pointer",
      }}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Badge
            size="xs"
            radius="sm"
            style={{
              backgroundColor: priorityColor + "22",
              color: priorityColor,
              border: "none",
            }}
          >
            {priority}
          </Badge>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <IconTrash size={14} />
          </ActionIcon>
        </Group>
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
