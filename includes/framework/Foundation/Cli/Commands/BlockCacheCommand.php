<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI_Command;
use Jankx\Cache\BlockSQLiteCache;

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
     * Reads all registered block types, patterns, and categories from WordPress
     * and stores them in SQLite for faster reads.
     *
     * ## EXAMPLES
     *
     *     wp jankx block-cache build
     *
     * @subcommand build
     */
    public function build($args, $assoc_args)
    {
        if (!extension_loaded('pdo_sqlite')) {
            \WP_CLI::error('pdo_sqlite extension is not available.');
            return;
        }

        \WP_CLI::log('Building block cache...');

        $cache = BlockSQLiteCache::instance();
        $cache->deleteCache();
        $cache->buildCache();

        $stats = $cache->getStats();
        \WP_CLI::success(sprintf(
            'Cache built: %d blocks, %d patterns, %d categories (%s)',
            $stats['block_count'],
            $stats['pattern_count'],
            $stats['category_count'],
            $stats['db_size']
        ));
    }

    /**
     * Sync block cache from MySQL.
     *
     * Same as build, but only rebuilds if cache is invalid.
     *
     * ## EXAMPLES
     *
     *     wp jankx block-cache sync
     *
     * @subcommand sync
     */
    public function sync($args, $assoc_args)
    {
        if (!extension_loaded('pdo_sqlite')) {
            \WP_CLI::error('pdo_sqlite extension is not available.');
            return;
        }

        \WP_CLI::log('Syncing cache from MySQL...');

        $cache = BlockSQLiteCache::instance();

        if ($cache->isValid()) {
            \WP_CLI::log('Cache is already valid. Use "build" to force rebuild.');
            $stats = $cache->getStats();
            \WP_CLI::log(sprintf(
                'Current cache: %d blocks, %d patterns, %d categories',
                $stats['block_count'],
                $stats['pattern_count'],
                $stats['category_count']
            ));
            return;
        }

        $cache->syncFromMySQL();

        $stats = $cache->getStats();
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
     * Marks cache as invalid. Next request will rebuild it.
     *
     * ## EXAMPLES
     *
     *     wp jankx block-cache invalidate
     *
     * @subcommand invalidate
     */
    public function invalidate($args, $assoc_args)
    {
        if (!extension_loaded('pdo_sqlite')) {
            \WP_CLI::error('pdo_sqlite extension is not available.');
            return;
        }

        $cache = BlockSQLiteCache::instance();
        $cache->invalidate();

        \WP_CLI::success('Cache invalidated. Next request will rebuild it.');
    }

    /**
     * Delete block cache file.
     *
     * Completely removes the SQLite cache file.
     *
     * ## EXAMPLES
     *
     *     wp jankx block-cache delete
     *
     * @subcommand delete
     */
    public function delete($args, $assoc_args)
    {
        if (!extension_loaded('pdo_sqlite')) {
            \WP_CLI::error('pdo_sqlite extension is not available.');
            return;
        }

        $cache = BlockSQLiteCache::instance();
        $cache->deleteCache();

        \WP_CLI::success('Cache file deleted.');
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
        if (!extension_loaded('pdo_sqlite')) {
            \WP_CLI::error('pdo_sqlite extension is not available.');
            return;
        }

        $cache = BlockSQLiteCache::instance();
        $stats = $cache->getStats();

        if (isset($stats['error'])) {
            \WP_CLI::error($stats['error']);
            return;
        }

        \WP_CLI::log('Block Cache Status:');
        \WP_CLI::log(sprintf('  Valid:    %s', $stats['is_valid'] ? 'Yes' : 'No'));
        \WP_CLI::log(sprintf('  Blocks:   %d', $stats['block_count']));
        \WP_CLI::log(sprintf('  Patterns: %d', $stats['pattern_count']));
        \WP_CLI::log(sprintf('  Categories: %d', $stats['category_count']));
        \WP_CLI::log(sprintf('  Last Built: %s', $stats['last_build_human']));
        \WP_CLI::log(sprintf('  Size:     %s', $stats['db_size']));
    }
}
