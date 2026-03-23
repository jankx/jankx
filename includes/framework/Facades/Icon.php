<?php

namespace Jankx\Facades;

class Icon extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'font-icons.manager';
    }

    /**
     * Helper to render icon with default font-family from config
     */
    public static function display($iconName, $attributes = [])
    {
        $renderer = static::getFacadeRoot();
        // Default to fontawesome if no type specified
        $type = $attributes['type'] ?? 'fontawesome';
        unset($attributes['type']);
        
        return $renderer->render($iconName, $type, $attributes);
    }
}
