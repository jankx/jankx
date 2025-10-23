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

        // Build block wrapper attributes
        $block_wrapper_attrs = get_block_wrapper_attributes([
            'class' => 'slideshow-item-block',
            'data-slide-id' => $slideId
        ]);

        ob_start();
        ?>
        <div <?php echo $block_wrapper_attrs; ?>>
            <div class="slideshow-slide">
                <?php if ($imageUrl) : ?>
                    <div class="slideshow-item-image">
                        <img src="<?php echo esc_url($imageUrl); ?>"
                             alt="<?php echo esc_attr($imageAlt); ?>" />
                    </div>
                <?php else : ?>
                    <div class="slideshow-item-image">
                        <div class="slideshow-placeholder">
                            <div class="placeholder-icon">📷</div>
                            <div class="placeholder-text">No image selected</div>
                        </div>
                    </div>
                <?php endif; ?>

                <?php if (!empty($imageCaption)) : ?>
                    <div class="slideshow-caption">
                        <?php echo wp_kses_post($imageCaption); ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
