<?php

namespace Jankx\Facades;

use Jankx\Gutenberg\LayoutTemplate;

/**
 * Template Facade
 *
 * Provides easy access to Layout Template functionality.
 */
class Template extends \Jankx\Facade
{
    /**
     * Get the facade accessor
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return LayoutTemplate::class;
    }

    /**
     * Register a template
     *
     * @param string $name Template name
     * @param array $config Template configuration
     * @return void
     */
    public static function register($name, array $config)
    {
        LayoutTemplate::registerTemplate($name, $config);
    }

    /**
     * Get a registered template
     *
     * @param string $name Template name
     * @return array|null Template configuration
     */
    public static function get($name)
    {
        return LayoutTemplate::getTemplate($name);
    }

    /**
     * Get all registered templates
     *
     * @return array All templates
     */
    public static function all()
    {
        return LayoutTemplate::getTemplates();
    }

    /**
     * Check if template exists
     *
     * @param string $name Template name
     * @return bool
     */
    public static function has($name)
    {
        return LayoutTemplate::hasTemplate($name);
    }

    /**
     * Render a layout template
     *
     * @param string $layoutName Layout name
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public static function render($layoutName, $attributes = [], $content = '')
    {
        return LayoutTemplate::render($layoutName, $attributes, $content);
    }

    /**
     * Render a block within a layout
     *
     * @param string $blockName Block name
     * @param array $blockConfig Block configuration
     * @param array $variables Template variables
     * @return string Rendered block HTML
     */
    public static function renderBlock($blockName, $blockConfig, $variables = [])
    {
        return LayoutTemplate::renderBlock($blockName, $blockConfig, $variables);
    }

    /**
     * Render all blocks for a layout
     *
     * @param string $layoutName Layout name
     * @param array $variables Template variables
     * @return string Rendered blocks HTML
     */
    public static function renderBlocks($layoutName, $variables = [])
    {
        return LayoutTemplate::renderBlocks($layoutName, $variables);
    }

    /**
     * Get template variables for a layout
     *
     * @param string $layoutName Layout name
     * @param array $attributes Block attributes
     * @return array Template variables
     */
    public static function getVariables($layoutName, $attributes = [])
    {
        return LayoutTemplate::getTemplateVariables($layoutName, $attributes);
    }

    /**
     * Get blocks for a template
     *
     * @param string $layoutName Layout name
     * @return array Template blocks
     */
    public static function getBlocks($layoutName)
    {
        return LayoutTemplate::getTemplateBlocks($layoutName);
    }

    /**
     * Check if template has a specific block
     *
     * @param string $layoutName Layout name
     * @param string $blockName Block name
     * @return bool
     */
    public static function hasBlock($layoutName, $blockName)
    {
        return LayoutTemplate::hasBlock($layoutName, $blockName);
    }

    /**
     * Get block configuration
     *
     * @param string $layoutName Layout name
     * @param string $blockName Block name
     * @return array|null Block configuration
     */
    public static function getBlock($layoutName, $blockName)
    {
        return LayoutTemplate::getBlock($layoutName, $blockName);
    }
}