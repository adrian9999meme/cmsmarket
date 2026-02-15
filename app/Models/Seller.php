<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'shop_name',
        'phone_no',
        'address',
        'city',
        'company_name',
        'company_email',
        'company_website',
        'company_type',
    ];

    // /**
    //  * The attributes that should be cast.
    //  *
    //  * @var array<string, string>
    //  */
    // protected $casts = [
    //     'company_details' => 'array', // Assuming company details are stored as JSON
    // ];

    /**
     * The attributes that should be visible for serialization.
     *
     * @var array<int, string>
     */
    protected $visible = [
        'id',
        'user_id',
        'shop_name',
        'phone_no',
        'address',
        'city',
        'status',
        'company_name',
        'company_email',
        'company_website',
        'company_type',
        'created_at',
        'updated_at',
    ];
}
