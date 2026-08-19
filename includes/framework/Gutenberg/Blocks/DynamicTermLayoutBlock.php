<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Blocks\DynamicDataLayoutBlock;
use Jankx\Layouts\DynamicDataLayout\TermBlockTemplateAttributeSanitizer;
use Jankx\Layouts\DynamicDataLayout\TermBlockTemplateRenderer;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutDecorator;

/**
 * Dynamic Term Layout Block
 *
 * Renders a list of taxonomy terms through the standard BlockTemplateLayout
 * pipeline (grid/list/card/carousel/masonry). It reuses every layout class,
 * the layout manager and the heading helper from the post-based
 * DynamicDataLayoutBlock; only the query builder and the item generator are
 * term-specific.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 2.0.0
 */
class DynamicTermLayoutBlock extends DynamicDataLayoutBlock
{
    protected $blockId = 'jankx/dynamic-term-layout';

    /**
     * Register WordPress hooks for this block
     *
     * @return void
     */
    protected function registerHooks(): void
    {
        // Enqueue editor scripts with localized data
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets'], 20);

        // Filter block attributes to ensure queryId is always valid
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
            $this->attributeSanitizer = new TermBlockTemplateAttributeSanitizer($layoutManager);
        }

        if (!$this->rendererService) {
            $this->rendererService = new TermBlockTemplateRenderer(
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
     * Extract the term template block from a parsed block tree
     *
     * @param array $parsedBlock Parsed block data
     * @return array|null
     */
    protected function extractTemplateBlockFromParsedBlock(array $parsedBlock): ?array
    {
        if (empty($parsedBlock)) {
            return null;
        }

        if (in_array(
            ($parsedBlock['blockName'] ?? ''),
            ['jankx/dynamic-term-template'],
            true
        )) {
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
     * Enqueue frontend assets
     *
     * @return void
     */
    public function enqueueFrontendAssets()
    {
        if (is_admin()) {
            return;
        }

        $view_js_path = $this->blockPath . '/build/view.js';
        $view_asset_path = $this->blockPath . '/build/view.asset.php';

        if (file_exists($view_js_path)) {
            $asset = file_exists($view_asset_path) ? require $view_asset_path : [
                'dependencies' => [],
                'version' => filemtime($view_js_path)
            ];

            $block_name = str_replace('jankx/', '', $this->blockId);
            $handle = 'jankx-' . str_replace('/', '-', $block_name) . '-view';

            // Use UrlManager to get correct URL
            $script_url = (new \Jankx\Managers\UrlManager())->blockAsset('dynamic-term-layout/build/view.js');

            wp_enqueue_script(
                $handle,
                $script_url,
                $asset['dependencies'],
                $asset['version'],
                true
            );
        }

        // Enqueue dynamic-term-template styles since it's rendered via this block
        $template_style_path = dirname($this->blockPath) . '/dynamic-term-template/build/style.css';
        $template_asset_path = dirname($this->blockPath) . '/dynamic-term-template/build/style.asset.php';

        if (file_exists($template_style_path)) {
            $template_asset = file_exists($template_asset_path) ? require $template_asset_path : [
                'dependencies' => ['wp-block-library'],
                'version' => filemtime($template_style_path)
            ];

            $template_style_url = get_template_directory_uri() . str_replace(get_template_directory(), '', dirname($this->blockPath)) . '/dynamic-term-template/build/style.css';

            wp_enqueue_style(
                'jankx-dynamic-term-template-style',
                $template_style_url,
                $template_asset['dependencies'],
                $template_asset['version']
            );
        }
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

        $layoutManager = $this->getLayoutManager();

        $all_layouts = $layoutManager->getAvailableLayouts();
        $structured_layouts = [];
        foreach ($all_layouts as $name => $class) {
            $layoutInstance = $layoutManager->createLayout($name);
            $structured_layouts[$name] = [
                'name' => $name,
                'title' => $layoutInstance->getTitle(),
                'icon' => $layoutInstance->getIcon(),
                'supportedOptions' => $layoutInstance->getSupportedOptions(),
                'settingsDefinition' => $layoutInstance->getSettingsDefinition(),
            ];
        }

        // Localize public taxonomies and layouts per taxonomy
        $taxonomies = get_taxonomies(['public' => true], 'objects');
        $public_taxonomies = [];
        $layouts_by_taxonomy = [];

        foreach ($taxonomies as $slug => $taxonomy_obj) {
            $label = '';
            if (isset($taxonomy_obj->labels) && isset($taxonomy_obj->labels->singular_name) && $taxonomy_obj->labels->singular_name) {
                $label = $taxonomy_obj->labels->singular_name;
            } elseif (isset($taxonomy_obj->label) && $taxonomy_obj->label) {
                $label = $taxonomy_obj->label;
            } else {
                $label = ucfirst($slug);
            }

            $public_taxonomies[] = [
                'slug' => $slug,
                'name' => $label,
                'rest_base' => $taxonomy_obj->rest_base ?? $slug,
            ];

            $layouts_by_taxonomy[$slug] = array_values($structured_layouts);
        }

        $common_layouts_names = ['grid', 'list', 'card', 'carousel', 'masonry'];
        $commonLayouts = array_values(array_intersect_key($structured_layouts, array_flip($common_layouts_names)));

        // Register a small inline data script that is always available to the block script
        $data_handle = 'jankx-dynamic-term-layout-editor-data';

        if (!wp_script_is($data_handle, 'registered')) {
            wp_register_script(
                $data_handle,
                false,
                ['wp-blocks', 'wp-i18n'],
                null,
                false
            );
        }

        wp_enqueue_script($data_handle);

        $inline_data = sprintf(
            'window.jankxDynamicTermLayouts = %s;' .
            'window.jankxPublicTaxonomies = %s;',
            wp_json_encode([
                'layoutsByTaxonomy' => $layouts_by_taxonomy,
                'commonLayouts' => $commonLayouts,
            ], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP),
            wp_json_encode($public_taxonomies, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP)
        );

        wp_add_inline_script($data_handle, $inline_data, 'before');

        // Also try localizing on the block script handle for compatibility
        $block_name = str_replace('jankx/', '', $this->blockId);
        $script_handle = 'jankx-' . str_replace('/', '-', $block_name) . '-editor-script';

        if (!wp_script_is($script_handle, 'registered')) {
            $script_handle = 'jankx-' . str_replace('/', '-', $block_name) . '-editor';
        }

        $registered_block = \WP_Block_Type_Registry::get_instance()->get_registered($this->blockId);
        if ($registered_block) {
            if (!empty($registered_block->editor_script_handles) && is_array($registered_block->editor_script_handles)) {
                $script_handle = $registered_block->editor_script_handles[0];
            } elseif (!empty($registered_block->editor_script)) {
                $script_handle = $registered_block->editor_script;
            }
        }

        if (wp_script_is($script_handle, 'registered')) {
            wp_localize_script($script_handle, 'jankxDynamicTermLayouts', [
                'layoutsByTaxonomy' => $layouts_by_taxonomy,
                'commonLayouts' => $commonLayouts,
            ]);
            wp_localize_script($script_handle, 'jankxPublicTaxonomies', $public_taxonomies);
        }
    }

    /**
     * Build a quick term query to check if we have results (for heading visibility)
     *
     * @param array $attributes Block attributes
     * @return \WP_Term_Query
     */
    protected function buildQuickQuery(array $attributes)
    {
        $sanitizedAttributes = $this->attributeSanitizer->sanitize($attributes);
        $layoutName = $sanitizedAttributes['layout'] ?? 'grid';

        $layout = $this->layoutManager->createLayout($layoutName);
        $decorator = new BlockTemplateLayoutDecorator($layout);
        $decorator->withAttributes($sanitizedAttributes);

        $args = [
            'taxonomy' => $sanitizedAttributes['taxonomy'] ?? 'category',
            'hide_empty' => !empty($sanitizedAttributes['hideEmpty']),
            'number' => 1,
            'orderby' => $sanitizedAttributes['orderBy'] ?? 'name',
            'order' => $sanitizedAttributes['order'] ?? 'ASC',
        ];

        return new \WP_Term_Query($args);
    }

    /**
     * Build wrapper attributes with data-* for frontend reconstruction
     *
     * @param array $attributes
     * @return string
     */
    protected function buildWrapperAttributes(array $attributes): string
    {
        $attrs = [];

        $baseClass = 'wp-block-jankx-dynamic-term-layout';
        $attrs['class'] = implode(' ', [
            $baseClass,
            !empty($attributes['className']) ? $attributes['className'] : '',
        ]);

        if (($attributes['layout'] ?? '') === 'carousel') {
            $attrs['class'] .= ' jankx-carousel dynamic-term-layout--carousel';

            $attrs['data-layout'] = 'carousel';
            $attrs['data-slides-per-view'] = esc_attr($attributes['columns'] ?? 3);
            $attrs['data-space-between'] = esc_attr($attributes['spaceBetween'] ?? 16);
            $attrs['data-autoplay'] = !empty($attributes['autoplay']) ? 'true' : 'false';
            $attrs['data-autoplay-delay'] = esc_attr($attributes['autoplayDelay'] ?? 3000);
            $attrs['data-loop'] = !empty($attributes['loop']) ? 'true' : 'false';
            $attrs['data-peek-amount'] = esc_attr($attributes['carouselPeek'] ?? 0);

            $attrs['class'] .= ' has-carousel';
        }

        $queryId = isset($attributes['queryId']) ? (string) $attributes['queryId'] : '';
        if ($queryId !== '') {
            $attrs['data-block-id'] = esc_attr($queryId);
            $attrs['data-query-id'] = esc_attr($queryId);
        }

        $attrs['data-taxonomy'] = esc_attr($attributes['taxonomy'] ?? '');
        $attrs['data-layout'] = esc_attr($attributes['layout'] ?? '');

        $styleRules = [];
        $columns = isset($attributes['columns']) ? (int) $attributes['columns'] : 3;
        $attrs['data-columns'] = $columns;
        $styleRules[] = '--columns-desktop: ' . $columns;
        $styleRules[] = '--slides-per-view: ' . $columns;
        $styleRules[] = '--peek-amount: ' . ($attributes['carouselPeek'] ?? 0) . '%';

        if (isset($attributes['postsPerPage'])) {
            $attrs['data-posts-per-page'] = (int) $attributes['postsPerPage'];
        }

        if (isset($attributes['columnsTablet'])) {
            $attrs['data-columns-tablet'] = (int) $attributes['columnsTablet'];
            $styleRules[] = '--columns-tablet: ' . (int) $attributes['columnsTablet'];
        }
        if (isset($attributes['columnsMobile'])) {
            $attrs['data-columns-mobile'] = (int) $attributes['columnsMobile'];
            $styleRules[] = '--columns-mobile: ' . (int) $attributes['columnsMobile'];
        }

        if (!empty($attributes['orderBy'])) {
            $attrs['data-order-by'] = esc_attr($attributes['orderBy']);
        }
        if (!empty($attributes['order'])) {
            $attrs['data-order'] = esc_attr($attributes['order']);
        }
        if (!empty($attributes['thumbnailPosition'])) {
            $attrs['data-thumbnail-position'] = esc_attr($attributes['thumbnailPosition']);
        }

        // Embed full attributes for AJAX/stateless reconstruction
        $attrs['data-block-settings'] = esc_attr(wp_json_encode($attributes));

        if (!empty($styleRules)) {
            $attrs['style'] = implode(';', $styleRules);
        }

        $parts = [];
        foreach ($attrs as $key => $value) {
            if ($value === '' || $value === null) {
                continue;
            }
            $parts[] = sprintf('%s="%s"', esc_attr($key), esc_attr((string) $value));
        }

        return implode(' ', $parts);
    }
}
