<?php

/**
 * Filter Renderer Factory
 *
 * Factory pattern để tạo filter renderer instances
 *
 * @package Jankx\Layouts\AdvancedFilters
 * @since 1.0.0
 */

namespace Jankx\Layouts\AdvancedFilters;

use Jankx\Layouts\AdvancedFilters\Contracts\FilterRendererInterface;
use Jankx\Layouts\AdvancedFilters\Renderers\TaxonomyFilterRenderer;
use InvalidArgumentException;

class FilterRendererFactory
{
    /**
     * Registered renderer classes
     *
     * @var array
     */
    protected static $renderers = [];

    /**
     * Initialize default renderers
     *
     * @return void
     */
    public static function init(): void
    {
        self::register('taxonomy', TaxonomyFilterRenderer::class);
        // TODO: Register other renderers as they're created
        // self::register('meta', MetaFilterRenderer::class);
        // self::register('price', PriceFilterRenderer::class);
        // self::register('date', DateFilterRenderer::class);
        // self::register('author', AuthorFilterRenderer::class);
        // self::register('keyword', KeywordFilterRenderer::class);
    }

    /**
     * Register a renderer class
     *
     * @param string $type Filter type
     * @param string $class Renderer class name
     * @return void
     * @throws InvalidArgumentException
     */
    public static function register(string $type, string $class): void
    {
        if (!class_exists($class)) {
            throw new InvalidArgumentException(
                sprintf('Renderer class %s does not exist', $class)
            );
        }

        if (!is_subclass_of($class, FilterRendererInterface::class)) {
            throw new InvalidArgumentException(
                sprintf('Renderer class %s must implement FilterRendererInterface', $class)
            );
        }

        self::$renderers[$type] = $class;
    }

    /**
     * Create renderer instance
     *
     * @param string $type Filter type
     * @return FilterRendererInterface
     * @throws InvalidArgumentException
     */
    public static function create(string $type): FilterRendererInterface
    {
        if (!isset(self::$renderers[$type])) {
            throw new InvalidArgumentException(
                sprintf('Renderer for type "%s" is not registered. Available types: %s', $type, implode(', ', array_keys(self::$renderers)))
            );
        }

        $class = self::$renderers[$type];
        return new $class();
    }

    /**
     * Get all registered renderers
     *
     * @return array
     */
    public static function getRegisteredRenderers(): array
    {
        return apply_filters(
            'jankx/layouts/filters/renderers/registered',
            self::$renderers
        );
    }

    /**
     * Check if renderer exists
     *
     * @param string $type Filter type
     * @return bool
     */
    public static function hasRenderer(string $type): bool
    {
        return isset(self::$renderers[$type]);
    }
}

