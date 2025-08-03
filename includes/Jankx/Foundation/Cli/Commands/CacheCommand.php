<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI;
use WP_CLI_Command;

/**
 * Jankx Cache Management Commands
 *
 * @package Jankx\Foundation\Cli\Commands
 * @since 1.0.0
 */
class CacheCommand extends WP_CLI_Command
{
    /**
     * Clear all Jankx caches
     *
     * ## EXAMPLES
     *
     *     wp jankx cache clear
     *
     * @when after_wp_load
     */
    public function clear()
    {
        $this->clearConfigCache();
        $this->clearBlockCache();
        $this->clearWidgetCache();
        $this->clearUserCache();

        WP_CLI::success('All Jankx caches cleared successfully!');
    }

    /**
     * Clear config cache
     *
     * ## EXAMPLES
     *
     *     wp jankx cache clear-config
     *
     * @when after_wp_load
     */
    public function clear_config()
    {
        $this->clearConfigCache();
        WP_CLI::success('Config cache cleared successfully!');
    }

    /**
     * Clear block cache
     *
     * ## EXAMPLES
     *
     *     wp jankx cache clear-blocks
     *
     * @when after_wp_load
     */
    public function clear_blocks()
    {
        $this->clearBlockCache();
        WP_CLI::success('Block cache cleared successfully!');
    }

    /**
     * Clear widget cache
     *
     * ## EXAMPLES
     *
     *     wp jankx cache clear-widgets
     *
     * @when after_wp_load
     */
    public function clear_widgets()
    {
        $this->clearWidgetCache();
        WP_CLI::success('Widget cache cleared successfully!');
    }

    /**
     * Clear user cache
     *
     * ## EXAMPLES
     *
     *     wp jankx cache clear-users
     *
     * @when after_wp_load
     */
    public function clear_users()
    {
        $this->clearUserCache();
        WP_CLI::success('User cache cleared successfully!');
    }

    /**
     * Show cache status
     *
     * ## EXAMPLES
     *
     *     wp jankx cache status
     *
     * @when after_wp_load
     */
    public function status()
    {
        $status = [
            'config' => $this->getCacheStatus('jankx_config'),
            'blocks' => $this->getCacheStatus('jankx_blocks'),
            'widgets' => $this->getCacheStatus('jankx_widgets'),
            'users' => $this->getCacheStatus('jankx_users')
        ];

        WP_CLI::log('Jankx Cache Status:');
        WP_CLI::log('');

        foreach ($status as $type => $info) {
            $status = $info['count'] > 0 ? 'Active' : 'Empty';
            WP_CLI::log(sprintf('  %s: %s (%d items)', ucfirst($type), $status, $info['count']));
        }
    }

    /**
     * Clear config cache
     */
    protected function clearConfigCache()
    {
        if (class_exists('Jankx\Foundation\Bootstrap\LoadConfiguration')) {
            \Jankx\Foundation\Bootstrap\LoadConfiguration::clearConfigCache();
        } else {
            wp_cache_flush_group('jankx_config');
        }
    }

    /**
     * Clear block cache
     */
    protected function clearBlockCache()
    {
        if (class_exists('Jankx\Support\Providers\GutenbergServiceProvider')) {
            \Jankx\Support\Providers\GutenbergServiceProvider::clearBlockCache();
        } else {
            wp_cache_flush_group('jankx_blocks');
        }
    }

    /**
     * Clear widget cache
     */
    protected function clearWidgetCache()
    {
        if (class_exists('Jankx\Support\Blocks\WidgetRendererBlock')) {
            \Jankx\Support\Blocks\WidgetRendererBlock::clearWidgetCache();
        } else {
            wp_cache_flush_group('jankx_widgets');
        }
    }

    /**
     * Clear user cache
     */
    protected function clearUserCache()
    {
        wp_cache_flush_group('jankx_users');
    }

    /**
     * Get cache status for a group
     *
     * @param string $group Cache group
     * @return array
     */
    protected function getCacheStatus($group)
    {
        global $wp_object_cache;

        $count = 0;
        $size = 0;

        if (isset($wp_object_cache->cache) && is_array($wp_object_cache->cache)) {
            foreach ($wp_object_cache->cache as $key => $value) {
                if (strpos($key, $group) === 0) {
                    $count++;
                    $size += strlen(serialize($value));
                }
            }
        }

        return [
            'count' => $count,
            'size' => $size
        ];
    }
}