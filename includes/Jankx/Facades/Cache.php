<?php

namespace Jankx\Facades;

/**
 * Cache Facade
 *
 * Provides a clean interface to the Cache Service for managing cache operations.
 *
 * @package Jankx\Facades
 * @since 2.0.0
 */
class Cache extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'cache';
    }
} 