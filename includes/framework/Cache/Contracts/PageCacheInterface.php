<?php

namespace Jankx\Cache\Contracts;

use Jankx\Cache\Page\PageCacheEntry;
use Jankx\Cache\Page\PageRequest;

/**
 * Full page cache: decide, serve, store, publish headers and purge.
 *
 * @package Jankx\Cache\Contracts
 * @since 2.0.0
 */
interface PageCacheInterface
{
    /**
     * @return bool
     */
    public function isEnabled(): bool;

    /**
     * Resolved mode: storage, edge or both.
     *
     * @return string
     */
    public function mode(): string;

    /**
     * @param PageRequest $request Requested page.
     * @return PageCacheEntry|null Null when nothing usable was found.
     */
    public function maybeServe(PageRequest $request): ?PageCacheEntry;

    /**
     * @param PageRequest $request     Current request.
     * @param string      $html        Rendered body.
     * @param int         $status      HTTP status code.
     * @param string      $contentType Response content type.
     * @return bool
     */
    public function store(PageRequest $request, string $html, int $status, string $contentType): bool;

    /**
     * Headers to publish for the current state (hit, miss, store).
     *
     * @param PageRequest       $request Current request.
     * @param PageCacheEntry|null $entry Entry that was served, when any.
     * @param string            $state   PageCache::STATE_* constant.
     * @return array<string,string>
     */
    public function headers(PageRequest $request, ?PageCacheEntry $entry, string $state): array;

    /**
     * Invalidate cached pages (storage and/or edge cache).
     *
     * @param string[] $tags Cache tags such as post-123, type-post, home.
     * @param string[] $urls Absolute URLs to purge.
     * @return bool
     */
    public function purge(array $tags = [], array $urls = []): bool;
}
