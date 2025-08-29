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
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/svg-icon-button', [
            'title' => __('SVG Icon Button', 'jankx'),
            'category' => 'jankx-blocks',
            'icon' => 'button',
            'description' => __('Display a button with customizable SVG icon and text', 'jankx'),
            'keywords' => ['button', 'icon', 'svg', 'link', 'action'],
            'supports' => [
                'html' => false,
                'align' => ['left', 'center', 'right'],
                'anchor' => true,
                'interactivity' => [
                    'clientNavigation' => true
                ],
                'spacing' => [
                    'margin' => true,
                    'padding' => true
                ]
            ]
        ]);
    }

    /**
     * Register the block
     *
     * @return void
     */
    public function register()
    {
        $blockPath = get_template_directory() . '/resources/blocks/svg-icon-button';
        $metadata = $this->getBlockMetadata($blockPath);

        // Register block - CSS will be handled by block.json
        $this->registerBlock($blockPath, $metadata);
    }

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
