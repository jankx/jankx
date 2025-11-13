<?php

/**
 * AJAX Handler for Advanced Filters Block
 *
 * @package Jankx\Rest
 * @since 1.0.0
 */

namespace Jankx\Rest;

use Jankx\Facades\Log;

class AdvancedFiltersAjaxHandler
{
    /**
     * Register AJAX handlers
     *
     * @return void
     */
    public function registerHandlers(): void
    {
        add_action('wp_ajax_jankx_advanced_filter_get_data', [$this, 'handleFilterDataRequest']);
        add_action('wp_ajax_nopriv_jankx_advanced_filter_get_data', [$this, 'handleFilterDataRequest']);
        add_action('wp_ajax_jankx_advanced_filter_get_terms', [$this, 'handleGetTermsRequest']);
        add_action('wp_ajax_nopriv_jankx_advanced_filter_get_terms', [$this, 'handleGetTermsRequest']);
        add_action('wp_ajax_jankx_advanced_filter_get_meta_keys', [$this, 'handleGetMetaKeysRequest']);
        add_action('wp_ajax_nopriv_jankx_advanced_filter_get_meta_keys', [$this, 'handleGetMetaKeysRequest']);
        add_action('wp_ajax_jankx_get_filterable_blocks', [$this, 'handleGetFilterableBlocksRequest']);
        add_action('wp_ajax_nopriv_jankx_get_filterable_blocks', [$this, 'handleGetFilterableBlocksRequest']);
    }

    /**
     * Handle filter data request via AJAX
     *
     * @return void
     */
    public function handleFilterDataRequest(): void
    {
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
            // Delegate to AdvancedFiltersBlock handler via filter
            $results = apply_filters('jankx_advanced_filter_get_block_data', [], $target_blocks, $filters);

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
    public function handleGetTermsRequest(): void
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
    public function handleGetMetaKeysRequest(): void
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
     * Handle get filterable blocks request via AJAX
     *
     * @return void
     */
    public function handleGetFilterableBlocksRequest(): void
    {
        $blocks = [];

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

        // Delegate to AdvancedFiltersBlock handler via filter
        $blocks = apply_filters('jankx_advanced_filter_find_blocks', [], $post);

        wp_send_json_success(['blocks' => $blocks]);
    }
}

