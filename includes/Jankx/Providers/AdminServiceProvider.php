<?php

namespace Jankx\Providers;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Jankx\Admin\Dashboard;

/**
 * Admin Service Provider
 *
 * Registers and boots admin-specific services
 *
 * @package Jankx\Providers
 * @since 2.0.0
 */
class AdminServiceProvider extends ServiceProvider
{
    /**
     * Method register
     *
     * @since 2.0.0
     */
    public function register()
    {
        // Core admin services - only register classes that actually exist
        $this->singleton('admin.dashboard', Dashboard::class);

        // User service (shared with frontend)
        $this->singleton('user.service', \Jankx\Services\UserService::class);

        // Block parser service (shared with frontend)
        $this->singleton(\Jankx\Services\BlockParserService::class, \Jankx\Services\BlockParserService::class);

        // Deferred service resolver
        $this->singleton(\Jankx\Services\DeferredServiceResolver::class);
        $this->singleton(\Jankx\Services\DeferredServiceMonitor::class);

        // Gutenberg blocks service
        $this->singleton(\Jankx\Services\GutenbergBlocksService::class);

        // Dependencies for GutenbergBlocksService

        $this->singleton(\Jankx\Parsers\BlockParser::class);

        // Config Repository and Service Provider
        $this->singleton('config', \Jankx\Config\Repository::class);
        $this->singleton(\Jankx\Config\Repository::class);
        $this->singleton(\Jankx\Config\ConfigRepositoryInterface::class, \Jankx\Config\Repository::class);

        // Register Config facade
        $this->singleton('config.facade', \Jankx\Facades\Config::class);

        // Note: Other admin services like MenuManager, AssetManager, etc.
        // will be registered when their classes are actually created
        // For now, we only register services that exist in the codebase
    }

    /**
     * Method boot
     *
     * @since 2.0.0
     */
    public function boot()
    {
        // Boot admin dashboard if container has it
        if ($this->container->has('admin.dashboard')) {
            $dashboard = $this->container->make('admin.dashboard');
            if (method_exists($dashboard, 'initialize')) {
                $dashboard->initialize();
            }
        }

        // Boot user service
        if ($this->container->has('user.service')) {
            $userService = $this->container->make('user.service');
            if (method_exists($userService, 'initialize')) {
                $userService->initialize();
            }
        }

        // Boot block parser service
        if ($this->container->has(\Jankx\Services\BlockParserService::class)) {
            $blockParserService = $this->container->make(\Jankx\Services\BlockParserService::class);
            if (method_exists($blockParserService, 'initialize')) {
                $blockParserService->initialize();
            }
        }

        // Boot deferred service resolver
        if ($this->container->has(\Jankx\Services\DeferredServiceResolver::class)) {
            $deferredResolver = $this->container->make(\Jankx\Services\DeferredServiceResolver::class);
            if (method_exists($deferredResolver, 'initialize')) {
                $deferredResolver->initialize();
            }
        }

        // Boot Gutenberg blocks service
        if ($this->container->has(\Jankx\Services\GutenbergBlocksService::class)) {
            $gutenbergBlocksService = $this->container->make(\Jankx\Services\GutenbergBlocksService::class);
            if (method_exists($gutenbergBlocksService, 'initialize')) {
                $gutenbergBlocksService->initialize();
            }
        }
    }
}
