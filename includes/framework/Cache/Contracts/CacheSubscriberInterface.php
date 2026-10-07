<?php

namespace Jankx\Cache\Contracts;

/**
 * Subscribes a set of WordPress hooks that keep the caches coherent
 * (Observer pattern).
 *
 * @package Jankx\Cache\Contracts
 * @since 2.0.0
 */
interface CacheSubscriberInterface
{
    /**
     * Register the invalidation hooks.
     *
     * @return void
     */
    public function subscribe(): void;
}
