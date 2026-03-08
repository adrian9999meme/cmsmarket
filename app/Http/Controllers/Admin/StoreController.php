<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserStoreRequest;
use App\Http\Requests\User\UserUpdateRequest;
use App\Http\Resources\SiteResource\CouponPaginateResource;
use App\Http\Resources\SiteResource\ProductPaginateResource;
use App\Http\Resources\SiteResource\ProductResource;
use App\Imports\SellerImport;
use App\Models\StoreProfile;
use App\Models\User;
use App\Repositories\Interfaces\Admin\Marketing\CouponInterface;
use App\Repositories\Interfaces\Admin\MediaInterface;
use App\Repositories\Interfaces\Admin\Product\ProductInterface;
use App\Repositories\Interfaces\Admin\StoreProfileInterface;
use App\Repositories\Interfaces\Admin\StoreInterface;
use App\Repositories\Interfaces\Admin\StoreCategoryInterface;
use App\Traits\HomePage;
use Brian2694\Toastr\Facades\Toastr;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Sentinel;
use Tymon\JWTAuth\Facades\JWTAuth;

class StoreController extends Controller
{
    use HomePage;

    protected $stores;
    protected $storeProfile;
    public function __construct(StoreInterface $stores, StoreCategoryInterface $categories, StoreProfileInterface $storeProfile)
    {
        if (settingHelper('seller_system') != 1) {
            abort(403);
        }
        $this->stores = $stores;
        $this->categories = $categories;
        $this->storeProfile = $storeProfile;
    }

    public function index(Request $request)
    {
        try {
            $user = Sentinel::check() ? Sentinel::getUser() : null;
            if (!$user && request()->bearerToken()) {
                try {
                    $user = JWTAuth::parseToken()->authenticate();
                } catch (\Exception $e) {
                    $user = null;
                }
            }

            $query = User::query();

            $subdomain = strtolower(trim($request->get('subdomain', 'all')));
            $searchKeyword = trim($request->get('keyword', ''));

            $query->with('storeProfile')
                ->where('user_type', 'manager')
                ->latest();

            // When user is seller, only show stores belonging to them
            if ($user && $user->user_type === 'seller') {
                $query->whereHas('storeProfile', function ($q) use ($user) {
                    $q->where('seller_id', $user->id);
                });
            }

            // Status filter
            if ($subdomain === "pending") {
                $query->where('is_user_banned', 0)
                    ->whereHas('storeProfile', function ($q) {
                        $q->where('status', 0);
                    });
            } elseif ($subdomain === "blocked") {
                $query->where('is_user_banned', 1);
            } elseif ($subdomain === "active") {
                $query->where('is_user_banned', 0)
                    ->whereHas('storeProfile', function ($q) {
                        $q->where('status', 1);
                    });
            }

            // Search filter
            if (!empty($searchKeyword)) {
                $query->where(function ($q) use ($searchKeyword) {
                    $q->where('first_name', 'like', "%{$searchKeyword}%")
                        ->orWhere('last_name', 'like', "%{$searchKeyword}%")
                        ->orWhere('email', 'like', "%{$searchKeyword}%")
                        ->orWhereHas('storeProfile', function ($sub) use ($searchKeyword) {
                            $sub->where('store_name', 'like', "%{$searchKeyword}%");
                            $sub->where('address', 'like', "%{$searchKeyword}%");
                        });
                });
            }

            $stores = $query->get();

            return response()->json([
                'success' => true,
                'message' => 'Retrieved customers successfully',
                'data' => $stores
            ]);
        } catch (\Exception $e) {
            Toastr::error($e->getMessage());
            return back();
        }
    }

    public function setActive(Request $request, $id)
    {
        // Find the user that owns the given store profile id
        $user = User::whereHas('storeProfile', function ($q) use ($id) {
            $q->where('id', $id);
        })->with('storeProfile')->first();

        // When current user is seller, verify they own this store
        $authUser = Sentinel::check() ? Sentinel::getUser() : null;
        if (!$authUser && request()->bearerToken()) {
            try {
                $authUser = JWTAuth::parseToken()->authenticate();
            } catch (\Exception $e) {
                $authUser = null;
            }
        }
        if ($authUser && $authUser->user_type === 'seller' && $user && $user->storeProfile && $user->storeProfile->seller_id != $authUser->id) {
            return response()->json([
                'success' => false,
                'message' => __('You can only update your own stores.'),
            ], 403);
        }

        if ($user && $user->storeProfile) {
            // Update the status
            if ($request->has('store_profile.status')) {
                $user->storeProfile->status = $request->input('store_profile.status');
            } elseif ($request->has('status')) {
                $user->storeProfile->status = $request->input('status');
            }
            $user->storeProfile->save();
            // Reload the user with fresh storeProfile
            $user->refresh();
            $user->load('storeProfile');
            return response()->json([
                'success' => true,
                'message' => 'Store status updated successfully',
                'data' => $user
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Store profile not found',
                'data' => null
            ], 404);
        }
    }

    public function create()
    {
        $data = [
            'categories' => $this->categories->allCategory()->where('parent_id', null)->where('status', 1),
            'currency_list' => currencyList(),
            'sellers' => $this->stores->allSeller()->get(),
            'selected_category' => null
        ];

        return view('admin.stores.form', $data);
    }

    public function store(UserStoreRequest $request)
    {
        $this->validate($request, [
            'seller_id' => 'required',
            'store_name' => 'required|unique:stores',
            'store_code' => 'required|unique:stores',
            'address' => 'required',
            'store_phone' => 'required',
            'store_email' => 'required',
            'latitude' => 'required',
            'longitude' => 'required',
            'store_description' => 'required'
        ]);

        DB::beginTransaction();
        try {
            $this->stores->store($request);
            cache()->forget('exchange_rate');
            Toastr::success(__('Created Successfully'));
            DB::commit();
            return redirect()->route('stores')->with('success', __('Data added Successfully'));
        } catch (\Exception $e) {
            DB::rollBack();
            Toastr::error($e->getMessage());
            return back()->withInput();
        }
    }

    /**
     * API: create a new store (manager + store profile).
     *
     * POST /api/v1/stores/create
     */
    public function apiStore(Request $request)
    {
        // use a plain Request instead of UserStoreRequest so we can validate
        // both manager/user fields and store fields in one shot.  The form
        // request was triggering a 422 before the controller code even
        // executed, which made it hard to figure out why the request failed.

        if (isDemoServer()):
            return response()->json([
                'success' => false,
                'message' => __('This function is disabled in demo server.'),
            ], 403);
        endif;

        $user = Sentinel::check() ? Sentinel::getUser() : null;
        if (!$user && request()->bearerToken()) {
            try {
                $user = JWTAuth::parseToken()->authenticate();
            } catch (\Exception $e) {
                $user = null;
            }
        }

        // When user is seller, force seller_id to their own id
        if ($user && $user->user_type === 'seller') {
            if (!$user->sellerProfile) {
                return response()->json([
                    'success' => false,
                    'message' => __('You must have a seller profile before creating a store.'),
                ], 403);
            }
            $request->merge(['seller_id' => $user->id]);
        }

        // combined validation rules cover the manager (user) data as well as
        // the store profile information that the front‑end is submitting.
        $rules = [
            // store profile rules (same as earlier)
            'seller_id' => 'required',
            'store_name' => 'required|unique:stores',
            'store_code' => 'required|unique:stores',
            'address' => 'required',
            'store_phone' => 'required',
            'store_email' => 'required',
            'latitude' => 'required',
            'longitude' => 'required',
            'store_description' => 'required',

            // manager/user rules (copied from UserStoreRequest)
            'first_name' => 'required|max:50',
            'last_name'  => 'required|max:50',
            'phone'      => 'required|unique:users|min:4|max:20',
            'email'      => 'required|unique:users|email|max:50',
            'password'   => 'required|min:6|max:32',
        ];
        $this->validate($request, $rules);

        DB::beginTransaction();
        try {
            $storeUser = $this->stores->store($request);

            if (!$storeUser) {
                throw new \Exception(__('Store could not be created'));
            }

            cache()->forget('exchange_rate');
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => __('Store Created Successfully'),
                'data'    => $storeUser,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function edit(Request $request, $id)
    {
        try {
            $user = $this->stores->get($id);
            if ($user) {
                $data = [
                    'categories' => $this->categories->allCategory()->where('parent_id', null)->where('status', 1),
                    'currency_list' => currencyList(),
                    'r' => $request->r != '' ? $request->r : $request->server('HTTP_REFERER'),
                    'user' => $user,
                    'sellers' => $this->stores->allSeller()->get(),
                    'selected_category' => $this->storeProfile->getStoresCategory($id),
                ];
                // dd($data);
            } else {
                Toastr::error(__('Not found'));
                return back();
            }
            return view('admin.stores.form', $data);
        } catch (\Exception $e) {
            Toastr::error($e->getMessage());
            return back()->withInput();
        }
    }

    public function update(Request $request, $id = null)
    {
        if (isDemoServer()):
            Toastr::info(__('This function is disabled in demo server.'));
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => __('This function is disabled in demo server.'),
                ], 403);
            }
            return redirect()->back();
        endif;

        $this->validate($request, [
            'seller_id' => 'required',
            'store_name' => 'required',
            'store_code' => 'required',
            'address' => 'required',
            'store_phone' => 'required',
            'store_email' => 'required',
            'latitude' => 'required',
            'longitude' => 'required',
            'store_description' => 'required'
        ]);

        /**
         * Determine the owning user id.
         * - For admin web form: no route {id}, we use $request->id (user id).
         * - For API: route {id} is the store_profile id, we map it to user_id.
         */
        if ($id !== null) {
            $storeProfile = \App\Models\StoreProfile::find($id);
            $userId = $storeProfile ? $storeProfile->user_id : $request->user_id;

            // When user is seller, verify they own this store
            $authUser = Sentinel::check() ? Sentinel::getUser() : null;
            if (!$authUser && request()->bearerToken()) {
                try {
                    $authUser = JWTAuth::parseToken()->authenticate();
                } catch (\Exception $e) {
                    $authUser = null;
                }
            }
            if ($authUser && $authUser->user_type === 'seller' && $storeProfile && $storeProfile->seller_id != $authUser->id) {
                return response()->json([
                    'success' => false,
                    'message' => __('You can only update your own stores.'),
                ], 403);
            }
        } else {
            $userId = $request->id;
        }

        DB::beginTransaction();
        try {
            // Ensure repository and store profile layer get consistent ids
            $request->merge(['id' => $userId, 'user_id' => $userId]);

            $this->stores->update($request);
            cache()->forget('exchange_rate');
            DB::commit();

            // If this is an API call, return JSON with updated store data
            if ($request->expectsJson()) {
                $stores = $this->stores->paginate($request, get_pagination('pagination'));
                $newData = $stores->where('id', $userId)->first();

                return response()->json([
                    'success' => true,
                    'message' => __('Store Updated Successfully'),
                    'data' => $newData,
                ], 200);
            }

            // Otherwise behave like the original web controller
            Toastr::success(__('Data Updated Successfully'));
            return redirect($request->r);
        } catch (\Exception $e) {
            DB::rollBack();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ], 500);
            }

            Toastr::error($e->getMessage());
            return redirect()->back();
        }
    }

    /**
     * Delete a store (manager) by user id.
     *
     * Used by API: DELETE /api/v1/stores/delete/{id}
     */
    public function delete(Request $request, $id)
    {
        if (isDemoServer()):
            return response()->json([
                'success' => false,
                'message' => __('This function is disabled in demo server.')
            ], 403);
        endif;

        // Get the store user (manager)
        $storeUserId = $id ?? $request->get('id');
        if (!$storeUserId) {
            return response()->json([
                'success' => false,
                'message' => __('Store ID is required')
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Fetch the user (manager) via repository
            $storeUser = $this->stores->get($storeUserId);

            if (!$storeUser || $storeUser->user_type !== 'manager') {
                throw new \Exception(__('Store not found or could not be deleted'));
            }

            // When user is seller, verify they own this store
            $authUser = Sentinel::check() ? Sentinel::getUser() : null;
            if (!$authUser && request()->bearerToken()) {
                try {
                    $authUser = JWTAuth::parseToken()->authenticate();
                } catch (\Exception $e) {
                    $authUser = null;
                }
            }
            if ($authUser && $authUser->user_type === 'seller') {
                $storeProfile = $storeUser->storeProfile ?? \App\Models\StoreProfile::where('user_id', $storeUserId)->first();
                if (!$storeProfile || $storeProfile->seller_id != $authUser->id) {
                    return response()->json([
                        'success' => false,
                        'message' => __('You can only delete your own stores.'),
                    ], 403);
                }
            }

            $deleteResult = $storeUser->delete();

            if (!$deleteResult) {
                throw new \Exception(__('Store could not be deleted'));
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => __('Store deleted successfully'),
                'data' => $storeUser
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /*public function verify($id, $user_id){
        if (isDemoServer()):
            Toastr::info(__('This function is disabled in demo server.'));
            return redirect()->back();
        endif;
        if($id == 0):
            Toastr::error(__('Please complete your shop details.'));
            return redirect()->route('admin.seller.edit',$user_id);
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

    public function sellerByAjax(Request $request){
        $term           = trim($request->q);
        if (empty($term)) {
            return \Response::json([]);
        }

        $sellers = $this->sellers->shop()
            ->where('shop_name', 'like', '%'.$term.'%')
            ->where('verified_at','!=',null)
            ->limit(30)
            ->get();

        $formatted_seller   = [];

        foreach ($sellers as $seller) {
            $formatted_seller[] = ['id' => $seller->id, 'text' => $seller->shop_name];
        }

        return \Response::json($formatted_seller);
    }

    public function shop(SellerProfileInterface $seller,MediaInterface $media,ProductInterface $product,CouponInterface $coupon, $slug): \Illuminate\Http\JsonResponse
    {
        try {
            $shop = $seller->shopDetails($slug);

            $contents = $shop->shop_page_contents;

            $data = [
                'shop' => [
                    'id'                    => $shop->id,
                    'slug'                  => $slug,
                    'contents'              => $this->parseShopData($shop,$media,$product),
                    'component_names'       => $contents ? array_keys(array_merge(...$contents)) : [],
                    'image_82x82'           => $shop->image_82x82,
                    'image_899x480'         => $shop->image_899x480,
                    'shop_name'             => $shop->shop_name,
                    'shop_page_contents'    => $shop->shop_page_contents,
                    'rating_count'          => round($shop->rating_count,2),
                    'reviews_count'         => (int)$shop->reviews_count,
                    'shop_tagline'          => $shop->shop_tagline,
                    'image_297x203'         => $shop->image_297x203,
                    'total_products'        => count($shop->products),
                    'join_date'             => Carbon::parse($shop->created_at)->format('d M Y'),
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

        unlink(storage_path('app/'.$file));
        Toastr::success(__('successfully_imported'));
        return back();
    }*/
}
