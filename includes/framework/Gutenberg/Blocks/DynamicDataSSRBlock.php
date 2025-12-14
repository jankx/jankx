<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use WP_Query;
use Jankx\Layouts\DynamicDataLayout\ContentLoopLayoutManager;

class DynamicDataSSRBlock extends Block
{
    protected $blockId = 'jankx/dynamic-data-ssr';

    public function init()
    {
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets'], 20);
    }

    protected function getContentLoopLayoutManager(): ContentLoopLayoutManager
    {
        return ContentLoopLayoutManager::getInstance();
    }

    public function enqueueEditorAssets()
    {
        $script_handle = 'jankx/blocks/dynamic-data-ssr/build/index';
        if (!wp_script_is($script_handle, 'registered')) {
            return;
        }

        $layoutManager = $this->getContentLoopLayoutManager();

        $post_types = get_post_types(['public' => true], 'objects');
        $layouts_by_post_type = [];

        foreach ($post_types as $post_type => $post_type_obj) {
            $layouts_by_post_type[$post_type] = $layoutManager->getLayoutsForPostType($post_type);
        }

        wp_localize_script(
            $script_handle,
            'jankxDynamicDataContentLoopLayouts',
            [
                'layoutsByPostType' => $layouts_by_post_type,
                'commonLayouts' => $layoutManager->getCommonLayouts(),
            ]
        );
    }

    public function render($attributes, $content = '', $block = null)
    {
        if ($block instanceof \WP_Block) {
            $context = $block->context['jankxPostTypeLayout'] ?? null;
            if (is_array($context)) {
                $query = $context['query'] ?? null;
                if ($query instanceof WP_Query) {
                    return '';
                }
            }
        }
        return $content;
    }
}
