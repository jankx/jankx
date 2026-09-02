<?php

/**
 * Required Plugins Configuration
 *
 * File này định nghĩa các plugin bắt buộc (required) và đề xuất (recommended)
 * cho theme. Các plugin này sẽ được quản lý bởi Required Plugins Extension.
 *
 * YÊU CẦU:
 * - Theme phải cài đặt Required Plugins Extension
 * - Extension: extensions/required-plugins/
 * - Package: jankx/plugin-activation (composer require jankx/plugin-activation)
 *
 * @package Jankx
 * @version 1.0.0
 *
 * @see extensions/required-plugins/manifest.json
 * @see https://github.com/jankx/plugin-activation
 */

return [
    /**
     * Danh sách plugin cần cài đặt.
     *
     * Mỗi plugin có các tham số:
     *
     * @param string $name               Tên plugin (bắt buộc)
     * @param string $slug               Slug plugin - thường là tên thư mục (bắt buộc)
     * @param string $source             Nguồn plugin: 'repo', URL, hoặc đường dẫn file (mặc định: 'repo')
     * @param bool   $required           Plugin bắt buộc hay đề xuất (mặc định: false)
     * @param string $version            Phiên bản tối thiểu yêu cầu
     * @param bool   $force_activation   Buộc kích hoạt (mặc định: false)
     * @param bool   $force_deactivation Buộc tắt khi chuyển theme (mặc định: false)
     * @param string $external_url       URL thông tin plugin bên ngoài
     * @param string $is_callable        Callable để kiểm tra plugin đang active
     *
     * @link https://developer.wordpress.org/plugins/wordpress-org/validating-your-plugin/
     */
    'plugins' => [
        // =====================================================
        // REQUIRED PLUGINS (Bắt buộc)
        // =====================================================

        // WordPress SEO by Yoast
        // [
        //     'name'     => 'Yoast SEO',
        //     'slug'     => 'wordpress-seo',
        //     'required' => true,
        // ],

        // Contact Form 7
        // [
        //     'name'     => 'Contact Form 7',
        //     'slug'     => 'contact-form-7',
        //     'required' => true,
        // ],

        // =====================================================
        // RECOMMENDED PLUGINS (Đề xuất)
        // =====================================================

        // Wordfence Security
        // [
        //     'name'     => 'Wordfence Security',
        //     'slug'     => 'wordfence',
        //     'required' => false,
        // ],

        // WP Super Cache
        // [
        //     'name'     => 'WP Super Cache',
        //     'slug'     => 'wp-super-cache',
        //     'required' => false,
        // ],

        // =====================================================
        // BUNDLED PLUGINS (Plugin đi kèm theme)
        // =====================================================

        // Ví dụ: Plugin được đóng gói sẵn trong theme
        // [
        //     'name'     => 'Jankx Custom Post Types',
        //     'slug'     => 'jankx-cpt',
        //     'source'   => get_template_directory() . '/lib/plugins/jankx-cpt.zip',
        //     'required' => true,
        // ],

        // =====================================================
        // EXTERNAL PLUGINS (Plugin từ nguồn bên ngoài)
        // =====================================================

        // Ví dụ: Plugin từ GitHub
        // [
        //     'name'         => 'Some Cool Plugin',
        //     'slug'         => 'some-cool-plugin',
        //     'source'       => 'https://github.com/user/plugin/archive/main.zip',
        //     'required'     => true,
        //     'external_url' => 'https://github.com/user/plugin',
        // ],

        // =====================================================
        // PLUGIN VỚI is_callable
        // =====================================================

        // Hữu ích khi plugin có thể là free hoặc premium
        // Ví dụ: Yoast SEO free hoặc Yoast SEO Premium
        // [
        //     'name'        => 'Yoast SEO',
        //     'slug'        => 'wordpress-seo',
        //     'is_callable' => 'wpseo_init',
        // ],
    ],

    /**
     * Cấu hình TGMPA.
     *
     * @param string $id               ID duy nhất cho nhiều instance TGMPA
     * @param string $default_path     Đường dẫn mặc định đến plugin bundled
     * @param bool   $has_notices      Hiển thị thông báo admin (mặc định: true)
     * @param bool   $dismissable      Cho phép ẩn thông báo (mặc định: true)
     * @param string $dismiss_msg      Thông báo khi không thể ẩn
     * @param string $menu             Menu slug (mặc định: 'tgmpa-install-plugins')
     * @param string $parent_slug      Menu cha (mặc định: 'themes.php')
     * @param string $capability       Capability yêu cầu (mặc định: 'edit_theme_options')
     * @param bool   $is_automatic     Tự động kích hoạt sau cài đặt (mặc định: false)
     * @param string $message          Thông báo trước bảng plugin
     */
    'config' => [
        'id'           => 'jankx',
        'has_notices'  => true,
        'dismissable'  => true,
        'is_automatic' => false,
    ],
];
