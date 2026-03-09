<?php

/**
 * Consumer Domain Routes
 * User profile, addresses, preferences, trade discounts.
 * Controllers: Auth\UserController, Admin\CustomerController, Admin\TradeDiscountRequestController
 */

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\TradeDiscountRequestController;
use App\Http\Controllers\Api\V100\ShippingController;
use App\Http\Controllers\Api\V100\NotificationController;
use App\Http\Controllers\Api\V100\ReviewController;
use App\Http\Controllers\Api\V100\RewardSystemController;
use App\Http\Controllers\Api\V100\BlogController;
use App\Http\Controllers\Api\V100\ChatSystemController;
use Illuminate\Support\Facades\Route;

Route::middleware(['jwt.verify'])->group(function () {
    Route::get('profile', [UserController::class, 'profile']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('update-profile', [UserController::class, 'updateProfile']);
    Route::post('change-password', [UserController::class, 'changePassword']);
    Route::get('delete-account', [UserController::class, 'destroy']);

    Route::get('user/shipping-addresses', [ShippingController::class, 'index']);
    Route::resource('shipping-addresses', ShippingController::class)->only('store', 'edit', 'destroy');
    Route::post('shipping-addresses/{id}', [ShippingController::class, 'update']);

    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('delete-notification/{id}', [NotificationController::class, 'destroy']);
    Route::get('delete-all-notifications', [NotificationController::class, 'destroyAll']);

    Route::post('submit-review', [ReviewController::class, 'review']);
    Route::post('submit-reply', [ReviewController::class, 'reply']);
    Route::post('like-unlike-review', [ReviewController::class, 'reviewLike']);
    Route::get('unlike-review', [ReviewController::class, 'unlikeReview']);

    Route::get('my-wallet', [UserController::class, 'myWallet']);
    Route::get('my-reward', [RewardSystemController::class, 'myReward']);
    Route::post('convert-reward', [RewardSystemController::class, 'convertReward']);
    Route::get('digital-product-order-list', [RewardSystemController::class, 'digitalProductOrders']);
    Route::get('recharge', [UserController::class, 'apiRecharge']);

    Route::get('sellers', [ChatSystemController::class, 'sellers']);
    Route::get('messages', [ChatSystemController::class, 'messages']);
    Route::post('send-message', [ChatSystemController::class, 'sendMessage']);

    Route::post('blog/submit-review', [BlogController::class, 'storeComment']);
    Route::post('blog/submit-reply', [BlogController::class, 'storeCommentReply']);
    Route::get('blog/like-review', [BlogController::class, 'likeBlogComments']);
    Route::get('blog/unlike-review', [BlogController::class, 'unlikeBlogComments']);
    Route::get('blog/like-reply', [BlogController::class, 'likeBlogReply']);
    Route::get('blog/unlike-reply', [BlogController::class, 'unlikeBlogReply']);
});
