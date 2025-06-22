<?php
namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index()
    {
        return Inertia::render('trainer/members/index');
    }
}
