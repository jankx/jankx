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
 * Debug Information Manager for Jankx Framework
 *
 * Displays response time, cache information, and other debug data
 * when JANKX_DEBUG is enabled.
 *
 * @package Jankx\Debug
 * @since 2.0.1
 */
class DebugInfo implements DebugInfoInterface
{
    /**
     * @var DebugInfoService
     * @since 2.0.1
     */
    private $debugInfoService;

    /**
     * @var QueryCountService
     * @since 2.0.1
     */
    private $queryCountService;

    /**
     * @var CacheInfoService
     * @since 2.0.1
     */
    private $cacheInfoService;

    /**
     * @var GutenbergBlocksService
     * @since 2.0.1
     */
    private $gutenbergBlocksService;

    /**
     * @var PluginDebugService
     * @since 2.0.1
     */
    private $pluginDebugService;

    /**
     * @var DebugInfoRenderer
     * @since 2.0.1
     */
    private $renderer;

    /**
     * @var bool
     * @since 2.0.1
     */
    private $isInitialized = false;

    /**
     * Constructor with dependency injection
     *
     * @param DebugInfoService $debugInfoService
     * @param QueryCountService $queryCountService
     * @param CacheInfoService $cacheInfoService
     * @param GutenbergBlocksService $gutenbergBlocksService
     * @param PluginDebugService $pluginDebugService
     * @param DebugInfoRenderer $renderer
     * @since 2.0.1
     */
    public function __construct(
        DebugInfoService $debugInfoService,
        QueryCountService $queryCountService,
        CacheInfoService $cacheInfoService,
        GutenbergBlocksService $gutenbergBlocksService,
        PluginDebugService $pluginDebugService,
        DebugInfoRenderer $renderer
    ) {
        $this->debugInfoService = $debugInfoService;
        $this->queryCountService = $queryCountService;
        $this->cacheInfoService = $cacheInfoService;
        $this->gutenbergBlocksService = $gutenbergBlocksService;
        $this->pluginDebugService = $pluginDebugService;
        $this->renderer = $renderer;
    }

    /**
     * Initialize debug tracking
     *
     * @since 2.0.1
     */
    public function init(): void
    {
        if (!$this->shouldInitialize()) {
            return;
        }

        $this->debugInfoService->startTracking();
        $this->queryCountService->startTracking();
        $this->cacheInfoService->captureInfo();
        $this->gutenbergBlocksService->captureInfo();
        $this->pluginDebugService->captureInfo();

        $this->registerHooks();
        $this->isInitialized = true;
    }

    /**
     * Check if debug should be initialized
     *
     * @return bool
     * @since 2.0.1
     */
    private function shouldInitialize(): bool
    {
        return defined('JANKX_DEBUG') && JANKX_DEBUG && !$this->isInitialized;
    }

    /**
     * Register WordPress hooks
     *
     * @since 2.0.1
     */
    private function registerHooks(): void
    {
        add_action('wp_footer', [$this, 'displayDebugInfo'], 999);
        add_action('admin_footer', [$this, 'displayDebugInfo'], 999);
    }

    /**
     * Display debug information
     *
     * @since 2.0.1
     */
    public function displayDebugInfo(): void
    {
        if (!$this->shouldDisplay()) {
            return;
        }

        $debugData = $this->collectDebugData();
        echo $this->renderer->render($debugData);
    }

    /**
     * Check if debug info should be displayed
     *
     * @return bool
     * @since 2.0.1
     */
    private function shouldDisplay(): bool
    {
        return defined('JANKX_DEBUG') && JANKX_DEBUG && $this->isInitialized;
    }

    /**
     * Collect all debug data
     *
     * @return array
     * @since 2.0.1
     */
    private function collectDebugData(): array
    {
        return [
            'response_time' => $this->debugInfoService->getResponseTime(),
            'memory_usage' => $this->debugInfoService->getMemoryUsage(),
            'memory_limit' => $this->debugInfoService->getMemoryLimit(),
            'query_count' => $this->queryCountService->getQueryCount(),
            'cache_info' => $this->cacheInfoService->getCacheInfo(),
            'gutenberg_blocks' => $this->gutenbergBlocksService->getBlocksInfo(),
            'plugin_debug' => $this->pluginDebugService->getPluginDebugInfo(),
        ];
    }

    /**
     * Get debug info for testing
     *
     * @return array
     * @since 2.0.1
     */
    public function getDebugInfo(): array
    {
        return $this->collectDebugData();
    }

    /**
     * Get query count for testing
     *
     * @return int
     * @since 2.0.1
     */
    public function getQueryCountForTesting(): int
    {
        return $this->queryCountService->getQueryCount();
    }

    /**
     * Add plugin debug info
     *
     * @param string $pluginName
     * @param string $info
     * @since 2.0.1
     */
    public function addPluginDebugInfo(string $pluginName, string $info): void
    {
        $this->pluginDebugService->addDebugInfo($pluginName, $info);
    }
}