<?php

namespace Jankx\Cache\Engine;

/**
 * wp_cache_* backed engine (Redis/Memcached when a persistent drop-in is
 * loaded, an in-memory cache otherwise).
 *
 * @package Jankx\Cache\Engine
 * @since 2.0.0
 */
class ObjectCacheEngine extends AbstractEngine
{
    /**
     * @inheritdoc
     */
    public function getName(): string
    {
        return 'object';
    }

    /**
     * @inheritdoc
     */
    public function isPersistent(): bool
    {
        return function_exists('wp_using_ext_object_cache') && wp_using_ext_object_cache();
    }

    /**
     * @inheritdoc
     */
    protected function read(string $key, string $group): array
    {
        if (!function_exists('wp_cache_get')) {
            return ['value' => null, 'found' => false];
        }

        $found = false;
        $value = wp_cache_get($this->prefix . '_' . $key, $group, false, $found);

        // Older/core-cached implementations ignore $found: treat false as miss.
        if ($value === false && !$found) {
            return ['value' => null, 'found' => false];
        }

        return ['value' => $value, 'found' => true];
    }

    /**
     * @inheritdoc
     */
    protected function write(string $key, $value, int $ttl, string $group): bool
    {
        if (!function_exists('wp_cache_set')) {
            return false;
        }

        return (bool) wp_cache_set($this->prefix . '_' . $key, $value, $group, $ttl);
    }

    /**
     * @inheritdoc
     */
    protected function erase(string $key, string $group): bool
    {
        if (!function_exists('wp_cache_delete')) {
            return false;
        }

        return (bool) wp_cache_delete($this->prefix . '_' . $key, $group);
    }

    /**
     * @inheritdoc
     */
    protected function eraseGroup(string $group): bool
    {
        if ($group === '') {
            // "Flush everything" — the object cache equivalent of rm -rf.
            return function_exists('wp_cache_flush') ? (bool) wp_cache_flush() : false;
        }

        if (!function_exists('wp_cache_flush_group')) {
            return false;
        }

        if (wp_cache_flush_group($group)) {
            return true;
        }

        // Drop-ins answer `false` both for "flush_group unsupported" and for
        // "that group was already empty". Only the second one is a success —
        // flushing an empty group is a no-op, not a failure.
        return function_exists('wp_cache_supports') && wp_cache_supports('flush_group');
    }
}
