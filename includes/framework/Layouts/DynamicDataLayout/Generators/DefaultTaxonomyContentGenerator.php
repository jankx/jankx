<?php

namespace Jankx\Layouts\DynamicDataLayout\Generators;

use Jankx\Layouts\DynamicDataLayout\Generators\AbstractContentGenerator;
use Jankx\Layouts\DynamicDataLayout\Generators\Concerns\PostTemplateRendererTrait;
use WP_Term;
use WP_Block;
use WP_Query;
use Jankx\Facades\Log;

class DefaultTaxonomyContentGenerator extends AbstractContentGenerator
{
    protected array $templateBlock;
    protected array $parentAttributes;
    protected array $runtimeOptions = [];
    protected string $currentLayout = '';

    public function __construct(array $templateBlock, array $parentAttributes = [])
    {
        $this->templateBlock = $templateBlock;
        $this->parentAttributes = $parentAttributes;
    }

    public function getName(): string
    {
        return 'default-taxonomy-content-generator';
    }

    public function getTitle(): string
    {
        return __('Default Taxonomy Content Generator', 'jankx');
    }

    /**
     * Generate content for terms
     *
     * @param mixed $query In this generator, $query is expected to be an array of WP_Term or WP_Term_Query
     * @param array $options
     * @return string
     */
    public function generate($query, array $options = []): string
    {
        return $this->renderContent($query, $options);
    }

    protected function renderContent($query, array $options = []): string
    {
        $terms = [];
        if (is_array($query)) {
            $terms = $query;
        } elseif ($query instanceof \WP_Term_Query) {
            $terms = $query->get_terms();
        }

        if (empty($terms)) {
            return '';
        }

        $this->runtimeOptions = $options;
        $layoutType = $options['layout'] ?? 'grid';
        $this->currentLayout = $layoutType;

        $items = '';
        foreach ($terms as $term) {
            if ($term instanceof WP_Term) {
                $items .= $this->renderTemplateForTerm($term, $options);
            }
        }

        if ($items === '') {
            return '';
        }

        $wrapperAttributes = $this->buildWrapperAttributes($options);
        return sprintf('<div %s>%s</div>', $this->stringifyAttributes($wrapperAttributes), $items);
    }

    protected function renderTemplateForTerm(WP_Term $term, array $options): string
    {
        $context = $this->buildBlockContext($term, $options);
        $innerBlocks = $this->templateBlock['innerBlocks'] ?? [];

        if (empty($innerBlocks)) {
            // Default term rendering if no blocks provided
            return sprintf('<div class="term-item"><h3>%s</h3></div>', esc_html($term->name));
        }

        $output = '';
        foreach ($innerBlocks as $innerBlock) {
            $normalizedBlock = [
                'blockName' => $innerBlock['blockName'] ?? '',
                'attrs' => is_array($innerBlock['attrs'] ?? null) ? $innerBlock['attrs'] : [],
                'innerBlocks' => is_array($innerBlock['innerBlocks'] ?? null) ? $innerBlock['innerBlocks'] : [],
                'innerContent' => is_array($innerBlock['innerContent'] ?? null) ? $innerBlock['innerContent'] : [],
            ];

            // Map term attributes to core blocks if needed
            if ($normalizedBlock['blockName'] === 'core/post-title') {
                $normalizedBlock['attrs']['title'] = $term->name;
            }

            $blockInstance = new WP_Block($normalizedBlock, $context);
            $output .= $blockInstance->render();
        }

        $classes = $this->buildItemClasses($term);
        return sprintf('<div class="%s">%s</div>', esc_attr($classes), $output);
    }

    protected function buildBlockContext(WP_Term $term, array $options): array
    {
        return [
            'taxonomy' => $term->taxonomy,
            'termId' => $term->term_id,
            'queryId' => $options['queryId'] ?? '',
            'isTerm' => true,
            'term' => $term,
        ];
    }

    protected function buildItemClasses(WP_Term $term): string
    {
        $classes = ['term-item', 'term-' . $term->term_id, 'taxonomy-' . $term->taxonomy];

        $templateAttrs = $this->templateBlock['attrs'] ?? [];
        if (!empty($templateAttrs['contentLoopLayout'])) {
            $classes[] = 'content-loop-layout--' . sanitize_html_class($templateAttrs['contentLoopLayout']);
        }

        return implode(' ', array_unique(array_filter(array_map('sanitize_html_class', $classes))));
    }

    protected function buildWrapperAttributes(array $options): array
    {
        $classes = ['taxonomy-layout', 'layout-' . ($options['layout'] ?? 'grid')];

        $columns = (int) ($options['columns'] ?? 3);
        if ($columns > 0) {
            $classes[] = 'columns-' . $columns;
        }

        $tablet = (int) ($options['columnsTablet'] ?? 2);
        if ($tablet > 0) {
            $classes[] = 'columns-tablet-' . $tablet;
        }

        $mobile = (int) ($options['columnsMobile'] ?? 1);
        if ($mobile > 0) {
            $classes[] = 'columns-mobile-' . $mobile;
        }

        return [
            'class' => implode(' ', $classes),
            'data-layout' => $options['layout'] ?? 'grid',
            'data-taxonomy' => $options['taxonomy'] ?? '',
        ];
    }

    protected function stringifyAttributes(array $attributes): string
    {
        $parts = [];
        foreach ($attributes as $name => $value) {
            $parts[] = sprintf('%s="%s"', esc_attr($name), esc_attr($value));
        }
        return implode(' ', $parts);
    }

    protected function renderPreviewContent(array $options = []): array
    {
        return [
            'generator' => $this->getName(),
            'layout' => $options['layout'] ?? 'grid',
            'columns' => $options['columns'] ?? 3,
        ];
    }
}
