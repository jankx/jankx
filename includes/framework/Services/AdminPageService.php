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
            'id' => 'jankx-extensions',
            'title' => __('Managed Extensions', 'jankx'),
            'menu_title' => __('Extensions', 'jankx'),
            'capability' => 'manage_options',
            'callback' => [$this, 'renderExtensionsPage'],
            'icon' => 'dashicons-admin-plugins',
            'position' => 20
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
            'id' => 'jankx-marketplace',
            'title' => __('Extension Marketplace', 'jankx'),
            'menu_title' => __('Marketplace', 'jankx'),
            'capability' => 'manage_options',
            'callback' => [$this, 'renderMarketplacePage'],
            'icon' => 'dashicons-store',
            'position' => 30
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
     * Render Extensions Management Page
     */
    public function renderExtensionsPage($page)
    {
        $extensionManager = $this->app->make('extension.manager');
        $extensionService = $this->app->make('extension.service');

        $extensions = $extensionManager->get_extensions();
        $enabledExtensions = $extensionService->getEnabledExtensions();

        $nonce = wp_create_nonce('jankx_extension_manager_nonce');
        ?>
        <div class="jankx-extensions-page" style="max-width:1200px; margin-top:20px;">
            <div class="extensions-header" style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                <p><?php _e('Manage your installed Jankx extensions. You can activate or deactivate them to control theme features.', 'jankx'); ?></p>
                <div class="extension-stats">
                    <span class="status-badge" style="background:#f0f0f1; padding:4px 10px; border-radius:4px; font-size:12px; border:1px solid #ccd0d4;">
                        <?php printf(__('Total: %d', 'jankx'), count($extensions)); ?>
                    </span>
                </div>
            </div>

            <div id="jankx-extension-notice" style="display:none; margin-bottom:15px;" class="notice"></div>

            <div class="jankx-extension-list" style="display:grid; grid-template-columns: 1fr; gap:15px;">
                <?php if (empty($extensions)): ?>
                    <div class="card" style="text-align:center; padding:50px;">
                        <span class="dashicons dashicons-admin-plugins" style="font-size:48px; width:48px; height:48px; color:#ccc;"></span>
                        <p><?php _e('No extensions found. Visit the Marketplace to install some!', 'jankx'); ?></p>
                        <a href="<?php echo admin_url('admin.php?page=jankx-marketplace'); ?>" class="button button-primary"><?php _e('Go to Marketplace', 'jankx'); ?></a>
                    </div>
                <?php else: ?>
                    <?php foreach ($extensions as $name => $extension):
                        $info = $extension->get_info();
                        $isActive = $extension->is_active();
                    ?>
                        <div class="card extension-item <?php echo $isActive ? 'is-active' : 'is-inactive'; ?>"
                             style="display:flex; align-items:center; padding:15px; border-left:4px solid <?php echo $isActive ? '#00a32a' : '#d63638'; ?>; background:#fff; border-top:1px solid #ccd0d4; border-right:1px solid #ccd0d4; border-bottom:1px solid #ccd0d4; box-shadow:0 1px 1px rgba(0,0,0,.04);">

                            <div class="extension-icon" style="margin-right:20px; color:<?php echo $isActive ? '#00a32a' : '#646970'; ?>;">
                                <span class="dashicons dashicons-admin-plugins" style="font-size:32px; width:32px; height:32px;"></span>
                            </div>

                            <div class="extension-main" style="flex-grow:1;">
                                <h3 style="margin:0 0 5px 0; font-size:16px;">
                                    <?php echo esc_html($info['name'] ?? $name); ?>
                                    <span style="font-weight:normal; font-size:12px; color:#666; margin-left:10px;">v<?php echo esc_html($info['version'] ?? '1.0.0'); ?></span>
                                </h3>
                                <p style="margin:0; font-size:13px; color:#646970; line-height:1.4;"><?php echo esc_html($info['description'] ?? ''); ?></p>
                                <div class="extension-meta" style="margin-top:5px; font-size:11px; color:#888;">
                                    <span><?php printf(__('Author: %s', 'jankx'), esc_html($info['author'] ?? 'Jankx Team')); ?></span>
                                    <?php if ($info['is_child_theme_extension']): ?>
                                        <span style="margin-left:15px; background:#e5f5fa; color:#005e7e; padding:1px 6px; border-radius:3px;"><?php _e('Child Theme', 'jankx'); ?></span>
                                    <?php endif; ?>
                                </div>
                            </div>

                            <div class="extension-actions" style="margin-left:20px;">
                                <button class="button <?php echo $isActive ? 'button-secondary' : 'button-primary'; ?> toggle-extension"
                                        data-extension="<?php echo esc_attr($name); ?>"
                                        data-nonce="<?php echo esc_attr($nonce); ?>">
                                    <?php echo $isActive ? __('Deactivate', 'jankx') : __('Activate', 'jankx'); ?>
                                </button>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>

        <style>
            .jankx-extension-list .extension-item.is-inactive { opacity:0.8; }
            .toggle-extension.loading { opacity:0.6; cursor:not-allowed; }
        </style>

        <script>
        jQuery(function($) {
            var $notice = $('#jankx-extension-notice');

            $(document).on('click', '.toggle-extension', function() {
                var $btn = $(this);
                var name = $btn.data('extension');
                var nonce = $btn.data('nonce');

                $btn.addClass('loading').prop('disabled', true);
                $notice.hide();

                $.post(ajaxurl, {
                    action: 'jankx_toggle_extension',
                    extension: name,
                    nonce: nonce
                }, function(res) {
                    if (res.success) {
                        location.reload();
                    } else {
                        $notice.removeClass('notice-success').addClass('notice-error')
                               .html('<p>' + (res.data || 'Error') + '</p>').show();
                        $btn.removeClass('loading').prop('disabled', false);
                    }
                }).fail(function() {
                    $notice.removeClass('notice-success').addClass('notice-error')
                           .html('<p><?php echo esc_js(__('An error occurred.', 'jankx')); ?></p>').show();
                    $btn.removeClass('loading').prop('disabled', false);
                });
            });
        });
        </script>
        <?php
    }

    /**
     * Render Marketplace Page
     */
    public function renderMarketplacePage($page)
    {
        if (isset($_GET['force_refresh'])) {
            delete_transient('jankx_marketplace_extensions');
        }

        $marketplace = $this->app->make('extension.marketplace');
        $extensions  = $marketplace->getAvailableExtensions();

        // Read from transient ONLY - never block on live API
        $cachedUpdate = get_transient('jankx_theme_update_check');
        $themeUpdate  = ($cachedUpdate && isset($cachedUpdate['version'])) ? $cachedUpdate : false;

        $nonce = wp_create_nonce('jankx_marketplace_nonce');
        ?>
        <div class="jankx-marketplace-modern">
            <header class="marketplace-header">
                <div class="header-content">
                    <h1><?php _e('Thư viện Extension', 'jankx'); ?></h1>
                    <p class="subtitle"><?php _e('Khám phá và cài đặt các extension mở rộng tính năng cho theme Jankx của bạn. Tất cả extension tự động tương thích với phiên bản PHP và Jankx hiện tại.', 'jankx'); ?></p>
                </div>
            </header>

            <nav class="marketplace-toolbar">
                <div class="search-wrapper">
                    <span class="dashicons dashicons-search"></span>
                    <input type="text" id="extension-search" placeholder="<?php esc_attr_e('Tìm kiếm extension...', 'jankx'); ?>">
                </div>
                <div class="filter-tabs">
                    <button class="filter-tab active" data-filter="all"><?php _e('Tất cả', 'jankx'); ?></button>
                    <button class="filter-tab" data-filter="popular"><?php _e('Phổ biến nhất', 'jankx'); ?></button>
                    <button class="filter-tab" data-filter="free"><?php _e('Miễn phí', 'jankx'); ?></button>
                    <button class="filter-tab" data-filter="premium"><?php _e('Premium', 'jankx'); ?></button>
                    <button class="filter-tab" data-filter="newest"><?php _e('Mới nhất', 'jankx'); ?></button>
                </div>
            </nav>

            <div class="jankx-extension-grid">
                <?php if (empty($extensions)): ?>
                    <div class="empty-state">
                        <div class="empty-icon"><span class="dashicons dashicons-store"></span></div>
                        <h3><?php _e('Không tìm thấy extension nào', 'jankx'); ?></h3>
                        <p><?php _e('Thư viện extension hiện đang được cập nhật. Vui lòng quay lại sau ít phút hoặc thử làm mới dữ liệu.', 'jankx'); ?></p>
                        <a href="<?php echo add_query_arg('force_refresh', '1'); ?>" class="button jankx-btn-primary" style="width:auto;"><?php _e('Làm mới dữ liệu', 'jankx'); ?></a>
                    </div>
                <?php else: ?>
                    <?php foreach ($extensions as $ext):
                        $slug = isset($ext['slug']) ? $ext['slug'] : (isset($ext['id']) ? (string)$ext['id'] : '');
                        $isPremium = isset($ext['is_premium']) && $ext['is_premium'];
                        $rating = $ext['rating'] ?? 5;
                        $reviews = $ext['reviews_count'] ?? 0;
                        $installs = $ext['installs_count'] ?? 0;
                        $lastUpdated = $ext['last_updated_diff'] ?? __('2 ngày trước', 'jankx');
                    ?>
                        <div class="extension-card-modern <?php echo $isPremium ? 'is-premium' : ''; ?>" data-slug="<?php echo esc_attr($slug); ?>">
                            <div class="card-body">
                                <div class="extension-head">
                                        <div class="extension-icon">
                                            <?php if (!empty($ext['icon'])): ?>
                                                <img src="<?php echo esc_url($ext['icon']); ?>" alt="<?php echo esc_attr($ext['name']); ?>">
                                            <?php else:
                                                $iconData = $this->getRandomGradient($slug);
                                            ?>
                                                <div class="default-icon" style="background: <?php echo $iconData['grad']; ?>;">
                                                    <span class="dashicons <?php echo esc_attr($iconData['icon']); ?>"></span>
                                                </div>
                                            <?php endif; ?>
                                        </div>
                                    <div class="extension-title-block">
                                        <h3 class="extension-title"><?php echo esc_html($ext['name'] ?? 'Unknown Extension'); ?></h3>
                                        <?php if ($isPremium): ?>
                                            <span class="badge premium"><?php _e('Premium', 'jankx'); ?></span>
                                        <?php else: ?>
                                            <span class="badge free"><?php _e('Miễn phí', 'jankx'); ?></span>
                                        <?php endif; ?>
                                    </div>
                                </div>

                                <p class="extension-desc"><?php echo esc_html($ext['description'] ?? __('No description available.', 'jankx')); ?></p>

                                <div class="extension-ratings">
                                    <div class="stars">
                                        <?php for ($i = 1; $i <= 5; $i++): ?>
                                            <span class="dashicons dashicons-star-filled <?php echo $i <= $rating ? 'active' : ''; ?>"></span>
                                        <?php endfor; ?>
                                    </div>
                                    <span class="rating-text">(<?php printf(__('%s đánh giá', 'jankx'), number_format($reviews)); ?>)</span>
                                </div>

                                <div class="extension-stats-modern">
                                    <div class="stat-item">
                                        <span class="dashicons dashicons-download"></span>
                                        <span><?php printf(__('%s lượt cài đặt', 'jankx'), number_format($installs)); ?></span>
                                    </div>
                                </div>

                                <div class="extension-footer-meta">
                                    <span class="version">v<?php echo esc_html($ext['version'] ?? '1.0.0'); ?></span>
                                    <span class="author"><?php printf(__('bởi %s', 'jankx'), '<span class="author-name">' . esc_html($ext['author'] ?? 'Jankx Team') . '</span>'); ?></span>
                                </div>

                                <div class="card-action-area">
                                    <span class="update-time"><?php printf(__('Cập nhật %s', 'jankx'), $lastUpdated); ?></span>
                                    <button class="button jankx-btn-primary install-extension"
                                            data-slug="<?php echo esc_attr($slug); ?>"
                                            data-nonce="<?php echo esc_attr($nonce); ?>">
                                        <?php _e('Cài đặt ngay', 'jankx'); ?>
                                    </button>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <div class="marketplace-pagination">
                <button class="page-nav prev disabled"><span class="dashicons dashicons-arrow-left-alt2"></span></button>
                <div class="page-numbers">
                    <span class="page-number active">1</span>
                    <span class="page-number">2</span>
                    <span class="page-number">3</span>
                    <span class="page-dots">...</span>
                    <span class="page-number">10</span>
                </div>
                <button class="page-nav next"><span class="dashicons dashicons-arrow-right-alt2"></span></button>
            </div>

            <footer class="marketplace-footer">
                <p><?php printf(__('Được phát triển với %s bởi Jankx Team', 'jankx'), '<span class="heart" style="color:#e91e63;">❤</span>'); ?></p>
            </footer>
        </div>

        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

            .jankx-marketplace-modern {
                font-family: 'Inter', sans-serif;
                color: #2c3338;
                padding: 40px;
                background: #f8fafc;
                margin: -20px -20px 0 -20px;
                min-height: calc(100vh - 32px);
            }

            .marketplace-header h1 {
                font-size: 32px;
                font-weight: 700;
                margin: 0 0 16px 0;
                color: #0f172a;
            }

            .marketplace-header .subtitle {
                font-size: 15px;
                color: #64748b;
                max-width: 800px;
                line-height: 1.6;
                margin-bottom: 40px;
            }

            /* Toolbar */
            .marketplace-toolbar {
                display: flex;
                align-items: center;
                gap: 24px;
                margin-bottom: 40px;
            }

            .search-wrapper {
                position: relative;
                flex-grow: 1;
                max-width: 360px;
            }

            .search-wrapper .dashicons {
                position: absolute;
                left: 14px;
                top: 50%;
                transform: translateY(-50%);
                color: #94a3b8;
            }

            .search-wrapper input {
                width: 100%;
                padding: 12px 14px 12px 42px;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                font-size: 14px;
                box-shadow: none;
                background: #fff;
                color: #1e293b;
            }

            .filter-tabs {
                display: flex;
                gap: 12px;
            }

            .filter-tab {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 10px 24px;
                font-size: 14px;
                font-weight: 500;
                color: #64748b;
                cursor: pointer;
                transition: all 0.2s;
            }

            .filter-tab:hover { background: #f1f5f9; }
            .filter-tab.active {
                background: #3b82f6;
                border-color: #3b82f6;
                color: #fff;
            }

            /* Grid & Cards */
            .jankx-extension-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 32px;
            }

            .extension-card-modern {
                background: #fff;
                border-radius: 16px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                display: flex;
                flex-direction: column;
                transition: transform 0.2s, box-shadow 0.2s;
            }

            .extension-card-modern:hover {
                transform: translateY(-4px);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }

            .card-body { padding: 32px; flex-grow: 1; display: flex; flex-direction: column; }

            .extension-head {
                display: flex;
                gap: 20px;
                margin-bottom: 24px;
            }

            .extension-icon {
                width: 64px;
                height: 64px;
                border-radius: 16px;
                overflow: hidden;
                flex-shrink: 0;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            }

            .extension-icon img { width: 100%; height: 100%; object-fit: cover; }
            .default-icon {
                width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center;
                color: #fff;
            }
            .default-icon .dashicons { font-size: 32px; width: 32px; height: 32px; }

            .extension-title-block { display: flex; flex-direction: column; gap: 6px; justify-content: center; }
            .extension-title { font-size: 18px; font-weight: 700; margin: 0; color: #0f172a; }

            .badge {
                font-size: 11px;
                font-weight: 700;
                padding: 4px 12px;
                border-radius: 6px;
                text-transform: capitalize;
                display: inline-block;
                width: fit-content;
            }
            .badge.premium { background: #fff7ed; color: #f97316; }
            .badge.free { background: #f0fdf4; color: #10b981; }

            .extension-desc {
                font-size: 14px;
                color: #64748b;
                line-height: 1.6;
                margin: 0 0 24px 0;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                min-height: 67px;
            }

            .extension-ratings {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 12px;
            }

            .stars { color: #e2e8f0; display: flex; }
            .stars .dashicons { font-size: 16px; width: 16px; height: 16px; }
            .stars .dashicons.active { color: #f59e0b; }
            .rating-text { font-size: 13px; color: #94a3b8; }

            .extension-stats-modern { margin-bottom: 24px; font-size: 13px; color: #64748b; }
            .stat-item { display: flex; align-items: center; gap: 8px; }
            .stat-item .dashicons { font-size: 18px; width: 18px; height: 18px; color: #94a3b8; }

            .extension-footer-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 13px;
                color: #94a3b8;
                margin-bottom: 16px;
            }

            .author-name { color: #3b82f6; font-weight: 500; }

            .card-action-area {
                margin-top: auto;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .update-time { font-size: 12px; color: #cbd5e1; }

            .jankx-btn-primary {
                background: #3b82f6 !important;
                border-radius: 10px !important;
                padding: 12px 24px !important;
                font-weight: 600 !important;
                color: #fff !important;
                border: none !important;
                transition: background 0.2s !important;
                height: auto !important;
                line-height: 1 !important;
                width: 100%;
                text-align: center;
            }

            .jankx-btn-primary:hover { background: #2563eb !important; }

            /* Pagination */
            .marketplace-pagination {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 12px;
                margin-top: 60px;
                width: 100%;
            }

            .page-numbers {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .page-nav, .page-number {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
                color: #64748b;
                text-decoration: none;
                font-size: 14px;
            }

            .page-number:hover, .page-nav:not(.disabled):hover {
                border-color: #3b82f6;
                color: #3b82f6;
                background: #f0f7ff;
            }

            .page-number.active {
                background: #3b82f6;
                color: #fff;
                border-color: #3b82f6;
                box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
            }

            .page-nav.disabled { color: #cbd5e1; cursor: not-allowed; opacity: 0.5; }
            .page-dots { font-weight: bold; color: #94a3b8; padding: 0 4px; }

            .marketplace-footer {
                margin-top: 60px;
                text-align: center;
                padding-top: 40px;
                border-top: 1px solid #e2e8f0;
                color: #94a3b8;
                font-size: 14px;
            }

            .empty-state {
                grid-column: 1 / -1;
                background: #fff;
                padding: 80px;
                text-align: center;
                border-radius: 20px;
                border: 2px dashed #e2e8f0;
            }
        </style>

        <script>
        jQuery(function($) {
            var $notice = $('#jankx-install-notice');

            $(document).on('click', '.install-extension', function() {
                var $btn  = $(this);
                var slug  = $btn.data('slug');
                var nonce = $btn.data('nonce');

                if (!slug) return;

                $btn.addClass('loading').prop('disabled', true).text('<?php echo esc_js(__('Đang cài...', 'jankx')); ?>');
                $notice.hide();

                $.post(ajaxurl, {
                    action: 'jankx_install_extension',
                    slug:   slug,
                    nonce:  nonce
                }, function(res) {
                    if (res.success) {
                        $notice.removeClass('notice-error').addClass('notice-success')
                               .html('<p>' + res.data.message + '</p>').show();
                        $btn.text('<?php echo esc_js(__('Đã cài đặt', 'jankx')); ?>');
                        $btn.addClass('installed').prop('disabled', true).css('background', '#10b981');
                    } else {
                        $notice.removeClass('notice-success').addClass('notice-error')
                               .html('<p>' + (res.data ? res.data.message : '<?php echo esc_js(__('Cài đặt thất bại.', 'jankx')); ?>') + '</p>').show();
                        $btn.removeClass('loading').prop('disabled', false).text('<?php echo esc_js(__('Cài đặt ngay', 'jankx')); ?>');
                    }
                }).fail(function() {
                    $notice.removeClass('notice-success').addClass('notice-error')
                           .html('<p><?php echo esc_js(__('Lỗi kết nối. Vui lòng thử lại.', 'jankx')); ?></p>').show();
                    $btn.removeClass('loading').prop('disabled', false).text('<?php echo esc_js(__('Cài đặt ngay', 'jankx')); ?>');
                });
            });

            // Search functionality (simple client-side filter for demo)
            $('#extension-search').on('input', function() {
                var q = $(this).val().toLowerCase();
                $('.extension-card-modern').each(function() {
                    var text = $(this).text().toLowerCase();
                    $(this).toggle(text.indexOf(q) > -1);
                });
            });
        });
        </script>
        <?php
    }

    /**
     * Get a random premium icon and gradient for extension icon fallback
     */
    private function getRandomGradient($seed)
    {
        $options = [
            ['grad' => 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 'icon' => 'dashicons-chart-area'],
            ['grad' => 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', 'icon' => 'dashicons-performance'],
            ['grad' => 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 'icon' => 'dashicons-share-alt2'],
            ['grad' => 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)', 'icon' => 'dashicons-menu-alt3'],
            ['grad' => 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', 'icon' => 'dashicons-email-alt'],
            ['grad' => 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 'icon' => 'dashicons-analytics'],
            ['grad' => 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 'icon' => 'dashicons-admin-network'],
        ];
        $index = abs(crc32($seed)) % count($options);
        return $options[$index];
    }

    /**
     * Get service name
     */
    public function getName()
    {
        return 'admin-page';
    }
}
