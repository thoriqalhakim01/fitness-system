<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Member extends Model
{
    use SoftDeletes, HasUlids;

    protected $fillable = [
        'staff_id',
        'trainer_id',
        'rfid_uid',
        'name',
        'avatar',
        'email',
        'phone',
        'registration_date',
        'status',
        'is_member',
    ];

    protected $casts = [
        'registration_date' => 'date',
        'is_member'         => 'boolean',
    ];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    public function points()
    {
        return $this->hasMany(Point::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function trainingSessions(): BelongsToMany
    {
        return $this->belongsToMany(TrainingSession::class, 'training_session_members')
            ->withTimestamps()
            ->withTrashed();
    }
}
