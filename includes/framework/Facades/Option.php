<?php

namespace Jankx\Facades;

use Jankx\Adapter\Options\Helper;

class Option extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'option';
    }

    /**
     * Get an option value
     *
     * @param string $optionName
     * @param mixed $defaultValue
     * @return mixed
     */
    public static function get($optionName, $defaultValue = null)
    {
        if (class_exists(Helper::class)) {
            return Helper::getOption($optionName, $defaultValue);
        }
        
        return $defaultValue;
    }
}
