<?php

namespace Jankx\Cache\Contracts;

use Jankx\Cache\Page\PageCacheEntry;
use Jankx\Cache\Page\PageRequest;

/**
 * Adapter between the page cache and one web server (Strategy pattern).
 *
 * Each implementation owns three things and nothing else:
 *
 * 1. where pages should live for that server (`defaultMode()`);
 * 2. which response headers make the server cache them;
 * 3. how cached entries get invalidated (tag purge, HTTP PURGE, plugin API).
 *
 * Adding a server = one new class + one line in ServerIntegrationFactory.
 *
 * @package Jankx\Cache\Contracts
 * @since 2.0.0
 */
interface ServerIntegrationInterface
{
    /**
     * Server identifier (litespeed, nginx, apache, varnish, generic).
     *
     * @return string
     */
    public function getName(): string;

    /**
     * Mode used when cache.page.mode = auto.
     *
     * @return string storage|edge|both
     */
    public function defaultMode(): string;

    /**
     * Whether the server can purge by cache tag (LiteSpeed, Varnish BAN).
     *
     * @return bool
     */
    public function supportsTags(): bool;

    /**
     * Response headers for the current request.
     *
     * @param PageRequest        $request Current request.
     * @param PageCacheEntry|null $entry   Served entry, when any.
     * @param string             $state   PageCache::STATE_* constant.
     * @param array              $options Resolved cache.page configuration.
     * @return array<string,string>
     */
    public function headers(PageRequest $request, ?PageCacheEntry $entry, string $state, array $options): array;

    /**
     * Invalidate cached entries on the server side.
     *
     * @param string[] $tags    Cache tags.
     * @param string[] $urls    Absolute URLs.
     * @param array    $options Resolved cache.page configuration.
     * @return bool
     */
    public function purge(array $tags, array $urls, array $options): bool;
}
