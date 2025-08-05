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
            $menuConfig = \Jankx\Facades\Config::get('layout.menu', []);

            $menus = [];

            // Primary menu (always available)
            $menus['primary'] = apply_filters('jankx/layout/menu/primary', [
                'name' => 'Primary Menu',
                'description' => 'Primary navigation menu',
            ]);

            // Secondary menu (optional)
            if (!empty($menuConfig['secondary'])) {
                $menus['secondary'] = apply_filters('jankx/layout/menu/secondary', [
                    'name' => 'Secondary Menu',
                    'description' => 'Secondary navigation menu',
                ]);
            }

            // Footer menu (optional)
            if (!empty($menuConfig['footer'])) {
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
            $sidebarConfig = \Jankx\Facades\Config::get('layout.sidebar', []);

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

        // Add layout-specific scripts with priority 20
        add_action('wp_enqueue_scripts', [$this, 'enqueueLayoutScripts'], 20);

        // Add layout-specific styles with priority 20
        add_action('wp_enqueue_scripts', [$this, 'enqueueLayoutStyles'], 20);
    }

    /**
     * Add layout-specific body classes
     */
    public function addLayoutBodyClasses($classes)
    {
        return $classes;
    }

    /**
     * Enqueue layout-specific scripts
     */
    public function enqueueLayoutScripts()
    {
    }

    /**
     * Enqueue layout-specific styles
     */
    public function enqueueLayoutStyles()
    {
    }
}
