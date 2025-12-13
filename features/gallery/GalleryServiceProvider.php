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
                'show_in_rest' => true,
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
    }
}

