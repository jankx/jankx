<?php

namespace Jankx\Layouts\DynamicDataLayout;

use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateAttributeSanitizer;
use Jankx\Layouts\DynamicDataLayout\PaginationRenderer;
use WP_Post;

class BlockTemplateRenderer
{
    protected $layoutManager;
    protected $attributeSanitizer;
    protected $templateBlockExtractor;
    protected $templateSanitizer;
    protected $carouselAssetsCallback;

    /**
     * Cache for WP_Query instances
     *
     * @var array
     */
    protected static $queryCache = [];

    public function __construct(
        BlockTemplateLayoutManager $layoutManager,
        BlockTemplateAttributeSanitizer $attributeSanitizer,
        callable $templateBlockExtractor,
        callable $templateSanitizer,
        ?callable $carouselAssetsCallback = null
    ) {
        $this->layoutManager = $layoutManager;
        $this->attributeSanitizer = $attributeSanitizer;
        $this->templateBlockExtractor = $templateBlockExtractor;
        $this->templateSanitizer = $templateSanitizer;
        $this->carouselAssetsCallback = $carouselAssetsCallback;
    }

    public function render(array $attributes, string $content = '', $block = null): string
    {
        $sanitizedAttributes = $this->attributeSanitizer->sanitize($attributes);

        $layoutName = $sanitizedAttributes['layout'] ?? 'grid';
        $layout = $this->layoutManager->createLayout($layoutName);
        $decorator = new BlockTemplateLayoutDecorator($layout);

        // Build robust query using LayoutQueryBuilder (via Decorator) or QueryHelper based on preset
        $queryPreset = $sanitizedAttributes['queryPreset'] ?? 'custom';
        $queryId = $sanitizedAttributes['queryId'] ?? '';
        $query = null;

        // Build query based on preset — no caching by queryId because blocks with the same
        // queryId but different postsPerPage / renderOffset / renderLimit would incorrectly
        // share a stale, already-sliced result set.
        if ($queryPreset === 'default') {
            $query = \Jankx\Query\DynamicDataLayoutQueryHelper::buildDefaultQuery($sanitizedAttributes);
        } elseif ($queryPreset === 'related') {
            $sanitizedAttributes = \Jankx\Query\DynamicDataLayoutQueryHelper::buildRelatedQuery($sanitizedAttributes);
            $query = $decorator->buildQuery($sanitizedAttributes);
        } else {
            if ($queryPreset !== 'custom') {
                $sanitizedAttributes = \Jankx\Query\DynamicDataLayoutQueryHelper::applyQueryBuilderFilter($sanitizedAttributes, $queryPreset);
            }
            $query = $decorator->buildQuery($sanitizedAttributes);
        }

        // Always clone the query to avoid modifying the original query (especially global $wp_query)
        // and ensure each block has its own independent loop state.
        if ($query instanceof \WP_Query) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('[DDL BlockTemplateRenderer] BEFORE clone');
                error_log(sprintf('[DDL BlockTemplateRenderer] Query object ID: %s', spl_object_hash($query)));
                error_log(sprintf('[DDL BlockTemplateRenderer] Posts count: %d', count($query->posts)));
            }
            $query = clone $query;
            $query->rewind_posts();
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('[DDL BlockTemplateRenderer] AFTER clone');
                error_log(sprintf('[DDL BlockTemplateRenderer] Query object ID: %s', spl_object_hash($query)));
                error_log(sprintf('[DDL BlockTemplateRenderer] Posts count: %d', count($query->posts)));
            }
        }

        if (!$query || !$query->have_posts()) {
            return $this->renderEmptyState($sanitizedAttributes);
        }

        // Slice posts if renderOffset or renderLimit is set
        $renderOffset = isset($sanitizedAttributes['renderOffset']) ? (int)$sanitizedAttributes['renderOffset'] : 0;
        $renderLimit = isset($sanitizedAttributes['renderLimit']) ? (int)$sanitizedAttributes['renderLimit'] : 0;

        if ($renderOffset > 0 || $renderLimit > 0) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('[DDL BlockTemplateRenderer] BEFORE slicing');
                error_log(sprintf('[DDL BlockTemplateRenderer] renderOffset: %d, renderLimit: %d', $renderOffset, $renderLimit));
                error_log(sprintf('[DDL BlockTemplateRenderer] Posts count before slice: %d', count($query->posts)));
            }
            $sliceLimit = $renderLimit > 0 ? $renderLimit : null;
            $query->posts = array_slice($query->posts, $renderOffset, $sliceLimit);
            $query->post_count = count($query->posts);
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('[DDL BlockTemplateRenderer] AFTER slicing');
                error_log(sprintf('[DDL BlockTemplateRenderer] Posts count after slice: %d', count($query->posts)));
            }

            // Update found_posts and max_num_pages to reflect the sliced set
            // This ensures pagination and other logic correctly handle the subset
            if ($renderLimit > 0) {
                $query->found_posts = min($query->found_posts, $query->post_count);
            } else {
                $query->found_posts = max(0, $query->found_posts - $renderOffset);
            }
            
            $postsPerPage = $query->get('posts_per_page') ?: get_option('posts_per_page');
            if ($postsPerPage > 0) {
                $query->max_num_pages = ceil($query->found_posts / $postsPerPage);
            }

            // Reset loop pointers again after slicing
            $query->rewind_posts();
        }

        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('[DDL BlockTemplateRenderer] Setting query to layout');
            error_log(sprintf('[DDL BlockTemplateRenderer] Query object ID being set: %s', spl_object_hash($query)));
            error_log(sprintf('[DDL BlockTemplateRenderer] Posts count being set: %d', count($query->posts)));
        }
        $layout->setQuery($query);
        $layout->setOptions($sanitizedAttributes);

        // Handle template block
        $templateBlock = $this->extractTemplateBlock($block instanceof \WP_Block ? ($block->parsed_block ?? []) : $attributes);
        if ($templateBlock) {
            $sanitizedTemplate = ($this->templateSanitizer)($templateBlock);
            if ($sanitizedTemplate) {
                $layout->setOptions(array_merge($sanitizedAttributes, [
                    'postTemplate' => $sanitizedTemplate
                ]));
            }
        }

        $renderedContent = $layout->render();

        // Reset global $post to prevent our layout query from affecting the main page logic
        wp_reset_postdata();

        // Check if global $wp_query was affected after rendering
        if (defined('WP_DEBUG') && WP_DEBUG) {
            global $wp_query;
            error_log('[DDL BlockTemplateRenderer] AFTER layout->render()');
            error_log(sprintf('[DDL BlockTemplateRenderer] Global $wp_query post_count: %d', $wp_query->post_count));
            error_log(sprintf('[DDL BlockTemplateRenderer] Local query post_count: %d', $query->post_count));
        }

        if (!empty($sanitizedAttributes['enablePagination']) && $renderedContent !== '' && $query->max_num_pages > 1) {
            $renderedContent .= PaginationRenderer::render($content, $query, $sanitizedAttributes);
        }

        // Enqueue carousel assets if needed
        if ($this->carouselAssetsCallback && $layoutName === 'carousel') {
            call_user_func($this->carouselAssetsCallback);
        }

        // Add debug info for developers
        if (defined('WP_DEBUG') && WP_DEBUG) {
            $renderedContent .= sprintf(
                '<!-- DDL Debug: Offset=%d, Limit=%d, OriginalCount=%d, RenderedCount=%d, Preset=%s -->',
                $renderOffset,
                $renderLimit,
                count($query->posts) + $renderOffset, // Approximation
                count($query->posts),
                $queryPreset
            );
        }

        return $renderedContent;
    }

    protected function extractTemplateBlock(array $attributes): ?array
    {
        return call_user_func($this->templateBlockExtractor, $attributes);
    }

    protected function renderEmptyState(array $attributes): string
    {
        $emptyMessage = $attributes['emptyMessage'] ?? __('No posts found.', 'jankx');
        $showEmptyMessage = $attributes['showEmptyMessage'] ?? true;

        if (!$showEmptyMessage) {
            return '';
        }

        return sprintf(
            '<div class="wp-block-jankx-dynamic-data-layout empty-state">%s</div>',
            esc_html($emptyMessage)
        );
    }

    public function renderPreview(array $attributes): array
    {
        $sanitizedAttributes = $this->attributeSanitizer->sanitize($attributes);
        $layoutName = $sanitizedAttributes['layout'] ?? 'grid';

        $layout = $this->layoutManager->createLayout($layoutName);
        $layout->setOptions($sanitizedAttributes);

        return $layout->renderPreview();
    }
}
