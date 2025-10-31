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
    protected $blockId = 'jankx/advanced-filters';

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
        
        // Register filter AJAX handler that uses PostTypeLayoutBlock's render logic
        add_action('wp_ajax_jankx_advanced_filters_update', [$this, 'handleFiltersUpdate']);
        add_action('wp_ajax_nopriv_jankx_advanced_filters_update', [$this, 'handleFiltersUpdate']);
        
        // Enqueue frontend assets
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);
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
            'permission_callback' => '__return_true',
            'args' => [
                'post_id' => [
                    'required' => false,
                    'type' => 'integer',
                    'description' => __('Current post ID', 'jankx'),
                ],
            ],
        ]);

        // Also register AJAX handler for backward compatibility
        add_action('wp_ajax_jankx_get_filterable_blocks', [$this, 'handleGetFilterableBlocksRequestAjax']);
        add_action('wp_ajax_nopriv_jankx_get_filterable_blocks', [$this, 'handleGetFilterableBlocksRequestAjax']);
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
     * Only scans current post/page for jankx/post-type-layout blocks
     *
     * @param \WP_REST_Request $request REST request object
     * @return \WP_REST_Response|WP_Error
     */
    public function handleGetFilterableBlocksRequest($request)
    {
        // Get current post ID from request or global context
        $post_id = $request->get_param('post_id') ?: get_the_ID();

        if (!$post_id) {
            return rest_ensure_response([]);
        }

        $post = get_post($post_id);
        if (!$post) {
            return rest_ensure_response([]);
        }

        $blocks = [];
        $parsed_blocks = parse_blocks($post->post_content);
        
        $this->findPostTypeLayoutBlocks($parsed_blocks, $blocks, [
            'source' => 'current_page',
            'postId' => $post->ID,
            'postTitle' => $post->post_title,
            'postType' => $post->post_type,
        ]);

        // Return array for REST API
        return rest_ensure_response($blocks);
    }

    /**
     * Handle get filterable blocks request via AJAX (for backward compatibility)
     * Only scans current post/page
     *
     * @return void
     */
    public function handleGetFilterableBlocksRequestAjax(): void
    {
        $blocks = [];

        // Get current post ID
        $post_id = isset($_REQUEST['post_id']) ? intval($_REQUEST['post_id']) : get_the_ID();

        if (!$post_id) {
            wp_send_json_success(['blocks' => []]);
            return;
        }

        $post = get_post($post_id);
        if (!$post) {
            wp_send_json_success(['blocks' => []]);
            return;
        }

        // Only scan current post
        $parsed_blocks = parse_blocks($post->post_content);
        $this->findPostTypeLayoutBlocks($parsed_blocks, $blocks, [
            'source' => 'current_page',
            'postId' => $post->ID,
            'postTitle' => $post->post_title,
            'postType' => $post->post_type,
        ]);

        wp_send_json_success(['blocks' => $blocks]);
    }

    /**
     * Recursively find jankx/post-type-layout blocks in parsed blocks
     *
     * @param array $blocks Parsed blocks array
     * @param array &$found_blocks Reference to array to collect found blocks
     * @param array $context Context information (source, postId, postTitle, postType)
     * @return void
     */
    private function findPostTypeLayoutBlocks(array $blocks, array &$found_blocks, array $context): void
    {
        foreach ($blocks as $block) {
            // Check if this is a post-type-layout block
            if (($block['blockName'] ?? '') === 'jankx/post-type-layout') {
                $attributes = $block['attrs'] ?? [];
                $query_id = $attributes['queryId'] ?? null;
                
                // Use queryId if available, otherwise generate a hash
                $block_id = $query_id ? strval($query_id) : 'block_' . md5(serialize($block));
                
                // Check if block already exists (by queryId)
                $exists = false;
                foreach ($found_blocks as $existing_block) {
                    if ($existing_block['id'] === $block_id) {
                        $exists = true;
                        break;
                    }
                }
                
                if (!$exists) {
                    $found_blocks[] = [
                        'id' => $block_id,
                        'name' => ($attributes['postType'] ?? 'post') . ' Layout - ' . $context['postTitle'],
                        'postId' => $context['postId'],
                        'postTitle' => $context['postTitle'],
                        'postType' => $context['postType'],
                        'source' => $context['source'],
                        'blockType' => $attributes['postType'] ?? 'post',
                        'layout' => $attributes['layout'] ?? 'grid',
                    ];
                }
            }

            // Recursively search inner blocks
            if (!empty($block['innerBlocks'])) {
                $this->findPostTypeLayoutBlocks($block['innerBlocks'], $found_blocks, $context);
            }
        }
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
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @param \WP_Block $block Block instance
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        // Use new attributes structure from block.json
        $target_block_ids = $attributes['targetBlockIds'] ?? [];
        $filter_type = $attributes['filterType'] ?? 'taxonomy';
        $layout = $attributes['layout'] ?? 'horizontal';
        $show_labels = $attributes['showLabels'] ?? true;
        $show_reset_button = $attributes['showResetButton'] ?? true;
        $reset_button_text = $attributes['resetButtonText'] ?? __('Reset Filters', 'jankx');
        $ajax_enabled = $attributes['ajaxEnabled'] ?? true;
        $update_url = $attributes['updateUrl'] ?? true;
        $scroll_to_results = $attributes['scrollToResults'] ?? false;
        $taxonomy_filters = $attributes['taxonomyFilters'] ?? [];
        $meta_filters = $attributes['metaFilters'] ?? [];
        $price_filters = $attributes['priceFilters'] ?? [];
        $date_filters = $attributes['dateFilters'] ?? [];
        $author_filters = $attributes['authorFilters'] ?? [];
        $keyword_filter = $attributes['keywordFilter'] ?? [];
        $display_style = $attributes['displayStyle'] ?? 'buttons';
        $show_count = $attributes['showCount'] ?? false;
        $show_empty_terms = $attributes['showEmptyTerms'] ?? true;
        $show_only_top_level = $attributes['showOnlyTopLevel'] ?? false;
        $show_hierarchy = $attributes['showHierarchy'] ?? false;
        $display_as_dropdown = $attributes['displayAsDropdown'] ?? false;
        $multiple_selection = $attributes['multipleSelection'] ?? true;
        $collapsible = $attributes['collapsible'] ?? false;
        $default_expanded = $attributes['defaultExpanded'] ?? true;

        // Generate unique filter ID
        $filter_id = 'filter_' . uniqid();

        // Try detect post type from target post-type-layout blocks
        $detected_post_type = $this->detectPostTypeFromTargetIds($target_block_ids) ?: 'post';

        // Build filter configuration for frontend JavaScript
        $config = [
            'filterId' => $filter_id,
            'targetBlockIds' => $target_block_ids,
            'filterType' => $filter_type,
            'ajaxEnabled' => $ajax_enabled,
            'updateUrl' => $update_url,
            'scrollToResults' => $scroll_to_results,
            'taxonomyFilters' => array_filter($taxonomy_filters, function($filter) {
                return $filter['enabled'] ?? false;
            }),
            'metaFilters' => array_filter($meta_filters, function($filter) {
                return $filter['enabled'] ?? false;
            }),
            'priceFilters' => array_filter($price_filters, function($filter) {
                return $filter['enabled'] ?? false;
            }),
            'dateFilters' => array_filter($date_filters, function($filter) {
                return $filter['enabled'] ?? false;
            }),
            'authorFilters' => array_filter($author_filters, function($filter) {
                return $filter['enabled'] ?? false;
            }),
            'keywordFilter' => $keyword_filter,
            'postType' => $detected_post_type,
        ];

        // Apply filters to custom config
        $config = apply_filters('jankx_advanced_filters_config', $config, $attributes);

        // Generate unique ID for this filter instance
        $instance_id = 'jankx-advanced-filters-' . $filter_id;

        // Build CSS classes
        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => implode(' ', [
                'wp-block-jankx-advanced-filters',
                'layout-' . esc_attr($layout),
                'display-' . esc_attr($display_style),
            ]),
            'id' => $instance_id,
        ]);

        // Create nonce for AJAX requests
        $ajax_nonce = wp_create_nonce('jankx_advanced_filters');
        $ajax_url = admin_url('admin-ajax.php');

        // Start output buffering
        ob_start();
        ?>
        <div <?php echo $wrapper_attributes; ?>>
            <div class="advanced-filters-config" 
                 data-config="<?php echo esc_attr(wp_json_encode($config)); ?>"
                 data-nonce="<?php echo esc_attr($ajax_nonce); ?>"
                 data-ajax-url="<?php echo esc_attr($ajax_url); ?>"
                 style="display: none;"></div>
            <div class="advanced-filters-container">
                <?php $this->renderFilterContentNew($attributes, $config); ?>
            </div>
            <?php if ($show_reset_button) : ?>
                <button type="button" class="filter-reset-button">
                    <?php echo esc_html($reset_button_text); ?>
                </button>
            <?php endif; ?>
            <div class="filter-loading">
                <div class="filter-spinner"></div>
            </div>
        </div>
        <?php

        $output = ob_get_clean();

        // Apply filters to custom output
        $output = apply_filters('jankx_advanced_filters_output', $output, $config, $attributes);

        return $output;
    }

    /**
     * Render terms with hierarchy structure
     *
     * @param array $terms Array of term objects
     * @param string $display_style Display style
     * @param bool $show_count Show post count
     * @param string $input_type Input type (checkbox/radio)
     * @param string $name_attr Name attribute
     * @param bool $is_dropdown Whether rendering in dropdown
     * @return void
     */
    private function renderTermsHierarchy(array $terms, string $display_style, bool $show_count, string $input_type, string $name_attr, bool $is_dropdown): void
    {
        // Organize terms into hierarchy
        $term_tree = [];
        $term_index = [];

        foreach ($terms as $term) {
            $term_index[$term->term_id] = $term;
            if ($term->parent === 0) {
                $term_tree[] = $term;
            }
        }

        // Build parent-child relationships
        foreach ($terms as $term) {
            if ($term->parent > 0 && isset($term_index[$term->parent])) {
                if (!isset($term_index[$term->parent]->children)) {
                    $term_index[$term->parent]->children = [];
                }
                $term_index[$term->parent]->children[] = $term;
            }
        }

        // Render recursively
        $this->renderTermRecursive($term_tree, $display_style, $show_count, $input_type, $name_attr, $is_dropdown, 0);
    }

    /**
     * Recursively render term with hierarchy
     *
     * @param array $terms Array of term objects
     * @param string $display_style Display style
     * @param bool $show_count Show post count
     * @param string $input_type Input type
     * @param string $name_attr Name attribute
     * @param bool $is_dropdown Whether rendering in dropdown
     * @param int $depth Current depth
     * @return void
     */
    private function renderTermRecursive(array $terms, string $display_style, bool $show_count, string $input_type, string $name_attr, bool $is_dropdown, int $depth): void
    {
        foreach ($terms as $term) {
            $count_text = $show_count ? ' (' . intval($term->count) . ')' : '';
            $indent_class = $depth > 0 ? ' filter-term-child' : '';
            
            if ($is_dropdown) {
                $indent = str_repeat('&nbsp;&nbsp;', $depth);
                echo '<option value="' . esc_attr($term->term_id) . '">';
                echo $indent . esc_html($term->name) . esc_html($count_text);
                echo '</option>';
            } else {
                if ($display_style === 'buttons') {
                    echo '<span class="filter-option filter-term-item' . esc_attr($indent_class) . '" style="padding-left: ' . ($depth * 20) . 'px;" data-value="' . esc_attr($term->term_id) . '">';
                    echo esc_html($term->name) . esc_html($count_text);
                    echo '</span>';
                } else {
                    echo '<label class="filter-option filter-term-item' . esc_attr($indent_class) . '" style="padding-left: ' . ($depth * 20) . 'px;">';
                    echo '<input type="' . esc_attr($input_type) . '" name="' . esc_attr($name_attr) . '" value="' . esc_attr($term->term_id) . '">';
                    echo '<span>' . esc_html($term->name) . esc_html($count_text) . '</span>';
                    echo '</label>';
                }
            }

            // Render children if exist
            if (!empty($term->children)) {
                $this->renderTermRecursive($term->children, $display_style, $show_count, $input_type, $name_attr, $is_dropdown, $depth + 1);
            }
        }
    }

    /**
     * Render filter content with new attributes structure
     *
     * @param array $attributes Block attributes
     * @param array $config Filter configuration
     * @return void
     */
    private function renderFilterContentNew(array $attributes, array $config): void
    {
        $taxonomy_filters = $attributes['taxonomyFilters'] ?? [];
        $meta_filters = $attributes['metaFilters'] ?? [];
        $price_filters = $attributes['priceFilters'] ?? [];
        $date_filters = $attributes['dateFilters'] ?? [];
        $author_filters = $attributes['authorFilters'] ?? [];
        $keyword_filter = $attributes['keywordFilter'] ?? [];
        $show_labels = $attributes['showLabels'] ?? true;
        $display_style = $attributes['displayStyle'] ?? 'buttons';
        $show_count = $attributes['showCount'] ?? false;
        $show_empty_terms = $attributes['showEmptyTerms'] ?? true;
        $show_only_top_level = $attributes['showOnlyTopLevel'] ?? false;
        $show_hierarchy = $attributes['showHierarchy'] ?? false;
        $display_as_dropdown = $attributes['displayAsDropdown'] ?? false;
        $multiple_selection = $attributes['multipleSelection'] ?? true;
        $post_type = $config['postType'] ?? 'post';

        // Render taxonomy filters
        if (!empty($taxonomy_filters)) {
            foreach ($taxonomy_filters as $filter) {
                if (empty($filter['enabled']) || empty($filter['taxonomy'])) {
                    continue;
                }

                $taxonomy = get_taxonomy($filter['taxonomy']);
                if (!$taxonomy) {
                    continue;
                }

                // Build get_terms args based on options
                $term_args = [
                    'taxonomy' => $filter['taxonomy'],
                    'hide_empty' => !$show_empty_terms,
                    'orderby' => 'name',
                    'order' => 'ASC',
                ];

                if ($show_only_top_level) {
                    $term_args['parent'] = 0;
                }

                if ($show_hierarchy) {
                    $term_args['hierarchical'] = true;
                }

                $terms = get_terms($term_args);

                if (is_wp_error($terms) || empty($terms)) {
                    continue;
                }

                $label = !empty($filter['label']) ? $filter['label'] : $taxonomy->label;
                $input_type = $multiple_selection ? 'checkbox' : 'radio';
                $name_attr = $multiple_selection ? $filter['taxonomy'] . '[]' : $filter['taxonomy'];

                echo '<div class="filter-group filter-taxonomy" data-taxonomy="' . esc_attr($filter['taxonomy']) . '">';
                if ($show_labels) {
                    echo '<label class="filter-group-label">' . esc_html($label) . '</label>';
                }
                
                // Use dropdown if displayAsDropdown is enabled
                if ($display_as_dropdown) {
                    echo '<select class="filter-select">';
                    echo '<option value="">' . esc_html__('All', 'jankx') . '</option>';
                    
                    if ($show_hierarchy && !$show_only_top_level) {
                        // Render hierarchy in dropdown
                        $this->renderTermsHierarchy($terms, $display_style, $show_count, $input_type, $name_attr, true);
                    } else {
                        // Render flat list
                        foreach ($terms as $term) {
                            $count_text = $show_count ? ' (' . intval($term->count) . ')' : '';
                            echo '<option value="' . esc_attr($term->term_id) . '">';
                            echo esc_html($term->name) . esc_html($count_text);
                            echo '</option>';
                        }
                    }
                    echo '</select>';
                } else {
                    echo '<div class="filter-options display-' . esc_attr($display_style) . '">';
                    
                    if ($show_hierarchy && !$show_only_top_level) {
                        // Render hierarchy
                        $this->renderTermsHierarchy($terms, $display_style, $show_count, $input_type, $name_attr, false);
                    } else {
                        // Render flat list
                        foreach ($terms as $term) {
                            $count_text = $show_count ? ' (' . intval($term->count) . ')' : '';
                            if ($display_style === 'buttons') {
                                echo '<span class="filter-option" data-value="' . esc_attr($term->term_id) . '">';
                                echo esc_html($term->name) . esc_html($count_text);
                                echo '</span>';
                            } else {
                                echo '<label class="filter-option">';
                                echo '<input type="' . esc_attr($input_type) . '" name="' . esc_attr($name_attr) . '" value="' . esc_attr($term->term_id) . '">';
                                echo '<span>' . esc_html($term->name) . esc_html($count_text) . '</span>';
                                echo '</label>';
                            }
                        }
                    }
                    echo '</div>';
                }
                echo '</div>';
            }
        }

        // Render keyword filter
        if (!empty($keyword_filter['enabled'])) {
            $placeholder = $keyword_filter['placeholder'] ?? __('Search...', 'jankx');
            echo '<div class="filter-group filter-keyword">';
            if ($show_labels) {
                echo '<label class="filter-group-label">' . esc_html__('Keyword', 'jankx') . '</label>';
            }
            echo '<input type="text" class="filter-input" placeholder="' . esc_attr($placeholder) . '">';
            echo '</div>';
        }
    }

    /**
     * Detect post type from target block IDs
     *
     * @param array $target_block_ids Array of block IDs
     * @return string|null Post type or null
     */
    private function detectPostTypeFromTargetIds(array $target_block_ids): ?string
    {
        if (empty($target_block_ids)) {
            return null;
        }

        // Find blocks in post content
        $posts = get_posts([
            'post_type' => 'any',
            'post_status' => 'publish',
            'posts_per_page' => -1,
        ]);

        foreach ($target_block_ids as $block_id) {
            foreach ($posts as $post) {
                $blocks = parse_blocks($post->post_content);
                foreach ($blocks as $block) {
                    if (($block['blockName'] ?? '') !== 'jankx/post-type-layout') {
                        continue;
                    }
                    $current_block_id = $block['attrs']['queryId'] ?? null;
                    if ($current_block_id && strval($current_block_id) === strval($block_id)) {
                        return $block['attrs']['postType'] ?? null;
                    }
                }
            }
        }

        return null;
    }

    /**
     * Detect post type from first enabled target post-type-layout block
     */
    private function detectPostTypeFromTargets(array $target_blocks)
    {
        if (empty($target_blocks)) {
            return null;
        }

        // Collect blocks content from posts and try to match blockId
        $posts = get_posts([
            'post_type' => 'any',
            'post_status' => 'publish',
            'posts_per_page' => -1,
        ]);

        foreach ($target_blocks as $target) {
            if (empty($target['enabled']) || empty($target['blockId'])) {
                continue;
            }
            $target_id = $target['blockId'];

            foreach ($posts as $post) {
                $parsed = parse_blocks($post->post_content);
                foreach ($parsed as $block) {
                    if (($block['blockName'] ?? '') !== 'jankx/post-type-layout') {
                        continue;
                    }
                    // Build block id same as handler fallback
                    $block_id = $block['attrs']['blockId'] ?? ('block_' . md5(serialize($block)));
                    if ($block_id === $target_id) {
                        return $block['attrs']['postType'] ?? null;
                    }
                }
            }
        }

        return null;
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

    /**
     * Enqueue frontend assets
     *
     * @return void
     */
    public function enqueueFrontendAssets(): void
    {
        // Only enqueue if block is used on the page
        if (!has_block('jankx/advanced-filters')) {
            return;
        }

        $frontend_asset_file = $this->blockPath . '/build/frontend.asset.php';
        $frontend_script_path = $this->blockPath . '/build/frontend.js';

        if (file_exists($frontend_asset_file) && file_exists($frontend_script_path)) {
            $asset = require $frontend_asset_file;
            $script_handle = 'jankx-advanced-filters-frontend';

            // Get block URL dynamically to support child themes
            $block_url = str_replace(
                [wp_normalize_path(WP_CONTENT_DIR), '\\'],
                [content_url(), '/'],
                wp_normalize_path($this->blockPath)
            );

            wp_enqueue_script(
                $script_handle,
                $block_url . '/build/frontend.js',
                $asset['dependencies'] ?? [],
                $asset['version'] ?? filemtime($frontend_script_path),
                true
            );

            // Localize AJAX data
            wp_localize_script(
                $script_handle,
                'jankxAdvancedFilters',
                [
                    'ajaxUrl' => admin_url('admin-ajax.php'),
                    'nonce' => wp_create_nonce('jankx_advanced_filters'),
                ]
            );
        }
    }

    /**
     * Handle AJAX request to update post-type-layout blocks with filters
     * Uses PostTypeLayoutBlock's render logic
     *
     * @return void
     */
    public function handleFiltersUpdate(): void
    {
        // Verify nonce - use wp_verify_nonce to avoid dying
        $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
        if (!wp_verify_nonce($nonce, 'jankx_advanced_filters')) {
            wp_send_json_error(['message' => __('Security check failed. Please refresh the page.', 'jankx')]);
            return;
        }

        // Get parameters
        $target_blocks_json = isset($_POST['target_blocks']) ? sanitize_text_field(wp_unslash($_POST['target_blocks'])) : '';
        $filters_json = isset($_POST['filters']) ? sanitize_text_field(wp_unslash($_POST['filters'])) : '[]';

        // Decode JSON
        $target_blocks = [];
        $filters = [];

        if (!empty($target_blocks_json)) {
            $decoded = json_decode($target_blocks_json, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $target_blocks = $decoded;
            }
        }

        if (!empty($filters_json)) {
            $decoded = json_decode($filters_json, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $filters = $decoded;
            }
        }

        if (empty($target_blocks)) {
            wp_send_json_error(['message' => __('No target blocks specified', 'jankx')]);
            return;
        }

        try {
            $results = [];
            $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : get_the_ID();

            // If no post_id, try to get from URL or global
            if (!$post_id) {
                if (isset($_SERVER['HTTP_REFERER'])) {
                    $referer = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY);
                    if ($referer) {
                        parse_str($referer, $params);
                        if (isset($params['p'])) {
                            $post_id = intval($params['p']);
                        } elseif (isset($params['post'])) {
                            $post_id = intval($params['post']);
                        }
                    }
                }
            }

            // Still no post_id, try global $post
            if (!$post_id) {
                global $post;
                $post_id = $post->ID ?? 0;
            }

            // Process each target block - use PostTypeLayoutBlock's render logic
            $post_type_layout_block = new \Jankx\Gutenberg\Blocks\PostTypeLayoutBlock();
            
            foreach ($target_blocks as $block_id) {
                // Get block attributes from post content
                $block_attributes = $this->getBlockAttributesFromPost($post_id, $block_id);
                
                if (!$block_attributes) {
                    continue;
                }

                // Apply filters to attributes
                $block_attributes = $this->applyFiltersToAttributes($block_attributes, $filters);

                // Use PostTypeLayoutBlock's render method
                $mock_block = (object) [
                    'attributes' => $block_attributes,
                    'innerBlocks' => [],
                    'innerHTML' => '',
                    'innerContent' => [],
                ];

                $rendered_html = $post_type_layout_block->render($block_attributes, '', $mock_block);
                
                if ($rendered_html) {
                    // Ensure data attributes are present
                    $query_id = $block_attributes['queryId'] ?? null;
                    if ($query_id && (strpos($rendered_html, 'data-block-id') === false || strpos($rendered_html, 'data-query-id') === false)) {
                        $rendered_html = preg_replace(
                            '/(<div\s+[^>]*class=["\'][^"\']*wp-block-jankx-post-type-layout[^"\']*["\'][^>]*)(>)/i',
                            '$1 data-block-id="' . esc_attr($query_id) . '" data-query-id="' . esc_attr($query_id) . '"$2',
                            $rendered_html,
                            1
                        );
                    }
                    
                    $results[$block_id] = $rendered_html;
                }
            }

            wp_send_json_success($results);
        } catch (\Exception $e) {
            Log::error('AdvancedFiltersBlock: Error updating filters - ' . $e->getMessage());
            wp_send_json_error(['message' => $e->getMessage()]);
        }
    }

    /**
     * Get block attributes from post content by block ID
     *
     * @param int $post_id Post ID
     * @param string $block_id Block queryId
     * @return array|null Block attributes or null if not found
     */
    private function getBlockAttributesFromPost(int $post_id, string $block_id): ?array
    {
        if (!$post_id) {
            return null;
        }

        $post_obj = get_post($post_id);
        if (!$post_obj) {
            return null;
        }

        $blocks = parse_blocks($post_obj->post_content);
        
        // Recursively search for block
        return $this->findBlockAttributesById($blocks, $block_id);
    }

    /**
     * Recursively find block attributes by queryId
     *
     * @param array $blocks Parsed blocks
     * @param string $target_block_id Target block queryId
     * @return array|null Block attributes or null
     */
    private function findBlockAttributesById(array $blocks, string $target_block_id): ?array
    {
        foreach ($blocks as $block) {
            if (($block['blockName'] ?? '') === 'jankx/post-type-layout') {
                $query_id = $block['attrs']['queryId'] ?? null;
                if ($query_id && strval($query_id) === $target_block_id) {
                    return $block['attrs'] ?? [];
                }
            }

            // Search in inner blocks
            if (!empty($block['innerBlocks'])) {
                $result = $this->findBlockAttributesById($block['innerBlocks'], $target_block_id);
                if ($result !== null) {
                    return $result;
                }
            }
        }

        return null;
    }


    /**
     * Apply filters to post-type-layout block attributes
     *
     * @param array $attributes Original block attributes
     * @param array $filters Filter parameters
     * @return array Modified attributes
     */
    private function applyFiltersToAttributes(array $attributes, array $filters): array
    {
        // Apply taxonomy filters
        if (!empty($filters) && is_array($filters)) {
            $tax_query = $attributes['taxQuery'] ?? [];

            foreach ($filters as $key => $value) {
                // Check if it's a taxonomy filter
                $taxonomy = get_taxonomy($key);
                if ($taxonomy) {
                    $term_ids = is_array($value) ? $value : [$value];
                    $tax_query[] = [
                        'taxonomy' => $key,
                        'field' => 'term_id',
                        'terms' => array_map('intval', $term_ids),
                        'operator' => 'IN',
                    ];
                } elseif ($key === 'keyword' && !empty($value)) {
                    $attributes['keyword'] = sanitize_text_field($value);
                } elseif (strpos($key, 'meta_') === 0) {
                    // Meta filter
                    $meta_key = substr($key, 5);
                    $meta_query = $attributes['metaQuery'] ?? [];
                    $meta_query[] = [
                        'key' => $meta_key,
                        'value' => sanitize_text_field($value),
                        'compare' => '=',
                    ];
                    $attributes['metaQuery'] = $meta_query;
                } elseif ($key === 'price' && is_array($value)) {
                    // Price filter
                    $meta_query = $attributes['metaQuery'] ?? [];
                    if (!empty($value['min'])) {
                        $meta_query[] = [
                            'key' => 'price',
                            'value' => floatval($value['min']),
                            'compare' => '>=',
                            'type' => 'NUMERIC',
                        ];
                    }
                    if (!empty($value['max'])) {
                        $meta_query[] = [
                            'key' => 'price',
                            'value' => floatval($value['max']),
                            'compare' => '<=',
                            'type' => 'NUMERIC',
                        ];
                    }
                    $attributes['metaQuery'] = $meta_query;
                }
            }

            if (!empty($tax_query)) {
                $attributes['taxQuery'] = $tax_query;
            }
        }

        return $attributes;
    }

}
