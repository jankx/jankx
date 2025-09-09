<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Image Masonry Gallery Block
 *
 * This block displays images in a masonry gallery layout
 * with responsive columns and lightbox support.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class ImageMasonryGalleryBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/image-masonry-gallery';

    /**
     * Block attributes
     *
     * @var array
     */
    protected $attributes = [];

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();

        // Enqueue external libraries
        add_action('enqueue_block_assets', [$this, 'enqueueExternalLibraries']);
    }

    /**
     * Enqueue external libraries for masonry gallery
     */
    public function enqueueExternalLibraries()
    {
        // Get theme directory URL
        $theme_url = get_template_directory_uri();

        // Enqueue Magnific Popup CSS
        wp_enqueue_style(
            'jankx-magnific-popup-css',
            $theme_url . '/resources/assets/libs/masonry-gallery/css/magnific-popup.css',
            [],
            '1.0.0',
            'all'
        );

        // Enqueue Magnific Popup JS
        wp_enqueue_script(
            'jankx-magnific-popup-js',
            $theme_url . '/resources/assets/libs/masonry-gallery/js/jquery.magnific-popup.min.js',
            ['jquery'],
            '1.0.0',
            true
        );

        // Enqueue custom lightbox JS
        wp_enqueue_script(
            'jankx-masonry-lightbox',
            $theme_url . '/resources/assets/libs/masonry-gallery/js/lightbox.js',
            ['jquery', 'jankx-magnific-popup-js'],
            '1.0.0',
            true
        );
    }

    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '')
    {
        // Store attributes for use in other methods
        $this->attributes = $attributes;

        $galleryId = $attributes['galleryId'] ?? '';
        $images = $attributes['images'] ?? [];
        $deskCol = $attributes['deskCol'] ?? 3;
        $tabCol = $attributes['tabCol'] ?? 2;
        $phoneCol = $attributes['phoneCol'] ?? 1;
        $deskGap = $attributes['deskGap'] ?? 10;
        $tabGap = $attributes['tabGap'] ?? 10;
        $phoneGap = $attributes['phoneGap'] ?? 5;
        $enableLightbox = $attributes['enableLightbox'] ?? true;
        $imageHoverEffect = $attributes['imageHoverEffect'] ?? 'none';
        $className = $attributes['className'] ?? '';

        if (empty($images)) {
            return $this->renderPlaceholder();
        }

        // Build wrapper classes
        $wrapperClasses = [
            'wp-block-jankx-image-masonry-gallery',
            "dc__{$deskCol}",
            "tc__{$tabCol}",
            "pc__{$phoneCol}",
            "dg__{$deskGap}",
            "tg__{$tabGap}",
            "pg__{$phoneGap}"
        ];

        if (!empty($className)) {
            $wrapperClasses[] = $className;
        }

        // Build gallery HTML
        $galleryHtml = $this->renderGallery($images, $enableLightbox, $imageHoverEffect, $deskGap, $tabGap, $phoneGap);

        return sprintf(
            '<div class="%s" data-id="%s" id="%s">%s</div>',
            esc_attr(implode(' ', $wrapperClasses)),
            esc_attr($galleryId),
            esc_attr($galleryId),
            $galleryHtml
        );
    }

    /**
     * Render gallery images
     *
     * @param array $images Gallery images
     * @param bool $enableLightbox Enable lightbox
     * @param string $imageHoverEffect Hover effect
     * @param int $deskGap Desktop gap
     * @param int $tabGap Tablet gap
     * @param int $phoneGap Phone gap
     * @return string HTML
     */
    protected function renderGallery($images, $enableLightbox, $imageHoverEffect, $deskGap, $tabGap, $phoneGap)
    {
        $html = '';

        foreach ($images as $image) {
            $imageClasses = [
                'single-gallery-image',
                $imageHoverEffect,
                "dg__{$deskGap}",
                "tg__{$tabGap}",
                "pg__{$phoneGap}"
            ];

            $imageHtml = sprintf(
                '<img src="%s" alt="%s" class="wp-image-%d" />',
                esc_url($image['url']),
                esc_attr($image['alt'] ?: __('Gallery Image', 'jankx')),
                esc_attr($image['id'])
            );

            if ($enableLightbox) {
                $html .= sprintf(
                    '<a class="%s" href="%s">%s</a>',
                    esc_attr(implode(' ', $imageClasses)),
                    esc_url($image['url']),
                    $imageHtml
                );
            } else {
                $html .= sprintf(
                    '<div class="%s">%s</div>',
                    esc_attr(implode(' ', $imageClasses)),
                    $imageHtml
                );
            }
        }

        return $html;
    }

    /**
     * Render placeholder when no images
     *
     * @return string
     */
    protected function renderPlaceholder()
    {
        return '<div class="masonry-gallery-placeholder">' .
               '<p>' . __('No images selected. Please add images to the gallery.', 'jankx') . '</p>' .
               '</div>';
    }
}
