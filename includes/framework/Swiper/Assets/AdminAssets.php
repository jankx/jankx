<?php

namespace Jankx\Swiper\Assets;

use Jankx\Swiper\Traits\SingletonTrait;

class AdminAssets
{
    use SingletonTrait;

    public function register()
    {
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    public function enqueue_assets()
    {
        $theme_url = get_template_directory_uri();

        wp_register_style(
            'jankx-swiper-admin-style',
            $theme_url . '/resources/assets/admin/admin.css',
            [],
            '1.0.0'
        );

        wp_register_script(
            'jankx-swiper-admin-script',
            $theme_url . '/resources/assets/admin/admin.js',
            [],
            '1.0.0',
            true
        );

        wp_enqueue_style('jankx-swiper-admin-style');
        wp_enqueue_script('jankx-swiper-admin-script');

        /**
         * Localize script for admin
         * This will pass data to the admin script
         * such as site URL, AJAX URL, nonce, plugin URL, and version.
         * This is useful for making AJAX requests and other dynamic functionalities.
         */
        $localize_array = [
            'site_url' => site_url(),
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jankx_swiper_nonce'),
            'theme_url' => $theme_url,
        ];

        wp_localize_script('jankx-swiper-admin-script', 'JankxSwiperData', $localize_array);
    }
}
