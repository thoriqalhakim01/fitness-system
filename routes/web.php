<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\Trainer\MemberController;
use App\Http\Controllers\Trainer\TrainerDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware('role:trainer')->group(function () {
        Route::prefix('trainer')->group(function () {
            Route::get('/dashboard', [TrainerDashboardController::class, 'index'])->name('trainer.dashboard');
            Route::get('/add-certificate', [TrainerDashboardController::class, 'addCertificate'])->name('trainer.add-certificate');
            Route::get('/certification/add', [TrainerDashboardController::class, 'addCertificate'])->name('certification.create');
            Route::post('/certification', [TrainerDashboardController::class, 'handleAddCertificate'])->name('certification.store');
            Route::delete('/certification/{certification}', [TrainerDashboardController::class, 'deleteCertificate'])->name('certification.destroy');
            Route::get('/new-member', [MemberController::class, 'newMember'])->name('trainer.new-member');
            Route::post('/new-member', [MemberController::class, 'handleNewMember'])->name('trainer.handle-new-member');
            Route::get('/member/{id}', [MemberController::class, 'showMember'])->name('trainer.show-member');
            Route::get('/member/{id}/add-log', [MemberController::class, 'addLog'])->name('trainer.members.add-log');
            Route::post('/member/{id}/add-log', [MemberController::class, 'handleAddLog'])->name('trainer.handle-add-log');
        });
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
