<?php

/**
 * Advanced Filter Block
 *
 * A flexible filter block that can work with Post Layout blocks
 * to provide AJAX filtering capabilities.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Facades\Log;

class AdvancedFiltersBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/advanced-filter';

    /**
     * Constructor
     *
     * @param string|null $blockPath Path to the directory containing block.json
     */
    public function __construct($blockPath = null)
    {
        if (!$blockPath) {
            $blockPath = get_template_directory() . '/resources/blocks/advanced-filter';
        }
        parent::__construct($blockPath);
    }

    /**
     * Register the block
     *
     * @return void
     */
    public function init()
    {
        add_action('rest_api_init', [$this, 'registerRestEndpoints']);
        add_action('wp_ajax_jankx_advanced_filter_get_data', [$this, 'handleFilterDataRequest']);
        add_action('wp_ajax_nopriv_jankx_advanced_filter_get_data', [$this, 'handleFilterDataRequest']);
        add_action('wp_ajax_jankx_advanced_filter_get_terms', [$this, 'handleGetTermsRequest']);
        add_action('wp_ajax_nopriv_jankx_advanced_filter_get_terms', [$this, 'handleGetTermsRequest']);
        add_action('wp_ajax_jankx_advanced_filter_get_meta_keys', [$this, 'handleGetMetaKeysRequest']);
        add_action('wp_ajax_nopriv_jankx_advanced_filter_get_meta_keys', [$this, 'handleGetMetaKeysRequest']);
        add_action('wp_ajax_jankx_get_filterable_blocks', [$this, 'handleGetFilterableBlocksRequest']);
        add_action('wp_ajax_nopriv_jankx_get_filterable_blocks', [$this, 'handleGetFilterableBlocksRequest']);

        // Enqueue scripts and styles
        add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminScripts']);
    }

    /**
     * Register REST API endpoints
     *
     * @return void
     */
    public function registerRestEndpoints()
    {
        register_rest_route('jankx/v1', '/advanced-filter/data', [
            'methods' => 'POST',
            'callback' => [$this, 'handleFilterDataRequest'],
            'permission_callback' => '__return_true',
            'args' => [
                'filter_config' => [
                    'required' => true,
                    'type' => 'string',
                    'validate_callback' => function ($param) {
                        return !empty($param);
                    }
                ],
                'target_blocks' => [
                    'required' => true,
                    'type' => 'string',
                    'validate_callback' => function ($param) {
                        return !empty($param);
                    }
                ],
                'filters' => [
                    'required' => false,
                    'type' => 'string'
                ]
            ]
        ]);

        register_rest_route('jankx/v1', '/advanced-filter/terms', [
            'methods' => 'GET',
            'callback' => [$this, 'handleGetTermsRequest'],
            'permission_callback' => '__return_true',
            'args' => [
                'taxonomy' => [
                    'required' => true,
                    'type' => 'string'
                ],
                'post_type' => [
                    'required' => false,
                    'type' => 'string',
                    'default' => 'post'
                ]
            ]
        ]);

        register_rest_route('jankx/v1', '/advanced-filter/meta-keys', [
            'methods' => 'GET',
            'callback' => [$this, 'handleGetMetaKeysRequest'],
            'permission_callback' => '__return_true',
            'args' => [
                'post_type' => [
                    'required' => false,
                    'type' => 'string',
                    'default' => 'post'
                ]
            ]
        ]);

        register_rest_route('jankx/v1', '/advanced-filter/filterable-blocks', [
            'methods' => 'GET',
            'callback' => [$this, 'handleGetFilterableBlocksRequest'],
            'permission_callback' => '__return_true'
        ]);
    }

    /**
     * Handle filter data request via AJAX
     *
     * @return void
     */
    public function handleFilterDataRequest()
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'jankx_advanced_filter_nonce')) {
            wp_die('Security check failed');
        }

        $filter_config = json_decode(stripslashes($_POST['filter_config'] ?? '{}'), true);
        $target_blocks = json_decode(stripslashes($_POST['target_blocks'] ?? '[]'), true);
        $filters = json_decode(stripslashes($_POST['filters'] ?? '{}'), true);

        if (empty($filter_config) || empty($target_blocks)) {
            wp_send_json_error('Missing required parameters');
        }

        try {
            $results = [];

            // Process each target block
            foreach ($target_blocks as $target) {
                if (!$target['enabled']) continue;

                $block_data = $this->getBlockData($target, $filters);
                if ($block_data) {
                    $results[$target['blockId']] = $block_data;
                }
            }

            // Apply filters for each block
            $filtered_results = apply_filters('jankx_advanced_filter_results', $results, $filter_config, $filters);

            wp_send_json_success([
                'results' => $filtered_results,
                'filters_applied' => $filters,
                'total_blocks' => count($results)
            ]);

        } catch (\Exception $e) {
            Log::error('AdvancedFiltersBlock: Error processing filter - ' . $e->getMessage());
            wp_send_json_error('Error processing filter: ' . $e->getMessage());
        }
    }

    /**
     * Handle get terms request
     *
     * @return void
     */
    public function handleGetTermsRequest()
    {
        $taxonomy = sanitize_text_field($_REQUEST['taxonomy'] ?? '');
        $post_type = sanitize_text_field($_REQUEST['post_type'] ?? 'post');

        if (empty($taxonomy)) {
            wp_send_json_error('Taxonomy is required');
        }

        $terms = get_terms([
            'taxonomy' => $taxonomy,
            'hide_empty' => false,
            'orderby' => 'name',
            'order' => 'ASC'
        ]);

        if (is_wp_error($terms)) {
            wp_send_json_error($terms->get_error_message());
        }

        $formatted_terms = array_map(function($term) {
            return [
                'id' => $term->term_id,
                'name' => $term->name,
                'slug' => $term->slug,
                'count' => $term->count,
                'parent' => $term->parent
            ];
        }, $terms);

        wp_send_json_success($formatted_terms);
    }

    /**
     * Handle get meta keys request
     *
     * @return void
     */
    public function handleGetMetaKeysRequest()
    {
        $post_type = sanitize_text_field($_REQUEST['post_type'] ?? 'post');

        global $wpdb;

        $meta_keys = $wpdb->get_col($wpdb->prepare("
            SELECT DISTINCT meta_key
            FROM {$wpdb->postmeta} pm
            INNER JOIN {$wpdb->posts} p ON pm.post_id = p.ID
            WHERE p.post_type = %s
            AND meta_key NOT LIKE '\_%'
            ORDER BY meta_key
        ", $post_type));

        wp_send_json_success($meta_keys);
    }

    /**
     * Handle get filterable blocks request
     *
     * @return void
     */
    public function handleGetFilterableBlocksRequest()
    {
        $blocks = [];

        // Find all post-layout blocks
        $posts = get_posts([
            'post_type' => 'any',
            'post_status' => 'publish',
            'posts_per_page' => -1
        ]);

        foreach ($posts as $post) {
            $parsed_blocks = parse_blocks($post->post_content);
            foreach ($parsed_blocks as $block) {
                if ($block['blockName'] === 'jankx/post-layout') {
                    $block_id = 'block_' . md5(serialize($block));
                    $blocks[] = [
                        'id' => $block_id,
                        'name' => 'Post Layout - ' . $post->post_title,
                        'postId' => $post->ID,
                        'postTitle' => $post->post_title
                    ];
                }
            }
        }

        wp_send_json_success($blocks);
    }

    /**
     * Get data for a specific block
     *
     * @param array $target
     * @param array $filters
     * @return array|null
     */
    private function getBlockData($target, $filters)
    {
        $block_id = $target['blockId'];
        $selector = $target['selector'];

        // Get block content
        $block_content = $this->getBlockContent($block_id);
        if (!$block_content) {
            return null;
        }

        // Parse block attributes
        $block_attributes = $this->parseBlockAttributes($block_content);
        if (!$block_attributes) {
            return null;
        }

        // Build query args from filters
        $query_args = $this->buildQueryArgs($block_attributes, $filters);

        // Execute query
        $posts = $this->executeQuery($query_args);

        // Render content
        $rendered_content = $this->renderPosts($posts, $block_attributes);

        return [
            'blockId' => $block_id,
            'selector' => $selector,
            'content' => $rendered_content,
            'query_info' => [
                'total_posts' => $posts['total_posts'] ?? 0,
                'found_posts' => $posts['found_posts'] ?? 0,
                'max_pages' => $posts['max_pages'] ?? 0
            ]
        ];
    }

    /**
     * Get block content
     *
     * @param string $block_id
     * @return array|null
     */
    private function getBlockContent($block_id)
    {
        // Find block in post content
        $posts = get_posts([
            'post_type' => 'any',
            'post_status' => 'publish',
            'posts_per_page' => -1
        ]);

        foreach ($posts as $post) {
            $blocks = parse_blocks($post->post_content);
            foreach ($blocks as $block) {
                if ($block['blockName'] === 'jankx/post-layout') {
                    $current_block_id = 'block_' . md5(serialize($block));
                    if ($current_block_id === $block_id) {
                        return $block;
                    }
                }
            }
        }

        return null;
    }

    /**
     * Parse block attributes
     *
     * @param array $block
     * @return array|null
     */
    private function parseBlockAttributes($block)
    {
        if (!$block || !isset($block['attrs'])) {
            return null;
        }

        $attrs = $block['attrs'];

        return [
            'postType' => $attrs['postType'] ?? 'post',
            'postsPerPage' => $attrs['postsPerPage'] ?? 6,
            'orderBy' => $attrs['orderBy'] ?? 'date',
            'order' => $attrs['order'] ?? 'DESC',
            'offset' => $attrs['offset'] ?? 0,
            'exclude' => $attrs['exclude'] ?? [],
            'include' => $attrs['include'] ?? [],
            'taxonomyFilters' => $attrs['taxonomyFilters'] ?? [],
            'metaFilters' => $attrs['metaFilters'] ?? [],
            'displayOptions' => $attrs['displayOptions'] ?? [],
            'styling' => $attrs['styling'] ?? []
        ];
    }

    /**
     * Build query args from filters
     *
     * @param array $block_attrs
     * @param array $filters
     * @return array
     */
    private function buildQueryArgs($block_attrs, $filters)
    {
        $query_args = [
            'post_type' => $block_attrs['postType'],
            'posts_per_page' => $block_attrs['postsPerPage'],
            'orderby' => $block_attrs['orderBy'],
            'order' => $block_attrs['order'],
            'offset' => $block_attrs['offset'],
            'post_status' => 'publish'
        ];

        // Exclude/Include posts
        if (!empty($block_attrs['exclude'])) {
            $query_args['post__not_in'] = $block_attrs['exclude'];
        }
        if (!empty($block_attrs['include'])) {
            $query_args['post__in'] = $block_attrs['include'];
        }

        // Apply taxonomy filters
        if (!empty($filters['taxonomy'])) {
            $tax_query = [];
            foreach ($filters['taxonomy'] as $taxonomy => $terms) {
                if (!empty($terms)) {
                    $tax_query[] = [
                        'taxonomy' => $taxonomy,
                        'field' => 'term_id',
                        'terms' => $terms,
                        'operator' => 'IN'
                    ];
                }
            }
            if (!empty($tax_query)) {
                $query_args['tax_query'] = $tax_query;
            }
        }

        // Apply meta filters
        if (!empty($filters['meta'])) {
            $meta_query = [];
            foreach ($filters['meta'] as $meta_filter) {
                if (empty($meta_filter['metaKey']) || empty($meta_filter['value'])) {
                    continue;
                }

                $meta_query[] = [
                    'key' => $meta_filter['metaKey'],
                    'value' => $meta_filter['value'],
                    'compare' => $this->getMetaCompareOperator($meta_filter['operator'])
                ];
            }
            if (!empty($meta_query)) {
                $query_args['meta_query'] = $meta_query;
            }
        }

        // Apply custom filters
        if (!empty($filters['custom'])) {
            $custom_query = $this->buildCustomQuery($filters['custom']);
            if (!empty($custom_query)) {
                $query_args = array_merge($query_args, $custom_query);
            }
        }

        // Apply date filters
        if (!empty($filters['date'])) {
            $date_query = $this->buildDateQuery($filters['date']);
            if (!empty($date_query)) {
                $query_args['date_query'] = $date_query;
            }
        }

        // Apply price filters
        if (!empty($filters['price'])) {
            $price_query = $this->buildPriceQuery($filters['price']);
            if (!empty($price_query)) {
                if (isset($query_args['meta_query'])) {
                    $query_args['meta_query'] = array_merge($query_args['meta_query'], $price_query);
                } else {
                    $query_args['meta_query'] = $price_query;
                }
            }
        }

        // Apply hooks to custom query
        $query_args = apply_filters('jankx_advanced_filter_query_args', $query_args, $filters, $block_attrs);

        return $query_args;
    }

    /**
     * Execute query
     *
     * @param array $query_args
     * @return array
     */
    private function executeQuery($query_args)
    {
        $query = new \WP_Query($query_args);

        return [
            'posts' => $query->posts,
            'total_posts' => $query->found_posts,
            'found_posts' => count($query->posts),
            'max_pages' => $query->max_num_pages,
            'query' => $query
        ];
    }

    /**
     * Render posts
     *
     * @param array $query_result
     * @param array $block_attrs
     * @return string
     */
    private function renderPosts($query_result, $block_attrs)
    {
        $posts = $query_result['posts'];
        $display_options = $block_attrs['displayOptions'] ?? [];
        $styling = $block_attrs['styling'] ?? [];

        if (empty($posts)) {
            return '<div class="jankx-post-layout__empty">Không tìm thấy bài viết nào.</div>';
        }

        $output = '<div class="jankx-post-layout__grid">';

        foreach ($posts as $post) {
            $output .= $this->renderSinglePost($post, $display_options, $styling);
        }

        $output .= '</div>';

        // Apply hooks to custom render
        $output = apply_filters('jankx_advanced_filter_render_posts', $output, $posts, $display_options, $styling);

        return $output;
    }

    /**
     * Render single post
     *
     * @param \WP_Post $post
     * @param array $display_options
     * @param array $styling
     * @return string
     */
    private function renderSinglePost($post, $display_options, $styling)
    {
        $output = '<article class="jankx-post-layout__item">';

        // Featured image
        if ($display_options['showThumbnail'] ?? true) {
            $thumbnail = get_the_post_thumbnail($post->ID, 'medium');
            if ($thumbnail) {
                $output .= '<div class="jankx-post-layout__thumbnail">' . $thumbnail . '</div>';
            }
        }

        // Title
        if ($display_options['showTitle'] ?? true) {
            $output .= '<h3 class="jankx-post-layout__title">';
            $output .= '<a href="' . get_permalink($post->ID) . '">' . get_the_title($post->ID) . '</a>';
            $output .= '</h3>';
        }

        // Excerpt
        if ($display_options['showExcerpt'] ?? true) {
            $excerpt_length = $display_options['excerptLength'] ?? 20;
            $excerpt = wp_trim_words(get_the_excerpt($post->ID), $excerpt_length);
            $output .= '<div class="jankx-post-layout__excerpt">' . $excerpt . '</div>';
        }

        // Meta
        if ($display_options['showMeta'] ?? true) {
            $meta_fields = $display_options['metaFields'] ?? ['date', 'author', 'categories'];
            $output .= '<div class="jankx-post-layout__meta">';

            if (in_array('date', $meta_fields)) {
                $output .= '<span class="jankx-post-layout__date">' . get_the_date('', $post->ID) . '</span>';
            }

            if (in_array('author', $meta_fields)) {
                $output .= '<span class="jankx-post-layout__author">' . get_the_author_meta('display_name', $post->post_author) . '</span>';
            }

            if (in_array('categories', $meta_fields)) {
                $categories = get_the_category($post->ID);
                if (!empty($categories)) {
                    $output .= '<span class="jankx-post-layout__categories">';
                    foreach ($categories as $category) {
                        $output .= '<a href="' . get_category_link($category->term_id) . '">' . $category->name . '</a>';
                    }
                    $output .= '</span>';
                }
            }

            $output .= '</div>';
        }

        // Read more
        if ($display_options['showReadMore'] ?? true) {
            $output .= '<a href="' . get_permalink($post->ID) . '" class="jankx-post-layout__read-more">Đọc thêm</a>';
        }

        $output .= '</article>';

        // Apply hooks to custom render single post
        $output = apply_filters('jankx_advanced_filter_render_single_post', $output, $post, $display_options, $styling);

        return $output;
    }

    /**
     * Get meta compare operator
     *
     * @param string $operator
     * @return string
     */
    private function getMetaCompareOperator($operator)
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
     * Build custom query
     *
     * @param array $custom_filters
     * @return array
     */
    private function buildCustomQuery($custom_filters)
    {
        $query = [];

        foreach ($custom_filters as $filter) {
            if (!$filter['enabled'] || empty($filter['field']) || empty($filter['value'])) {
                continue;
            }

            // Custom logic for each filter type
            $query = apply_filters('jankx_advanced_filter_custom_query', $query, $filter);
        }

        return $query;
    }

    /**
     * Build date query
     *
     * @param array $date_filters
     * @return array
     */
    private function buildDateQuery($date_filters)
    {
        $date_query = [];

        foreach ($date_filters as $filter) {
            if (!$filter['enabled'] || empty($filter['field'])) {
                continue;
            }

            $date_query[] = [
                'column' => $filter['field'],
                'after' => $filter['startDate'] ?? '',
                'before' => $filter['endDate'] ?? '',
                'inclusive' => true
            ];
        }

        return $date_query;
    }

    /**
     * Build price query
     *
     * @param array $price_filters
     * @return array
     */
    private function buildPriceQuery($price_filters)
    {
        $price_query = [];

        foreach ($price_filters as $filter) {
            if (!$filter['enabled'] || empty($filter['field'])) {
                continue;
            }

            if (!empty($filter['minPrice'])) {
                $price_query[] = [
                    'key' => $filter['field'],
                    'value' => $filter['minPrice'],
                    'compare' => '>=',
                    'type' => 'NUMERIC'
                ];
            }

            if (!empty($filter['maxPrice'])) {
                $price_query[] = [
                    'key' => $filter['field'],
                    'value' => $filter['maxPrice'],
                    'compare' => '<=',
                    'type' => 'NUMERIC'
                ];
            }
        }

        return $price_query;
    }

    /**
     * Enqueue scripts
     *
     * @return void
     */
    public function enqueueScripts()
    {
        if (!is_admin()) {
            $block_dir = get_template_directory() . '/resources/blocks/advanced-filter';
            $block_url = get_template_directory_uri() . '/resources/blocks/advanced-filter';

            // Check if build files exist
            if (file_exists($block_dir . '/build/frontend.js')) {
                wp_enqueue_script(
                    'jankx-advanced-filter-frontend',
                    $block_url . '/build/frontend.js',
                    ['jquery'],
                    filemtime($block_dir . '/build/frontend.js'),
                    true
                );
            }

            if (file_exists($block_dir . '/build/style.css')) {
                wp_enqueue_style(
                    'jankx-advanced-filter-style',
                    $block_url . '/build/style.css',
                    [],
                    filemtime($block_dir . '/build/style.css')
                );
            }

            // Localize script
            wp_localize_script('jankx-advanced-filter-frontend', 'jankx_advanced_filter', [
                'ajax_url' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('jankx_advanced_filter_nonce')
            ]);
        }
    }

    /**
     * Enqueue admin scripts
     *
     * @return void
     */
    public function enqueueAdminScripts($hook)
    {
        if (in_array($hook, ['post.php', 'post-new.php', 'site-editor.php'])) {
            $block_dir = get_template_directory() . '/resources/blocks/advanced-filter';
            $block_url = get_template_directory_uri() . '/resources/blocks/advanced-filter';

            // Check if build files exist
            if (file_exists($block_dir . '/build/index.js')) {
                wp_enqueue_script(
                    'jankx-advanced-filter-editor',
                    $block_url . '/build/index.js',
                    ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'],
                    filemtime($block_dir . '/build/index.js'),
                    true
                );
            }

            if (file_exists($block_dir . '/build/editor.css')) {
                wp_enqueue_style(
                    'jankx-advanced-filter-editor-style',
                    $block_url . '/build/editor.css',
                    ['wp-edit-blocks'],
                    filemtime($block_dir . '/build/editor.css')
                );
            }
        }
    }

    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '')
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

        // Apply filters to custom config
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
                <?php $this->renderFilterContent($config, $attributes); ?>
            </div>
        </div>
        <?php

        $output = ob_get_clean();

        // Apply filters to custom output
        $output = apply_filters('jankx_advanced_filter_output', $output, $config, $attributes);

        return $output;
    }

    /**
     * Render filter content
     *
     * @param array $config
     * @param array $attributes
     * @return void
     */
    private function renderFilterContent($config, $attributes)
    {
        $filters = $config['filters'];
        $display_settings = $config['displaySettings'];

        // Render taxonomy filters
        if (!empty($filters['taxonomy'])) {
            $this->renderTaxonomyFilters($filters['taxonomy'], $display_settings);
        }

        // Render meta filters
        if (!empty($filters['meta'])) {
            $this->renderMetaFilters($filters['meta'], $display_settings);
        }

        // Render custom filters
        if (!empty($filters['custom'])) {
            $this->renderCustomFilters($filters['custom'], $display_settings);
        }

        // Render date filters
        if (!empty($filters['date'])) {
            $this->renderDateFilters($filters['date'], $display_settings);
        }

        // Render price filters
        if (!empty($filters['price'])) {
            $this->renderPriceFilters($filters['price'], $display_settings);
        }

        // Render reset button
        if ($display_settings['showReset']) {
            $this->renderResetButton($display_settings);
        }
    }

    /**
     * Render taxonomy filters
     *
     * @param array $taxonomy_filters
     * @param array $display_settings
     * @return void
     */
    private function renderTaxonomyFilters($taxonomy_filters, $display_settings)
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
     *
     * @param array $meta_filters
     * @param array $display_settings
     * @return void
     */
    private function renderMetaFilters($meta_filters, $display_settings)
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
     *
     * @param array $custom_filters
     * @param array $display_settings
     * @return void
     */
    private function renderCustomFilters($custom_filters, $display_settings)
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
     *
     * @param array $date_filters
     * @param array $display_settings
     * @return void
     */
    private function renderDateFilters($date_filters, $display_settings)
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
     *
     * @param array $price_filters
     * @param array $display_settings
     * @return void
     */
    private function renderPriceFilters($price_filters, $display_settings)
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
     *
     * @param array $display_settings
     * @return void
     */
    private function renderResetButton($display_settings)
    {
        echo '<div class="jankx-filter-reset">';
        echo '<button type="button" class="jankx-filter-reset-btn">';
        echo esc_html($display_settings['resetText'] ?? 'Xóa bộ lọc');
        echo '</button>';
        echo '</div>';
    }
}
