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
        }

        $config = $app->make('config');
        $providersConfig = $config->get('providers', []);

        // Get app-level global providers first
        $appProviders = array_merge(
            $app->getBuiltInProviders(),
            $config->get('app.providers', [])
        );
        if (Environment::isDebugLog()) {
        }

        // Register app-level providers first (global scope)
        foreach ($appProviders as $provider) {
            if (is_string($provider) && class_exists($provider)) {
                if (Environment::isDebugLog()) {
                }
                $app->register($provider);
            } elseif (Environment::isDebugLog()) {
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
        }

        // Register kernel-specific providers
        foreach ($kernelProviders as $provider) {
            if (is_string($provider) && class_exists($provider)) {
                if (Environment::isDebugLog()) {
                }
                $app->register($provider);
            } elseif (Environment::isDebugLog()) {
            }
        }

        if (Environment::isDebugLog()) {
        }
    }
}
