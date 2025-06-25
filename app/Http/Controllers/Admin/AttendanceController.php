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
        $query = Attendance::query()->with('attendable')->orderBy('entry_timestamp', 'desc');

        $attendances = $query->paginate(20);

        return Inertia::render('admin/attendances/index', [
            'attendances' => $attendances,
        ]);
    }
}
