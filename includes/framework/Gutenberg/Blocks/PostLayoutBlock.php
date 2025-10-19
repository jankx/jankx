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

class PostLayoutBlock extends Block
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
    public function init(): void
    {
        add_action('rest_api_init', [$this, 'registerRestEndpoints']);
        add_action('admin_head', [$this, 'setupSupportedPostLayouts'], 5);
    }


    public function setupSupportedPostLayouts(): void
    {
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
    public function registerRestEndpoints(): void
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
    protected function getBlockConfig(string $blockId): ?array
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
    protected function buildQuery(array $config): \WP_Query
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
    protected function buildTaxonomyQuery(array $filters): ?array
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
    protected function buildMetaQuery(array $filters): ?array
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
    protected function applyPresetFilters(array &$args, array $presets): void
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
    protected function applyCustomFilters(array &$args, array $filters): void
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
    protected function applyTrendingLogic(array &$args): void
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
    protected function getTaxonomiesForPostType(string $postType): array
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
    protected function getMetaFieldsForPostType(string $postType): array
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
    protected function getPresetFilters(): array
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
    protected function getCustomFilters(): array
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
    protected function formatPost(\WP_Post $post): array
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
     * Build PostLayout options from block attributes
     *
     * @param array $attributes All block attributes
     * @param array $layout Layout attributes
     * @param array $displayOptions Display options
     * @param array $pagination Pagination options
     * @param array $styling Styling options
     * @param array $responsive Responsive options
     * @return array Complete options array for PostLayout
     */
    protected function buildPostLayoutOptions(
        array $attributes,
        array $layout,
        array $displayOptions,
        array $pagination,
        array $styling,
        array $responsive
    ): array {
        $options = [];

        // Layout options - columns and gap
        $options['columns'] = $layout['columns'] ?? 3;
        $options['columns_tablet'] = $layout['columnsTablet'] ?? 2;
        $options['columns_mobile'] = $layout['columnsMobile'] ?? 1;
        $options['gap'] = $layout['gap'] ?? 20;
        $options['gap_tablet'] = $layout['gapTablet'] ?? 15;
        $options['gap_mobile'] = $layout['gapMobile'] ?? 10;

        // Display options - what to show/hide
        $options['show_title'] = $displayOptions['showTitle'] ?? true;
        $options['show_excerpt'] = $displayOptions['showExcerpt'] ?? true;
        $options['show_meta'] = $displayOptions['showMeta'] ?? true;
        $options['show_thumbnail'] = $displayOptions['showThumbnail'] ?? true;
        $options['show_read_more'] = $displayOptions['showReadMore'] ?? true;
        $options['excerpt_length'] = $displayOptions['excerptLength'] ?? 20;
        $options['meta_fields'] = $displayOptions['metaFields'] ?? ['date', 'author', 'categories'];

        // Thumbnail options (can be in displayOptions or root)
        $options['thumbnail_position'] = $displayOptions['thumbnailPosition'] ?? 'top';
        $options['thumbnail_size'] = $displayOptions['thumbnailSize'] ?? 'medium';

        // Styling options - visual effects
        $options['hover_effect'] = $styling['hoverEffect'] ?? 'lift';
        $options['border_radius'] = $styling['borderRadius'] ?? 8;
        $options['shadow'] = $styling['shadow'] ?? 'medium';

        // Animation options
        if (isset($styling['enableAnimations'])) {
            $options['enable_animations'] = $styling['enableAnimations'];
            $options['animation_duration'] = $styling['animationDuration'] ?? 300;
        }

        // Performance options
        if (isset($styling['lazyLoading'])) {
            $options['lazy_loading'] = $styling['lazyLoading'];
        }
        if (isset($styling['cssContainment'])) {
            $options['css_containment'] = $styling['cssContainment'];
        }

        // Responsive styling overrides
        if (!empty($responsive['enabled'])) {
            if (isset($styling['borderRadiusTablet'])) {
                $options['border_radius_tablet'] = $styling['borderRadiusTablet'];
            }
            if (isset($styling['borderRadiusMobile'])) {
                $options['border_radius_mobile'] = $styling['borderRadiusMobile'];
            }
            if (isset($styling['shadowTablet'])) {
                $options['shadow_tablet'] = $styling['shadowTablet'];
            }
            if (isset($styling['shadowMobile'])) {
                $options['shadow_mobile'] = $styling['shadowMobile'];
            }
        }

        // Pagination options
        if (!empty($pagination['enabled'])) {
            $options['show_paginate'] = true;
            $options['pagination_type'] = $pagination['type'] ?? 'numbers';
            $options['max_numbers'] = $pagination['maxNumbers'] ?? 10;
            $options['show_first_last'] = $pagination['showFirstLast'] ?? false;
            $options['show_ellipsis'] = $pagination['showEllipsis'] ?? true;
            $options['show_current_page'] = $pagination['showCurrentPage'] ?? true;
            $options['ellipsis_position'] = $pagination['ellipsisPosition'] ?? 'both';
            $options['prev_text'] = $pagination['prevText'] ?? __('Previous', 'jankx');
            $options['next_text'] = $pagination['nextText'] ?? __('Next', 'jankx');
            $options['show_icons'] = $pagination['showIcons'] ?? true;
            $options['show_page_info'] = $pagination['showPageInfo'] ?? false;

            // Load more specific options
            if ($pagination['type'] === 'load_more' || $pagination['type'] === 'infinite_scroll') {
                $options['load_more_text'] = $pagination['loadMoreText'] ?? __('Load More', 'jankx');
                $options['loading_text'] = $pagination['loadingText'] ?? __('Loading...', 'jankx');
                $options['no_more_text'] = $pagination['noMoreText'] ?? __('No More Posts', 'jankx');
                $options['posts_per_load'] = $pagination['postsPerLoad'] ?? 6;
                $options['show_spinner'] = $pagination['showSpinner'] ?? true;
                $options['hide_when_complete'] = $pagination['hideWhenComplete'] ?? true;

                if ($pagination['type'] === 'infinite_scroll') {
                    $options['trigger_distance'] = $pagination['triggerDistance'] ?? 100;
                    $options['show_loading_indicator'] = $pagination['showLoadingIndicator'] ?? true;
                    $options['show_back_to_top'] = $pagination['showBackToTop'] ?? false;
                }
            }

            // AJAX options
            $options['ajax'] = $pagination['ajax'] ?? false;
            $options['update_url'] = $pagination['updateURL'] ?? true;
            $options['scroll_to_top'] = $pagination['scrollToTop'] ?? false;
            $options['show_loading_state'] = $pagination['showLoadingState'] ?? true;

            // Accessibility options
            if (isset($pagination['keyboardNav'])) {
                $options['keyboard_nav'] = $pagination['keyboardNav'];
            }
            if (isset($pagination['touchSupport'])) {
                $options['touch_support'] = $pagination['touchSupport'];
            }
        } else {
            $options['show_paginate'] = false;
        }

        return $options;
    }

    /**
     * Get PostLayout class based on layout name
     *
     * @param string $layoutName
     * @return string
     */
    protected function getPostLayoutClass(string $layoutName): string
    {
        $layoutMap = PostLayoutManager::getLayouts();

        return $layoutMap[$layoutName] ?? \Jankx\PostLayout\Layout\Grid::class;
    }

    public function render(array $attributes, string $content = ''): string
    {
        // Parse block attributes with proper defaults from block.json
        $postType = $attributes['postType'] ?? 'post';
        $perPage = isset($attributes['postsPerPage']) ? intval($attributes['postsPerPage']) : 12;

        // Parse styling attributes (correct location)
        $styling = $attributes['styling'] ?? [];
        $layoutName = $styling['viewType'] ?? 'grid';

        // Parse layout attributes (correct location)
        $layout = $attributes['layout'] ?? [];

        // Parse display options (correct location)
        $displayOptions = $attributes['displayOptions'] ?? [];

        // Parse pagination options
        $pagination = $attributes['pagination'] ?? [];

        // Parse responsive options
        $responsive = $attributes['responsive'] ?? [];

        // Get engine ID
        $engineId = Jankx::getEngineId();
        $wrapId = 'jankx-post-layout-' . wp_generate_uuid4();

        try {
            // Get template engine
            $templateEngine = \Jankx\Facades\App::make('template.engine.' . $engineId);

            // Get PostLayoutManager instance from container
            $jankxApp = \Jankx\Foundation\Application::getInstance();
            $postLayoutManager = $jankxApp->make('postlayout.manager');

            // Build WP_Query args
            $queryArgs = [
                'post_type' => $postType,
                'posts_per_page' => $perPage,
                'post_status' => 'publish',
            ];

            // Add ordering
            $orderByValue = $attributes['orderBy'] ?? 'date';
            if ($orderByValue === 'views') {
                $queryArgs['orderby'] = 'meta_value_num';
                $queryArgs['meta_key'] = 'post_views_count';
            } else {
                $queryArgs['orderby'] = $orderByValue;
            }
            $queryArgs['order'] = $attributes['order'] ?? 'DESC';

            // Add offset
            if (isset($attributes['offset']) && $attributes['offset'] > 0) {
                $queryArgs['offset'] = intval($attributes['offset']);
            }

            // Add include/exclude
            if (!empty($attributes['include'])) {
                $queryArgs['post__in'] = array_map('intval', (array) $attributes['include']);
            }
            if (!empty($attributes['exclude'])) {
                $queryArgs['post__not_in'] = array_map('intval', (array) $attributes['exclude']);
            }

            // Add taxonomy filters
            if (!empty($attributes['taxonomyFilters'])) {
                $taxQuery = $this->buildTaxonomyQuery($attributes['taxonomyFilters']);
                if ($taxQuery) {
                    $queryArgs['tax_query'] = $taxQuery;
                }
            }

            // Add meta filters
            if (!empty($attributes['metaFilters'])) {
                $metaQuery = $this->buildMetaQuery($attributes['metaFilters']);
                if ($metaQuery) {
                    $queryArgs['meta_query'] = $metaQuery;
                }
            }

            // Apply preset filters
            if (!empty($attributes['presetFilters'])) {
                $this->applyPresetFilters($queryArgs, $attributes['presetFilters']);
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

            // Build complete options array from all attributes
            $allOptions = $this->buildPostLayoutOptions($attributes, $layout, $displayOptions, $pagination, $styling, $responsive);

            $postLayout->setOptions($allOptions);

            $renderedContent = $postLayout->render(false);


            return $renderedContent;
        } catch (Exception $e) {
            Log::error($e->getMessage());

            // Show detailed error only in debug mode
            $errorMessage = defined('WP_DEBUG') && WP_DEBUG
                ? sprintf(__('Failed to render content: %s', 'jankx'), $e->getMessage())
                : __('Failed to render content. Please check your block settings.', 'jankx');

            // Fallback: return empty container
            return sprintf('<div id="%s" class="jankx-post-layout jankx-post-layout--error" data-engine-id="%s">%s</div>',
                esc_attr($wrapId),
                esc_attr($engineId),
                '<div class="jankx-post-layout-error">' . esc_html($errorMessage) . '</div>'
            );
        }
    }
}
