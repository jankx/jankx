<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Layouts\DynamicDataLayout\DynamicDataLayoutManager;
use Jankx\Layouts\DynamicDataLayout\Renderer;
use Jankx\Layouts\DynamicDataLayout\AttributeSanitizer;
use Jankx\Query\DynamicDataLayoutQueryHelper;
use Jankx\Foundation\Application;
use Jankx\Services\DefaultThumbnailService;

class DynamicSsrLayoutBlock extends Block
{
    protected $blockId = 'jankx/dynamic-ssr-layout';

    protected ?DynamicDataLayoutManager $layoutManager = null;
    protected ?AttributeSanitizer $attributeSanitizer = null;
    protected ?Renderer $rendererService = null;

    public function init()
    {
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets'], 20);
        add_filter('render_block_data', [$this, 'normalizeBlockAttributes'], 10, 1);
        $this->ensureServices();
    }

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

    protected function extractTemplateBlockFromParsedBlock(array $parsedBlock): ?array
    {
        if (empty($parsedBlock)) {
            return null;
        }

        if (($parsedBlock['blockName'] ?? '') === 'jankx/dynamic-ssr-template') {
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

    protected function enqueueCarouselAssets(): void
    {
        $asset_file = $this->blockPath . '/build/view.asset.php';
        $script_file = $this->blockPath . '/build/view.js';
        if (file_exists($asset_file) && file_exists($script_file)) {
            $asset = require $asset_file;
            $handle = 'jankx-dynamic-ssr-layout-view';
            if (!wp_script_is($handle, 'registered')) {
                $script_url = (new \Jankx\Managers\UrlManager())->blockAsset('dynamic-ssr-layout/build/view.js');
                wp_register_script(
                    $handle,
                    $script_url,
                    isset($asset['dependencies']) ? $asset['dependencies'] : [],
                    isset($asset['version']) ? $asset['version'] : false,
                    true
                );
            }
            wp_enqueue_script($handle);
        }
    }

    public function normalizeBlockAttributes($parsed_block)
    {
        if (($parsed_block['blockName'] ?? '') !== $this->blockId) {
            return $parsed_block;
        }
        if (!isset($parsed_block['attrs']) || !is_array($parsed_block['attrs'])) {
            $parsed_block['attrs'] = [];
        }
        if (!isset($parsed_block['attrs']['queryId']) ||
            !is_scalar($parsed_block['attrs']['queryId']) ||
            (is_string($parsed_block['attrs']['queryId']) && trim($parsed_block['attrs']['queryId']) === '')
        ) {
            $parsed_block['attrs']['queryId'] = uniqid('dsl-', true);
        } else {
            if (is_numeric($parsed_block['attrs']['queryId'])) {
                $parsed_block['attrs']['queryId'] = (int) $parsed_block['attrs']['queryId'];
            } else {
                $parsed_block['attrs']['queryId'] = (string) $parsed_block['attrs']['queryId'];
                if (trim($parsed_block['attrs']['queryId']) === '') {
                    $parsed_block['attrs']['queryId'] = uniqid('dsl-', true);
                }
            }
        }
        return $parsed_block;
    }

    protected function getLayoutManager(): DynamicDataLayoutManager
    {
        if ($this->layoutManager === null) {
            $this->layoutManager = DynamicDataLayoutManager::getInstance();
        }
        return $this->layoutManager;
    }

    public function render($attributes, $content = '', $block = null)
    {
        if (!isset($attributes['queryId']) ||
            !is_scalar($attributes['queryId']) ||
            (is_string($attributes['queryId']) && trim($attributes['queryId']) === '')
        ) {
            $attributes['queryId'] = uniqid('dsl-', true);
        } else {
            if (is_numeric($attributes['queryId'])) {
                $attributes['queryId'] = (int) $attributes['queryId'];
            } else {
                $attributes['queryId'] = (string) $attributes['queryId'];
                if (trim($attributes['queryId']) === '') {
                    $attributes['queryId'] = uniqid('dsl-', true);
                }
            }
        }

        $this->ensureServices();

        try {
            if ($block instanceof \WP_Block) {
                $templateBlock = $this->extractTemplateBlockFromParsedBlock($block->parsed_block ?? []);
                if ($templateBlock && !empty($templateBlock['attrs'])) {
                    $templateAttrs = $templateBlock['attrs'];
                    if (!empty($templateAttrs['imageRatio']) && empty($attributes['imageRatio'])) {
                        $attributes['imageRatio'] = $templateAttrs['imageRatio'];
                    }
                    if (!empty($templateAttrs['thumbnailPosition']) && empty($attributes['thumbnailPosition'])) {
                        $attributes['thumbnailPosition'] = $templateAttrs['thumbnailPosition'];
                    }
                }
            }

            $rendered = $this->rendererService->render($attributes, $content, $block);
            $wrapperAttrs = $this->buildWrapperAttributes($attributes);
            return sprintf('<div %s>%s</div>', $wrapperAttrs, $rendered);
        } catch (\Exception $e) {
            return sprintf('<div class="dynamic-ssr-layout-error">%s</div>', esc_html($e->getMessage()));
        }
    }

    protected function buildWrapperAttributes(array $attributes): string
    {
        $attrs = [];
        $baseClass = 'wp-block-jankx-dynamic-ssr-layout';
        $attrs['class'] = implode(' ', [$baseClass]);
        $queryId = isset($attributes['queryId']) ? (string) $attributes['queryId'] : '';
        if ($queryId !== '') {
            $attrs['data-block-id'] = esc_attr($queryId);
            $attrs['data-query-id'] = esc_attr($queryId);
        }
        $attrs['data-post-type'] = esc_attr($attributes['postType'] ?? '');
        $attrs['data-layout'] = esc_attr($attributes['layout'] ?? '');
        if (isset($attributes['postsPerPage'])) {
            $attrs['data-posts-per-page'] = (int) $attributes['postsPerPage'];
        }
        if (isset($attributes['columns'])) {
            $attrs['data-columns'] = (int) $attributes['columns'];
        }
        if (isset($attributes['columnsTablet'])) {
            $attrs['data-columns-tablet'] = (int) $attributes['columnsTablet'];
        }
        if (isset($attributes['columnsMobile'])) {
            $attrs['data-columns-mobile'] = (int) $attributes['columnsMobile'];
        }
        $parts = [];
        foreach ($attrs as $key => $value) {
            if ($key === 'class') {
                $parts[] = sprintf('class="%s"', esc_attr($value));
            } else {
                $parts[] = sprintf('%s="%s"', esc_attr($key), esc_attr((string) $value));
            }
        }
        return implode(' ', $parts);
    }

    public function enqueueEditorAssets()
    {
        $asset_file = $this->blockPath . '/build/index.asset.php';
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

        $layoutManager = $this->getLayoutManager();

        $post_types = get_post_types(['public' => true], 'objects');
        $layouts_by_post_type = [];
        foreach ($post_types as $post_type => $post_type_obj) {
            $layouts_by_post_type[$post_type] = $layoutManager->getLayoutsForPostType($post_type);
        }

        wp_localize_script(
            $script_handle,
            'jankxDynamicDataLayouts',
            [
                'layoutsByPostType' => $layouts_by_post_type,
                'commonLayouts' => $layoutManager->getCommonLayouts(),
            ]
        );

        $public_post_types = [];
        foreach ($post_types as $slug => $obj) {
            $label = '';
            if (isset($obj->labels) && isset($obj->labels->singular_name) && $obj->labels->singular_name) {
                $label = $obj->labels->singular_name;
            } elseif (isset($obj->label) && $obj->label) {
                $label = $obj->label;
            } else {
                $label = ucfirst($slug);
            }
            $public_post_types[] = [
                'slug' => $slug,
                'name' => $label,
            ];
        }
        wp_localize_script($script_handle, 'jankxPublicPostTypes', $public_post_types);

        $query_options = \Jankx\Gutenberg\QueryOptions::getOptions();
        wp_localize_script($script_handle, 'jankxQueryOptions', $query_options);
    }
}
