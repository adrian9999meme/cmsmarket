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
            'store_name' => 'required|max:250',
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
            'store_name' => $request->store_name,
            'phone_no' => $request->phone_no ?? null,
            'address' => $request->address ?? null,
            'city' => $request->city ?? null,
            'manager_name' => $request->manager_name ?? null,
            'manager_email' => $request->manager_email ?? null,
            'website' => $request->website ?? null,
            'store_type' => $request->store_type ?? null,
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
            'store_name' => 'sometimes|required|max:250',
            'phone_no' => 'nullable|max:50',
            'address' => 'nullable|max:255',
            'city' => 'nullable|max:100',
            'manager_name' => 'nullable|max:255',
            'manager_email' => 'nullable|email|max:255',
            'website' => 'nullable|max:255',
            'store_type' => 'nullable|max:100',
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
            'store_name',
            'phone_no',
            'address',
            'city',
            'manager_name',
            'manager_email',
            'website',
            'store_type',
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
        $store = Store::find($id);

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Store not found',
            ], 404);
        }

        $store->delete();

        return response()->json([
            'success' => true,
            'message' => 'Store deleted successfully',
        ], 200);
    }
}
