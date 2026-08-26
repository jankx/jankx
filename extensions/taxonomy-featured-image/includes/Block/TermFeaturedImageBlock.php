<?php

namespace Jankx\Extensions\TaxonomyFeaturedImage\Block;

use Jankx\Extensions\TaxonomyFeaturedImage\Services\TaxonomyImageService;
use WP_Block;
use WP_Term;

/**
 * Renderer for the jankx/term-featured-image block.
 *
 * Resolves the current term in this order:
 *  1. Block context (`termId` provided by Dynamic Term Template loops)
 *  2. Explicit `termId` attribute (static usage)
 *  3. Current queried object (taxonomy archive templates)
 *  4. `jankx/term-featured-image/current-term` filter
 */
class TermFeaturedImageBlock
{
    private static ?self $instance = null;

    protected ?TaxonomyImageService $service = null;

    public static function instance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * Register the block type from its block.json with a PHP render callback.
     */
    public function register(): void
    {
        $blockDir = dirname(__DIR__, 2) . '/blocks/term-featured-image';

        if (!is_dir($blockDir) || !file_exists($blockDir . '/block.json')) {
            return;
        }

        if (\WP_Block_Type_Registry::get_instance()->is_registered('jankx/term-featured-image')) {
            return;
        }

        register_block_type_from_metadata($blockDir, [
            'render_callback' => [$this, 'render'],
        ]);
    }

    protected function getService(): TaxonomyImageService
    {
        if (!$this->service instanceof TaxonomyImageService) {
            $extension = \Jankx\Extensions\TaxonomyFeaturedImage\TaxonomyFeaturedImageExtension::get_instance();
            $this->service = $extension ? $extension->getService() : new TaxonomyImageService();
        }

        return $this->service;
    }

    /**
     * Resolve the term the image should be displayed for.
     */
    public function resolveTerm(array $attributes, ?WP_Block $block): ?WP_Term
    {
        $term = null;

        // 1. Block context from Dynamic Term Template loops.
        $contextTermId = isset($block->context['termId']) ? absint($block->context['termId']) : 0;
        $contextTaxonomy = isset($block->context['taxonomy']) ? \sanitize_key($block->context['taxonomy']) : '';

        if ($contextTermId > 0) {
            $candidate = get_term($contextTermId, $contextTaxonomy ?: '');
            if ($candidate instanceof WP_Term) {
                $term = $candidate;
            }
        }

        // 2. Explicit static attribute.
        if (!$term instanceof WP_Term && !empty($attributes['termId'])) {
            $candidate = get_term(absint($attributes['termId']), $attributes['taxonomy'] ?: '');
            if ($candidate instanceof WP_Term) {
                $term = $candidate;
            }
        }

        // 3. Current queried object on taxonomy archives.
        if (!$term instanceof WP_Term && (is_tax() || is_category() || is_tag())) {
            $queried = get_queried_object();
            if ($queried instanceof WP_Term) {
                $term = $queried;
            }
        }

        // 4. Allow other code (custom loops etc.) to provide the term.
        $term = apply_filters('jankx/term-featured-image/current-term', $term, $attributes, $block);

        return $term instanceof WP_Term ? $term : null;
    }

    /**
     * Render callback.
     */
    public function render(array $attributes, string $content = '', ?WP_Block $block = null): string
    {
        $service = $this->getService();

        if (!$service->isEnabled()) {
            return '';
        }

        $defaults = [
            'imageSize' => 'large',
            'aspectRatio' => '',
            'objectFit' => 'cover',
            'isLink' => true,
            'linkTarget' => '_self',
            'rel' => '',
            'showPlaceholder' => false,
        ];
        $attributes = wp_parse_args($attributes, $defaults);

        $term = $this->resolveTerm($attributes, $block);
        $imageId = $term instanceof WP_Term ? $service->getTermImageId($term) : 0;
        if ($imageId <= 0) {
            $imageId = absint($attributes['defaultImageId'] ?? 0);
        }

        $classes = ['term-featured-image'];
        $inlineStyles = [];

        if (!empty($attributes['aspectRatio'])) {
            $classes[] = 'has-aspect-ratio';
            $inlineStyles[] = sprintf('aspect-ratio: %s;', str_replace('/', ' / ', $attributes['aspectRatio']));
        }

        $imageMarkup = '';

        if ($imageId > 0) {
            $imageClasses = ['term-featured-image__img'];

            if (!empty($attributes['aspectRatio'])) {
                $imageClasses[] = sprintf('object-fit--%s', sanitize_html_class($attributes['objectFit']));
            }

            $imageMarkup = wp_get_attachment_image($imageId, $attributes['imageSize'], false, [
                'class' => implode(' ', $imageClasses),
            ]);
        } elseif (!empty($attributes['showPlaceholder'])) {
            $imageMarkup = sprintf(
                '<span class="term-featured-image__placeholder"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true" focusable="false"><path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v9.586l3-3L12 15l3.5-4.5L18 13V6H6zm0 12h12v-.414l-3.293-3.293-1.207 1.55L10 11.914l-4 4V18z"/></svg></span>'
            );
        } else {
            return '';
        }

        $wrapperAttributes = get_block_wrapper_attributes([
            'class' => implode(' ', array_map('sanitize_html_class', $classes)),
            'style' => safecss_filter_attr(implode(' ', $inlineStyles)),
        ]);

        if (!empty($attributes['isLink']) && $term instanceof WP_Term) {
            $link = get_term_link($term);

            if (!is_wp_error($link)) {
                $rel = trim((string) $attributes['rel']);
                $linkAttributes = sprintf(
                    'href="%s" target="%s"%s',
                    esc_url($link),
                    esc_attr($attributes['linkTarget'] === '_blank' ? '_blank' : '_self'),
                    $rel !== '' ? sprintf(' rel="%s"', esc_attr($rel)) : ''
                );

                return sprintf(
                    '<div %1$s><a class="term-featured-image__link" %2$s>%3$s</a></div>',
                    $wrapperAttributes,
                    $linkAttributes,
                    $imageMarkup
                );
            }
        }

        return sprintf('<div %1$s>%2$s</div>', $wrapperAttributes, $imageMarkup);
    }
}
