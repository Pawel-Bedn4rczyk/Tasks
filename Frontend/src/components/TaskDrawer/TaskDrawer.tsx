import {
  ActionIcon,
  Button,
  Drawer,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { createTask, deleteTask, updateTask } from "../../api";
import { type ITask } from "../Task/Task";

interface ITaskDrawerProps {
  opened: boolean;
  column: ITask["column"];
  task?: ITask;
  onClose: () => void;
  onCreated: () => void;
}

interface ITaskFormValues {
  title: string;
  description: string;
  priority: ITask["priority"];
}

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function TaskDrawer({
  opened,
  column,
  task,
  onClose,
  onCreated,
}: ITaskDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isEditing = !!task;

  const form = useForm<ITaskFormValues>({
    initialValues: {
      title: "",
      description: "",
      priority: "medium" as ITask["priority"],
    },
    validate: {
      title: (value) => {
        if (!value.trim()) return "Title is required.";
        return null;
      },
      description: (value) => {
        if (value.length > 0 && !value.trim()) return "Description cannot be blank.";
        return null;
      },
    },
    transformValues: (values) => ({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    }),
  });

  useEffect(() => {
    if (task) {
      form.setValues({
        title: task.title,
        description: task.description ?? "",
        priority: task.priority,
      });
    }
  }, [task]);

  async function handleSubmit(values: ReturnType<typeof form.getTransformedValues>) {
    setLoading(true);

    const result = isEditing
      ? await updateTask(task.id, values)
      : await createTask({ ...values, column });

    setLoading(false);

    if (result) {
      form.reset();
      onCreated();
      onClose();
    }
  }

  function handleDelete() {
    setDeleting(true);
    deleteTask(task!.id).then((success) => {
      setDeleting(false);
      if (success) {
        form.reset();
        setConfirmOpen(false);
        onCreated();
        onClose();
      }
    });
  }

  function handleClose() {
    form.reset();
    onClose();
  }

  return (
    <>
      <Drawer
        opened={opened}
        onClose={handleClose}
        title={
          <Group justify="space-between" align="center" w="100%">
            <Text fw={600}>{isEditing ? "Edit task" : "New task"}</Text>
            {isEditing && (
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setConfirmOpen(true)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            )}
          </Group>
        }
        position="right"
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Title"
              placeholder="Task title"
              {...form.getInputProps("title")}
            />
            <Stack gap={4}>
              <Textarea
                label="Description"
                placeholder="Task description"
                rows={5}
                maxLength={2000}
                resize="vertical"
                {...form.getInputProps("description")}
              />
              <Text size="xs" c="dimmed">
                {(form.values.description ?? "").length} characters
              </Text>
            </Stack>
            <Select
              label="Priority"
              data={priorityOptions}
              {...form.getInputProps("priority")}
            />
            <Button type="submit" mt="sm" fullWidth loading={loading}>
              {isEditing ? "Save changes" : "Create task"}
            </Button>
          </Stack>
        </form>
      </Drawer>

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
