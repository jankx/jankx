<?php

/**
 * AJAX Handler for Post Type Layout Block
 *
 * @package Jankx\Rest
 * @since 1.0.0
 */

namespace Jankx\Rest;

class PostTypeLayoutAjaxHandler
{
    /**
     * Register AJAX handlers
     *
     * @return void
     */
    public function registerHandlers(): void
    {
        add_action('wp_ajax_jankx_load_more_posts', [$this, 'ajaxLoadMore']);
        add_action('wp_ajax_nopriv_jankx_load_more_posts', [$this, 'ajaxLoadMore']);
        add_action('wp_ajax_jankx_post_type_layout_filter', [$this, 'ajaxFilterUpdate']);
        add_action('wp_ajax_nopriv_jankx_post_type_layout_filter', [$this, 'ajaxFilterUpdate']);
        
        // Register REST API endpoint for posts data
        add_action('rest_api_init', [$this, 'registerRestRoutes']);
    }

    /**
     * Register REST API routes
     *
     * @return void
     */
    public function registerRestRoutes(): void
    {
        register_rest_route('jankx/v1', '/post-type-layout/posts', [
            'methods' => 'POST',
            'callback' => [$this, 'getPostsData'],
            'permission_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
    }

    /**
     * Get posts data for editor preview
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function getPostsData(\WP_REST_Request $request): \WP_REST_Response
    {
        $attributes = $request->get_json_params()['attributes'] ?? [];
        
        // Delegate to Block handler via filter to get posts data
        $result = apply_filters('jankx_post_type_layout_get_posts_data', null, $attributes);
        
        if ($result === null) {
            return new \WP_REST_Response(['error' => __('Failed to fetch posts data', 'jankx')], 400);
        }
        
        return new \WP_REST_Response($result, 200);
    }

    /**
     * AJAX wrapper for Load More
     *
     * @return void
     */
    public function ajaxLoadMore(): void
    {
        check_ajax_referer('jankx_load_more', 'nonce');

        $attributes_json = isset($_POST['attributes']) ? sanitize_text_field(wp_unslash($_POST['attributes'])) : '';
        $page = isset($_POST['page']) ? absint($_POST['page']) : 1;

        $attributes = [];
        if (!empty($attributes_json)) {
            $decoded = json_decode($attributes_json, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $attributes = $decoded;
            }
        }

        // Delegate to Block handler via filter
        $result = apply_filters('jankx_post_type_layout_load_more', $attributes, $page);
        wp_send_json_success($result);
    }

    /**
     * AJAX wrapper for Filter Update
     *
     * @return void
     */
    public function ajaxFilterUpdate(): void
    {
        check_ajax_referer('jankx_load_more', 'nonce');

        $block_id = isset($_POST['block_id']) ? sanitize_text_field(wp_unslash($_POST['block_id'])) : '';
        $attributes_json = isset($_POST['attributes']) ? sanitize_text_field(wp_unslash($_POST['attributes'])) : '';
        $filters_json = isset($_POST['filters']) ? sanitize_text_field(wp_unslash($_POST['filters'])) : '[]';
        $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;

        if (empty($block_id)) {
            wp_send_json_error(['message' => __('Block ID is required', 'jankx')]);
            return;
        }

        $attributes = [];
        $filters = [];

        if (!empty($attributes_json)) {
            $decoded = json_decode($attributes_json, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $attributes = $decoded;
            }
        }

        if (!empty($filters_json)) {
            $decoded = json_decode($filters_json, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $filters = $decoded;
            }
        }

        // Get post_id from global context if not provided
        if (empty($post_id)) {
            $post_id = get_the_ID() ?: 0;
        }

        if (empty($attributes) && $post_id > 0) {
            // Delegate to Block handler via filter to get block attributes
            $block_data_result = apply_filters('jankx_post_type_layout_get_block_attributes', null, $post_id, $block_id);
            if ($block_data_result !== null) {
                $attributes = $block_data_result;
            }
        }

        if (empty($attributes)) {
            wp_send_json_error(['message' => __('Block attributes not found', 'jankx')]);
            return;
        }

        // Ensure queryId is set from block_id for subsequent requests
        if (!empty($block_id) && empty($attributes['queryId'])) {
            $attributes['queryId'] = $block_id;
        }

        // Delegate to Block handler via filter
        $result = apply_filters('jankx_post_type_layout_filter_update', $attributes, $filters);
        wp_send_json_success($result);
    }
}

