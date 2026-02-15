<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
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

    // create new product 
    public function createProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_name' => 'required|max:250',
            'price' => 'required|numeric',
            'store_id' => 'required|integer|exists:stores,id',
            // Add additional product fields and validation as needed
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        // validate existed
        $product = Product::where('product_name', $request->product_name)
            ->where('store_id', $request->store_id)
            ->first();
        if ($product) {
            return response()->json([
                'success' => false,
                'message' => 'This product already exists for this store',
            ], 409);
        }

        // Create a new Product entry with details from the request
        $newProduct = Product::create([
            'product_name' => $request->product_name,
            'price' => $request->price,
            'store_id' => $request->store_id,
            'description' => $request->description ?? null,
            'quantity' => $request->quantity ?? null,
            // Add additional fields as required by your Product model
        ]);

        return response()->json([
            'success' => true,
            'message' => 'New Product created successfully',
            'data' => $newProduct,
        ], 201);
    }

    // fetch products
    public function fetchProducts(Request $request)
    {
        // Optional: Add filters by product_name/store_id/etc through query params
        $query = Product::query();

        if ($request->has('product_name')) {
            $query->where('product_name', 'like', '%' . $request->product_name . '%');
        }
        if ($request->has('store_id')) {
            $query->where('store_id', $request->store_id);
        }
        // Add more filters if needed

        // Simple pagination, default 10 per page
        $perPage = $request->get('per_page', 10);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Products fetched successfully',
            'data' => $products,
        ], 200);
    }

    // update product
    public function updateProduct(Request $request, $id)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'product_name' => 'sometimes|required|max:250',
            'price' => 'sometimes|required|numeric',
            'description' => 'nullable|string',
            'quantity' => 'nullable|integer',
            'store_id' => 'sometimes|integer|exists:stores,id',
            // Add additional validation rules as required
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        // Find product
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        // Update product fields if provided in request
        $input = $request->only([
            'product_name',
            'price',
            'description',
            'quantity',
            'store_id',
            // Add additional fields as required
        ]);

        $product->fill($input);
        $product->save();

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product,
        ], 200);
    }
    
    // delete product
    public function deleteProduct($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ], 200);
    }
}
