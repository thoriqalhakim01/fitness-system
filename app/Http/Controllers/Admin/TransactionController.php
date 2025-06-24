<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\Package;
use App\Models\Trainer;
use App\Models\Transaction;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $query = Transaction::query();

        $transactions = $query->paginate(20);

        return Inertia::render('admin/transactions/index', [
            'transactions' => $transactions,
            'flash'        => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function create()
    {
        $members  = Member::select('id', 'name', 'is_member')->get();
        $trainers = Trainer::with(['user:id,name'])->get();
        $options  = Package::all();

        return Inertia::render('admin/transactions/create', [
            'members'  => $members,
            'trainers' => $trainers,
            'options'  => $options,
            'error'    => session('error'),
        ]);
    }

    public function edit(string $id)
    {
        $members  = Member::select('id', 'name', 'is_member')->get();
        $trainers = Trainer::with(['user:id,name'])->get();
        $options  = Package::all();

        $transaction = Transaction::with(['member', 'trainer'])->where('id', $id)->firstOrFail();

        return Inertia::render('admin/transactions/edit', [
            'transaction' => $transaction,
            'members'     => $members,
            'options'     => $options,
            'trainers'    => $trainers,
            'error'       => session('error'),
        ]);
    }
}
