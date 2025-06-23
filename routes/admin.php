<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MemberController;
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
            Route::get('/{id}/edit', [TrainerController::class, 'edit'])->name('admin.trainers.edit');
            Route::put('/{id}/edit', [TrainerController::class, 'update'])->name('admin.trainers.update');
            Route::delete('/{id}', [TrainerController::class, 'destroy'])->name('admin.trainers.destroy');
        });

        Route::prefix('/members')->group(function () {
            Route::get('/', [MemberController::class, 'index'])->name('admin.members.index');
            Route::get('/create', [MemberController::class, 'create'])->name('admin.members.create');
            Route::post('/create', [MemberController::class, 'store'])->name('admin.members.store');
        });
    });
});
