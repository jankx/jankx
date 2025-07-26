<?php

namespace Jankx\Debug\Facades;

use Jankx\Debug\DebugServiceProvider;

/**
 * Debug Facade
 *
 * Provides easy access to debug functionality
 *
 * @package Jankx\Debug\Facades
 * @since 2.0.1
 */
class Debug
{
    /**
     * Initialize debug system
     *
     * @since 2.0.1
     */
    public static function init(): void
    {
        DebugServiceProvider::register();
    }

    /**
     * Add plugin debug info
     *
     * @param string $pluginName
     * @param string $info
     * @since 2.0.1
     */
    public static function addPluginInfo(string $pluginName, string $info): void
    {
        DebugServiceProvider::addPluginDebugInfo($pluginName, $info);
    }

    /**
     * Get debug info for testing
     *
     * @return array
     * @since 2.0.1
     */
    public static function getInfo(): array
    {
        $debugInfo = DebugServiceProvider::getDebugInfo();
        return $debugInfo ? $debugInfo->getDebugInfo() : [];
    }

    /**
     * Get query count for testing
     *
     * @return int
     * @since 2.0.1
     */
    public static function getQueryCount(): int
    {
        $debugInfo = DebugServiceProvider::getDebugInfo();
        return $debugInfo ? $debugInfo->getQueryCountForTesting() : 0;
    }
}