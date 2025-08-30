<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * SVG Icon Button Block
 *
 * This block displays a button with customizable SVG icon and text
 * with various styling options.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class SvgIconButtonBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/svg-icon-button';


    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '')
    {
        // This is a static block, so we return the content as is
        // The actual rendering is handled by the JavaScript save function
        return $content;
    }
}
