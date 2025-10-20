<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
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
     * @return string
     */
    protected function renderPagination(string $content, $query): string
    {
        // Extract pagination blocks from inner blocks if exists
        if (strpos($content, 'wp-block-query-pagination') !== false) {
            return $content;
        }

        // Default WordPress pagination
        $pagination = paginate_links([
            'type' => 'list',
            'prev_text' => __('&laquo; Trước', 'jankx'),
            'next_text' => __('Sau &raquo;', 'jankx'),
            'total' => $query->max_num_pages,
            'current' => max(1, get_query_var('paged')),
        ]);

        if (!$pagination) {
            return '';
        }

        return sprintf(
            '<nav class="post-layout-pagination wp-block-query-pagination" aria-label="%s">%s</nav>',
            esc_attr__('Posts navigation', 'jankx'),
            $pagination
        );
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

        // Create decorator và build query để có thể access query sau này
        $decorator = $layoutManager->createLayout($layout_name, $attributes);
        $query = $decorator->buildQuery($attributes);
        $decorator->withQuery($query);

        // Render layout
        $html = $decorator->render();

        // If no posts and has inner blocks (no-results message), show inner blocks
        if (empty($html) && !empty($content)) {
            $html = '<div class="post-layout-no-results">' . $content . '</div>';
        }

        // Add default pagination if enabled
        if (!empty($attributes['enablePagination']) && !empty($html) && $query->max_num_pages > 1) {
            $html .= $this->renderPagination($content, $query);
        }

        // Build wrapper classes
        $wrapper_classes = [
            'wp-block-jankx-post-type-layout',
            'layout-' . $layout_name,
        ];

        // Get block wrapper attributes
        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => implode(' ', $wrapper_classes),
        ]);

        // Wrap output
        return sprintf(
            '<div %s>%s</div>',
            $wrapper_attributes,
            $html
        );
    }
}
