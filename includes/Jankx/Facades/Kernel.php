<?php

namespace Jankx\Facades;

use Jankx\Kernel\KernelManager;

/**
 * Kernel Facade
 *
 * Provides a static interface to access the KernelManager.
 *
 * @package Jankx\Facades
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @version 2.0.0
 * @license MIT
 */
class Kernel extends Facade
{
    /**
     * Get the registered name of the component
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return KernelManager::class;
    }
}
