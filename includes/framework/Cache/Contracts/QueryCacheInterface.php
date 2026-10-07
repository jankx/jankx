<?php

namespace Jankx\Cache\Contracts;

/**
 * Query cache: remember()/get()/put() over the shared storage engine, with
 * bucket based invalidation (a bucket version is part of every key, so bumping
 * it invalidates the whole bucket without touching individual entries).
 *
 * @package Jankx\Cache\Contracts
 * @since 2.0.0
 */
interface QueryCacheInterface
{
    /**
     * @return bool
     */
    public function isEnabled(): bool;

    /**
     * @param string $key    Key as produced by a QueryKeyGeneratorInterface.
     * @param string $bucket Invalidation bucket.
     * @return mixed|null Null on miss.
     */
    public function get(string $key, string $bucket = 'posts');

    /**
     * @param string $key    Key as produced by a QueryKeyGeneratorInterface.
     * @param mixed  $value  Value to store.
     * @param int    $ttl    Lifetime in seconds, 0 = no expiry.
     * @param string $bucket Invalidation bucket.
     * @return bool
     */
    public function put(string $key, $value, int $ttl = 0, string $bucket = 'posts'): bool;

    /**
     * Return the cached value or compute and store it.
     *
     * @param string   $key      Cache key.
     * @param callable $callback Producer, called on miss.
     * @param int      $ttl      Lifetime in seconds, 0 = no expiry.
     * @param string   $bucket   Invalidation bucket.
     * @return mixed
     */
    public function remember(string $key, callable $callback, int $ttl = 0, string $bucket = 'posts');

    /**
     * @param string $key    Cache key.
     * @param string $bucket Invalidation bucket.
     * @return bool
     */
    public function forget(string $key, string $bucket = 'posts'): bool;

    /**
     * Invalidate every entry of a bucket.
     *
     * @param string $bucket Invalidation bucket.
     * @return bool
     */
    public function flushBucket(string $bucket): bool;

    /**
     * Invalidate every query cache entry.
     *
     * @return bool
     */
    public function flush(): bool;

    /**
     * Hit/miss counters collected during the current request.
     *
     * @return array{hits:int,misses:int}
     */
    public function stats(): array;
}
