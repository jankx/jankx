<?php

namespace Jankx\Layouts\DynamicDataLayout\Generators\Concerns;

use Jankx\Facades\Log;
use WP_Post;
use WP_Query;
use WP_Block;

trait PostTemplateRendererTrait
{
    protected function renderPosts(WP_Query $query, array $options, string $mode = 'list'): string
    {
        $output = [];
        $originalPost = $GLOBALS['post'] ?? null;

        $templateAttrs = $this->templateBlock['attrs'] ?? [];
        $itemInlineStyle = '';
        if (!empty($templateAttrs['style']) && is_array($templateAttrs['style']) && function_exists('wp_style_engine_get_styles')) {
            $styleConfig = $templateAttrs['style'];
            $styles = wp_style_engine_get_styles($styleConfig);
            if (!empty($styles['css'])) {
                $itemInlineStyle = trim($styles['css']);
            }
        }
        $styleAttr = $itemInlineStyle !== '' ? sprintf(' style="%s"', esc_attr($itemInlineStyle)) : '';
        $animationType = $templateAttrs['animationType'] ?? 'none';
        $animationDuration = $templateAttrs['animationDuration'] ?? 1000;
        $animationDelay = $templateAttrs['animationDelay'] ?? 0;
        $animationTarget = $templateAttrs['animationTarget'] ?? 'entry';
        $animationReverse = !empty($templateAttrs['animationReverse']);
        $hoverAnimation = $templateAttrs['hoverAnimation'] ?? 'none';
        $unhoverAnimation = $templateAttrs['unhoverAnimation'] ?? 'none';

        $hoverDataAttrs = '';
        if ($hoverAnimation !== 'none') {
            $hoverDataAttrs .= sprintf(' data-hover-ani="%s"', esc_attr($hoverAnimation));
        }
        if ($unhoverAnimation !== 'none') {
            $hoverDataAttrs .= sprintf(' data-unhover-ani="%s"', esc_attr($unhoverAnimation));
        }

        $itemIndex = 0;

        while ($query->have_posts()) {
            $query->the_post();
            $post = get_post();

            if (!$post instanceof WP_Post) {
                continue;
            }

            $itemContent = $this->renderTemplateForPost($post, $query, $options);
            if ($itemContent === '') {
                continue;
            }

            $classes = $this->buildItemClasses($post);
            $currentStyleAttr = $styleAttr;

            if ($animationType !== 'none') {
                $classes .= sprintf(' jankx-reveal jankx-reveal--%s jankx-reveal--target-%s', $animationType, $animationTarget);
                if ($animationReverse) {
                    $classes .= ' jankx-reveal--reverse';
                }

                $delay = $itemIndex * $animationDelay;
                $animationStyles = sprintf('--jankx-animation-duration: %dms; --jankx-animation-delay: %dms;', $animationDuration, $delay);

                if (empty($itemInlineStyle)) {
                    $currentStyleAttr = sprintf(' style="%s"', esc_attr($animationStyles));
                } else {
                    $currentStyleAttr = sprintf(' style="%s"', esc_attr(rtrim($itemInlineStyle, ';') . '; ' . $animationStyles));
                }
            }

            if ($mode === 'carousel') {
                $output[] = sprintf(
                    '<div class="embla__slide"><div class="%s"%s%s>%s</div></div>',
                    esc_attr($classes),
                    $currentStyleAttr,
                    $hoverDataAttrs,
                    $itemContent
                );
            } else {
                $output[] = sprintf('<div class="%s"%s%s>%s</div>', esc_attr($classes), $currentStyleAttr, $hoverDataAttrs, $itemContent);
            }
            $itemIndex++;
        }

        wp_reset_postdata();

        if ($originalPost instanceof WP_Post) {
            $GLOBALS['post'] = $originalPost;
        }

        return implode('', $output);
    }

    protected function renderCarousel(WP_Query $query, array $options): string
    {
        $slides = $this->renderPosts($query, $options, 'carousel');

        if ($slides === '') {
            return '';
        }

        $columns = max(1, (int) $this->getOption('columns', $options['columns'] ?? 3));
        $columnsTablet = max(1, (int) $this->getOption('columnsTablet', $options['columnsTablet'] ?? 2));
        $columnsMobile = max(1, (int) $this->getOption('columnsMobile', $options['columnsMobile'] ?? 1));
        $slidesToScroll = max(1, (int) $this->getOption('slidesToScroll', $options['slidesToScroll'] ?? 1));
        $loop = (bool) $this->getOption('loop', $options['loop'] ?? false);
        $autoplay = (bool) $this->getOption('autoplay', $options['autoplay'] ?? false);
        $autoplayDelay = max(1000, (int) $this->getOption('autoplayDelay', $options['autoplayDelay'] ?? 3000));
        $showArrows = (bool) $this->getOption('showArrows', $options['showArrows'] ?? true);
        $showDots = (bool) $this->getOption('showDots', $options['showDots'] ?? true);
        $peek = (float) $this->getOption('carouselPeek', $options['carouselPeek'] ?? 0);
        $effectiveColumns = $columns + ($peek / 100);

        $wrapperClasses = [
            'jankx-carousel',
            'post-type-layout-carousel',
            'is-product-collection-layout-carousel',
            'columns-' . $columns,
            'columns-tablet-' . $columnsTablet,
            'columns-mobile-' . $columnsMobile,
        ];

        $customWrapperClass = $this->getOption('itemsWrapperClass', $options['itemsWrapperClass'] ?? '');
        if (!empty($customWrapperClass)) {
            $wrapperClasses[] = sanitize_html_class($customWrapperClass);
        }

        $styleRules = [
            '--carousel-columns: ' . $effectiveColumns,
            '--carousel-columns-tablet: ' . $columnsTablet,
            '--carousel-columns-mobile: ' . $columnsMobile,
        ];



        $containerAttributes = $this->buildWrapperAttributes($options);
        $containerClasses = preg_split('/\s+/', (string) ($containerAttributes['class'] ?? ''));
        $containerClasses[] = 'jankx-carousel-container';
        $containerClasses[] = 'embla__container';
        $containerClasses = array_unique(array_filter(array_map('sanitize_html_class', $containerClasses)));

        $containerStyles = [];
        if (!empty($containerAttributes['style'])) {
            $containerStyles[] = $containerAttributes['style'];
        }

        $containerAttributes['class'] = implode(' ', $containerClasses);

        $wrapperClasses = array_unique(array_filter(array_map('sanitize_html_class', $wrapperClasses)));

        if (!empty($styleRules)) {
            $containerStyles[] = implode('; ', array_filter($styleRules));
        }

        if (!empty($containerStyles)) {
            $containerAttributes['style'] = implode('; ', $containerStyles);
        } else {
            unset($containerAttributes['style']);
        }

        $dataAttributes = [
            'data-embla-carousel' => '',
            'data-slides-per-view' => (string) $effectiveColumns,
            'data-peek-amount' => (string) $peek,
            'data-slides-to-scroll' => (string) $slidesToScroll,
        ];

        if ($loop) {
            $dataAttributes['data-loop'] = 'true';
        }

        if ($autoplay) {
            $dataAttributes['data-autoplay'] = 'true';
            $dataAttributes['data-autoplay-delay'] = (string) $autoplayDelay;
        }

        $attributes = [
            'class' => implode(' ', $wrapperClasses),
            'style' => implode('; ', array_filter($styleRules)),
        ];

        foreach ($dataAttributes as $name => $value) {
            $attributes[$name] = $value;
        }

        $attributes = apply_filters(
            'jankx/post-layout/carousel-attributes',
            $attributes,
            $options,
            $this->getLayout()
        );

        ob_start();
        ?>
        <div <?php echo $this->stringifyAttributes($attributes); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
            <div class="embla__viewport">
                <div <?php echo $this->stringifyAttributes($containerAttributes); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
                    <?php echo $slides; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
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

    protected function renderTemplateForPost(WP_Post $post, WP_Query $query, array $options): string
    {
        $context = $this->buildBlockContext($post, $query, $options);

        try {
            $innerBlocks = $this->templateBlock['innerBlocks'] ?? [];

            if (empty($innerBlocks)) {
                return '';
            }

            $output = '';
            foreach ($innerBlocks as $innerBlock) {
                $normalizedBlock = [
                    'blockName' => $innerBlock['blockName'] ?? '',
                    'attrs' => is_array($innerBlock['attrs'] ?? null) ? $innerBlock['attrs'] : [],
                    'innerBlocks' => is_array($innerBlock['innerBlocks'] ?? null) ? $innerBlock['innerBlocks'] : [],
                    'innerContent' => is_array($innerBlock['innerContent'] ?? null) ? $innerBlock['innerContent'] : [],
                ];

                if (!empty($innerBlock['originalContent'])) {
                    $normalizedBlock['originalContent'] = $innerBlock['originalContent'];
                }

                $blockInstance = new WP_Block($normalizedBlock, $context);
                $output .= $blockInstance->render();
            }

            $templateAttrs = $this->templateBlock['attrs'] ?? [];
            $loopLayout = $templateAttrs['templateLayout'] ?? 'default';

            if ($loopLayout === 'boxed') {
                return sprintf('<div class="card-body">%s</div>', $output);
            }

            return $output;
        } catch (\Throwable $exception) {
            Log::error(sprintf(
                'PostTemplateBlockGenerator: render error for post %d - %s',
                $post->ID,
                $exception->getMessage()
            ));
            return '';
        }
    }

    protected function buildBlockContext(WP_Post $post, WP_Query $query, array $options): array
    {
        $context = [
            'postType' => $post->post_type,
            'postId' => $post->ID,
            'queryId' => $this->getOption('queryId'),
        ];

        if ($post->post_type === 'product') {
            $context['productId'] = $post->ID;
        }

        if ($layout = $this->getOption('layout', $options['layout'] ?? null)) {
            $context['displayLayout'] = $layout;
        }

        if ($templateSlug = $this->getOption('templateSlug')) {
            $context['templateSlug'] = $templateSlug;
        }

        if ($previewType = $this->getOption('previewPostType')) {
            $context['previewPostType'] = $previewType;
        }

        $context['query'] = [
            'pages' => $query->max_num_pages,
            'perPage' => (int) $query->get('posts_per_page'),
            'offset' => (int) $query->get('offset'),
        ];

        return $context;
    }

    protected function buildItemClasses(WP_Post $post): string
    {
        $classes = get_post_class([], $post);
        array_unshift($classes, 'wp-block-post');

        $customItemClass = $this->getOption('itemClass');
        if (!empty($customItemClass)) {
            $classes[] = $customItemClass;
        }

        $templateAttrs = $this->templateBlock['attrs'] ?? [];
        if (!empty($templateAttrs['templateLayout'])) {
            $classes[] = 'content-loop-layout--' . sanitize_html_class($templateAttrs['templateLayout']);
            $classes[] = 'template-layout--' . sanitize_html_class($templateAttrs['templateLayout']);
        }

        $classes = array_unique(array_filter(array_map('sanitize_html_class', $classes)));

        return implode(' ', $classes);
    }

    protected function buildWrapperAttributes(array $options): array
    {
        $classes = [];
        $templateAttrs = $this->templateBlock['attrs'] ?? [];

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
        }

        if (!empty($templateAttrs['contentLayout'])) {
            $classes[] = 'post-layout--' . sanitize_html_class($templateAttrs['contentLayout']);
        }

        $layoutType = $this->getOption('layout', $options['layout'] ?? '');
        $columns = (int) $this->getOption('columns', $options['columns'] ?? 0);
        $columnsSupported = in_array($layoutType, ['grid', 'masonry', 'card'], true);

        if ($layoutType === 'grid') {
            $classes[] = 'is-flex-container';
            if ($columnsSupported && $columns > 0) {
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

        if (!empty($templateAttrs['style']) && function_exists('wp_style_engine_get_styles')) {
            $styles = wp_style_engine_get_styles($templateAttrs['style']);
            if (!empty($styles['css'])) {
                $attributes['style'] = isset($attributes['style'])
                    ? $attributes['style'] . '; ' . trim($styles['css'])
                    : trim($styles['css']);
            }
        }

        return $attributes;
    }



    protected function stringifyAttributes(array $attributes): string
    {
        $parts = [];
        foreach ($attributes as $name => $value) {
            if ($value === null || $value === '') {
                continue;
            }
            $parts[] = sprintf('%s="%s"', esc_attr($name), esc_attr($value));
        }

        return implode(' ', $parts);
    }
}
