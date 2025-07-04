<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Member;
use App\Models\Trainer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $query = Attendance::query()->with('attendable')->orderBy('entry_timestamp', 'desc');

        $type      = request('type');
        $startDate = request('start_date');
        $endDate   = request('end_date');

        if ($type && $type !== 'all') {
            $query->where('attendable_type', $type === 'member' ? Member::class : Trainer::class);
        }

        if ($startDate && $endDate) {
            $query->whereBetween('entry_timestamp', [$startDate, $endDate]);
        }

        $attendances = $query->paginate(20);

        return Inertia::render('admin/attendances/index', [
            'attendances' => $attendances,
            'filters'     => [
                'type'       => request('type', 'all'),
                'start_date' => request('start_date', null),
                'end_date'   => request('end_date', null),
            ],
            'flash'       => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }
}
