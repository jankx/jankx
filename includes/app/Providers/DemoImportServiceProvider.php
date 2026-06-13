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
}
