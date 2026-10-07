<?php

namespace Jankx\Cache\Contracts;

use Jankx\Cache\Key\CacheKey;

/**
 * Builds the cache key of a front-end request (Strategy pattern).
 *
 * @package Jankx\Cache\Contracts
 * @since 2.0.0
 */
interface RequestKeyGeneratorInterface
{
    /**
     * @param \Jankx\Cache\Page\PageRequest $request Requested page.
     * @return CacheKey
     */
    public function generate($request): CacheKey;
}
