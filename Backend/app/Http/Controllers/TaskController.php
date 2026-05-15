<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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
            'title'       => ['required', 'string', 'max:50', 'not_regex:/^\s*$/'],
            'description' => ['nullable', 'string', 'max:2000'],
            'priority'    => 'required|in:high,medium,low',
            'column'      => 'required|in:todo,in_progress,done',
        ], [
            'title.required'  => 'Title is required',
            'title.max'       => 'Title cannot exceed 50 characters',
            'title.not_regex' => 'Title cannot be blank',
        ]);

        $task = $this->taskService->create($validated);

        return response()->json($task, 201);
    }

    public function move(Request $request, Task $task): JsonResponse
    {
        $validated = $request->validate([
            'column' => 'required|in:todo,in_progress,done',
        ]);

        $task = $this->taskService->move($task, $validated['column']);

        return response()->json($task);
    }

    public function update(Request $request, Task $task): JsonResponse
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:50', 'not_regex:/^\s*$/'],
            'description' => ['nullable', 'string', 'max:2000'],
            'priority'    => 'required|in:high,medium,low',
        ], [
            'title.required'  => 'Title is required',
            'title.max'       => 'Title cannot exceed 50 characters',
            'title.not_regex' => 'Title cannot be blank',
        ]);

        $task = $this->taskService->update($task, $validated);

        return response()->json($task);
    }

    public function destroy(Task $task): Response
    {
        $this->taskService->delete($task);

        return response()->noContent();
    }
}
