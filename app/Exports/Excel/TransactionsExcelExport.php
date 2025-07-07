<?php
namespace App\Exports\Excel;

use App\Models\Transaction;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class TransactionsExcelExport implements FromQuery, WithMapping, WithHeadings
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
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

    public function headings(): array
    {
        return [
            'Transaction Date',
            'Name',
            'Package',
            'Amount',
            'Point Added',
            'Payment Method',
        ];
    }

    public function map($transaction): array
    {
        return [
            $transaction->transaction_date,
            $transaction->member->name,
            $transaction->package->name,
            $transaction->amount,
            $transaction->points,
            $transaction->payment_method,
        ];
    }
}
