<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Trainer extends Model
{
    use SoftDeletes, HasUlids;

    protected $fillable = [
        'staff_id',
        'user_id',
        'rfid_uid',
        'name',
    ];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function members()
    {
        return $this->hasMany(Member::class);
    }

    public function attendances()
    {
        return $this->morphMany(Attendance::class, 'attendable');
    }

    public function trainingSessions()
    {
        return $this->hasMany(TrainingSession::class);
    }

    public function certifications()
    {
        return $this->hasMany(Certification::class);
    }
}
