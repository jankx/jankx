<?php

namespace Jankx\Services;

use Jankx\Facades\Logger;

/**
 * Block Parser Service
 *
 * Handles parsing and counting of Gutenberg blocks
 *
 * @package Jankx\Services
 * @since 2.0.1
 */
class BlockParserService
{
    /**
     * Parse blocks from content
     *
     * @param string $content
     * @return array
     * @since 2.0.1
     */
    public static function parseBlocks(string $content): array
    {
        if (empty($content) || !has_blocks($content)) {
            return [];
        }

        return parse_blocks($content);
    }

    /**
     * Extract block names from parsed blocks
     *
     * @param array $blocks
     * @return array
     * @since 2.0.1
     */
    public static function extractBlockNames(array $blocks): array
    {
        $blockNames = [];

        foreach ($blocks as $block) {
            if (isset($block['blockName'])) {
                $blockNames[] = $block['blockName'];
            }

            // Recursively check inner blocks
            if (isset($block['innerBlocks']) && is_array($block['innerBlocks'])) {
                $innerBlocks = self::extractBlockNames($block['innerBlocks']);
                $blockNames = array_merge($blockNames, $innerBlocks);
            }
        }

        return array_unique($blockNames);
    }

    /**
     * Count block types (root blocks only)
     *
     * @param array $blocks
     * @return array
     * @since 2.0.1
     */
    public static function countBlockTypes(array $blocks): array
    {
        $blockTypes = [];

        foreach ($blocks as $block) {
            if (!empty($block['blockName'])) {
                $blockName = $block['blockName'];
                if (!isset($blockTypes[$blockName])) {
                    $blockTypes[$blockName] = 0;
                }
                $blockTypes[$blockName]++;
            }
        }

        return $blockTypes;
    }

    /**
     * Count all blocks (including nested)
     *
     * @param array $blocks
     * @return int
     * @since 2.0.1
     */
    public static function countAllBlocks(array $blocks): int
    {
        $count = 0;

        foreach ($blocks as $block) {
            $count++; // Count this block

            // Count inner blocks recursively
            if (!empty($block['innerBlocks'])) {
                $count += self::countAllBlocks($block['innerBlocks']);
            }
        }

        return $count;
    }



    /**
     * Get comprehensive block statistics
     *
     * @return array
     * @since 2.0.1
     */
    public static function getBlockStats(): array
    {
        // Use the comprehensive parsing method
        $allBlocks = self::parseAllContentBlocks();

        // Count blocks correctly
        $blockTypes = self::countBlockTypes($allBlocks); // Root blocks only
        $totalBlocks = self::countAllBlocks($allBlocks); // All blocks (including nested)

        return [
            'total_blocks' => $totalBlocks,
            'block_types' => $blockTypes,
            'block_names' => self::extractBlockNames($allBlocks)
        ];
    }

    /**
     * Parse blocks from all possible content sources
     *
     * @return array
     * @since 2.0.1
     */
    public static function parseAllContentBlocks(): array
    {
        $allBlocks = [];

        // Parse current post content (if exists)
        global $post;
        if ($post && isset($post->post_content)) {
            $content = $post->post_content;
            if (!empty($content) && has_blocks($content)) {
                $blocks = self::parseBlocks($content);
                $allBlocks = array_merge($allBlocks, $blocks);
            }
        }

        return $allBlocks;
    }

    /**
     * Get block statistics at admin_enqueue_scripts hook
     *
     * @return array
     * @since 2.0.1
     */
    public static function getBlockStatsAtAdminEnqueue(): array
    {
        // Parse blocks at admin_enqueue_scripts to ensure admin content is loaded
        if (!did_action('admin_enqueue_scripts')) {
            add_action('admin_enqueue_scripts', function() {
                return self::getBlockStats();
            }, 999);
            return ['total_blocks' => 0, 'block_types' => [], 'block_names' => []];
        }

        return self::getBlockStats();
    }

    /**
     * Get block statistics at wp_footer hook
     *
     * @return array
     * @since 2.0.1
     */
    public static function getBlockStatsAtWpFooter(): array
    {
        // Parse blocks at wp_footer to ensure all content is rendered
        if (!did_action('wp_footer')) {
            add_action('wp_footer', function() {
                return self::getBlockStats();
            }, 999);
            return ['total_blocks' => 0, 'block_types' => [], 'block_names' => []];
        }

        return self::getBlockStats();
    }

    /**
     * Display debug information in browser
     *
     * @return void
     * @since 2.0.1
     */
    public static function displayDebugInfo(): void
    {
        $detailedStats = self::getDetailedBlockStats();

        // Only display if there are blocks
        if ($detailedStats['total_blocks'] <= 0) {
            return;
        }

        echo '<div id="bookix-debug-box" style="position: fixed; top: 10px; right: 10px; background: #f0f0f0; border: 2px solid #333; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 12px; max-width: 400px; z-index: 9999; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">';
        echo '<h3 style="margin: 0 0 10px 0; color: #333;">📝 Gutenberg Blocks</h3>';

        // Content wrapper for minimize/maximize
        echo '<div class="debug-content">';

        // Summary
        echo '<div style="margin-bottom: 10px;">';
        echo '<strong>🎯 Summary:</strong><br>';
        echo 'Formula: ' . $detailedStats['summary']['formula'] . '<br>';
        echo 'Root Blocks: ' . $detailedStats['summary']['root_count'] . '<br>';
        echo 'Nested Blocks: ' . $detailedStats['summary']['nested_count'] . '<br>';
        echo 'Total Blocks: ' . $detailedStats['summary']['total_count'] . '<br>';
        echo '</div>';

        // Block Types
        if (!empty($detailedStats['block_types'])) {
            echo '<div style="margin-bottom: 10px;">';
            echo '<strong>📋 Root Block Types:</strong><br>';
            foreach ($detailedStats['block_types'] as $blockType => $count) {
                echo '• ' . $blockType . ': ' . $count . '<br>';
            }
            echo '</div>';
        }

        // Context
        echo '<div style="margin-bottom: 10px;">';
        echo '<strong>🔍 Context:</strong><br>';
        echo 'URL: ' . ($_SERVER['REQUEST_URI'] ?? 'unknown') . '<br>';

        global $post;
        if ($post && isset($post->post_content)) {
            echo 'Post ID: ' . $post->ID . '<br>';
            echo 'Has Blocks: ' . (has_blocks($post->post_content) ? 'Yes' : 'No') . '<br>';
        }

        // Add screen info for debugging
        if (is_admin()) {
            $currentScreen = get_current_screen();
            if ($currentScreen) {
                echo 'Screen: ' . $currentScreen->base . '<br>';
                echo 'Screen ID: ' . $currentScreen->id . '<br>';
            }
        }
        echo '</div>';
        echo '</div>'; // Close debug-content

        // Minimize/Maximize button
        echo '<button id="bookix-debug-toggle" onclick="bookix_toggle_debug()" style="background: #0073aa; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 11px; margin-right: 5px;">📋</button>';
        echo '<button onclick="this.parentElement.style.display=\'none\'" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 11px;">✕</button>';
        echo '</div>';

        // Add JavaScript for minimize/maximize functionality
        echo '<script>
        function bookix_toggle_debug() {
            const debugBox = document.getElementById("bookix-debug-box");
            const toggleBtn = document.getElementById("bookix-debug-toggle");
            const content = debugBox.querySelector(".debug-content");

            if (content.style.display === "none") {
                // Maximize
                content.style.display = "block";
                toggleBtn.innerHTML = "📋";
                toggleBtn.title = "Minimize";
                debugBox.style.maxWidth = "400px";
            } else {
                // Minimize
                content.style.display = "none";
                toggleBtn.innerHTML = "📊";
                toggleBtn.title = "Maximize";
                debugBox.style.maxWidth = "200px";
            }
        }

        // Initialize tooltip
        document.addEventListener("DOMContentLoaded", function() {
            const toggleBtn = document.getElementById("bookix-debug-toggle");
            if (toggleBtn) {
                toggleBtn.title = "Minimize";
            }
        });
        </script>';
    }

    /**
     * Get detailed block statistics with comprehensive information
     *
     * @return array
     * @since 2.0.1
     */
    public static function getDetailedBlockStats(): array
    {
        $allBlocks = self::parseAllContentBlocks();
        $blockTypes = self::countBlockTypes($allBlocks);
        $totalBlocks = self::countAllBlocks($allBlocks);
        $rootBlocks = count($allBlocks);
        $nestedBlocks = $totalBlocks - $rootBlocks;

        return [
            'total_blocks' => $totalBlocks,
            'root_blocks' => $rootBlocks,
            'nested_blocks' => $nestedBlocks,
            'block_types' => $blockTypes,
            'block_names' => self::extractBlockNames($allBlocks),
            'summary' => [
                'root_count' => $rootBlocks,
                'nested_count' => $nestedBlocks,
                'total_count' => $totalBlocks,
                'formula' => $rootBlocks . ' root + ' . $nestedBlocks . ' nested = ' . $totalBlocks . ' total'
            ]
        ];
    }
}