<?php
/**
 * Asset Manager for Menu Builder
 * 
 * @package App\MenuBuilder\Assets
 * @since 1.0.0
 */

namespace App\MenuBuilder\Assets;

class AssetManager
{
    /**
     * Asset version
     */
    protected $version = '1.0.0';

    /**
     * Enqueue frontend assets
     */
    public function enqueueFrontendAssets()
    {
        // Enqueue responsive menu controller
        wp_enqueue_script(
            'jankx-menu-builder-responsive',
            get_theme_file_uri('/resources/blocks/menu-builder/build/responsive-menu.js'),
            ['jquery'],
            $this->version,
            true
        );

        // Enqueue mmenu.js if needed
        if ($this->shouldEnqueueMmenu()) {
            wp_enqueue_script(
                'mmenu-js',
                get_theme_file_uri('/resources/vendor/mmenu/mmenu.js'),
                [],
                '9.3.0',
                true
            );

            wp_enqueue_style(
                'mmenu-css',
                get_theme_file_uri('/resources/vendor/mmenu/mmenu.css'),
                [],
                '9.3.0'
            );
        }

        // Enqueue menu builder frontend styles
        wp_enqueue_style(
            'jankx-menu-builder-frontend',
            get_theme_file_uri('/resources/blocks/menu-builder/build/style.css'),
            [],
            $this->version
        );

        // Localize script
        wp_localize_script('jankx-menu-builder-responsive', 'jankxMenuBuilder', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jankx_menu_builder'),
            'breakpoints' => [
                'mobile' => 768,
                'desktop' => 1024
            ],
            'i18n' => [
                'closeMenu' => __('Close menu', 'jankx'),
                'openMenu' => __('Open menu', 'jankx'),
                'backToParent' => __('Back', 'jankx'),
                'submenuToggle' => __('Toggle submenu', 'jankx')
            ]
        ]);
    }

    /**
     * Enqueue block assets
     */
    public function enqueueBlockAssets()
    {
        // Enqueue block styles (both editor and frontend)
        wp_enqueue_style(
            'jankx-menu-builder-style',
            get_theme_file_uri('/resources/blocks/menu-builder/build/style.css'),
            [],
            $this->version
        );
    }

    /**
     * Enqueue editor assets
     */
    public function enqueueEditorAssets()
    {
        // Enqueue block editor script
        wp_enqueue_script(
            'jankx-menu-builder-editor',
            get_theme_file_uri('/resources/blocks/menu-builder/build/index.js'),
            ['wp-blocks', 'wp-element', 'wp-components', 'wp-editor', 'wp-data'],
            $this->version,
            true
        );

        // Enqueue block editor styles
        wp_enqueue_style(
            'jankx-menu-builder-editor',
            get_theme_file_uri('/resources/blocks/menu-builder/build/editor.css'),
            ['wp-edit-blocks'],
            $this->version
        );

        // Localize editor script
        wp_localize_script('jankx-menu-builder-editor', 'jankxMenuBuilderAdmin', [
            'apiUrl' => rest_url('jankx-menu-builder/v1'),
            'nonce' => wp_create_nonce('wp_rest'),
            'menuTypes' => [
                'link' => __('Link', 'jankx'),
                'button' => __('Button', 'jankx'),
                'dropdown' => __('Dropdown', 'jankx')
            ],
            'submenuTypes' => [
                'multilevel' => __('Multilevel Menu', 'jankx'),
                'mega' => __('Mega Menu', 'jankx'),
                'flyout' => __('Flyout Menu', 'jankx')
            ],
            'defaultSettings' => [
                'mobileBreakpoint' => 768,
                'desktopBreakpoint' => 1024,
                'enableMobileMenu' => true,
                'enableDesktopMenu' => true,
                'mobileMenuOptions' => [
                    'slidingSubmenus' => true,
                    'theme' => 'dark',
                    'position' => 'left',
                    'zposition' => 'back'
                ],
                'desktopMenuOptions' => [
                    'dropdownAnimation' => 'fade',
                    'hoverDelay' => 200,
                    'submenuTrigger' => 'hover'
                ],
                'submenuTypes' => [
                    'mega' => [
                        'enabled' => true,
                        'columns' => 4,
                        'fullWidth' => true
                    ],
                    'flyout' => [
                        'enabled' => true,
                        'position' => 'right',
                        'animation' => 'slide'
                    ],
                    'multilevel' => [
                        'enabled' => true,
                        'maxDepth' => 3
                    ]
                ]
            ]
        ]);
    }

    /**
     * Check if mmenu should be enqueued
     */
    protected function shouldEnqueueMmenu()
    {
        // Check if any menu block is present on the page
        global $wp_query;
        
        if ($wp_query->have_posts()) {
            while ($wp_query->have_posts()) {
                $wp_query->the_post();
                $content = get_the_content();
                
                if (has_block('jankx/menu-builder', $content)) {
                    wp_reset_postdata();
                    return true;
                }
            }
            wp_reset_postdata();
        }

        return false;
    }

    /**
     * Get asset version
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * Set asset version
     */
    public function setVersion($version)
    {
        $this->version = $version;
    }

    /**
     * Get asset URL with version
     */
    public function getAssetUrl($path)
    {
        return add_query_arg('ver', $this->version, get_theme_file_uri($path));
    }
}
