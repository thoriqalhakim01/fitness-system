<?php
namespace App\Http\Controllers\Admin;

use App\Exports\TrainersExcelExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTrainerRequest;
use App\Http\Requests\Admin\UpdateTrainerRequest;
use App\Models\Attendance;
use App\Models\Trainer;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class TrainerController extends Controller
{
    public function index()
    {
        $query = Trainer::query()->with(['user', 'members']);

        $search = request('search');

        if ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('rfid_uid', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->whereRaw('LOWER(email) LIKE ?', ['%' . strtolower($search) . '%']);
                    });
            });
        }

        $trainers = $query->paginate(20);

        return Inertia::render('admin/trainers/index', [
            'trainers' => $trainers,
            'filters'  => [
                'search' => request('search', ''),
            ],
            'flash'    => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function exportExcel()
    {
        return Excel::download(new TrainersExcelExport(), 'trainers_' . now()->timezone('Asia/Jakarta')->format('Ymd_His') . '.xlsx');
    }

    public function exportPdf()
    {
        $trainers = Trainer::with(['user', 'members'])->get();

        $pdf = Pdf::loadView('exports.trainers-pdf', [
            'trainers' => $trainers,
        ]);

        return $pdf->download('trainers_' . now()->timezone('Asia/Jakarta')->format('Ymd_His') . '.pdf');
    }

    public function create()
    {
        return Inertia::render('admin/trainers/create');
    }

    public function store(StoreTrainerRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            $generatedPassword = substr(str_shuffle('0123456789'), 0, 8);

            $user = User::create([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'password' => Hash::make($generatedPassword),
                'phone'    => $validated['phone'],
            ]);

            $user->assignRole('trainer');

            $user->trainer()->create([
                'rfid_uid' => $validated['rfid_uid'],
            ]);

            DB::commit();

            return redirect()->route('admin.trainers.index')->with('success', 'Trainer created successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error('Trainer creation failed: ' . $th->getMessage());

            return back()
                ->withErrors(['error' => 'Failed to create trainer. Please try again.'])
                ->withInput();
        }
    }

    public function show(string $id)
    {
        $trainer = Trainer::with(['user', 'members', 'trainingSessions.members'])->findOrFail($id);

        $today    = Carbon::today();
        $todayEnd = Carbon::today()->endOfDay();

        $allAttendances = Attendance::where('attendable_type', 'App\Models\Member')
            ->whereIn('attendable_id', $trainer->members->pluck('id'))
            ->get();

        return Inertia::render('admin/trainers/show', [
            'trainer'        => $trainer,
            'allAttendances' => $allAttendances,
            'flash'          => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function edit(string $id)
    {
        $trainer = Trainer::with(['user'])->findOrFail($id);

        return Inertia::render('admin/trainers/edit', [
            'trainer' => $trainer,
            'error'   => session('error'),
        ]);
    }

    public function update(UpdateTrainerRequest $request, $id)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            $trainer = Trainer::with(['user'])->findOrFail($id);

            $trainer->user()->update([
                'name'  => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
            ]);

            $trainer->update([
                'rfid_uid' => $validated['rfid_uid'],
            ]);

            DB::commit();

            return redirect()->route('admin.trainers.show', $trainer->id)->with('success', 'Trainer updated successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error('Trainer update failed: ' . $th->getMessage());

            return back()
                ->withErrors(['error' => 'Failed to update trainer. Please try again.'])
                ->withInput();
        }
    }

    public function destroy(Request $request, string $id)
    {
        DB::beginTransaction();

        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        if (! $request->user()) {
            return back()->with('error', 'Password does not match.');
        }

        try {
            $trainer = Trainer::with(['user'])->findOrFail($id);

            $trainer->user()->delete();

            $trainer->delete();

            DB::commit();

            return redirect()->route('admin.trainers.index')->with('success', 'Trainer deleted successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error('Trainer deletion failed: ' . $th->getMessage());

            return back()
                ->withErrors(['error' => 'Failed to delete trainer. Please try again.'])
                ->withInput();
        }
    }

    public function editPassword(string $id)
    {
        $trainer = Trainer::with(['user'])->findOrFail($id);

        return Inertia::render('admin/trainers/edit-password', [
            'trainer' => $trainer,
            'error'   => session('error'),
        ]);
    }

    public function updatePassword(Request $request, $id)
    {
        $validated = $request->validate([
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        DB::beginTransaction();

        try {
            $trainer = Trainer::with(['user'])->findOrFail($id);

            $trainer->user()->update([
                'password' => Hash::make($validated['password']),
            ]);

            DB::commit();

            return redirect()->route('admin.trainers.show', $trainer->id)->with('success', 'Trainer password updated successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error('Trainer password update failed: ' . $th->getMessage());

            return back()
                ->withErrors(['error' => 'Failed to update trainer password. Please try again.'])
                ->withInput();
        }
    }
}
