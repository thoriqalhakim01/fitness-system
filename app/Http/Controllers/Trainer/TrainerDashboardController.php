<?php
namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Member;
use App\Models\Trainer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TrainerDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $trainer = Trainer::with(['user', 'members', 'trainingSessions.members', 'certifications'])->where('user_id', $user->id)->first();

        $allAttendances = Attendance::where('attendable_type', 'App\Models\Member')
            ->whereIn('attendable_id', $trainer->members->pluck('id'))
            ->get();

        return Inertia::render('trainer/dashboard', [
            'trainer'        => $trainer,
            'allAttendances' => $allAttendances,
            'flash'          => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }
}
