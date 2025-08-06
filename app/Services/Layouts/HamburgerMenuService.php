<?php

namespace App\Services\Layouts;

use Jankx\Foundation\Application;

/**
 * Hamburger Menu Service
 *
 * Adds custom hamburger menu item to WordPress menu system:
 *
 * - Custom menu item for hamburger button
 * - Automatic registration with menu locations
 * - Configurable appearance and behavior
 * - Accessibility support
 * - Multiple instances support
 *
 * @package App\Services\Layouts
 * @since 2.0.0
 */
class HamburgerMenuService
{
    /**
     * @var Application
     */
    protected $app;

    /**
     * @var array
     */
    protected $config;

    /**
     * @var string
     */
    protected $menuItemId;

    /**
     * Initialize hamburger menu service
     *
     * @param  \Jankx\Foundation\Application  $app
     * @param  array  $config
     * @return void
     */
    public function __construct(Application $app, array $config = [])
    {
        $this->app = $app;
        $this->loadConfig($config);
        $this->menuItemId = 'jankx-hamburger-menu-item';

        $this->setupHooks();
    }

    /**
     * Load configuration for hamburger menu
     *
     * @param  array  $customConfig
     * @return void
     */
    protected function loadConfig(array $customConfig = [])
    {
        $defaultConfig = [
            'enabled' => true,
            'menu_locations' => ['primary', 'mobile'], // Menu locations to add hamburger item
            'item_title' => '☰', // Hamburger icon or text
            'item_url' => '#', // URL for menu item
            'item_classes' => ['jankx-hamburger-item'],
            'item_attributes' => [
                'data-toggle' => 'slideout-menu',
                'aria-label' => 'Toggle mobile menu',
                'aria-expanded' => 'false',
                'aria-controls' => 'jankx-slideout-menu',
            ],
            'responsive' => [
                'mobile' => true,
                'tablet' => true,
                'desktop' => false,
            ],
            'position' => 'last', // first, last, after, before
            'after_item' => '', // Menu item to position after
            'before_item' => '', // Menu item to position before
            'priority' => 10, // Hook priority
        ];

        $this->config = array_merge($defaultConfig, $customConfig);

        // Apply filters for customization
        $this->config = apply_filters('jankx/hamburger_menu/config', $this->config);
    }

    /**
     * Setup WordPress hooks
     *
     * @return void
     */
    protected function setupHooks()
    {
        if (!$this->config['enabled']) {
            return;
        }

        // Add custom menu item to specified locations
        foreach ($this->config['menu_locations'] as $location) {
            add_filter("wp_nav_menu_{$location}_items", [$this, 'addHamburgerMenuItem'], $this->config['priority'], 2);
        }

        // Add custom menu item to all menus (alternative approach)
        add_filter('wp_nav_menu_items', [$this, 'addHamburgerMenuItemToAll'], $this->config['priority'], 2);

        // Add custom CSS classes to menu items
        add_filter('nav_menu_css_class', [$this, 'addCustomClasses'], 10, 4);

        // Add custom attributes to menu items
        add_filter('nav_menu_link_attributes', [$this, 'addCustomAttributes'], 10, 4);
    }

    /**
     * Add hamburger menu item to specific menu location
     *
     * @param  string  $items
     * @param  object  $args
     * @return string
     */
    public function addHamburgerMenuItem($items, $args)
    {
        // Check if this is the right location
        if (!in_array($args->theme_location, $this->config['menu_locations'])) {
            return $items;
        }

        // Check responsive settings
        if (!$this->shouldShow()) {
            return $items;
        }

        $hamburgerItem = $this->generateHamburgerMenuItem($args);

        return $this->insertMenuItem($items, $hamburgerItem, $args);
    }

    /**
     * Add hamburger menu item to all menus (alternative approach)
     *
     * @param  string  $items
     * @param  object  $args
     * @return string
     */
    public function addHamburgerMenuItemToAll($items, $args)
    {
        // Check if this is the right location
        if (!in_array($args->theme_location, $this->config['menu_locations'])) {
            return $items;
        }

        // Check responsive settings
        if (!$this->shouldShow()) {
            return $items;
        }

        $hamburgerItem = $this->generateHamburgerMenuItem($args);

        return $this->insertMenuItem($items, $hamburgerItem, $args);
    }

    /**
     * Generate hamburger menu item HTML
     *
     * @param  object  $args
     * @return string
     */
    protected function generateHamburgerMenuItem($args)
    {
        $title = $this->config['item_title'];
        $url = $this->config['item_url'];
        $classes = array_merge($this->config['item_classes'], ['menu-item', 'menu-item-hamburger']);
        $attributes = $this->config['item_attributes'];

        // Build classes string
        $classString = implode(' ', array_filter($classes));

        // Build attributes string
        $attributesString = '';
        foreach ($attributes as $key => $value) {
            $attributesString .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
        }

        return sprintf(
            '<li class="%s"><a href="%s"%s>%s</a></li>',
            esc_attr($classString),
            esc_url($url),
            $attributesString,
            esc_html($title)
        );
    }

    /**
     * Insert menu item at specified position
     *
     * @param  string  $items
     * @param  string  $newItem
     * @param  object  $args
     * @return string
     */
    protected function insertMenuItem($items, $newItem, $args)
    {
        $position = $this->config['position'];

        switch ($position) {
            case 'first':
                return $newItem . $items;

            case 'last':
                return $items . $newItem;

            case 'after':
                if (!empty($this->config['after_item'])) {
                    $afterItem = $this->config['after_item'];
                    $pattern = '/<li[^>]*class="[^"]*' . preg_quote($afterItem, '/') . '[^"]*"[^>]*>.*?<\/li>/s';
                    return preg_replace($pattern, '$0' . $newItem, $items, 1);
                }
                return $items . $newItem;

            case 'before':
                if (!empty($this->config['before_item'])) {
                    $beforeItem = $this->config['before_item'];
                    $pattern = '/<li[^>]*class="[^"]*' . preg_quote($beforeItem, '/') . '[^"]*"[^>]*>.*?<\/li>/s';
                    return preg_replace($pattern, $newItem . '$0', $items, 1);
                }
                return $newItem . $items;

            default:
                return $items . $newItem;
        }
    }

    /**
     * Add custom CSS classes to menu items
     *
     * @param  array  $classes
     * @param  object  $item
     * @param  object  $args
     * @param  int  $depth
     * @return array
     */
    public function addCustomClasses($classes, $item, $args, $depth)
    {
        // Add responsive classes
        if ($this->config['responsive']['mobile']) {
            $classes[] = 'show-mobile';
        }
        if ($this->config['responsive']['tablet']) {
            $classes[] = 'show-tablet';
        }
        if ($this->config['responsive']['desktop']) {
            $classes[] = 'show-desktop';
        }

        return $classes;
    }

    /**
     * Add custom attributes to menu items
     *
     * @param  array  $attributes
     * @param  object  $item
     * @param  object  $args
     * @param  int  $depth
     * @return array
     */
    public function addCustomAttributes($attributes, $item, $args, $depth)
    {
        // Add custom attributes to hamburger menu item
        if (in_array('menu-item-hamburger', $item->classes)) {
            foreach ($this->config['item_attributes'] as $key => $value) {
                $attributes[$key] = $value;
            }
        }

        return $attributes;
    }

    /**
     * Check if hamburger menu should be shown based on responsive settings
     *
     * @return bool
     */
    protected function shouldShow()
    {
        $responsive = $this->config['responsive'];

        if (wp_is_mobile()) {
            return $responsive['mobile'] ?? true;
        }

        // Simple detection - có thể enhance với JavaScript
        $screenWidth = isset($_SERVER['HTTP_USER_AGENT']) ?
            (strpos($_SERVER['HTTP_USER_AGENT'], 'Mobile') !== false ? 'mobile' : 'desktop') : 'desktop';

        if ($screenWidth === 'mobile') {
            return $responsive['mobile'] ?? true;
        }

        return $responsive['desktop'] ?? false;
    }

    /**
     * Get current configuration
     *
     * @return array
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * Update configuration
     *
     * @param  array  $config
     * @return void
     */
    public function updateConfig(array $config)
    {
        $this->config = array_merge($this->config, $config);
    }

    /**
     * Manually add hamburger menu item to any menu
     *
     * @param  string  $menuLocation
     * @param  array  $args
     * @return string
     */
    public function renderHamburgerMenuItem($menuLocation = 'primary', array $args = [])
    {
        $defaultArgs = [
            'theme_location' => $menuLocation,
            'container' => false,
            'echo' => false,
        ];

        $args = array_merge($defaultArgs, $args);

        return wp_nav_menu($args);
    }
}
