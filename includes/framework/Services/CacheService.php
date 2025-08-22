<?php

namespace Jankx\Services;

use Jankx\Foundation\Application;

/**
 * Cache Service
 *
 * Handles caching operations with configurable enable/disable state.
 *
 * @package Jankx\Services
 * @since 2.0.0
 */
class CacheService
{
    /**
     * Application instance
     *
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * Cache enabled state
     *
     * @var bool
     */
    protected $enabled;

    /**
     * Constructor
     *
     * @param \Jankx\Foundation\Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->enabled = $this->isCacheEnabled();
    }

    /**
     * Check if cache is enabled
     *
     * @return bool
     */
    public function isEnabled()
    {
        return $this->enabled;
    }

    /**
     * Get cached value
     *
     * @param string $key
     * @return mixed|null
     */
    public function get($key)
    {
        if (!$this->enabled) {
            return null;
        }

        return wp_cache_get($key, 'jankx');
    }

    /**
     * Set cached value
     *
     * @param string $key
     * @param mixed $value
     * @param int $expiration
     * @return bool
     */
    public function set($key, $value, $expiration = 3600)
    {
        if (!$this->enabled) {
            return false;
        }

        return wp_cache_set($key, $value, 'jankx', $expiration);
    }

    /**
     * Delete cached value
     *
     * @param string $key
     * @return bool
     */
    public function delete($key)
    {
        if (!$this->enabled) {
            return false;
        }

        return wp_cache_delete($key, 'jankx');
    }

    /**
     * Clear all cache
     *
     * @return bool
     */
    public function clear()
    {
        if (!$this->enabled) {
            return false;
        }

        return wp_cache_flush_group('jankx');
    }

    /**
     * Check if cache is enabled from configuration
     *
     * @return bool
     */
    protected function isCacheEnabled()
    {
        try {
            $config = $this->app->make('config');
            return $config->get('cache.enabled', true);
        } catch (\Exception $e) {
            return true; // Default to enabled
        }
    }
}
