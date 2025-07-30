<?php

namespace Jankx\Providers;

use Jankx\Services\UserService;
use Jankx\Services\BlockParserService;

/**
 * Frontend Service Provider
 *
 * Registers and boots frontend-specific services
 *
 * @package Jankx\Providers
 */
class FrontendServiceProvider extends ServiceProvider
{
    public function register()
    {
        \Jankx\Facades\Logger::debug('FrontendServiceProvider::register', ['start' => true]);

        // Core frontend services - only register classes that actually exist
        $this->singleton('user.service', UserService::class);
        $this->singleton(\Jankx\Services\BlockParserService::class, \Jankx\Services\BlockParserService::class);

        // Deferred service resolver
        $this->singleton(\Jankx\Services\DeferredServiceResolver::class);
        $this->singleton(\Jankx\Services\DeferredServiceMonitor::class);

        // Gutenberg blocks service
        $this->singleton(\Jankx\Services\GutenbergBlocksService::class);

        // Dependencies for GutenbergBlocksService

        $this->singleton(\Jankx\Parsers\BlockParser::class);

        // Config Repository
        $this->singleton('config', \Jankx\Config\Repository::class);
        $this->singleton(\Jankx\Config\Repository::class);

        \Jankx\Facades\Logger::debug('FrontendServiceProvider::register', ['end' => true, 'status' => 'success']);

        // Note: Other services like TemplateRenderer, SEOManager, etc.
        // will be registered when their classes are actually created
        // For now, we only register services that exist in the codebase
    }

    public function boot()
    {
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
