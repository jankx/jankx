<?php
/**
 * Advanced Filter Integration
 *
 * Tích hợp advanced filter với theme và post-layout block
 */

namespace Jankx\Gutenberg\Blocks\AdvancedFilters;

if (!defined('ABSPATH')) {
    exit;
}

class AdvancedFilterIntegration
{

    private static $instance = null;

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        add_action('init', [$this, 'register_block']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);
        add_action('wp_ajax_jankx_post_layout_fetch_data', [$this, 'handle_post_layout_fetch']);
        add_action('wp_ajax_nopriv_jankx_post_layout_fetch_data', [$this, 'handle_post_layout_fetch']);

        // Include handler classes
        $this->include_handlers();
    }

    /**
     * Include handler classes
     */
    private function include_handlers()
    {
        $block_dir = __DIR__;

        require_once $block_dir . '/AdvancedFilterHandler.php';
        require_once $block_dir . '/AdvancedFilterHooks.php';
    }

    /**
     * Register block
     */
    public function register_block()
    {
        if (!function_exists('register_block_type')) {
            return;
        }

        $block_json = __DIR__ . '/block.json';
        if (!file_exists($block_json)) {
            return;
        }

        register_block_type($block_json, [
            'render_callback' => [$this, 'render_block'],
            'attributes' => $this->get_block_attributes()
        ]);
    }

    /**
     * Get block attributes
     */
    private function get_block_attributes()
    {
        return [
            'filterId' => [
                'type' => 'string',
                'default' => ''
            ],
            'filterType' => [
                'type' => 'string',
                'default' => 'taxonomy'
            ],
            'filterConfig' => [
                'type' => 'object',
                'default' => []
            ],
            'targetBlocks' => [
                'type' => 'array',
                'default' => []
            ],
            'ajaxSettings' => [
                'type' => 'object',
                'default' => []
            ],
            'displaySettings' => [
                'type' => 'object',
                'default' => []
            ],
            'styling' => [
                'type' => 'object',
                'default' => []
            ],
            'customFilters' => [
                'type' => 'array',
                'default' => []
            ],
            'metaFilters' => [
                'type' => 'array',
                'default' => []
            ],
            'dateFilters' => [
                'type' => 'array',
                'default' => []
            ],
            'priceFilters' => [
                'type' => 'array',
                'default' => []
            ],
            'customFields' => [
                'type' => 'array',
                'default' => []
            ]
        ];
    }

    /**
     * Render block
     */
    public function render_block($attributes, $content)
    {
        $filter_id = $attributes['filterId'] ?? 'filter_' . uniqid();
        $filter_type = $attributes['filterType'] ?? 'taxonomy';
        $filter_config = $attributes['filterConfig'] ?? [];
        $target_blocks = $attributes['targetBlocks'] ?? [];
        $ajax_settings = $attributes['ajaxSettings'] ?? [];
        $display_settings = $attributes['displaySettings'] ?? [];
        $styling = $attributes['styling'] ?? [];
        $custom_filters = $attributes['customFilters'] ?? [];
        $meta_filters = $attributes['metaFilters'] ?? [];
        $date_filters = $attributes['dateFilters'] ?? [];
        $price_filters = $attributes['priceFilters'] ?? [];
        $custom_fields = $attributes['customFields'] ?? [];

        // Build filter configuration
        $config = [
            'filterId' => $filter_id,
            'filterType' => $filter_type,
            'filterConfig' => $filter_config,
            'targetBlocks' => array_filter($target_blocks, function($target) {
                return $target['enabled'] ?? false;
            }),
            'ajaxSettings' => array_merge([
                'enabled' => true,
                'loadingText' => 'Đang tải...',
                'errorText' => 'Có lỗi xảy ra',
                'updateURL' => true,
                'scrollToResults' => true,
                'animationDuration' => 300,
                'debounceDelay' => 300
            ], $ajax_settings),
            'displaySettings' => array_merge([
                'showLabel' => true,
                'labelText' => 'Lọc theo:',
                'showReset' => true,
                'resetText' => 'Xóa bộ lọc',
                'showCount' => true,
                'showLoading' => true,
                'responsive' => true
            ], $display_settings),
            'styling' => array_merge([
                'layout' => 'horizontal',
                'gap' => 15,
                'borderRadius' => 8,
                'shadow' => 'none',
                'backgroundColor' => 'transparent',
                'textColor' => 'inherit'
            ], $styling),
            'filters' => [
                'custom' => array_filter($custom_filters, function($filter) {
                    return $filter['enabled'] ?? false;
                }),
                'meta' => array_filter($meta_filters, function($filter) {
                    return $filter['enabled'] ?? false;
                }),
                'date' => array_filter($date_filters, function($filter) {
                    return $filter['enabled'] ?? false;
                }),
                'price' => array_filter($price_filters, function($filter) {
                    return $filter['enabled'] ?? false;
                }),
                'customFields' => array_filter($custom_fields, function($field) {
                    return $field['enabled'] ?? false;
                })
            ]
        ];

        // Apply filters để custom config
        $config = apply_filters('jankx_advanced_filter_config', $config, $attributes);

        // Generate unique ID for this filter instance
        $instance_id = 'jankx-advanced-filter-' . $filter_id;

        // Build CSS classes
        $classes = [
            'jankx-advanced-filter',
            'jankx-advanced-filter-' . $filter_type,
            'jankx-advanced-filter-layout-' . ($styling['layout'] ?? 'horizontal')
        ];

        if ($styling['responsive'] ?? true) {
            $classes[] = 'jankx-advanced-filter-responsive';
        }

        $classes = apply_filters('jankx_advanced_filter_classes', $classes, $attributes);

        // Start output buffering
        ob_start();
        ?>
        <div class="<?php echo esc_attr(implode(' ', $classes)); ?>" id="<?php echo esc_attr($instance_id); ?>">
            <div class="jankx-advanced-filter-config" data-config="<?php echo esc_attr(json_encode($config)); ?>" style="display: none;"></div>
            <div class="jankx-advanced-filter-content">
                <?php $this->render_filter_content($config, $attributes); ?>
            </div>
        </div>
        <?php

        $output = ob_get_clean();

        // Apply filters để custom output
        $output = apply_filters('jankx_advanced_filter_output', $output, $config, $attributes);

        return $output;
    }

    /**
     * Render filter content
     */
    private function render_filter_content($config, $attributes)
    {
        $filters = $config['filters'];
        $display_settings = $config['displaySettings'];

        // Render taxonomy filters
        if (!empty($filters['taxonomy'])) {
            $this->render_taxonomy_filters($filters['taxonomy'], $display_settings);
        }

        // Render meta filters
        if (!empty($filters['meta'])) {
            $this->render_meta_filters($filters['meta'], $display_settings);
        }

        // Render custom filters
        if (!empty($filters['custom'])) {
            $this->render_custom_filters($filters['custom'], $display_settings);
        }

        // Render date filters
        if (!empty($filters['date'])) {
            $this->render_date_filters($filters['date'], $display_settings);
        }

        // Render price filters
        if (!empty($filters['price'])) {
            $this->render_price_filters($filters['price'], $display_settings);
        }

        // Render reset button
        if ($display_settings['showReset']) {
            $this->render_reset_button($display_settings);
        }
    }

    /**
     * Render taxonomy filters
     */
    private function render_taxonomy_filters($taxonomy_filters, $display_settings)
    {
        foreach ($taxonomy_filters as $taxonomy => $filter) {
            $terms = get_terms([
                'taxonomy' => $taxonomy,
                'hide_empty' => false,
                'orderby' => $filter['orderBy'] ?? 'name',
                'order' => $filter['order'] ?? 'ASC'
            ]);

            if (is_wp_error($terms) || empty($terms)) {
                continue;
            }

            echo '<div class="jankx-filter-taxonomy">';

            if ($display_settings['showLabel']) {
                echo '<label class="jankx-filter-label">' . esc_html($display_settings['labelText'] ?? 'Lọc theo:') . '</label>';
            }

            echo '<div class="jankx-filter-options">';

            // Show all option
            if ($filter['showAll'] ?? true) {
                $all_text = $filter['allText'] ?? 'Tất cả';
                echo '<label class="jankx-filter-option jankx-filter-all">';
                echo '<input type="radio" name="' . esc_attr($taxonomy) . '" value="" checked>';
                echo '<span>' . esc_html($all_text) . '</span>';
                echo '</label>';
            }

            // Terms options
            foreach ($terms as $term) {
                $count = ($filter['showCount'] ?? true) ? " ({$term->count})" : '';
                $input_type = ($filter['multiple'] ?? true) ? 'checkbox' : 'radio';
                $name = ($filter['multiple'] ?? true) ? $taxonomy . '[]' : $taxonomy;

                echo '<label class="jankx-filter-option">';
                echo '<input type="' . esc_attr($input_type) . '" name="' . esc_attr($name) . '" value="' . esc_attr($term->term_id) . '">';
                echo '<span>' . esc_html($term->name) . esc_html($count) . '</span>';
                echo '</label>';
            }

            echo '</div></div>';
        }
    }

    /**
     * Render meta filters
     */
    private function render_meta_filters($meta_filters, $display_settings)
    {
        foreach ($meta_filters as $filter) {
            if (!($filter['enabled'] ?? false)) {
                continue;
            }

            echo '<div class="jankx-filter-meta">';

            if ($display_settings['showLabel']) {
                echo '<label class="jankx-filter-label">' . esc_html($filter['label'] ?? 'Meta Filter') . '</label>';
            }

            $type = $filter['type'] ?? 'text';
            $name = $filter['metaKey'];
            $placeholder = $filter['placeholder'] ?? 'Nhập giá trị...';

            switch ($type) {
                case 'text':
                    echo '<input type="text" name="' . esc_attr($name) . '" placeholder="' . esc_attr($placeholder) . '" class="jankx-filter-input">';
                    break;
                case 'number':
                    echo '<input type="number" name="' . esc_attr($name) . '" placeholder="' . esc_attr($placeholder) . '" class="jankx-filter-input">';
                    break;
                case 'date':
                    echo '<input type="date" name="' . esc_attr($name) . '" class="jankx-filter-input">';
                    break;
                case 'checkbox':
                    echo '<label class="jankx-filter-checkbox">';
                    echo '<input type="checkbox" name="' . esc_attr($name) . '">';
                    echo ' ' . esc_html($filter['label'] ?? 'Yes');
                    echo '</label>';
                    break;
                default:
                    echo '<input type="text" name="' . esc_attr($name) . '" placeholder="' . esc_attr($placeholder) . '" class="jankx-filter-input">';
            }

            echo '</div>';
        }
    }

    /**
     * Render custom filters
     */
    private function render_custom_filters($custom_filters, $display_settings)
    {
        foreach ($custom_filters as $filter) {
            if (!($filter['enabled'] ?? false)) {
                continue;
            }

            echo '<div class="jankx-filter-custom">';

            if ($display_settings['showLabel']) {
                echo '<label class="jankx-filter-label">' . esc_html($filter['label'] ?? 'Custom Filter') . '</label>';
            }

            $type = $filter['type'] ?? 'text';
            $name = $filter['field'];
            $placeholder = $filter['placeholder'] ?? 'Nhập giá trị...';

            switch ($type) {
                case 'text':
                    echo '<input type="text" name="' . esc_attr($name) . '" placeholder="' . esc_attr($placeholder) . '" class="jankx-filter-input">';
                    break;
                case 'number':
                    echo '<input type="number" name="' . esc_attr($name) . '" placeholder="' . esc_attr($placeholder) . '" class="jankx-filter-input">';
                    break;
                case 'date':
                    echo '<input type="date" name="' . esc_attr($name) . '" class="jankx-filter-input">';
                    break;
                case 'checkbox':
                    echo '<label class="jankx-filter-checkbox">';
                    echo '<input type="checkbox" name="' . esc_attr($name) . '">';
                    echo ' ' . esc_html($filter['label'] ?? 'Yes');
                    echo '</label>';
                    break;
                default:
                    echo '<input type="text" name="' . esc_attr($name) . '" placeholder="' . esc_attr($placeholder) . '" class="jankx-filter-input">';
            }

            echo '</div>';
        }
    }

    /**
     * Render date filters
     */
    private function render_date_filters($date_filters, $display_settings)
    {
        foreach ($date_filters as $filter) {
            if (!($filter['enabled'] ?? false)) {
                continue;
            }

            echo '<div class="jankx-filter-date">';

            if ($display_settings['showLabel']) {
                echo '<label class="jankx-filter-label">' . esc_html($filter['label'] ?? 'Date Range') . '</label>';
            }

            echo '<div class="jankx-filter-date-range">';
            echo '<input type="date" name="start_date" placeholder="Từ ngày" class="jankx-filter-input">';
            echo '<span class="jankx-filter-separator">-</span>';
            echo '<input type="date" name="end_date" placeholder="Đến ngày" class="jankx-filter-input">';
            echo '</div></div>';
        }
    }

    /**
     * Render price filters
     */
    private function render_price_filters($price_filters, $display_settings)
    {
        foreach ($price_filters as $filter) {
            if (!($filter['enabled'] ?? false)) {
                continue;
            }

            echo '<div class="jankx-filter-price">';

            if ($display_settings['showLabel']) {
                echo '<label class="jankx-filter-label">' . esc_html($filter['label'] ?? 'Price Range') . '</label>';
            }

            echo '<div class="jankx-filter-price-range">';
            echo '<input type="number" name="min_price" placeholder="Giá tối thiểu" class="jankx-filter-input">';
            echo '<span class="jankx-filter-separator">-</span>';
            echo '<input type="number" name="max_price" placeholder="Giá tối đa" class="jankx-filter-input">';
            echo '<span class="jankx-filter-currency">' . esc_html($filter['currency'] ?? 'VND') . '</span>';
            echo '</div></div>';
        }
    }

    /**
     * Render reset button
     */
    private function render_reset_button($display_settings)
    {
        echo '<div class="jankx-filter-reset">';
        echo '<button type="button" class="jankx-filter-reset-btn">';
        echo esc_html($display_settings['resetText'] ?? 'Xóa bộ lọc');
        echo '</button>';
        echo '</div>';
    }

    /**
     * Enqueue scripts
     */
    public function enqueue_scripts()
    {
        if (!is_admin()) {
            wp_enqueue_script(
                'jankx-advanced-filter-frontend',
                get_template_directory_uri() . '/resources/blocks/advanced-filter/build/frontend.js',
                ['jquery'],
                '1.0.0',
                true
            );

            wp_enqueue_style(
                'jankx-advanced-filter-style',
                get_template_directory_uri() . '/resources/blocks/advanced-filter/build/style.css',
                [],
                '1.0.0'
            );

            // Localize script
            wp_localize_script('jankx-advanced-filter-frontend', 'jankx_advanced_filter', [
                'ajax_url' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('jankx_advanced_filter_nonce')
            ]);
        }
    }

    /**
     * Enqueue admin scripts
     */
    public function enqueue_admin_scripts($hook)
    {
        if (in_array($hook, ['post.php', 'post-new.php', 'site-editor.php'])) {
            wp_enqueue_script(
                'jankx-advanced-filter-editor',
                get_template_directory_uri() . '/resources/blocks/advanced-filter/build/index.js',
                ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'],
                '1.0.0',
                true
            );

            wp_enqueue_style(
                'jankx-advanced-filter-editor-style',
                get_template_directory_uri() . '/resources/blocks/advanced-filter/build/editor.css',
                ['wp-edit-blocks'],
                '1.0.0'
            );
        }
    }

    /**
     * Handle post layout fetch
     */
    public function handle_post_layout_fetch()
    {
        // This method will be handled by the main handler class
        // Just pass through to the handler
        $handler = AdvancedFilterHandler::getInstance();
        $handler->handle_filter_data_request();
    }
}

// Initialize integration
AdvancedFilterIntegration::getInstance();
