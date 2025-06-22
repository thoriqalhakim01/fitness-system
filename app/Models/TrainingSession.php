<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TrainingSession extends Model
{
    use SoftDeletes, HasUlids;

    protected $fillable = [
        'staff_id',
        'trainer_id',
        'entry_timestamp',
    ];

    protected $casts = [
        'entry_timestamp' => 'datetime',
    ];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(Member::class, 'training_session_members')
            ->withTimestamps()
            ->withTrashed();
    }
}
