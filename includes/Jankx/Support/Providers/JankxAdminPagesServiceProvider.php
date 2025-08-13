<?php

namespace Jankx\Support\Providers;

use Jankx\Facades\Config;
use Jankx\Support\Providers\ServiceProvider;
use Jankx\Foundation\Application;
use Jankx\Services\AdminPageService;

class JankxAdminPagesServiceProvider extends ServiceProvider
{
    protected $app;

    public function register(Application $app)
    {
        if (!is_admin()) {
            return;
        }

        $this->app = $app;

        // Register AdminPageService
        $app->singleton('jankx.admin-pages', function ($app) {
            return new AdminPageService($app);
        });

        // Register IconImportService
        $app->singleton('jankx.icon-import', function ($app) {
            return new \Jankx\Services\FontIcons\IconImportService($app);
        });
    }

    public function boot(Application $app)
    {
        if (!is_admin()) {
            return;
        }

        // Register admin menu
        add_action('admin_menu', [$this, 'registerAdminMenu']);

        // Enqueue admin styles
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminStyles']);

        // Handle page requests
        add_action('admin_init', [$this, 'handlePageRequests']);
    }

    /**
     * Đăng ký admin menu chính cho Jankx Framework
     */
    public function registerAdminMenu()
    {
        // Main menu
        add_menu_page(
            Config::get('app.admin_page_title', 'Jankx Framework'), // Page title
            Config::get('app.menu_title', 'Jankx Framework'), // Menu title
            'manage_options', // Capability
            'jankx-settings', // Menu slug
            [$this, 'renderMainPage'], // Callback
            'dashicons-art', // Icon
            Config::get('app.menu_position', 59) // Position
        );

        // Get admin pages service
        $adminPages = $this->app->make('jankx.admin-pages');
        $pages = $adminPages->getAllPages();

        // Register submenus
        foreach ($pages as $page) {
            if ($page['id'] === 'jankx-dashboard') {
                // Dashboard is the main page
                continue;
            }

            add_submenu_page(
                'jankx-settings', // Parent slug
                $page['title'], // Page title
                $page['menu_title'], // Menu title
                $page['capability'], // Capability
                $page['id'], // Menu slug
                [$this, 'renderSubPage'] // Callback
            );
        }
    }

    /**
     * Render trang chính (Dashboard)
     */
    public function renderMainPage()
    {
        $adminPages = $this->app->make('jankx.admin-pages');
        $adminPages->renderPage('jankx-dashboard');
    }

    /**
     * Render sub pages
     */
    public function renderSubPage()
    {
        $pageId = $_GET['page'] ?? '';
        if (empty($pageId)) {
            wp_die('Page not found');
        }

        $adminPages = $this->app->make('jankx.admin-pages');
        $adminPages->renderPage($pageId);
    }

    /**
     * Enqueue admin styles
     */
    public function enqueueAdminStyles()
    {
        $screen = get_current_screen();
        if (strpos($screen->id, 'jankx') !== false) {
            wp_enqueue_style(
                'jankx-admin-pages',
                $this->app->make('jankx.urls')['base'] . '/assets/css/admin-pages.css',
                [],
                $this->app->make('jankx.version') ?? '1.0.0'
            );
        }
    }

    /**
     * Handle page requests
     */
    public function handlePageRequests()
    {
        // Handle AJAX requests if needed
        if (wp_doing_ajax()) {
            $this->handleAjaxRequests();
        }

        // Handle form submissions if needed
        if ($_POST && isset($_POST['jankx_action'])) {
            $this->handleFormSubmission($_POST);
        }
    }

    /**
     * Handle AJAX requests
     */
    public function handleAjaxRequests()
    {
        $action = $_POST['action'] ?? '';

        switch ($action) {
            case 'jankx_load_icons':
                $adminPages = $this->app->make('jankx.admin-pages');
                $adminPages->handleLoadIconsAjax();
                break;
        }
    }

    /**
     * Handle form submissions
     */
    protected function handleFormSubmission($data)
    {
        $action = $data['jankx_action'] ?? '';

        switch ($action) {
            case 'update_icon_settings':
                $this->handleIconSettingsUpdate($data);
                break;
            case 'refresh_icons':
                $this->handleIconsRefresh($data);
                break;
            default:
                // Unknown action
                break;
        }
    }

    /**
     * Handle icon settings update
     */
    protected function handleIconSettingsUpdate($data)
    {
        // Verify nonce
        if (!wp_verify_nonce($data['_wpnonce'] ?? '', 'jankx_icon_settings')) {
            wp_die('Security check failed');
        }

        // Update icon settings
        $iconType = $data['icon_type'] ?? '';
        $enabled = isset($data['enabled']);
        $autoLoad = isset($data['auto_load']);

        if (!empty($iconType)) {
            // Update configuration
            $this->updateIconTypeConfig($iconType, [
                'enabled' => $enabled,
                'auto_load' => $autoLoad
            ]);

            // Redirect with success message
            wp_redirect(add_query_arg('updated', '1', admin_url('admin.php?page=jankx-icons')));
            exit;
        }
    }

    /**
     * Handle icons refresh
     */
    protected function handleIconsRefresh($data)
    {
        // Verify nonce
        if (!wp_verify_nonce($data['_wpnonce'] ?? '', 'jankx_refresh_icons')) {
            wp_die('Security check failed');
        }

        $iconType = $data['icon_type'] ?? '';

        if (!empty($iconType)) {
            try {
                // Get transformer service
                $transformer = $this->app->make('font-icons.transformer');
                if ($transformer) {
                    // Refresh icons for specific type
                    $this->refreshIconType($iconType, $transformer);

                    // Redirect with success message
                    wp_redirect(add_query_arg('refreshed', '1', admin_url('admin.php?page=jankx-icons')));
                    exit;
                }
            } catch (\Exception $e) {
                // Redirect with error message
                wp_redirect(add_query_arg('error', urlencode($e->getMessage()), admin_url('admin.php?page=jankx-icons')));
                exit;
            }
        }
    }

    /**
     * Update icon type configuration
     */
    protected function updateIconTypeConfig($iconType, $config)
    {
        // Get current config
        $currentConfig = $this->app->make('config')->get("font-icons.icon_types.{$iconType}", []);

        // Merge with new config
        $newConfig = array_merge($currentConfig, $config);

        // Update config
        $this->app->make('config')->set("font-icons.icon_types.{$iconType}", $newConfig);

        // Save to WordPress options for persistence
        update_option("jankx_icon_type_{$iconType}_config", $newConfig);
    }

    /**
     * Refresh icon type
     */
    protected function refreshIconType($iconType, $transformer)
    {
        // Get icon type config
        $typeConfig = $this->app->make('config')->get("font-icons.icon_types.{$iconType}", []);

        if (empty($typeConfig['cdn_url'])) {
            throw new \Exception("No CDN URL configured for icon type: {$iconType}");
        }

        // Transform CSS to JSON
        $cssUrl = $typeConfig['cdn_url'];
        $outputPath = $this->app->make('jankx.paths')['base'] . "/resources/icons/{$iconType}/icons.json";

        // Ensure output directory exists
        $outputDir = dirname($outputPath);
        if (!is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        // Transform and save
        $transformer->transformAndSave($cssUrl, $iconType, $outputPath);
    }

    /**
     * Get service name
     */
    public function getName()
    {
        return 'jankx-admin-pages';
    }
}
