<?php

namespace Jankx\Swiper\Assets;

use Jankx\Swiper\Traits\SingletonTrait;

class FrontendAssets {
    use SingletonTrait;

    public function register() {
        add_action('enqueue_block_assets', [$this, 'enqueue_assets']);
    }

    public function enqueue_assets() {
        $theme_url = get_template_directory_uri();

        wp_register_style(
            'jankx-swiper-swiper-style',
            $theme_url . '/resources/assets/libs/swiper/swiper-bundle.min.css',
            [],
            '1.0.0'
        );

        wp_register_script(
            'jankx-swiper-swiper-script',
            $theme_url . '/resources/assets/libs/swiper/swiper-bundle.min.js',
            [],
            '1.0.0',
            true
        );

        if (!is_admin()) {
            wp_enqueue_style('jankx-swiper-swiper-style');
            wp_enqueue_script('jankx-swiper-swiper-script');
        }
    }
}
