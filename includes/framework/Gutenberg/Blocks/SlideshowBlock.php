<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Gutenberg\GutenbergPattern;

class SlideshowBlock extends Block
{
    protected $blockId = 'jankx/slide-show';

    public function render($attributes, $content = '', $block = null)
    {
        // Extract attributes with defaults
        $images = $attributes['images'] ?? [];
        $autoplay = $attributes['autoplay'] ?? false;
        $autoplayDelay = $attributes['autoplayDelay'] ?? 3000;
        $fullscreen = $attributes['fullscreen'] ?? true;
        $showThumbnails = $attributes['showThumbnails'] ?? true;
        $showNavigation = $attributes['showNavigation'] ?? true;
        $showPagination = $attributes['showPagination'] ?? true;
        $transitionEffect = $attributes['transitionEffect'] ?? 'slide';
        $transitionSpeed = $attributes['transitionSpeed'] ?? 300;
        $thumbnailSize = $attributes['thumbnailSize'] ?? 'medium';
        $mainImageHeight = $attributes['mainImageHeight'] ?? 400;
        $captionPosition = $attributes['captionPosition'] ?? 'hidden';
        $enableLightbox = $attributes['enableLightbox'] ?? false;
        $showFooterText = $attributes['showFooterText'] ?? false;
        $footerText = $attributes['footerText'] ?? '';
        $className = $attributes['className'] ?? '';
        $anchor = $attributes['anchor'] ?? '';

        // Calculate thumbnail size CSS variable
        $thumbnail_size_css = match($thumbnailSize) {
            'small' => '60px',
            'large' => '100px',
            default => '80px'
        };

        // Build block wrapper attributes
        $block_wrapper_attrs = get_block_wrapper_attributes([
            'class' => trim('slideshow-block ' . ($enableLightbox ? 'photoswipe-enabled' : '') . ' ' . $className),
            'id' => $anchor ? esc_attr($anchor) : null,
            'style' => sprintf(
                '--slideshow-height: %dpx; --slideshow-transition-speed: %dms; --slideshow-thumbnail-size: %s;',
                $mainImageHeight,
                $transitionSpeed,
                $thumbnail_size_css
            ),
            'data-slideshow' => 'true'
        ]);

        // Build data attributes for JavaScript
        $data_attrs = sprintf(
            'data-autoplay="%s" data-autoplay-delay="%s" data-fullscreen="%s" data-show-thumbnails="%s" data-show-navigation="%s" data-show-pagination="%s" data-transition-effect="%s" data-transition-speed="%s" data-thumbnail-size="%s" data-enable-lightbox="%s"',
            $autoplay ? 'true' : 'false',
            esc_attr($autoplayDelay),
            $fullscreen ? 'true' : 'false',
            $showThumbnails ? 'true' : 'false',
            $showNavigation ? 'true' : 'false',
            $showPagination ? 'true' : 'false',
            esc_attr($transitionEffect),
            esc_attr($transitionSpeed),
            esc_attr($thumbnailSize),
            $enableLightbox ? 'true' : 'false'
        );

        ob_start();
        ?>
        <div <?php echo $block_wrapper_attrs; ?> <?php echo $data_attrs; ?>>
            <?php if (!empty($images)) : ?>
                <?php if ($showThumbnails && count($images) > 1) : ?>
                    <div class="slideshow-thumbnails">
                        <?php foreach ($images as $index => $image) : ?>
                            <?php
                            $thumbnail_url = $image['thumbnailUrl'] ?? $image['url'];
                            $alt_text = $image['alt'] ?? '';
                            $active_class = $index === 0 ? 'active' : '';
                            ?>
                            <button class="slideshow-thumbnail <?php echo $active_class; ?>"
                                    data-slide="<?php echo $index; ?>">
                                <img src="<?php echo esc_url($thumbnail_url); ?>"
                                     alt="<?php echo esc_attr($alt_text); ?>" />
                            </button>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>

                <div class="slideshow-main">
                    <div class="slideshow-container">
                        <div class="slideshow-track">
                            <?php foreach ($images as $index => $image) : ?>
                                <?php
                                $image_url = $image['url'] ?? '';
                                $alt_text = $image['alt'] ?? '';
                                $caption = $image['caption'] ?? '';
                                $active_class = $index === 0 ? 'active' : '';
                                ?>
                                <div class="slideshow-slide slideshow-caption-<?php echo esc_attr($captionPosition); ?> <?php echo $active_class; ?>">
                                    <?php if ($image_url) : ?>
                                        <img src="<?php echo esc_url($image_url); ?>"
                                             alt="<?php echo esc_attr($alt_text); ?>" />
                                    <?php endif; ?>

                                    <?php if (!empty($caption) && $captionPosition !== 'hidden') : ?>
                                        <div class="slideshow-caption">
                                            <?php echo wp_kses_post($caption); ?>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <?php if ($showNavigation && count($images) > 1) : ?>
                        <button class="slideshow-nav slideshow-nav-prev"
                                aria-label="<?php esc_attr_e('Previous slide', 'jankx'); ?>">
                            ←
                        </button>
                        <button class="slideshow-nav slideshow-nav-next"
                                aria-label="<?php esc_attr_e('Next slide', 'jankx'); ?>">
                            →
                        </button>
                    <?php endif; ?>
                </div>

                 <?php if ($showFooterText && !empty($footerText)) : ?>
                     <div class="slideshow-footer-text">
                         <?php echo wp_kses_post($footerText); ?>
                     </div>
                 <?php endif; ?>

                 <div class="slideshow-footer">
                     <div class="slideshow-controls">
                         <?php if ($fullscreen) : ?>
                             <button class="slideshow-fullscreen-btn">
                                 <?php _e('Fullscreen', 'jankx'); ?>
                             </button>
                         <?php endif; ?>

                         <?php if ($autoplay) : ?>
                             <button class="slideshow-autoplay-btn">
                                 <?php _e('Xem tự động', 'jankx'); ?>
                             </button>
                         <?php endif; ?>
                     </div>

                    <?php if ($showPagination && count($images) > 1) : ?>
                        <div class="slideshow-pagination">
                            <button class="slideshow-pagination-prev" disabled>
                                &lt;
                            </button>
                            <?php foreach ($images as $index => $image) : ?>
                                <?php $active_class = $index === 0 ? 'active' : ''; ?>
                                <button class="slideshow-pagination-dot <?php echo $active_class; ?>"
                                        data-slide="<?php echo $index; ?>">
                                    <?php echo $index + 1; ?>
                                </button>
                            <?php endforeach; ?>
                            <button class="slideshow-pagination-next">
                                &gt;
                            </button>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}