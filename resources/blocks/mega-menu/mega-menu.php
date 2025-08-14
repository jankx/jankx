<?php
/**
 * Mega Menu Block Render Callback
 *
 * File này xử lý việc render Mega Menu Block trên frontend
 * với đầy đủ tính năng: accordion, flyout, custom icons, responsive
 */

/**
 * Render Mega Menu Block
 *
 * @param array $attributes Block attributes
 * @param string $content Block content
 * @return string Rendered HTML
 */
function jankx_mega_menu_render($attributes, $content = '') {
    // Extract attributes
    $menu_id = $attributes['menuId'] ?? '';
    $menu_location = $attributes['menuLocation'] ?? 'primary';
    $menu_style = $attributes['menuStyle'] ?? 'horizontal';
    $mobile_breakpoint = $attributes['mobileBreakpoint'] ?? 768;
    $show_mobile_toggle = $attributes['showMobileToggle'] ?? true;
    $mobile_toggle_text = $attributes['mobileToggleText'] ?? 'Menu';
    $mega_menu_width = $attributes['megaMenuWidth'] ?? 'container';
    $mega_menu_alignment = $attributes['megaMenuAlignment'] ?? 'left';
    $enable_accordion = $attributes['enableAccordion'] ?? false;
    $enable_flyout = $attributes['enableFlyout'] ?? true;
    $flyout_direction = $attributes['flyoutDirection'] ?? 'right';
    $custom_icons = $attributes['customIcons'] ?? false;
    $icon_library = $attributes['iconLibrary'] ?? 'fontawesome';
    $menu_items = $attributes['menuItems'] ?? [];

    // Style attributes
    $background_color = $attributes['backgroundColor'] ?? '';
    $text_color = $attributes['textColor'] ?? '';
    $hover_background_color = $attributes['hoverBackgroundColor'] ?? '';
    $hover_text_color = $attributes['hoverTextColor'] ?? '';
    $border_color = $attributes['borderColor'] ?? '';
    $border_radius = $attributes['borderRadius'] ?? 0;
    $font_family = $attributes['fontFamily'] ?? '';
    $font_size = $attributes['fontSize'] ?? 16;
    $font_weight = $attributes['fontWeight'] ?? '400';
    $line_height = $attributes['lineHeight'] ?? 1.5;
    $letter_spacing = $attributes['letterSpacing'] ?? 0;
    $text_transform = $attributes['textTransform'] ?? 'none';
    $class_name = $attributes['className'] ?? '';

    // Build CSS variables
    $css_variables = array();
    if ($background_color) $css_variables[] = "--mega-menu-bg: {$background_color}";
    if ($text_color) $css_variables[] = "--mega-menu-text: {$text_color}";
    if ($hover_background_color) $css_variables[] = "--mega-menu-hover-bg: {$hover_background_color}";
    if ($hover_text_color) $css_variables[] = "--mega-menu-hover-text: {$hover_text_color}";
    if ($border_color) $css_variables[] = "--mega-menu-border: {$border_color}";
    if ($border_radius) $css_variables[] = "--mega-menu-radius: {$border_radius}px";
    if ($font_family && $font_family !== 'inherit') $css_variables[] = "--mega-menu-font-family: {$font_family}";
    if ($font_size) $css_variables[] = "--mega-menu-font-size: {$font_size}px";
    if ($font_weight) $css_variables[] = "--mega-menu-font-weight: {$font_weight}";
    if ($line_height) $css_variables[] = "--mega-menu-line-height: {$line_height}";
    if ($letter_spacing) $css_variables[] = "--mega-menu-letter-spacing: {$letter_spacing}px";
    if ($text_transform) $css_variables[] = "--mega-menu-text-transform: {$text_transform}";

    // Build CSS classes
    $css_classes = array(
        'mega-menu',
        $menu_style,
        $mega_menu_width,
        "align-{$mega_menu_alignment}"
    );

    if ($enable_accordion) {
        $css_classes[] = 'accordion';
    }

    if ($enable_flyout) {
        $css_classes[] = 'flyout';
    }

    if ($class_name) {
        $css_classes[] = $class_name;
    }

    // Build inline styles
    $inline_styles = array();
    if ($background_color) $inline_styles[] = "background-color: {$background_color}";
    if ($text_color) $inline_styles[] = "color: {$text_color}";
    if ($border_radius) $inline_styles[] = "border-radius: {$border_radius}px";
    if ($font_family && $font_family !== 'inherit') $inline_styles[] = "font-family: {$font_family}";
    if ($font_size) $inline_styles[] = "font-size: {$font_size}px";
    if ($font_weight) $inline_styles[] = "font-weight: {$font_weight}";
    if ($line_height) $inline_styles[] = "line-height: {$line_height}";
    if ($letter_spacing) $inline_styles[] = "letter-spacing: {$letter_spacing}px";
    if ($text_transform) $inline_styles[] = "text-transform: {$text_transform}";

    // Start building HTML
    $output = '<div class="mega-menu-block" data-mobile-breakpoint="' . esc_attr($mobile_breakpoint) . '">';

    // Add CSS variables
    if (!empty($css_variables)) {
        $output .= '<style>';
        $output .= '.mega-menu-block { ' . implode('; ', $css_variables) . '; }';
        $output .= '</style>';
    }

    // Mobile menu toggle
    if ($show_mobile_toggle) {
        $output .= '<button class="mobile-menu-toggle" aria-label="' . esc_attr($mobile_toggle_text) . '">';
        $output .= '<span>' . esc_html($mobile_toggle_text) . '</span>';
        $output .= '<svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">';
        $output .= '<path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
        $output .= '</svg>';
        $output .= '</button>';
    }

    // Main menu container
    $output .= '<nav class="' . esc_attr(implode(' ', $css_classes)) . '"';
    if (!empty($inline_styles)) {
        $output .= ' style="' . esc_attr(implode('; ', $inline_styles)) . '"';
    }
    $output .= '>';

    // Menu list
    $output .= '<ul class="mega-menu-list">';

    if (!empty($menu_items)) {
        $output .= render_menu_items($menu_items, $custom_icons, $icon_library, $enable_flyout, $flyout_direction);
    } else {
        // Fallback to WordPress menu if no custom items
        $output .= render_wordpress_menu($menu_id, $menu_location);
    }

    $output .= '</ul>';
    $output .= '</nav>';

    $output .= '</div>';

    // Add JavaScript for mobile functionality
    $output .= get_mega_menu_javascript($mobile_breakpoint, $enable_accordion);

    return $output;
}

/**
 * Render custom menu items
 *
 * @param array $menu_items Menu items array
 * @param bool $custom_icons Whether custom icons are enabled
 * @param string $icon_library Icon library to use
 * @param bool $enable_flyout Whether flyout is enabled
 * @param string $flyout_direction Flyout direction
 * @return string Rendered menu items HTML
 */
function render_menu_items($menu_items, $custom_icons, $icon_library, $enable_flyout, $flyout_direction) {
    $output = '';

    foreach ($menu_items as $item) {
        $item_classes = array('mega-menu-item');

        if (!empty($item['customClasses'])) {
            $item_classes[] = esc_attr($item['customClasses']);
        }

        if ($item['isMegaMenu']) {
            $item_classes[] = 'has-mega-menu';
        }

        if ($item['hasChildren']) {
            $item_classes[] = 'has-children';
        }

        $output .= '<li class="' . implode(' ', $item_classes) . '">';

        // Menu link
        $output .= '<a href="' . esc_url($item['url']) . '"';
        if ($item['target'] === '_blank') {
            $output .= ' target="_blank" rel="noopener noreferrer"';
        }
        $output .= ' class="mega-menu-link">';

        // Icon
        if ($custom_icons && !empty($item['icon'])) {
            $output .= get_icon_html($item['icon'], $icon_library);
        }

        // Title
        $output .= '<span>' . esc_html($item['title']) . '</span>';

        // Dropdown arrow for items with children
        if ($item['hasChildren']) {
            $output .= '<svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">';
            $output .= '<path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
            $output .= '</svg>';
        }

        $output .= '</a>';

        // Mega menu panel
        if ($item['isMegaMenu'] && !empty($item['megaMenuContent'])) {
            $output .= '<div class="mega-menu-panel"';
            if ($item['megaMenuColumns']) {
                $output .= ' style="grid-template-columns: repeat(' . intval($item['megaMenuColumns']) . ', 1fr);"';
            }
            $output .= '>';
            $output .= '<div class="mega-menu-panel-content">';
            $output .= wp_kses_post($item['megaMenuContent']);
            $output .= '</div>';
            $output .= '</div>';
        }

        // Sub menu
        if ($item['hasChildren'] && !empty($item['children'])) {
            $sub_menu_classes = array('sub-menu');
            if ($enable_flyout) {
                $sub_menu_classes[] = "flyout-{$flyout_direction}";
            }

            $output .= '<ul class="' . implode(' ', $sub_menu_classes) . '">';
            foreach ($item['children'] as $child) {
                $output .= render_sub_menu_item($child, $custom_icons, $icon_library);
            }
            $output .= '</ul>';
        }

        $output .= '</li>';
    }

    return $output;
}

/**
 * Render sub menu item
 *
 * @param array $item Sub menu item
 * @param bool $custom_icons Whether custom icons are enabled
 * @param string $icon_library Icon library to use
 * @return string Rendered sub menu item HTML
 */
function render_sub_menu_item($item, $custom_icons, $icon_library) {
    $output = '<li class="sub-menu-item">';

    $output .= '<a href="' . esc_url($item['url']) . '"';
    if ($item['target'] === '_blank') {
        $output .= ' target="_blank" rel="noopener noreferrer"';
    }
    $output .= ' class="sub-menu-link">';

    // Icon
    if ($custom_icons && !empty($item['icon'])) {
        $output .= get_icon_html($item['icon'], $icon_library);
    }

    // Title
    $output .= '<span>' . esc_html($item['title']) . '</span>';

    $output .= '</a>';

    $output .= '</li>';

    return $output;
}

/**
 * Get icon HTML based on library
 *
 * @param string $icon Icon class or identifier
 * @param string $library Icon library
 * @return string Icon HTML
 */
function get_icon_html($icon, $library) {
    switch ($library) {
        case 'fontawesome':
            return '<i class="' . esc_attr($icon) . '"></i>';

        case 'dashicons':
            return '<span class="dashicons ' . esc_attr($icon) . '"></span>';

        case 'custom':
            // For custom SVG icons, assume the icon is the SVG content
            return $icon;

        default:
            return '<i class="' . esc_attr($icon) . '"></i>';
    }
}

/**
 * Render WordPress menu as fallback
 *
 * @param string $menu_id Menu ID
 * @param string $menu_location Menu location
 * @return string Rendered WordPress menu HTML
 */
function render_wordpress_menu($menu_id, $menu_location) {
    if (!empty($menu_id)) {
        // Try to render specific menu by ID
        $menu_items = wp_get_nav_menu_items($menu_id);
        if ($menu_items) {
            return render_wordpress_menu_items($menu_items);
        }
    }

    // Fallback to location-based menu
    $locations = get_nav_menu_locations();
    if (isset($locations[$menu_location])) {
        $menu_id = $locations[$menu_location];
        $menu_items = wp_get_nav_menu_items($menu_id);
        if ($menu_items) {
            return render_wordpress_menu_items($menu_items);
        }
    }

    // Default empty state
    return '<li class="mega-menu-item"><span class="mega-menu-link">' . __('No menu found', 'jankx') . '</span></li>';
}

/**
 * Render WordPress menu items
 *
 * @param array $menu_items WordPress menu items
 * @return string Rendered menu items HTML
 */
function render_wordpress_menu_items($menu_items) {
    $output = '';
    $menu_tree = build_menu_tree($menu_items);

    foreach ($menu_tree as $item) {
        $output .= render_wordpress_menu_item($item);
    }

    return $output;
}

/**
 * Build menu tree from flat menu items
 *
 * @param array $menu_items Flat menu items
 * @return array Menu tree
 */
function build_menu_tree($menu_items) {
    $tree = array();
    $lookup = array();

    // Create lookup table
    foreach ($menu_items as $item) {
        $lookup[$item->ID] = (array) $item;
        $lookup[$item->ID]['children'] = array();
    }

    // Build tree
    foreach ($lookup as $id => $item) {
        if ($item['menu_item_parent'] == 0) {
            $tree[] = &$lookup[$id];
        } else {
            $lookup[$item['menu_item_parent']]['children'][] = &$lookup[$id];
        }
    }

    return $tree;
}

/**
 * Render WordPress menu item
 *
 * @param array $item Menu item
 * @return string Rendered menu item HTML
 */
function render_wordpress_menu_item($item) {
    $output = '<li class="mega-menu-item">';

    $output .= '<a href="' . esc_url($item['url']) . '" class="mega-menu-link">';
    $output .= '<span>' . esc_html($item['title']) . '</span>';

    if (!empty($item['children'])) {
        $output .= '<svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">';
        $output .= '<path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
        $output .= '</svg>';
    }

    $output .= '</a>';

    // Sub menu
    if (!empty($item['children'])) {
        $output .= '<ul class="sub-menu">';
        foreach ($item['children'] as $child) {
            $output .= render_wordpress_menu_item($child);
        }
        $output .= '</ul>';
    }

    $output .= '</li>';

    return $output;
}

/**
 * Get JavaScript for mega menu functionality
 *
 * @param int $mobile_breakpoint Mobile breakpoint
 * @param bool $enable_accordion Whether accordion is enabled
 * @return string JavaScript code
 */
function get_mega_menu_javascript($mobile_breakpoint, $enable_accordion) {
    $script = '<script type="text/javascript">';
    $script .= 'document.addEventListener("DOMContentLoaded", function() {';
    $script .= 'const megaMenu = document.querySelector(".mega-menu-block");';
    $script .= 'if (!megaMenu) return;';

    // Mobile toggle functionality
    $script .= 'const mobileToggle = megaMenu.querySelector(".mobile-menu-toggle");';
    $script .= 'const menuNav = megaMenu.querySelector(".mega-menu");';
    $script .= 'if (mobileToggle && menuNav) {';
    $script .= 'mobileToggle.addEventListener("click", function() {';
    $script .= 'menuNav.classList.toggle("mobile-open");';
    $script .= 'this.setAttribute("aria-expanded", menuNav.classList.contains("mobile-open"));';
    $script .= '});';
    $script .= '}';

    // Accordion functionality
    if ($enable_accordion) {
        $script .= 'const accordionItems = megaMenu.querySelectorAll(".mega-menu-item.has-children");';
        $script .= 'accordionItems.forEach(function(item) {';
        $script .= 'const link = item.querySelector(".mega-menu-link");';
        $script .= 'if (link) {';
        $script .= 'link.addEventListener("click", function(e) {';
        $script .= 'if (window.innerWidth <= ' . intval($mobile_breakpoint) . ') {';
        $script .= 'e.preventDefault();';
        $script .= 'item.classList.toggle("active");';
        $script .= '}';
        $script .= '});';
        $script .= '}';
        $script .= '});';
    }

    // Responsive behavior
    $script .= 'function handleResize() {';
    $script .= 'if (window.innerWidth > ' . intval($mobile_breakpoint) . ') {';
    $script .= 'menuNav.classList.remove("mobile-open");';
    $script .= 'if (mobileToggle) {';
    $script .= 'mobileToggle.setAttribute("aria-expanded", "false");';
    $script .= '}';
    $script .= '}';
    $script .= '}';

    $script .= 'window.addEventListener("resize", handleResize);';
    $script .= 'handleResize();';

    // Keyboard navigation
    $script .= 'const menuLinks = megaMenu.querySelectorAll(".mega-menu-link, .sub-menu-link");';
    $script .= 'menuLinks.forEach(function(link) {';
    $script .= 'link.addEventListener("keydown", function(e) {';
    $script .= 'if (e.key === "Enter" || e.key === " ") {';
    $script .= 'e.preventDefault();';
    $script .= 'this.click();';
    $script .= '}';
    $script .= '});';
    $script .= '});';

    // Close menu when clicking outside
    $script .= 'document.addEventListener("click", function(e) {';
    $script .= 'if (!megaMenu.contains(e.target)) {';
    $script .= 'menuNav.classList.remove("mobile-open");';
    $script .= 'if (mobileToggle) {';
    $script .= 'mobileToggle.setAttribute("aria-expanded", "false");';
    $script .= '}';
    $script .= '}';
    $script .= '});';

    // Escape key to close menu
    $script .= 'document.addEventListener("keydown", function(e) {';
    $script .= 'if (e.key === "Escape") {';
    $script .= 'menuNav.classList.remove("mobile-open");';
    $script .= 'if (mobileToggle) {';
    $script .= 'mobileToggle.setAttribute("aria-expanded", "false");';
    $script .= '}';
    $script .= '}';
    $script .= '});';

    $script .= '});';
    $script .= '</script>';

    return $script;
}

// Register the render callback
if (function_exists('register_block_type')) {
    add_action('init', function() {
        register_block_type('jankx/mega-menu', array(
            'render_callback' => 'jankx_mega_menu_render'
        ));
    });
}
