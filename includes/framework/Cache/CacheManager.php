<?php

namespace Jankx\Cache;

use Jankx\Cache\Contracts\CacheEngineInterface;
use Jankx\Cache\Contracts\PageCacheInterface;
use Jankx\Cache\Contracts\QueryCacheInterface;
use Jankx\Cache\Contracts\ServerIntegrationInterface;

/**
 * Single entry point used by the CLI and by debugging tooling: it knows the
 * resolved configuration (engine, mode, server) and offers the two operations
 * an operator needs — report status, invalidate everything.
 *
 * @package Jankx\Cache
 * @since 2.0.0
 */
class CacheManager
{
    /**
     * @var CacheEngineInterface
     */
    private $engine;

    /**
     * @var PageCacheInterface
     */
    private $pageCache;

    /**
     * @var QueryCacheInterface
     */
    private $queryCache;

    /**
     * @var ServerIntegrationInterface
     */
    private $server;

    /**
     * @var array<string,mixed>
     */
    private $config;

    /**
     * @param CacheEngineInterface       $engine     Storage engine.
     * @param PageCacheInterface         $pageCache  Page cache.
     * @param QueryCacheInterface        $queryCache Query cache.
     * @param ServerIntegrationInterface $server     Server adapter.
     * @param array<string,mixed>        $config     Full cache configuration.
     */
    public function __construct(
        CacheEngineInterface $engine,
        PageCacheInterface $pageCache,
        QueryCacheInterface $queryCache,
        ServerIntegrationInterface $server,
        array $config = []
    ) {
        $this->engine = $engine;
        $this->pageCache = $pageCache;
        $this->queryCache = $queryCache;
        $this->server = $server;
        $this->config = $config;
    }

    /**
     * @return CacheEngineInterface
     */
    public function engine(): CacheEngineInterface
    {
        return $this->engine;
    }

    /**
     * @return PageCacheInterface
     */
    public function page(): PageCacheInterface
    {
        return $this->pageCache;
    }

    /**
     * @return QueryCacheInterface
     */
    public function query(): QueryCacheInterface
    {
        return $this->queryCache;
    }

    /**
     * @return ServerIntegrationInterface
     */
    public function server(): ServerIntegrationInterface
    {
        return $this->server;
    }

    /**
     * Resolved status, ready to print.
     *
     * @return array<string,mixed>
     */
    public function status(): array
    {
        return [
            'enabled' => !empty($this->config['enabled']),
            'engine' => [
                'driver' => $this->engine->getName(),
                'persistent' => $this->engine->isPersistent(),
            ],
            'page' => [
                'enabled' => $this->pageCache->isEnabled(),
                'mode' => $this->pageCache->mode(),
                'server' => $this->server->getName(),
                'storage' => $this->pageCache->usesStorage(),
                'edge' => $this->pageCache->usesEdge(),
            ],
            'query' => [
                'enabled' => $this->queryCache->isEnabled(),
                'stats' => $this->queryCache->stats(),
            ],
        ];
    }

    /**
     * Purge pages by tag/URL (storage and/or edge).
     *
     * @param string[] $tags Cache tags.
     * @param string[] $urls Absolute URLs.
     * @return bool
     */
    public function purge(array $tags = [], array $urls = []): bool
    {
        return $this->pageCache->purge($tags, $urls);
    }

    /**
     * Invalidate everything: storage, query cache and the edge cache.
     *
     * @return bool
     */
    public function clearAll(): bool
    {
        $ok = $this->engine->flush();

        if ($this->queryCache->isEnabled()) {
            $ok = $this->queryCache->flush() && $ok;
        }

        $ok = $this->pageCache->purge(['all'], []) && $ok;

        return $ok;
    }
}
