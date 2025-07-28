<?php

namespace Jankx\Debug;

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
        echo $this->renderer->render($debugData);
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

        // Add AJAX handler
        add_action('wp_ajax_bookix_get_block_debug_info', [$this, 'handleAjaxRequest']);

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

        try {
            // Get debug data
            $debugData = $this->getDebugInfo();

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
                'html_length' => strlen($html)
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
}