<?php
namespace App\Exports\Excel;

use App\Models\Attendance;
use App\Models\Member;
use App\Models\Trainer;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AttendancesExcelExport implements FromQuery, WithHeadings, WithMapping
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Attendance::query()->with('attendable')->orderBy('entry_timestamp', 'desc');

        if (! empty($this->filters['type']) && $this->filters['type'] !== 'all') {
            $type = $this->filters['type'];
            $query->where('attendable_type', $type === 'member' ? Member::class : Trainer::class);
        }

        if (! empty($this->filters['start_date']) && ! empty($this->filters['end_date'])) {
            $query->whereBetween('entry_timestamp', [
                $this->filters['start_date'],
                $this->filters['end_date'],
            ]);
        }

        return $query;
    }

    public function headings(): array
    {
        return [
            'Name',
            'Type',
            'Entry Date',
            'Entry Time',
        ];
    }

    public function map($attendances): array
    {
        return [
            $attendances->attendable->name,
            $attendances->attendable_type,
            $attendances->entry_timestamp->format('Y-m-d'),
            $attendances->entry_timestamp->format('H:i'),
        ];
    }
}
