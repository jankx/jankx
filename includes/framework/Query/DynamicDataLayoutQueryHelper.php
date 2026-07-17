<?php

/**
 * Dynamic Data Layout Query Helper
 *
 * Helper methods for building complex queries from block attributes
 * Follows Single Responsibility Principle
 *
 * @package Jankx\Query
 * @since 2.0.0
 */

namespace Jankx\Query;

use Jankx\Multilingual\MultilingualFactory;
use WP_Query;

class DynamicDataLayoutQueryHelper
{
    /**
     * Build query for 'default' preset
     *
     * @param array $attributes Block attributes
     * @param int $page Page number for pagination
     * @return WP_Query
     */
    public static function buildDefaultQuery(array $attributes, int $page = 1): WP_Query
    {
        global $wp_query;

        $postsPerPage = isset($attributes['postsPerPage']) ? (int)$attributes['postsPerPage'] : (get_option('posts_per_page') ?: 10);

        // ALWAYS recreate the query from query_vars to completely decouple from global $wp_query.
        // This prevents display slicing or looping from affecting $wp_query->posts or global states.
        if ($wp_query instanceof WP_Query) {
            $query_vars = $wp_query->query_vars;

            // Ensure we get enough posts as requested by the block
            $query_vars['posts_per_page'] = $postsPerPage;
            $query_vars['paged'] = $page;

            // If it's a singular page, we want to show posts of the same post type
            if (is_singular() && empty($query_vars['post_type'])) {
                $query_vars['post_type'] = get_post_type();
                unset($query_vars['p'], $query_vars['name'], $query_vars['pagename']);
            }

            // IMPORTANT: Remove posts from query_vars to prevent WP_Query from using pre-fetched posts
            // This ensures a fresh query is executed instead of reusing global $wp_query posts
            unset($query_vars['posts']);

            return new WP_Query($query_vars);
        }

        // Fallback - never return the global $wp_query directly
        return current_theme_supports('jankx') ? new WP_Query(['posts_per_page' => $postsPerPage]) : ($wp_query instanceof WP_Query ? clone $wp_query : new WP_Query(['posts_per_page' => $postsPerPage]));
    }

    /**
     * Build related posts query (same taxonomy)
     *
     * @param array $attributes Block attributes
     * @return array Modified attributes with tax_query for related posts
     */
    public static function buildRelatedQuery(array $attributes): array
    {
        if (!is_singular()) {
            return $attributes;
        }

        $current_post = get_queried_object();
        if (!$current_post || !isset($current_post->ID)) {
            return $attributes;
        }

        $post_type = $attributes['postType'] ?? 'post';
        $attributes['postNotIn'] = array_merge(
            $attributes['postNotIn'] ?? [],
            [$current_post->ID]
        );

        $taxonomies = get_object_taxonomies($post_type, 'objects');
        $tax_queries = [];

        foreach ($taxonomies as $taxonomy) {
            if (!$taxonomy->public) {
                continue;
            }

            $terms = get_the_terms($current_post->ID, $taxonomy->name);

            if ($terms && !is_wp_error($terms)) {
                $term_ids = array_map(function ($term) {
                    return $term->term_id;
                }, $terms);

                if (!empty($term_ids)) {
                    $tax_queries[] = [
                        'taxonomy' => $taxonomy->name,
                        'field' => 'term_id',
                        'terms' => $term_ids,
                        'operator' => 'IN',
                    ];
                }
            }
        }

        if (!empty($tax_queries)) {
            $existing_tax_query = $attributes['taxQuery'] ?? [];
            foreach ($tax_queries as $tq) {
                $existing_tax_query[] = $tq;
            }
            $attributes['taxQuery'] = $existing_tax_query;
        }

        return $attributes;
    }

    /**
     * Apply filters to attributes
     *
     * @param array $attributes Original block attributes
     * @param array $filters Filter parameters
     * @return array Modified attributes
     */
    public static function applyFiltersToAttributes(array $attributes, array $filters): array
    {
        if (empty($filters) || !is_array($filters)) {
            return $attributes;
        }

        // Override previous selections to avoid AND-ing impossible queries
        $tax_query_by_taxonomy = [];
        $meta_query = [];
        $author_in = [];

        foreach ($filters as $key => $value) {
            $taxonomy = get_taxonomy($key);
            if ($taxonomy) {
                $term_ids = is_array($value) ? $value : [$value];
                $term_ids = array_values(array_unique(array_map('intval', $term_ids)));
                if (empty($term_ids)) {
                    continue;
                }
                if (isset($tax_query_by_taxonomy[$key])) {
                    $existing = $tax_query_by_taxonomy[$key]['terms'] ?? [];
                    $tax_query_by_taxonomy[$key]['terms'] = array_values(array_unique(array_merge($existing, $term_ids)));
                } else {
                    $tax_query_by_taxonomy[$key] = [
                        'taxonomy' => $key,
                        'field' => 'term_id',
                        'terms' => $term_ids,
                        'operator' => 'IN',
                    ];
                }
                continue;
            }

            if ($key === 'keyword' && $value !== '') {
                $attributes['keyword'] = sanitize_text_field($value);
                continue;
            }

            if ($key === 'orderby' && $value !== '') {
                $mapped = self::mapWooCommerceOrderby($value);
                $attributes['orderBy'] = $mapped['orderBy'];
                if (!empty($mapped['metaKey'])) {
                    $attributes['metaKey'] = $mapped['metaKey'];
                }
                if (!empty($mapped['order'])) {
                    $attributes['order'] = $mapped['order'];
                }
                continue;
            }

            if ($key === 'order' && $value !== '') {
                $attributes['order'] = strtoupper(sanitize_text_field($value));
                continue;
            }

            if (strpos($key, 'meta_') === 0) {
                $meta_key = substr($key, 5);
                $meta_query[] = [
                    'key' => $meta_key,
                    'value' => sanitize_text_field($value),
                    'compare' => '=',
                ];
                continue;
            }

            if ($key === 'layout' && $value !== '') {
                $attributes['layout'] = sanitize_text_field($value);
                continue;
            }

            if ($key === 'author' && $value !== '') {
                $author_ids = is_array($value) ? $value : [$value];
                $author_in = array_merge($author_in, array_map('intval', $author_ids));
                continue;
            }

            // Switch post type when user selects via keyword filter radios
            if ($key === 'post_type') {
                $slug = is_string($value) ? sanitize_key($value) : '';
                if ($slug !== '') {
                    $allowed = true;
                    if (!empty($attributes['useMultiPostType']) && !empty($attributes['postTypes']) && is_array($attributes['postTypes'])) {
                        $allowed = in_array($slug, $attributes['postTypes'], true);
                    }
                    if ($allowed) {
                        $attributes['postType'] = $slug;
                    }
                }
                continue;
            }
        }

        if (!empty($tax_query_by_taxonomy)) {
            $attributes['taxQuery'] = array_values($tax_query_by_taxonomy);
        } else {
            unset($attributes['taxQuery']);
        }

        if (!empty($meta_query)) {
            $attributes['metaQuery'] = $meta_query;
        } else {
            unset($attributes['metaQuery']);
        }

        if (!empty($author_in)) {
            $attributes['authorIn'] = array_values(array_unique($author_in));
        } else {
            unset($attributes['authorIn']);
        }

        return $attributes;
    }

    /**
     * Get filters from URL
     *
     * @return array Filter values
     */
    public static function getFiltersFromUrl(): array
    {
        $filters = [];

        if (empty($_GET)) {
            return $filters;
        }

        $public_taxonomies = get_taxonomies(['public' => true], 'names');

        foreach ($_GET as $key => $value) {
            if (in_array($key, ['p', 'page_id', 'post', 'post_id', 'paged', 'page', 's', 'search'])) {
                continue;
            }

            if (in_array($key, $public_taxonomies)) {
                $term_ids = is_array($value) ? $value : array_filter(array_map('intval', explode(',', $value)));
                if (!empty($term_ids)) {
                    $filters[$key] = $term_ids;
                }
            } elseif ($key === 'keyword' && !empty($value)) {
                $filters['keyword'] = sanitize_text_field($value);
            } elseif ($key === 'orderby' && !empty($value)) {
                $filters['orderby'] = sanitize_text_field($value);
            } elseif ($key === 'order' && !empty($value)) {
                $filters['order'] = sanitize_text_field($value);
            }
        }

        return $filters;
    }

    /**
     * Apply query builder filter for query presets
     *
     * Allows packages to modify attributes based on query preset
     *
     * @param array $attributes Block attributes
     * @param string $queryPreset Query preset name
     * @return array Modified attributes
     */
    public static function applyQueryBuilderFilter(array $attributes, string $queryPreset): array
    {
        /**
         * Filter to allow packages to build query for specific presets
         *
         * @param array $attributes Block attributes
         * @param string $queryPreset Query preset name
         * @return array Modified attributes
         */
        return apply_filters('jankx/dynamic-data-layout/query-builder', $attributes, $queryPreset);
    }

    /**
     * Map WooCommerce orderby to standard orderby
     *
     * @param string $woocommerce_orderby WooCommerce orderby value
     * @return array Mapped orderby configuration
     */
    protected static function mapWooCommerceOrderby(string $woocommerce_orderby): array
    {
        $mapping = [
            'menu_order' => ['orderBy' => 'menu_order'],
            'popularity' => ['orderBy' => 'comment_count'], // WooCommerce uses this for popularity
            'rating' => ['orderBy' => 'meta_value_num', 'metaKey' => '_wc_average_rating'],
            'date' => ['orderBy' => 'date'],
            'price' => ['orderBy' => 'meta_value_num', 'metaKey' => '_price', 'order' => 'ASC'],
            'price-desc' => ['orderBy' => 'meta_value_num', 'metaKey' => '_price', 'order' => 'DESC'],
        ];

        return $mapping[$woocommerce_orderby] ?? ['orderBy' => $woocommerce_orderby];
    }
}
