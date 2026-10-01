<?php

namespace Jankx\Layouts\DynamicDataLayout;

/**
 * Renders the prev/next carousel buttons used by the dynamic-data-layout and
 * dynamic-term-layout blocks.
 *
 * The configuration comes from the jankx/carousel-arrows child block which the
 * parents merge into their attributes under the "carouselArrows" key. When no
 * child block is present the builder falls back to the default chevron buttons.
 */
class CarouselArrowsRenderer
{
    public const BLOCK_NAME = 'jankx/carousel-arrows';

    /**
     * Supported arrows positions.
     *
     * @var array<string,string>
     */
    protected static $positionClasses = [
        'inside' => '',
        'outside' => 'carousel-arrows-position-outside',
        'bottom' => 'carousel-arrows-position-bottom',
    ];

    /**
     * Render the prev/next buttons markup.
     *
     * @param array $arrows Carousel arrows settings (from the child block).
     * @param bool $parentShowArrows Fallback show/hide when the child block does
     *                               not define its own showArrows option.
     * @return string
     */
    public static function render(array $arrows, bool $parentShowArrows = true): string
    {
        $showArrows = isset($arrows['showArrows']) ? (bool) $arrows['showArrows'] : $parentShowArrows;
        if (!$showArrows) {
            return '';
        }

        $iconType = $arrows['navIconType'] ?? 'arrow';
        $iconSize = max(12, (int) ($arrows['navIconSize'] ?? 24));
        $iconColor = (string) ($arrows['navIconColor'] ?? '');
        $btnWidth = max(20, (int) ($arrows['navBtnWidth'] ?? 44));
        $btnHeight = max(20, (int) ($arrows['navBtnHeight'] ?? 44));
        $btnRadius = max(0, (int) ($arrows['navBtnBorderRadius'] ?? 50));
        $btnBg = (string) ($arrows['navBtnBgColor'] ?? '');

        $buttonStyle = [
            'width:' . $btnWidth . 'px',
            'height:' . $btnHeight . 'px',
            'border-radius:' . $btnRadius . '%',
        ];
        if ($btnBg !== '') {
            $buttonStyle[] = 'background-color:' . $btnBg;
        }
        $buttonStyleString = implode('; ', $buttonStyle);

        $alwaysShowArrows = !empty($arrows['alwaysShowArrows']);
        $prevStyleString = $buttonStyleString;
        if (!$alwaysShowArrows) {
            $prevStyleString .= '; display: none;';
        }

        $prevContent = self::buildIcon($iconType, 'prev', $arrows, $iconSize, $iconColor);
        $nextContent = self::buildIcon($iconType, 'next', $arrows, $iconSize, $iconColor);

        return sprintf(
            '<button class="embla__button embla__button--prev carousel-nav carousel-prev%7$s" type="button" aria-label="%1$s"%3$s>%5$s</button>'
            . '<button class="embla__button embla__button--next carousel-nav carousel-next" type="button" aria-label="%2$s"%4$s>%6$s</button>',
            esc_attr__('Previous slide', 'jankx'),
            esc_attr__('Next slide', 'jankx'),
            ' style="' . esc_attr($prevStyleString) . '"',
            ' style="' . esc_attr($buttonStyleString) . '"',
            $prevContent, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            $nextContent, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            $alwaysShowArrows ? '' : ' is-hidden'
        );
    }

    /**
     * Get the wrapper class for the configured arrows position.
     *
     * @param array $arrows Carousel arrows settings.
     * @return string
     */
    public static function positionClass(array $arrows): string
    {
        $position = (string) ($arrows['arrowsPosition'] ?? 'inside');

        return self::$positionClasses[$position] ?? '';
    }

    /**
     * Build the icon markup for one side (prev/next).
     *
     * @param string $type Icon type: arrow|image|svg|fonticon.
     * @param string $side prev|next.
     * @param array $arrows Carousel arrows settings.
     * @param int $size Icon size in pixels.
     * @param string $color Icon color.
     * @return string
     */
    protected static function buildIcon(string $type, string $side, array $arrows, int $size, string $color): string
    {
        $sizeStyle = 'width:' . $size . 'px;height:' . $size . 'px;';
        $colorStyle = $color !== '' ? 'color:' . $color . ';' : '';

        if ($type === 'image') {
            $imageUrl = (string) ($arrows[$side . 'IconImageUrl'] ?? '');
            if ($imageUrl === '') {
                $imageId = (int) ($arrows[$side . 'IconImageId'] ?? 0);
                if ($imageId > 0) {
                    $imageUrl = (string) wp_get_attachment_image_url($imageId, 'full');
                }
            }
            if ($imageUrl !== '') {
                return '<img src="' . esc_url($imageUrl) . '" alt="" aria-hidden="true" style="' . esc_attr($sizeStyle . 'object-fit:contain;display:block;') . '" />';
            }
        } elseif ($type === 'svg') {
            $svg = (string) ($arrows[$side . 'IconSvg'] ?? '');
            if ($svg !== '') {
                return '<span style="' . esc_attr($sizeStyle . 'display:flex;align-items:center;justify-content:center;' . $colorStyle) . '" aria-hidden="true">'
                    . self::sanitizeSvg($svg)
                    . '</span>';
            }
        } elseif ($type === 'fonticon') {
            $class = (string) ($arrows[$side . 'IconClass'] ?? '');
            if ($class !== '') {
                return '<span class="' . esc_attr($class) . '" style="' . esc_attr('font-size:' . $size . 'px;line-height:1;' . $colorStyle) . '" aria-hidden="true"></span>';
            }
        }

        // Default chevron arrow.
        $path = $side === 'prev' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6';

        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="' . esc_attr($sizeStyle . $colorStyle) . '">'
            . '<path d="' . esc_attr($path) . '" />'
            . '</svg>';
    }

    /**
     * Allow only a safe subset of SVG when injecting custom icons.
     *
     * @param string $svg Raw SVG markup.
     * @return string
     */
    protected static function sanitizeSvg(string $svg): string
    {
        $allowedTags = [
            'svg' => [
                'xmlns' => true,
                'viewbox' => true,
                'width' => true,
                'height' => true,
                'fill' => true,
                'stroke' => true,
                'stroke-width' => true,
                'stroke-linecap' => true,
                'stroke-linejoin' => true,
                'class' => true,
            ],
            'path' => [
                'd' => true,
                'fill' => true,
                'stroke' => true,
                'stroke-width' => true,
                'stroke-linecap' => true,
                'stroke-linejoin' => true,
            ],
            'circle' => ['cx' => true, 'cy' => true, 'r' => true, 'fill' => true],
            'rect' => ['x' => true, 'y' => true, 'width' => true, 'height' => true, 'rx' => true, 'ry' => true, 'fill' => true],
            'line' => ['x1' => true, 'y1' => true, 'x2' => true, 'y2' => true, 'stroke' => true, 'stroke-width' => true],
            'polyline' => ['points' => true, 'fill' => true, 'stroke' => true],
            'polygon' => ['points' => true, 'fill' => true, 'stroke' => true],
            'g' => ['fill' => true, 'stroke' => true],
        ];

        return wp_kses($svg, $allowedTags);
    }
}