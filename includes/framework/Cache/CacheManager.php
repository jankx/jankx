<?php

namespace Jankx\Cache;

use Jankx\Cache\Contracts\CacheDriverInterface;
use Jankx\Cache\Drivers\SQLite3Driver;

/**
 * Cache Manager
 *
 * Manages cache drivers and provides a unified API.
 * Implements Singleton pattern for global access.
 *
 * Usage:
 *   $cache = CacheManager::instance();
 *   $cache->get('my-key');
 *   $cache->set('my-key', $value, 3600);
 *
 * @package Jankx\Cache
 */
class CacheManager
{
    private static ?self $instance = null;

    private CacheDriverInterface $driver;
    private string $prefix;

    public static function instance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Create a CacheManager with an explicit driver (for testing or custom setups)
     */
    public static function createWithDriver(CacheDriverInterface $driver, string $prefix = 'jankx_'): self
    {
        $reflection = new \ReflectionClass(self::class);
        $instance = $reflection->newInstanceWithoutConstructor();
        $instance->driver = $driver;
        $instance->prefix = $prefix;
        self::$instance = $instance;
        return $instance;
    }

    public static function reset(): void
    {
        self::$instance = null;
    }

    private function __construct()
    {
        $this->prefix = 'jankx_';
        $this->driver = $this->resolveDriver();
    }

    /**
     * Resolve the best available cache driver
     */
    private function resolveDriver(): CacheDriverInterface
    {
        // Try SQLite3 first (native extension)
        if (SQLite3Driver::isAvailable()) {
            return new SQLite3Driver([
                'path' => $this->getCachePath(),
            ]);
        }

        // Could add more drivers here:
        // if (RedisDriver::isAvailable()) return new RedisDriver();
        // if (MemcachedDriver::isAvailable()) return new MemcachedDriver();

        throw new \RuntimeException(
            'No cache driver available. Install sqlite3 PHP extension.'
        );
    }

    /**
     * Get cache file path
     */
    private function getCachePath(): string
    {
        $uploadDir = wp_upload_dir();
        $cacheDir = $uploadDir['basedir'] . '/cache';

        if (!is_dir($cacheDir)) {
            wp_mkdir_p($cacheDir);
        }

        return $cacheDir . '/jankx-cache.sqlite';
    }

    /**
     * Get the current driver
     */
    public function getDriver(): CacheDriverInterface
    {
        return $this->driver;
    }

    /**
     * Get a cached value
     *
     * @param string $key Cache key (prefix auto-added)
     * @param mixed $default Default value
     * @return mixed
     */
    public function get(string $key, mixed $default = null): mixed
    {
        return $this->driver->get($this->prefix . $key, $default);
    }

    /**
     * Store a value
     *
     * @param string $key Cache key (prefix auto-added)
     * @param mixed $value Value to store
     * @param int|null $ttl Time to live in seconds
     * @return bool
     */
    public function set(string $key, mixed $value, ?int $ttl = null): bool
    {
        return $this->driver->set($this->prefix . $key, $value, $ttl);
    }

    /**
     * Delete a cached value
     */
    public function delete(string $key): bool
    {
        return $this->driver->delete($this->prefix . $key);
    }

    /**
     * Check if key exists
     */
    public function has(string $key): bool
    {
        return $this->driver->has($this->prefix . $key);
    }

    /**
     * Store multiple values
     */
    public function setMany(array $values, ?int $ttl = null): bool
    {
        $prefixed = [];
        foreach ($values as $key => $value) {
            $prefixed[$this->prefix . $key] = $value;
        }
        return $this->driver->setMany($prefixed, $ttl);
    }

    /**
     * Get multiple values
     */
    public function getMany(array $keys, mixed $default = null): array
    {
        $prefixed = array_map(fn($k) => $this->prefix . $k, $keys);
        $results = $this->driver->getMany($prefixed, $default);

        // Remove prefix from keys
        $output = [];
        foreach ($results as $key => $value) {
            $output[substr($key, strlen($this->prefix))] = $value;
        }
        return $output;
    }

    /**
     * Delete multiple values
     */
    public function deleteMany(array $keys): bool
    {
        $prefixed = array_map(fn($k) => $this->prefix . $k, $keys);
        return $this->driver->deleteMany($prefixed);
    }

    /**
     * Flush all cache
     */
    public function flush(): bool
    {
        return $this->driver->flush();
    }

    /**
     * Get cache stats
     */
    public function stats(): array
    {
        return $this->driver->stats();
    }

    /**
     * Set custom prefix
     */
    public function setPrefix(string $prefix): self
    {
        $this->prefix = $prefix;
        return $this;
    }
}
