<?php

namespace Jankx\Bootstrappers\Global;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;
use Jankx\Facades\Logger;

/**
 * Debug Bootstrapper
 *
 * Handles debug functionality initialization
 *
 * @package Jankx\Bootstrappers\Global
 * @since 2.0.1
 */
class DebugBootstrapper extends AbstractBootstrapper
{
    protected $priority = 30;

    public function getName(): string
    {
        return 'debug';
    }

    public function shouldRun(): bool
    {
        return defined('JANKX_DEBUG') && JANKX_DEBUG;
    }

    public function bootstrap(Container $container): void
    {
        try {
            // Initialize debug services
            $this->initializeDebugServices($container);
            
            // Setup debug hooks based on context
            $this->setupDebugHooks();
            
            Logger::debug('Debug bootstrapper initialized', [
                'context' => is_admin() ? 'admin' : 'frontend',
                'services' => $this->getDebugServices()
            ]);
            
        } catch (\Exception $e) {
            Logger::error('Debug bootstrapper error: ' . $e->getMessage(), [
                'exception' => $e,
                'context' => is_admin() ? 'admin' : 'frontend'
            ]);
        }
    }

    /**
     * Initialize debug services
     *
     * @param Container $container
     * @since 2.0.1
     */
    private function initializeDebugServices(Container $container): void
    {
        // Register debug services
        $container->singleton(\Jankx\Debug\Services\DebugInfoService::class);
        $container->singleton(\Jankx\Debug\Services\QueryCountService::class);
        $container->singleton(\Jankx\Debug\Services\CacheInfoService::class);
        $container->singleton(\Jankx\Debug\Services\GutenbergBlocksService::class);
        $container->singleton(\Jankx\Debug\Services\PluginDebugService::class);
        $container->singleton(\Jankx\Debug\Renderers\DebugInfoRenderer::class);
        
        // Register main debug info class
        $container->singleton(\Jankx\Debug\DebugInfo::class, function($container) {
            return new \Jankx\Debug\DebugInfo(
                $container->make(\Jankx\Debug\Services\DebugInfoService::class),
                $container->make(\Jankx\Debug\Services\QueryCountService::class),
                $container->make(\Jankx\Debug\Services\CacheInfoService::class),
                $container->make(\Jankx\Debug\Services\GutenbergBlocksService::class),
                $container->make(\Jankx\Debug\Services\PluginDebugService::class),
                $container->make(\Jankx\Debug\Renderers\DebugInfoRenderer::class)
            );
        });
    }

    /**
     * Setup debug hooks based on context
     *
     * @since 2.0.1
     */
    private function setupDebugHooks(): void
    {
        if (is_admin()) {
            // Admin-specific debug hooks
            add_action('init', [$this, 'initAdminDebugInfo']);
        } else {
            // Frontend-specific debug hooks
            add_action('wp_footer', [$this, 'displayFrontendDebugInfo'], 999);
        }
    }

    /**
     * Initialize admin debug info
     *
     * @since 2.0.1
     */
    public function initAdminDebugInfo(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        try {
            $container = \Jankx\Jankx::getInstance();
            if ($container && $container->bound(\Jankx\Debug\DebugInfo::class)) {
                $debugInfo = $container->make(\Jankx\Debug\DebugInfo::class);
                $debugInfo->initAdminBarDebugInfo();
                
                Logger::debug('Admin debug info initialized');
            }
        } catch (\Exception $e) {
            Logger::error('Failed to initialize admin debug info: ' . $e->getMessage());
        }
    }

    /**
     * Display frontend debug info
     *
     * @since 2.0.1
     */
    public function displayFrontendDebugInfo(): void
    {
        try {
            $container = \Jankx\Jankx::getInstance();
            if ($container && $container->bound(\Jankx\Debug\DebugInfo::class)) {
                $debugInfo = $container->make(\Jankx\Debug\DebugInfo::class);
                $debugInfo->displayDebugInfo();
            }
        } catch (\Exception $e) {
            Logger::error('Failed to display frontend debug info: ' . $e->getMessage());
        }
    }

    /**
     * Get debug services list
     *
     * @return array
     * @since 2.0.1
     */
    private function getDebugServices(): array
    {
        return [
            'DebugInfoService',
            'QueryCountService', 
            'CacheInfoService',
            'GutenbergBlocksService',
            'PluginDebugService',
            'DebugInfoRenderer'
        ];
    }
} 