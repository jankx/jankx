<?php

/**
 * Post Layout Block
 *
 * A flexible collection block that can display any post type with customizable
 * queries, filters, templates, and styling options.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */

namespace Jankx\Gutenberg\Blocks;

use Jankx\Facades\Log;
use Jankx\Gutenberg\Block;
use Jankx\Template\Template;
use Jankx\PostLayout\PostLayoutManager;
use Jankx\Jankx;
use Exception;

class PostTypeLayoutBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/post-layout';

    /**
     * Register the block
     *
     * @return void
     */
    public function init()
    {
        add_action('rest_api_init', [$this, 'registerRestEndpoints']);
        add_action('admin_head', [$this, 'setupSupportedPostLayouts'], 5);
    }


    public function setupSupportedPostLayouts() {
        $layouts = PostLayoutManager::getLayouts(['field' => 'names']);
        ?>
        <script>
            window.jankxSupportedPostLayouts = <?php echo wp_json_encode($layouts, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP); ?>;
        </script>
        <?php
    }

    /**
     * Register REST API endpoints
     *
     * @return void
     */
    public function registerRestEndpoints()
    {
        register_rest_route('jankx/v1', '/post-layout/(?P<id>[a-zA-Z0-9-]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'getCollectionData'],
            'permission_callback' => '__return_true',
            'args' => [
                'id' => [
                    'validate_callback' => function ($param) {
                        return !empty($param);
                    }
                ]
            ]
        ]);

        register_rest_route('jankx/v1', '/post-layout/filters', [
            'methods' => 'GET',
            'callback' => [$this, 'getAvailableFilters'],
            'permission_callback' => '__return_true'
        ]);
    }

    /**
     * Get collection data via REST API
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function getCollectionData($request)
    {
        $blockId = $request->get_param('id');

        // Get block configuration from post content
        $config = $this->getBlockConfig($blockId);

        if (!$config) {
            return new \WP_REST_Response(['error' => 'Block not found'], 404);
        }

        // Build query based on configuration
        $query = $this->buildQuery($config);

        // Get posts
        $posts = $query->get_posts();

        // Format response
        $formattedPosts = array_map([$this, 'formatPost'], $posts);

        return new \WP_REST_Response([
            'success' => true,
            'data' => [
                'posts' => $formattedPosts,
                'total' => $query->found_posts,
                'maxPages' => $query->max_num_pages,
                'config' => $config
            ]
        ]);
    }

    /**
     * Get block configuration from post content
     *
     * @param string $blockId
     * @return array|null
     */
    protected function getBlockConfig($blockId)
    {
        // Parse block ID to get post ID and block index
        $parts = explode('-', $blockId);
        if (count($parts) < 2) {
            return null;
        }

        $postId = intval($parts[0]);
        $blockIndex = intval($parts[1]);

        $post = get_post($postId);
        if (!$post) {
            return null;
        }

        // Parse blocks from post content
        $blocks = parse_blocks($post->post_content);

        if (isset($blocks[$blockIndex]) && $blocks[$blockIndex]['blockName'] === 'jankx/post-layout') {
            return $blocks[$blockIndex]['attrs'] ?: [];
        }

        return null;
    }

    /**
     * Get available filters for a post type
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function getAvailableFilters($request)
    {
        $postType = $request->get_param('post_type') ?: 'post';

        $filters = [
            'taxonomies' => $this->getTaxonomiesForPostType($postType),
            'meta_fields' => $this->getMetaFieldsForPostType($postType),
            'preset_filters' => $this->getPresetFilters(),
            'custom_filters' => $this->getCustomFilters()
        ];

        return new \WP_REST_Response([
            'success' => true,
            'data' => $filters
        ]);
    }

    /**
     * Build WP_Query based on configuration
     *
     * @param array $config
     * @return \WP_Query
     */
    protected function buildQuery($config)
    {
        $orderBy = $config['orderBy'] ?: 'date';

        $args = [
            'post_type' => $config['postType'] ?: 'post',
            'posts_per_page' => $config['postsPerPage'] ?: 12,
            'orderby' => $orderBy,
            'order' => $config['order'] ?: 'DESC',
            'offset' => $config['offset'] ?: 0,
            'post_status' => 'publish'
        ];

        // Handle special orderby cases
        if ($orderBy === 'views') {
            $args['orderby'] = 'meta_value_num';
            $args['meta_key'] = 'post_views_count';
        }

        // Handle include/exclude
        if (!empty($config['include'])) {
            $args['post__in'] = $config['include'];
        }

        if (!empty($config['exclude'])) {
            $args['post__not_in'] = $config['exclude'];
        }

        // Build taxonomy query
        if (!empty($config['taxonomyFilters'])) {
            $taxQuery = $this->buildTaxonomyQuery($config['taxonomyFilters']);
            if ($taxQuery) {
                $args['tax_query'] = $taxQuery;
            }
        }

        // Build meta query
        if (!empty($config['metaFilters'])) {
            $metaQuery = $this->buildMetaQuery($config['metaFilters']);
            if ($metaQuery) {
                $args['meta_query'] = $metaQuery;
            }
        }

        // Apply preset filters
        if (!empty($config['presetFilters'])) {
            $this->applyPresetFilters($args, $config['presetFilters']);
        }

        // Apply custom filters
        if (!empty($config['customFilters'])) {
            $this->applyCustomFilters($args, $config['customFilters']);
        }

        return new \WP_Query($args);
    }

    /**
     * Build taxonomy query
     *
     * @param array $filters
     * @return array|null
     */
    protected function buildTaxonomyQuery($filters)
    {
        $taxQueries = [];

        foreach ($filters as $filter) {
            if (empty($filter['taxonomy']) || empty($filter['terms'])) {
                continue;
            }

            $taxQueries[] = [
                'taxonomy' => $filter['taxonomy'],
                'field' => 'slug',
                'terms' => $filter['terms'],
                'operator' => $filter['operator'] ?: 'IN',
                'include_children' => $filter['includeChildren'] ?? true
            ];
        }

        return !empty($taxQueries) ? $taxQueries : null;
    }

    /**
     * Build meta query
     *
     * @param array $filters
     * @return array|null
     */
    protected function buildMetaQuery($filters)
    {
        $metaQueries = [];

        foreach ($filters as $filter) {
            if (empty($filter['key'])) {
                continue;
            }

            $metaQuery = [
                'key' => $filter['key'],
                'compare' => $filter['compare'] ?: '=',
                'type' => $filter['type'] ?: 'CHAR'
            ];

            if (!empty($filter['value'])) {
                $metaQuery['value'] = $filter['value'];
            }

            $metaQueries[] = $metaQuery;
        }

        return !empty($metaQueries) ? $metaQueries : null;
    }

    /**
     * Apply preset filters
     *
     * @param array $args
     * @param array $presets
     * @return void
     */
    protected function applyPresetFilters(&$args, $presets)
    {
        foreach ($presets as $preset) {
            switch ($preset) {
                case 'featured':
                    $args['meta_query'][] = [
                        'key' => '_is_featured',
                        'value' => '1',
                        'compare' => '='
                    ];
                    break;

                case 'popular':
                    // Sort by views if available, fallback to comment count
                    $args['orderby'] = 'meta_value_num';
                    $args['meta_key'] = 'post_views_count';
                    break;

                case 'recent':
                    $args['orderby'] = 'date';
                    break;

                case 'trending':
                    // Custom logic for trending posts
                    $this->applyTrendingLogic($args);
                    break;

                case 'editor_picks':
                    $args['meta_query'][] = [
                        'key' => '_editor_pick',
                        'value' => '1',
                        'compare' => '='
                    ];
                    break;
            }
        }
    }

    /**
     * Apply custom filters
     *
     * @param array $args
     * @param array $filters
     * @return void
     */
    protected function applyCustomFilters(&$args, $filters)
    {
        foreach ($filters as $filter) {
            if (!empty($filter['callback']) && function_exists($filter['callback'])) {
                $parameters = $filter['parameters'] ?: [];
                $filter['callback']($args, $parameters);
            }
        }
    }

    /**
     * Apply trending logic for posts
     *
     * @param array $args
     * @return void
     */
    protected function applyTrendingLogic(&$args)
    {
        // Simple trending logic: order by comment count and recent activity
        $args['orderby'] = 'comment_count';
        $args['meta_query'][] = [
            'relation' => 'OR',
            [
                'key' => '_trending_score',
                'value' => '0',
                'compare' => '>'
            ],
            [
                'key' => '_trending_score',
                'compare' => 'NOT EXISTS'
            ]
        ];
    }

    /**
     * Get taxonomies for a post type
     *
     * @param string $postType
     * @return array
     */
    protected function getTaxonomiesForPostType($postType)
    {
        $taxonomies = get_object_taxonomies($postType, 'objects');
        $formatted = [];

        foreach ($taxonomies as $taxonomy) {
            $terms = get_terms([
                'taxonomy' => $taxonomy->name,
                'hide_empty' => false
            ]);

            $formatted[] = [
                'name' => $taxonomy->name,
                'label' => $taxonomy->label,
                'terms' => array_map(function ($term) {
                    return [
                        'slug' => $term->slug,
                        'name' => $term->name,
                        'count' => $term->count
                    ];
                }, $terms)
            ];
        }

        return $formatted;
    }

    /**
     * Get meta fields for a post type
     *
     * @param string $postType
     * @return array
     */
    protected function getMetaFieldsForPostType($postType)
    {
        // This would typically come from a custom fields plugin or theme options
        // For now, return common meta fields
        return [
            'date' => __('Date', 'jankx'),
            'author' => __('Author', 'jankx'),
            'categories' => __('Categories', 'jankx'),
            'tags' => __('Tags', 'jankx'),
            'comments' => __('Comments Count', 'jankx'),
            'reading_time' => __('Reading Time', 'jankx')
        ];
    }

    /**
     * Get preset filters
     *
     * @return array
     */
    protected function getPresetFilters()
    {
        return [
            'featured' => __('Featured Posts', 'jankx'),
            'popular' => __('Popular Posts', 'jankx'),
            'recent' => __('Recent Posts', 'jankx'),
            'trending' => __('Trending Posts', 'jankx'),
            'editor_picks' => __('Editor Picks', 'jankx')
        ];
    }

    /**
     * Get custom filters
     *
     * @return array
     */
    protected function getCustomFilters()
    {
        // This would return filters registered by themes/plugins
        return apply_filters('jankx_dynamic_collection_custom_filters', []);
    }

    /**
     * Format post for response
     *
     * @param \WP_Post $post
     * @return array
     */
    protected function formatPost($post)
    {
        return [
            'ID' => $post->ID,
            'title' => get_the_title($post),
            'excerpt' => get_the_excerpt($post),
            'content' => get_the_content(null, false, $post),
            'permalink' => get_permalink($post),
            'featured_image' => get_the_post_thumbnail_url($post, 'medium'),
            'date' => get_the_date('', $post),
            'author' => get_the_author_meta('display_name', $post->post_author),
            'categories' => wp_get_post_categories($post->ID, ['fields' => 'names']),
            'tags' => wp_get_post_tags($post->ID, ['fields' => 'names']),
            'comment_count' => get_comments_number($post->ID)
        ];
    }

    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    /**
     * Get PostLayout class based on layout name
     *
     * @param string $layoutName
     * @return string
     */
    protected function getPostLayoutClass($layoutName)
    {
        $layoutMap = PostLayoutManager::getLayouts();

        return $layoutMap[$layoutName] ?? \Jankx\PostLayout\Layout\Grid::class;
    }

    public function render($attributes, $content = '')
    {
        // Parse block attributes
        $postType = isset($attributes['postType']) ? $attributes['postType'] : 'post';
        $styling = isset($attributes['styling']) && is_array($attributes['styling']) ? $attributes['styling'] : array();
        $layoutName = isset($styling['viewType']) ? $styling['viewType'] : 'grid';
        $perPage = isset($attributes['postsPerPage']) ? intval($attributes['postsPerPage']) : 6;

        // Parse styling attributes
        $columns = isset($styling['columns']) ? intval($styling['columns']) : 3;
        $gap = isset($styling['gap']) ? $styling['gap'] : 'medium';
        $showExcerpt = isset($styling['showExcerpt']) ? $styling['showExcerpt'] : true;
        $showDate = isset($styling['showDate']) ? $styling['showDate'] : true;
        $showAuthor = isset($styling['showAuthor']) ? $styling['showAuthor'] : false;
        $showCategories = isset($styling['showCategories']) ? $styling['showCategories'] : false;
        $showReadMore = isset($styling['showReadMore']) ? $styling['showReadMore'] : true;
        $thumbnailPosition = isset($styling['thumbnailPosition']) ? $styling['thumbnailPosition'] : 'top';
        $thumbnailSize = isset($styling['thumbnailSize']) ? $styling['thumbnailSize'] : 'medium';

        // Parse query attributes
        $orderBy = isset($attributes['orderBy']) ? $attributes['orderBy'] : 'date';
        $order = isset($attributes['order']) ? $attributes['order'] : 'DESC';
        $offset = isset($attributes['offset']) ? intval($attributes['offset']) : 0;
        $category = isset($attributes['category']) ? $attributes['category'] : '';
        $tag = isset($attributes['tag']) ? $attributes['tag'] : '';
        $author = isset($attributes['author']) ? $attributes['author'] : '';
        $excludePosts = isset($attributes['excludePosts']) ? $attributes['excludePosts'] : '';
        $includePosts = isset($attributes['includePosts']) ? $attributes['includePosts'] : '';

        // Get engine ID
        $engineId = Jankx::getEngineId();
        $wrapId = 'jankx-post-layout-' . wp_generate_uuid4();

        try {
            // Get template engine
            $templateEngine = \Jankx\Facades\App::make('template.engine.' . $engineId);

            // Get PostLayoutManager instance from container
            $jankxApp = \Jankx\Foundation\Application::getInstance();
            $postLayoutManager = $jankxApp->make('postlayout.manager');

            // Create WP_Query
            $queryArgs = [
                'post_type' => $postType,
                'posts_per_page' => $perPage,
                'post_status' => 'publish',
            ];

            // Add ordering if specified
            $orderByValue = $attributes['orderBy'] ?? 'date';

            if ($orderByValue === 'views') {
                // Sort by post views count
                $queryArgs['orderby'] = 'meta_value_num';
                $queryArgs['meta_key'] = 'post_views_count';
            } else {
                $queryArgs['orderby'] = $orderByValue;
            }

            if (isset($attributes['order'])) {
                $queryArgs['order'] = $attributes['order'];
            }
            if (isset($attributes['offset'])) {
                $queryArgs['offset'] = $attributes['offset'];
            }

            // Apply same filters as PostsFetcher for consistency
            do_action("jankx/posts/fetcher/{$postType}/query/start", $queryArgs, $this);

            // Allow filtering the query args
            $queryArgs = apply_filters(
                "jankx/layout/{$postType}/args",
                $queryArgs,
                $attributes,
                null, // data_preset
                $this
            );

            // Allow custom WP_Query
            $wp_query = apply_filters("jankx/posts/fetcher/{$postType}/query", null, $queryArgs, $this);
            if (is_null($wp_query)) {
                $wp_query = new \WP_Query($queryArgs);
            }

            do_action("jankx/posts/fetcher/{$postType}/query/end", $queryArgs, $this);

            // Get layout template
            $loopItemLayoutType = apply_filters("jankx/posts/fetcher/{$postType}/content_layout", null);

            // If no layout type, use default based on post type
            if (!$loopItemLayoutType) {
                $loopItemLayoutType = 'default';
            }

            try {
                $loopItemLayout = $postLayoutManager->getLoopItemContentByType($loopItemLayoutType);
            } catch (\InvalidArgumentException $e) {
                return sprintf(
                    '<div class="jankx-post-layout-error">%s</div>',
                    esc_html__('Failed to get loop item layout: ' . $e->getMessage(), 'jankx')
                );
            }

            // Fallback: create DefaultContent directly if manager returns null
            if (!$loopItemLayout) {
                $loopItemLayout = new \Jankx\PostLayout\LoopItemContent\DefaultContent();
            }

            // Create PostLayout and render based on layout type
            $postLayoutClass = $this->getPostLayoutClass($layoutName);
            $postLayout = new $postLayoutClass($wp_query, $loopItemLayout);
            $postLayout->setTemplateEngine($templateEngine);

            // Set pagination options
            $paginationOptions = [];
            if (isset($attributes['pagination']['enabled']) && $attributes['pagination']['enabled']) {
                $paginationOptions['show_paginate'] = true;
                $paginationOptions['pagination_type'] = $attributes['pagination']['type'] ?? 'numbers';
                // Thêm các options khác nếu cần
                if (isset($attributes['pagination']['maxNumbers'])) {
                    $paginationOptions['max_numbers'] = $attributes['pagination']['maxNumbers'];
                }
                if (isset($attributes['pagination']['prevText'])) {
                    $paginationOptions['prev_text'] = $attributes['pagination']['prevText'];
                }
                if (isset($attributes['pagination']['nextText'])) {
                    $paginationOptions['next_text'] = $attributes['pagination']['nextText'];
                }
            }

            // Set display options
            $displayOptions = [];
            if (isset($attributes['displayOptions'])) {
                $displayOptions = [
                    'show_title' => $attributes['displayOptions']['showTitle'] ?? true,
                    'show_excerpt' => $attributes['displayOptions']['showExcerpt'] ?? true,
                    'show_meta' => $attributes['displayOptions']['showMeta'] ?? true,
                    'show_thumbnail' => $attributes['displayOptions']['showThumbnail'] ?? true,
                    'show_read_more' => $attributes['displayOptions']['showReadMore'] ?? true,
                    'excerpt_length' => $attributes['displayOptions']['excerptLength'] ?? 20,
                    'meta_fields' => $attributes['displayOptions']['metaFields'] ?? ['date', 'author', 'categories'],
                ];
            }

            // Set styling options
            $stylingOptions = [];
            if (isset($attributes['styling'])) {
                if (isset($attributes['styling']['hoverEffect'])) {
                    $stylingOptions['hover_effect'] = $attributes['styling']['hoverEffect'];
                }
                if (isset($attributes['styling']['borderRadius'])) {
                    $stylingOptions['border_radius'] = $attributes['styling']['borderRadius'];
                }
                if (isset($attributes['styling']['shadow'])) {
                    $stylingOptions['shadow'] = $attributes['styling']['shadow'];
                }
            }

            // Set layout options
            $layoutOptions = [];
            if (isset($attributes['layout'])) {
                if (isset($attributes['layout']['columns'])) {
                    $layoutOptions['columns'] = $attributes['layout']['columns'];
                }
                if (isset($attributes['layout']['columnsTablet'])) {
                    $layoutOptions['columns_tablet'] = $attributes['layout']['columnsTablet'];
                }
                if (isset($attributes['layout']['columnsMobile'])) {
                    $layoutOptions['columns_mobile'] = $attributes['layout']['columnsMobile'];
                }
                if (isset($attributes['layout']['gap'])) {
                    $layoutOptions['gap'] = $attributes['layout']['gap'];
                }
            }

            $allOptions = array_merge([
                'thumbnail_position' => 'top',
                'thumbnail_size' => 'medium',
            ], $paginationOptions, $displayOptions, $stylingOptions, $layoutOptions);

            $postLayout->setOptions($allOptions);

            $renderedContent = $postLayout->render(false);


            return $renderedContent;
        } catch (Exception $e) {
            Log::error($e->getMessage());
            // Fallback: return empty container
            return sprintf('<div id="%s" class="jankx-post-layout" data-engine-id="%s">%s</div>',
                esc_attr($wrapId),
                esc_attr($engineId),
                '<div class="jankx-post-layout-error">' . esc_html__('Failed to render content: ' . $e->getMessage(), 'jankx') . '</div>'
            );
        }
    }
}
