<?php
namespace App\Exports\Pdf;

use App\Models\Transaction;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class TransactionsPdfExport implements FromView
{
    protected $filters;
    protected $transactions;

    public function __construct(array $filters = [])
    {
        $this->filters      = $filters;
        $this->transactions = $this->query()->get();
    }

    public function query()
    {
        $query = Transaction::query()->with(['member', 'package'])->orderBy('transaction_date', 'desc');

        if (! empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->whereHas('member', function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%']);
            });
        }

        if (! empty($this->filters['start_date']) && ! empty($this->filters['end_date'])) {
            $query->whereBetween('transaction_date', [
                $this->filters['start_date'],
                $this->filters['end_date'],
            ]);
        }

        return $query;
    }

    public function view(): View
    {
        return view('exports.transactions-pdf', [
            'transactions' => $this->transactions,
            'filters'      => $this->filters,
        ]);
    }
}
