<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\TrainerDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware('role:trainer')->group(function () {
        Route::get('/trainer/dashboard', [TrainerDashboardController::class, 'index'])->name('trainer.dashboard');
    });

    Route::middleware('role:admin|staff')->group(function () {
        Route::get('/check-in', [ClientController::class, 'checkIn'])->name('client.check-in');
        Route::get('/check-data', [ClientController::class, 'checkData'])->name('client.check-data');
        Route::get('/check-in/{rfid}', [ClientController::class, 'checkInHandler'])->name('client.check-in-handler');
        Route::post('/training/start', [ClientController::class, 'startTraining'])->name('training.start');
    });
});

require __DIR__ . '/admin.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
