<?php

namespace App\Http\Controllers;

use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(private TaskService $taskService) {}

    public function index(): JsonResponse
    {
        return response()->json($this->taskService->getAll());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority'    => 'required|in:High,Medium,Low',
            'column'      => 'required|in:todo,in_progress,done',
        ]);

        $task = $this->taskService->create($validated);

        return response()->json($task, 201);
    }
}
