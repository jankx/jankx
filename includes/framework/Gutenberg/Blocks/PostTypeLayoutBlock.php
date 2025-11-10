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
use Jankx\Layouts\PostLayout\PostLayoutManager;
use Jankx\Layouts\PostLayout\PaginationRenderer;
use Jankx\Multilingual\MultilingualFactory;
use Jankx\Query\PostTypeLayoutQueryHelper;
use Jankx\Rest\PostTypeLayoutAjaxHandler;

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
        if (empty($attributes)) {
            return ['error' => __('Invalid attributes', 'jankx')];
        }

        // Set language context
        $this->setLanguageContext($attributes);

        $layout_name = $attributes['layout'] ?? 'grid';
        $layoutManager = $this->getLayoutManager();

        if (!$layoutManager->hasLayout($layout_name)) {
            return ['error' => __('Layout does not exist', 'jankx')];
        }

        $attributes = $this->sanitizeAttributes($layout_name, $attributes, false);
        $queryPreset = $attributes['queryPreset'] ?? 'custom';

        // Build query with pagination
        if ($queryPreset === 'default') {
            $query = PostTypeLayoutQueryHelper::buildDefaultQuery($attributes, $page);
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $decorator->withQuery($query);
        } elseif ($queryPreset === 'related') {
            $attributes = PostTypeLayoutQueryHelper::buildRelatedQuery($attributes);
            $attributes['_internal_paged'] = $page;
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $query = $decorator->buildQuery($attributes);
            $decorator->withQuery($query);
        } else {
            // Apply query builder filter for custom presets (packages can hook into this)
            $attributes = PostTypeLayoutQueryHelper::applyQueryBuilderFilter($attributes, $queryPreset);
            $attributes['_internal_paged'] = $page;
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $query = $decorator->buildQuery($attributes);
            $decorator->withQuery($query);
        }

        $html = $decorator->render();
        $has_more = $page < $query->max_num_pages;

        return [
            'html' => $html,
            'page' => $page,
            'max_pages' => $query->max_num_pages,
            'has_more' => $has_more,
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
        // Apply filters to attributes
        $attributes = PostTypeLayoutQueryHelper::applyFiltersToAttributes($attributes, $filters);

        // Set language context
        $this->setLanguageContext($attributes);

        $layout_name = $attributes['layout'] ?? 'grid';
        $layoutManager = $this->getLayoutManager();

        if (!$layoutManager->hasLayout($layout_name)) {
            return ['error' => __('Layout does not exist', 'jankx')];
        }

        $attributes = $this->sanitizeAttributes($layout_name, $attributes, false);
        $queryPreset = $attributes['queryPreset'] ?? 'custom';

        // Build query
        if ($queryPreset === 'default') {
            $query = PostTypeLayoutQueryHelper::buildDefaultQuery($attributes);
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $decorator->withQuery($query);
        } elseif ($queryPreset === 'related') {
            $attributes = PostTypeLayoutQueryHelper::buildRelatedQuery($attributes);
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $query = $decorator->buildQuery($attributes);
            $decorator->withQuery($query);
        } else {
            // Apply query builder filter for custom presets (packages can hook into this)
            $attributes = PostTypeLayoutQueryHelper::applyQueryBuilderFilter($attributes, $queryPreset);
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $query = $decorator->buildQuery($attributes);
            $decorator->withQuery($query);
        }

        $html = $decorator->render();

        if (empty($html) && !empty($attributes['innerHTML'])) {
            $html = '<div class="post-layout-no-results">' . $attributes['innerHTML'] . '</div>';
        }

        if (!empty($attributes['enablePagination']) && $query->max_num_pages > 1) {
            $html .= PaginationRenderer::render('', $query, $attributes);
        }

        $thumbnail_position = $attributes['thumbnailPosition'] ?? 'top';
        if (!in_array($thumbnail_position, ['top', 'bottom', 'left', 'right'], true)) {
            $thumbnail_position = 'top';
        }

        $wrapper_classes = ['wp-block-jankx-post-type-layout', 'layout-' . $layout_name, 'thumbnail-position-' . $thumbnail_position];

        $inline_styles = [];
        if (!empty($attributes['columns'])) {
            $inline_styles[] = '--columns-desktop: ' . intval($attributes['columns']);
        }
        if (!empty($attributes['columnsTablet'])) {
            $inline_styles[] = '--columns-tablet: ' . intval($attributes['columnsTablet']);
        }
        if (!empty($attributes['columnsMobile'])) {
            $inline_styles[] = '--columns-mobile: ' . intval($attributes['columnsMobile']);
        }

        $query_id = $attributes['queryId'] ?? null;
        if (empty($query_id)) {
            $query_id = 'query_' . uniqid();
        }
        $query_id = strval($query_id);

        $post_type = $attributes['postType'] ?? 'post';
        $posts_per_page = $attributes['postsPerPage'] ?? 10;
        $columns = $attributes['columns'] ?? 3;
        $columns_tablet = $attributes['columnsTablet'] ?? 2;
        $columns_mobile = $attributes['columnsMobile'] ?? 1;
        $order_by = $attributes['orderBy'] ?? 'date';
        $order = $attributes['order'] ?? 'DESC';
        $queryPreset = $attributes['queryPreset'] ?? 'custom';

        $block_settings = [
            'queryId' => $query_id,
            'postType' => $post_type,
            'postsPerPage' => $posts_per_page,
            'layout' => $layout_name,
            'columns' => $columns,
            'columnsTablet' => $columns_tablet,
            'columnsMobile' => $columns_mobile,
            'orderBy' => $order_by,
            'order' => $order,
            'queryPreset' => $queryPreset,
            'thumbnailPosition' => $thumbnail_position,
        ];

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => implode(' ', $wrapper_classes),
            'style' => !empty($inline_styles) ? implode('; ', $inline_styles) : '',
            'data-block-id' => $query_id,
            'data-query-id' => $query_id,
            'data-post-type' => esc_attr($post_type),
            'data-layout' => esc_attr($layout_name),
            'data-posts-per-page' => intval($posts_per_page),
            'data-columns' => intval($columns),
            'data-columns-tablet' => intval($columns_tablet),
            'data-columns-mobile' => intval($columns_mobile),
            'data-order-by' => esc_attr($order_by),
            'data-order' => esc_attr($order),
            'data-query-preset' => esc_attr($queryPreset),
            'data-image-ratio' => !empty($attributes['imageRatio']) ? esc_attr($attributes['imageRatio']) : '',
            'data-thumbnail-position' => esc_attr($thumbnail_position),
            'data-block-settings' => esc_attr(wp_json_encode($block_settings)),
        ]);

        return [
            'html' => sprintf('<div %s>%s</div>', $wrapper_attributes, $html),
            'block_id' => $query_id,
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
        return $this->getBlockAttributesFromPost($post_id, $block_id);
    }

    /**
     * Set language context
     *
     * @param array $attributes Block attributes
     * @return void
     */
    protected function setLanguageContext(array $attributes): void
    {
        if (empty($attributes['_current_language'])) {
            return;
        }

        MultilingualFactory::setCurrentLanguage($attributes['_current_language']);
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
        $layoutManager = $this->getLayoutManager();
        $layout = $layoutManager->getLayout($layout_name);

        if (!$layout || !$for_render) {
            return $attributes;
        }

        $supportedOptions = $layout->getSupportedOptions();
        $optionKeys = ['columns', 'showFeaturedImage', 'showTitle', 'showExcerpt', 'showDate', 'showAuthor', 'itemStyle'];

        foreach ($optionKeys as $key) {
            if (!in_array($key, $supportedOptions, true)) {
                $attributes[$key] = false;
            }
        }

        if (!in_array('thumbnailPosition', $supportedOptions, true)) {
            $attributes['thumbnailPosition'] = 'top';
        }

        return $attributes;
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

        $queryPreset = $attributes['queryPreset'] ?? 'custom';
        $layout_name = $attributes['layout'] ?? 'grid';
        $layoutManager = $this->getLayoutManager();

        if (!$layoutManager->hasLayout($layout_name)) {
            return sprintf(
                '<div class="post-layout-error">%s</div>',
                sprintf(esc_html__('Layout "%s" does not exist.', 'jankx'), esc_html($layout_name))
            );
        }

        $filters_from_url = PostTypeLayoutQueryHelper::getFiltersFromUrl();
        if (!empty($filters_from_url)) {
            $attributes = PostTypeLayoutQueryHelper::applyFiltersToAttributes($attributes, $filters_from_url);
        }

        $attributes = $this->sanitizeAttributes($layout_name, $attributes, true);

        if ($layout_name === 'carousel') {
            $carousel_asset_file = $this->blockPath . '/build/carousel.asset.php';
            $carousel_script_path = $this->blockPath . '/build/carousel.js';
            if (file_exists($carousel_asset_file) && file_exists($carousel_script_path)) {
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
        }

        if ($queryPreset === 'default') {
            $query = PostTypeLayoutQueryHelper::buildDefaultQuery($attributes);
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $decorator->withQuery($query);
        } elseif ($queryPreset === 'related') {
            $attributes = PostTypeLayoutQueryHelper::buildRelatedQuery($attributes);
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $query = $decorator->buildQuery($attributes);
            $decorator->withQuery($query);
        } else {
            // Apply query builder filter for custom presets (packages can hook into this)
            $attributes = PostTypeLayoutQueryHelper::applyQueryBuilderFilter($attributes, $queryPreset);
            $decorator = $layoutManager->createLayout($layout_name, $attributes);
            $query = $decorator->buildQuery($attributes);
            $decorator->withQuery($query);
        }

        $html = $decorator->render();

        if (empty($html) && !empty($content)) {
            $html = '<div class="post-layout-no-results">' . $content . '</div>';
        }

        if (!empty($attributes['enablePagination']) && !empty($html) && $query->max_num_pages > 1) {
            $html .= PaginationRenderer::render($content, $query, $attributes);
        }

        $thumbnail_position = $attributes['thumbnailPosition'] ?? 'top';
        if (!in_array($thumbnail_position, ['top', 'bottom', 'left', 'right'], true)) {
            $thumbnail_position = 'top';
        }

        $wrapper_classes = ['wp-block-jankx-post-type-layout', 'layout-' . $layout_name, 'thumbnail-position-' . $thumbnail_position];

        $inline_styles = [];
        if (!empty($attributes['columns'])) {
            $inline_styles[] = '--columns-desktop: ' . intval($attributes['columns']);
        }
        if (!empty($attributes['columnsTablet'])) {
            $inline_styles[] = '--columns-tablet: ' . intval($attributes['columnsTablet']);
        }
        if (!empty($attributes['columnsMobile'])) {
            $inline_styles[] = '--columns-mobile: ' . intval($attributes['columnsMobile']);
        }

        $query_id = $attributes['queryId'] ?? null;
        if (empty($query_id)) {
            $query_id = 'query_' . uniqid();
        }
        $query_id = strval($query_id);

        $post_type = $attributes['postType'] ?? 'post';
        $posts_per_page = $attributes['postsPerPage'] ?? 10;
        $columns = $attributes['columns'] ?? 3;
        $columns_tablet = $attributes['columnsTablet'] ?? 2;
        $columns_mobile = $attributes['columnsMobile'] ?? 1;
        $order_by = $attributes['orderBy'] ?? 'date';
        $order = $attributes['order'] ?? 'DESC';

        $block_settings = [
            'queryId' => $query_id,
            'postType' => $post_type,
            'postsPerPage' => $posts_per_page,
            'layout' => $layout_name,
            'columns' => $columns,
            'columnsTablet' => $columns_tablet,
            'columnsMobile' => $columns_mobile,
            'orderBy' => $order_by,
            'order' => $order,
            'queryPreset' => $queryPreset,
            'thumbnailPosition' => $thumbnail_position,
        ];

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => implode(' ', $wrapper_classes),
            'style' => !empty($inline_styles) ? implode('; ', $inline_styles) : '',
            'data-block-id' => $query_id,
            'data-query-id' => $query_id,
            'data-post-type' => esc_attr($post_type),
            'data-layout' => esc_attr($layout_name),
            'data-posts-per-page' => intval($posts_per_page),
            'data-columns' => intval($columns),
            'data-columns-tablet' => intval($columns_tablet),
            'data-columns-mobile' => intval($columns_mobile),
            'data-order-by' => esc_attr($order_by),
            'data-order' => esc_attr($order),
            'data-query-preset' => esc_attr($queryPreset),
            'data-image-ratio' => !empty($attributes['imageRatio']) ? esc_attr($attributes['imageRatio']) : '',
            'data-thumbnail-position' => esc_attr($thumbnail_position),
            'data-block-settings' => esc_attr(wp_json_encode($block_settings)),
        ]);

        return sprintf('<div %s>%s</div>', $wrapper_attributes, $html);
    }
}
