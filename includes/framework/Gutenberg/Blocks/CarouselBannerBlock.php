<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Carousel Banner Block
 *
 * Banner slide for Carousel with customizable styles and links.
 * Supports inner blocks overlaid on top of a background image,
 * enabling rich content (headings, paragraphs, search bars, buttons…)
 * to appear directly on each carousel slide.
 *
 * Layout (3 stacked layers):
 *   1. .embla-banner__image     — background image (position: absolute, z-index: 0)
 *   2. .embla-banner__overlay   — semi-transparent color overlay (z-index: 1)
 *   3. .embla-banner__overlay-content — inner blocks content (z-index: 2)
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class CarouselBannerBlock extends Block
{
    protected $blockId = 'jankx/carousel-banner';

    /**
     * Render the Carousel Banner block
     *
     * @param array       $attributes Block attributes
     * @param string      $content    Rendered inner blocks HTML (supplied by WordPress)
     * @param object|null $block      WP_Block instance
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        // ── Attributes with defaults ────────────────────────────────────────
        $image_id      = $attributes['imageId']      ?? 0;
        $image_url     = $attributes['imageUrl']     ?? '';
        $image_alt     = $attributes['imageAlt']     ?? '';
        $link_url      = $attributes['linkUrl']      ?? '';
        $link_target   = $attributes['linkTarget']   ?? '_self';
        $banner_style  = $attributes['bannerStyle']  ?? 'banner';
        $overlay_opacity = $attributes['overlayOpacity'] ?? 0.3;
        $overlay_color   = $attributes['overlayColor']   ?? '#000000';
        $text_align    = $attributes['textAlign']    ?? 'center';
        $text_position = $attributes['textPosition'] ?? 'middle';
        $height        = $attributes['height']       ?? 0;
        $image_size    = $attributes['imageSize']    ?? 'cover';
        $class_name    = $attributes['className']    ?? '';

        // ── Resolve image URL/alt from attachment ID if needed ──────────────
        if ($image_id > 0 && empty($image_url)) {
            $image_url = wp_get_attachment_image_url($image_id, 'full') ?: '';
            if (empty($image_alt)) {
                $image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true) ?: '';
            }
        }

        // ── Build outer wrapper classes ─────────────────────────────────────
        $wrapper_classes = array_filter([
            'embla__slide',
            'wp-block-jankx-carousel-banner',
            'embla-banner',
            'embla-banner--' . sanitize_html_class($banner_style),
            'text-' . sanitize_html_class($text_align),
            'text-position-' . sanitize_html_class($text_position),
            'image-size-' . sanitize_html_class($image_size),
            $class_name,
        ]);

        // ── Additional inline styles (height for circles variant) ───────────
        $wrapper_style = '';
        if ($height > 0) {
            $wrapper_style = sprintf('--banner-height:%dpx;', (int) $height);
        }

        $block_wrapper_attrs = get_block_wrapper_attributes([
            'class' => implode(' ', $wrapper_classes),
            'style' => $wrapper_style,
        ]);

        // ── Background image styles ─────────────────────────────────────────
        $bg_styles = [];
        if (!empty($image_url)) {
            $bg_styles[] = 'background-image:url(\'' . esc_url($image_url) . '\')';
        }
        switch ($image_size) {
            case 'fullwidth':
                $bg_styles[] = 'background-size:100% 100%';
                $bg_styles[] = 'background-position:center';
                break;
            case 'contain':
                $bg_styles[] = 'background-size:contain';
                break;
            default:
                $bg_styles[] = 'background-size:cover';
                break;
        }

        // ── Overlay styles ──────────────────────────────────────────────────
        $overlay_style = sprintf(
            'background-color:%s;opacity:%s;',
            esc_attr($overlay_color),
            esc_attr(number_format((float) $overlay_opacity, 2, '.', ''))
        );

        // ── Render ──────────────────────────────────────────────────────────
        ob_start();
        ?>
        <div <?php echo $block_wrapper_attrs; ?>>
            <?php if (!empty($link_url)) : ?>
                <a href="<?php echo esc_url($link_url); ?>"
                   target="<?php echo esc_attr($link_target); ?>"
                   class="embla-banner__link"
                   rel="<?php echo $link_target === '_blank' ? 'noopener noreferrer' : ''; ?>"
                   aria-label="<?php echo esc_attr($image_alt); ?>">
            <?php endif; ?>

            <?php /* Layer 1: Background image */ ?>
            <?php if (!empty($image_url)) : ?>
                <div class="embla-banner__image image-size-<?php echo esc_attr($image_size); ?>"
                     style="<?php echo esc_attr(implode(';', $bg_styles)); ?>"
                     role="img"
                     <?php if (!empty($image_alt)) : ?>aria-label="<?php echo esc_attr($image_alt); ?>"<?php endif; ?>
                ></div>
            <?php endif; ?>

            <?php /* Layer 2: Semi-transparent color overlay */ ?>
            <?php if (!empty($image_url) && (float) $overlay_opacity > 0) : ?>
                <div class="embla-banner__overlay"
                     style="<?php echo esc_attr($overlay_style); ?>"
                     aria-hidden="true"></div>
            <?php endif; ?>

            <?php /* Layer 3: Inner blocks (headings, paragraphs, search, buttons…) */ ?>
            <div class="embla-banner__overlay-content">
                <?php echo $content; // Already sanitized by WordPress block rendering ?>
            </div>

            <?php if (!empty($link_url)) : ?>
                </a>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
