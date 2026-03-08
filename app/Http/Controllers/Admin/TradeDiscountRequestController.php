<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Repositories\Interfaces\Admin\TradeDiscountRequestInterface;
use App\Http\Requests\TradeDiscountRequestStoreRequest;

class TradeDiscountRequestController extends Controller
{
    protected $tradeDiscountRequests;

    public function __construct(TradeDiscountRequestInterface $tradeDiscountRequests)
    {
        $this->tradeDiscountRequests = $tradeDiscountRequests;
    }

    /**
     * List requests with filters
     */
    public function index(Request $request)
    {
        try {

            $data = $this->tradeDiscountRequests->filter($request);

            return response()->json([
                'success' => true,
                'message' => 'Trade discount requests retrieved successfully',
                'data' => $data
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show single request
     */
    public function show($id)
    {
        try {

            $requestData = $this->tradeDiscountRequests->get($id);

            if (!$requestData) {
                return response()->json([
                    'success' => false,
                    'message' => 'Request not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $requestData
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new discount request
     */
    public function store(TradeDiscountRequestStoreRequest $request)
    {
        DB::beginTransaction();

        try {

            $discount = $this->tradeDiscountRequests->store($request);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Trade discount request created successfully',
                'data' => $discount
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update request
     */
    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {

            $discount = $this->tradeDiscountRequests->update($request, $id);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Trade discount request updated successfully',
                'data' => $discount
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve request
     */
    public function approve($id)
    {
        DB::beginTransaction();

        try {

            $discount = $this->tradeDiscountRequests->approve($id, auth()->id());

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Trade discount request approved',
                'data' => $discount
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject request
     */
    public function reject(Request $request, $id)
    {
        DB::beginTransaction();

        try {

            $reason = $request->input('reason');

            $discount = $this->tradeDiscountRequests->reject(
                $id,
                auth()->id(),
                $reason
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Trade discount request rejected',
                'data' => $discount
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete request
     */
    public function destroy($id)
    {
        DB::beginTransaction();

        try {

            $this->tradeDiscountRequests->delete($id);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Trade discount request deleted'
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
