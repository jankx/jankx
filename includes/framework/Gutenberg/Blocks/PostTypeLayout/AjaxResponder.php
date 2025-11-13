<?php

namespace Jankx\Gutenberg\Blocks\PostTypeLayout;

use Jankx\Layouts\PostLayout\PostLayoutManager;
use Jankx\Query\PostTypeLayoutQueryHelper;
use Jankx\Layouts\PostLayout\PaginationRenderer;
use Jankx\Gutenberg\Blocks\PostTypeLayout\LayoutViewModel;
use Jankx\Gutenberg\Blocks\PostTypeLayout\LayoutRenderCache;
use Jankx\Layouts\PostLayout\Contracts\ContentGeneratorInterface;

class AjaxResponder
{
    protected PostLayoutManager $layoutManager;
    protected AttributeSanitizer $sanitizer;
    /** @var callable */
    protected $templateSanitizer;
    /** @var callable */
    protected $languageSetter;

    public function __construct(
        PostLayoutManager $layoutManager,
        AttributeSanitizer $sanitizer,
        callable $templateSanitizer,
        callable $languageSetter
    ) {
        $this->layoutManager = $layoutManager;
        $this->sanitizer = $sanitizer;
        $this->templateSanitizer = $templateSanitizer;
        $this->languageSetter = $languageSetter;
    }

    public function handleLoadMore(array $attributes, int $page): array
    {
        if (empty($attributes)) {
            return ['error' => __('Invalid attributes', 'jankx')];
        }

        $layoutName = $attributes['layout'] ?? 'grid';
        if (!$this->layoutManager->hasLayout($layoutName)) {
            return ['error' => __('Layout does not exist', 'jankx')];
        }

        $restoreLocale = ($this->languageSetter)($attributes);

        try {
            $attributes = $this->prepareTemplateBlock($attributes);
            $attributes = $this->sanitizer->sanitize($layoutName, $attributes, false);

            $cacheKey = [
                'layout' => $layoutName,
                'attributes' => $attributes,
                'page' => $page,
            ];

            $cacheTags = $this->buildCacheTags($attributes, $layoutName);

            if ($this->shouldSkipCache($attributes)) {
                $response = $this->generateLoadMoreResponse($layoutName, $attributes, $page);
            } else {
                $response = LayoutRenderCache::remember('ajax_load_more', $cacheKey, function () use ($layoutName, $attributes, $page) {
                    return $this->generateLoadMoreResponse($layoutName, $attributes, $page);
                }, $cacheTags);
            }
        } finally {
            if (is_callable($restoreLocale)) {
                $restoreLocale();
            }
        }

        return $response;
    }

    public function handleFilterUpdate(array $attributes, array $filters): array
    {
        $attributes = PostTypeLayoutQueryHelper::applyFiltersToAttributes($attributes, $filters);
        $layoutName = $attributes['layout'] ?? 'grid';
        if (!$this->layoutManager->hasLayout($layoutName)) {
            return ['error' => __('Layout does not exist', 'jankx')];
        }

        $restoreLocale = ($this->languageSetter)($attributes);

        try {
            $attributes = $this->prepareTemplateBlock($attributes);
            $attributes = $this->sanitizer->sanitize($layoutName, $attributes, false);

            $cacheKey = [
                'layout' => $layoutName,
                'attributes' => $attributes,
            ];

            $cacheTags = $this->buildCacheTags($attributes, $layoutName);

            if ($this->shouldSkipCache($attributes)) {
                $response = $this->generateFilterResponse($layoutName, $attributes);
            } else {
                $response = LayoutRenderCache::remember('ajax_filter', $cacheKey, function () use ($layoutName, $attributes) {
                    return $this->generateFilterResponse($layoutName, $attributes);
                }, $cacheTags);
            }
        } finally {
            if (is_callable($restoreLocale)) {
                $restoreLocale();
            }
        }

        return $response;
    }

    protected function buildQueryForPreset($decorator, array &$attributes, string $preset, int $page = 1)
    {
        if ($preset === 'default') {
            return PostTypeLayoutQueryHelper::buildDefaultQuery($attributes, $page);
        }

        if ($preset === 'related') {
            $attributes = PostTypeLayoutQueryHelper::buildRelatedQuery($attributes);
            $decorator->withAttributes($attributes);
            return $decorator->buildQuery($attributes);
        }

        if ($preset !== 'custom') {
            $attributes = PostTypeLayoutQueryHelper::applyQueryBuilderFilter($attributes, $preset);
        }

        $attributes['_internal_paged'] = $page;
        $decorator->withAttributes($attributes);

        return $decorator->buildQuery($attributes);
    }

    protected function prepareTemplateBlock(array $attributes): array
    {
        if (empty($attributes['postTemplate'])) {
            return $attributes;
        }

        $sanitizer = $this->templateSanitizer;
        $attributes['postTemplate'] = $sanitizer($attributes['postTemplate']);

        return $attributes;
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

    protected function generateLoadMoreResponse(string $layoutName, array $attributes, int $page): array
    {
        $decorator = $this->layoutManager->createLayout($layoutName, $attributes);

        $workingAttributes = $attributes;
        $queryPreset = $workingAttributes['queryPreset'] ?? 'custom';

        $query = $this->buildQueryForPreset($decorator, $workingAttributes, $queryPreset, $page);

        $decorator->withQuery($query);

        $html = $decorator->render();
        $hasMore = $page < $query->max_num_pages;

        return [
            'html' => $html,
            'page' => $page,
            'max_pages' => $query->max_num_pages,
            'has_more' => $hasMore,
        ];
    }

    protected function generateFilterResponse(string $layoutName, array $attributes): array
    {
        $decorator = $this->layoutManager->createLayout($layoutName, $attributes);

        $workingAttributes = $attributes;
        $queryPreset = $workingAttributes['queryPreset'] ?? 'custom';
        $query = $this->buildQueryForPreset($decorator, $workingAttributes, $queryPreset);

        $decorator->withQuery($query);

        $html = $decorator->render();

        if (empty($html) && !empty($workingAttributes['innerHTML'])) {
            $html = '<div class="post-layout-no-results">' . $workingAttributes['innerHTML'] . '</div>';
        }

        if (!empty($workingAttributes['enablePagination']) && $query->max_num_pages > 1) {
            $html .= PaginationRenderer::render('', $query, $workingAttributes);
        }

        $workingAttributes['extraWrapperClasses'] = $this->resolveGeneratorWrapperClasses($decorator, $workingAttributes);

        $viewModel = LayoutViewModel::fromAttributes($workingAttributes, $html);

        return [
            'html' => LayoutViewModel::render($viewModel),
            'block_id' => $viewModel['block_id'],
            'meta' => [
                'max_pages' => $query->max_num_pages,
                'has_more' => $query->max_num_pages > 1,
                'js_init' => $viewModel['js_init'] ?? null,
            ],
        ];
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

