<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\Interfaces\Admin\CustomerInterface;
use App\Repositories\Interfaces\UserInterface;
use Brian2694\Toastr\Facades\Toastr;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    protected $customers;
    protected $user;

    public function __construct(CustomerInterface $customers, UserInterface $user)
    {
        $this->customers = $customers;
        $this->user = $user;
    }

    public function index(Request $request)
    {
        try {

            $type = strtolower(trim($request->get('customer_type')));
            $subdomain = strtolower(trim($request->get('subdomain')));
            $keyword = trim($request->get('searchKeyword'));

            $query = $this->customers->query();

            // get data by customer_type like trade, customer
            if ($type === "trade") {
                $query->where('customer_type', 'trade');
            } else if ($type === "regular") {
                $query->where('customer_type', 'regular');

                // get data by approvals
                if ($subdomain === "pending") {
                    $query->where('trade_status', 'pending');
                } else if ($subdomain === "blocked") {
                    $query->whereHas('user', function ($q) {
                        $q->where('is_user_banned', 1);
                    });
                } else if ($subdomain === "active") {
                    $query->whereHas('user', function ($q) {
                        $q->where('status', 1)
                            ->where('is_user_banned', 0);
                    });
                }
            }

            // search with keyword
            if (!empty($keyword)) {

                $query->where(function ($q) use ($keyword) {

                    $q->where('company_name', 'like', "%{$keyword}%")
                        ->orWhere('vat_number', 'like', "%{$keyword}%")
                        ->orWhereHas('user', function ($sub) use ($keyword) {

                            $sub->where('first_name', 'like', "%{$keyword}%")
                                ->orWhere('last_name', 'like', "%{$keyword}%")
                                ->orWhere('email', 'like', "%{$keyword}%");
                        });
                });
            }

            $customers = $query->latest()->get();

            return response()->json([
                'success' => true,
                'message' => 'Customers retrieved successfully',
                'data' => $customers
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Create Customer
    |--------------------------------------------------------------------------
    */

    public function create(Request $request)
    {
        DB::beginTransaction();

        try {
            // validate prompts
            $validator = Validator::make($request->all(), [
                // user
                'first_name' => 'required|max:255',
                'last_name' => 'required|max:255',
                'email' => 'required|max:255|unique:users,email',
                'phone' => 'nullable|max:20',
                'password' => 'required|min:5|max:30|confirmed',
                // customer
                'company_name' => 'required|max:255',
                'vat_number' => 'required|max:255',
                'registration_number' => 'required|max:255',
            ]);
            if ($validator->fails()) {
                if ($validator->messages()->get('email')) {
                    return response()->json([
                        'success' => false,
                        'message' => $validator->messages()->get('email')[0],
                        'errors'  => $validator->errors()
                    ], 422);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => __('Required field missing'),
                        'errors'  => $validator->errors()
                    ], 422);
                }
            }

            // Create User first via repository
            $user = $this->user->store($request);

            if (!$user) {
                throw new \Exception('User could not be created');
            }

            // Merge user_id into request for customer creation
            $request->merge([
                'user_id' => $user->id
            ]);

            // Create Customer profile
            $customer = $this->customers->store($request);

            if (!$customer) {
                throw new \Exception('Customer profile could not be created');
            }

            DB::commit();

            // Load relationship
            $newCustomer = $this->customers->get($customer->id);

            return response()->json([
                'success' => true,
                'message' => 'Customer created successfully',
                'data'    => $newCustomer
            ], 201);
        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Update Customer
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $customer = $this->customers->update($request);
            if (!$customer) {
                throw new \Exception('Customer not found');
            }

            $user = $this->user->get($customer->user_id);
            if (!$user) {
                throw new \Exception('User not found');
            }
            $user->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
            ]);
            $user->save();

            DB::commit();

            $updatedCustomer = $this->customers->get($id);

            return response()->json([
                'success' => true,
                'message' => 'Customer updated successfully',
                'data' => $updatedCustomer
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Active Customer
    |--------------------------------------------------------------------------
    */

    public function setActive(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $customer = $this->customers->get($id);
            $user = $this->user->get($customer->user_id);
            if (!$user) {
                throw new \Exception('User not found');
            }

            $user->update([
                'status' => $request->status
            ]);
            $user->save();

            DB::commit();

            $updatedCustomer = $this->customers->get($id);

            return response()->json([
                'success' => true,
                'message' => 'Customer updated successfully',
                'data' => $updatedCustomer
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => $e->getTrace()
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Customer
    |--------------------------------------------------------------------------
    */

    public function delete($id)
    {
        DB::beginTransaction();

        try {
            $customer = $this->customers->delete($id);
            $this->user->delete($customer->user_id);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Customer deleted successfully',
                'data' => $customer
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => $e
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Approve Trade Customer
    |--------------------------------------------------------------------------
    */

    public function approveTrade($id)
    {
        DB::beginTransaction();

        try {
            $this->customers->approveTrade($id, auth()->id());

            DB::commit();

            $trade = $this->customers->get($id);

            return response()->json([
                'success' => true,
                'message' => 'Trade customer approved successfully',
                'data' => $trade
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => $e->getTrace()
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Reject Trade Customer
    |--------------------------------------------------------------------------
    */

    public function rejectTrade(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $this->customers->rejectTrade(
                $id,
                auth()->id(),
                $request->reason
            );

            DB::commit();

            $trade = $this->customers->get($id);

            return response()->json([
                'success' => true,
                'message' => 'Trade customer rejected successfully',
                'data' => $trade
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => $e->getTrace()
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Get Single Customer
    |--------------------------------------------------------------------------
    */

    public function show($id)
    {
        $customer = $this->customers->get($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $customer
        ]);
    }
}
