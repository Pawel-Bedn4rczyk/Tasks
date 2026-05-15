import { notifications } from "@mantine/notifications";
import { type ITask } from "./components/Task/Task";

const API_URL = "http://localhost:8000/api";

const headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

function showError(message: string) {
  notifications.show({
    color: "red",
    title: "Error",
    message,
    autoClose: 10000,
  });
}

async function getErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();

    if (body?.message) return body.message;

    if (body?.errors) return Object.values(body.errors).flat().join(" ");
  } catch { }

  return `Request failed (${res.status})`;
}

export async function getTasks(): Promise<ITask[]> {
  try {
    const res = await fetch(`${API_URL}/tasks`, { headers });

    if (!res.ok) {
      showError(await getErrorMessage(res));
      return [];
    }

    return res.json();
  } catch {
    showError("Cannot connect to the server.");

    return [];
  }
}

export async function createTask(
  data: Omit<ITask, "id" | "created_at" | "updated_at">,
): Promise<ITask | null> {
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      showError(await getErrorMessage(res));

      return null;
    }

    return res.json();
  } catch {
    showError("Cannot connect to the server.");

    return null;
  }
}

export async function updateTask(
  id: number,
  data: Pick<ITask, "title" | "description" | "priority">,
): Promise<ITask | null> {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      showError(await getErrorMessage(res));

      return null;
    }
    return res.json();
  } catch {
    showError("Cannot connect to the server.");

    return null;
  }
}

export async function moveTask(
  id: number,
  column: ITask["column"],
): Promise<ITask | null> {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}/move`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ column }),
    });

    if (!res.ok) {
      showError(await getErrorMessage(res));

      return null;
    }

    return res.json();
  } catch {
    showError("Cannot connect to the server.");

    return null;
  }
}

export async function deleteTask(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE", headers });

    if (!res.ok) {
      showError(await getErrorMessage(res));

      return false;
    }

    return true;
  } catch {
    showError("Cannot connect to the server.");
    
    return false;
  }
}
