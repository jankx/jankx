<?php

namespace Jankx\Services;

use Jankx\Foundation\Application;
use Jankx\Facades\Config;

class AdminPageService
{
    protected $app;
    protected $pages = [];
    protected $currentPage = null;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->registerDefaultPages();
    }

    /**
     * Đăng ký các trang admin mặc định
     */
    protected function registerDefaultPages()
    {
        $this->addPage([
            'id' => 'jankx-dashboard',
            'title' => 'Dashboard',
            'menu_title' => 'Dashboard',
            'capability' => 'manage_options',
            'callback' => [$this, 'renderDashboardPage'],
            'icon' => 'dashicons-dashboard',
            'position' => 10
        ]);

        // Theme Options được quản lý bởi framework adapter
        // $this->addPage([
        //     'id' => 'jankx-theme-options',
        //     'title' => 'Theme Options',
        //     'menu_title' => 'Theme Options',
        //     'capability' => 'manage_options',
        //     'callback' => [$this, 'renderThemeOptionsPage'],
        //     'icon' => 'dashicons-admin-customizer',
        //     'position' => 20
        // ]);

        $this->addPage([
            'id' => 'jankx-icons',
            'title' => 'Icons Repository',
            'menu_title' => 'Icons Repository',
            'capability' => 'manage_options',
            'callback' => [$this, 'renderIconsPage'],
            'icon' => 'dashicons-admin-appearance',
            'position' => 30
        ]);

        $this->addPage([
            'id' => 'jankx-framework-info',
            'title' => 'Framework Info',
            'menu_title' => 'Framework Info',
            'capability' => 'manage_options',
            'callback' => [$this, 'renderFrameworkInfoPage'],
            'icon' => 'dashicons-info',
            'position' => 40
        ]);
    }

    /**
     * Thêm trang admin mới
     */
    public function addPage(array $pageData)
    {
        $defaults = [
            'id' => '',
            'title' => '',
            'menu_title' => '',
            'capability' => 'manage_options',
            'callback' => null,
            'icon' => 'dashicons-admin-generic',
            'position' => 50,
            'parent' => null, // null = main menu, 'jankx-settings' = submenu
            'tabs' => [],
            'scripts' => [],
            'styles' => []
        ];

        $page = array_merge($defaults, $pageData);

        if (empty($page['id']) || empty($page['title'])) {
            throw new \InvalidArgumentException('Page ID and title are required');
        }

        $this->pages[$page['id']] = $page;
    }

    /**
     * Lấy trang theo ID
     */
    public function getPage($pageId)
    {
        return $this->pages[$pageId] ?? null;
    }

    /**
     * Lấy tất cả trang
     */
    public function getAllPages()
    {
        return $this->pages;
    }

    /**
     * Lấy trang hiện tại
     */
    public function getCurrentPage()
    {
        return $this->currentPage;
    }

    /**
     * Set trang hiện tại
     */
    public function setCurrentPage($pageId)
    {
        $this->currentPage = $pageId;
    }

    /**
     * Render trang admin
     */
    public function renderPage($pageId)
    {
        $page = $this->getPage($pageId);
        if (!$page) {
            wp_die('Page not found');
        }

        $this->setCurrentPage($pageId);
        $this->enqueuePageAssets($page);

        // Render page header
        $this->renderPageHeader($page);

        // Render page content
        if (is_callable($page['callback'])) {
            call_user_func($page['callback'], $page);
        } else {
            $this->renderDefaultPageContent($page);
        }

        // Render page footer
        $this->renderPageFooter($page);
    }

    /**
     * Render trang Dashboard
     */
    public function renderDashboardPage($page)
    {
        echo '<div class="jankx-dashboard-widgets">';

        // Quick Actions Widget
        echo '<div class="jankx-widget">';
        echo '<h3>Quick Actions</h3>';
        echo '<ul>';
        echo '<li><a href="' . admin_url('admin.php?page=jankx-icons') . '">Manage Icons</a></li>';
        echo '<li><a href="' . admin_url('admin.php?page=jankx-framework-info') . '">View Framework Info</a></li>';
        echo '</ul>';
        echo '</div>';

        // System Status Widget
        echo '<div class="jankx-widget">';
        echo '<h3>System Status</h3>';
        echo '<ul>';
        echo '<li>Framework Version: ' . ($this->app->make('jankx.version') ?? 'Unknown') . '</li>';
        echo '<li>Environment: ' . ($this->app->make('jankx.environment') ?? 'Unknown') . '</li>';
        echo '<li>Debug Mode: ' . (WP_DEBUG ? 'Enabled' : 'Disabled') . '</li>';
        echo '<li>PHP Version: ' . PHP_VERSION . '</li>';
        echo '<li>WordPress Version: ' . get_bloginfo('version') . '</li>';
        echo '</ul>';
        echo '</div>';

        // Services Status Widget
        echo '<div class="jankx-widget">';
        echo '<h3>Services Status</h3>';
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
    }

        /**
     * Theme Options được quản lý bởi framework adapter
     * Method này đã được comment out vì không còn được sử dụng
     */
    /*
    public function renderThemeOptionsPage($page)
    {
        // Try to get theme options service
        try {
            $themeOptions = $this->app->make('theme-options');
            if ($themeOptions && method_exists($themeOptions, 'renderOptionsPage')) {
                $themeOptions->renderOptionsPage();
                return;
            }
        } catch (\Exception $e) {
            // Service not available
        }

        // Fallback content
        echo '<div class="jankx-theme-options-fallback">';
        echo '<h2>Theme Options</h2>';
        echo '<p>Theme options are managed through the framework adapter.</p>';

        try {
            $frameworkMode = $this->app->make('jankx.framework_mode');
            echo '<p>Current Framework Mode: <strong>' . esc_html($frameworkMode ?? 'Unknown') . '</strong></p>';
        } catch (\Exception $e) {
            echo '<p>Framework Mode: <strong>Unknown</strong></p>';
        }

        echo '<div class="jankx-framework-info">';
        echo '<h3>Available Framework Adapters</h3>';
        echo '<ul>';
        echo '<li><strong>Kirki:</strong> Customizer-based theme options</li>';
        echo '<li><strong>Redux:</strong> Standalone options panel</li>';
        echo '<li><strong>WordPress Settings API:</strong> Native WordPress options</li>';
        echo '<li><strong>Jankx Native:</strong> Built-in options framework</li>';
        echo '</ul>';
        echo '</div>';
        echo '</div>';
    }
    */

    /**
     * Render trang Icons Repository
     */
    public function renderIconsPage($page)
    {
        $activeTab = $_GET['tab'] ?? 'icon-sets';

        // Try to get icon repository service
        try {
            $iconRepository = $this->app->make('font-icons.repository');
            if ($iconRepository) {
                $this->renderIconsRepositoryContent($iconRepository, $activeTab);
                return;
            }
        } catch (\Exception $e) {
            // Service not available
        }

        // Fallback content
        echo '<div class="jankx-icons-fallback">';
        echo '<h2>Icons Repository</h2>';
        echo '<p>Icons repository service is not available.</p>';
        echo '<p>Please ensure the Font Icons system is properly configured.</p>';
        echo '</div>';
    }

    /**
     * Render nội dung Icons Repository
     */
    protected function renderIconsRepositoryContent($iconRepository, $activeTab)
    {
        $iconTypes = $iconRepository->getIconTypes();

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
    }

    /**
     * Render tab Icon Sets
     */
        protected function renderIconSetsTab($iconTypes)
    {
        echo '<div class="tab-content">';
        echo '<h2>Available Icon Sets</h2>';

        // Lấy tất cả icon types từ config, không chỉ những cái enabled
        $allIconTypes = $this->app->make('config')->get('font-icons.icon_types', []);

        if (empty($allIconTypes)) {
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

        foreach ($allIconTypes as $type => $config) {
            $enabled = $config['enabled'] ?? false;
            $autoLoad = $config['auto_load'] ?? false;

            $status = $enabled ? '<span class="dashicons dashicons-yes-alt" style="color: green;"></span> Enabled' : '<span class="dashicons dashicons-no-alt" style="color: red;"></span> Disabled';
            $autoLoadText = $autoLoad ? 'Yes' : 'No';

            echo '<tr>';
            echo '<td><strong>' . esc_html(ucfirst($type)) . '</strong></td>';
            echo '<td>' . $status . '</td>';
            echo '<td>' . esc_html($autoLoadText) . '</td>';
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
        echo '<p>This feature is coming soon.</p>';
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
        echo '<p>This feature is coming soon.</p>';
        echo '</div>';
    }

    /**
     * Render trang Framework Info
     */
    public function renderFrameworkInfoPage($page)
    {
        echo '<div class="jankx-framework-info-page">';
        echo '<h2>Jankx Framework Information</h2>';

        echo '<div class="jankx-info-grid">';

        // Basic Info
        echo '<div class="jankx-info-section">';
        echo '<h3>Basic Information</h3>';
        echo '<table class="form-table">';
        echo '<tr><th>Framework Version</th><td>' . ($this->app->make('jankx.version') ?? 'Unknown') . '</td></tr>';
        echo '<tr><th>Environment</th><td>' . ($this->app->make('jankx.environment') ?? 'Unknown') . '</td></tr>';
        echo '<tr><th>Base Path</th><td>' . ($this->app->make('jankx.paths')['base'] ?? 'Unknown') . '</td></tr>';
        echo '<tr><th>Base URL</th><td>' . ($this->app->make('jankx.urls')['base'] ?? 'Unknown') . '</td></tr>';
        echo '<tr><th>PHP Version</th><td>' . PHP_VERSION . '</td></tr>';
        echo '<tr><th>WordPress Version</th><td>' . get_bloginfo('version') . '</td></tr>';
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

    /**
     * Render page header
     */
    protected function renderPageHeader($page)
    {
        echo '<div class="wrap">';
        echo '<h1>' . esc_html($page['title']) . '</h1>';

        if (!empty($page['tabs'])) {
            $this->renderTabs($page);
        }
    }

    /**
     * Render page footer
     */
    protected function renderPageFooter($page)
    {
        echo '</div>'; // Close .wrap
    }

    /**
     * Render tabs navigation
     */
    protected function renderTabs($page)
    {
        $activeTab = $_GET['tab'] ?? array_key_first($page['tabs']);

        echo '<nav class="nav-tab-wrapper">';
        foreach ($page['tabs'] as $tabId => $tabData) {
            $activeClass = $activeTab === $tabId ? 'nav-tab-active' : '';
            echo '<a href="' . admin_url('admin.php?page=' . $page['id'] . '&tab=' . $tabId) . '" class="nav-tab ' . $activeClass . '">' . esc_html($tabData['title']) . '</a>';
        }
        echo '</nav>';
    }

    /**
     * Render default page content
     */
    protected function renderDefaultPageContent($page)
    {
        echo '<div class="jankx-default-content">';
        echo '<p>This page is under construction.</p>';
        echo '</div>';
    }

    /**
     * Enqueue page assets
     */
    protected function enqueuePageAssets($page)
    {
        if (!empty($page['scripts'])) {
            foreach ($page['scripts'] as $script) {
                wp_enqueue_script($script['handle'], $script['src'], $script['deps'] ?? [], $script['version'] ?? '1.0.0', $script['in_footer'] ?? false);
            }
        }

        if (!empty($page['styles'])) {
            foreach ($page['styles'] as $style) {
                wp_enqueue_style($style['handle'], $style['src'], $style['deps'] ?? [], $style['version'] ?? '1.0.0', $style['media'] ?? 'all');
            }
        }
    }

    /**
     * Get service name
     */
    public function getName()
    {
        return 'admin-page';
    }
}
