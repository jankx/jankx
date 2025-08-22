<?php

namespace Jankx\Facades;

/**
 * User Facade
 *
 * Provides a clean interface to the User Service for managing user data.
 *
 * @package Jankx\Facades
 * @since 2.0.0
 */
class User extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'user';
    }
}
