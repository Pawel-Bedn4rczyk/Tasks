import {
  Button,
  Drawer,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { createTask, updateTask } from "../../api";
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

export function TaskDrawer({
  opened,
  column,
  task,
  onClose,
  onCreated,
}: ITaskDrawerProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!task;

  const form = useForm<ITaskFormValues>({
    initialValues: {
      title: "",
      description: "",
      priority: "Medium",
    },
  });

  useEffect(() => {
    if (task) {
      form.setValues({
        title: task.title,
        description: task.description,
        priority: task.priority,
      });
    }
  }, [task]);

  async function handleSubmit(values: ITaskFormValues) {
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

  function handleClose() {
    form.reset();
    onClose();
  }

  return (
    <Drawer
      opened={opened}
      onClose={handleClose}
      title={<Text fw={600}>{isEditing ? "Edit task" : "New task"}</Text>}
      position="right"
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="Task title"
            {...form.getInputProps("title")}
          />
          <Textarea
            label="Description"
            placeholder="Task description"
            rows={4}
            {...form.getInputProps("description")}
          />
          <Select
            label="Priority"
            data={["High", "Medium", "Low"]}
            {...form.getInputProps("priority")}
          />
          <Button type="submit" mt="sm" fullWidth loading={loading}>
            {isEditing ? "Save changes" : "Create task"}
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
}
