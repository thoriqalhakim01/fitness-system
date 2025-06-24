<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMemberRequest;
use App\Http\Requests\Admin\UpdateMemberRequest;
use App\Models\Member;
use App\Models\Trainer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index()
    {
        $query = Member::query()->with(['trainer.user', 'points']);

        $members = $query->paginate(20);

        return Inertia::render('admin/members/index', [
            'members' => $members,
            'flash'   => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function create()
    {
        $trainers = Trainer::with('user')->get();

        return Inertia::render('admin/members/create', [
            'trainers' => $trainers,
            'error'    => session('error'),
        ]);
    }

    public function store(StoreMemberRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        $isMember = isset($validated['is_member']) && $validated['is_member'] === '1';

        try {
            $member = Member::create([
                'staff_id'          => $validated['staff_id'],
                'trainer_id'        => $validated['trainer_id'],
                'rfid_uid'          => $isMember ? $validated['rfid_uid'] : null,
                'name'              => $validated['name'],
                'email'             => $validated['email'],
                'phone'             => $validated['phone'],
                'registration_date' => $validated['registration_date'],
                'is_member'         => $isMember,
            ]);

            if ($isMember) {
                $member->points()->create([
                    'points'     => 0,
                    'expires_at' => now()->timezone('Asia/Jakarta')->addDays(30),
                ]);
            }

            DB::commit();

            return redirect()->route('admin.members.index')->with('success', 'Member created successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error('Member creation failed: ' . $th->getMessage());

            return back()
                ->withErrors(['error' => 'Failed to create member. Please try again.'])
                ->withInput();
        }
    }

    public function show(string $id)
    {
        $member = Member::with(['trainer.user', 'points', 'attendances'])->findOrFail($id);

        return Inertia::render('admin/members/show', [
            'member' => $member,
            'flash'  => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function edit(string $id)
    {
        $member   = Member::with('trainer')->findOrFail($id);
        $trainers = Trainer::with('user')->get();

        return Inertia::render('admin/members/edit', [
            'member'   => $member,
            'trainers' => $trainers,
            'error'    => session('error'),
        ]);
    }

    public function update(UpdateMemberRequest $request, $id)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        $isMember = isset($validated['is_member']) && $validated['is_member'] === '1';

        try {
            $member = Member::findOrFail($id);

            $member->update([
                'trainer_id'        => $validated['trainer_id'],
                'rfid_uid'          => $isMember ? $validated['rfid_uid'] : null,
                'name'              => $validated['name'],
                'email'             => $validated['email'],
                'phone'             => $validated['phone'],
                'registration_date' => $validated['registration_date'],
                'is_member'         => $isMember,
            ]);

            if ($isMember && ! $member->points) {
                $member->points()->create([
                    'balance'    => 0,
                    'expires_at' => now()->timezone('Asia/Jakarta'),
                ]);
            }

            if (! $isMember && $member->points) {
                $member->points()->delete();
            }

            DB::commit();

            return redirect()->route('admin.members.show', $id)->with('success', 'Member updated successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error('Member update failed: ' . $th->getMessage());

            return back()
                ->withErrors(['error' => 'Failed to update member. Please try again.'])
                ->withInput();
        }
    }

    public function destroy(Request $request, string $id)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        if (! $request->user()) {
            return back()->with('error', 'Password does not match.');
        }

        $member = Member::findOrFail($id);

        $member->delete();

        return redirect()->route('admin.members.index')->with('success', 'Member deleted successfully.');
    }
}
