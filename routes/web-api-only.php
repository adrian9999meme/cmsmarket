<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API-Only Mode: Minimal web routes (no UI)
|--------------------------------------------------------------------------
| When APP_API_ONLY=true, only these routes are loaded.
| Your frontend should be a separate app (e.g. SPA, mobile) calling /api/*.
|
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'API-only backend',
        'version' => 'v100',
        'docs'    => url('api/v100/configs'),
        'health'  => url('health'),
    ], 200, [], JSON_UNESCAPED_SLASHES);
});

Route::get('health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()->toIso8601String()]);
});

Route::get('/{any}', function () {
    return view('home');
})->where('any', '.*');
