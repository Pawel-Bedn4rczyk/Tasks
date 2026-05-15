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

it('rejects a title longer than 50 characters', function () {
    $this->postJson('/api/tasks', [
        'title'    => str_repeat('a', 51),
        'priority' => 'medium',
        'column'   => 'todo',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('title');
});

it('rejects a description longer than 2000 characters', function () {
    $this->postJson('/api/tasks', [
        'title'       => 'New task',
        'description' => str_repeat('a', 2001),
        'priority'    => 'medium',
        'column'      => 'todo',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('description');
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

it('rejects a blank title', function () {
    $this->postJson('/api/tasks', [
        'title'    => '   ',
        'priority' => 'medium',
        'column'   => 'todo',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('title');
});

it('rejects an invalid priority', function () {
    $this->postJson('/api/tasks', [
        'title'    => 'New task',
        'priority' => 'urgent',
        'column'   => 'todo',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('priority');
});

it('requires a column', function () {
    $this->postJson('/api/tasks', [
        'title'    => 'New task',
        'priority' => 'medium',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('column');
});

it('rejects an invalid column', function () {
    $this->postJson('/api/tasks', [
        'title'    => 'New task',
        'priority' => 'medium',
        'column'   => 'backlog',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('column');
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

it('rejects a blank title on update', function () {
    $task = createTask();

    $this->putJson("/api/tasks/{$task->id}", [
        'title'    => '   ',
        'priority' => 'medium',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('title');
});

it('rejects a title longer than 50 characters on update', function () {
    $task = createTask();

    $this->putJson("/api/tasks/{$task->id}", [
        'title'    => str_repeat('a', 51),
        'priority' => 'medium',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('title');
});

it('rejects an invalid priority on update', function () {
    $task = createTask();

    $this->putJson("/api/tasks/{$task->id}", [
        'title'    => 'New title',
        'priority' => 'urgent',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('priority');
});

it('rejects a description longer than 2000 characters on update', function () {
    $task = createTask();

    $this->putJson("/api/tasks/{$task->id}", [
        'title'       => 'New title',
        'description' => str_repeat('a', 2001),
        'priority'    => 'medium',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('description');
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

it('requires a column when moving', function () {
    $task = createTask(['column' => 'todo']);

    $this->patchJson("/api/tasks/{$task->id}/move", [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('column');
});

it('rejects an invalid column when moving', function () {
    $task = createTask(['column' => 'todo']);

    $this->patchJson("/api/tasks/{$task->id}/move", [
        'column' => 'backlog',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('column');
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
