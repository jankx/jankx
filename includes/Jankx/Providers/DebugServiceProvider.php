<?php

namespace Jankx\Providers;

/**
 * Debug Service Provider
 *
 * Registers and boots debug-specific services only in frontend context
 *
 * @package Jankx\Providers
 */
class DebugServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Debug services - only register if JANKX_DEBUG is defined and we're in frontend context
        if (defined('JANKX_DEBUG') && JANKX_DEBUG && !is_admin()) {
            $this->singleton(\Jankx\Debug\DebugInfo::class);
            $this->singleton(\Jankx\Debug\Services\DebugInfoService::class);
            $this->singleton(\Jankx\Debug\Services\QueryCountService::class);
            $this->singleton(\Jankx\Debug\Services\CacheInfoService::class);
            $this->singleton(\Jankx\Debug\Services\GutenbergBlocksService::class);
            $this->singleton(\Jankx\Debug\Services\PluginDebugService::class);
            $this->singleton(\Jankx\Debug\Renderers\DebugInfoRenderer::class);
            $this->singleton(\Jankx\Debug\Services\PerformanceMonitor::class);
            $this->singleton(\Jankx\Debug\Services\MemoryMonitor::class);
            $this->singleton(\Jankx\Debug\Services\QueryMonitor::class);
            $this->singleton(\Jankx\Debug\Services\DebugLogger::class);
            $this->singleton(\Jankx\Debug\Services\DebugReporter::class);
        }
    }

    public function boot()
    {
        // Boot debug services - only if JANKX_DEBUG is defined and we're in frontend context
        if (defined('JANKX_DEBUG') && JANKX_DEBUG && !is_admin()) {
            $this->bootDebugServices();
        }
    }

    /**
     * Boot debug services
     */
    private function bootDebugServices(): void
    {
        $debugServices = [
            \Jankx\Debug\Services\DebugInfoService::class,
            \Jankx\Debug\Services\QueryCountService::class,
            \Jankx\Debug\Services\CacheInfoService::class,
            \Jankx\Debug\Services\GutenbergBlocksService::class,
            \Jankx\Debug\Services\PluginDebugService::class,
            \Jankx\Debug\Renderers\DebugInfoRenderer::class,
        ];

        foreach ($debugServices as $serviceClass) {
            if ($this->container->has($serviceClass)) {
                $service = $this->container->make($serviceClass);
                if (method_exists($service, 'initialize')) {
                    $service->initialize();
                }
            }
        }
    }

    /**
     * Check if service provider should load
     *
     * @return bool
     */
    public function shouldLoad(): bool
    {
        return defined('JANKX_DEBUG') && JANKX_DEBUG && !is_admin();
    }
}