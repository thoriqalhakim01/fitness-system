<?php

use App\Http\Controllers\Trainer\MemberController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'role:trainer'])->group(function () {
    Route::prefix('/trainer')->group(function () {
        Route::prefix('/members')->group(function () {
            Route::get('/', [MemberController::class, 'index'])->name('trainer.members.index');
        });
    });
});

require __DIR__ . '/admin.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
