<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index()
    {
        $query = User::query()->role('staff');

        $staffs = $query->paginate(20);

        return Inertia::render('admin/staffs/index', [
            'staffs' => $staffs,
            'flash'  => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/staffs/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'phone'    => 'required|numeric|min:3',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'phone'    => $validated['phone'],
            'password' => bcrypt($validated['password']),
        ]);

        $user->assignRole('staff');

        return redirect()->route('admin.staffs.index')->with('success', 'Staff created successfully.');
    }

    public function edit(string $id)
    {
        $staff = User::findOrFail($id);

        return Inertia::render('admin/staffs/edit', [
            'staff' => $staff,
            'error' => session('error'),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'phone' => 'required|numeric|min:3',
        ]);

        $staff = User::findOrFail($id);

        $staff->update([
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
        ]);

        return redirect()->route('admin.staffs.index')->with('success', 'Staff updated successfully.');
    }

    public function editPassword(string $id)
    {
        $staff = User::findOrFail($id);

        return Inertia::render('admin/staffs/edit-password', [
            'staff' => $staff,
        ]);
    }

    public function updatePassword(Request $request, string $id)
    {
        $validated = $request->validate([
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $staff = User::findOrFail($id);

        $staff->update([
            'password' => bcrypt($validated['password']),
        ]);

        return redirect()->route('admin.staffs.index')->with('success', 'Password updated successfully.');
    }

    public function destroy(Request $request, string $id)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        if (! $request->user()) {
            return back()->with('error', 'Password does not match.');
        }

        $staff = User::findOrFail($id);

        $staff->delete();

        return redirect()->route('admin.staffs.index')->with('success', 'Staff deleted successfully.');
    }
}
