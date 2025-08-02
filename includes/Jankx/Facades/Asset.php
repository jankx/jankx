<?php

namespace Jankx\Facades;

/**
 * Asset Facade
 *
 * Provides a clean interface to the Asset Service for managing theme assets.
 *
 * @package Jankx\Facades
 * @since 2.0.0
 */
class Asset extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'asset';
    }
} 