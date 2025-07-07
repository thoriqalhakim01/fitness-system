<?php
namespace App\Exports\Pdf;

use App\Models\Trainer;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class TrainersPdfExport implements FromView
{
    protected $trainers;

    public function __construct()
    {
        $this->trainers = Trainer::with(['user', 'members'])->get();
    }

    public function view(): View
    {
        return view('exports.trainers-pdf', [
            'trainers' => $this->trainers,
        ]);
    }

}
