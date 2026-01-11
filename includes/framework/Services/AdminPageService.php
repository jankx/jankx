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
            'id' => 'jankx-settings',
            'title' => Config::get('app.admin_page_title', 'Jankx Framework'),
            'menu_title' => Config::get('app.menu_title', 'Jankx'),
            'capability' => 'manage_options',
            'callback' => [$this, 'renderDashboardPage'],
            'icon' => 'dashicons-dashboard',
            'position' => 10
        ]);


        $this->addPage([
            'id' => 'jankx-icons',
            'title' => __('Icon Repository', 'jankx'),
            'menu_title' => __('Icon Repository', 'jankx'),
            'capability' => 'manage_options',
            'callback' => [$this, 'renderIconsPage'],
            'icon' => 'dashicons-format-image',
            'position' => 25
        ]);

        $this->addPage([
            'id' => 'jankx-utilities',
            'title' => __('Utilities', 'jankx'),
            'menu_title' => __('Utilities', 'jankx'),
            'capability' => 'manage_options',
            'callback' => [$this, 'renderUtilitiesPage'],
            'icon' => 'dashicons-admin-tools',
            'position' => 55
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

        $page = wp_parse_args($pageData, $defaults);

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
        echo '<h3>' . __('Quick Actions', 'jankx') . '</h3>';
        echo '<ul>';
        echo '<li><a href="' . admin_url('admin.php?page=jankx-icons') . '">' . __('Manage Icons', 'jankx') . '</a></li>';
        echo '<li><a href="' . admin_url('admin.php?page=jankx-utilities') . '">' . __('Utilities', 'jankx') . '</a></li>';
        echo '<li><a href="' . admin_url('customize.php') . '">' . __('Customize Theme', 'jankx') . '</a></li>';
        echo '</ul>';
        echo '</div>';

        // Services Status Widget
        echo '<div class="jankx-widget">';
        echo '<h3>' . __('Services Status', 'jankx') . '</h3>';
        echo '<ul>';
        echo '<li>Framework Version: ' . ($this->app->make('jankx.version') ?? 'Unknown') . '</li>';
        echo '<li>Environment: ' . ($this->app->make('jankx.environment') ?? 'Unknown') . '</li>';
        echo '<li>Debug Mode: ' . (WP_DEBUG ? 'Enabled' : 'Disabled') . '</li>';
        echo '<li>PHP Version: ' . PHP_VERSION . '</li>';
        echo '<li>WordPress Version: ' . get_bloginfo('version') . '</li>';
        echo '</ul>';
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
    }

    /**
     * Render page footer
     */
    protected function renderPageFooter($page)
    {
        echo '</div>'; // Close .wrap
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
    public function renderIconsPage($page)
    {
        $active_tab = isset($_GET['tab']) ? $_GET['tab'] : 'repository';
        ?>
        <div class="wrap">
            <nav class="nav-tab-wrapper">
                <a href="?page=jankx-icons&tab=repository"
                    class="nav-tab <?php echo $active_tab == 'repository' ? 'nav-tab-active' : ''; ?>"><?php _e('Repository', 'jankx'); ?></a>
                <a href="?page=jankx-icons&tab=manage"
                    class="nav-tab <?php echo $active_tab == 'manage' ? 'nav-tab-active' : ''; ?>"><?php _e('Manage Icons', 'jankx'); ?></a>
                <a href="?page=jankx-icons&tab=settings"
                    class="nav-tab <?php echo $active_tab == 'settings' ? 'nav-tab-active' : ''; ?>"><?php _e('Settings', 'jankx'); ?></a>
            </nav>

            <div class="jankx-tab-content">
                <?php
                switch ($active_tab) {
                    case 'repository':
                        $this->renderIconsRepositoryContent();
                        break;
                    case 'manage':
                        $this->renderIconsManageContent();
                        break;
                    case 'settings':
                        $this->renderIconsSettingsContent();
                        break;
                }
                ?>
            </div>
        </div>
        <?php
    }

    protected function renderIconsRepositoryContent()
    {
        echo '<div class="card"><p>Icon Repository content coming soon...</p></div>';
    }

    protected function renderIconsManageContent()
    {
        echo '<div class="card"><p>Manage Icons content coming soon...</p></div>';
    }

    protected function renderIconsSettingsContent()
    {
        echo '<div class="card"><p>Icon Settings content coming soon...</p></div>';
    }

    /**
     * Enqueue page assets
     */
    protected function enqueuePageAssets($page)
    {
        if ($page['id'] === 'jankx-icons') {
            // Enqueue icon repository scripts if needed
        }
    }

    /**
     * Render Utilities Page
     */
    public function renderUtilitiesPage($page)
    {
        $all_sizes = $this->getAllImageSizes();
        $enabled_sizes = get_option('jankx_enabled_image_sizes', array_keys($all_sizes));

        if (!is_array($enabled_sizes)) {
            $enabled_sizes = array_keys($all_sizes);
        }

        ?>
        <div class="jankx-utilities-page">
            <div class="card">
                <h2><?php _e('Media Settings', 'jankx'); ?></h2>
                <p><?php _e('Enable or disable specific image sizes. Unchecked sizes will be filtered out site-wide.', 'jankx'); ?>
                </p>

                <form method="post" action="">
                    <?php wp_nonce_field('jankx_save_utilities', 'jankx_utilities_nonce'); ?>
                    <input type="hidden" name="jankx_action" value="save_image_sizes">

                    <table class="wp-list-table widefat fixed striped">
                        <thead>
                            <tr>
                                <th class="manage-column column-cb check-column">
                                    <label class="screen-reader-text" for="cb-select-all-1"><?php _e('Select All'); ?></label>
                                    <input id="cb-select-all-1" type="checkbox" <?php checked(count($enabled_sizes) === count($all_sizes)); ?>>
                                </th>
                                <th><?php _e('Size Name', 'jankx'); ?></th>
                                <th><?php _e('Dimensions', 'jankx'); ?></th>
                                <th><?php _e('Crop', 'jankx'); ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($all_sizes as $name => $size): ?>
                                <tr>
                                    <th scope="row" class="check-column">
                                        <input type="checkbox" name="enabled_sizes[]" value="<?php echo esc_attr($name); ?>" <?php checked(in_array($name, $enabled_sizes)); ?>>
                                    </th>
                                    <td>
                                        <strong><?php echo esc_html($name); ?></strong>
                                    </td>
                                    <td>
                                        <?php echo esc_html($size['width'] . ' x ' . $size['height']); ?>
                                    </td>
                                    <td>
                                        <?php echo esc_html($size['crop'] ? __('Yes') : __('No')); ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>

                    <p class="submit">
                        <input type="submit" name="submit" id="submit" class="button button-primary"
                            value="<?php _e('Save Changes'); ?>">
                    </p>
                </form>
            </div>
        </div>
        <script>
            jQuery(document).ready(function ($) {
                $('#cb-select-all-1').click(function () {
                    $('input[name="enabled_sizes[]"]').prop('checked', this.checked);
                });
            });
        </script>
        <style>
            .jankx-utilities-page .card {
                max-width: 800px;
                padding: 20px;
                background: #fff;
                margin-top: 20px;
                border: 1px solid #ccd0d4;
                box-shadow: 0 1px 1px rgba(0, 0, 0, .04);
            }

            .jankx-dashboard-widgets {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                margin-top: 20px;
            }

            .jankx-widget {
                background: #fff;
                border: 1px solid #ccd0d4;
                padding: 15px;
                min-width: 300px;
                box-shadow: 0 1px 1px rgba(0, 0, 0, .04);
            }

            .jankx-widget h3 {
                margin-top: 0;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }
        </style>
        <?php
    }

    /**
     * Get all registered image sizes
     */
    protected function getAllImageSizes()
    {
        $sizes = [];
        $intermediate_sizes = get_intermediate_image_sizes();
        $additional_sizes = wp_get_additional_image_sizes();

        foreach ($intermediate_sizes as $size) {
            if (in_array($size, ['thumbnail', 'medium', 'medium_large', 'large'])) {
                $sizes[$size] = [
                    'width' => get_option("{$size}_size_w"),
                    'height' => get_option("{$size}_size_h"),
                    'crop' => (bool) get_option("{$size}_crop"),
                ];
            } elseif (isset($additional_sizes[$size])) {
                $sizes[$size] = [
                    'width' => $additional_sizes[$size]['width'],
                    'height' => $additional_sizes[$size]['height'],
                    'crop' => $additional_sizes[$size]['crop'],
                ];
            }
        }

        return $sizes;
    }

    /**
     * Get service name
     */
    public function getName()
    {
        return 'admin-page';
    }
}
