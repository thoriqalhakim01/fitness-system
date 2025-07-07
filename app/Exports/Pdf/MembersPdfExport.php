<?php
namespace App\Exports\Pdf;

use App\Models\Member;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class MembersPdfExport implements FromView
{
    protected $filters;
    protected $members;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
        $this->members = $this->query()->get();
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

    public function view(): View
    {
        return view('exports.members-pdf', [
            'members' => $this->members,
            'filters' => $this->filters,
        ]);
    }
}
