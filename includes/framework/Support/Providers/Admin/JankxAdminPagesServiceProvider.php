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

        // Register FormHandler
        $app->singleton(\Jankx\Admin\Handlers\FormHandler::class, function ($app) {
            return new \Jankx\Admin\Handlers\FormHandler($app);
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
        $mainPageId = $themeOptionsArgs['page_slug'] ?? 'jankx-extensions';
        $mainPageTitle = $themeOptionsArgs['page_title'] ?? ($pages['jankx-extensions']['title'] ?? 'Jankx Extensions');

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
        $handler = $this->app->make(\Jankx\Admin\Handlers\FormHandler::class);
        $handler->handleRequests();
    }

    /**
     * Get service name
     */
    public function getName()
    {
        return 'jankx-admin-pages';
    }
}
