<?php
namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\MemberLog;
use App\Models\Trainer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MemberController extends Controller
{
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

        $member = Member::with(['trainer.user', 'attendances', 'logs.trainer'])->where('trainer_id', $trainerId)->findOrFail($id);

        return Inertia::render('trainer/members/show-member', [
            'member' => $member,
            'flash'  => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function addLog(string $id)
    {
        $member = Member::with('trainer.user')->findOrFail($id);

        return Inertia::render('trainer/members/add-log', [
            'member' => $member,
            'error'  => session('error'),
        ]);
    }

    public function handleAddLog(Request $request, string $id)
    {
        $validated = $request->validate([
            'log_date'           => 'required|date',
            'notes'              => 'nullable|string',
            'exercises'          => 'required|array|min:1',
            'exercises.*.name'   => 'required|string|max:255',
            'exercises.*.sets'   => 'required|integer|min:1',
            'exercises.*.reps'   => 'required|integer|min:1',
            'exercises.*.weight' => 'nullable|numeric|min:0',
            'weight'             => 'nullable|numeric|min:0',
            'progress_notes'     => 'nullable|string',
        ]);

        $trainerId = Trainer::where('user_id', Auth::id())->first()->id;

        MemberLog::create([
            'member_id'  => $id,
            'trainer_id' => $trainerId,
            ...$validated,
        ]);

        return redirect()->route('trainer.show-member', $id)->with('success', 'Added log successfully!');
    }
}
