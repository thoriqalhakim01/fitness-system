<?php
namespace App\Exports\Excel;

use App\Models\Trainer;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class TrainersExcelExport implements FromCollection, WithMapping, WithHeadings
{
    public function collection()
    {
        return Trainer::all();
    }

    public function headings(): array
    {
        return [
            'Name',
            'Email',
            'Phone',
            'Member Trained',
            'Created At',
        ];
    }

    public function map($trainer): array
    {
        return [
            $trainer->name,
            $trainer->user->email,
            $trainer->user->phone,
            $trainer->members()->count(),
            $trainer->created_at,
        ];
    }
}
