<?php

namespace Jankx\Support\Providers;

use Jankx\Support\Providers\ServiceProvider;
use Jankx\Foundation\Application;

class JankxAdminMenuServiceProvider extends ServiceProvider
{
    protected $app;

    public function register(Application $app)
    {
        $this->app = $app;
    }

    public function boot(Application $app)
    {
        // Register main admin menu
        add_action('admin_menu', [$this, 'registerMainAdminMenu']);

        // Register submenus
        add_action('admin_menu', [$this, 'registerSubMenus'], 20);

        // Enqueue admin styles
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminStyles']);
    }

    /**
     * Enqueue admin styles
     */
    public function enqueueAdminStyles()
    {
        $screen = get_current_screen();
        if (strpos($screen->id, 'jankx') !== false) {
            wp_enqueue_style(
                'jankx-admin-menu',
                $this->app->make('jankx.urls')['base'] . '/assets/css/admin-menu.css',
                [],
                $this->app->make('jankx.version') ?? '1.0.0'
            );
        }
    }

    /**
     * Đăng ký admin menu chính cho Jankx Framework
     */
    public function registerMainAdminMenu()
    {
        add_menu_page(
            'Jankx Framework', // Page title
            'Jankx', // Menu title
            'manage_options', // Capability
            'jankx-settings', // Menu slug
            [$this, 'renderMainPage'], // Callback
            'dashicons-admin-generic', // Icon
            59 // Position
        );
    }

    /**
     * Đăng ký các submenus
     */
    public function registerSubMenus()
    {
        // Theme Options submenu
        add_submenu_page(
            'jankx-settings', // Parent slug
            'Theme Options', // Page title
            'Theme Options', // Menu title
            'manage_options', // Capability
            'jankx-theme-options', // Menu slug
            [$this, 'renderThemeOptionsPage'] // Callback
        );

        // Icons Repository submenu
        add_submenu_page(
            'jankx-settings', // Parent slug
            'Icons Repository', // Page title
            'Icons Repository', // Menu title
            'manage_options', // Capability
            'jankx-icons', // Menu slug
            [$this, 'renderIconsPage'] // Callback
        );

        // Framework Info submenu
        add_submenu_page(
            'jankx-settings', // Parent slug
            'Framework Info', // Page title
            'Framework Info', // Menu title
            'manage_options', // Capability
            'jankx-framework-info', // Menu slug
            [$this, 'renderFrameworkInfoPage'] // Callback
        );
    }

    /**
     * Render trang chính
     */
    public function renderMainPage()
    {
        echo '<div class="wrap">';
        echo '<h1>Jankx Framework</h1>';
        echo '<p>Welcome to Jankx Framework - A modern WordPress theme framework with Laravel-style architecture.</p>';

        echo '<div class="jankx-dashboard-widgets">';
        echo '<div class="jankx-widget">';
        echo '<h3>Quick Actions</h3>';
        echo '<ul>';
        echo '<li><a href="' . admin_url('admin.php?page=jankx-theme-options') . '">Configure Theme Options</a></li>';
        echo '<li><a href="' . admin_url('admin.php?page=jankx-icons') . '">Manage Icons</a></li>';
        echo '<li><a href="' . admin_url('admin.php?page=jankx-framework-info') . '">View Framework Info</a></li>';
        echo '</ul>';
        echo '</div>';

        echo '<div class="jankx-widget">';
        echo '<h3>System Status</h3>';
        echo '<ul>';
        echo '<li>Framework Version: ' . ($this->app->make('jankx.version') ?? 'Unknown') . '</li>';
        echo '<li>Environment: ' . ($this->app->make('jankx.environment') ?? 'Unknown') . '</li>';
        echo '<li>Debug Mode: ' . (WP_DEBUG ? 'Enabled' : 'Disabled') . '</li>';
        echo '</ul>';
        echo '</div>';
        echo '</div>';

        echo '</div>';
    }

    /**
     * Render trang Theme Options
     */
    public function renderThemeOptionsPage()
    {
        // Redirect to existing theme options if available
        if (class_exists('App\Services\ThemeOptionsService')) {
            $themeOptions = $this->app->make('theme-options');
            if ($themeOptions) {
                $themeOptions->renderOptionsPage();
                return;
            }
        }

        // Fallback content
        echo '<div class="wrap">';
        echo '<h1>Theme Options</h1>';
        echo '<p>Theme options are managed through the framework adapter.</p>';
        echo '<p>Current Framework Mode: ' . ($this->app->make('jankx.framework_mode') ?? 'Unknown') . '</p>';
        echo '</div>';
    }

    /**
     * Render trang Icons Repository
     */
    public function renderIconsPage()
    {
        // Try to get icon repository service
        try {
            $iconRepository = $this->app->make('font-icons.repository');
            if ($iconRepository) {
                $this->renderIconsRepositoryPage($iconRepository);
                return;
            }
        } catch (\Exception $e) {
            // Service not available
        }

        // Fallback content
        echo '<div class="wrap">';
        echo '<h1>Icons Repository</h1>';
        echo '<p>Icons repository service is not available.</p>';
        echo '</div>';
    }

    /**
     * Render trang Icons Repository với dữ liệu thực
     */
    protected function renderIconsRepositoryPage($iconRepository)
    {
        $activeTab = $_GET['tab'] ?? 'icon-sets';
        $iconTypes = $iconRepository->getIconTypes();

        echo '<div class="wrap">';
        echo '<h1>Icons Repository</h1>';

        // Navigation tabs
        echo '<nav class="nav-tab-wrapper">';
        echo '<a href="' . admin_url('admin.php?page=jankx-icons&tab=icon-sets') . '" class="nav-tab ' . ($activeTab === 'icon-sets' ? 'nav-tab-active' : '') . '">Icon Sets</a>';
        echo '<a href="' . admin_url('admin.php?page=jankx-icons&tab=manage') . '" class="nav-tab ' . ($activeTab === 'manage' ? 'nav-tab-active' : '') . '">Manage Icons</a>';
        echo '<a href="' . admin_url('admin.php?page=jankx-icons&tab=import') . '" class="nav-tab ' . ($activeTab === 'import' ? 'nav-tab-active' : '') . '">Import/Export</a>';
        echo '</nav>';

        // Tab content
        switch ($activeTab) {
            case 'icon-sets':
                $this->renderIconSetsTab($iconTypes);
                break;
            case 'manage':
                $this->renderManageTab($iconTypes);
                break;
            case 'import':
                $this->renderImportTab();
                break;
            default:
                $this->renderIconSetsTab($iconTypes);
        }

        echo '</div>';
    }

    /**
     * Render tab Icon Sets
     */
    protected function renderIconSetsTab($iconTypes)
    {
        echo '<div class="tab-content">';
        echo '<h2>Available Icon Sets</h2>';

        if (empty($iconTypes)) {
            echo '<p>No icon types configured.</p>';
            return;
        }

        echo '<table class="wp-list-table widefat fixed striped">';
        echo '<thead><tr>';
        echo '<th>Type</th>';
        echo '<th>Status</th>';
        echo '<th>Auto-load</th>';
        echo '<th>Actions</th>';
        echo '</tr></thead>';
        echo '<tbody>';

        foreach ($iconTypes as $type => $config) {
            $status = $config['enabled'] ? '<span class="dashicons dashicons-yes-alt" style="color: green;"></span> Enabled' : '<span class="dashicons dashicons-no-alt" style="color: red;"></span> Disabled';
            $autoLoad = $config['auto_load'] ? 'Yes' : 'No';

            echo '<tr>';
            echo '<td><strong>' . esc_html(ucfirst($type)) . '</strong></td>';
            echo '<td>' . $status . '</td>';
            echo '<td>' . esc_html($autoLoad) . '</td>';
            echo '<td>';
            echo '<a href="' . admin_url('admin.php?page=jankx-icons&tab=manage&type=' . $type) . '" class="button button-small">Manage</a> ';
            echo '<a href="' . admin_url('admin.php?page=jankx-icons&tab=import&type=' . $type) . '" class="button button-small">Import</a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</tbody></table>';
        echo '</div>';
    }

    /**
     * Render tab Manage
     */
    protected function renderManageTab($iconTypes)
    {
        echo '<div class="tab-content">';
        echo '<h2>Manage Icons</h2>';
        echo '<p>Manage individual icons and their properties.</p>';
        echo '</div>';
    }

    /**
     * Render tab Import
     */
    protected function renderImportTab()
    {
        echo '<div class="tab-content">';
        echo '<h2>Import/Export Icons</h2>';
        echo '<p>Import icons from CSS files or export existing icon data.</p>';
        echo '</div>';
    }

    /**
     * Render trang Framework Info
     */
    public function renderFrameworkInfoPage()
    {
        echo '<div class="wrap">';
        echo '<h1>Jankx Framework Information</h1>';

        echo '<div class="jankx-info-grid">';

        // Basic Info
        echo '<div class="jankx-info-section">';
        echo '<h3>Basic Information</h3>';
        echo '<table class="form-table">';
        echo '<tr><th>Framework Version</th><td>' . ($this->app->make('jankx.version') ?? 'Unknown') . '</td></tr>';
        echo '<tr><th>Environment</th><td>' . ($this->app->make('jankx.environment') ?? 'Unknown') . '</td></tr>';
        echo '<tr><th>Base Path</th><td>' . ($this->app->make('jankx.paths')['base'] ?? 'Unknown') . '</td></tr>';
        echo '<tr><th>Base URL</th><td>' . ($this->app->make('jankx.urls')['base'] ?? 'Unknown') . '</td></tr>';
        echo '</table>';
        echo '</div>';

        // Services
        echo '<div class="jankx-info-section">';
        echo '<h3>Registered Services</h3>';
        echo '<ul>';
        $services = ['font-icons.repository', 'font-icons.manager', 'font-icons.renderer'];
        foreach ($services as $service) {
            try {
                $instance = $this->app->make($service);
                echo '<li><span class="dashicons dashicons-yes-alt" style="color: green;"></span> ' . esc_html($service) . '</li>';
            } catch (\Exception $e) {
                echo '<li><span class="dashicons dashicons-no-alt" style="color: red;"></span> ' . esc_html($service) . ' (Error: ' . esc_html($e->getMessage()) . ')</li>';
            }
        }
        echo '</ul>';
        echo '</div>';

        echo '</div>';

        echo '</div>';
    }
}
