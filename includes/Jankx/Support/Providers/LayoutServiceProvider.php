<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

/**
 * Layout Service Provider
 *
 * Handles theme layout components for Jankx Framework:
 *
 * - Menu management and rendering
 * - Sidebar/widget areas management
 * - Footer content and structure
 * - Layout configuration loading
 * - Layout customization filters
 * - Dynamic widget areas
 * - Layout hooks and filters
 * - Template parts management
 * - Layout customization options
 *
 * @package Jankx\Support\Providers
 * @since 2.0.0
 */
class LayoutServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register layout managers
        $app->singleton('layout.menu', \Jankx\Managers\MenuManager::class);
        $app->singleton('layout.sidebar', \Jankx\Managers\SidebarManager::class);
        $app->singleton('layout.footer', \Jankx\Managers\FooterManager::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {
        $this->registerMenus();
        $this->registerSidebars();
        $this->registerFooterWidgets();
        $this->registerLayoutHooks();
    }

    /**
     * Register navigation menus based on config
     */
    protected function registerMenus()
    {
        add_action('init', function () {
            $menu_config = \Jankx\Facades\Config::get('layout.menu', []);

            $menus = [];

            // Primary menu (always available)
            $menus['primary'] = apply_filters('jankx/layout/menu/primary', [
                'name' => 'Primary Menu',
                'description' => 'Primary navigation menu',
            ]);

            // Secondary menu (optional)
            if (!empty($menu_config['secondary'])) {
                $menus['secondary'] = apply_filters('jankx/layout/menu/secondary', [
                    'name' => 'Secondary Menu',
                    'description' => 'Secondary navigation menu',
                ]);
            }

            // Footer menu (optional)
            if (!empty($menu_config['footer'])) {
                $menus['footer'] = apply_filters('jankx/layout/menu/footer', [
                    'name' => 'Footer Menu',
                    'description' => 'Footer navigation menu',
                ]);
            }

            if (!empty($menus)) {
                register_nav_menus($menus);
            }
        });
    }

    /**
     * Register widget areas/sidebars based on config
     */
    protected function registerSidebars()
    {
        add_action('widgets_init', function () {
            $sidebar_config = \Jankx\Facades\Config::get('layout.sidebar', []);

            // Primary sidebar (always available)
            $primary_sidebar = apply_filters('jankx/layout/sidebar/primary', [
                'name' => 'Primary Sidebar',
                'id' => 'primary-sidebar',
                'description' => 'Primary sidebar area',
                'before_widget' => '<div id="%1$s" class="widget %2$s">',
                'after_widget' => '</div>',
                'before_title' => '<h3 class="widget-title">',
                'after_title' => '</h3>',
            ]);

            register_sidebar($primary_sidebar);

            // Secondary sidebar (optional)
            if (!empty($sidebar_config['secondary'])) {
                $secondary_sidebar = apply_filters('jankx/layout/sidebar/secondary', [
                    'name' => 'Secondary Sidebar',
                    'id' => 'secondary-sidebar',
                    'description' => 'Secondary sidebar area',
                    'before_widget' => '<div id="%1$s" class="widget %2$s">',
                    'after_widget' => '</div>',
                    'before_title' => '<h3 class="widget-title">',
                    'after_title' => '</h3>',
                ]);

                register_sidebar($secondary_sidebar);
            }
        });
    }

    /**
     * Register footer widgets based on config
     */
    protected function registerFooterWidgets()
    {
        add_action('widgets_init', function () {
            $footer_config = \Jankx\Facades\Config::get('layout.footer', []);

            // Footer widgets columns
            $footer_columns = $footer_config['widgets']['columns'] ?? 3;

            for ($i = 1; $i <= $footer_columns; $i++) {
                $footer_widget = apply_filters("jankx/layout/footer/widgets/column_{$i}", [
                    'name' => "Footer Widget {$i}",
                    'id' => "footer-widget-{$i}",
                    'description' => "Footer widget area {$i}",
                    'before_widget' => '<div id="%1$s" class="widget %2$s">',
                    'after_widget' => '</div>',
                    'before_title' => '<h4 class="widget-title">',
                    'after_title' => '</h4>',
                ]);

                register_sidebar($footer_widget);
            }
        });
    }

    /**
     * Register layout-specific hooks
     */
    protected function registerLayoutHooks()
    {
        // Add layout body classes
        add_filter('body_class', [$this, 'addLayoutBodyClasses']);

        // Add layout-specific scripts
        add_action('wp_enqueue_scripts', [$this, 'enqueueLayoutScripts']);

        // Add layout-specific styles
        add_action('wp_enqueue_scripts', [$this, 'enqueueLayoutStyles']);
    }

    /**
     * Add layout-specific body classes
     */
    public function addLayoutBodyClasses($classes)
    {
        $layout_config = \Jankx\Facades\Config::get('layout', []);

        // Add sidebar layout class
        $sidebar_config = $layout_config['sidebar'] ?? [];

        if (!empty($sidebar_config['primary'])) {
            $classes[] = 'has-primary-sidebar';
        }

        if (!empty($sidebar_config['secondary'])) {
            $classes[] = 'has-secondary-sidebar';
        }

        if (empty($sidebar_config['primary']) && empty($sidebar_config['secondary'])) {
            $classes[] = 'no-sidebar';
        }

        return $classes;
    }

    /**
     * Enqueue layout-specific scripts
     */
    public function enqueueLayoutScripts()
    {
        $layout_config = \Jankx\Facades\Config::get('layout', []);

        // Mobile menu script (if mobile menu is enabled)
        $menu_config = $layout_config['menu'] ?? [];
        if (!empty($menu_config['mobile'])) {
            \wp_enqueue_script(
                'layout-mobile-menu',
                get_template_directory_uri() . '/assets/js/mobile-menu.js',
                ['jquery'],
                '1.0.0',
                true
            );
        }
    }

    /**
     * Enqueue layout-specific styles
     */
    public function enqueueLayoutStyles()
    {
        // Layout styles
        wp_enqueue_style(
            'layout-styles',
            get_template_directory_uri() . '/assets/css/layout.css',
            [],
            '1.0.0'
        );

        // Responsive layout styles
        wp_enqueue_style(
            'layout-responsive',
            get_template_directory_uri() . '/assets/css/responsive.css',
            ['layout-styles'],
            '1.0.0'
        );
    }
}
