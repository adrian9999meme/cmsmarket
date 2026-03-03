<?php

namespace App\Http\Middleware;

use App\Traits\ApiReturnFormatTrait;
use Closure;
use Illuminate\Http\Request;
use JWTAuth;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class JwtMiddleware extends  BaseMiddleware
{
    use ApiReturnFormatTrait;
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            // If Authorization header is missing but a token cookie exists (set for .lekit.uk),
            // inject it into the Authorization header so JWTAuth can parse it.
            if (!$request->hasHeader('Authorization') && $request->cookie('token')) {
                $request->headers->set('Authorization', 'Bearer ' . $request->cookie('token'));
            }

            $user = JWTAuth::parseToken()->authenticate();
        } catch (\Exception $e) {
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException):
                return $this->responseWithError(__('Invalid Token'),[],401);
            elseif ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException):
                return $this->responseWithError(__('Token is expired'),[],401);
            else:
                return $this->responseWithError(__('Authorization token not found'),[],401);
            endif;
        }
        if($user):
            return $next($request);
        else:
            return $this->responseWithError(__('Invalid Token'),[],401);
        endif;
    }
}
