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
        $args = [
            'post_type' => $config['postType'] ?: 'post',
            'posts_per_page' => $config['postsPerPage'] ?: 12,
            'orderby' => $config['orderBy'] ?: 'date',
            'order' => $config['order'] ?: 'DESC',
            'offset' => $config['offset'] ?: 0,
            'post_status' => 'publish'
        ];

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
                    $args['orderby'] = 'comment_count';
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
        $layoutMap = [
            'grid' => \Jankx\PostLayout\Layout\Grid::class,
            'card' => \Jankx\PostLayout\Layout\Card::class,
            'list' => \Jankx\PostLayout\Layout\ListLayout::class,
            'carousel' => \Jankx\PostLayout\Layout\Carousel::class,
            'tabs' => \Jankx\PostLayout\Layout\Tabs::class,
            'preset1' => \Jankx\PostLayout\Layout\Preset1::class,
            'preset2' => \Jankx\PostLayout\Layout\Preset2::class,
            'preset4' => \Jankx\PostLayout\Layout\Preset4::class,
            'preset6' => \Jankx\PostLayout\Layout\Preset6::class,
        ];

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

        // Debug logging
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log("[PostTypeLayoutBlock Debug] Rendering block on frontend");
            error_log("[PostTypeLayoutBlock Debug] Post type: " . $postType);
            error_log("[PostTypeLayoutBlock Debug] Layout: " . $layoutName);
            error_log("[PostTypeLayoutBlock Debug] Columns: " . $columns);
            error_log("[PostTypeLayoutBlock Debug] Per page: " . $perPage);
            error_log("[PostTypeLayoutBlock Debug] Engine ID: " . $engineId);
            error_log("[PostTypeLayoutBlock Debug] Order by: " . $orderBy . " " . $order);
        }

        try {
            // Get template engine
            $templateEngine = \Jankx\Facades\App::make('template.engine.' . $engineId);

            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log("[PostTypeLayoutBlock Debug] Template engine resolved: " . get_class($templateEngine));
            }

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
            if (isset($attributes['orderBy'])) {
                $queryArgs['orderby'] = $attributes['orderBy'];
            }
            if (isset($attributes['order'])) {
                $queryArgs['order'] = $attributes['order'];
            }
            if (isset($attributes['offset'])) {
                $queryArgs['offset'] = $attributes['offset'];
            }

            $wp_query = new \WP_Query($queryArgs);

            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log("[PostTypeLayoutBlock Debug] WP_Query created, found posts: " . $wp_query->found_posts);
            }

            // Get layout template
            $loopItemLayoutType = apply_filters("jankx/posts/fetcher/{$postType}/content_layout", null);
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log("[PostTypeLayoutBlock Debug] Loop item layout type: " . ($loopItemLayoutType ?: 'null'));
            }

            // If no layout type, use default based on post type
            if (!$loopItemLayoutType) {
                $loopItemLayoutType = 'default';
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    error_log("[PostTypeLayoutBlock Debug] Using default layout type: " . $loopItemLayoutType);
                }
            }

            try {
                $loopItemLayout = $postLayoutManager->getLoopItemContentByType($loopItemLayoutType);
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    error_log("[PostTypeLayoutBlock Debug] Loop item layout: " . ($loopItemLayout ? get_class($loopItemLayout) : 'null'));
                }
            } catch (\InvalidArgumentException $e) {
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    error_log("[PostTypeLayoutBlock Debug] Failed to get loop item layout: " . $e->getMessage());
                }
                return sprintf(
                    '<div class="jankx-post-layout-error">%s</div>',
                    esc_html__('Failed to get loop item layout: ' . $e->getMessage(), 'jankx')
                );
            }

            // Fallback: create DefaultContent directly if manager returns null
            if (!$loopItemLayout) {
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    error_log("[PostTypeLayoutBlock Debug] Creating DefaultContent fallback");
                }
                $loopItemLayout = new \Jankx\PostLayout\LoopItemContent\DefaultContent();
            }

            // Create PostLayout and render based on layout type
            $postLayoutClass = $this->getPostLayoutClass($layoutName);
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log("[PostTypeLayoutBlock Debug] PostLayout class: " . $postLayoutClass);
            }
            $postLayout = new $postLayoutClass($wp_query, $loopItemLayout);
            $postLayout->setTemplateEngine($templateEngine);
            $postLayout->setOptions([
                'thumbnail_position' => 'top',
                'thumbnail_size' => 'medium',
            ]);
            $postLayout->disableLoopStartLoopEnd();

            $renderedContent = $postLayout->render(false);

            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log("[PostTypeLayoutBlock Debug] Content rendered successfully, length: " . ($renderedContent ? strlen($renderedContent) : 0));
            }

            return sprintf(
                '<div id="%s" class="jankx-post-layout" data-engine-id="%s">%s</div>',
                esc_attr($wrapId),
                esc_attr($engineId),
                $renderedContent
            );
        } catch (Exception $e) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log("[PostTypeLayoutBlock Debug] Error rendering content: " . $e->getMessage());
            }

            // Fallback: return empty container
            return sprintf('<div id="%s" class="jankx-post-layout" data-engine-id="%s">%s</div>',
                esc_attr($wrapId),
                esc_attr($engineId),
                '<div class="jankx-post-layout-error">' . esc_html__('Failed to render content: ' . $e->getMessage(), 'jankx') . '</div>'
            );
        }
    }
}
