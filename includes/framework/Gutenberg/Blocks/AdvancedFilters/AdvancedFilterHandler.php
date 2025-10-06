<?php
/**
 * Advanced Filter Handler
 *
 * Xử lý AJAX requests và cung cấp hooks cho advanced filter block
 */

namespace Jankx\Gutenberg\Blocks\AdvancedFilters;

if (!defined('ABSPATH')) {
    exit;
}

class AdvancedFilterHandler
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
        add_action('wp_ajax_jankx_advanced_filter_get_data', [$this, 'handle_filter_data_request']);
        add_action('wp_ajax_nopriv_jankx_advanced_filter_get_data', [$this, 'handle_filter_data_request']);

        add_action('wp_ajax_jankx_advanced_filter_get_terms', [$this, 'handle_get_terms_request']);
        add_action('wp_ajax_nopriv_jankx_advanced_filter_get_terms', [$this, 'handle_get_terms_request']);

        add_action('wp_ajax_jankx_advanced_filter_get_meta_keys', [$this, 'handle_get_meta_keys_request']);
        add_action('wp_ajax_nopriv_jankx_advanced_filter_get_meta_keys', [$this, 'handle_get_meta_keys_request']);

        add_action('wp_ajax_jankx_get_filterable_blocks', [$this, 'handle_get_filterable_blocks_request']);
        add_action('wp_ajax_nopriv_jankx_get_filterable_blocks', [$this, 'handle_get_filterable_blocks_request']);

        add_action('wp_ajax_jankx_get_meta_keys', [$this, 'handle_get_meta_keys_request']);
        add_action('wp_ajax_nopriv_jankx_get_meta_keys', [$this, 'handle_get_meta_keys_request']);
    }

    /**
     * Xử lý request lấy dữ liệu filter
     */
    public function handle_filter_data_request()
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

            // Xử lý từng target block
            foreach ($target_blocks as $target) {
                if (!$target['enabled']) continue;

                $block_data = $this->get_block_data($target, $filters);
                if ($block_data) {
                    $results[$target['blockId']] = $block_data;
                }
            }

            // Apply filters cho mỗi block
            $filtered_results = apply_filters('jankx_advanced_filter_results', $results, $filter_config, $filters);

            wp_send_json_success([
                'results' => $filtered_results,
                'filters_applied' => $filters,
                'total_blocks' => count($results)
            ]);

        } catch (\Exception $e) {
            wp_send_json_error('Error processing filter: ' . $e->getMessage());
        }
    }

    /**
     * Lấy dữ liệu cho một block cụ thể
     */
    private function get_block_data($target, $filters)
    {
        $block_id = $target['blockId'];
        $selector = $target['selector'];

        // Lấy block content
        $block_content = $this->get_block_content($block_id);
        if (!$block_content) {
            return null;
        }

        // Parse block attributes
        $block_attributes = $this->parse_block_attributes($block_content);
        if (!$block_attributes) {
            return null;
        }

        // Build query args từ filters
        $query_args = $this->build_query_args($block_attributes, $filters);

        // Execute query
        $posts = $this->execute_query($query_args);

        // Render content
        $rendered_content = $this->render_posts($posts, $block_attributes);

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
     * Lấy nội dung block
     */
    private function get_block_content($block_id)
    {
        // Tìm block trong post content
        $posts = get_posts([
            'post_type' => 'any',
            'post_status' => 'publish',
            'meta_query' => [
                [
                    'key' => '_jankx_block_id',
                    'value' => $block_id,
                    'compare' => '='
                ]
            ],
            'posts_per_page' => 1
        ]);

        if (empty($posts)) {
            return null;
        }

        $post = $posts[0];
        $blocks = parse_blocks($post->post_content);

        foreach ($blocks as $block) {
            if ($block['blockName'] === 'jankx/post-layout' &&
                isset($block['attrs']['blockId']) &&
                $block['attrs']['blockId'] === $block_id) {
                return $block;
            }
        }

        return null;
    }

    /**
     * Parse block attributes
     */
    private function parse_block_attributes($block)
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
     * Build query args từ filters
     */
    private function build_query_args($block_attrs, $filters)
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
                    'compare' => $this->get_meta_compare_operator($meta_filter['operator'])
                ];
            }
            if (!empty($meta_query)) {
                $query_args['meta_query'] = $meta_query;
            }
        }

        // Apply custom filters
        if (!empty($filters['custom'])) {
            $custom_query = $this->build_custom_query($filters['custom']);
            if (!empty($custom_query)) {
                $query_args = array_merge($query_args, $custom_query);
            }
        }

        // Apply date filters
        if (!empty($filters['date'])) {
            $date_query = $this->build_date_query($filters['date']);
            if (!empty($date_query)) {
                $query_args['date_query'] = $date_query;
            }
        }

        // Apply price filters
        if (!empty($filters['price'])) {
            $price_query = $this->build_price_query($filters['price']);
            if (!empty($price_query)) {
                if (isset($query_args['meta_query'])) {
                    $query_args['meta_query'] = array_merge($query_args['meta_query'], $price_query);
                } else {
                    $query_args['meta_query'] = $price_query;
                }
            }
        }

        // Apply hooks để custom query
        $query_args = apply_filters('jankx_advanced_filter_query_args', $query_args, $filters, $block_attrs);

        return $query_args;
    }

    /**
     * Execute query
     */
    private function execute_query($query_args)
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
     */
    private function render_posts($query_result, $block_attrs)
    {
        $posts = $query_result['posts'];
        $display_options = $block_attrs['displayOptions'] ?? [];
        $styling = $block_attrs['styling'] ?? [];

        if (empty($posts)) {
            return '<div class="jankx-post-layout__empty">Không tìm thấy bài viết nào.</div>';
        }

        $output = '<div class="jankx-post-layout__grid">';

        foreach ($posts as $post) {
            $output .= $this->render_single_post($post, $display_options, $styling);
        }

        $output .= '</div>';

        // Apply hooks để custom render
        $output = apply_filters('jankx_advanced_filter_render_posts', $output, $posts, $display_options, $styling);

        return $output;
    }

    /**
     * Render single post
     */
    private function render_single_post($post, $display_options, $styling)
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

        // Apply hooks để custom render single post
        $output = apply_filters('jankx_advanced_filter_render_single_post', $output, $post, $display_options, $styling);

        return $output;
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
     * Build custom query
     */
    private function build_custom_query($custom_filters)
    {
        $query = [];

        foreach ($custom_filters as $filter) {
            if (!$filter['enabled'] || empty($filter['field']) || empty($filter['value'])) {
                continue;
            }

            // Custom logic cho từng loại filter
            $query = apply_filters('jankx_advanced_filter_custom_query', $query, $filter);
        }

        return $query;
    }

    /**
     * Build date query
     */
    private function build_date_query($date_filters)
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
     */
    private function build_price_query($price_filters)
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
     * Handle get terms request
     */
    public function handle_get_terms_request()
    {
        $taxonomy = sanitize_text_field($_POST['taxonomy'] ?? '');
        $post_type = sanitize_text_field($_POST['post_type'] ?? 'post');

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
     */
    public function handle_get_meta_keys_request()
    {
        $post_type = sanitize_text_field($_POST['post_type'] ?? 'post');

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
     */
    public function handle_get_filterable_blocks_request()
    {
        $blocks = [];

        // Tìm tất cả post-layout blocks
        $posts = get_posts([
            'post_type' => 'any',
            'post_status' => 'publish',
            'posts_per_page' => -1
        ]);

        foreach ($posts as $post) {
            $parsed_blocks = parse_blocks($post->post_content);
            foreach ($parsed_blocks as $block) {
                if ($block['blockName'] === 'jankx/post-layout') {
                    $block_id = $block['attrs']['blockId'] ?? 'block_' . md5(serialize($block));
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
}

// Initialize handler
AdvancedFilterHandler::getInstance();
