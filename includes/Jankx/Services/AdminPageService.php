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
            echo '<a href="' . admin_url('admin.php?page=jankx-icons&tab=manage&type=' . $type) . '" class="button button-small">Manage Icons</a> ';
            echo '<a href="' . admin_url('admin.php?page=jankx-icons&tab=import&type=' . $type) . '" class="button button-small">Import/Export</a>';
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

                // Simulate loading icons (replace with actual AJAX call)
                setTimeout(function() {
                    displayIcons(getSampleIcons(type));
                }, 500);
            }

            function getSampleIcons(type) {
                // Sample icons for demonstration
                const sampleIcons = {
                    'material': [
                        { name: 'home', category: 'navigation', unicode: 'e88a', prefixes: ['material-icons'] },
                        { name: 'search', category: 'action', unicode: 'e8b6', prefixes: ['material-icons'] },
                        { name: 'favorite', category: 'toggle', unicode: 'e87d', prefixes: ['material-icons'] },
                        { name: 'settings', category: 'action', unicode: 'e8b8', prefixes: ['material-icons'] },
                        { name: 'person', category: 'social', unicode: 'e7fd', prefixes: ['material-icons'] },
                        { name: 'email', category: 'communication', unicode: 'e0e1', prefixes: ['material-icons'] },
                        { name: 'phone', category: 'communication', unicode: 'e0cd', prefixes: ['material-icons'] },
                        { name: 'location_on', category: 'maps', unicode: 'e55f', prefixes: ['material-icons'] },
                        { name: 'menu', category: 'navigation', unicode: 'e5d2', prefixes: ['material-icons'] },
                        { name: 'close', category: 'action', unicode: 'e5cd', prefixes: ['material-icons'] },
                        { name: 'add', category: 'action', unicode: 'e145', prefixes: ['material-icons'] },
                        { name: 'edit', category: 'action', unicode: 'e3c9', prefixes: ['material-icons'] }
                    ],
                    'fontawesome': [
                        { name: 'home', category: 'solid', unicode: 'f015', prefixes: ['fas'] },
                        { name: 'search', category: 'solid', unicode: 'f002', prefixes: ['fas'] },
                        { name: 'heart', category: 'solid', unicode: 'f004', prefixes: ['fas'] },
                        { name: 'cog', category: 'solid', unicode: 'f013', prefixes: ['fas'] },
                        { name: 'user', category: 'solid', unicode: 'f007', prefixes: ['fas'] },
                        { name: 'envelope', category: 'solid', unicode: 'f0e0', prefixes: ['fas'] },
                        { name: 'phone', category: 'solid', unicode: 'f095', prefixes: ['fas'] },
                        { name: 'map-marker-alt', category: 'solid', unicode: 'f3c5', prefixes: ['fas'] },
                        { name: 'bars', category: 'solid', unicode: 'f0c9', prefixes: ['fas'] },
                        { name: 'times', category: 'solid', unicode: 'f00d', prefixes: ['fas'] },
                        { name: 'plus', category: 'solid', unicode: 'f067', prefixes: ['fas'] },
                        { name: 'pencil-alt', category: 'solid', unicode: 'f303', prefixes: ['fas'] }
                    ],
                    'custom': [
                        { name: 'custom-home', category: 'navigation', unicode: 'e001', prefixes: ['icon'] },
                        { name: 'custom-search', category: 'action', unicode: 'e002', prefixes: ['icon'] },
                        { name: 'custom-heart', category: 'toggle', unicode: 'e003', prefixes: ['icon'] },
                        { name: 'custom-settings', category: 'action', unicode: 'e004', prefixes: ['icon'] },
                        { name: 'custom-user', category: 'social', unicode: 'e005', prefixes: ['icon'] },
                        { name: 'custom-email', category: 'communication', unicode: 'e006', prefixes: ['icon'] },
                        { name: 'custom-phone', category: 'communication', unicode: 'e007', prefixes: ['icon'] },
                        { name: 'custom-location', category: 'maps', unicode: 'e008', prefixes: ['icon'] }
                    ],
                    'svg': [
                        { name: 'svg-home', category: 'navigation', unicode: 'home', prefixes: ['svg-icon'] },
                        { name: 'svg-search', category: 'action', unicode: 'search', prefixes: ['svg-icon'] },
                        { name: 'svg-heart', category: 'toggle', unicode: 'heart', prefixes: ['svg-icon'] },
                        { name: 'svg-settings', category: 'action', unicode: 'settings', prefixes: ['svg-icon'] },
                        { name: 'svg-user', category: 'social', unicode: 'user', prefixes: ['svg-icon'] },
                        { name: 'svg-email', category: 'communication', unicode: 'email', prefixes: ['svg-icon'] },
                        { name: 'svg-phone', category: 'communication', unicode: 'phone', prefixes: ['svg-icon'] },
                        { name: 'svg-location', category: 'maps', unicode: 'location', prefixes: ['svg-icon'] }
                    ]
                };

                return sampleIcons[type] || [];
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
                case 'svg':
                    return 8; // Sample icons hiện tại
                default:
                    return 50;
            }
        }

        return 0;
    }

    /**
     * Render tab Import
     */
    protected function renderImportTab()
    {
        $iconType = $_GET['type'] ?? '';

        if (empty($iconType)) {
            $this->renderImportTypeSelector();
            return;
        }

        $this->renderImportInterface($iconType);
    }

    /**
     * Render selector để chọn icon type cho import
     */
    protected function renderImportTypeSelector()
    {
        echo '<div class="tab-content">';
        echo '<h2>Select Icon Type for Import/Export</h2>';
        echo '<p>Choose an icon type to import icons from CSS files or export existing icon data:</p>';

        $allIconTypes = Config::get('font-icons.icon_types', []);

        if (empty($allIconTypes)) {
            echo '<p>No icon types configured.</p>';
            return;
        }

        echo '<div class="jankx-icon-type-grid">';
        foreach ($allIconTypes as $type => $config) {
            $enabled = $config['enabled'] ?? false;

            echo '<div class="jankx-icon-type-card">';
            echo '<h3>' . esc_html(ucfirst($type)) . '</h3>';
            echo '<p><strong>Status:</strong> ' . ($enabled ? 'Enabled' : 'Disabled') . '</p>';
            echo '<p><strong>Version:</strong> ' . esc_html($config['version'] ?? 'Unknown') . '</p>';
            echo '<a href="' . admin_url('admin.php?page=jankx-icons&tab=import&type=' . $type) . '" class="button button-primary">Import/Export</a>';
            echo '</div>';
        }
        echo '</div>';
        echo '</div>';
    }

    /**
     * Render giao diện import/export cho type cụ thể
     */
    protected function renderImportInterface($iconType)
    {
        $allIconTypes = Config::get('font-icons.icon_types', []);

        if (!isset($allIconTypes[$iconType])) {
            echo '<div class="tab-content">';
            echo '<p>Invalid icon type: ' . esc_html($iconType) . '</p>';
            echo '<a href="' . admin_url('admin.php?page=jankx-icons&tab=import') . '" class="button">← Back to Type Selection</a>';
            echo '</div>';
            return;
        }

        $config = $allIconTypes[$iconType];
        $enabled = $config['enabled'] ?? false;

        echo '<div class="tab-content">';
        echo '<div class="jankx-import-header">';
        echo '<h2>Import/Export ' . esc_html(ucfirst($iconType)) . ' Icons</h2>';
        echo '<a href="' . admin_url('admin.php?page=jankx-icons&tab=import') . '" class="button">← Back to Type Selection</a>';
        echo '</div>';

        if (!$enabled) {
            echo '<div class="notice notice-warning">';
            echo '<p><strong>Warning:</strong> This icon type is currently disabled. Enable it first to import/export icons.</p>';
            echo '</div>';
        }

        // Import section
        echo '<div class="jankx-import-section">';
        echo '<h3>Import Icons from CSS</h3>';
        echo '<p>Import icons by providing a CSS file URL or uploading a CSS file.</p>';

        echo '<form method="post" action="" enctype="multipart/form-data">';
        echo '<input type="hidden" name="jankx_action" value="import_icons">';
        echo '<input type="hidden" name="icon_type" value="' . esc_attr($iconType) . '">';

        echo '<table class="form-table">';
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
        echo '<input type="text" id="icon_prefix" name="icon_prefix" class="regular-text" value="' . esc_attr($config['prefixes'][0] ?? '') . '">';
        echo '<p class="description">The CSS class prefix for icons (e.g., "fas" for Font Awesome).</p>';
        echo '</td>';
        echo '</tr>';
        echo '</table>';

        echo '<p class="submit">';
        echo '<input type="submit" name="submit" id="submit" class="button button-primary" value="Import Icons">';
        echo '</p>';
        echo '</form>';
        echo '</div>';

        // Export section
        echo '<div class="jankx-export-section">';
        echo '<h3>Export Icon Data</h3>';
        echo '<p>Export the current icon data for this type.</p>';

        echo '<form method="post" action="">';
        echo '<input type="hidden" name="jankx_action" value="export_icons">';
        echo '<input type="hidden" name="icon_type" value="' . esc_attr($iconType) . '">';

        echo '<p class="submit">';
        echo '<input type="submit" name="submit" id="submit" class="button" value="Export Icons">';
        echo '</p>';
        echo '</form>';
        echo '</div>';

        // Recent imports
        echo '<div class="jankx-recent-imports">';
        echo '<h3>Recent Imports</h3>';
        echo '<p>No recent imports found.</p>';
        echo '</div>';

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
