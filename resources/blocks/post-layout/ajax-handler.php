<?php
/**
 * AJAX Handler for Post Layout Block
 * Handles frontend requests for fetching posts with filters
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class PostLayoutAjaxHandler {

    public function __construct() {
        add_action('wp_ajax_jankx-post-layout-fetch-data', [$this, 'handleFetchData']);
        add_action('wp_ajax_nopriv_jankx-post-layout-fetch-data', [$this, 'handleFetchData']);
    }

    public function handleFetchData() {
        try {
            // Validate nonce for security
            if (!wp_verify_nonce($_REQUEST['_wpnonce'] ?? '', 'jankx_post_layout_nonce')) {
                throw new Exception('Invalid nonce');
            }

            // Get and validate parameters
            $params = $this->validateAndSanitizeParams();

            // Build WP_Query args
            $query_args = $this->buildQueryArgs($params);

            // Execute query
            $query = new WP_Query($query_args);

            if ($query->have_posts()) {
                $posts = $this->formatPosts($query->posts);

                wp_send_json_success([
                    'posts' => $posts,
                    'query_info' => [
                        'total_posts' => $query->found_posts,
                        'found_posts' => $query->post_count,
                        'max_pages' => $query->max_num_pages,
                        'current_page' => $params['page']
                    ],
                    'content' => $this->renderPostsHTML($posts)
                ]);
            } else {
                wp_send_json_success([
                    'posts' => [],
                    'query_info' => [
                        'total_posts' => 0,
                        'found_posts' => 0,
                        'max_pages' => 0,
                        'current_page' => $params['page']
                    ],
                    'content' => '<div class="jankx-post-layout-no-results"><p>Không tìm thấy bài viết nào.</p></div>'
                ]);
            }

        } catch (Exception $e) {
            wp_send_json_error([
                'message' => $e->getMessage(),
                'code' => $e->getCode() ?: 'UNKNOWN_ERROR'
            ]);
        }
    }

    private function validateAndSanitizeParams() {
        $params = [];

        // Required parameters
        $params['post_type'] = sanitize_text_field($_REQUEST['post_type'] ?? 'post');
        $params['posts_per_page'] = intval($_REQUEST['posts_per_page'] ?? 6);
        $params['page'] = intval($_REQUEST['page'] ?? 1);

        // Optional parameters
        $params['order_by'] = sanitize_text_field($_REQUEST['order_by'] ?? 'date');
        $params['order'] = strtoupper(sanitize_text_field($_REQUEST['order'] ?? 'DESC'));
        $params['offset'] = intval($_REQUEST['offset'] ?? 0);

        // Validate post type
        if (!post_type_exists($params['post_type'])) {
            throw new Exception('Invalid post type: ' . $params['post_type']);
        }

        // Validate posts per page
        if ($params['posts_per_page'] < 1 || $params['posts_per_page'] > 100) {
            throw new Exception('posts_per_page must be between 1 and 100');
        }

        // Validate order
        if (!in_array($params['order'], ['ASC', 'DESC'])) {
            throw new Exception('order must be ASC or DESC');
        }

        // Validate order_by
        $allowed_order_by = ['date', 'title', 'menu_order', 'rand', 'comment_count', 'meta_value', 'meta_value_num'];
        if (!in_array($params['order_by'], $allowed_order_by)) {
            throw new Exception('Invalid order_by parameter');
        }

        // Parse JSON parameters
        $params['include'] = $this->parseJsonParam($_REQUEST['include'] ?? '[]');
        $params['exclude'] = $this->parseJsonParam($_REQUEST['exclude'] ?? '[]');
        $params['taxonomy_filters'] = $this->parseJsonParam($_REQUEST['taxonomy_filters'] ?? '{}');
        $params['meta_filters'] = $this->parseJsonParam($_REQUEST['meta_filters'] ?? '{}');

        return $params;
    }

    private function parseJsonParam($json_string) {
        if (empty($json_string)) {
            return [];
        }

        $decoded = json_decode($json_string, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON parameter: ' . json_last_error_msg());
        }

        return $decoded;
    }

    private function buildQueryArgs($params) {
        $args = [
            'post_type' => $params['post_type'],
            'posts_per_page' => $params['posts_per_page'],
            'paged' => $params['page'],
            'orderby' => $params['order_by'],
            'order' => $params['order'],
            'offset' => $params['offset'],
            'post_status' => 'publish',
            'suppress_filters' => false
        ];

        // Include/exclude posts
        if (!empty($params['include'])) {
            $args['post__in'] = array_map('intval', $params['include']);
        }

        if (!empty($params['exclude'])) {
            $args['post__not_in'] = array_map('intval', $params['exclude']);
        }

        // Taxonomy filters
        if (!empty($params['taxonomy_filters'])) {
            $tax_query = [];
            foreach ($params['taxonomy_filters'] as $taxonomy => $terms) {
                if (taxonomy_exists($taxonomy) && !empty($terms)) {
                    $tax_query[] = [
                        'taxonomy' => $taxonomy,
                        'field' => 'slug',
                        'terms' => (array) $terms,
                        'operator' => 'IN'
                    ];
                }
            }
            if (!empty($tax_query)) {
                $args['tax_query'] = $tax_query;
            }
        }

        // Meta filters
        if (!empty($params['meta_filters'])) {
            $meta_query = [];
            foreach ($params['meta_filters'] as $meta_key => $meta_value) {
                if (!empty($meta_key) && !empty($meta_value)) {
                    $meta_query[] = [
                        'key' => sanitize_text_field($meta_key),
                        'value' => sanitize_text_field($meta_value),
                        'compare' => '='
                    ];
                }
            }
            if (!empty($meta_query)) {
                $args['meta_query'] = $meta_query;
            }
        }

        return $args;
    }

    private function formatPosts($posts) {
        $formatted_posts = [];

        foreach ($posts as $post) {
            $formatted_posts[] = [
                'ID' => $post->ID,
                'title' => get_the_title($post->ID),
                'permalink' => get_permalink($post->ID),
                'excerpt' => get_the_excerpt($post->ID),
                'thumbnail' => get_the_post_thumbnail_url($post->ID, 'medium'),
                'meta' => $this->getPostMeta($post),
                'date' => get_the_date('', $post->ID),
                'author' => get_the_author_meta('display_name', $post->post_author)
            ];
        }

        return $formatted_posts;
    }

    private function getPostMeta($post) {
        $meta_parts = [];

        // Date
        $meta_parts[] = '<span class="post-date">' . get_the_date('', $post->ID) . '</span>';

        // Author
        $meta_parts[] = '<span class="post-author">' . get_the_author_meta('display_name', $post->post_author) . '</span>';

        // Categories
        $categories = get_the_category($post->ID);
        if (!empty($categories)) {
            $category_links = array_map(function($cat) {
                return '<a href="' . get_category_link($cat->term_id) . '">' . $cat->name . '</a>';
            }, $categories);
            $meta_parts[] = '<span class="post-categories">' . implode(', ', $category_links) . '</span>';
        }

        return implode(' | ', $meta_parts);
    }

    private function renderPostsHTML($posts) {
        if (empty($posts)) {
            return '<div class="jankx-post-layout-no-results"><p>Không tìm thấy bài viết nào.</p></div>';
        }

        $html = '<div class="jankx-post-layout-posts">';

        foreach ($posts as $post) {
            $html .= '<article class="jankx-post-layout-item">';
            $html .= '<div class="jankx-post-layout-item__content">';

            if (!empty($post['thumbnail'])) {
                $html .= '<div class="jankx-post-layout-item__thumbnail">';
                $html .= '<img src="' . esc_url($post['thumbnail']) . '" alt="' . esc_attr($post['title']) . '" loading="lazy">';
                $html .= '</div>';
            }

            $html .= '<div class="jankx-post-layout-item__body">';

            if (!empty($post['title'])) {
                $html .= '<h3 class="jankx-post-layout-item__title">';
                $html .= '<a href="' . esc_url($post['permalink']) . '">' . esc_html($post['title']) . '</a>';
                $html .= '</h3>';
            }

            if (!empty($post['excerpt'])) {
                $html .= '<div class="jankx-post-layout-item__excerpt">';
                $html .= wp_kses_post($post['excerpt']);
                $html .= '</div>';
            }

            if (!empty($post['meta'])) {
                $html .= '<div class="jankx-post-layout-item__meta">';
                $html .= wp_kses_post($post['meta']);
                $html .= '</div>';
            }

            $html .= '</div>';
            $html .= '</div>';
            $html .= '</article>';
        }

        $html .= '</div>';

        return $html;
    }
}

// Initialize the AJAX handler
new PostLayoutAjaxHandler();
