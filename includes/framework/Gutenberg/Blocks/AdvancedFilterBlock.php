<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Layouts\AdvancedFilters\FilterRendererFactory;
use Jankx\Layouts\AdvancedFilters\FilterDataAttributeStrategyRegistry;

/**
 * Advanced Filter Block
 *
 * Block con đại diện cho một filter đơn lẻ, được sử dụng bên trong
 * block jankx/advanced-filters. Toàn bộ việc render UI thực tế do
 * parent block và renderer phía PHP đảm nhận.
 *
 * Refactored to use Strategy Pattern for filter type handling
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
            return $this->renderSmartTabChild($attributes);
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

        $containerLayout = $attributes['containerLayout'] ?? $attributes['layout'] ?? 'row';
        $justifyContent = $attributes['justifyContent'] ?? 'flex-start';
        $alignItems = $attributes['alignItems'] ?? 'center';
        $gap = $attributes['gap'] ?? '1rem';
        $flexWrap = $attributes['flexWrap'] ?? 'nowrap';
        $width = $attributes['width'] ?? 'full';
        $label = $attributes['label'] ?? '';

        $widthClass = 'jankx-advanced-filter--width-' . esc_attr($width);
        $wrapperAttrs = get_block_wrapper_attributes([
            'class' => 'jankx-advanced-filter jankx-advanced-filter--layout-' . esc_attr($containerLayout) . ' ' . $widthClass . ' filter-group',
            'data-filter-type' => esc_attr($type),
        ]);

        $contentAttrs = sprintf(
            'class="jankx-advanced-filter__content filter-%s" style="display: flex !important; flex-direction: %s !important; justify-content: %s !important; align-items: %s !important; gap: %s !important; flex-wrap: %s !important;"',
            esc_attr($type),
            $containerLayout === 'stack' ? 'column' : 'row',
            esc_attr($justifyContent),
            esc_attr($alignItems),
            esc_attr($gap),
            esc_attr($flexWrap)
        );

        ob_start();
        ?>
        <style>
            .jankx-advanced-filter--layout-row .jankx-advanced-filter__content > * {
                max-width: 100% !important;
                width: auto !important;
            }
            .jankx-advanced-filter--layout-stack .jankx-advanced-filter__content > * {
                width: 100% !important;
                flex: 0 0 100% !important;
            }
            .jankx-advanced-filter--width-full {
                width: 100% !important;
            }
            .jankx-advanced-filter--width-fit {
                width: fit-content !important;
            }
        </style>
        <form <?php echo $wrapperAttrs; ?> action="<?php echo esc_url(home_url('/')); ?>" method="get">
            <?php if ($label && ($attributes['showLabels'] ?? true)) : ?>
                <strong class="jankx-advanced-filter__label"><?php echo esc_html($label); ?></strong>
            <?php endif; ?>
            <div <?php echo $contentAttrs; ?>>
                <?php
                // If there are inner blocks, we use them. Otherwise, fallback to the default PHP renderer.
                if (empty(trim($content))) {
                    try {
                        $renderer = FilterRendererFactory::create($type);
                        if ($renderer->canHandle($filter)) {
                            $renderer->render($filter, $global);
                        }
                    } catch (\Throwable $e) {
                        // Swallow render errors to avoid breaking editor
                    }
                } else {
                    echo $content;
                }
                ?>
            </div>
        </form>
        <?php
        return ob_get_clean();
    }

    /**
     * Render filter block as smart-tab child using Strategy Pattern
     *
     * @param array $attributes Block attributes
     * @return string HTML output
     */
    protected function renderSmartTabChild(array $attributes): string
    {
        $filterType = $attributes['filterType'] ?? 'taxonomy';

        $wrapperAttrs = [
            'class' => 'wp-block-jankx-advanced-filter jankx-advanced-filter',
            'data-filter-type' => esc_attr($filterType),
        ];

        // Use Strategy Pattern to build type-specific attributes
        FilterDataAttributeStrategyRegistry::init();
        $strategy = FilterDataAttributeStrategyRegistry::resolve($filterType);

        if ($strategy !== null) {
            $typeAttributes = $strategy->buildAttributes($attributes);
            $wrapperAttrs = array_merge($wrapperAttrs, $typeAttributes);
        }

        // Build attributes string
        $attrsString = '';
        foreach ($wrapperAttrs as $key => $value) {
            $attrsString .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
        }

        return sprintf('<div%s></div>', $attrsString);
    }
}

