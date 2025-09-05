<?php

namespace Jankx\Framework\Patches;

/**
 * WordPress Core Patch
 *
 * Khắc phục các vấn đề của WordPress core và plugin conflicts
 */
class WordPressCorePatch
{
    /**
     * Initialize the patch
     */
    public static function init()
    {
        // Khắc phục vấn đề navigation blocks
        add_action('init', [__CLASS__, 'fix_navigation_blocks']);

        // Khắc phục vấn đề plugin conflicts
        add_action('init', [__CLASS__, 'fix_plugin_conflicts']);

        // Thêm error handling
        add_action('init', [__CLASS__, 'add_error_handling']);
    }

    /**
     * Fix navigation blocks issues
     */
    public static function fix_navigation_blocks()
    {
        // Hook vào quá trình render blocks để sửa lỗi
        add_filter('render_block_data', [__CLASS__, 'fix_block_data'], 10, 2);

        // Hook vào quá trình render để sửa lỗi cuối cùng
        add_filter('render_block', [__CLASS__, 'fix_block_rendering'], 10, 2);
    }

    /**
     * Fix plugin conflicts
     */
    public static function fix_plugin_conflicts()
    {
        // Vô hiệu hóa Otter Blocks navigation filter nếu cần
        if (class_exists('Themeisle_Blocks_Registration')) {
            remove_filter('render_block', [Themeisle_Blocks_Registration::class, 'load_font_awesome'], 10);
            add_filter('render_block', [__CLASS__, 'safe_otter_blocks_filter'], 10, 2);
        }

        // Vô hiệu hóa các filter có thể gây xung đột
        remove_all_filters('render_block_core/navigation-link');
        remove_all_filters('render_block_core/navigation-submenu');

        // Thêm lại filter an toàn
        add_filter('render_block_core/navigation-link', [__CLASS__, 'safe_navigation_link_render'], 10, 2);
        add_filter('render_block_core/navigation-submenu', [__CLASS__, 'safe_navigation_submenu_render'], 10, 2);
    }

    /**
     * Add error handling
     */
    public static function add_error_handling()
    {
        // Bắt lỗi PHP warnings
        set_error_handler([__CLASS__, 'custom_error_handler'], E_WARNING);

        // Bắt lỗi fatal errors
        register_shutdown_function([__CLASS__, 'shutdown_error_handler']);
    }

    /**
     * Fix block data before rendering
     */
    public static function fix_block_data($block, $source_block)
    {
        if (!isset($block['attrs'])) {
            $block['attrs'] = [];
        }

        // Sửa navigation blocks
        if (in_array($block['blockName'], ['core/navigation-link', 'core/navigation-submenu'])) {
            $block['attrs'] = self::ensure_navigation_attributes($block['attrs']);
        }

        return $block;
    }

    /**
     * Fix block rendering
     */
    public static function fix_block_rendering($block_content, $block)
    {
        // Sửa lỗi cuối cùng nếu có
        if (empty($block_content) && isset($block['blockName'])) {
            $block_content = self::generate_fallback_content($block);
        }

        return $block_content;
    }

    /**
     * Safe Otter Blocks filter
     */
    public static function safe_otter_blocks_filter($block_content, $block)
    {
        // Chỉ áp dụng filter cho các block không phải navigation
        if (in_array($block['blockName'], ['core/navigation-link', 'core/navigation-submenu', 'core/navigation'])) {
            return $block_content;
        }

        // Áp dụng filter gốc một cách an toàn
        if (class_exists('Themeisle_Blocks_Registration')) {
            try {
                return Themeisle_Blocks_Registration::load_font_awesome($block_content, $block);
            } catch (Exception $e) {
                // Log error nhưng không crash
                error_log('Otter Blocks filter error: ' . $e->getMessage());
                return $block_content;
            }
        }

        return $block_content;
    }

    /**
     * Safe navigation link render
     */
    public static function safe_navigation_link_render($block_content, $block)
    {
        try {
            // Đảm bảo các thuộc tính cần thiết
            $attrs = isset($block['attrs']) ? $block['attrs'] : [];
            $attrs = self::ensure_navigation_attributes($attrs);

            // Render an toàn
            return self::render_navigation_link($attrs, $block_content);
        } catch (Exception $e) {
            error_log('Navigation link render error: ' . $e->getMessage());
            return self::generate_fallback_navigation_link($block);
        }
    }

    /**
     * Safe navigation submenu render
     */
    public static function safe_navigation_submenu_render($block_content, $block)
    {
        try {
            // Đảm bảo các thuộc tính cần thiết
            $attrs = isset($block['attrs']) ? $block['attrs'] : [];
            $attrs = self::ensure_navigation_attributes($attrs);

            // Render an toàn
            return self::render_navigation_submenu($attrs, $block_content);
        } catch (Exception $e) {
            error_log('Navigation submenu render error: ' . $e->getMessage());
            return self::generate_fallback_navigation_submenu($block);
        }
    }

    /**
     * Ensure navigation attributes exist
     */
    private static function ensure_navigation_attributes($attrs)
    {
        $defaults = [
            'url' => '#',
            'label' => __('Link', 'jankx'),
            'opensInNewTab' => false,
            'rel' => '',
            'title' => '',
            'className' => '',
        ];

        return wp_parse_args($attrs, $defaults);
    }

    /**
     * Render navigation link safely
     */
    private static function render_navigation_link($attrs, $fallback_content)
    {
        if (empty($fallback_content)) {
            $label = esc_html($attrs['label']);
            $url = esc_url($attrs['url']);
            $target = $attrs['opensInNewTab'] ? ' target="_blank"' : '';
            $rel = !empty($attrs['rel']) ? ' rel="' . esc_attr($attrs['rel']) . '"' : '';
            $title = !empty($attrs['title']) ? ' title="' . esc_attr($attrs['title']) . '"' : '';
            $class = !empty($attrs['className']) ? ' class="' . esc_attr($attrs['className']) . '"' : '';

            return sprintf(
                '<li class="wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content" href="%s"%s%s%s%s><span class="wp-block-navigation-item__label">%s</span></a></li>',
                $url,
                $target,
                $rel,
                $title,
                $class,
                $label
            );
        }

        return $fallback_content;
    }

    /**
     * Render navigation submenu safely
     */
    private static function render_navigation_submenu($attrs, $fallback_content)
    {
        if (empty($fallback_content)) {
            $label = esc_html($attrs['label']);
            $url = esc_url($attrs['url']);
            $target = $attrs['opensInNewTab'] ? ' target="_blank"' : '';
            $rel = !empty($attrs['rel']) ? ' rel="' . esc_attr($attrs['rel']) . '"' : '';
            $title = !empty($attrs['title']) ? ' title="' . esc_attr($attrs['title']) . '"' : '';
            $class = !empty($attrs['className']) ? ' class="' . esc_attr($attrs['className']) . '"' : '';

            return sprintf(
                '<li class="wp-block-navigation-item wp-block-navigation-submenu"><a class="wp-block-navigation-item__content" href="%s"%s%s%s%s><span class="wp-block-navigation-item__label">%s</span></a></li>',
                $url,
                $target,
                $rel,
                $title,
                $class,
                $label
            );
        }

        return $fallback_content;
    }

    /**
     * Generate fallback content
     */
    private static function generate_fallback_content($block)
    {
        switch ($block['blockName']) {
            case 'core/navigation-link':
                return self::generate_fallback_navigation_link($block);
            case 'core/navigation-submenu':
                return self::generate_fallback_navigation_submenu($block);
            default:
                return '';
        }
    }

    /**
     * Generate fallback navigation link
     */
    private static function generate_fallback_navigation_link($block)
    {
        $attrs = isset($block['attrs']) ? $block['attrs'] : [];
        $attrs = self::ensure_navigation_attributes($attrs);

        return self::render_navigation_link($attrs, '');
    }

    /**
     * Generate fallback navigation submenu
     */
    private static function generate_fallback_navigation_submenu($block)
    {
        $attrs = isset($block['attrs']) ? $block['attrs'] : [];
        $attrs = self::ensure_navigation_attributes($attrs);

        return self::render_navigation_submenu($attrs, '');
    }

    /**
     * Custom error handler
     */
    public static function custom_error_handler($errno, $errstr, $errfile, $errline)
    {
        // Bỏ qua warnings về undefined array key
        if (strpos($errstr, 'Undefined array key') !== false) {
            return true; // Suppress warning
        }

        // Log các lỗi khác
        error_log("PHP Error [$errno]: $errstr in $errfile on line $errline");

        return false; // Let PHP handle other errors
    }

    /**
     * Shutdown error handler
     */
    public static function shutdown_error_handler()
    {
        $error = error_get_last();
        if ($error && $error['type'] === E_ERROR) {
            error_log('Fatal Error: ' . $error['message'] . ' in ' . $error['file'] . ' on line ' . $error['line']);
        }
    }
}
