<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class TrainerController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/trainers/index');
    }
}
