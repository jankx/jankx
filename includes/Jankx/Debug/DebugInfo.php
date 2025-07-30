<?php

namespace Jankx\Debug;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Jankx\Debug\Services\DebugInfoService;
use Jankx\Debug\Services\QueryCountService;
use Jankx\Debug\Services\CacheInfoService;
use Jankx\Debug\Services\GutenbergBlocksService;
use Jankx\Debug\Services\PluginDebugService;
use Jankx\Debug\Renderers\DebugInfoRenderer;
use Jankx\Debug\Contracts\DebugInfoInterface;
use Jankx\Facades\Logger;

/**
 * Debug Information Manager for Jankx Framework
 *
 * Displays response time, cache information, and other debug data
 * when JANKX_DEBUG is enabled.
 *
 * @package Jankx\Debug
 * @since 2.0.0
 */
class DebugInfo implements DebugInfoInterface
{
    /**
     * @var DebugInfoService
     * @since 2.0.0
     */
    private $debugInfoService;

    /**
     * @var QueryCountService
     * @since 2.0.0
     */
    private $queryCountService;

    /**
     * @var CacheInfoService
     * @since 2.0.0
     */
    private $cacheInfoService;

    /**
     * @var GutenbergBlocksService
     * @since 2.0.0
     */
    private $gutenbergBlocksService;

    /**
     * @var PluginDebugService
     * @since 2.0.0
     */
    private $pluginDebugService;

    /**
     * @var DebugInfoRenderer
     * @since 2.0.0
     */
    private $renderer;

    /**
     * @var bool
     * @since 2.0.0
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
     * @since 2.0.0
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
     * @since 2.0.0
     */
    public function init(): void
    {
        Logger::debug('DebugInfo::init', ['shouldInitialize' => $this->shouldInitialize()]);
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
     * @since 2.0.0
     */
    private function shouldInitialize(): bool
    {
        return defined('JANKX_DEBUG') && JANKX_DEBUG && !$this->isInitialized;
    }

    /**
     * Register WordPress hooks
     *
     * @since 2.0.0
     */
    private function registerHooks(): void
    {
        add_action('wp_footer', [$this, 'displayDebugInfo'], 999);
        add_action('admin_footer', [$this, 'displayDebugInfo'], 999);

        // Add cache prevention headers when debug is active
        add_action('wp_head', [$this, 'addCachePreventionHeaders'], 1);
        add_action('admin_head', [$this, 'addCachePreventionHeaders'], 1);

        // Prevent caching by popular optimization plugins
        add_action('init', [$this, 'preventCachingByPlugins']);
    }

    /**
     * Add cache prevention headers for debug information
     *
     * @since 2.0.0
     */
    public function addCachePreventionHeaders(): void
    {
        if (!$this->shouldDisplay()) {
            return;
        }

        // Add no-cache headers to prevent caching of debug info
        header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
        header('Pragma: no-cache');
        header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');

        // Add custom header to identify debug mode
        header('X-Jankx-Debug: active');

        Logger::debug('Cache prevention headers added for debug mode');
    }

    /**
     * Prevent caching by popular WordPress optimization plugins
     *
     * @since 2.0.0
     */
    public function preventCachingByPlugins(): void
    {
        if (!$this->shouldDisplay()) {
            return;
        }

        // Disable WP Rocket caching for debug pages
        if (defined('WP_ROCKET_VERSION')) {
            add_filter('rocket_override_donotcachepage', '__return_true');
            add_filter('rocket_cache_reject_uri', function ($uris) {
                $uris[] = '.*';
                return $uris;
            });
            Logger::debug('WP Rocket caching disabled for debug mode');
        }

        // Disable W3 Total Cache for debug pages
        if (defined('W3TC_VERSION')) {
            add_filter('w3tc_can_cache', '__return_false');
            add_filter('w3tc_can_cache_page', '__return_false');
            Logger::debug('W3 Total Cache disabled for debug mode');
        }

        // Disable WP Super Cache for debug pages
        if (defined('WPCACHEHOME')) {
            add_filter('wp_cache_ob_callback_filter', '__return_false');
            add_filter('do_rocket_generate_caching_files', '__return_false');
            Logger::debug('WP Super Cache disabled for debug mode');
        }

        // Disable Autoptimize for debug pages
        if (defined('AUTOPTIMIZE_PLUGIN_VERSION')) {
            add_filter('autoptimize_filter_js_exclude', function ($exclude) {
                $exclude[] = 'jankx-debug';
                return $exclude;
            });
            add_filter('autoptimize_filter_css_exclude', function ($exclude) {
                $exclude[] = 'jankx-debug';
                return $exclude;
            });
            Logger::debug('Autoptimize exclusions added for debug mode');
        }

        // Disable LiteSpeed Cache for debug pages
        if (defined('LSCWP_V')) {
            add_filter('litespeed_cache_api_control', '__return_false');
            add_filter('litespeed_cache_api_control_force_public', '__return_false');
            Logger::debug('LiteSpeed Cache disabled for debug mode');
        }

        // Disable Hummingbird Cache for debug pages
        if (class_exists('WP_Hummingbird')) {
            add_filter('wphb_cache_control', '__return_false');
            Logger::debug('Hummingbird Cache disabled for debug mode');
        }

        // Disable SG Optimizer for debug pages
        if (defined('SG_CACHEPRESS_VERSION')) {
            add_filter('sgo_js_minify_exclude', function ($exclude) {
                $exclude[] = 'jankx-debug';
                return $exclude;
            });
            add_filter('sgo_css_minify_exclude', function ($exclude) {
                $exclude[] = 'jankx-debug';
                return $exclude;
            });
            Logger::debug('SG Optimizer exclusions added for debug mode');
        }

        // Disable Breeze Cache for debug pages
        if (defined('BREEZE_VERSION')) {
            add_filter('breeze_cache_control', '__return_false');
            Logger::debug('Breeze Cache disabled for debug mode');
        }

        // Disable Swift Performance for debug pages
        if (defined('SWIFT_PERFORMANCE_VERSION')) {
            add_filter('swift_performance_cache_control', '__return_false');
            Logger::debug('Swift Performance Cache disabled for debug mode');
        }

        // Add JavaScript to prevent caching by client-side optimizations
        add_action('wp_head', [$this, 'addClientSideCachePrevention'], 999);
        add_action('admin_head', [$this, 'addClientSideCachePrevention'], 999);
    }

    /**
     * Add client-side cache prevention JavaScript
     *
     * @since 2.0.0
     */
    public function addClientSideCachePrevention(): void
    {
        if (!$this->shouldDisplay()) {
            return;
        }

        echo '<script>
        // Prevent caching of debug information
        if (typeof window !== "undefined") {
            // Clear any existing cache for debug elements
            if (window.caches) {
                caches.keys().then(function(names) {
                    names.forEach(function(name) {
                        caches.delete(name);
                    });
                });
            }

            // Disable service worker caching for debug pages
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (let registration of registrations) {
                        registration.unregister();
                    }
                });
            }

            // Add meta tags to prevent caching
            const meta = document.createElement("meta");
            meta.httpEquiv = "Cache-Control";
            meta.content = "no-cache, no-store, must-revalidate";
            document.head.appendChild(meta);

            const meta2 = document.createElement("meta");
            meta2.httpEquiv = "Pragma";
            meta2.content = "no-cache";
            document.head.appendChild(meta2);

            const meta3 = document.createElement("meta");
            meta3.httpEquiv = "Expires";
            meta3.content = "0";
            document.head.appendChild(meta3);
        }
        </script>';
    }

    /**
     * Display debug information
     *
     * @since 2.0.0
     */
    public function displayDebugInfo(): void
    {
        if (!$this->shouldDisplay()) {
            return;
        }

        $debugData = $this->collectDebugData();

        // Save debug data for cache comparison
        $this->saveDebugDataForComparison($debugData);

        echo $this->renderer->render($debugData);
    }

    /**
     * Save debug data for cache comparison
     *
     * @param array $debugData
     * @since 2.0.0
     */
    private function saveDebugDataForComparison(array $debugData): void
    {
        $cacheKey = 'jankx_debug_cached_' . md5($_SERVER['REQUEST_URI'] ?? '');
        $cacheData = [
            'response_time' => $debugData['response_time'] ?? 0,
            'memory_usage' => $debugData['memory_usage'] ?? 0,
            'query_count' => $debugData['query_count'] ?? 0,
            'timestamp' => time()
        ];

        // Cache for 1 hour
        wp_cache_set($cacheKey, $cacheData, 'jankx_debug', HOUR_IN_SECONDS);

        Logger::debug('Debug data saved for cache comparison', [
            'cache_key' => $cacheKey,
            'data' => $cacheData
        ]);
    }

    /**
     * Check if debug info should be displayed
     *
     * @return bool
     * @since 2.0.0
     */
    private function shouldDisplay(): bool
    {
        return defined('JANKX_DEBUG') && JANKX_DEBUG && $this->isInitialized;
    }

    /**
     * Collect all debug data
     *
     * @return array
     * @since 2.0.0
     */
    private function collectDebugData(): array
    {
        return [
            'response_time' => $this->debugInfoService->getResponseTime(),
            'memory_usage' => $this->debugInfoService->getMemoryUsage(),
            'memory_limit' => $this->debugInfoService->getMemoryLimit(),
            'query_count' => $this->queryCountService->getQueryCount(),
            'cache_info' => $this->cacheInfoService->getCacheInfo(),
            'gutenberg_blocks' => $this->gutenbergBlocksService->forceRefreshBlocksInfo(),
            'plugin_debug' => $this->pluginDebugService->getPluginDebugInfo(),
        ];
    }

    /**
     * Get debug info for testing
     *
     * @return array
     * @since 2.0.0
     */
    public function getDebugInfo(): array
    {
        return $this->collectDebugData();
    }

    /**
     * Get query count for testing
     *
     * @return int
     * @since 2.0.0
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
     * @since 2.0.0
     */
    public function addPluginDebugInfo(string $pluginName, string $info): void
    {
        $this->pluginDebugService->addDebugInfo($pluginName, $info);
    }

    /**
     * Initialize admin bar debug info
     *
     * @since 2.0.0
     */
    public function initAdminBarDebugInfo(): void
    {
        if (!is_admin() || !current_user_can('manage_options')) {
            Logger::debug('Admin debug info skipped - not admin or insufficient permissions');
            return;
        }

        // Add debug button to admin bar
        add_action('admin_bar_menu', [$this, 'addAdminBarMenu'], 999);

        // Add JavaScript
        add_action('admin_footer', [$this, 'addAdminBarJavaScript']);

        // Add AJAX handlers
        add_action('wp_ajax_bookix_get_block_debug_info', [$this, 'handleAjaxRequest']);
        add_action('wp_ajax_bookix_clear_debug_cache', [$this, 'handleClearCacheRequest']);

        Logger::debug('Admin bar debug info initialized', [
            'user_id' => get_current_user_id(),
            'user_caps' => wp_get_current_user()->roles ?? []
        ]);
    }

    /**
     * Add admin bar menu
     *
     * @param \WP_Admin_Bar $wp_admin_bar
     * @since 2.0.0
     */
    public function addAdminBarMenu($wp_admin_bar): void
    {
        $wp_admin_bar->add_menu([
            'id' => 'block-debug-info',
            'title' => '📝 Gutenberg Blocks',
            'href' => '#',
            'meta' => [
                'onclick' => 'bookix_show_block_debug(); return false;'
            ]
        ]);

        // Add clear cache button
        $wp_admin_bar->add_menu([
            'id' => 'clear-debug-cache',
            'title' => '🗑️ Clear Debug Cache',
            'href' => '#',
            'meta' => [
                'onclick' => 'bookix_clear_debug_cache(); return false;'
            ]
        ]);
    }

    /**
     * Add JavaScript for admin bar functionality
     *
     * @since 2.0.0
     */
    public function addAdminBarJavaScript(): void
    {
        echo '<script>
        // Wait for DOM to be ready
        jQuery(document).ready(function($) {
            // State management for debug info
            let debugInfoState = {
                isLoading: false,
                isVisible: false,
                lastRequestTime: 0,
                requestCooldown: 2000 // 2 seconds cooldown
            };

            // Local storage keys
            const DEBUG_STATE_KEY = "jankx_debug_state";

            // Get saved debug state
            function getSavedDebugState() {
                try {
                    const saved = localStorage.getItem(DEBUG_STATE_KEY);
                    return saved ? JSON.parse(saved) : { minimized: false };
                } catch (e) {
                    return { minimized: false };
                }
            }

            // Save debug state
            function saveDebugState(state) {
                try {
                    localStorage.setItem(DEBUG_STATE_KEY, JSON.stringify(state));
                } catch (e) {
                    // Silent fail
                }
            }

            // Toggle debug info minimize/maximize
            function toggleDebugMinimize() {
                const debugBox = document.getElementById("jankx-debug-info");
                const content = debugBox.querySelector(".jankx-debug-content");
                const toggleBtn = document.querySelector(".jankx-debug-close");

                if (!debugBox || !content || !toggleBtn) return;

                const isCurrentlyMinimized = content.style.display === "none";
                const newState = { minimized: !isCurrentlyMinimized };

                if (newState.minimized) {
                    // Minimize
                    content.style.display = "none";
                    toggleBtn.innerHTML = "□";
                    toggleBtn.title = "Expand";
                    debugBox.style.maxWidth = "200px";
                } else {
                    // Maximize
                    content.style.display = "block";
                    toggleBtn.innerHTML = "×";
                    toggleBtn.title = "Minimize";
                    debugBox.style.maxWidth = "400px";
                }

                // Save state
                saveDebugState(newState);
            }

            // Apply saved state to debug box
            function applySavedState(debugBox) {
                const savedState = getSavedDebugState();
                const content = debugBox.querySelector(".jankx-debug-content");
                const toggleBtn = document.querySelector(".jankx-debug-close");

                if (!content || !toggleBtn) return;

                if (savedState.minimized) {
                    // Apply minimized state
                    content.style.display = "none";
                    toggleBtn.innerHTML = "□";
                    toggleBtn.title = "Expand";
                    debugBox.style.maxWidth = "200px";
                } else {
                    // Apply maximized state
                    content.style.display = "block";
                    toggleBtn.innerHTML = "×";
                    toggleBtn.title = "Minimize";
                    debugBox.style.maxWidth = "400px";
                }
            }

            // Make functions globally available
            window.bookix_clear_debug_cache = function() {
                if (confirm("Clear debug cache data? This will reset cache comparison data.")) {
                    fetch("' . admin_url('admin-ajax.php') . '", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: "action=bookix_clear_debug_cache"
                    })
                    .then(response => response.text())
                    .then(result => {
                        alert("Debug cache cleared successfully!");
                    })
                    .catch(error => {
                        alert("Error clearing debug cache. Check console for details.");
                    });
                }
            };

            window.bookix_show_block_debug = function() {
                const now = Date.now();

                // Prevent multiple rapid clicks
                if (debugInfoState.isLoading) {
                    return;
                }

                // Check cooldown period
                if (now - debugInfoState.lastRequestTime < debugInfoState.requestCooldown) {
                    return;
                }

                // Update state
                debugInfoState.isLoading = true;
                debugInfoState.lastRequestTime = now;

                // Update button appearance
                const debugButton = document.querySelector("#wp-admin-bar-block-debug-info a");
                if (debugButton) {
                    debugButton.innerHTML = "⏳ Loading...";
                    debugButton.style.opacity = "0.6";
                }

                // Create AJAX request to get debug info
                fetch("' . admin_url('admin-ajax.php') . '", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: "action=bookix_get_block_debug_info"
                })
                .then(response => response.text())
                .then(html => {
                    // Remove existing debug box
                    const existing = document.getElementById("jankx-debug-info");
                    if (existing) existing.remove();

                    // Only add debug box if there is content (has blocks)
                    if (html.trim() !== "") {
                        document.body.insertAdjacentHTML("beforeend", html);
                        debugInfoState.isVisible = true;

                        // Apply saved state
                        const debugBox = document.getElementById("jankx-debug-info");
                        if (debugBox) {
                            applySavedState(debugBox);
                        }

                        // Add event listeners for minimize/maximize
                        const toggleBtn = document.querySelector(".jankx-debug-close");
                        if (toggleBtn) {
                            toggleBtn.addEventListener("click", toggleDebugMinimize);
                        }

                        // Add close button functionality
                        const closeBtn = document.querySelector("#jankx-debug-info button:last-child");
                        if (closeBtn) {
                            closeBtn.addEventListener("click", function() {
                                const debugBox = document.getElementById("jankx-debug-info");
                                if (debugBox) {
                                    debugBox.remove();
                                    debugInfoState.isVisible = false;
                                }
                            });
                        }
                    } else {
                        alert("No Gutenberg blocks found on this page.");
                    }
                })
                .catch(error => {
                    alert("Error loading block debug info. Check console for details.");
                })
                .finally(() => {
                    debugInfoState.isLoading = false;
                    const debugButton = document.querySelector("#wp-admin-bar-block-debug-info a");
                    if (debugButton) {
                        debugButton.innerHTML = "📝 Gutenberg Blocks";
                        debugButton.style.opacity = "1";
                    }
                });
            };

            // Add hover effects for admin bar button
            const debugButton = document.querySelector("#wp-admin-bar-block-debug-info a");
            if (debugButton) {
                debugButton.addEventListener("mouseenter", function() {
                    this.style.opacity = "0.8";
                });
                debugButton.addEventListener("mouseleave", function() {
                    this.style.opacity = "1";
                });
            }
        });
        </script>';
    }

    /**
     * Handle AJAX request for debug info
     *
     * @since 2.0.0
     */
    public function handleAjaxRequest(): void
    {
        // Check permissions
        if (!current_user_can('manage_options')) {
            Logger::warning('Unauthorized AJAX request for debug info', [
                'user_id' => get_current_user_id(),
                'user_caps' => wp_get_current_user()->roles ?? []
            ]);
            wp_die('Unauthorized');
        }

        // Add cache prevention headers for AJAX response
        $this->addCachePreventionHeaders();

        try {
            // Get debug data for current page (not cached)
            $debugData = $this->getDebugInfo();

            // Get cached version for comparison if available
            $cachedDebugData = $this->getCachedDebugData();

            // Add cache comparison data
            $debugData['cache_comparison'] = $this->compareWithCachedData($debugData, $cachedDebugData);

            // Check if we have Gutenberg blocks
            if (empty($debugData['gutenberg_blocks'])) {
                Logger::debug('No Gutenberg blocks found for AJAX request');
                echo '';
                wp_die();
            }

            // Render debug info
            $html = $this->renderer->render($debugData);

            Logger::debug('AJAX debug info rendered successfully', [
                'blocks_count' => count($debugData['gutenberg_blocks']),
                'html_length' => strlen($html),
                'has_cache_comparison' => !empty($debugData['cache_comparison'])
            ]);

            echo $html;
            wp_die();
        } catch (\Exception $e) {
            Logger::error('Failed to handle AJAX debug request', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            wp_die('Error loading debug info');
        }
    }

    /**
     * Get cached debug data for comparison
     *
     * @return array
     * @since 2.0.0
     */
    private function getCachedDebugData(): array
    {
        $cacheKey = 'jankx_debug_cached_' . md5($_SERVER['REQUEST_URI'] ?? '');
        $cachedData = wp_cache_get($cacheKey, 'jankx_debug');

        if ($cachedData === false) {
            return [];
        }

        return $cachedData;
    }

    /**
     * Compare current debug data with cached data
     *
     * @param array $currentData
     * @param array $cachedData
     * @return array
     * @since 2.0.0
     */
    private function compareWithCachedData(array $currentData, array $cachedData): array
    {
        if (empty($cachedData)) {
            return [
                'has_cached_data' => false,
                'message' => 'No cached data available for comparison'
            ];
        }

        $comparison = [
            'has_cached_data' => true,
            'response_time' => [
                'current' => $currentData['response_time'] ?? 0,
                'cached' => $cachedData['response_time'] ?? 0,
                'difference' => ($currentData['response_time'] ?? 0) - ($cachedData['response_time'] ?? 0),
                'improvement' => (($cachedData['response_time'] ?? 0) - ($currentData['response_time'] ?? 0)) / ($cachedData['response_time'] ?? 1) * 100
            ],
            'memory_usage' => [
                'current' => $currentData['memory_usage'] ?? 0,
                'cached' => $cachedData['memory_usage'] ?? 0,
                'difference' => ($currentData['memory_usage'] ?? 0) - ($cachedData['memory_usage'] ?? 0),
                'improvement' => (($cachedData['memory_usage'] ?? 0) - ($currentData['memory_usage'] ?? 0)) / ($cachedData['memory_usage'] ?? 1) * 100
            ],
            'query_count' => [
                'current' => $currentData['query_count'] ?? 0,
                'cached' => $cachedData['query_count'] ?? 0,
                'difference' => ($currentData['query_count'] ?? 0) - ($cachedData['query_count'] ?? 0),
                'improvement' => (($cachedData['query_count'] ?? 0) - ($currentData['query_count'] ?? 0)) / ($cachedData['query_count'] ?? 1) * 100
            ]
        ];

        return $comparison;
    }

    /**
     * Clear cached debug data
     *
     * @since 2.0.0
     */
    public function clearCachedDebugData(): void
    {
        $cacheKey = 'jankx_debug_cached_' . md5($_SERVER['REQUEST_URI'] ?? '');
        wp_cache_delete($cacheKey, 'jankx_debug');

        Logger::debug('Cached debug data cleared', [
            'cache_key' => $cacheKey
        ]);
    }

    /**
     * Handle AJAX request to clear debug cache
     *
     * @since 2.0.0
     */
    public function handleClearCacheRequest(): void
    {
        // Check permissions
        if (!current_user_can('manage_options')) {
            Logger::warning('Unauthorized AJAX request to clear debug cache', [
                'user_id' => get_current_user_id(),
                'user_caps' => wp_get_current_user()->roles ?? []
            ]);
            wp_die('Unauthorized');
        }

        try {
            $this->clearCachedDebugData();

            Logger::debug('Debug cache cleared via AJAX request', [
                'user_id' => get_current_user_id()
            ]);

            echo 'success';
            wp_die();
        } catch (\Exception $e) {
            Logger::error('Failed to clear debug cache via AJAX', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            wp_die('Error clearing debug cache');
        }
    }
}
