<?php

namespace Jankx\Providers;

use Jankx\Facades\Logger;

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
        Logger::debug('DebugServiceProvider::register', [
            'jankx_debug' => defined('JANKX_DEBUG') && JANKX_DEBUG,
            'is_admin' => is_admin(),
            'condition_met' => defined('JANKX_DEBUG') && JANKX_DEBUG && !is_admin()
        ]);

        // Debug services - only register if JANKX_DEBUG is defined and we're in frontend context
        if (defined('JANKX_DEBUG') && JANKX_DEBUG && !is_admin()) {
            Logger::debug('registeringDebugServices', ['start' => true]);

            $this->singleton(\Jankx\Debug\DebugInfo::class);
            $this->singleton(\Jankx\Debug\Services\DebugInfoService::class);
            $this->singleton(\Jankx\Debug\Services\QueryCountService::class);
            $this->singleton(\Jankx\Debug\Services\CacheInfoService::class);
            $this->singleton(\Jankx\Debug\Services\GutenbergBlocksService::class);
            $this->singleton(\Jankx\Debug\Services\PluginDebugService::class);
            $this->singleton(\Jankx\Debug\Renderers\DebugInfoRenderer::class);

            Logger::debug('registeringDebugServices', ['end' => true, 'status' => 'success']);
        } else {
            Logger::debug('registeringDebugServices', ['status' => 'skipped', 'reason' => 'conditions_not_met']);
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
