<?php

namespace App\Providers;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
    }

    public function boot()
    {
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        Config::set('app.locale', 'en');

        app_config();
        
        Schema::defaultStringLength(191);
    }
}