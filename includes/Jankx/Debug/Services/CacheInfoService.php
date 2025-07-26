<?php

namespace Jankx\Debug\Services;

use Jankx\Debug\Contracts\CacheInfoInterface;

/**
 * Cache Info Service
 *
 * Manages cache information collection and analysis
 *
 * @package Jankx\Debug\Services
 * @since 2.0.1
 */
class CacheInfoService implements CacheInfoInterface
{
    /**
     * @var array
     * @since 2.0.1
     */
    private $cacheInfo = [];

    /**
     * @var array
     * @since 2.0.1
     */
    private $objectCacheInfo = [];

    /**
     * @var array
     * @since 2.0.1
     */
    private $pluginCacheInfo = [];

    /**
     * Capture cache information
     *
     * @since 2.0.1
     */
    public function captureInfo(): void
    {
        $this->captureObjectCacheInfo();
        $this->capturePluginCacheInfo();
        $this->buildCacheInfo();
    }

    /**
     * Get cache information
     *
     * @return array
     * @since 2.0.1
     */
    public function getCacheInfo(): array
    {
        return $this->cacheInfo;
    }

    /**
     * Get transients info
     *
     * @return array
     * @since 2.0.1
     */
    public function getTransientsInfo(): array
    {
        global $wpdb;

        $transients = [];
        $transientCount = 0;
        $transientSize = 0;

        if (isset($wpdb)) {
            $results = $wpdb->get_results(
                "SELECT option_name, option_value FROM {$wpdb->options}
                 WHERE option_name LIKE '_transient_%' OR option_name LIKE '_site_transient_%'"
            );

            foreach ($results as $result) {
                $transientCount++;
                $transientSize += strlen($result->option_value);
                $transients[] = [
                    'name' => $result->option_name,
                    'size' => strlen($result->option_value)
                ];
            }
        }

        return [
            'count' => $transientCount,
            'size' => $transientSize,
            'items' => $transients
        ];
    }

    /**
     * Get object cache info
     *
     * @return array
     * @since 2.0.1
     */
    public function getObjectCacheInfo(): array
    {
        return $this->objectCacheInfo;
    }

    /**
     * Get plugin cache info
     *
     * @return array
     * @since 2.0.1
     */
    public function getPluginCacheInfo(): array
    {
        return $this->pluginCacheInfo;
    }

    /**
     * Capture object cache information
     *
     * @since 2.0.1
     */
    private function captureObjectCacheInfo(): void
    {
        $this->objectCacheInfo = [
            'enabled' => wp_using_ext_object_cache(),
            'type' => $this->getObjectCacheType(),
            'stats' => $this->getObjectCacheStats()
        ];
    }

    /**
     * Get object cache type
     *
     * @return string
     * @since 2.0.1
     */
    private function getObjectCacheType(): string
    {
        if (!wp_using_ext_object_cache()) {
            return 'WordPress Default';
        }

        if (class_exists('Memcached')) {
            return 'Memcached';
        }

        if (class_exists('Redis')) {
            return 'Redis';
        }

        return 'External Object Cache';
    }

    /**
     * Get object cache stats
     *
     * @return array
     * @since 2.0.1
     */
    private function getObjectCacheStats(): array
    {
        if (!wp_using_ext_object_cache()) {
            return [];
        }

        $stats = wp_cache_get_stats();

        if (!$stats) {
            return [];
        }

        return [
            'hits' => $stats['hits'] ?? 0,
            'misses' => $stats['misses'] ?? 0,
            'hit_rate' => $this->calculateHitRate($stats),
            'memory_usage' => $stats['memory_usage'] ?? 0,
            'memory_limit' => $stats['memory_limit'] ?? 0
        ];
    }

    /**
     * Calculate hit rate
     *
     * @param array $stats
     * @return float
     * @since 2.0.1
     */
    private function calculateHitRate(array $stats): float
    {
        $hits = $stats['hits'] ?? 0;
        $misses = $stats['misses'] ?? 0;
        $total = $hits + $misses;

        if ($total === 0) {
            return 0.0;
        }

        return round(($hits / $total) * 100, 2);
    }

    /**
     * Capture plugin cache information
     *
     * @since 2.0.1
     */
    private function capturePluginCacheInfo(): void
    {
        $this->pluginCacheInfo = [];

        // Check for popular caching plugins
        $plugins = [
            'W3 Total Cache' => 'w3-total-cache/w3-total-cache.php',
            'WP Super Cache' => 'wp-super-cache/wp-cache.php',
            'WP Rocket' => 'wp-rocket/wp-rocket.php',
            'LiteSpeed Cache' => 'litespeed-cache/litespeed-cache.php',
            'Autoptimize' => 'autoptimize/autoptimize.php'
        ];

        foreach ($plugins as $name => $plugin_file) {
            if (is_plugin_active($plugin_file)) {
                $this->pluginCacheInfo[$name] = $this->getPluginCacheStatus($name);
            }
        }
    }

    /**
     * Get plugin cache status
     *
     * @param string $pluginName
     * @return array
     * @since 2.0.1
     */
    private function getPluginCacheStatus(string $pluginName): array
    {
        switch ($pluginName) {
            case 'W3 Total Cache':
                return $this->getW3TotalCacheStatus();
            case 'WP Super Cache':
                return $this->getWPSuperCacheStatus();
            case 'WP Rocket':
                return $this->getWPRocketStatus();
            default:
                return ['status' => 'Active', 'details' => 'Plugin detected'];
        }
    }

    /**
     * Get W3 Total Cache status
     *
     * @return array
     * @since 2.0.1
     */
    private function getW3TotalCacheStatus(): array
    {
        $config = get_option('w3tc_config');

        if (!$config) {
            return ['status' => 'Active', 'details' => 'Configuration not found'];
        }

        return [
            'status' => 'Active',
            'details' => 'Configuration found',
            'page_cache' => $config['pgcache.enabled'] ?? false,
            'database_cache' => $config['dbcache.enabled'] ?? false,
            'object_cache' => $config['objectcache.enabled'] ?? false
        ];
    }

    /**
     * Get WP Super Cache status
     *
     * @return array
     * @since 2.0.1
     */
    private function getWPSuperCacheStatus(): array
    {
        $wp_cache_enabled = get_option('wp_cache_enabled');

        return [
            'status' => $wp_cache_enabled ? 'Active' : 'Inactive',
            'details' => $wp_cache_enabled ? 'Cache enabled' : 'Cache disabled'
        ];
    }

    /**
     * Get WP Rocket status
     *
     * @return array
     * @since 2.0.1
     */
    private function getWPRocketStatus(): array
    {
        $options = get_option('wp_rocket_settings');

        if (!$options) {
            return ['status' => 'Active', 'details' => 'Settings not found'];
        }

        return [
            'status' => 'Active',
            'details' => 'Settings found',
            'page_cache' => $options['cache_logged_user'] ?? false,
            'minify' => $options['minify_css'] ?? false
        ];
    }

    /**
     * Build cache info summary
     *
     * @since 2.0.1
     */
    private function buildCacheInfo(): void
    {
        $transients = $this->getTransientsInfo();

        $this->cacheInfo = [
            'object_cache' => $this->objectCacheInfo,
            'transients' => $transients,
            'plugins' => $this->pluginCacheInfo,
            'summary' => [
                'object_cache_enabled' => $this->objectCacheInfo['enabled'] ?? false,
                'transient_count' => $transients['count'] ?? 0,
                'transient_size' => $transients['size'] ?? 0,
                'plugin_count' => count($this->pluginCacheInfo)
            ]
        ];
    }
}