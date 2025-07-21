<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

require_once get_template_directory() . '/includes/svg-sanitizer.php';
require_once get_template_directory() . '/includes/file-upload-security.php';
require_once get_template_directory() . '/includes/path-validator.php';
require_once get_template_directory() . '/includes/config.php';
require_once get_template_directory() . '/includes/performance.php';
require_once get_template_directory() . '/includes/performance-config.php';

use Jankx\Jankx;
require_once __DIR__ . '/includes/framework.php';

/**
 * Performance optimized asset registration
 */
class Jankx_Asset_Loader
{
    private static $instance = null;
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

            wp_register_style(
                $templateTheme->get_stylesheet(),
                $stylesheetUri,
                array(),
                $templateTheme->version,
                'all'
            );
            wp_enqueue_style($templateTheme->get_stylesheet());
        }

        // Register main stylesheet
        wp_register_style(
            $stylesheetName,
            get_stylesheet_uri(),
            apply_filters('jankx_asset_css_dependences', $jankxCssDeps, $stylesheetName),
            Jankx::theme()->version,
            'all'
        );
        wp_enqueue_style($stylesheetName);
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
                wp_register_script(
                    'livereload',
                    'http://localhost:35729/livereload.js',
                    array(),
                    '3.0.2',
                    true
                );
                wp_enqueue_script('livereload');
                $jankxJsDeps[] = 'livereload';
            }

            wp_register_script(
                $appJsName,
                $app_js_url,
                apply_filters('jankx_asset_js_dependences', $jankxJsDeps),
                $appJsVer,
                true
            );
            wp_enqueue_script($appJsName);
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

        return sprintf('%s/assets/js/app.js', get_template_directory());
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
