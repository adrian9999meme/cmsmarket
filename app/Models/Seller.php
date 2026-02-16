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
        // 'user_id',
        'company_name',
        'company_email',
        'phone_no',
        'company_type',
        // 'company_website',
        // 'address',   
        // 'shop_name',
        // 'city',
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
        'company_name',
        'company_email',
        // 'company_website',
        'phone_no',
        'company_type',
        'pulished',
        // 'address',
        // 'shop_name',
        // 'city',
        'created_at',
        'updated_at',
    ];
}
