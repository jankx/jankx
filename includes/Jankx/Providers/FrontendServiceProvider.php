<?php

namespace Jankx\Providers;

use Jankx\Facades\Logger;
use Jankx\Services\UserService;

class FrontendServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Register helper provider for frontend
        $helperProvider = new FrontendHelperProvider($this->container);
        $helperProvider->register();

        // Register User Service
        $this->singleton('user.service', UserService::class);

        // Register BlockParserService
        $this->singleton(\Jankx\Services\BlockParserService::class, \Jankx\Services\BlockParserService::class);

        // Add other frontend services here
    }

    public function boot()
    {
        // Boot services if needed
    }
}
