<?php

namespace Jankx\Layouts\DynamicDataLayout;

use Jankx\Layouts\DynamicDataLayout\BlockTemplateAttributeSanitizer;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutDecorator;
use Jankx\Layouts\DynamicDataLayout\Generators\TermTemplateBlockGenerator;
use WP_Term_Query;

/**
 * Renderer for the term layout blocks.
 *
 * Builds a WP_Term_Query from the (already sanitized) block attributes and
 * reuses the exact same BlockTemplateLayout pipeline (grid/list/card/
 * carousel/masonry) as the post-based renderer. The term list is handed to
 * the layout as a plain array of WP_Term objects so the layouts themselves
 * do not need any modification.
 */
class TermBlockTemplateRenderer extends BlockTemplateRenderer
{
    public function render(array $attributes, string $content = '', $block = null): string
    {
        $sanitizedAttributes = $this->attributeSanitizer->sanitize($attributes);

        $layoutName = $sanitizedAttributes['layout'] ?? 'grid';
        $layout = $this->layoutManager->createLayout($layoutName);
        $decorator = new BlockTemplateLayoutDecorator($layout);
        $decorator->withAttributes($sanitizedAttributes);

        $query = $this->buildTermQuery($sanitizedAttributes);
        $terms = $query->get_terms();

        if (is_wp_error($terms) || empty($terms)) {
            return $this->renderEmptyState($sanitizedAttributes);
        }

        // Apply renderOffset/renderLimit on the fetched term list
        $renderOffset = (int) ($sanitizedAttributes['renderOffset'] ?? 0);
        $renderLimit = (int) ($sanitizedAttributes['renderLimit'] ?? 0);
        if ($renderOffset > 0 || $renderLimit > 0) {
            $terms = array_slice($terms, $renderOffset, $renderLimit > 0 ? $renderLimit : null);
            if (empty($terms)) {
                return $this->renderEmptyState($sanitizedAttributes);
            }
        }

        $layout->setQuery($terms);
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

        // Always render terms through the term generator
        $layout->setContentGenerator(new TermTemplateBlockGenerator([], $sanitizedAttributes));

        $renderedContent = $layout->render();

        // Enqueue carousel assets if needed
        if ($this->carouselAssetsCallback && $layoutName === 'carousel') {
            call_user_func($this->carouselAssetsCallback);
        }

        return $renderedContent;
    }

    public function renderPreview(array $attributes): array
    {
        $sanitizedAttributes = $this->attributeSanitizer->sanitize($attributes);
        $layoutName = $sanitizedAttributes['layout'] ?? 'grid';

        $layout = $this->layoutManager->createLayout($layoutName);
        $layout->setOptions($sanitizedAttributes);
        $layout->setContentGenerator(new TermTemplateBlockGenerator([], $sanitizedAttributes));

        return $layout->renderPreview();
    }

    /**
     * Build a WP_Term_Query from the sanitized block attributes.
     *
     * @param array $attributes Sanitized attributes
     * @return WP_Term_Query
     */
    protected function buildTermQuery(array $attributes): WP_Term_Query
    {
        $args = [
            'taxonomy' => $attributes['taxonomy'] ?? 'category',
            'hide_empty' => !empty($attributes['hideEmpty']),
            'number' => (int) ($attributes['number'] ?? 10),
            'orderby' => $attributes['orderBy'] ?? 'name',
            'order' => $attributes['order'] ?? 'ASC',
        ];

        if (!empty($attributes['termIn'])) {
            $args['include'] = (array) $attributes['termIn'];
        }

        if (!empty($attributes['termNotIn'])) {
            $args['exclude'] = (array) $attributes['termNotIn'];
        }

        if (!empty($attributes['termParent'])) {
            $args['parent'] = (int) $attributes['termParent'];
        }

        if (!empty($attributes['keyword'])) {
            $args['search'] = $attributes['keyword'];
        }

        $args = apply_filters('jankx/dynamic-term-layout/query_args', $args, $attributes);

        return new WP_Term_Query($args);
    }

    protected function renderEmptyState(array $attributes): string
    {
        $emptyMessage = $attributes['emptyMessage'] ?? __('No terms found.', 'jankx');
        $showEmptyMessage = $attributes['showEmptyMessage'] ?? true;

        if (!$showEmptyMessage) {
            return '';
        }

        return sprintf(
            '<div class="wp-block-jankx-dynamic-term-layout empty-state">%s</div>',
            esc_html($emptyMessage)
        );
    }
}
