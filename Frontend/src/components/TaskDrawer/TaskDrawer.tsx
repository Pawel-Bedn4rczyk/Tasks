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
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { type ITask } from "../Task/Task";
import { colors } from "../../colors";

const priorityColors: Record<ITask["priority"], string> = {
  low: colors.green,
  medium: colors.yellow,
  high: colors.red,
};

interface ITaskDrawerProps {
  opened: boolean;
  task?: ITask;
  onClose: () => void;
  onSave: (values: ITaskFormValues) => void;
  onDelete?: (id: number) => void;
}

export interface ITaskFormValues {
  title: string;
  description: string;
  priority: ITask["priority"];
}

const priorityOptions: { value: ITask["priority"]; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function TaskDrawer({
  opened,
  task,
  onClose,
  onSave,
  onDelete,
}: ITaskDrawerProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
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
        if (value.length > 0 && !value.trim())
          return "Description cannot be blank.";
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

  function handleSubmit(values: ReturnType<typeof form.getTransformedValues>) {
    onSave(values);
    form.reset();
    onClose();
  }

  function handleDelete() {
    setConfirmOpen(false);
    onClose();
    onDelete?.(task!.id);
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
        styles={{
          content: {
            backgroundColor: colors.surface,
            borderLeft: `1px solid ${colors.border}`,
          },
          header: { backgroundColor: colors.surface },
        }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Title"
              placeholder="Task title"
              maxLength={50}
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
              leftSection={
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: priorityColors[form.values.priority],
                  }}
                />
              }
              renderOption={({ option }) => (
                <Group gap="xs">
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor:
                        priorityColors[option.value as ITask["priority"]],
                      flexShrink: 0,
                    }}
                  />
                  {option.label}
                </Group>
              )}
              {...form.getInputProps("priority")}
            />
            <Button
              type="submit"
              mt="sm"
              fullWidth
              variant="default"
              leftSection={<IconDeviceFloppy size={16} />}
            >
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
          <Button color="red" onClick={handleDelete}>
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
