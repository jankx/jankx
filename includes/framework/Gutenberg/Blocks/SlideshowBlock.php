<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class SlideshowBlock extends Block
{
    protected $blockId = 'jankx/slideshow';

    /**
     * Allow SVG tags in content and replace fill with currentColor
     */
    private function allow_svg_tags($content) {
        $allowed_tags = wp_kses_allowed_html('post');
        $allowed_tags['svg'] = [
            'width' => true,
            'height' => true,
            'viewBox' => true,
            'fill' => true,
            'xmlns' => true,
            'class' => true,
            'style' => true,
        ];
        $allowed_tags['path'] = [
            'd' => true,
            'fill' => true,
            'stroke' => true,
            'stroke-width' => true,
            'stroke-linecap' => true,
            'stroke-linejoin' => true,
        ];
        $allowed_tags['circle'] = [
            'cx' => true,
            'cy' => true,
            'r' => true,
            'fill' => true,
            'stroke' => true,
        ];
        $allowed_tags['rect'] = [
            'x' => true,
            'y' => true,
            'width' => true,
            'height' => true,
            'fill' => true,
            'stroke' => true,
        ];
        $allowed_tags['line'] = [
            'x1' => true,
            'y1' => true,
            'x2' => true,
            'y2' => true,
            'stroke' => true,
            'stroke-width' => true,
        ];
        
        $sanitized = wp_kses($content, $allowed_tags);
        
        // Replace fill attributes with currentColor for better color inheritance
        $sanitized = preg_replace('/fill="[^"]*"/', 'fill="currentColor"', $sanitized);
        
        return $sanitized;
    }

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
        $fullscreenText = $attributes['fullscreenText'] ?? __('Fullscreen', 'jankx');
        $prevText = $attributes['prevText'] ?? '&lt;';
        $nextText = $attributes['nextText'] ?? '&gt;';
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
                        // Pass context to inner block
                        $inner_block->context = array_merge($inner_block->context ?? [], [
                            'jankx/showThumbnails' => $showThumbnails,
                            'jankx/showNavigation' => $showNavigation,
                            'jankx/transitionEffect' => $transitionEffect,
                            'jankx/captionPosition' => $captionPosition,
                            'jankx/prevText' => $prevText,
                            'jankx/nextText' => $nextText,
                        ]);
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
                                    <?php echo esc_html($fullscreenText); ?>
                                </button>
                            <?php endif; ?>

                            <?php if ($autoplay) : ?>
                                <button class="slideshow-autoplay-btn">
                                    <?php _e('Autoplay', 'jankx'); ?>
                                </button>
                            <?php endif; ?>
                        </div>

                        <?php if ($showPagination && count($images) > 1) : ?>
                            <div class="slideshow-pagination">
                                <button class="slideshow-pagination-prev" disabled>
                                    <?php echo $this->allow_svg_tags($prevText); ?>
                                </button>
                                <?php foreach ($images as $index => $image) : ?>
                                    <?php $active_class = $index === 0 ? 'active' : ''; ?>
                                    <button class="slideshow-pagination-dot <?php echo $active_class; ?>"
                                            data-slide="<?php echo $index; ?>">
                                        <?php echo $index + 1; ?>
                                    </button>
                                <?php endforeach; ?>
                                <button class="slideshow-pagination-next">
                                    <?php echo $this->allow_svg_tags($nextText); ?>
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