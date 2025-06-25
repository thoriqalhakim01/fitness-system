<?php
namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Trainer;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TrainerDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $trainer = Trainer::with(['user', 'members', 'trainingSessions.members'])->where('user_id', $user->id)->first();

        $allAttendances = Attendance::where('attendable_type', 'App\Models\Member')
            ->whereIn('attendable_id', $trainer->members->pluck('id'))
            ->get();

        return Inertia::render('trainer/dashboard', [
            'trainer'        => $trainer,
            'allAttendances' => $allAttendances,
        ]);
    }
}
