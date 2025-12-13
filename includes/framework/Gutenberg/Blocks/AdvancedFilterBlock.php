<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Layouts\AdvancedFilters\FilterRendererFactory;

/**
 * Advanced Filter Block
 *
 * Block con đại diện cho một filter đơn lẻ, được sử dụng bên trong
 * block jankx/advanced-filters. Toàn bộ việc render UI thực tế do
 * parent block và renderer phía PHP đảm nhận.
 */
class AdvancedFilterBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/advanced-filter';

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Render callback
     *
     * Khi được sử dụng trong smart-tab, render data attributes để JavaScript có thể đọc.
     * Khi được sử dụng trong advanced-filters, không render gì vì parent sẽ xử lý.
     *
     * @param array       $attributes
     * @param string      $content
     * @param \WP_Block|null $block
     * @return string
     */
    public function render($attributes, $content = '', $block = null)
    {
        // Kiểm tra xem parent block có phải là smart-tab không
        $parent_block = $block->parent ?? null;
        $is_smart_tab_child = false;
        
        if ($parent_block && isset($parent_block->parsed_block)) {
            $parent_name = $parent_block->parsed_block['blockName'] ?? '';
            if ($parent_name === 'jankx/smart-tab') {
                $is_smart_tab_child = true;
            }
        }
        
        // Nếu là child của smart-tab, render data attributes để JavaScript đọc được
        if ($is_smart_tab_child) {
            $filter_type = $attributes['filterType'] ?? 'taxonomy';
            $wrapper_attrs = [
                'class' => 'wp-block-jankx-advanced-filter jankx-advanced-filter',
                'data-filter-type' => esc_attr($filter_type),
            ];
            
            // Thêm data attributes dựa trên filter type
            switch ($filter_type) {
                case 'taxonomy':
                    if (!empty($attributes['taxonomy'])) {
                        $wrapper_attrs['data-taxonomy'] = esc_attr($attributes['taxonomy']);
                    }
                    if (!empty($attributes['filterValue'])) {
                        $wrapper_attrs['data-filter-value'] = esc_attr($attributes['filterValue']);
                    }
                    break;
                    
                case 'meta':
                    if (!empty($attributes['metaKey'])) {
                        $wrapper_attrs['data-meta-key'] = esc_attr($attributes['metaKey']);
                    }
                    if (!empty($attributes['filterValue'])) {
                        $wrapper_attrs['data-filter-value'] = esc_attr($attributes['filterValue']);
                    }
                    break;
                    
                case 'price':
                    if (!empty($attributes['filterValueMin'])) {
                        $wrapper_attrs['data-filter-value-min'] = esc_attr($attributes['filterValueMin']);
                    }
                    if (!empty($attributes['filterValueMax'])) {
                        $wrapper_attrs['data-filter-value-max'] = esc_attr($attributes['filterValueMax']);
                    }
                    break;
                    
                case 'date':
                    if (!empty($attributes['filterValueStart'])) {
                        $wrapper_attrs['data-filter-value-start'] = esc_attr($attributes['filterValueStart']);
                    }
                    if (!empty($attributes['filterValueEnd'])) {
                        $wrapper_attrs['data-filter-value-end'] = esc_attr($attributes['filterValueEnd']);
                    }
                    break;
                    
                case 'author':
                case 'keyword':
                    if (!empty($attributes['filterValue'])) {
                        $wrapper_attrs['data-filter-value'] = esc_attr($attributes['filterValue']);
                    }
                    break;
            }
            
            $attrs_string = '';
            foreach ($wrapper_attrs as $key => $value) {
                $attrs_string .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
            }
            
            return sprintf('<div%s></div>', $attrs_string);
        }
        
        // Nếu là child của advanced-filters, không render gì; dữ liệu được parent xử lý.
        // Thay vào đó, tự render UI filter dựa trên attributes + context từ parent
        $filter = is_array($attributes) ? $attributes : [];

        // Build global settings from parent context (provided by advanced-filters block)
        $ctx = is_object($block) && property_exists($block, 'context') ? (array) $block->context : [];
        $global = [
            'showLabels' => $ctx['jankx/advanced-filters/showLabels'] ?? true,
            'displayStyle' => $ctx['jankx/advanced-filters/displayStyle'] ?? 'buttons',
            'showCount' => $ctx['jankx/advanced-filters/showCount'] ?? false,
            'showEmptyTerms' => $ctx['jankx/advanced-filters/showEmptyTerms'] ?? true,
            'showOnlyTopLevel' => $ctx['jankx/advanced-filters/showOnlyTopLevel'] ?? false,
            'showHierarchy' => $ctx['jankx/advanced-filters/showHierarchy'] ?? false,
            'displayAsDropdown' => $ctx['jankx/advanced-filters/displayAsDropdown'] ?? false,
            'multipleSelection' => $ctx['jankx/advanced-filters/multipleSelection'] ?? true,
            'layout' => $ctx['jankx/advanced-filters/layout'] ?? 'horizontal',
            'listingType' => $filter['listingType'] ?? 'ul',
        ];

        // Initialize renderer factory and render according to filter type
        FilterRendererFactory::init();
        $type = $filter['filterType'] ?? 'taxonomy';
        if (!FilterRendererFactory::hasRenderer($type)) {
            return '';
        }

        ob_start();
        try {
            $renderer = FilterRendererFactory::create($type);
            if ($renderer->canHandle($filter)) {
                $renderer->render($filter, $global);
            }
        } catch (\Throwable $e) {
            // Swallow render errors to avoid breaking editor
        }
        return ob_get_clean();
    }
}

