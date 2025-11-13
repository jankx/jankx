<?php

namespace Jankx\Gutenberg\Blocks\PostTypeLayout;

use Jankx\Layouts\PostLayout\PostLayoutManager;
use Jankx\Query\PostTypeLayoutQueryHelper;
use Jankx\Layouts\PostLayout\PaginationRenderer;
use Jankx\Gutenberg\Blocks\PostTypeLayout\LayoutViewModel;
use Jankx\Gutenberg\Blocks\PostTypeLayout\LayoutRenderCache;
use Jankx\Layouts\PostLayout\Contracts\PostLayoutJsCallbackInterface;
use Jankx\Layouts\PostLayout\Contracts\ContentGeneratorInterface;

class Renderer
{
    protected PostLayoutManager $layoutManager;
    protected AttributeSanitizer $sanitizer;
    /** @var callable */
    protected $templateExtractor;
    /** @var callable */
    protected $templateSanitizer;
    /** @var callable */
    protected $enqueueCarouselAssets;

    public function __construct(
        PostLayoutManager $layoutManager,
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

    public function render(array $attributes, string $content, $block)
    {
        $layoutName = $attributes['layout'] ?? 'grid';

        if (!$this->layoutManager->hasLayout($layoutName)) {
            return sprintf(
                '<div class="post-layout-error">%s</div>',
                sprintf(esc_html__('Layout "%s" does not exist.', 'jankx'), esc_html($layoutName))
            );
        }

        $templateBlock = $this->resolveTemplateBlock($attributes, $block);

        if ($templateBlock) {
            $attributes['postTemplate'] = $templateBlock;
        }

        $filtersFromUrl = PostTypeLayoutQueryHelper::getFiltersFromUrl();
        if (!empty($filtersFromUrl)) {
            $attributes = PostTypeLayoutQueryHelper::applyFiltersToAttributes($attributes, $filtersFromUrl);
        }

        $attributes = $this->sanitizer->sanitize($layoutName, $attributes, true);

        if ($layoutName === 'carousel') {
            ($this->enqueueCarouselAssets)();
        }

        $originalPreset = $attributes['queryPreset'] ?? 'custom';

        $shouldSkipCache = $this->shouldSkipCache($attributes);

        if ($shouldSkipCache) {
            $decorator = $this->layoutManager->createLayout($layoutName, $attributes);
            $workingAttributes = $attributes;
            $query = $this->buildQueryForPreset($decorator, $workingAttributes, $originalPreset);
            $decorator->withQuery($query);

            $html = $decorator->render();

            if ($html === '' && $content !== '') {
                $html = '<div class="post-layout-no-results">' . $content . '</div>';
            }

            if (!empty($workingAttributes['enablePagination']) && $html !== '' && $query->max_num_pages > 1) {
                $html .= PaginationRenderer::render($content, $query, $workingAttributes);
            }

            $workingAttributes['extraWrapperClasses'] = $this->resolveGeneratorWrapperClasses($decorator, $workingAttributes);

            if (($decoratorLayout = $decorator->getLayout()) && $decoratorLayout instanceof PostLayoutJsCallbackInterface && $decoratorLayout->needsJsInit()) {
                $workingAttributes['js_init'] = [
                    'key' => $decoratorLayout->getJsInitKey(),
                    'payload' => $decoratorLayout->getJsInitPayload(),
                ];
            }

            return LayoutViewModel::render(LayoutViewModel::fromAttributes($workingAttributes, $html));
        }

        $cacheTags = $this->buildCacheTags($attributes, $layoutName);

        $cacheKey = [
            'layout' => $layoutName,
            'attributes' => $attributes,
            'content_hash' => md5($content),
        ];

        $viewModel = LayoutRenderCache::remember('renderer', $cacheKey, function () use ($attributes, $layoutName, $originalPreset, $content) {
            $decorator = $this->layoutManager->createLayout($layoutName, $attributes);

            $workingAttributes = $attributes;
            $query = $this->buildQueryForPreset($decorator, $workingAttributes, $originalPreset);

            $decorator->withQuery($query);

            $html = $decorator->render();

            if ($html === '' && $content !== '') {
                $html = '<div class="post-layout-no-results">' . $content . '</div>';
            }

            if (!empty($workingAttributes['enablePagination']) && $html !== '' && $query->max_num_pages > 1) {
                $html .= PaginationRenderer::render($content, $query, $workingAttributes);
            }

            $workingAttributes['extraWrapperClasses'] = $this->resolveGeneratorWrapperClasses($decorator, $workingAttributes);

            if (($decoratorLayout = $decorator->getLayout()) && $decoratorLayout instanceof PostLayoutJsCallbackInterface && $decoratorLayout->needsJsInit()) {
                $workingAttributes['js_init'] = [
                    'key' => $decoratorLayout->getJsInitKey(),
                    'payload' => $decoratorLayout->getJsInitPayload(),
                ];
            }

            return LayoutViewModel::fromAttributes($workingAttributes, $html);
        }, $cacheTags);

        return LayoutViewModel::render($viewModel);
    }

    protected function resolveTemplateBlock(array $attributes, $block)
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

    protected function buildQueryForPreset($decorator, array &$attributes, string $preset)
    {
        if ($preset === 'default') {
            return PostTypeLayoutQueryHelper::buildDefaultQuery($attributes);
        }

        if ($preset === 'related') {
            $attributes = PostTypeLayoutQueryHelper::buildRelatedQuery($attributes);
            $decorator->withAttributes($attributes);
            return $decorator->buildQuery($attributes);
        }

        if ($preset !== 'custom') {
            $attributes = PostTypeLayoutQueryHelper::applyQueryBuilderFilter($attributes, $preset);
        }

        $decorator->withAttributes($attributes);
        return $decorator->buildQuery($attributes);
    }

    protected function buildCacheTags(array $attributes, string $layoutName): array
    {
        $tags = ['layout:' . $layoutName];

        if (!empty($attributes['postType'])) {
            $tags[] = 'post_type:' . $attributes['postType'];
        }

        if (!empty($attributes['queryId'])) {
            $tags[] = 'query_id:' . (string) $attributes['queryId'];
        }

        if (!empty($attributes['customQueryId'])) {
            $tags[] = 'custom_query:' . $attributes['customQueryId'];
        }

        return $tags;
    }

    protected function shouldSkipCache(array $attributes): bool
    {
        $orderby = isset($attributes['orderBy']) ? strtolower((string) $attributes['orderBy']) : '';
        return in_array($orderby, ['rand', 'random'], true);
    }

    protected function resolveGeneratorWrapperClasses($decorator, array $attributes): array
    {
        if (!method_exists($decorator, 'getLayout')) {
            return [];
        }

        $layout = $decorator->getLayout();
        if (!$layout) {
            return [];
        }

        $generator = $layout->getContentGenerator();
        if (!$generator instanceof ContentGeneratorInterface) {
            return [];
        }

        if (!method_exists($generator, 'appendClassesToWrapper')) {
            return [];
        }

        $classes = $generator->appendClassesToWrapper([], $attributes);

        if (!is_array($classes)) {
            return [];
        }

        return array_values(array_filter(array_map('sanitize_html_class', $classes)));
    }
}

