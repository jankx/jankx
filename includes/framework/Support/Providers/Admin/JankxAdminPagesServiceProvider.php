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

        // Detect Theme Options
        $themeOptions = null;
        $themeOptionsArgs = null;
        if ($this->app->has('theme-options')) {
            $themeOptions = $this->app->make('theme-options');
            if ($themeOptions && method_exists($themeOptions, 'getMenuArgs')) {
                $themeOptionsArgs = $themeOptions->getMenuArgs();
            }
        }

        // Determine Main Page (Default to Theme Options if available)
        $mainPageId = $themeOptionsArgs['page_slug'] ?? 'jankx-settings';
        $mainPageTitle = $themeOptionsArgs['page_title'] ?? ($pages['jankx-settings']['title'] ?? 'Jankx Dashboard');

        // Register Main Menu
        add_menu_page(
            $mainPageTitle,
            Config::get('app.menu_title', 'Jankx'),
            'manage_options',
            $mainPageId,
            $themeOptions ? [$themeOptions, 'renderOptionsPage'] : [$this, 'renderSubPage'],
            'dashicons-art',
            Config::get('app.menu_position', 59)
        );

        // Register Theme Options as first submenu if it is the main page
        if ($themeOptionsArgs) {
            add_submenu_page(
                $mainPageId,
                $themeOptionsArgs['page_title'],
                $themeOptionsArgs['menu_title'],
                $themeOptionsArgs['page_permissions'] ?? 'manage_options',
                $themeOptionsArgs['page_slug'],
                [$themeOptions, 'renderOptionsPage']
            );
        }

        // Register other pages as submenus
        foreach ($pages as $page) {
            add_submenu_page(
                $mainPageId,
                $page['title'],
                $page['menu_title'],
                $page['capability'],
                $page['id'],
                [$this, 'renderSubPage'],
                $page['position']
            );
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
