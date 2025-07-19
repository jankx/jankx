<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

use Jankx\Asset\Bucket;
require_once __DIR__ . '/includes/framework.php';

/**
 * Performance optimized asset registration
 */
class Jankx_Asset_Loader
{
    private static $instance = null;
    private static $asset_directory = null;
    private static $is_initialized = false;

    public static function instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        // Initialize only once
        if (!self::$is_initialized) {
            $this->init();
            self::$is_initialized = true;
        }
    }

    /**
     * Get cached asset directory path
     */
    private static function get_asset_directory()
    {
        if (null === self::$asset_directory) {
            // Cache the realpath call to avoid performance issues
            $framework_file = JANKX_FRAMEWORK_FILE_LOADER;
            $parent_dir = dirname($framework_file);
            $assets_path = dirname($parent_dir) . '/assets';

            // Use cached path if available
            if (defined('JANKX_CACHED_ASSET_DIR')) {
                self::$asset_directory = JANKX_CACHED_ASSET_DIR;
            } else {
                self::$asset_directory = realpath($assets_path) ?: $assets_path;
                // Cache the result for future use
                if (!defined('JANKX_CACHED_ASSET_DIR')) {
                    define('JANKX_CACHED_ASSET_DIR', self::$asset_directory);
                }
            }
        }
        return self::$asset_directory;
    }

    /**
     * Initialize asset loading
     */
    private function init()
    {
        // Register assets only once
        add_action('wp_enqueue_scripts', [$this, 'register_assets'], 5);

        // Register Gutenberg filter only when needed
        if (is_admin() || wp_is_request('frontend')) {
            add_action('wp', [$this, 'setup_gutenberg_filter']);
        }
    }

    /**
     * Register CSS and JavaScript assets
     */
    public function register_assets()
    {
        // Register CSS
        $this->register_css();

        // Register JavaScript
        $this->register_javascript();
    }

    /**
     * Register CSS assets
     */
    private function register_css()
    {
        $jankxCssDeps = array('jankx-base');
        $stylesheetName = Jankx::theme()->get_stylesheet();

        // Handle child theme CSS
        if (is_child_theme() && apply_filters('jankx/styles/includes/main', true)) {
            $stylesheetTheme = wp_get_theme(Jankx::templateStylesheet());
            $templateTheme = wp_get_theme($stylesheetTheme->get_template());
            $stylesheetUri = sprintf('%s/style.css', get_template_directory_uri());
            $jankxCssDeps[] = $templateTheme->get_stylesheet();

            css(
                $templateTheme->get_stylesheet(),
                $stylesheetUri,
                array(),
                $templateTheme->version
            );
        }

        // Register main stylesheet
        css(
            $stylesheetName,
            get_stylesheet_uri(),
            apply_filters('jankx_asset_css_dependences', $jankxCssDeps, $stylesheetName),
            Jankx::theme()->version
        );
    }

    /**
     * Register JavaScript assets
     */
    private function register_javascript()
    {
        $appJsVer = Jankx::theme()->version;
        $appJsName = '';

        // Determine app.js path
        $appjs = $this->get_app_js_path();

        if (file_exists($appjs)) {
            $appJsName = 'app';
            $app_js_url = $this->get_app_js_url($appjs);

            $jankxJsDeps = ['jankx-common', 'scroll-to-smooth'];

            // Add livereload only in development
            if (defined('JANKX_LIVERELOAD') && apply_filters('jankx/tool/livereload/enabled', constant('JANKX_LIVERELOAD'))) {
                $bucket = Bucket::instance();
                $bucket->js('livereload', 'http://localhost:35729/livereload.js', [], '3.0.2');
                $jankxJsDeps[] = 'livereload';
            }

            js(
                $appJsName,
                $app_js_url,
                apply_filters('jankx_asset_js_dependences', $jankxJsDeps),
                $appJsVer,
                true
            );
        }
    }

    /**
     * Get app.js file path
     */
    private function get_app_js_path()
    {
        if (is_child_theme()) {
            return sprintf('%s/assets/js/app.js', get_stylesheet_directory());
        }

        return sprintf('%s/js/app.js', self::get_asset_directory());
    }

    /**
     * Get app.js URL with proper path conversion
     */
    private function get_app_js_url($appjs)
    {
        $abspath = constant('ABSPATH');

        // Handle Windows paths
        if (PHP_OS === 'WINNT') {
            $abspath = str_replace('\\', '/', $abspath);
            $appjs = str_replace('\\', '/', $appjs);
        }

        return str_replace($abspath, site_url('/'), $appjs);
    }

    /**
     * Setup Gutenberg filter
     */
    public function setup_gutenberg_filter()
    {
        add_filter('jankx/gutenberg/enabled', function($enabled) {
            if (is_single()) {
                return in_array(get_post_type(), ['product', 'page', 'post']);
            }
            return $enabled;
        });
    }
}

// Initialize asset loader
Jankx_Asset_Loader::instance();
