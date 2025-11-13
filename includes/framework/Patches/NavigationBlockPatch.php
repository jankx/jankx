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
        add_filter('render_block_data', [__CLASS__, 'ensure_navigation_attrs'], 9, 2);
        add_filter('register_block_type_args', [__CLASS__, 'override_navigation_render_callback'], 10, 2);
    }

    public static function override_navigation_render_callback($args, $name)
    {
        if ($name === 'core/navigation-link' || $name === 'core/navigation-submenu') {
            $originalCallback = $args['render_callback'] ?? null;

            $args['render_callback'] = function ($attributes, $content, $block) use ($name, $originalCallback) {
                $attributes = NavigationBlockPatch::prepareNavigationAttributes($attributes, $name);

                if (is_callable($originalCallback)) {
                    return call_user_func($originalCallback, $attributes, $content, $block);
                }

                if ($name === 'core/navigation-submenu') {
                    return render_block_core_navigation_submenu($attributes, $content, $block);
                }

                if ($name === 'core/navigation-link') {
                    return render_block_core_navigation_link($attributes, $content, $block);
                }

                return $content;
            };
        }

        return $args;
    }

    protected static function prepareNavigationAttributes($attributes, string $blockName): array
    {
        if (!is_array($attributes)) {
            $attributes = [];
        }

        if (!array_key_exists('label', $attributes) || $attributes['label'] === null) {
            $attributes['label'] = $blockName === 'core/navigation-submenu' ? __('Submenu', 'jankx') : __('Link', 'jankx');
        }

        if (!array_key_exists('url', $attributes) || $attributes['url'] === null) {
            $attributes['url'] = '#';
        }

        if (!array_key_exists('opensInNewTab', $attributes)) {
            $attributes['opensInNewTab'] = false;
        }

        return $attributes;
    }

    public static function ensure_navigation_attrs($parsed_block, $source_block)
    {
        if (!isset($parsed_block['blockName'])) {
            return $parsed_block;
        }

        if (!in_array($parsed_block['blockName'], ['core/navigation-link', 'core/navigation-submenu'], true)) {
            return $parsed_block;
        }

        if (!isset($parsed_block['attrs']) || !is_array($parsed_block['attrs'])) {
            $parsed_block['attrs'] = [];
        }

        if (!array_key_exists('url', $parsed_block['attrs']) || $parsed_block['attrs']['url'] === null) {
            $parsed_block['attrs']['url'] = '#';
        }

        if (!array_key_exists('label', $parsed_block['attrs']) || $parsed_block['attrs']['label'] === null) {
            $parsed_block['attrs']['label'] = __('Link', 'jankx');
        }

        if (!array_key_exists('opensInNewTab', $parsed_block['attrs'])) {
            $parsed_block['attrs']['opensInNewTab'] = false;
        }

        return $parsed_block;
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
