<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Gutenberg\Helpers\HeadingBlockHandler;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateRenderer;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateAttributeSanitizer;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutDecorator;
use Jankx\Query\DynamicDataLayoutQueryHelper;
use Jankx\Foundation\Application;
use Jankx\Services\DefaultThumbnailService;

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
    use HeadingBlockHandler;

    protected $blockId = 'jankx/dynamic-data-layout';

    /**
     * Block Template Layout Manager instance
     *
     * @var BlockTemplateLayoutManager|null
     */
    protected $layoutManager = null;

    /**
     * Attribute Sanitizer instance
     *
     * @var BlockTemplateAttributeSanitizer|null
     */
    protected ?BlockTemplateAttributeSanitizer $attributeSanitizer = null;

    /**
     * Renderer Service instance
     *
     * @var BlockTemplateRenderer|null
     */
    protected ?BlockTemplateRenderer $rendererService = null;

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
        // This runs before WordPress processes providesContext
        add_filter('render_block_data', [$this, 'normalizeBlockAttributes'], 10, 1);

        // Register handlers via WordPress filters (for AJAX requests from advanced-filters)
        add_filter('jankx_dynamic_data_layout_filter_update', [$this, 'handleFilterUpdate'], 10, 2);
        add_filter('jankx_dynamic_data_layout_get_block_attributes', [$this, 'handleGetBlockAttributes'], 10, 3);

        // AJAX endpoints for dynamic-data-layout
        add_action('wp_ajax_jankx_dynamic_data_layout_filter', [$this, 'ajaxFilterUpdate']);
        add_action('wp_ajax_nopriv_jankx_dynamic_data_layout_filter', [$this, 'ajaxFilterUpdate']);

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
            $this->attributeSanitizer = new BlockTemplateAttributeSanitizer($layoutManager);
        }

        if (!$this->rendererService) {
            $this->rendererService = new BlockTemplateRenderer(
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

        if (in_array(($parsedBlock['blockName'] ?? ''), ['jankx/dynamic-data-template', 'jankx/dynamic-data-ssr', 'jankx/dynamic-ssr-template'], true)) {
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
        if (
            !isset($parsed_block['attrs']['queryId']) ||
            !is_scalar($parsed_block['attrs']['queryId']) ||
            (is_string($parsed_block['attrs']['queryId']) && trim($parsed_block['attrs']['queryId']) === '')
        ) {
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
     * @return BlockTemplateLayoutManager
     */
    protected function getLayoutManager(): BlockTemplateLayoutManager
    {
        if ($this->layoutManager === null) {
            $this->layoutManager = Application::getInstance()->make(BlockTemplateLayoutManager::class);
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
        // Enqueue frontend assets only when block is rendered
        $this->enqueueFrontendAssets();

        // Ensure queryId is set and valid (required for providesContext)
        // queryId must be a non-empty scalar value (string or number), not null, empty string, or array
        if (
            !isset($attributes['queryId']) ||
            !is_scalar($attributes['queryId']) ||
            (is_string($attributes['queryId']) && trim($attributes['queryId']) === '')
        ) {
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
            // Extract template block attributes (thumbnailPosition) and merge into parent attributes
            if ($block instanceof \WP_Block) {
                $templateBlock = $this->extractTemplateBlockFromParsedBlock($block->parsed_block ?? []);
                if ($templateBlock && !empty($templateBlock['attrs'])) {
                    $templateAttrs = $templateBlock['attrs'];
                    // Merge template block attributes into parent attributes, overriding defaults
                    $keysToMerge = [
                        'thumbnailPosition',
                        'overlayIcon',
                        'overlayIconType',
                        'overlayIconImageUrl',
                        'overlayIconText',
                        'overlayIconRotate',
                        'overlayIconPosition',
                        'overlayIconSize',
                        'overlayIconColor',
                        'overlayIconBackground',
                        'overlayIconShowMode',
                        'overlayIconTarget',
                    ];
                    foreach ($keysToMerge as $k) {
                        if (array_key_exists($k, $templateAttrs)) {
                            $attributes[$k] = $templateAttrs[$k];
                        }
                    }
                    if (!empty($attributes['queryId'])) {
                        $this->cacheTemplateByBlockId((string) $attributes['queryId'], $templateBlock);
                    }
                }
            }

            // Extract and separate heading block from inner blocks
            $innerBlocks = $this->separateInnerBlocks($block);
            $headingBlock = $innerBlocks['heading'];

            $rendered = $this->rendererService->render($attributes, $content, $block);

            // Build a quick query to check if we have results (for heading visibility)
            $query = $this->buildQuickQuery($attributes);
            $headingHtml = $this->renderHeadingBlock($headingBlock, $query);

            // Expose data attributes so other blocks (e.g., advanced-filters) can find and update this block via AJAX
            $wrapperAttrs = $this->buildWrapperAttributes($attributes);

            return sprintf('<div %s>%s%s</div>', $wrapperAttrs, $headingHtml, $rendered);
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
            $script_url = (new \Jankx\Managers\UrlManager())->blockAsset('dynamic-data-layout/build/view.js');

            wp_enqueue_script(
                $handle,
                $script_url,
                $asset['dependencies'],
                $asset['version'],
                true
            );

            // Localize script with necessary data
            wp_localize_script($handle, 'jankxDynamicDataLayoutView', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('jankx_load_more')
            ]);
        }

        // Enqueue dynamic-data-template styles since it's rendered via this block
        $template_style_path = dirname($this->blockPath) . '/dynamic-data-template/build/style.css';
        $template_asset_path = dirname($this->blockPath) . '/dynamic-data-template/build/style.asset.php';

        if (file_exists($template_style_path)) {
            $template_asset = file_exists($template_asset_path) ? require $template_asset_path : [
                'dependencies' => ['wp-block-library'],
                'version' => filemtime($template_style_path)
            ];

            $template_style_url = get_template_directory_uri() . str_replace(get_template_directory(), '', dirname($this->blockPath)) . '/dynamic-data-template/build/style.css';

            wp_enqueue_style(
                'jankx-dynamic-data-template-style',
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

        // Get all post types
        $post_types = get_post_types(['public' => true], 'objects');
        $layouts_by_post_type = [];

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

        foreach ($post_types as $post_type => $post_type_obj) {
            // array_values() ensures the per-post-type list is a JSON array, not a JSON object.
            $layouts_by_post_type[$post_type] = array_values($structured_layouts);
        }

        $common_layouts_names = ['grid', 'list', 'card', 'carousel', 'masonry'];
        // array_intersect_key preserves string keys → JSON encodes as object {}.
        // Use array_values() to get indexed array → JSON encodes as array [].
        // This is required because JS normalizeLayouts() uses Array.isArray() guard.
        $commonLayouts = array_values(array_intersect_key($structured_layouts, array_flip($common_layouts_names)));

        // Localize public post types for editor (ensure non-REST CPTs like product/tour appear)
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

        // Localize query options including query presets
        $query_options = \Jankx\Gutenberg\QueryOptions::getOptions();

        // Localize layout structures for JavaScript rendering
        $layout_structures = $this->getLayoutStructures();

        // Build inline script data — this is the most reliable approach because
        // wp_localize_script requires the target handle to be registered BEFORE
        // this hook runs, which is not always guaranteed.
        // We register a small "data" script that depends on wp-blocks (always available)
        // and output all globals as an inline script before it.
        $data_handle = 'jankx-dynamic-data-layout-editor-data';

        if (!wp_script_is($data_handle, 'registered')) {
            wp_register_script(
                $data_handle,
                false, // no src — inline only
                ['wp-blocks', 'wp-i18n'],
                null,
                false // in <head> to ensure available before block scripts
            );
        }

        wp_enqueue_script($data_handle);

        // Build the inline JavaScript that sets all required globals
        $inline_data = sprintf(
            'window.jankxDynamicDataLayouts = %s;' .
            'window.jankxPublicPostTypes = %s;' .
            'window.jankxQueryOptions = %s;' .
            'window.jankxLayoutStructures = %s;',
            wp_json_encode([
                'layoutsByPostType' => $layouts_by_post_type,
                'commonLayouts' => $commonLayouts,
            ], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP),
            wp_json_encode($public_post_types, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP),
            wp_json_encode($query_options, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP),
            wp_json_encode($layout_structures, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP)
        );

        wp_add_inline_script($data_handle, $inline_data, 'before');

        // Also try wp_localize_script on the actual block script handle if found,
        // so data is available in both ways (for compatibility).
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
            wp_localize_script($script_handle, 'jankxDynamicDataLayouts', [
                'layoutsByPostType' => $layouts_by_post_type,
                'commonLayouts'     => $commonLayouts,
            ]);
            wp_localize_script($script_handle, 'jankxPublicPostTypes', $public_post_types);
            wp_localize_script($script_handle, 'jankxQueryOptions', $query_options);
            wp_localize_script($script_handle, 'jankxLayoutStructures', $layout_structures);
        }
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
            $layouts = ($post_type === 'common')
                ? $layoutManager->getCommonLayouts()
                : $layoutManager->getLayoutsForPostType($post_type);

            foreach ($layouts as $layoutName => $layoutClass) {
                if (empty($layoutName)) {
                    continue;
                }

                try {
                    $layout = $layoutManager->createLayout($layoutName);
                    if ($layout) {
                        $key = "{$post_type}_{$layoutName}";
                        $structures[$key] = $layout->getHtmlStructure([]);
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

    /**
     * Handle Filter Update request via filter
     *
     * @param array $attributes Block attributes
     * @param array $filters Filter values
     * @return array Response data
     */
    public function handleFilterUpdate(array $attributes, array $filters): array
    {
        // Check if this is for our block type - must have queryId and postType
        if (empty($attributes['queryId']) || empty($attributes['postType'])) {
            // Not our block or incomplete data, return empty to let other handlers process
            return [];
        }

        $this->ensureServices();

        $layoutName = $attributes['layout'] ?? 'grid';
        $postType = $attributes['postType'] ?? 'post';

        // Apply filters to attributes
        $attributes = DynamicDataLayoutQueryHelper::applyFiltersToAttributes($attributes, $filters);
        $layoutName = $attributes['layout'] ?? $layoutName;

        // Sanitize attributes
        $attributes = $this->attributeSanitizer->sanitize($layoutName, $attributes, true);

        // Create layout decorator
        $layout = $this->layoutManager->createLayout($layoutName);
        $decorator = new BlockTemplateLayoutDecorator($layout);

        // Build query
        $originalPreset = $attributes['queryPreset'] ?? 'custom';
        $query = $this->buildQueryForPreset($decorator, $attributes, $originalPreset, $postType);
        $decorator->withQuery($query);
        $decorator->withAttributes($attributes);

        // Resolve template block
        $templateBlock = null;
        if (!empty($attributes['postTemplate'])) {
            $templateBlock = $attributes['postTemplate'];
        }

        // Set content generator if template block exists
        if ($templateBlock) {
            $templateAttrs = $templateBlock['attrs'] ?? [];
            if (!empty($templateAttrs['thumbnailPosition']) && empty($attributes['thumbnailPosition'])) {
                $attributes['thumbnailPosition'] = $templateAttrs['thumbnailPosition'];
            }
            $generator = new \Jankx\Layouts\DynamicDataLayout\Generators\PostTemplateBlockGenerator($templateBlock, $attributes);
            $layoutInstance = $decorator->getLayout();
            $layoutInstance->setContentGenerator($generator);
        }

        // Render layout
        $html = $decorator->render();

        // Wrap with data attributes so subsequent AJAX updates keep block metadata
        $wrapperAttrs = $this->buildWrapperAttributes($attributes);
        $html = sprintf('<div %s>%s</div>', $wrapperAttrs, $html);

        return [
            'html' => $html,
            'attributes' => $attributes,
        ];
    }

    /**
     * Handle Get Block Attributes request via filter
     *
     * @param mixed $default Default return value
     * @param int $post_id Post ID
     * @param string $block_id Block queryId
     * @return array|null Block attributes
     */
    public function handleGetBlockAttributes($default, int $post_id, string $block_id)
    {
        if (!$post_id) {
            return $default;
        }

        $post_obj = get_post($post_id);
        if (!$post_obj) {
            return $default;
        }

        $blocks = parse_blocks($post_obj->post_content);
        $found = $this->findBlockAttributesById($blocks, $block_id);

        return $found !== null ? $found : $default;
    }

    /**
     * Recursively find block attributes by queryId
     *
     * @param array $blocks Parsed blocks
     * @param string $target_block_id
     * @return array|null
     */
    private function findBlockAttributesById(array $blocks, string $target_block_id): ?array
    {
        foreach ($blocks as $block) {
            if (($block['blockName'] ?? '') === 'jankx/dynamic-data-layout') {
                $query_id = $block['attrs']['queryId'] ?? null;
                if ($query_id && strval($query_id) === $target_block_id) {
                    $attrs = $block['attrs'] ?? [];
                    $template = $this->extractTemplateBlockFromParsedBlock($block);
                    if ($template !== null) {
                        $attrs['postTemplate'] = $template;
                    }
                    return $attrs;
                }
            }

            if (!empty($block['innerBlocks'])) {
                $result = $this->findBlockAttributesById($block['innerBlocks'], $target_block_id);
                if ($result !== null) {
                    return $result;
                }
            }
        }

        return null;
    }

    /**
     * Build query for preset
     *
     * @param mixed $decorator Layout decorator
     * @param array $attributes Block attributes
     * @param string $originalPreset Original preset
     * @param string $postType Post type
     * @return \WP_Query
     */
    private function buildQueryForPreset($decorator, array $attributes, string $originalPreset, string $postType): \WP_Query
    {
        if ($originalPreset === 'default') {
            return DynamicDataLayoutQueryHelper::buildDefaultQuery($attributes);
        } elseif ($originalPreset === 'related') {
            $attributes = DynamicDataLayoutQueryHelper::buildRelatedQuery($attributes);
            $decorator->withAttributes($attributes);
            return $decorator->buildQuery($attributes);
        } else {
            if ($originalPreset !== 'custom') {
                $attributes = DynamicDataLayoutQueryHelper::applyQueryBuilderFilter($attributes, $originalPreset);
            }
            $decorator->withAttributes($attributes);
            return $decorator->buildQuery($attributes);
        }
    }

    /**
     * Build a quick query to check if we have results (for heading visibility)
     *
     * @param array $attributes Block attributes
     * @return \WP_Query
     */
    protected function buildQuickQuery(array $attributes): \WP_Query
    {
        $sanitizedAttributes = $this->attributeSanitizer->sanitize($attributes);
        $layoutName = $sanitizedAttributes['layout'] ?? 'grid';

        $layout = $this->layoutManager->createLayout($layoutName);
        $decorator = new BlockTemplateLayoutDecorator($layout);
        $decorator->withAttributes($sanitizedAttributes);

        $originalPreset = $sanitizedAttributes['queryPreset'] ?? 'custom';
        $postType = $sanitizedAttributes['postType'] ?? 'post';

        $query = $this->buildQueryForPreset($decorator, $sanitizedAttributes, $originalPreset, $postType);

        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('[DDL buildQuickQuery] Returning query');
            error_log(sprintf('[DDL buildQuickQuery] Query object ID: %s', spl_object_hash($query)));
            error_log(sprintf('[DDL buildQuickQuery] Query posts count: %d', count($query->posts)));
        }

        return $query;
    }


    /**
     * Build wrapper attributes with data-* for AJAX/filter integrations
     *
     * @param array $attributes
     * @return string
     */
    /**
     * Build wrapper attributes with data-* for AJAX/filter integrations
     *
     * @param array $attributes
     * @return string
     */
    protected function buildWrapperAttributes(array $attributes): string
    {
        $attrs = [];

        // Add block class for easier selection
        $baseClass = 'wp-block-jankx-dynamic-data-layout';
        // Include layout-constrained classes to match editor wrapper behavior
        $attrs['class'] = implode(' ', [
            $baseClass,
            !empty($attributes['className']) ? $attributes['className'] : '',
        ]);

        // Add carousel-specific attributes
        if (($attributes['layout'] ?? '') === 'carousel') {
            // Add carousel class
            $attrs['class'] .= ' jankx-carousel dynamic-data-layout--carousel';

            // Add carousel data attributes
            $attrs['data-layout'] = 'carousel';
            $attrs['data-slides-per-view'] = esc_attr($attributes['columns'] ?? 3);
            $attrs['data-space-between'] = esc_attr($attributes['spaceBetween'] ?? 16);
            $attrs['data-autoplay'] = !empty($attributes['autoplay']) ? 'true' : 'false';
            $attrs['data-autoplay-delay'] = esc_attr($attributes['autoplayDelay'] ?? 3000);
            $attrs['data-loop'] = !empty($attributes['loop']) ? 'true' : 'false';
            $attrs['data-peek-amount'] = esc_attr($attributes['carouselPeek'] ?? 0);

            // Add carousel container class
            $attrs['class'] .= ' has-carousel';
        }

        // queryId is required; expose as data-block-id and data-query-id
        $queryId = isset($attributes['queryId']) ? (string) $attributes['queryId'] : '';
        if ($queryId !== '') {
            $attrs['data-block-id'] = esc_attr($queryId);
            $attrs['data-query-id'] = esc_attr($queryId);
        }

        // Helpful data attributes for frontend reconstruction
        $attrs['data-post-type'] = esc_attr($attributes['postType'] ?? '');
        $attrs['data-layout'] = esc_attr($attributes['layout'] ?? '');

        // Setup columns variables
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
        if (!empty($attributes['queryPreset'])) {
            $attrs['data-query-preset'] = esc_attr($attributes['queryPreset']);
        }

        if (!empty($attributes['thumbnailPosition'])) {
            $attrs['data-thumbnail-position'] = esc_attr($attributes['thumbnailPosition']);
        }

        // Embed full attributes for AJAX fallback
        $attrs['data-block-settings'] = esc_attr(wp_json_encode($attributes));

        // Inject style attribute
        if (!empty($styleRules)) {
            $attrs['style'] = implode(';', $styleRules);
        }

        // Build attribute string
        $parts = [];
        foreach ($attrs as $key => $value) {
            if ($value === '' || $value === null) {
                continue;
            }
            $parts[] = sprintf('%s="%s"', esc_attr($key), esc_attr((string) $value));
        }

        return implode(' ', $parts);
    }



    /**
     * AJAX handler for Dynamic Data Layout filter update
     */
    public function ajaxFilterUpdate(): void
    {
        check_ajax_referer('jankx_load_more', 'nonce');

        // Boot DefaultThumbnailService in AJAX context
        $this->bootDefaultThumbnailService();

        $block_id = isset($_POST['block_id']) ? sanitize_text_field(wp_unslash($_POST['block_id'])) : '';
        $attributes_json = isset($_POST['attributes']) ? sanitize_text_field(wp_unslash($_POST['attributes'])) : '';
        $filters_json = isset($_POST['filters']) ? sanitize_text_field(wp_unslash($_POST['filters'])) : '[]';
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
            // Delegate to Block handler via filter to get block attributes
            $block_data_result = apply_filters('jankx_dynamic_data_layout_get_block_attributes', null, $post_id, $block_id);
            if ($block_data_result !== null) {
                $attributes = $block_data_result;
            }
        }

        if (empty($attributes)) {
            wp_send_json_error(['message' => __('Block attributes not found', 'jankx')]);
        }

        if (!empty($block_id) && empty($attributes['queryId'])) {
            $attributes['queryId'] = $block_id;
        }

        if (empty($attributes['postTemplate']) && !empty($attributes['queryId'])) {
            $cachedTemplate = $this->getCachedTemplateByBlockId((string) $attributes['queryId']);
            if (is_array($cachedTemplate)) {
                $attributes['postTemplate'] = $cachedTemplate;
            }
        }

        try {
            $result = apply_filters('jankx_dynamic_data_layout_filter_update', $attributes, $filters);
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

    protected function cacheTemplateByBlockId(string $blockId, array $template): void
    {
        set_transient('jankx_ddl_template_' . $blockId, $template, DAY_IN_SECONDS);
    }

    protected function getCachedTemplateByBlockId(string $blockId): ?array
    {
        $cached = get_transient('jankx_ddl_template_' . $blockId);
        return is_array($cached) ? $cached : null;
    }

    /**
     * Boot DefaultThumbnailService in AJAX context
     * 
     * This ensures default thumbnails are applied when rendering posts via AJAX
     *
     * @return void
     */
    protected function bootDefaultThumbnailService(): void
    {
        // Check if filters are already added (service already booted)
        if (has_filter('has_post_thumbnail', '__return_true')) {
            // Service is already booted, no need to boot again
            return;
        }

        // Try to get service from Application container
        try {
            $app = Application::getInstance();
            $service = $app->make(DefaultThumbnailService::class);

            if ($service && $service->isEnabled()) {
                $service->boot();
            }
        } catch (\Exception $e) {
            // If service is not available, try to create and boot directly
            // This is a fallback for cases where Application is not fully initialized
            $service = new DefaultThumbnailService();
            if ($service->isEnabled()) {
                $service->boot();
            }
        }
    }
}
