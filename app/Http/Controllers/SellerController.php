<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class SellerController extends Controller
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

    // create new seller 
    public function createSeller(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // 'email' => 'required|email|max:250',
            'shop_name' => 'required|max:250',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        // validate existed
        $seller = Seller::where('email', $request->email)->first();
        if (empty($seller)) {
            return response()->json([
                'success'=> false,
                'message'=> 'This seller is already existed',
            ], 409);
        }
        // Create a new Seller entry with details from the request
        $newSeller = Seller::create([
            'shop_name' => $request->shop_name,
            'phone_no' => $request->phone_no ?? null,
            'address' => $request->address ?? null,
            'city' => $request->city ?? null,
            'company_name' => $request->company_name ?? null,
            'company_email' => $request->company_email ?? null,
            'company_website' => $request->company_website ?? null,
            'company_type' => $request->company_type ?? null,
            // Add additional fields as required by your Seller model
        ]);

        return response()->json([
            'success' => true,
            'message' => 'New Seller created successfully',
            'data' => $newSeller,
        ], 201);
    }

    // fetch sellers
    public function fetchSellers(Request $request)
    {
        // Optional: Add filters by shop_name/city/etc through query params
        $query = Seller::query();

        if ($request->has('shop_name')) {
            $query->where('shop_name', 'like', '%' . $request->shop_name . '%');
        }
        if ($request->has('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }
        // Add more filters if needed

        // Simple pagination, default 10 per page
        $perPage = $request->get('per_page', 10);
        $sellers = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Sellers fetched successfully',
            'data' => $sellers,
        ], 200);
    }

    // update seller
    public function updateSeller(Request $request, $id)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'shop_name' => 'sometimes|required|max:250',
            'phone_no' => 'nullable|max:50',
            'address' => 'nullable|max:255',
            'city' => 'nullable|max:100',
            'company_name' => 'nullable|max:255',
            'company_email' => 'nullable|email|max:255',
            'company_website' => 'nullable|max:255',
            'company_type' => 'nullable|max:100',
            // Add additional validation rules as required
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        // Find seller
        $seller = Seller::find($id);
        if (!$seller) {
            return response()->json([
                'success' => false,
                'message' => 'Seller not found',
            ], 404);
        }

        // Update seller fields if provided in request
        $input = $request->only([
            'shop_name',
            'phone_no',
            'address',
            'city',
            'company_name',
            'company_email',
            'company_website',
            'company_type',
            // Add additional fields as required
        ]);

        $seller->fill($input);
        $seller->save();

        return response()->json([
            'success' => true,
            'message' => 'Seller updated successfully',
            'data' => $seller,
        ], 200);
    }
    
    // delete seller
    public function deleteSeller($id)
    {
        $seller = Seller::find($id);

        if (!$seller) {
            return response()->json([
                'success' => false,
                'message' => 'Seller not found',
            ], 404);
        }

        $seller->delete();

        return response()->json([
            'success' => true,
            'message' => 'Seller deleted successfully',
        ], 200);
    }
}
