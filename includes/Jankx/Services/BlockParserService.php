<?php

namespace Jankx\Services;

use Jankx\Facades\Logger;

/**
 * Block Parser Service
 *
 * Parses and analyzes Gutenberg blocks
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
    public function parseBlocks(string $content): array
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
    public function extractBlockNames(array $blocks): array
    {
        $blockNames = [];

        foreach ($blocks as $block) {
            if (isset($block['blockName'])) {
                $blockNames[] = $block['blockName'];
            }

            // Recursively check inner blocks
            if (isset($block['innerBlocks']) && is_array($block['innerBlocks'])) {
                $innerBlocks = $this->extractBlockNames($block['innerBlocks']);
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
    public function countBlockTypes(array $blocks): array
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
    public function countAllBlocks(array $blocks): int
    {
        $count = 0;

        foreach ($blocks as $block) {
            $count++; // Count this block

            // Count inner blocks recursively
            if (!empty($block['innerBlocks'])) {
                $count += $this->countAllBlocks($block['innerBlocks']);
            }
        }

        return $count;
    }

    /**
     * Get block statistics
     *
     * @param array $blocks
     * @return array
     * @since 2.0.1
     */
    public function getBlockStats(): array
    {
        $stats = [
            'total_blocks' => 0,
            'block_types' => [],
            'unique_blocks' => 0,
            'nested_blocks' => 0
        ];

        // Get all posts with blocks
        $posts = get_posts([
            'post_type' => 'any',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'meta_query' => [
                [
                    'key' => '_jankx_block_stats',
                    'compare' => 'EXISTS'
                ]
            ]
        ]);

        foreach ($posts as $post) {
            $postStats = get_post_meta($post->ID, '_jankx_block_stats', true);
            if (is_array($postStats)) {
                $stats['total_blocks'] += $postStats['total_blocks'] ?? 0;
                $stats['nested_blocks'] += $postStats['nested_blocks'] ?? 0;

                if (isset($postStats['block_types'])) {
                    foreach ($postStats['block_types'] as $blockType => $count) {
                        if (!isset($stats['block_types'][$blockType])) {
                            $stats['block_types'][$blockType] = 0;
                        }
                        $stats['block_types'][$blockType] += $count;
                    }
                }
            }
        }

        $stats['unique_blocks'] = count($stats['block_types']);

        return $stats;
    }

    /**
     * Parse all content blocks
     *
     * @return array
     * @since 2.0.1
     */
    public function parseAllContentBlocks(): array
    {
        $allBlocks = [];

        // Get all published posts
        $posts = get_posts([
            'post_type' => 'any',
            'post_status' => 'publish',
            'posts_per_page' => -1
        ]);

        foreach ($posts as $post) {
            if (has_blocks($post->post_content)) {
                        $blocks = $this->parseBlocks($post->post_content);
        $blockNames = $this->extractBlockNames($blocks);
                $allBlocks = array_merge($allBlocks, $blockNames);
            }
        }

        return array_unique($allBlocks);
    }

    /**
     * Get block stats at admin enqueue
     *
     * @return array
     * @since 2.0.1
     */
    public function getBlockStatsAtAdminEnqueue(): array
    {
        if (!is_admin()) {
            return [];
        }

        $stats = $this->getBlockStats();

        Logger::debug('Block stats at admin enqueue', $stats);

        return $stats;
    }

    /**
     * Get block stats at wp_footer
     *
     * @return array
     * @since 2.0.1
     */
    public function getBlockStatsAtWpFooter(): array
    {
        if (is_admin()) {
            return [];
        }

        $stats = $this->getBlockStats();

        Logger::debug('Block stats at wp_footer', $stats);

        return $stats;
    }

    /**
     * Display debug info
     *
     * @since 2.0.1
     */
    public function displayDebugInfo(): void
    {
        if (!defined('WP_DEBUG') || !WP_DEBUG) {
            return;
        }

        $stats = $this->getBlockStats();

        if (empty($stats['total_blocks'])) {
            return;
        }

        echo '<div style="background: #f0f0f0; padding: 10px; margin: 10px; border: 1px solid #ccc; font-family: monospace; font-size: 12px;">';
        echo '<strong>Jankx Block Statistics:</strong><br>';
        echo 'Total Blocks: ' . $stats['total_blocks'] . '<br>';
        echo 'Unique Block Types: ' . $stats['unique_blocks'] . '<br>';
        echo 'Nested Blocks: ' . $stats['nested_blocks'] . '<br>';

        if (!empty($stats['block_types'])) {
            echo '<br><strong>Block Types:</strong><br>';
            foreach ($stats['block_types'] as $blockType => $count) {
                echo '- ' . $blockType . ': ' . $count . '<br>';
            }
        }

        echo '</div>';
    }

    /**
     * Get detailed block statistics
     *
     * @return array
     * @since 2.0.1
     */
    public function getDetailedBlockStats(): array
    {
        $detailedStats = [
            'overview' => $this->getBlockStats(),
            'posts_with_blocks' => [],
            'block_usage_by_post_type' => [],
            'most_used_blocks' => [],
            'recent_blocks' => []
        ];

        // Get posts with blocks
        $posts = get_posts([
            'post_type' => 'any',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'meta_query' => [
                [
                    'key' => '_jankx_block_stats',
                    'compare' => 'EXISTS'
                ]
            ]
        ]);

        $postTypeStats = [];
        $blockUsage = [];

        foreach ($posts as $post) {
            $postStats = get_post_meta($post->ID, '_jankx_block_stats', true);
            if (is_array($postStats)) {
                $detailedStats['posts_with_blocks'][] = [
                    'id' => $post->ID,
                    'title' => $post->post_title,
                    'type' => $post->post_type,
                    'stats' => $postStats
                ];

                // Aggregate by post type
                if (!isset($postTypeStats[$post->post_type])) {
                    $postTypeStats[$post->post_type] = [
                        'total_blocks' => 0,
                        'unique_blocks' => 0,
                        'posts_count' => 0
                    ];
                }
                $postTypeStats[$post->post_type]['total_blocks'] += $postStats['total_blocks'] ?? 0;
                $postTypeStats[$post->post_type]['posts_count']++;

                // Aggregate block usage
                if (isset($postStats['block_types'])) {
                    foreach ($postStats['block_types'] as $blockType => $count) {
                        if (!isset($blockUsage[$blockType])) {
                            $blockUsage[$blockType] = 0;
                        }
                        $blockUsage[$blockType] += $count;
                    }
                }
            }
        }

        $detailedStats['block_usage_by_post_type'] = $postTypeStats;

        // Sort blocks by usage
        arsort($blockUsage);
        $detailedStats['most_used_blocks'] = array_slice($blockUsage, 0, 10, true);

        // Get recent blocks (last 30 days)
        $recentPosts = get_posts([
            'post_type' => 'any',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'date_query' => [
                [
                    'after' => '30 days ago'
                ]
            ],
            'meta_query' => [
                [
                    'key' => '_jankx_block_stats',
                    'compare' => 'EXISTS'
                ]
            ]
        ]);

        $recentBlocks = [];
        foreach ($recentPosts as $post) {
            $postStats = get_post_meta($post->ID, '_jankx_block_stats', true);
            if (is_array($postStats) && isset($postStats['block_types'])) {
                foreach ($postStats['block_types'] as $blockType => $count) {
                    if (!isset($recentBlocks[$blockType])) {
                        $recentBlocks[$blockType] = 0;
                    }
                    $recentBlocks[$blockType] += $count;
                }
            }
        }
        arsort($recentBlocks);
        $detailedStats['recent_blocks'] = array_slice($recentBlocks, 0, 10, true);

        return $detailedStats;
    }
}