<?php
/**
 * Menu Builder Service Provider
 * 
 * @package App\MenuBuilder
 * @since 1.0.0
 */

namespace App\MenuBuilder;

use App\MenuBuilder\Database\MenuRepository;
use App\MenuBuilder\Database\MenuItemRepository;
use App\MenuBuilder\API\MenuAPI;
use App\MenuBuilder\Renderer\MenuRenderer;
use App\MenuBuilder\Assets\AssetManager;
use JankX\Support\Providers\ServiceProvider as AbstractServiceProvider;

class ServiceProvider extends AbstractServiceProvider
{
    /**
     * Service provider name
     */
    protected $name = 'menu_builder';

    /**
     * Register services
     */
    public function register(\Jankx\Foundation\Application $app): void
    {
        // Register repositories
        $this->app->singleton(MenuRepository::class, function () {
            return new MenuRepository();
        });

        $this->app->singleton(MenuItemRepository::class, function () {
            return new MenuItemRepository();
        });

        // Register API
        $this->app->singleton(MenuAPI::class, function ($app) {
            return new MenuAPI(
                $app[MenuRepository::class],
                $app[MenuItemRepository::class]
            );
        });

        // Register renderer
        $this->app->singleton(MenuRenderer::class, function ($app) {
            return new MenuRenderer(
                $app[MenuRepository::class],
                $app[MenuItemRepository::class],
                $app[AssetManager::class]
            );
        });

        // Register asset manager
        $this->app->singleton(AssetManager::class, function ($app) {
            return new AssetManager();
        });
    }

    /**
     * Boot services
     */
    public function boot(\Jankx\Foundation\Application $app): void
    {
        // Boot database migrations
        $this->bootDatabaseMigrations();

        // Boot API endpoints
        $this->bootAPIEndpoints();

        // Boot assets
        $this->bootAssets();

        // Boot Gutenberg block
        $this->bootGutenbergBlock();

        // Boot frontend menu rendering
        $this->bootFrontendRendering();

        // Register hooks
        $this->registerHooks();
    }

    /**
     * Boot database migrations
     */
    protected function bootDatabaseMigrations()
    {
        add_action('init', function () {
            $this->createTables();
        });
    }

    /**
     * Create database tables
     */
    protected function createTables()
    {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        // Menus table
        $table_name = $wpdb->prefix . 'jankx_menus';
        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            slug varchar(255) NOT NULL,
            description text DEFAULT NULL,
            settings longtext DEFAULT NULL,
            status varchar(20) DEFAULT 'active',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY slug (slug),
            KEY status (status)
        ) $charset_collate;";

        // Menu items table
        $table_name = $wpdb->prefix . 'jankx_menu_items';
        $sql .= "CREATE TABLE IF NOT EXISTS $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            menu_id bigint(20) unsigned NOT NULL,
            parent_id bigint(20) unsigned DEFAULT 0,
            label varchar(255) NOT NULL,
            url varchar(500) DEFAULT NULL,
            type varchar(50) DEFAULT 'link',
            submenu_type varchar(20) DEFAULT 'multilevel',
            order_index int(11) DEFAULT 0,
            settings longtext DEFAULT NULL,
            status varchar(20) DEFAULT 'active',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY menu_id (menu_id),
            KEY parent_id (parent_id),
            KEY order_index (order_index),
            KEY status (status),
            FOREIGN KEY (menu_id) REFERENCES {$wpdb->prefix}jankx_menus(id) ON DELETE CASCADE
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    /**
     * Boot API endpoints
     */
    protected function bootAPIEndpoints()
    {
        add_action('rest_api_init', function () {
            $this->app[MenuAPI::class]->registerRoutes();
        });
    }

    /**
     * Boot assets
     */
    protected function bootAssets()
    {
        add_action('wp_enqueue_scripts', function () {
            $this->app[AssetManager::class]->enqueueFrontendAssets();
        });

        add_action('enqueue_block_assets', function () {
            $this->app[AssetManager::class]->enqueueBlockAssets();
        });

        add_action('enqueue_block_editor_assets', function () {
            $this->app[AssetManager::class]->enqueueEditorAssets();
        });
    }

    /**
     * Boot Gutenberg block
     */
    protected function bootGutenbergBlock()
    {
        add_action('init', function () {
            // Register main menu builder block
            register_block_type_from_metadata(
                JANKX_THEME_DIR . '/resources/blocks/menu-builder/block.fixed.json',
                [
                    'render_callback' => [$this->app[MenuRenderer::class], 'renderBlock'],
                    'attributes' => [
                        'menuId' => [
                            'type' => 'string',
                            'default' => ''
                        ],
                        'menuClass' => [
                            'type' => 'string',
                            'default' => 'jankx-responsive-menu'
                        ],
                        'mobileBreakpoint' => [
                            'type' => 'number',
                            'default' => 768
                        ],
                        'desktopBreakpoint' => [
                            'type' => 'number',
                            'default' => 1024
                        ],
                        'enableMobileMenu' => [
                            'type' => 'boolean',
                            'default' => true
                        ],
                        'enableDesktopMenu' => [
                            'type' => 'boolean',
                            'default' => true
                        ],
                        'mobileMenuOptions' => [
                            'type' => 'object',
                            'default' => [
                                'slidingSubmenus' => true,
                                'theme' => 'dark',
                                'position' => 'left',
                                'zposition' => 'back'
                            ]
                        ],
                        'desktopMenuOptions' => [
                            'type' => 'object',
                            'default' => [
                                'dropdownAnimation' => 'fade',
                                'hoverDelay' => 200,
                                'submenuTrigger' => 'hover'
                            ]
                        ],
                        'submenuTypes' => [
                            'type' => 'object',
                            'default' => [
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
                    ]
                ]
            );

            $menu_item_render = get_template_directory() . '/resources/blocks/menu-builder/blocks/menu-item/render.php';
            if (file_exists($menu_item_render)) {
                require_once $menu_item_render;
            }
            register_block_type('jankx/menu-builder/menu-item', [
                'render_callback' => '\\JankX\\MenuBuilder\\Blocks\\render_menu_item_block',
                'attributes' => [
                    'itemId' => ['type' => 'string', 'default' => ''],
                    'label' => ['type' => 'string', 'default' => 'Menu Item'],
                    'url' => ['type' => 'string', 'default' => '#'],
                    'type' => ['type' => 'string', 'default' => 'link'],
                    'submenuType' => ['type' => 'string', 'default' => 'none'],
                    'icon' => ['type' => 'string', 'default' => ''],
                    'target' => ['type' => 'string', 'default' => '_self'],
                    'rel' => ['type' => 'string', 'default' => ''],
                    'cssClass' => ['type' => 'string', 'default' => ''],
                    'megaMenuColumns' => ['type' => 'number', 'default' => 4],
                    'megaMenuFullWidth' => ['type' => 'boolean', 'default' => true],
                    'flyoutPosition' => ['type' => 'string', 'default' => 'right'],
                    'flyoutWidth' => ['type' => 'string', 'default' => '300px'],
                    'multilevelMaxDepth' => ['type' => 'number', 'default' => 3],
                    'isActive' => ['type' => 'boolean', 'default' => true],
                    'orderIndex' => ['type' => 'number', 'default' => 0],
                ],
                'supports' => [
                    'anchor' => true,
                    'customClassName' => true,
                    'html' => false,
                    'multiple' => false,
                    'reusable' => false,
                ],
            ]);
        });

        // Add block categories
        add_filter('block_categories_all', function ($categories) {
            return array_merge(
                $categories,
                [
                    [
                        'slug' => 'jankx',
                        'title' => __('JankX Theme', 'jankx'),
                        'icon' => 'menu-alt',
                    ],
                ]
            );
        });
    }

    /**
     * Boot frontend rendering
     */
    protected function bootFrontendRendering()
    {
        // Register shortcode
        add_shortcode('jankx_menu', function ($atts) {
            return $this->app[MenuRenderer::class]->renderShortcode($atts);
        });

        // Register widget
        add_action('widgets_init', function () {
            register_widget('App\\MenuBuilder\\Widget\\MenuWidget');
        });
    }

    /**
     * Register hooks
     */
    protected function registerHooks()
    {
        // Menu management hooks
        add_action('jankx_menu_builder_menu_created', function ($menuId) {
            do_action('jankx_menu_builder_clear_cache', $menuId);
        });

        add_action('jankx_menu_builder_menu_updated', function ($menuId) {
            do_action('jankx_menu_builder_clear_cache', $menuId);
        });

        add_action('jankx_menu_builder_menu_deleted', function ($menuId) {
            do_action('jankx_menu_builder_clear_cache', $menuId);
        });

        // Menu item management hooks
        add_action('jankx_menu_builder_menu_item_created', function ($itemId, $menuId) {
            do_action('jankx_menu_builder_clear_cache', $menuId);
        }, 10, 2);

        add_action('jankx_menu_builder_menu_item_updated', function ($itemId, $menuId) {
            do_action('jankx_menu_builder_clear_cache', $menuId);
        }, 10, 2);

        add_action('jankx_menu_builder_menu_item_deleted', function ($itemId, $menuId) {
            do_action('jankx_menu_builder_clear_cache', $menuId);
        }, 10, 2);
    }

    /**
     * Get service provider priority
     */
    public function getPriority()
    {
        return 20; // Load after core providers
    }
}
