<?php

namespace Jankx\Layouts\DynamicDataLayout;

use Jankx\Layouts\DynamicDataLayout\Contracts\BlockTemplateLayoutInterface;
use Jankx\Layouts\DynamicDataLayout\BlockLayouts\GridLayout;
use Jankx\Layouts\DynamicDataLayout\BlockLayouts\ListLayout;
use Jankx\Layouts\DynamicDataLayout\BlockLayouts\MasonryLayout;
use Jankx\Layouts\DynamicDataLayout\BlockLayouts\CardLayout;
use Jankx\Layouts\DynamicDataLayout\BlockLayouts\CarouselLayout;
use Jankx\Layouts\DynamicDataLayout\BlockLayouts\HorizontalLayout;
use InvalidArgumentException;

class PostLayoutFactory
{
    protected static $layouts = [];

    public static function init(): void
    {
        self::register('grid', GridLayout::class);
        self::register('list', ListLayout::class);
        self::register('masonry', MasonryLayout::class);
        self::register('card', CardLayout::class);
        self::register('carousel', CarouselLayout::class);
        self::register('horizontal', HorizontalLayout::class);
    }

    public static function register(string $name, string $class): void
    {
        if (!class_exists($class)) {
            throw new InvalidArgumentException(sprintf('Layout class %s does not exist', $class));
        }
        if (!is_subclass_of($class, BlockTemplateLayoutInterface::class)) {
            throw new InvalidArgumentException(sprintf('Layout class %s must implement BlockTemplateLayoutInterface', $class));
        }
        self::$layouts[$name] = $class;
    }

    public static function create(string $layoutName): BlockTemplateLayoutInterface
    {
        if (!isset(self::$layouts[$layoutName])) {
            throw new InvalidArgumentException(
                sprintf('Layout "%s" is not registered. Available layouts: %s', $layoutName, implode(', ', array_keys(self::$layouts)))
            );
        }
        $class = self::$layouts[$layoutName];
        return new $class();
    }

    public static function getRegisteredLayouts(): array
    {
        return apply_filters('jankx/layouts/post-layout/registered-layouts', self::$layouts);
    }

    public static function hasLayout(string $layoutName): bool
    {
        return isset(self::$layouts[$layoutName]);
    }

    public static function getLayoutNames(): array
    {
        return array_keys(self::$layouts);
    }
}
