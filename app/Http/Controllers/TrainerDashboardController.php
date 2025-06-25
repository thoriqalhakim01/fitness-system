<?php
namespace App\Http\Controllers;

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

        $trainer = Trainer::with(['user', 'members', 'trainingSessions.members'])->where('user_id', $user->id)->first();

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

    public function newMember()
    {
        return Inertia::render('trainer/members/new-member', [
            'error' => session('error'),
        ]);
    }

    public function handleNewMember(Request $request)
    {
        $validated = $request->validate([
            'name'              => 'required|string|max:255',
            'email'             => 'required|string|lowercase|email|max:255|unique:members,email',
            'phone'             => 'required|string|max:255',
            'registration_date' => 'required|date',
        ]);

        $trainerId = Trainer::where('user_id', Auth::id())->first()->id;

        Member::create([
            'trainer_id'        => $trainerId,
            'name'              => $validated['name'],
            'email'             => $validated['email'],
            'phone'             => $validated['phone'],
            'registration_date' => $validated['registration_date'],
            'is_member'         => false,
            'status'            => 'inactive',
        ]);

        return redirect()->route('trainer.dashboard')->with('success', 'Created member successfully!');
    }

    public function showMember(string $id)
    {
        $user = Auth::user();

        $trainerId = Trainer::where('user_id', $user->id)->first()->id;

        $member = Member::with(['trainer.user', 'attendances'])->where('trainer_id', $trainerId)->findOrFail($id);

        return Inertia::render('trainer/members/show-member', [
            'member' => $member,
        ]);
    }
}
