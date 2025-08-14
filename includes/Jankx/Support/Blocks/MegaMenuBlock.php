<?php
/**
 * Mega Menu Block Class
 *
 * Class này xử lý Mega Menu Block trong Jankx Framework
 * với đầy đủ tính năng: accordion, flyout, custom icons, responsive
 *
 * @package Jankx\Support\Blocks
 * @since 2.0.0
 */

namespace Jankx\Support\Blocks;

use Jankx\Support\Blocks\Block;

/**
 * Mega Menu Block
 *
 * Block này cho phép người dùng tạo mega menu với giao diện thiết kế trực quan
 * bao gồm tất cả các tính năng: accordion, flyout, custom icons, typography, colors
 */
class MegaMenuBlock extends Block
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/mega-menu', [
            'title' => 'Mega Menu',
            'category' => 'theme',
            'icon' => 'menu',
            'description' => 'Tạo mega menu với giao diện thiết kế trực quan trong editor',
            'keywords' => ['menu', 'mega', 'navigation', 'dropdown'],
            'supports' => [
                'html' => false,
                'align' => ['wide', 'full'],
                'spacing' => [
                    'margin' => true,
                    'padding' => true
                ],
                'color' => [
                    'background' => true,
                    'text' => true
                ]
            ],
            'attributes' => [
                'menuId' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'menuLocation' => [
                    'type' => 'string',
                    'default' => 'primary'
                ],
                'menuStyle' => [
                    'type' => 'string',
                    'default' => 'horizontal'
                ],
                'mobileBreakpoint' => [
                    'type' => 'number',
                    'default' => 768
                ],
                'showMobileToggle' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'mobileToggleText' => [
                    'type' => 'string',
                    'default' => 'Menu'
                ],
                'megaMenuWidth' => [
                    'type' => 'string',
                    'default' => 'container'
                ],
                'megaMenuAlignment' => [
                    'type' => 'string',
                    'default' => 'left'
                ],
                'enableAccordion' => [
                    'type' => 'boolean',
                    'default' => false
                ],
                'enableFlyout' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'flyoutDirection' => [
                    'type' => 'string',
                    'default' => 'right'
                ],
                'customIcons' => [
                    'type' => 'boolean',
                    'default' => false
                ],
                'iconLibrary' => [
                    'type' => 'string',
                    'default' => 'fontawesome'
                ],
                'menuItems' => [
                    'type' => 'array',
                    'default' => []
                ],
                'backgroundColor' => [
                    'type' => 'string'
                ],
                'textColor' => [
                    'type' => 'string'
                ],
                'hoverBackgroundColor' => [
                    'type' => 'string'
                ],
                'hoverTextColor' => [
                    'type' => 'string'
                ],
                'borderColor' => [
                    'type' => 'string'
                ],
                'borderRadius' => [
                    'type' => 'number',
                    'default' => 0
                ],
                'fontFamily' => [
                    'type' => 'string',
                    'default' => 'inherit'
                ],
                'fontSize' => [
                    'type' => 'number',
                    'default' => 16
                ],
                'fontWeight' => [
                    'type' => 'string',
                    'default' => '400'
                ],
                'lineHeight' => [
                    'type' => 'number',
                    'default' => 1.5
                ],
                'letterSpacing' => [
                    'type' => 'number',
                    'default' => 0
                ],
                'textTransform' => [
                    'type' => 'string',
                    'default' => 'none'
                ],
                'className' => [
                    'type' => 'string'
                ]
            ]
        ]);
    }

    /**
     * Register the block
     *
     * @return void
     */
    public function register()
    {
        try {
            $block_path = $this->getBlockPath();
            $metadata = $this->getMetadata();

            // Enqueue block assets
            $this->enqueueAssets($block_path, $metadata);

            // Register block type with WordPress
            register_block_type(
                $this->getBlockMetadataPath(),
                [
                    'render_callback' => [$this, 'render'],
                    'attributes' => $this->attributes
                ]
            );
        } catch (Exception $e) {
            // Log error but don't break the site
            error_log('MegaMenuBlock registration failed: ' . $e->getMessage());
        }
    }

        /**
     * Render the block
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '')
    {
        try {
            // Include the render callback file
            $render_file = $this->getBlockPath('mega-menu.php');
            
            if (file_exists($render_file)) {
                ob_start();
                include $render_file;
                return ob_get_clean();
            }

            // Fallback render if file doesn't exist
            return $this->renderFallback($attributes);
        } catch (Exception $e) {
            // Log error and return fallback
            error_log('MegaMenuBlock render failed: ' . $e->getMessage());
            return $this->renderFallback($attributes);
        }
    }

    /**
     * Fallback render method
     *
     * @param array $attributes Block attributes
     * @return string Fallback HTML
     */
    protected function renderFallback($attributes)
    {
        $menu_id = $attributes['menuId'] ?? '';
        $menu_location = $attributes['menuLocation'] ?? 'primary';
        $menu_style = $attributes['menuStyle'] ?? 'horizontal';
        $show_mobile_toggle = $attributes['showMobileToggle'] ?? true;
        $mobile_toggle_text = $attributes['mobileToggleText'] ?? 'Menu';

        $output = '<div class="mega-menu-block">';

        if ($menu_id && function_exists('wp_nav_menu')) {
            $output .= wp_nav_menu([
                'menu' => $menu_id,
                'theme_location' => $menu_location,
                'menu_class' => "mega-menu-list {$menu_style}",
                'container' => 'nav',
                'container_class' => 'mega-menu-container',
                'echo' => false
            ]);
        } else {
            $output .= '<nav class="mega-menu-container">';
            $output .= '<ul class="mega-menu-list">';
            $output .= '<li class="mega-menu-item"><a href="#" class="mega-menu-link">Home</a></li>';
            $output .= '<li class="mega-menu-item"><a href="#" class="mega-menu-link">About</a></li>';
            $output .= '<li class="mega-menu-item"><a href="#" class="mega-menu-link">Services</a></li>';
            $output .= '<li class="mega-menu-item"><a href="#" class="mega-menu-link">Contact</a></li>';
            $output .= '</ul>';
            $output .= '</nav>';
        }

        if ($show_mobile_toggle) {
            $output .= '<button class="mobile-menu-toggle">';
            $output .= '<span>' . esc_html($mobile_toggle_text) . '</span>';
            $output .= '</button>';
        }

        $output .= '</div>';

        return $output;
    }

    /**
     * Get block path
     *
     * @param string $file File name
     * @return string Full file path
     */
    protected function getBlockPath($file = '')
    {
        $block_dir = get_template_directory() . '/resources/blocks/mega-menu';

        if ($file) {
            return $block_dir . '/' . $file;
        }

        return $block_dir;
    }

    /**
     * Get block metadata path
     *
     * @return string Block metadata file path
     */
    protected function getBlockMetadataPath()
    {
        return $this->getBlockPath('block.json');
    }

    /**
     * Get block metadata
     *
     * @return array Block metadata
     */
    protected function getMetadata()
    {
        $metadata_file = $this->getBlockMetadataPath();

        if (file_exists($metadata_file)) {
            $metadata_content = file_get_contents($metadata_file);
            return json_decode($metadata_content, true) ?: [];
        }

        return [];
    }

        /**
     * Enqueue block assets
     *
     * @param string $blockPath Block path
     * @param array $metadata Block metadata
     * @return void
     */
    protected function enqueueAssets($blockPath, $metadata)
    {
        try {
            // Call parent method first
            parent::enqueueAssets($blockPath, $metadata);

            // Additional custom asset enqueuing if needed
            $block_dir = $this->getBlockPath();
            $build_dir = $block_dir . '/build';

            // Enqueue editor script
            $editor_script = $build_dir . '/index.js';
            $editor_asset = $build_dir . '/index.asset.php';
            
            if (file_exists($editor_script) && file_exists($editor_asset)) {
                $asset_data = include $editor_asset;
                wp_enqueue_script(
                    'jankx-mega-menu-editor',
                    get_template_directory_uri() . '/resources/blocks/mega-menu/build/index.js',
                    $asset_data['dependencies'] ?? [],
                    $asset_data['version'] ?? filemtime($editor_script)
                );
            }

            // Enqueue editor style
            $editor_style = $build_dir . '/index.css.css';
            if (file_exists($editor_style)) {
                wp_enqueue_style(
                    'jankx-mega-menu-editor',
                    get_template_directory_uri() . '/resources/blocks/mega-menu/build/index.css.css',
                    [],
                    filemtime($editor_style)
            );
            }

            // Enqueue frontend style
            $frontend_style = $build_dir . '/style.css.css';
            if (file_exists($frontend_style)) {
                wp_enqueue_style(
                    'jankx-mega-menu-frontend',
                    get_template_directory_uri() . '/resources/blocks/mega-menu/build/style.css.css',
                    [],
                    filemtime($frontend_style)
                );
            }
        } catch (Exception $e) {
            // Log error but don't break the site
            error_log('MegaMenuBlock asset enqueuing failed: ' . $e->getMessage());
        }
    }
}
