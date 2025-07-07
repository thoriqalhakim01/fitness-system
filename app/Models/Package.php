<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Package extends Model
{
    use SoftDeletes, HasUlids;

    protected $fillable = [
        'name',
        'price',
        'points',
        'duration',
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
