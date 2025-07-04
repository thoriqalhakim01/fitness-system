<?php

use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Admin\TrainerController;
use App\Http\Controllers\Admin\TransactionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin|staff'])->group(function () {
    Route::prefix('/dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard.index');

        Route::prefix('/trainers')->group(function () {
            Route::get('/', [TrainerController::class, 'index'])->name('admin.trainers.index');
            Route::get('/export-excel', [TrainerController::class, 'exportExcel'])->name('admin.trainers.export-excel');
            Route::get('/export-pdf', [TrainerController::class, 'exportPdf'])->name('admin.trainers.export-pdf');
            Route::get('/create', [TrainerController::class, 'create'])->name('admin.trainers.create');
            Route::post('/create', [TrainerController::class, 'store'])->name('admin.trainers.store');
            Route::get('/{id}', [TrainerController::class, 'show'])->name('admin.trainers.show');
            Route::get('/{id}/edit', [TrainerController::class, 'edit'])->name('admin.trainers.edit');
            Route::get('/{id}/edit-password', [TrainerController::class, 'editPassword'])->name('admin.trainers.edit-password');
            Route::put('/{id}/edit-password', [TrainerController::class, 'updatePassword'])->name('admin.trainers.update-password');
            Route::put('/{id}/edit', [TrainerController::class, 'update'])->name('admin.trainers.update');
            Route::delete('/{id}', [TrainerController::class, 'destroy'])->name('admin.trainers.destroy');
        });

        Route::prefix('/members')->group(function () {
            Route::get('/', [MemberController::class, 'index'])->name('admin.members.index');
            Route::get('/create', [MemberController::class, 'create'])->name('admin.members.create');
            Route::post('/create', [MemberController::class, 'store'])->name('admin.members.store');
            Route::get('/{id}', [MemberController::class, 'show'])->name('admin.members.show');
            Route::get('/{id}/edit', [MemberController::class, 'edit'])->name('admin.members.edit');
            Route::put('/{id}/edit', [MemberController::class, 'update'])->name('admin.members.update');
            Route::delete('/{id}', [MemberController::class, 'destroy'])->name('admin.members.destroy');
            Route::put('/{id}', [MemberController::class, 'changeStatus'])->name('admin.members.change-status');
        });

        Route::prefix('/packages')->group(function () {
            Route::get('/', [PackageController::class, 'index'])->name('admin.packages.index');
            Route::post('/', [PackageController::class, 'store'])->name('admin.packages.store');
            Route::put('/{id}', [PackageController::class, 'update'])->name('admin.packages.update');
            Route::delete('/{id}', [PackageController::class, 'destroy'])->name('admin.packages.destroy');
        });

        Route::prefix('/transactions')->group(function () {
            Route::get('/', [TransactionController::class, 'index'])->name('admin.transactions.index');
            Route::get('/create', [TransactionController::class, 'create'])->name('admin.transactions.create');
            Route::post('/create', [TransactionController::class, 'store'])->name('admin.transactions.store');
            Route::get('/{id}/edit', [TransactionController::class, 'edit'])->name('admin.transactions.edit');
            Route::put('/{id}/edit', [TransactionController::class, 'update'])->name('admin.transactions.update');
            Route::delete('/{id}', [TransactionController::class, 'destroy'])->name('admin.transactions.destroy');
        });

        Route::prefix('/attendances')->group(function () {
            Route::get('/', [AttendanceController::class, 'index'])->name('admin.attendances.index');
        });

        Route::prefix('/staffs')->group(function () {
            Route::get('/', [StaffController::class, 'index'])->name('admin.staffs.index');
            Route::get('/create', [StaffController::class, 'create'])->name('admin.staffs.create');
            Route::post('/create', [StaffController::class, 'store'])->name('admin.staffs.store');
            Route::get('/{id}/edit', [StaffController::class, 'edit'])->name('admin.staffs.edit');
            Route::put('/{id}/edit', [StaffController::class, 'update'])->name('admin.staffs.update');
            Route::get('/{id}/edit-password', [StaffController::class, 'editPassword'])->name('admin.staffs.edit-password');
            Route::put('/{id}/edit-password', [StaffController::class, 'updatePassword'])->name('admin.staffs.update-password');
            Route::delete('/{id}', [StaffController::class, 'destroy'])->name('admin.staffs.destroy');
        });
    });
});
