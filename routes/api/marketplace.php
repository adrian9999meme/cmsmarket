<?php

/**
 * Marketplace Domain Routes
 * Sellers, Stores, Products, Categories, Shops, Cart.
 * Controllers: Admin\SellerController, Admin\StoreController, Admin\ProductController, Api\V100\*
 */

use App\Http\Controllers\Admin\SellerController;
use App\Http\Controllers\Admin\StoreController;
use App\Http\Controllers\Admin\Product\ProductController as AdminProductController;
use App\Http\Controllers\Api\V100\ProductController;
use App\Http\Controllers\Api\V100\ShopController;
use App\Http\Controllers\Api\V100\CategoryController;
use App\Http\Controllers\Api\V100\BrandController;
use App\Http\Controllers\Api\V100\CartController;
use App\Http\Controllers\Api\V100\WishlistController;
use App\Http\Controllers\Site\FrontendController;
use Illuminate\Support\Facades\Route;

// CMS - Admin/Seller (JWT + role middleware)
Route::middleware(['jwt.verify', 'adminCheck'])->group(function () {
    Route::get('sellers/fetch', [SellerController::class, 'index']);
    Route::post('sellers/create', [SellerController::class, 'create']);
    Route::put('sellers/edit/{id}', [SellerController::class, 'update']);
    Route::put('sellers/setactive/{id}', [SellerController::class, 'setActive']);
    Route::delete('sellers/delete/{id}', [SellerController::class, 'delete']);

    Route::get('products/fetch', [AdminProductController::class, 'fetch']);
    Route::get('products/categories/list', [AdminProductController::class, 'apiCategories']);
    Route::get('products/{id}', [AdminProductController::class, 'apiShow']);
    Route::post('products/create', [AdminProductController::class, 'apiStore']);
    Route::put('products/edit/{id}', [AdminProductController::class, 'apiUpdate']);
    Route::delete('products/delete/{id}', [AdminProductController::class, 'apiDelete']);
});

Route::middleware(['jwt.verify', 'sellerOrAdminStore'])->group(function () {
    Route::get('stores/fetch', [StoreController::class, 'index']);
    Route::post('stores/create', [StoreController::class, 'apiStore']);
    Route::put('stores/edit/{id}', [StoreController::class, 'update']);
    Route::put('stores/setactive/{id}', [StoreController::class, 'setActive']);
    Route::delete('stores/delete/{id}', [StoreController::class, 'delete']);
});

// Public marketplace
Route::get('home/store-categories', [FrontendController::class, 'storeCategories']);
Route::get('home/sellers', [FrontendController::class, 'sellers']);

Route::controller(ProductController::class)->group(function () {
    Route::get('get-products', 'latestProduct');
    Route::get('viewed-products', 'viewedProduct');
    Route::get('product-details/{id}', 'details');
    Route::get('get-top-products', 'topProduct');
    Route::get('get-best-rated-products', 'bestRatedProduct');
    Route::get('get-best-selling-products', 'bestSellingProduct');
    Route::get('get-offer-ending-products', 'offerEndingProduct');
    Route::get('get-today-deals-products', 'todayDeal');
    Route::get('get-flash-deals-products', 'flashDeal');
    Route::get('products-by-brand/{id}', 'brandProducts');
    Route::get('products-by-category/{id}', 'categoryProducts');
    Route::get('products-by-shop/{user_id}', 'shopProducts');
    Route::get('products-by-campaign/{id}', 'campaignProducts');
    Route::post('find-variant', 'findVariant');
    Route::get('product-description/{id}', 'getDescription')->name('api.product.details');
});

Route::prefix('category')->group(function () {
    Route::get('all', [CategoryController::class, 'allCategory']);
    Route::get('feature-category', [CategoryController::class, 'featureCategory']);
});

Route::get('all-brand', [BrandController::class, 'allBrand']);

Route::get('all-shop', [ShopController::class, 'allShop']);
Route::get('shop/{id}', [ShopController::class, 'shop']);
Route::get('best-shop', [ShopController::class, 'bestShop']);
Route::get('top-shop', [ShopController::class, 'topShop']);
Route::get('shop-details/{seller_id}', [ShopController::class, 'shopDetails']);

Route::get('search', [ProductController::class, 'search']); // Api\V100\ProductController

Route::get('favourite-products', [WishlistController::class, 'index']);
Route::get('favourite/{product_id}', [WishlistController::class, 'addOrRemove']);
Route::get('followed-shop', [ShopController::class, 'followedShop']);
Route::get('followed-shop/{seller_id}', [ShopController::class, 'followUnfollowShop']);
Route::post('delete-coupon', [ShopController::class, 'deleteCoupon'])->middleware('jwt.verify');

Route::get('carts', [CartController::class, 'index']);
Route::post('cart-store', [CartController::class, 'store']);
Route::post('cart-update/{id}', [CartController::class, 'update']);
Route::delete('cart-delete/{id}', [CartController::class, 'destroy']);
Route::get('coupons', [CartController::class, 'couponList']);
Route::post('apply-coupon', [CartController::class, 'applyCoupon']);
Route::get('applied-coupons', [CartController::class, 'appliedCoupons']);
Route::post('find/shipping-cost', [CartController::class, 'findShippingCost']);
