<?php

namespace Jankx\Cache\Page;

use Jankx\Cache\Contracts\CacheEngineInterface;
use Jankx\Cache\Contracts\PageCacheRepositoryInterface;
use Jankx\Cache\Contracts\RequestKeyGeneratorInterface;

/**
 * Stores pages through the shared storage engine (Repository pattern).
 *
 * The engine is the only dependency on storage, so switching the page cache
 * from files to Redis is a config change (`cache.engine.driver`).
 *
 * @package Jankx\Cache\Page
 * @since 2.0.0
 */
class PageCacheRepository implements PageCacheRepositoryInterface
{
    const GROUP = 'page';

    /**
     * @var CacheEngineInterface
     */
    private $engine;

    /**
     * @var RequestKeyGeneratorInterface
     */
    private $keys;

    /**
     * @var int
     */
    private $ttl;

    /**
     * @param CacheEngineInterface        $engine Storage engine.
     * @param RequestKeyGeneratorInterface $keys  Page key generator.
     * @param int                         $ttl   Default entry lifetime.
     */
    public function __construct(CacheEngineInterface $engine, RequestKeyGeneratorInterface $keys, int $ttl = 86400)
    {
        $this->engine = $engine;
        $this->keys = $keys;
        $this->ttl = $ttl;
    }

    /**
     * @inheritdoc
     */
    public function find(PageRequest $request): ?PageCacheEntry
    {
        $key = $this->keys->generate($request);
        $found = false;
        $payload = $this->engine->get($key->value(), $this->resolveGroup($key), $found);

        if (!$found || !is_array($payload)) {
            return null;
        }

        $entry = PageCacheEntry::fromArray($payload);
        if ($entry === null || $entry->isExpired()) {
            $this->engine->delete($key->value(), $this->resolveGroup($key));

            return null;
        }

        return $entry;
    }

    /**
     * @inheritdoc
     */
    public function put(PageRequest $request, PageCacheEntry $entry): bool
    {
        $key = $this->keys->generate($request);

        return $this->engine->set(
            $key->value(),
            $entry->toArray(),
            $entry->ttl() > 0 ? $entry->ttl() : $this->ttl,
            $this->resolveGroup($key)
        );
    }

    /**
     * @inheritdoc
     */
    public function forget(PageRequest $request): bool
    {
        $key = $this->keys->generate($request);

        return $this->engine->delete($key->value(), $this->resolveGroup($key));
    }

    /**
     * @inheritdoc
     */
    public function purgeAll(): bool
    {
        return $this->engine->flush(self::GROUP);
    }

    /**
     * @param \Jankx\Cache\Key\CacheKey $key Resolved key.
     * @return string
     */
    private function resolveGroup($key): string
    {
        $group = $key->group();

        return $group !== '' ? $group : self::GROUP;
    }
}
