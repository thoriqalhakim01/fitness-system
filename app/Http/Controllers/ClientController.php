<?php
namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Trainer;
use App\Models\TrainingSession;
use App\Models\TrainingSessionMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

    public function checkInHandler($rfid)
    {
        try {
            if (empty($rfid)) {
                return $this->renderCheckInError('Invalid RFID UID format. Please scan a valid card.');
            }

            $cleanRfid = trim($rfid);
            $staffId   = Auth::id();

            $member  = Member::with(['points'])->where('rfid_uid', $cleanRfid)->first();
            $trainer = Trainer::where('rfid_uid', $cleanRfid)->first();

            if ($member) {
                return $this->handleMemberCheckIn($member, $staffId, $cleanRfid);
            }

            if ($trainer) {
                return $this->handleTrainerCheckIn($trainer, $staffId, $cleanRfid);
            }

            return $this->renderCheckInError("Member card '{$cleanRfid}' is not registered.");
        } catch (\Throwable $th) {
            Log::error('Check-in error: ' . $th->getMessage(), [
                'rfid_uid' => $rfid,
                'trace'    => $th->getTraceAsString(),
            ]);

            return $this->renderCheckInError('System error occurred. Please try again or contact support.');
        }
    }

    protected function handleMemberCheckIn(Member $member, string $staffId, string $rfidUid)
    {
        if ($member->attendances()->whereDate('entry_timestamp', today())->exists()) {
            return $this->renderCheckInError("Member '{$rfidUid}' has already checked in today.");
        }

        if (($member->points->points ?? 0) <= 0) {
            return $this->renderCheckInError("Member '{$rfidUid}' has no available points.");
        }

        if ($member->points->expires_at < now()) {
            return $this->renderCheckInError("Member '{$rfidUid}' has expired points.");
        }

        DB::transaction(function () use ($member, $staffId) {
            $member->points()->decrement('points');
            $member->attendances()->create([
                'staff_id'        => $staffId,
                'entry_timestamp' => now()->timezone('Asia/Jakarta'),
            ]);
        });

        return Inertia::render('client/check-in', [
            'member'   => $member->fresh(['points']),
            'userType' => 'member',
            'success'  => 'Member checked in successfully',
        ]);
    }

    protected function handleTrainerCheckIn(Trainer $trainer, string $staffId, string $rfidUid)
    {
        if ($trainer->attendances()->whereDate('entry_timestamp', today())->exists()) {
            return $this->renderCheckInError("Trainer '{$rfidUid}' has already checked in today.");
        }

        DB::transaction(function () use ($trainer, $staffId) {
            $trainer->attendances()->create([
                'staff_id'        => $staffId,
                'entry_timestamp' => now()->timezone('Asia/Jakarta'),
            ]);
        });

        $members = Member::select('id', 'name', 'rfid_uid')
            ->where('trainer_id', $trainer->id)
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return Inertia::render('client/check-in', [
            'trainer'  => $trainer,
            'userType' => 'trainer',
            'members'  => $members,
            'success'  => 'Trainer checked in successfully',
        ]);
    }

    protected function renderCheckInError(string $error)
    {
        return Inertia::render('client/check-in', [
            'error' => $error,
        ]);
    }

    public function startTraining(Request $request)
    {
        $validated = $request->validate([
            'trainer_id'   => 'required|exists:trainers,id',
            'member_ids'   => 'required|array|min:1',
            'member_ids.*' => 'exists:members,id',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $trainingSession = TrainingSession::create([
                    'trainer_id'      => $validated['trainer_id'],
                    'staff_id'        => Auth::id(),
                    'entry_timestamp' => now()->timezone('Asia/Jakarta'),
                ]);

                $members = Member::whereIn('id', $validated['member_ids'])->get();

                foreach ($members as $member) {
                    TrainingSessionMember::create([
                        'training_session_id' => $trainingSession->id,
                        'member_id'           => $member->id,
                        'entry_timestamp'     => now()->timezone('Asia/Jakarta'),
                    ]);
                }

                Log::info('Training session started', [
                    'session_id' => $trainingSession->id,
                    'trainer_id' => $validated['trainer_id'],
                    'member_ids' => $validated['member_ids'],
                ]);
            });

            return redirect()->route('client.check-in')->with('success', 'Training session started successfully!');

        } catch (\Exception $e) {
            Log::error('Failed to start training session: ' . $e->getMessage(), [
                'trainer_id' => $validated['trainer_id'] ?? null,
                'member_ids' => $validated['member_ids'] ?? null,
                'error'      => $e->getMessage(),
                'trace'      => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Failed to start training session. Please try again.');
        }

        Log::info('StartTraining method reached', ['request' => $request->all()]);
    }

    public function joinNow()
    {
        $trainers = Trainer::select('id', 'name')->get();

        return Inertia::render('client/join-now', [
            'trainers' => $trainers,
            'flash'    => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function handleJoinNow(Request $request)
    {
        $validated = $request->validate([
            'trainer_id' => 'nullable|exists:trainers,id',
            'name'       => 'required|string',
            'email'      => 'required|email|unique:members,email',
            'phone'      => 'required|numeric|min:3',
            'birthdate'  => 'required|date',
            'weight'     => 'nullable|numeric|min:0',
            'height'     => 'nullable|numeric|min:0',
        ]);

        try {
            Member::create([
                'name'       => $validated['name'],
                'email'      => $validated['email'],
                'phone'      => $validated['phone'],
                'birthdate'  => $validated['birthdate'],
                'weight'     => $validated['weight'],
                'height'     => $validated['height'],
                'trainer_id' => $validated['trainer_id'] ?? null,
                'status'     => 'inactive',
            ]);

            return redirect()->route('client.join-now')->with('success', 'Registration successful! Please contact our staff to verify your account and complete the registration process.');

        } catch (\Exception $e) {
            Log::error('Member registration failed: ' . $e->getMessage());

            return redirect()->back()
                ->withInput()
                ->with('error', 'Registration failed. Please try again or contact support if the problem persists.');
        }
    }
}
