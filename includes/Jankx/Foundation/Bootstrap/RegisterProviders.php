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

        // Get app-level global providers first
        $appProviders = $config->get('app.providers', []);
        if (Environment::isDebugLog()) {
            error_log(sprintf('[JANKX DEBUG] Found %d app-level providers', count($appProviders)));
        }

        // Register app-level providers first (global scope)
        foreach ($appProviders as $provider) {
            if (is_string($provider) && class_exists($provider)) {
                if (Environment::isDebugLog()) {
                    error_log(sprintf('[JANKX DEBUG] Registering app-level provider: %s', $provider));
                }
                $app->register($provider);
            } elseif (Environment::isDebugLog()) {
                error_log(sprintf('[JANKX DEBUG] App-level provider class not found: %s', is_string($provider) ? $provider : gettype($provider)));
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

        if (Environment::isDebugLog()) {
            error_log(sprintf('[JANKX DEBUG] Found %d kernel-specific providers', count($kernelProviders)));
        }

        // Register kernel-specific providers
        foreach ($kernelProviders as $provider) {
            if (is_string($provider) && class_exists($provider)) {
                if (Environment::isDebugLog()) {
                    error_log(sprintf('[JANKX DEBUG] Registering kernel-specific provider: %s', $provider));
                }
                $app->register($provider);
            } elseif (Environment::isDebugLog()) {
                error_log(sprintf('[JANKX DEBUG] Kernel-specific provider class not found: %s', is_string($provider) ? $provider : gettype($provider)));
            }
        }

        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Service providers registration completed');
        }
    }
}
