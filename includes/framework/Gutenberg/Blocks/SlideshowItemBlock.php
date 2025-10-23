<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class SlideshowItemBlock extends Block
{
    protected $blockId = 'jankx/slideshow-item';

    public function render($attributes, $content = '', $block = null)
    {
        // Extract attributes
        $imageId = $attributes['imageId'] ?? 0;
        $imageUrl = $attributes['imageUrl'] ?? '';
        $imageAlt = $attributes['imageAlt'] ?? '';
        $imageCaption = $attributes['imageCaption'] ?? '';
        $slideId = $attributes['slideId'] ?? '';

        // Get parent block context for caption position
        $captionPosition = 'hidden';
        if (isset($block->context['jankx/slideShowId'])) {
            // Try to get caption position from parent slideshow
            $captionPosition = 'hidden'; // Default, will be styled by parent
        }

        ob_start();
        ?>
        <div class="slideshow-slide slideshow-caption-<?php echo esc_attr($captionPosition); ?>" data-slide-id="<?php echo esc_attr($slideId); ?>">
            <?php if ($imageUrl) : ?>
                <img src="<?php echo esc_url($imageUrl); ?>"
                     alt="<?php echo esc_attr($imageAlt); ?>" />
            <?php endif; ?>

            <?php if (!empty($imageCaption) && $captionPosition !== 'hidden') : ?>
                <div class="slideshow-caption">
                    <?php echo wp_kses_post($imageCaption); ?>
                </div>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
