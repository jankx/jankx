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
    /**
     * Register main admin menu for Jankx Framework
     */
    public function registerAdminMenu()
    {
        $adminPages = $this->app->make('jankx.admin-pages');
        $pages = $adminPages->getAllPages();

        // 1. Register Jankx Dashboard (Main Top-Level)
        $dashboardId = 'jankx-dashboard';

        $isPro = $this->app->bound('license') && $this->app->make('license')->isActivated();
        $menuTitle = Config::get('app.menu_title', __('Jankx Admin', 'jankx'));
        $menuSuffix = $isPro ? '' : ' (' . __('FREE', 'jankx') . ')';

        add_menu_page(
            Config::get('app.admin_page_title', __('Jankx Dashboard', 'jankx')),
            $menuTitle . $menuSuffix,
            'manage_options',
            $dashboardId,
            [$this, 'renderSubPage'],
            'dashicons-art',
            Config::get('app.menu_position', 59)
        );

        // Submenu: Dashboard
        add_submenu_page(
            $dashboardId,
            __('Jankx Dashboard', 'jankx'),
            __('Dashboard', 'jankx'),
            'manage_options',
            $dashboardId,
            [$this, 'renderSubPage']
        );

        // 2. Promote Extensions to Top Level
        if (isset($pages['jankx-extensions'])) {
            $ext = $pages['jankx-extensions'];
            add_menu_page(
                $ext['title'],
                $ext['menu_title'],
                $ext['capability'],
                $ext['id'],
                $ext['callback'],
                $ext['icon'],
                60
            );
        }

        // 3. Promote Marketplace to Top Level
        if (isset($pages['jankx-marketplace'])) {
            $market = $pages['jankx-marketplace'];
            add_menu_page(
                $market['title'],
                $market['menu_title'],
                $market['capability'],
                $market['id'],
                $market['callback'],
                $market['icon'],
                61
            );
        }

        // 4. Register Theme Options as Submenu under Dashboard
        if ($this->app->has('theme-options')) {
            $themeOptions = $this->app->make('theme-options');
            if ($themeOptions && method_exists($themeOptions, 'getMenuArgs')) {
                $args = $themeOptions->getMenuArgs();
                add_submenu_page(
                    $dashboardId,
                    $args['page_title'],
                    $args['menu_title'],
                    $args['page_permissions'] ?? 'manage_options',
                    $args['page_slug'],
                    [$themeOptions, 'renderOptionsPage']
                );
            }
        }

        // 5. Register other submenus under Dashboard
        uasort($pages, function ($a, $b) {
            return ($a['position'] ?? 50) <=> ($b['position'] ?? 50);
        });

        $topLevelPages = ['jankx-dashboard', 'jankx-extensions', 'jankx-marketplace'];

        foreach ($pages as $page) {
            if (in_array($page['id'], $topLevelPages)) {
                continue; // Already registered or promoted
            }

            add_submenu_page(
                $dashboardId,
                $page['title'],
                $page['menu_title'],
                $page['capability'],
                $page['id'],
                [$this, 'renderSubPage']
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
        $pageId = $_GET['page'] ?? '';
        $adminPages = $this->app->make('jankx.admin-pages');
        
        if ($pageId) {
            $adminPages->setCurrentPage($pageId);
        }

        $screen = get_current_screen();
        if ($screen && strpos($screen->id, 'jankx') !== false) {
            try {
                $urls = $this->app->make('jankx.urls');
                $baseUrl = $urls['base'] ?? '';
                if ($baseUrl) {
                    wp_enqueue_style(
                        'jankx-admin-pages',
                        $baseUrl . '/resources/assets/css/admin-pages.css',
                        [],
                        $this->app->make('jankx.version') ?? '1.0.0'
                    );
                }
            } catch (\Exception $e) {
                // Ignore if base URL or version not setup
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
