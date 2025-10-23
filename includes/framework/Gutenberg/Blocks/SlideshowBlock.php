<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Gutenberg\GutenbergPattern;

class SlideshowBlock extends Block
{
    protected $blockId = 'jankx/slideshow';

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
        switch ($thumbnailSize) {
            case 'small':
                $thumbnail_size_css = '60px';
                break;
            case 'large':
                $thumbnail_size_css = '100px';
                break;
            default:
                $thumbnail_size_css = '80px';
        }

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
                    <?php echo $content; // Render slideshow-container and its children ?>

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