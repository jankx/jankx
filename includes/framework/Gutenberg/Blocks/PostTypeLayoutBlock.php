<?php

/**
 * Post Type Layout Block
 *
 * Hiển thị danh sách posts theo layout tùy chỉnh (Grid, List, Masonry)
 * với đầy đủ query options và display settings
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Gutenberg\Blocks\PostTypeLayout\AjaxResponder;
use Jankx\Gutenberg\Blocks\PostTypeLayout\AttributeSanitizer;
use Jankx\Gutenberg\Blocks\PostTypeLayout\LayoutRenderCache;
use Jankx\Gutenberg\Blocks\PostTypeLayout\Renderer;
use Jankx\Layouts\PostLayout\PostLayoutManager;
use Jankx\Multilingual\MultilingualFactory;
use Jankx\Query\PostTypeLayoutQueryHelper;
use Jankx\Rest\PostTypeLayoutAjaxHandler;
use WP_Post;

class PostTypeLayoutBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/post-type-layout';

    /**
     * PostLayoutManager instance
     *
     * @var PostLayoutManager|null
     */
    protected $layoutManager = null;

    /**
     * AJAX Handler instance
     *
     * @var PostTypeLayoutAjaxHandler|null
     */
    protected $ajaxHandler = null;

    protected ?AttributeSanitizer $attributeSanitizer = null;
    protected ?AjaxResponder $ajaxResponder = null;
    protected ?Renderer $rendererService = null;

    /**
     * Initialize the block
     *
     * @return void
     */
    public function init(): void
    {
        // Initialize AJAX handler
        $this->ajaxHandler = new PostTypeLayoutAjaxHandler();
        $this->ajaxHandler->registerHandlers();

        // Enqueue editor scripts with localized data
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets'], 20);

        // Enqueue frontend scripts for Load More
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);

        // Register handlers via WordPress filters
        add_filter('jankx_post_type_layout_load_more', [$this, 'handleLoadMoreAjax'], 10, 2);
        add_filter('jankx_post_type_layout_filter_update', [$this, 'handleFilterUpdate'], 10, 2);
        add_filter('jankx_post_type_layout_get_block_attributes', [$this, 'handleGetBlockAttributes'], 10, 3);

        $this->ensureServices();
        $this->registerInvalidationHooks();
    }

    /**
     * Get layout manager (lazy loaded)
     *
     * @return PostLayoutManager
     */
    protected function getLayoutManager(): PostLayoutManager
    {
        if ($this->layoutManager === null) {
            $this->layoutManager = PostLayoutManager::getInstance();
        }
        return $this->layoutManager;
    }

    /**
     * Handle Load More request via filter
     *
     * @param array $attributes Block attributes
     * @param int $page Page number
     * @return array Response data
     */
    public function handleLoadMoreAjax(array $attributes, int $page): array
    {
        $this->ensureServices();
        return $this->ajaxResponder->handleLoadMore($attributes, $page);
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
        $this->ensureServices();
        return $this->ajaxResponder->handleFilterUpdate($attributes, $filters);
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
        return $this->getBlockAttributesFromPost($post_id, $block_id);
    }

    /**
     * Set language context
     *
     * @param array $attributes Block attributes
     * @return void
     */
    protected function setLanguageContext(array $attributes): ?callable
    {
        $restorers = [];

        $adapter = MultilingualFactory::getAdapter();
        if ($adapter && !empty($attributes['_current_language'])) {
            $previousLanguage = $adapter->getCurrentLanguage();
            $targetLanguage = $attributes['_current_language'];

            if ($previousLanguage !== $targetLanguage) {
                $adapter->setCurrentLanguage($targetLanguage);
                $restorers[] = function () use ($adapter, $previousLanguage): void {
                    if ($previousLanguage) {
                        $adapter->setCurrentLanguage($previousLanguage);
                    }
                };
            }
        }

        $targetLocale = $attributes['_locale'] ?? get_locale();
        if ($targetLocale && function_exists('switch_to_locale')) {
            $currentLocale = determine_locale();
            if ($currentLocale !== $targetLocale && switch_to_locale($targetLocale)) {
                $restorers[] = function (): void {
                    restore_previous_locale();
                };
            }
        }

        if (empty($restorers)) {
            return null;
        }

        return function () use ($restorers): void {
            foreach (array_reverse($restorers) as $restore) {
                if (is_callable($restore)) {
                    $restore();
                }
            }
        };
    }

    /**
     * Sanitize attributes based on layout
     *
     * @param string $layout_name
     * @param array $attributes
     * @param bool $for_render
     * @return array
     */
    protected function sanitizeAttributes(string $layout_name, array $attributes, bool $for_render = true): array
    {
        $this->ensureServices();
        return $this->attributeSanitizer->sanitize($layout_name, $attributes, $for_render);
    }

    /**
     * Get block attributes from post content
     *
     * @param int $post_id
     * @param string $block_id
     * @return array|null
     */
    private function getBlockAttributesFromPost(int $post_id, string $block_id): ?array
    {
        if (!$post_id) {
            return null;
        }

        $post_obj = get_post($post_id);
        if (!$post_obj) {
            return null;
        }

        $blocks = parse_blocks($post_obj->post_content);
        return $this->findBlockAttributesById($blocks, $block_id);
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
            if (($block['blockName'] ?? '') === 'jankx/post-type-layout') {
                $query_id = $block['attrs']['queryId'] ?? null;
                if ($query_id && strval($query_id) === $target_block_id) {
                    return $block['attrs'] ?? [];
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

    protected function enqueueCarouselAssets(): void
    {
        $carousel_asset_file = $this->blockPath . '/build/carousel.asset.php';
        $carousel_script_path = $this->blockPath . '/build/carousel.js';
        if (!file_exists($carousel_asset_file) || !file_exists($carousel_script_path)) {
            return;
        }

        $asset = require $carousel_asset_file;
        $script_handle = 'jankx-post-type-layout-carousel';

        $block_url = str_replace(
            [wp_normalize_path(WP_CONTENT_DIR), '\\'],
            [content_url(), '/'],
            wp_normalize_path($this->blockPath)
        );

        wp_enqueue_script(
            $script_handle,
            $block_url . '/build/carousel.js',
            $asset['dependencies'] ?? [],
            $asset['version'] ?? filemtime($carousel_script_path),
            true
        );
    }

    protected function extractTemplateBlockFromParsedBlock(array $parsedBlock): ?array
    {
        if (empty($parsedBlock)) {
            return null;
        }

        if (($parsedBlock['blockName'] ?? '') === 'jankx/post-layout-template') {
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

    /**
     * Enqueue editor assets
     *
     * @return void
     */
    public function enqueueEditorAssets(): void
    {
        $asset_file = $this->blockPath . '/build/index.asset.php';
        
        if (!file_exists($asset_file)) {
            return;
        }

        $asset = require $asset_file;
        $script_handle = 'jankx-post-type-layout-editor-script';

        if (!wp_script_is($script_handle, 'registered')) {
            $script_handle = 'jankx-post-type-layout-editor';
        }

        $layouts = $this->getLayoutManager()->getLayouts(['field' => 'all']);
        
        wp_localize_script(
            $script_handle,
            'jankxSupportedPostTypeLayouts',
            $layouts
        );

        // Localize query options including query presets
        $query_options = \Jankx\Gutenberg\QueryOptions::getOptions();
        
        wp_localize_script(
            $script_handle,
            'jankxQueryOptions',
            $query_options
        );
    }

    /**
     * Enqueue frontend assets
     *
     * @return void
     */
    public function enqueueFrontendAssets(): void
    {
        // Assets are loaded via block.json
        // Only add localized data if needed
    }

    /**
     * Render the block
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @param \WP_Block $block Block instance
     * @return string Rendered HTML
     */
    public function render($attributes, $content, $block)
    {
        $current_language = MultilingualFactory::getCurrentLanguage();
        if ($current_language) {
            $attributes['_current_language'] = $current_language;
        }
        $attributes['_locale'] = get_locale();

        $this->ensureServices();
        return $this->rendererService->render($attributes, $content, $block);
    }

    protected function ensureServices(): void
    {
        if ($this->attributeSanitizer && $this->ajaxResponder && $this->rendererService) {
            return;
        }

        $layoutManager = $this->getLayoutManager();

        if (!$this->attributeSanitizer) {
            $this->attributeSanitizer = new AttributeSanitizer($layoutManager);
        }

        if (!$this->ajaxResponder) {
            $this->ajaxResponder = new AjaxResponder(
                $layoutManager,
                $this->attributeSanitizer,
                function ($template) {
                    return $this->sanitizeTemplateBlock($template);
                },
                function (array $attributes) {
                    return $this->setLanguageContext($attributes);
                }
            );
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

    protected function registerInvalidationHooks(): void
    {
        add_action('save_post', [$this, 'handlePostCacheInvalidation'], 10, 3);
        add_action('transition_post_status', [$this, 'handlePostStatusTransition'], 10, 3);
        add_action('before_delete_post', [$this, 'handleBeforeDeletePost']);
    }

    public function handlePostCacheInvalidation(int $postId, $post, $update): void
    {
        if (wp_is_post_revision($postId)) {
            return;
        }

        $postType = $post instanceof WP_Post ? $post->post_type : get_post_type($postId);
        if (!$postType) {
            return;
        }

        LayoutRenderCache::flushByPostType($postType);
    }

    public function handlePostStatusTransition(string $newStatus, string $oldStatus, $post): void
    {
        if (!$post instanceof WP_Post) {
            return;
        }

        LayoutRenderCache::flushByPostType($post->post_type);
    }

    public function handleBeforeDeletePost(int $postId): void
    {
        $postType = get_post_type($postId);
        if (!$postType) {
            return;
        }

        LayoutRenderCache::flushByPostType($postType);
    }
}
