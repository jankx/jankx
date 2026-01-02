<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts\ViewLayoutInterface;
use InvalidArgumentException;

class ViewLayoutFactory
{
    protected static $layouts = [];

    public static function init(): void
    {
        // Register default SSR layouts
        self::register('grid', class_exists('\App\ViewLayouts\ViewGridLayout') ? '\App\ViewLayouts\ViewGridLayout' : ViewGridLayout::class);
        self::register('list', class_exists('\App\ViewLayouts\ViewListLayout') ? '\App\ViewLayouts\ViewListLayout' : ViewListLayout::class);
        self::register('mansory', class_exists('\App\ViewLayouts\ViewMasonryLayout') ? '\App\ViewLayouts\ViewMasonryLayout' : ViewMasonryLayout::class);
        self::register('carousel', class_exists('\App\ViewLayouts\ViewCarouselLayout') ? '\App\ViewLayouts\ViewCarouselLayout' : ViewCarouselLayout::class);
    }

    public static function register(string $name, string $class): void
    {
        if (!class_exists($class)) {
            throw new InvalidArgumentException(sprintf('View layout class %s does not exist', $class));
        }
        if (!is_subclass_of($class, ViewLayoutInterface::class)) {
            throw new InvalidArgumentException(sprintf('View layout class %s must implement ViewLayoutInterface', $class));
        }
        self::$layouts[$name] = $class;
    }

    public static function create(string $layoutName): ViewLayoutInterface
    {
        if (!isset(self::$layouts[$layoutName])) {
            throw new InvalidArgumentException(
                sprintf('View layout "%s" is not registered. Available layouts: %s', $layoutName, implode(', ', array_keys(self::$layouts)))
            );
        }
        $class = self::$layouts[$layoutName];
        return new $class();
    }

    public static function getRegisteredLayouts(): array
    {
        return apply_filters('jankx/layouts/view-layout/registered-layouts', self::$layouts);
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
