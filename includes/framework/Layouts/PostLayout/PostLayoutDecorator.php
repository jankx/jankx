<?php

namespace Jankx\Layouts\PostLayout;

use Jankx\Layouts\PostLayout\Contracts\PostLayoutInterface;
use Jankx\Facades\Jankx;
use Jankx\Facades\Log;
use WP_Query;

/**
 * Post Layout Decorator
 *
 * Decorator pattern để set options từ block attributes vào layout
 *
 * @package Jankx\Layouts\PostLayout
 */
class PostLayoutDecorator
{
    /**
     * Layout instance
     *
     * @var PostLayoutInterface
     */
    protected $layout;

    /**
     * Constructor
     *
     * @param PostLayoutInterface $layout
     */
    public function __construct(PostLayoutInterface $layout)
    {
        $this->layout = $layout;
    }

    /**
     * Set options từ block attributes
     *
     * @param array $attributes Block attributes từ Gutenberg
     * @return self
     */
    public function withAttributes(array $attributes): self
    {
        // Map block attributes to layout options
        $options = [
            'columns' => $attributes['columns'] ?? 3,
            'showFeaturedImage' => $attributes['showFeaturedImage'] ?? true,
            'showTitle' => $attributes['showTitle'] ?? true,
            'showExcerpt' => $attributes['showExcerpt'] ?? true,
            'showDate' => $attributes['showDate'] ?? true,
            'showAuthor' => $attributes['showAuthor'] ?? false,
            'postsPerPage' => $attributes['postsPerPage'] ?? 10,
            'excerptLength' => $attributes['excerptLength'] ?? 55,
        ];

        $this->layout->setOptions($options);

        // Set excerpt length filter if specified
        if (isset($attributes['excerptLength']) && !empty($attributes['showExcerpt'])) {
            add_filter('excerpt_length', function() use ($attributes) {
                return intval($attributes['excerptLength']);
            }, 999);
        }

        return $this;
    }

    /**
     * Set query
     *
     * @param WP_Query $query
     * @return self
     */
    public function withQuery(WP_Query $query): self
    {
        $this->layout->setQuery($query);
        return $this;
    }

    /**
     * Build query từ block attributes
     *
     * @param array $attributes
     * @return WP_Query
     */
    public function buildQuery(array $attributes): WP_Query
    {
        $orderby = $attributes['orderBy'] ?? 'date';
        $order = $attributes['order'] ?? 'DESC';
        
        // Add ID as secondary ordering to ensure consistent order when primary values are same
        // This prevents posts from "jumping" positions between queries
        if ($orderby !== 'rand' && $orderby !== 'none') {
            // Use array syntax for multi-column sorting
            $orderby = [$orderby => $order, 'ID' => 'DESC'];
            // Don't set 'order' param when using array orderby
            $order = null;
        }
        
        $args = [
            'post_type' => $attributes['postType'] ?? 'post',
            'posts_per_page' => $attributes['postsPerPage'] ?? 10,
            'orderby' => $orderby,
            'post_status' => 'publish',
        ];

        // Only set 'order' if orderby is not array (string orderby)
        if ($order !== null) {
            $args['order'] = $order;
        }

        // Debug log: Initial query args
        Log::warning('PostLayoutDecorator::buildQuery - Initial args', [
            'orderby' => $orderby,
            'order' => $args['order'] ?? 'using array orderby',
            'post_type' => $args['post_type'],
            'posts_per_page' => $args['posts_per_page'],
        ]);

        // Add pagination if specified (for AJAX load more)
        if (isset($attributes['_internal_paged']) && $attributes['_internal_paged'] > 0) {
            $args['paged'] = intval($attributes['_internal_paged']);
        }

        // Add offset if specified
        if (isset($attributes['offset']) && $attributes['offset'] > 0) {
            $args['offset'] = intval($attributes['offset']);
        }

        // Handle post status
        if (!empty($attributes['postStatus']) && is_array($attributes['postStatus'])) {
            $args['post_status'] = $attributes['postStatus'];
        }

        // Handle meta key and type for ordering
        if (!empty($attributes['metaKey']) && in_array($attributes['orderBy'], ['meta_value', 'meta_value_num'])) {
            $args['meta_key'] = sanitize_key($attributes['metaKey']);

            if (!empty($attributes['metaType'])) {
                $args['meta_type'] = $attributes['metaType'];
            }
            
            // Ensure consistent ordering when meta values are same
            // Override orderby to add ID as secondary sort
            $meta_orderby = $attributes['orderBy'];
            $args['orderby'] = [$meta_orderby => $attributes['order'] ?? 'DESC', 'ID' => 'DESC'];
            
            // Remove 'order' param when using array orderby
            unset($args['order']);

            // Debug log: Meta value ordering
            if (defined('JANKX_LOG_ALL') && \JANKX_LOG_ALL) {
                Jankx::log()->debug('PostLayoutDecorator::buildQuery - Meta value ordering', [
                    'meta_key' => $args['meta_key'],
                    'meta_type' => $args['meta_type'] ?? 'not set',
                    'orderby' => $args['orderby'],
                ]);
            }
        }

        // Handle post parent filters
        if (isset($attributes['postParent']) && $attributes['postParent'] > 0) {
            $args['post_parent'] = intval($attributes['postParent']);
        }
        if (!empty($attributes['postParentIn']) && is_array($attributes['postParentIn'])) {
            $args['post_parent__in'] = array_map('intval', $attributes['postParentIn']);
        }
        if (!empty($attributes['postParentNotIn']) && is_array($attributes['postParentNotIn'])) {
            $args['post_parent__not_in'] = array_map('intval', $attributes['postParentNotIn']);
        }

        // Handle keyword search
        if (!empty($attributes['keyword'])) {
            $args['s'] = sanitize_text_field($attributes['keyword']);
        }

        // Handle author filters
        if (!empty($attributes['authorIn']) && is_array($attributes['authorIn'])) {
            $args['author__in'] = array_map('intval', $attributes['authorIn']);
        }
        if (!empty($attributes['authorNotIn']) && is_array($attributes['authorNotIn'])) {
            $args['author__not_in'] = array_map('intval', $attributes['authorNotIn']);
        }

        // Handle post ID filters
        if (!empty($attributes['postIn']) && is_array($attributes['postIn'])) {
            $args['post__in'] = array_map('intval', $attributes['postIn']);
        }
        if (!empty($attributes['postNotIn']) && is_array($attributes['postNotIn'])) {
            $args['post__not_in'] = array_map('intval', $attributes['postNotIn']);
        }

        // Handle taxonomy query
        if (!empty($attributes['taxQuery']) && is_array($attributes['taxQuery'])) {
            $tax_query = [];
            foreach ($attributes['taxQuery'] as $tax_item) {
                if (empty($tax_item['taxonomy'])) {
                    continue;
                }

                // Validate operator
                $allowed_operators = ['IN', 'NOT IN', 'AND', 'EXISTS', 'NOT EXISTS'];
                $operator = in_array($tax_item['operator'], $allowed_operators) ? $tax_item['operator'] : 'IN';

                $tax_query_item = [
                    'taxonomy' => sanitize_key($tax_item['taxonomy']),
                    'operator' => $operator,
                ];

                // Only add terms if operator is not EXISTS/NOT EXISTS
                if (!in_array($operator, ['EXISTS', 'NOT EXISTS'])) {
                    if (empty($tax_item['terms'])) {
                        continue; // Skip if no terms for non-EXISTS operators
                    }
                    $tax_query_item['field'] = 'term_id';
                    $tax_query_item['terms'] = array_map('intval', $tax_item['terms']);
                }

                $tax_query[] = $tax_query_item;
            }

            if (!empty($tax_query)) {
                $args['tax_query'] = $tax_query;
            }
        }

        // Handle meta query
        if (!empty($attributes['metaQuery']) && is_array($attributes['metaQuery'])) {
            $meta_query = [];
            foreach ($attributes['metaQuery'] as $meta_item) {
                if (empty($meta_item['key'])) {
                    continue;
                }

                $meta_query_item = [
                    'key' => sanitize_key($meta_item['key']),
                ];

                // Add value if exists (not for EXISTS/NOT EXISTS)
                if (isset($meta_item['value']) && !in_array($meta_item['compare'], ['EXISTS', 'NOT EXISTS'])) {
                    $meta_query_item['value'] = sanitize_text_field($meta_item['value']);
                }

                // Add compare operator
                $allowed_compare = ['=', '!=', '>', '>=', '<', '<=', 'LIKE', 'NOT LIKE', 'IN', 'NOT IN', 'EXISTS', 'NOT EXISTS'];
                $meta_query_item['compare'] = in_array($meta_item['compare'], $allowed_compare) ? $meta_item['compare'] : '=';

                // Add type if specified
                if (!empty($meta_item['type'])) {
                    $allowed_types = ['NUMERIC', 'BINARY', 'CHAR', 'DATE', 'DATETIME', 'DECIMAL', 'SIGNED', 'TIME', 'UNSIGNED'];
                    if (in_array($meta_item['type'], $allowed_types)) {
                        $meta_query_item['type'] = $meta_item['type'];
                    }
                }

                $meta_query[] = $meta_query_item;
            }

            if (!empty($meta_query)) {
                $args['meta_query'] = $meta_query;
            }
        }

        // Handle pagination if enabled
        if (!empty($attributes['enablePagination'])) {
            $paged = get_query_var('paged') ? get_query_var('paged') : 1;
            $args['paged'] = $paged;

            // Adjust offset for pagination
            if (isset($args['offset']) && $paged > 1) {
                $args['offset'] = $args['offset'] + ($args['posts_per_page'] * ($paged - 1));
            }
        }

        // Apply language filter to query args (for multilingual support)
        if (!empty($attributes['_current_language'])) {
            $args = \Jankx\Multilingual\MultilingualFactory::addLanguageToQueryArgs(
                $args,
                $attributes['_current_language']
            );

            // Debug log: Language filter applied
            if (defined('JANKX_LOG_ALL') && JANKX_LOG_ALL) {
                Jankx::log()->debug('PostLayoutDecorator::buildQuery - Language filter applied', [
                    'language' => $attributes['_current_language'],
                    'lang_args' => array_diff_key($args, ['post_type' => '', 'posts_per_page' => '', 'orderby' => '', 'order' => '']),
                ]);
            }
        }

        // Apply filters to allow customization
        $args = apply_filters('jankx/post-layout/query-args', $args, $attributes);
        $args = apply_filters('jankx/post-layout/query-args/' . $this->layout->getName(), $args, $attributes);

        // Apply custom query ID filter if specified
        if (!empty($attributes['customQueryId'])) {
            $custom_query_id = sanitize_key($attributes['customQueryId']);
            $args = apply_filters('jankx/post-layout/query-args/' . $custom_query_id, $args, $attributes);
        }

        // Debug log: Final query args before WP_Query
        if (defined('JANKX_LOG_ALL') && \JANKX_LOG_ALL) {
            Jankx::log()->debug('PostLayoutDecorator::buildQuery - Final query args', [
                'orderby' => $args['orderby'],
                'order' => $args['order'] ?? 'using array orderby',
                'post_type' => $args['post_type'],
                'posts_per_page' => $args['posts_per_page'],
                'has_tax_query' => !empty($args['tax_query']),
                'has_meta_query' => !empty($args['meta_query']),
                'has_meta_key' => !empty($args['meta_key']),
            ]);
        }

        return new WP_Query($args);
    }

    /**
     * Render layout
     *
     * @return string
     */
    public function render(): string
    {
        return $this->layout->render();
    }

    /**
     * Render preview
     *
     * @return array
     */
    public function renderPreview(): array
    {
        return $this->layout->renderPreview();
    }

    /**
     * Get layout instance
     *
     * @return PostLayoutInterface
     */
    public function getLayout(): PostLayoutInterface
    {
        return $this->layout;
    }
}
