<?php

namespace Jankx\Features\Gallery;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class GalleryServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
    }

    public function boot(Application $app)
    {
        add_action('init', function () {
            $labels = [
                'name' => 'Gallery',
                'singular_name' => 'Gallery',
                'menu_name' => 'Gallery',
                'name_admin_bar' => 'Gallery',
                'add_new' => 'Thêm mới',
                'add_new_item' => 'Thêm gallery mới',
                'new_item' => 'Gallery mới',
                'edit_item' => 'Chỉnh sửa gallery',
                'view_item' => 'Xem gallery',
                'all_items' => 'Tất cả gallery',
                'search_items' => 'Tìm gallery',
                'parent_item_colon' => 'Gallery cha:',
                'not_found' => 'Không tìm thấy',
                'not_found_in_trash' => 'Không có trong thùng rác',
            ];

            $args = [
                'labels' => $labels,
                'public' => true,
                'show_ui' => true,
                'show_in_menu' => true,
                'show_in_nav_menus' => true,
                'show_in_admin_bar' => true,
                'show_in_rest' => false,
                'rest_base' => 'gallery',
                'has_archive' => true,
                'rewrite' => [
                    'slug' => 'gallery',
                    'with_front' => true,
                ],
                'menu_icon' => 'dashicons-format-gallery',
                'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
                'hierarchical' => false,
                'exclude_from_search' => false,
                'publicly_queryable' => true,
                'capability_type' => 'post',
            ];

            if (!post_type_exists('gallery')) {
                register_post_type('gallery', $args);
            }
        }, 10);

        add_action('add_meta_boxes', [$this, 'addGalleryMetaBox']);
        add_action('save_post', [$this, 'saveGalleryMetaBox']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueAssets']);
    }

    public function addGalleryMetaBox()
    {
        add_meta_box(
            'jankx_gallery_images',
            __('Gallery Images', 'jankx'),
            [$this, 'renderGalleryMetaBox'],
            'gallery',
            'normal',
            'high'
        );
    }

    public function renderGalleryMetaBox($post)
    {
        $gallery_ids = get_post_meta($post->ID, 'jankx_gallery_ids', true);
        $ids = !empty($gallery_ids) ? explode(',', $gallery_ids) : [];
        
        wp_nonce_field('save_jankx_gallery', 'jankx_gallery_nonce');
        ?>
        <div class="jankx-gallery-wrapper">
            <div class="jankx-gallery-images">
                <?php if (empty($ids)): ?>
                    <div class="jankx-drop-instruction"><?php _e('No images selected', 'jankx'); ?></div>
                <?php else: ?>
                    <?php foreach ($ids as $id): 
                        $image = wp_get_attachment_image_src($id, 'thumbnail');
                        if (!$image) continue;
                    ?>
                        <div class="jankx-gallery-image" data-id="<?php echo esc_attr($id); ?>">
                            <img src="<?php echo esc_url($image[0]); ?>" />
                            <span class="remove-image">&times;</span>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
            <div class="jankx-gallery-actions">
                <input type="hidden" name="jankx_gallery_ids" id="jankx_gallery_ids" value="<?php echo esc_attr($gallery_ids); ?>" />
                <button type="button" class="button button-primary jankx-add-gallery-images"><?php _e('Add Images', 'jankx'); ?></button>
            </div>
        </div>
        <?php
    }

    public function saveGalleryMetaBox($post_id)
    {
        if (!isset($_POST['jankx_gallery_nonce']) || !wp_verify_nonce($_POST['jankx_gallery_nonce'], 'save_jankx_gallery')) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;

        if (isset($_POST['jankx_gallery_ids'])) {
            update_post_meta($post_id, 'jankx_gallery_ids', sanitize_text_field($_POST['jankx_gallery_ids']));
        } else {
            delete_post_meta($post_id, 'jankx_gallery_ids');
        }
    }

    public function enqueueAssets()
    {
        $screen = get_current_screen();
        if ($screen && $screen->post_type === 'gallery') {
            wp_enqueue_media();
            wp_enqueue_script('jquery-ui-sortable');
            
            wp_enqueue_style(
                'jankx-gallery-metabox',
                get_template_directory_uri() . '/features/gallery/assets/css/gallery.css',
                [],
                '1.0.0'
            );

            wp_enqueue_script(
                'jankx-gallery-metabox',
                get_template_directory_uri() . '/features/gallery/assets/js/gallery.js',
                ['jquery', 'jquery-ui-sortable'],
                '1.0.0',
                true
            );
        }
    }
}

