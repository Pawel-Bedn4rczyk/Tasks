import { type ITask } from "./components/Task/Task";

const API_URL = "http://localhost:8000/api";

export async function getTasks(): Promise<ITask[]> {
  try {
    const res = await fetch(`${API_URL}/tasks`);
    return res.json();
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return [];
  }
}

export async function deleteTask(id: number): Promise<boolean> {
  try {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    return true;
  } catch (error) {
    console.error("Failed to delete task:", error);
    return false;
  }
}

export async function createTask(
  data: Omit<ITask, "id" | "created_at" | "updated_at">,
): Promise<ITask | null> {
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (error) {
    console.error("Failed to create task:", error);
    return null;
  }
}
