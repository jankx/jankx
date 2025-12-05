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
            'permission_callback' => [$this, 'checkPostsDataPermission'],
        ]);
    }

    /**
     * Check permission for posts data endpoint
     * 
     * Validates that the user has appropriate permissions to access the requested post type
     * and respects WordPress post visibility rules.
     *
     * @param \WP_REST_Request $request
     * @return bool|\WP_Error
     */
    public function checkPostsDataPermission(\WP_REST_Request $request)
    {
        // Basic check: user must be logged in and have edit capabilities
        if (!is_user_logged_in()) {
            return new \WP_Error(
                'rest_forbidden',
                __('You must be logged in to access this endpoint.', 'jankx'),
                ['status' => 401]
            );
        }

        // Get attributes from request to determine post type
        $body_params = $request->get_json_params();
        $attributes = $body_params['attributes'] ?? [];

        // If no post type specified, require general edit_posts capability
        if (empty($attributes['postType'])) {
            return current_user_can('edit_posts');
        }

        $post_type = sanitize_text_field($attributes['postType']);

        // Validate post type exists and is public or user has access
        $post_type_object = get_post_type_object($post_type);
        if (!$post_type_object) {
            return new \WP_Error(
                'rest_invalid_post_type',
                __('Invalid post type specified.', 'jankx'),
                ['status' => 400]
            );
        }

        // Check if user has edit capability for this specific post type
        $edit_cap = $post_type_object->cap->edit_posts ?? 'edit_posts';
        if (!current_user_can($edit_cap)) {
            return new \WP_Error(
                'rest_forbidden',
                sprintf(
                    __('You do not have permission to edit %s.', 'jankx'),
                    $post_type_object->labels->name ?? $post_type
                ),
                ['status' => 403]
            );
        }

        // Additional check: if post type is not publicly queryable, ensure user has read capability
        if (!$post_type_object->publicly_queryable) {
            $read_cap = $post_type_object->cap->read_private_posts ?? 'read_private_posts';
            if (!current_user_can($read_cap)) {
                return new \WP_Error(
                    'rest_forbidden',
                    sprintf(
                        __('You do not have permission to read %s.', 'jankx'),
                        $post_type_object->labels->name ?? $post_type
                    ),
                    ['status' => 403]
                );
            }
        }

        return true;
    }

    /**
     * Get posts data for editor preview
     * 
     * Additional security: Filters posts to ensure user only sees posts they have permission to view
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function getPostsData(\WP_REST_Request $request): \WP_REST_Response
    {
        $attributes = $request->get_json_params()['attributes'] ?? [];
        
        // Validate post type if provided
        if (!empty($attributes['postType'])) {
            $post_type = sanitize_text_field($attributes['postType']);
            $post_type_object = get_post_type_object($post_type);
            
            if (!$post_type_object) {
                return new \WP_REST_Response([
                    'error' => __('Invalid post type specified.', 'jankx')
                ], 400);
            }
        }
        
        // Delegate to Block handler via filter to get posts data
        $result = apply_filters('jankx_post_type_layout_get_posts_data', null, $attributes);
        
        if ($result === null) {
            return new \WP_REST_Response(['error' => __('Failed to fetch posts data', 'jankx')], 400);
        }
        
        // Additional security: Filter posts to respect visibility rules
        // This ensures users only see posts they have permission to view
        if (!empty($result['posts']) && is_array($result['posts'])) {
            $result['posts'] = array_filter($result['posts'], function ($post_data) use ($attributes) {
                if (empty($post_data['id'])) {
                    return false;
                }
                
                $post_id = intval($post_data['id']);
                $post = get_post($post_id);
                
                if (!$post) {
                    return false;
                }
                
                // Check if user can read this specific post
                // This respects post status (draft, private, etc.) and user capabilities
                return $this->canUserReadPost($post);
            });
            
            // Re-index array after filtering
            $result['posts'] = array_values($result['posts']);
        }
        
        return new \WP_REST_Response($result, 200);
    }

    /**
     * Check if current user can read a specific post
     * 
     * Respects WordPress post visibility rules:
     * - Public posts: anyone can read
     * - Private posts: only author or users with read_private_posts capability
     * - Draft posts: only author or users with edit_posts capability
     * - Password protected: requires password
     *
     * @param \WP_Post $post
     * @return bool
     */
    protected function canUserReadPost(\WP_Post $post): bool
    {
        // If post is published and public, anyone can read it
        if ($post->post_status === 'publish') {
            return true;
        }

        // For non-published posts, check user capabilities
        if (!is_user_logged_in()) {
            return false;
        }

        $post_type_object = get_post_type_object($post->post_type);
        if (!$post_type_object) {
            return false;
        }

        // Private posts: check read_private_posts capability
        if ($post->post_status === 'private') {
            $cap = $post_type_object->cap->read_private_posts ?? 'read_private_posts';
            return current_user_can($cap) || (int) $post->post_author === get_current_user_id();
        }

        // Draft/pending/future posts: check edit capability or if user is the author
        if (in_array($post->post_status, ['draft', 'pending', 'future'], true)) {
            $edit_cap = $post_type_object->cap->edit_posts ?? 'edit_posts';
            $edit_own_cap = $post_type_object->cap->edit_posts ?? 'edit_posts';
            
            // User can edit all posts of this type
            if (current_user_can($edit_cap)) {
                return true;
            }
            
            // User is the author
            if ((int) $post->post_author === get_current_user_id()) {
                return current_user_can($edit_own_cap);
            }
            
            return false;
        }

        // Password protected posts: in editor context, we allow if user has edit capability
        if ($post->post_status === 'publish' && !empty($post->post_password)) {
            $edit_cap = $post_type_object->cap->edit_posts ?? 'edit_posts';
            return current_user_can($edit_cap);
        }

        // Default: deny access for unknown statuses
        return false;
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

