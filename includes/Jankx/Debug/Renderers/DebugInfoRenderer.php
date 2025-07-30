<?php

namespace Jankx\Debug\Renderers;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Jankx\Debug\Contracts\DebugInfoRendererInterface;

/**
 * Debug Info Renderer
 *
 * Renders debug information as HTML with embedded CSS and JS
 *
 * @package Jankx\Debug\Renderers
 * @since 2.0.0
 */
class DebugInfoRenderer implements DebugInfoRendererInterface
{
    /**
     * Render debug information
     *
     * @param array $debugData
     * @return string
     * @since 2.0.0
     */
    public function render(array $debugData): string
    {
        $html = $this->generateDebugHtml($debugData);
        return $html;
    }

    /**
     * Generate debug HTML
     *
     * @param array $debugData
     * @return string
     * @since 2.0.0
     */
    private function generateDebugHtml(array $debugData): string
    {
        $responseTime = $debugData['response_time'] ?? 0;
        $memoryUsage = $debugData['memory_usage'] ?? 0;
        $memoryLimit = $debugData['memory_limit'] ?? 0;
        $queryCount = $debugData['query_count'] ?? 0;

        $html = '<div id="jankx-debug-info" class="jankx-debug-panel">';
        $html .= $this->renderStyles();
        $html .= $this->renderScripts();

        $html .= '<div class="jankx-debug-header">';
        $html .= '<div class="jankx-debug-title">🐛 Jankx Debug Info</div>';
        $html .= '<div class="jankx-debug-close">×</div>';
        $html .= '</div>';

        // Minimized info (always visible)
        $html .= '<div class="jankx-debug-minimized">';
        $html .= '<div class="jankx-debug-mini-info">';
        $html .= '<span class="mini-item">⏱️ ' . number_format($responseTime, 3) . 's</span>';
        $html .= '<span class="mini-item">💾 ' . $this->formatBytes($memoryUsage) . '</span>';
        $html .= '<span class="mini-item">🗄️ ' . $queryCount . ' queries</span>';
        $html .= '</div>';
        $html .= '</div>';

        // Full content (toggleable)
        $html .= '<div class="jankx-debug-content">';

        // Performance Info
        $html .= '<div class="jankx-debug-section">';
        $html .= '<div class="jankx-debug-section-title">⚡ Performance Info</div>';
        $html .= '<ul class="jankx-debug-list">';
        $html .= '<li><strong>Response Time:</strong> ' . number_format($responseTime, 4) . 's</li>';
        $html .= '<li><strong>Memory Usage:</strong> ' . $this->formatBytes($memoryUsage) . '</li>';
        $html .= '<li><strong>Memory Limit:</strong> ' . $this->formatBytes($memoryLimit) . '</li>';
        $html .= '<li><strong>Memory Usage %:</strong> ' . $this->calculateMemoryUsagePercentage($memoryUsage, $memoryLimit) . '%</li>';
        $html .= '</ul>';
        $html .= '</div>';

        // Query Count
        $html .= '<div class="jankx-debug-section">';
        $html .= '<div class="jankx-debug-section-title">🗄️ Database Queries</div>';
        $html .= '<ul class="jankx-debug-list">';
        $html .= '<li><strong>Total Queries:</strong> ' . $queryCount . '</li>';
        $html .= '</ul>';
        $html .= '</div>';

        // Cache Info
        $cacheInfo = $debugData['cache_info'] ?? [];
        if (!empty($cacheInfo)) {
            $html .= $this->renderCacheInfo($cacheInfo);
        }

        // Gutenberg Blocks Info
        $gutenbergBlocks = $debugData['gutenberg_blocks'] ?? [];
        if (!empty($gutenbergBlocks)) {
            $html .= $this->renderGutenbergBlocksInfo($gutenbergBlocks);
        }

        // Plugin Debug Info
        $pluginDebugInfo = $debugData['plugin_debug'] ?? [];
        if (!empty($pluginDebugInfo)) {
            $html .= $this->renderPluginDebugInfo($pluginDebugInfo);
        }

        // Cache Comparison Info
        $cacheComparison = $debugData['cache_comparison'] ?? [];
        if (!empty($cacheComparison)) {
            $html .= $this->renderCacheComparisonInfo($cacheComparison);
        }

        $html .= '</div>'; // End content wrapper
        $html .= '</div>'; // End main div

        return $html;
    }

    /**
     * Render cache information
     *
     * @param array $cacheInfo
     * @return string
     * @since 2.0.0
     */
    private function renderCacheInfo(array $cacheInfo): string
    {
        $html = '<div class="jankx-debug-section">';
        $html .= '<div class="jankx-debug-section-title">💾 Cache Info</div>';
        $html .= '<ul class="jankx-debug-list">';

        // Object Cache
        $objectCache = $cacheInfo['object_cache'] ?? [];
        if (!empty($objectCache)) {
            $html .= '<li><strong>Object Cache:</strong> ' . ($objectCache['enabled'] ? 'Enabled' : 'Disabled') . '</li>';
            if ($objectCache['enabled']) {
                $html .= '<li><strong>Cache Type:</strong> ' . esc_html($objectCache['type']) . '</li>';

                $stats = $objectCache['stats'] ?? [];
                if (!empty($stats)) {
                    $html .= '<li><strong>Hit Rate:</strong> ' . ($stats['hit_rate'] ?? 0) . '%</li>';
                    $html .= '<li><strong>Hits:</strong> ' . ($stats['hits'] ?? 0) . '</li>';
                    $html .= '<li><strong>Misses:</strong> ' . ($stats['misses'] ?? 0) . '</li>';
                }
            }
        }

        // Transients
        $transients = $cacheInfo['transients'] ?? [];
        if (!empty($transients)) {
            $html .= '<li><strong>Transients:</strong> ' . ($transients['count'] ?? 0) . ' items</li>';
            $html .= '<li><strong>Transient Size:</strong> ' . $this->formatBytes($transients['size'] ?? 0) . '</li>';
        }

        // Plugin Cache
        $plugins = $cacheInfo['plugins'] ?? [];
        if (!empty($plugins)) {
            foreach ($plugins as $pluginName => $pluginInfo) {
                $html .= '<li><strong>' . esc_html($pluginName) . ':</strong> ' . esc_html($pluginInfo['status'] ?? 'Unknown') . '</li>';
            }
        }

        $html .= '</ul>';
        $html .= '</div>';

        return $html;
    }

    /**
     * Render Gutenberg blocks information
     *
     * @param array $gutenbergBlocks
     * @return string
     * @since 2.0.0
     */
    private function renderGutenbergBlocksInfo(array $gutenbergBlocks): string
    {
        $html = '<div class="jankx-debug-section">';
        $html .= '<div class="jankx-debug-section-title">📝 Gutenberg Blocks</div>';
        $html .= '<ul class="jankx-debug-list">';

        $totalBlocks = $gutenbergBlocks['total_blocks'] ?? 0;
        $uniqueBlockTypes = $gutenbergBlocks['unique_block_types'] ?? count($gutenbergBlocks['block_types'] ?? []);

        $html .= '<li><strong>Total Blocks:</strong> ' . $totalBlocks . '</li>';
        $html .= '<li><strong>Unique Block Types:</strong> ' . $uniqueBlockTypes . '</li>';

        // Show block theme info
        if (function_exists('wp_is_block_theme')) {
            $isBlockTheme = wp_is_block_theme();
            $html .= '<li><strong>Block Theme:</strong> ' . ($isBlockTheme ? 'Yes' : 'No') . '</li>';
        }

        $blockTypes = $gutenbergBlocks['block_types'] ?? [];
        if (!empty($blockTypes)) {
            $html .= '<li><strong>Block Types:</strong></li>';
            $html .= '<li><ul class="jankx-debug-sublist">';
            foreach ($blockTypes as $blockType => $count) {
                $html .= '<li>' . esc_html($blockType) . ': ' . $count . '</li>';
            }
            $html .= '</ul></li>';
        } else {
            $html .= '<li><strong>Block Types:</strong> None detected</li>';
        }

        $html .= '</ul>';
        $html .= '</div>';

        return $html;
    }

    /**
     * Render plugin debug information
     *
     * @param array $pluginDebugInfo
     * @return string
     * @since 2.0.0
     */
    private function renderPluginDebugInfo(array $pluginDebugInfo): string
    {
        $html = '<div class="jankx-debug-section">';
        $html .= '<div class="jankx-debug-section-title">🔌 Plugin Debug Info</div>';
        $html .= '<ul class="jankx-debug-list">';

        foreach ($pluginDebugInfo as $plugin => $info) {
            $html .= '<li><strong>' . esc_html($plugin) . ':</strong> ' . esc_html($info) . '</li>';
        }

        $html .= '</ul>';
        $html .= '</div>';

        return $html;
    }

    /**
     * Render cache comparison information
     *
     * @param array $cacheComparison
     * @return string
     * @since 2.0.0
     */
    private function renderCacheComparisonInfo(array $cacheComparison): string
    {
        $html = '<div class="jankx-debug-section">';
        $html .= '<div class="jankx-debug-section-title">⚡ Cache vs No-Cache Comparison</div>';
        $html .= '<ul class="jankx-debug-list">';

        if (!$cacheComparison['has_cached_data']) {
            $html .= '<li><em>' . esc_html($cacheComparison['message']) . '</em></li>';
            $html .= '</ul>';
            $html .= '</div>';
            return $html;
        }

        // Response Time Comparison
        $responseTime = $cacheComparison['response_time'];
        $html .= '<li><strong>Response Time:</strong></li>';
        $html .= '<li><ul class="jankx-debug-sublist">';
        $html .= '<li>Current: ' . number_format($responseTime['current'], 4) . 's</li>';
        $html .= '<li>Cached: ' . number_format($responseTime['cached'], 4) . 's</li>';
        $html .= '<li>Difference: ' . number_format($responseTime['difference'], 4) . 's</li>';
        $html .= '<li>Improvement: ' . number_format($responseTime['improvement'], 1) . '%</li>';
        $html .= '</ul></li>';

        // Memory Usage Comparison
        $memoryUsage = $cacheComparison['memory_usage'];
        $html .= '<li><strong>Memory Usage:</strong></li>';
        $html .= '<li><ul class="jankx-debug-sublist">';
        $html .= '<li>Current: ' . $this->formatBytes($memoryUsage['current']) . '</li>';
        $html .= '<li>Cached: ' . $this->formatBytes($memoryUsage['cached']) . '</li>';
        $html .= '<li>Difference: ' . $this->formatBytes($memoryUsage['difference']) . '</li>';
        $html .= '<li>Improvement: ' . number_format($memoryUsage['improvement'], 1) . '%</li>';
        $html .= '</ul></li>';

        // Query Count Comparison
        $queryCount = $cacheComparison['query_count'];
        $html .= '<li><strong>Database Queries:</strong></li>';
        $html .= '<li><ul class="jankx-debug-sublist">';
        $html .= '<li>Current: ' . $queryCount['current'] . ' queries</li>';
        $html .= '<li>Cached: ' . $queryCount['cached'] . ' queries</li>';
        $html .= '<li>Difference: ' . $queryCount['difference'] . ' queries</li>';
        $html .= '<li>Improvement: ' . number_format($queryCount['improvement'], 1) . '%</li>';
        $html .= '</ul></li>';

        $html .= '</ul>';
        $html .= '</div>';

        return $html;
    }

    /**
     * Render CSS styles
     *
     * @return string
     * @since 2.0.0
     */
    private function renderStyles(): string
    {
        return '<style>
            #jankx-debug-info {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 400px;
                max-height: 600px;
                background: #1a1a1a;
                color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 12px;
                line-height: 1.4;
                z-index: 999999;
                overflow: hidden;
                transition: all 0.3s ease;
            }

            #jankx-debug-info.collapsed {
                height: auto;
                max-height: 80px;
                overflow: visible;
            }

            #jankx-debug-info.collapsed .jankx-debug-content {
                display: none;
            }

            .jankx-debug-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: #2d2d2d;
                border-bottom: 1px solid #404040;
                cursor: pointer;
                position: sticky;
                top: 0;
                z-index: 10;
            }

            .jankx-debug-title {
                font-weight: 600;
                font-size: 13px;
            }

            .jankx-debug-close {
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                color: #888;
                transition: color 0.2s ease;
                padding: 4px 8px;
                border-radius: 4px;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }

            .jankx-debug-close:hover {
                color: #fff;
                background: rgba(255, 255, 255, 0.1);
            }

            .jankx-debug-close:active {
                background: rgba(255, 255, 255, 0.2);
            }

            .jankx-debug-minimized {
                padding: 8px 16px;
                background: #1a1a1a;
                border-bottom: 1px solid #404040;
            }

            .jankx-debug-mini-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
                color: #ccc;
            }

            .mini-item {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .jankx-debug-content {
                max-height: 500px;
                overflow-y: auto;
                padding: 0;
                transition: all 0.3s ease;
            }

            .jankx-debug-section {
                border-bottom: 1px solid #404040;
                padding: 12px 16px;
            }

            .jankx-debug-section:last-child {
                border-bottom: none;
            }

            .jankx-debug-section-title {
                font-weight: 600;
                margin-bottom: 8px;
                color: #4CAF50;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .jankx-debug-list {
                list-style: none;
                margin: 0;
                padding: 0;
            }

            .jankx-debug-list li {
                margin-bottom: 4px;
                padding: 2px 0;
            }

            .jankx-debug-list li strong {
                color: #FFD700;
                font-weight: 600;
            }

            .jankx-debug-sublist {
                list-style: none;
                margin: 8px 0 0 16px;
                padding: 0;
                border-left: 2px solid #404040;
                padding-left: 12px;
            }

            .jankx-debug-sublist li {
                margin-bottom: 2px;
                font-size: 11px;
                color: #ccc;
            }

            /* Cache comparison styling */
            .jankx-debug-sublist li:last-child {
                color: #4CAF50;
                font-weight: 600;
            }

            .jankx-debug-sublist li:nth-last-child(2) {
                color: #FF9800;
            }

            /* Scrollbar styling */
            .jankx-debug-content::-webkit-scrollbar {
                width: 6px;
            }

            .jankx-debug-content::-webkit-scrollbar-track {
                background: #2d2d2d;
            }

            .jankx-debug-content::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 3px;
            }

            .jankx-debug-content::-webkit-scrollbar-thumb:hover {
                background: #777;
            }

            /* Responsive */
            @media (max-width: 768px) {
                #jankx-debug-info {
                    width: calc(100vw - 40px);
                    right: 20px;
                    left: 20px;
                }
            }
        </style>';
    }

    /**
     * Render JavaScript
     *
     * @return string
     * @since 2.0.0
     */
    private function renderScripts(): string
    {
        return '<script>
            function toggleJankxDebug() {
                const debugPanel = document.getElementById("jankx-debug-info");
                const closeBtn = document.querySelector(".jankx-debug-close");

                if (debugPanel) {
                    const isCollapsed = debugPanel.classList.contains("collapsed");

                    if (isCollapsed) {
                        // Expand
                        debugPanel.classList.remove("collapsed");
                        if (closeBtn) {
                            closeBtn.innerHTML = "×";
                            closeBtn.title = "Minimize";
                        }
                    } else {
                        // Collapse
                        debugPanel.classList.add("collapsed");
                        if (closeBtn) {
                            closeBtn.innerHTML = "□";
                            closeBtn.title = "Expand";
                        }
                    }
                }
            }

            // Auto-hide after 10 seconds
            setTimeout(function() {
                const debugPanel = document.getElementById("jankx-debug-info");
                if (debugPanel) {
                    debugPanel.style.opacity = "0.7";
                }
            }, 10000);

            // Initialize on DOM ready
            document.addEventListener("DOMContentLoaded", function() {
                const debugPanel = document.getElementById("jankx-debug-info");
                if (debugPanel) {
                    // Click on header to toggle
                    const header = debugPanel.querySelector(".jankx-debug-header");
                    if (header) {
                        header.addEventListener("click", function(e) {
                            if (!e.target.classList.contains("jankx-debug-close")) {
                                toggleJankxDebug();
                            }
                        });
                    }

                    // Click on minimized area to toggle
                    const minimized = debugPanel.querySelector(".jankx-debug-minimized");
                    if (minimized) {
                        minimized.addEventListener("click", function(e) {
                            if (!e.target.closest(".jankx-debug-close")) {
                                toggleJankxDebug();
                            }
                        });
                    }

                    // Click on close button to toggle
                    const closeBtn = debugPanel.querySelector(".jankx-debug-close");
                    if (closeBtn) {
                        closeBtn.addEventListener("click", function(e) {
                            e.stopPropagation();
                            toggleJankxDebug();
                        });
                    }

                    // Hover effects
                    debugPanel.addEventListener("mouseenter", function() {
                        this.style.opacity = "1";
                    });

                    debugPanel.addEventListener("mouseleave", function() {
                        this.style.opacity = "0.7";
                    });
                }
            });
        </script>';
    }

    /**
     * Format bytes to human readable format
     *
     * @param int $bytes
     * @param int $precision
     * @return string
     * @since 2.0.0
     */
    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }

    /**
     * Calculate memory usage percentage
     *
     * @param int $usage
     * @param int $limit
     * @return float
     * @since 2.0.0
     */
    private function calculateMemoryUsagePercentage(int $usage, int $limit): float
    {
        if ($limit <= 0 || $limit === -1) {
            return 0.0;
        }

        return round(($usage / $limit) * 100, 2);
    }
}
