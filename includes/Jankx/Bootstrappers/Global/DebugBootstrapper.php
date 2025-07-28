<?php

namespace Jankx\Bootstrappers\Global;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;
use Jankx\Facades\Logger;
use Jankx\Helpers\ErrorHandlingHelper;
use Jankx\Helpers\BootstrapperHelper;

/**
 * Debug Bootstrapper
 *
 * Handles debug functionality initialization
 *
 * @package Jankx\Bootstrappers\Global
 * @since 2.0.0
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

    /**
     * Bootstrap the application
     */
    public function bootstrap(Container $container): void
    {
        // Register DebugServiceProvider instead of registering services directly
        $debugProvider = new \Jankx\Providers\DebugServiceProvider($container);
        $debugProvider->register();
        $debugProvider->boot();

        // Initialize debug info if needed
        if ($container->has(\Jankx\Debug\DebugInfo::class)) {
            $debugInfo = $container->make(\Jankx\Debug\DebugInfo::class);
            if (method_exists($debugInfo, 'init')) {
                $debugInfo->init();
            }
        }
    }

    /**
     * Setup debug hooks based on context
     *
     * @since 2.0.0
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
     * @since 2.0.0
     */
    public function initAdminDebugInfo(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        ErrorHandlingHelper::safeExecute(function() {
            $container = BootstrapperHelper::getGlobalContainer();
            if ($container && $container->bound(\Jankx\Debug\DebugInfo::class)) {
                $debugInfo = $container->make(\Jankx\Debug\DebugInfo::class);
                $debugInfo->initAdminBarDebugInfo();

                Logger::debug('Admin debug info initialized');
            }
        }, 'DebugBootstrapper initAdminDebugInfo');
    }

    /**
     * Display frontend debug info
     *
     * @since 2.0.0
     */
    public function displayFrontendDebugInfo(): void
    {
        ErrorHandlingHelper::safeExecute(function() {
            $container = BootstrapperHelper::getGlobalContainer();
            if ($container && $container->bound(\Jankx\Debug\DebugInfo::class)) {
                $debugInfo = $container->make(\Jankx\Debug\DebugInfo::class);
                $debugInfo->displayDebugInfo();
            }
        }, 'DebugBootstrapper displayFrontendDebugInfo');
    }

    /**
     * Get debug services list
     *
     * @return array
     * @since 2.0.0
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