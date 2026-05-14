<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/tasks', [TaskController::class, 'index']);
Route::post('/tasks', [TaskController::class, 'store']);
Route::put('/tasks/{task}', [TaskController::class, 'update']);
Route::patch('/tasks/{task}/move', [TaskController::class, 'move']);
Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
