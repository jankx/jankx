<?php

/**
 * 404 Prevention for Advanced Filters Block
 *
 * Handles filter query parameters to prevent 404 errors on taxonomy archive pages
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */

namespace Jankx\Gutenberg\Blocks;

class AdvancedFilters404Prevention
{
    /**
     * Register hooks
     *
     * @return void
     */
    public function init(): void
    {
        add_filter('request', [$this, 'allowFilterQueryVars'], 10);
        add_action('parse_request', [$this, 'handleFilterQueryParams'], 10);
        add_action('template_redirect', [$this, 'prevent404ForFilters'], 1);
    }

    /**
     * Handle filter query parameters to prevent 404 errors
     * WordPress may return 404 when filter parameters are present on taxonomy archive pages
     *
     * @param \WP $wp WordPress environment instance
     * @return void
     */
    public function handleFilterQueryParams($wp): void
    {
        // Check if filter parameters are present
        $has_filter_params = $this->hasFilterParams();
        
        if (!$has_filter_params) {
            return;
        }

        // Check if the current request is a taxonomy archive
        // Look at query_vars to determine if this is a taxonomy archive
        $is_taxonomy_archive = false;
        
        // Check for taxonomy query vars in the request
        $taxonomy_query_vars = [];
        foreach ($wp->query_vars as $key => $value) {
            if (taxonomy_exists($key)) {
                $is_taxonomy_archive = true;
                $taxonomy_query_vars[$key] = $value;
                break;
            }
        }
        
        // Also check for category/tag archives
        if (isset($wp->query_vars['category_name']) || isset($wp->query_vars['cat']) || 
            isset($wp->query_vars['tag']) || isset($wp->query_vars['tag_id'])) {
            $is_taxonomy_archive = true;
        }
        
        // If we have filter params and this looks like it should be a valid taxonomy archive
        if ($has_filter_params && $is_taxonomy_archive) {
            // Ensure error is not set
            unset($wp->query_vars['error']);
        }
    }

    /**
     * Prevent 404 errors when filter parameters are present
     *
     * @return void
     */
    public function prevent404ForFilters(): void
    {
        // Check if filter parameters are present
        $has_filter_params = $this->hasFilterParams();
        
        if (!$has_filter_params) {
            return;
        }

        global $wp_query;
        
        // If we're getting a 404, check if the base URL would be valid
        if (is_404() && isset($wp_query)) {
            // Get current request URI
            $request_uri = $_SERVER['REQUEST_URI'] ?? '';
            
            // Remove filter parameters to get base URL
            $parsed_url = parse_url($request_uri);
            if (!isset($parsed_url['path'])) {
                return;
            }
            
            $base_path = $parsed_url['path'];
            
            // Check if base path matches a taxonomy archive pattern
            // Common patterns: /category/slug/, /tag/slug/, /taxonomy/slug/
            $taxonomy_patterns = [
                '/product-category/',
                '/category/',
                '/tag/',
                '/product-tag/',
            ];
            
            $is_taxonomy_path = false;
            foreach ($taxonomy_patterns as $pattern) {
                if (strpos($base_path, $pattern) !== false) {
                    $is_taxonomy_path = true;
                    break;
                }
            }
            
            // Also check query vars - if we have taxonomy-related vars, this is likely valid
            $has_taxonomy_vars = false;
            foreach ($_GET as $key => $value) {
                if (taxonomy_exists($key)) {
                    $has_taxonomy_vars = true;
                    break;
                }
            }
            
            // If this looks like a taxonomy archive page with filters, prevent 404
            if ($is_taxonomy_path || $has_taxonomy_vars) {
                // Get the taxonomy and term from the URL
                $path_parts = explode('/', trim($base_path, '/'));
                
                // Try to determine taxonomy from path
                // Common structure: /{taxonomy-slug}/{term-slug}/
                if (count($path_parts) >= 2) {
                    $possible_taxonomy_slug = $path_parts[0];
                    
                    // Check known taxonomy slugs
                    $known_taxonomies = [
                        'product-category' => 'product_cat',
                        'category' => 'category',
                        'tag' => 'post_tag',
                        'product-tag' => 'product_tag',
                    ];
                    
                    if (isset($known_taxonomies[$possible_taxonomy_slug])) {
                        $taxonomy = $known_taxonomies[$possible_taxonomy_slug];
                        $term_slug = $path_parts[1];
                        
                        // Verify term exists
                        $term = get_term_by('slug', $term_slug, $taxonomy);
                        if ($term && !is_wp_error($term)) {
                            // This is a valid taxonomy archive with filters - prevent 404
                            status_header(200);
                            $wp_query->is_404 = false;
                            $wp_query->is_archive = true;
                            $wp_query->is_tax = true;
                            
                            // Set query vars to make WordPress recognize this as taxonomy archive
                            $wp_query->query_vars['taxonomy'] = $taxonomy;
                            $wp_query->query_vars[$taxonomy] = $term_slug;
                            $wp_query->queried_object = $term;
                            $wp_query->queried_object_id = $term->term_id;
                        }
                    }
                }
            }
        }
    }

    /**
     * Check if filter parameters are present in request
     *
     * @return bool
     */
    private function hasFilterParams(): bool
    {
        if (empty($_GET)) {
            return false;
        }

        $public_taxonomies = get_taxonomies(['public' => true], 'names');
        
        foreach ($_GET as $key => $value) {
            // Skip WordPress reserved query vars
            if (in_array($key, ['p', 'page_id', 'post', 'post_id', 'paged', 'page', 's', 'search', 'orderby', 'order'])) {
                continue;
            }
            
            // Check if it's a filter parameter
            if (in_array($key, $public_taxonomies) || 
                $key === 'keyword' || 
                strpos($key, 'meta_') === 0 ||
                $key === 'price_min' || $key === 'price_max' ||
                $key === 'date_start' || $key === 'date_end' ||
                $key === 'author') {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Allow filter query vars in WordPress request parsing
     * Prevents WordPress from treating filter parameters as invalid
     *
     * @param array $query_vars The query vars array
     * @return array Modified query vars
     */
    public function allowFilterQueryVars(array $query_vars): array
    {
        // Get all public taxonomies
        $public_taxonomies = get_taxonomies(['public' => true], 'names');
        
        // Add taxonomy filter query vars
        foreach ($public_taxonomies as $taxonomy) {
            $query_vars[] = $taxonomy;
        }
        
        // Add other filter query vars
        $query_vars[] = 'keyword';
        $query_vars[] = 'price_min';
        $query_vars[] = 'price_max';
        $query_vars[] = 'date_start';
        $query_vars[] = 'date_end';
        $query_vars[] = 'author';
        
        // Add meta filter query vars (dynamic, but we can allow common patterns)
        foreach ($_GET as $key => $value) {
            if (strpos($key, 'meta_') === 0) {
                $query_vars[] = $key;
            }
        }
        
        return $query_vars;
    }
}

