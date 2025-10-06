<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Modal Block
 *
 * A modal block with trigger and content areas. Supports inner blocks and custom selectors.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class ModalBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/modal';

    /**
     * Block attributes
     *
     * @var array
     */
    protected $attributes = [];

    /**
     * Register the block
     *
     * @return void
     */
    public function init()
    {
        // Enqueue Micromodal library - load in header to ensure it's available
        add_action('wp_enqueue_scripts', function() {
            wp_enqueue_script(
                'micromodal',
                'https://unpkg.com/micromodal@0.4.10/dist/micromodal.min.js',
                [],
                '0.4.10',
                false // Load in header
            );
        });
    }
}
