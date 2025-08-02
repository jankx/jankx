<?php

namespace Jankx\Facades;

use Jankx\Facades\Facade;

/**
 * Sidebar Facade
 *
 * @package Jankx\Facades
 * @since 2.0.0
 */
class Sidebar extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'layout.sidebar';
    }
}
