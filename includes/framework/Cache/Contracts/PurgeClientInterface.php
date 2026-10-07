<?php

namespace Jankx\Cache\Contracts;

/**
 * Transport used to invalidate an edge cache (Adapter pattern).
 *
 * @package Jankx\Cache\Contracts
 * @since 2.0.0
 */
interface PurgeClientInterface
{
    /**
     * Invalidate everything the edge cache holds.
     *
     * @return bool
     */
    public function purgeAll(): bool;

    /**
     * Invalidate specific URLs.
     *
     * @param string[] $urls Absolute URLs.
     * @return bool
     */
    public function purgeUrls(array $urls): bool;

    /**
     * Invalidate entries carrying specific tags.
     *
     * @param string[] $tags Cache tags.
     * @return bool
     */
    public function purgeTags(array $tags): bool;
}
