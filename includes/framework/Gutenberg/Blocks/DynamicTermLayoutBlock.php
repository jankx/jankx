<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Facades\Log;
use Jankx\Gutenberg\Blocks\DynamicDataLayoutBlock;
use Jankx\Layouts\DynamicDataLayout\TermBlockTemplateAttributeSanitizer;
use Jankx\Layouts\DynamicDataLayout\TermBlockTemplateRenderer;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutDecorator;
use Jankx\Layouts\DynamicDataLayout\Generators\TermTemplateBlockGenerator;

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

        // AJAX filtering endpoint for smart-tab advanced-filter triggers
        add_action('wp_ajax_jankx_dynamic_term_layout_filter', [$this, 'ajaxTermFilterUpdate']);
        add_action('wp_ajax_nopriv_jankx_dynamic_term_layout_filter', [$this, 'ajaxTermFilterUpdate']);
        add_filter('jankx_dynamic_term_layout_get_block_attributes', [$this, 'handleGetTermBlockAttributes'], 10, 3);
        add_filter('jankx_dynamic_term_layout_filter_update', [$this, 'handleTermFilterUpdate'], 10, 2);

        $this->ensureServices();
    }

    /**
     * AJAX handler for Dynamic Term Layout filter update
     *
     * @return void
     */
    public function ajaxTermFilterUpdate(): void
    {
        check_ajax_referer('jankx_load_more', 'nonce');

        $block_id = isset($_POST['block_id']) ? sanitize_text_field(wp_unslash($_POST['block_id'])) : '';
        $attributes_json = isset($_POST['attributes']) ? wp_unslash($_POST['attributes']) : '';
        $filters_json = isset($_POST['filters']) ? wp_unslash($_POST['filters']) : '[]';
        $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;

        if (empty($block_id)) {
            wp_send_json_error(['message' => __('Block ID is required', 'jankx')]);
        }

        $attributes = [];
        $filters = [];

        if (!empty($attributes_json)) {
            $decoded = json_decode($attributes_json, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $attributes = $decoded;
            }
        }

        if (!empty($filters_json)) {
            $decoded = json_decode($filters_json, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $filters = $decoded;
            }
        }

        if (empty($post_id)) {
            $post_id = get_the_ID() ?: 0;
        }

        if (empty($attributes) && $post_id > 0) {
            $block_data_result = apply_filters('jankx_dynamic_term_layout_get_block_attributes', null, $post_id, $block_id);
            if ($block_data_result !== null) {
                $attributes = $block_data_result;
            }
        }

        if (empty($attributes)) {
            wp_send_json_error(['message' => __('Block attributes not found', 'jankx')]);
        }

        if (empty($attributes['queryId'])) {
            $attributes['queryId'] = $block_id;
        }

        if (empty($attributes['termTemplate'])) {
            $cachedTemplate = get_transient('jankx_dtl_template_' . $block_id);
            if (is_array($cachedTemplate)) {
                $attributes['termTemplate'] = $cachedTemplate;
            } elseif ($post_id > 0) {
                $realAttrs = apply_filters('jankx_dynamic_term_layout_get_block_attributes', null, $post_id, $block_id);
                if (!empty($realAttrs['termTemplate'])) {
                    $attributes['termTemplate'] = $realAttrs['termTemplate'];
                    set_transient('jankx_dtl_template_' . $block_id, $attributes['termTemplate'], DAY_IN_SECONDS);
                }
            }
        }

        try {
            $result = apply_filters('jankx_dynamic_term_layout_filter_update', $attributes, $filters);
            if (!is_array($result)) {
                $result = ['html' => '', 'attributes' => $attributes];
            }
            wp_send_json_success($result);
        } catch (\Throwable $e) {
            $message = $e->getMessage();
            if (defined('WP_DEBUG') && WP_DEBUG) {
                $message .= ' at ' . $e->getFile() . ':' . $e->getLine();
            }
            wp_send_json_error(['message' => $message]);
        }
    }

    /**
     * Resolve term layout block attributes from post content
     *
     * @param mixed $default Default return value
     * @param int $post_id Post ID
     * @param string $block_id Block queryId
     * @return array|null
     */
    public function handleGetTermBlockAttributes($default, int $post_id, string $block_id)
    {
        if (!$post_id) {
            return $default;
        }

        $post_obj = get_post($post_id);
        if (!$post_obj) {
            return $default;
        }

        $blocks = parse_blocks($post_obj->post_content);

        return $this->findTermBlockAttributesById($blocks, $block_id) ?? $default;
    }

    /**
     * Recursively find term layout block attributes by queryId
     *
     * @param array $blocks Parsed blocks
     * @param string $target_block_id
     * @return array|null
     */
    private function findTermBlockAttributesById(array $blocks, string $target_block_id): ?array
    {
        foreach ($blocks as $block) {
            if (($block['blockName'] ?? '') === 'jankx/dynamic-term-layout') {
                $query_id = $block['attrs']['queryId'] ?? null;
                if ($query_id && strval($query_id) === $target_block_id) {
                    $attrs = $block['attrs'] ?? [];
                    $template = $this->extractTemplateBlockFromParsedBlock($block);
                    if ($template !== null) {
                        $attrs['termTemplate'] = $template;
                    }
                    return $attrs;
                }
            }

            if (!empty($block['innerBlocks'])) {
                $result = $this->findTermBlockAttributesById($block['innerBlocks'], $target_block_id);
                if ($result !== null) {
                    return $result;
                }
            }
        }

        return null;
    }

    /**
     * Apply filters to attributes and render the filtered term layout
     *
     * Supported filter mappings:
     *  - keyword  -> term search
     *  - {taxonomy} => [termId] -> show child terms of the selected term
     *
     * @param array $attributes Block attributes
     * @param array $filters Filter values
     * @return array
     */
    public function handleTermFilterUpdate(array $attributes, array $filters): array
    {
        Log::debug('[TermLayout] Incoming Filters: ' . json_encode($filters));

        if (empty($attributes['queryId'])) {
            return [];
        }

        $this->ensureServices();

        $layoutName = $attributes['layout'] ?? 'grid';

        foreach ($filters as $key => $value) {
            if ($key === 'keyword' && !empty($value)) {
                $attributes['keyword'] = is_string($value) ? $value : '';
                continue;
            }

            if (is_array($value) && !empty($value) && taxonomy_exists($key)) {
                $attributes['termParent'] = (int) $value[0];
            }
        }

        $attributes = $this->attributeSanitizer->sanitize($attributes, $layoutName, true);

        $layout = $this->layoutManager->createLayout($layoutName);
        $decorator = new BlockTemplateLayoutDecorator($layout);
        $decorator->withAttributes($attributes);

        $terms = $this->buildFilteredTermQuery($attributes);

        if (is_wp_error($terms) || empty($terms)) {
            $html = sprintf(
                '<div %s></div>',
                $this->buildWrapperAttributes($attributes)
            );
            return ['html' => $html, 'attributes' => $attributes];
        }

        $renderOffset = (int) ($attributes['renderOffset'] ?? 0);
        $renderLimit = (int) ($attributes['renderLimit'] ?? 0);
        if ($renderOffset > 0 || $renderLimit > 0) {
            $terms = array_slice($terms, $renderOffset, $renderLimit > 0 ? $renderLimit : null);
        }

        $layout->setQuery($terms);
        $layout->setOptions($attributes);

        $templateBlock = null;
        if (!empty($attributes['termTemplate'])) {
            $templateBlock = $this->sanitizeTemplateBlock($attributes['termTemplate']);
        }

        if ($templateBlock) {
            $layout->setOptions(array_merge($attributes, [
                'postTemplate' => $templateBlock,
            ]));
        }

        $layout->setContentGenerator(new TermTemplateBlockGenerator([], $attributes));

        $html = $layout->render();

        if ($layoutName === 'carousel') {
            $this->enqueueCarouselAssets();
        }

        $html = sprintf('<div %s>%s</div>', $this->buildWrapperAttributes($attributes), $html);

        return [
            'html' => $html,
            'attributes' => $attributes,
        ];
    }

    /**
     * Build a WP_Term_Query from merged attributes and return terms
     *
     * @param array $attributes Sanitized attributes
     * @return array|\WP_Error
     */
    private function buildFilteredTermQuery(array $attributes)
    {
        $args = [
            'taxonomy'   => $attributes['taxonomy'] ?? 'category',
            'hide_empty' => !empty($attributes['hideEmpty']),
            'number'     => (int) ($attributes['number'] ?? 10),
            'orderby'    => $attributes['orderBy'] ?? 'name',
            'order'      => $attributes['order'] ?? 'ASC',
        ];

        if (!empty($attributes['termIn'])) {
            $args['include'] = (array) $attributes['termIn'];
        }

        if (!empty($attributes['termNotIn'])) {
            $args['exclude'] = (array) $attributes['termNotIn'];
        }

        if (!empty($attributes['termParent'])) {
            $args['parent'] = (int) $attributes['termParent'];
        }

        if (!empty($attributes['keyword'])) {
            $args['search'] = $attributes['keyword'];
        }

        $args = apply_filters('jankx/dynamic-term-layout/query_args', $args, $attributes);

        return (new \WP_Term_Query($args))->get_terms();
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

        $view_js_path = dirname($this->blockPath) . '/dist/blocks/dynamic-term-layout/view.js';
        $view_asset_path = dirname($this->blockPath) . '/dist/blocks/dynamic-term-layout/view.asset.php';

        if (file_exists($view_js_path)) {
            $asset = file_exists($view_asset_path) ? require $view_asset_path : [
                'dependencies' => [],
                'version' => filemtime($view_js_path)
            ];

            $block_name = str_replace('jankx/', '', $this->blockId);
            $handle = 'jankx-' . str_replace('/', '-', $block_name) . '-view';

            // Use UrlManager to get correct URL
            $script_url = (new \Jankx\Managers\UrlManager())->blockAsset('dist/blocks/dynamic-term-layout/view.js');

            wp_enqueue_script(
                $handle,
                $script_url,
                $asset['dependencies'],
                $asset['version'],
                true
            );
        }

        // Enqueue dynamic-term-template styles since it's rendered via this block
        $template_style_path = dirname($this->blockPath) . '/dist/blocks/dynamic-term-template/style.css';
        $template_asset_path = dirname($this->blockPath) . '/dist/blocks/dynamic-term-template/style.asset.php';

        if (file_exists($template_style_path)) {
            $template_asset = file_exists($template_asset_path) ? require $template_asset_path : [
                'dependencies' => ['wp-block-library'],
                'version' => filemtime($template_style_path)
            ];

            $template_style_url = get_template_directory_uri() . str_replace(get_template_directory(), '', dirname($this->blockPath)) . '/dist/blocks/dynamic-term-template/style.css';

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
        // Patch for WP 7.1 where UnitControl was moved to experimental
        $compat_handle = 'jankx-unitcontrol-compat';
        if (!wp_script_is($compat_handle, 'registered')) {
            wp_register_script($compat_handle, false, ['wp-components'], null, false);
        }
        wp_enqueue_script($compat_handle);
        wp_add_inline_script(
            $compat_handle,
            'window.wp=window.wp||{};window.wp.components=window.wp.components||{};if(!window.wp.components.UnitControl&&window.wp.components.__experimentalUnitControl){window.wp.components.UnitControl=window.wp.components.__experimentalUnitControl;}',
            'before'
        );

        $asset_file = dirname($this->blockPath) . '/dist/blocks/dynamic-term-layout/index.asset.php';

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
            wp_add_inline_script(
                $script_handle,
                'window.wp=window.wp||{};window.wp.components=window.wp.components||{};if(!window.wp.components.UnitControl&&window.wp.components.__experimentalUnitControl){window.wp.components.UnitControl=window.wp.components.__experimentalUnitControl;}',
                'before'
            );
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
