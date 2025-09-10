<?php

namespace Jankx\Swiper\Classes;

use Jankx\Swiper\Traits\SingletonTrait;

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('RegistrationCategory')) {

    class RegistrationCategory {

        use SingletonTrait;

        /**
         * Category Slug
         */
        private const CATEGORY_SLUG = 'jankx-swiper';

        /**
         * Public method to attach WordPress hooks.
         */
        public function register() {
            add_filter('block_categories_all', [$this, 'register_category'], 99999999, 2);
        }

        /**
         * Register the custom block category.
         */
        public function register_category($categories) {
            if (!is_array($categories)) {
                return $categories;
            }

            $new_category = [
                'slug'  => self::CATEGORY_SLUG,
                'title' => esc_html__('Jankx Swiper', 'jankx'),
                'icon'  => null
            ];

            array_unshift($categories, $new_category);

            return $categories;
        }
    }
}
