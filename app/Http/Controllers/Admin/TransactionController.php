<?php
namespace App\Http\Controllers\Admin;

use App\Exports\Excel\TransactionsExcelExport;
use App\Exports\Pdf\TransactionsPdfExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Member;
use App\Models\Package;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class TransactionController extends Controller
{
    public function index()
    {
        $query = Transaction::query()->with(['member', 'package'])->orderBy('transaction_date', 'desc');

        $search    = request('search');
        $startDate = request('start_date');
        $endDate   = request('end_date');

        if ($search) {
            $query->whereHas('member', function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%']);
            });
        }

        if ($startDate && $endDate) {
            $query->whereBetween('transaction_date', [$startDate, $endDate]);
        }

        $transactions = $query->paginate(20);

        return Inertia::render('admin/transactions/index', [
            'transactions' => $transactions,
            'filters'      => [
                'search'     => request('search', ''),
                'start_date' => request('start_date', null),
                'end_date'   => request('end_date', null),
            ],
            'flash'        => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function exportExcel()
    {
        $filters = [
            'search'     => request('search', ''),
            'start_date' => request('start_date', null),
            'end_date'   => request('end_date', null),
        ];

        return Excel::download(new TransactionsExcelExport($filters), 'transactions_' . now()->timezone('Asia/Jakarta')->format('Ymd_His') . '.xlsx');
    }

    public function exportPdf()
    {
        $filters = [
            'search'     => request('search', ''),
            'start_date' => request('start_date', null),
            'end_date'   => request('end_date', null),
        ];

        $export = new TransactionsPdfExport($filters);

        $pdf = Pdf::loadView('exports.transactions-pdf', [
            'transactions' => $export->query()->get(),
            'filters'      => $filters,
        ]);

        return $pdf->download('transactions_' . now()->timezone('Asia/Jakarta')->format('Ymd_His') . '.pdf');
    }

    public function create()
    {
        $members = Member::select('id', 'name', 'is_member')->get();
        $options = Package::all();

        return Inertia::render('admin/transactions/create', [
            'members' => $members,
            'options' => $options,
            'error'   => session('error'),
        ]);
    }

    public function store(StoreTransactionRequest $request)
    {
        $validated = $request->validated();

        $member  = Member::with('points')->findOrFail($validated['member_id']);
        $package = Package::findOrFail($validated['package_id']);

        DB::beginTransaction();

        try {
            $transaction = Transaction::create([
                'staff_id'         => $validated['staff_id'],
                'member_id'        => $validated['member_id'],
                'package_id'       => $validated['package_id'],
                'transaction_date' => $validated['transaction_date'],
                'amount'           => $validated['amount'],
                'points'           => $validated['points'],
                'payment_method'   => $validated['payment_method'],
                'notes'            => $validated['notes'],
            ]);

            if ($member->is_member && $member->points) {
                $currentPoints = $member->points->points;
                $pointAdded    = $transaction->points;

                $member->points()->update([
                    'points'     => $currentPoints + $pointAdded,
                    'expires_at' => now()->timezone('Asia/Jakarta')->addDays($package->duration),
                ]);
            } elseif ($member->is_member && ! $member->points) {
                $member->points()->create([
                    'balance'    => $transaction->points ?? 0,
                    'expires_at' => now()->timezone('Asia/Jakarta')->addDays($package->duration),
                ]);
            }

            DB::commit();

            return redirect()
                ->route('admin.transactions.index')
                ->with('success', 'Transaction created successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error('Transaction creation failed: ' . $th->getMessage());

            return back()
                ->withErrors(['error' => 'Failed to create transaction. Please try again.'])
                ->withInput();
        }
    }

    public function edit(string $id)
    {
        $members = Member::select('id', 'name', 'is_member')->get();
        $options = Package::all();

        $transaction = Transaction::with(['member', 'package'])->where('id', $id)->firstOrFail();

        return Inertia::render('admin/transactions/edit', [
            'transaction' => $transaction,
            'members'     => $members,
            'options'     => $options,
            'error'       => session('error'),
        ]);
    }

    public function update(UpdateTransactionRequest $request, string $id)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            $transaction = Transaction::with(['member.points', 'package'])->findOrFail($id);

            $oldMemberId  = $transaction->member_id;
            $oldPoints    = $transaction->points;
            $oldPackageId = $transaction->package_id;

            $newMemberId  = $validated['member_id'];
            $newPoints    = $validated['points'] ?? 0;
            $newPackageId = $validated['package_id'];

            if ($transaction->member && $transaction->member->is_member && $transaction->member->points) {
                $this->revertMemberPoints($transaction->member, $oldPoints);
            }

            $transaction->update([
                'staff_id'         => $validated['staff_id'],
                'member_id'        => $newMemberId,
                'package_id'       => $newPackageId,
                'transaction_date' => $validated['transaction_date'],
                'amount'           => $validated['amount'],
                'points'           => $newPoints,
                'payment_method'   => $validated['payment_method'],
                'notes'            => $validated['notes'] ?? null,
            ]);

            $newMember  = Member::with('points')->findOrFail($newMemberId);
            $newPackage = Package::findOrFail($newPackageId);

            if ($newMember->is_member) {
                $this->applyMemberPoints($newMember, $newPoints, $newPackage);
            }

            DB::commit();

            return redirect()
                ->route('admin.transactions.index')
                ->with('success', 'Transaction updated successfully.');

        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error('Transaction update failed: ' . $th->getMessage(), [
                'transaction_id' => $id,
                'validated_data' => $validated,
                'trace'          => $th->getTraceAsString(),
            ]);

            return back()
                ->withErrors(['error' => 'Failed to update transaction. Please try again.'])
                ->withInput();
        }
    }

    public function destroy(string $id)
    {
        DB::beginTransaction();

        try {
            $transaction = Transaction::with(['member.points', 'package'])->findOrFail($id);

            if ($transaction->member && $transaction->member->is_member && $transaction->member->points) {
                $this->revertMemberPoints($transaction->member, $transaction->points ?? 0);
            }

            $transaction->delete();

            DB::commit();

            return redirect()
                ->route('admin.transactions.index')
                ->with('success', 'Transaction deleted successfully.');

        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error('Transaction deletion failed: ' . $th->getMessage());

            return back()
                ->withErrors(['error' => 'Failed to delete transaction. Please try again.']);
        }
    }

    private function revertMemberPoints(Member $member, int $pointsToRevert): void
    {
        if (! $member->points) {
            return;
        }

        $currentPoints = $member->points->points ?? 0;
        $newPoints     = max(0, $currentPoints - $pointsToRevert);

        $member->points()->update([
            'points' => $newPoints,
        ]);

        Log::info('Reverted member points', [
            'member_id'       => $member->id,
            'points_reverted' => $pointsToRevert,
            'previous_points' => $currentPoints,
            'new_points'      => $newPoints,
        ]);
    }

    private function applyMemberPoints(Member $member, int $pointsToAdd, Package $package): void
    {
        if ($pointsToAdd <= 0) {
            return;
        }

        if ($member->points) {
            $currentPoints = $member->points->points ?? 0;
            $newPoints     = $currentPoints + $pointsToAdd;

            $member->points()->update([
                'points'     => $newPoints,
                'expires_at' => now()->timezone('Asia/Jakarta')->addDays($package->duration),
            ]);

            Log::info('Updated member points', [
                'member_id'       => $member->id,
                'points_added'    => $pointsToAdd,
                'previous_points' => $currentPoints,
                'new_points'      => $newPoints,
            ]);
        } else {
            $member->points()->create([
                'points'     => $pointsToAdd,
                'expires_at' => now()->timezone('Asia/Jakarta')->addDays($package->duration),
            ]);

            Log::info('Created member points', [
                'member_id'      => $member->id,
                'points_created' => $pointsToAdd,
            ]);
        }
    }
}
