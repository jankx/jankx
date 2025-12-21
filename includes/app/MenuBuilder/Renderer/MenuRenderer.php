<?php
/**
 * Menu Renderer
 * 
 * @package App\MenuBuilder\Renderer
 * @since 1.0.0
 */

namespace App\MenuBuilder\Renderer;

use App\MenuBuilder\Database\MenuRepository;
use App\MenuBuilder\Database\MenuItemRepository;
use App\MenuBuilder\Assets\AssetManager;

class MenuRenderer
{
    /**
     * Menu repository
     */
    protected $menuRepository;

    /**
     * Menu item repository
     */
    protected $menuItemRepository;

    /**
     * Asset manager
     */
    protected $assetManager;

    /**
     * Constructor
     */
    public function __construct(MenuRepository $menuRepository, MenuItemRepository $menuItemRepository, AssetManager $assetManager)
    {
        $this->menuRepository = $menuRepository;
        $this->menuItemRepository = $menuItemRepository;
        $this->assetManager = $assetManager;
    }

    /**
     * Render block
     */
    public function renderBlock($attributes, $content)
    {
        $menuId = $attributes['menuId'] ?? '';
        $menuClass = $attributes['menuClass'] ?? 'jankx-responsive-menu';
        $mobileBreakpoint = $attributes['mobileBreakpoint'] ?? 768;
        $desktopBreakpoint = $attributes['desktopBreakpoint'] ?? 1024;
        $enableMobileMenu = $attributes['enableMobileMenu'] ?? true;
        $enableDesktopMenu = $attributes['enableDesktopMenu'] ?? true;
        $mobileMenuOptions = $attributes['mobileMenuOptions'] ?? [];
        $desktopMenuOptions = $attributes['desktopMenuOptions'] ?? [];
        $submenuTypes = $attributes['submenuTypes'] ?? [];

        // Get menu data
        $menu = $this->getMenuData($menuId);
        
        if (!$menu || empty($menu->items)) {
            return $this->renderEmptyMenu($attributes);
        }

        // Build menu HTML
        $menuHtml = $this->buildMenuHtml($menu->items, $attributes);

        // Build wrapper
        $wrapperAttributes = [
            'class' => $menuClass,
            'id' => $menuId ? "menu-{$menuId}" : '',
            'data-mobile-breakpoint' => $mobileBreakpoint,
            'data-desktop-breakpoint' => $desktopBreakpoint,
            'data-enable-mobile' => $enableMobileMenu ? 'true' : 'false',
            'data-enable-desktop' => $enableDesktopMenu ? 'true' : 'false',
            'data-mobile-options' => json_encode($mobileMenuOptions),
            'data-desktop-options' => json_encode($desktopMenuOptions),
            'data-submenu-types' => json_encode($submenuTypes)
        ];

        $wrapperHtml = '<nav ' . $this->buildAttributes($wrapperAttributes) . '>';
        $wrapperHtml .= '<ul class="menu">';
        $wrapperHtml .= $menuHtml;
        $wrapperHtml .= '</ul>';
        $wrapperHtml .= '</nav>';

        return $wrapperHtml;
    }

    /**
     * Render shortcode
     */
    public function renderShortcode($atts)
    {
        $atts = shortcode_atts([
            'id' => '',
            'class' => 'jankx-responsive-menu',
            'mobile_breakpoint' => 768,
            'desktop_breakpoint' => 1024,
            'enable_mobile' => 'true',
            'enable_desktop' => 'true'
        ], $atts);

        $attributes = [
            'menuId' => $atts['id'],
            'menuClass' => $atts['class'],
            'mobileBreakpoint' => intval($atts['mobile_breakpoint']),
            'desktopBreakpoint' => intval($atts['desktop_breakpoint']),
            'enableMobileMenu' => $atts['enable_mobile'] === 'true',
            'enableDesktopMenu' => $atts['enable_desktop'] === 'true'
        ];

        return $this->renderBlock($attributes, '');
    }

    /**
     * Get menu data
     */
    protected function getMenuData($menuId)
    {
        if (empty($menuId)) {
            return null;
        }

        // Try to get by ID first
        $menu = $this->menuRepository->getById($menuId);
        
        if (!$menu) {
            // Try to get by slug
            $menu = $this->menuRepository->getBySlug($menuId);
        }

        if ($menu) {
            $menu->items = $this->menuItemRepository->getTreeByMenuId($menu->id);
        }

        return $menu;
    }

    /**
     * Build menu HTML
     */
    protected function buildMenuHtml($items, $attributes, $level = 0)
    {
        $html = '';
        
        foreach ($items as $item) {
            $html .= $this->buildMenuItemHtml($item, $attributes, $level);
        }

        return $html;
    }

    /**
     * Build menu item HTML
     */
    protected function buildMenuItemHtml($item, $attributes, $level = 0)
    {
        $itemClasses = ['menu-item', "menu-item-type-{$item->type}", "level-{$level}"];
        
        if (!empty($item->children)) {
            $itemClasses[] = 'has-children';
            $itemClasses[] = "submenu-type-{$item->submenu_type}";
        }

        $itemAttributes = [
            'class' => implode(' ', $itemClasses),
            'data-item-id' => $item->id,
            'data-item-type' => $item->type
        ];

        if (!empty($item->children)) {
            $itemAttributes['data-submenu-type'] = $item->submenu_type;
            
            if ($item->submenu_type === 'mega') {
                $itemAttributes['data-mega-columns'] = $item->settings['columns'] ?? 4;
                $itemAttributes['data-mega-full-width'] = $item->settings['fullWidth'] ?? true;
            } elseif ($item->submenu_type === 'flyout') {
                $itemAttributes['data-flyout-position'] = $item->settings['position'] ?? 'right';
                $itemAttributes['data-flyout-width'] = $item->settings['width'] ?? '300px';
            }
        }

        $html = '<li ' . $this->buildAttributes($itemAttributes) . '>';
        
        // Link
        $linkAttributes = [
            'href' => $item->url ?: '#',
            'class' => 'menu-item-link'
        ];

        if ($item->type === 'button') {
            $linkAttributes['class'] .= ' menu-item-button';
        }

        $html .= '<a ' . $this->buildAttributes($linkAttributes) . '>';
        $html .= esc_html($item->label);
        $html .= '</a>';

        // Submenu
        if (!empty($item->children)) {
            $html .= $this->buildSubmenuHtml($item, $attributes, $level + 1);
        }

        $html .= '</li>';

        return $html;
    }

    /**
     * Build submenu HTML
     */
    protected function buildSubmenuHtml($item, $attributes, $level = 1)
    {
        $submenuClasses = ['submenu', "submenu-type-{$item->submenu_type}"];
        
        if ($item->submenu_type === 'mega') {
            $submenuClasses[] = 'mega-menu';
            if ($item->settings['fullWidth'] ?? true) {
                $submenuClasses[] = 'mega-menu-full-width';
            }
            $submenuClasses[] = "mega-menu-columns-" . ($item->settings['columns'] ?? 4);
        } elseif ($item->submenu_type === 'flyout') {
            $submenuClasses[] = 'flyout-menu';
            $submenuClasses[] = "flyout-position-" . ($item->settings['position'] ?? 'right');
        } else {
            $submenuClasses[] = 'multilevel-menu';
        }

        $submenuAttributes = [
            'class' => implode(' ', $submenuClasses),
            'data-parent-id' => $item->id,
            'data-level' => $level
        ];

        $html = '<div ' . $this->buildAttributes($submenuAttributes) . '>';

        if ($item->submenu_type === 'mega') {
            $html .= $this->buildMegaMenuContent($item, $attributes, $level);
        } else {
            $html .= '<ul class="submenu-list">';
            $html .= $this->buildMenuHtml($item->children, $attributes, $level);
            $html .= '</ul>';
        }

        $html .= '</div>';

        return $html;
    }

    /**
     * Build mega menu content
     */
    protected function buildMegaMenuContent($item, $attributes, $level)
    {
        $columns = $item->settings['columns'] ?? 4;
        $children = $item->children;
        
        // Group children into columns
        $columnGroups = [];
        $itemsPerColumn = ceil(count($children) / $columns);

        for ($i = 0; $i < $columns; $i++) {
            $start = $i * $itemsPerColumn;
            $columnGroups[$i] = array_slice($children, $start, $itemsPerColumn);
        }

        $html = '<div class="mega-menu-container">';
        $html .= '<div class="mega-menu-row">';

        foreach ($columnGroups as $columnIndex => $columnItems) {
            $html .= '<div class="mega-menu-column">';
            $html .= '<ul class="mega-menu-list">';
            $html .= $this->buildMenuHtml($columnItems, $attributes, $level);
            $html .= '</ul>';
            $html .= '</div>';
        }

        $html .= '</div>';
        $html .= '</div>';

        return $html;
    }

    /**
     * Render empty menu
     */
    protected function renderEmptyMenu($attributes)
    {
        $menuId = $attributes['menuId'] ?? '';
        $menuClass = $attributes['menuClass'] ?? 'jankx-responsive-menu';

        $wrapperAttributes = [
            'class' => $menuClass . ' menu-empty',
            'id' => $menuId ? "menu-{$menuId}" : ''
        ];

        $html = '<nav ' . $this->buildAttributes($wrapperAttributes) . '>';
        $html .= '<ul class="menu">';
        $html .= '<li class="menu-item menu-item-empty">';
        $html .= '<a href="#">' . __('Menu', 'jankx') . '</a>';
        $html .= '</li>';
        $html .= '</ul>';
        $html .= '</nav>';

        return $html;
    }

    /**
     * Build HTML attributes
     */
    protected function buildAttributes($attributes)
    {
        $html = '';
        
        foreach ($attributes as $name => $value) {
            if ($value !== null && $value !== '' && $value !== false) {
                $html .= esc_attr($name) . '="' . esc_attr($value) . '" ';
            }
        }

        return trim($html);
    }

    /**
     * Get menu by ID for widget
     */
    public function getMenuById($menuId)
    {
        return $this->getMenuData($menuId);
    }

    /**
     * Get all menus for selection
     */
    public function getAllMenus()
    {
        return $this->menuRepository->getAll();
    }

    /**
     * Check if menu exists
     */
    public function menuExists($menuId)
    {
        return $this->menuRepository->getById($menuId) !== null;
    }

    /**
     * Get menu statistics
     */
    public function getMenuStatistics($menuId)
    {
        return $this->menuRepository->getStatistics($menuId);
    }

    /**
     * Clear menu cache
     */
    public function clearCache($menuId = null)
    {
        if ($menuId) {
            wp_cache_delete("jankx_menu_{$menuId}", 'jankx_menu_builder');
        } else {
            // Clear all menu caches
            wp_cache_flush_group('jankx_menu_builder');
        }

        do_action('jankx_menu_builder_cache_cleared', $menuId);
    }
}
