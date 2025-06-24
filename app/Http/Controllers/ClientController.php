<?php
namespace App\Http\Controllers;

use Inertia\Inertia;

class ClientController extends Controller
{
    public function checkIn()
    {
        return Inertia::render('client/check-in', [
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function checkData()
    {
        return Inertia::render('client/check-data', [
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }
}
