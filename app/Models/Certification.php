<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class Certification extends Model
{
    use SoftDeletes, HasUlids;

    protected $fillable = [
        'trainer_id',
        'name',
        'image',
    ];

    protected $appends = [
        'image_url',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }

        try {
            return Storage::disk('s3')->url($this->image);
        } catch (\Exception $e) {
            Log::error('Error generating S3 URL: ' . $e->getMessage());
            return null;
        }
    }

    public function getTemporaryUrl(int $expiration = 3600): ?string
    {
        if (! $this->image) {
            return null;
        }

        try {
            return Storage::disk('s3')->temporaryUrl(
                $this->image,
                now()->addSeconds($expiration)
            );
        } catch (\Exception $e) {
            Log::error('Error generating temporary URL: ' . $e->getMessage());
            return null;
        }
    }
}
