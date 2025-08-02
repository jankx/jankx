<?php

namespace Jankx\Facades;

use Jankx\Facades\Facade;

/**
 * Footer Facade
 *
 * @package Jankx\Facades
 * @since 2.0.0
 */
class Footer extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'layout.footer';
    }
}
