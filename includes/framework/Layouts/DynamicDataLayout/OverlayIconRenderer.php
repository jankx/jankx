<?php

namespace Jankx\Layouts\DynamicDataLayout;

/**
 * Shared renderer for the content loop overlay icon.
 *
 * The icon can be anchored to three different places inside a loop item, which
 * is what the `overlayIconTarget` attribute selects:
 *
 * - `featured-image`  wrap the featured image block, so the icon sits on the
 *                     image only. This is the historical behaviour and the
 *                     default, so existing content keeps rendering unchanged.
 * - `entry-image`     anchor to the item's own image, rendered at item level
 *                     and only when the entry actually has one.
 * - `entire-item`     anchor to the whole item, regardless of whether the
 *                     entry has an image.
 *
 * Every path returns the `jankx-thumbnail-overlay-wrapper` class alongside the
 * target specific one, so the position/visibility rules in style.scss apply
 * without a second copy of that CSS.
 */
final class OverlayIconRenderer
{
    public const TARGET_FEATURED_IMAGE = 'featured-image';
    public const TARGET_ENTRY_IMAGE    = 'entry-image';
    public const TARGET_ENTIRE_ITEM    = 'entire-item';

    private const TARGETS = [
        self::TARGET_FEATURED_IMAGE,
        self::TARGET_ENTRY_IMAGE,
        self::TARGET_ENTIRE_ITEM,
    ];

    /**
     * Read and validate the target, falling back to the default.
     */
    public static function resolveTarget(array $attrs): string
    {
        $target = $attrs['overlayIconTarget'] ?? self::TARGET_FEATURED_IMAGE;
        if (!is_string($target) || !in_array($target, self::TARGETS, true)) {
            return self::TARGET_FEATURED_IMAGE;
        }

        return $target;
    }

    /**
     * Whether an icon is configured at all, for any type.
     */
    public static function hasIcon(array $attrs): bool
    {
        $icon = $attrs['overlayIcon'] ?? '';
        $image = $attrs['overlayIconImageUrl'] ?? '';
        $text = $attrs['overlayIconText'] ?? '';

        return $icon !== '' || $image !== '' || $text !== '';
    }

    /**
     * Whether the configured icon actually has something to show.
     *
     * `always-show` with an empty icon type is the case the editor guards
     * against before rendering its preview, so mirror that here.
     */
    public static function isRenderable(array $attrs): bool
    {
        if (!self::hasIcon($attrs)) {
            return false;
        }

        $type = $attrs['overlayIconType'] ?? 'class';

        if ($type === 'image') {
            return ($attrs['overlayIconImageUrl'] ?? '') !== '';
        }

        if ($type === 'text') {
            return ($attrs['overlayIconText'] ?? '') !== '';
        }

        return ($attrs['overlayIcon'] ?? '') !== '';
    }

    /**
     * Build the icon element itself (no positioning wrapper).
     */
    public static function buildIconHtml(array $attrs): string
    {
        $type = $attrs['overlayIconType'] ?? 'class';
        $icon = $attrs['overlayIcon'] ?? '';
        $image = $attrs['overlayIconImageUrl'] ?? '';
        $text = $attrs['overlayIconText'] ?? '';
        $rotate = isset($attrs['overlayIconRotate']) ? (int) $attrs['overlayIconRotate'] : 0;
        $color = $attrs['overlayIconColor'] ?? '#ffffff';
        $bg = $attrs['overlayIconBackground'] ?? 'rgba(0, 0, 0, 0.5)';
        $size = isset($attrs['overlayIconSize']) ? (int) $attrs['overlayIconSize'] : 24;

        $commonStyle = sprintf(
            'style="color:%s;background:%s;font-size:%dpx;"',
            esc_attr($color),
            esc_attr($bg),
            $size
        );
        $rotateStyle = $rotate !== 0 ? sprintf(' style="transform: rotate(%ddeg);"', $rotate) : '';

        if ($type === 'image' && $image !== '') {
            return sprintf(
                '<div class="jankx-overlay-icon" %s><img src="%s" alt="" style="width:%dpx;height:%dpx;object-fit:contain;" /></div>',
                $commonStyle,
                esc_url($image),
                $size,
                $size
            );
        }

        if ($type === 'text' && $text !== '') {
            return sprintf(
                '<div class="jankx-overlay-icon" %s><span class="jankx-overlay-icon-text"%s>%s</span></div>',
                $commonStyle,
                $rotateStyle,
                esc_html($text)
            );
        }

        return sprintf(
            '<div class="jankx-overlay-icon" %s><i class="%s"%s></i></div>',
            $commonStyle,
            esc_attr($icon),
            $rotateStyle
        );
    }

    /**
     * Wrap a block's markup so the icon positions itself against that block.
     *
     * Used for the `featured-image` target, where the anchor is the image block
     * rather than the item.
     */
    public static function wrapWithIcon(string $html, array $attrs): string
    {
        if (!self::isRenderable($attrs)) {
            return $html;
        }

        $classes = self::wrapperClasses($attrs);

        return sprintf('<div class="%s">%s%s</div>', esc_attr($classes), $html, self::buildIconHtml($attrs));
    }

    /**
     * Build the item level overlay for the non featured-image targets.
     *
     * @param array $attrs    Template attributes.
     * @param bool  $hasMedia Whether the entry has an image to sit on.
     * @return string Empty string when the icon should not be rendered.
     */
    public static function buildItemOverlayHtml(array $attrs, bool $hasMedia): string
    {
        $target = self::resolveTarget($attrs);

        if ($target === self::TARGET_FEATURED_IMAGE) {
            return '';
        }

        if (!self::isRenderable($attrs)) {
            return '';
        }

        if ($target === self::TARGET_ENTRY_IMAGE && !$hasMedia) {
            return '';
        }

        return sprintf(
            '<div class="%s">%s</div>',
            esc_attr(self::wrapperClasses($attrs)),
            self::buildIconHtml($attrs)
        );
    }

    /**
     * Classes shared by every overlay wrapper, plus the target modifier.
     */
    private static function wrapperClasses(array $attrs): string
    {
        $mode = $attrs['overlayIconShowMode'] ?? ($attrs['overlayIconMode'] ?? 'always-show');
        $position = $attrs['overlayIconPosition'] ?? 'center';
        $target = self::resolveTarget($attrs);

        return implode(' ', [
            'jankx-thumbnail-overlay-wrapper',
            'jankx-overlay-target-' . sanitize_html_class($target),
            'overlay-mode-' . sanitize_html_class($mode),
            'overlay-pos-' . sanitize_html_class($position),
        ]);
    }
}
