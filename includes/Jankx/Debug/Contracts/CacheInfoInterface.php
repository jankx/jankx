<?php

namespace Jankx\Debug\Contracts;

/**
 * Cache Info Interface
 *
 * @package Jankx\Debug\Contracts
 * @since 2.0.0
 */
interface CacheInfoInterface
{
    /**
     * Capture cache information
     *
     * @since 2.0.0
     */
    public function captureInfo(): void;

    /**
     * Get cache information
     *
     * @return array
     * @since 2.0.0
     */
    public function getCacheInfo(): array;

    /**
     * Get transients info
     *
     * @return array
     * @since 2.0.0
     */
    public function getTransientsInfo(): array;

    /**
     * Get object cache info
     *
     * @return array
     * @since 2.0.0
     */
    public function getObjectCacheInfo(): array;

    /**
     * Get plugin cache info
     *
     * @return array
     * @since 2.0.0
     */
    public function getPluginCacheInfo(): array;
}
