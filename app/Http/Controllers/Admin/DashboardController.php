<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Member;
use App\Models\Trainer;
use App\Models\Transaction;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $trainers = Trainer::count();

        $activeMembers = Member::where('is_member', true)->count();

        $todayVisits = Attendance::whereDate('created_at', Carbon::today())->count();

        $monthlyRevenue = Transaction::whereMonth('transaction_date', Carbon::now()->month)
            ->whereYear('transaction_date', Carbon::now()->year)
            ->sum('amount');

        $last6MonthsRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $date      = Carbon::now()->subMonths($i);
            $monthName = $date->format('F');
            $revenue   = Transaction::whereMonth('transaction_date', $date->month)
                ->whereYear('transaction_date', $date->year)
                ->sum('amount');

            $last6MonthsRevenue[] = [
                'month'   => $monthName,
                'revenue' => $revenue,
            ];
        }

        return Inertia::render('admin/dashboard', [
            'trainers'           => $trainers,
            'activeMembers'      => $activeMembers,
            'todayVisits'        => $todayVisits,
            'monthlyRevenue'     => $monthlyRevenue,
            'last6MonthsRevenue' => $last6MonthsRevenue,
        ]);
    }
}
