<?php

namespace Jankx\Config;

use Jankx\Config\Contracts\ConfigRepositoryInterface;
use Jankx\Providers\ServiceProvider;

/**
 * Config Service Provider
 *
 * Registers the Config Repository in the IoC container
 *
 * @package Jankx\Config
 * @since 2.0.0
 */
class ConfigServiceProvider extends ServiceProvider
{
    /**
     * Register services
     */
    public function register(): void
    {
        $this->singleton('config', function() {
            return new Repository();
        });

        $this->singleton(Repository::class, function() {
            return new Repository();
        });

        $this->singleton(ConfigRepositoryInterface::class, function() {
            return new Repository();
        });
    }

    /**
     * Boot services
     */
    public function boot(): void
    {
        // No additional boot logic needed
    }
}