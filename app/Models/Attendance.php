<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attendance extends Model
{
    use SoftDeletes, HasUlids;

    protected $fillable = [
        'staff_id',
        'attendable_id',
        'attendable_type',
        'entry_timestamp',
    ];

    protected $casts = [
        'entry_timestamp' => 'datetime',
    ];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function attendable(): MorphTo
    {
        return $this->morphTo();
    }
}
