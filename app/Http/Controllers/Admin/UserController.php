<?php

namespace App\Http\Controllers\Admin;

use App\Models\Cart;
use App\Traits\ApiReturnFormatTrait;
use App\Traits\ImageTrait;
use App\Traits\SendMailTrait;
use App\Traits\SmsSenderTrait;
use App\Traits\HomePage;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserStoreRequest;
use App\Http\Requests\User\UserUpdateRequest;
use App\Imports\CustomerImport;
use App\Repositories\Interfaces\Admin\Addon\OfflineMethodInterface;
use App\Repositories\Interfaces\Admin\CurrencyInterface;
use Cartalyst\Sentinel\Laravel\Facades\Activation;
use Illuminate\Http\Request;
use App\Repositories\Interfaces\UserInterface;
use Brian2694\Toastr\Facades\Toastr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

    use HomePage, ApiReturnFormatTrait, SmsSenderTrait, ImageTrait, SendMailTrait;
    protected $users;

    public function __construct(UserInterface $users)
    {
        $this->users = $users;
    }

    public function index(Request $request)
    {
        try {
            // Get status and keyword from the request (with defaults if not present)
            $status = $request->get('status', null);
            $searchKeyword = $request->get('keyword', '');

            // Call repository with additional filters for status and keyword
            $customers = $this->users->paginate($request, get_pagination('pagination'));

            // If GET_SELLERS_API expects filtering by status and keyword, apply them in the repository
            // if (!is_null($status) && $status !== '') {
            //     if ($status === 'pending') {
            //         $users = $users->where('is_user_banned', 0);
            //     } elseif ($status === 'blocked') {
            //         $users = $users->where('is_user_banned', 1);
            //     }
            //     // If status is passed but not "pending" or "blocked", do not apply any additional filter
            // }
            if (!empty($searchKeyword)) {
                $customers = $customers->where(function ($query) use ($searchKeyword) {
                    $query->where('user_type', 'customer')
                        ->orWhere('email', 'like', "%{$searchKeyword}%");
                });
            }

            // If $users is an Eloquent\Builder or Query, paginate after filtering
            if ($customers instanceof \Illuminate\Database\Eloquent\Builder || $customers instanceof \Illuminate\Database\Query\Builder) {
                $customers = $customers->paginate(get_pagination('pagination'));
            }

            return response()->json([
                'success' => true,
                'message' => 'Retrieved sellers successfully',
                'data' => $customers
            ]);
        } catch (\Exception $e) {
            Toastr::error($e->getMessage());
            return back();
        }
    }

    public function create(Request $request)
    {
        try {
            // create user
            $validator = Validator::make($request->all(), [
                // user
                'first_name' => 'required|max:255',
                'last_name' => 'required|max:255',
                'email' => 'required|max:255|unique:users,email',
                'phone' => 'nullable|max:20',
                'password' => 'required|min:5|max:30|confirmed',
            ]);
            if ($validator->fails()) {
                if ($validator->messages()->get('email')) {
                    return $this->responseWithError($validator->messages()->get('email')[0], $validator->errors(), 422);
                } else {
                    return $this->responseWithError(__('Required field missing'), $validator->errors(), 422);
                }
            }
            $request['user_type'] = 'customer';
            $request['permissions'] = [];

            // 1. Create Customer
            if (settingHelper('disable_email_confirmation') == 1) {
                $user = \Sentinel::registerAndActivate($request->all());
                $msg = __('Registration Successfully');
                if ($request->has('trx_id')) {
                    \Cart::where('user_id', getWalkInCustomer()->id)
                        ->where('trx_id', $request->trx_id)
                        ->update(['user_id' => $user->id]);
                }
            } else {
                $user = \Sentinel::register($request->all());
                $activation = Activation::create($user);
                $this->sendmail(
                    $request->email,
                    'Registration',
                    $user,
                    'email.auth.activate-account-email',
                    url('/') . '/activation/' . $request->email . '/' . $activation->code
                );
                $msg = __('Check your mail to verify your account');
            }

            // Return created customer data
            $customers = $this->users->paginate($request, get_pagination('pagination'));
            $newData = $customers->where('id', $user->id)->first();

            return $this->responseWithSuccess('Customer is created successfully', $newData, 201);
        } catch (\Exception $e) {
            Toastr::error($e->getMessage());
            return back();
        }
    }

    public function store(UserStoreRequest $request)
    {
        $validated = $request->validate([
            'phone' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
        ]);
        if ($this->users->store($request)):
            return redirect()->route('customers');
        else:
            return back();
        endif;
    }

    public function edit(Request $request, $id)
    {
        if ($user = $this->users->get($id)):
            if ($user->user_type == 'customer'):
                $r = $request->r != '' ? $request->r : $request->server('HTTP_REFERER');
                return view('admin.customers.form', compact('user', 'r'));
            else:
                Toastr::error(__('Not found'));
                return back();
            endif;
        else:
            Toastr::error(__('Not found'));
            return back();
        endif;
    }

    public function update(Request $request, $id)
    {
        if (isDemoServer()):
            Toastr::info(__('This function is disabled in demo server.'));
            return redirect()->back();
        endif;
        $request->validate([
            'phone' => 'required|unique:users,phone,' . $id,
            'email' => 'required|email|unique:users,email,' . $id,
        ]);

        DB::beginTransaction();
        try {
            $updatedCustomer = $this->users->update($request);
            DB::commit();
            $customers = $this->users->paginate($request, get_pagination('pagination'));
            $newData = $customers->where('id', $id)->first();
            return response()->json([
                'success' => true,
                'message' => __('Customer Updated Successfully'),
                'data' => $newData
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function setActive(Request $request, $id)
    {
        if (isDemoServer()):
            Toastr::info(__('This function is disabled in demo server.'));
            return redirect()->back();
        endif;

        DB::beginTransaction();
        try {
            $customer = $this->users->get($id);

            if (!$customer) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => __('Customer not found')
                ], 404);
            }

            // update status with request.status
            $customer->status = $request->status;
            $customer->save();

            DB::commit();
            $customers = $this->users->paginate($request, get_pagination('pagination'));
            $newData = $customers->where('id', $id)->first();
            return response()->json([
                'success' => true,
                'message' => __('Customer Set Active Successfully'),
                'data' => $newData
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function delete(Request $request, $id)
    {
        if (isDemoServer()):
            return response()->json([
                'success' => false,
                'message' => __('This function is disabled in demo server.')
            ], 403);
        endif;

        // Get the customer
        $customerId = $id ?? $request->get('id');
        if (!$customerId) {
            return response()->json([
                'success' => false,
                'message' => __('Customer ID is required')
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Fetch the customer
            $customer = $this->users->get($customerId);

            if (!$customer || $customer->user_type !== 'customer') {
                throw new \Exception(__('Customer not found or could not be deleted'));
            }

            $deleteResult = $customer->delete();

            if (!$deleteResult) {
                throw new \Exception(__('Customer could not be deleted'));
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => __('Customer deleted successfully'),
                'data' => $customer
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function ban($id)
    {
        DB::beginTransaction();
        try {
            $this->users->ban($id);
            Toastr::success(__('Updated Successfully'));
            DB::commit();
            return redirect()->back();
        } catch (\Exception $e) {
            DB::rollBack();
            Toastr::error($e->getMessage());
            return back();
        }
    }
    public function getUserByAjax(Request $request)
    {
        $term = trim($request->q);
        if (empty($term)) {
            return \Response::json([]);
        }

        $users = $this->users->all()
            ->where('first_name', 'like', '%' . $term . '%')
            ->orWhere('last_name', 'like', '%' . $term . '%')
            ->orWhere('phone', 'like', '%' . $term . '%')
            ->limit(20)
            ->get();

        $formatted_user = [];

        foreach ($users as $user) {
            $formatted_user[] = ['id' => $user->id, 'text' => $user->first_name . ' ' . $user->last_name . ' - ' . $user->phone];
        }

        return \Response::json($formatted_user);
    }
    public function getAllTypeByAjax(Request $request)
    {
        $term = trim($request->q);
        if (empty($term)) {
            return \Response::json([]);
        }

        $users = $this->users->allTypeUser()
            ->where('first_name', 'like', '%' . $term . '%')
            ->orWhere('last_name', 'like', '%' . $term . '%')
            ->orWhere('phone', 'like', '%' . $term . '%')
            ->limit(20)
            ->get();

        $formatted_user = [];

        foreach ($users as $user) {
            $formatted_user[] = ['id' => $user->id, 'text' => $user->first_name . ' ' . $user->last_name . ' - ' . $user->phone];
        }

        return \Response::json($formatted_user);
    }
    public function emailVerify($user_id)
    {
        if (isDemoServer()):
            Toastr::info(__('This function is disabled in demo server.'));
            return redirect()->back();
        endif;
        if ($this->users->emailVerify($user_id)):
            return redirect()->back();
        else:
            return back()->withInput();
        endif;
    }

    public function customerImport(Request $request)
    {
        return view('admin.customers.import-customer');
    }

    public function importCustomer(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required',
        ]);
        $extension = request()->file('file')->getClientOriginalExtension();

        if ($extension != 'xlsx' && $extension != 'xls' && $extension != 'csv'):
            return back()->with('danger', __('file_type_not_supported'));
        endif;

        $file = request()->file('file')->store('import');
        $import = new CustomerImport();
        $import->import($file);

        unlink(storage_path('app/' . $file));
        Toastr::success(__('successfully_imported'));
        return back();
    }
}
