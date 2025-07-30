<?php

namespace Jankx\Debug\Facades;

use Illuminate\Container\Container;
use Jankx\Providers\DebugServiceProvider;

/**
 * Debug Facade
 *
 * Provides easy access to debug functionality
 *
 * @package Jankx\Debug\Facades
 * @since 2.0.0
 */
class Debug
{
    /**
     * Initialize debug system
     *
     * @param Container $container
     * @since 2.0.0
     */
    public static function init(Container $container): void
    {
        // Debug services are now handled by DebugServiceProvider in Providers namespace
        // This method is kept for backward compatibility
    }

    /**
     * Add plugin debug info
     *
     * @param string $pluginName
     * @param string $info
     * @since 2.0.0
     */
    public static function addPluginInfo(string $pluginName, string $info): void
    {
        // Plugin debug info is now handled by DebugServiceProvider
        // This method is kept for backward compatibility
    }

    /**
     * Get debug info for testing
     *
     * @return array
     * @since 2.0.0
     */
    public static function getInfo(): array
    {
        // Debug info is now handled by DebugServiceProvider
        // This method is kept for backward compatibility
        return [];
    }

    /**
     * Get query count for testing
     *
     * @return int
     * @since 2.0.0
     */
    public static function getQueryCount(): int
    {
        // Query count is now handled by DebugServiceProvider
        // This method is kept for backward compatibility
        return 0;
    }
}
