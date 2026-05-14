import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
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
  return new Date(dateStr).toLocaleString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const priorityColor = priorityColors[priority];
  const wasEdited = updated_at && updated_at !== created_at;

  function handleDelete() {
    setDeleting(true);
    deleteTask(id).then((success) => {
      setDeleting(false);
      if (success) onDeleted();
    });
  }

  return (
    <>
      <Card
        radius="md"
        p="md"
        onClick={() =>
          onEdit({ id, title, description, priority, column, created_at, updated_at })
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
                setConfirmOpen(true);
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

      <Modal
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete task"
        size="sm"
        centered
      >
        <Text size="sm" mb="lg">
          Are you sure you want to delete this task?
        </Text>
        <Group justify="flex-end">
          <Button color="red" loading={deleting} onClick={handleDelete}>
            Yes
          </Button>
          <Button variant="default" onClick={() => setConfirmOpen(false)}>
            No
          </Button>
        </Group>
      </Modal>
    </>
  );
}
