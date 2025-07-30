<?php

namespace Jankx\Providers;

use Jankx\Config\Repository;
use Jankx\Contracts\ConfigRepositoryInterface;

/**
 * Core Service Provider
 *
 * Registers core framework services
 *
 * @package Jankx\Providers
 */
class CoreServiceProvider extends ServiceProvider
{
    /**
     * Register services
     */
    public function register(): void
    {
        \Jankx\Facades\Logger::debug('CoreServiceProvider::register', [
            'status' => 'success',
            'note' => 'Config handled by ConfigBootstrapper'
        ]);

        // Config Repository will be created by ConfigBootstrapper
        // No need to register here as it's handled by bootstrapper
    }

    /**
     * Boot services
     */
    public function boot(): void
    {
        // No additional boot logic needed
    }
}
