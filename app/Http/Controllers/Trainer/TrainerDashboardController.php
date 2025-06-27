<?php
namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Certification;
use App\Models\Trainer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\File;
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

    public function addCertificate()
    {
        return Inertia::render('trainer/add-certificate', [
            'error' => session('error'),
        ]);
    }

    public function handleAddCertificate(Request $request)
    {
        $user    = Auth::user();
        $trainer = Trainer::where('user_id', $user->id)->first();

        if (! $trainer) {
            return redirect()->back()->with('error', 'Trainer profile not found.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'file' => [
                'required',
                'file',
                File::image()
                    ->max(5 * 1024) // 5MB max
                    ->types(['png', 'jpg', 'jpeg']),
            ],
        ], [
            'name.required' => 'Certification name is required.',
            'name.max'      => 'Certification name must not exceed 255 characters.',
            'file.required' => 'Certificate image is required.',
            'file.file'     => 'Please upload a valid file.',
            'file.image'    => 'Certificate must be an image file.',
            'file.max'      => 'Certificate image must not exceed 5MB.',
            'file.mimes'    => 'Certificate must be a PNG, JPG, or JPEG file.',
        ]);

        try {
            $file = $request->file('file');

            $slug = Str::slug($validated['name']);

            $filename = time() . '_' . $trainer->id . '_' . $slug . '.' . $file->getClientOriginalExtension();

            $path = $file->storeAs('certificate', $filename, 's3');

            Certification::create([
                'trainer_id' => $trainer->id,
                'name'       => $validated['name'],
                'image'      => $path,
            ]);

            return redirect()->route('trainer.dashboard')
                ->with('success', 'Certification added successfully!');

        } catch (\Exception $e) {
            Log::error('Error uploading certificate: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to upload certificate. Please try again.')
                ->withInput();
        }
    }
}
