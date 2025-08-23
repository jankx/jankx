<?php

/**
 * Responsive Block Extension Service
 *
 * Extends WordPress core blocks with responsive controls for padding, margin,
 * typography, and other properties without creating new blocks.
 *
 * @package CheepHub
 * @subpackage AdvancedBlocks
 * @since 1.0.0
 */

namespace Jankx\Gutenberg\Blocks\Advanced;

class ResponsiveBlockExtension
{
    /**
     * Core blocks to extend with responsive controls
     */
    protected $extendableBlocks = [
        'core/heading',
        'core/paragraph',
        'core/button',
        'core/image',
        'core/columns',
        'core/group',
        'core/spacer'
    ];
/**
     * Responsive attribute mappings
     */
    protected $responsiveAttributes = [
        'fontSize' => [
            'desktop' => 'fontSize',
            'tablet' => 'fontSizeTablet',
            'mobile' => 'fontSizeMobile'
        ],
        'lineHeight' => [
            'desktop' => 'lineHeight',
            'tablet' => 'lineHeightTablet',
            'mobile' => 'lineHeightMobile'
        ],
        'letterSpacing' => [
            'desktop' => 'letterSpacing',
            'tablet' => 'letterSpacingTablet',
            'mobile' => 'letterSpacingMobile'
        ],
        'margin' => [
            'desktop' => 'margin',
            'tablet' => 'marginTablet',
            'mobile' => 'marginMobile'
        ],
        'padding' => [
            'desktop' => 'padding',
            'tablet' => 'paddingTablet',
            'mobile' => 'paddingMobile'
        ],
        'width' => [
            'desktop' => 'width',
            'tablet' => 'widthTablet',
            'mobile' => 'widthMobile'
        ],
        'height' => [
            'desktop' => 'height',
            'tablet' => 'heightTablet',
            'mobile' => 'heightMobile'
        ],
        'borderRadius' => [
            'desktop' => 'borderRadius',
            'tablet' => 'borderRadiusTablet',
            'mobile' => 'borderRadiusMobile'
        ],
        'borderWidth' => [
            'desktop' => 'borderWidth',
            'tablet' => 'borderWidthTablet',
            'mobile' => 'borderWidthMobile'
        ]
    ];
/**
     * Constructor
     */
    public function __construct()
    {
        $this->init();
    }

    /**
     * Initialize the service
     */
    protected function init()
    {
        add_action('init', [$this, 'registerBlockExtensions']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets']);
        add_filter('block_categories_all', [$this, 'addAdvancedBlockCategory'], 10, 2);
    }

    /**
     * Register block extensions
     */
    public function registerBlockExtensions()
    {
        foreach ($this->extendableBlocks as $blockName) {
            $this->extendBlock($blockName);
        }
    }

    /**
     * Extend a specific block with responsive attributes
     */
    protected function extendBlock($blockName)
    {
        $block = WP_Block_Type_Registry::get_instance()->get_registered($blockName);
        if (!$block) {
            return;
        }

        // Add responsive attributes
        $this->addResponsiveAttributes($block, array_keys($this->responsiveAttributes));
// Add custom attributes
        $this->addCustomAttributes($block, [
            'responsiveControls' => [
                'type' => 'object',
                'default' => [
                    'enabled' => false,
                    'breakpoints' => ['desktop', 'tablet', 'mobile']
                ]
            ]
        ]);
    }

    /**
     * Add responsive attributes to a block
     */
    protected function addResponsiveAttributes($block, array $attributeTypes)
    {
        foreach ($attributeTypes as $type) {
            if (isset($this->responsiveAttributes[$type])) {
                foreach ($this->responsiveAttributes[$type] as $device => $attributeName) {
                    if ($device !== 'desktop') {
                            $block->attributes[$attributeName] = [
                            'type' => 'string',
                            'default' => ''
                                    ];
                    }
                }
            }
        }
    }

    /**
     * Add custom attributes to a block
     */
    protected function addCustomAttributes($block, array $attributes)
    {
        foreach ($attributes as $name => $config) {
            $block->attributes[$name] = $config;
        }
    }

    /**
     * Enqueue editor assets
     */
    public function enqueueEditorAssets()
    {
        wp_enqueue_script('cheephub-responsive-blocks-editor', get_template_directory_uri() . '/resources/advanced-blocks/build/editor.js', ['wp-blocks', 'wp-dom-ready', 'wp-edit-post', 'wp-components', 'wp-i18n'], '1.0.0', true);
        wp_enqueue_style('cheephub-responsive-blocks-editor', get_template_directory_uri() . '/resources/advanced-blocks/build/editor.css', [], '1.0.0');
        wp_localize_script('cheephub-responsive-blocks-editor', 'cheephubResponsiveBlocks', [
            'responsiveAttributes' => $this->responsiveAttributes,
            'extendableBlocks' => $this->extendableBlocks,
            'breakpoints' => [
                'desktop' => 1024,
                'tablet' => 768,
                'mobile' => 480
            ]
        ]);
    }

    /**
     * Add advanced block category
     */
    public function addAdvancedBlockCategory($categories, $post)
    {
        return array_merge($categories, [
            [
                'slug' => 'cheephub-advanced',
                'title' => __('CheepHub Advanced', 'cheephub'),
                'icon' => 'admin-tools'
            ]
        ]);
    }

    /**
     * Get responsive attributes for a block
     */
    public function getResponsiveAttributes($blockName)
    {
        return $this->responsiveAttributes;
    }

    /**
     * Check if a block has responsive attributes
     */
    public function hasResponsiveAttributes($blockName, $attributeName)
    {
        return in_array($blockName, $this->extendableBlocks) &&
               isset($this->responsiveAttributes[$attributeName]);
    }
}
