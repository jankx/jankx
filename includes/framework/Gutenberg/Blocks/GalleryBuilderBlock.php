<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Gallery Builder Block
 *
 * This block creates a professional gallery viewer with slideshow,
 * navigation controls, and rich content editing capabilities.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class GalleryBuilderBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/gallery-builder';

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
     * Enqueue external libraries for gallery builder
     */
    public function enqueueExternalLibraries()
    {
        // Get theme directory URL
        $theme_url = get_template_directory_uri();

        // Enqueue Swiper CSS
        wp_enqueue_style(
            'jankx-swiper-css',
            $theme_url . '/resources/assets/libs/swiper/swiper-bundle.min.css',
            [],
            '8.4.5',
            'all'
        );

        // Enqueue Swiper JS
        wp_enqueue_script(
            'jankx-swiper-js',
            $theme_url . '/resources/assets/libs/swiper/swiper-bundle.min.js',
            [],
            '8.4.5',
            true
        );

        // Enqueue custom gallery builder JS
        wp_enqueue_script(
            'jankx-gallery-builder',
            $theme_url . '/resources/blocks/gallery-builder/build/view.js',
            ['jankx-swiper-js'],
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
        $items = $attributes['items'] ?? [];
        $autoplay = $attributes['autoplay'] ?? false;
        $autoplayDelay = $attributes['autoplayDelay'] ?? 5000;
        $showThumbnails = $attributes['showThumbnails'] ?? true;
        $showNavigation = $attributes['showNavigation'] ?? true;
        $showPagination = $attributes['showPagination'] ?? true;
        $showCaptions = $attributes['showCaptions'] ?? true;
        $thumbnailPosition = $attributes['thumbnailPosition'] ?? 'top';
        $imageSize = $attributes['imageSize'] ?? 'large';
        $aspectRatio = $attributes['aspectRatio'] ?? '16:9';
        $transitionEffect = $attributes['transitionEffect'] ?? 'slide';
        $transitionDuration = $attributes['transitionDuration'] ?? 500;
        $enableFullscreen = $attributes['enableFullscreen'] ?? true;
        $fullscreenAutoplay = $attributes['fullscreenAutoplay'] ?? true;
        $fullscreenAutoplayDelay = $attributes['fullscreenAutoplayDelay'] ?? 4000;
        $fullscreenText = $attributes['fullscreenText'] ?? '';
        $captionPosition = $attributes['captionPosition'] ?? 'overlay';
        $className = $attributes['className'] ?? '';

        if (empty($items)) {
            return $this->renderPlaceholder();
        }

        // Build wrapper classes
        $aspectRatioClass = str_replace(':', '-', $aspectRatio);
        $wrapperClasses = [
            'wp-block-jankx-gallery-builder',
            "gallery-{$galleryId}",
            "thumbnail-{$thumbnailPosition}",
            "aspect-{$aspectRatioClass}",
            "transition-{$transitionEffect}",
            "caption-{$captionPosition}"
        ];

        if (!empty($className)) {
            $wrapperClasses[] = $className;
        }

        // Build inline styles from WordPress block supports
        $inlineStyles = $this->buildInlineStyles($attributes);

        // Build gallery HTML
        $galleryHtml = $this->renderGallery(
            $items,
            $autoplay,
            $autoplayDelay,
            $showThumbnails,
            $showNavigation,
            $showPagination,
            $showCaptions,
            $thumbnailPosition,
            $imageSize,
            $aspectRatio,
            $transitionEffect,
            $transitionDuration
        );

        return sprintf(
            '<div class="%s" data-gallery-id="%s" id="%s"%s>%s</div>',
            esc_attr(implode(' ', $wrapperClasses)),
            esc_attr($galleryId),
            esc_attr($galleryId),
            $inlineStyles ? ' style="' . esc_attr($inlineStyles) . '"' : '',
            $galleryHtml
        );
    }

    /**
     * Render gallery content
     *
     * @param array $items Gallery items
     * @param bool $autoplay Enable autoplay
     * @param int $autoplayDelay Autoplay delay
     * @param bool $showThumbnails Show thumbnails
     * @param bool $showNavigation Show navigation
     * @param bool $showPagination Show pagination
     * @param bool $showCaptions Show captions
     * @param string $thumbnailPosition Thumbnail position
     * @param string $imageSize Image size
     * @param string $aspectRatio Aspect ratio
     * @param string $transitionEffect Transition effect
     * @param int $transitionDuration Transition duration
     * @return string HTML
     */
    protected function renderGallery(
        $items,
        $autoplay,
        $autoplayDelay,
        $showThumbnails,
        $showNavigation,
        $showPagination,
        $showCaptions,
        $thumbnailPosition,
        $imageSize,
        $aspectRatio,
        $transitionEffect,
        $transitionDuration
    ) {
        $html = '<div class="gallery-builder-container">';

        // Thumbnails Top
        if ($showThumbnails && $thumbnailPosition === 'top') {
            $html .= $this->renderThumbnails($items, 'top');
        }

        // Main Gallery
        $html .= '<div class="gallery-main">';

        // Navigation Arrows
        if ($showNavigation && count($items) > 1) {
            $html .= $this->renderNavigation();
        }

        // Slides Container
        $html .= '<div class="gallery-slides">';
        foreach ($items as $index => $item) {
            $html .= $this->renderSlide($item, $index, $showCaptions, $imageSize);
        }
        $html .= '</div>';

        $html .= '</div>'; // End gallery-main

        // Thumbnails Bottom
        if ($showThumbnails && $thumbnailPosition === 'bottom') {
            $html .= $this->renderThumbnails($items, 'bottom');
        }

        // Pagination
        if ($showPagination && count($items) > 1) {
            $html .= $this->renderPagination($items);
        }

        // Autoplay Controls
        if ($autoplay) {
            $html .= $this->renderAutoplayControls();
        }

        $html .= '</div>'; // End gallery-builder-container

        return $html;
    }

    /**
     * Render thumbnails
     *
     * @param array $items Gallery items
     * @param string $position Position (top/bottom)
     * @return string HTML
     */
    protected function renderThumbnails($items, $position)
    {
        $html = sprintf('<div class="gallery-thumbnails %s">', esc_attr($position));

        foreach ($items as $index => $item) {
            $html .= sprintf(
                '<div class="thumbnail" data-slide="%d">
                    <img src="%s" alt="%s" loading="lazy" />
                </div>',
                $index,
                esc_url($item['url']),
                esc_attr($item['alt'] ?: __('Gallery Image', 'jankx'))
            );
        }

        $html .= '</div>';

        return $html;
    }

    /**
     * Render navigation arrows
     *
     * @return string HTML
     */
    protected function renderNavigation()
    {
        return '<button class="gallery-nav prev" aria-label="' . __('Previous image', 'jankx') . '">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                    </svg>
                </button>
                <button class="gallery-nav next" aria-label="' . __('Next image', 'jankx') . '">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                </button>';
    }

    /**
     * Render single slide
     *
     * @param array $item Slide item
     * @param int $index Slide index
     * @param bool $showCaptions Show captions
     * @param string $imageSize Image size
     * @return string HTML
     */
    protected function renderSlide($item, $index, $showCaptions, $imageSize)
    {
        $activeClass = $index === 0 ? 'active' : '';

        $html = sprintf(
            '<div class="gallery-slide %s" data-slide="%d">
                <div class="slide-image-container">
                    <img src="%s" alt="%s" class="main-image" loading="%s" />
                </div>',
            $activeClass,
            $index,
            esc_url($item['url']),
            esc_attr($item['alt'] ?: __('Gallery Image', 'jankx')),
            $index === 0 ? 'eager' : 'lazy'
        );

        // Caption
        if ($showCaptions && !empty($item['caption'])) {
            $html .= sprintf(
                '<div class="slide-caption">
                    <div class="caption-content">%s</div>
                </div>',
                wp_kses_post($item['caption'])
            );
        }

        $html .= '</div>';

        return $html;
    }

    /**
     * Render pagination
     *
     * @param array $items Gallery items
     * @return string HTML
     */
    protected function renderPagination($items)
    {
        $html = '<div class="gallery-pagination">';

        foreach ($items as $index => $item) {
            $html .= sprintf(
                '<button class="pagination-dot" data-slide="%d" aria-label="%s">
                    %d
                </button>',
                $index,
                sprintf(__('Go to slide %d', 'jankx'), $index + 1),
                $index + 1
            );
        }

        $html .= '</div>';

        return $html;
    }

    /**
     * Render autoplay controls
     *
     * @return string HTML
     */
    protected function renderAutoplayControls()
    {
        return '<div class="autoplay-controls">
                    <button class="autoplay-toggle" aria-label="' . __('Toggle autoplay', 'jankx') . '">
                        <svg class="play-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <svg class="pause-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                    </button>
                </div>';
    }

    /**
     * Build inline styles from WordPress block supports
     *
     * @param array $attributes Block attributes
     * @return string Inline styles
     */
    protected function buildInlineStyles($attributes)
    {
        $styles = [];

        // Background color
        if (!empty($attributes['backgroundColor'])) {
            $styles[] = 'background-color: ' . esc_attr($attributes['backgroundColor']);
        }

        // Text color
        if (!empty($attributes['textColor'])) {
            $styles[] = 'color: ' . esc_attr($attributes['textColor']);
        }

        // Background image
        if (!empty($attributes['backgroundImage'])) {
            $styles[] = 'background-image: url(' . esc_url($attributes['backgroundImage']) . ')';
        }

        // Background position
        if (!empty($attributes['backgroundPosition'])) {
            $styles[] = 'background-position: ' . esc_attr($attributes['backgroundPosition']);
        }

        // Background repeat
        if (!empty($attributes['backgroundRepeat'])) {
            $styles[] = 'background-repeat: ' . esc_attr($attributes['backgroundRepeat']);
        }

        // Background size
        if (!empty($attributes['backgroundSize'])) {
            $styles[] = 'background-size: ' . esc_attr($attributes['backgroundSize']);
        }

        // Padding
        if (!empty($attributes['padding'])) {
            $styles[] = 'padding: ' . esc_attr($attributes['padding']);
        }

        // Margin
        if (!empty($attributes['margin'])) {
            $styles[] = 'margin: ' . esc_attr($attributes['margin']);
        }

        // Border
        if (!empty($attributes['borderColor'])) {
            $styles[] = 'border-color: ' . esc_attr($attributes['borderColor']);
        }
        if (!empty($attributes['borderWidth'])) {
            $styles[] = 'border-width: ' . esc_attr($attributes['borderWidth']);
        }
        if (!empty($attributes['borderStyle'])) {
            $styles[] = 'border-style: ' . esc_attr($attributes['borderStyle']);
        }
        if (!empty($attributes['borderRadius'])) {
            $styles[] = 'border-radius: ' . esc_attr($attributes['borderRadius']);
        }

        // Min height
        if (!empty($attributes['minHeight'])) {
            $styles[] = 'min-height: ' . esc_attr($attributes['minHeight']);
        }

        // Typography
        if (!empty($attributes['fontSize'])) {
            $styles[] = 'font-size: ' . esc_attr($attributes['fontSize']);
        }
        if (!empty($attributes['lineHeight'])) {
            $styles[] = 'line-height: ' . esc_attr($attributes['lineHeight']);
        }
        if (!empty($attributes['fontFamily'])) {
            $styles[] = 'font-family: ' . esc_attr($attributes['fontFamily']);
        }
        if (!empty($attributes['fontWeight'])) {
            $styles[] = 'font-weight: ' . esc_attr($attributes['fontWeight']);
        }
        if (!empty($attributes['fontStyle'])) {
            $styles[] = 'font-style: ' . esc_attr($attributes['fontStyle']);
        }
        if (!empty($attributes['textTransform'])) {
            $styles[] = 'text-transform: ' . esc_attr($attributes['textTransform']);
        }
        if (!empty($attributes['textDecoration'])) {
            $styles[] = 'text-decoration: ' . esc_attr($attributes['textDecoration']);
        }
        if (!empty($attributes['letterSpacing'])) {
            $styles[] = 'letter-spacing: ' . esc_attr($attributes['letterSpacing']);
        }

        return implode('; ', $styles);
    }

    /**
     * Render placeholder when no items
     *
     * @return string
     */
    protected function renderPlaceholder()
    {
        return '<div class="gallery-builder-placeholder">
                    <p>' . __('No images selected. Please add images to the gallery.', 'jankx') . '</p>
                </div>';
    }
}
