<?php

namespace Jankx\Features\Gallery;

use Jankx\Support\Providers\ServiceProvider;
use Jankx\Foundation\Application;

class GalleryServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
    }

    public function boot(Application $app)
    {
        add_action('init', [$this, 'registerBlocks']);
    }

    public function registerBlocks()
    {
        register_block_type(__DIR__ . '/blocks/gallery-detail');
    }

    public static function getGallery(int $post_id, string $imageSize = 'large', string $thumbSize = 'thumbnail'): array
    {
        if (!$post_id) {
            return [];
        }
        $featured_id = get_post_thumbnail_id($post_id);
        $gallery_ids = [];
        $gallery = get_post_gallery($post_id, false);
        if (is_array($gallery) && !empty($gallery['ids'])) {
            $gallery_ids = array_map('intval', explode(',', $gallery['ids']));
        }
        if (empty($gallery_ids)) {
            $attachments = get_children([
                'post_parent' => $post_id,
                'post_type' => 'attachment',
                'post_mime_type' => 'image',
                'orderby' => 'menu_order',
                'order' => 'ASC',
            ]);
            foreach ($attachments as $att) {
                $gallery_ids[] = (int)$att->ID;
            }
        }
        if ($featured_id && !in_array($featured_id, $gallery_ids, true)) {
            array_unshift($gallery_ids, $featured_id);
        }
        $images = [];
        foreach ($gallery_ids as $id) {
            $url = wp_get_attachment_image_url($id, $imageSize);
            if (!$url) {
                continue;
            }
            $srcset = wp_get_attachment_image_srcset($id, $imageSize) ?: '';
            $sizes = wp_get_attachment_image_sizes($id, $imageSize) ?: '';
            $thumb = wp_get_attachment_image_url($id, $thumbSize) ?: $url;
            $alt = get_post_meta($id, '_wp_attachment_image_alt', true);
            $images[] = [
                'id' => $id,
                'url' => $url,
                'srcset' => $srcset,
                'sizes' => $sizes,
                'thumb' => $thumb,
                'alt' => $alt,
            ];
        }
        return $images;
    }
}
