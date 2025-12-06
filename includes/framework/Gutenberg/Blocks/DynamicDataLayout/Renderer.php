<?php

namespace Jankx\Gutenberg\Blocks\DynamicDataLayout;

use Jankx\Layouts\DynamicDataLayout\DynamicDataLayoutManager;
use Jankx\Layouts\PostLayout\PostLayoutDecorator;
use Jankx\Layouts\PostLayout\Generators\PostTemplateBlockGenerator;
use Jankx\Layouts\PostLayout\PaginationRenderer;
use Jankx\Layouts\PostLayout\Contracts\PostLayoutJsCallbackInterface;
use Jankx\Layouts\PostLayout\Contracts\ContentGeneratorInterface;
use WP_Query;

/**
 * Renderer for Dynamic Data Layout Block
 *
 * Handles rendering logic for the wrapper layout (container)
 * Individual item content is handled by DynamicDataTemplateBlock
 *
 * @package Jankx\Gutenberg\Blocks\DynamicDataLayout
 * @since 2.0.0
 */
class Renderer
{
    protected DynamicDataLayoutManager $layoutManager;
    protected AttributeSanitizer $sanitizer;
    /** @var callable */
    protected $templateExtractor;
    /** @var callable */
    protected $templateSanitizer;
    /** @var callable */
    protected $enqueueCarouselAssets;

    public function __construct(
        DynamicDataLayoutManager $layoutManager,
        AttributeSanitizer $sanitizer,
        callable $templateExtractor,
        callable $templateSanitizer,
        callable $enqueueCarouselAssets
    ) {
        $this->layoutManager = $layoutManager;
        $this->sanitizer = $sanitizer;
        $this->templateExtractor = $templateExtractor;
        $this->templateSanitizer = $templateSanitizer;
        $this->enqueueCarouselAssets = $enqueueCarouselAssets;
    }

    /**
     * Render the block
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @param \WP_Block|null $block Block instance
     * @return string Rendered HTML
     */
    public function render(array $attributes, string $content, $block): string
    {
        $layoutName = $attributes['layout'] ?? 'grid';
        $postType = $attributes['postType'] ?? 'post';

        if (!$this->layoutManager->hasLayout($layoutName, $postType)) {
            return sprintf(
                '<div class="dynamic-data-layout-error">%s</div>',
                sprintf(esc_html__('Layout "%s" does not exist for post type "%s".', 'jankx'), esc_html($layoutName), esc_html($postType))
            );
        }

        // Resolve template block from inner blocks
        $templateBlock = $this->resolveTemplateBlock($attributes, $block);

        if ($templateBlock) {
            $attributes['postTemplate'] = $templateBlock;
        }

        // Sanitize attributes
        $attributes = $this->sanitizer->sanitize($layoutName, $attributes, true);

        // Enqueue carousel assets if needed
        if ($layoutName === 'carousel') {
            ($this->enqueueCarouselAssets)();
        }

        // Create layout decorator
        $decorator = $this->layoutManager->createLayout($layoutName, $postType, $attributes);

        // Build query
        $query = $this->buildQuery($attributes, $postType);
        $decorator->withQuery($query);
        $decorator->withAttributes($attributes);

        // Set content generator if template block exists
        if ($templateBlock) {
            $generator = new PostTemplateBlockGenerator($templateBlock, $attributes);
            $layoutInstance = $decorator->getLayout();
            $layoutInstance->setContentGenerator($generator);
        }

        // Render layout (wrapper only, items are rendered by template block)
        $html = $decorator->render();

        // Handle empty results
        if ($html === '' && $content !== '') {
            $html = '<div class="dynamic-data-layout-no-results">' . $content . '</div>';
        }

        // Add pagination if enabled
        if (!empty($attributes['enablePagination']) && $html !== '' && $query->max_num_pages > 1) {
            $html .= PaginationRenderer::render($content, $query, $attributes);
        }

        // Add wrapper classes
        $wrapperClasses = $this->resolveWrapperClasses($decorator, $attributes);
        if (!empty($wrapperClasses)) {
            $html = sprintf(
                '<div class="%s">%s</div>',
                esc_attr(implode(' ', $wrapperClasses)),
                $html
            );
        }

        // Add JS initialization if needed
        if (($decoratorLayout = $decorator->getLayout()) && 
            $decoratorLayout instanceof PostLayoutJsCallbackInterface && 
            $decoratorLayout->needsJsInit()) {
            // JS init will be handled by frontend scripts
            $html = sprintf(
                '<div data-js-init="%s" data-js-payload=\'%s\'>%s</div>',
                esc_attr($decoratorLayout->getJsInitKey()),
                esc_attr(wp_json_encode($decoratorLayout->getJsInitPayload())),
                $html
            );
        }

        return $html;
    }

    /**
     * Resolve template block from block instance or attributes
     *
     * @param array $attributes Block attributes
     * @param \WP_Block|null $block Block instance
     * @return array|null
     */
    protected function resolveTemplateBlock(array $attributes, $block): ?array
    {
        $templateBlock = null;

        if ($block instanceof \WP_Block) {
            $extractor = $this->templateExtractor;
            $templateBlock = $extractor($block->parsed_block ?? []);
        }

        if (!$templateBlock && !empty($attributes['postTemplate'])) {
            $templateBlock = $attributes['postTemplate'];
        }

        if ($templateBlock) {
            $sanitizer = $this->templateSanitizer;
            $templateBlock = $sanitizer($templateBlock);
        }

        return $templateBlock;
    }

    /**
     * Build WP_Query from attributes
     *
     * @param array $attributes Block attributes
     * @param string $postType Post type
     * @return WP_Query
     */
    protected function buildQuery(array $attributes, string $postType): WP_Query
    {
        $query_args = [
            'post_type' => $postType,
            'posts_per_page' => $attributes['postsPerPage'] ?? 10,
            'post_status' => 'publish',
            'ignore_sticky_posts' => !($attributes['includeStickyPosts'] ?? false),
        ];

        // Handle Order
        if (isset($attributes['orderBy'])) {
            $query_args['orderby'] = $attributes['orderBy'];
        }
        if (isset($attributes['order'])) {
            $query_args['order'] = $attributes['order'];
        }

        // Handle Offset
        if (!empty($attributes['offset'])) {
            $query_args['offset'] = (int) $attributes['offset'];
        }

        // Handle Tax Query
        if (!empty($attributes['taxQuery']) && is_array($attributes['taxQuery'])) {
            $query_args['tax_query'] = $attributes['taxQuery'];
        }

        // Handle Meta Query
        if (!empty($attributes['metaQuery']) && is_array($attributes['metaQuery'])) {
            $query_args['meta_query'] = $attributes['metaQuery'];
        }

        // Handle Keyword Search
        if (!empty($attributes['keyword'])) {
            $query_args['s'] = $attributes['keyword'];
        }

        // Handle Author
        if (!empty($attributes['authorIn']) && is_array($attributes['authorIn'])) {
            $query_args['author__in'] = array_map('intval', $attributes['authorIn']);
        }
        if (!empty($attributes['authorNotIn']) && is_array($attributes['authorNotIn'])) {
            $query_args['author__not_in'] = array_map('intval', $attributes['authorNotIn']);
        }

        // Handle Post IDs
        if (!empty($attributes['postIn']) && is_array($attributes['postIn'])) {
            $query_args['post__in'] = array_map('intval', $attributes['postIn']);
        }
        if (!empty($attributes['postNotIn']) && is_array($attributes['postNotIn'])) {
            $query_args['post__not_in'] = array_map('intval', $attributes['postNotIn']);
        }

        // Handle Post Parent
        if (!empty($attributes['postParent'])) {
            $query_args['post_parent'] = (int) $attributes['postParent'];
        }
        if (!empty($attributes['postParentIn']) && is_array($attributes['postParentIn'])) {
            $query_args['post_parent__in'] = array_map('intval', $attributes['postParentIn']);
        }
        if (!empty($attributes['postParentNotIn']) && is_array($attributes['postParentNotIn'])) {
            $query_args['post_parent__not_in'] = array_map('intval', $attributes['postParentNotIn']);
        }

        return new WP_Query($query_args);
    }

    /**
     * Resolve wrapper classes from decorator and attributes
     *
     * @param PostLayoutDecorator $decorator Layout decorator
     * @param array $attributes Block attributes
     * @return array
     */
    protected function resolveWrapperClasses(PostLayoutDecorator $decorator, array $attributes): array
    {
        $classes = ['dynamic-data-layout-wrapper'];

        // Add layout class
        if (!empty($attributes['layout'])) {
            $classes[] = 'layout-' . sanitize_html_class($attributes['layout']);
        }

        // Add post type class
        if (!empty($attributes['postType'])) {
            $classes[] = 'post-type-' . sanitize_html_class($attributes['postType']);
        }

        // Get classes from content generator
        $layoutInstance = $decorator->getLayout();
        $generator = $layoutInstance->getContentGenerator();
        
        if ($generator instanceof ContentGeneratorInterface && 
            method_exists($generator, 'appendClassesToWrapper')) {
            $generatorClasses = $generator->appendClassesToWrapper([], $attributes);
            if (is_array($generatorClasses)) {
                $classes = array_merge($classes, array_map('sanitize_html_class', $generatorClasses));
            }
        }

        return array_values(array_filter(array_unique($classes)));
    }
}

