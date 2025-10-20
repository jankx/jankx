<?php

namespace Jankx\Layouts\PostLayout;

use Jankx\Layouts\PostLayout\Contracts\PostLayoutInterface;
use Jankx\Layouts\PostLayout\Supports\GridLayout;
use Jankx\Layouts\PostLayout\Supports\ListLayout;
use Jankx\Layouts\PostLayout\Supports\MasonryLayout;
use Jankx\Layouts\PostLayout\Supports\CardLayout;
use InvalidArgumentException;

/**
 * Post Layout Factory
 *
 * Factory pattern để tạo post layout instances
 *
 * @package Jankx\Layouts\PostLayout
 */
class PostLayoutFactory
{
    /**
     * Registered layout classes
     *
     * @var array
     */
    protected static $layouts = [];

    /**
     * Initialize default layouts
     */
    public static function init(): void
    {
        self::register('grid', GridLayout::class);
        self::register('list', ListLayout::class);
        self::register('masonry', MasonryLayout::class);
        self::register('card', CardLayout::class);
    }

    /**
     * Register a layout class
     *
     * @param string $name Layout name
     * @param string $class Layout class name
     * @return void
     */
    public static function register(string $name, string $class): void
    {
        if (!class_exists($class)) {
            throw new InvalidArgumentException(
                sprintf('Layout class %s does not exist', $class)
            );
        }

        if (!is_subclass_of($class, PostLayoutInterface::class)) {
            throw new InvalidArgumentException(
                sprintf('Layout class %s must implement PostLayoutInterface', $class)
            );
        }

        self::$layouts[$name] = $class;
    }

    /**
     * Create layout instance
     *
     * @param string $layoutName Layout name
     * @return PostLayoutInterface
     * @throws InvalidArgumentException
     */
    public static function create(string $layoutName): PostLayoutInterface
    {
        if (!isset(self::$layouts[$layoutName])) {
            throw new InvalidArgumentException(
                sprintf('Layout "%s" is not registered. Available layouts: %s', $layoutName, implode(', ', array_keys(self::$layouts)))
            );
        }

        $class = self::$layouts[$layoutName];
        return new $class();
    }

    /**
     * Get all registered layouts
     *
     * @return array
     */
    public static function getRegisteredLayouts(): array
    {
        return apply_filters(
            'jankx/layouts/post-layout/registered-layouts',
            self::$layouts
        );
    }

    /**
     * Check if layout exists
     *
     * @param string $layoutName
     * @return bool
     */
    public static function hasLayout(string $layoutName): bool
    {
        return isset(self::$layouts[$layoutName]);
    }

    /**
     * Get layout names
     *
     * @return array
     */
    public static function getLayoutNames(): array
    {
        return array_keys(self::$layouts);
    }
}
