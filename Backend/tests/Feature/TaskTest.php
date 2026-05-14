<?php

use App\Models\Task;

function createTask(array $attrs = []): Task
{
    return Task::create(array_merge([
        'title'    => 'Test task',
        'priority' => 'medium',
        'column'   => 'todo',
    ], $attrs));
}

// index
it('returns all tasks', function () {
    createTask();
    createTask(['title' => 'Second task']);
    createTask(['title' => 'Third task']);

    $this->getJson('/api/tasks')
        ->assertOk()
        ->assertJsonCount(3);
});

// store
it('creates a task', function () {
    $this->postJson('/api/tasks', [
        'title'    => 'New task',
        'priority' => 'medium',
        'column'   => 'todo',
    ])->assertCreated()
        ->assertJsonFragment(['title' => 'New task']);

    $this->assertDatabaseHas('tasks', ['title' => 'New task']);
});

it('requires a title', function () {
    $this->postJson('/api/tasks', [
        'priority' => 'medium',
        'column'   => 'todo',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('title');
});

it('rejects a title longer than 30 characters', function () {
    $this->postJson('/api/tasks', [
        'title'    => str_repeat('a', 31),
        'priority' => 'medium',
        'column'   => 'todo',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('title');
});

it('stores a blank description as null', function () {
    $this->postJson('/api/tasks', [
        'title'       => 'New task',
        'description' => '   ',
        'priority'    => 'medium',
        'column'      => 'todo',
    ])->assertCreated();

    $this->assertDatabaseHas('tasks', ['title' => 'New task', 'description' => null]);
});

it('rejects an invalid priority', function () {
    $this->postJson('/api/tasks', [
        'title'    => 'New task',
        'priority' => 'urgent',
        'column'   => 'todo',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('priority');
});

// update
it('updates a task', function () {
    $task = createTask(['title' => 'Old title']);

    $this->putJson("/api/tasks/{$task->id}", [
        'title'    => 'New title',
        'priority' => 'high',
    ])->assertOk()
        ->assertJsonFragment(['title' => 'New title']);

    $this->assertDatabaseHas('tasks', ['title' => 'New title']);
});

it('returns 404 when updating a non-existent task', function () {
    $this->putJson('/api/tasks/999', [
        'title'    => 'New title',
        'priority' => 'high',
    ])->assertNotFound();
});

// move
it('moves a task to a valid column', function () {
    $task = createTask(['column' => 'todo']);

    $this->patchJson("/api/tasks/{$task->id}/move", [
        'column' => 'in_progress',
    ])->assertOk()
        ->assertJsonFragment(['column' => 'in_progress']);
});

it('cannot move a done task', function () {
    $task = createTask(['column' => 'done']);

    $this->patchJson("/api/tasks/{$task->id}/move", [
        'column' => 'todo',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('column');
});

it('returns 404 when moving a non-existent task', function () {
    $this->patchJson('/api/tasks/999/move', [
        'column' => 'in_progress',
    ])->assertNotFound();
});

// destroy
it('deletes a task', function () {
    $task = createTask();

    $this->deleteJson("/api/tasks/{$task->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
});

it('returns 404 when deleting a non-existent task', function () {
    $this->deleteJson('/api/tasks/999')
        ->assertNotFound();
});
