<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Member extends Model
{
    use SoftDeletes, HasUlids, HasFactory;

    protected $fillable = [
        'staff_id',
        'trainer_id',
        'rfid_uid',
        'name',
        'avatar',
        'email',
        'phone',
        'birthdate',
        'weight',
        'height',
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
        return $this->belongsTo(User::class);
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    public function points()
    {
        return $this->hasOne(Point::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function attendances()
    {
        return $this->morphMany(Attendance::class, 'attendable');
    }

    public function trainingSessions(): BelongsToMany
    {
        return $this->belongsToMany(TrainingSession::class, 'training_session_members')
            ->withTimestamps()
            ->withTrashed();
    }

    public function logs()
    {
        return $this->hasMany(MemberLog::class);
    }
}
