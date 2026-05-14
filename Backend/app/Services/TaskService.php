<?php

namespace App\Services;

use App\Models\Task;

class TaskService
{
    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return Task::orderBy('created_at', 'desc')->get();
    }

    public function create(array $data): Task
    {
        return Task::create($data);
    }
}
