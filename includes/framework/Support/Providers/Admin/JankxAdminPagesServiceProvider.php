<?php

namespace Jankx\Support\Providers\Admin;

use Jankx\Facades\Config;
use Jankx\Facades\Framework;
use Jankx\Foundation\Application;
use Jankx\Services\AdminPageService;
use Jankx\Support\Providers\ServiceProvider;

class JankxAdminPagesServiceProvider extends ServiceProvider
{
    protected $app;

    public function shouldLoadAdmin(): bool
    {
        return true;
    }

    public function shouldLoadFrontend(): bool
    {
        return false;
    }

    public function shouldLoadAjax(): bool
    {
        return false;
    }

    public function shouldLoadCron(): bool
    {
        return false;
    }

    public function shouldLoadRest(): bool
    {
        return false;
    }

    public function register(Application $app)
    {
        $this->app = $app;

        // Register AdminPageService
        $app->singleton('jankx.admin-pages', function ($app) {
            return new AdminPageService($app);
        });
    }

    public function boot(Application $app)
    {
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
        $adminPages = $this->app->make('jankx.admin-pages');
        $pages = $adminPages->getAllPages();
        $mainPage = $pages['jankx-settings'] ?? reset($pages);

        if (!$mainPage) {
            return;
        }

        // Main menu
        add_menu_page(
            $mainPage['title'], // Page title
            Config::get('app.menu_title', 'Jankx'), // Menu title
            'manage_options', // Capability
            $mainPage['id'], // Menu slug
            [$this, 'renderSubPage'], // Callback
            'dashicons-art', // Icon
            Config::get('app.menu_position', 59) // Position
        );

        // Register all pages as submenus (including the first one to make it appear as sub item)
        foreach ($pages as $page) {
            add_submenu_page(
                $mainPage['id'], // Parent slug
                $page['title'], // Page title
                $page['menu_title'], // Menu title
                $page['capability'], // Capability
                $page['id'], // Menu slug
                [$this, 'renderSubPage'], // Callback,
                $page['position']
            );
        }

        // Tích hợp Theme Options từ ThemeOptionsService
        $this->integrateThemeOptions();
    }

    /**
     * Tích hợp Theme Options từ ThemeOptionsService
     */
    protected function integrateThemeOptions()
    {
        try {
            if (!$this->app->has('theme-options')) {
                return;
            }
            $themeOptions = $this->app->make('theme-options');
            if ($themeOptions && method_exists($themeOptions, 'getMenuArgs')) {
                $menuArgs = $themeOptions->getMenuArgs();

                // Thay đổi parent slug để làm submenu của Jankx
                $pages = $this->app->make('jankx.admin-pages')->getAllPages();
                $mainPageId = isset($pages['jankx-settings']) ? 'jankx-settings' : key($pages);

                // Đăng ký Theme Options như submenu của Jankx
                add_submenu_page(
                    $mainPageId, // Parent slug
                    $menuArgs['page_title'] ?? 'Theme Options',
                    $menuArgs['menu_title'] ?? 'Theme Options',
                    $menuArgs['page_permissions'] ?? 'manage_options',
                    $menuArgs['page_slug'] ?? 'jankx-theme-options',
                    [$themeOptions, 'renderOptionsPage'],
                    40
                );
            }
        } catch (\Exception $e) {
            // Silence errors
        }
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
            try {
                $baseUrl = $this->app->make('jankx.urls')['base'];
                wp_enqueue_style(
                    'jankx-admin-pages',
                    $baseUrl . '/resources/assets/css/admin-pages.css',
                    [],
                    $this->app->make('jankx.version') ?? '1.0.0'
                );
            } catch (\Exception $e) {
                // Ignore if base URL not setup
            }
        }
    }

    /**
     * Handle page requests
     */
    public function handlePageRequests()
    {
        // Handle form submissions if needed
        if ($_POST && isset($_POST['jankx_action'])) {
            $this->handleFormSubmission($_POST);
        }
    }

    /**
     * Handle form submissions
     */
    protected function handleFormSubmission($data)
    {
        $action = $data['jankx_action'] ?? '';

        switch ($action) {
            case 'save_image_sizes':
                $this->handleSaveImageSizes($data);
                break;
        }
    }

    /**
     * Handle saving enabled image sizes
     */
    protected function handleSaveImageSizes($data)
    {
        if (!wp_verify_nonce($data['jankx_utilities_nonce'] ?? '', 'jankx_save_utilities')) {
            wp_die('Security check failed');
        }

        $enabled_sizes = $data['enabled_sizes'] ?? [];
        update_option('jankx_enabled_image_sizes', $enabled_sizes);

        add_action('admin_notices', function () {
            echo '<div class="notice notice-success is-dismissible"><p>Image size settings saved.</p></div>';
        });
    }

    /**
     * Get service name
     */
    public function getName()
    {
        return 'jankx-admin-pages';
    }
}
