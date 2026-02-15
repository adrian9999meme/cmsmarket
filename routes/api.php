<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\APIController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group(['middleware' => 'api'], function ($router) {
    // Auth
    Route::post('/auth/login', [APIController::class, 'login']);
    Route::post('/auth/register', [APIController::class, 'register']);
    Route::post('/auth/forget-password', [APIController::class, 'forget_pass']);
    Route::post('/auth/reset-password', [APIController::class, 'reset_pass']);

    // Async time
    Route::get('/auth/getservertime', [APIController::class, 'getservertime']);

    // Seller
    Route::post('/seller/create', [SellerController::class, 'createSeller']);
    Route::get('/seller/fetch', [SellerController::class, 'fetchSellers']);
    Route::put('/seller/edit/{id}', [SellerController::class, 'updateSeller']);
    Route::delete('/seller/delete/{id}', [SellerController::class, 'deleteSeller']);
    
    // Store
    Route::post('/store/create', [StoreController::class, 'createStore']);
    Route::get('/store/fetch', [StoreController::class, 'fetchStores']);
    Route::put('/store/edit/{id}', [StoreController::class, 'updateStore']);
    Route::delete('/store/delete/{id}', [StoreController::class, 'deleteStore']);

    // Product APIs
    Route::post('/product/create', [ProductController::class, 'createProduct']);
    Route::get('/product/fetch', [ProductController::class, 'fetchProducts']);
    Route::put('/product/edit/{id}', [ProductController::class, 'updateProduct']);
    Route::delete('/product/delete/{id}', [ProductController::class, 'deleteProduct']);

    // Customer APIs
    Route::post('/customer/create', [CustomerController::class, 'createCustomer']);
    Route::get('/customer/fetch', [CustomerController::class, 'fetchCustomers']);
    Route::put('/customer/edit/{id}', [CustomerController::class, 'updateCustomer']);
    Route::delete('/customer/delete/{id}', [CustomerController::class, 'deleteCustomer']);
});