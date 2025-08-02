<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Foundation\Application;
use Jankx\Helper\Environment;

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
        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Registering service providers...');
        }

        $config = $app->make('config');
        $providersConfig = $config->get('providers', []);

        // Get global providers
        $globalProviders = $providersConfig['global'] ?? [];

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

        // Merge global and kernel-specific providers
        $providers = array_merge($globalProviders, $kernelProviders);

        if (Environment::isDebugLog()) {
            error_log(sprintf('[JANKX DEBUG] Found %d providers to register', count($providers)));
        }

        foreach ($providers as $provider) {
            if (is_string($provider) && class_exists($provider)) {
                if (Environment::isDebugLog()) {
                    error_log(sprintf('[JANKX DEBUG] Registering provider: %s', $provider));
                }
                $app->register($provider);
            } elseif (Environment::isDebugLog()) {
                error_log(sprintf('[JANKX DEBUG] Provider class not found or invalid: %s', is_string($provider) ? $provider : gettype($provider)));
            }
        }

        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Service providers registration completed');
        }
    }
}
