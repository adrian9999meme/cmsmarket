<?php

/**
 * Platform Domain Routes
 * Config, home, campaigns, blog, video, pages, orders (user), payment, shipping locations.
 * Controllers: Api\V100\APIController, HomeController, CampaignController, BlogController, VideoShoppingController, OrderController, ShippingController
 */

use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Api\V100\APIController;
use App\Http\Controllers\Api\V100\BlogController;
use App\Http\Controllers\Api\V100\CampaignController;
use App\Http\Controllers\Api\V100\HomeController;
use App\Http\Controllers\Api\V100\ShippingController;
use App\Http\Controllers\Api\V100\VideoShoppingController;
use Illuminate\Support\Facades\Route;

Route::get('configs', [APIController::class, 'config']);
Route::get('home-screen', [HomeController::class, 'homePageData']);
Route::get('page/{id}', [APIController::class, 'page']);
Route::get('import-db', [APIController::class, 'importDb']);

Route::controller(CampaignController::class)->group(function () {
    Route::get('get-campaigns', 'campaigns');
    Route::get('campaign-details/{id}', 'campaignDetails');
    Route::get('campaign-products', 'campaignProducts');
    Route::get('campaign-data', 'campaignData');
});

Route::get('all-post', [BlogController::class, 'allBlog']);
Route::get('post-all-details/{id}', [BlogController::class, 'details']);
Route::get('post-details/{id}', [BlogController::class, 'getDetails'])->name('api.post.details');

Route::get('get-countries', [ShippingController::class, 'countries']);
Route::get('get-states/{country_id}', [ShippingController::class, 'getStates']);
Route::get('get-cities/{state_id}', [ShippingController::class, 'getCities']);

Route::get('video-shopping', [VideoShoppingController::class, 'allVideos']);
Route::get('video-shops-details/{slug}', [VideoShoppingController::class, 'videoShoppingDetails']);

// User orders (consumer order placement)
Route::controller(OrderController::class)->group(function () {
    Route::get('orders', 'index')->name('api.user.orders')->middleware('jwt.verify');
    Route::get('track-order', 'trackOrder');
    Route::post('confirm-order', 'confirmOrder');
});
Route::match(['get', 'post'], 'payment', [OrderController::class, 'payment'])->name('order.payment');
Route::get('invoice-download/{id}', [OrderController::class, 'downloadInvoice']);
Route::get('order-by-trx', [OrderController::class, 'OrderByTrx']);
