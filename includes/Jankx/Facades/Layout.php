<?php

namespace Jankx\Facades;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Jankx\Gutenberg\LayoutRegistry;

/**
 * Layout Facade
 *
 * Provides easy access to Layout Registry functionality.
 * @since 2.0.0
 */
class Layout extends Facade
{
    /**
     * Get the facade accessor
     *
     * @return string
     * @since 2.0.0
     */
    protected static function getFacadeAccessor()
    {
        return LayoutRegistry::class;
    }

    /**
     * Register a new layout
     *
     * @param string $name Layout name
     * @param array $config Layout configuration
     * @return void
     * @since 2.0.0
     */
    public static function register($name, array $config)
    {
        LayoutRegistry::registerLayout($name, $config);
    }

    /**
     * Register a block within a layout
     *
     * @param string $layoutName Layout name
     * @param string $blockName Block name
     * @param array $config Block configuration
     * @return void
     * @since 2.0.0
     */
    public static function registerBlock($layoutName, $blockName, array $config = [])
    {
        LayoutRegistry::registerBlockInLayout($layoutName, $blockName, $config);
    }

    /**
     * Get a registered layout
     *
     * @param string $name Layout name
     * @return array|null Layout configuration
     * @since 2.0.0
     */
    public static function get($name)
    {
        return LayoutRegistry::getLayout($name);
    }

    /**
     * Get all registered layouts
     *
     * @return array All layouts
     * @since 2.0.0
     */
    public static function all()
    {
        return LayoutRegistry::getLayouts();
    }

    /**
     * Get layouts by category
     *
     * @param string $category Category name
     * @return array Layouts in category
     * @since 2.0.0
     */
    public static function getByCategory($category)
    {
        return LayoutRegistry::getLayoutsByCategory($category);
    }

    /**
     * Check if layout exists
     *
     * @param string $name Layout name
     * @return bool
     * @since 2.0.0
     */
    public static function has($name)
    {
        return LayoutRegistry::hasLayout($name);
    }

    /**
     * Get blocks for a specific layout
     *
     * @param string $layoutName Layout name
     * @return array Blocks in layout
     * @since 2.0.0
     */
    public static function getBlocks($layoutName)
    {
        return LayoutRegistry::getLayoutBlocks($layoutName);
    }

    /**
     * Get used layouts in current post
     *
     * @param int $postId Post ID
     * @return array Used layouts
     * @since 2.0.0
     */
    public static function getUsed($postId = null)
    {
        if (!$postId) {
            global $post;
            $postId = $post ? $post->ID : 0;
        }

        return LayoutRegistry::getUsedLayouts($postId);
    }

    /**
     * Get layout settings from attributes
     *
     * @param array $attributes Block attributes
     * @return array Layout settings
     * @since 2.0.0
     */
    public static function getSettings($attributes)
    {
        return LayoutRegistry::getLayoutSettings($attributes);
    }

    /**
     * Check if layout supports partial hydration
     *
     * @param string $layoutName Layout name
     * @return bool
     * @since 2.0.0
     */
    public static function supportsPartialHydration($layoutName)
    {
        return LayoutRegistry::supportsPartialHydration($layoutName);
    }
}
