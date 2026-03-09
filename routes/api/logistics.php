<?php

/**
 * Logistics Domain Routes
 * Orders, Drivers, Delivery.
 * Controllers: Admin\OrderController, Admin\DeliveryHero\DeliveryHeroController
 */

use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\DeliveryHero\DeliveryHeroController as DriverController;
use Illuminate\Support\Facades\Route;

// CMS - Orders (role-based: admin, manager, seller, customer, delivery_hero)
Route::middleware(['jwt.verify', 'adminCheck'])->group(function () {
    Route::get('orders/fetch', [OrderController::class, 'index']);
});

// CMS - Drivers (admin only)
Route::middleware(['jwt.verify', 'adminCheck'])->group(function () {
    Route::get('drivers/fetch', [DriverController::class, 'index']);
    Route::post('drivers/add', [DriverController::class, 'create']);
    Route::put('drivers/edit/{id}', [DriverController::class, 'update']);
});
