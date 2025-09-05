<?php

namespace Jankx\Framework\Patches;

/**
 * Patches Loader
 *
 * Kích hoạt tất cả các patch để khắc phục vấn đề
 */
class PatchesLoader
{
    /**
     * Initialize all patches
     */
    public static function init()
    {
        // Kích hoạt Navigation Block Patch
        NavigationBlockPatch::init();

        // Kích hoạt WordPress Core Patch
        WordPressCorePatch::init();

        // Kích hoạt các patch khác nếu cần
        self::init_additional_patches();

        // Log activation
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('Jankx Framework Patches activated');
        }
    }

    /**
     * Initialize additional patches
     */
    private static function init_additional_patches()
    {
        // Patch cho WooCommerce nếu cần
        if (class_exists('WooCommerce')) {
            self::init_woocommerce_patches();
        }

        // Patch cho các plugin khác
        self::init_plugin_patches();
    }

    /**
     * Initialize WooCommerce patches
     */
    private static function init_woocommerce_patches()
    {
        // Khắc phục vấn đề WooCommerce với navigation blocks
        add_filter('woocommerce_navigation_block_render', [__CLASS__, 'fix_woocommerce_navigation'], 10, 2);
    }

    /**
     * Initialize plugin patches
     */
    private static function init_plugin_patches()
    {
        // Patch cho Otter Blocks
        if (class_exists('Themeisle_Blocks_Registration')) {
            self::patch_otter_blocks();
        }

        // Patch cho các plugin khác
        self::patch_other_plugins();
    }

    /**
     * Patch Otter Blocks
     */
    private static function patch_otter_blocks()
    {
        // Vô hiệu hóa filter có thể gây xung đột
        add_action('init', function() {
            if (has_filter('render_block', ['Themeisle_Blocks_Registration', 'load_font_awesome'])) {
                remove_filter('render_block', ['Themeisle_Blocks_Registration', 'load_font_awesome'], 10);

                // Thêm filter an toàn
                add_filter('render_block', function($block_content, $block) {
                    // Chỉ áp dụng cho các block không phải navigation
                    if (in_array($block['blockName'], ['core/navigation-link', 'core/navigation-submenu', 'core/navigation'])) {
                        return $block_content;
                    }

                    // Áp dụng filter gốc một cách an toàn
                    try {
                        return \Themeisle_Blocks_Registration::load_font_awesome($block_content, $block);
                    } catch (Exception $e) {
                        error_log('Otter Blocks safe filter error: ' . $e->getMessage());
                        return $block_content;
                    }
                }, 10, 2);
            }
        });
    }

    /**
     * Patch other plugins
     */
    private static function patch_other_plugins()
    {
        // Patch cho Jetpack
        if (class_exists('Jetpack')) {
            self::patch_jetpack();
        }

        // Patch cho Yoast SEO
        if (class_exists('WPSEO_Admin')) {
            self::patch_yoast_seo();
        }
    }

    /**
     * Patch Jetpack
     */
    private static function patch_jetpack()
    {
        // Khắc phục vấn đề Jetpack với navigation blocks
        add_filter('jetpack_navigation_block_render', [__CLASS__, 'fix_jetpack_navigation'], 10, 2);
    }

    /**
     * Patch Yoast SEO
     */
    private static function patch_yoast_seo()
    {
        // Khắc phục vấn đề Yoast SEO với navigation blocks
        add_filter('wpseo_navigation_block_render', [__CLASS__, 'fix_yoast_navigation'], 10, 2);
    }

    /**
     * Fix WooCommerce navigation
     */
    public static function fix_woocommerce_navigation($block_content, $block)
    {
        // Đảm bảo navigation blocks có đủ thuộc tính
        if (in_array($block['blockName'], ['core/navigation-link', 'core/navigation-submenu'])) {
            $block['attrs'] = wp_parse_args($block['attrs'], [
                'url' => '#',
                'label' => __('Link', 'jankx'),
                'opensInNewTab' => false,
            ]);
        }

        return $block_content;
    }

    /**
     * Fix Jetpack navigation
     */
    public static function fix_jetpack_navigation($block_content, $block)
    {
        // Khắc phục vấn đề Jetpack
        return $block_content;
    }

    /**
     * Fix Yoast navigation
     */
    public static function fix_yoast_navigation($block_content, $block)
    {
        // Khắc phục vấn đề Yoast
        return $block_content;
    }

    /**
     * Emergency fix for critical issues
     */
    public static function emergency_fix()
    {
        // Vô hiệu hóa tất cả filter có thể gây xung đột
        remove_all_filters('render_block_core/navigation-link');
        remove_all_filters('render_block_core/navigation-submenu');
        remove_all_filters('render_block_core/navigation');

        // Thêm filter an toàn
        add_filter('render_block_core/navigation-link', [__CLASS__, 'emergency_navigation_render'], 10, 2);
        add_filter('render_block_core/navigation-submenu', [__CLASS__, 'emergency_navigation_render'], 10, 2);
        add_filter('render_block_core/navigation', [__CLASS__, 'emergency_navigation_render'], 10, 2);
    }

    /**
     * Emergency navigation render
     */
    public static function emergency_navigation_render($block_content, $block)
    {
        // Render đơn giản và an toàn
        if (empty($block_content)) {
            $attrs = isset($block['attrs']) ? $block['attrs'] : [];
            $label = isset($attrs['label']) ? $attrs['label'] : __('Link', 'jankx');
            $url = isset($attrs['url']) ? $attrs['url'] : '#';

            if ($block['blockName'] === 'core/navigation-link') {
                return sprintf(
                    '<li class="wp-block-navigation-item wp-block-navigation-link"><a href="%s">%s</a></li>',
                    esc_url($url),
                    esc_html($label)
                );
            } elseif ($block['blockName'] === 'core/navigation-submenu') {
                return sprintf(
                    '<li class="wp-block-navigation-item wp-block-navigation-submenu"><a href="%s">%s</a></li>',
                    esc_url($url),
                    esc_html($label)
                );
            }
        }

        return $block_content;
    }

    /**
     * Check if patches are working
     */
    public static function check_patches_status()
    {
        $status = [
            'navigation_block_patch' => has_filter('render_block_core/navigation-link'),
            'wordpress_core_patch' => has_filter('render_block_data'),
            'otter_blocks_patched' => !has_filter('render_block', ['Themeisle_Blocks_Registration', 'load_font_awesome']),
        ];

        return $status;
    }
}
