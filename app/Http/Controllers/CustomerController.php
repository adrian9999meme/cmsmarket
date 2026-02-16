<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
            'name' => 'required|max:250',
            'email' => 'required|email|max:255|unique:customers,email',
            'phone' => 'nullable|max:50',
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
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone ?? null,
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
    public function fetchCustomers(Request $request, $keyword)
    {
        // Fetch all records where any of email, name, or address contains the keyword (case insensitive)
        $query = Customer::query();

        if (!empty($keyword) && $keyword !== 'undefined') {
            $query->where(function ($q) use ($keyword) {
                $q->orWhere('name', 'like', '%' . $keyword . '%')
                  ->orWhere('email', 'like', '%' . $keyword . '%')
                  ->orWhere('address', 'like', '%' . $keyword . '%');
            });
        }

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
            'name' => 'sometimes|required|max:250',
            'email' => 'sometimes|required|email|max:255|unique:customers,email,' . $id,
            'phone' => 'nullable|max:50',
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
            'name',
            'email',
            'phone',
            'address',
            'status',
            // Add additional fields as required
        ]);

        $customer->fill($input);
        $customer->save();

        // Fetch the fresh/updated value from DB
        $updatedCustomer = Customer::find($customer->id);

        return response()->json([
            'success' => true,
            'message' => 'Customer updated successfully',
            'data' => $updatedCustomer,
        ], 200);
    }
    
    // delete customer
    public function deleteCustomer($id)
    {
        try {
            $customer = Customer::find($id);

            if (!$customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer not found',
                ], 404);
            }

            // Store customer data before delete, in case Eloquent sets object as trashed
            $customerData = $customer->toArray();

            $customer->delete();

            return response()->json([
                'success' => true,
                'message' => 'Customer deleted successfully',
                'data' => $customerData,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the customer.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
