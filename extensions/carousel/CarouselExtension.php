<?php

namespace Jankx\Extensions\Carousel;

use Jankx\Extensions\AbstractExtension;

class CarouselExtension extends AbstractExtension
{
    public function init(): void
    {
        $this->name = 'Embla Carousel';
        $this->version = '1.0.0';
    }

    public function register_hooks(): void
    {
        add_action('init', [$this, 'register_blocks']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend_assets']);
    }

    public function register_blocks(): void
    {
        $blocks_dir = $this->extension_path . '/blocks';

        // Parent block with PHP render callback
        register_block_type_from_metadata(
            $blocks_dir . '/embla-carousel',
            [
                'render_callback' => function ($attributes, $content) {
                    $block = new Blocks\EmblaCarouselBlock($attributes, $content);
                    return $block->render();
                },
            ]
        );

        // Child blocks (no render callback needed)
        $child_blocks = [
            'embla-carousel-slide',
            'embla-carousel-card',
            'embla-carousel-presentation-slide',
        ];

        foreach ($child_blocks as $block_name) {
            register_block_type_from_metadata($blocks_dir . '/' . $block_name);
        }
    }

    public function enqueue_frontend_assets(): void
    {
        // Frontend view.js is handled by viewScript in block.json
        // Frontend styles are handled by style in block.json
        // This method is intentionally minimal.
    }
}
