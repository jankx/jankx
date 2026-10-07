<?php

namespace Jankx\Layouts\DynamicDataLayout;

/**
 * Renders the item background image as a real <img> element.
 *
 * Items with `itemBgType: image` historically painted their image through an
 * inline `background-image` style. Background images are invisible to the
 * browser's preload scanner, so the LCP element was discovered late, could not
 * get `fetchpriority`, and every slide's image was downloaded eagerly (they
 * are offscreen inside a carousel track, yet backgrounds ignore
 * `loading="lazy"`).
 *
 * Rendering an absolutely positioned <img> instead:
 * - lets the scanner discover the LCP image with the HTML
 * - allows `fetchpriority="high"` on the first item and `loading="lazy"` on
 *   the rest
 * - provides srcset/width/height so responsive-image audits can pass
 */
final class BackgroundImageRenderer
{
    /**
     * Resolve an attachment ID for an upload URL (static-cached per request).
     *
     * @var array<string, int>
     */
    private static $attachmentIdCache = [];

    /**
     * Build the <img> markup for an item background.
     *
     * @param array  $attrs     Block attributes (itemBgSize/itemBgPosition/...).
     * @param string $imageUrl  Resolved background image URL.
     * @param int    $itemIndex Zero-based index of the item in the loop.
     */
    public static function build(array $attrs, string $imageUrl, int $itemIndex): string
    {
        if ($imageUrl === '') {
            return '';
        }

        $attachmentId = self::attachmentId($imageUrl);
        $width = 0;
        $height = 0;
        $srcset = '';

        if ($attachmentId) {
            $meta = wp_get_attachment_metadata($attachmentId);
            $width = (int) ($meta['width'] ?? 0);
            $height = (int) ($meta['height'] ?? 0);
            $srcset = wp_get_attachment_image_srcset($attachmentId, 'large') ?: '';
        }

        if ((!$width || !$height) && self::isLocalUrl($imageUrl)) {
            $imageSize = wp_getimagesize(self::localPath($imageUrl));
            if (is_array($imageSize)) {
                $width = (int) ($imageSize[0] ?? 0);
                $height = (int) ($imageSize[1] ?? 0);
            }
        }

        $fit = $attrs['itemBgSize'] ?? 'cover';
        if (!in_array($fit, ['cover', 'contain'], true)) {
            $fit = 'cover';
        }

        $position = $attrs['itemBgPosition'] ?? 'center center';
        if (is_array($position)) {
            $position = (($position['x'] ?? 0.5) * 100) . '% ' . (($position['y'] ?? 0.5) * 100) . '%';
        }

        $isFirst = $itemIndex === 0;
        $imgStyle = 'object-fit: ' . $fit . '; object-position: ' . $position;

        $html = sprintf(
            '<img class="dynamic-data-template__bg" src="%s" alt="" aria-hidden="true" decoding="async" loading="%s" style="%s"',
            esc_url($imageUrl),
            $isFirst ? 'eager' : 'lazy',
            esc_attr($imgStyle)
        );

        if ($isFirst) {
            $html .= ' fetchpriority="high"';
        }

        if ($width && $height) {
            $html .= sprintf(' width="%d" height="%d"', $width, $height);
        }

        if ($srcset !== '') {
            $html .= sprintf(
                ' srcset="%s" sizes="%s"',
                esc_attr($srcset),
                esc_attr('(max-width: 600px) 92vw, (max-width: 1200px) 45vw, 16vw')
            );
        }

        return $html . ' />';
    }

    /**
     * Solid-color tint rendered above the background image when
     * `itemBgOverlay` is set (the inline background previously composited a
     * gradient layer over the image).
     */
    public static function buildTint(array $attrs): string
    {
        $overlay = $attrs['itemBgOverlay'] ?? '';
        if (empty($overlay)) {
            return '';
        }

        return sprintf(
            '<span class="dynamic-data-template__bg-tint" aria-hidden="true" style="position: absolute; inset: 0; z-index: 1; background-color: %s;"></span>',
            esc_attr($overlay)
        );
    }

    private static function attachmentId(string $imageUrl): int
    {
        if (isset(self::$attachmentIdCache[$imageUrl])) {
            return self::$attachmentIdCache[$imageUrl];
        }

        $id = 0;
        if (self::isLocalUrl($imageUrl)) {
            $id = (int) attachment_url_to_postid($imageUrl);
        }

        return self::$attachmentIdCache[$imageUrl] = $id;
    }

    private static function isLocalUrl(string $imageUrl): bool
    {
        $uploads = wp_get_upload_dir();
        if (!empty($uploads['baseurl']) && strpos($imageUrl, $uploads['baseurl']) === 0) {
            return true;
        }

        return strpos($imageUrl, content_url()) === 0;
    }

    private static function localPath(string $imageUrl): string
    {
        $uploads = wp_get_upload_dir();
        if (!empty($uploads['baseurl']) && strpos($imageUrl, $uploads['baseurl']) === 0) {
            return trailingslashit($uploads['basedir']) . ltrim(substr($imageUrl, strlen($uploads['baseurl'])), '/');
        }

        return str_replace(content_url(), WP_CONTENT_DIR, $imageUrl);
    }
}
