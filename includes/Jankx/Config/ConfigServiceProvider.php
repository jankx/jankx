<?php

namespace Jankx\Config;

use Jankx\Providers\ServiceProvider;

/**
 * Config Service Provider
 *
 * Registers and boots config-related services
 *
 * @package Jankx\Config
 * @since 2.0.0
 */
class ConfigServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Register Config Repository as singleton
        $this->singleton('config', Repository::class);

        // Register Config Repository with its interface
        $this->singleton(Repository::class, Repository::class);
    }

    public function boot()
    {
        // Boot config repository if needed
        if ($this->container->has('config')) {
            $config = $this->container->make('config');
            if (method_exists($config, 'initialize')) {
                $config->initialize();
            }
        }
    }
}