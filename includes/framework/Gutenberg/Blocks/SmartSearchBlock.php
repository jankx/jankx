<?php

/**
 * Smart Search Block
 *
 * A flexible search form builder block with auto suggestion and autocomplete capabilities.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Facades\Log;
use WP_Query;

class SmartSearchBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/smart-search';

    /**
     * Register the block
     *
     * @return void
     */
    public function init()
    {
        add_action('rest_api_init', [$this, 'registerRestEndpoints']);
        add_action('wp_ajax_jankx_smart_search_suggestions', [$this, 'handleSearchSuggestions']);
        add_action('wp_ajax_nopriv_jankx_smart_search_suggestions', [$this, 'handleSearchSuggestions']);
        
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
        register_rest_route('jankx/v1', '/smart-search/post-types', [
            'methods' => 'GET',
            'callback' => [$this, 'handleGetPostTypesRequest'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('jankx/v1', '/smart-search/taxonomies', [
            'methods' => 'GET',
            'callback' => [$this, 'handleGetTaxonomiesRequest'],
            'permission_callback' => '__return_true',
            'args' => [
                'post_type' => [
                    'required' => false,
                    'type' => 'string',
                    'description' => __('Post type to get taxonomies for', 'jankx'),
                ],
            ],
        ]);
    }

    /**
     * Enqueue frontend assets
     *
     * @return void
     */
    public function enqueueFrontendAssets()
    {
        $block_path = $this->resolveBlockPathFromContainer();
        if (!$block_path) {
            return;
        }

        // Enqueue style
        $style_path = dirname($block_path) . '/dist/blocks/smart-search/style.css';
        if (file_exists($style_path)) {
            wp_enqueue_style(
                'jankx-smart-search-style',
                get_template_directory_uri() . str_replace(get_template_directory(), '', dirname($block_path)) . '/dist/blocks/smart-search/style.css',
                [],
                filemtime($style_path)
            );
        }

        $asset_file = include dirname($block_path) . '/dist/blocks/smart-search/frontend.asset.php';
        if (!$asset_file) {
            return;
        }

        wp_enqueue_script(
            'jankx-smart-search-frontend',
            get_template_directory_uri() . str_replace(get_template_directory(), '', dirname($block_path)) . '/dist/blocks/smart-search/frontend.js',
            $asset_file['dependencies'],
            $asset_file['version'],
            true
        );

        wp_localize_script(
            'jankx-smart-search-frontend',
            'jankxSmartSearch',
            [
                'nonce' => wp_create_nonce('jankx_smart_search_nonce'),
                'ajaxUrl' => admin_url('admin-ajax.php'),
            ]
        );
    }

    /**
     * Handle search suggestions AJAX request
     *
     * @return void
     */
    public function handleSearchSuggestions()
    {
        // Verify nonce
        check_ajax_referer('jankx_smart_search_nonce', 'nonce');

        $query = sanitize_text_field($_POST['query'] ?? '');
        
        // Parse JSON strings for post_types and taxonomies
        $post_types = ['post'];
        if (isset($_POST['post_types'])) {
            if (is_array($_POST['post_types'])) {
                $post_types = $_POST['post_types'];
            } else {
                $decoded = json_decode(stripslashes($_POST['post_types']), true);
                if (is_array($decoded)) {
                    $post_types = $decoded;
                }
            }
        }
        
        $taxonomies = [];
        if (isset($_POST['taxonomies'])) {
            if (is_array($_POST['taxonomies'])) {
                $taxonomies = $_POST['taxonomies'];
            } else {
                $decoded = json_decode(stripslashes($_POST['taxonomies']), true);
                if (is_array($decoded)) {
                    $taxonomies = $decoded;
                }
            }
        }
        
        $show_posts = isset($_POST['show_posts']) ? filter_var($_POST['show_posts'], FILTER_VALIDATE_BOOLEAN) : true;
        $show_post_types = isset($_POST['show_post_types']) ? filter_var($_POST['show_post_types'], FILTER_VALIDATE_BOOLEAN) : false;
        $show_users = isset($_POST['show_users']) ? filter_var($_POST['show_users'], FILTER_VALIDATE_BOOLEAN) : false;
        $show_taxonomy = isset($_POST['show_taxonomy']) ? filter_var($_POST['show_taxonomy'], FILTER_VALIDATE_BOOLEAN) : false;
        $show_tags = isset($_POST['show_tags']) ? filter_var($_POST['show_tags'], FILTER_VALIDATE_BOOLEAN) : false;
        $limit = isset($_POST['limit']) ? intval($_POST['limit']) : 10;

        if (empty($query)) {
            wp_send_json_success([]);
        }

        $results = [];
        $count_enabled_types = 0;
        
        // Count how many types are enabled
        if ($show_posts && !empty($post_types)) {
            $count_enabled_types++;
        }
        if ($show_post_types) {
            $count_enabled_types++;
        }
        if ($show_users) {
            $count_enabled_types++;
        }
        if ($show_taxonomy && !empty($taxonomies)) {
            $count_enabled_types++;
        }
        if ($show_tags) {
            $count_enabled_types++;
        }
        
        // Calculate limit per type (at least 2, or distribute evenly)
        $limit_per_type = $count_enabled_types > 0 ? max(2, floor($limit / $count_enabled_types)) : 10;

        // Search posts
        if ($show_posts && !empty($post_types)) {
            $post_results = $this->searchPosts($query, $post_types, $limit_per_type);
            if (!empty($post_results)) {
                $results['posts'] = $post_results;
            }
        }

        // Search post types
        if ($show_post_types) {
            $post_type_results = $this->searchPostTypes($query, $limit_per_type);
            if (!empty($post_type_results)) {
                $results['post_types'] = $post_type_results;
            }
        }

        // Search users
        if ($show_users) {
            $user_results = $this->searchUsers($query, $limit_per_type);
            if (!empty($user_results)) {
                $results['users'] = $user_results;
            }
        }

        // Search taxonomy terms
        if ($show_taxonomy && !empty($taxonomies)) {
            $taxonomy_results = $this->searchTaxonomyTerms($query, $taxonomies, $limit_per_type);
            if (!empty($taxonomy_results)) {
                $results['taxonomies'] = $taxonomy_results;
            }
        }

        // Search tags
        if ($show_tags) {
            $tag_results = $this->searchTags($query, $limit_per_type);
            if (!empty($tag_results)) {
                $results['tags'] = $tag_results;
            }
        }

        wp_send_json_success($results);
    }

    /**
     * Search posts
     *
     * @param string $query Search query
     * @param array $post_types Post types to search
     * @param int $limit Result limit
     * @return array
     */
    protected function searchPosts($query, $post_types, $limit = 10)
    {
        $args = [
            's' => $query,
            'post_type' => $post_types,
            'post_status' => 'publish',
            'posts_per_page' => $limit,
            'orderby' => 'relevance',
            'order' => 'DESC',
        ];

        $search_query = new WP_Query($args);
        $results = [];

        if ($search_query->have_posts()) {
            while ($search_query->have_posts()) {
                $search_query->the_post();
                $results[] = [
                    'id' => get_the_ID(),
                    'title' => get_the_title(),
                    'url' => get_permalink(),
                    'type' => get_post_type(),
                    'excerpt' => wp_trim_words(get_the_excerpt(), 15),
                ];
            }
            wp_reset_postdata();
        }

        return $results;
    }

    /**
     * Search post types
     *
     * @param string $query Search query
     * @param int $limit Result limit
     * @return array
     */
    protected function searchPostTypes($query, $limit = 10)
    {
        $post_types = get_post_types(['public' => true], 'objects');
        $results = [];

        foreach ($post_types as $post_type) {
            if (count($results) >= $limit) {
                break;
            }
            
            $name = $post_type->name;
            $label = $post_type->label;
            
            if (stripos($label, $query) !== false || stripos($name, $query) !== false) {
                $results[] = [
                    'name' => $name,
                    'label' => $label,
                    'url' => get_post_type_archive_link($name),
                ];
            }
        }

        return $results;
    }

    /**
     * Search users
     *
     * @param string $query Search query
     * @param int $limit Result limit
     * @return array
     */
    protected function searchUsers($query, $limit = 10)
    {
        $args = [
            'search' => '*' . $query . '*',
            'search_columns' => ['user_login', 'user_nicename', 'user_email', 'display_name'],
            'number' => $limit,
        ];

        $user_query = new \WP_User_Query($args);
        $results = [];

        foreach ($user_query->get_results() as $user) {
            $results[] = [
                'id' => $user->ID,
                'name' => $user->display_name,
                'username' => $user->user_login,
                'url' => get_author_posts_url($user->ID),
                'avatar' => get_avatar_url($user->ID, ['size' => 32]),
            ];
        }

        return $results;
    }

    /**
     * Search taxonomy terms
     *
     * @param string $query Search query
     * @param array $taxonomies Taxonomies to search
     * @param int $limit Result limit
     * @return array
     */
    protected function searchTaxonomyTerms($query, $taxonomies, $limit = 10)
    {
        $results = [];

        foreach ($taxonomies as $taxonomy) {
            $args = [
                'taxonomy' => $taxonomy,
                'hide_empty' => false,
                'number' => $limit,
                'search' => $query,
            ];

            $terms = get_terms($args);

            if (!is_wp_error($terms) && !empty($terms)) {
                foreach ($terms as $term) {
                    $results[] = [
                        'id' => $term->term_id,
                        'name' => $term->name,
                        'slug' => $term->slug,
                        'taxonomy' => $taxonomy,
                        'url' => get_term_link($term),
                        'count' => $term->count,
                    ];
                }
            }
        }

        return $results;
    }

    /**
     * Search tags
     *
     * @param string $query Search query
     * @param int $limit Result limit
     * @return array
     */
    protected function searchTags($query, $limit = 10)
    {
        $args = [
            'taxonomy' => 'post_tag',
            'hide_empty' => false,
            'number' => $limit,
            'search' => $query,
        ];

        $terms = get_terms($args);
        $results = [];

        if (!is_wp_error($terms) && !empty($terms)) {
            foreach ($terms as $term) {
                $results[] = [
                    'id' => $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug,
                    'url' => get_term_link($term),
                    'count' => $term->count,
                ];
            }
        }

        return $results;
    }

    /**
     * Handle get post types REST API request
     *
     * @param \WP_REST_Request $request Request object
     * @return \WP_REST_Response
     */
    public function handleGetPostTypesRequest($request)
    {
        $post_types = get_post_types(['public' => true], 'objects');
        $results = [];

        foreach ($post_types as $post_type) {
            if ($post_type->name === 'attachment') {
                continue;
            }

            // Get taxonomies for this post type
            $taxonomies = get_object_taxonomies($post_type->name, 'objects');
            $taxonomy_list = [];

            foreach ($taxonomies as $taxonomy) {
                if ($taxonomy->public && $taxonomy->name !== 'post_format') {
                    $taxonomy_list[] = [
                        'name' => $taxonomy->name,
                        'label' => $taxonomy->labels->singular_name ?: $taxonomy->label,
                        'plural_label' => $taxonomy->label,
                    ];
                }
            }

            $results[] = [
                'name' => $post_type->name,
                'label' => $post_type->labels->singular_name ?: $post_type->label,
                'plural_label' => $post_type->label,
                'taxonomies' => $taxonomy_list,
            ];
        }

        return rest_ensure_response($results);
    }

    /**
     * Handle get taxonomies REST API request
     *
     * @param \WP_REST_Request $request Request object
     * @return \WP_REST_Response
     */
    public function handleGetTaxonomiesRequest($request)
    {
        $post_type = $request->get_param('post_type');

        if ($post_type) {
            // Get taxonomies for specific post type
            $taxonomies = get_object_taxonomies($post_type, 'objects');
        } else {
            // Get all public taxonomies
            $taxonomies = get_taxonomies(['public' => true], 'objects');
        }

        $results = [];

        foreach ($taxonomies as $taxonomy) {
            if ($taxonomy->name === 'post_format') {
                continue;
            }

            // Get object types (post types) that use this taxonomy
            $object_types = $taxonomy->object_type ?? [];
            $post_types_for_taxonomy = [];

            foreach ($object_types as $object_type) {
                $post_type_obj = get_post_type_object($object_type);
                if ($post_type_obj && $post_type_obj->public) {
                    $post_types_for_taxonomy[] = [
                        'name' => $post_type_obj->name,
                        'label' => $post_type_obj->labels->singular_name ?: $post_type_obj->label,
                    ];
                }
            }

            $results[] = [
                'name' => $taxonomy->name,
                'label' => $taxonomy->labels->singular_name ?: $taxonomy->label,
                'plural_label' => $taxonomy->label,
                'post_types' => $post_types_for_taxonomy,
            ];
        }

        return rest_ensure_response($results);
    }
}
