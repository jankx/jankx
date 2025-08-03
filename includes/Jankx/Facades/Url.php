<?php

namespace Jankx\Facades;

use Jankx\Managers\UrlManager;

/**
 * URL Facade for easy URL generation
 */
class Url extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return UrlManager::class;
    }
}
