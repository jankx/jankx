<?php

namespace Jankx\Cache\Contracts;

/**
 * Storage primitive of the cache system (Strategy pattern).
 *
 * Implementations decide *where* values live (filesystem, object cache, an
 * in-memory null object, a custom driver) — never *what* a page or query cache
 * means. Swap the driver through `cache.engine.driver` in config/cache.php or
 * point it at any FQCN implementing this interface.
 *
 * @package Jankx\Cache\Contracts
 * @since 2.0.0
 */
interface CacheEngineInterface
{
    /**
     * Driver identifier (file, object, null, ...).
     *
     * @return string
     */
    public function getName(): string;

    /**
     * Read a value.
     *
     * @param string      $key    Cache key.
     * @param string      $group  Cache group/namespace.
     * @param bool|null   $found  Set to true when the key existed.
     * @return mixed Stored value or null on miss.
     */
    public function get(string $key, string $group = '', ?bool &$found = null);

    /**
     * Write a value.
     *
     * @param string $key   Cache key.
     * @param mixed  $value Value to store.
     * @param int    $ttl   Lifetime in seconds, 0 = no expiry.
     * @param string $group Cache group/namespace.
     * @return bool
     */
    public function set(string $key, $value, int $ttl = 0, string $group = ''): bool;

    /**
     * Remove a single value.
     *
     * @param string $key   Cache key.
     * @param string $group Cache group/namespace.
     * @return bool
     */
    public function delete(string $key, string $group = ''): bool;

    /**
     * Whether a key exists.
     *
     * @param string $key   Cache key.
     * @param string $group Cache group/namespace.
     * @return bool
     */
    public function has(string $key, string $group = ''): bool;

    /**
     * Remove every value of a group (whole cache when group is empty).
     *
     * @param string $group Cache group/namespace.
     * @return bool
     */
    public function flush(string $group = ''): bool;

    /**
     * Whether values survive the current request (Redis/Memcached/file).
     *
     * @return bool
     */
    public function isPersistent(): bool;
}
