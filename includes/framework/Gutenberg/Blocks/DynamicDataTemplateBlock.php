<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager;
use Jankx\Layouts\ContentLayout\ContentLayoutManager;
use Jankx\Layouts\DynamicDataLayout\Contracts\BlockTemplateLayoutInterface;
use Jankx\Layouts\DynamicDataLayout\Generators\PostTemplateBlockGenerator;
use Jankx\Layouts\DynamicDataLayout\ContentLoopLayoutManager;
use WP_Query;

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
            $this->contentLoopLayoutManager = \Jankx\Foundation\Application::getInstance()->make(ContentLoopLayoutManager::class);
        }
        return $this->contentLoopLayoutManager;
    }

    /**
     * Get block template layout manager instance
     *
     * @return BlockTemplateLayoutManager
     */
    protected function getBlockTemplateLayoutManager(): BlockTemplateLayoutManager
    {
        return \Jankx\Foundation\Application::getInstance()->make(BlockTemplateLayoutManager::class);
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
        $manager = \Jankx\Foundation\Application::getInstance()->make(ContentLayoutManager::class);
        $presets = $manager->getForJs();
        wp_add_inline_script(
            'wp-block-editor',
            'window.jankxContentLayoutPresets = ' . wp_json_encode($presets, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) . ';',
            'before'
        );

        $asset_file = dirname($this->blockPath) . '/dist/blocks/dynamic-data-template/index.asset.php';

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
        $defaultBlocks = [];

        // For product and tour post types, return WooCommerce blocks
        if (in_array($postType, ['product', 'tour'])) {
            $defaultBlocks = [
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
        } else {
            // For other post types, return standard post blocks
            $defaultBlocks = [
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

        return apply_filters('jankx/dynamic-data-template/default-inner-blocks', $defaultBlocks, $postType);
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
        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => $this->buildWrapperClasses($attributes),
            'data-overlay-icon' => $attributes['overlayIcon'] ?? '',
            'data-overlay-icon-type' => $attributes['overlayIconType'] ?? 'class',
            'data-overlay-icon-image' => $attributes['overlayIconImageUrl'] ?? '',
            'data-overlay-icon-text' => $attributes['overlayIconText'] ?? '',
            'data-overlay-icon-rotate' => isset($attributes['overlayIconRotate']) ? (int) $attributes['overlayIconRotate'] : 0,
            'data-overlay-icon-position' => $attributes['overlayIconPosition'] ?? 'center',
            'data-overlay-icon-size' => $attributes['overlayIconSize'] ?? 24,
            'data-overlay-icon-color' => $attributes['overlayIconColor'] ?? '#ffffff',
            'data-overlay-icon-bg' => $attributes['overlayIconBackground'] ?? 'rgba(0, 0, 0, 0.5)',
            'data-overlay-icon-mode' => $attributes['overlayIconShowMode'] ?? 'always-show',
            'data-overlay-icon-target' => $attributes['overlayIconTarget'] ?? 'featured-image',
            // Item background attributes
            'data-item-bg-type' => $attributes['itemBgType'] ?? 'none',
            'data-item-bg-color' => $attributes['itemBgColor'] ?? '',
            'data-item-bg-image-url' => $attributes['itemBgImageUrl'] ?? '',
            'data-item-bg-image-source' => $attributes['itemBgImageSource'] ?? 'custom',
            'data-item-bg-position' => $attributes['itemBgPosition'] ?? 'center center',
            'data-item-bg-size' => $attributes['itemBgSize'] ?? 'cover',
            'data-item-bg-repeat' => $attributes['itemBgRepeat'] ?? 'no-repeat',
            'data-item-bg-overlay' => $attributes['itemBgOverlay'] ?? '',
        ]);

        if ($block instanceof \WP_Block) {
            $context = $block->context['jankxPostTypeLayout'] ?? null;
            if (is_array($context)) {
                $query = $context['query'] ?? null;
                if ($query instanceof WP_Query) {
                    $options = $context['options'] ?? [];
                    $template = $context['template'] ?? ($block->parsed_block ?? null);
                    if (is_array($template)) {
                        $layout = $context['layout'] ?? null;
                        $generator = new PostTemplateBlockGenerator($template, $options);
                        if ($layout instanceof BlockTemplateLayoutInterface) {
                            $generator->setLayout($layout);
                        }
                        return sprintf(
                            '<div %s>%s</div>',
                            $wrapper_attributes,
                            $generator->generate($query, $options)
                        );
                    }
                }
            }
        }
        
        return sprintf(
            '<div %s>%s</div>',
            $wrapper_attributes,
            $content
        );
    }

    /**
     * Build wrapper classes for the block
     *
     * @param array $attributes Block attributes
     * @return string
     */
    protected function buildWrapperClasses($attributes)
    {
        $classes = ['dynamic-data-template'];
        
        if (!empty($attributes['className'])) {
            $classes[] = $attributes['className'];
        }
        
        if (!empty($attributes['overlayIcon'])) {
            $classes[] = 'has-overlay-icon';
            $classes[] = sprintf('overlay-icon-position-%s', $attributes['overlayIconPosition'] ?? 'center');
            $classes[] = sprintf('overlay-icon-mode-%s', $attributes['overlayIconShowMode'] ?? 'always-show');
            $classes[] = sprintf('overlay-icon-target-%s', $attributes['overlayIconTarget'] ?? 'featured-image');
        }
        
        return implode(' ', $classes);
    }

    public static function renderTemplateWithQuery(array $templateBlock, WP_Query $query, array $options, ?BlockTemplateLayoutInterface $layout = null): string
    {
        if (!function_exists('render_block')) {
            require_once ABSPATH . 'wp-includes/blocks.php';
        }
        $generator = new PostTemplateBlockGenerator($templateBlock, $options);
        if ($layout instanceof BlockTemplateLayoutInterface) {
            $generator->setLayout($layout);
        }
        return $generator->generate($query, $options);
    }
}
