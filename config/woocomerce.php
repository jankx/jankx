<?php
/**
 * WooCommerce Layout Configuration
 * 
 * File này định nghĩa configuration cho tất cả các loại layout trong hệ thống.
 * Nếu value không set (null hoặc empty) thì sẽ fallback sang theme options.
 * 
 * @package CheepHub
 * 
 * APPLY EXPAND/COLLAPSE LAYOUT:
 * 1. Set 'use_accordion' => true trong product_category_block
 * 2. Set 'default_layout' => 'expand-collapse-category'
 * 3. Include functions-woocommerce-layouts.php trong functions.php
 * 
 * Xem: themes/cheephub/functions-woocommerce-layouts.php để biết cách khai báo
 */

return [
    /**
     * Product Detail Layout Configuration
     * 
     * Layout cho trang chi tiết sản phẩm
     */
    'product_detail' => [
        // Layout ID mặc định
        'default_layout' => 'default-product-detail',
        
        // Bật/tắt layout type
        'enabled' => true,
        
        // Settings cho layout
        'settings' => [
            // Gallery width (%)
            'gallery_width' => 50,
            
            // Hiển thị related products
            'show_related_products' => true,
            
            // Số cột related products
            'related_columns' => 4,
            
            // Sticky add to cart
            'sticky_add_to_cart' => true,
            
            // Layout structure: fullwidth, sidebar-left, sidebar-right
            'layout_structure' => 'fullwidth',
            
            // Primary color
            'primary_color' => '#0073aa',
            
            // Show product meta
            'show_meta' => true,
            
            // Show tabs
            'show_tabs' => true,
        ],
    ],

    /**
     * Product Loop Layout Configuration
     * 
     * Layout cho danh sách sản phẩm (shop, archive, category)
     */
    'product_loop' => [
        'default_layout' => 'grid-product-loop',
        'enabled' => true,
        'settings' => [
            // Số cột desktop
            'columns' => 4,
            
            // Số cột tablet
            'columns_tablet' => 3,
            
            // Số cột mobile
            'columns_mobile' => 2,
            
            // Item spacing (px)
            'item_spacing' => 20,
            
            // Border radius (px)
            'border_radius' => 5,
            
            // Show quick view button
            'show_quick_view' => true,
            
            // Hover effect: zoom, fade, slide, none
            'hover_effect' => 'zoom',
            
            // Show badges (sale, new, out of stock)
            'show_badges' => true,
            
            // Show product excerpt (for list layout)
            'show_excerpt' => false,
            
            // Image position for list layout: left, right
            'image_position' => 'left',
        ],
    ],

    /**
     * Product Category Block Layout Configuration
     * 
     * Layout cho hiển thị danh mục sản phẩm
     * Layouts available: grid-category-block, expand-collapse-category
     * 
     * Apply Expand/Collapse cho WooCommerce Product Categories block:
     * Set use_accordion = true và default_layout = 'expand-collapse-category'
     */
    'product_category_block' => [
        'default_layout' => 'grid-category-block', // grid-category-block hoặc expand-collapse-category
        'enabled' => true,
        
        // Enable accordion transform cho WooCommerce block
        'use_accordion' => true,
        'settings' => [
            // Số cột (for grid layout)
            'columns' => 4,
            
            // Display type: grid, list, masonry, accordion
            'display_type' => 'grid',
            
            // Show product count
            'show_count' => true,
            
            // Show category description
            'show_description' => false,
            
            // Image ratio: 1/1, 4/3, 16/9
            'image_ratio' => '1/1',
            
            // Show empty categories
            'show_empty_categories' => false,
            
            // === Expand/Collapse Layout Settings ===
            
            // Show subcategories when expanded
            'show_subcategories' => true,
            
            // Show product preview when expanded
            'show_product_preview' => true,
            
            // Default expanded state
            'default_expanded' => false,
            
            // Animation speed (ms)
            'animation_speed' => 300,
            
            // Accordion style: default, minimal, bordered, card
            'accordion_style' => 'card',
            
            // Icon style: plus-minus, arrow, chevron
            'icon_style' => 'plus-minus',
        ],
    ],

    /**
     * Product Gallery Layout Configuration
     * 
     * Layout cho gallery ảnh sản phẩm
     */
    'product_gallery' => [
        'default_layout' => 'flatsome-gallery',
        'enabled' => true,
        'settings' => [
            // Gallery type: slider, grid, stacked, horizontal, flatsome
            'gallery_type' => 'flatsome',
            
            // Thumbnail position: bottom, left, right
            'thumbnail_position' => 'bottom',
            
            // Thumbnail size (px)
            'thumbnail_size' => 80,
            
            // Thumbnail columns (for grid layout)
            'thumbnail_columns' => 5,
            
            // Zoom level (scale factor)
            'zoom_level' => 2,
            
            // Gallery width (%)
            'gallery_width' => 100,
            
            // Enable zoom
            'enable_zoom' => true,
            
            // Enable lightbox
            'enable_lightbox' => true,
            
            // Autoplay slider
            'autoplay' => false,
            
            // Autoplay speed (ms)
            'autoplay_speed' => 3000,
            
            // Show video (nếu có)
            'show_video' => true,
            
            // Enable 360 view (nếu support)
            'enable_360_view' => false,
        ],
    ],

    /**
     * Cart Form Layout Configuration
     * 
     * Layout cho mini cart, cart widget
     */
    'cart_form' => [
        'default_layout' => 'default-cart-form',
        'enabled' => true,
        'settings' => [
            // Show thumbnails
            'show_thumbnails' => true,
            
            // Thumbnail size (px)
            'thumbnail_size' => 60,
            
            // Editable (quantity change, remove items)
            'editable' => true,
            
            // Show item details
            'show_item_details' => true,
            
            // Show prices
            'show_prices' => true,
        ],
    ],

    /**
     * Cart Page Layout Configuration
     * 
     * Layout cho trang giỏ hàng
     */
    'cart_page' => [
        'default_layout' => 'default-cart-page',
        'enabled' => true,
        'settings' => [
            // Page layout: fullwidth, sidebar-left, sidebar-right
            'page_layout' => 'fullwidth',
            
            // Show cross-sells
            'show_cross_sells' => true,
            
            // Cross-sells columns
            'cross_sells_columns' => 4,
            
            // Show shipping calculator
            'show_shipping_calculator' => true,
            
            // Show coupon form
            'show_coupon_form' => true,
            
            // Table style: default, minimal, bordered
            'table_style' => 'default',
            
            // Table border color
            'table_border_color' => '#ddd',
            
            // Show continue shopping button
            'show_continue_shopping' => true,
        ],
    ],

    /**
     * Checkout Page Layout Configuration
     * 
     * Layout cho trang thanh toán
     */
    'checkout_page' => [
        'default_layout' => 'default-checkout',
        'enabled' => true,
        'settings' => [
            // Checkout layout: single-column, two-column, multi-step
            'layout_style' => 'two-column',
            
            // Multi-step checkout
            'multi_step' => false,
            
            // Number of steps (nếu multi-step)
            'steps_count' => 3,
            
            // Show progress bar (nếu multi-step)
            'show_progress_bar' => true,
            
            // Field spacing (px)
            'field_spacing' => 15,
            
            // Button color
            'button_color' => '#0073aa',
            
            // Show order notes
            'show_order_notes' => true,
            
            // Show coupon form
            'show_coupon_form' => true,
            
            // Show login form (for guest)
            'show_login_form' => true,
            
            // Sticky order review
            'sticky_order_review' => false,
        ],
    ],

    /**
     * Quick Checkout Layout Configuration
     * 
     * Layout cho quick checkout (custom feature)
     */
    'quick_checkout' => [
        'default_layout' => 'modal-quick-checkout',
        'enabled' => false, // Mặc định tắt, enable khi cần
        'settings' => [
            // Trigger type: modal, slide-in, inline
            'trigger_type' => 'modal',
            
            // Modal width (px)
            'modal_width' => 600,
            
            // Overlay color
            'overlay_color' => 'rgba(0,0,0,0.5)',
            
            // Enable one-click checkout
            'enable_one_click' => true,
            
            // Support saved addresses
            'support_saved_addresses' => true,
            
            // Show progress indicator
            'show_progress' => true,
            
            // Required fields only
            'required_fields' => [
                'billing_phone',
                'billing_email',
                'billing_address_1',
                'billing_city',
            ],
            
            // Quick payment methods (chỉ show popular)
            'quick_payment_methods' => ['cod', 'bacs', 'momo', 'vnpay'],
        ],
    ],

    /**
     * Global Settings
     * 
     * Settings áp dụng cho tất cả layouts
     */
    'global' => [
        // Primary color
        'primary_color' => '#0073aa',
        
        // Secondary color
        'secondary_color' => '#23282d',
        
        // Text color
        'text_color' => '#333333',
        
        // Border color
        'border_color' => '#dddddd',
        
        // Background color
        'background_color' => '#ffffff',
        
        // Default border radius (px)
        'border_radius' => 5,
        
        // Default spacing (px)
        'spacing' => 20,
        
        // Font family
        'font_family' => '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        
        // Font size base (px)
        'font_size_base' => 16,
        
        // Enable CSS cache
        'enable_cache' => true,
        
        // Cache expiration (seconds)
        'cache_expiration' => 3600,
        
        // Enable minification (production)
        'enable_minification' => !defined('WP_DEBUG') || !WP_DEBUG,
        
        // Responsive breakpoints (px)
        'breakpoint_mobile' => 480,
        'breakpoint_tablet' => 768,
        'breakpoint_desktop' => 1024,
        'breakpoint_wide' => 1280,
    ],

    /**
     * Advanced Options
     * 
     * Các options nâng cao
     */
    'advanced' => [
        // Allow layout override per product
        'allow_per_product_layout' => true,
        
        // Allow layout override per category
        'allow_per_category_layout' => true,
        
        // Enable A/B testing
        'enable_ab_testing' => false,
        
        // Enable layout analytics
        'enable_analytics' => false,
        
        // Debug mode (log layout info)
        'debug_mode' => defined('WP_DEBUG') && WP_DEBUG,
        
        // Custom SCSS import paths
        'scss_import_paths' => [
            // Thêm custom paths nếu cần
        ],
    ],
];

