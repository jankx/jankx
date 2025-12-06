<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Layouts\DynamicDataLayout\DynamicDataLayoutManager;
use Jankx\Gutenberg\Blocks\DynamicDataLayout\Renderer;
use Jankx\Gutenberg\Blocks\DynamicDataLayout\AttributeSanitizer;

/**
 * Dynamic Data Layout Block
 *
 * Block này thay thế cho post-type-layout và master-data-layout blocks.
 * Nó build WordPress query và chọn layout cho toàn bộ wrapper block.
 * Chỉ chấp nhận 1 block con duy nhất là dynamic-data-template.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 2.0.0
 */
class DynamicDataLayoutBlock extends Block
{
    protected $blockId = 'jankx/dynamic-data-layout';

    /**
     * Dynamic Data Layout Manager instance
     *
     * @var DynamicDataLayoutManager|null
     */
    protected $layoutManager = null;

    /**
     * Attribute Sanitizer instance
     *
     * @var AttributeSanitizer|null
     */
    protected ?AttributeSanitizer $attributeSanitizer = null;

    /**
     * Renderer Service instance
     *
     * @var Renderer|null
     */
    protected ?Renderer $rendererService = null;

    public function init()
    {
        // Enqueue editor scripts with localized data
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets'], 20);
        
        // Filter block attributes to ensure queryId is always valid
        // This runs before WordPress processes providesContext
        add_filter('render_block_data', [$this, 'normalizeBlockAttributes'], 10, 1);

        $this->ensureServices();
    }

    /**
     * Ensure services are initialized
     *
     * @return void
     */
    protected function ensureServices(): void
    {
        if ($this->attributeSanitizer && $this->rendererService) {
            return;
        }

        $layoutManager = $this->getLayoutManager();

        if (!$this->attributeSanitizer) {
            $this->attributeSanitizer = new AttributeSanitizer($layoutManager);
        }

        if (!$this->rendererService) {
            $this->rendererService = new Renderer(
                $layoutManager,
                $this->attributeSanitizer,
                function (array $parsedBlock) {
                    return $this->extractTemplateBlockFromParsedBlock($parsedBlock);
                },
                function ($template) {
                    return $this->sanitizeTemplateBlock($template);
                },
                function (): void {
                    $this->enqueueCarouselAssets();
                }
            );
        }
    }

    /**
     * Extract template block from parsed block
     *
     * @param array $parsedBlock Parsed block data
     * @return array|null
     */
    protected function extractTemplateBlockFromParsedBlock(array $parsedBlock): ?array
    {
        if (empty($parsedBlock)) {
            return null;
        }

        if (($parsedBlock['blockName'] ?? '') === 'jankx/dynamic-data-template') {
            return $parsedBlock;
        }

        if (!empty($parsedBlock['innerBlocks'])) {
            foreach ($parsedBlock['innerBlocks'] as $inner) {
                $found = $this->extractTemplateBlockFromParsedBlock($inner);
                if ($found !== null) {
                    return $found;
                }
            }
        }

        return null;
    }

    /**
     * Enqueue carousel assets if needed
     *
     * @return void
     */
    protected function enqueueCarouselAssets(): void
    {
        // Carousel assets will be handled by PostLayout system
        // This is a placeholder for future carousel-specific assets
    }
    
    /**
     * Normalize block attributes before WordPress processes providesContext
     * 
     * @param array $parsed_block Parsed block data
     * @return array
     */
    public function normalizeBlockAttributes($parsed_block)
    {
        // Only process our block
        if (($parsed_block['blockName'] ?? '') !== $this->blockId) {
            return $parsed_block;
        }
        
        // Ensure attrs array exists
        if (!isset($parsed_block['attrs']) || !is_array($parsed_block['attrs'])) {
            $parsed_block['attrs'] = [];
        }
        
        // Ensure queryId is set and valid (non-empty scalar)
        // Empty string causes "Illegal offset type" error in WordPress
        if (!isset($parsed_block['attrs']['queryId']) || 
            !is_scalar($parsed_block['attrs']['queryId']) || 
            (is_string($parsed_block['attrs']['queryId']) && trim($parsed_block['attrs']['queryId']) === '')) {
            // Generate a unique ID if not set or empty
            $parsed_block['attrs']['queryId'] = uniqid('ddl-', true);
        } else {
            // Ensure it's a string or number (and not empty string)
            if (is_numeric($parsed_block['attrs']['queryId'])) {
                $parsed_block['attrs']['queryId'] = (int) $parsed_block['attrs']['queryId'];
            } else {
                $parsed_block['attrs']['queryId'] = (string) $parsed_block['attrs']['queryId'];
                // If it's still empty after casting, generate a new one
                if (trim($parsed_block['attrs']['queryId']) === '') {
                    $parsed_block['attrs']['queryId'] = uniqid('ddl-', true);
                }
            }
        }
        
        return $parsed_block;
    }

    /**
     * Get layout manager instance
     *
     * @return DynamicDataLayoutManager
     */
    protected function getLayoutManager(): DynamicDataLayoutManager
    {
        if ($this->layoutManager === null) {
            $this->layoutManager = DynamicDataLayoutManager::getInstance();
        }
        return $this->layoutManager;
    }

    /**
     * Get supported layouts for a post type
     *
     * @param string $postType Post type
     * @return array
     */
    public function getSupportedLayouts(string $postType = 'post'): array
    {
        $layoutManager = $this->getLayoutManager();
        return $layoutManager->getLayoutsForPostType($postType);
    }

    /**
     * Render the block
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @param \WP_Block|null $block Block instance
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        // Ensure queryId is set and valid (required for providesContext)
        // queryId must be a non-empty scalar value (string or number), not null, empty string, or array
        if (!isset($attributes['queryId']) || 
            !is_scalar($attributes['queryId']) || 
            (is_string($attributes['queryId']) && trim($attributes['queryId']) === '')) {
            // Generate a unique ID if not set or empty
            $attributes['queryId'] = uniqid('ddl-', true);
        } else {
            // Ensure it's a string or number (and not empty string)
            if (is_numeric($attributes['queryId'])) {
                $attributes['queryId'] = (int) $attributes['queryId'];
            } else {
                $attributes['queryId'] = (string) $attributes['queryId'];
                // If it's still empty after casting, generate a new one
                if (trim($attributes['queryId']) === '') {
                    $attributes['queryId'] = uniqid('ddl-', true);
                }
            }
        }

        $this->ensureServices();

        try {
            return $this->rendererService->render($attributes, $content, $block);
        } catch (\Exception $e) {
            return sprintf(
                '<div class="dynamic-data-layout-error">%s</div>',
                esc_html($e->getMessage())
            );
        }
    }

    /**
     * Sanitize template block structure
     *
     * @param array $block Block array
     * @return array
     */
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

        $layoutManager = $this->getLayoutManager();

        // Get all post types
        $post_types = get_post_types(['public' => true], 'objects');
        $layouts_by_post_type = [];

        foreach ($post_types as $post_type => $post_type_obj) {
            $layouts_by_post_type[$post_type] = $layoutManager->getLayoutsForPostType($post_type);
        }

        // Localize layouts data
        wp_localize_script(
            $script_handle,
            'jankxDynamicDataLayouts',
            [
                'layoutsByPostType' => $layouts_by_post_type,
                'commonLayouts' => $layoutManager->getCommonLayouts(),
            ]
        );

        // Localize query options including query presets
        $query_options = \Jankx\Gutenberg\QueryOptions::getOptions();
        wp_localize_script(
            $script_handle,
            'jankxQueryOptions',
            $query_options
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
        $layoutManager = $this->getLayoutManager();
        $structures = [];

        // Get all post types
        $post_types = get_post_types(['public' => true], 'names');
        $post_types[] = 'common'; // Add common context

        foreach ($post_types as $post_type) {
            $layouts = $post_type === 'common'
                ? $layoutManager->getCommonLayouts()
                : $layoutManager->getLayoutsForPostType($post_type);

            foreach ($layouts as $layoutInfo) {
                $layoutName = $layoutInfo['name'] ?? '';
                if (empty($layoutName)) {
                    continue;
                }

                try {
                    $layout = $layoutManager->createLayout($layoutName, $post_type === 'common' ? 'post' : $post_type, []);
                    
                    if ($layout) {
                        $layoutInstance = $layout->getLayout();
                        if ($layoutInstance && method_exists($layoutInstance, 'getHtmlStructure')) {
                            $key = $post_type === 'common' ? $layoutName : "{$post_type}_{$layoutName}";
                            $structures[$key] = $layoutInstance->getHtmlStructure([]);
                        }
                    }
                } catch (\Exception $e) {
                    continue;
                }
            }
        }

        return [
            'layouts' => $structures,
            'postItem' => [], // Empty for now, or define default
        ];
    }
}

