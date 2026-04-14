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
        $this->registerShortcodes();

        add_action('wp_dashboard_setup', [$this, 'registerDashboardWidgets'], 5);
        add_action('admin_enqueue_scripts', [$this, 'enqueueDashboardAssets']);
    }

    /**
     * Enqueue assets cho Dashboard chính
     */
    public function enqueueDashboardAssets($hook)
    {
        if ('index.php' === $hook) {
            wp_enqueue_style('jankx-dashboard-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', [], null);
        }
    }

    /**
     * Đăng ký Dashboard Widgets
     */
    public function registerDashboardWidgets()
    {
        $license = $this->app->make('license');
        $isActivated = $license->isActivated();

        if (!$isActivated) {
            wp_add_dashboard_widget(
                'jankx_license_widget',
                __('JANKX PRO Activation Required', 'jankx'),
                [$this, 'renderLicenseWidget']
            );
        }

        wp_add_dashboard_widget(
            'jankx_dashboard_widget',
            __('JANKX PRO News & Status', 'jankx'),
            [$this, 'renderMainDashboardWidget']
        );

        // Move to top
        global $wp_meta_boxes;
        
        $dashboard = $wp_meta_boxes['dashboard']['normal']['core'];
        $new_order = [];
        
        if (isset($dashboard['jankx_dashboard_widget'])) {
            $new_order['jankx_dashboard_widget'] = $dashboard['jankx_dashboard_widget'];
            unset($dashboard['jankx_dashboard_widget']);
        }
        
        if (isset($dashboard['jankx_license_widget'])) {
            $new_order['jankx_license_widget'] = $dashboard['jankx_license_widget'];
            unset($dashboard['jankx_license_widget']);
        }
        
        $wp_meta_boxes['dashboard']['normal']['core'] = array_merge($new_order, $dashboard);
    }

    /**
     * Render License Activation Widget
     */
    public function renderLicenseWidget()
    {
        ?>
        <div class="jankx-license-widget-content" style="padding: 15px; background: #fff; border-left: 4px solid #ef4444; border-radius: 8px;">
            <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
                <span class="dashicons dashicons-shield-plugins" style="color: #ef4444; font-size: 24px; width: 24px; height: 24px;"></span>
                <div>
                    <h4 style="margin: 0 0 5px 0; font-size: 15px; font-weight: 700; color: #1e293b;"><?php _e('Activate JANKX PRO', 'jankx'); ?></h4>
                    <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;"><?php _e('Kích hoạt theme JANKX PRO để nhận các bản cập nhật tự động, truy cập kho extension premium và nhận hỗ trợ kỹ thuật từ đội ngũ phát triển.', 'jankx'); ?></p>
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <a href="<?php echo admin_url('admin.php?page=jankx-license'); ?>" class="button button-primary" style="background: #3b82f6; border: none; border-radius: 8px; font-weight: 600;"><?php _e('Kích hoạt ngay', 'jankx'); ?></a>
                <a href="https://optilarity.top" target="_blank" class="button" style="border-radius: 8px;"><?php _e('Mua bản quyền', 'jankx'); ?></a>
            </div>
        </div>
        <?php
    }

    /**
     * Nội dung của Dashboard Widget chính
     */
    public function renderMainDashboardWidget()
    {
        $version = $this->app->make('jankx.version') ?? '1.0.0';
        ?>
        <div class="jankx-dashboard-widget-content">
            <div class="jankx-widget-header" style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                <span class="dashicons dashicons-art" style="color: #3b82f6;"></span>
                <strong>JANKX PRO v<?php echo esc_html($version); ?></strong>
                <span style="margin-left: auto; font-size: 11px; background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 10px;"><?php _e('Operational', 'jankx'); ?></span>
            </div>
            
            <p style="font-size: 13px; color: #64748b;"><?php _e('Chào mừng bạn quay trở lại! Dưới đây là các bản cập nhật mới nhất từ Jankx Portal:', 'jankx'); ?></p>
            
            <div class="jankx-widget-news-wrapper" style="margin: 15px 0;">
                <?php $this->renderNewsWidget(3); ?>
            </div>

            <div class="jankx-widget-footer" style="padding-top: 10px; border-top: 1px solid #eee; display: flex; gap: 15px;">
                <a href="<?php echo admin_url('admin.php?page=jankx-dashboard'); ?>" class="button button-primary"><?php _e('Jankx Dashboard', 'jankx'); ?></a>
                <a href="<?php echo admin_url('admin.php?page=jankx-theme-options'); ?>" class="button"><?php _e('Theme Options', 'jankx'); ?></a>
            </div>

            <style>
                #jankx_dashboard_widget .inside { padding: 0; margin-top: 0; }
                .jankx-dashboard-widget-content { 
                    padding: 15px; 
                    font-family: 'Inter', sans-serif;
                }
                
                /* News Grid & Cards for Widget */
                #jankx_dashboard_widget .news-portal-grid { 
                    display: grid; 
                    grid-template-columns: 1fr; 
                    gap: 12px; 
                }
                #jankx_dashboard_widget .news-card {
                    display: flex; flex-direction: column; background: #fff; border: 1px solid #e2e8f0;
                    border-radius: 12px; padding: 12px; text-decoration: none; color: #1e293b;
                    transition: all 0.2s ease; border-top: 3px solid #cbd5e1;
                }
                #jankx_dashboard_widget .news-card:hover { border-color: #3b82f6; background: #f8fafc; }
                #jankx_dashboard_widget .news-card--announcement { border-top-color: #8b5cf6; }
                #jankx_dashboard_widget .news-card--release      { border-top-color: #10b981; }
                #jankx_dashboard_widget .news-card--tutorial     { border-top-color: #f59e0b; }
                #jankx_dashboard_widget .news-card--news         { border-top-color: #3b82f6; }
                
                #jankx_dashboard_widget .news-badge {
                    display: inline-block; font-size: 9px; font-weight: 700; text-transform: uppercase;
                    padding: 2px 6px; border-radius: 10px; background: #f1f5f9; color: #64748b; margin-bottom: 6px; width: fit-content;
                }
                #jankx_dashboard_widget .news-card--announcement .news-badge { background: #ede9fe; color: #7c3aed; }
                #jankx_dashboard_widget .news-card--release .news-badge      { background: #d1fae5; color: #059669; }
                #jankx_dashboard_widget .news-title { font-size: 13px; font-weight: 600; line-height: 1.4; color: #1e293b; margin: 0; }
                #jankx_dashboard_widget .news-excerpt, #jankx_dashboard_widget .news-date { display: none; }
            </style>
        </div>
        <?php
    }

    /**
     * Đăng ký các shortcode của Jankx
     */
    protected function registerShortcodes()
    {
        add_shortcode('jankx_news', function ($atts) {
            $atts = shortcode_atts([
                'limit' => 5,
                'type'  => '',
            ], $atts);

            ob_start();
            $this->renderNewsWidget((int)$atts['limit'], $atts['type']);
            return ob_get_clean();
        });
    }

    /**
     * Lấy dữ liệu tin tức từ API với Cache
     */
    protected function getPortalNews($limit = 6, $type = '')
    {
        $cache_key = 'jankx_portal_news_v1_' . md5($limit . $type);
        $news_data = get_transient($cache_key);

        if (false === $news_data) {
            $api_url = 'https://jankx.pages.dev/api/portal/news';
            $url = add_query_arg([
                'limit' => $limit,
                'type'  => $type,
            ], $api_url);

            $response = wp_remote_get($url, [
                'timeout'   => 5,
                'sslverify' => false,
            ]);

            if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
                $body = json_decode(wp_remote_retrieve_body($response), true);
                $news_data = (!empty($body['status']) && $body['status'] === 'success') ? $body['data'] : [];
            } else {
                $news_data = [];
            }
            set_transient($cache_key, $news_data, 4 * HOUR_IN_SECONDS);
        }

        return $news_data;
    }

    /**
     * Render News Widget (Dùng cho cả Dashboard và Shortcode)
     */
    public function renderNewsWidget($limit = 6, $type = '')
    {
        $news_data = $this->getPortalNews($limit, $type);
        
        // Luôn render Common Styles nếu ở ngoài frontend để đảm bảo giao diện
        if (!is_admin()) {
            $this->renderCommonStyles();
        }

        if (empty($news_data)) : ?>
            <div class="news-portal-empty">
                <span class="dashicons dashicons-cloud"></span>
                <p><?php _e('Không thể tải tin tức lúc này. Vui lòng thử lại sau.', 'jankx'); ?></p>
                <a href="https://jankx.pages.dev/news" target="_blank" class="button"><?php _e('Xem trên Jankx Hub', 'jankx'); ?></a>
            </div>
        <?php else : ?>
            <div class="news-portal-grid">
                <?php foreach ($news_data as $item) :
                    $slug    = $item['slug'] ?? $item['id'];
                    $url     = "https://jankx.pages.dev/news/{$slug}";
                    $date    = date_i18n(get_option('date_format'), strtotime($item['created_at']));
                    $excerpt = mb_substr(strip_tags($item['content'] ?? ''), 0, 120);
                    $item_type = strtolower($item['type'] ?? 'news');
                    $labels  = ['announcement' => 'Thông báo', 'release' => 'Phiên bản', 'tutorial' => 'Hướng dẫn', 'news' => 'Tin tức'];
                ?>
                <a href="<?php echo esc_url($url); ?>" target="_blank" rel="noopener" class="news-card news-card--<?php echo esc_attr($item_type); ?>">
                    <span class="news-badge"><?php echo esc_html($labels[$item_type] ?? ucfirst($item_type)); ?></span>
                    <h4 class="news-title"><?php echo esc_html($item['title']); ?></h4>
                    <p class="news-excerpt"><?php echo esc_html($excerpt); ?>...</p>
                    <time class="news-date"><?php echo esc_html($date); ?></time>
                </a>
                <?php endforeach; ?>
            </div>
        <?php endif;
    }

    /**
     * Đăng ký các trang admin mặc định
     */
    protected function registerDefaultPages()
    {
        $this->addPage([
            'id' => 'jankx-dashboard',
            'title' => __('JANKX PRO Dashboard', 'jankx'),
            'subtitle' => __('Dahboard cho website của bạn với các thông tin hệ thống và các tiện ích quản lý nhanh.', 'jankx'),
            'menu_title' => __('Dashboard', 'jankx'),
            'capability' => 'manage_options',
            'callback' => [$this, 'renderDashboardPage'],
            'icon' => 'dashicons-performance',
            'position' => 10
        ]);

        $this->addPage([
            'id' => 'jankx-license',
            'title' => __('Theme Activation', 'jankx'),
            'subtitle' => __('Activate your JANKX PRO license to receive automatic updates and premium support.', 'jankx'),
            'menu_title' => __('Theme Activation', 'jankx'),
            'capability' => 'manage_options',
            'callback' => [$this, 'renderLicensePage'],
            'icon' => 'dashicons-shield-plugins',
            'position' => 15
        ]);

        $this->addPage([
            'id' => 'jankx-membership',
            'title' => __('Membership', 'jankx'),
            'subtitle' => __('Connect your Optilarity account to unlock premium templates and services.', 'jankx'),
            'menu_title' => __('Membership', 'jankx'),
            'capability' => 'manage_options',
            'callback' => [$this, 'renderMembershipPage'],
            'icon' => 'dashicons-admin-users',
            'position' => 16
        ]);

        $this->addPage([
            'id' => 'jankx-extensions',
            'title' => __('Managed Extensions', 'jankx'),
            'subtitle' => __('Quản lý các phần mở rộng chức năng cho Jankx Framework.', 'jankx'),
            'menu_title' => __('Extensions', 'jankx'),
            'capability' => 'manage_options',
            'callback' => [$this, 'renderExtensionsPage'],
            'icon' => 'dashicons-admin-plugins',
            'position' => 20
        ]);

        $this->addPage([
            'id' => 'jankx-marketplace',
            'title' => __('Extension Marketplace', 'jankx'),
            'subtitle' => __('Khám phá và cài đặt hàng trăm tiện ích mở rộng từ cộng đồng Jankx.', 'jankx'),
            'menu_title' => __('Marketplace', 'jankx'),
            'capability' => 'manage_options',
            'callback' => [$this, 'renderMarketplacePage'],
            'icon' => 'dashicons-store',
            'position' => 21
        ]);

        $this->addPage([
            'id' => 'jankx-icons',
            'title' => __('Icon Repository', 'jankx'),
            'subtitle' => __('Thư viện biểu tượng tập trung cho theme và các nội dung website.', 'jankx'),
            'menu_title' => __('Icon Repository', 'jankx'),
            'capability' => 'manage_options',
            'callback' => [$this, 'renderIconsPage'],
            'icon' => 'dashicons-format-image',
            'position' => 25
        ]);

        $this->addPage([
            'id' => 'jankx-utilities',
            'title' => __('Utilities', 'jankx'),
            'subtitle' => __('Các công cụ tối ưu hệ thống, hình ảnh và cấu hình nâng cao.', 'jankx'),
            'menu_title' => __('Utilities', 'jankx'),
            'capability' => 'manage_options',
            'callback' => [$this, 'renderUtilitiesPage'],
            'icon' => 'dashicons-admin-tools',
            'position' => 55
        ]);

        $this->addPage([
            'id' => 'jankx-debug',
            'title' => __('System Information', 'jankx'),
            'subtitle' => __('Thông tin chi tiết về môi trường máy chủ và nhật ký lỗi hệ thống.', 'jankx'),
            'menu_title' => __('System Information', 'jankx'),
            'capability' => 'manage_options',
            'callback' => [$this, 'renderDebugPage'],
            'icon' => 'dashicons-sos',
            'position' => 99
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
        $page = $this->getPage($pageId);
        if ($page) {
            $this->enqueuePageAssets($page);
        }
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
     * Lấy 3 extension nổi bật đã cài đặt trên website hiện tại
     */
    protected function getFeaturedExtensions($limit = 3)
    {
        $extensionManager = $this->app->make('extension.manager');
        $allExtensions = $extensionManager->get_extensions();

        if (empty($allExtensions)) {
            return [];
        }

        $featured = [];
        foreach ($allExtensions as $slug => $extension) {
            $info = $extension->get_info();
            $manifest = $extension->get_manifest_data();
            
            // Determine icon
            $icon_svg = $manifest['icon_svg'] ?? '';
            $icon_url = '';
            
            if (empty($icon_svg)) {
                $ext_path = $extension->get_extension_path();
                $ext_url = $extension->get_extension_url();
                
                if (file_exists($ext_path . '/assets/icon.svg')) {
                    $icon_svg = file_get_contents($ext_path . '/assets/icon.svg');
                } elseif (file_exists($ext_path . '/assets/icon.png')) {
                    $icon_url = $ext_url . '/assets/icon.png';
                } elseif (file_exists($ext_path . '/icon.png')) {
                    $icon_url = $ext_url . '/icon.png';
                }
            }

            $featured[] = [
                'slug' => $slug,
                'name' => $info['name'] ?? $slug,
                'version' => $info['version'] ?? '1.0.0',
                'active' => $info['active'] ?? false,
                'icon_svg' => $icon_svg,
                'icon' => $icon_url,
                'install_count' => 0, // Not applicable for local
            ];

            if (count($featured) >= $limit + 5) break; // Get a bit more to filter if needed
        }

        // Ưu tiên các extension đang active
        usort($featured, function($a, $b) {
            if ($a['active'] === $b['active']) return 0;
            return $a['active'] ? -1 : 1;
        });

        return array_slice($featured, 0, $limit);
    }

    /**
     * Render trang Dashboard
     */
    public function renderDashboardPage($page)
    {
        ?>
            <div class="jankx-dashboard-grid">
                <!-- Quick Actions -->
                <div class="jankx-card action-card">
                    <div class="card-header">
                        <span class="dashicons dashicons-lightning"></span>
                        <h3><?php _e('Quick Actions', 'jankx'); ?></h3>
                    </div>
                    <div class="card-body">
                        <ul class="action-list">
                            <li>
                                <a href="<?php echo admin_url('admin.php?page=jankx-icons'); ?>">
                                    <span class="dashicons dashicons-format-image"></span>
                                    <span class="text"><?php _e('Manage Icons', 'jankx'); ?></span>
                                    <span class="dashicons dashicons-arrow-right-alt2 arrow"></span>
                                </a>
                            </li>
                            <li>
                                <a href="<?php echo admin_url('admin.php?page=jankx-utilities'); ?>">
                                    <span class="dashicons dashicons-admin-tools"></span>
                                    <span class="text"><?php _e('Utilities', 'jankx'); ?></span>
                                    <span class="dashicons dashicons-arrow-right-alt2 arrow"></span>
                                </a>
                            </li>
                            <li>
                                <a href="<?php echo admin_url('customize.php'); ?>">
                                    <span class="dashicons dashicons-admin-customizer"></span>
                                    <span class="text"><?php _e('Customize Theme', 'jankx'); ?></span>
                                    <span class="dashicons dashicons-arrow-right-alt2 arrow"></span>
                                </a>
                            </li>
                            <?php
                            $license = $this->app->make('license');
                            if (!$license->isActivated()) : ?>
                            <li>
                                <a href="<?php echo admin_url('admin.php?page=jankx-license'); ?>" style="color: #ef4444;">
                                    <span class="dashicons dashicons-shield-plugins"></span>
                                    <span class="text"><?php _e('Activate License', 'jankx'); ?></span>
                                    <span class="dashicons dashicons-arrow-right-alt2 arrow"></span>
                                </a>
                            </li>
                            <?php endif; ?>
                        </ul>
                    </div>
                </div>

                <!-- Theme Status -->
                <div class="jankx-card status-card">
                    <div class="card-header">
                        <span class="dashicons dashicons-performance"></span>
                        <h3><?php _e('System Health', 'jankx'); ?></h3>
                    </div>
                    <div class="card-body">
                        <div class="health-indicator success">
                            <span class="dot"></span>
                            <span class="text"><?php _e('All systems operational', 'jankx'); ?></span>
                        </div>
                        <p class="card-desc"><?php _e('Your website is running smoothly. Check the debug page for detailed system information.', 'jankx'); ?></p>
                        <a href="<?php echo admin_url('admin.php?page=jankx-debug'); ?>" class="button button-link">
                            <?php _e('View full report', 'jankx'); ?>
                        </a>
                    </div>
                </div>

                <!-- Extensions -->
                <div class="jankx-card extension-card">
                    <div class="card-header">
                        <span class="dashicons dashicons-admin-plugins"></span>
                        <h3><?php _e('Installed Extensions', 'jankx'); ?></h3>
                        <a href="<?php echo admin_url('admin.php?page=jankx-extensions'); ?>" class="header-link"><?php _e('Manage All', 'jankx'); ?></a>
                    </div>
                    <div class="card-body">
                        <?php
                        $featured = $this->getFeaturedExtensions(3);
                        if (!empty($featured)) : ?>
                            <div class="featured-extensions-list">
                                <?php foreach ($featured as $ext) : ?>
                                <div class="featured-ext-item">
                                    <div class="ext-icon">
                                        <?php if (!empty($ext['icon_svg'])) : ?>
                                            <?php echo $ext['icon_svg']; ?>
                                        <?php elseif (!empty($ext['icon'])) : ?>
                                            <img src="<?php echo esc_url($ext['icon']); ?>" alt="">
                                        <?php else : ?>
                                            <span class="dashicons dashicons-admin-plugins"></span>
                                        <?php endif; ?>
                                    </div>
                                    <div class="ext-info">
                                        <h4><?php echo esc_html($ext['name'] ?? 'Unknown'); ?></h4>
                                        <div class="ext-meta">
                                            <span class="version"><span class="dashicons dashicons-tag"></span> v<?php echo esc_html($ext['version'] ?? '1.0.0'); ?></span>
                                            <?php if (!empty($ext['active'])) : ?>
                                                <span class="status-badge installed"><?php _e('Active', 'jankx'); ?></span>
                                            <?php else : ?>
                                                <span class="status-badge inactive" style="background:#f1f5f9; color:#64748b;"><?php _e('Inactive', 'jankx'); ?></span>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </div>
                                <?php endforeach; ?>
                            </div>
                        <?php else : ?>
                            <p class="card-desc"><?php _e('Bạn chưa cài đặt bất kỳ extension nào cho theme.', 'jankx'); ?></p>
                        <?php endif; ?>
                        
                        <div style="margin-top: 20px;">
                            <a href="<?php echo admin_url('admin.php?page=jankx-marketplace'); ?>" class="button jankx-btn-modern">
                                <?php _e('Explore Marketplace', 'jankx'); ?>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .featured-extensions-list { display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px; }
                .featured-ext-item { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; transition: all 0.2s; }
                .featured-ext-item:hover { transform: translateX(5px); border-color: #3b82f6; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                .featured-ext-item .ext-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 10px; border: 1px solid #f1f5f9; flex-shrink: 0; padding: 8px; }
                .featured-ext-item .ext-icon img, .featured-ext-item .ext-icon svg { width: 100%; height: 100%; object-fit: contain; }
                .featured-ext-item .ext-info h4 { margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #1e293b; }
                .featured-ext-item .ext-meta { display: flex; align-items: center; gap: 10px; font-size: 11px; color: #94a3b8; }
                .featured-ext-item .ext-meta .installs { display: flex; align-items: center; gap: 4px; }
                .featured-ext-item .ext-meta .dashicons { font-size: 12px; width: 12px; height: 12px; }
                .status-badge.installed { color: #10b981; font-weight: 700; background: #d1fae5; padding: 1px 6px; border-radius: 4px; text-transform: uppercase; font-size: 9px; }
                .card-header .header-link { font-size: 12px; font-weight: 600; color: #3b82f6; text-decoration: none; margin-left: auto; }
            </style>

            <!-- Jankx News Portal -->
            <div class="jankx-news-portal-section">
                <div class="news-portal-header">
                    <span class="dashicons dashicons-rss"></span>
                    <h2><?php _e('Jankx News & Updates', 'jankx'); ?></h2>
                    <a href="https://jankx.pages.dev/news" target="_blank" rel="noopener" class="news-portal-see-all">
                        <?php _e('Xem tất cả', 'jankx'); ?> →
                    </a>
                </div>
                <?php $this->renderNewsWidget(6); ?>
            </div>

            <style>
                .jankx-dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                }
                .action-list { margin: 0; padding: 0; list-style: none; }
                .action-list li a {
                    display: flex; align-items: center; gap: 12px;
                    padding: 12px;
                    border-radius: 12px;
                    color: #475569;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .action-list li a:hover { background: #f1f5f9; color: #3b82f6; }
                .action-list .text { flex-grow: 1; font-weight: 500; }
                .action-list .arrow { font-size: 14px; color: #cbd5e1; opacity: 0; transition: all 0.2s; }
                .action-list li a:hover .arrow { opacity: 1; transform: translateX(4px); }

                .health-indicator { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
                .health-indicator .dot { width: 10px; height: 10px; border-radius: 50%; }
                .health-indicator.success .dot { background: #10b981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2); }
                .health-indicator .text { font-weight: 600; color: #059669; }
                .card-desc { color: #64748b; line-height: 1.6; font-size: 14px; margin-bottom: 20px; }

                .extension-stats { margin-bottom: 24px; }
                .extension-stats .number { font-size: 36px; font-weight: 700; color: #1e293b; display: block; }
                .extension-stats .label { color: #64748b; font-size: 14px; }

                .jankx-btn-modern {
                    background: #3b82f6 !important;
                    color: #fff !important;
                    border: none !important;
                    border-radius: 12px !important;
                    padding: 10px 20px !important;
                    height: auto !important;
                    line-height: 1 !important;
                    font-weight: 600 !important;
                    width: 100%;
                    text-align: center;
                }
                .jankx-btn-modern:hover { background: #2563eb !important; }

                /* === News Portal === */
                .jankx-news-portal-section {
                    margin-top: 36px;
                    border-top: 1px solid #e2e8f0;
                    padding-top: 30px;
                }
                .news-portal-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                .news-portal-header h2 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 700;
                    color: #1e293b;
                    flex-grow: 1;
                }
                .news-portal-header .dashicons {
                    color: #3b82f6;
                    font-size: 24px;
                    width: 24px;
                    height: 24px;
                }
                .news-portal-see-all {
                    font-size: 14px;
                    font-weight: 600;
                    color: #3b82f6;
                    text-decoration: none;
                }
                .news-portal-see-all:hover {
                    text-decoration: underline;
                }

                @media (max-width: 991px) {
                    .jankx-dashboard-grid { grid-template-columns: 1fr 1fr; }
                }
                @media (max-width: 767px) {
                    .jankx-dashboard-grid { grid-template-columns: 1fr; }
                }

                /* Styles moved to renderNewsWidget for reuse */
            </style>
        <?php
    }

    /**
     * Render Debug Page
     */
    public function renderDebugPage($page)
    {
        $active_tab = isset($_GET['tab']) ? $_GET['tab'] : 'system_info';
        ?>
            <nav class="nav-tab-wrapper">
                <a href="?page=jankx-debug&tab=system_info"
                    class="nav-tab <?php echo $active_tab == 'system_info' ? 'nav-tab-active' : ''; ?>"><?php _e('System Information', 'jankx'); ?></a>
                <a href="?page=jankx-debug&tab=log"
                    class="nav-tab <?php echo $active_tab == 'log' ? 'nav-tab-active' : ''; ?>"><?php _e('Debug Log', 'jankx'); ?></a>
            </nav>

            <div class="jankx-tab-content modern-tabs-content" style="margin-top: 30px;">
                <?php
                switch ($active_tab) {
                    case 'system_info':
                        $this->renderSystemInformationContent();
                        break;
                    case 'log':
                        $this->renderDebugLogContent();
                        break;
                }
                ?>
            </div>
            <style>
                .nav-tab-wrapper { border-bottom: none; margin-bottom: 0; padding-top: 0; }
                .nav-tab {
                    border: none;
                    background: #f1f5f9;
                    margin-left: 0;
                    margin-right: 10px;
                    padding: 10px 20px;
                    border-radius: 12px;
                    font-weight: 600;
                    color: #64748b;
                    transition: all 0.2s;
                }
                .nav-tab:hover { background: #e2e8f0; color: #1e293b; }
                .nav-tab-active, .nav-tab-active:hover { background: #3b82f6 !important; color: #fff !important; }
            </style>
        <?php
    }

    protected function renderSystemInformationContent()
    {
        ?>
        <div class="jankx-card system-info-card">
            <div class="card-header">
                <span class="dashicons dashicons-info-outline"></span>
                <h3><?php _e('Services Status', 'jankx'); ?></h3>
            </div>
            <table class="jankx-info-table" style="width: 100%; border-collapse: separate; border-spacing: 0 8px;">
                <tbody>
                    <?php
                    $info = [
                        'Framework Version' => $this->app->make('jankx.version') ?? 'Unknown',
                        'Environment'       => $this->app->make('jankx.environment') ?? 'Unknown',
                        'Debug Mode'        => WP_DEBUG ? 'Enabled' : 'Disabled',
                        'PHP Version'       => PHP_VERSION,
                        'WordPress Version' => get_bloginfo('version'),
                        'Server Software'   => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
                    ];
                    foreach ($info as $label => $value):
                    ?>
                    <tr>
                        <td style="padding: 12px 16px; background: #f8fafc; border-radius: 10px 0 0 10px; width: 250px; font-weight: 600; color: #475569; border: 1px solid #f1f5f9; border-right: none;">
                            <?php echo esc_html($label); ?>
                        </td>
                        <td style="padding: 12px 16px; background: #fff; border-radius: 0 10px 10px 0; color: #1e293b; border: 1px solid #f1f5f9; border-left: none; font-family: monospace;">
                            <?php echo esc_html($value); ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    protected function renderDebugLogContent()
    {
        $log_file = WP_CONTENT_DIR . '/debug.log';
        if (!file_exists($log_file)) {
            echo '<div class="notice notice-info"><p>' . __('Debug log file not found.', 'jankx') . '</p></div>';
            return;
        }

        $log_content = file_get_contents($log_file);
        // Get last 100 lines
        $lines = explode("\n", $log_content);
        $lines = array_slice($lines, -100);
        $log_content = implode("\n", $lines);

        ?>
        <div class="card" style="max-width: 1000px; padding: 20px;">
            <h2><?php _e('Last 100 lines of debug.log', 'jankx'); ?></h2>
            <pre style="background: #f1f1f1; padding: 15px; overflow: auto; max-height: 500px; font-size: 12px; border: 1px solid #ddd; border-radius: 4px;"><?php echo esc_html($log_content); ?></pre>
            <form method="post" action="">
                <?php wp_nonce_field('jankx_clear_log', 'jankx_debug_nonce'); ?>
                <input type="hidden" name="jankx_action" value="clear_debug_log">
                <p class="submit">
                    <input type="submit" class="button button-secondary" value="<?php _e('Clear Log', 'jankx'); ?>" onclick="return confirm('Are you sure?');">
                </p>
            </form>
        </div>
        <?php
    }

    /**
     * Render page header
     */
    protected function renderPageHeader($page)
    {
        $framework_version = $this->app->make('jankx.version') ?? '1.0.0';
        $icon = $page['icon'] ?? 'dashicons-admin-generic';
        $subtitle = $page['subtitle'] ?? __('Premium WordPress experience by Jankx Framework.', 'jankx');
        
        echo '<div class="jankx-admin-page-container">';
        $this->renderCommonStyles();
        ?>
        <header class="jankx-universal-header">
            <div class="header-content">
                <div class="header-icon">
                    <span class="dashicons <?php echo esc_attr($icon); ?>"></span>
                </div>
                <div class="header-text">
                    <h1><?php echo esc_html($page['title']); ?> <span class="version-badge">v<?php echo $framework_version; ?></span></h1>
                    <p class="subtitle"><?php echo esc_html($subtitle); ?></p>
                </div>
            </div>
        </header>
        <div class="jankx-universal-content">
        <?php
    }

    /**
     * Render page footer
     */
    protected function renderPageFooter($page)
    {
        ?>
        </div> <!-- .jankx-universal-content -->
        <footer class="jankx-admin-footer">
            <p>&copy; <?php echo date('Y'); ?> JANKX PRO. Made with <span class="dashicons dashicons-heart" style="color: #ef4444; font-size: 14px; width: 14px; height: 14px;"></span> by Puleeno.</p>
        </footer>
        </div> <!-- .jankx-admin-page-container -->
        <?php
    }

    /**
     * Render Theme Activation (License) Page
     */
    public function renderLicensePage($page)
    {
        $licenseService = $this->app->make('license');
        $isActivated = $licenseService->isActivated();
        $licenseData = $licenseService->getLicenseData();
        ?>
        <div class="jankx-dashboard-grid">
            <!-- License Status Card -->
            <div class="jankx-card <?php echo $isActivated ? 'license-active' : 'license-inactive'; ?>" style="grid-column: span 2;">
                <div class="card-header">
                    <span class="dashicons <?php echo $isActivated ? 'dashicons-shield-plugins' : 'dashicons-warning'; ?>"></span>
                    <h3><?php echo $isActivated ? __('License Activated', 'jankx') : __('License Activation Required', 'jankx'); ?></h3>
                    <?php if ($isActivated) : ?>
                        <span class="status-badge installed" style="margin-left: auto;"><?php _e('Pro Enabled', 'jankx'); ?></span>
                    <?php endif; ?>
                </div>
                
                <div class="card-body">
                    <?php if (!$isActivated) : ?>
                        <div class="license-info-box" style="margin-bottom: 30px; padding: 20px; background: #fff7ed; border-radius: 16px; border: 1px solid #ffedd5; display: flex; gap: 16px; align-items: flex-start;">
                            <span class="dashicons dashicons-info" style="color: #f97316; margin-top: 2px;"></span>
                            <div>
                                <h4 style="margin: 0 0 5px 0; color: #9a3412;"><?php _e('Activate JANKX PRO', 'jankx'); ?></h4>
                                <p style="margin: 0; color: #c2410c; font-size: 14px;"><?php _e('Enter your license key below to unlock cloud assets, premium templates, and automatic updates.', 'jankx'); ?></p>
                            </div>
                        </div>

                        <form method="post" action="" class="jankx-modern-form">
                            <?php wp_nonce_field('jankx_activate_license', 'jankx_license_nonce'); ?>
                            <input type="hidden" name="jankx_action" value="activate_license">
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                                <div class="form-group">
                                    <label style="display: block; margin-bottom: 10px; font-weight: 600; font-size: 14px;"><?php _e('License Key', 'jankx'); ?></label>
                                    <input type="text" name="license_key" placeholder="XXXX-XXXX-XXXX-XXXX" style="width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc;" required>
                                </div>
                                <div class="form-group">
                                    <label style="display: block; margin-bottom: 10px; font-weight: 600; font-size: 14px;"><?php _e('Email Address', 'jankx'); ?></label>
                                    <input type="email" name="email" placeholder="customer@email.com" style="width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc;" required>
                                </div>
                            </div>
                            
                            <div style="margin-top: 30px;">
                                <button type="submit" class="button button-primary" style="height: auto; padding: 12px 40px; border-radius: 12px; font-weight: 700; background: #3b82f6; border: none; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);"><?php _e('Activate JANKX PRO', 'jankx'); ?></button>
                            </div>
                        </form>
                    <?php else : ?>
                        <div class="license-details-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;">
                            <div class="detail-item-box" style="padding: 20px; background: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9;">
                                <span style="display: block; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.5px;"><?php _e('Bound License Key', 'jankx'); ?></span>
                                <code style="font-size: 15px; color: #1e293b; background: #fff; padding: 4px 8px; border-radius: 6px; border: 1px solid #e2e8f0;"><?php echo esc_html($licenseData['key'] ?? '****'); ?></code>
                            </div>
                            <div class="detail-item-box" style="padding: 20px; background: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9;">
                                <span style="display: block; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.5px;"><?php _e('Owner Account', 'jankx'); ?></span>
                                <span style="font-size: 15px; color: #1e293b; font-weight: 600;"><?php echo esc_html($licenseData['email'] ?? 'N/A'); ?></span>
                            </div>
                            <div class="detail-item-box" style="padding: 20px; background: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9;">
                                <span style="display: block; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.5px;"><?php _e('Authorized Domain', 'jankx'); ?></span>
                                <span style="font-size: 15px; color: #1e293b; font-weight: 600;"><?php echo esc_html($licenseData['domain'] ?? parse_url(get_site_url(), PHP_URL_HOST)); ?></span>
                            </div>
                            <div class="detail-item-box" style="padding: 20px; background: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9;">
                                <span style="display: block; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.5px;"><?php _e('Support Status', 'jankx'); ?></span>
                                <span style="font-size: 14px; color: #10b981; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                                    <span class="dashicons dashicons-yes-alt" style="font-size: 18px; width: 18px; height: 18px;"></span>
                                    <?php _e('Premium Support Active', 'jankx'); ?>
                                </span>
                            </div>
                        </div>

                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end;">
                            <form method="post" action="" onsubmit="return confirm('<?php _e('Deactivating will remove PRO features. Continue?', 'jankx'); ?>');">
                                <?php wp_nonce_field('jankx_deactivate_license', 'jankx_license_nonce'); ?>
                                <input type="hidden" name="jankx_action" value="deactivate_license">
                                <button type="submit" class="button button-link" style="color: #ef4444; font-size: 13px; text-decoration: none;">
                                    <span class="dashicons dashicons-no-alt" style="font-size: 16px; width: 16px; height: 16px; margin-top: -2px;"></span>
                                    <?php _e('Deactivate this license', 'jankx'); ?>
                                </button>
                            </form>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Help Sidebar -->
            <div class="sidebar-cards">
                <div class="jankx-card" style="padding: 24px;">
                    <div class="card-header" style="margin-bottom: 15px;">
                        <span class="dashicons dashicons-sos"></span>
                        <h4 style="margin: 0;"><?php _e('Need Help?', 'jankx'); ?></h4>
                    </div>
                    <p style="font-size: 13px; color: #64748b; margin-bottom: 15px;"><?php _e('If you lost your license key or need help activating, visit our portal.', 'jankx'); ?></p>
                    <a href="https://optilarity.top" target="_blank" class="button button-secondary" style="width: 100%; text-align: center; border-radius: 10px;"><?php _e('Optilarity Portal', 'jankx'); ?></a>
                </div>

                <div class="jankx-card" style="padding: 24px; background: #f1f5f9; border: none;">
                    <div class="card-header" style="margin-bottom: 10px;">
                        <span class="dashicons dashicons-awards" style="color: #6366f1;"></span>
                        <h4 style="margin: 0;"><?php _e('Pro Benefits', 'jankx'); ?></h4>
                    </div>
                    <ul style="margin: 0; padding: 0; list-style: none; font-size: 12px; color: #475569;">
                        <li style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;"><span class="dashicons dashicons-yes" style="font-size: 14px; color: #10b981;"></span> <?php _e('500+ Cloud Templates', 'jankx'); ?></li>
                        <li style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;"><span class="dashicons dashicons-yes" style="font-size: 14px; color: #10b981;"></span> <?php _e('Automatic Updates', 'jankx'); ?></li>
                        <li style="margin-bottom: 0; display: flex; align-items: center; gap: 8px;"><span class="dashicons dashicons-yes" style="font-size: 14px; color: #10b981;"></span> <?php _e('Priority Support', 'jankx'); ?></li>
                    </ul>
                </div>
            </div>
        </div>

        <style>
            .license-active { border-left: 4px solid #10b981; }
            .license-inactive { border-left: 4px solid #f97316; }
            .sidebar-cards { display: flex; flex-direction: column; gap: 20px; }
            @media (max-width: 1000px) {
                .jankx-dashboard-grid { grid-template-columns: 1fr; }
                .jankx-card { grid-column: auto !important; }
            }
        </style>
        <?php
    }

    public function renderMembershipPage($page)
    {
        $membershipService = $this->app->make('membership');
        $isActivated = $membershipService->isActivated();
        $plan = $membershipService->getPlan();
        $redirectUri = admin_url('index.php?state=jankx_auth');
        $authUrl = $membershipService->getAuthorizeUrl($redirectUri);
        ?>
        <div class="jankx-dashboard-grid">
            <!-- Account Status Card -->
            <div class="jankx-card" style="grid-column: span 2;">
                <div class="card-header">
                    <span class="dashicons dashicons-admin-users"></span>
                    <h3><?php _e('Account Overview', 'jankx'); ?></h3>
                    <?php if ($isActivated) : ?>
                        <span class="status-badge installed" style="margin-left: auto; background: #3b82f6; color: #fff;"><?php echo strtoupper($membershipService->getPlanSlug()); ?></span>
                    <?php endif; ?>
                </div>

                <div class="card-body">
                    <?php if (!$isActivated) : ?>
                        <div class="membership-connect-hero" style="text-align: center; padding: 40px 20px;">
                            <div style="width: 80px; height: 80px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                                <span class="dashicons dashicons-cloud" style="font-size: 40px; width: 40px; height: 40px; color: #94a3b8;"></span>
                            </div>
                            <h2 style="margin: 0 0 12px 0; font-size: 24px; color: #1e293b;"><?php _e('Connect to Optilarity', 'jankx'); ?></h2>
                            <p style="color: #64748b; max-width: 500px; margin: 0 auto 30px; line-height: 1.6;">
                                <?php _e('Link your website to the Optilarity network to sync your settings and access the global template library.', 'jankx'); ?>
                            </p>
                            <a href="<?php echo esc_url($authUrl); ?>" class="button button-primary" style="height: auto; padding: 14px 40px; border-radius: 12px; font-weight: 700; background: #8b5cf6; border: none; box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);">
                                <span class="dashicons dashicons-external" style="margin-top: 4px; margin-right: 8px;"></span>
                                <?php _e('Authorize with OAuth2', 'jankx'); ?>
                            </a>
                        </div>
                    <?php else : ?>
                        <div class="nexus-info-block" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                            <div class="info-row" style="background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9;">
                                <span style="display: block; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; margin-bottom: 6px;"><?php _e('Current Membership', 'jankx'); ?></span>
                                <span style="font-size: 18px; font-weight: 700; color: #1e293b;"><?php echo esc_html($plan['name']); ?></span>
                            </div>
                            <div class="info-row" style="background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9;">
                                <span style="display: block; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; margin-bottom: 6px;"><?php _e('Expiration Date', 'jankx'); ?></span>
                                <span style="font-size: 18px; font-weight: 700; color: #1e293b;"><?php echo isset($plan['expires_at']) && $plan['expires_at'] !== 'Never' ? date_i18n(get_option('date_format'), strtotime($plan['expires_at'])) : __('Lifetime Active', 'jankx'); ?></span>
                            </div>
                        </div>
                        
                        <div style="margin-top: 30px; display: flex; align-items: center; gap: 12px; padding: 16px; background: #f0f9ff; border-radius: 12px; border: 1px solid #e0f2fe;">
                            <span class="dashicons dashicons-update" style="color: #0ea5e9;"></span>
                            <span style="font-size: 13px; color: #0369a1;"><?php _e('Your account is currently synced with Optilarity Cloud Services.', 'jankx'); ?></span>
                        </div>

                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end;">
                            <form method="post" action="">
                                <?php wp_nonce_field('jankx_disconnect_membership', 'jankx_membership_nonce'); ?>
                                <input type="hidden" name="jankx_action" value="disconnect_membership">
                                <button type="submit" class="button button-link" style="color: #ef4444; font-size: 13px; text-decoration: none;" onclick="return confirm('Disconnect membership?');">
                                    <span class="dashicons dashicons-exit" style="font-size: 16px; width: 16px; height: 16px; margin-top: -2px;"></span>
                                    <?php _e('Disconnect Account', 'jankx'); ?>
                                </button>
                            </form>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Stats & Benefits -->
            <div class="sidebar-cards">
                <div class="jankx-card" style="padding: 24px;">
                    <div class="card-header" style="margin-bottom: 20px;">
                        <span class="dashicons dashicons-cloud"></span>
                        <h4 style="margin: 0;"><?php _e('Cloud Resources', 'jankx'); ?></h4>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; background: #ede9fe; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #8b5cf6;">
                                <span class="dashicons dashicons-layout" style="font-size: 16px; width: 16px; height: 16px;"></span>
                            </div>
                            <div>
                                <span style="display: block; font-size: 14px; font-weight: 600;">500+</span>
                                <span style="display: block; font-size: 11px; color: #94a3b8;"><?php _e('Premium Templates', 'jankx'); ?></span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; background: #dcfce7; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #10b981;">
                                <span class="dashicons dashicons-admin-site" style="font-size: 16px; width: 16px; height: 16px;"></span>
                            </div>
                            <div>
                                <span style="display: block; font-size: 14px; font-weight: 600;">Managed</span>
                                <span style="display: block; font-size: 11px; color: #94a3b8;"><?php _e('Cloud Deployment', 'jankx'); ?></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="jankx-card" style="padding: 24px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: none; color: #fff;">
                    <h4 style="margin: 0 0 12px 0; color: #fff;"><?php _e('Upgrade Options', 'jankx'); ?></h4>
                    <p style="font-size: 12px; color: rgba(255,255,255,0.8); margin-bottom: 20px;"><?php _e('Need more sites or advanced features? Explore our professional plans.', 'jankx'); ?></p>
                    <a href="https://optilarity.top/pricing" target="_blank" style="display: block; width: 100%; text-align: center; padding: 10px; background: #fff; color: #3b82f6; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px;"><?php _e('Compare Plans', 'jankx'); ?></a>
                </div>
            </div>
        </div>
        <?php
    }

    protected function renderCommonStyles()
    {
        ?>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

            .jankx-admin-page-container {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                margin: 20px 20px 20px 0;
                color: #1e293b;
            }

            .jankx-universal-header {
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                padding: 40px;
                border-radius: 24px;
                color: #f8fafc;
                margin-bottom: 30px;
                box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.1);
            }

            .jankx-universal-header .header-content { display: flex; align-items: center; gap: 24px; }
            .jankx-universal-header .header-icon {
                width: 64px; height: 64px;
                background: rgba(59, 130, 246, 0.2);
                border-radius: 18px;
                display: flex; align-items: center; justify-content: center;
                border: 1px solid rgba(59, 130, 246, 0.3);
            }
            .jankx-universal-header .header-icon .dashicons { font-size: 32px; width: 32px; height: 32px; color: #60a5fa; }
            .jankx-universal-header .header-text h1 { margin: 0; font-size: 28px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 12px; }
            .jankx-universal-header .version-badge { font-size: 12px; background: rgba(59, 130, 246, 0.5); padding: 4px 10px; border-radius: 20px; font-weight: 600; }
            .jankx-universal-header .header-text .subtitle { margin: 8px 0 0 0; font-size: 16px; color: #94a3b8; }

            .jankx-universal-content { min-height: 400px; }

            /* Card Standard */
            .jankx-card {
                background: #fff;
                border-radius: 20px;
                border: 1px solid #e2e8f0;
                padding: 30px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                transition: all 0.3s ease;
                margin-bottom: 24px;
            }
            .jankx-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); border-color: #3b82f6; }
            .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
            .card-header .dashicons { font-size: 20px; width: 20px; height: 20px; color: #3b82f6; }
            .card-header h3 { margin: 0; font-size: 18px; font-weight: 600; color: #1e293b; }

            .jankx-admin-footer {
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                color: #64748b;
                font-size: 13px;
                text-align: center;
            }

            /* Jankx News Portal Styles */
            .news-portal-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin-top: 20px;
            }
            .news-card {
                display: flex;
                flex-direction: column;
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 16px;
                padding: 20px;
                text-decoration: none;
                color: #1e293b;
                transition: all 0.25s ease;
                border-top: 4px solid #e2e8f0;
            }
            .news-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 12px 24px -8px rgba(15, 23, 42, 0.1);
                border-color: #3b82f6;
                color: #3b82f6;
            }
            .news-card--announcement { border-top-color: #8b5cf6; }
            .news-card--release      { border-top-color: #10b981; }
            .news-card--tutorial     { border-top-color: #f59e0b; }
            .news-card--news         { border-top-color: #3b82f6; }

            .news-badge {
                display: inline-block;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                padding: 3px 8px;
                border-radius: 20px;
                background: #f1f5f9;
                color: #64748b;
                margin-bottom: 12px;
                width: fit-content;
                line-height: 1;
            }
            .news-card--announcement .news-badge { background: #ede9fe; color: #7c3aed; }
            .news-card--release .news-badge      { background: #d1fae5; color: #059669; }
            .news-card--tutorial .news-badge     { background: #fef3c7; color: #d97706; }
            .news-card--news .news-badge         { background: #dbeafe; color: #2563eb; }

            .news-title {
                margin: 0 0 10px 0;
                font-size: 16px;
                font-weight: 700;
                line-height: 1.4;
                color: #1e293b;
            }
            .news-excerpt {
                margin: 0 0 15px 0;
                font-size: 13px;
                color: #64748b;
                line-height: 1.6;
                flex: 1;
            }
            .news-date {
                font-size: 12px;
                color: #94a3b8;
                font-weight: 500;
                margin-top: auto;
            }

            @media (max-width: 1024px) {
                .news-portal-grid { grid-template-columns: repeat(2, 1fr); }
            }
            @media (max-width: 767px) {
                .news-portal-grid { grid-template-columns: 1fr; }
            }

            @media (max-width: 767px) {
                .jankx-universal-header .header-content { flex-direction: column; text-align: center; }
            }
        </style>
        <?php
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
        $activeTab = $_GET['tab'] ?? 'packs';
        $renderer = new \Jankx\Services\FontIcons\Admin\DashboardRenderer($this->app);
        
        $renderer->render($activeTab);
    }

    /**
     * Enqueue page assets
     */
    protected function enqueuePageAssets($page)
    {
        if ($page['id'] === 'jankx-icons') {
            $repository = $this->app->make('font-icons.repository');
            $activeStyles = $repository->getAllActiveStyles();

            foreach ($activeStyles as $type => $url) {
                wp_enqueue_style('jankx-icon-' . sanitize_title($type), $url, [], null);
            }

            wp_enqueue_style('jankx-admin-pages');
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
        <div class="jankx-utilities-grid-wrapper">
            <div class="utilities-grid">
                <div class="utility-card main-card jankx-card">
                    <div class="card-header">
                        <div class="card-header-title">
                            <span class="dashicons dashicons-images-alt2"></span>
                            <h3><?php _e('Media Optimization', 'jankx'); ?></h3>
                        </div>
                        <div class="card-header-action">
                            <label class="select-all-label">
                                <input type="checkbox" id="cb-select-all-1" <?php checked(count($enabled_sizes) === count($all_sizes)); ?>>
                                <span><?php _e('Select All', 'jankx'); ?></span>
                            </label>
                        </div>
                    </div>

                    <div class="card-body">
                        <p class="section-desc"><?php _e('Enable or disable specific image sizes. Unused image sizes consume disk space and slow down your site. Disabling them will prevent WordPress from generating these sizes for new uploads.', 'jankx'); ?></p>

                        <form method="post" action="" id="jankx-utilities-form">
                            <?php wp_nonce_field('jankx_save_utilities', 'jankx_utilities_nonce'); ?>
                            <input type="hidden" name="jankx_action" value="save_image_sizes">

                            <div class="image-sizes-grid">
                                <?php foreach ($all_sizes as $name => $size):
                                    $is_enabled = in_array($name, $enabled_sizes);
                                ?>
                                    <div class="size-item <?php echo $is_enabled ? 'is-active' : ''; ?>">
                                        <div class="size-info">
                                            <div class="size-name"><?php echo esc_html(ucwords(str_replace(['_', '-'], ' ', $name))); ?></div>
                                            <div class="size-meta">
                                                <span class="dimension"><?php echo esc_html($size['width'] . ' × ' . $size['height']); ?></span>
                                                <span class="dot"></span>
                                                <span class="crop-status"><?php echo $size['crop'] ? __('Crop: Yes', 'jankx') : __('Crop: No', 'jankx'); ?></span>
                                            </div>
                                            <div class="size-slug"><code><?php echo esc_html($name); ?></code></div>
                                        </div>
                                        <div class="size-toggle">
                                            <label class="jankx-switch">
                                                <input type="checkbox" name="enabled_sizes[]" value="<?php echo esc_attr($name); ?>" <?php checked($is_enabled); ?>>
                                                <span class="slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>

                            <div class="card-footer">
                                <button type="submit" name="submit" id="submit" class="jankx-btn-save">
                                    <span class="dashicons dashicons-saved"></span>
                                    <?php _e('Save Media Settings', 'jankx'); ?>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="utility-sidebar">
                    <div class="utility-card sidebar-card jankx-card">
                        <div class="card-header">
                            <div class="card-header-title">
                                <span class="dashicons dashicons-performance"></span>
                                <h3><?php _e('System Actions', 'jankx'); ?></h3>
                            </div>
                        </div>
                        <div class="card-body">
                            <ul class="quick-actions">
                                <li>
                                    <div class="action-info">
                                        <strong><?php _e('Regenerate Thumbnails', 'jankx'); ?></strong>
                                        <span><?php _e('Fix broken images and create new sizes.', 'jankx'); ?></span>
                                    </div>
                                    <button class="action-btn" title="<?php _e('Requires plugin', 'jankx'); ?>" disabled>
                                        <span class="dashicons dashicons-update"></span>
                                    </button>
                                </li>
                                <li>
                                    <div class="action-info">
                                        <strong><?php _e('Clear Image Cache', 'jankx'); ?></strong>
                                        <span><?php _e('Remove transient image metadata.', 'jankx'); ?></span>
                                    </div>
                                    <button class="action-btn">
                                        <span class="dashicons dashicons-trash"></span>
                                    </button>
                                </li>
                                <li>
                                    <div class="action-info">
                                        <strong><?php _e('Export Settings', 'jankx'); ?></strong>
                                        <span><?php _e('Download your configuration.', 'jankx'); ?></span>
                                    </div>
                                    <button class="action-btn">
                                        <span class="dashicons dashicons-download"></span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="utility-card help-card jankx-card">
                        <div class="card-body">
                            <div class="help-content">
                                <span class="dashicons dashicons-editor-help"></span>
                                <h4><?php _e('Need Help?', 'jankx'); ?></h4>
                                <p><?php _e('Check our documentation for advanced media optimization tips.', 'jankx'); ?></p>
                                <a href="#" class="help-link"><?php _e('Read Docs', 'jankx'); ?> →</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .utilities-grid {
                display: grid;
                grid-template-columns: 1fr 340px;
                gap: 24px;
            }

            .select-all-label {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                font-weight: 500;
                color: #64748b;
                cursor: pointer;
            }

            .card-body { padding: 30px; }
            .section-desc { margin-top: 0; margin-bottom: 24px; color: #64748b; font-size: 14px; line-height: 1.6; }

            .image-sizes-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 16px;
                margin-bottom: 30px;
            }

            .size-item {
                padding: 20px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s;
            }

            .size-item:hover { border-color: #cbd5e1; background: #f1f5f9; }
            .size-item.is-active { border-color: #3b82f6; background: #eff6ff; }

            .size-name { font-weight: 600; color: #0f172a; margin-bottom: 4px; }
            .size-meta { font-size: 12px; color: #64748b; display: flex; align-items: center; gap: 6px; }
            .size-meta .dot { width: 3px; height: 3px; background: #cbd5e1; border-radius: 50%; }
            .size-slug { margin-top: 8px; }
            .size-slug code { background: #fff; border: 1px solid #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 11px; color: #3b82f6; }

            /* Switch UI */
            .jankx-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
            .jankx-switch input { opacity: 0; width: 0; height: 0; }
            .slider {
                position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                background-color: #cbd5e1; transition: .4s;
            }
            .slider:before {
                position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
                background-color: white; transition: .4s;
            }
            input:checked + .slider { background-color: #3b82f6; }
            input:focus + .slider { box-shadow: 0 0 1px #3b82f6; }
            input:checked + .slider:before { transform: translateX(20px); }
            .slider.round { border-radius: 24px; }
            .slider.round:before { border-radius: 50%; }

            .card-footer {
                padding-top: 24px;
                border-top: 1px solid #f1f5f9;
                display: flex;
                justify-content: flex-end;
            }

            .jankx-btn-save {
                background: #3b82f6;
                color: #fff;
                border: none;
                border-radius: 12px;
                padding: 12px 24px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background 0.2s;
            }
            .jankx-btn-save:hover { background: #2563eb; }
            .jankx-btn-save .dashicons { font-size: 18px; width: 18px; height: 18px; }

            /* Sidebar */
            .utility-sidebar { display: flex; flex-direction: column; gap: 24px; }
            .quick-actions { list-style: none; margin: 0; padding: 0; }
            .quick-actions li {
                display: flex; justify-content: space-between; align-items: center;
                padding: 12px 0; border-bottom: 1px solid #f1f5f9;
            }
            .quick-actions li:last-child { border-bottom: none; }
            .action-info strong { display: block; font-size: 14px; color: #0f172a; }
            .action-info span { font-size: 12px; color: #64748b; }
            .action-btn {
                background: #f1f5f9; border: none; border-radius: 8px; padding: 8px; color: #64748b; cursor: pointer; transition: all 0.2s;
            }
            .action-btn:hover:not(:disabled) { background: #e2e8f0; color: #3b82f6; }
            .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

            .help-content { text-align: center; }
            .help-content .dashicons { font-size: 48px; width: 48px; height: 48px; color: #3b82f6; margin-bottom: 16px; }
            .help-content h4 { margin: 0 0 8px 0; font-size: 18px; font-weight: 600; }
            .help-content p { font-size: 14px; color: #64748b; margin-bottom: 16px; }
            .help-link { color: #3b82f6; text-decoration: none; font-weight: 600; font-size: 14px; }

            @media (max-width: 1200px) {
                .utilities-grid { grid-template-columns: 1fr; }
                .utility-sidebar { flex-direction: row; }
                .sidebar-card, .help-card { flex: 1; }
            }
            @media (max-width: 767px) {
                .utility-sidebar { flex-direction: column; }
            }
        </style>

        <script>
            jQuery(document).ready(function ($) {
                // Select all functionality
                $('#cb-select-all-1').click(function () {
                    $('.jankx-switch input[name="enabled_sizes[]"]').prop('checked', this.checked).trigger('change');
                });

                // Update row styling on change
                $('.jankx-switch input').on('change', function() {
                    var $item = $(this).closest('.size-item');
                    if (this.checked) {
                        $item.addClass('is-active');
                    } else {
                        $item.removeClass('is-active');
                    }
                });
            });
        </script>
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
        $extensionManager  = $this->app->make('extension.manager');
        $themeExtManager   = $this->app->make('theme_extension.manager');

        $extensions        = $extensionManager->get_extensions();           // active/loaded
        $disabledManifests = $themeExtManager->getDisabledManifests();      // disabled (not instantiated)

        $totalActive   = count($extensions);
        $totalInactive = count($disabledManifests);
        $total         = $totalActive + $totalInactive;
        $nonce         = wp_create_nonce('jankx_extension_manager_nonce');

        $status = isset($_GET['extension_status']) ? $_GET['extension_status'] : 'all';
        ?>
        <div class="jankx-extensions-page">
            <div id="jankx-extension-notice" style="display:none; margin: 10px 0 15px;" class="notice"></div>

            <ul class="subsubsub">
                <li class="all"><a href="<?php echo admin_url('admin.php?page=jankx-extensions'); ?>" class="<?php echo $status == 'all' ? 'current' : ''; ?>"><?php _e('All', 'jankx'); ?> <span class="count">(<?php echo $total; ?>)</span></a> |</li>
                <li class="active"><a href="<?php echo add_query_arg('extension_status', 'active'); ?>" class="<?php echo $status == 'active' ? 'current' : ''; ?>"><?php _e('Active', 'jankx'); ?> <span class="count">(<?php echo $totalActive; ?>)</span></a> |</li>
                <li class="inactive"><a href="<?php echo add_query_arg('extension_status', 'inactive'); ?>" class="<?php echo $status == 'inactive' ? 'current' : ''; ?>"><?php _e('Inactive', 'jankx'); ?> <span class="count">(<?php echo $totalInactive; ?>)</span></a>
                <?php
                $unmet_required = $extensionManager->get_missing_required_extensions();
                $recommended = $extensionManager->get_recommended_extensions();
                $unmet_recommended = [];
                foreach ($recommended as $id) {
                    if (!$extensionManager->has_extension_id($id) || !$extensionManager->is_extension_active_by_id($id)) {
                        $unmet_recommended[] = $id;
                    }
                }
                
                if (!empty($unmet_required) || !empty($unmet_recommended)) : ?>
                    | </li><li class="required"><a href="<?php echo add_query_arg('extension_status', 'required'); ?>" class="<?php echo $status == 'required' ? 'current' : ''; ?>"><?php _e('Required', 'jankx'); ?> <span class="count">(<?php echo count($unmet_required) + count($unmet_recommended); ?>)</span></a>
                <?php endif; ?>
                </li>
            </ul>

            <table class="wp-list-table widefat plugins">
                <thead>
                    <tr>
                        <th scope="col" id="name" class="manage-column column-name column-primary"><?php _e('Extension', 'jankx'); ?></th>
                        <th scope="col" id="description" class="manage-column column-description"><?php _e('Description', 'jankx'); ?></th>
                    </tr>
                </thead>

                <tbody id="the-list">
                    <?php if (empty($extensions) && empty($disabledManifests)): ?>
                        <tr class="no-items">
                            <td class="colspanchange" colspan="2"><?php _e('No extensions found.', 'jankx'); ?></td>
                        </tr>
                    <?php else: ?>
                        <?php
                        /* --- Active (loaded) extensions --- */
                        if ($status === 'all' || $status === 'active'):
                            $required_ids = $extensionManager->get_required_extensions();
                            $recommended_ids = $extensionManager->get_recommended_extensions();

                            foreach ($extensions as $name => $extension):
                                $info     = $extension->get_info();
                                $type = '';
                                // Check if this extension is required or recommended
                                // We check by its name which is often the ID, or we could find its ID
                                if (in_array($name, $required_ids)) $type = 'required';
                                elseif (in_array($name, $recommended_ids)) $type = 'recommended';

                                $this->renderExtensionRow($name, $info, true, $nonce, $type);
                            endforeach;
                        endif;

                        /* --- Required & Recommended extensions --- */
                        if ($status === 'required'):
                            $required_ids = $extensionManager->get_required_extensions();
                            $recommended_ids = $extensionManager->get_recommended_extensions();
                            
                            foreach ($required_ids as $id):
                                $extension = $extensionManager->get_extension_by_id($id);
                                if ($extension) {
                                    $info = $extension->get_info();
                                    $this->renderExtensionRow($id, $info, true, $nonce, 'required');
                                } else {
                                    if (isset($disabledManifests[$id])) {
                                        $m = $disabledManifests[$id]['manifest'];
                                        $info = [
                                            'name'                    => $m['name']        ?? $id,
                                            'version'                 => $m['version']     ?? '1.0.0',
                                            'description'             => $m['description'] ?? '',
                                            'author'                  => $m['author']      ?? 'Jankx Team',
                                            'is_child_theme_extension'=> false,
                                        ];
                                        $this->renderExtensionRow($id, $info, false, $nonce, 'required');
                                    } else {
                                        $hubInfo = $extensionManager->get_hub_extension_info($id);
                                        $this->renderExtensionRow($id, [
                                            'name'        => $hubInfo['name']        ?? $id,
                                            'description' => $hubInfo['description'] ?? __('This extension is required by the theme but not installed.', 'jankx'),
                                            'version'     => $hubInfo['version']     ?? 'N/A',
                                            'author'      => $hubInfo['author']      ?? 'N/A'
                                        ], false, $nonce, 'required', true);
                                    }
                                }
                            endforeach;

                            foreach ($recommended_ids as $id):
                                $extension = $extensionManager->get_extension_by_id($id);
                                if ($extension) {
                                    $info = $extension->get_info();
                                    $this->renderExtensionRow($id, $info, true, $nonce, 'recommended');
                                } else {
                                    if (isset($disabledManifests[$id])) {
                                        $m = $disabledManifests[$id]['manifest'];
                                        $info = [
                                            'name'                    => $m['name']        ?? $id,
                                            'version'                 => $m['version']     ?? '1.0.0',
                                            'description'             => $m['description'] ?? '',
                                            'author'                  => $m['author']      ?? 'Jankx Team',
                                            'is_child_theme_extension'=> false,
                                        ];
                                        $this->renderExtensionRow($id, $info, false, $nonce, 'recommended');
                                    } else {
                                        $hubInfo = $extensionManager->get_hub_extension_info($id);
                                        $this->renderExtensionRow($id, [
                                            'name'        => $hubInfo['name']        ?? $id,
                                            'description' => $hubInfo['description'] ?? __('This extension is recommended by the theme but not installed.', 'jankx'),
                                            'version'     => $hubInfo['version']     ?? 'N/A',
                                            'author'      => $hubInfo['author']      ?? 'N/A'
                                        ], false, $nonce, 'recommended', true);
                                    }
                                }
                            endforeach;
                        endif;

                        /* --- Disabled extensions (not instantiated) --- */
                        if ($status === 'all' || $status === 'inactive'):
                            $required_ids = $extensionManager->get_required_extensions();
                            $recommended_ids = $extensionManager->get_recommended_extensions();

                            foreach ($disabledManifests as $name => $data):
                                $m = $data['manifest'];
                                $info = [
                                    'name'                    => $m['name']        ?? $name,
                                    'version'                 => $m['version']     ?? '1.0.0',
                                    'description'             => $m['description'] ?? '',
                                    'author'                  => $m['author']      ?? 'Jankx Team',
                                    'is_child_theme_extension'=> false,
                                ];
                                $type = '';
                                if (in_array($name, $required_ids)) $type = 'required';
                                elseif (in_array($name, $recommended_ids)) $type = 'recommended';

                                $this->renderExtensionRow($name, $info, false, $nonce, $type);
                            endforeach;
                        endif;
                        ?>
                    <?php endif; ?>
                </tbody>

                <tfoot>
                    <tr>
                        <th scope="col" class="manage-column column-name column-primary"><?php _e('Extension', 'jankx'); ?></th>
                        <th scope="col" class="manage-column column-description"><?php _e('Description', 'jankx'); ?></th>
                    </tr>
                </tfoot>
            </table>
        </div>

        <style>
            .wp-list-table .plugin-title strong { display: block; margin-bottom: 0.2em; font-size: 14px; }
            .toggle-extension.loading { opacity:0.6; cursor:not-allowed; }
            .jankx-extensions-page .wp-list-table.plugins td { vertical-align: top; }
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
                        var errMsg = (res.data && res.data.message) ? res.data.message : (res.data || 'Error');
                        $notice.removeClass('notice-success').addClass('notice-error')
                               .html('<p>' + errMsg + '</p>').show();
                        $btn.removeClass('loading').prop('disabled', false);
                    }
                }).fail(function() {
                    $notice.removeClass('notice-success').addClass('notice-error')
                           .html('<p><?php echo esc_js(__('An error occurred.', 'jankx')); ?></p>').show();
                    $btn.removeClass('loading').prop('disabled', false);
                });
            });

            $(document).on('click', '.install-extension-ajax', function(e) {
                e.preventDefault();
                var $btn = $(this);
                var name = $btn.data('extension');
                var nonce = $btn.data('nonce');

                $btn.addClass('loading').text('<?php echo esc_js(__('Installing...', 'jankx')); ?>');
                $notice.hide();

                $.post(ajaxurl, {
                    action: 'jankx_install_extension',
                    extension: name,
                    nonce: nonce
                }, function(res) {
                    if (res.success) {
                        $notice.removeClass('notice-error').addClass('notice-success')
                               .html('<p>' + res.data.message + '</p>').show();
                        location.reload();
                    } else {
                        var errMsg = (res.data && res.data.message) ? res.data.message : (res.data || 'Error');
                        $notice.removeClass('notice-success').addClass('notice-error')
                               .html('<p>' + errMsg + '</p>').show();
                        $btn.removeClass('loading').text('<?php echo esc_js(__('Install Now', 'jankx')); ?>');
                    }
                }).fail(function() {
                    $notice.removeClass('notice-success').addClass('notice-error')
                           .html('<p><?php echo esc_js(__('An error occurred during installation.', 'jankx')); ?></p>').show();
                    $btn.removeClass('loading').text('<?php echo esc_js(__('Install Now', 'jankx')); ?>');
                });
            });

            $(document).on('click', '.delete-extension', function() {
                var $btn = $(this);
                var name = $btn.data('extension');
                var nonce = $btn.data('nonce');

                if (!confirm('<?php echo esc_js(__('Are you sure you want to delete this extension? This action cannot be undone.', 'jankx')); ?>')) {
                    return;
                }

                $btn.prop('disabled', true).css('opacity', 0.5);
                $notice.hide();

                $.post(ajaxurl, {
                    action: 'jankx_delete_extension',
                    extension: name,
                    nonce: nonce
                }, function(res) {
                    if (res.success) {
                        location.reload();
                    } else {
                        alert(res.data.message || 'Error');
                        $btn.prop('disabled', false).css('opacity', 1);
                    }
                });
            });
        });
        </script>
        <?php
    }

    /**
     * Render a single extension item row
     */
    protected function renderExtensionRow(string $name, array $info, bool $isActive, string $nonce, string $type = '', bool $isMissing = false): void
    {
        $statusClass = $isActive ? 'active' : 'inactive';
        if ($isMissing) {
            $statusClass .= ' missing';
        }
        ?>
        <tr class="<?php echo $statusClass; ?>" data-slug="<?php echo esc_attr($name); ?>">
            <td class="plugin-title column-primary">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <strong><?php echo esc_html($info['name'] ?? $name); ?></strong>
                    <?php if ($type === 'required'): ?>
                        <span class="jankx-badge-required" style="background: #ef4444; color: #fff; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 700; text-transform: uppercase;"><?php _e('Required', 'jankx'); ?></span>
                    <?php elseif ($type === 'recommended'): ?>
                        <span class="jankx-badge-recommended" style="background: #3b82f6; color: #fff; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 700; text-transform: uppercase;"><?php _e('Recommended', 'jankx'); ?></span>
                    <?php endif; ?>
                </div>
                <div class="row-actions visible">
                    <?php if ($isMissing): ?>
                        <span class="install">
                            <a href="javascript:void(0);" class="install-extension-ajax" data-extension="<?php echo esc_attr($name); ?>" data-nonce="<?php echo esc_attr($nonce); ?>">
                                <?php _e('Install Now', 'jankx'); ?>
                            </a>
                        </span>
                    <?php elseif ($isActive): ?>
                        <span class="deactivate">
                            <a href="javascript:void(0);" class="toggle-extension" data-extension="<?php echo esc_attr($name); ?>" data-nonce="<?php echo esc_attr($nonce); ?>">
                                <?php _e('Deactivate', 'jankx'); ?>
                            </a> |
                        </span>
                    <?php else: ?>
                        <span class="activate">
                            <a href="javascript:void(0);" class="toggle-extension" data-extension="<?php echo esc_attr($name); ?>" data-nonce="<?php echo esc_attr($nonce); ?>">
                                <?php _e('Activate', 'jankx'); ?>
                            </a> |
                        </span>
                    <?php endif; ?>
                    <?php if (!$isMissing): ?>
                        <span class="delete">
                            <a href="javascript:void(0);" class="delete-extension" data-extension="<?php echo esc_attr($name); ?>" data-nonce="<?php echo esc_attr($nonce); ?>" style="color: #d63638;">
                                <?php _e('Delete', 'jankx'); ?>
                            </a>
                        </span>
                    <?php endif; ?>
                </div>
                <button type="button" class="toggle-row"><span class="screen-reader-text"><?php _e('Show more details'); ?></span></button>
            </td>
            <td class="column-description desc">
                <div class="plugin-description">
                    <p><?php echo esc_html($info['description'] ?? ''); ?></p>
                </div>
                <div class="<?php echo $statusClass; ?> second plugin-version-author-uri">
                    <?php printf(__('Version %s', 'jankx'), esc_html($info['version'] ?? '1.0.0')); ?> |
                    <?php printf(__('By %s', 'jankx'), esc_html($info['author'] ?? 'Jankx Team')); ?>
                    <?php if (!empty($info['is_child_theme_extension'])): ?>
                        | <span class="jankx-child-badge" style="background:#e5f5fa; color:#005e7e; padding:1px 6px; border-radius:3px; font-size: 11px;"><?php _e('Child Theme', 'jankx'); ?></span>
                    <?php endif; ?>
                </div>
            </td>
        </tr>
        <?php
    }

    /**
     * Render Marketplace Page
     */
    public function renderMarketplacePage($page)
    {
        $currentPage = isset($_GET['paged']) ? max(1, (int)$_GET['paged']) : 1;
        $marketplace = $this->app->make('extension.marketplace');

        if (isset($_GET['force_refresh'])) {
            $locale = method_exists($marketplace, 'getLocale') ? $marketplace->getLocale() : 'en';
            delete_transient(sprintf('jankx_marketplace_extensions_%s_p%d_s12', $locale, $currentPage));
            delete_transient('jankx_theme_update_check');
        }

        $result      = $marketplace->getAvailableExtensions($currentPage);
        $extensions  = $result['data'] ?? [];
        $pagination  = $result['pagination'] ?? [];

        // Read from transient ONLY - never block on live API
        $cachedUpdate = get_transient('jankx_theme_update_check');
        $themeUpdate  = ($cachedUpdate && isset($cachedUpdate['version'])) ? $cachedUpdate : false;

        $nonce = wp_create_nonce('jankx_marketplace_nonce');
        ?>
        <div class="jankx-marketplace-modern">
            <div id="jankx-install-notice" style="display:none; margin-bottom:20px;" class="notice"></div>
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
                <?php if (empty($extensions) && !is_array($extensions)): ?>
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
                        $reviews = $ext['rating_count'] ?? 0;
                        $installs = $ext['install_count'] ?? 0;
                        
                        $lastUpdated = __('Vừa xong', 'jankx');
                        if (!empty($ext['updated_at'])) {
                            $lastUpdated = sprintf(__('%s trước', 'jankx'), human_time_diff(strtotime($ext['updated_at'])));
                        }
                    ?>
                        <div class="extension-card-modern <?php echo $isPremium ? 'is-premium' : ''; ?>" data-slug="<?php echo esc_attr($slug); ?>">
                            <div class="card-body">
                                <div class="extension-head">
                                        <div class="extension-icon">
                                            <?php if (!empty($ext['icon_svg'])): ?>
                                                <div class="svg-icon-wrapper">
                                                    <?php echo $ext['icon_svg']; ?>
                                                </div>
                                            <?php elseif (!empty($ext['icon'])): ?>
                                                <img src="<?php echo esc_url($ext['icon']); ?>" alt="<?php echo esc_attr($ext['name']); ?>">
                                            <?php elseif (!empty($ext['icon_name'])):
                                                // Map "Blocks" or other names to Dashicons
                                                $dashicon = 'dashicons-' . strtolower($ext['icon_name']);
                                                $bg_color = $ext['icon_color'] ?? '#3b82f6';
                                            ?>
                                                <div class="default-icon" style="background: <?php echo esc_attr($bg_color); ?>;">
                                                    <span class="dashicons <?php echo esc_attr($dashicon); ?>"></span>
                                                </div>
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
                                    <span class="version">v<?php echo esc_html($ext['latest_version'] ?? '1.0.0'); ?></span>
                                    <span class="author"><?php printf(__('bởi %s', 'jankx'), '<span class="author-name">' . esc_html($ext['author_name'] ?? 'Jankx Team') . '</span>'); ?></span>
                                </div>

                                <div class="card-action-area">
                                    <div class="action-buttons">
                                        <button class="button jankx-btn-secondary detail-extension"
                                                data-ext='<?php echo esc_attr(json_encode($ext)); ?>'>
                                            <?php _e('Chi tiết', 'jankx'); ?>
                                        </button>
                                        <?php
                                        $extensionManager = \Jankx\Extensions\ExtensionManager::getInstance();
                                        $isInstalled = $extensionManager->has_extension_id($slug) || $extensionManager->has_extension($slug);
                                        if ($isInstalled): ?>
                                            <button class="button jankx-btn-primary installed" disabled>
                                                <span class="dashicons dashicons-yes" style="font-size: 16px; margin-right: 4px; vertical-align: middle;"></span>
                                                <?php _e('Đã có', 'jankx'); ?>
                                            </button>
                                        <?php else: ?>
                                            <button class="button jankx-btn-primary install-extension"
                                                    data-slug="<?php echo esc_attr($slug); ?>"
                                                    data-nonce="<?php echo esc_attr($nonce); ?>">
                                                <?php _e('Cài đặt', 'jankx'); ?>
                                            </button>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <div class="marketplace-pagination">
                <?php if (!empty($pagination)): ?>
                    <a href="<?php echo $pagination['has_prev'] ? add_query_arg('paged', $currentPage - 1) : '#'; ?>"
                       class="page-nav prev <?php echo !$pagination['has_prev'] ? 'disabled' : ''; ?>">
                        <span class="dashicons dashicons-arrow-left-alt2"></span>
                    </a>
                    <div class="page-numbers">
                        <?php
                        $total_pages = $pagination['total_pages'] ?? 1;
                        for ($i = 1; $i <= $total_pages; $i++):
                            $is_active = ($i === $currentPage);
                        ?>
                            <a href="<?php echo add_query_arg('paged', $i); ?>" class="page-number <?php echo $is_active ? 'active' : ''; ?>">
                                <?php echo $i; ?>
                            </a>
                        <?php endfor; ?>
                    </div>
                    <a href="<?php echo $pagination['has_next'] ? add_query_arg('paged', $currentPage + 1) : '#'; ?>"
                       class="page-nav next <?php echo !$pagination['has_next'] ? 'disabled' : ''; ?>">
                        <span class="dashicons dashicons-arrow-right-alt2"></span>
                    </a>
                <?php endif; ?>
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
            .svg-icon-wrapper {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f1f5f9;
                padding: 12px;
                box-sizing: border-box;
            }
            .svg-icon-wrapper svg {
                width: 100%;
                height: 100%;
                display: block;
                max-width: 100%;
                max-height: 100%;
            }
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

            .card-action-area {
                padding: 16px 20px;
                border-top: 1px solid #f1f5f9;
                background: #fdfdfd;
            }

            .action-buttons {
                display: flex;
                gap: 10px;
                width: 100%;
            }

            .jankx-btn-primary, .jankx-btn-secondary {
                border-radius: 10px !important;
                padding: 10px 16px !important;
                font-weight: 600 !important;
                border: none !important;
                transition: all 0.2s !important;
                height: auto !important;
                line-height: 1.2 !important;
                flex: 1;
                text-align: center;
                cursor: pointer;
                font-size: 13px !important;
            }

            .jankx-btn-primary {
                background: #3b82f6 !important;
                color: #fff !important;
            }
            .jankx-btn-primary:hover { background: #2563eb !important; }
            .jankx-btn-primary.installed {
                background: #f1f5f9 !important;
                color: #94a3b8 !important;
                cursor: not-allowed;
            }

            .jankx-btn-secondary {
                background: #fff !important;
                color: #475569 !important;
                border: 1px solid #e2e8f0 !important;
            }
            .jankx-btn-secondary:hover {
                background: #f8fafc !important;
                border-color: #3b82f6 !important;
                color: #3b82f6 !important;
            }

            /* Modal Styles */
            .jankx-modal-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(15, 23, 42, 0.6);
                backdrop-filter: blur(4px);
                z-index: 99999;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 20px;
                opacity: 0;
                transition: opacity 0.3s;
            }
            .jankx-modal-overlay.is-active { display: flex; opacity: 1; }

            .jankx-modal-content {
                background: #fff;
                width: 100%;
                max-width: 600px;
                border-radius: 24px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                overflow: hidden;
                transform: translateY(20px);
                transition: transform 0.3s;
            }
            .jankx-modal-overlay.is-active .jankx-modal-content { transform: translateY(0); }

            .modal-header {
                padding: 30px;
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-bottom: 1px solid #e2e8f0;
                position: relative;
                display: flex;
                gap: 20px;
            }
            .modal-close {
                position: absolute;
                top: 20px; right: 20px;
                width: 32px; height: 32px;
                background: #fff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #64748b;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                transition: all 0.2s;
            }
            .modal-close:hover { color: #f43f5e; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }

            .modal-icon-wrapper {
                width: 80px; height: 80px;
                border-radius: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
            }
            .modal-title-area h2 { margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #1e293b; }
            .modal-body { padding: 30px; }
            .modal-description { font-size: 15px; line-height: 1.7; color: #475569; margin-bottom: 25px; }

            .modal-metadata {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                padding: 20px;
                background: #f8fafc;
                border-radius: 16px;
                margin-bottom: 25px;
            }
            .meta-val { display: block; font-weight: 600; color: #1e293b; font-size: 14px; }
            .meta-lbl { display: block; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
            .modal-footer { padding: 20px 30px; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; }

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

        <div class="jankx-modal-overlay" id="extension-modal">
            <div class="jankx-modal-content">
                <div class="modal-header">
                    <div class="modal-close"><span class="dashicons dashicons-no-alt"></span></div>
                    <div class="modal-icon-wrapper" id="m-icon-bg">
                        <div id="m-icon-content"></div>
                    </div>
                    <div class="modal-title-area">
                        <h2 id="m-title">Extension Name</h2>
                        <span id="m-badge" class="badge">Free</span>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="modal-description" id="m-desc"></div>
                    <div class="modal-metadata">
                        <div class="meta-item">
                            <span class="meta-lbl"><?php _e('Tác giả', 'jankx'); ?></span>
                            <span class="meta-val" id="m-author">Jankx Team</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-lbl"><?php _e('Phiên bản', 'jankx'); ?></span>
                            <span class="meta-val" id="m-version">1.0.0</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-lbl"><?php _e('Cài đặt', 'jankx'); ?></span>
                            <span class="meta-val" id="m-installs">0</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-lbl"><?php _e('Đánh giá', 'jankx'); ?></span>
                            <span class="meta-val" id="m-rating">5.0</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="button jankx-btn-secondary modal-close-btn"><?php _e('Đóng', 'jankx'); ?></button>
                </div>
            </div>
        </div>

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
                               .html('<p><strong><?php echo esc_js(__('Success:', 'jankx')); ?></strong> ' + res.data.message + '</p>').show();
                        $btn.text('<?php echo esc_js(__('Đã cài đặt', 'jankx')); ?>');
                        $btn.addClass('installed').prop('disabled', true).css('background', '#10b981');
                        $('html, body').animate({ scrollTop: $notice.offset().top - 80 }, 400);
                    } else {
                        var errMsg = (res.data && res.data.message)
                            ? res.data.message
                            : '<?php echo esc_js(__('Cài đặt thất bại.', 'jankx')); ?>';
                        $notice.removeClass('notice-success').addClass('notice-error')
                               .html('<p><strong><?php echo esc_js(__('Error:', 'jankx')); ?></strong> ' + errMsg + '</p>').show();
                        $btn.removeClass('loading').prop('disabled', false).text('<?php echo esc_js(__('Cài đặt ngay', 'jankx')); ?>');
                        $('html, body').animate({ scrollTop: $notice.offset().top - 80 }, 400);
                    }
                }).fail(function(xhr) {
                    var errMsg = '<?php echo esc_js(__('Lỗi kết nối. Vui lòng thử lại.', 'jankx')); ?>';
                    try {
                        var parsed = JSON.parse(xhr.responseText);
                        if (parsed && parsed.data && parsed.data.message) {
                            errMsg = parsed.data.message;
                        }
                    } catch(e) {}
                    $notice.removeClass('notice-success').addClass('notice-error')
                           .html('<p><strong><?php echo esc_js(__('Error:', 'jankx')); ?></strong> ' + errMsg + '</p>').show();
                    $btn.removeClass('loading').prop('disabled', false).text('<?php echo esc_js(__('Cài đặt ngay', 'jankx')); ?>');
                    $('html, body').animate({ scrollTop: $notice.offset().top - 80 }, 400);
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

            // Modal Functionality
            var $modal = $('#extension-modal');
            var closeModal = function() {
                $modal.removeClass('is-active');
                $('body').removeClass('modal-open');
            };

            $(document).on('click', '.detail-extension', function() {
                var $card = $(this).closest('.extension-card-modern');
                var data = $(this).data('ext');

                // Fill data
                $('#m-title').text(data.name || 'Unknown');
                $('#m-desc').text(data.description || '');
                $('#m-version').text('v' + (data.latest_version || '1.0.0'));
                $('#m-author').text(data.author_name || 'Jankx Team');
                $('#m-installs').text((data.install_count || 0).toLocaleString());
                $('#m-rating').text((data.rating || 5).toFixed(1) + ' / 5.0');
                
                var $badge = $('#m-badge');
                if (data.is_premium) {
                    $badge.text('Premium').attr('class', 'badge premium');
                } else {
                    $badge.text('Miễn phí').attr('class', 'badge free');
                }

                // Icon handling
                var $iconParent = $card.find('.extension-icon');
                $('#m-icon-content').html($iconParent.html());
                var $defIcon = $iconParent.find('.default-icon');
                if ($defIcon.length) {
                    $('#m-icon-bg').css('background', $defIcon.css('background'));
                    $('#m-icon-content').find('.default-icon').css('background', 'transparent');
                } else {
                    $('#m-icon-bg').css('background', '#fff');
                }

                $modal.addClass('is-active');
                $('body').addClass('modal-open');
            });

            // Close modal events
            $(document).on('click', '.modal-close, .modal-close-btn', function() {
                closeModal();
            });

            $modal.on('click', function(e) {
                if ($(e.target).closest('.jankx-modal-content').length === 0) {
                    closeModal();
                }
            });

            $(document).on('keydown', function(e) {
                if (e.key === 'Escape' && $modal.hasClass('is-active')) {
                    closeModal();
                }
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
