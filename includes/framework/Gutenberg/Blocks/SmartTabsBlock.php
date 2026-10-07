<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Gutenberg\SmartTabs\SmartTabTriggerInterface;
use Jankx\Gutenberg\SmartTabs\SmartTabTriggerRegistry;
use WP_Block;

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
     * Track localization to prevent duplicates.
     *
     * @var bool
     */
    protected static $editorDataLocalized = false;
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
     * Initialise block specific logic.
     *
     * @return void
     */
    public function init()
    {
        add_action('init', function () {
            SmartTabTriggerRegistry::instance()->boot();
        }, 50);

        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets']);
    }

    /**
     * Localise trigger configuration for the block editor.
     *
     * @return void
     */
    public function enqueueEditorAssets(): void
    {
        if (self::$editorDataLocalized) {
            return;
        }

        SmartTabTriggerRegistry::instance()->boot();

        $handle = 'jankx-smart-tab-editor-script';

        if (!wp_script_is($handle, 'registered')) {
            return;
        }

        wp_enqueue_script($handle);

        $context = $this->resolveEditorContext();
        $config = SmartTabTriggerRegistry::instance()->toEditorConfig($context);

        wp_add_inline_script(
            $handle,
            'window.JankxSmartTabTriggers = ' . wp_json_encode(['items' => $config]) . ';',
            'before'
        );

        self::$editorDataLocalized = true;
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
        SmartTabTriggerRegistry::instance()->boot();

        $tab_type = $attributes['tabType'] ?? 'horizontal';
        $style_type = $attributes['styleType'] ?? 'default';
        $active_tab = $attributes['activeTab'] ?? 0;
        $tab_alignment = $attributes['tabAlignment'] ?? 'left';
        $hide_tabs_border_bottom = $attributes['hideTabsBorderBottom'] ?? false;
        $center_navigation = $attributes['centerNavigation'] ?? false;
        $hide_tab_content = $attributes['hideTabContent'] ?? false;
        $label = $attributes['label'] ?? '';
        $show_label = $attributes['showLabel'] ?? false;
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

        if ($hide_tab_content) {
            $wrapper_classes[] = 'smart-tabs--hide-content';
        }

        // Build wrapper attributes
        $wrapper_attrs = [
            'class' => implode(' ', $wrapper_classes),
            'data-active-tab' => (string) max(0, (int) $active_tab),
        ];

        if (!empty($anchor)) {
            $wrapper_attrs['id'] = esc_attr($anchor);
        }

        // Parse inner blocks to build tab navigation
        $inner_blocks = $block->parsed_block['innerBlocks'] ?? [];
        $render_context = $this->resolveRenderContext($block);
        $tab_nav_html = $this->renderTabNavigation($inner_blocks, $active_tab, $tab_alignment, $attributes, $render_context);

        // Build label HTML
        $label_html = '';
        if ($show_label && !empty($label)) {
            $label_html = sprintf(
                '<div class="smart-tabs__label">%s</div>',
                esc_html($label)
            );
        }

        // Build attributes string
        $attrs_string = '';
        foreach ($wrapper_attrs as $key => $value) {
            $attrs_string .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
        }

        // Build navigation HTML
        $navigation_html = sprintf(
            '<div class="smart-tabs__navigation">%s%s</div>',
            $label_html,
            $tab_nav_html
        );

        // Only render content wrapper if hideTabContent is false
        if ($hide_tab_content) {
            return sprintf(
                '<div%s>%s</div>',
                $attrs_string,
                $navigation_html
            );
        }

        // Render with content wrapper
        return sprintf(
            '<div%s>%s<div class="smart-tabs__content">%s</div></div>',
            $attrs_string,
            $navigation_html,
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
    protected function renderTabNavigation($inner_blocks, $active_tab, $tab_alignment = 'left', $parent_attributes = [], $context = [])
    {
        if (empty($inner_blocks)) {
            return '';
        }

        $tab_type = (string) ($parent_attributes['tabType'] ?? 'horizontal');

        // Get parent tab styles (applied to all tabs as defaults)
        $parent_tab_item_text_color = $parent_attributes['tabItemTextColor'] ?? '';
        $parent_tab_item_bg_color = $parent_attributes['tabItemBackgroundColor'] ?? '';
        $parent_tab_item_gradient = $parent_attributes['tabItemGradient'] ?? '';
        $parent_active_tab_text_color = $parent_attributes['activeTabTextColor'] ?? '';
        $parent_active_tab_bg_color = $parent_attributes['activeTabBackgroundColor'] ?? '';
        $parent_active_tab_gradient = $parent_attributes['activeTabGradient'] ?? '';
        $parent_active_border_color = $parent_attributes['activeTabBorderColor'] ?? '';
        $parent_active_border_style = $parent_attributes['activeTabBorderStyle'] ?? '';
        $parent_active_border_width = $parent_attributes['activeTabBorderWidth'] ?? '';

        $registry = SmartTabTriggerRegistry::instance();
        $nav_items = [];
        foreach ($inner_blocks as $index => $block) {
            if ($block['blockName'] !== 'jankx/smart-tab') {
                continue;
            }

            $attributes = $block['attrs'] ?? [];
            $trigger_key = $attributes['trigger'] ?? 'manual';
            $trigger = $registry->getTrigger($trigger_key);

            $tab_context = $context;
            $tab_context['tab_index'] = $index;
            $tab_context['tab_attributes'] = $attributes;
            $tab_context['parent_attributes'] = $parent_attributes;

            $supports = [];
            if ($trigger instanceof SmartTabTriggerInterface) {
                $attributes = $trigger->prepareAttributes($attributes);
                $tab_context['tab_attributes'] = $attributes;
                $editor_settings = $trigger->getEditorSettings($tab_context);
                $supports = $editor_settings['supports'] ?? [];

                if (method_exists($trigger, 'shouldDisplay') && $trigger->shouldDisplay($attributes, $tab_context) === false) {
                    continue;
                }
            }

            $base_title = '';
            if (!empty($attributes['title'])) {
                $base_title = (string) $attributes['title'];
            } else {
                $base_title = sprintf(__('Tab %d', 'jankx'), $index + 1);
            }

            if ($trigger instanceof SmartTabTriggerInterface) {
                $title = $trigger->resolveTitle($base_title, $attributes, $tab_context);
            } else {
                $title = $base_title;
            }

            $icon_type = $attributes['iconType'] ?? 'none';
            $icon = $attributes['icon'] ?? '';
            $icon_position = $attributes['iconPosition'] ?? 'before';
            $icon_size = $attributes['iconSize'] ?? '16px';
            $icon_color = $attributes['iconColor'] ?? '';

            if (($supports['icon'] ?? true) === false) {
                $icon_type = 'none';
                $icon = '';
            }

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

            // Build tab style as CSS custom properties (parent styles as default,
            // individual styles can override). Exposing normal + active states as
            // custom properties lets the CSS `is-active` class decide which state
            // applies, so switching tabs (class toggling) behaves consistently.
            $tab_styles = [];

            // Normal state: color + background (gradient or solid color)
            $text_color = !empty($individual_normal_text_color) ? $individual_normal_text_color : $parent_tab_item_text_color;
            $gradient = !empty($individual_normal_gradient) ? $individual_normal_gradient : $parent_tab_item_gradient;
            $bg_color = !empty($individual_normal_bg_color) ? $individual_normal_bg_color : $parent_tab_item_bg_color;

            if (!empty($text_color)) {
                $tab_styles[] = sprintf('--smart-tabs-item-color: %s', esc_attr($text_color));
            }
            if (!empty($gradient)) {
                $tab_styles[] = sprintf('--smart-tabs-item-bg: %s', esc_attr($gradient));
            } elseif (!empty($bg_color)) {
                $tab_styles[] = sprintf('--smart-tabs-item-bg: %s', esc_attr($bg_color));
            }

            // Active state: color + background (gradient or solid color)
            $active_text_color = !empty($individual_active_text_color) ? $individual_active_text_color : $parent_active_tab_text_color;
            $active_gradient = !empty($individual_active_gradient) ? $individual_active_gradient : $parent_active_tab_gradient;
            $active_bg_color = !empty($individual_active_bg_color) ? $individual_active_bg_color : $parent_active_tab_bg_color;

            if (!empty($active_text_color)) {
                $tab_styles[] = sprintf('--smart-tabs-active-color: %s', esc_attr($active_text_color));
            }
            if (!empty($active_gradient)) {
                $tab_styles[] = sprintf('--smart-tabs-active-bg: %s', esc_attr($active_gradient));
            } elseif (!empty($active_bg_color)) {
                $tab_styles[] = sprintf('--smart-tabs-active-bg: %s', esc_attr($active_bg_color));
            }

            if (!empty($parent_active_border_color) && $parent_active_border_style !== 'none') {
                $active_border_width = !empty($parent_active_border_width) ? $parent_active_border_width : '3px';
                $active_border_style = !empty($parent_active_border_style) ? $parent_active_border_style : 'solid';
                $tab_styles[] = sprintf('--smart-tabs-active-border-color: %s', esc_attr($parent_active_border_color));
                $tab_styles[] = sprintf('--smart-tabs-active-border-style: %s', esc_attr($active_border_style));
                $tab_styles[] = sprintf('--smart-tabs-active-border-width: %s', esc_attr($active_border_width));
            }

            $tab_style_attr = !empty($tab_styles) ? sprintf(' style="%s"', implode('; ', $tab_styles)) : '';

            // Build icon HTML. Prefer an icon inner block (jankx/svg-icon,
            // jankx/advanced-image-box, jankx/icon-picker) that is inserted
            // automatically when the user picks an icon type. Falls back to the
            // legacy attribute-based icon for un-migrated content.
            $icon_inner_block = $this->findTabIconBlock($block['innerBlocks'] ?? []);
            $icon_html = '';
            if ($icon_type !== 'none') {
                if (!empty($icon_inner_block)) {
                    $icon_html = $this->renderTabIconMarkup($icon_inner_block);
                } elseif (!empty($icon)) {
                    $icon_html = wp_kses_post($icon);
                }

                if ($icon_html !== '') {
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
                        $icon_html
                    );
                }
            }

            // Build nav item HTML
            $label_html = sprintf('<span class="smart-tabs__nav-label">%s</span>', esc_html($title));

            if ($icon_position === 'after') {
                $content_html = $label_html . $icon_html;
            } else {
                $content_html = $icon_html . $label_html;
            }

            // Build additional data attributes for advanced-filter trigger
            $additional_data_attrs = '';
            if ($trigger_key === 'advanced-filter') {
                // Get targetBlockId from triggerSettings
                $trigger_settings = $attributes['triggerSettings'] ?? [];
                $target_block_id = $trigger_settings['targetBlockId'] ?? '';
                
                if (!empty($target_block_id)) {
                    $additional_data_attrs .= sprintf(' data-target-block-id="%s"', esc_attr($target_block_id));
                }

                $target_block_ids = $trigger_settings['targetBlockIds'] ?? [];
                if (is_array($target_block_ids) && !empty($target_block_ids)) {
                    $additional_data_attrs .= sprintf(
                        ' data-target-block-ids="%s"',
                        esc_attr(wp_json_encode(array_values(array_map('strval', $target_block_ids))))
                    );
                }

                // Try to get filter data from advanced-filter block in inner blocks
                // Pass tab index to extractFilterDataFromTab for matching with terms
                $block_with_index = $block;
                $block_with_index['tab_index'] = $index;
                $filter_data = $this->extractFilterDataFromTab($block_with_index);
                
                if (!empty($filter_data['filterType'])) {
                    $additional_data_attrs .= sprintf(' data-filter-type="%s"', esc_attr($filter_data['filterType']));
                }
                
                if (!empty($filter_data['filterValue'])) {
                    $additional_data_attrs .= sprintf(' data-filter-value="%s"', esc_attr($filter_data['filterValue']));
                }
                
                if (!empty($filter_data['taxonomy'])) {
                    $additional_data_attrs .= sprintf(' data-taxonomy="%s"', esc_attr($filter_data['taxonomy']));
                }
            }

            if ($trigger_key === 'open-link') {
                $trigger_settings = $attributes['triggerSettings'] ?? [];
                $href = isset($trigger_settings['url']) ? (string) $trigger_settings['url'] : '';
                $target = isset($trigger_settings['target']) ? (string) $trigger_settings['target'] : '_self';
                $rel = isset($trigger_settings['rel']) ? (string) $trigger_settings['rel'] : '';

                if (empty($href)) {
                    $href = '#';
                }

                $rel_attr = $rel ? sprintf(' rel="%s"', esc_attr($rel)) : '';

                $nav_items[] = sprintf(
                    '<a class="%s" role="tab" aria-selected="%s" tabindex="%s" data-tab-index="%d" data-trigger="%s" href="%s" target="%s"%s%s>%s</a>',
                    implode(' ', $item_classes),
                    $is_active ? 'true' : 'false',
                    $is_active ? '0' : '-1',
                    $index,
                    esc_attr($trigger_key),
                    esc_url($href),
                    esc_attr($target),
                    $rel_attr,
                    $tab_style_attr,
                    $content_html
                );
            } else {
                $nav_items[] = sprintf(
                    '<button class="%s" role="tab" aria-selected="%s" tabindex="%s" data-tab-index="%d" data-trigger="%s" type="button"%s%s>%s</button>',
                    implode(' ', $item_classes),
                    $is_active ? 'true' : 'false',
                    $is_active ? '0' : '-1',
                    $index,
                    esc_attr($trigger_key),
                    $tab_style_attr,
                    $additional_data_attrs,
                    $content_html
                );
            }
        }

        return sprintf(
            '<div class="smart-tabs__nav-list align-%s" role="tablist">%s</div>',
            esc_attr($tab_alignment),
            implode('', $nav_items)
        );
    }

    /**
     * Find the first icon inner block (svg / image / icon picker) inside a tab.
     *
     * @param array $inner_blocks Parsed inner blocks of the tab.
     * @return array The matching parsed block or an empty array.
     */
    protected function findTabIconBlock($inner_blocks)
    {
        $icon_block_names = [
            'jankx/svg-icon',
            'jankx/advanced-image-box',
            'jankx/icon-picker',
        ];

        foreach ((array) $inner_blocks as $inner_block) {
            $name = $inner_block['blockName'] ?? '';
            if (in_array($name, $icon_block_names, true)) {
                return $inner_block;
            }
        }

        return [];
    }

    /**
     * Render the nav icon markup from an icon inner block.
     *
     * @param array $icon_block Parsed icon block.
     * @return string Safe icon markup.
     */
    protected function renderTabIconMarkup(array $icon_block)
    {
        $name = $icon_block['blockName'] ?? '';
        $attrs = $icon_block['attrs'] ?? [];

        if ($name === 'jankx/svg-icon') {
            $svg = $attrs['icon'] ?? '';
            return $svg !== '' ? wp_kses_post($svg) : '';
        }

        if ($name === 'jankx/advanced-image-box') {
            $url = $attrs['url'] ?? '';
            if ($url === '') {
                $attachment_id = (int) ($attrs['id'] ?? 0);
                if ($attachment_id > 0 && function_exists('wp_get_attachment_image_url')) {
                    $url = (string) wp_get_attachment_image_url($attachment_id, 'full');
                }
            }
            if ($url === '') {
                return '';
            }

            $alt = isset($attrs['alt']) ? esc_attr((string) $attrs['alt']) : '';
            return sprintf(
                '<img src="%s" alt="%s" class="smart-tabs__nav-image" />',
                esc_url($url),
                $alt
            );
        }

        if ($name === 'jankx/icon-picker') {
            $icon_name = (string) ($attrs['iconName'] ?? '');
            if ($icon_name === '') {
                return '';
            }

            $icon_type = (string) ($attrs['iconType'] ?? 'material');
            $icon_category = (string) ($attrs['iconCategory'] ?? '');
            $icon_style = (string) ($attrs['iconStyle'] ?? '');
            $icon_size = (string) ($attrs['iconSize'] ?? '');
            $icon_color = (string) ($attrs['iconColor'] ?? '');

            $styles = [];
            if ($icon_size !== '') {
                $styles[] = sprintf('font-size: %s', esc_attr($icon_size));
            }
            if ($icon_color !== '') {
                $styles[] = sprintf('color: %s', esc_attr($icon_color));
            }
            $style_attr = !empty($styles) ? sprintf(' style="%s"', implode('; ', $styles)) : '';

            if ($icon_type === 'fontawesome') {
                $prefix = $icon_category === 'brands' ? 'fab' : ($icon_category === 'regular' ? 'far' : 'fas');
                return sprintf(
                    '<i class="%s fa-%s"%s></i>',
                    esc_attr($prefix),
                    esc_attr($icon_name),
                    $style_attr
                );
            }

            if ($icon_type === 'custom') {
                return sprintf(
                    '<span class="icon icon-%s"%s></span>',
                    esc_attr($icon_name),
                    $style_attr
                );
            }

            $material_class = ($icon_style !== '' && $icon_style !== 'filled')
                ? 'material-icons-' . esc_attr($icon_style)
                : 'material-icons';
            return sprintf(
                '<span class="%s"%s>%s</span>',
                $material_class,
                $style_attr,
                esc_html($icon_name)
            );
        }

        return '';
    }

    /**
     * Build editor context.
     *
     * @return array<string, mixed>
     */
    protected function resolveEditorContext(): array
    {
        $post_id = get_the_ID();

        if (!$post_id) {
            $post = get_post();
            if ($post) {
                $post_id = $post->ID;
            }
        }

        $post_type = $post_id ? get_post_type($post_id) : '';

        return [
            'post_id' => $post_id ? (int) $post_id : 0,
            'post_type' => $post_type ?: '',
            'is_admin' => is_admin(),
        ];
    }

    /**
     * Build render context used when resolving triggers.
     *
     * @param WP_Block|\WP_Block|null $block
     * @return array<string, mixed>
     */
    protected function resolveRenderContext($block): array
    {
        $post_id = 0;
        $post_type = '';

        if ($block instanceof WP_Block && isset($block->context['postId'])) {
            $post_id = (int) $block->context['postId'];
        }

        if ($block instanceof WP_Block && isset($block->context['postType'])) {
            $post_type = (string) $block->context['postType'];
        }

        if (!$post_id) {
            $post_id = get_the_ID() ?: 0;
        }

        if (!$post_type && $post_id) {
            $post_type = get_post_type($post_id) ?: '';
        }

        return [
            'post_id' => $post_id,
            'post_type' => $post_type ?: '',
            'is_admin' => is_admin(),
        ];
    }

    /**
     * Extract filter data from advanced-filter block in tab inner blocks
     *
     * @param array $tab_block Tab block data
     * @return array Filter data (filterType, filterValue, taxonomy)
     */
    protected function extractFilterDataFromTab(array $tab_block): array
    {
        $filter_data = [];
        
        // Get inner blocks of the tab
        $inner_blocks = $tab_block['innerBlocks'] ?? [];
        
        foreach ($inner_blocks as $inner_block) {
            // Check if this is an advanced-filter block
            if (($inner_block['blockName'] ?? '') === 'jankx/advanced-filter') {
                $attrs = $inner_block['attrs'] ?? [];
                
                // Get filter type
                $filter_type = $attrs['filterType'] ?? 'taxonomy';
                $filter_data['filterType'] = $filter_type;
                
                // Get filter value based on filter type
                switch ($filter_type) {
                    case 'taxonomy':
                        // Get taxonomy
                        $taxonomy = $attrs['taxonomy'] ?? '';
                        if ($taxonomy) {
                            $filter_data['taxonomy'] = $taxonomy;
                        }
                        
                        // Get filter value (term ID or slug)
                        // First, try to get from triggerSettings (set in editor)
                        $trigger_settings = $tab_block['attrs']['triggerSettings'] ?? [];
                        $filter_value = $trigger_settings['filterValue'] ?? '';
                        
                        // If not in triggerSettings, try to get from filterValue attribute
                        if (empty($filter_value)) {
                            $filter_value = $attrs['filterValue'] ?? '';
                        }
                        
                        // If still empty, try to match tab index with taxonomy terms
                        // Tab index 0 = "All" (empty), tab index 1 = first term, etc.
                        if (empty($filter_value) && !empty($taxonomy)) {
                            // Get tab index from context (passed from renderTabNavigation)
                            $tab_index = $tab_block['tab_index'] ?? -1;
                            
                            if ($tab_index > 0) {
                                // Get taxonomy terms
                                $terms = get_terms([
                                    'taxonomy' => $taxonomy,
                                    'hide_empty' => false,
                                    'orderby' => 'term_order',
                                    'order' => 'ASC',
                                ]);
                                
                                if (!is_wp_error($terms) && !empty($terms) && is_array($terms)) {
                                    // Tab index 1 = first term (index 0 in terms array)
                                    $term_index = $tab_index - 1;
                                    if (isset($terms[$term_index])) {
                                        $term = $terms[$term_index];
                                        // Use term ID as filter value (can be changed to slug if needed)
                                        $filter_value = (string) $term->term_id;
                                    }
                                }
                            }
                        }
                        
                        // Note: For tab index 0 (All), filterValue should be empty
                        // For other tabs, filterValue should be set in editor, triggerSettings, or matched by tab index
                        if (!empty($filter_value)) {
                            $filter_data['filterValue'] = $filter_value;
                        }
                        break;
                        
                    case 'meta':
                        $meta_key = $attrs['metaKey'] ?? '';
                        $meta_value = $attrs['filterValue'] ?? '';
                        if ($meta_key) {
                            $filter_data['metaKey'] = $meta_key;
                        }
                        if ($meta_value) {
                            $filter_data['filterValue'] = $meta_value;
                        }
                        break;
                        
                    case 'price':
                        $min_price = $attrs['filterValueMin'] ?? '';
                        $max_price = $attrs['filterValueMax'] ?? '';
                        if ($min_price) {
                            $filter_data['filterValueMin'] = $min_price;
                        }
                        if ($max_price) {
                            $filter_data['filterValueMax'] = $max_price;
                        }
                        break;
                        
                    case 'date':
                        $start_date = $attrs['filterValueStart'] ?? '';
                        $end_date = $attrs['filterValueEnd'] ?? '';
                        if ($start_date) {
                            $filter_data['filterValueStart'] = $start_date;
                        }
                        if ($end_date) {
                            $filter_data['filterValueEnd'] = $end_date;
                        }
                        break;
                        
                    case 'author':
                    case 'keyword':
                        $filter_value = $attrs['filterValue'] ?? '';
                        if ($filter_value) {
                            $filter_data['filterValue'] = $filter_value;
                        }
                        break;
                }
                
                // Only return data from the first advanced-filter block found
                break;
            }
        }
        
        return $filter_data;
    }
}
