<?php

namespace Jankx\Providers;

use Jankx\Debug\DebugInfo;
use Jankx\Debug\Services\DebugInfoService;
use Jankx\Debug\Services\QueryCountService;
use Jankx\Debug\Services\CacheInfoService;
use Jankx\Debug\Services\GutenbergBlocksService;
use Jankx\Debug\Services\PluginDebugService;
use Jankx\Debug\Renderers\DebugInfoRenderer;

/**
 * Debug Service Provider
 *
 * Registers and boots debug-specific services
 *
 * @package Jankx\Providers
 */
class DebugServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Core debug services
        $this->singleton(DebugInfo::class);
        $this->singleton(DebugInfoService::class);
        $this->singleton(QueryCountService::class);
        $this->singleton(CacheInfoService::class);
        $this->singleton(GutenbergBlocksService::class);
        $this->singleton(PluginDebugService::class);
        $this->singleton(DebugInfoRenderer::class);

        // Debug performance monitoring
        $this->singleton(\Jankx\Debug\Services\PerformanceMonitor::class);
        $this->singleton(\Jankx\Debug\Services\MemoryMonitor::class);
        $this->singleton(\Jankx\Debug\Services\QueryMonitor::class);

        // Debug logging and reporting
        $this->singleton(\Jankx\Debug\Services\DebugLogger::class);
        $this->singleton(\Jankx\Debug\Services\DebugReporter::class);
    }

    public function boot()
    {
        // Boot debug info service
        if ($this->container->has(DebugInfoService::class)) {
            $debugInfoService = $this->container->make(DebugInfoService::class);
            if (method_exists($debugInfoService, 'initialize')) {
                $debugInfoService->initialize();
            }
        }

        // Boot query count service
        if ($this->container->has(QueryCountService::class)) {
            $queryCountService = $this->container->make(QueryCountService::class);
            if (method_exists($queryCountService, 'initialize')) {
                $queryCountService->initialize();
            }
        }

        // Boot cache info service
        if ($this->container->has(CacheInfoService::class)) {
            $cacheInfoService = $this->container->make(CacheInfoService::class);
            if (method_exists($cacheInfoService, 'initialize')) {
                $cacheInfoService->initialize();
            }
        }

        // Boot Gutenberg blocks service
        if ($this->container->has(GutenbergBlocksService::class)) {
            $gutenbergBlocksService = $this->container->make(GutenbergBlocksService::class);
            if (method_exists($gutenbergBlocksService, 'initialize')) {
                $gutenbergBlocksService->initialize();
            }
        }

        // Boot plugin debug service
        if ($this->container->has(PluginDebugService::class)) {
            $pluginDebugService = $this->container->make(PluginDebugService::class);
            if (method_exists($pluginDebugService, 'initialize')) {
                $pluginDebugService->initialize();
            }
        }

        // Boot debug renderer
        if ($this->container->has(DebugInfoRenderer::class)) {
            $debugRenderer = $this->container->make(DebugInfoRenderer::class);
            if (method_exists($debugRenderer, 'initialize')) {
                $debugRenderer->initialize();
            }
        }
    }
}