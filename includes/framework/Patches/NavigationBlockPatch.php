<?php

namespace Jankx\Patches;

/**
 * Navigation Block Patch
 *
 * Khắc phục vấn đề "Undefined array key 'url'" trong navigation blocks
 * do plugin Otter Blocks hoặc các plugin khác gây ra
 */
class NavigationBlockPatch
{
    /**
     * Initialize the patch
     */
    public static function init()
    {
        add_filter('render_block_core/navigation-link', [__CLASS__, 'fix_navigation_link_url'], 10, 2);
        add_filter('render_block_core/navigation-submenu', [__CLASS__, 'fix_navigation_submenu_url'], 10, 2);
        add_filter('render_block_core/navigation', [__CLASS__, 'fix_navigation_url'], 10, 2);
    }

    /**
     * Fix navigation link block attributes
     */
    public static function fix_navigation_link_url($block_content, $block)
    {
        // Đảm bảo thuộc tính 'url' luôn tồn tại
        if (isset($block['attrs']) && !isset($block['attrs']['url'])) {
            $block['attrs']['url'] = '#';
        }

        // Đảm bảo thuộc tính 'label' luôn tồn tại
        if (isset($block['attrs']) && !isset($block['attrs']['label'])) {
            $block['attrs']['label'] = __('Link', 'jankx');
        }

        return $block_content;
    }

    /**
     * Fix navigation submenu block attributes
     */
    public static function fix_navigation_submenu_url($block_content, $block)
    {
        // Đảm bảo thuộc tính 'url' luôn tồn tại
        if (isset($block['attrs']) && !isset($block['attrs']['url'])) {
            $block['attrs']['url'] = '#';
        }

        // Đảm bảo thuộc tính 'label' luôn tồn tại
        if (isset($block['attrs']) && !isset($block['attrs']['label'])) {
            $block['attrs']['label'] = __('Submenu', 'jankx');
        }

        return $block_content;
    }

    /**
     * Fix navigation block attributes
     */
    public static function fix_navigation_url($block_content, $block)
    {
        // Đảm bảo thuộc tính cần thiết luôn tồn tại
        if (isset($block['attrs'])) {
            if (!isset($block['attrs']['overlayMenu'])) {
                $block['attrs']['overlayMenu'] = 'never';
            }

            if (!isset($block['attrs']['hasIcon'])) {
                $block['attrs']['hasIcon'] = false;
            }
        }

        return $block_content;
    }

    /**
     * Fix block attributes globally
     */
    public static function fix_block_attributes($block_content, $block)
    {
        // Kiểm tra và sửa các thuộc tính bị thiếu
        if (isset($block['attrs']) && is_array($block['attrs'])) {
            $block['attrs'] = self::ensure_required_attributes($block['attrs'], $block['blockName']);
        }

        return $block_content;
    }

    /**
     * Đảm bảo các thuộc tính cần thiết luôn tồn tại
     */
    private static function ensure_required_attributes($attrs, $block_name)
    {
        switch ($block_name) {
            case 'core/navigation-link':
                if (!isset($attrs['url'])) {
                    $attrs['url'] = '#';
                }
                if (!isset($attrs['label'])) {
                    $attrs['label'] = __('Link', 'jankx');
                }
                if (!isset($attrs['opensInNewTab'])) {
                    $attrs['opensInNewTab'] = false;
                }
                break;

            case 'core/navigation-submenu':
                if (!isset($attrs['url'])) {
                    $attrs['url'] = '#';
                }
                if (!isset($attrs['label'])) {
                    $attrs['label'] = __('Submenu', 'jankx');
                }
                if (!isset($attrs['opensInNewTab'])) {
                    $attrs['opensInNewTab'] = false;
                }
                break;

            case 'core/navigation':
                if (!isset($attrs['overlayMenu'])) {
                    $attrs['overlayMenu'] = 'never';
                }
                if (!isset($attrs['hasIcon'])) {
                    $attrs['hasIcon'] = false;
                }
                if (!isset($attrs['isResponsive'])) {
                    $attrs['isResponsive'] = true;
                }
                break;
        }

        return $attrs;
    }

    /**
     * Disable problematic plugins temporarily
     */
    public static function disable_problematic_plugins()
    {
        // Tạm thời vô hiệu hóa Otter Blocks nếu cần
        if (is_plugin_active('otter-blocks/otter-blocks.php')) {
            // Có thể thêm logic để vô hiệu hóa tạm thời
            add_filter('otter_blocks_navigation_filter', '__return_false');
        }
    }

    /**
     * Add error logging for debugging
     */
    public static function log_navigation_errors()
    {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            add_action('wp_footer', function () {
                if (isset($GLOBALS['wp_theme_debug']) && $GLOBALS['wp_theme_debug']) {
                    echo '<!-- Navigation Block Patch Active -->';
                }
            });
        }
    }
}
