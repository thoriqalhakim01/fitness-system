<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index()
    {
        $query = Member::query()->with(['trainer.user', 'points']);

        $members = $query->paginate(20);

        return Inertia::render('admin/members/index', [
            'members' => $members,
            'flash'   => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }
}
