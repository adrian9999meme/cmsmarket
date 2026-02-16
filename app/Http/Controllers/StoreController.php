<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class StoreController extends Controller
{
    public function sendError($error, $errorMessages = [], $code = 404)
    {
        $response = [
            'success' => false,
            'message' => $error,
        ];

        if (!empty($errorMessages)) {
            $response['data'] = $errorMessages;
        }
        return response()->json($response, $code);
    }

    public function sendResponse($result, $message)
    {
        $response = [
            'success' => true,
            'data' => $result,
            'message' => $message,
        ];
        return response()->json($response, 200);
    }

    // create new store 
    public function createStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'seller_id' => 'required|string|max:255',
            'user_id' => 'required|string|max:255',
            'store_name' => 'required|string|max:250',
            'slug' => 'required|string|max:255',
            'store_phone' => 'required|string|max:255',
            'store_email' => 'required|email|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postcode' => 'required|string|max:255',
            'status' => 'nullable|in:open,closed',
            'opening_hours' => 'required|array',
            'logo' => 'nullable|string|max:255',
            'todaysOrders' => 'nullable|integer|min:0',
            'totalOrders' => 'nullable|integer|min:0',
            'totalCustomersOrders' => 'nullable|integer|min:0',
            'productsCount' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        // validate existed
        $store = Store::where('store_name', $request->store_name)->first();
        if ($store) {
            return response()->json([
                'success' => false,
                'message' => 'This store already exists',
            ], 409);
        }
        // Create a new Store entry with details from the request
        $newStore = Store::create([
            'seller_id' => $request->seller_id,
            'user_id' => $request->user_id,
            'store_name' => $request->store_name,
            'slug' => $request->slug,
            'store_phone' => $request->store_phone,
            'store_email' => $request->store_email,
            'address' => $request->address,
            'city' => $request->city,
            'postcode' => $request->postcode,
            'status' => $request->status,
            'opening_hours' => $request->opening_hours,
            'logo' => $request->logo,
            // Add additional fields as required by your Store model
        ]);

        return response()->json([
            'success' => true,
            'message' => 'New Store created successfully',
            'data' => $newStore,
        ], 201);
    }

    // fetch stores
    public function fetchStores(Request $request)
    {
        // Optional: Add filters by store_name/city/etc through query params
        $query = Store::query();

        if ($request->has('store_name')) {
            $query->where('store_name', 'like', '%' . $request->store_name . '%');
        }
        if ($request->has('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }
        // Add more filters if needed

        // Simple pagination, default 10 per page
        $perPage = $request->get('per_page', 10);
        $stores = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Stores fetched successfully',
            'data' => $stores,
        ], 200);
    }

    // update store
    public function updateStore(Request $request, $id)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'seller_id' => 'required|string|max:255',
            'user_id' => 'required|string|max:255',
            'store_name' => 'required|string|max:250',
            'slug' => 'required|string|max:255',
            'store_phone' => 'required|string|max:255',
            'store_email' => 'required|email|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postcode' => 'required|string|max:255',
            'status' => 'nullable|in:open,closed',
            'opening_hours' => 'required|array',
            'logo' => 'nullable|string|max:255',
            // Add additional validation rules as required
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        // Find store
        $store = Store::find($id);
        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Store not found',
            ], 404);
        }

        // Update store fields if provided in request
        $input = $request->only([
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
            'logo',
            // Add additional fields as required
        ]);

        $store->fill($input);
        $store->save();

        return response()->json([
            'success' => true,
            'message' => 'Store updated successfully',
            'data' => $store,
        ], 200);
    }

    // delete store
    public function deleteStore($id)
    {
        try {
            $store = Store::find($id);

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Store not found',
                ], 404);
            }

            // Store store data before delete, in case Eloquent sets object as trashed
            $storeData = $store->toArray();

            $store->delete();

            return response()->json([
                'success' => true,
                'message' => 'Store deleted successfully',
                'data' => $storeData,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the store.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
