<?php

namespace Jankx\Debug\Services;

use Jankx\Debug\Contracts\CacheInfoInterface;

/**
 * Cache Info Service for Jankx Framework
 *
 * Provides cache-related information for debugging purposes.
 *
 * @package Jankx\Debug\Services
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @version 2.0.0
 * @license MIT
 */
class CacheInfoService implements CacheInfoInterface
{
    /**
     * @var array
     * @since 2.0.0
     */
    private $cacheInfo = [];

    /**
     * @var array
     * @since 2.0.0
     */
    private $objectCacheInfo = [];

    /**
     * @var array
     * @since 2.0.0
     */
    private $pluginCacheInfo = [];

    /**
     * Capture cache information
     *
     * @since 2.0.0
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
     * @since 2.0.0
     */
    public function getCacheInfo(): array
    {
        return $this->cacheInfo;
    }

    /**
     * Get transients info
     *
     * @return array
     * @since 2.0.0
     */
    public function getTransientsInfo(): array
    {
        $transients = [];
        $transientCount = 0;
        $transientSize = 0;

        // Use WordPress functions instead of direct database queries
        $transientKeys = $this->getTransientKeys();

        foreach ($transientKeys as $key) {
            $value = get_transient($key);
            if ($value !== false) {
                $transientCount++;
                $transientSize += strlen(serialize($value));
                $transients[] = [
                    'name' => $key,
                    'size' => strlen(serialize($value))
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
     * Get transient keys using WordPress functions
     *
     * @return array
     */
    private function getTransientKeys(): array
    {
        // This is a simplified approach - in practice, you might need to use
        // WordPress functions to get transient keys without direct database access
        $keys = [];

        // Get common transient keys
        $commonTransients = [
            '_transient_timeout_',
            '_site_transient_timeout_'
        ];

        foreach ($commonTransients as $prefix) {
            $options = \get_option($prefix . '*');
            if ($options) {
                foreach ($options as $key => $value) {
                    $transientKey = str_replace($prefix, '', $key);
                    $keys[] = $transientKey;
                }
            }
        }

        return array_unique($keys);
    }

    /**
     * Get object cache info
     *
     * @return array
     * @since 2.0.0
     */
    public function getObjectCacheInfo(): array
    {
        if (empty($this->objectCacheInfo)) {
            $this->captureObjectCacheInfo();
        }
        return $this->objectCacheInfo;
    }

    /**
     * Get plugin cache info
     *
     * @return array
     * @since 2.0.0
     */
    public function getPluginCacheInfo(): array
    {
        if (empty($this->pluginCacheInfo)) {
            $this->capturePluginCacheInfo();
        }
        return $this->pluginCacheInfo;
    }

    /**
     * Capture object cache information
     *
     * @since 2.0.0
     */
    private function captureObjectCacheInfo(): void
    {
        $this->objectCacheInfo = [
            'enabled' => \wp_using_ext_object_cache(),
            'type' => $this->getObjectCacheType(),
            'stats' => $this->getObjectCacheStats()
        ];
    }

    /**
     * Get object cache type
     *
     * @return string
     * @since 2.0.0
     */
    private function getObjectCacheType(): string
    {
        if (!\wp_using_ext_object_cache()) {
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
     * @since 2.0.0
     */
    private function getObjectCacheStats(): array
    {
        if (!\wp_using_ext_object_cache()) {
            return [];
        }

        $stats = \wp_cache_get_stats();

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
     * @since 2.0.0
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
     * @since 2.0.0
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
            if (\is_plugin_active($plugin_file)) {
                $this->pluginCacheInfo[$name] = $this->getPluginCacheStatus($name);
            }
        }
    }

    /**
     * Get plugin cache status
     *
     * @param string $pluginName
     * @return array
     * @since 2.0.0
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
     * @since 2.0.0
     */
    private function getW3TotalCacheStatus(): array
    {
        $config = \get_option('w3tc_config');

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
     * @since 2.0.0
     */
    private function getWPSuperCacheStatus(): array
    {
        $wp_cache_enabled = \get_option('wp_cache_enabled');

        return [
            'status' => $wp_cache_enabled ? 'Active' : 'Inactive',
            'details' => $wp_cache_enabled ? 'Cache enabled' : 'Cache disabled'
        ];
    }

    /**
     * Get WP Rocket status
     *
     * @return array
     * @since 2.0.0
     */
    private function getWPRocketStatus(): array
    {
        $options = \get_option('wp_rocket_settings');

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
     * @since 2.0.0
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
