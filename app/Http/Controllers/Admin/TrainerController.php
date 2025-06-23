<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTrainerRequest;
use App\Http\Requests\Admin\UpdateTrainerRequest;
use App\Models\Trainer;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TrainerController extends Controller
{
    public function index()
    {
        $query = Trainer::query()->with(['user', 'members']);

        $trainers = $query->paginate(20);

        return Inertia::render('admin/trainers/index', [
            'trainers' => $trainers,
            'flash'    => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
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
        $trainer = Trainer::with(['user', 'members', 'trainingSessions'])->findOrFail($id);

        return Inertia::render('admin/trainers/show', [
            'trainer' => $trainer,
            'flash'   => [
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
}
