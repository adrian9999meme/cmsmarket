<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * API-only backend: always return JSON for exceptions (no Blade views).
     */
    public function render($request, Throwable $e)
    {
        if ($e instanceof \Illuminate\Validation\ValidationException) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $e->errors(),
            ], 422);
        }

        $status = 500;
        if (method_exists($e, 'getStatusCode')) {
            $status = $e->getStatusCode();
        }
        if ($status < 400) {
            $status = 500;
        }

        return response()->json([
            'message' => config('app.debug') ? $e->getMessage() : 'Server Error',
            'exception' => config('app.debug') ? get_class($e) : null,
        ], $status);
    }
}
