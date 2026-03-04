<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Customer extends Model
{
    use HasFactory;

    protected $table = 'customers';

    protected $fillable = [
        'user_id',
        'customer_type',
        'trade_status',
        'company_name',
        'vat_number',
        'registration_number',
        'trade_approved_at',
        'trade_approved_by_admin_id',
        'trade_rejected_at',
        'trade_rejected_by_admin_id',
        'trade_rejection_reason',
    ];

    protected $casts = [
        'trade_approved_at' => 'datetime',
        'trade_rejected_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'trade_approved_by_admin_id');
    }

    public function rejectedBy()
    {
        return $this->belongsTo(User::class, 'trade_rejected_by_admin_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getIsTradeAttribute(): bool
    {
        return $this->customer_type === 'trade';
    }

    public function getIsTradeApprovedAttribute(): bool
    {
        return $this->customer_type === 'trade' 
            && $this->trade_status === 'approved';
    }

    public function getTradeApprovedDateAttribute(): ?string
    {
        return $this->trade_approved_at 
            ? $this->trade_approved_at->format('d M Y')
            : null;
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeTrade($query)
    {
        return $query->where('customer_type', 'trade');
    }

    public function scopeTradeApproved($query)
    {
        return $query->where('customer_type', 'trade')
                     ->where('trade_status', 'approved');
    }

    public function scopePendingTrade($query)
    {
        return $query->where('customer_type', 'trade')
                     ->where('trade_status', 'pending');
    }

    /*
    |--------------------------------------------------------------------------
    | Business Logic Methods
    |--------------------------------------------------------------------------
    */

    public function approve(int $adminId): void
    {
        $this->update([
            'trade_status' => 'approved',
            'trade_approved_at' => now(),
            'trade_approved_by_admin_id' => $adminId,
            'trade_rejected_at' => null,
            'trade_rejected_by_admin_id' => null,
            'trade_rejection_reason' => null,
        ]);
    }

    public function reject(int $adminId, string $reason): void
    {
        $this->update([
            'trade_status' => 'rejected',
            'trade_rejected_at' => now(),
            'trade_rejected_by_admin_id' => $adminId,
            'trade_rejection_reason' => $reason,
        ]);
    }
}