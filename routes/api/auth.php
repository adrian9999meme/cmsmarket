<?php

/**
 * Auth Domain Routes
 * Authentication, registration, password reset.
 * Controllers: Auth\AuthController, Auth\UserController (profile)
 */

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('register-by-phone', [AuthController::class, 'registerByPhone']);
    Route::post('verify-registration-otp', [AuthController::class, 'verifyRegistrationOTP']);
    Route::post('get-login-otp', [AuthController::class, 'getOtp']);
    Route::post('verify-login-otp', [AuthController::class, 'verifyLoginOtp']);
    Route::post('social-login', [AuthController::class, 'socialLogin']);
    Route::post('get-verification-link', [AuthController::class, 'forgotPassword']);
    Route::post('verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('create-password', [AuthController::class, 'createNewPassword']);
});
