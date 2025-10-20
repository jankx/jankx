<?php

namespace Jankx\Facades;

/**
 * PostLayout Facade
 *
 * @method static void registerLayout(string $name, string $class)
 * @method static array getLayouts(array $args = [])
 * @method static \Jankx\Layouts\PostLayout\PostLayoutDecorator createLayout(string $layoutName, array $attributes = [])
 * @method static string render(string $layoutName, array $attributes)
 * @method static array renderPreview(string $layoutName, array $attributes = [])
 * @method static bool hasLayout(string $layoutName)
 * @method static array getLayoutOptions(string $layoutName)
 * @method static string getSupportedLayoutsJson()
 *
 * @package Jankx\Facades
 */
class PostLayout extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'post.layout.manager';
    }
}
