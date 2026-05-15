<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Validation\ValidationException;

class TaskService
{
    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return Task::orderBy('created_at', 'asc')->get();
    }

    public function create(array $data): Task
    {
        return Task::create($data);
    }

    public function move(Task $task, string $column): Task
    {
        $allowed = [
            'todo'        => ['in_progress', 'done'],
            'in_progress' => ['todo', 'done'],
            'done'        => [],
        ];

        if (!in_array($column, $allowed[$task->column])) {
            throw ValidationException::withMessages([
                'column' => "Cannot move done task",
            ]);
        }

        $task->update(['column' => $column]);

        return $task;
    }

    public function update(Task $task, array $data): Task
    {
        $task->update($data);

        return $task;
    }

    public function delete(Task $task): void
    {
        $task->delete();
    }
}
