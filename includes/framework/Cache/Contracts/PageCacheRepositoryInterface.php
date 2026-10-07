<?php

namespace Jankx\Cache\Contracts;

use Jankx\Cache\Page\PageCacheEntry;
use Jankx\Cache\Page\PageRequest;

/**
 * Persistence of rendered pages (Repository pattern).
 *
 * @package Jankx\Cache\Contracts
 * @since 2.0.0
 */
interface PageCacheRepositoryInterface
{
    /**
     * @param PageRequest $request Requested page.
     * @return PageCacheEntry|null Null on miss or expiry.
     */
    public function find(PageRequest $request): ?PageCacheEntry;

    /**
     * @param PageRequest     $request Requested page.
     * @param PageCacheEntry  $entry   Page payload.
     * @return bool
     */
    public function put(PageRequest $request, PageCacheEntry $entry): bool;

    /**
     * Forget a single URL.
     *
     * @param PageRequest $request Requested page.
     * @return bool
     */
    public function forget(PageRequest $request): bool;

    /**
     * Forget every stored page.
     *
     * @return bool
     */
    public function purgeAll(): bool;
}
