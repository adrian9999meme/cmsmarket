<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TradeDiscountRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'store_id',
        'merchant_name',
        'merchant_customer_number',
        'requested_discount_percent',
        'proof_files',
        'status',
        'approved_at',
        'approved_by_admin_id',
        'rejected_at',
        'rejected_by_admin_id',
        'rejection_reason',
    ];

    protected $casts = [
        'proof_files' => 'array',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // If merchant is sellers table:
    public function store()
    {
        return $this->belongsTo(SellerProfile::class, 'store_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by_admin_id');
    }

    public function rejectedBy()
    {
        return $this->belongsTo(User::class, 'rejected_by_admin_id');
    }
}
