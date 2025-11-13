<?php

/**
 * REST API Handler for Advanced Filters Block
 *
 * @package Jankx\Rest
 * @since 1.0.0
 */

namespace Jankx\Rest;

use Jankx\Facades\Log;

class AdvancedFiltersRestApiHandler
{
    /**
     * Register REST API endpoints
     *
     * @return void
     */
    public function registerEndpoints(): void
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
    }

    /**
     * Handle filter data request
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function handleFilterDataRequest($request)
    {
        $filter_config = $request->get_param('filter_config');
        $target_blocks = $request->get_param('target_blocks');
        $filters = $request->get_param('filters');

        // Decode JSON strings if needed
        if (is_string($filter_config)) {
            $filter_config = json_decode(stripslashes($filter_config), true);
        }
        if (is_string($target_blocks)) {
            $target_blocks = json_decode(stripslashes($target_blocks), true);
        }
        if (is_string($filters)) {
            $filters = json_decode(stripslashes($filters), true);
        }

        if (empty($filter_config) || empty($target_blocks)) {
            return rest_ensure_response([
                'success' => false,
                'message' => 'Missing required parameters'
            ]);
        }

        try {
            // Delegate to AdvancedFiltersBlock handler via filter
            $results = apply_filters('jankx_advanced_filter_get_block_data', [], $target_blocks, $filters);

            $filtered_results = apply_filters('jankx_advanced_filter_results', $results, $filter_config, $filters);

            return rest_ensure_response([
                'success' => true,
                'results' => $filtered_results,
                'filters_applied' => $filters,
                'total_blocks' => count($results)
            ]);

        } catch (\Exception $e) {
            Log::error('AdvancedFiltersBlock: Error processing filter - ' . $e->getMessage());
            return rest_ensure_response([
                'success' => false,
                'message' => 'Error processing filter: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Handle get terms request
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function handleGetTermsRequest($request)
    {
        $taxonomy = $request->get_param('taxonomy');
        $post_type = $request->get_param('post_type');

        if (empty($taxonomy)) {
            return rest_ensure_response([
                'success' => false,
                'message' => 'Taxonomy is required'
            ]);
        }

        $terms = get_terms([
            'taxonomy' => $taxonomy,
            'hide_empty' => false,
            'orderby' => 'name',
            'order' => 'ASC'
        ]);

        if (is_wp_error($terms)) {
            return rest_ensure_response([
                'success' => false,
                'message' => $terms->get_error_message()
            ]);
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

        return rest_ensure_response([
            'success' => true,
            'data' => $formatted_terms
        ]);
    }

    /**
     * Handle get meta keys request
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function handleGetMetaKeysRequest($request)
    {
        $post_type = $request->get_param('post_type');

        global $wpdb;

        $meta_keys = $wpdb->get_col($wpdb->prepare("
            SELECT DISTINCT meta_key
            FROM {$wpdb->postmeta} pm
            INNER JOIN {$wpdb->posts} p ON pm.post_id = p.ID
            WHERE p.post_type = %s
            AND meta_key NOT LIKE '\_%'
            ORDER BY meta_key
        ", $post_type));

        return rest_ensure_response([
            'success' => true,
            'data' => $meta_keys
        ]);
    }

    /**
     * Handle get filterable blocks request
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function handleGetFilterableBlocksRequest($request)
    {
        $post_id = $request->get_param('post_id') ?: get_the_ID();

        if (!$post_id) {
            return rest_ensure_response([]);
        }

        $post = get_post($post_id);
        if (!$post) {
            return rest_ensure_response([]);
        }

        // Delegate to AdvancedFiltersBlock handler via filter
        $blocks = apply_filters('jankx_advanced_filter_find_blocks', [], $post);

        return rest_ensure_response($blocks);
    }
}

