<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Gutenberg\QueryOptions;
use Jankx\Layouts\PostLayout\PostLayoutManager;
use Jankx\Facades\PostLayout;
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
        // Output supported layouts to JavaScript
        add_action('admin_head', [$this, 'setupSupportedLayouts'], 5);

        // Output query options to JavaScript
        add_action('admin_head', [$this, 'setupQueryOptions'], 5);
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

        // Get current page
        $paged = max(1, get_query_var('paged'));
        if ($paged === 1) {
            $paged = max(1, get_query_var('page'));
        }

        // Build pagination args
        $pagination_args = [
            'total' => $query->max_num_pages,
            'current' => $paged,
            'mid_size' => 2,
            'end_size' => 1,
            'prev_text' => __('&laquo; Trước', 'jankx'),
            'next_text' => __('Sau &raquo;', 'jankx'),
        ];

        // Adjust based on style
        if ($paginationStyle === 'simple') {
            // Simple: Only prev/next buttons
            $pagination_args['show_all'] = false;
            $pagination_args['type'] = 'list';
            $pagination_args['prev_next'] = true;
        } elseif ($paginationStyle === 'arrows') {
            // Arrows: Minimal prev/next with arrow icons
            $pagination_args['prev_text'] = '<span aria-hidden="true">&larr;</span> ' . __('Trước', 'jankx');
            $pagination_args['next_text'] = __('Sau', 'jankx') . ' <span aria-hidden="true">&rarr;</span>';
            $pagination_args['type'] = 'list';
            $pagination_args['show_all'] = false;
        } elseif ($paginationStyle === 'load-more') {
            // Load more button (future enhancement - for now show as simple)
            return $this->renderLoadMoreButton($query, $paged);
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
     * @return string
     */
    protected function renderLoadMoreButton($query, int $current_page): string
    {
        // Check if there are more pages
        if ($current_page >= $query->max_num_pages) {
            return '';
        }

        $next_page = $current_page + 1;

        return sprintf(
            '<div class="post-layout-pagination pagination-style-load-more">
                <button class="load-more-button" data-page="%d" data-max-pages="%d">
                    %s
                </button>
            </div>',
            esc_attr($next_page),
            esc_attr($query->max_num_pages),
            esc_html__('Tải thêm', 'jankx')
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
     * Setup supported layouts for JavaScript
     *
     * @return void
     */
    public function setupSupportedLayouts(): void
    {
        $layouts = $this->getLayoutManager()->getLayouts(['field' => 'all']);
        ?>
        <script>
            window.jankxSupportedPostTypeLayouts = <?php echo wp_json_encode($layouts, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP); ?>;
        </script>
        <?php
    }

    /**
     * Setup query options for JavaScript
     *
     * @return void
     */
    public function setupQueryOptions(): void
    {
        QueryOptions::outputToJavaScript();
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
                    esc_html__('Layout "%s" không tồn tại.', 'jankx'),
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
            'style' => !empty($inline_styles) ? implode('; ', $inline_styles) : '',
        ]);

        // Wrap output
        return sprintf(
            '<div %s>%s</div>',
            $wrapper_attributes,
            $html
        );
    }
}
