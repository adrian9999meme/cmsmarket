<?php

namespace App\Repositories\Admin;

use App\Models\TradeDiscountRequest;
use App\Repositories\Interfaces\Admin\TradeDiscountRequestInterface;
use Illuminate\Support\Facades\Auth;

class TradeDiscountRequestRepository implements TradeDiscountRequestInterface
{

    public function query()
    {
        return TradeDiscountRequest::with(['customer.user', 'store']);
    }

    public function all()
    {
        return $this->query()->latest();
    }

    public function paginate($limit)
    {
        return $this->all()->paginate($limit);
    }

    public function get($id)
    {
        return $this->query()->find($id);
    }

    public function store($request)
    {
        $proofFiles = [];

        if ($request->hasFile('proof_files')) {

            foreach ($request->file('proof_files') as $file) {
                $proofFiles[] = $file->store('trade_discount_proofs', 'public');
            }
        }

        $discount = TradeDiscountRequest::create([
            'customer_id' => $request->customer_id,
            'store_id' => $request->store_id,
            'merchant_name' => $request->merchant_name,
            'merchant_customer_number' => $request->merchant_customer_number,
            'requested_discount_percent' => $request->requested_discount_percent,
            'proof_files' => $proofFiles,
            'status' => 'pending'
        ]);

        return $discount;
    }

    public function update($request, $id)
    {
        $discount = TradeDiscountRequest::findOrFail($id);

        $discount->store_id = $request->store_id;
        $discount->merchant_name = $request->merchant_name;
        $discount->merchant_customer_number = $request->merchant_customer_number;
        $discount->requested_discount_percent = $request->requested_discount_percent;

        $discount->save();

        return $discount;
    }

    public function delete($id)
    {
        $discount = TradeDiscountRequest::findOrFail($id);

        return $discount->delete();
    }

    public function approve($id, $adminId)
    {
        $discount = TradeDiscountRequest::findOrFail($id);

        $discount->status = 'approved';
        $discount->approved_at = now();
        $discount->approved_by_admin_id = $adminId;

        $discount->save();

        return $discount;
    }

    public function reject($id, $adminId, $reason)
    {
        $discount = TradeDiscountRequest::findOrFail($id);

        $discount->status = 'rejected';
        $discount->rejected_at = now();
        $discount->rejected_by_admin_id = $adminId;
        $discount->rejection_reason = $reason;

        $discount->save();

        return $discount;
    }

    public function filter($request)
    {
        $query = $this->query();

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->customer_id) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->store_id) {
            $query->where('store_id', $request->store_id);
        }

        if ($request->keyword) {

            $keyword = $request->keyword;

            $query->where(function ($q) use ($keyword) {

                $q->where('merchant_name', 'like', "%{$keyword}%")
                    ->orWhere('merchant_customer_number', 'like', "%{$keyword}%")
                    ->orWhereHas('customer.user', function ($sub) use ($keyword) {

                        $sub->where('first_name', 'like', "%{$keyword}%")
                            ->orWhere('last_name', 'like', "%{$keyword}%")
                            ->orWhere('email', 'like', "%{$keyword}%");
                    });
            });
        }

        return $query->latest()->paginate(10);
    }
}
