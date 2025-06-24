<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $query = Attendance::query();

        $attendances = $query->paginate(20);

        return Inertia::render('admin/attendances/index', [
            'attendances' => $attendances,
        ]);
    }

    public function create()
    {
        $members = Member::select('id', 'name', 'is_member')->get();

        return Inertia::render('admin/attendances/create', [
            'members' => $members,
            'error'   => session('error'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            //
        ]);
    }
}
