<?php

namespace Jankx\Managers;

use Jankx\Foundation\Application;

/**
 * Sidebar Manager
 *
 * Handles sidebar and widget area management for Jankx Framework
 *
 * @package Jankx\Managers
 * @since 2.0.0
 */
class SidebarManager
{
    protected $app;
    protected $sidebarConfig = [];

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->setupHooks();
    }

    /**
     * Setup WordPress hooks
     *
     * @return void
     */
    protected function setupHooks()
    {
        add_action('widgets_init', [$this, 'registerSidebars']);
    }

    /**
     * Register widget areas/sidebars based on config
     *
     * @return void
     */
    public function registerSidebars()
    {
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
        if (!empty($sidebarConfig['secondary'])) {
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
    }

    /**
     * Set sidebar configuration
     *
     * @param array $config
     * @return void
     */
    public function setSidebarConfig(array $config)
    {
        $this->sidebarConfig = $config;
    }

    /**
     * Get sidebar configuration
     *
     * @return array
     */
    public function getSidebarConfig()
    {
        if (!empty($this->sidebarConfig)) {
            return $this->sidebarConfig;
        }

        return \Jankx\Facades\Config::get('layout.sidebar', []);
    }

    /**
     * Check if sidebar is enabled
     *
     * @param string $sidebar_type
     * @return bool
     */
    public function isSidebarEnabled($sidebar_type)
    {
        $config = $this->getSidebarConfig();
        return !empty($config[$sidebar_type]);
    }

    /**
     * Get sidebar by ID
     *
     * @param string $sidebar_id
     * @return array|null
     */
    public function getSidebar($sidebar_id)
    {
        global $wp_registered_sidebars;

        return isset($wp_registered_sidebars[$sidebar_id])
            ? $wp_registered_sidebars[$sidebar_id]
            : null;
    }

    /**
     * Check if sidebar is active
     *
     * @param string $sidebar_id
     * @return bool
     */
    public function isSidebarActive($sidebar_id)
    {
        return is_active_sidebar($sidebar_id);
    }
}
