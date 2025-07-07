<?php
namespace App\Exports\Excel;

use App\Models\Member;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class MembersExcelExport implements FromQuery, WithHeadings, WithMapping
{   
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Member::with(['trainer.user', 'points'])->orderBy('created_at', 'desc');

        if (! empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereRaw('LOWER(email) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereRaw('LOWER(rfid_uid) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereHas('trainer', function ($q) use ($search) {
                        $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%']);
                    })
                ;
            });
        }

        if (! empty($this->filters['status']) && $this->filters['status'] !== 'all') {
            $isMember = ($this->filters['status'] === 'member');
            $query->where('is_member', $isMember);
        }

        if (! empty($this->filters['type']) && $this->filters['type'] !== 'all') {
            $isMember = ($this->filters['type'] === 'member');
            $query->where('is_member', $isMember);
        }

        if (! empty($this->filters['status']) && $this->filters['status'] !== 'all') {
            $status = $this->filters['status'];
            $query->where('status', $status);
        }

        if (! empty($this->filters['start_date']) && ! empty($this->filters['end_date'])) {
            $query->whereBetween('registration_date', [
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
            'Email',
            'Phone',
            'Trainer',
            'Membership Status',
            'Status',
            'Points',
            'Registration Date',
        ];
    }

    public function map($member): array
    {
        return [
            $member->name,
            $member->email,
            $member->phone,
            $member->trainer->user->name,
            $member->is_member ? 'Active Member' : 'Non-Member',
            $member->status,
            $member->points ? $member->points->points : 0,
            $member->registration_date,
        ];
    }
}
