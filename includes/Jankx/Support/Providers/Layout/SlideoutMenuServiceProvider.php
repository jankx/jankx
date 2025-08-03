<?php

namespace Jankx\Support\Providers\Layout;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;
use Jankx\Facades\Log;
use Jankx\Helper\Environment;

/**
 * Slideout Menu Service Provider
 *
 * Handles slideout menu functionality for mobile devices:
 *
 * - Mobile menu rendering
 * - Responsive breakpoints
 * - Animation controls
 * - Touch gestures
 * - Accessibility features
 * - Customizable triggers
 * - Device-specific behavior
 *
 * @package Jankx\Support\Providers\Layout
 * @since 2.0.0
 */
class SlideoutMenuServiceProvider extends ServiceProvider
{
    /**
     * Default configuration
     */
    protected $defaultConfig = [
        'enabled' => true,
        'breakpoint' => 'tablet', // mobile, tablet, desktop, all
        'position' => 'left', // left, right, top, bottom
        'animation' => 'slide', // slide, fade, scale
        'duration' => 300, // milliseconds
        'overlay' => true,
        'close_on_click' => true,
        'close_on_escape' => true,
        'swipe_gesture' => true,
        'accessibility' => true,
        'trigger_selector' => '.slideout-trigger',
        'menu_selector' => '.slideout-menu',
        'overlay_selector' => '.slideout-overlay',
        'body_class' => 'slideout-open',
        'z_index' => 9999,
        'width' => '280px', // for left/right
        'height' => '100vh', // for top/bottom
        'background' => '#ffffff',
        'shadow' => true,
        'backdrop_blur' => false,
        'custom_css' => '',
        'custom_js' => '',
    ];

    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register slideout menu service
        $this->app->singleton('slideout.menu', function ($app) {
            return new \Jankx\Services\SlideoutMenuService($app);
        });

        // Register hooks
        $this->registerHooks();
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {
        if (Environment::isDebugLog()) {
            Log::debug('SlideoutMenuServiceProvider: Booted successfully');
        }
    }

    /**
     * Register WordPress hooks
     *
     * @return void
     */
    protected function registerHooks()
    {
        // Enqueue assets
        add_action('wp_enqueue_scripts', [$this, 'enqueueAssets'], 20);

        // Render menu
        add_action('wp_footer', [$this, 'renderSlideoutMenu']);

        // Add body classes
        add_filter('body_class', [$this, 'addBodyClasses']);

        // Add custom CSS
        add_action('wp_head', [$this, 'addCustomCSS']);

        // Add custom JS
        add_action('wp_footer', [$this, 'addCustomJS'], 30);
    }

    /**
     * Enqueue slideout menu assets
     *
     * @return void
     */
    public function enqueueAssets()
    {
        $config = $this->getConfig();

        if (!$config['enabled']) {
            return;
        }

        // Enqueue CSS
        wp_enqueue_style(
            'jankx-slideout-menu',
            \Jankx\Facades\Url::css('slideout-menu.css'),
            [],
            filemtime(get_template_directory() . '/assets/css/slideout-menu.css')
        );

        // Enqueue JS
        wp_enqueue_script(
            'jankx-slideout-menu',
            \Jankx\Facades\Url::js('slideout-menu.js'),
            ['jquery'],
            filemtime(get_template_directory() . '/assets/js/slideout-menu.js'),
            true
        );

        // Localize script with configuration
        wp_localize_script('jankx-slideout-menu', 'jankxSlideoutConfig', $config);

        if (Environment::isDebugLog()) {
            Log::debug('SlideoutMenuServiceProvider: Assets enqueued');
        }
    }

    /**
     * Render slideout menu HTML
     *
     * @return void
     */
    public function renderSlideoutMenu()
    {
        $config = $this->getConfig();

        if (!$config['enabled']) {
            return;
        }

        $position = $config['position'];
        $width = $config['width'];
        $height = $config['height'];
        $background = $config['background'];
        $zIndex = $config['z_index'];

        // Determine dimensions based on position
        $dimensions = $this->getMenuDimensions($position, $width, $height);

        echo '<div id="slideout-menu" class="slideout-menu slideout-' . esc_attr($position) . '" style="';
        echo 'position: fixed;';
        echo 'top: ' . $dimensions['top'] . ';';
        echo 'left: ' . $dimensions['left'] . ';';
        echo 'width: ' . $dimensions['width'] . ';';
        echo 'height: ' . $dimensions['height'] . ';';
        echo 'background: ' . esc_attr($background) . ';';
        echo 'z-index: ' . esc_attr($zIndex) . ';';
        echo 'transform: translateX(' . ($position === 'left' ? '-100%' : '100%') . ');';
        echo 'transition: transform ' . esc_attr($config['duration']) . 'ms ease-in-out;';
        echo 'overflow-y: auto;';
        if ($config['shadow']) {
            echo 'box-shadow: 0 0 20px rgba(0,0,0,0.3);';
        }
        echo '">';

        // Menu header
        echo '<div class="slideout-header">';
        echo '<button class="slideout-close" aria-label="' . esc_attr__('Close menu', 'jankx') . '">';
        echo '<span class="close-icon">×</span>';
        echo '</button>';
        echo '</div>';

        // Menu content
        echo '<div class="slideout-content">';
        $this->renderMenuContent();
        echo '</div>';

        echo '</div>';

        // Overlay
        if ($config['overlay']) {
            echo '<div id="slideout-overlay" class="slideout-overlay" style="';
            echo 'position: fixed;';
            echo 'top: 0; left: 0; right: 0; bottom: 0;';
            echo 'background: rgba(0,0,0,0.5);';
            echo 'z-index: ' . esc_attr($zIndex - 1) . ';';
            echo 'opacity: 0;';
            echo 'visibility: hidden;';
            echo 'transition: opacity ' . esc_attr($config['duration']) . 'ms ease-in-out;';
            if ($config['backdrop_blur']) {
                echo 'backdrop-filter: blur(5px);';
            }
            echo '"></div>';
        }

        if (Environment::isDebugLog()) {
            Log::debug('SlideoutMenuServiceProvider: Menu rendered');
        }
    }

    /**
     * Add body classes
     *
     * @param array $classes
     * @return array
     */
    public function addBodyClasses($classes)
    {
        $config = $this->getConfig();

        if (!$config['enabled']) {
            return $classes;
        }

        $classes[] = 'has-slideout-menu';
        $classes[] = 'slideout-' . $config['position'];
        $classes[] = 'slideout-' . $config['breakpoint'];

        return $classes;
    }

    /**
     * Add custom CSS
     *
     * @return void
     */
    public function addCustomCSS()
    {
        $config = $this->getConfig();

        if (!$config['enabled'] || empty($config['custom_css'])) {
            return;
        }

        echo '<style id="jankx-slideout-custom-css">';
        echo esc_html($config['custom_css']);
        echo '</style>';
    }

    /**
     * Add custom JS
     *
     * @return void
     */
    public function addCustomJS()
    {
        $config = $this->getConfig();

        if (!$config['enabled'] || empty($config['custom_js'])) {
            return;
        }

        echo '<script id="jankx-slideout-custom-js">';
        echo esc_html($config['custom_js']);
        echo '</script>';
    }

    /**
     * Get configuration
     *
     * @return array
     */
    protected function getConfig()
    {
        $config = $this->app->make('config')->get('layout.slideout_menu', []);
        return array_merge($this->defaultConfig, $config);
    }

    /**
     * Get menu dimensions based on position
     *
     * @param string $position
     * @param string $width
     * @param string $height
     * @return array
     */
    protected function getMenuDimensions($position, $width, $height)
    {
        switch ($position) {
            case 'left':
                return [
                    'top' => '0',
                    'left' => '0',
                    'width' => $width,
                    'height' => '100vh'
                ];
            case 'right':
                return [
                    'top' => '0',
                    'left' => 'auto',
                    'right' => '0',
                    'width' => $width,
                    'height' => '100vh'
                ];
            case 'top':
                return [
                    'top' => '0',
                    'left' => '0',
                    'width' => '100vw',
                    'height' => $height
                ];
            case 'bottom':
                return [
                    'top' => 'auto',
                    'bottom' => '0',
                    'left' => '0',
                    'width' => '100vw',
                    'height' => $height
                ];
            default:
                return [
                    'top' => '0',
                    'left' => '0',
                    'width' => $width,
                    'height' => '100vh'
                ];
        }
    }

    /**
     * Render menu content
     *
     * @return void
     */
    protected function renderMenuContent()
    {
        // Default menu content
        if (has_nav_menu('slideout')) {
            wp_nav_menu([
                'theme_location' => 'slideout',
                'container' => 'nav',
                'container_class' => 'slideout-navigation',
                'menu_class' => 'slideout-menu-items',
                'fallback_cb' => [$this, 'renderDefaultMenu']
            ]);
        } else {
            $this->renderDefaultMenu();
        }
    }

    /**
     * Render default menu content
     *
     * @return void
     */
    public function renderDefaultMenu()
    {
        echo '<nav class="slideout-navigation">';
        echo '<ul class="slideout-menu-items">';

        // Home link
        echo '<li class="menu-item"><a href="' . esc_url(home_url()) . '">' . esc_html__('Home', 'jankx') . '</a></li>';

        // Pages
        $pages = get_pages(['sort_column' => 'menu_order']);
        foreach ($pages as $page) {
            echo '<li class="menu-item">';
            echo '<a href="' . esc_url(get_permalink($page->ID)) . '">' . esc_html($page->post_title) . '</a>';
            echo '</li>';
        }

        echo '</ul>';
        echo '</nav>';
    }

    /**
     * Check if slideout menu should be enabled for current device
     *
     * @return bool
     */
    protected function shouldEnableForDevice()
    {
        $config = $this->getConfig();
        $breakpoint = $config['breakpoint'];

        // Simple device detection (can be enhanced with proper detection)
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $isMobile = wp_is_mobile();
        $isTablet = strpos($userAgent, 'iPad') !== false || strpos($userAgent, 'Android') !== false;

        switch ($breakpoint) {
            case 'mobile':
                return $isMobile && !$isTablet;
            case 'tablet':
                return $isTablet;
            case 'desktop':
                return !$isMobile && !$isTablet;
            case 'all':
                return true;
            default:
                return $isMobile;
        }
    }
}
