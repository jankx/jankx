<?php

namespace Jankx\Layouts\PostLayout\Supports;

use WP_Query;

/**
 * Build carousel markup (wrapper, navigation, dots) for layouts and generators.
 */
class CarouselHtmlBuilder
{
    /**
     * Render carousel HTML using slide markup.
     *
     * @param string $slidesHtml
     * @param array $options
     * @return string
     */
    public static function render(string $slidesHtml, array $options): string
    {
        if ($slidesHtml === '') {
            return '';
        }

        $options = self::normalizeOptions($options);

        $wrapperClasses = self::buildWrapperClasses($options);
        $wrapperStyle = self::buildWrapperStyle($options);
        $dataAttributes = self::buildDataAttributes($options);

        ob_start();
        ?>
        <div class="<?php echo esc_attr(implode(' ', $wrapperClasses)); ?>" style="<?php echo esc_attr($wrapperStyle); ?>" <?php echo self::stringifyDataAttributes($dataAttributes); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
            <div class="embla__viewport">
                <div class="embla__container">
                    <?php echo $slidesHtml; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                </div>
            </div>

            <?php if ($options['showArrows']) : ?>
                <?php self::renderArrows($options); ?>
            <?php endif; ?>

            <?php if ($options['showDots']) : ?>
                <div class="embla__dots"></div>
            <?php endif; ?>
        </div>
        <?php
        $html = ob_get_clean();

        return is_string($html) ? $html : '';
    }

    /**
     * Render carousel from WP_Query using callback to generate item HTML.
     *
     * @param WP_Query $query
     * @param callable $renderItem
     * @param array $options
     * @return string
     */
    public static function renderFromQuery(WP_Query $query, callable $renderItem, array $options): string
    {
        if (!$query->have_posts()) {
            return '';
        }

        $slidesHtml = self::captureSlides($query, $renderItem);

        return self::render($slidesHtml, $options);
    }

    protected static function captureSlides(WP_Query $query, callable $renderItem): string
    {
        ob_start();
        while ($query->have_posts()) {
            $query->the_post();
            echo '<div class="embla__slide">';
            echo $renderItem(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            echo '</div>';
        }
        wp_reset_postdata();

        $html = ob_get_clean();

        return is_string($html) ? $html : '';
    }

    protected static function normalizeOptions(array $options): array
    {
        return [
            'columns' => max(1, (int)($options['columns'] ?? 3)),
            'columnsTablet' => max(1, (int)($options['columnsTablet'] ?? 2)),
            'columnsMobile' => max(1, (int)($options['columnsMobile'] ?? 1)),
            'slidesToScroll' => max(1, (int)($options['slidesToScroll'] ?? 1)),
            'loop' => !empty($options['loop']),
            'autoplay' => !empty($options['autoplay']),
            'autoplayDelay' => max(1000, (int)($options['autoplayDelay'] ?? 3000)),
            'showArrows' => array_key_exists('showArrows', $options) ? (bool)$options['showArrows'] : true,
            'showDots' => array_key_exists('showDots', $options) ? (bool)$options['showDots'] : true,
            'itemsWrapperClass' => sanitize_html_class($options['itemsWrapperClass'] ?? ''),
            'customWrapperClass' => sanitize_html_class($options['customWrapperClass'] ?? ''),
            'imageRatio' => $options['imageRatio'] ?? '',
        ];
    }

    protected static function buildWrapperClasses(array $options): array
    {
        $classes = [
            'post-type-layout-carousel',
            'columns-' . $options['columns'],
            'columns-tablet-' . $options['columnsTablet'],
            'columns-mobile-' . $options['columnsMobile'],
        ];

        if ($options['customWrapperClass'] !== '') {
            $classes[] = $options['customWrapperClass'];
        }

        if ($options['itemsWrapperClass'] !== '') {
            $classes[] = $options['itemsWrapperClass'];
        }

        if ($options['imageRatio'] !== '') {
            $classes[] = 'has-image-ratio';
        }

        return array_values(array_unique(array_filter(array_map('sanitize_html_class', $classes))));
    }

    protected static function buildWrapperStyle(array $options): string
    {
        $styles = [
            '--carousel-columns:' . $options['columns'],
            '--carousel-columns-tablet:' . $options['columnsTablet'],
            '--carousel-columns-mobile:' . $options['columnsMobile'],
        ];

        if ($options['imageRatio'] !== '') {
            $styles[] = '--jankx-image-ratio:' . $options['imageRatio'];
        }

        return implode('; ', $styles);
    }

    protected static function buildDataAttributes(array $options): array
    {
        $attrs = [
            'data-embla-carousel' => '',
            'data-slides-per-view' => $options['columns'],
            'data-slides-to-scroll' => $options['slidesToScroll'],
        ];

        if ($options['loop']) {
            $attrs['data-loop'] = 'true';
        }

        if ($options['autoplay']) {
            $attrs['data-autoplay'] = 'true';
            $attrs['data-autoplay-delay'] = $options['autoplayDelay'];
        }

        return $attrs;
    }

    protected static function stringifyDataAttributes(array $attributes): string
    {
        $parts = [];
        foreach ($attributes as $key => $value) {
            if ($value === '') {
                $parts[] = sprintf('%s=""', esc_attr($key));
                continue;
            }

            $parts[] = sprintf('%s="%s"', esc_attr($key), esc_attr((string)$value));
        }

        return implode(' ', $parts);
    }

    protected static function renderArrows(array $options): void
    {
        ?>
        <button class="embla__button embla__button--prev" type="button" aria-label="<?php esc_attr_e('Previous slide', 'jankx'); ?>">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 18l-6-6 6-6"/>
            </svg>
        </button>
        <button class="embla__button embla__button--next" type="button" aria-label="<?php esc_attr_e('Next slide', 'jankx'); ?>">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"/>
            </svg>
        </button>
        <?php
    }
}

