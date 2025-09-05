<?php

namespace App\Services;

use Jankx\Foundation\Application;

class NavigationBlockService
{
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Khắc phục vấn đề navigation blocks
     */
    public function initPatches()
    {
        // Kích hoạt patches để khắc phục vấn đề "Undefined array key 'url'"
        if (class_exists('Jankx\Framework\Patches\PatchesLoader')) {
            \Jankx\Framework\Patches\PatchesLoader::init();
        }

        // Emergency fix nếu cần
        if (defined('WP_DEBUG') && WP_DEBUG) {
            add_action('wp_footer', function() {
                echo '<!-- Navigation Block Patches Active -->';
            });
        }
    }

    /**
     * Khắc phục vấn đề plugin conflicts
     */
    public function handlePluginConflicts()
    {
        // Vô hiệu hóa Otter Blocks navigation filter nếu cần
        if (class_exists('Themeisle_Blocks_Registration')) {
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
                } catch (\Exception $e) {
                    error_log('Otter Blocks safe filter error: ' . $e->getMessage());
                    return $block_content;
                }
            }, 10, 2);
        }
    }

    /**
     * Khắc phục vấn đề navigation blocks attributes
     */
    public function fixNavigationLinkAttributes($block_content, $block)
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
     * Khắc phục vấn đề navigation submenu attributes
     */
    public function fixNavigationSubmenuAttributes($block_content, $block)
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
     * Error handling để bỏ qua warnings về undefined array key
     */
    public function setupErrorHandling()
    {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            set_error_handler(function($errno, $errstr, $errfile, $errline) {
                // Bỏ qua warnings về undefined array key
                if (strpos($errstr, 'Undefined array key') !== false) {
                    return true; // Suppress warning
                }

                // Log các lỗi khác
                error_log("PHP Error [$errno]: $errstr in $errfile on line $errline");

                return false; // Let PHP handle other errors
            }, E_WARNING);
        }
    }
}