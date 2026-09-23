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
 *  2. Current queried object (taxonomy archive templates)
 *  3. `jankx/term-featured-image/current-term` filter
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

        // 2. Current queried object on taxonomy archives.
        if (!$term instanceof WP_Term && (is_tax() || is_category() || is_tag())) {
            $queried = get_queried_object();
            if ($queried instanceof WP_Term) {
                $term = $queried;
            }
        }

        // 3. Allow other code (custom loops etc.) to provide the term.
        $term = apply_filters('jankx/term-featured-image/current-term', $term, $attributes, $block);

        return $term instanceof WP_Term ? $term : null;
    }

    /**
     * Render callback — mirrors core/post-featured-image server-side rendering.
     */
    public function render(array $attributes, string $content = '', ?WP_Block $block = null): string
    {
        $service = $this->getService();

        if (!$service->isEnabled()) {
            return '';
        }

        $defaults = [
            'isLink'      => true,
            'sizeSlug'    => 'large',
            'aspectRatio' => '',
            'width'       => '',
            'height'      => '',
            'scale'       => 'cover',
            'rel'         => '',
            'linkTarget'  => '_self',
        ];
        $attributes = wp_parse_args($attributes, $defaults);

        $term = $this->resolveTerm($attributes, $block);
        if (!$term instanceof WP_Term) {
            return '';
        }

        $imageId = $service->getTermImageId($term);
        if ($imageId <= 0) {
            return '';
        }

        $isLink       = !empty($attributes['isLink']);
        $sizeSlug     = $attributes['sizeSlug'] ?: 'large';
        $borderAttr   = $this->get_border_attributes($attributes);
        $overlayMarkup = $this->get_overlay_element_markup($attributes);

        // Build image attributes.
        $attr = [];
        if (!empty($borderAttr['class'])) {
            $attr['class'] = $borderAttr['class'];
        }

        // Extra styles for aspect ratio, dimensions, scale, shadow.
        $extraStyles = '';
        if (!empty($attributes['aspectRatio'])) {
            $extraStyles .= 'width:100%;height:100%;';
        } elseif (!empty($attributes['height'])) {
            $extraStyles .= 'height:' . $attributes['height'] . ';';
        }
        if (!empty($attributes['width'])) {
            $extraStyles .= 'width:' . $attributes['width'] . ';';
        }
        if (!empty($attributes['scale'])) {
            $extraStyles .= 'object-fit:' . $attributes['scale'] . ';';
        }
        if (!empty($attributes['style']['shadow'])) {
            $shadowStyles = wp_style_engine_get_styles(['shadow' => $attributes['style']['shadow']]);
            if (!empty($shadowStyles['css'])) {
                $extraStyles .= $shadowStyles['css'];
            }
        }
        if (!empty($borderAttr['style'])) {
            $extraStyles .= $borderAttr['style'];
        }
        if (!empty($extraStyles)) {
            $attr['style'] = $extraStyles;
        }

        $featuredImage = wp_get_attachment_image($imageId, $sizeSlug, false, $attr);

        if (!$featuredImage) {
            return '';
        }

        if ($isLink) {
            $link       = get_term_link($term);
            $linkTarget = $attributes['linkTarget'];
            $rel        = !empty($attributes['rel']) ? 'rel="' . esc_attr($attributes['rel']) . '"' : '';
            $height     = !empty($attributes['height']) ? 'style="' . esc_attr(safecss_filter_attr('height:' . $attributes['height'])) . '"' : '';

            if (!is_wp_error($link)) {
                $featuredImage = sprintf(
                    '<a href="%1$s" target="%2$s" %3$s %4$s>%5$s%6$s</a>',
                    esc_url($link),
                    esc_attr($linkTarget),
                    $rel,
                    $height,
                    $featuredImage,
                    $overlayMarkup
                );
            }
        } else {
            $featuredImage = $featuredImage . $overlayMarkup;
        }

        // Wrapper attributes (aspect ratio, width, height).
        $aspectRatio = !empty($attributes['aspectRatio'])
            ? esc_attr(safecss_filter_attr('aspect-ratio:' . $attributes['aspectRatio'])) . ';'
            : '';
        $w           = !empty($attributes['width'])
            ? esc_attr(safecss_filter_attr('width:' . $attributes['width'])) . ';'
            : '';
        $h           = !empty($attributes['height'])
            ? esc_attr(safecss_filter_attr('height:' . $attributes['height'])) . ';'
            : '';

        if (!$h && !$w && !$aspectRatio) {
            $wrapperAttributes = get_block_wrapper_attributes();
        } else {
            $wrapperAttributes = get_block_wrapper_attributes(['style' => $aspectRatio . $w . $h]);
        }

        return sprintf('<figure %1$s>%2$s</figure>', $wrapperAttributes, $featuredImage);
    }

    /**
     * Generate overlay markup — mirrors core/post-featured-image.
     */
    protected function get_overlay_element_markup(array $attributes): string
    {
        $hasDimBackground  = isset($attributes['dimRatio']) && $attributes['dimRatio'];
        $hasGradient       = isset($attributes['gradient']) && $attributes['gradient'];
        $hasCustomGradient = isset($attributes['customGradient']) && $attributes['customGradient'];
        $hasSolidOverlay   = isset($attributes['overlayColor']) && $attributes['overlayColor'];
        $hasCustomOverlay  = isset($attributes['customOverlayColor']) && $attributes['customOverlayColor'];
        $classNames        = ['wp-block-jankx-term-featured-image__overlay'];
        $styles           = [];

        if (!$hasDimBackground) {
            return '';
        }

        $borderAttributes = $this->get_border_attributes($attributes);
        if (!empty($borderAttributes['class'])) {
            $classNames[] = $borderAttributes['class'];
        }
        if (!empty($borderAttributes['style'])) {
            $styles[] = $borderAttributes['style'];
        }

        if ($hasDimBackground) {
            $classNames[] = 'has-background-dim';
            $classNames[] = 'has-background-dim-' . $attributes['dimRatio'];
        }
        if ($hasSolidOverlay) {
            $classNames[] = 'has-' . $attributes['overlayColor'] . '-background-color';
        }
        if ($hasGradient || $hasCustomGradient) {
            $classNames[] = 'has-background-gradient';
        }
        if ($hasGradient) {
            $classNames[] = 'has-' . $attributes['gradient'] . '-gradient-background';
        }

        if ($hasCustomGradient) {
            $styles[] = 'background-image: ' . $attributes['customGradient'] . ';';
        }
        if ($hasCustomOverlay) {
            $styles[] = 'background-color: ' . $attributes['customOverlayColor'] . ';';
        }

        return sprintf(
            '<span class="%s" style="%s" aria-hidden="true"></span>',
            esc_attr(implode(' ', $classNames)),
            esc_attr(safecss_filter_attr(implode(' ', $styles)))
        );
    }

    /**
     * Generate border attributes — mirrors core/post-featured-image.
     */
    protected function get_border_attributes(array $attributes): array
    {
        $borderStyles = [];
        $sides        = ['top', 'right', 'bottom', 'left'];

        if (isset($attributes['style']['border']['radius'])) {
            $borderStyles['radius'] = $attributes['style']['border']['radius'];
        }
        if (isset($attributes['style']['border']['style'])) {
            $borderStyles['style'] = $attributes['style']['border']['style'];
        }
        if (isset($attributes['style']['border']['width'])) {
            $borderStyles['width'] = $attributes['style']['border']['width'];
        }

        $presetColor           = array_key_exists('borderColor', $attributes)
            ? 'var:preset|color|' . $attributes['borderColor']
            : null;
        $customColor           = $attributes['style']['border']['color'] ?? null;
        $borderStyles['color'] = $presetColor ?: $customColor;

        foreach ($sides as $side) {
            $border              = $attributes['style']['border'][$side] ?? null;
            $borderStyles[$side] = [
                'color' => $border['color'] ?? null,
                'style' => $border['style'] ?? null,
                'width' => $border['width'] ?? null,
            ];
        }

        $styles    = wp_style_engine_get_styles(['border' => $borderStyles]);
        $result   = [];
        if (!empty($styles['classnames'])) {
            $result['class'] = $styles['classnames'];
        }
        if (!empty($styles['css'])) {
            $result['style'] = $styles['css'];
        }
        return $result;
    }
}
