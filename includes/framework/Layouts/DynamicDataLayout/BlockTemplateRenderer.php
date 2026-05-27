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

    public function __construct(
        BlockTemplateLayoutManager $layoutManager,
        BlockTemplateAttributeSanitizer $attributeSanitizer,
        callable $templateBlockExtractor,
        callable $templateSanitizer,
        callable $carouselAssetsCallback = null
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
        $query = clone $query;
        $query->rewind_posts();

        if (!$query->have_posts()) {
            return $this->renderEmptyState($sanitizedAttributes);
        }

        // Slice posts if renderOffset or renderLimit is set
        $renderOffset = isset($sanitizedAttributes['renderOffset']) ? (int)$sanitizedAttributes['renderOffset'] : 0;
        $renderLimit = isset($sanitizedAttributes['renderLimit']) ? (int)$sanitizedAttributes['renderLimit'] : 0;

        if ($renderOffset > 0 || $renderLimit > 0) {
            $sliceLimit = $renderLimit > 0 ? $renderLimit : null;
            $query->posts = array_slice($query->posts, $renderOffset, $sliceLimit);
            $query->post_count = count($query->posts);

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
