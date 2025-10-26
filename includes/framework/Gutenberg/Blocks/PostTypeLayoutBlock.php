<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Gutenberg\QueryOptions;
use Jankx\Layouts\PostLayout\PostLayoutManager;
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
     * PostLayoutManager instance
     *
     * @var PostLayoutManager|null
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
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets']);

        // Enqueue frontend scripts for Load More
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);

        // Register AJAX handlers for Load More
        add_action('wp_ajax_jankx_load_more_posts', [$this, 'handleLoadMoreAjax']);
        add_action('wp_ajax_nopriv_jankx_load_more_posts', [$this, 'handleLoadMoreAjax']);
    }

    /**
     * Get layout manager (lazy loaded)
     *
     * @return PostLayoutManager
     */
    protected function getLayoutManager(): PostLayoutManager
    {
        if ($this->layoutManager === null) {
            $this->layoutManager = PostLayoutManager::getInstance();
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
        $script_handle = 'jankx-post-type-layout-editor';

        // Localize supported layouts
        $layouts = $this->getLayoutManager()->getLayouts(['field' => 'all']);
        
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
     * Enqueue frontend assets for Load More functionality
     *
     * @return void
     */
    public function enqueueFrontendAssets(): void
    {
        // Only enqueue if block is used on the page
        if (!has_block('jankx/post-type-layout')) {
            return;
        }

        $asset_file = $this->blockPath . '/build/load-more.asset.php';
        $script_path = $this->blockPath . '/build/load-more.js';

        // If built file doesn't exist, skip
        if (!file_exists($asset_file) || !file_exists($script_path)) {
            return;
        }

        $asset = require $asset_file;
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
            $asset['version'] ?? filemtime($script_path),
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

    /**
     * Sanitize attributes based on layout's supported options
     * Unsupported options will be set to false
     *
     * @param string $layout_name Layout name
     * @param array $attributes Block attributes
     * @return array Sanitized attributes
     */
    protected function sanitizeAttributes(string $layout_name, array $attributes): array
    {
        $layoutManager = $this->getLayoutManager();
        $layout = $layoutManager->getLayout($layout_name);

        if (!$layout) {
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

        // Set unsupported options to false
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
        if (!$layoutManager->hasLayout($layout_name)) {
            return sprintf(
                '<div class="post-layout-error">%s</div>',
                sprintf(
                    esc_html__('Layout "%s" does not exist.', 'jankx'),
                    esc_html($layout_name)
                )
            );
        }

        // Sanitize attributes based on layout's supported options
        $attributes = $this->sanitizeAttributes($layout_name, $attributes);

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

            // Create new query with modified args
            $query = new WP_Query($query_args);

            // Create decorator with the query
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $decorator->withQuery($query);
        } elseif ($queryPreset === 'related') {
            // Build related posts query
            $attributes = $this->buildRelatedQuery($attributes);

            // Create decorator and build query
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $query = $decorator->buildQuery($attributes);
            $decorator->withQuery($query);
        } else {
            // Custom query (default behavior)
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
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

        // Get block wrapper attributes
        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => implode(' ', $wrapper_classes),
            'style' => !empty($inline_styles) ? implode('; ', $inline_styles) . ';' : '',
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
        if (!$layoutManager->hasLayout($layout_name)) {
            wp_send_json_error(['message' => __('Layout does not exist', 'jankx')]);
            return;
        }

        // Sanitize attributes
        $attributes = $this->sanitizeAttributes($layout_name, $attributes);

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
            
            $query = new WP_Query($query_args);
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $decorator->withQuery($query);
        } elseif ($queryPreset === 'related') {
            $attributes = $this->buildRelatedQuery($attributes);
            
            // Inject page number into attributes before building query
            $attributes['_internal_paged'] = $page;
            
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $query = $decorator->buildQuery($attributes);
            $decorator->withQuery($query);
        } else {
            // Custom query - inject page number into attributes
            $attributes['_internal_paged'] = $page;
            
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
        MultilingualFactory::setCurrentLanguage($language_code);

        // Add filter to ensure queries are filtered by language
        add_filter('pre_get_posts', function ($query) use ($language_code) {
            if (!$query->is_main_query()) {
                MultilingualFactory::filterQuery($query, $language_code);
            }
            return $query;
        });
    }
}
