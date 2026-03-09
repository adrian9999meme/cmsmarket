<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Sentinel;

class IsSellerMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user_id && $request->trx_id)
        {
            $user = Sentinel::findById($request->user_id);

            Sentinel::loginAndRemember($user);
        }
        if (Sentinel::check()):
            $userType = Sentinel::getUser()->user_type;
            if ($userType == 'seller' || $userType == 'manager'):
                return $next($request);
            elseif($userType == 'admin' || $userType == 'staff'):
                return redirect()->route('home');
            else:
                return redirect()->route('home');
            endif;
        else:
            return  redirect()->route('seller.login.form');
        endif;
    }
}
