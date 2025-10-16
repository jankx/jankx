<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Foundation\Application;
use Jankx\Facades\Log;

class RegisterProviders
{
    /**
     * Bootstrap the given application.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function bootstrap(Application $app)
    {
        Log::debug('Registering service providers...');

        $config = $app->make('config');

        // Get all providers from app config
        $providers = array_merge(
            $app->getBuiltInProviders(),
            $config->get('app.providers', [])
        );
        Log::debug(sprintf('Found %d providers', count($providers)));

        // Register all providers
        foreach ($providers as $provider) {
            if (is_string($provider) && class_exists($provider)) {
                Log::debug(sprintf('Registering provider: %s', $provider));
                $app->register($provider);
            } else {
                Log::debug(sprintf('Provider class not found: %s', is_string($provider) ? $provider : gettype($provider)));
            }
        }

        Log::debug('Service providers registration completed');
    }
}
