<?php
namespace App\Exports\Pdf;

use App\Models\Attendance;
use App\Models\Member;
use App\Models\Trainer;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class AttendancesPdfExport implements FromView
{
    protected $filters;
    protected $attendances;

    public function __construct(array $filters = [])
    {
        $this->filters     = $filters;
        $this->attendances = $this->query()->get();
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

    public function view(): View
    {
        return view('exports.attendances-pdf', [
            'attendances' => $this->attendances,
            'filters'     => $this->filters,
        ]);
    }
}
