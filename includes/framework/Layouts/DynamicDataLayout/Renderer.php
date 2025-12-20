<?php

namespace Jankx\Layouts\DynamicDataLayout;

use Jankx\Layouts\DynamicDataLayout\DynamicDataLayoutManager;
use Jankx\Layouts\DynamicDataLayout\PostLayoutDecorator;
use Jankx\Layouts\DynamicDataLayout\Generators\PostTemplateBlockGenerator;
use Jankx\Layouts\DynamicDataLayout\Generators\SsrViewGenerator;
use Jankx\Layouts\DynamicDataLayout\PaginationRenderer;
use Jankx\Layouts\DynamicDataLayout\Contracts\PostLayoutJsCallbackInterface;
use Jankx\Layouts\DynamicDataLayout\Contracts\ContentGeneratorInterface;
use Jankx\Query\DynamicDataLayoutQueryHelper;
use Jankx\Multilingual\MultilingualFactory;
use WP_Query;

class Renderer
{
    protected DynamicDataLayoutManager $layoutManager;
    protected AttributeSanitizer $sanitizer;
    protected $templateExtractor;
    protected $templateSanitizer;
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

        $templateBlock = $this->resolveTemplateBlock($attributes, $block);
        if ($templateBlock) {
            $attributes['postTemplate'] = $templateBlock;
            if (!empty($templateBlock['attrs'])) {
                $templateAttrs = $templateBlock['attrs'];
                if (!empty($templateAttrs['imageRatio']) && empty($attributes['imageRatio'])) {
                    $attributes['imageRatio'] = $templateAttrs['imageRatio'];
                }
                if (!empty($templateAttrs['thumbnailPosition']) && empty($attributes['thumbnailPosition'])) {
                    $attributes['thumbnailPosition'] = $templateAttrs['thumbnailPosition'];
                }
            }
        }

        $filtersFromUrl = DynamicDataLayoutQueryHelper::getFiltersFromUrl();
        if (!empty($filtersFromUrl)) {
            $attributes = DynamicDataLayoutQueryHelper::applyFiltersToAttributes($attributes, $filtersFromUrl);
        }

        $attributes = $this->sanitizer->sanitize($layoutName, $attributes, true);

        if ($layoutName === 'carousel') {
            ($this->enqueueCarouselAssets)();
        }

        $originalPreset = $attributes['queryPreset'] ?? 'custom';
        $decorator = $this->layoutManager->createLayout($layoutName, $postType, $attributes);
        $query = $this->buildQueryForPreset($decorator, $attributes, $originalPreset, $postType);
        $decorator->withQuery($query);
        $decorator->withAttributes($attributes);

        if ($templateBlock) {
            $blockName = $templateBlock['blockName'] ?? '';
            $generator = ($blockName === 'jankx/dynamic-ssr-template')
                ? new SsrViewGenerator($templateBlock, $attributes)
                : new PostTemplateBlockGenerator($templateBlock, $attributes);
            $layoutInstance = $decorator->getLayout();
            $layoutInstance->setContentGenerator($generator);
        }

        $html = $decorator->render();
        if ($html === '' && $content !== '') {
            $html = '<div class="dynamic-data-layout-no-results">' . $content . '</div>';
        }
        if (!empty($attributes['enablePagination']) && $html !== '' && $query->max_num_pages > 1) {
            $html .= PaginationRenderer::render($content, $query, $attributes);
        }

        $wrapperClasses = $this->resolveWrapperClasses($decorator, $attributes);
        $wrapperStyles = $this->resolveWrapperStyles($attributes);
        if (!empty($wrapperClasses) || !empty($wrapperStyles)) {
            $styleAttr = !empty($wrapperStyles) ? sprintf(' style="%s"', esc_attr($wrapperStyles)) : '';
            $classAttr = !empty($wrapperClasses) ? sprintf(' class="%s"', esc_attr(implode(' ', $wrapperClasses))) : '';
            $html = sprintf('<div%s%s>%s</div>', $classAttr, $styleAttr, $html);
        }

        if (($decoratorLayout = $decorator->getLayout()) && 
            $decoratorLayout instanceof PostLayoutJsCallbackInterface && 
            $decoratorLayout->needsJsInit()) {
            $html = sprintf(
                '<div data-js-init="%s" data-js-payload=\'%s\'>%s</div>',
                esc_attr($decoratorLayout->getJsInitKey()),
                esc_attr(wp_json_encode($decoratorLayout->getJsInitPayload())),
                $html
            );
        }
        return $html;
    }

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

    protected function buildQueryForPreset(PostLayoutDecorator $decorator, array &$attributes, string $preset, string $postType): WP_Query
    {
        if ($preset === 'default') {
            return DynamicDataLayoutQueryHelper::buildDefaultQuery($attributes);
        }
        if ($preset === 'related') {
            $attributes = DynamicDataLayoutQueryHelper::buildRelatedQuery($attributes);
            $decorator->withAttributes($attributes);
            $relatedQuery = $decorator->buildQuery($attributes);
            $perPage = isset($attributes['postsPerPage']) ? (int) $attributes['postsPerPage'] : 10;
            $relatedIds = array_map(static function ($p) {
                return isset($p->ID) ? (int) $p->ID : 0;
            }, $relatedQuery->posts ?? []);
            $relatedIds = array_values(array_filter(array_unique($relatedIds)));
            $relatedCount = count($relatedIds);
            if ($relatedCount >= $perPage) {
                return $relatedQuery;
            }
            $remaining = max(0, $perPage - $relatedCount);
            $excludeIds = $relatedIds;
            if (!empty($attributes['postNotIn']) && is_array($attributes['postNotIn'])) {
                $excludeIds = array_values(array_unique(array_merge($excludeIds, array_map('intval', $attributes['postNotIn']))));
            }
            if (is_singular()) {
                $current = get_queried_object_id();
                if ($current) {
                    $excludeIds[] = (int) $current;
                }
            }
            $excludeIds = array_values(array_unique(array_filter($excludeIds)));
            $lang = $attributes['_current_language'] ?? null;
            $cacheKey = 'rand_fill:' . ($attributes['postType'] ?? $postType) . ':' . $remaining . ($lang ? (':lang:' . $lang) : '');
            $transientKey = 'jankx_dd_layout_' . md5($cacheKey);
            $randIds = get_transient($transientKey);
            if (!is_array($randIds)) {
                $randArgs = [
                    'post_type' => $attributes['postType'] ?? $postType,
                    'posts_per_page' => $remaining,
                    'orderby' => 'rand',
                    'post_status' => 'publish',
                ];
                if (!empty($excludeIds)) {
                    $randArgs['post__not_in'] = $excludeIds;
                }
                if ($lang) {
                    $randArgs = MultilingualFactory::addLanguageToQueryArgs($randArgs, $lang);
                }
                $randQuery = new WP_Query($randArgs);
                $randIds = array_map(static function ($p) {
                    return isset($p->ID) ? (int) $p->ID : 0;
                }, $randQuery->posts ?? []);
                $randIds = array_values(array_filter(array_unique($randIds)));
                set_transient($transientKey, $randIds, 10 * MINUTE_IN_SECONDS);
            }
            $finalIds = array_values(array_unique(array_merge($relatedIds, $randIds)));
            if (count($finalIds) > $perPage) {
                $finalIds = array_slice($finalIds, 0, $perPage);
            }
            $finalArgs = [
                'post_type' => $attributes['postType'] ?? $postType,
                'posts_per_page' => $perPage,
                'post__in' => $finalIds,
                'orderby' => 'post__in',
                'post_status' => 'publish',
            ];
            if (!empty($attributes['_internal_paged'])) {
                $finalArgs['paged'] = (int) $attributes['_internal_paged'];
            } elseif (!empty($attributes['enablePagination'])) {
                $finalArgs['paged'] = get_query_var('paged') ?: 1;
            }
            if ($lang) {
                $finalArgs = MultilingualFactory::addLanguageToQueryArgs($finalArgs, $lang);
            }
            return new WP_Query($finalArgs);
        }
        if ($preset !== 'custom') {
            $attributes = DynamicDataLayoutQueryHelper::applyQueryBuilderFilter($attributes, $preset);
        }
        $decorator->withAttributes($attributes);
        return $decorator->buildQuery($attributes);
    }

    protected function resolveWrapperClasses(PostLayoutDecorator $decorator, array $attributes): array
    {
        $classes = ['dynamic-data-layout-wrapper'];
        if (!empty($attributes['layout'])) {
            $classes[] = 'layout-' . sanitize_html_class($attributes['layout']);
            $classes[] = 'dynamic-data-layout--' . sanitize_html_class($attributes['layout']);
        }
        if (!empty($attributes['postType'])) {
            $classes[] = 'post-type-' . sanitize_html_class($attributes['postType']);
        }
        $layoutName = $attributes['layout'] ?? 'grid';
        if (in_array($layoutName, ['grid', 'card'], true)) {
            $columns = isset($attributes['columns']) ? max(1, min(6, (int) $attributes['columns'])) : 3;
            $columnsTablet = isset($attributes['columnsTablet']) ? max(1, min(4, (int) $attributes['columnsTablet'])) : 2;
            $columnsMobile = isset($attributes['columnsMobile']) ? max(1, min(2, (int) $attributes['columnsMobile'])) : 1;
            $classes[] = 'columns-' . $columns;
            $classes[] = 'columns-tablet-' . $columnsTablet;
            $classes[] = 'columns-mobile-' . $columnsMobile;
        }
        $layoutInstance = $decorator->getLayout();
        $generator = $layoutInstance->getContentGenerator();
        if ($generator instanceof ContentGeneratorInterface && method_exists($generator, 'appendClassesToWrapper')) {
            $generatorClasses = $generator->appendClassesToWrapper([], $attributes);
            if (is_array($generatorClasses)) {
                $classes = array_merge($classes, array_map('sanitize_html_class', $generatorClasses));
            }
        }
        return array_values(array_filter(array_unique($classes)));
    }

    protected function resolveWrapperStyles(array $attributes): string
    {
        $styles = [];
        $layoutName = $attributes['layout'] ?? 'grid';
        if (in_array($layoutName, ['grid', 'card'], true)) {
            $columns = isset($attributes['columns']) ? max(1, min(6, (int) $attributes['columns'])) : 3;
            $columnsTablet = isset($attributes['columnsTablet']) ? max(1, min(4, (int) $attributes['columnsTablet'])) : 2;
            $columnsMobile = isset($attributes['columnsMobile']) ? max(1, min(2, (int) $attributes['columnsMobile'])) : 1;
            $styles[] = sprintf('--columns-desktop: %d;', $columns);
            $styles[] = sprintf('--columns-tablet: %d;', $columnsTablet);
            $styles[] = sprintf('--columns-mobile: %d;', $columnsMobile);
        }
        return implode(' ', $styles);
    }
}
