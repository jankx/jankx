<?php

namespace Jankx\Debug;

use Jankx\Debug\Services\DebugInfoService;
use Jankx\Debug\Services\QueryCountService;
use Jankx\Debug\Services\CacheInfoService;
use Jankx\Debug\Services\GutenbergBlocksService;
use Jankx\Debug\Services\PluginDebugService;
use Jankx\Debug\Renderers\DebugInfoRenderer;
use Jankx\Debug\Contracts\DebugInfoInterface;
use Jankx\Debug\Contracts\QueryCountInterface;
use Jankx\Debug\Contracts\CacheInfoInterface;
use Jankx\Debug\Contracts\GutenbergBlocksInterface;
use Jankx\Debug\Contracts\PluginDebugInterface;
use Jankx\Debug\Contracts\DebugInfoRendererInterface;

/**
 * Debug Service Provider
 *
 * Registers debug-related services and dependencies
 *
 * @package Jankx\Debug
 * @since 2.0.1
 */
class DebugServiceProvider
{
    /**
     * @var DebugInfoInterface
     * @since 2.0.1
     */
    private static $debugInfo;

    /**
     * Register debug services
     *
     * @since 2.0.1
     */
    public static function register(): void
    {
        if (!defined('JANKX_DEBUG') || !JANKX_DEBUG) {
            return;
        }

        // Create service instances
        $debugInfoService = new DebugInfoService();
        $queryCountService = new QueryCountService();
        $cacheInfoService = new CacheInfoService();
        $gutenbergBlocksService = new GutenbergBlocksService();
        $pluginDebugService = new PluginDebugService();
        $renderer = new DebugInfoRenderer();

        // Create main debug info instance with dependency injection
        self::$debugInfo = new DebugInfo(
            $debugInfoService,
            $queryCountService,
            $cacheInfoService,
            $gutenbergBlocksService,
            $pluginDebugService,
            $renderer
        );

        // Initialize debug system
        self::$debugInfo->init();
    }

    /**
     * Get debug info instance
     *
     * @return DebugInfoInterface|null
     * @since 2.0.1
     */
    public static function getDebugInfo(): ?DebugInfoInterface
    {
        return self::$debugInfo;
    }

    /**
     * Add plugin debug info
     *
     * @param string $pluginName
     * @param string $info
     * @since 2.0.1
     */
    public static function addPluginDebugInfo(string $pluginName, string $info): void
    {
        if (self::$debugInfo) {
            self::$debugInfo->addPluginDebugInfo($pluginName, $info);
        }
    }
}