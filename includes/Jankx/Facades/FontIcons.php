<?php

namespace Jankx\Facades;

use Jankx\Facades\Facade;

class FontIcons extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'font-icons.repository';
    }

    // Get icons by type
    public static function get($type, $filters = [])
    {
        return static::getFacadeRoot()->getIconsByType($type, $filters);
    }

    // Search icons across all types
    public static function search($query, $type = null)
    {
        return static::getFacadeRoot()->searchIcons($query, $type);
    }

    // Render icon HTML
    public static function render($iconName, $type = 'custom', $attributes = [])
    {
        $provider = app("font-icons.{$type}");
        return $provider->renderIcon($iconName, $attributes);
    }

    // Get icon CSS class
    public static function getClass($iconName, $type = 'custom')
    {
        $provider = app("font-icons.{$type}");
        return $provider->getIconClass($iconName);
    }

    // Enqueue icon type CSS
    public static function enqueue($type)
    {
        $provider = app("font-icons.{$type}");
        $provider->enqueue();
    }

    // Check if icon type is active
    public static function isActive($type)
    {
        $manager = app('font-icons.manager');
        return $manager->isTypeActive($type);
    }

    // Get active icon types
    public static function getActiveTypes()
    {
        $manager = app('font-icons.manager');
        return $manager->getActiveTypes();
    }

    // Activate icon type
    public static function activate($type)
    {
        $manager = app('font-icons.manager');
        $manager->activateType($type);
    }

    // Deactivate icon type
    public static function deactivate($type)
    {
        $manager = app('font-icons.manager');
        $manager->deactivateType($type);
    }

    // Get icon info
    public static function getInfo($iconName, $type)
    {
        return static::getFacadeRoot()->getIconInfo($iconName, $type);
    }

    // Get categories
    public static function getCategories($type = null)
    {
        return static::getFacadeRoot()->getCategories($type);
    }

    // Clear cache
    public static function clearCache()
    {
        return static::getFacadeRoot()->clearCache();
    }

    // Refresh icon data
    public static function refresh()
    {
        return static::getFacadeRoot()->refreshIconData();
    }
}
