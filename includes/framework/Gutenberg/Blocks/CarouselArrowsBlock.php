<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Carousel Arrows block.
 *
 * Settings-only block used inside dynamic-data-layout and dynamic-term-layout
 * blocks. It does not render any markup on the frontend; the parent blocks read
 * its attributes server-side to render styled carousel prev/next buttons.
 */
class CarouselArrowsBlock extends Block
{
    /**
     * Block ID.
     *
     * @var string
     */
    protected $blockId = 'jankx/carousel-arrows';

    /**
     * Render nothing on the frontend.
     *
     * The parent layout blocks extract the attributes of this block from their
     * inner blocks and merge them into the carousel rendering options.
     *
     * @param array $attributes Block attributes.
     * @param string $content Inner block content.
     * @param \WP_Block|null $block Block instance.
     * @return string
     */
    public function render($attributes, $content = '', $block = null)
    {
        return '';
    }
}