<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API-Only Mode: Micro-frontend routes
|--------------------------------------------------------------------------
| Path-based app routing:
|   /admin, /admin/*  -> Admin CMS
|   /seller, /seller/* -> Seller CMS
|   /driver, /driver/* -> Driver App
|   /*               -> Customer App
|
*/

Route::get('/admin', fn () => view('apps.admin'))->name('admin.app');
Route::get('/admin/{any}', fn () => view('apps.admin'))->where('any', '.*')->name('admin.app.any');

Route::get('/seller', fn () => view('apps.seller'))->name('seller.app');
Route::get('/seller/{any}', fn () => view('apps.seller'))->where('any', '.*')->name('seller.app.any');

Route::get('/driver', fn () => view('apps.driver'))->name('driver.app');
Route::get('/driver/{any}', fn () => view('apps.driver'))->where('any', '.*')->name('driver.app.any');

Route::get('/{any?}', fn () => view('apps.customer'))->where('any', '.*')->name('customer.app');
