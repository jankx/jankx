<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class SlideshowContainerBlock extends Block
{
    protected $blockId = 'jankx/slideshow-container';

    public function render($attributes, $content = '', $block = null)
    {
        // Extract attributes
        $containerId = $attributes['containerId'] ?? '';
        $images = $attributes['images'] ?? [];

        // Get settings from parent slideshow via context
        $showThumbnails = $block->context['jankx/showThumbnails'] ?? true;
        $showNavigation = $block->context['jankx/showNavigation'] ?? true;

        ob_start();
        ?>
        <?php if ($showThumbnails && !empty($images) && count($images) > 1) : ?>
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
                    <?php echo $content; ?>
                </div>
            </div>

            <?php if ($showNavigation && !empty($images) && count($images) > 1) : ?>
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
        <?php
        return ob_get_clean();
    }
}

