<?php

namespace Jankx\Facades;

/**
 * Hamburger Menu Facade
 *
 * Provides static access to HamburgerMenuService
 *
 * @package Jankx\Facades
 * @since 2.0.0
 */
class Hamburger extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return \App\Services\Layouts\HamburgerMenuService::class;
    }
}
