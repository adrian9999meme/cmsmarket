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
        'seller_id',
        'user_id',
        'store_name',
        'slug',
        'store_phone',
        'store_email',
        'address',
        'city',
        'postcode',
        'status',
        'opening_hours',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'opening_hours' => 'array',
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
        'slug',
        'store_phone',
        'store_email',
        'address',
        'city',
        'postcode',
        'status',
        'opening_hours',
        'created_at',
        'updated_at',
    ];

    // /**
    //  * Get the seller that owns the store.
    //  */
    // public function seller()
    // {
    //     return $this->belongsTo(Seller::class, 'seller_id');
    // }

    // /**
    //  * Get the user that owns the store.
    //  */
    // public function user()
    // {
    //     return $this->belongsTo(User::class, 'user_id');
    // }

    // /**
    //  * Get the seller's name through the relationship (not stored in table).
    //  */
    // public function getSellerNameAttribute()
    // {
    //     return $this->seller ? $this->seller->name : null;
    // }

    // /**
    //  * Get the seller's email through the relationship (not stored in table).
    //  */
    // public function getSellerEmailAttribute()
    // {
    //     return $this->seller ? $this->seller->company_name : null;
    // }

    // /**
    //  * Get the user's name through the relationship (not stored in table).
    //  */
    // public function getUserNameAttribute()
    // {
    //     return $this->user ? $this->user->first_name : null;
    // }

    // /**
    //  * Get the user's email through the relationship (not stored in table).
    //  */
    // public function getUserEmailAttribute()
    // {
    //     return $this->user ? $this->user->email : null;
    // }
}
