<?php

namespace Jankx\Layouts\DynamicDataLayout\Generators;

use Jankx\Layouts\DynamicDataLayout\Generators\Concerns\PostTemplateRendererTrait;
use WP_Term;
use WP_Block;

/**
 * Content generator that renders a list of WP_Term objects through the
 * configured term template block.
 *
 * The template inner blocks use the standard post blocks for a familiar
 * editing experience, but the term context maps them as follows:
 *  - core/post-title        => term name (linked to the term archive)
 *  - core/post-excerpt      => term description
 *  - core/paragraph.jankx-term-count => number of posts in the term
 *
 * The wrapper classes keep the same naming as the post generator
 * (post-type-layout-*, columns-*, jankx-carousel) so the existing CSS
 * applies to term layouts without any changes.
 */
class TermTemplateBlockGenerator extends AbstractContentGenerator
{
    use PostTemplateRendererTrait;

    /** @var WP_Term|null Currently rendering term (for nested block context fallback) */
    protected static ?WP_Term $currentRenderingTerm = null;

    public static function getCurrentRenderingTerm(): ?WP_Term
    {
        return self::$currentRenderingTerm;
    }

    /** @var array */
    protected $templateBlock = [];

    /** @var array */
    protected $parentAttributes = [];

    /** @var array */
    protected $runtimeOptions = [];

    /** @var string */
    protected $currentLayout = '';

    public function __construct(array $templateBlock = [], array $parentAttributes = [])
    {
        $this->templateBlock = $templateBlock;
        $this->parentAttributes = $parentAttributes;
    }

    protected function renderContent($query, array $options = []): string
    {
        $this->runtimeOptions = $options;

        $terms = $this->normalizeTerms($query);
        if (empty($terms)) {
            $this->runtimeOptions = [];
            return '';
        }

        $layoutType = $this->getOption('layout', $options['layout'] ?? '');
        $this->currentLayout = $layoutType;

        if ($layoutType === 'carousel') {
            $html = $this->renderTermsCarousel($terms, $options);
            $this->runtimeOptions = [];
            $this->currentLayout = '';
            return $html;
        }

        $wrapperAttributes = $this->buildWrapperAttributes($options);
        $items = $this->renderTerms($terms, $options);

        $this->runtimeOptions = [];
        $this->currentLayout = '';

        if ($items === '') {
            return '';
        }

        return sprintf('<div %s>%s</div>', $this->stringifyAttributes($wrapperAttributes), $items);
    }

    protected function renderPreviewContent(array $options = []): array
    {
        return [
            'generator' => $this->getName(),
            'layout' => $this->getOption('layout', $options['layout'] ?? null),
            'columns' => $this->getOption('columns', $options['columns'] ?? null),
        ];
    }

    public function getName(): string
    {
        return 'term-template-block';
    }

    public function getTitle(): string
    {
        return __('Term Template Block Generator', 'jankx');
    }

    /**
     * Normalize the query passed by the layout into a list of WP_Term objects.
     *
     * @param mixed $query
     * @return WP_Term[]
     */
    protected function normalizeTerms($query): array
    {
        if (is_array($query)) {
            $terms = array_values(array_filter($query, static function ($item) {
                return $item instanceof WP_Term;
            }));
            return $terms;
        }

        if ($query instanceof \WP_Term_Query) {
            $terms = $query->get_terms();
            return is_wp_error($terms) ? [] : array_values((array) $terms);
        }

        return [];
    }

    /**
     * @param WP_Term[] $terms
     * @param array $options
     * @return string
     */
    protected function renderTerms(array $terms, array $options): string
    {
        $output = [];
        $templateAttrs = $this->getTemplateAttrs();
        $itemInlineStyle = $this->buildTemplateItemInlineStyle($templateAttrs);

        foreach ($terms as $term) {
            $itemContent = $this->renderTermItem($term, $terms, $options);
            if ($itemContent === '') {
                continue;
            }

            $classes = $this->buildItemClasses($term);
            $currentStyle = $itemInlineStyle;
            $bgStyle = $this->buildTermItemBackgroundStyle($templateAttrs, $term);
            if ($bgStyle !== '') {
                $currentStyle .= ($currentStyle !== '' ? '; ' : '') . $bgStyle;
            }
            $currentStyleAttr = $currentStyle !== '' ? sprintf(' style="%s"', esc_attr($currentStyle)) : '';
            $output[] = sprintf('<div class="%s"%s>%s</div>', esc_attr($classes), $currentStyleAttr, $itemContent);
        }

        return implode('', $output);
    }

    protected function buildTermItemBackgroundStyle(array $attrs, \WP_Term $term): string
    {
        $styles = [];
        $bgType = $attrs['itemBgType'] ?? 'none';

        if ($bgType === 'color' && !empty($attrs['itemBgColor'])) {
            $styles[] = 'background-color: ' . esc_attr($attrs['itemBgColor']);
        }

        if ($bgType === 'image') {
            $imageUrl = $attrs['itemBgImageUrl'] ?? '';
            if (($attrs['itemBgImageSource'] ?? 'custom') === 'featured') {
                $service = null;
                if (class_exists('\Jankx\Extensions\TaxonomyFeaturedImage\TaxonomyFeaturedImageExtension')) {
                    $ext = \Jankx\Extensions\TaxonomyFeaturedImage\TaxonomyFeaturedImageExtension::get_instance();
                    $service = $ext ? $ext->getService() : null;
                }
                if (!$service && class_exists('\Jankx\Extensions\TaxonomyFeaturedImage\Services\TaxonomyImageService')) {
                    $service = new \Jankx\Extensions\TaxonomyFeaturedImage\Services\TaxonomyImageService();
                }
                if ($service) {
                    $url = $service->getTermImageUrl($term, 'full');
                    if (!empty($url)) {
                        $imageUrl = $url;
                    }
                }
            }
            if ($imageUrl !== '') {
                $styles[] = 'background-image: url(' . esc_url($imageUrl) . ')';
            }
            $styles[] = 'background-size: ' . esc_attr($attrs['itemBgSize'] ?? 'cover');
            $styles[] = 'background-repeat: ' . esc_attr($attrs['itemBgRepeat'] ?? 'no-repeat');
            $styles[] = 'background-position: ' . esc_attr($attrs['itemBgPosition'] ?? 'center center');
            if (!empty($attrs['itemBgOverlay'])) {
                $styles[] = 'position: relative';
            }
        }

        return implode('; ', $styles);
    }

    /**
     * Render a single term through the template inner blocks.
     *
     * @param WP_Term $term
     * @param WP_Term[] $terms
     * @param array $options
     * @return string
     */
    protected function renderTermItem(WP_Term $term, array $terms, array $options): string
    {
        $innerBlocks = $this->getInnerBlocks();
        if (empty($innerBlocks)) {
            return $this->renderDefaultTermItem($term, $options);
        }

        // Set current term for nested block context fallback (e.g. jankx/term-featured-image inside columns/group)
        $prevTerm = self::$currentRenderingTerm;
        self::$currentRenderingTerm = $term;
        $filter = static function ($current) use ($term) {
            return $current instanceof WP_Term ? $current : $term;
        };
        add_filter('jankx/term-featured-image/current-term', $filter, 10, 1);

        $output = '';
        $context = $this->buildBlockContext($term, $terms, $options);

        foreach ($innerBlocks as $innerBlock) {
            $blockName = $innerBlock['blockName'] ?? '';
            $attrs = is_array($innerBlock['attrs'] ?? null) ? $innerBlock['attrs'] : [];

            $normalizedBlock = [
                'blockName' => $blockName,
                'attrs' => $attrs,
                'innerBlocks' => is_array($innerBlock['innerBlocks'] ?? null) ? $innerBlock['innerBlocks'] : [],
                'innerContent' => is_array($innerBlock['innerContent'] ?? null) ? $innerBlock['innerContent'] : [],
            ];

            if (!empty($innerBlock['originalContent'])) {
                $normalizedBlock['originalContent'] = $innerBlock['originalContent'];
            }

            if ($blockName === 'core/post-title' || ($blockName === 'core/heading' && $this->hasClass($attrs, 'jankx-term-name')) || ($blockName === 'core/paragraph' && $this->hasClass($attrs, 'jankx-term-name'))) {
                $output .= $this->renderTermTitle($term, $attrs);
                continue;
            }

            if ($blockName === 'core/post-excerpt' || ($blockName === 'core/paragraph' && $this->hasClass($attrs, 'jankx-term-description'))) {
                $output .= $this->renderTermDescription($term, $attrs);
                continue;
            }

            if ($blockName === 'core/paragraph' && $this->hasClass($attrs, 'jankx-term-count')) {
                $output .= $this->renderTermCount($term, $attrs);
                continue;
            }

            try {
                $blockInstance = new WP_Block($normalizedBlock, $context);
                $blockHtml = $blockInstance->render();
                $output .= apply_filters('render_block', $blockHtml, $normalizedBlock, $blockInstance);
            } catch (\Throwable $e) {
                continue;
            }
        }

        $result = $this->wrapTermItem($output, $this->getTemplateAttrs());
        remove_filter('jankx/term-featured-image/current-term', $filter, 10);
        self::$currentRenderingTerm = $prevTerm;

        return $result;
    }

    /**
     * Fallback term item used when the template has no inner blocks.
     *
     * @param WP_Term $term
     * @param array $options
     * @return string
     */
    protected function renderDefaultTermItem(WP_Term $term, array $options): string
    {
        $parts = [];

        $link = get_term_link($term);
        if (!is_wp_error($link)) {
            $parts[] = sprintf(
                '<h2 class="wp-block-post-title"><a href="%s">%s</a></h2>',
                esc_url($link),
                esc_html($term->name)
            );
        } else {
            $parts[] = sprintf('<h2 class="wp-block-post-title">%s</h2>', esc_html($term->name));
        }

        if (!empty($term->description)) {
            $description = $this->trimDescription($term->description);
            $parts[] = sprintf(
                '<div class="wp-block-post-excerpt"><p>%s</p></div>',
                wp_kses_post($description)
            );
        }

        if ($this->getOption('showTermCount', false) || empty($parts)) {
            $parts[] = sprintf('<p class="jankx-term-count">%d</p>', (int) $term->count);
        }

        $content = implode('', $parts);
        $templateAttrs = $this->getTemplateAttrs();
        if (($templateAttrs['templateLayout'] ?? '') === 'boxed') {
            return sprintf('<div class="card-body">%s</div>', $content);
        }

        return $content;
    }

    protected function renderTermTitle(WP_Term $term, array $attrs): string
    {
        $isLink = isset($attrs['isLink']) ? (bool) $attrs['isLink'] : true;
        $level = isset($attrs['level']) ? (int) $attrs['level'] : 2;
        $tag = in_array($level, range(1, 6), true) ? 'h' . $level : 'h2';

        $classes = ['wp-block-post-title', 'wp-block-heading'];
        if (!empty($attrs['className'])) {
            $classes[] = $attrs['className'];
        }
        $classAttr = implode(' ', array_filter(array_map('sanitize_html_class', $classes)));

        $link = get_term_link($term);
        if ($isLink && !is_wp_error($link)) {
            $titleHtml = sprintf('<a href="%s">%s</a>', esc_url($link), esc_html($term->name));
        } else {
            $titleHtml = esc_html($term->name);
        }

        return sprintf('<%s class="%s">%s</%s>', $tag, esc_attr($classAttr), $titleHtml, $tag);
    }

    protected function renderTermDescription(WP_Term $term, array $attrs): string
    {
        if (empty($term->description)) {
            return '';
        }

        $classes = ['wp-block-post-excerpt'];
        if (!empty($attrs['className'])) {
            $classes[] = $attrs['className'];
        }
        $classAttr = implode(' ', array_filter(array_map('sanitize_html_class', $classes)));

        return sprintf(
            '<div class="%s"><p>%s</p></div>',
            esc_attr($classAttr),
            wp_kses_post($this->trimDescription($term->description))
        );
    }

    protected function renderTermCount(WP_Term $term, array $attrs): string
    {
        $classes = ['jankx-term-count'];
        if (!empty($attrs['className'])) {
            $classes[] = $attrs['className'];
        }
        $classAttr = implode(' ', array_filter(array_map('sanitize_html_class', $classes)));

        return sprintf('<p class="%s">%d</p>', esc_attr($classAttr), (int) $term->count);
    }

    protected function wrapTermItem(string $output, array $attrs): string
    {
        $style = $this->buildTemplateItemInlineStyle($attrs);
        $classes = $this->buildTemplateItemClasses($attrs);

        if (empty($style) && empty($classes)) {
            return $output;
        }

        $styleAttr = !empty($style) ? sprintf(' style="%s"', esc_attr($style)) : '';
        $classAttr = !empty($classes) ? sprintf(' class="%s"', esc_attr($classes)) : '';

        return sprintf('<div%s%s>%s</div>', $classAttr, $styleAttr, $output);
    }

    protected function buildBlockContext(WP_Term $term, array $terms, array $options): array
    {
        $context = [
            'postType' => 'term',
            'postId' => 0,
            'termId' => $term->term_id,
            'taxonomy' => $term->taxonomy,
            'queryId' => $this->getOption('queryId'),
        ];

        if ($layout = $this->getOption('layout', $options['layout'] ?? null)) {
            $context['displayLayout'] = $layout;
        }

        return $context;
    }

    protected function buildItemClasses(WP_Term $term): string
    {
        $classes = [
            'term-item',
            'dynamic-data-template__item',
            'taxonomy-' . sanitize_html_class($term->taxonomy),
        ];

        $customItemClass = $this->getOption('itemClass');
        if (!empty($customItemClass)) {
            $classes[] = $customItemClass;
        }

        $templateAttrs = $this->getTemplateAttrs();
        if (!empty($templateAttrs['templateLayout'])) {
            $classes[] = 'content-loop-layout--' . sanitize_html_class($templateAttrs['templateLayout']);
            $classes[] = 'template-layout--' . sanitize_html_class($templateAttrs['templateLayout']);
        }

        return implode(' ', array_unique(array_filter(array_map('sanitize_html_class', $classes))));
    }

    /**
     * Build wrapper attributes for the term loop.
     *
     * Keeps the post-type-layout-* / columns-* class naming so the existing
     * layout CSS (grid/card/list/masonry) applies as-is.
     *
     * @param array $options
     * @return array
     */
    protected function buildWrapperAttributes(array $options): array
    {
        $classes = [];
        $templateAttrs = $this->getTemplateAttrs();

        if (!empty($templateAttrs['className'])) {
            $custom = preg_split('/\s+/', $templateAttrs['className']);
            $custom = array_filter(array_map('sanitize_html_class', (array) $custom));
            $classes = array_merge($classes, $custom);
        }

        if (!empty($templateAttrs['align'])) {
            $classes[] = 'align' . sanitize_html_class($templateAttrs['align']);
        }

        $wrapperLayout = $this->getOption('layout', $options['layout'] ?? '');
        if (!empty($wrapperLayout)) {
            $classes[] = 'post-type-layout-' . sanitize_html_class($wrapperLayout);
            $classes[] = 'term-layout-' . sanitize_html_class($wrapperLayout);
        }

        $layoutType = $wrapperLayout;
        $columns = (int) $this->getOption('columns', $options['columns'] ?? 0);
        $columnsSupported = in_array($layoutType, ['grid', 'masonry', 'card'], true);

        if ($layoutType === 'grid') {
            $classes[] = 'is-flex-container';
            if ($columns > 0) {
                $classes[] = 'columns-' . $columns;
            }
        }

        $styleRules = [];
        if ($columnsSupported) {
            if ($columns > 0) {
                $classes[] = 'columns-' . $columns;
                $styleRules[] = '--columns-desktop: ' . $columns;
            }
            if ($tablet = (int) $this->getOption('columnsTablet', $options['columnsTablet'] ?? 0)) {
                $classes[] = 'columns-tablet-' . $tablet;
                $styleRules[] = '--columns-tablet: ' . $tablet;
            }
            if ($mobile = (int) $this->getOption('columnsMobile', $options['columnsMobile'] ?? 0)) {
                $classes[] = 'columns-mobile-' . $mobile;
                $styleRules[] = '--columns-mobile: ' . $mobile;
            }
        }

        $customWrapperClass = $this->getOption('itemsWrapperClass', $options['itemsWrapperClass'] ?? '');
        if (!empty($customWrapperClass)) {
            $classes[] = sanitize_html_class($customWrapperClass);
        }

        $classes = array_unique(array_filter($classes));

        $attributes = [
            'class' => implode(' ', $classes),
        ];

        if (!empty($styleRules)) {
            $attributes['style'] = implode('; ', $styleRules);
        }

        return $attributes;
    }

    /**
     * Render terms inside the carousel markup (mirrors the post generator).
     *
     * @param WP_Term[] $terms
     * @param array $options
     * @return string
     */
    protected function renderTermsCarousel(array $terms, array $options): string
    {
        $slides = [];
        $templateAttrs = $this->getTemplateAttrs();
        $itemInlineStyle = $this->buildTemplateItemInlineStyle($templateAttrs);
        foreach ($terms as $term) {
            $itemContent = $this->renderTermItem($term, $terms, $options);
            if ($itemContent === '') {
                continue;
            }
            $classes = $this->buildItemClasses($term);
            $currentStyle = $itemInlineStyle;
            $bgStyle = $this->buildTermItemBackgroundStyle($templateAttrs, $term);
            if ($bgStyle !== '') {
                $currentStyle .= ($currentStyle !== '' ? '; ' : '') . $bgStyle;
            }
            $styleAttr = $currentStyle !== '' ? sprintf(' style="%s"', esc_attr($currentStyle)) : '';
            $slides[] = sprintf(
                '<div class="embla__slide"><div class="%s"%s>%s</div></div>',
                esc_attr($classes),
                $styleAttr,
                $itemContent
            );
        }

        if (empty($slides)) {
            return '';
        }

        $columns = max(1, (int) $this->getOption('columns', $options['columns'] ?? 3));
        $columnsTablet = max(1, (int) $this->getOption('columnsTablet', $options['columnsTablet'] ?? 2));
        $columnsMobile = max(1, (int) $this->getOption('columnsMobile', $options['columnsMobile'] ?? 1));
        $loop = (bool) $this->getOption('loop', $options['loop'] ?? false);
        $autoplay = (bool) $this->getOption('autoplay', $options['autoplay'] ?? false);
        $autoplayDelay = max(1000, (int) $this->getOption('autoplayDelay', $options['autoplayDelay'] ?? 3000));
        $showArrows = (bool) $this->getOption('showArrows', $options['showArrows'] ?? true);
        $showDots = (bool) $this->getOption('showDots', $options['showDots'] ?? true);
        $peek = (float) $this->getOption('carouselPeek', $options['carouselPeek'] ?? 0);
        $effectiveColumns = max(0.1, $columns + ($peek / 100));

        $wrapperClasses = [
            'jankx-carousel',
            'post-type-layout-carousel',
            'columns-' . $columns,
            'columns-tablet-' . $columnsTablet,
            'columns-mobile-' . $columnsMobile,
        ];

        $styleRules = [
            '--carousel-columns: ' . $effectiveColumns,
            '--carousel-columns-tablet: ' . $columnsTablet,
            '--carousel-columns-mobile: ' . $columnsMobile,
        ];

        $dataAttributes = [
            'data-embla-carousel' => '',
            'data-slides-per-view' => (string) $effectiveColumns,
            'data-peek-amount' => (string) $peek,
        ];

        if ($loop) {
            $dataAttributes['data-loop'] = 'true';
        }

        if ($autoplay) {
            $dataAttributes['data-autoplay'] = 'true';
            $dataAttributes['data-autoplay-delay'] = (string) $autoplayDelay;
        }

        $attributes = [
            'class' => implode(' ', array_filter($wrapperClasses)),
            'style' => implode('; ', array_filter($styleRules)),
        ];

        foreach ($dataAttributes as $name => $value) {
            $attributes[$name] = $value;
        }

        $containerAttributes = [
            'class' => implode(' ', [
                'jankx-carousel-container',
                'embla__container',
            ]),
        ];

        ob_start();
        ?>
        <div <?php echo $this->stringifyAttributes($attributes); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
            <div class="embla__viewport">
                <div <?php echo $this->stringifyAttributes($containerAttributes); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
                    <?php echo implode('', $slides); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                </div>
            </div>

            <?php if ($showArrows): ?>
                <button class="embla__button embla__button--prev" type="button"
                    aria-label="<?php esc_attr_e('Previous slide', 'jankx'); ?>">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <button class="embla__button embla__button--next" type="button"
                    aria-label="<?php esc_attr_e('Next slide', 'jankx'); ?>">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            <?php endif; ?>

            <?php if ($showDots): ?>
                <div class="embla__dots"></div>
            <?php endif; ?>
        </div>
        <?php
        $html = ob_get_clean();

        return is_string($html) ? $html : '';
    }

    protected function getInnerBlocks(): array
    {
        if (!empty($this->templateBlock['innerBlocks']) && is_array($this->templateBlock['innerBlocks'])) {
            return $this->templateBlock['innerBlocks'];
        }

        $templateFromOptions = $this->getOption('postTemplate');
        if (is_array($templateFromOptions) && !empty($templateFromOptions['innerBlocks'])) {
            return $templateFromOptions['innerBlocks'];
        }

        return [];
    }

    protected function getTemplateAttrs(): array
    {
        $attrs = $this->templateBlock['attrs'] ?? [];
        $templateFromOptions = $this->getOption('postTemplate');
        if (is_array($templateFromOptions) && !empty($templateFromOptions['attrs'])) {
            $attrs = array_merge($attrs, $templateFromOptions['attrs']);
        }
        return $attrs;
    }

    protected function hasClass(array $attrs, string $needle): bool
    {
        $className = $attrs['className'] ?? '';
        if (!is_string($className) || $className === '') {
            return false;
        }
        $classes = preg_split('/\s+/', $className);
        return in_array($needle, $classes, true);
    }

    protected function trimDescription(string $description): string
    {
        $excerptLength = (int) $this->getOption('excerptLength', 55);
        if ($excerptLength <= 0) {
            return $description;
        }
        return wp_trim_words($description, $excerptLength, '&hellip;');
    }

    /**
     * Build inline styles for template item from block attributes
     *
     * @param array $attrs Block attributes
     * @return string Inline CSS styles
     */
    protected function buildTemplateItemInlineStyle(array $attrs): string
    {
        if (empty($attrs['style']) || !is_array($attrs['style']) || !function_exists('wp_style_engine_get_styles')) {
            return '';
        }

        $styleConfig = [];

        if (!empty($attrs['style']['spacing']) && is_array($attrs['style']['spacing'])) {
            $styleConfig['spacing'] = $attrs['style']['spacing'];
        }

        if (!empty($attrs['style']['color']) && is_array($attrs['style']['color'])) {
            $styleConfig['color'] = $attrs['style']['color'];
        }

        if (!empty($attrs['style']['typography']) && is_array($attrs['style']['typography'])) {
            $styleConfig['typography'] = $attrs['style']['typography'];
        }

        if (!empty($attrs['style']['border']) && is_array($attrs['style']['border'])) {
            $styleConfig['border'] = $attrs['style']['border'];
        }

        if (empty($styleConfig)) {
            return '';
        }

        $generatedStyles = wp_style_engine_get_styles($styleConfig);
        return !empty($generatedStyles['css']) ? trim($generatedStyles['css']) : '';
    }

    /**
     * Build CSS classes for template item from block attributes
     *
     * @param array $attrs Block attributes
     * @return string CSS classes
     */
    protected function buildTemplateItemClasses(array $attrs): string
    {
        $classes = [];

        if (!empty($attrs['className'])) {
            $customClasses = preg_split('/\s+/', $attrs['className']);
            $customClasses = array_filter(array_map('sanitize_html_class', (array) $customClasses));
            $classes = array_merge($classes, $customClasses);
        }

        if (!empty($attrs['backgroundColor'])) {
            $classes[] = 'has-' . sanitize_html_class($attrs['backgroundColor']) . '-background-color';
            $classes[] = 'has-background';
        }

        if (!empty($attrs['textColor'])) {
            $classes[] = 'has-' . sanitize_html_class($attrs['textColor']) . '-color';
            $classes[] = 'has-text-color';
        }

        if (!empty($attrs['gradient'])) {
            $classes[] = 'has-' . sanitize_html_class($attrs['gradient']) . '-gradient-background';
            $classes[] = 'has-background';
        }

        if (!empty($attrs['fontSize'])) {
            $classes[] = 'has-' . sanitize_html_class($attrs['fontSize']) . '-font-size';
        }

        return implode(' ', array_unique(array_filter($classes)));
    }

    protected function getOption(string $key, $default = null)
    {
        if (array_key_exists($key, $this->runtimeOptions)) {
            return $this->runtimeOptions[$key];
        }

        if (array_key_exists($key, $this->parentAttributes)) {
            return $this->parentAttributes[$key];
        }

        $layout = $this->getLayout();
        if ($layout) {
            $options = $layout->getOptions();
            if (array_key_exists($key, $options)) {
                return $options[$key];
            }
        }

        return $default;
    }
}
