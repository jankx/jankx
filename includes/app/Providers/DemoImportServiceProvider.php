<?php

namespace App\Providers;

use Jankx\Foundation\Application;
use Jankx\Foundation\Cli\Seeders\SeederRegistry;
use Jankx\Support\Providers\ServiceProvider;

class DemoImportServiceProvider extends ServiceProvider
{
    protected $app;

    public function shouldLoadFrontend(): bool
    {
        return false;
    }

    public function register(Application $app)
    {
        $this->app = $app;
    }

    public function boot(Application $app)
    {
        add_action('admin_menu', [$this, 'registerAdminPage'], 20);
        add_action('admin_enqueue_scripts', [$this, 'enqueueAssets']);

        add_action('wp_ajax_jankx_get_demos', [$this, 'ajaxGetDemos']);
        add_action('wp_ajax_jankx_import_demo', [$this, 'ajaxImportDemo']);
        add_action('wp_ajax_jankx_reset_demo', [$this, 'ajaxResetDemo']);

        add_action('wp_ajax_jankx_install_bundle', [$this, 'ajaxInstallBundle']);
        add_action('wp_ajax_jankx_reset_bundle', [$this, 'ajaxResetBundle']);
    }

    public function registerAdminPage()
    {
        add_submenu_page(
            'jankx-dashboard',
            __('Demo Import', 'jankx'),
            __('Demo Import', 'jankx'),
            'manage_options',
            'jankx-demo-import',
            [$this, 'renderPage']
        );
    }

    public function enqueueAssets($hook)
    {
        if (strpos($hook, 'jankx-demo-import') === false) {
            return;
        }

        $version = $this->app->make('jankx.version') ?? '2.0.0';

        wp_enqueue_style(
            'jankx-demo-import',
            get_template_directory_uri() . '/resources/assets/css/demo-import.css',
            [],
            $version
        );

        wp_enqueue_script(
            'jankx-demo-import',
            get_template_directory_uri() . '/resources/assets/js/demo-import.js',
            [],
            $version,
            true
        );

        wp_localize_script('jankx-demo-import', 'jankxDemoImport', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jankx_demo_import'),
            'strings' => [
                'importConfirm' => __('Are you sure you want to import this demo? It will add sample content to your site.', 'jankx'),
                'importing' => __('Importing...', 'jankx'),
                'importDone' => __('Import completed successfully!', 'jankx'),
                'importError' => __('Import failed. Please try again.', 'jankx'),
                'resetConfirm' => __('Remove all demo data? This cannot be undone.', 'jankx'),
                'resetDone' => __('Demo data removed.', 'jankx'),
            ],
        ]);
    }

    public function renderPage()
    {
        $activeDemo = get_option('jankx_active_demo', '');
        $demos = $this->getDemos();
        ?>
        <div class="wrap jankx-demo-import-wrap">
            <h1><?php esc_html_e('Demo Import', 'jankx'); ?></h1>
            <p class="description"><?php esc_html_e('Choose a demo to quickly populate your site with sample content. No coding required.', 'jankx'); ?></p>

            <?php if ($activeDemo) : ?>
                <div class="jankx-demo-active-notice">
                    <span class="dashicons dashicons-yes-alt"></span>
                    <span><?php printf(esc_html__('Active demo: %s', 'jankx'), esc_html($demos[$activeDemo]['name'] ?? $activeDemo)); ?></span>
                    <button class="button jankx-reset-demo" data-demo="<?php echo esc_attr($activeDemo); ?>">
                        <?php esc_html_e('Remove Demo Data', 'jankx'); ?>
                    </button>
                </div>
            <?php endif; ?>

            <div class="jankx-demo-grid">
                <?php foreach ($demos as $id => $demo) : ?>
                    <?php
                    $thumbnail = '';
                    if (!empty($demo['thumbnail'])) {
                        $thumbPath = get_template_directory() . '/' . $demo['thumbnail'];
                        if (file_exists($thumbPath)) {
                            $thumbnail = get_template_directory_uri() . '/' . $demo['thumbnail'];
                        }
                    }
                    $requiresPlugins = $demo['requires']['plugins'] ?? [];
                    $missingPlugins = [];
                    foreach ($requiresPlugins as $plugin) {
                        if (!is_plugin_active($plugin . '/' . $plugin . '.php')) {
                            $missingPlugins[] = $plugin;
                        }
                    }
                    $canImport = empty($missingPlugins);
                    ?>
                    <div class="jankx-demo-card <?php echo $activeDemo === $id ? 'active' : ''; ?>" data-demo="<?php echo esc_attr($id); ?>">
                        <div class="jankx-demo-thumb">
                            <?php if ($thumbnail) : ?>
                                <img src="<?php echo esc_url($thumbnail); ?>" alt="<?php echo esc_attr($demo['name']); ?>">
                            <?php else : ?>
                                <div class="jankx-demo-thumb-placeholder">
                                    <span class="dashicons dashicons-layout"></span>
                                </div>
                            <?php endif; ?>
                            <?php if ($activeDemo === $id) : ?>
                                <span class="jankx-demo-badge"><?php esc_html_e('Active', 'jankx'); ?></span>
                            <?php endif; ?>
                        </div>
                        <div class="jankx-demo-info">
                            <h3><?php echo esc_html($demo['name']); ?></h3>
                            <p><?php echo esc_html($demo['description'] ?? ''); ?></p>
                            <div class="jankx-demo-tags">
                                <?php foreach (($demo['tags'] ?? []) as $tag) : ?>
                                    <span class="jankx-demo-tag"><?php echo esc_html($tag); ?></span>
                                <?php endforeach; ?>
                            </div>
                            <?php if (!empty($requiresPlugins)) : ?>
                                <div class="jankx-demo-requires">
                                    <strong><?php esc_html_e('Requires:', 'jankx'); ?></strong>
                                    <?php foreach ($requiresPlugins as $plugin) : ?>
                                        <span class="jankx-demo-plugin-<?php echo in_array($plugin, $missingPlugins) ? 'missing' : 'ok'; ?>">
                                            <?php echo esc_html($plugin); ?>
                                        </span>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                        <div class="jankx-demo-actions">
                            <?php if ($activeDemo === $id) : ?>
                                <button class="button jankx-reset-demo" data-demo="<?php echo esc_attr($id); ?>">
                                    <?php esc_html_e('Remove', 'jankx'); ?>
                                </button>
                            <?php elseif ($canImport) : ?>
                                <button class="button button-primary jankx-import-demo" data-demo="<?php echo esc_attr($id); ?>">
                                    <?php esc_html_e('Import Demo', 'jankx'); ?>
                                </button>
                            <?php else : ?>
                                <button class="button" disabled>
                                    <?php esc_html_e('Missing Plugins', 'jankx'); ?>
                                </button>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="jankx-demo-progress" style="display:none;">
                <div class="jankx-demo-progress-bar">
                    <div class="jankx-demo-progress-fill"></div>
                </div>
                <p class="jankx-demo-progress-text"><?php esc_html_e('Importing demo content...', 'jankx'); ?></p>
            </div>

            <div class="jankx-demo-result" style="display:none;"></div>
        </div>
        <?php
    }

    public function ajaxGetDemos()
    {
        check_ajax_referer('jankx_demo_import', 'nonce');

        $demos = $this->getDemos();
        $activeDemo = get_option('jankx_active_demo', '');

        wp_send_json_success([
            'demos' => $demos,
            'activeDemo' => $activeDemo,
        ]);
    }

    public function ajaxImportDemo()
    {
        check_ajax_referer('jankx_demo_import', 'nonce');

        $demoId = sanitize_text_field($_POST['demo'] ?? '');
        if (empty($demoId)) {
            wp_send_json_error(['message' => 'No demo specified.']);
        }

        $demos = $this->getDemos();
        if (!isset($demos[$demoId])) {
            wp_send_json_error(['message' => 'Demo not found.']);
        }

        try {
            $this->runSeedersForDemo($demoId);

            update_option('jankx_active_demo', $demoId);
            update_option('jankx_demo_imported_at', current_time('mysql'));

            wp_send_json_success([
                'message' => sprintf('Demo "%s" imported successfully!', $demos[$demoId]['name']),
            ]);
        } catch (\Throwable $e) {
            wp_send_json_error([
                'message' => 'Import failed: ' . $e->getMessage(),
            ]);
        }
    }

    public function ajaxResetDemo()
    {
        check_ajax_referer('jankx_demo_import', 'nonce');

        $demoId = sanitize_text_field($_POST['demo'] ?? '');
        if (empty($demoId)) {
            $demoId = get_option('jankx_active_demo', '');
        }

        if (empty($demoId)) {
            wp_send_json_error(['message' => 'No active demo to reset.']);
        }

        try {
            $this->rollbackSeedersForDemo($demoId);

            delete_option('jankx_active_demo');
            delete_option('jankx_demo_imported_at');

            wp_send_json_success([
                'message' => sprintf('Demo "%s" data removed.', $demoId),
            ]);
        } catch (\Throwable $e) {
            wp_send_json_error([
                'message' => 'Reset failed: ' . $e->getMessage(),
            ]);
        }
    }

    protected function getDemos(): array
    {
        $demos = apply_filters('jankx/demo/available', []);

        $manifestPath = get_template_directory() . '/demo/manifest.json';
        if (file_exists($manifestPath)) {
            $data = json_decode(file_get_contents($manifestPath), true);
            if (is_array($data)) {
                $demos = array_merge($demos, $data);
            }
        }

        $childManifest = get_stylesheet_directory() . '/demo/manifest.json';
        if (is_file($childManifest) && realpath($childManifest) !== realpath($manifestPath)) {
            $childData = json_decode(file_get_contents($childManifest), true);
            if (is_array($childData)) {
                $demos = array_merge($demos, $childData);
            }
        }

        return $demos;
    }

    protected function runSeedersForDemo(string $demoId): void
    {
        $map = [
            'gaming-portal' => 'gaming-portal',
            'blog-magazine' => 'blog-demo',
            'pet-shop' => 'pet-shop',
        ];

        $seederName = $map[$demoId] ?? $demoId;
        if (SeederRegistry::has($seederName)) {
            $seeder = SeederRegistry::resolve($seederName);
            $seeder->run();
        }

        do_action('jankx/demo/imported', $demoId);
    }

    protected function rollbackSeedersForDemo(string $demoId): void
    {
        $map = [
            'gaming-portal' => 'gaming-portal',
            'blog-magazine' => 'blog-demo',
            'pet-shop' => 'pet-shop',
        ];

        $seederName = $map[$demoId] ?? $demoId;
        if (SeederRegistry::has($seederName)) {
            $seeder = SeederRegistry::resolve($seederName);
            $seeder->rollback();
        }

        do_action('jankx/demo/reset', $demoId);
    }

    public function ajaxInstallBundle()
    {
        \check_ajax_referer('jankx_membership_bundle', 'nonce');

        $bundle = \sanitize_text_field($_POST['bundle'] ?? '');
        $step = \sanitize_text_field($_POST['step'] ?? '');

        if (empty($bundle) || empty($step)) {
            \wp_send_json_error(['message' => \__('Invalid request.', 'jankx')]);
            return;
        }

        $service = new \App\Services\MembershipBundleService();
        $bundles = $service->getBundles();

        if (!isset($bundles[$bundle])) {
            \wp_send_json_error(['message' => \__('Bundle not found.', 'jankx')]);
            return;
        }

        $bundleData = $bundles[$bundle];

        try {
            switch ($step) {
                case 'plugins':
                    $this->installBundlePlugins($bundleData['required_plugins'] ?? []);
                    break;
                case 'extensions':
                    $this->installBundleExtensions($bundleData['required_extensions'] ?? []);
                    break;
                case 'demo':
                    $this->runSeedersForDemo($bundleData['demo_package'] ?? $bundle);
                    \update_option('jankx_active_demo', $bundleData['demo_package'] ?? $bundle);
                    \update_option('jankx_demo_imported_at', \current_time('mysql'));
                    break;
                case 'options':
                    $this->applyBundleOptions($bundleData['theme_options_preset'] ?? '');
                    break;
                case 'pages':
                    $this->setupBundlePages($bundleData['page_setup'] ?? []);
                    $service->setActiveBundle($bundle);
                    break;
            }
        } catch (\Throwable $e) {
            \wp_send_json_error(['message' => $e->getMessage()]);
            return;
        }

        \wp_send_json_success(['message' => \__('Step completed.', 'jankx')]);
    }

    protected function installBundlePlugins(array $plugins): void
    {
        if (empty($plugins)) {
            return;
        }

        require_once ABSPATH . 'wp-admin/includes/plugin.php';
        require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';

        foreach ($plugins as $pluginSlug) {
            if (\is_plugin_active($pluginSlug . '/' . $pluginSlug . '.php')) {
                continue;
            }

            $api = \plugins_api('plugin_information', [
                'slug' => $pluginSlug,
                'fields' => ['short_description' => false],
            ]);

            if (\is_wp_error($api)) {
                continue;
            }

            $upgrader = new \Plugin_Upgrader(new \WP_Ajax_Upgrader_Skin());
            $result = $upgrader->install($api->download_link);

            if ($result && !\is_wp_error($result)) {
                \activate_plugin($pluginSlug . '/' . $pluginSlug . '.php');
            }
        }
    }

    protected function installBundleExtensions(array $extensions): void
    {
        if (empty($extensions)) {
            return;
        }

        try {
            $marketplace = $this->app->make('extension.marketplace');
            foreach ($extensions as $slug) {
                try {
                    $marketplace->installExtension($slug);
                } catch (\Throwable $e) {
                    continue;
                }
            }
        } catch (\Throwable $e) {
        }
    }

    protected function applyBundleOptions(string $preset): void
    {
        if (empty($preset)) {
            return;
        }

        $path = \get_template_directory() . '/config/presets/' . $preset . '.php';
        if (\file_exists($path)) {
            $options = include $path;
            if (\is_array($options)) {
                foreach ($options as $key => $value) {
                    \update_option($key, $value);
                }
            }
        }
    }

    protected function setupBundlePages(array $pageSetup): void
    {
        if (empty($pageSetup)) {
            return;
        }

        if (!empty($pageSetup['homepage'])) {
            $page = \get_page_by_path($pageSetup['homepage']);
            if ($page) {
                \update_option('page_on_front', $page->ID);
                \update_option('show_on_front', 'page');
            }
        }

        if (!empty($pageSetup['blog'])) {
            $page = \get_page_by_path($pageSetup['blog']);
            if ($page) {
                \update_option('page_for_posts', $page->ID);
            }
        }

        if (!empty($pageSetup['menu_location'])) {
            $locations = \get_theme_mod('nav_menu_locations', []);
            foreach ($pageSetup['menu_location'] as $location => $menuName) {
                $menu = \wp_get_nav_menu_object($menuName);
                if ($menu) {
                    $locations[$location] = $menu->term_id;
                }
            }
            \set_theme_mod('nav_menu_locations', $locations);
        }
    }

    public function ajaxResetBundle()
    {
        \check_ajax_referer('jankx_membership_bundle', 'nonce');

        $bundle = \sanitize_text_field($_POST['bundle'] ?? '');
        if (empty($bundle)) {
            \wp_send_json_error(['message' => \__('No bundle specified.', 'jankx')]);
            return;
        }

        try {
            \delete_option('jankx_active_bundle');
            \delete_option('jankx_bundle_installed_at');

            $activeDemo = \get_option('jankx_active_demo', '');
            if ($activeDemo) {
                $this->rollbackSeedersForDemo($activeDemo);
                \delete_option('jankx_active_demo');
                \delete_option('jankx_demo_imported_at');
            }
        } catch (\Throwable $e) {
            \wp_send_json_error(['message' => $e->getMessage()]);
            return;
        }

        \wp_send_json_success(['message' => \__('Bundle reset successfully.', 'jankx')]);
    }
}
