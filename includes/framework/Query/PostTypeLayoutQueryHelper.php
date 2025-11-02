<?php

/**
 * Post Type Layout Query Helper
 *
 * Helper methods for building complex queries from block attributes
 * Follows Single Responsibility Principle
 *
 * @package Jankx\Query
 * @since 1.0.0
 */

namespace Jankx\Query;

use Jankx\Multilingual\MultilingualFactory;
use WP_Query;

class PostTypeLayoutQueryHelper
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
        $query_args = $wp_query->query_vars;
        
        if (!empty($attributes['postsPerPage'])) {
            $query_args['posts_per_page'] = intval($attributes['postsPerPage']);
        }
        $query_args['paged'] = $page;

        if (!empty($attributes['orderBy'])) {
            $query_args['orderby'] = sanitize_key($attributes['orderBy']);
        }
        if (!empty($attributes['order'])) {
            $query_args['order'] = strtoupper(sanitize_key($attributes['order']));
        }

        if (!empty($attributes['metaKey']) && in_array($attributes['orderBy'], ['meta_value', 'meta_value_num'])) {
            $query_args['meta_key'] = sanitize_key($attributes['metaKey']);
            if (!empty($attributes['metaType'])) {
                $query_args['meta_type'] = $attributes['metaType'];
            }
        }

        if (!empty($attributes['_current_language'])) {
            $query_args = MultilingualFactory::addLanguageToQueryArgs($query_args, $attributes['_current_language']);
        }

        return new WP_Query($query_args);
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
        if (!empty($filters) && is_array($filters)) {
            $tax_query = $attributes['taxQuery'] ?? [];

            foreach ($filters as $key => $value) {
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
                } elseif ($key === 'orderby' && !empty($value)) {
                    $mapped = self::mapWooCommerceOrderby($value);
                    $attributes['orderBy'] = $mapped['orderBy'];
                    if (!empty($mapped['metaKey'])) {
                        $attributes['metaKey'] = $mapped['metaKey'];
                    }
                    if (!empty($mapped['order'])) {
                        $attributes['order'] = $mapped['order'];
                    }
                } elseif ($key === 'order' && !empty($value)) {
                    $attributes['order'] = strtoupper(sanitize_text_field($value));
                } elseif (strpos($key, 'meta_') === 0) {
                    $meta_key = substr($key, 5);
                    $meta_query = $attributes['metaQuery'] ?? [];
                    $meta_query[] = [
                        'key' => $meta_key,
                        'value' => sanitize_text_field($value),
                        'compare' => '=',
                    ];
                    $attributes['metaQuery'] = $meta_query;
                } elseif ($key === 'author' && !empty($value)) {
                    $author_ids = is_array($value) ? $value : [$value];
                    $attributes['authorIn'] = array_merge(
                        $attributes['authorIn'] ?? [],
                        array_map('intval', $author_ids)
                    );
                }
            }

            if (!empty($tax_query)) {
                $attributes['taxQuery'] = $tax_query;
            }
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

