<?php

/**
 * Advanced Filters Renderer
 *
 * Coordinator class that orchestrates filter rendering
 * Uses Strategy pattern with FilterRendererFactory
 *
 * @package Jankx\Layouts\AdvancedFilters
 * @since 1.0.0
 */

namespace Jankx\Layouts\AdvancedFilters;

use Jankx\Layouts\AdvancedFilters\Contracts\FilterRendererInterface;

class AdvancedFiltersRenderer
{
    /**
     * Factory initialized flag
     *
     * @var bool
     */
    protected static $factoryInitialized = false;

    /**
     * Constructor
     */
    public function __construct()
    {
        // Initialize factory with default renderers (only once)
        if (!self::$factoryInitialized) {
            FilterRendererFactory::init();
            self::$factoryInitialized = true;
        }
    }

    /**
     * Render all filters
     *
     * @param array $attributes Block attributes
     * @param array $config Filter configuration
     * @return void
     */
    public function render(array $attributes, array $config): void
    {
        // Prepare global settings
        $global_settings = [
            'showLabels' => $attributes['showLabels'] ?? true,
            'displayStyle' => $attributes['displayStyle'] ?? 'buttons',
            'showCount' => $attributes['showCount'] ?? false,
            'showEmptyTerms' => $attributes['showEmptyTerms'] ?? true,
            'showOnlyTopLevel' => $attributes['showOnlyTopLevel'] ?? false,
            'showHierarchy' => $attributes['showHierarchy'] ?? false,
            'displayAsDropdown' => $attributes['displayAsDropdown'] ?? false,
            'multipleSelection' => $attributes['multipleSelection'] ?? true,
            'layout' => $attributes['layout'] ?? 'horizontal',
            'multiPostTypes' => $attributes['multiPostTypes'] ?? ['enabled' => false, 'postTypes' => []],
        ];

        // Combine all filter types
        $all_filters = array_merge(
            $this->prepareFilters('taxonomy', $attributes['taxonomyFilters'] ?? []),
            $this->prepareFilters('meta', $attributes['metaFilters'] ?? []),
            $this->prepareFilters('price', $attributes['priceFilters'] ?? []),
            $this->prepareFilters('date', $attributes['dateFilters'] ?? []),
            $this->prepareFilters('author', $attributes['authorFilters'] ?? []),
            $this->prepareFilters('keyword', $attributes['keywordFilter'] ?? [])
        );

        // Render each filter using appropriate renderer
        foreach ($all_filters as $filter) {
            if (empty($filter['enabled'])) {
                continue;
            }

            $filter_type = $filter['filterType'] ?? 'taxonomy';
            
            // Get renderer for this filter type
            if (FilterRendererFactory::hasRenderer($filter_type)) {
                $renderer = FilterRendererFactory::create($filter_type);
                
                if ($renderer->canHandle($filter)) {
                    $renderer->render($filter, $global_settings);
                }
            }
        }
    }

    /**
     * Prepare filters with type
     *
     * @param string $type Filter type
     * @param array $filters Filters array
     * @return array Prepared filters
     */
    protected function prepareFilters(string $type, array $filters): array
    {
        // Wrap keyword filter in array format to match other filters
        if ($type === 'keyword' && !isset($filters[0])) {
            $filters = [$filters];
        }

        $prepared = [];
        foreach ($filters as $filter) {
            $filter['filterType'] = $type;
            $prepared[] = $filter;
        }

        return $prepared;
    }

    /**
     * Register a custom renderer
     *
     * @param string $type Filter type
     * @param string $class Renderer class name
     * @return void
     */
    public function registerRenderer(string $type, string $class): void
    {
        FilterRendererFactory::register($type, $class);
    }

    /**
     * Get all registered renderers
     *
     * @return array
     */
    public function getRegisteredRenderers(): array
    {
        return FilterRendererFactory::getRegisteredRenderers();
    }
}
