<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Layouts\PostLayout\PostLayoutFactory;
use Jankx\Layouts\PostLayout\Generators\PostTemplateBlockGenerator;
use Jankx\Layouts\PostLayout\PostLayoutManager;
use WP_Query;
use WP_Block;

class MasterDataLayoutBlock extends Block
{
    protected $blockId = 'jankx/master-data-layout';

    public function init()
    {
        // Enqueue editor scripts with localized data
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets'], 20);
    }

    public function getSupportedLayouts()
    {
        $layoutManager = PostLayoutManager::getInstance();
        $layouts = $layoutManager->getLayouts(['field' => 'all']);
        $supported = [];
        foreach ($layouts as $layout) {
            $supported[$layout['name']] = $layout;
        }
        return $supported;
    }

    public function render($attributes, $content, $block = null)
    {
        $post_type = $attributes['postType'] ?? 'post';
        $layout_name = $attributes['layout'] ?? 'grid';

        // Create Layout Instance
        $layout = PostLayoutFactory::create($layout_name);
        if (!$layout) {
            return '';
        }

        // Setup Query
        $query_args = [
            'post_type' => $post_type,
            'posts_per_page' => $attributes['postsPerPage'] ?? 10,
            'post_status' => 'publish',
            'ignore_sticky_posts' => !($attributes['includeStickyPosts'] ?? false),
        ];
        
        // Handle Order
        if (isset($attributes['orderBy'])) {
            $query_args['orderby'] = $attributes['orderBy'];
        }
        if (isset($attributes['order'])) {
            $query_args['order'] = $attributes['order'];
        }
        
        // Handle Offset
        if (!empty($attributes['offset'])) {
            $query_args['offset'] = $attributes['offset'];
        }

        // Handle Tax Query, Meta Query if needed (simplified for now)

        $query = new WP_Query($query_args);
        $layout->setQuery($query);
        $layout->setOptions($attributes);

        // Handle Template from InnerBlocks
        // Master Data Layout expects a child Master Data Template block
        $template_block = null;
        if ($block && !empty($block->parsed_block['innerBlocks'])) {
            // Try to find MasterDataTemplateBlock directly or inside
            $template_block = $this->findTemplateBlock($block->parsed_block['innerBlocks']);
        }

        if ($template_block) {
            // Use PostTemplateBlockGenerator to render content using the found template
            $generator = new PostTemplateBlockGenerator($template_block, $attributes);
            $layout->setContentGenerator($generator);
        }

        return $layout->render();
    }

    protected function findTemplateBlock($innerBlocks)
    {
        foreach ($innerBlocks as $innerBlock) {
            if (($innerBlock['blockName'] ?? '') === 'jankx/master-data-template') {
                return $this->sanitizeTemplateBlock($innerBlock);
            }
            // Recursively search in nested innerBlocks
            if (!empty($innerBlock['innerBlocks'])) {
                $found = $this->findTemplateBlock($innerBlock['innerBlocks']);
                if ($found !== null) {
                    return $found;
                }
            }
        }
        return null;
    }

    protected function sanitizeTemplateBlock(array $block): array
    {
        $sanitized = [
            'blockName' => $block['blockName'] ?? '',
            'attrs' => is_array($block['attrs'] ?? null) ? $block['attrs'] : [],
            'innerBlocks' => [],
            'innerHTML' => $block['innerHTML'] ?? '',
            'innerContent' => is_array($block['innerContent'] ?? null) ? $block['innerContent'] : [],
        ];

        if (!empty($block['originalContent'])) {
            $sanitized['originalContent'] = $block['originalContent'];
        }

        if (!empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
            foreach ($block['innerBlocks'] as $inner) {
                if (is_array($inner)) {
                    $sanitized['innerBlocks'][] = $this->sanitizeTemplateBlock($inner);
                }
            }
        }

        return $sanitized;
    }

    public function enqueueEditorAssets()
    {
        $asset_file = $this->blockPath . '/build/index.asset.php';

        if (!file_exists($asset_file)) {
            return;
        }

        $asset = require $asset_file;
        $script_handle = 'jankx-master-data-layout-editor-script';

        // WordPress may register with different handle, try fallback
        if (!wp_script_is($script_handle, 'registered')) {
            $script_handle = 'jankx-master-data-layout-editor';
        }

        $layoutManager = PostLayoutManager::getInstance();
        $layouts = $layoutManager->getLayouts(['field' => 'all']);

        wp_localize_script(
            $script_handle,
            'jankxSupportedPostTypeLayouts',
            $layouts
        );

        // Localize layout structures for JavaScript rendering
        $layout_structures = $this->getLayoutStructures();
        wp_localize_script(
            $script_handle,
            'jankxLayoutStructures',
            $layout_structures
        );
    }

    /**
     * Get layout structures for all registered layouts
     *
     * @return array Layout structures indexed by layout name
     */
    protected function getLayoutStructures(): array
    {
        $layoutManager = PostLayoutManager::getInstance();
        $allLayouts = $layoutManager->getLayouts(['field' => 'all']);
        $structures = [];

        foreach ($allLayouts as $layoutInfo) {
            $layoutName = $layoutInfo['name'] ?? '';
            if (empty($layoutName)) {
                continue;
            }

            try {
                $decorator = $layoutManager->createLayout($layoutName, []);
                $layout = $decorator->getLayout();
                
                if ($layout && method_exists($layout, 'getHtmlStructure')) {
                    $structures[$layoutName] = $layout->getHtmlStructure([]);
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        return [
            'layouts' => $structures,
            'postItem' => [], // Empty for now, or define default
        ];
    }
}
