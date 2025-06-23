<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\TrainerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin|staff'])->group(function () {
    Route::prefix('/dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard.index');

        Route::prefix('/trainers')->group(function () {
            Route::get('/', [TrainerController::class, 'index'])->name('admin.trainers.index');
            Route::get('/create', [TrainerController::class, 'create'])->name('admin.trainers.create');
            Route::post('/create', [TrainerController::class, 'store'])->name('admin.trainers.store');
            Route::get('/{id}', [TrainerController::class, 'show'])->name('admin.trainers.show');
        });
    });
});
