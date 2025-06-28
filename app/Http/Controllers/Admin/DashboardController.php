<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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

        $members = Member::where('is_member', true)->count();

        $expiringMembers = Member::with('points')
            ->where('is_member', true)
            ->whereHas('points', function ($query) {
                $query->whereBetween('expires_at', [
                    Carbon::now()->addDays(7)->startOfDay(),
                    Carbon::now()->addDays(30)->endOfDay(),
                ]);
            })
            ->take(5)
            ->get()
            ->map(function ($member) {
                $expiresAt     = Carbon::parse($member->points->expires_at);
                $daysRemaining = round(Carbon::now()->diffInDays($expiresAt));

                return [
                    'id'             => $member->id,
                    'name'           => $member->name,
                    'email'          => $member->email,
                    'phone'          => $member->phone,
                    'expires_at'     => $expiresAt->format('d M Y'),
                    'days_remaining' => $daysRemaining,
                    'expires_status' => $daysRemaining <= 7 ? 'critical' : 'warning',
                ];
            });

        $currentMonth = Carbon::now()->month;
        $currentYear  = Carbon::now()->year;

        $monthlyRevenue = Transaction::whereMonth('transaction_date', $currentMonth)
            ->whereYear('transaction_date', $currentYear)
            ->sum('amount');

        $recentTransactions = Transaction::with(['member', 'package', 'staff'])
            ->orderBy('transaction_date', 'desc')
            ->take(8)
            ->get();

        return Inertia::render('admin/dashboard', [
            'trainers'           => $trainers,
            'members'            => $members,
            'monthlyRevenue'     => $monthlyRevenue,
            'recentTransactions' => $recentTransactions,
            'expiringMembers'    => $expiringMembers,
            'currentMonth'       => Carbon::now()->format('F Y'),
        ]);
    }
}
