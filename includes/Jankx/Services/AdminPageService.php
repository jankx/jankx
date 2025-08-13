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
        echo '<li><a href="' . admin_url('admin.php?page=jankx-import-icons') . '">Import Icons</a></li>';
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
                $this->renderImportTab($iconTypes);
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
        // Xử lý các actions trước khi render
        $this->handleIconActions();

        echo '<div class="tab-content">';
        echo '<h2>Available Icon Sets</h2>';

        $allIconTypes = Config::get('font-icons.icon_types', []);

        if (empty($allIconTypes)) {
            echo '<div class="notice notice-warning">';
            echo '<p>No icon types configured yet.</p>';
            echo '</div>';
            echo '</div>';
            return;
        }

        echo '<div class="jankx-icon-sets-grid">';

        foreach ($allIconTypes as $type => $config) {
            $enabled = $config['enabled'] ?? false;
            $autoLoad = $config['auto_load'] ?? false;
            $version = $config['version'] ?? 'Unknown';
            $prefixes = $config['prefixes'] ?? [];
            $categories = $config['categories'] ?? [];
            $iconCount = $this->getIconCountForType($type);

            echo '<div class="jankx-icon-set-card">';

            // Header với icon type name
            echo '<div class="card-header">';
            echo '<h3>' . esc_html(ucfirst($type)) . '</h3>';
            echo '<div class="card-status">';
            echo $enabled ? '<span class="status-badge enabled">Enabled</span>' : '<span class="status-badge disabled">Disabled</span>';
            echo '</div>';
            echo '</div>';

            // Card content
            echo '<div class="card-content">';

            // Info grid
            echo '<div class="info-grid">';
            echo '<div class="info-item">';
            echo '<strong>Version:</strong> ' . esc_html($version);
            echo '</div>';
            echo '<div class="info-item">';
            echo '<strong>Auto-load:</strong> ' . ($autoLoad ? 'Yes' : 'No');
            echo '</div>';
            echo '<div class="info-item">';
            echo '<strong>Icons:</strong> ~' . $iconCount;
            echo '</div>';
            if (!empty($prefixes)) {
                echo '<div class="info-item">';
                echo '<strong>Prefixes:</strong> ' . esc_html(implode(', ', $prefixes));
                echo '</div>';
            }
            if (!empty($categories)) {
                echo '<div class="info-item">';
                echo '<strong>Categories:</strong> ' . esc_html(implode(', ', $categories));
                echo '</div>';
            }
            echo '</div>';

            // Action buttons
            echo '<div class="card-actions">';

            // Primary actions
            echo '<div class="primary-actions">';
            echo '<a href="' . admin_url('admin.php?page=jankx-icons&tab=manage&type=' . $type) . '" class="button button-primary">Manage Icons</a>';
            echo '<a href="' . admin_url('admin.php?page=jankx-icons&tab=import&type=' . $type) . '" class="button button-secondary">Import/Export</a>';
            echo '</div>';

            // Control buttons
            echo '<div class="control-actions">';

            // Enable/Disable button
            echo '<form method="post" action="" style="display: inline;">';
            echo '<input type="hidden" name="jankx_action" value="toggle_icon_type">';
            echo '<input type="hidden" name="icon_type" value="' . esc_attr($type) . '">';
            echo '<input type="hidden" name="action_type" value="' . ($enabled ? 'disable' : 'enable') . '">';
            echo '<button type="submit" class="button button-small ' . ($enabled ? 'button-secondary' : 'button-primary') . '">';
            echo ($enabled ? 'Disable' : 'Enable') . '</button>';
            echo '</form>';

            // Auto-load toggle
            echo '<form method="post" action="" style="display: inline;">';
            echo '<input type="hidden" name="jankx_action" value="toggle_auto_load">';
            echo '<input type="hidden" name="icon_type" value="' . esc_attr($type) . '">';
            echo '<input type="hidden" name="auto_load" value="' . ($autoLoad ? '0' : '1') . '">';
            echo '<button type="submit" class="button button-small ' . ($autoLoad ? 'button-secondary' : 'button-primary') . '">';
            echo ($autoLoad ? 'Disable Auto-load' : 'Enable Auto-load') . '</button>';
            echo '</form>';

            // Remove button
            echo '<form method="post" action="" style="display: inline;" onsubmit="return confirm(\'Are you sure you want to remove this icon set? This action cannot be undone.\');">';
            echo '<input type="hidden" name="jankx_action" value="remove_icon_type">';
            echo '<input type="hidden" name="icon_type" value="' . esc_attr($type) . '">';
            echo '<button type="submit" class="button button-small button-link-delete">Remove</button>';
            echo '</form>';
            echo '</div>';

            echo '</div>'; // .card-actions
            echo '</div>'; // .card-content
            echo '</div>'; // .jankx-icon-set-card
        }

        echo '</div>'; // .jankx-icon-sets-grid
        echo '</div>'; // .tab-content
    }

    /**
     * Render tab Manage
     */
    protected function renderManageTab($iconTypes)
    {
        $iconType = $_GET['type'] ?? '';

        if (empty($iconType)) {
            $this->renderManageTypeSelector();
            return;
        }

        $this->renderManageIconsByType($iconType);
    }

    /**
     * Render selector để chọn icon type
     */
    protected function renderManageTypeSelector()
    {
        echo '<div class="tab-content">';
        echo '<h2>Select Icon Type to Manage</h2>';
        echo '<p>Choose an icon type to manage its icons:</p>';

        $allIconTypes = Config::get('font-icons.icon_types', []);

        if (empty($allIconTypes)) {
            echo '<p>No icon types configured.</p>';
            return;
        }

        echo '<div class="jankx-icon-type-grid">';
        foreach ($allIconTypes as $type => $config) {
            $enabled = $config['enabled'] ?? false;
            $iconCount = $this->getIconCountForType($type);

            echo '<div class="jankx-icon-type-card">';
            echo '<h3>' . esc_html(ucfirst($type)) . '</h3>';
            echo '<p><strong>Status:</strong> ' . ($enabled ? 'Enabled' : 'Disabled') . '</p>';
            echo '<p><strong>Icons:</strong> ' . $iconCount . '</p>';
            echo '<a href="' . admin_url('admin.php?page=jankx-icons&tab=manage&type=' . $type) . '" class="button button-primary">Manage Icons</a>';
            echo '</div>';
        }
        echo '</div>';
        echo '</div>';
    }

    /**
     * Render quản lý icons theo type cụ thể
     */
    protected function renderManageIconsByType($iconType)
    {
        $allIconTypes = Config::get('font-icons.icon_types', []);

        if (!isset($allIconTypes[$iconType])) {
            echo '<div class="tab-content">';
            echo '<p>Invalid icon type: ' . esc_html($iconType) . '</p>';
            echo '<a href="' . admin_url('admin.php?page=jankx-icons&tab=manage') . '" class="button">← Back to Type Selection</a>';
            echo '</div>';
            return;
        }

        $config = $allIconTypes[$iconType];
        $enabled = $config['enabled'] ?? false;

        echo '<div class="tab-content">';
        echo '<div class="jankx-manage-header">';
        echo '<h2>Manage ' . esc_html(ucfirst($iconType)) . ' Icons</h2>';
        echo '<a href="' . admin_url('admin.php?page=jankx-icons&tab=manage') . '" class="button">← Back to Type Selection</a>';
        echo '</div>';

        if (!$enabled) {
            echo '<div class="notice notice-warning">';
            echo '<p><strong>Warning:</strong> This icon type is currently disabled. Enable it first to manage icons.</p>';
            echo '</div>';
        }

        // Icon type info
        echo '<div class="jankx-icon-type-info">';
        echo '<h3>Icon Type Information</h3>';
        echo '<table class="form-table">';
        echo '<tr><th>Type</th><td>' . esc_html(ucfirst($iconType)) . '</td></tr>';
        echo '<tr><th>Status</th><td>' . ($enabled ? 'Enabled' : 'Disabled') . '</td></tr>';
        echo '<tr><th>Auto-load</th><td>' . ($config['auto_load'] ?? false ? 'Yes' : 'No') . '</td></tr>';
        echo '<tr><th>Version</th><td>' . esc_html($config['version'] ?? 'Unknown') . '</td></tr>';
        echo '<tr><th>Prefixes</th><td>' . esc_html(implode(', ', $config['prefixes'] ?? [])) . '</td></tr>';
        echo '</table>';
        echo '</div>';

        // Icon management interface
        $this->renderIconManagementInterface($iconType, $config);

        echo '</div>';
    }

    /**
     * Render giao diện quản lý icons
     */
    protected function renderIconManagementInterface($iconType, $config)
    {
        // Icon Type Information với controls tích hợp (ở trên cùng)
        $this->renderIconTypeInfoWithControls($iconType);

        echo '<div class="jankx-icon-management">';
        echo '<h3>Icon Management</h3>';

        // Search and filter
        echo '<div class="jankx-icon-filters">';
        echo '<input type="text" id="icon-search" placeholder="Search icons..." class="regular-text">';
        echo '<select id="icon-category-filter">';
        echo '<option value="">All Categories</option>';
        if (isset($config['categories'])) {
            foreach ($config['categories'] as $category) {
                echo '<option value="' . esc_attr($category) . '">' . esc_html(ucfirst($category)) . '</option>';
            }
        }
        echo '</select>';
        echo '<button type="button" class="button" onclick="refreshIconList()">Refresh</button>';
        echo '</div>';

        // Icon list container
        echo '<div id="icon-list-container">';
        echo '<div class="jankx-loading">Loading icons...</div>';
        echo '</div>';

        // Icon preview
        echo '<div id="icon-preview" class="jankx-icon-preview" style="display: none;">';
        echo '<h4>Icon Preview</h4>';
        echo '<div id="icon-preview-content"></div>';
        echo '<div id="icon-preview-code"></div>';
        echo '</div>';

        echo '</div>';

        // JavaScript for icon management
        $this->renderIconManagementScript($iconType);
    }

        /**
     * Render icon type info với controls tích hợp
     */
    protected function renderIconTypeInfoWithControls($iconType)
    {
        $allIconTypes = Config::get('font-icons.icon_types', []);
        $config = $allIconTypes[$iconType] ?? [];

        $enabled = $config['enabled'] ?? false;
        $autoLoad = $config['auto_load'] ?? false;
        $version = $config['version'] ?? 'Unknown';
        $cdnUrl = $config['cdn_url'] ?? '';
        $prefixes = $config['prefixes'] ?? [];
        $categories = $config['categories'] ?? [];

        echo '<div class="jankx-icon-type-info">';
        echo '<h3>Icon Type Information - ' . esc_html(ucfirst($iconType)) . '</h3>';

        // Information grid
        echo '<div class="jankx-info-grid">';

        // Status info
        echo '<div class="jankx-info-item">';
        echo '<strong>Status:</strong> ';
        echo $enabled ? '<span class="status-enabled">Enabled</span>' : '<span class="status-disabled">Disabled</span>';
        echo '</div>';

        echo '<div class="jankx-info-item">';
        echo '<strong>Auto-load:</strong> ';
        echo $autoLoad ? '<span class="status-enabled">Yes</span>' : '<span class="status-disabled">No</span>';
        echo '</div>';

        echo '<div class="jankx-info-item">';
        echo '<strong>Version:</strong> ' . esc_html($version);
        echo '</div>';

        if ($cdnUrl) {
            echo '<div class="jankx-info-item">';
            echo '<strong>CDN URL:</strong> <a href="' . esc_url($cdnUrl) . '" target="_blank">' . esc_html($cdnUrl) . '</a>';
            echo '</div>';
        }

        if (!empty($prefixes)) {
            echo '<div class="jankx-info-item">';
            echo '<strong>Prefixes:</strong> ' . esc_html(implode(', ', $prefixes));
            echo '</div>';
        }

        if (!empty($categories)) {
            echo '<div class="jankx-info-item">';
            echo '<strong>Categories:</strong> ' . esc_html(implode(', ', $categories));
            echo '</div>';
        }

        echo '</div>';

        // Control buttons
        echo '<div class="jankx-control-actions">';
        echo '<form method="post" action="" style="display: inline;">';
        echo '<input type="hidden" name="jankx_action" value="toggle_icon_type">';
        echo '<input type="hidden" name="icon_type" value="' . esc_attr($iconType) . '">';
        echo '<input type="hidden" name="action_type" value="' . ($enabled ? 'disable' : 'enable') . '">';
        echo '<button type="submit" class="button ' . ($enabled ? 'button-secondary' : 'button-primary') . '">';
        echo ($enabled ? 'Disable' : 'Enable') . ' Icon Type</button>';
        echo '</form> ';

        echo '<form method="post" action="" style="display: inline;">';
        echo '<input type="hidden" name="jankx_action" value="toggle_auto_load">';
        echo '<input type="hidden" name="icon_type" value="' . esc_attr($iconType) . '">';
        echo '<input type="hidden" name="auto_load" value="' . ($autoLoad ? '0' : '1') . '">';
        echo '<button type="submit" class="button ' . ($autoLoad ? 'button-secondary' : 'button-primary') . '">';
        echo ($autoLoad ? 'Disable Auto-load' : 'Enable Auto-load') . '</button>';
        echo '</form> ';

        echo '<form method="post" action="" style="display: inline;" onsubmit="return confirm(\'Are you sure you want to remove this icon set? This action cannot be undone.\');">';
        echo '<input type="hidden" name="jankx_action" value="remove_icon_type">';
        echo '<input type="hidden" name="icon_type" value="' . esc_attr($iconType) . '">';
        echo '<button type="submit" class="button button-link-delete">Remove Icon Type</button>';
        echo '</form>';
        echo '</div>';

        echo '</div>';
    }

    /**
     * Render JavaScript cho icon management
     */
    protected function renderIconManagementScript($iconType)
    {
        ?>
        <script>
        jQuery(document).ready(function($) {
            let currentIcons = [];
            let filteredIcons = [];
            const iconType = '<?php echo esc_js($iconType); ?>';

            // Load icons on page load
            loadIcons(iconType);

            // Search functionality
            $('#icon-search').on('input', function() {
                filterIcons();
            });

            // Category filter
            $('#icon-category-filter').on('change', function() {
                filterIcons();
            });

            function loadIcons(type) {
                $('#icon-list-container').html('<div class="jankx-loading">Loading icons...</div>');

                // AJAX call để load icons thực tế từ server
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'jankx_load_icons',
                        icon_type: type,
                        nonce: '<?php echo wp_create_nonce("jankx_load_icons"); ?>'
                    },
                    success: function(response) {
                        if (response.success) {
                            displayIcons(response.data.icons);
                        } else {
                            $('#icon-list-container').html('<p>Error loading icons: ' + (response.data.message || 'Unknown error') + '</p>');
                        }
                    },
                    error: function() {
                        $('#icon-list-container').html('<p>Error: Could not load icons from server.</p>');
                    }
                });
            }

            function displayIcons(icons) {
                currentIcons = icons;
                filteredIcons = icons;

                if (icons.length === 0) {
                    $('#icon-list-container').html('<p>No icons found for this type.</p>');
                    return;
                }

                let html = '<div class="jankx-icon-grid">';
                icons.forEach(function(icon) {
                    html += '<div class="jankx-icon-item" data-icon="' + icon.name + '">';
                    html += '<div class="jankx-icon-display">';
                    html += '<span class="' + (icon.prefixes[0] || '') + '">' + icon.name + '</span>';
                    html += '</div>';
                    html += '<div class="jankx-icon-info">';
                    html += '<strong>' + icon.name + '</strong><br>';
                    html += '<small>Category: ' + icon.category + '</small><br>';
                    html += '<small>Unicode: ' + icon.unicode + '</small>';
                    html += '</div>';
                    html += '<div class="jankx-icon-actions">';
                    html += '<button type="button" class="button button-small" onclick="previewIcon(\'' + icon.name + '\')">Preview</button>';
                    html += '<button type="button" class="button button-small" onclick="copyIconCode(\'' + icon.name + '\')">Copy Code</button>';
                    html += '</div>';
                    html += '</div>';
                });
                html += '</div>';

                $('#icon-list-container').html(html);
            }

            function filterIcons() {
                const searchTerm = $('#icon-search').val().toLowerCase();
                const categoryFilter = $('#icon-category-filter').val();

                filteredIcons = currentIcons.filter(function(icon) {
                    const matchesSearch = icon.name.toLowerCase().includes(searchTerm);
                    const matchesCategory = !categoryFilter || icon.category === categoryFilter;
                    return matchesSearch && matchesCategory;
                });

                displayIcons(filteredIcons);
            }

                                    // Global functions for button actions
            window.previewIcon = function(iconName) {
                const icon = currentIcons.find(i => i.name === iconName);
                if (icon) {
                    $('#icon-preview-content').html('<span class="' + (icon.prefixes[0] || '') + '">' + icon.name + '</span>');
                    $('#icon-preview-code').html('<code>&lt;i class="' + (icon.prefixes[0] || '') + ' ' + icon.name + '"&gt;&lt;/i&gt;</code>');
                    $('#icon-preview').show();
                }
            };

            window.copyIconCode = function(iconName) {
                const icon = currentIcons.find(i => i.name === iconName);
                if (icon) {
                    const code = '<i class="' + (icon.prefixes[0] || '') + ' ' + icon.name + '"></i>';
                    navigator.clipboard.writeText(code).then(function() {
                        alert('Icon code copied to clipboard!');
                    }).catch(function() {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = code;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        textArea.remove();
                        alert('Icon code copied to clipboard!');
                    });
                }
            };

            window.refreshIconList = function() {
                loadIcons(iconType);
            };
        });
        </script>
        <?php
    }

        /**
     * Lấy số lượng icons cho một type
     */
    protected function getIconCountForType($iconType)
    {
        // Lấy số lượng icons từ config hoặc sample data
        $allIconTypes = Config::get('font-icons.icon_types', []);

        if (isset($allIconTypes[$iconType])) {
            $config = $allIconTypes[$iconType];

            // Nếu có categories, ước tính số lượng icons
            if (isset($config['categories'])) {
                $categoryCount = count($config['categories']);
                // Ước tính trung bình 20 icons per category
                return $categoryCount * 20;
            }

            // Fallback cho các type không có categories
            switch ($iconType) {
                case 'material':
                    return 12; // Sample icons hiện tại
                case 'fontawesome':
                    return 12; // Sample icons hiện tại
                case 'custom':
                    return 8; // Sample icons hiện tại
                default:
                    return 50;
            }
        }

        return 0;
    }







            /**
     * Handle import/export form actions
     */
    protected function handleImportExportActions($data)
    {

        $action = $data['jankx_action'] ?? '';

        switch ($action) {
            case 'import_new_icon_set':
                                $this->handleImportNewIconSet($data);
                break;
            case 'export_icon_sets':
                                $this->handleExportIconSets($data);
                break;
            default:
                break;
        }
    }

        /**
     * Handle import new icon set
     */
    protected function handleImportNewIconSet($data)
    {

        // Verify nonce
        if (!wp_verify_nonce($data['_wpnonce'] ?? '', 'jankx_import_icons')) {
                        wp_die('Security check failed');
        }


        try {
            $iconSetName = sanitize_text_field($data['icon_set_name'] ?? '');
            $cssUrl = esc_url_raw($data['css_url'] ?? '');
            $cssFile = $_FILES['css_file'] ?? null;
            $iconPrefix = sanitize_text_field($data['icon_prefix'] ?? '');
            $iconCategories = sanitize_text_field($data['icon_categories'] ?? '');
            $autoLoad = isset($data['auto_load']);


            // Validate required fields
            if (empty($iconSetName) || (empty($cssUrl) && empty($cssFile['name']))) {
                                throw new \Exception('Icon set name and CSS source are required');
            }


            // Create icon type from name
            $iconType = $this->createIconTypeFromName($iconSetName);

            // Import icons
                        $importService = $this->app->make('jankx.icon-import');

                        $result = $importService->importFromCssUrl($cssUrl, $iconType, $iconSetName);

            if ($result['success']) {
                                // Show success message
                echo '<div class="notice notice-success is-dismissible">';
                echo '<p>' . esc_html($result['message']) . '</p>';
                echo '</div>';
            } else {
                                // Show error message
                echo '<div class="notice notice-error is-dismissible">';
                echo '<p>' . esc_html($result['message']) . '</p>';
                echo '</div>';
            }
        } catch (\Exception $e) {
                                    echo '<div class="notice notice-error is-dismissible">';
            echo '<p>Import failed: ' . esc_html($e->getMessage()) . '</p>';
            echo '</div>';
        }
    }

    /**
     * Create icon type from display name
     */
    protected function createIconTypeFromName($displayName)
    {
        // Convert display name to icon type (lowercase, hyphens)
        $iconType = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $displayName));
        $iconType = trim($iconType, '-');

        // Ensure it starts with a letter
        if (!preg_match('/^[a-z]/', $iconType)) {
            $iconType = 'icon-' . $iconType;
        }

        return $iconType;
    }

    /**
     * Handle export icon sets
     */
    protected function handleExportIconSets($data)
    {
        // Verify nonce
        if (!wp_verify_nonce($data['_wpnonce'] ?? '', 'jankx_export_icons')) {
            wp_die('Security check failed');
        }

        $exportTypes = $data['export_types'] ?? [];

        if (empty($exportTypes)) {
            echo '<div class="notice notice-warning is-dismissible">';
            echo '<p>Please select at least one icon type to export.</p>';
            echo '</div>';
            return;
        }

        // TODO: Implement export functionality
        echo '<div class="notice notice-info is-dismissible">';
        echo '<p>Export functionality will be implemented soon.</p>';
        echo '</div>';
    }

    /**
     * Render tab Import (complete import/export interface)
     */
    protected function renderImportTab($iconTypes)
    {

        echo '<div class="tab-content">';

        // Hiển thị thông tin về icon types hiện có
        // Lấy data trực tiếp từ config thay vì dùng $iconTypes parameter
        $allIconTypes = Config::get('font-icons.icon_types', []);

        if (!empty($allIconTypes) && is_array($allIconTypes)) {
            echo '<div class="jankx-current-icon-types">';
            echo '<h3>Current Icon Types:</h3>';
            echo '<p>You currently have <strong>' . count($allIconTypes) . ' icon type(s)</strong> configured:</p>';
            echo '<ul>';
            foreach ($allIconTypes as $type => $config) {
                $enabled = $config['enabled'] ?? false;
                $autoLoad = $config['auto_load'] ?? false;
                $version = $config['version'] ?? 'Unknown';
                $iconCount = $this->getIconCountForType($type);

                $status = $enabled ? 'Enabled' : 'Disabled';
                $autoLoadText = $autoLoad ? 'Yes' : 'No';

                echo '<li>';
                echo '<strong>' . esc_html(ucfirst($type)) . '</strong>';
                echo ' - Version: ' . esc_html($version);
                echo ', Icons: ~' . $iconCount;
                echo ', Status: ' . $status;
                echo ', Auto-load: ' . $autoLoadText;
                echo '</li>';
            }
            echo '</ul>';
            echo '</div>';
        } else {
            echo '<div class="jankx-current-icon-types">';
            echo '<h3>Current Icon Types:</h3>';
            echo '<p>No icon types are currently configured.</p>';
            echo '</div>';
        }

        // Import new icon set section
        echo '<div class="jankx-import-new-section">';
        echo '<h2>Import New Icon Set</h2>';
        echo '<p>Import a completely new icon set from CSS files. This will create a new icon type.</p>';

        echo '<form method="post" action="" enctype="multipart/form-data">';
        echo '<input type="hidden" name="jankx_action" value="import_new_icon_set">';
        echo '<input type="hidden" name="_wpnonce" value="' . wp_create_nonce('jankx_import_icons') . '">';

        echo '<table class="form-table">';
        echo '<tr>';
        echo '<th><label for="icon_set_name">Icon Set Name</label></th>';
        echo '<td>';
        echo '<input type="text" id="icon_set_name" name="icon_set_name" class="regular-text" placeholder="e.g., My Custom Icons" required>';
        echo '<p class="description">Give your icon set a unique name (only letters, numbers, and hyphens).</p>';
        echo '</td>';
        echo '</tr>';
        echo '<tr>';
        echo '<th><label for="css_url">CSS File URL</label></th>';
        echo '<td>';
        echo '<input type="url" id="css_url" name="css_url" class="regular-text" placeholder="https://example.com/icons.css">';
        echo '<p class="description">Enter the URL of a CSS file containing icon definitions.</p>';
        echo '</td>';
        echo '</tr>';
        echo '<tr>';
        echo '<th><label for="css_file">Or Upload CSS File</label></th>';
        echo '<td>';
        echo '<input type="file" id="css_file" name="css_file" accept=".css">';
        echo '<p class="description">Upload a CSS file from your computer.</p>';
        echo '</td>';
        echo '</tr>';
        echo '<tr>';
        echo '<th><label for="icon_prefix">Icon Prefix</label></th>';
        echo '<td>';
        echo '<input type="text" id="icon_prefix" name="icon_prefix" class="regular-text" placeholder="e.g., my-icon" required>';
        echo '<p class="description">The CSS class prefix for icons (e.g., "fas" for Font Awesome, "my-icon" for custom).</p>';
        echo '</td>';
        echo '</tr>';
        echo '<tr>';
        echo '<th><label for="icon_categories">Categories</label></th>';
        echo '<td>';
        echo '<input type="text" id="icon_categories" name="icon_categories" class="regular-text" placeholder="general, navigation, action, status">';
        echo '<p class="description">Comma-separated list of icon categories (optional).</p>';
        echo '</td>';
        echo '</tr>';
        echo '<tr>';
        echo '<th><label for="auto_load">Auto-load</label></th>';
        echo '<td>';
        echo '<label><input type="checkbox" id="auto_load" name="auto_load" value="1"> Automatically load this icon set</label>';
        echo '<p class="description">Enable this to automatically load the icon set on all pages.</p>';
        echo '</td>';
        echo '</tr>';
        echo '</table>';

        echo '<p class="submit">';
        echo '<input type="submit" name="submit" id="submit" class="button button-primary" value="Import New Icon Set">';
        echo '</p>';
        echo '</form>';
        echo '</div>';



        // Export section
        echo '<div class="jankx-export-section">';
        echo '<h2>Export Icon Sets</h2>';
        echo '<p>Export your icon sets for backup or sharing.</p>';

        if (!empty($allIconTypes)) {
                    echo '<form method="post" action="">';
            echo '<input type="hidden" name="jankx_action" value="export_icon_sets">';
            echo '<input type="hidden" name="_wpnonce" value="' . wp_create_nonce('jankx_export_icons') . '">';

            echo '<table class="form-table">';
            echo '<tr>';
            echo '<th><label for="export_type">Export Type</label></th>';
            echo '<td>';
            echo '<select id="export_type" name="export_type">';
            echo '<option value="all">All Icon Sets</option>';
            foreach ($allIconTypes as $type => $config) {
                echo '<option value="' . esc_attr($type) . '">' . esc_html(ucfirst($type)) . '</option>';
            }
            echo '</select>';
            echo '<p class="description">Choose which icon sets to export.</p>';
            echo '</td>';
            echo '</tr>';
            echo '<tr>';
            echo '<th><label for="export_format">Export Format</label></th>';
            echo '<td>';
            echo '<select id="export_format" name="export_format">';
            echo '<option value="json">JSON</option>';
            echo '<option value="css">CSS</option>';
            echo '<option value="html">HTML Preview</option>';
            echo '</select>';
            echo '<p class="description">Choose the export format.</p>';
            echo '</td>';
            echo '</tr>';
            echo '</table>';

            echo '<p class="submit">';
            echo '<input type="submit" name="submit" id="submit" class="button" value="Export Icon Sets">';
            echo '</p>';
            echo '</form>';
        } else {
            echo '<p>No icon sets available for export.</p>';
        }
        echo '</div>';

        // Recent imports
        echo '<div class="jankx-recent-imports">';
        echo '<h2>Recent Imports</h2>';
        echo '<p>No recent imports found.</p>';
        echo '</div>';

        echo '</div>';
    }

    /**
     * AJAX handler để load icons cho một icon type
     */
    public function handleLoadIconsAjax()
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'jankx_load_icons')) {
            wp_die('Security check failed');
        }

        $iconType = sanitize_text_field($_POST['icon_type']);

        if (empty($iconType)) {
            wp_send_json_error(['message' => 'Icon type is required']);
        }

        try {
            $icons = $this->loadIconsFromType($iconType);
            wp_send_json_success(['icons' => $icons]);
        } catch (Exception $e) {
            wp_send_json_error(['message' => $e->getMessage()]);
        }
    }

    /**
     * Load icons thực tế từ một icon type
     */
    protected function loadIconsFromType($iconType)
    {
        // Lấy config cho icon type
        $allIconTypes = Config::get('font-icons.icon_types', []);

        if (!isset($allIconTypes[$iconType])) {
            throw new Exception('Icon type not found: ' . $iconType);
        }

        $config = $allIconTypes[$iconType];

        // Kiểm tra xem có JSON metadata file không
        $jsonFile = $this->getIconMetadataPath($iconType);

        if (file_exists($jsonFile)) {
            $jsonContent = file_get_contents($jsonFile);
            $metadata = json_decode($jsonContent, true);

            if ($metadata && isset($metadata['icons'])) {
                return $metadata['icons'];
            }
        }

        // Fallback: tạo sample icons dựa trên config
        return $this->generateFallbackIcons($iconType, $config);
    }

    /**
     * Lấy đường dẫn đến file metadata của icon type
     */
    protected function getIconMetadataPath($iconType)
    {
        $basePath = get_template_directory();
        return $basePath . '/resources/icons/' . $iconType . '/icons.json';
    }

    /**
     * Tạo fallback icons dựa trên config
     */
    protected function generateFallbackIcons($iconType, $config)
    {
        $prefixes = $config['prefixes'] ?? [];
        $categories = $config['categories'] ?? [];

        if (empty($prefixes) || empty($categories)) {
            return [];
        }

        $prefix = $prefixes[0];
        $fallbackIcons = [];

        // Tạo một số icons mẫu dựa trên categories
        foreach ($categories as $index => $category) {
            $fallbackIcons[] = [
                'name' => $prefix . '-' . $category,
                'category' => $category,
                'unicode' => 'e' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                'prefixes' => $prefixes
            ];
        }

        return $fallbackIcons;
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
     * Xử lý các actions cho icon types
     */
    protected function handleIconActions()
    {
        if (!isset($_POST['jankx_action'])) {
            return;
        }

        $action = $_POST['jankx_action'];
        $iconType = $_POST['icon_type'] ?? '';

        if (empty($iconType)) {
            return;
        }

        switch ($action) {
            case 'toggle_icon_type':
                $this->toggleIconType($iconType);
                break;
            case 'toggle_auto_load':
                $this->toggleAutoLoad($iconType);
                break;
            case 'remove_icon_type':
                $this->removeIconType($iconType);
                break;
        }
    }

    /**
     * Toggle trạng thái enable/disable của icon type
     */
    protected function toggleIconType($iconType)
    {
        $configPath = $this->app->make('jankx.paths')['base'] . '/config/font-icons.php';

        if (!file_exists($configPath)) {
            return;
        }

        // Đọc config hiện tại
        $config = include $configPath;

        if (!isset($config['icon_types'][$iconType])) {
            return;
        }

        // Toggle trạng thái
        $currentStatus = $config['icon_types'][$iconType]['enabled'] ?? false;
        $config['icon_types'][$iconType]['enabled'] = !$currentStatus;

        // Ghi lại config
        $this->writeConfigFile($configPath, $config);

        // Hiển thị thông báo
        $newStatus = $config['icon_types'][$iconType]['enabled'] ? 'enabled' : 'disabled';
        add_action('admin_notices', function () use ($iconType, $newStatus) {
            echo '<div class="notice notice-success is-dismissible">';
            echo '<p>Icon type <strong>' . esc_html(ucfirst($iconType)) . '</strong> has been <strong>' . esc_html($newStatus) . '</strong>.</p>';
            echo '</div>';
        });
    }

    /**
     * Toggle trạng thái auto-load của icon type
     */
    protected function toggleAutoLoad($iconType)
    {
        $configPath = $this->app->make('jankx.paths')['base'] . '/config/font-icons.php';

        if (!file_exists($configPath)) {
            return;
        }

        // Đọc config hiện tại
        $config = include $configPath;

        if (!isset($config['icon_types'][$iconType])) {
            return;
        }

        // Toggle trạng thái auto-load
        $currentAutoLoad = $config['icon_types'][$iconType]['auto_load'] ?? false;
        $config['icon_types'][$iconType]['auto_load'] = !$currentAutoLoad;

        // Ghi lại config
        $this->writeConfigFile($configPath, $config);

        // Hiển thị thông báo
        $newAutoLoad = $config['icon_types'][$iconType]['auto_load'] ? 'enabled' : 'disabled';
        add_action('admin_notices', function () use ($iconType, $newAutoLoad) {
            echo '<div class="notice notice-success is-dismissible">';
            echo '<p>Auto-load for <strong>' . esc_html(ucfirst($iconType)) . '</strong> has been <strong>' . esc_html($newAutoLoad) . '</strong>.</p>';
            echo '</div>';
        });
    }

    /**
     * Xóa icon type
     */
    protected function removeIconType($iconType)
    {
        $configPath = $this->app->make('jankx.paths')['base'] . '/config/font-icons.php';

        if (!file_exists($configPath)) {
            return;
        }

        // Đọc config hiện tại
        $config = include $configPath;

        if (!isset($config['icon_types'][$iconType])) {
            return;
        }

        // Lưu thông tin icon type trước khi xóa để hiển thị thông báo
        $iconTypeName = ucfirst($iconType);

        // Xóa icon type khỏi config
        unset($config['icon_types'][$iconType]);

        // Ghi lại config
        $this->writeConfigFile($configPath, $config);

        // Xóa các file liên quan nếu có
        $this->cleanupIconTypeFiles($iconType);

        // Hiển thị thông báo
        add_action('admin_notices', function () use ($iconTypeName) {
            echo '<div class="notice notice-success is-dismissible">';
            echo '<p>Icon type <strong>' . esc_html($iconTypeName) . '</strong> has been <strong>removed</strong> successfully.</p>';
            echo '</div>';
        });
    }

    /**
     * Dọn dẹp files liên quan đến icon type đã xóa
     */
    protected function cleanupIconTypeFiles($iconType)
    {
        $basePath = $this->app->make('jankx.paths')['base'];

        // Xóa thư mục icons nếu có
        $iconDir = $basePath . '/resources/icons/' . $iconType;
        if (is_dir($iconDir)) {
            $this->recursiveDelete($iconDir);
        }

        // Xóa file JSON metadata nếu có
        $jsonFile = $basePath . '/resources/icons/' . $iconType . '.json';
        if (file_exists($jsonFile)) {
            unlink($jsonFile);
        }

        // Xóa file CSS nếu có
        $cssFile = $basePath . '/resources/icons/' . $iconType . '.css';
        if (file_exists($cssFile)) {
            unlink($cssFile);
        }
    }

    /**
     * Xóa thư mục và tất cả nội dung bên trong
     */
    protected function recursiveDelete($dir)
    {
        if (!is_dir($dir)) {
            return;
        }

        $files = array_diff(scandir($dir), array('.', '..'));
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            if (is_dir($path)) {
                $this->recursiveDelete($path);
            } else {
                unlink($path);
            }
        }
        rmdir($dir);
    }

    /**
     * Ghi config file
     */
    protected function writeConfigFile($configPath, $config)
    {
        $content = "<?php\n\nreturn " . var_export($config, true) . ";\n";
        file_put_contents($configPath, $content);
    }

    /**
     * Get service name
     */
    public function getName()
    {
        return 'admin-page';
    }
}
