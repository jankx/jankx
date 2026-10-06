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
        // Kiểm tra xem có nằm trong smart-tab không bằng block context
        // (context được truyền từ jankx/smart-tab qua providesContext)
        $is_smart_tab_child = false;
        if ($block && !empty($block->context)) {
            $trigger = $block->context['jankx/smartTabTrigger'] ?? '';
            $is_smart_tab_child = $trigger !== '';
        }

        // Fallback: kiểm tra parent block
        if (!$is_smart_tab_child && $block) {
            $parent_block = $block->parent ?? null;
            if ($parent_block && isset($parent_block->parsed_block)) {
                $parent_name = $parent_block->parsed_block['blockName'] ?? '';
                if ($parent_name === 'jankx/smart-tab') {
                    $is_smart_tab_child = true;
                }
            }
        }

        // Nếu là child của smart-tab, render data attributes để JavaScript đọc được
        if ($is_smart_tab_child) {
            return $this->renderSmartTabChild($attributes, $block);
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
            'multiPostTypes' => $filter['multiPostTypes']
                ?? $ctx['jankx/advanced-filters/multiPostTypes']
                ?? ['enabled' => false, 'postTypes' => []],
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

        $widthClass = 'jankx-advanced-filter--width-' . esc_attr($width);
        [$box_styled, $box_vars] = $this->resolveBoxStyle($block);

        $wrapperClass = 'jankx-advanced-filter jankx-advanced-filter--layout-' . esc_attr($containerLayout) . ' ' . $widthClass . ' filter-group';
        if ($box_styled) {
            $wrapperClass .= ' jankx-filter-box-styled';
        }

        $wrapperAttrs = get_block_wrapper_attributes([
            'class' => $wrapperClass,
            'data-filter-type' => esc_attr($type),
            'style' => $box_vars,
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
    protected function renderSmartTabChild(array $attributes, ?object $block = null): string
    {
        $filterType = $attributes['filterType'] ?? 'taxonomy';

        $wrapperAttrs = [
            'class' => 'wp-block-jankx-advanced-filter jankx-advanced-filter',
            'data-filter-type' => esc_attr($filterType),
        ];

        [$box_styled, $box_vars] = $this->resolveBoxStyle($block);
        if ($box_styled) {
            $wrapperAttrs['class'] .= ' jankx-filter-box-styled';
        }
        if ($box_vars !== '') {
            $wrapperAttrs['style'] = $box_vars;
        }

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

    /**
     * Read the checkbox/radio style blocks (jankx/filter-checkbox, jankx/filter-radio)
     * dropped into this filter and turn their attributes into CSS custom
     * properties for the filter wrapper.
     *
     * @param object|null $block Parsed block object
     * @return array{0: bool, 1: string} Whether a style block exists and the CSS declarations
     */
    protected function resolveBoxStyle(?object $block): array
    {
        if (!$block instanceof \WP_Block || empty($block->inner_blocks)) {
            return [false, ''];
        }

        $styleBlocks = ['jankx/filter-checkbox', 'jankx/filter-radio'];
        $numericAttributes = ['size', 'borderWidth', 'radius', 'gap'];
        $properties = [
            'size' => '--jankx-filter-box-size',
            'borderWidth' => '--jankx-filter-box-border-width',
            'borderColor' => '--jankx-filter-box-border-color',
            'checkedColor' => '--jankx-filter-box-checked-color',
            'gap' => '--jankx-filter-box-gap',
        ];

        $styled = false;
        $declarations = '';

        foreach ($block->inner_blocks as $inner) {
            $name = is_object($inner) && isset($inner->name) ? (string) $inner->name : '';
            if (!in_array($name, $styleBlocks, true)) {
                continue;
            }

            $innerProperties = $properties;
            if ($name === 'jankx/filter-checkbox') {
                $innerProperties['radius'] = '--jankx-filter-box-radius';
            }

            $attributes = is_object($inner) && isset($inner->attributes) && is_array($inner->attributes)
                ? $inner->attributes
                : [];

            foreach ($innerProperties as $attribute => $property) {
                if (!isset($attributes[$attribute]) || $attributes[$attribute] === '' || $attributes[$attribute] === null) {
                    continue;
                }

                $value = $attributes[$attribute];
                if (is_numeric($value) && in_array($attribute, $numericAttributes, true)) {
                    $value .= 'px';
                } else {
                    $value = (string) $value;
                }

                $declarations .= $property . ':' . $value . ';';
            }

            $styled = true;
        }

        return [$styled, $declarations];
    }
}

