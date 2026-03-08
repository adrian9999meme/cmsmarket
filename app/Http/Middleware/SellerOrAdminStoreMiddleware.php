<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Sentinel;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Allows admin, staff, or seller to access store-related API routes.
 * Admin/staff can manage all stores; sellers can only manage their own.
 */
class SellerOrAdminStoreMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = Sentinel::check() ? Sentinel::getUser() : null;
        if (!$user && $request->bearerToken()) {
            try {
                $user = JWTAuth::parseToken()->authenticate();
            } catch (\Exception $e) {
                // ignore
            }
        }
        if (!$user) {
            return response()->json([
                'error' => 'Unauthorized. Please login.',
            ], 401);
        }
        $allowed = in_array($user->user_type, ['admin', 'staff', 'seller']);

        if (!$allowed) {
            return response()->json([
                'error' => 'Unauthorized. Admin or seller privileges required for store operations.',
            ], 403);
        }

        return $next($request);
    }
}
