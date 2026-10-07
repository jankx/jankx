<?php

namespace Jankx\Cache\Query;

use Jankx\Cache\Contracts\CacheEngineInterface;
use Jankx\Cache\Contracts\QueryCacheInterface;
use Jankx\Cache\Contracts\QueryKeyGeneratorInterface;

/**
 * Query cache service.
 *
 * Invalidation is bucket based: every key embeds the version of its bucket, so
 * bumping one number invalidates every query in it without hunting individual
 * entries down — the classic trade-off of cache correctness over cache size,
 * and exactly what a post save needs (all post queries become stale).
 *
 * @package Jankx\Cache\Query
 * @since 2.0.0
 */
class QueryCache implements QueryCacheInterface
{
    const GROUP = 'jankx_query';

    /**
     * @var CacheEngineInterface
     */
    private $engine;

    /**
     * @var QueryKeyGeneratorInterface
     */
    private $keys;

    /**
     * @var array<string,mixed>
     */
    private $options;

    /**
     * @var array{hits:int,misses:int}
     */
    private $stats = ['hits' => 0, 'misses' => 0];

    /**
     * @param CacheEngineInterface         $engine  Storage engine.
     * @param QueryKeyGeneratorInterface   $keys    Query key generator.
     * @param array<string,mixed>          $options cache.query configuration.
     */
    public function __construct(CacheEngineInterface $engine, QueryKeyGeneratorInterface $keys, array $options = [])
    {
        $this->engine = $engine;
        $this->keys = $keys;
        $this->options = $options;
    }

    /**
     * @inheritdoc
     */
    public function isEnabled(): bool
    {
        return !empty($this->options['enabled']);
    }

    /**
     * @inheritdoc
     */
    public function get(string $key, string $bucket = 'posts')
    {
        if (!$this->isEnabled()) {
            return null;
        }

        $found = false;
        $value = $this->engine->get($this->resolveKey($key, $bucket), $this->group(), $found);
        if ($found) {
            $this->stats['hits']++;

            return $value;
        }

        $this->stats['misses']++;

        return null;
    }

    /**
     * @inheritdoc
     */
    public function put(string $key, $value, int $ttl = 0, string $bucket = 'posts'): bool
    {
        if (!$this->isEnabled()) {
            return false;
        }

        return $this->engine->set(
            $this->resolveKey($key, $bucket),
            $value,
            $this->ttl($ttl),
            $this->group()
        );
    }

    /**
     * @inheritdoc
     */
    public function remember(string $key, callable $callback, int $ttl = 0, string $bucket = 'posts')
    {
        if (!$this->isEnabled()) {
            return $callback();
        }

        $found = false;
        $value = $this->engine->get($this->resolveKey($key, $bucket), $this->group(), $found);
        if ($found) {
            $this->stats['hits']++;

            return $value;
        }

        $this->stats['misses']++;

        $value = $callback();
        if ($value !== null) {
            $this->engine->set($this->resolveKey($key, $bucket), $value, $this->ttl($ttl), $this->group());
        }

        return $value;
    }

    /**
     * @inheritdoc
     */
    public function forget(string $key, string $bucket = 'posts'): bool
    {
        if (!$this->isEnabled()) {
            return false;
        }

        return $this->engine->delete($this->resolveKey($key, $bucket), $this->group());
    }

    /**
     * @inheritdoc
     */
    public function flushBucket(string $bucket): bool
    {
        if (!$this->isEnabled()) {
            return false;
        }

        $found = false;
        $version = $this->engine->get($this->versionKey($bucket), $this->group(), $found);

        // Fresh buckets start at version 1 (the version every entry written
        // before the key existed was stamped with), so the first bump must
        // jump to 2 — bumping "nothing" to 1 would invalidate nothing.
        $version = $found && is_numeric($version) ? ((int) $version + 1) : 2;

        return $this->engine->set($this->versionKey($bucket), $version, 0, $this->group());
    }

    /**
     * @inheritdoc
     */
    public function flush(): bool
    {
        return $this->engine->flush($this->group());
    }

    /**
     * @inheritdoc
     */
    public function stats(): array
    {
        return $this->stats;
    }

    /**
     * Key generator used to build caller facing keys (exposed for tests/CLI).
     *
     * @return QueryKeyGeneratorInterface
     */
    public function keyGenerator(): QueryKeyGeneratorInterface
    {
        return $this->keys;
    }

    /**
     * Current version of a bucket (part of every key of that bucket).
     *
     * @param string $bucket Bucket name.
     * @return int
     */
    public function version(string $bucket): int
    {
        $found = false;
        $version = $this->engine->get($this->versionKey($bucket), $this->group(), $found);

        return $found && is_numeric($version) ? (int) $version : 1;
    }

    /**
     * @param int $ttl Requested ttl.
     * @return int
     */
    private function ttl(int $ttl): int
    {
        if ($ttl > 0) {
            return $ttl;
        }

        return isset($this->options['ttl']) ? (int) $this->options['ttl'] : 3600;
    }

    /**
     * @param string $key    Raw key.
     * @param string $bucket Bucket name.
     * @return string
     */
    private function resolveKey(string $key, string $bucket): string
    {
        return $key . '_v' . $this->version($bucket);
    }

    /**
     * @param string $bucket Bucket name.
     * @return string
     */
    private function versionKey(string $bucket): string
    {
        return 'ver:' . $bucket;
    }

    /**
     * @return string
     */
    private function group(): string
    {
        return !empty($this->options['group']) ? (string) $this->options['group'] : self::GROUP;
    }
}
