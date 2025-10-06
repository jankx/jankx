<?php
/**
 * Advanced Filter Hooks System
 *
 * Cung cấp hệ thống hooks mở rộng cho advanced filter
 */

namespace Jankx\Gutenberg\Blocks\AdvancedFilters;

if (!defined('ABSPATH')) {
    exit;
}

class AdvancedFilterHooks
{

    private static $instance = null;
    private $filter_types = [];
    private $custom_queries = [];
    private $renderers = [];

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        $this->register_default_hooks();
    }

    /**
     * Register default hooks
     */
    private function register_default_hooks()
    {
        // Hook để thêm filter types
        add_action('jankx_advanced_filter_register_types', [$this, 'register_default_filter_types']);

        // Hook để thêm custom queries
        add_action('jankx_advanced_filter_register_queries', [$this, 'register_default_queries']);

        // Hook để thêm custom renderers
        add_action('jankx_advanced_filter_register_renderers', [$this, 'register_default_renderers']);

        // Initialize hooks
        do_action('jankx_advanced_filter_init', $this);
    }

    /**
     * Register filter type
     */
    public function register_filter_type($type, $config)
    {
        $this->filter_types[$type] = $config;
    }

    /**
     * Register custom query handler
     */
    public function register_custom_query($query_type, $callback)
    {
        $this->custom_queries[$query_type] = $callback;
    }

    /**
     * Register custom renderer
     */
    public function register_renderer($renderer_type, $callback)
    {
        $this->renderers[$renderer_type] = $callback;
    }

    /**
     * Get filter type config
     */
    public function get_filter_type($type)
    {
        return $this->filter_types[$type] ?? null;
    }

    /**
     * Get custom query handler
     */
    public function get_custom_query($query_type)
    {
        return $this->custom_queries[$query_type] ?? null;
    }

    /**
     * Get custom renderer
     */
    public function get_renderer($renderer_type)
    {
        return $this->renderers[$renderer_type] ?? null;
    }

    /**
     * Register default filter types
     */
    public function register_default_filter_types()
    {
        // Taxonomy filter
        $this->register_filter_type('taxonomy', [
            'name' => 'Taxonomy Filter',
            'description' => 'Filter by taxonomy terms',
            'fields' => [
                'taxonomy' => [
                    'type' => 'select',
                    'label' => 'Taxonomy',
                    'required' => true,
                    'options_callback' => 'jankx_get_taxonomies'
                ],
                'layout' => [
                    'type' => 'select',
                    'label' => 'Layout',
                    'default' => 'dropdown',
                    'options' => [
                        'dropdown' => 'Dropdown',
                        'checkbox' => 'Checkbox',
                        'radio' => 'Radio',
                        'button-group' => 'Button Group',
                        'tag-cloud' => 'Tag Cloud'
                    ]
                ],
                'multiple' => [
                    'type' => 'boolean',
                    'label' => 'Multiple Selection',
                    'default' => true
                ],
                'showCount' => [
                    'type' => 'boolean',
                    'label' => 'Show Count',
                    'default' => true
                ]
            ],
            'query_callback' => 'jankx_taxonomy_filter_query',
            'render_callback' => 'jankx_taxonomy_filter_render'
        ]);

        // Meta filter
        $this->register_filter_type('meta', [
            'name' => 'Meta Filter',
            'description' => 'Filter by meta fields',
            'fields' => [
                'metaKey' => [
                    'type' => 'select',
                    'label' => 'Meta Key',
                    'required' => true,
                    'options_callback' => 'jankx_get_meta_keys'
                ],
                'type' => [
                    'type' => 'select',
                    'label' => 'Field Type',
                    'default' => 'text',
                    'options' => [
                        'text' => 'Text',
                        'number' => 'Number',
                        'date' => 'Date',
                        'select' => 'Select',
                        'checkbox' => 'Checkbox'
                    ]
                ],
                'operator' => [
                    'type' => 'select',
                    'label' => 'Operator',
                    'default' => 'equals',
                    'options' => [
                        'equals' => 'Equals',
                        'contains' => 'Contains',
                        'starts_with' => 'Starts With',
                        'ends_with' => 'Ends With',
                        'greater_than' => 'Greater Than',
                        'less_than' => 'Less Than',
                        'exists' => 'Exists',
                        'not_exists' => 'Not Exists'
                    ]
                ]
            ],
            'query_callback' => 'jankx_meta_filter_query',
            'render_callback' => 'jankx_meta_filter_render'
        ]);

        // Date filter
        $this->register_filter_type('date', [
            'name' => 'Date Filter',
            'description' => 'Filter by date range',
            'fields' => [
                'field' => [
                    'type' => 'select',
                    'label' => 'Date Field',
                    'default' => 'post_date',
                    'options' => [
                        'post_date' => 'Post Date',
                        'post_modified' => 'Post Modified',
                        'meta_date' => 'Meta Date'
                    ]
                ],
                'startDate' => [
                    'type' => 'date',
                    'label' => 'Start Date'
                ],
                'endDate' => [
                    'type' => 'date',
                    'label' => 'End Date'
                ]
            ],
            'query_callback' => 'jankx_date_filter_query',
            'render_callback' => 'jankx_date_filter_render'
        ]);

        // Price filter
        $this->register_filter_type('price', [
            'name' => 'Price Filter',
            'description' => 'Filter by price range',
            'fields' => [
                'field' => [
                    'type' => 'select',
                    'label' => 'Price Field',
                    'required' => true,
                    'options_callback' => 'jankx_get_price_fields'
                ],
                'minPrice' => [
                    'type' => 'number',
                    'label' => 'Min Price'
                ],
                'maxPrice' => [
                    'type' => 'number',
                    'label' => 'Max Price'
                ],
                'currency' => [
                    'type' => 'text',
                    'label' => 'Currency',
                    'default' => 'VND'
                ]
            ],
            'query_callback' => 'jankx_price_filter_query',
            'render_callback' => 'jankx_price_filter_render'
        ]);
    }

    /**
     * Register default queries
     */
    public function register_default_queries()
    {
        // Taxonomy query
        $this->register_custom_query('taxonomy', function($filter, $query_args) {
            if (empty($filter['taxonomy']) || empty($filter['terms'])) {
                return $query_args;
            }

            $tax_query = [
                'taxonomy' => $filter['taxonomy'],
                'field' => 'term_id',
                'terms' => $filter['terms'],
                'operator' => 'IN'
            ];

            if (isset($query_args['tax_query'])) {
                $query_args['tax_query'][] = $tax_query;
            } else {
                $query_args['tax_query'] = [$tax_query];
            }

            return $query_args;
        });

        // Meta query
        $this->register_custom_query('meta', function($filter, $query_args) {
            if (empty($filter['metaKey']) || empty($filter['value'])) {
                return $query_args;
            }

            $meta_query = [
                'key' => $filter['metaKey'],
                'value' => $filter['value'],
                'compare' => $this->get_meta_compare_operator($filter['operator'])
            ];

            if (isset($query_args['meta_query'])) {
                $query_args['meta_query'][] = $meta_query;
            } else {
                $query_args['meta_query'] = [$meta_query];
            }

            return $query_args;
        });
    }

    /**
     * Register default renderers
     */
    public function register_default_renderers()
    {
        // Taxonomy renderer
        $this->register_renderer('taxonomy', function($filter, $config) {
            $terms = get_terms([
                'taxonomy' => $filter['taxonomy'],
                'hide_empty' => false,
                'orderby' => $config['orderBy'] ?? 'name',
                'order' => $config['order'] ?? 'ASC'
            ]);

            if (is_wp_error($terms) || empty($terms)) {
                return '';
            }

            $output = '<div class="jankx-filter-taxonomy">';

            if ($config['showLabel'] ?? true) {
                $output .= '<label class="jankx-filter-label">' . ($config['labelText'] ?? 'Filter by:') . '</label>';
            }

            $output .= '<div class="jankx-filter-options">';

            foreach ($terms as $term) {
                $count = $config['showCount'] ? " ({$term->count})" : '';
                $output .= '<label class="jankx-filter-option">';
                $output .= '<input type="checkbox" name="' . $filter['taxonomy'] . '[]" value="' . $term->term_id . '">';
                $output .= '<span>' . $term->name . $count . '</span>';
                $output .= '</label>';
            }

            $output .= '</div></div>';

            return $output;
        });

        // Meta renderer
        $this->register_renderer('meta', function($filter, $config) {
            $output = '<div class="jankx-filter-meta">';

            if ($config['showLabel'] ?? true) {
                $output .= '<label class="jankx-filter-label">' . ($config['labelText'] ?? 'Filter by:') . '</label>';
            }

            $field_type = $filter['type'] ?? 'text';

            switch ($field_type) {
                case 'text':
                    $output .= '<input type="text" name="' . $filter['metaKey'] . '" placeholder="' . ($config['placeholder'] ?? 'Enter value...') . '">';
                    break;
                case 'number':
                    $output .= '<input type="number" name="' . $filter['metaKey'] . '" placeholder="' . ($config['placeholder'] ?? 'Enter number...') . '">';
                    break;
                case 'date':
                    $output .= '<input type="date" name="' . $filter['metaKey'] . '">';
                    break;
                case 'select':
                    $options = $this->get_meta_select_options($filter['metaKey']);
                    $output .= '<select name="' . $filter['metaKey'] . '">';
                    $output .= '<option value="">' . ($config['placeholder'] ?? 'Select...') . '</option>';
                    foreach ($options as $option) {
                        $output .= '<option value="' . $option . '">' . $option . '</option>';
                    }
                    $output .= '</select>';
                    break;
                case 'checkbox':
                    $output .= '<label><input type="checkbox" name="' . $filter['metaKey'] . '"> ' . ($config['labelText'] ?? 'Yes') . '</label>';
                    break;
            }

            $output .= '</div>';

            return $output;
        });
    }

    /**
     * Get meta select options
     */
    private function get_meta_select_options($meta_key)
    {
        global $wpdb;

        $options = $wpdb->get_col($wpdb->prepare("
            SELECT DISTINCT meta_value
            FROM {$wpdb->postmeta}
            WHERE meta_key = %s
            AND meta_value != ''
            ORDER BY meta_value
        ", $meta_key));

        return $options;
    }

    /**
     * Get meta compare operator
     */
    private function get_meta_compare_operator($operator)
    {
        $operators = [
            'equals' => '=',
            'contains' => 'LIKE',
            'starts_with' => 'LIKE',
            'ends_with' => 'LIKE',
            'greater_than' => '>',
            'less_than' => '<',
            'exists' => 'EXISTS',
            'not_exists' => 'NOT EXISTS'
        ];

        return $operators[$operator] ?? '=';
    }

    /**
     * Apply filter hooks
     */
    public function apply_filter_hooks($filter_type, $filter_data, $context = '')
    {
        $hooks = [
            "jankx_advanced_filter_{$filter_type}",
            "jankx_advanced_filter_{$filter_type}_{$context}",
            'jankx_advanced_filter_all'
        ];

        foreach ($hooks as $hook) {
            if (has_filter($hook)) {
                $filter_data = apply_filters($hook, $filter_data, $context);
            }
        }

        return $filter_data;
    }

    /**
     * Get all registered filter types
     */
    public function get_all_filter_types()
    {
        return $this->filter_types;
    }

    /**
     * Get all custom queries
     */
    public function get_all_custom_queries()
    {
        return $this->custom_queries;
    }

    /**
     * Get all renderers
     */
    public function get_all_renderers()
    {
        return $this->renderers;
    }
}

// Initialize hooks system
AdvancedFilterHooks::getInstance();

// Helper functions
function jankx_advanced_filter_register_type($type, $config)
{
    return AdvancedFilterHooks::getInstance()->register_filter_type($type, $config);
}

function jankx_advanced_filter_register_query($query_type, $callback)
{
    return AdvancedFilterHooks::getInstance()->register_custom_query($query_type, $callback);
}

function jankx_advanced_filter_register_renderer($renderer_type, $callback)
{
    return AdvancedFilterHooks::getInstance()->register_renderer($renderer_type, $callback);
}

function jankx_advanced_filter_get_type($type)
{
    return AdvancedFilterHooks::getInstance()->get_filter_type($type);
}

function jankx_advanced_filter_apply_hooks($filter_type, $filter_data, $context = '')
{
    return AdvancedFilterHooks::getInstance()->apply_filter_hooks($filter_type, $filter_data, $context);
}
