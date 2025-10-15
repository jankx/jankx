<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Smart Tabs Block
 *
 * An advanced tabbed content block with customizable layouts and styles.
 * Supports horizontal and vertical orientations with multiple style variations.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class SmartTabsBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/smart-tabs';

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block inner content (already saved)
     * @param \WP_Block $block Block instance
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        $tab_type = $attributes['tabType'] ?? 'horizontal';
        $style_type = $attributes['styleType'] ?? 'default';
        $active_tab = $attributes['activeTab'] ?? 0;
        $tab_alignment = $attributes['tabAlignment'] ?? 'left';
        $hide_tabs_border_bottom = $attributes['hideTabsBorderBottom'] ?? false;
        $center_navigation = $attributes['centerNavigation'] ?? false;
        $class_name = $attributes['className'] ?? '';
        $anchor = $attributes['anchor'] ?? '';

        // Build wrapper classes
        $wrapper_classes = [
            'smart-tabs',
            'smart-tabs--' . esc_attr($tab_type),
            'smart-tabs--style-' . esc_attr($style_type),
        ];

        // Add conditional classes
        if ($hide_tabs_border_bottom) {
            $wrapper_classes[] = 'smart-tabs--hide-border-bottom';
        }

        if ($center_navigation) {
            $wrapper_classes[] = 'smart-tabs--center-navigation';
        }

        if (!empty($class_name)) {
            $wrapper_classes[] = esc_attr($class_name);
        }

        // Build wrapper attributes
        $wrapper_attrs = [
            'class' => implode(' ', $wrapper_classes),
        ];

        if (!empty($anchor)) {
            $wrapper_attrs['id'] = esc_attr($anchor);
        }

        // Parse inner blocks to build tab navigation
        $inner_blocks = $block->parsed_block['innerBlocks'] ?? [];
        $tab_nav_html = $this->renderTabNavigation($inner_blocks, $active_tab, $tab_alignment, $attributes);

        // Build attributes string
        $attrs_string = '';
        foreach ($wrapper_attrs as $key => $value) {
            $attrs_string .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
        }

        // Wrap saved content với navigation
        return sprintf(
            '<div%s><div class="smart-tabs__navigation">%s</div><div class="smart-tabs__content">%s</div></div>',
            $attrs_string,
            $tab_nav_html,
            $content  // Content đã được save sẵn từ JavaScript
        );
    }

    /**
     * Render tab navigation
     *
     * @param array $inner_blocks Inner blocks
     * @param int $active_tab Active tab index
     * @param string $tab_alignment Tab alignment
     * @param array $parent_attributes Parent block attributes (for global tab styles)
     * @return string Navigation HTML
     */
    protected function renderTabNavigation($inner_blocks, $active_tab, $tab_alignment = 'left', $parent_attributes = [])
    {
        if (empty($inner_blocks)) {
            return '';
        }

        // Get parent tab styles (applied to all tabs as defaults)
        $parent_tab_item_text_color = $parent_attributes['tabItemTextColor'] ?? '';
        $parent_tab_item_bg_color = $parent_attributes['tabItemBackgroundColor'] ?? '';
        $parent_tab_item_gradient = $parent_attributes['tabItemGradient'] ?? '';
        $parent_active_tab_text_color = $parent_attributes['activeTabTextColor'] ?? '';
        $parent_active_tab_bg_color = $parent_attributes['activeTabBackgroundColor'] ?? '';
        $parent_active_tab_gradient = $parent_attributes['activeTabGradient'] ?? '';

        $nav_items = [];
        foreach ($inner_blocks as $index => $block) {
            if ($block['blockName'] !== 'jankx/smart-tab') {
                continue;
            }

            $attributes = $block['attrs'] ?? [];
            $title = $attributes['title'] ?? sprintf(__('Tab %d', 'jankx'), $index + 1);
            $icon_type = $attributes['iconType'] ?? 'none';
            $icon = $attributes['icon'] ?? '';
            $icon_position = $attributes['iconPosition'] ?? 'before';
            $icon_size = $attributes['iconSize'] ?? '16px';
            $icon_color = $attributes['iconColor'] ?? '';

            // Individual tab style attributes (can override parent styles)
            $individual_normal_text_color = $attributes['normalTabTextColor'] ?? '';
            $individual_normal_bg_color = $attributes['normalTabBackgroundColor'] ?? '';
            $individual_normal_gradient = $attributes['normalTabGradient'] ?? '';
            $individual_active_text_color = $attributes['activeTabTextColor'] ?? '';
            $individual_active_bg_color = $attributes['activeTabBackgroundColor'] ?? '';
            $individual_active_gradient = $attributes['activeTabGradient'] ?? '';

            $is_active = $index === $active_tab;
            $item_classes = ['smart-tabs__nav-item'];
            if ($is_active) {
                $item_classes[] = 'is-active';
            }

            // Build tab inline styles (parent styles as default, individual styles can override)
            $tab_styles = [];
            if ($is_active) {
                // Active tab: use parent styles first, then individual overrides
                $text_color = !empty($individual_active_text_color) ? $individual_active_text_color : $parent_active_tab_text_color;
                $gradient = !empty($individual_active_gradient) ? $individual_active_gradient : $parent_active_tab_gradient;
                $bg_color = !empty($individual_active_bg_color) ? $individual_active_bg_color : $parent_active_tab_bg_color;

                if (!empty($text_color)) {
                    $tab_styles[] = sprintf('color: %s', esc_attr($text_color));
                }
                if (!empty($gradient)) {
                    $tab_styles[] = sprintf('background: %s', esc_attr($gradient));
                } elseif (!empty($bg_color)) {
                    $tab_styles[] = sprintf('background-color: %s', esc_attr($bg_color));
                }
            } else {
                // Normal tab: use parent styles first, then individual overrides
                $text_color = !empty($individual_normal_text_color) ? $individual_normal_text_color : $parent_tab_item_text_color;
                $gradient = !empty($individual_normal_gradient) ? $individual_normal_gradient : $parent_tab_item_gradient;
                $bg_color = !empty($individual_normal_bg_color) ? $individual_normal_bg_color : $parent_tab_item_bg_color;

                if (!empty($text_color)) {
                    $tab_styles[] = sprintf('color: %s', esc_attr($text_color));
                }
                if (!empty($gradient)) {
                    $tab_styles[] = sprintf('background: %s', esc_attr($gradient));
                } elseif (!empty($bg_color)) {
                    $tab_styles[] = sprintf('background-color: %s', esc_attr($bg_color));
                }
            }
            $tab_style_attr = !empty($tab_styles) ? sprintf(' style="%s"', implode('; ', $tab_styles)) : '';

            // Build icon HTML
            $icon_html = '';
            if ($icon_type !== 'none' && !empty($icon)) {
                $icon_styles = [];
                if (!empty($icon_size)) {
                    $icon_styles[] = sprintf('font-size: %s', esc_attr($icon_size));
                }
                if (!empty($icon_color)) {
                    $icon_styles[] = sprintf('color: %s', esc_attr($icon_color));
                }

                $icon_style_attr = !empty($icon_styles) ? sprintf(' style="%s"', implode('; ', $icon_styles)) : '';
                $icon_html = sprintf(
                    '<span class="smart-tabs__nav-icon"%s>%s</span>',
                    $icon_style_attr,
                    wp_kses_post($icon)
                );
            }

            // Build nav item HTML
            $label_html = sprintf('<span class="smart-tabs__nav-label">%s</span>', esc_html($title));

            if ($icon_position === 'after') {
                $content_html = $label_html . $icon_html;
            } else {
                $content_html = $icon_html . $label_html;
            }

            $nav_items[] = sprintf(
                '<button class="%s" data-tab-index="%d" type="button"%s>%s</button>',
                implode(' ', $item_classes),
                $index,
                $tab_style_attr,
                $content_html
            );
        }

        return sprintf(
            '<div class="smart-tabs__nav-list align-%s">%s</div>',
            esc_attr($tab_alignment),
            implode('', $nav_items)
        );
    }

}

