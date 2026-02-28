<?php

namespace App\Http\Controllers\Admin;

use App\Models\Cart;
use App\Models\User;
use App\Models\SellerProfile;
use App\Traits\ApiReturnFormatTrait;
use App\Traits\ImageTrait;
use App\Traits\SendMailTrait;
use App\Traits\SmsSenderTrait;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserStoreRequest;
use App\Http\Requests\User\UserUpdateRequest;
use App\Http\Resources\SiteResource\CouponPaginateResource;
use App\Http\Resources\SiteResource\ProductPaginateResource;
use App\Http\Resources\SiteResource\ProductResource;
use App\Imports\SellerImport;
use App\Repositories\Interfaces\Admin\Marketing\CouponInterface;
use App\Repositories\Interfaces\Admin\MediaInterface;
use App\Repositories\Interfaces\Admin\Product\ProductInterface;
use App\Repositories\Interfaces\Admin\SellerInterface;
use App\Repositories\Interfaces\Admin\SellerProfileInterface;
use App\Traits\HomePage;
use Brian2694\Toastr\Facades\Toastr;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Sentinel;
use Cartalyst\Sentinel\Laravel\Facades\Activation;

class SellerController extends Controller
{
    use HomePage, ApiReturnFormatTrait, SmsSenderTrait, ImageTrait, SendMailTrait;


    protected $sellers;

    public function __construct(SellerInterface $sellers)
    {
        if (settingHelper('seller_system') != 1) {
            abort(403);
        }
        $this->sellers = $sellers;
    }

    public function index(Request $request)
    {
        try {
            // Get status and keyword from the request (with defaults if not present)
            $status = $request->get('status', null);
            $searchKeyword = $request->get('keyword', '');

            // Call repository with additional filters for status and keyword
            $users = $this->sellers->paginate($request, get_pagination('pagination'));

            // If GET_SELLERS_API expects filtering by status and keyword, apply them in the repository
            if (!is_null($status) && $status !== '') {
                if ($status === 'pending') {
                    $users = $users->where('is_user_banned', 0);
                } elseif ($status === 'blocked') {
                    $users = $users->where('is_user_banned', 1);
                }
                // If status is passed but not "pending" or "blocked", do not apply any additional filter
            }
            if (!empty($searchKeyword)) {
                $users = $users->where(function ($query) use ($searchKeyword) {
                    $query->where('shop_name', 'like', "%{$searchKeyword}%")
                        ->orWhere('company_name', 'like', "%{$searchKeyword}%")
                        ->orWhere('company_email', 'like', "%{$searchKeyword}%");
                });
            }

            // If $users is an Eloquent\Builder or Query, paginate after filtering
            if ($users instanceof \Illuminate\Database\Eloquent\Builder || $users instanceof \Illuminate\Database\Query\Builder) {
                $users = $users->paginate(get_pagination('pagination'));
            }

            return response()->json([
                'success' => true,
                'message' => 'Retrieved sellers successfully',
                'data' => $users
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
                // seller
                'company_name' => 'required|max:255',
                'address' => 'required|max:255',
                'postcode' => 'required|max:20',
                'city' => 'required|max:255',
                'phone_no' => 'required|max:20',
                'company_email' => 'required|email|max:255|unique:sellers',
                'license_no' => 'nullable|max:255',
                'company_website' => 'nullable|url|max:255',
                'company_type' => 'nullable|max:255',
                'number_employees' => 'nullable|integer|min:1',
                'status' => 'nullable|integer|in:0,1',
            ]);
            if ($validator->fails()) {
                if ($validator->messages()->get('email')) {
                    return $this->responseWithError($validator->messages()->get('email')[0], $validator->errors(), 422);
                } else {
                    return $this->responseWithError(__('Required field missing'), $validator->errors(), 422);
                }
            }
            $request['user_type'] = 'seller';
            $request['permissions'] = [];

            // 1. Create User
            if (settingHelper('disable_email_confirmation') == 1) {
                $user = Sentinel::registerAndActivate($request->all());
                $msg = __('Registration Successfully');
                if ($request->has('trx_id')) {
                    Cart::where('user_id', getWalkInCustomer()->id)
                        ->where('trx_id', $request->trx_id)
                        ->update(['user_id' => $user->id]);
                }
            } else {
                $user = Sentinel::register($request->all());
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

            // 2. Create Seller Profile
            $sellerData = [
                'shop_name' => $request->input('company_name'),
                'company_name' => $request->input('company_name'),
                'company_email' => $request->input('company_email'),
                'user_id' => $user->id,
                'slug' => \Str::slug($request->input('company_name')) . '-' . $user->id,
                'phone_no' => $request->input('phone_no'),
                'address' => $request->input('address'),
                'postcode' => $request->input('postcode'),
                'city' => $request->input('city'),
                'license_no' => $request->input('license_no'),
                'company_website' => $request->input('company_website'),
                'company_type' => $request->input('company_type'),
                'number_employees' => $request->input('number_employees'),
            ];

            // Assuming SellerProfile model exists for sellers table
            $newSeller = SellerProfile::create($sellerData);
            $users = $this->sellers->paginate($request, get_pagination('pagination'));
            $newData = $users->where('id', $user->id)->first();

            return $this->responseWithSuccess('seller is created successfully', $newData, 201);
        } catch (\Exception $e) {
            Toastr::error($e->getMessage());
            return back();
        }
    }

    public function fetchSellers(Request $request)
    {
        // Optional: Add filters by shop_name/city/etc through query params
        $query = Seller::query();

        if ($request->has('company_name')) {
            $query->where('company_name', 'like', '%' . $request->company_name . '%');
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

    public function store(UserStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            $this->sellers->store($request);
            cache()->forget('exchange_rate');
            Toastr::success(__('Created Successfully'));
            DB::commit();
            return redirect()->route('sellers')->with('success', __('Data added Successfully'));
        } catch (\Exception $e) {
            DB::rollBack();
            Toastr::error($e->getMessage());
            return back()->withInput();
        }
    }

    public function edit(Request $request, $id)
    {
        try {
            $user = $this->sellers->get($id);
            if ($user) {
                $data = [
                    'currency_list' => currencyList(),
                    'r' => $request->r != '' ? $request->r : $request->server('HTTP_REFERER'),
                    'user' => $user,
                ];
            } else {
                Toastr::error(__('Not found'));
                return back();
            }
            return $this->responseWithSuccess('seller updated successfully', $data, 200);
        } catch (\Exception $e) {
            Toastr::error($e->getMessage());
            return back()->withInput();
        }
    }

    public function update(UserUpdateRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $updatedSeller = $this->sellers->update($request);
            cache()->forget('exchange_rate');
            DB::commit();
            $users = $this->sellers->paginate($request, get_pagination('pagination'));
            $newData = $users->where('id', $id)->first();
            return response()->json([
                'success' => true,
                'message' => __('Data Updated Successfully'),
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

    // delete seller
    public function delete(Request $request, $id)
    {
        // Use the CommonController's shared delete logic for consistency
        if (isDemoServer()):
            return response()->json([
                'success' => false,
                'message' => __('This function is disabled in demo server.')
            ], 403);
        endif;

        // Get the seller
        $sellerId = $id ?? $request->get('id');
        if (!$sellerId) {
            return response()->json([
                'success' => false,
                'message' => __('Seller ID is required')
            ], 400);
        }

        // If you have a common repository method for deletion, call that
        // Otherwise, perform the manual deletion
        DB::beginTransaction();
        try {
            // Fetch the seller
            $seller = $this->sellers->get($sellerId);

            if (!$seller) {
                throw new \Exception(__('Seller not found or could not be deleted'));
            }

            // Assuming $seller is an Eloquent model
            $deleteResult = $seller->delete();

            if (!$deleteResult) {
                throw new \Exception(__('Seller could not be deleted'));
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => __('Seller deleted successfully'),
                'data' => $seller
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function verify($id, $user_id)
    {
        if (isDemoServer()):
            Toastr::info(__('This function is disabled in demo server.'));
            return redirect()->back();
        endif;
        if ($id == 0):
            Toastr::error(__('Please complete your shop details.'));
            return redirect()->route('admin.seller.edit', $user_id);
        endif;
        DB::beginTransaction();
        try {
            $this->sellers->verify($id);
            Toastr::success(__('Data Updated Successfully'));
            DB::commit();
            return redirect()->route('sellers');
        } catch (\Exception $e) {
            DB::rollBack();
            Toastr::error($e->getMessage());
            return redirect()->back();
        }
    }
    public function sellerByAjax(Request $request)
    {
        $term = trim($request->q);
        if (empty($term)) {
            return \Response::json([]);
        }

        $sellers = $this->sellers->shop()
            ->where('shop_name', 'like', '%' . $term . '%')
            ->where('verified_at', '!=', null)
            ->limit(30)
            ->get();

        $formatted_seller = [];

        foreach ($sellers as $seller) {
            $formatted_seller[] = ['id' => $seller->id, 'text' => $seller->shop_name];
        }

        return \Response::json($formatted_seller);
    }

    public function shop(SellerProfileInterface $seller, MediaInterface $media, ProductInterface $product, CouponInterface $coupon, $slug): \Illuminate\Http\JsonResponse
    {
        try {
            $shop = $seller->shopDetails($slug);

            $contents = $shop->shop_page_contents;

            $data = [
                'shop' => [
                    'id' => $shop->id,
                    'slug' => $slug,
                    'contents' => $this->parseShopData($shop, $media, $product),
                    'component_names' => $contents ? array_keys(array_merge(...$contents)) : [],
                    'image_82x82' => $shop->image_82x82,
                    'image_899x480' => $shop->image_899x480,
                    'shop_name' => $shop->shop_name,
                    'shop_page_contents' => $shop->shop_page_contents,
                    'rating_count' => round($shop->rating_count, 2),
                    'reviews_count' => (int) $shop->reviews_count,
                    'shop_tagline' => $shop->shop_tagline,
                    'image_297x203' => $shop->image_297x203,
                    'total_products' => count($shop->products),
                    'join_date' => Carbon::parse($shop->created_at)->format('d M Y'),
                ],
                'coupons' => new CouponPaginateResource($coupon->sellerCoupons($shop->user_id)),
                'products' => new ProductPaginateResource($product->sellerProducts($shop->user_id)),
            ];
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }
    public function sellerImport(Request $request)
    {
        return view('admin.sellers.import-seller');
    }

    public function importSeller(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required',
        ]);
        $extension = request()->file('file')->getClientOriginalExtension();

        if ($extension != 'xlsx' && $extension != 'xls' && $extension != 'csv'):
            return back()->with('danger', __('file_type_not_supported'));
        endif;

        $file = request()->file('file')->store('import');
        $import = new SellerImport();
        $import->import($file);

        unlink(storage_path('app/' . $file));
        Toastr::success(__('successfully_imported'));
        return back();
    }
}
