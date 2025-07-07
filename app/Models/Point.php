<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Point extends Model
{
    use SoftDeletes, HasUlids, HasFactory;

    protected $fillable = [
        'member_id',
        'points',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'date',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }
}
