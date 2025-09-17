<?php

namespace Jankx\Swiper\Classes;

use Jankx\Swiper\Traits\SingletonTrait;

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('StyleGenerator')) {

    class StyleGenerator
    {
        use SingletonTrait;

        private const CSS_SUBDIR = '/jankx-swiper/css';
        private const FILE_PERMISSIONS = 0644;
        private static $styles = [];

        private $css_dir;
        private $css_url;

        /**
         * Constructor
         */
        private function __construct()
        {
            $this->setup_directories();
        }

        /**
         * Register the hooks
         */
        public function register()
        {
            add_filter('render_block', [$this, 'collect_dynamic_styles'], 10, 2);
            add_action('wp_footer', [$this, 'generate_css_file'], 10);
            add_action('wp_enqueue_scripts', [$this, 'enqueue_dynamic_styles']);
        }

        /**
         * Set up Directories
         */
        private function setup_directories()
        {
            $upload_dir = wp_upload_dir();
            $this->css_dir = $upload_dir['basedir'] . self::CSS_SUBDIR;
            $this->css_url = $upload_dir['baseurl'] . self::CSS_SUBDIR;

            if (!file_exists($this->css_dir)) {
                if (!wp_mkdir_p($this->css_dir)) {
                    error_log('Failed to create CSS directory at: ' . $this->css_dir);
                }
            }
        }

        /**
         * Collect Dynamic Styles
         */
        public function collect_dynamic_styles($block_content, $block)
        {
            if (!is_array($block) || empty($block['blockName'])) {
                return $block_content;
            }

            if (str_contains($block['blockName'], 'jankx/swiper-') && isset($block['attrs']['blockStyle'])) {
                $block_id = isset($block['attrs']['blockId']) ?
                    sanitize_key($block['attrs']['blockId']) :
                    'jankx-swiper-' . md5(serialize($block['attrs']));
                self::$styles[$block_id] = $block['attrs']['blockStyle'];
            }

            return $block_content;
        }

        /**
         * Generate the CSS File
         */
        public function generate_css_file()
        {
            if (empty(self::$styles)) {
                return;
            }

            clearstatcache();
            $page_id = get_queried_object_id();
            $css_filename = 'jankx-swiper-dynamic-styles-' . $page_id . '.min.css';
            $css_file = $this->css_dir . '/' . $css_filename;

            $css_content = '';
            foreach (self::$styles as $block_id => $style) {
                $css_content .= $style;
            }

            $css_content = "/* Jankx Swiper Dynamic Styles - Page ID: $page_id - Generated on " .
                current_time('mysql') . " */\n" . $this->minify_css($css_content);

            if (!function_exists('WP_Filesystem')) {
                require_once ABSPATH . 'wp-admin/includes/file.php';
            }

            global $wp_filesystem;
            if (empty($wp_filesystem)) {
                WP_Filesystem();
            }

            if (!is_dir($this->css_dir)) {
                if (!wp_mkdir_p($this->css_dir)) {
                    error_log('Failed to create CSS directory: ' . $this->css_dir);
                    return;
                }
            }

            if (file_exists($css_file)) {
                $existing_content = $wp_filesystem->get_contents($css_file);
                if ($existing_content === $css_content) {
                    return;
                }
            }

            if (!$wp_filesystem->put_contents($css_file, $css_content, self::FILE_PERMISSIONS)) {
                error_log('Failed to write CSS file: ' . $css_file);
            }

            self::$styles = [];
        }

        /**
         * Enqueue Dynamic Styles
         */
        public function enqueue_dynamic_styles()
        {
            clearstatcache();
            $page_id = get_queried_object_id();
            $css_filename = 'jankx-swiper-dynamic-styles-' . $page_id . '.min.css';
            $css_file_path = $this->css_dir . '/' . $css_filename;
            $css_file_url = $this->css_url . '/' . $css_filename;

            if (!file_exists($css_file_path)) {
                $this->generate_css_file();
            }

            if (file_exists($css_file_path)) {
                wp_enqueue_style(
                    'jankx-swiper-dynamic-styles-' . $page_id,
                    $css_file_url,
                    [],
                    filemtime($css_file_path)
                );
            }
        }

        /**
         * Minify CSS
         */
        private function minify_css($css)
        {
            if (empty($css)) {
                return '';
            }

            $css = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css);
            $css = preg_replace('/\s*([:,;{}])\s*/', '$1', $css);
            $css = preg_replace('/;}/', '}', $css);

            return trim($css);
        }
    }
}
