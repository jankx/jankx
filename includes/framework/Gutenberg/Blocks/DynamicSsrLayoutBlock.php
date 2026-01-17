<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewLayoutManager;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewRenderer;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewAttributeSanitizer;
use Jankx\Query\DynamicDataLayoutQueryHelper;
use Jankx\Foundation\Application;
use Jankx\Services\DefaultThumbnailService;

class DynamicSsrLayoutBlock extends Block
{
    protected $blockId = 'jankx/dynamic-ssr-layout';

    protected ?ViewLayoutManager $layoutManager = null;
    protected ?ViewAttributeSanitizer $attributeSanitizer = null;
    protected ?ViewRenderer $rendererService = null;

    public function init()
    {
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets'], 20);
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);
        add_filter('render_block_data', [$this, 'normalizeBlockAttributes'], 10, 1);
        add_filter('jankx_dynamic_ssr_layout_filter_update', [$this, 'handleFilterUpdate'], 10, 2);
        add_filter('jankx_dynamic_ssr_layout_get_block_attributes', [$this, 'handleGetBlockAttributes'], 10, 3);
        add_action('wp_ajax_jankx_dynamic_ssr_layout_filter', [$this, 'ajaxFilterUpdate']);
        add_action('wp_ajax_nopriv_jankx_dynamic_ssr_layout_filter', [$this, 'ajaxFilterUpdate']);
        add_action('wp_ajax_jankx_dynamic_ssr_template_preview', [$this, 'ajaxTemplatePreview']);
        add_action('wp_ajax_nopriv_jankx_dynamic_ssr_template_preview', [$this, 'ajaxTemplatePreview']);
        add_action('wp_ajax_jankx_posts_count', [$this, 'ajaxPostsCount']);
        add_action('wp_ajax_nopriv_jankx_posts_count', [$this, 'ajaxPostsCount']);
        $this->ensureServices();
    }

    public function enqueueFrontendAssets()
    {
        // Only enqueue on frontend
        if (is_admin()) {
            return;
        }

        $block_name = str_replace('jankx/', '', $this->blockId);
        $view_js_url = $this->blockPath . '/build/view.js';

        if (file_exists($view_js_url)) {
            $asset_file = $this->blockPath . '/build/view.asset.php';
            $asset = file_exists($asset_file) ? require $asset_file : [
                'dependencies' => [],
                'version' => filemtime($view_js_url)
            ];

            $handle = 'jankx-' . str_replace('/', '-', $block_name) . '-view';
            wp_enqueue_script(
                $handle,
                content_url(str_replace(WP_CONTENT_DIR, '', $view_js_url)),
                $asset['dependencies'],
                $asset['version'],
                true
            );

            // Localize script with necessary data
            wp_localize_script($handle, 'jankxDynamicSsrLayoutView', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('jankx_load_more')
            ]);
        }
    }

    protected function ensureServices(): void
    {
        if ($this->attributeSanitizer && $this->rendererService) {
            return;
        }

        $layoutManager = $this->getLayoutManager();

        if (!$this->attributeSanitizer) {
            $this->attributeSanitizer = new ViewAttributeSanitizer($layoutManager);
        }

        if (!$this->rendererService) {
            $this->rendererService = new ViewRenderer(
                $layoutManager,
                $this->attributeSanitizer,
                function (array $attributes) {
                    if (isset($attributes['postTemplate']) && is_array($attributes['postTemplate'])) {
                        return $attributes['postTemplate'];
                    }
                    return null;
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
        $disallowed = [
            'core/template',
            'core/template-part',
        ];

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
                    $name = $inner['blockName'] ?? '';
                    if (!in_array($name, $disallowed, true)) {
                        $sanitized['innerBlocks'][] = $this->sanitizeTemplateBlock($inner);
                    }
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

            // Only enqueue when carousel blocks are present on page
            if (has_block($this->blockId)) {
                // Enqueue carousel styles
                $style_asset_file = $this->blockPath . '/build/style.asset.php';
                $style_file = $this->blockPath . '/build/style.css';
                if (file_exists($style_asset_file) && file_exists($style_file)) {
                    $style_asset = require $style_asset_file;
                    $style_handle = 'jankx-dynamic-ssr-layout-style';
                    if (!wp_style_is($style_handle, 'registered')) {
                        $style_url = (new \Jankx\Managers\UrlManager())->blockAsset('dynamic-ssr-layout/build/style.css');
                        wp_register_style(
                            $style_handle,
                            $style_url,
                            isset($style_asset['dependencies']) ? $style_asset['dependencies'] : [],
                            isset($style_asset['version']) ? $style_asset['version'] : false
                        );
                    }
                    wp_enqueue_style($style_handle);
                }

                wp_enqueue_script($handle);

                // Add inline script for lazy loading carousel initialization
                wp_add_inline_script($handle, "
                    // Lazy load carousel only when visible
                    function initCarouselWhenVisible() {
                        const carousels = document.querySelectorAll('.wp-block-jankx-dynamic-ssr-layout.view-type-layout-carousel');
                        if (carousels.length === 0) return;
                        
                        const observer = new IntersectionObserver((entries) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    // Initialize carousel when visible
                                    if (typeof window.initCarousel === 'function') {
                                        window.initCarousel(entry.target);
                                    }
                                    observer.unobserve(entry.target);
                                }
                            });
                        }, { threshold: 0.1, rootMargin: '200px' });
                        
                        carousels.forEach(carousel => observer.observe(carousel));
                    }
                    
                    // Initialize when DOM is ready
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', initCarouselWhenVisible);
                    } else {
                        initCarouselWhenVisible();
                    }
                ");
            }
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
        if (
            !isset($parsed_block['attrs']['queryId']) ||
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

    protected function getLayoutManager(): ViewLayoutManager
    {
        if (!$this->layoutManager) {
            try {
                $app = Application::getInstance();
                $this->layoutManager = $app->make(ViewLayoutManager::class);
            } catch (\Throwable $e) {
                throw $e;
            }
        }
        return $this->layoutManager;
    }

    public function render($attributes, $content = '', $block = null)
    {
        if (
            !isset($attributes['queryId']) ||
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


        // Remove debug output



        try {
            if ($block instanceof \WP_Block) {
                $templateBlock = $this->extractTemplateBlockFromParsedBlock($block->parsed_block ?? []);
                if ($templateBlock && !empty($templateBlock['attrs'])) {
                    $templateAttrs = $templateBlock['attrs'];
                    // Merge template attributes into parent, overriding defaults
                    $keysToMerge = [
                        'imageRatio',
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
        $styleRules = [];
        $baseClass = 'wp-block-jankx-dynamic-ssr-layout';

        // Build class array with layout-specific classes
        $classes = [$baseClass];

        // Add layout classes to match dynamic-ssr-layout CSS
        $layout = $attributes['layout'] ?? '';
        if ($layout) {
            $classes[] = 'dynamic-ssr-layout';
            $classes[] = 'dynamic-ssr-layout--' . $layout;
            $classes[] = 'view-type-layout-' . $layout;
        }

        // Add column classes and variables
        if (isset($attributes['columns'])) {
            $classes[] = 'columns-' . (int) $attributes['columns'];
            $attrs['data-columns'] = (int) $attributes['columns'];
            $styleRules[] = '--columns-desktop: ' . (int) $attributes['columns'];
        }
        if (isset($attributes['columnsTablet'])) {
            $classes[] = 'columns-tablet-' . (int) $attributes['columnsTablet'];
            $attrs['data-columns-tablet'] = (int) $attributes['columnsTablet'];
            $styleRules[] = '--columns-tablet: ' . (int) $attributes['columnsTablet'];
        }
        if (isset($attributes['columnsMobile'])) {
            $classes[] = 'columns-mobile-' . (int) $attributes['columnsMobile'];
            $attrs['data-columns-mobile'] = (int) $attributes['columnsMobile'];
            $styleRules[] = '--columns-mobile: ' . (int) $attributes['columnsMobile'];
        }

        // Add carousel-specific attributes
        if ($layout === 'carousel') {
            // Add carousel class
            $classes[] = 'dynamic-ssr-layout--carousel';
            $classes[] = 'has-carousel';

            // Add carousel data attributes
            $attrs['data-layout'] = 'carousel';
            $attrs['data-slides-per-view'] = esc_attr($attributes['columns'] ?? 3);
            $attrs['data-space-between'] = esc_attr($attributes['spaceBetween'] ?? 16);
            $attrs['data-autoplay'] = !empty($attributes['autoplay']) ? 'true' : 'false';
            $attrs['data-autoplay-delay'] = esc_attr($attributes['autoplayDelay'] ?? 3000);
            $attrs['data-loop'] = !empty($attributes['loop']) ? 'true' : 'false';

            // Add inline styles for carousel
            $styleRules[] = sprintf(
                '--slides-per-view: %d; --space-between: %dpx',
                (int) ($attributes['columns'] ?? 3),
                (int) ($attributes['spaceBetween'] ?? 16)
            );
        }

        $attrs['class'] = implode(' ', $classes);

        $queryId = isset($attributes['queryId']) ? (string) $attributes['queryId'] : '';
        if ($queryId !== '') {
            $attrs['data-block-id'] = esc_attr($queryId);
            $attrs['data-query-id'] = esc_attr($queryId);
        }
        $attrs['data-post-type'] = esc_attr($attributes['postType'] ?? '');
        $attrs['data-layout'] = esc_attr($layout);
        if (isset($attributes['postsPerPage'])) {
            $attrs['data-posts-per-page'] = (int) $attributes['postsPerPage'];
        }

        // Inject styles
        if (!empty($styleRules)) {
            $attrs['style'] = implode('; ', $styleRules);
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

        $layoutManager = $this->getLayoutManager();

        $post_types = get_post_types(['public' => true], 'objects');
        $layouts_by_post_type = [];
        foreach ($post_types as $post_type => $post_type_obj) {
            $rawLayouts = $layoutManager->getLayoutsForPostType($post_type);
            $normalizedLayouts = [];
            if (is_array($rawLayouts)) {
                foreach ($rawLayouts as $key => $value) {
                    if (is_array($value) && isset($value['name'])) {
                        $normalizedLayouts[] = [
                            'name' => $value['name'],
                            'title' => isset($value['title']) ? $value['title'] : ucfirst(str_replace('-', ' ', $value['name'])),
                            'postType' => $post_type,
                        ];
                    } else {
                        $layoutName = is_string($key) ? $key : (is_string($value) ? $value : '');
                        if ($layoutName === '') {
                            continue;
                        }
                        try {
                            $layoutInstance = $layoutManager->createLayout($layoutName);
                            $normalizedLayouts[] = [
                                'name' => $layoutInstance->getName(),
                                'title' => $layoutInstance->getTitle(),
                                'postType' => $post_type,
                            ];
                        } catch (\Throwable $e) {
                            $normalizedLayouts[] = [
                                'name' => $layoutName,
                                'title' => ucfirst(str_replace('-', ' ', $layoutName)),
                                'postType' => $post_type,
                            ];
                        }
                    }
                }
            }
            $layouts_by_post_type[$post_type] = $normalizedLayouts;
        }

        $commonLayoutsRaw = $layoutManager->getCommonLayouts();
        $commonLayouts = [];
        if (is_array($commonLayoutsRaw)) {
            foreach ($commonLayoutsRaw as $key => $value) {
                if (is_array($value) && isset($value['name'])) {
                    $commonLayouts[] = [
                        'name' => $value['name'],
                        'title' => isset($value['title']) ? $value['title'] : ucfirst(str_replace('-', ' ', $value['name'])),
                        'postType' => 'common',
                    ];
                } else {
                    $layoutName = is_string($key) ? $key : (is_string($value) ? $value : '');
                    if ($layoutName === '') {
                        continue;
                    }
                    try {
                        $layoutInstance = $layoutManager->createLayout($layoutName);
                        $commonLayouts[] = [
                            'name' => $layoutInstance->getName(),
                            'title' => $layoutInstance->getTitle(),
                            'postType' => 'common',
                        ];
                    } catch (\Throwable $e) {
                        $commonLayouts[] = [
                            'name' => $layoutName,
                            'title' => ucfirst(str_replace('-', ' ', $layoutName)),
                            'postType' => 'common',
                        ];
                    }
                }
            }
        }

        $layouts_payload = [
            'layoutsByPostType' => $layouts_by_post_type,
            'commonLayouts' => $commonLayouts,
        ];

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
        $query_options = \Jankx\Gutenberg\QueryOptions::getOptions();

        // Get available templates from views directory
        $availableTemplates = $this->getAvailableTemplates();
        $ssr_template_config = [
            'nonce' => wp_create_nonce('jankx_dynamic_ssr_template_preview'),
            'postsCountNonce' => wp_create_nonce('jankx_posts_count'),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'availableTemplates' => $availableTemplates,
        ];

        if (wp_script_is($script_handle, 'registered') || wp_script_is($script_handle, 'enqueued')) {
            wp_localize_script(
                $script_handle,
                'jankxDynamicSsrLayouts',
                $layouts_payload
            );
            wp_localize_script($script_handle, 'jankxPublicPostTypes', $public_post_types);
            wp_localize_script($script_handle, 'jankxQueryOptions', $query_options);
            wp_localize_script($script_handle, 'jankxDynamicSsrTemplate', $ssr_template_config);
        } else {
            // Fallback: inject data before wp-block-editor if block script handle cannot be detected yet
            $json_layouts = wp_json_encode($layouts_payload);
            $json_post_types = wp_json_encode($public_post_types);
            $json_query_options = wp_json_encode($query_options);
            $json_ssr_config = wp_json_encode($ssr_template_config);
            wp_add_inline_script('wp-block-editor', "window.jankxDynamicSsrLayouts = {$json_layouts};", 'before');
            wp_add_inline_script('wp-block-editor', "window.jankxPublicPostTypes = {$json_post_types};", 'before');
            wp_add_inline_script('wp-block-editor', "window.jankxQueryOptions = {$json_query_options};", 'before');
            wp_add_inline_script('wp-block-editor', "window.jankxDynamicSsrTemplate = {$json_ssr_config};", 'before');
        }
    }

    public function handleFilterUpdate(array $attributes, array $filters): array
    {
        if (empty($attributes['queryId']) || empty($attributes['postType'])) {
            return [];
        }
        $this->ensureServices();
        $layoutName = $attributes['layout'] ?? 'grid';
        $attributes = \Jankx\Query\DynamicDataLayoutQueryHelper::applyFiltersToAttributes($attributes, $filters);
        $attributes = $this->attributeSanitizer->sanitize($attributes);
        $rendered = $this->rendererService->render($attributes, '', null);
        $wrapperAttrs = $this->buildWrapperAttributes($attributes);
        $html = sprintf('<div %s>%s</div>', $wrapperAttrs, $rendered);
        return [
            'html' => $html,
            'attributes' => $attributes,
        ];
    }

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

    private function findBlockAttributesById(array $blocks, string $target_block_id): ?array
    {
        foreach ($blocks as $block) {
            if (($block['blockName'] ?? '') === 'jankx/dynamic-ssr-layout') {
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

    public function ajaxFilterUpdate(): void
    {
        check_ajax_referer('jankx_load_more', 'nonce');
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
        if (empty($attributes) && $post_id > 0) {
            $attrs = apply_filters('jankx_dynamic_ssr_layout_get_block_attributes', null, $post_id, $block_id);
            if (is_array($attrs)) {
                $attributes = $attrs;
            }
        }
        if (empty($attributes)) {
            wp_send_json_error(['message' => __('Attributes not found', 'jankx')]);
        }
        $response = $this->handleFilterUpdate($attributes, $filters);
        wp_send_json_success($response);
    }

    protected function bootDefaultThumbnailService(): void
    {
        if (has_filter('has_post_thumbnail', '__return_true')) {
            return;
        }
        try {
            $app = Application::getInstance();
            $service = $app->make(DefaultThumbnailService::class);
            if ($service && $service->isEnabled()) {
                $service->boot();
            }
        } catch (\Exception $e) {
            $service = new DefaultThumbnailService();
            if ($service->isEnabled()) {
                $service->boot();
            }
        }
    }

    /**
     * Get available templates from views directory
     *
     * @return array
     */
    protected function getAvailableTemplates(): array
    {
        $templates = [];
        $viewsDir = get_stylesheet_directory() . '/views';
        $parentViewsDir = get_template_directory() . '/views';

        // Scan both parent and child theme views directories
        $directories = [$viewsDir, $parentViewsDir];

        foreach ($directories as $dir) {
            if (!is_dir($dir)) {
                continue;
            }

            // Scan post-layouts subdirectory
            $postLayoutsDir = $dir . '/post-layouts';
            if (is_dir($postLayoutsDir)) {
                $this->scanTemplateDirectory($postLayoutsDir, 'post-layouts/', $templates);
            }

            // Scan other template files in views root
            $this->scanTemplateDirectory($dir, '', $templates);
        }

        return array_unique($templates, SORT_REGULAR);
    }

    /**
     * Scan a directory for template files
     *
     * @param string $directory
     * @param string $prefix
     * @param array $templates
     * @return void
     */
    protected function scanTemplateDirectory(string $directory, string $prefix, array &$templates): void
    {
        $files = scandir($directory);
        if (!$files) {
            return;
        }

        foreach ($files as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }

            $filePath = $directory . '/' . $file;
            if (is_dir($filePath)) {
                // Recursively scan subdirectories
                $this->scanTemplateDirectory($filePath, $prefix . $file . '/', $templates);
            } elseif (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
                // Add PHP template files
                $templateSlug = $prefix . pathinfo($file, PATHINFO_FILENAME);
                $templates[] = [
                    'slug' => $templateSlug,
                    'title' => $this->getTemplateTitle($templateSlug),
                    'description' => sprintf(__('Template file: %s', 'jankx'), $file),
                ];
            }
        }
    }

    /**
     * Get template title from slug
     *
     * @param string $slug
     * @return string
     */
    protected function getTemplateTitle(string $slug): string
    {
        // Convert slug to readable title
        $title = str_replace(['-', '_'], ' ', $slug);
        $title = ucwords($title);

        // Handle special cases
        $specialCases = [
            'layouts/loop/item-default' => __('Default Loop Item', 'jankx'),
            'post-layouts/large-item' => __('Large Item', 'jankx'),
            'post-layouts/thumbnail' => __('Thumbnail Only', 'jankx'),
            'post-layouts/term-item' => __('Term Item', 'jankx'),
        ];

        return $specialCases[$slug] ?? $title;
    }

    /**
     * AJAX handler for template preview
     *
     * @return void
     */
    public function ajaxPostsCount(): void
    {
        check_ajax_referer('jankx_posts_count', 'nonce');

        $postType = isset($_POST['postType']) ? sanitize_text_field(wp_unslash($_POST['postType'])) : 'post';
        $filterType = isset($_POST['filterType']) ? sanitize_text_field(wp_unslash($_POST['filterType'])) : '';
        $filterSettings = isset($_POST['filterSettings']) ? json_decode(wp_unslash($_POST['filterSettings']), true) : [];

        if (!is_array($filterSettings)) {
            $filterSettings = [];
        }

        try {
            // Build WP_Query args based on filter settings
            $args = [
                'post_type' => $postType,
                'post_status' => 'publish',
                'posts_per_page' => -1, // Get all posts for counting
                'fields' => 'ids', // Only get post IDs for better performance
            ];

            // Add filter conditions based on filter type
            switch ($filterType) {
                case 'taxonomy':
                    if (!empty($filterSettings['taxonomy']) && !empty($filterSettings['terms'])) {
                        $args['tax_query'] = [
                            [
                                'taxonomy' => $filterSettings['taxonomy'],
                                'terms' => array_map('intval', $filterSettings['terms']),
                                'field' => 'term_id',
                                'operator' => 'IN',
                            ],
                        ];
                    }
                    break;

                case 'author':
                    if (!empty($filterSettings['authors'])) {
                        $args['author__in'] = array_map('intval', $filterSettings['authors']);
                    }
                    break;

                case 'keyword':
                    if (!empty($filterSettings['keyword'])) {
                        $args['s'] = sanitize_text_field($filterSettings['keyword']);
                    }
                    break;

                case 'price':
                    $minPrice = !empty($filterSettings['minPrice']) ? floatval($filterSettings['minPrice']) : 0;
                    $maxPrice = !empty($filterSettings['maxPrice']) ? floatval($filterSettings['maxPrice']) : 999999;

                    $args['meta_query'] = [
                        [
                            'key' => '_price',
                            'value' => [$minPrice, $maxPrice],
                            'type' => 'NUMERIC',
                            'compare' => 'BETWEEN',
                        ],
                    ];
                    break;

                case 'date':
                    $dateQuery = [];
                    if (!empty($filterSettings['dateFrom'])) {
                        $dateQuery['after'] = sanitize_text_field($filterSettings['dateFrom']);
                    }
                    if (!empty($filterSettings['dateTo'])) {
                        $dateQuery['before'] = sanitize_text_field($filterSettings['dateTo']);
                    }
                    if (!empty($dateQuery)) {
                        $dateQuery['inclusive'] = true;
                        $args['date_query'] = [$dateQuery];
                    }
                    break;
            }

            // Execute WP_Query
            $query = new \WP_Query($args);
            $postsCount = $query->found_posts;

            wp_send_json_success([
                'count' => $postsCount,
                'post_type' => $postType,
                'filter_type' => $filterType,
            ]);

        } catch (\Throwable $e) {
            $message = $e->getMessage();
            if (defined('WP_DEBUG') && WP_DEBUG) {
                $message .= ' at ' . $e->getFile() . ':' . $e->getLine();
            }
            wp_send_json_error(['message' => $message]);
        }
    }

    /**
     * AJAX handler for template preview
     *
     * @return void
     */
    public function ajaxTemplatePreview(): void
    {
        check_ajax_referer('jankx_dynamic_ssr_template_preview', 'nonce');

        $attributes = isset($_POST['attributes']) ? json_decode(wp_unslash($_POST['attributes']), true) : [];
        $parent_attributes = isset($_POST['parent_attributes']) ? json_decode(wp_unslash($_POST['parent_attributes']), true) : [];

        if (!is_array($attributes) || !is_array($parent_attributes)) {
            wp_send_json_error(['message' => __('Invalid attributes', 'jankx')]);
        }

        try {
            $this->bootDefaultThumbnailService();
            $this->ensureServices();

            $mergedAttributes = array_merge($parent_attributes, $attributes);

            // Provide a template block to the renderer via attributes so it can generate
            // the same markup as frontend (including carousel structure).
            $mergedAttributes['postTemplate'] = [
                'blockName' => 'jankx/dynamic-ssr-template',
                'attrs' => is_array($attributes) ? $attributes : [],
                'innerBlocks' => [],
                'innerHTML' => '',
                'innerContent' => [],
            ];

            $sanitized = $this->attributeSanitizer->sanitize($mergedAttributes);
            $rendered = $this->rendererService->render($sanitized, '', null);
            $wrapperAttrs = $this->buildWrapperAttributes($sanitized);
            $html = sprintf('<div %s>%s</div>', $wrapperAttrs, $rendered);

            wp_send_json_success(['html' => $html]);
        } catch (\Throwable $e) {
            $message = $e->getMessage();
            if (defined('WP_DEBUG') && WP_DEBUG) {
                $message .= ' at ' . $e->getFile() . ':' . $e->getLine();
            }
            wp_send_json_error(['message' => $message]);
        }
    }
}
