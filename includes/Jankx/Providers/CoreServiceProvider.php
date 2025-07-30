<?php

namespace Jankx\Providers;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Jankx\Config\Repository;
use Jankx\Contracts\ConfigRepositoryInterface;

/**
 * Core Service Provider
 *
 * Registers core framework services
 *
 * @package Jankx\Providers
 * @since 2.0.0
 */
class CoreServiceProvider extends ServiceProvider
{
    /**
     * Register services
     * @since 2.0.0
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
     * @since 2.0.0
     */
    public function boot(): void
    {
        // No additional boot logic needed
    }
}
