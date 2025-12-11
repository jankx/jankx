<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Layouts\DynamicDataLayout\ContentLoopLayoutManager;

/**
 * Dynamic Data Template Block
 *
 * Block này chịu trách nhiệm cho việc settings của loop item.
 * Layout của loop item gọi là content loop layout.
 * Block này có thể thêm mọi loại block con nhưng các block con mặc định
 * sẽ phụ thuộc vào post type.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 2.0.0
 */
class DynamicDataTemplateBlock extends Block
{
    protected $blockId = 'jankx/dynamic-data-template';

    /**
     * Content Loop Layout Manager instance
     *
     * @var ContentLoopLayoutManager|null
     */
    protected $contentLoopLayoutManager = null;

    public function init()
    {
        // Enqueue editor scripts with localized data
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets'], 20);
    }

    /**
     * Get content loop layout manager instance
     *
     * @return ContentLoopLayoutManager
     */
    protected function getContentLoopLayoutManager(): ContentLoopLayoutManager
    {
        if ($this->contentLoopLayoutManager === null) {
            $this->contentLoopLayoutManager = ContentLoopLayoutManager::getInstance();
        }
        return $this->contentLoopLayoutManager;
    }

    /**
     * Get supported content loop layouts for a post type
     *
     * @param string $postType Post type
     * @return array
     */
    public function getSupportedContentLoopLayouts(string $postType = 'post'): array
    {
        $layoutManager = $this->getContentLoopLayoutManager();
        return $layoutManager->getLayoutsForPostType($postType);
    }

    /**
     * Enqueue editor assets
     *
     * @return void
     */
    public function enqueueEditorAssets()
    {
        $asset_file = $this->blockPath . '/build/index.asset.php';

        if (!file_exists($asset_file)) {
            return;
        }

        $asset = require $asset_file;
        
        // Get the actual script handle from block registration
        // WordPress registers scripts with handle based on block name
        $block_name = str_replace('jankx/', '', $this->blockId);
        $script_handle = 'jankx-' . str_replace('/', '-', $block_name) . '-editor-script';
        
        // Try alternative handle format
        if (!wp_script_is($script_handle, 'registered')) {
            $script_handle = 'jankx-' . str_replace('/', '-', $block_name) . '-editor';
        }
        
        // If still not found, try to get from registered block
        $registered_block = \WP_Block_Type_Registry::get_instance()->get_registered($this->blockId);
        if ($registered_block && !empty($registered_block->editor_script)) {
            $script_handle = $registered_block->editor_script;
        }
        
        // Only proceed if script is registered
        if (!wp_script_is($script_handle, 'registered')) {
            return;
        }

        $layoutManager = $this->getContentLoopLayoutManager();

        // Get all post types
        $post_types = get_post_types(['public' => true], 'objects');
        $layouts_by_post_type = [];

        foreach ($post_types as $post_type => $post_type_obj) {
            $layouts_by_post_type[$post_type] = $layoutManager->getLayoutsForPostType($post_type);
        }

        // Localize layouts data
        wp_localize_script(
            $script_handle,
            'jankxDynamicDataContentLoopLayouts',
            [
                'layoutsByPostType' => $layouts_by_post_type,
                'commonLayouts' => $layoutManager->getCommonLayouts(),
            ]
        );

        // Get default inner blocks for each post type
        $default_blocks_by_post_type = [];
        foreach ($post_types as $post_type => $post_type_obj) {
            $default_blocks_by_post_type[$post_type] = $this->getDefaultInnerBlocksForPostType($post_type);
        }

        wp_localize_script(
            $script_handle,
            'jankxDynamicDataTemplateDefaultBlocks',
            $default_blocks_by_post_type
        );
    }

    /**
     * Get default inner blocks for a post type
     *
     * @param string $postType Post type
     * @return array Array of default block configurations
     */
    protected function getDefaultInnerBlocksForPostType(string $postType): array
    {
        // For product post type, return WooCommerce blocks
        if ($postType === 'product') {
            return [
                [
                    'blockName' => 'woocommerce/product-image',
                    'attrs' => [],
                ],
                [
                    'blockName' => 'woocommerce/product-title',
                    'attrs' => [],
                ],
                [
                    'blockName' => 'woocommerce/product-price',
                    'attrs' => [],
                ],
                [
                    'blockName' => 'woocommerce/product-button',
                    'attrs' => [],
                ],
            ];
        }

        // For other post types, return standard post blocks
        return [
            [
                'blockName' => 'core/post-featured-image',
                'attrs' => [],
            ],
            [
                'blockName' => 'core/post-title',
                'attrs' => [],
            ],
            [
                'blockName' => 'core/post-date',
                'attrs' => [],
            ],
            [
                'blockName' => 'core/post-excerpt',
                'attrs' => [],
            ],
        ];
    }

    /**
     * Render the block
     * 
     * Note: This block is primarily used for editor preview.
     * Actual rendering is handled by the parent DynamicDataLayoutBlock.
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @param \WP_Block|null $block Block instance
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        // This block renders via InnerBlocks.Content in save.tsx
        // The actual rendering is handled by the parent block
        return $content;
    }
}

