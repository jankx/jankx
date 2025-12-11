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

        // Get parent tab styles (applied to all tabs as defaults)
        $parent_tab_item_text_color = $parent_attributes['tabItemTextColor'] ?? '';
        $parent_tab_item_bg_color = $parent_attributes['tabItemBackgroundColor'] ?? '';
        $parent_tab_item_gradient = $parent_attributes['tabItemGradient'] ?? '';
        $parent_active_tab_text_color = $parent_attributes['activeTabTextColor'] ?? '';
        $parent_active_tab_bg_color = $parent_attributes['activeTabBackgroundColor'] ?? '';
        $parent_active_tab_gradient = $parent_attributes['activeTabGradient'] ?? '';

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

            // Build additional data attributes for advanced-filter trigger
            $additional_data_attrs = '';
            if ($trigger_key === 'advanced-filter') {
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

            $nav_items[] = sprintf(
                '<button class="%s" data-tab-index="%d" data-trigger="%s" type="button"%s%s>%s</button>',
                implode(' ', $item_classes),
                $index,
                esc_attr($trigger_key),
                $tab_style_attr,
                $additional_data_attrs,
                $content_html
            );
        }

        return sprintf(
            '<div class="smart-tabs__nav-list align-%s">%s</div>',
            esc_attr($tab_alignment),
            implode('', $nav_items)
        );
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

