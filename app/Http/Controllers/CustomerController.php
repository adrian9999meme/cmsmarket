<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CustomerController extends Controller
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

    // create new customer
    public function createCustomer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|max:250',
            'email' => 'required|email|max:255|unique:customers,email',
            'phone_no' => 'nullable|max:50',
            'address' => 'nullable|max:255',
            // Add other customer fields and validation rules as needed
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        // validate existed (by email)
        $customer = Customer::where('email', $request->email)->first();
        if ($customer) {
            return response()->json([
                'success' => false,
                'message' => 'This customer already exists',
            ], 409);
        }

        // Create a new Customer entry with details from the request
        $newCustomer = Customer::create([
            'customer_name' => $request->customer_name,
            'email' => $request->email,
            'phone_no' => $request->phone_no ?? null,
            'address' => $request->address ?? null,
            // Add additional fields as required by your Customer model
        ]);

        return response()->json([
            'success' => true,
            'message' => 'New Customer created successfully',
            'data' => $newCustomer,
        ], 201);
    }

    // fetch customers
    public function fetchCustomers(Request $request)
    {
        // Optional: Add filters by customer_name/email/etc through query params
        $query = Customer::query();

        if ($request->has('customer_name')) {
            $query->where('customer_name', 'like', '%' . $request->customer_name . '%');
        }
        if ($request->has('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }
        // Add more filters if needed

        // Simple pagination, default 10 per page
        $perPage = $request->get('per_page', 10);
        $customers = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Customers fetched successfully',
            'data' => $customers,
        ], 200);
    }

    // update customer
    public function updateCustomer(Request $request, $id)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'customer_name' => 'sometimes|required|max:250',
            'email' => 'sometimes|required|email|max:255|unique:customers,email,' . $id,
            'phone_no' => 'nullable|max:50',
            'address' => 'nullable|max:255',
            // Add additional validation rules as required
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        // Find customer
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found',
            ], 404);
        }

        // Update customer fields if provided in request
        $input = $request->only([
            'customer_name',
            'email',
            'phone_no',
            'address',
            // Add additional fields as required
        ]);

        $customer->fill($input);
        $customer->save();

        return response()->json([
            'success' => true,
            'message' => 'Customer updated successfully',
            'data' => $customer,
        ], 200);
    }
    
    // delete customer
    public function deleteCustomer($id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found',
            ], 404);
        }

        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer deleted successfully',
        ], 200);
    }
}
