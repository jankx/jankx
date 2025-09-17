<?php

namespace Jankx\Swiper\Classes;

use Jankx\Swiper\Traits\SingletonTrait;

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('RegistrationBlocks')) {

    class RegistrationBlocks
    {
        use SingletonTrait;

        /**
         * Attach hooks for block registration.
         */
        public function register()
        {
            add_action('init', [$this, 'register_blocks']);
        }

        /**
         * Register all blocks dynamically from resources/blocks directory.
         */
        public function register_blocks()
        {
            $theme_dir = get_template_directory();
            $blocks_dir = trailingslashit($theme_dir) . 'resources/blocks/';

            if (!is_readable($blocks_dir)) {
                error_log('Jankx Swiper Blocks: Blocks directory is not readable: ' . $blocks_dir);
                return;
            }

            // Get block folders dynamically
            $blocks = apply_filters('jankx_swiper_registered_blocks', $this->get_available_blocks($blocks_dir));

            foreach ($blocks as $block) {
                try {
                    $this->register_single_block($blocks_dir, $block);
                } catch (\Exception $e) {
                    error_log('Jankx Swiper Blocks: Error registering block "' . $block . '": ' . $e->getMessage());
                }
            }
        }

        /**
         * Register a single block if valid.
         *
         * @param string $blocks_dir
         * @param string $block
         * @throws \Exception
         */
        private function register_single_block(string $blocks_dir, string $block)
        {
            $block_dir = trailingslashit($blocks_dir . sanitize_file_name($block));

            if (!is_readable($block_dir)) {
                throw new \Exception("Blocks directory not readable: {$block_dir}");
            }

            if (!file_exists($block_dir . 'block.json')) {
                throw new \Exception("block.json not found for {$block}");
            }

            if (false === register_block_type($block_dir)) {
                throw new \Exception("Block registration failed for {$block}");
            }
        }

        /**
         * Dynamically scan block folders inside resources/blocks directory.
         *
         * @param string $blocks_dir
         * @return array
         */
        private function get_available_blocks(string $blocks_dir)
        {
            if (!is_dir($blocks_dir)) {
                return [];
            }

            $blocks = [];
            $dirs = scandir($blocks_dir);

            foreach ($dirs as $dir) {
                if ($dir === '.' || $dir === '..') {
                    continue;
                }

                $block_path = trailingslashit($blocks_dir . $dir);

                if (is_dir($block_path) && file_exists($block_path . 'block.json')) {
                    $blocks[] = $dir;
                }
            }

            return $blocks;
        }
    }
}
