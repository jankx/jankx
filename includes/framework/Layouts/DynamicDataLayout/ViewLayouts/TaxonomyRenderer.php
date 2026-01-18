<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewLayoutManager;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewAttributeSanitizer;
use Jankx\Layouts\DynamicDataLayout\Generators\DefaultTaxonomyContentGenerator;
use WP_Term_Query;

class TaxonomyRenderer
{
    protected $layoutManager;
    protected $attributeSanitizer;
    protected $templateBlockExtractor;
    protected $templateSanitizer;

    public function __construct(
        ViewLayoutManager $layoutManager,
        ViewAttributeSanitizer $attributeSanitizer,
        callable $templateBlockExtractor,
        callable $templateSanitizer
    ) {
        $this->layoutManager = $layoutManager;
        $this->attributeSanitizer = $attributeSanitizer;
        $this->templateBlockExtractor = $templateBlockExtractor;
        $this->templateSanitizer = $templateSanitizer;
    }

    public function render(array $attributes, string $content = '', $block = null): string
    {
        $sanitizedAttributes = $this->attributeSanitizer->sanitize($attributes);

        $layoutName = $sanitizedAttributes['layout'] ?? 'grid';
        $taxonomy = $sanitizedAttributes['taxonomy'] ?? 'category';
        $postsPerPage = (int) ($sanitizedAttributes['postsPerPage'] ?? 10);

        $queryArgs = [
            'taxonomy' => $taxonomy,
            'hide_empty' => false,
            'number' => $postsPerPage,
        ];

        // Apply filters
        $queryArgs = apply_filters('jankx_taxonomy_layout_query_args', $queryArgs, $sanitizedAttributes);

        $query = new WP_Term_Query($queryArgs);
        $terms = $query->get_terms();

        if (empty($terms)) {
            return $this->renderEmptyState($sanitizedAttributes);
        }

        $layout = $this->layoutManager->createLayout($layoutName);
        $layout->setOptions($sanitizedAttributes);

        // Handle template block
        $templateBlock = $this->extractTemplateBlock($attributes);
        if ($templateBlock) {
            $sanitizedTemplate = ($this->templateSanitizer)($templateBlock);
            if ($sanitizedTemplate) {
                $generator = new DefaultTaxonomyContentGenerator($sanitizedTemplate, $sanitizedAttributes);
                $layout->setContentGenerator($generator);
            }
        }

        $layout->setQuery($terms);

        return $layout->render();
    }

    protected function extractTemplateBlock(array $attributes): ?array
    {
        return call_user_func($this->templateBlockExtractor, $attributes);
    }

    protected function renderEmptyState(array $attributes): string
    {
        $emptyMessage = $attributes['emptyMessage'] ?? __('No terms found.', 'jankx');
        return sprintf(
            '<div class="wp-block-jankx-term-layout empty-state">%s</div>',
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
