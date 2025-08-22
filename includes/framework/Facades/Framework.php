<?php

namespace Jankx\Facades;

/**
 * Framework Facade
 *
 * Provides access to framework-related functionality and global values
 */
class Framework extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'framework';
    }

    /**
     * Get the jankx slug value
     *
     * @return string
     */
    public static function jankx()
    {
        return static::getFacadeRoot()->jankx ?? 'jankx-settings';
    }

    /**
     * Set the jankx slug value
     *
     * @param string $value
     * @return void
     */
    public static function setJankx($value)
    {
        static::getFacadeRoot()->jankx = $value;
    }
}
