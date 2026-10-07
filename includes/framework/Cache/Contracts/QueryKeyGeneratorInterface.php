<?php

namespace Jankx\Cache\Contracts;

use Jankx\Cache\Key\CacheKey;

/**
 * Builds the cache key of a database query (Strategy pattern).
 *
 * @package Jankx\Cache\Contracts
 * @since 2.0.0
 */
interface QueryKeyGeneratorInterface
{
    /**
     * @param string $sql     Fully built SQL statement (after every clause
     *                        filter has run), which uniquely describes the query.
     * @param array  $context Extra discriminators such as the `fields` argument.
     * @return CacheKey
     */
    public function generate(string $sql, array $context = []): CacheKey;
}
