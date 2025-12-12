<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Gutenberg\QueryOptions;
use Jankx\Layouts\DynamicDataLayout\DynamicDataLayoutManager;
use Jankx\Facades\PostLayout;
use Jankx\Multilingual\MultilingualFactory;
use WP_Query;

/**
 * Post Type Layout Block
 *
 * Hiển thị danh sách posts theo layout tùy chỉnh (Grid, List, Masonry)
 * với đầy đủ query options và display settings
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class PostTypeLayoutBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/post-type-layout';

    /**
     * DynamicDataLayoutManager instance
     *
     * @var DynamicDataLayoutManager|null
     */
    protected $layoutManager = null;

    /**
     * Initialize the block
     *
     * @return void
     */
    public function init(): void
    {
        // Enqueue editor scripts with localized data
        // Priority 20 to ensure block scripts are registered first (default is 10)
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets'], 20);

        // Enqueue frontend scripts for Load More
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);

        // Register AJAX handlers for Load More
        add_action('wp_ajax_jankx_load_more_posts', [$this, 'handleLoadMoreAjax']);
        add_action('wp_ajax_nopriv_jankx_load_more_posts', [$this, 'handleLoadMoreAjax']);

        // Register AJAX handlers for Filter Update (used by advanced-filters block)
        add_action('wp_ajax_jankx_post_type_layout_filter', [$this, 'handleFilterUpdate']);
        add_action('wp_ajax_nopriv_jankx_post_type_layout_filter', [$this, 'handleFilterUpdate']);
    }

    /**
     * Get layout manager (lazy loaded)
     *
     * @return DynamicDataLayoutManager
     */
    protected function getLayoutManager(): DynamicDataLayoutManager
    {
        if ($this->layoutManager === null) {
            $this->layoutManager = DynamicDataLayoutManager::getInstance();
        }
        return $this->layoutManager;
    }

    /**
     * Render pagination
     *
     * @param string $content Inner blocks content (may contain pagination blocks)
     * @param \WP_Query $query The query instance
     * @param array $attributes Block attributes
     * @return string
     */
    protected function renderPagination(string $content, $query, array $attributes): string
    {
        // Extract pagination blocks from inner blocks if exists
        if (strpos($content, 'wp-block-query-pagination') !== false) {
            return $content;
        }

        // Get pagination settings
        $paginationStyle = $attributes['paginationStyle'] ?? 'numbers';
        $paginationAlignment = $attributes['paginationAlignment'] ?? 'center';
        $showPaginationNumbers = $attributes['showPaginationNumbers'] ?? true;
        $paginationPrevText = $attributes['paginationPrevText'] ?? '';
        $paginationNextText = $attributes['paginationNextText'] ?? '';

        // Get current page
        $paged = max(1, get_query_var('paged'));
        if ($paged === 1) {
            $paged = max(1, get_query_var('page'));
        }

        // Determine prev/next text
        $prevText = !empty($paginationPrevText) ? $paginationPrevText : __('&laquo; Previous', 'jankx');
        $nextText = !empty($paginationNextText) ? $paginationNextText : __('Next &raquo;', 'jankx');

        // Build pagination args
        $pagination_args = [
            'total' => $query->max_num_pages,
            'current' => $paged,
            'mid_size' => 2,
            'end_size' => 1,
            'prev_text' => $prevText,
            'next_text' => $nextText,
        ];

        // Adjust based on style
        if ($paginationStyle === 'simple') {
            // Simple: Only prev/next buttons
            $pagination_args['show_all'] = false;
            $pagination_args['type'] = 'list';
            $pagination_args['prev_next'] = true;
        } elseif ($paginationStyle === 'arrows') {
            // Arrows: Minimal prev/next with arrow icons
            if (empty($paginationPrevText)) {
                $pagination_args['prev_text'] = '<span aria-hidden="true">&larr;</span> ' . __('Previous', 'jankx');
            }
            if (empty($paginationNextText)) {
                $pagination_args['next_text'] = __('Next', 'jankx') . ' <span aria-hidden="true">&rarr;</span>';
            }
            $pagination_args['type'] = 'list';
            $pagination_args['show_all'] = false;
        } elseif ($paginationStyle === 'load-more') {
            // Load more button
            return $this->renderLoadMoreButton($query, $paged, $attributes);
        } else {
            // Default: Numbers with prev/next
            $pagination_args['type'] = 'list';
            $pagination_args['show_all'] = $showPaginationNumbers;
        }

        // Generate pagination
        $pagination = paginate_links($pagination_args);

        if (!$pagination) {
            return '';
        }

        // Build wrapper classes
        $wrapper_classes = [
            'post-layout-pagination',
            'wp-block-query-pagination',
            'pagination-style-' . esc_attr($paginationStyle),
            'pagination-align-' . esc_attr($paginationAlignment),
        ];

        return sprintf(
            '<nav class="%s" aria-label="%s" role="navigation">%s</nav>',
            esc_attr(implode(' ', $wrapper_classes)),
            esc_attr__('Posts navigation', 'jankx'),
            $pagination
        );
    }

    /**
     * Render load more button
     *
     * @param \WP_Query $query The query instance
     * @param int $current_page Current page number
     * @param array $attributes Block attributes (for AJAX)
     * @return string
     */
    protected function renderLoadMoreButton($query, int $current_page, array $attributes = []): string
    {
        // Check if there are more pages
        if ($current_page >= $query->max_num_pages) {
            return '';
        }

        $next_page = $current_page + 1;

        // Encode attributes for AJAX request
        $ajax_data = wp_json_encode([
            'attributes' => $attributes,
            'page' => $next_page,
        ]);

        return sprintf(
            '<div class="post-layout-pagination pagination-style-load-more">
                <button class="jankx-load-more-button" data-page="%d" data-max-pages="%d" data-ajax-params="%s">
                    <span class="load-more-text">%s</span>
                    <span class="load-more-spinner" style="display:none;">%s</span>
                </button>
            </div>',
            esc_attr($next_page),
            esc_attr($query->max_num_pages),
            esc_attr($ajax_data),
            esc_html__('Load More', 'jankx'),
            esc_html__('Loading...', 'jankx')
        );
    }

    /**
     * Build related posts query (same taxonomy)
     *
     * @param array $attributes Block attributes
     * @return array Modified attributes with tax_query for related posts
     */
    protected function buildRelatedQuery(array $attributes): array
    {
        // Only works in singular context
        if (!is_singular()) {
            return $attributes;
        }

        $current_post = get_queried_object();
        if (!$current_post || !isset($current_post->ID)) {
            return $attributes;
        }

        // Get post type
        $post_type = $attributes['postType'] ?? 'post';

        // Exclude current post
        $attributes['postNotIn'] = array_merge(
            $attributes['postNotIn'] ?? [],
            [$current_post->ID]
        );

        // Get all public taxonomies for this post type
        $taxonomies = get_object_taxonomies($post_type, 'objects');
        $tax_queries = [];

        foreach ($taxonomies as $taxonomy) {
            if (!$taxonomy->public) {
                continue;
            }

            // Get terms of current post
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

        // If we have taxonomy queries, add them
        if (!empty($tax_queries)) {
            // Merge with existing tax queries if any
            $existing_tax_query = $attributes['taxQuery'] ?? [];

            // Convert to WP_Query format
            foreach ($tax_queries as $tq) {
                $existing_tax_query[] = $tq;
            }

            $attributes['taxQuery'] = $existing_tax_query;
        }

        return $attributes;
    }

    /**
     * Enqueue editor assets with localized data
     *
     * @return void
     */
    public function enqueueEditorAssets(): void
    {
        // Get editor script handle from block metadata
        $asset_file = $this->blockPath . '/build/index.asset.php';
        
        if (!file_exists($asset_file)) {
            return;
        }

        $asset = require $asset_file;
        
        // WordPress generates script handle from block.json: {namespace}-{block-name}-editor-script
        $script_handle = 'jankx-post-type-layout-editor-script';

        // Verify script is registered
        if (!wp_script_is($script_handle, 'registered')) {
            // Fallback: try without -script suffix
            $script_handle = 'jankx-post-type-layout-editor';
        }

        // Localize supported layouts
        $layouts = $this->getLayoutManager()->getCommonLayouts();
        
        wp_localize_script(
            $script_handle,
            'jankxSupportedPostTypeLayouts',
            $layouts
        );

        // Localize query options
        $query_options = QueryOptions::getOptions();
        
        wp_localize_script(
            $script_handle,
            'jankxQueryOptions',
            $query_options
        );
    }

    /**
     * Enqueue frontend assets for Load More and Carousel functionality
     *
     * @return void
     */
    public function enqueueFrontendAssets(): void
    {
        // Only enqueue if block is used on the page
        if (!has_block('jankx/post-type-layout')) {
            return;
        }

        // Enqueue Load More script
        $load_more_asset_file = $this->blockPath . '/build/load-more.asset.php';
        $load_more_script_path = $this->blockPath . '/build/load-more.js';

        if (file_exists($load_more_asset_file) && file_exists($load_more_script_path)) {
            $asset = require $load_more_asset_file;
            $script_handle = 'jankx-post-type-layout-load-more';

            // Get block URL dynamically to support child themes
            $block_url = str_replace(
                [wp_normalize_path(WP_CONTENT_DIR), '\\'],
                [content_url(), '/'],
                wp_normalize_path($this->blockPath)
            );

            wp_enqueue_script(
                $script_handle,
                $block_url . '/build/load-more.js',
                $asset['dependencies'] ?? ['wp-api-fetch'],
                $asset['version'] ?? filemtime($load_more_script_path),
                true
            );

            // Localize AJAX data
            wp_localize_script(
                $script_handle,
                'jankxLoadMore',
                [
                    'ajaxUrl' => admin_url('admin-ajax.php'),
                    'nonce' => wp_create_nonce('jankx_load_more'),
                ]
            );
        }

        // Enqueue Carousel script
        $carousel_asset_file = $this->blockPath . '/build/carousel.asset.php';
        $carousel_script_path = $this->blockPath . '/build/carousel.js';

        // Only enqueue if carousel layout is used on the page
        if (file_exists($carousel_asset_file) && file_exists($carousel_script_path)) {
            $asset = require $carousel_asset_file;
            $script_handle = 'jankx-post-type-layout-carousel';

            // Get block URL dynamically to support child themes
            $block_url = str_replace(
                [wp_normalize_path(WP_CONTENT_DIR), '\\'],
                [content_url(), '/'],
                wp_normalize_path($this->blockPath)
            );

            wp_enqueue_script(
                $script_handle,
                $block_url . '/build/carousel.js',
                $asset['dependencies'] ?? [],
                $asset['version'] ?? filemtime($carousel_script_path),
                true
            );
        }
    }

    /**
     * Sanitize attributes based on layout's supported options
     * Unsupported options will be set to false
     *
     * Note: This method should only be called during render phase,
     * not during query building, to preserve user's attribute values.
     *
     * @param string $layout_name Layout name
     * @param array $attributes Block attributes
     * @param bool $for_render Whether sanitizing for render (true) or just validation (false)
     * @return array Sanitized attributes
     */
    protected function sanitizeAttributes(string $layout_name, array $attributes, bool $for_render = true): array
    {
        $layoutManager = $this->getLayoutManager();
        $layout = $layoutManager->getLayout($layout_name);

        if (!$layout) {
            return $attributes;
        }

        // Only apply strict sanitization for render phase
        if (!$for_render) {
            return $attributes;
        }

        // Get supported options from layout
        $supportedOptions = $layout->getSupportedOptions();

        // List of option keys to check
        $optionKeys = [
            'columns',
            'showFeaturedImage',
            'showTitle',
            'showExcerpt',
            'showDate',
            'showAuthor',
            'itemStyle',
        ];

        // Set unsupported options to false (only for render)
        foreach ($optionKeys as $key) {
            if (!in_array($key, $supportedOptions, true)) {
                $attributes[$key] = false;
            }
        }

        return $attributes;
    }

    /**
     * Render the block
     *
     * @param array $attributes Block attributes
     * @param string $content Block content (inner blocks HTML)
     * @param \WP_Block $block Block instance
     * @return string Rendered HTML
     */
    public function render($attributes, $content, $block)
    {
        // Inject current language for multilingual support (optional)
        // Block works perfectly fine without any multilingual plugin
        $current_language = MultilingualFactory::getCurrentLanguage();
        if ($current_language) {
            $attributes['_current_language'] = $current_language;
        }

        // Get query preset
        $queryPreset = $attributes['queryPreset'] ?? 'custom';

        // Get layout name
        $layout_name = $attributes['layout'] ?? 'grid';

        // Get layout manager
        $layoutManager = $this->getLayoutManager();

        // Check if layout exists
        $post_type_for_check = $attributes['postType'] ?? 'post';
        if (!$layoutManager->hasLayout($layout_name, $post_type_for_check)) {
            return sprintf(
                '<div class="post-layout-error">%s</div>',
                sprintf(
                    esc_html__('Layout "%s" does not exist.', 'jankx'),
                    esc_html($layout_name)
                )
            );
        }

        // Apply filters from URL query string if available
        // This allows filters to persist on page reload
        $filters_from_url = $this->getFiltersFromUrl();
        if (!empty($filters_from_url)) {
            $attributes = $this->applyFiltersToAttributes($attributes, $filters_from_url);
        }

        // Sanitize attributes based on layout's supported options (for render)
        $attributes = $this->sanitizeAttributes($layout_name, $attributes, true);

        // Ensure frontend carousel script is enqueued when using carousel layout
        if ($layout_name === 'carousel') {
            $carousel_asset_file = $this->blockPath . '/build/carousel.asset.php';
            $carousel_script_path = $this->blockPath . '/build/carousel.js';
            if (file_exists($carousel_asset_file) && file_exists($carousel_script_path)) {
                $asset = require $carousel_asset_file;
                $script_handle = 'jankx-post-type-layout-carousel';

                $block_url = str_replace(
                    [wp_normalize_path(WP_CONTENT_DIR), '\\'],
                    [content_url(), '/'],
                    wp_normalize_path($this->blockPath)
                );

                wp_enqueue_script(
                    $script_handle,
                    $block_url . '/build/carousel.js',
                    $asset['dependencies'] ?? [],
                    $asset['version'] ?? filemtime($carousel_script_path),
                    true
                );
            }
        }

        // Handle query preset
        if ($queryPreset === 'default') {
            // Use main WordPress query but respect posts_per_page
            global $wp_query;

            // Clone main query to avoid modifying global
            $query_args = $wp_query->query_vars;

            // Apply posts_per_page if specified
            if (!empty($attributes['postsPerPage'])) {
                $query_args['posts_per_page'] = intval($attributes['postsPerPage']);
            }

            // Apply orderBy and order from attributes
            if (!empty($attributes['orderBy'])) {
                $query_args['orderby'] = sanitize_key($attributes['orderBy']);
            }
            if (!empty($attributes['order'])) {
                $query_args['order'] = strtoupper(sanitize_key($attributes['order']));
            }

            // Apply meta_key if ordering by meta_value
            if (!empty($attributes['metaKey']) && in_array($attributes['orderBy'], ['meta_value', 'meta_value_num'])) {
                $query_args['meta_key'] = sanitize_key($attributes['metaKey']);
                
                if (!empty($attributes['metaType'])) {
                    $query_args['meta_type'] = $attributes['metaType'];
                }
            }

            // Apply language filter to query args
            if (!empty($attributes['_current_language'])) {
                $query_args = MultilingualFactory::addLanguageToQueryArgs($query_args, $attributes['_current_language']);
            }

            // Create new query with modified args
            $query = new WP_Query($query_args);

            // Create decorator with the query
            $decorator = $layoutManager->createLayout($layout_name, $attributes['postType'] ?? 'post', $attributes);
            $decorator->withQuery($query);
        } elseif ($queryPreset === 'related') {
            // Build related posts query
            $attributes = $this->buildRelatedQuery($attributes);

            // Create decorator and build query
            $decorator = $layoutManager->createLayout($layout_name, $attributes['postType'] ?? 'post', $attributes);
            $query = $decorator->buildQuery($attributes);
            $decorator->withQuery($query);
        } else {
            // Custom query (default behavior)
            $decorator = $layoutManager->createLayout($layout_name, $attributes['postType'] ?? 'post', $attributes);
            $query = $decorator->buildQuery($attributes);
            $decorator->withQuery($query);
        }

        // Render layout
        $html = $decorator->render();

        // If no posts and has inner blocks (no-results message), show inner blocks
        if (empty($html) && !empty($content)) {
            $html = '<div class="post-layout-no-results">' . $content . '</div>';
        }

        // Add default pagination if enabled
        if (!empty($attributes['enablePagination']) && !empty($html) && $query->max_num_pages > 1) {
            $html .= $this->renderPagination($content, $query, $attributes);
        }

        // Build wrapper classes
        $wrapper_classes = [
            'wp-block-jankx-post-type-layout',
            'layout-' . $layout_name,
        ];

        // Build inline styles for responsive columns
        $inline_styles = [];
        if (!empty($attributes['columns'])) {
            $inline_styles[] = '--columns-desktop: ' . intval($attributes['columns']);
        }
        if (!empty($attributes['columnsTablet'])) {
            $inline_styles[] = '--columns-tablet: ' . intval($attributes['columnsTablet']);
        }
        if (!empty($attributes['columnsMobile'])) {
            $inline_styles[] = '--columns-mobile: ' . intval($attributes['columnsMobile']);
        }

        // Build data attributes for compatibility with other blocks (e.g., advanced-filters)
        $query_id = $attributes['queryId'] ?? null;
        if (empty($query_id)) {
            // Generate queryId if not exists
            $query_id = 'query_' . uniqid();
        }
        $query_id = strval($query_id);

        $post_type = $attributes['postType'] ?? 'post';
        $posts_per_page = $attributes['postsPerPage'] ?? 10;
        $columns = $attributes['columns'] ?? 3;
        $columns_tablet = $attributes['columnsTablet'] ?? 2;
        $columns_mobile = $attributes['columnsMobile'] ?? 1;
        $order_by = $attributes['orderBy'] ?? 'date';
        $order = $attributes['order'] ?? 'DESC';
        $query_preset = $attributes['queryPreset'] ?? 'custom';

        // Build block settings JSON for other blocks to read
        $block_settings = [
            'queryId' => $query_id,
            'postType' => $post_type,
            'postsPerPage' => $posts_per_page,
            'layout' => $layout_name,
            'columns' => $columns,
            'columnsTablet' => $columns_tablet,
            'columnsMobile' => $columns_mobile,
            'orderBy' => $order_by,
            'order' => $order,
            'queryPreset' => $query_preset,
        ];

        // Get block wrapper attributes
        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => implode(' ', $wrapper_classes),
            'style' => !empty($inline_styles) ? implode('; ', $inline_styles) . ';' : '',
            'data-block-id' => $query_id,
            'data-query-id' => $query_id,
            'data-post-type' => esc_attr($post_type),
            'data-layout' => esc_attr($layout_name),
            'data-posts-per-page' => intval($posts_per_page),
            'data-columns' => intval($columns),
            'data-columns-tablet' => intval($columns_tablet),
            'data-columns-mobile' => intval($columns_mobile),
            'data-order-by' => esc_attr($order_by),
            'data-order' => esc_attr($order),
            'data-query-preset' => esc_attr($query_preset),
            'data-block-settings' => esc_attr(wp_json_encode($block_settings)),
        ]);

        // Wrap output
        return sprintf(
            '<div %s>%s</div>',
            $wrapper_attributes,
            $html
        );
    }

    /**
     * Handle AJAX request for Load More functionality
     *
     * @return void
     */
    public function handleLoadMoreAjax(): void
    {
        // Verify nonce
        check_ajax_referer('jankx_load_more', 'nonce');

        // Get parameters with proper sanitization
        $attributes_json = isset($_POST['attributes']) ? sanitize_text_field(wp_unslash($_POST['attributes'])) : '';
        $page = isset($_POST['page']) ? absint($_POST['page']) : 1;

        // Decode and validate JSON
        $attributes = [];
        if (!empty($attributes_json)) {
            $decoded = json_decode($attributes_json, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $attributes = $decoded;
            }
        }

        // Validate attributes
        if (empty($attributes)) {
            wp_send_json_error(['message' => __('Invalid attributes', 'jankx')]);
            return;
        }

        // Validate page number
        if ($page < 1) {
            wp_send_json_error(['message' => __('Invalid page number', 'jankx')]);
            return;
        }

        // Set language context for multilingual plugins
        $this->setLanguageContext($attributes);

        // Get layout name
        $layout_name = $attributes['layout'] ?? 'grid';

        // Get layout manager
        $layoutManager = $this->getLayoutManager();

        // Check if layout exists
        $post_type_for_check = $attributes['postType'] ?? 'post';
        if (!$layoutManager->hasLayout($layout_name, $post_type_for_check)) {
            wp_send_json_error(['message' => __('Layout does not exist', 'jankx')]);
            return;
        }

        // Validate layout exists (don't sanitize attributes for AJAX to preserve values)
        // Sanitization happens in PostLayoutDecorator during render
        $attributes = $this->sanitizeAttributes($layout_name, $attributes, false);

        // Get query preset
        $queryPreset = $attributes['queryPreset'] ?? 'custom';

        // Build query with pagination
        if ($queryPreset === 'default') {
            global $wp_query;
            $query_args = $wp_query->query_vars;
            
            if (!empty($attributes['postsPerPage'])) {
                $query_args['posts_per_page'] = intval($attributes['postsPerPage']);
            }
            $query_args['paged'] = $page;

            // Apply orderBy and order from attributes
            if (!empty($attributes['orderBy'])) {
                $query_args['orderby'] = sanitize_key($attributes['orderBy']);
            }
            if (!empty($attributes['order'])) {
                $query_args['order'] = strtoupper(sanitize_key($attributes['order']));
            }

            // Apply meta_key if ordering by meta_value
            if (!empty($attributes['metaKey']) && in_array($attributes['orderBy'], ['meta_value', 'meta_value_num'])) {
                $query_args['meta_key'] = sanitize_key($attributes['metaKey']);
                
                if (!empty($attributes['metaType'])) {
                    $query_args['meta_type'] = $attributes['metaType'];
                }
            }

            // Apply language filter to query args
            if (!empty($attributes['_current_language'])) {
                $query_args = MultilingualFactory::addLanguageToQueryArgs($query_args, $attributes['_current_language']);
            }
            
            $query = new WP_Query($query_args);
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $decorator->withQuery($query);
        } elseif ($queryPreset === 'related') {
            $attributes = $this->buildRelatedQuery($attributes);
            
            // Inject page number into attributes before building query
            $attributes['_internal_paged'] = $page;
            
            // Language filter will be applied in PostLayoutDecorator::buildQuery()
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $query = $decorator->buildQuery($attributes);
            $decorator->withQuery($query);
        } else {
            // Custom query - inject page number into attributes
            $attributes['_internal_paged'] = $page;
            
            // Language filter will be applied in PostLayoutDecorator::buildQuery()
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $query = $decorator->buildQuery($attributes);
            $decorator->withQuery($query);
        }

        // Render posts
        $html = $decorator->render();

        // Check if there are more posts
        $has_more = $page < $query->max_num_pages;

        // Send response
        wp_send_json_success([
            'html' => $html,
            'page' => $page,
            'max_pages' => $query->max_num_pages,
            'has_more' => $has_more,
        ]);
    }

    /**
     * Set language context for multilingual plugins
     *
     * Uses MultilingualFactory to support multiple multilingual plugins
     * (Polylang, WPML, and any custom adapters)
     *
     * IMPORTANT: This is completely optional. If no multilingual plugin
     * is installed, this method does nothing and block works normally.
     *
     * Note: Language filtering is now handled via MultilingualFactory::addLanguageToQueryArgs()
     * in the query building phase, so this method only sets the current language context.
     *
     * @param array $attributes Block attributes containing language info
     * @return void
     */
    protected function setLanguageContext(array $attributes): void
    {
        // Early return if no language info (no multilingual plugin active)
        if (empty($attributes['_current_language'])) {
            return;
        }

        $language_code = $attributes['_current_language'];

        // Set current language using factory (supports all plugins)
        // This ensures template functions like pll_current_language() return correct value
        MultilingualFactory::setCurrentLanguage($language_code);
    }

    /**
     * Handle AJAX request for Filter Update (used by advanced-filters block)
     *
     * @return void
     */
    public function handleFilterUpdate(): void
    {
        // Verify nonce
        check_ajax_referer('jankx_load_more', 'nonce');

        // Get parameters
        $block_id = isset($_POST['block_id']) ? sanitize_text_field(wp_unslash($_POST['block_id'])) : '';
        $attributes_json = isset($_POST['attributes']) ? sanitize_text_field(wp_unslash($_POST['attributes'])) : '';
        $filters_json = isset($_POST['filters']) ? sanitize_text_field(wp_unslash($_POST['filters'])) : '[]';
        $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;

        if (empty($block_id)) {
            wp_send_json_error(['message' => __('Block ID is required', 'jankx')]);
            return;
        }

        // Decode JSON
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

        // If no attributes provided, try to get from post content
        if (empty($attributes) && $post_id > 0) {
            $attributes = $this->getBlockAttributesFromPost($post_id, $block_id);
        }

        if (empty($attributes)) {
            wp_send_json_error(['message' => __('Block attributes not found', 'jankx')]);
            return;
        }

        // Apply filters to attributes
        $attributes = $this->applyFiltersToAttributes($attributes, $filters);

        // Set language context
        $this->setLanguageContext($attributes);

        // Get layout name
        $layout_name = $attributes['layout'] ?? 'grid';

        // Get layout manager
        $layoutManager = $this->getLayoutManager();

        // Check if layout exists
        if (!$layoutManager->hasLayout($layout_name)) {
            wp_send_json_error(['message' => __('Layout does not exist', 'jankx')]);
            return;
        }

        // Sanitize attributes for render
        $attributes = $this->sanitizeAttributes($layout_name, $attributes, false);

        // Get query preset
        $queryPreset = $attributes['queryPreset'] ?? 'custom';

        // Build query
        if ($queryPreset === 'default') {
            global $wp_query;
            $query_args = $wp_query->query_vars;
            
            if (!empty($attributes['postsPerPage'])) {
                $query_args['posts_per_page'] = intval($attributes['postsPerPage']);
            }

            // Apply orderBy and order from attributes
            if (!empty($attributes['orderBy'])) {
                $query_args['orderby'] = sanitize_key($attributes['orderBy']);
            }
            if (!empty($attributes['order'])) {
                $query_args['order'] = strtoupper(sanitize_key($attributes['order']));
            }

            // Apply meta_key if ordering by meta_value
            if (!empty($attributes['metaKey']) && in_array($attributes['orderBy'], ['meta_value', 'meta_value_num'])) {
                $query_args['meta_key'] = sanitize_key($attributes['metaKey']);
                
                if (!empty($attributes['metaType'])) {
                    $query_args['meta_type'] = $attributes['metaType'];
                }
            }

            // Apply language filter to query args
            if (!empty($attributes['_current_language'])) {
                $query_args = MultilingualFactory::addLanguageToQueryArgs($query_args, $attributes['_current_language']);
            }
            
            $query = new WP_Query($query_args);
            $decorator = $layoutManager->createLayout($layout_name, $attributes['postType'] ?? 'post', $attributes);
            $decorator->withQuery($query);
        } elseif ($queryPreset === 'related') {
            $attributes = $this->buildRelatedQuery($attributes);
            $decorator = $layoutManager->createLayout($layout_name, $attributes['postType'] ?? 'post', $attributes);
            $query = $decorator->buildQuery($attributes);
            $decorator->withQuery($query);
        } else {
            // Custom query
            $decorator = $layoutManager->createLayout($layout_name, $attributes['postType'] ?? 'post', $attributes);
            $query = $decorator->buildQuery($attributes);
            $decorator->withQuery($query);
        }

        // Render posts
        $html = $decorator->render();

        // If no posts and has inner blocks (no-results message), show inner blocks
        if (empty($html) && !empty($attributes['innerHTML'])) {
            $html = '<div class="post-layout-no-results">' . $attributes['innerHTML'] . '</div>';
        }

        // Add pagination if enabled
        if (!empty($attributes['enablePagination']) && $query->max_num_pages > 1) {
            $html .= $this->renderPagination('', $query, $attributes);
        }

        // Wrap in block wrapper with data attributes
        $wrapper_classes = [
            'wp-block-jankx-post-type-layout',
            'layout-' . $layout_name,
        ];

        $query_id = $attributes['queryId'] ?? $block_id;
        $post_type = $attributes['postType'] ?? 'post';
        $posts_per_page = $attributes['postsPerPage'] ?? 10;
        $columns = $attributes['columns'] ?? 3;
        $columns_tablet = $attributes['columnsTablet'] ?? 2;
        $columns_mobile = $attributes['columnsMobile'] ?? 1;
        $order_by = $attributes['orderBy'] ?? 'date';
        $order = $attributes['order'] ?? 'DESC';

        $block_settings = [
            'queryId' => $query_id,
            'postType' => $post_type,
            'postsPerPage' => $posts_per_page,
            'layout' => $layout_name,
            'columns' => $columns,
            'columnsTablet' => $columns_tablet,
            'columnsMobile' => $columns_mobile,
            'orderBy' => $order_by,
            'order' => $order,
            'queryPreset' => $queryPreset,
        ];

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => implode(' ', $wrapper_classes),
            'data-block-id' => $query_id,
            'data-query-id' => $query_id,
            'data-post-type' => esc_attr($post_type),
            'data-layout' => esc_attr($layout_name),
            'data-posts-per-page' => intval($posts_per_page),
            'data-columns' => intval($columns),
            'data-columns-tablet' => intval($columns_tablet),
            'data-columns-mobile' => intval($columns_mobile),
            'data-order-by' => esc_attr($order_by),
            'data-order' => esc_attr($order),
            'data-query-preset' => esc_attr($queryPreset),
            'data-block-settings' => esc_attr(wp_json_encode($block_settings)),
        ]);

        $final_html = sprintf(
            '<div %s>%s</div>',
            $wrapper_attributes,
            $html
        );

        // Send response
        wp_send_json_success([
            'html' => $final_html,
            'block_id' => $block_id,
        ]);
    }

    /**
     * Get block attributes from post content by block ID
     *
     * @param int $post_id Post ID
     * @param string $block_id Block queryId
     * @return array|null Block attributes or null if not found
     */
    private function getBlockAttributesFromPost(int $post_id, string $block_id): ?array
    {
        if (!$post_id) {
            return null;
        }

        $post_obj = get_post($post_id);
        if (!$post_obj) {
            return null;
        }

        $blocks = parse_blocks($post_obj->post_content);
        
        // Recursively search for block
        return $this->findBlockAttributesById($blocks, $block_id);
    }

    /**
     * Recursively find block attributes by queryId
     *
     * @param array $blocks Parsed blocks
     * @param string $target_block_id Target block queryId
     * @return array|null Block attributes or null
     */
    private function findBlockAttributesById(array $blocks, string $target_block_id): ?array
    {
        foreach ($blocks as $block) {
            if (($block['blockName'] ?? '') === 'jankx/post-type-layout') {
                $query_id = $block['attrs']['queryId'] ?? null;
                if ($query_id && strval($query_id) === $target_block_id) {
                    return $block['attrs'] ?? [];
                }
            }

            // Search in inner blocks
            if (!empty($block['innerBlocks'])) {
                $result = $this->findBlockAttributesById($block['innerBlocks'], $target_block_id);
                if ($result !== null) {
                    return $result;
                }
            }
        }

        return null;
    }

    /**
     * Apply filters to post-type-layout block attributes
     *
     * @param array $attributes Original block attributes
     * @param array $filters Filter parameters
     * @return array Modified attributes
     */
    private function applyFiltersToAttributes(array $attributes, array $filters): array
    {
        // Apply taxonomy filters
        if (!empty($filters) && is_array($filters)) {
            $tax_query = $attributes['taxQuery'] ?? [];

            foreach ($filters as $key => $value) {
                // Check if it's a taxonomy filter
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
                } elseif (strpos($key, 'meta_') === 0) {
                    // Meta filter
                    $meta_key = substr($key, 5);
                    $meta_query = $attributes['metaQuery'] ?? [];
                    $meta_query[] = [
                        'key' => $meta_key,
                        'value' => sanitize_text_field($value),
                        'compare' => '=',
                    ];
                    $attributes['metaQuery'] = $meta_query;
                } elseif ($key === 'price' && is_array($value)) {
                    // Price filter
                    $meta_query = $attributes['metaQuery'] ?? [];
                    if (!empty($value['min'])) {
                        $meta_query[] = [
                            'key' => 'price',
                            'value' => floatval($value['min']),
                            'compare' => '>=',
                            'type' => 'NUMERIC',
                        ];
                    }
                    if (!empty($value['max'])) {
                        $meta_query[] = [
                            'key' => 'price',
                            'value' => floatval($value['max']),
                            'compare' => '<=',
                            'type' => 'NUMERIC',
                        ];
                    }
                    $attributes['metaQuery'] = $meta_query;
                } elseif ($key === 'date' && is_array($value)) {
                    // Date filter
                    $meta_query = $attributes['metaQuery'] ?? [];
                    if (!empty($value['start']) || !empty($value['end'])) {
                        $date_field = $attributes['dateField'] ?? 'post_date';
                        $meta_query[] = [
                            'key' => $date_field,
                            'value' => [
                                !empty($value['start']) ? sanitize_text_field($value['start']) : '1970-01-01',
                                !empty($value['end']) ? sanitize_text_field($value['end']) : date('Y-m-d'),
                            ],
                            'compare' => 'BETWEEN',
                            'type' => 'DATE',
                        ];
                        $attributes['metaQuery'] = $meta_query;
                    }
                } elseif ($key === 'author' && !empty($value)) {
                    // Author filter
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
     * Get filters from URL query string
     * Reads filter values from $_GET parameters
     *
     * @return array Filter values
     */
    private function getFiltersFromUrl(): array
    {
        $filters = [];

        if (empty($_GET)) {
            return $filters;
        }

        // Get all public taxonomies to check for taxonomy filters
        $public_taxonomies = get_taxonomies(['public' => true], 'names');

        foreach ($_GET as $key => $value) {
            // Skip WordPress reserved query vars
            if (in_array($key, ['p', 'page_id', 'post', 'post_id', 'paged', 'page', 's', 'search', 'orderby', 'order'])) {
                continue;
            }

            // Check if it's a taxonomy filter
            if (in_array($key, $public_taxonomies)) {
                // Handle comma-separated term IDs or single term ID
                $term_ids = is_array($value) ? $value : array_filter(array_map('intval', explode(',', $value)));
                if (!empty($term_ids)) {
                    $filters[$key] = $term_ids;
                }
            } elseif ($key === 'keyword' && !empty($value)) {
                // Keyword filter
                $filters['keyword'] = sanitize_text_field($value);
            } elseif (strpos($key, 'meta_') === 0) {
                // Meta filter (format: meta_keyname or meta_keyname_min/max for ranges)
                $meta_key = substr($key, 5);
                if (!empty($value)) {
                    // Handle range filters (e.g., meta_price_min, meta_price_max)
                    if (strpos($meta_key, '_min') !== false) {
                        $actual_key = str_replace('_min', '', $meta_key);
                        if (!isset($filters["meta_{$actual_key}"])) {
                            $filters["meta_{$actual_key}"] = [];
                        }
                        $filters["meta_{$actual_key}"]['min'] = sanitize_text_field($value);
                    } elseif (strpos($meta_key, '_max') !== false) {
                        $actual_key = str_replace('_max', '', $meta_key);
                        if (!isset($filters["meta_{$actual_key}"])) {
                            $filters["meta_{$actual_key}"] = [];
                        }
                        $filters["meta_{$actual_key}"]['max'] = sanitize_text_field($value);
                    } else {
                        $filters["meta_{$meta_key}"] = sanitize_text_field($value);
                    }
                }
            } elseif ($key === 'price_min' || $key === 'price_max') {
                // Price filter
                if (!isset($filters['price'])) {
                    $filters['price'] = [];
                }
                if ($key === 'price_min' && !empty($value)) {
                    $filters['price']['min'] = sanitize_text_field($value);
                } elseif ($key === 'price_max' && !empty($value)) {
                    $filters['price']['max'] = sanitize_text_field($value);
                }
            } elseif ($key === 'date_start' || $key === 'date_end') {
                // Date filter
                if (!isset($filters['date'])) {
                    $filters['date'] = [];
                }
                if ($key === 'date_start' && !empty($value)) {
                    $filters['date']['start'] = sanitize_text_field($value);
                } elseif ($key === 'date_end' && !empty($value)) {
                    $filters['date']['end'] = sanitize_text_field($value);
                }
            } elseif ($key === 'author' && !empty($value)) {
                // Author filter
                $author_ids = is_array($value) ? $value : array_filter(array_map('intval', explode(',', $value)));
                if (!empty($author_ids)) {
                    $filters['author'] = $author_ids;
                }
            }
        }

        return $filters;
    }
}
