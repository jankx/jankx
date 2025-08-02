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

    public function __construct(Application $app)
    {
        $this->app = $app;
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
     * Get menu configuration
     *
     * @return array
     */
    public function getMenuConfig()
    {
        return \Jankx\Facades\Config::get('layout.menu', []);
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
