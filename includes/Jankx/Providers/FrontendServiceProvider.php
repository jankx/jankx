<?php

namespace Jankx\Providers;

use Jankx\Facades\Logger;

class FrontendServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Register helper provider for frontend
        $helperProvider = new FrontendHelperProvider($this->container);
        $helperProvider->register();

        // Add other frontend services here
    }

    public function boot()
    {
        // Boot services if needed
    }
}
