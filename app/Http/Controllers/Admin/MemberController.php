<?php
namespace App\Http\Controllers\Admin;

use App\Exports\Excel\MembersExcelExport;
use App\Exports\MembersPdfExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMemberRequest;
use App\Http\Requests\Admin\UpdateMemberRequest;
use App\Models\Member;
use App\Models\Trainer;
use App\Rules\UniqueRfidAcrossTables;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class MemberController extends Controller
{
    public function index()
    {
        $query = Member::query()->with(['trainer.user', 'points'])->orderBy('registration_date', 'desc');

        $search    = request('search');
        $type      = request('type');
        $status    = request('status');
        $startDate = request('start_date');
        $endDate   = request('end_date');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereRaw('LOWER(email) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereRaw('LOWER(rfid_uid) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereHas('trainer', function ($q) use ($search) {
                        $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%']);
                    })
                ;
            });
        }

        if ($type && $type !== 'all') {
            $isMember = ($type === 'member');
            $query->where('is_member', $isMember);
        }

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($startDate && $endDate) {
            $query->whereBetween('registration_date', [$startDate, $endDate]);
        }

        $members = $query->paginate(20);

        return Inertia::render('admin/members/index', [
            'members' => $members,
            'filters' => [
                'search'     => request('search', ''),
                'status'     => request('status', 'all'),
                'type'       => request('type', 'all'),
                'start_date' => request('start_date', null),
                'end_date'   => request('end_date', null),
            ],
            'flash'   => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function exportExcel()
    {
        $filters = [
            'search'     => request('search', ''),
            'status'     => request('status', 'all'),
            'type'       => request('type', 'all'),
            'start_date' => request('start_date', null),
            'end_date'   => request('end_date', null),
        ];

        return Excel::download(new MembersExcelExport($filters), 'members_' . now()->format('Ymd_His') . '.xlsx');
    }

    public function exportPdf()
    {
        $filters = [
            'search'     => request('search', ''),
            'status'     => request('status', 'all'),
            'type'       => request('type', 'all'),
            'start_date' => request('start_date', null),
            'end_date'   => request('end_date', null),
        ];

        $members = (new MembersPdfExport($filters))->query()->get();

        $pdf = Pdf::loadView('exports.members-pdf', [
            'members' => $members,
            'filters' => $filters,
        ]);

        return $pdf->download('members_' . now()->format('Ymd_His') . '.pdf');

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
                'birthdate'         => $validated['birthdate'],
                'weight'            => $validated['weight'],
                'height'            => $validated['height'],
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
                'birthdate'         => $validated['birthdate'],
                'weight'            => $validated['weight'],
                'height'            => $validated['height'],
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

    public function changeStatus(Request $request, string $id)
    {
        $request->validate([
            'staff_id'  => 'required|exists:users,id',
            'is_member' => 'required|boolean',
            'status'    => 'required|string|in:active,inactive',
            'rfid_uid'  => [
                'required_if:is_member,true',
                Rule::unique('members', 'rfid_uid')->ignore($id),
                new UniqueRfidAcrossTables('members', $id),
            ],
        ]);

        DB::beginTransaction();

        $isMember = isset($request->is_member) && $request->is_member === '1';

        try {
            $member = Member::findOrFail($id);

            $member->update([
                'staff_id'  => $request->staff_id,
                'rfid_uid'  => $isMember ? $request->rfid_uid : null,
                'is_member' => $isMember,
                'status'    => $request->status,
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

            return redirect()->route('admin.members.show', $id)->with('success', 'Member status changed successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error('Member change status failed: ' . $th->getMessage());

            return back()
                ->withErrors(['error' => 'Failed to change status member. Please try again.'])
                ->withInput();
        }
    }
}
