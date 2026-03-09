<?php

/**
 * API Routes - Domain-based structure
 * Routes are organized by domain: auth, consumer, marketplace, logistics, platform.
 * Controllers remain in existing locations (Admin/, Api/V100/, Auth/, Site/).
 */

use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\WalletController;
use App\Http\Controllers\Api\V100\APIController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within the "api" middleware
| group.
|
*/

Route::prefix('v1')->group(function () {
    require base_path('routes/api/auth.php');
    require base_path('routes/api/consumer.php');
    require base_path('routes/api/consumer_cms.php');
    require base_path('routes/api/marketplace.php');
    require base_path('routes/api/logistics.php');
    require base_path('routes/api/platform.php');
});

// Payment callbacks - outside v1 (payment gateways expect fixed URLs)
Route::match(['post', 'get'], 'complete-order', [OrderController::class, 'completeOrder'])->name('api.complete.order');
Route::match(['get', 'post'], 'complete-recharge', [WalletController::class, 'walletStore'])->name('api.wallet.complete.recharge');
Route::get('payment-success', [OrderController::class, 'paymentSuccess'])->name('api.payment.success');
Route::get('import-db', [APIController::class, 'importDb']);
