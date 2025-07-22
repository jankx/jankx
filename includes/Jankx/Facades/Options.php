<?php

namespace Jankx\Facades;

use Jankx\Gutenberg\LayoutOptions;

/**
 * Options Facade
 *
 * Provides easy access to Layout Options functionality.
 */
class Options extends \Jankx\Facade
{
    /**
     * Get the facade accessor
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return LayoutOptions::class;
    }

    /**
     * Register an option group
     *
     * @param string $name Group name
     * @param array $config Group configuration
     * @return void
     */
    public static function registerGroup($name, array $config)
    {
        LayoutOptions::registerGroup($name, $config);
    }

    /**
     * Register an option
     *
     * @param string $name Option name
     * @param array $config Option configuration
     * @return void
     */
    public static function register($name, array $config)
    {
        LayoutOptions::registerOption($name, $config);
    }

    /**
     * Get all option groups
     *
     * @return array Option groups
     */
    public static function getGroups()
    {
        return LayoutOptions::getGroups();
    }

    /**
     * Get all options
     *
     * @return array All options
     */
    public static function all()
    {
        return LayoutOptions::getOptions();
    }

    /**
     * Get options by group
     *
     * @param string $group Group name
     * @return array Options in group
     */
    public static function getByGroup($group)
    {
        return LayoutOptions::getOptionsByGroup($group);
    }

    /**
     * Get options for a specific layout
     *
     * @param string $layoutName Layout name
     * @return array Options for layout
     */
    public static function getForLayout($layoutName)
    {
        return LayoutOptions::getOptionsForLayout($layoutName);
    }

    /**
     * Get option value
     *
     * @param string $optionName Option name
     * @param array $attributes Block attributes
     * @return mixed Option value
     */
    public static function getValue($optionName, $attributes = [])
    {
        return LayoutOptions::getOptionValue($optionName, $attributes);
    }

    /**
     * Get all option values for a layout
     *
     * @param string $layoutName Layout name
     * @param array $attributes Block attributes
     * @return array Option values
     */
    public static function getValues($layoutName, $attributes = [])
    {
        return LayoutOptions::getOptionValues($layoutName, $attributes);
    }

    /**
     * Generate CSS classes from option values
     *
     * @param array $values Option values
     * @return string CSS classes
     */
    public static function generateClasses($values)
    {
        return LayoutOptions::generateClasses($values);
    }

    /**
     * Generate CSS styles from option values
     *
     * @param array $values Option values
     * @return string CSS styles
     */
    public static function generateStyles($values)
    {
        return LayoutOptions::generateStyles($values);
    }

    /**
     * Validate option value
     *
     * @param string $optionName Option name
     * @param mixed $value Option value
     * @return bool Is valid
     */
    public static function validate($optionName, $value)
    {
        return LayoutOptions::validateOption($optionName, $value);
    }

    /**
     * Get option configuration
     *
     * @param string $optionName Option name
     * @return array|null Option configuration
     */
    public static function get($optionName)
    {
        return LayoutOptions::getOption($optionName);
    }

    /**
     * Check if option exists
     *
     * @param string $optionName Option name
     * @return bool
     */
    public static function has($optionName)
    {
        return LayoutOptions::hasOption($optionName);
    }
}