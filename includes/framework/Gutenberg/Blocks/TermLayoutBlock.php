<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Gutenberg\Helpers\HeadingBlockHandler;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\TaxonomyRenderer;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewLayoutManager;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewAttributeSanitizer;
use Jankx\Layouts\DynamicDataLayout\DynamicDataLayoutManager;
use Jankx\Layouts\DynamicDataLayout\AttributeSanitizer;

class TermLayoutBlock extends Block
{
    use HeadingBlockHandler;

    protected $blockId = 'jankx/term-layout';
    protected $rendererService;

    public function init()
    {
        $this->ensureServices();
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets'], 20);
        add_action('wp_ajax_jankx_term_layout_preview', [$this, 'ajaxPreview']);
        add_action('wp_ajax_nopriv_jankx_term_layout_preview', [$this, 'ajaxPreview']);
    }

    protected function ensureServices()
    {
        if ($this->rendererService === null) {
            $layoutManager = \Jankx\Foundation\Application::getInstance()->make(ViewLayoutManager::class);
            $attributeSanitizer = new ViewAttributeSanitizer($layoutManager);

            $this->rendererService = new TaxonomyRenderer(
                $layoutManager,
                $attributeSanitizer,
                [$this, 'extractTemplateBlock'],
                [$this, 'sanitizeTemplateBlock']
            );
        }
    }

    public function render($attributes, $content = '', $block = null)
    {
        $this->ensureServices();

        try {
            // Extract and separate heading block from inner blocks
            $innerBlocks = $this->separateInnerBlocks($block);
            $headingBlock = $innerBlocks['heading'];

            $rendered = $this->rendererService->render($attributes, $content, $block);

            // Build a quick query to check if we have results (for heading visibility)
            $query = $this->buildQuickQuery($attributes);
            $headingHtml = $this->renderHeadingBlock($headingBlock, $query);

            $wrapperAttrs = $this->buildWrapperAttributes($attributes);
            return sprintf('<div %s>%s%s</div>', $wrapperAttrs, $headingHtml, $rendered);
        } catch (\Exception $e) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                return sprintf('<div class="term-layout-error">%s</div>', esc_html($e->getMessage()));
            }
            return '';
        }
    }

    public function extractTemplateBlock(array $attributes): ?array
    {
        // For term-layout, we look for jankx/term-layout-template block
        if (!empty($attributes['templateBlock'])) {
            return $attributes['templateBlock'];
        }
        return null;
    }

    public function sanitizeTemplateBlock(array $templateBlock): array
    {
        return $templateBlock;
    }

    /**
     * Build a quick query to check if we have results (for heading visibility)
     *
     * @param array $attributes Block attributes
     * @return \WP_Term_Query
     */
    protected function buildQuickQuery(array $attributes): \WP_Term_Query
    {
        $taxonomy = $attributes['taxonomy'] ?? 'category';
        $termsPerPage = (int) ($attributes['termsPerPage'] ?? 10);

        $queryArgs = [
            'taxonomy' => $taxonomy,
            'hide_empty' => true,
            'number' => $termsPerPage,
        ];

        // Apply filters
        $queryArgs = apply_filters('jankx_term_layout_query_args', $queryArgs, $attributes);

        return new \WP_Term_Query($queryArgs);
    }

    protected function buildWrapperAttributes($attributes)
    {
        $classes = ['jankx-term-layout'];
        if (!empty($attributes['className'])) {
            $classes[] = $attributes['className'];
        }
        if (!empty($attributes['align'])) {
            $classes[] = 'align' . $attributes['align'];
        }

        return sprintf('class="%s"', esc_attr(implode(' ', $classes)));
    }

    public function enqueueEditorAssets()
    {
        $asset_file = $this->blockPath . '/build/index.asset.php';
        if (!file_exists($asset_file)) {
            return;
        }

        $block_name = str_replace('jankx/', '', $this->blockId);
        $script_handle = 'jankx-' . str_replace('/', '-', $block_name) . '-editor-script';
        if (!wp_script_is($script_handle, 'registered')) {
            $script_handle = 'jankx-' . str_replace('/', '-', $block_name) . '-editor';
        }
        $registered_block = \WP_Block_Type_Registry::get_instance()->get_registered($this->blockId);
        if ($registered_block && !empty($registered_block->editor_script)) {
            $script_handle = $registered_block->editor_script;
        }

        $layoutManager = \Jankx\Foundation\Application::getInstance()->make(ViewLayoutManager::class);

        $taxonomies = get_taxonomies(['public' => true], 'objects');
        $layouts_by_taxonomy = [];
        foreach ($taxonomies as $taxonomy => $taxonomy_obj) {
            // For now, we use common layouts for all taxonomies
            $layouts_by_taxonomy[$taxonomy] = [];
        }

        $commonLayoutsRaw = $layoutManager->getCommonLayouts();
        $commonLayouts = [];
        if (is_array($commonLayoutsRaw)) {
            foreach ($commonLayoutsRaw as $key => $value) {
                $layoutName = is_string($key) ? $key : (is_string($value) ? $value : '');
                if ($layoutName !== '') {
                    try {
                        $layoutInstance = $layoutManager->createLayout($layoutName);
                        $commonLayouts[] = [
                            'name' => $layoutInstance->getName(),
                            'title' => $layoutInstance->getTitle(),
                        ];
                    } catch (\Throwable $e) {
                        $commonLayouts[] = [
                            'name' => $layoutName,
                            'title' => ucfirst(str_replace('-', ' ', $layoutName)),
                        ];
                    }
                }
            }
        }

        $public_taxonomies = [];
        foreach ($taxonomies as $slug => $obj) {
            $label = '';
            if (isset($obj->labels) && isset($obj->labels->singular_name) && $obj->labels->singular_name) {
                $label = $obj->labels->singular_name;
            } elseif (isset($obj->label) && $obj->label) {
                $label = $obj->label;
            } else {
                $label = ucfirst($slug);
            }
            $public_taxonomies[] = [
                'slug' => $slug,
                'name' => $label,
            ];
        }

        $availableTemplates = $this->getAvailableTemplates();
        $ssr_template_config = [
            'nonce' => wp_create_nonce('jankx_term_layout_preview'),
            'postsCountNonce' => wp_create_nonce('jankx_posts_count'),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'availableTemplates' => $availableTemplates,
        ];

        $config = [
            'layoutsByPostType' => $layouts_by_taxonomy,
            'commonLayouts' => $commonLayouts,
        ];

        wp_localize_script($script_handle, 'jankxTermLayouts', $config);
        wp_localize_script($script_handle, 'jankxPublicTaxonomies', $public_taxonomies);
        wp_localize_script($script_handle, 'jankxQueryOptions', \Jankx\Gutenberg\QueryOptions::getOptions());
        wp_localize_script($script_handle, 'jankxTermLayoutTemplate', $ssr_template_config);
    }

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

    protected function scanTemplateDirectory(string $directory, string $prefix, array &$templates): void
    {
        $files = @scandir($directory);
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

    public function ajaxPreview()
    {
        check_ajax_referer('jankx_term_layout_preview', 'nonce');
        $attributes = $_POST['attributes'] ?? [];
        if (is_string($attributes)) {
            $attributes = json_decode(stripslashes($attributes), true);
        }

        $this->ensureServices();
        try {
            $preview = $this->rendererService->renderPreview($attributes);
            wp_send_json_success($preview);
        } catch (\Exception $e) {
            wp_send_json_error(['message' => $e->getMessage()]);
        }
    }
}
