<?php

namespace Jankx\Layouts\DynamicDataLayout;

use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateAttributeSanitizer;
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
        $postType = $sanitizedAttributes['postType'] ?? 'post';
        $postsPerPage = (int) ($sanitizedAttributes['postsPerPage'] ?? 10);
        $paged = (int) ($sanitizedAttributes['paged'] ?? 1);

        $queryArgs = [
            'post_type' => $postType,
            'post_status' => 'publish',
            'posts_per_page' => $postsPerPage,
            'paged' => $paged,
        ];

        // Apply filters
        $queryArgs = apply_filters('jankx_block_template_query_args', $queryArgs, $sanitizedAttributes);

        $query = new \WP_Query($queryArgs);

        if (!$query->have_posts()) {
            return $this->renderEmptyState($sanitizedAttributes);
        }

        $layout = $this->layoutManager->createLayout($layoutName);
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

        // Enqueue carousel assets if needed
        if ($this->carouselAssetsCallback && $layoutName === 'carousel') {
            call_user_func($this->carouselAssetsCallback);
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
