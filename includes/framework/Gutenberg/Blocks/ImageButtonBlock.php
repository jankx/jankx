<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Image Button Block
 *
 * This block displays a button with customizable styling options
 * based on WordPress core button block functionality.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class ImageButtonBlock extends Block
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/image-button', [
            'title' => __('Image Button', 'jankx'),
            'category' => 'jankx-blocks',
            'icon' => 'button',
            'description' => __('Prompt visitors to take action with a button-style link.', 'jankx'),
            'keywords' => ['button', 'link', 'action', 'image'],
            'supports' => [
                'html' => false,
                'align' => false,
                'alignWide' => false,
                'anchor' => true,
                'splitting' => true,
                'color' => [
                    '__experimentalSkipSerialization' => true,
                    'gradients' => true,
                    '__experimentalDefaultControls' => [
                        'background' => true,
                        'text' => true
                    ]
                ],
                'typography' => [
                    '__experimentalSkipSerialization' => [
                        'fontSize',
                        'lineHeight',
                        'fontFamily',
                        'fontWeight',
                        'fontStyle',
                        'textTransform',
                        'textDecoration',
                        'letterSpacing'
                    ],
                    'fontSize' => true,
                    'lineHeight' => true,
                    '__experimentalFontFamily' => true,
                    '__experimentalFontWeight' => true,
                    '__experimentalFontStyle' => true,
                    '__experimentalTextTransform' => true,
                    '__experimentalTextDecoration' => true,
                    '__experimentalLetterSpacing' => true,
                    '__experimentalWritingMode' => true,
                    '__experimentalDefaultControls' => [
                        'fontSize' => true
                    ]
                ],
                'reusable' => false,
                'shadow' => [
                    '__experimentalSkipSerialization' => true
                ],
                'spacing' => [
                    '__experimentalSkipSerialization' => true,
                    'padding' => ['horizontal', 'vertical'],
                    '__experimentalDefaultControls' => [
                        'padding' => true
                    ]
                ],
                '__experimentalBorder' => [
                    'color' => true,
                    'radius' => true,
                    'style' => true,
                    'width' => true,
                    '__experimentalSkipSerialization' => true,
                    '__experimentalDefaultControls' => [
                        'color' => true,
                        'radius' => true,
                        'style' => true,
                        'width' => true
                    ]
                ],
                'interactivity' => [
                    'clientNavigation' => true
                ]
            ],
            'attributes' => [
                'tagName' => [
                    'type' => 'string',
                    'enum' => ['a', 'button'],
                    'default' => 'a'
                ],
                'type' => [
                    'type' => 'string',
                    'default' => 'button'
                ],
                'textAlign' => [
                    'type' => 'string'
                ],
                'url' => [
                    'type' => 'string',
                    'source' => 'attribute',
                    'selector' => 'a',
                    'attribute' => 'href',
                    'role' => 'content'
                ],
                'title' => [
                    'type' => 'string',
                    'source' => 'attribute',
                    'selector' => 'a,button',
                    'attribute' => 'title',
                    'role' => 'content'
                ],
                'text' => [
                    'type' => 'rich-text',
                    'source' => 'rich-text',
                    'selector' => 'a,button',
                    'role' => 'content'
                ],
                'linkTarget' => [
                    'type' => 'string',
                    'source' => 'attribute',
                    'selector' => 'a',
                    'attribute' => 'target',
                    'role' => 'content'
                ],
                'rel' => [
                    'type' => 'string',
                    'source' => 'attribute',
                    'selector' => 'a',
                    'attribute' => 'rel',
                    'role' => 'content'
                ],
                'placeholder' => [
                    'type' => 'string'
                ],
                'backgroundColor' => [
                    'type' => 'string'
                ],
                'textColor' => [
                    'type' => 'string'
                ],
                'gradient' => [
                    'type' => 'string'
                ],
                'width' => [
                    'type' => 'number'
                ],
                'imageId' => [
                    'type' => 'number'
                ],
                'imageUrl' => [
                    'type' => 'string'
                ],
                'imageAlt' => [
                    'type' => 'string'
                ],
                'imageSize' => [
                    'type' => 'string',
                    'default' => '20px'
                ],
                'imageWidth' => [
                    'type' => 'number'
                ],
                'imageHeight' => [
                    'type' => 'number'
                ],
                'imageSizeSlug' => [
                    'type' => 'string'
                ],
                'imageMarginRight' => [
                    'type' => 'string',
                    'default' => '8px'
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
        $blockPath = get_template_directory() . '/resources/blocks/image-button';
        $metadata = $this->getBlockMetadata($blockPath);

        // Register block with assets enqueue
        $this->registerBlockWithMetadata($metadata);
        
        // Force enqueue editor style for this specific block
        add_action('enqueue_block_editor_assets', function() use ($blockPath) {
            if (file_exists($blockPath . '/build/editor.css')) {
                wp_enqueue_style(
                    'jankx-image-button-editor',
                    get_template_directory_uri() . '/resources/blocks/image-button/build/editor.css',
                    [],
                    filemtime($blockPath . '/build/editor.css')
                );
            }
        });
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
