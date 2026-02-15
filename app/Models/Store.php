<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'store_name',
        'address',
        'city',
        'postcode',
        'store_phone',
        'opening_hours',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'opening_hours' => 'array', // assuming opening_hours is stored as JSON, e.g. {"mon":"8-16","tue":"8-16"}
    ];

    /**
     * The attributes that should be visible for serialization.
     *
     * @var array<int, string>
     */
    protected $visible = [
        'id',
        'seller_id',
        'user_id',
        'store_name',
        'address',
        'city',
        'postcode',
        'store_phone',
        'status',
        'opening_hours',
        'created_at',
        'updated_at',
    ];

    /**
     * Get the seller that owns the store.
     */
    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }
}
