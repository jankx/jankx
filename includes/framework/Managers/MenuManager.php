<?php

namespace Jankx\Managers;

use Jankx\Foundation\Application;

/**
 * Menu Manager
 *
 * Handles menu management and rendering for Jankx Framework
 *
 * @package Jankx\Managers
 * @since 2.0.0
 */
class MenuManager
{
    protected $app;
    protected $menuConfig = [];

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
        add_action('init', [$this, 'registerMenus']);
    }

    /**
     * Register navigation menus based on config
     *
     * @return void
     */
    public function registerMenus()
    {
        $menuConfig = \Jankx\Facades\Config::get('layout.menu', []);

        $menus = [];

        // Primary menu (always available)
        $menus['primary'] = apply_filters('jankx/layout/menu/primary', 'Primary Menu');

        // Secondary menu (optional)
        if (!empty($menuConfig['secondary'])) {
            $menus['secondary'] = apply_filters('jankx/layout/menu/secondary', 'Secondary Menu');
        }

        // Footer menu (optional)
        if (!empty($menuConfig['footer'])) {
            $menus['footer'] = apply_filters('jankx/layout/menu/footer', 'Footer Menu');
        }

        if (!empty($menus)) {
            register_nav_menus($menus);
        }

        // Store menu config for later use
        $this->setMenuConfig($menus);
    }

    /**
     * Set menu configuration
     *
     * @param array $config
     * @return void
     */
    public function setMenuConfig(array $config)
    {
        $this->menuConfig = $config;
    }

    /**
     * Get menu configuration
     *
     * @return array
     */
    public function getMenuConfig()
    {
        if (!empty($this->menuConfig)) {
            return $this->menuConfig;
        }

        return \Jankx\Facades\Config::get('layout.menu', []);
    }

    /**
     * Get menu by location
     *
     * @param string $location
     * @param array $args
     * @return string
     */
    public function getMenu($location, $args = [])
    {
        $defaults = [
            'theme_location' => $location,
            'container' => 'nav',
            'container_class' => 'menu-' . $location,
            'container_id' => 'menu-' . $location,
            'menu_class' => 'menu',
            'echo' => false,
            'fallback_cb' => false,
        ];

        $args = wp_parse_args($args, $defaults);

        return wp_nav_menu($args);
    }

    /**
     * Get primary menu
     *
     * @param array $args
     * @return string
     */
    public function getPrimaryMenu($args = [])
    {
        return $this->getMenu('primary', $args);
    }

    /**
     * Get secondary menu
     *
     * @param array $args
     * @return string
     */
    public function getSecondaryMenu($args = [])
    {
        return $this->getMenu('secondary', $args);
    }

    /**
     * Get footer menu
     *
     * @param array $args
     * @return string
     */
    public function getFooterMenu($args = [])
    {
        return $this->getMenu('footer', $args);
    }

    /**
     * Check if menu exists at location
     *
     * @param string $location
     * @return bool
     */
    public function hasMenu($location)
    {
        return has_nav_menu($location);
    }

    /**
     * Check if primary menu exists
     *
     * @return bool
     */
    public function hasPrimaryMenu()
    {
        return $this->hasMenu('primary');
    }

    /**
     * Check if secondary menu exists
     *
     * @return bool
     */
    public function hasSecondaryMenu()
    {
        return $this->hasMenu('secondary');
    }

    /**
     * Check if footer menu exists
     *
     * @return bool
     */
    public function hasFooterMenu()
    {
        return $this->hasMenu('footer');
    }

    /**
     * Get menu items by location
     *
     * @param string $location
     * @return array
     */
    public function getMenuItems($location)
    {
        $locations = get_nav_menu_locations();

        if (!isset($locations[$location])) {
            return [];
        }

        $menu = wp_get_nav_menu_object($locations[$location]);

        if (!$menu) {
            return [];
        }

        return wp_get_nav_menu_items($menu->term_id);
    }

    /**
     * Render mobile menu
     *
     * @return string
     */
    public function renderMobileMenu()
    {
        $mobile_menu = $this->getPrimaryMenu();

        if (!$mobile_menu) {
            return '';
        }

        return sprintf(
            '<div class="mobile-menu-wrapper">
                <button class="mobile-menu-toggle" aria-label="Toggle Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div class="mobile-menu">
                    %s
                </div>
            </div>',
            $mobile_menu
        );
    }

    /**
     * Get menu locations
     *
     * @return array
     */
    public function getMenuLocations()
    {
        return get_nav_menu_locations();
    }

    /**
     * Check if current page is in menu
     *
     * @param string $location
     * @return bool
     */
    public function isCurrentPageInMenu($location)
    {
        $menu_items = $this->getMenuItems($location);
        $current_url = get_permalink();

        foreach ($menu_items as $item) {
            if ($item->url === $current_url) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if menu is enabled in config
     *
     * @param string $menu_type
     * @return bool
     */
    public function isMenuEnabled($menu_type)
    {
        $config = $this->getMenuConfig();
        return !empty($config[$menu_type]);
    }
}
