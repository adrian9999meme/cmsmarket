<?php

namespace App\Repositories\Admin;

use App\Models\Customer;
use App\Models\User;
use App\Repositories\Interfaces\Admin\CustomerInterface;

class CustomerRepository implements CustomerInterface
{
    /*
    |--------------------------------------------------------------------------
    | Basic Retrieval
    |--------------------------------------------------------------------------
    */

    public function query()
    {
        return Customer::with('user');
    }

    public function get($id)
    {
        return Customer::with('user')->find($id);
    }

    public function all()
    {
        return Customer::with('user')->latest();
    }

    public function paginate($limit)
    {
        return $this->all()->paginate($limit);
    }

    /*
    |--------------------------------------------------------------------------
    | Store Customer
    |--------------------------------------------------------------------------
    */

    public function store($request)
    {
        $customer = new Customer();

        $customer->user_id              = $request->user_id;
        $customer->customer_type        = $request->customer_type ?? 'regular';
        $customer->company_name         = $request->company_name;
        $customer->vat_number           = $request->vat_number;
        $customer->registration_number  = $request->registration_number;

        if ($customer->customer_type === 'trade') {
            $customer->trade_status = 'pending';
        }

        $customer->save();

        return $customer;
    }

    /*
    |--------------------------------------------------------------------------
    | Update Customer
    |--------------------------------------------------------------------------
    */

    public function update($request)
    {
        $customer = Customer::where('id', $request->id)->first();

        if (!$customer) {
            return false;
        }

        $customer->customer_type        = $request->customer_type ?? $customer->customer_type;
        $customer->company_name         = $request->company_name;
        $customer->vat_number           = $request->vat_number;
        $customer->registration_number  = $request->registration_number;

        // If switched from regular → trade
        if ($customer->customer_type === 'trade' && !$customer->trade_status) {
            $customer->trade_status = 'pending';
        }

        $customer->save();

        return $customer;
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Customer
    |--------------------------------------------------------------------------
    */

    public function delete($id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return false;
        }

        $customer->delete();

        return $customer;
    }

    /*
    |--------------------------------------------------------------------------
    | Trade Filters
    |--------------------------------------------------------------------------
    */

    public function getByType($type)
    {
        return Customer::where('customer_type', $type)
            ->with('user')
            ->latest()
            ->get();
    }

    public function getPendingTrade()
    {
        return Customer::where('customer_type', 'trade')
            ->where('trade_status', 'pending')
            ->with('user')
            ->latest()
            ->get();
    }

    /*
    |--------------------------------------------------------------------------
    | Trade Approval Logic
    |--------------------------------------------------------------------------
    */

    public function approveTrade($id, $adminId)
    {
        $customer = Customer::find($id);

        if (!$customer || $customer->customer_type !== 'trade') {
            return false;
        }

        $customer->trade_status = 'approved';
        $customer->trade_approved_at = now();
        $customer->trade_approved_by_admin_id = $adminId;

        $customer->trade_rejected_at = null;
        $customer->trade_rejected_by_admin_id = null;
        $customer->trade_rejection_reason = null;

        $customer->save();

        return true;
    }

    public function rejectTrade($id, $adminId, $reason)
    {
        $customer = Customer::find($id);

        if (!$customer || $customer->customer_type !== 'trade') {
            return false;
        }

        $customer->trade_status = 'rejected';
        $customer->trade_rejected_at = now();
        $customer->trade_rejected_by_admin_id = $adminId;
        $customer->trade_rejection_reason = $reason;

        $customer->save();

        return true;
    }

    /*
    |--------------------------------------------------------------------------
    | Get by User
    |--------------------------------------------------------------------------
    */

    public function getByUser($userId)
    {
        return Customer::where('user_id', $userId)->first();
    }

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    public function search($keyword, $paginate = null)
    {
        $query = Customer::with('user')
            ->whereHas('user', function ($q) use ($keyword) {
                $q->where('first_name', 'like', "%$keyword%")
                    ->orWhere('last_name', 'like', "%$keyword%")
                    ->orWhere('email', 'like', "%$keyword%");
            })
            ->orWhere('company_name', 'like', "%$keyword%");

        if ($paginate) {
            return $query->paginate($paginate);
        }

        return $query->get();
    }
}
