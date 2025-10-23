<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Gutenberg\GutenbergPattern;

class SlideshowBlock extends Block
{
    protected $blockId = 'jankx/slideshow';

    public function render($attributes, $content = '', $block = null)
    {
        // Get images from slideshow-container child block
        $images = [];
        if ($block && !empty($block->inner_blocks)) {
            foreach ($block->inner_blocks as $inner_block) {
                if ($inner_block->name === 'jankx/slideshow-container') {
                    $images = $inner_block->attributes['images'] ?? [];
                    break;
                }
            }
        }

        // Extract attributes with defaults
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
            <?php
            // Render slideshow-container and core/paragraph blocks from InnerBlocks
            if ($block && !empty($block->inner_blocks)) {
                foreach ($block->inner_blocks as $inner_block) {
                    if ($inner_block->name === 'jankx/slideshow-container') {
                        echo $inner_block->render();
                    }
                }
            }

            // Render footer text blocks (core/paragraph, core/heading, core/list, core/group, etc.)
            $footer_content = '';
            if ($block && !empty($block->inner_blocks)) {
                foreach ($block->inner_blocks as $inner_block) {
                    if (in_array($inner_block->name, ['core/paragraph', 'core/heading', 'core/list', 'core/list-item', 'core/quote', 'core/group'])) {
                        $footer_content .= $inner_block->render();
                    }
                }
            }
            ?>
            <?php if (!empty($images)) : ?>
                <div class="slideshow-footer">
                    <?php if (!empty($footer_content)) : ?>
                        <div class="slideshow-footer-text">
                            <?php echo $footer_content; ?>
                        </div>
                    <?php endif; ?>

                    <div class="slideshow-footer-bottom">
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
                </div>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}