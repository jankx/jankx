<?php

namespace Jankx\Debug;

use Illuminate\Container\Container;
use Jankx\Debug\Facades\Debug;

/**
 * Debug Bootstrap
 *
 * Handles initialization of debug system
 *
 * @package Jankx\Debug
 * @since 2.0.0
 */
class DebugBootstrap
{
    /**
     * Initialize debug system
     *
     * @param Container $container
     * @since 2.0.0
     */
    public static function init(Container $container): void
    {
        // Only initialize if debug is enabled
        if (!defined('JANKX_DEBUG') || !JANKX_DEBUG) {
            return;
        }

        // Initialize debug system
        Debug::init($container);

        // Add action hooks for plugin integration
        add_action('jankx/debug/collect_plugin_info', [self::class, 'collectPluginInfo'], 10, 1);
    }

    /**
     * Collect plugin information
     *
     * @param PluginDebugService $pluginDebugService
     * @since 2.0.0
     */
    public static function collectPluginInfo($pluginDebugService): void
    {
        // Allow plugins to add their debug info
        do_action('jankx/debug/add_plugin_info', $pluginDebugService);
    }

    /**
     * Add plugin debug info
     *
     * @param string $pluginName
     * @param string $info
     * @since 2.0.0
     */
    public static function addPluginDebugInfo(string $pluginName, string $info): void
    {
        Debug::addPluginInfo($pluginName, $info);
    }
}