<?php

/**
 * Consumer CMS Routes (Admin panel for customers, trade discounts)
 * Controllers: Admin\CustomerController, Admin\TradeDiscountRequestController
 */

use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\TradeDiscountRequestController;
use Illuminate\Support\Facades\Route;

Route::middleware(['jwt.verify', 'adminCheck'])->group(function () {
    Route::get('customers/fetch', [CustomerController::class, 'index']);
    Route::post('customers/create', [CustomerController::class, 'create']);
    Route::put('customers/edit/{id}', [CustomerController::class, 'update']);
    Route::put('customers/setactive/{id}', [CustomerController::class, 'setActive']);
    Route::delete('customers/delete/{id}', [CustomerController::class, 'delete']);
    Route::put('customers/trade-approve/{id}', [CustomerController::class, 'approveTrade']);
    Route::put('customers/trade-reject/{id}', [CustomerController::class, 'rejectTrade']);

    Route::get('trade-discount-requests', [TradeDiscountRequestController::class, 'index']);
    Route::get('trade-discount-requests/{id}', [TradeDiscountRequestController::class, 'show']);
    Route::post('trade-discount-requests', [TradeDiscountRequestController::class, 'store']);
    Route::put('trade-discount-requests/{id}', [TradeDiscountRequestController::class, 'update']);
    Route::post('trade-discount-requests/{id}/approve', [TradeDiscountRequestController::class, 'approve']);
    Route::post('trade-discount-requests/{id}/reject', [TradeDiscountRequestController::class, 'reject']);
    Route::delete('trade-discount-requests/{id}', [TradeDiscountRequestController::class, 'destroy']);
});
