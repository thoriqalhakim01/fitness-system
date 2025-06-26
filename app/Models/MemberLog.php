<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MemberLog extends Model
{
    use HasUlids, SoftDeletes;

    protected $fillable = [
        'member_id',
        'trainer_id',
        'log_date',
        'notes',
        'exercises',
        'weight',
        'progess_notes',
    ];

    protected $casts = [
        'log_date'  => 'date',
        'exercises' => 'array',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }
}
