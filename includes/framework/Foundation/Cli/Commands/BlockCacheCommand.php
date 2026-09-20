<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI_Command;
use Jankx\Cache\BlockCache;

/**
 * Block Cache management commands.
 *
 * ## EXAMPLES
 *
 *     wp jankx block-cache build
 *     wp jankx block-cache sync
 *     wp jankx block-cache status
 *
 * @package Jankx\Foundation\Cli\Commands
 */
class BlockCacheCommand extends WP_CLI_Command
{
    /**
     * Build block cache from MySQL.
     *
     * ## EXAMPLES
     *
     *     wp jankx block-cache build
     *
     * @subcommand build
     */
    public function build($args, $assoc_args)
    {
        if (!extension_loaded('sqlite3')) {
            \WP_CLI::error('sqlite3 extension is not available.');
        }

        \WP_CLI::log('Building block cache...');

        $cache = BlockCache::instance();
        $cache->flush();
        $cache->build();

        $stats = $cache->stats();
        \WP_CLI::success(sprintf(
            'Cache built: %d blocks, %d patterns, %d categories (%s)',
            $stats['block_count'],
            $stats['pattern_count'],
            $stats['category_count'],
            size_format($stats['size'] ?? 0)
        ));
    }

    /**
     * Sync block cache from MySQL.
     *
     * ## EXAMPLES
     *
     *     wp jankx block-cache sync
     *
     * @subcommand sync
     */
    public function sync($args, $assoc_args)
    {
        if (!extension_loaded('sqlite3')) {
            \WP_CLI::error('sqlite3 extension is not available.');
        }

        \WP_CLI::log('Syncing cache from MySQL...');

        $cache = BlockCache::instance();

        if ($cache->isValid()) {
            $stats = $cache->stats();
            \WP_CLI::log(sprintf(
                'Cache already valid: %d blocks, %d patterns, %d categories',
                $stats['block_count'],
                $stats['pattern_count'],
                $stats['category_count']
            ));
            return;
        }

        $cache->build();

        $stats = $cache->stats();
        \WP_CLI::success(sprintf(
            'Cache synced: %d blocks, %d patterns, %d categories',
            $stats['block_count'],
            $stats['pattern_count'],
            $stats['category_count']
        ));
    }

    /**
     * Invalidate block cache.
     *
     * ## EXAMPLES
     *
     *     wp jankx block-cache invalidate
     *
     * @subcommand invalidate
     */
    public function invalidate($args, $assoc_args)
    {
        if (!extension_loaded('sqlite3')) {
            \WP_CLI::error('sqlite3 extension is not available.');
        }

        BlockCache::instance()->invalidate();
        \WP_CLI::success('Cache invalidated.');
    }

    /**
     * Delete block cache.
     *
     * ## EXAMPLES
     *
     *     wp jankx block-cache delete
     *
     * @subcommand delete
     */
    public function delete($args, $assoc_args)
    {
        if (!extension_loaded('sqlite3')) {
            \WP_CLI::error('sqlite3 extension is not available.');
        }

        BlockCache::instance()->flush();
        \WP_CLI::success('Cache deleted.');
    }

    /**
     * Show block cache status.
     *
     * ## EXAMPLES
     *
     *     wp jankx block-cache status
     *
     * @subcommand status
     */
    public function status($args, $assoc_args)
    {
        if (!extension_loaded('sqlite3')) {
            \WP_CLI::error('sqlite3 extension is not available.');
        }

        $stats = BlockCache::instance()->stats();

        \WP_CLI::log('Block Cache Status:');
        \WP_CLI::log(sprintf('  Driver:    %s', $stats['driver'] ?? 'unknown'));
        \WP_CLI::log(sprintf('  Valid:     %s', $stats['is_valid'] ? 'Yes' : 'No'));
        \WP_CLI::log(sprintf('  Blocks:    %d', $stats['block_count'] ?? 0));
        \WP_CLI::log(sprintf('  Patterns:  %d', $stats['pattern_count'] ?? 0));
        \WP_CLI::log(sprintf('  Categories: %d', $stats['category_count'] ?? 0));
        \WP_CLI::log(sprintf('  Last Built: %s', $stats['last_build_human'] ?? 'never'));
        \WP_CLI::log(sprintf('  Size:      %s', size_format($stats['size'] ?? 0)));
    }
}
