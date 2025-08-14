<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Foundation\Application;
use Jankx\Helper\Environment;
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
        $providersConfig = $config->get('providers', []);

        // Get app-level global providers first
        $appProviders = array_merge(
            $app->getBuiltInProviders(),
            $config->get('app.providers', [])
        );
        Log::debug(sprintf('Found %d app-level providers', count($appProviders)));

        // Register app-level providers first (global scope)
        foreach ($appProviders as $provider) {
            if (is_string($provider) && class_exists($provider)) {
                Log::debug(sprintf('Registering app-level provider: %s', $provider));
                $app->register($provider);
            } else {
                Log::debug(sprintf('App-level provider class not found: %s', is_string($provider) ? $provider : gettype($provider)));
            }
        }

        // Get kernel-specific providers based on request type
        $kernelProviders = [];
        if (Environment::isWpCli()) {
            $kernelProviders = $providersConfig['console']['wp_cli'] ?? [];
        } elseif (Environment::isWpCron()) {
            $kernelProviders = $providersConfig['console']['wp_cron'] ?? [];
        } elseif (Environment::isAdmin()) {
            $kernelProviders = $providersConfig['http']['admin'] ?? [];
        } else {
            $kernelProviders = $providersConfig['http']['frontend'] ?? [];
        }

        Log::debug(sprintf('Found %d kernel-specific providers', count($kernelProviders)));

        // Register kernel-specific providers
        foreach ($kernelProviders as $provider) {
            if (is_string($provider) && class_exists($provider)) {
                Log::debug(sprintf('Registering kernel-specific provider: %s', $provider));
                $app->register($provider);
            } else {
                Log::debug(sprintf('Kernel-specific provider class not found: %s', is_string($provider) ? $provider : gettype($provider)));
            }
        }

        Log::debug('Service providers registration completed');
    }
}
