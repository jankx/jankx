<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Carousel Inner Blocks Overlay Block
 *
 * Persistent overlay pinned on top of all carousel slides.
 * Rendered separately from slides (outside .embla__container)
 * so it stays fixed while slides change.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class CarouselInnerBlocksOverlayBlock extends Block
{
    protected $blockId = 'jankx/carousel-inner-blocks-overlay';

    public function render($attributes, $content = '', $block = null)
    {
        // ── If $content already contains the overlay wrapper (from save()) ─
        // Pass through as-is — save() already produces the correct structure.
        if (!empty($content) && strpos($content, 'carousel-inner-blocks-overlay') !== false) {
            return $content;
        }

        // ── Fallback: build HTML from scratch ──────────────────────────────
        $class_name = $attributes['className'] ?? '';

        $wrapper_classes = ['carousel-inner-blocks-overlay'];
        if (!empty($class_name)) {
            $wrapper_classes[] = esc_attr($class_name);
        }

        $wrapper_attributes = [
            'class' => implode(' ', $wrapper_classes),
            'style' => 'z-index:1;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none',
            'data-overlay' => 'true',
        ];

        $block_wrapper_attrs = get_block_wrapper_attributes($wrapper_attributes);

        ob_start();
        ?>
        <div <?php echo $block_wrapper_attrs; ?>>
            <?php echo $content; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
