<?php

namespace Jankx\Cache\Contracts;

/**
 * Cache Driver Interface
 *
 * Defines the contract for cache storage drivers.
 * Implementations can use SQLite3, Redis, Memcached, etc.
 *
 * @package Jankx\Cache\Contracts
 */
interface CacheDriverInterface
{
    /**
     * Check if the driver is available on this server
     */
    public static function isAvailable(): bool;

    /**
     * Initialize the driver with configuration
     *
     * @param array $config Driver-specific configuration
     */
    public function __construct(array $config = []);

    /**
     * Get a value by key
     *
     * @param string $key Cache key
     * @param mixed $default Default value if key not found
     * @return mixed
     */
    public function get(string $key, mixed $default = null): mixed;

    /**
     * Store a value
     *
     * @param string $key Cache key
     * @param mixed $value Value to store
     * @param int|null $ttl Time to live in seconds (null = forever)
     * @return bool
     */
    public function set(string $key, mixed $value, ?int $ttl = null): bool;

    /**
     * Delete a value by key
     */
    public function delete(string $key): bool;

    /**
     * Check if a key exists
     */
    public function has(string $key): bool;

    /**
     * Store multiple values
     *
     * @param array<string, mixed> $values Key-value pairs
     * @param int|null $ttl Time to live in seconds
     * @return bool
     */
    public function setMany(array $values, ?int $ttl = null): bool;

    /**
     * Get multiple values by keys
     *
     * @param array<string> $keys Cache keys
     * @param mixed $default Default value for missing keys
     * @return array<string, mixed>
     */
    public function getMany(array $keys, mixed $default = null): array;

    /**
     * Delete multiple values by keys
     */
    public function deleteMany(array $keys): bool;

    /**
     * Flush all cached data
     */
    public function flush(): bool;

    /**
     * Get driver stats
     */
    public function stats(): array;
}
