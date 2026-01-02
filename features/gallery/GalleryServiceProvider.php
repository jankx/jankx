<?php

namespace Jankx\Features\Gallery;

use Jankx\Support\Providers\ServiceProvider;
use Jankx\Foundation\Application;
use Jankx\Facades\Config;

class GalleryServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
    }

    public function boot(Application $app)
    {
        add_action('init', [$this, 'registerBlocks']);

        add_action('add_meta_boxes', [$this, 'registerMetabox']);
        add_action('save_post', [$this, 'saveGallery']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueScripts']);
    }

    public function registerBlocks()
    {
        register_block_type(__DIR__ . '/blocks/gallery-detail');
    }

    public function registerMetabox()
    {
        $post_types = Config::get('gallery.metabox.post_types', []);
        if (empty($post_types)) {
            return;
        }

        foreach ($post_types as $post_type) {
            add_meta_box(
                'jankx_gallery',
                __('Gallery', 'jankx'),
                [$this, 'renderMetabox'],
                $post_type,
                'normal',
                'high'
            );
        }
    }

    public function renderMetabox($post)
    {
        wp_nonce_field('jankx_gallery_save', 'jankx_gallery_nonce');
        $gallery_ids_str = get_post_meta($post->ID, 'jankx_gallery_ids', true);
        $gallery_ids = !empty($gallery_ids_str) ? explode(',', $gallery_ids_str) : [];

        ?>
        <div class="jankx-gallery-wrapper">
            <div class="jankx-gallery-images">
                <?php if (!empty($gallery_ids)): ?>
                    <?php foreach ($gallery_ids as $id):
                        $url = wp_get_attachment_image_url($id, 'thumbnail');
                        if (!$url)
                            continue;
                        ?>
                        <div class="jankx-gallery-image" data-id="<?php echo esc_attr($id); ?>">
                            <img src="<?php echo esc_url($url); ?>" />
                            <span class="remove-image">&times;</span>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
                <div class="jankx-drop-instruction"
                    style="<?php echo empty($gallery_ids) ? 'display:block' : 'display:none'; ?>">
                    <?php _e('No images selected', 'jankx'); ?>
                </div>
            </div>
            <div class="jankx-gallery-actions">
                <input type="hidden" name="jankx_gallery_ids" id="jankx_gallery_ids"
                    value="<?php echo esc_attr($gallery_ids_str); ?>" />
                <button type="button"
                    class="button button-primary jankx-add-gallery-images"><?php _e('Add Images', 'jankx'); ?></button>
            </div>
        </div>
        <?php
    }

    public function saveGallery($post_id)
    {
        if (!isset($_POST['jankx_gallery_nonce']) || !wp_verify_nonce($_POST['jankx_gallery_nonce'], 'jankx_gallery_save')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        if (isset($_POST['jankx_gallery_ids'])) {
            update_post_meta($post_id, 'jankx_gallery_ids', sanitize_text_field($_POST['jankx_gallery_ids']));
        } else {
            delete_post_meta($post_id, 'jankx_gallery_ids');
        }
    }

    public function enqueueScripts()
    {
        $screen = get_current_screen();
        $post_types = Config::get('gallery.metabox.post_types', []);

        if ($screen && in_array($screen->post_type, $post_types)) {
            wp_enqueue_media();
            wp_enqueue_script(
                'jankx-gallery',
                get_template_directory_uri() . '/features/gallery/assets/js/gallery.js',
                ['jquery', 'jquery-ui-sortable'],
                '1.0.0',
                true
            );
            wp_enqueue_style(
                'jankx-gallery',
                get_template_directory_uri() . '/features/gallery/assets/css/gallery.css',
                [],
                '1.0.0'
            );
        }
    }

    public static function getGallery(int $post_id, string $imageSize = 'large', string $thumbSize = 'thumbnail', bool $showFeaturedImage = true): array
    {
        if (!$post_id) {
            return [];
        }
        $featured_id = get_post_thumbnail_id($post_id);
        $gallery_ids = [];

        // Check meta first
        $meta_gallery = get_post_meta($post_id, 'jankx_gallery_ids', true);
        if ($meta_gallery) {
            $gallery_ids = array_map('intval', explode(',', $meta_gallery));
        }

        if (empty($gallery_ids)) {
            $gallery = get_post_gallery($post_id, false);
            if (is_array($gallery) && !empty($gallery['ids'])) {
                $gallery_ids = array_map('intval', explode(',', $gallery['ids']));
            }
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
                $gallery_ids[] = (int) $att->ID;
            }
        }
        if ($showFeaturedImage && $featured_id && !in_array($featured_id, $gallery_ids, true)) {
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
