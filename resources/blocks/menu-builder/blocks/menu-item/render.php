<?php
/**
 * Menu Item Block - Frontend Render
 * 
 * @package JankX\MenuBuilder\Blocks
 * @since 1.0.0
 */

namespace JankX\MenuBuilder\Blocks;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render menu item block
 */
function render_menu_item_block($attributes, $content, $block) {
    if (!isset($attributes['itemId']) || empty($attributes['itemId'])) {
        return '';
    }

    // Get block context
    $context = $block->context;
    $menu_id = $context['jankx/menuId'] ?? '';
    $menu_class = $context['jankx/menuClass'] ?? 'jankx-responsive-menu';
    
    // Build menu item attributes
    $item_id = esc_attr($attributes['itemId']);
    $label = esc_html($attributes['label'] ?? 'Menu Item');
    $url = esc_url($attributes['url'] ?? '#');
    $type = esc_attr($attributes['type'] ?? 'link');
    $submenu_type = esc_attr($attributes['submenuType'] ?? 'none');
    $target = esc_attr($attributes['target'] ?? '_self');
    $rel = esc_attr($attributes['rel'] ?? '');
    $css_class = esc_attr($attributes['cssClass'] ?? '');
    $icon = esc_attr($attributes['icon'] ?? '');
    $is_active = $attributes['isActive'] ?? true;
    
    if (!$is_active) {
        return '';
    }

    // Build CSS classes
    $classes = ['menu-item'];
    if ($type === 'button') {
        $classes[] = 'menu-item-button';
    }
    if ($submenu_type !== 'none') {
        $classes[] = 'has-children';
        $classes[] = 'submenu-type-' . $submenu_type;
    }
    if ($css_class) {
        $classes[] = $css_class;
    }
    
    $menu_item_class = esc_attr(implode(' ', $classes));
    
    // Build rel attributes
    $rel_attr = '';
    if ($rel) {
        $rel_attr = ' rel="' . $rel . '"';
    }
    
    // Build target attributes
    $target_attr = '';
    if ($target === '_blank') {
        $target_attr = ' target="' . $target . '"';
        if (!$rel) {
            $rel_attr = ' rel="noopener noreferrer"';
        }
    }
    
    // Build icon
    $icon_html = '';
    if ($icon) {
        $icon_html = '<span class="menu-item-icon">' . wp_kses_post($icon) . '</span>';
    }
    
    // Build submenu data attributes
    $submenu_data = '';
    if ($submenu_type !== 'none') {
        $submenu_data = ' data-submenu-type="' . $submenu_type . '"';
        
        // Add specific attributes for different submenu types
        switch ($submenu_type) {
            case 'mega':
                $columns = intval($attributes['megaMenuColumns'] ?? 4);
                $full_width = $attributes['megaMenuFullWidth'] ?? true;
                $submenu_data .= ' data-mega-columns="' . $columns . '"';
                $submenu_data .= ' data-mega-full-width="' . ($full_width ? 'true' : 'false') . '"';
                break;
                
            case 'flyout':
                $position = esc_attr($attributes['flyoutPosition'] ?? 'right');
                $width = esc_attr($attributes['flyoutWidth'] ?? '300px');
                $submenu_data .= ' data-flyout-position="' . $position . '"';
                $submenu_data .= ' data-flyout-width="' . $width . '"';
                break;
                
            case 'multilevel':
                $max_depth = intval($attributes['multilevelMaxDepth'] ?? 3);
                $submenu_data .= ' data-multilevel-max-depth="' . $max_depth . '"';
                break;
        }
    }
    
    // Check if current URL matches the menu item URL
    $current_url = $_SERVER['REQUEST_URI'] ?? '';
    $parsed_url = parse_url($url, PHP_URL_PATH);
    $is_current = ($parsed_url && $current_url === $parsed_url) || ($url === home_url($current_url));
    
    if ($is_current) {
        $menu_item_class .= ' current-menu-item';
    }
    
    // Build the menu item HTML
    $html = '<li class="' . $menu_item_class . '" id="menu-item-' . $item_id . '"' . $submenu_data . '>';
    
    if ($type === 'button') {
        $html .= '<button type="button" class="menu-item-link" aria-label="' . esc_attr($label) . '">';
    } else {
        $html .= '<a href="' . $url . '" class="menu-item-link"' . $target_attr . $rel_attr . '>';
    }
    
    $html .= $icon_html;
    $html .= '<span class="menu-item-text">' . $label . '</span>';
    
    if ($type === 'button') {
        $html .= '</button>';
    } else {
        $html .= '</a>';
    }
    
    // Add submenu placeholder (will be populated by child blocks)
    if ($submenu_type !== 'none') {
        $submenu_class = 'submenu submenu-' . $submenu_type;
        $html .= '<div class="' . $submenu_class . '">';
        $html .= '<div class="submenu-container">';
        $html .= '<ul class="submenu-list">';
        $html .= $content;
        $html .= '</ul>';
        $html .= '</div>';
        $html .= '</div>';
    }
    
    $html .= '</li>';
    
    return $html;
}

