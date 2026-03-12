<?php

/**
 * Logistics Domain Routes
 * Orders, Drivers, Delivery, Chat.
 * Controllers: Admin\OrderController, Admin\DeliveryHero\DeliveryHeroController, Api\Cms\ChatController
 */

use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\DeliveryHero\DeliveryHeroController as DriverController;
use App\Http\Controllers\Api\Cms\ChatController;
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

// CMS - Chat (admin, manager, seller)
Route::middleware(['jwt.verify'])->group(function () {
    Route::get('chat/rooms', [ChatController::class, 'rooms']);
    Route::get('chat/messages', [ChatController::class, 'messages']);
    Route::post('chat/send-message', [ChatController::class, 'sendMessage']);
});
