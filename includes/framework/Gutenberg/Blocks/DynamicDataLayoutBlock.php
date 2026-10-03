<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Facades\Log;
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
     * Extract a child block of the given block name from the parsed block tree.
     *
     * @param array $parsedBlock Parsed block data.
     * @param string $blockName Block name to look for.
     * @return array|null
     */
    protected function extractChildBlockFromParsedBlock(array $parsedBlock, string $blockName): ?array
    {
        if (empty($parsedBlock)) {
            return null;
        }

        if (($parsedBlock['blockName'] ?? '') === $blockName) {
            return $parsedBlock;
        }

        if (!empty($parsedBlock['innerBlocks'])) {
            foreach ($parsedBlock['innerBlocks'] as $inner) {
                $found = $this->extractChildBlockFromParsedBlock($inner, $blockName);
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
            (is_string($parsed_block['attrs']['queryId']) && trim($parsed_block['attrs']['queryId']) === '')
        ) {
            // Generate a stable ID based on attributes to ensure consistency between render and AJAX
            $parsed_block['attrs']['queryId'] = 'ddl-' . substr(md5(serialize($parsed_block['attrs'])), 0, 10);
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
        $blockName = $block instanceof \WP_Block ? $block->name : 'Unknown';
        Log::debug("Render called for block: {$blockName}. ID: " . ($attributes['queryId'] ?? 'N/A'));

        // Enqueue frontend assets only when block is rendered
        $this->enqueueFrontendAssets();

        // Ensure queryId is set and valid (required for providesContext)
        // queryId must be a non-empty scalar value (string or number), not null, empty string, or array
        if (
            !isset($attributes['queryId']) ||
            (is_string($attributes['queryId']) && trim($attributes['queryId']) === '')
        ) {
            // Fallback to a stable ID based on attributes
            $attributes['queryId'] = 'ddl-' . substr(md5(serialize($attributes)), 0, 10);
        }

        $this->ensureServices();

        try {
            // Extract template block attributes (thumbnailPosition) and merge into parent attributes
            if ($block instanceof \WP_Block) {
                $innerCount = count($block->parsed_block['innerBlocks'] ?? []);
                Log::debug("Block has {$innerCount} innerBlocks.");

                $templateBlock = $this->extractTemplateBlockFromParsedBlock($block->parsed_block ?? []);
                Log::debug('Template extraction result: ' . ($templateBlock ? 'FOUND' : 'NOT FOUND'));

                if ($templateBlock) {
                    // Resolve pattern/reusable block references (core/block, core/template-part)
                    // BEFORE serializing, so AJAX render has real block data without DB lookups.
                    $templateBlock = $this->resolvePatternBlocks($templateBlock);

                    // Store the template inside attributes so it's included in data-block-settings
                    // This makes AJAX updates completely stateless and robust against cache misses
                    $attributes['postTemplate'] = $templateBlock;

                    // Cache it as well for secondary fallback
                    if (!empty($attributes['queryId'])) {
                        Log::debug('Caching template for ID: ' . (string) $attributes['queryId']);
                        $this->cacheTemplateByBlockId((string) $attributes['queryId'], $templateBlock);
                    }

                    if (!empty($templateBlock['attrs'])) {
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
                            'itemBgType',
                            'itemBgColor',
                            'itemBgImageUrl',
                            'itemBgImageSource',
                            'itemBgPosition',
                            'itemBgSize',
                            'itemBgRepeat',
                            'itemBgOverlay',
                            'itemBgRatio',
                            'itemBgContentAlign',
                        ];
                        foreach ($keysToMerge as $k) {
                            if (array_key_exists($k, $templateAttrs)) {
                                $attributes[$k] = $templateAttrs[$k];
                            }
                        }
                    }
                }
            }

            // Extract and separate heading block from inner blocks
            $innerBlocks = $this->separateInnerBlocks($block);
            $headingBlock = $innerBlocks['heading'];

            // Extract carousel-arrows child block (next/prev settings + icon styles)
            // and store it inside the parent attributes so it is:
            //  - available to the renderer (sanitizer re-injects it),
            //  - serialized into data-block-settings for stateless AJAX re-renders.
            $arrowsBlock = null;
            if ($block instanceof \WP_Block) {
                $arrowsBlock = $this->extractChildBlockFromParsedBlock($block->parsed_block ?? [], 'jankx/carousel-arrows');
            }
            if (is_array($arrowsBlock) && is_array($arrowsBlock['attrs'] ?? null)) {
                $attributes['carouselArrows'] = $arrowsBlock['attrs'];
            }

            // Extract the sort-rules child block and store its criteria inside the
            // parent attributes so the query builder can apply them server-side
            // (and stateless AJAX re-renders keep the configured order).
            $sortRulesBlock = null;
            $sortRulesHtml = '';
            if ($block instanceof \WP_Block) {
                $sortRulesBlock = $this->extractChildBlockFromParsedBlock(
                    $block->parsed_block ?? [],
                    'jankx/dynamic-data-sort-rules'
                );
            }
            if (is_array($sortRulesBlock) && is_array($sortRulesBlock['attrs'] ?? null)) {
                $attributes['sortRules'] = $sortRulesBlock['attrs'];
                $sortRulesHtml = render_block($sortRulesBlock);
            }

            $rendered = $this->rendererService->render($attributes, $content, $block);

            // Build a quick query to check if we have results (for heading visibility)
            $query = $this->buildQuickQuery($attributes);
            $headingHtml = $this->renderHeadingBlock($headingBlock, $query);

            // Expose data attributes so other blocks (e.g., advanced-filters) can find and update this block via AJAX
            $wrapperAttrs = $this->buildWrapperAttributes($this->resolveQueriedObjectTaxQuery($attributes));

            return sprintf('<div %s>%s%s%s</div>', $wrapperAttrs, $headingHtml, $sortRulesHtml, $rendered);
        } catch (\Exception $e) {
            return sprintf(
                '<div class="dynamic-data-layout-error">%s</div>',
                esc_html($e->getMessage())
            );
        }
    }

    /**
     * Recursively resolve pattern/reusable block and template part references.
     *
     * - core/block (ref: ID)      → fetched from DB, parsed, expanded inline.
     * - core/template-part        → kept as-is (resolved at render time via render_block).
     * - All other blocks           → innerBlocks resolved recursively.
     *
     * @param array $block Raw parsed block
     * @return array Block with references expanded
     */
    protected function resolvePatternBlocks(array $block): array
    {
        $blockName = $block['blockName'] ?? '';

        // Resolve reusable block / synced pattern reference
        if ($blockName === 'core/block') {
            $ref = (int) ($block['attrs']['ref'] ?? 0);
            if ($ref > 0) {
                $reusablePost = get_post($ref);
                if ($reusablePost && in_array($reusablePost->post_status, ['publish', 'private'], true)) {
                    $parsedBlocks = parse_blocks($reusablePost->post_content);
                    $resolved = [];
                    foreach ($parsedBlocks as $parsedBlock) {
                        if (!empty($parsedBlock['blockName'])) {
                            $resolved[] = $this->resolvePatternBlocks($parsedBlock);
                        }
                    }
                    if (count($resolved) === 1) {
                        return $resolved[0];
                    }
                    if (count($resolved) > 1) {
                        return [
                            'blockName'    => 'core/group',
                            'attrs'        => [],
                            'innerBlocks'  => $resolved,
                            'innerHTML'    => '',
                            'innerContent' => [''],
                        ];
                    }
                }
            }
            // Could not resolve: return as-is (fallback renderer will handle)
            return $block;
        }

        // core/template-part: cannot be fully serialized, keep as-is.
        // PostTemplateBlockGenerator will call render_block() at runtime.
        if ($blockName === 'core/template-part') {
            return $block;
        }

        // Recursively resolve innerBlocks for all other block types
        if (!empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
            $block['innerBlocks'] = array_map(
                function (array $inner): array {
                    return $this->resolvePatternBlocks($inner);
                },
                $block['innerBlocks']
            );
        }

        return $block;
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
    /**
     * Enqueue the block view script.
     *
     * It drives the Embla carousel (arrows, dots, drag, autoplay) and must run
     * in the editor too, otherwise the block preview never shows the carousel
     * chrome that visitors get on the frontend.
     *
     * @return void
     */
    protected function enqueueViewScript(): void
    {
        $block_dir = basename($this->blockPath);
        $dist_root = dirname($this->blockPath, 2) . '/dist';
        $view_js_path = $dist_root . '/blocks/' . $block_dir . '/view.js';
        $view_asset_path = $dist_root . '/blocks/' . $block_dir . '/view.asset.php';

        if (!file_exists($view_js_path)) {
            return;
        }

        $asset = file_exists($view_asset_path) ? require $view_asset_path : [
            'dependencies' => [],
            'version' => filemtime($view_js_path)
        ];

        $block_name = str_replace('jankx/', '', $this->blockId);
        $handle = 'jankx-' . str_replace('/', '-', $block_name) . '-view';

        wp_enqueue_script(
            $handle,
            trailingslashit(get_template_directory_uri()) . 'resources/dist/blocks/' . $block_dir . '/view.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );

        wp_localize_script($handle, 'jankxDynamicDataLayoutView', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jankx_load_more')
        ]);
    }

    public function enqueueFrontendAssets()
    {
        if (is_admin()) {
            return;
        }

        $this->enqueueViewScript();

        // Enqueue dynamic-data-template styles since it's rendered via this block
        $template_dist = dirname($this->blockPath, 2) . '/dist/blocks/dynamic-data-template';
        $template_style_path = $template_dist . '/style.css';
        $template_asset_path = $template_dist . '/style.asset.php';

        if (file_exists($template_style_path)) {
            $template_asset = file_exists($template_asset_path) ? require $template_asset_path : [
                'dependencies' => ['wp-block-library'],
                'version' => filemtime($template_style_path)
            ];

            $template_style_url = get_template_directory_uri() . '/resources/dist/blocks/dynamic-data-template/style.css';

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
        $asset_file = dirname($this->blockPath, 2) . '/dist/blocks/dynamic-data-layout/index.asset.php';

        $this->enqueueViewScript();

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
                'commonLayouts' => $commonLayouts,
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
        Log::debug('Incoming Filters: ' . json_encode($filters));
        Log::debug('Incoming Attributes: ' . json_encode($attributes));

        // Check if this is for our block type - must have queryId and postType
        if (empty($attributes['queryId']) || empty($attributes['postType'])) {
            Log::debug('Aborted: Missing queryId or postType');
            return [];
        }

        $this->ensureServices();

        $layoutName = $attributes['layout'] ?? 'grid';
        $postType = $attributes['postType'] ?? 'post';

        $sourceAttributes = $attributes;

        // Apply filters to attributes
        $attributes = DynamicDataLayoutQueryHelper::applyFiltersToAttributes($attributes, $filters);

        Log::debug('Attributes after filter merge: ' . json_encode($attributes));
        $layoutName = $attributes['layout'] ?? $layoutName;

        // Sanitize attributes
        $attributes = $this->attributeSanitizer->sanitize($attributes, $layoutName, true);

        $attributes = array_merge($sourceAttributes, $attributes);

        // Create layout decorator
        $layout = $this->layoutManager->createLayout($layoutName);
        $decorator = new BlockTemplateLayoutDecorator($layout);

        // Determine whether the advanced-filter actually switched the post type.
        // compare the (merged) attributes with the original static post type so
        // the allowlist enforced by applyFiltersToAttributes is respected.
        $selectedPostType = isset($filters['post_type']) && is_string($filters['post_type']) && $filters['post_type'] !== ''
            ? sanitize_key($filters['post_type'])
            : '';
        $filteredPostType = ($selectedPostType !== '' && ($attributes['postType'] ?? '') === $selectedPostType)
            ? $selectedPostType
            : '';

        // Build query
        $originalPreset = $attributes['queryPreset'] ?? 'custom';
        $query = $this->buildQueryForPreset($decorator, $attributes, $originalPreset, $postType, $filteredPostType);
        $decorator->withQuery($query);
        $decorator->withAttributes($attributes);

        // Resolve template block
        $templateBlock = null;
        if (!empty($attributes['postTemplate'])) {
            $templateBlock = $attributes['postTemplate'];
            Log::debug('postTemplate found in attributes.');
        } else {
            Log::debug('postTemplate is MISSING in attributes.');
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

        // Re-render the sort dropdown so the AJAX response keeps the sorter UI
        // (and its label) exactly like the initial render. The rules themselves
        // were already applied to the query above.
        $sortRulesHtml = $this->renderSortRulesFromAttributes($attributes);
        if ($sortRulesHtml !== '') {
            $html = $sortRulesHtml . $html;
        }

        if ($query->post_count === 0 && ($attributes['showEmptyMessage'] ?? true)) {
            $html = $sortRulesHtml . sprintf(
                '<div class="wp-block-jankx-dynamic-data-layout empty-state">%s</div>',
                esc_html($attributes['emptyMessage'] ?? __('No posts found.', 'jankx'))
            );
        }

        $html = $this->attachElementsStyles($html);

        // Wrap with data attributes so subsequent AJAX updates keep block metadata
        $wrapperAttrs = $this->buildWrapperAttributes($attributes);
        $html = sprintf('<div %s>%s</div>', $wrapperAttrs, $html);

        return [
            'html' => $html,
            'attributes' => $attributes,
        ];
    }

    /**
     * Render the dynamic-data-sort-rules dropdown from the sortRules attribute.
     *
     * The initial render() extracts the sort-rules child block from the parsed
     * block content and renders it inline. Stateless AJAX re-renders only have
     * the serialized attributes, so the dropdown has to be rebuilt from
     * attributes['sortRules'] to keep the sorter (and its label) on the page
     * after an advanced-filters update.
     *
     * @param array $attributes Block attributes (must contain sortRules).
     * @return string Rendered dropdown HTML, empty when no rules are configured.
     */
    protected function renderSortRulesFromAttributes(array $attributes): string
    {
        $sortRules = $attributes['sortRules'] ?? null;
        if (!is_array($sortRules) || empty($sortRules)) {
            return '';
        }

        $rendered = render_block([
            'blockName'    => 'jankx/dynamic-data-sort-rules',
            'attrs'        => $sortRules,
            'innerBlocks'  => [],
            'innerHTML'    => '',
            'innerContent' => [],
        ]);

        return is_string($rendered) ? $rendered : '';
    }

    protected function attachElementsStyles(string $html): string
    {
        if (strpos($html, 'wp-elements-') === false) {
            return $html;
        }

        if (!function_exists('wp_style_engine_get_stylesheet_from_context')) {
            return $html;
        }

        $css = wp_style_engine_get_stylesheet_from_context('block-supports');
        if (!is_string($css) || strpos($css, 'wp-elements-') === false) {
            return $html;
        }

        $suffix = substr(md5(uniqid('ddl', true)), 0, 8);
        $map = [];
        $replace = static function (array $matches) use (&$map, $suffix): string {
            if (!isset($map[$matches[1]])) {
                $map[$matches[1]] = 'wp-elements-' . $suffix . '-' . $matches[1];
            }

            return $map[$matches[1]];
        };

        $html = preg_replace_callback('/wp-elements-(\d+)/', $replace, $html);
        $css = preg_replace_callback('/wp-elements-(\d+)/', $replace, $css);

        return $html . '<style class="jankx-ddl-elements">' . $css . '</style>';
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
                    $sortRules = $this->extractChildBlockFromParsedBlock($block, 'jankx/dynamic-data-sort-rules');
                    if (is_array($sortRules) && is_array($sortRules['attrs'] ?? null)) {
                        $attrs['sortRules'] = $sortRules['attrs'];
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
     * @param string $filteredPostType Post type selected via an advanced-filter, empty otherwise
     * @return \WP_Query
     */
    private function buildQueryForPreset($decorator, array $attributes, string $originalPreset, string $postType, string $filteredPostType = ''): \WP_Query
    {
        if ($originalPreset === 'default') {
            return DynamicDataLayoutQueryHelper::buildDefaultQuery($attributes, 1, $filteredPostType);
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
     * @return \WP_Query|\WP_Term_Query
     */
    protected function buildQuickQuery(array $attributes)
    {
        $sanitizedAttributes = $this->attributeSanitizer->sanitize($attributes);
        $layoutName = $sanitizedAttributes['layout'] ?? 'grid';

        $layout = $this->layoutManager->createLayout($layoutName);
        $decorator = new BlockTemplateLayoutDecorator($layout);
        $decorator->withAttributes($sanitizedAttributes);

        $originalPreset = $sanitizedAttributes['queryPreset'] ?? 'custom';
        $postType = $sanitizedAttributes['postType'] ?? 'post';

        return $this->buildQueryForPreset($decorator, $sanitizedAttributes, $originalPreset, $postType);
    }

    protected function resolveQueriedObjectTaxQuery(array $attributes): array
    {
        if (empty($attributes['taxQuery']) || !is_array($attributes['taxQuery'])) {
            return $attributes;
        }

        $changed = false;
        $taxQuery = [];
        foreach ($attributes['taxQuery'] as $entry) {
            if (($entry['operator'] ?? '') !== 'CURRENT_QUERIED_OBJECT') {
                $taxQuery[] = $entry;
                continue;
            }

            $taxonomy = $entry['taxonomy'] ?? '';
            $queriedObject = get_queried_object();

            if ($queriedObject instanceof \WP_Term && (empty($taxonomy) || $queriedObject->taxonomy === $taxonomy)) {
                $taxQuery[] = [
                    'taxonomy' => $queriedObject->taxonomy,
                    'field' => 'term_id',
                    'terms' => [(int) $queriedObject->term_id],
                    'operator' => 'IN',
                ];
                $changed = true;
                continue;
            }

            if (is_singular() && $taxonomy) {
                $terms = get_the_terms(get_the_ID(), $taxonomy);
                if (is_array($terms) && !empty($terms)) {
                    $taxQuery[] = [
                        'taxonomy' => $taxonomy,
                        'field' => 'term_id',
                        'terms' => array_map('intval', wp_list_pluck($terms, 'term_id')),
                        'operator' => 'IN',
                    ];
                    $changed = true;
                    continue;
                }
            }

            $taxQuery[] = $entry;
        }

        if (!$changed) {
            return $attributes;
        }

        $attributes['taxQuery'] = $taxQuery;

        return $attributes;
    }


    /**
     * Build wrapper attributes with data-* for AJAX/filter integrations
     *
     * @param array $attributes
     * @return string
     */
    /**
     * Normalise an image ratio attribute into a bare "w/h" string.
     *
     * Mirrors normalizeImageRatio() in resources/shared/components/imageRatio.ts.
     * Block attributes are authored in the editor but round-trip through saved
     * post content, so this is also the guard that keeps anything which is not a
     * plain ratio out of the CSS custom property.
     *
     * @param mixed $value
     * @return string Empty string when the value cannot be used.
     */
    protected static function normalizeImageRatio($value): string
    {
        if (!is_string($value)) {
            return '';
        }

        $raw = trim($value);
        if ($raw === '' || !preg_match('/^(\d{1,4})\s*\/\s*(\d{1,4})$/', $raw, $matches)) {
            return '';
        }

        $width = (int) $matches[1];
        $height = (int) $matches[2];
        if ($width <= 0 || $height <= 0) {
            return '';
        }

        return $width . '/' . $height;
    }

    /**
     * Append the responsive min-height CSS variables consumed by style.scss.
     *
     * These blocks are rendered by PHP rather than replayed from the saved
     * markup, so anything the editor wrote to the block wrapper has to be
     * re-emitted here or it never reaches the front end.
     *
     * @param array $styleRules Accumulator, passed by reference.
     * @param mixed $minHeight  Either a {desktop,tablet,mobile} map or a string.
     * @return void
     */
    protected static function appendMinHeightStyleRules(array &$styleRules, $minHeight): void
    {
        if (is_array($minHeight)) {
            foreach (['desktop', 'tablet', 'mobile'] as $device) {
                $value = $minHeight[$device] ?? null;
                if (is_string($value) && trim($value) !== '') {
                    $styleRules[] = '--min-height-' . $device . ': ' . esc_attr(trim($value));
                }
            }

            return;
        }

        if (is_string($minHeight) && trim($minHeight) !== '') {
            // Legacy single value: drive every breakpoint from the one value.
            $value = esc_attr(trim($minHeight));
            $styleRules[] = '--min-height-desktop: ' . $value;
            $styleRules[] = '--min-height-tablet: ' . $value;
            $styleRules[] = '--min-height-mobile: ' . $value;
        }
    }

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
        $attrs['class'] = implode(' ', array_filter([
            $baseClass,
            !empty($attributes['align']) ? 'align' . $attributes['align'] : '',
            !empty($attributes['className']) ? $attributes['className'] : '',
        ]));

        // Add carousel-specific attributes
        if (($attributes['layout'] ?? '') === 'carousel') {
            // Add carousel class
            $attrs['class'] .= ' jankx-carousel dynamic-data-layout--carousel';

            // Add arrows position class from the carousel-arrows child block
            $arrows = isset($attributes['carouselArrows']) && is_array($attributes['carouselArrows'])
                ? $attributes['carouselArrows']
                : [];
            $arrowsPositionClass = \Jankx\Layouts\DynamicDataLayout\CarouselArrowsRenderer::positionClass($arrows);
            if ($arrowsPositionClass !== '') {
                $attrs['class'] .= ' ' . $arrowsPositionClass;
            }

            // Add carousel data attributes
            $attrs['data-layout'] = 'carousel';
            // Output explicit responsive attributes instead of overriding inline
            $attrs['data-columns'] = esc_attr($attributes['columns'] ?? 3);
            if (isset($attributes['columnsTablet'])) {
                $attrs['data-columns-tablet'] = esc_attr($attributes['columnsTablet']);
            }
            if (isset($attributes['columnsMobile'])) {
                $attrs['data-columns-mobile'] = esc_attr($attributes['columnsMobile']);
            }
            $attrs['data-space-between'] = esc_attr($attributes['spaceBetween'] ?? 16);
            $attrs['data-autoplay'] = !empty($attributes['autoplay']) ? 'true' : 'false';
            $attrs['data-autoplay-delay'] = esc_attr($attributes['autoplayDelay'] ?? 3000);
            $attrs['data-loop'] = !empty($attributes['loop']) ? 'true' : 'false';
            $attrs['data-peek-amount'] = esc_attr($attributes['carouselPeek'] ?? 0);

            // Add carousel container class
            $attrs['class'] .= ' has-carousel';

            // Visibility classes consumed by style.scss (`&:not(.has-arrows)` / `&:not(.has-dots)`)
            $showArrowsClass = isset($arrows['showArrows']) ? (bool) $arrows['showArrows'] : (bool) ($attributes['showArrows'] ?? true);
            if ($showArrowsClass) {
                $attrs['class'] .= ' has-arrows';
            }
            if ((bool) ($attributes['showDots'] ?? true)) {
                $attrs['class'] .= ' has-dots';
            }
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
        // Do not force --slides-per-view here, let CSS handle it responsively via --columns-*
        $styleRules[] = '--columns-desktop: ' . $columns;
        $styleRules[] = '--peek-amount: ' . ($attributes['carouselPeek'] ?? 0) . '%';

        // Featured image aspect ratio for every item. This is only a default: a
        // template block that sets its own responsive itemBgRatio emits an inline
        // <style> inside the content, which is printed after this wrapper and
        // therefore keeps precedence.
        $imageRatio = self::normalizeImageRatio($attributes['imageRatio'] ?? '');
        if ($imageRatio !== '') {
            $styleRules[] = '--jankx-layout-image-ratio: ' . $imageRatio;
        }

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

        // Inject blockGap as CSS variable so the grid gap respects the block spacing setting
        $blockGap = $attributes['style']['spacing']['blockGap'] ?? null;
        if (!empty($blockGap)) {
            if (is_array($blockGap)) {
                // Responsive object { top, right, bottom, left } - use top or left as unified gap
                $blockGap = $blockGap['top'] ?? $blockGap['left'] ?? null;
            }
            if (!empty($blockGap)) {
                // Convert WP preset reference "var:preset|spacing|50" → "var(--wp--preset--spacing--50)"
                if (strpos($blockGap, 'var:') === 0) {
                    $blockGap = 'var(--wp--' . str_replace(['var:', '|'], ['', '--'], $blockGap) . ')';
                }
                $styleRules[] = '--jankx-block-gap: ' . esc_attr($blockGap);
            }
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

        self::appendMinHeightStyleRules($styleRules, $attributes['minHeight'] ?? null);

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
                Log::debug('Template FOUND in cache for ID: ' . (string) $attributes['queryId']);
                $attributes['postTemplate'] = $cachedTemplate;
            } else {
                Log::debug('Template NOT FOUND in cache for ID: ' . (string) $attributes['queryId']);
                // FALLBACK: If not found in cache, try to parse the page content to find this block and its template
                if ($post_id > 0) {
                    Log::debug('Fallback: Searching post content for template. ID: ' . (string) $attributes['queryId']);
                    $realAttrs = $this->getBlockAttributes($post_id, (string) $attributes['queryId']);
                    if (!empty($realAttrs['postTemplate'])) {
                        // Resolve pattern references before caching so subsequent AJAX
                        // requests also benefit from fully-expanded block data.
                        $realAttrs['postTemplate'] = $this->resolvePatternBlocks($realAttrs['postTemplate']);
                        $attributes['postTemplate'] = $realAttrs['postTemplate'];
                        Log::debug('Fallback SUCCESS: Template found in post content (patterns resolved).');
                        // Cache it now for next time
                        $this->cacheTemplateByBlockId((string) $attributes['queryId'], $attributes['postTemplate']);
                    }
                }
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

    /**
     * Per-request memo of the block template transient.
     *
     * A single page can render the same block many times. Reading the transient
     * each time costs a wp_options SELECT, and re-writing it costs two UPDATEs
     * plus the option-cache invalidation that comes with update_option(), which
     * then makes every unrelated get_option() miss again. Both are resolved once
     * per request instead.
     *
     * @var array<string, array|null>
     */
    protected static array $templateTransientRead = [];

    /** @var array<string, bool> transient keys already written during this request */
    protected static array $templateTransientWritten = [];

    protected function cacheTemplateByBlockId(string $blockId, array $template): void
    {
        $key = 'jankx_ddl_template_' . $blockId;
        if (!empty(self::$templateTransientWritten[$key])) {
            return;
        }
        self::$templateTransientWritten[$key] = true;
        self::$templateTransientRead[$key] = $template;
        set_transient($key, $template, DAY_IN_SECONDS);
    }

    protected function getCachedTemplateByBlockId(string $blockId): ?array
    {
        $key = 'jankx_ddl_template_' . $blockId;
        if (array_key_exists($key, self::$templateTransientRead)) {
            return self::$templateTransientRead[$key];
        }
        $cached = get_transient($key);
        $value = is_array($cached) ? $cached : null;
        self::$templateTransientRead[$key] = $value;
        return $value;
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
