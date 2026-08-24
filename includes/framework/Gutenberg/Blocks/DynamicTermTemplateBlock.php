<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Blocks\DynamicDataTemplateBlock;
use Jankx\Layouts\ContentLayout\ContentLayoutManager;

/**
 * Dynamic Term Template Block
 *
 * Block này chịu trách nhiệm cho settings của loop item cho danh sách terms.
 * Nó tái sử dụng toàn bộ logic từ DynamicDataTemplateBlock; chỉ khác ở tên
 * block, block con mặc định (Name + Description + Count) và cách render
 * (item do TermTemplateBlockGenerator render thay vì post query).
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 2.0.0
 */
class DynamicTermTemplateBlock extends DynamicDataTemplateBlock
{
    protected $blockId = 'jankx/dynamic-term-template';

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

        $asset_file = dirname($this->blockPath) . '/dist/blocks/dynamic-term-template/index.asset.php';

        if (!file_exists($asset_file)) {
            return;
        }

        $asset = require $asset_file;

        $block_name = str_replace('jankx/', '', $this->blockId);
        $script_handle = 'jankx-' . str_replace('/', '-', $block_name) . '-editor-script';

        if (!wp_script_is($script_handle, 'registered')) {
            $script_handle = 'jankx-' . str_replace('/', '-', $block_name) . '-editor';
        }

        $registered_block = \WP_Block_Type_Registry::get_instance()->get_registered($this->blockId);
        if ($registered_block && !empty($registered_block->editor_script)) {
            $script_handle = $registered_block->editor_script;
        }

        if (!wp_script_is($script_handle, 'registered')) {
            return;
        }

        $layoutManager = $this->getContentLoopLayoutManager();
        $layouts_by_taxonomy = [];

        $taxonomies = get_taxonomies(['public' => true], 'objects');
        foreach ($taxonomies as $slug => $taxonomy_obj) {
            $layouts_by_taxonomy[$slug] = $layoutManager->getLayoutsForPostType($slug);
        }

        wp_localize_script(
            $script_handle,
            'jankxDynamicTermContentLoopLayouts',
            [
                'layoutsByTaxonomy' => $layouts_by_taxonomy,
                'commonLayouts' => $layoutManager->getCommonLayouts(),
            ]
        );

        wp_localize_script(
            $script_handle,
            'jankxDynamicTermTemplateDefaultBlocks',
            $this->getDefaultTermInnerBlocks()
        );
    }

    /**
     * Get default inner blocks for term items.
     *
     * Uses standard post blocks so the editing experience stays familiar,
     * but the term generator maps them as Name / Description / Count.
     *
     * @return array Array of default block configurations
     */
    protected function getDefaultTermInnerBlocks(): array
    {
        $defaultBlocks = [
            [
                'blockName' => 'core/post-title',
                'attrs' => [
                    'isLink' => true,
                ],
            ],
            [
                'blockName' => 'core/post-excerpt',
                'attrs' => [],
            ],
            [
                'blockName' => 'core/paragraph',
                'attrs' => [
                    'className' => 'jankx-term-count',
                    'placeholder' => '0',
                ],
            ],
        ];

        return apply_filters('jankx/dynamic-term-template/default-inner-blocks', $defaultBlocks);
    }

    /**
     * Render the block.
     *
     * Actual item rendering is handled by the parent DynamicTermLayoutBlock
     * via TermTemplateBlockGenerator, so this only renders the wrapper and
     * the saved inner block content (used for editor preview).
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
            'data-item-bg-type' => $attributes['itemBgType'] ?? 'none',
            'data-item-bg-color' => $attributes['itemBgColor'] ?? '',
            'data-item-bg-image-url' => $attributes['itemBgImageUrl'] ?? '',
            'data-item-bg-image-source' => $attributes['itemBgImageSource'] ?? 'custom',
            'data-item-bg-position' => $attributes['itemBgPosition'] ?? 'center center',
            'data-item-bg-size' => $attributes['itemBgSize'] ?? 'cover',
            'data-item-bg-repeat' => $attributes['itemBgRepeat'] ?? 'no-repeat',
            'data-item-bg-overlay' => $attributes['itemBgOverlay'] ?? '',
        ]);

        return sprintf(
            '<div %s>%s</div>',
            $wrapper_attributes,
            $content
        );
    }
}
