<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Sentinel;

class IsAdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (Sentinel::check()):
            if (Sentinel::getUser()->user_type == 'admin' || Sentinel::getUser()->user_type == 'staff'):
                return $next($request);
            else:
                return response()->json([
                    'error' => 'Unauthorized access. Admin or staff privileges required.'
                ], 403);
            endif;
        else:
            return response()->json([
                'error' => 'Unauthorized. Please login as admin or staff.'
            ], 401);
        endif;
    }
}
