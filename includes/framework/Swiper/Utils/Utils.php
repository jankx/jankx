<?php

namespace Jankx\Swiper\Utils;
use Jankx\Swiper\Traits\SingletonTrait;

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('Utils')) {

    class Utils {
        
        use SingletonTrait;

        /**
         * Register the hooks
         */
        public function register() {
            // Initialize any utility functions if needed
            // Removed Appsero tracking as it's not needed for theme integration
        }
    }
}
