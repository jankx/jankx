<?php

namespace Jankx\Support\Providers;

use Jankx\Support\Providers\ServiceProvider;
use Jankx\Foundation\Application;
use Jankx\Facades\Config;
use Jankx\Services\FontIcons\IconRepository;
use Jankx\Services\FontIcons\IconTypeManager;
use Jankx\Services\FontIcons\IconRenderer;
use Jankx\Services\FontIcons\IconTransformerService;
use Jankx\Services\FontIcons\IconTypes\FontAwesomeProvider;
use Jankx\Services\FontIcons\IconTypes\MaterialIconsProvider;
use Jankx\Services\FontIcons\IconTypes\CustomIconsProvider;
use Jankx\Services\FontIcons\IconTypes\SvgIconsProvider;

class FontIconsServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register core services
        $app->singleton('font-icons.repository', function($app) {
            return new IconRepository($app, Config::get('font-icons'));
        });

        $app->singleton('font-icons.manager', function($app) {
            return new IconTypeManager(Config::get('font-icons'));
        });

        $app->singleton('font-icons.renderer', function($app) {
            return new IconRenderer();
        });

        $app->singleton('font-icons.transformer', function($app) {
            return new IconTransformerService($app);
        });

        // Register icon type providers (FontAwesome không được register mặc định)
        $app->singleton('font-icons.material', function($app) {
            return new MaterialIconsProvider(Config::get('font-icons.icon_types.material', []));
        });

        $app->singleton('font-icons.custom', function($app) {
            return new CustomIconsProvider(Config::get('font-icons.icon_types.custom', []));
        });

        $app->singleton('font-icons.svg', function($app) {
            return new SvgIconsProvider(Config::get('font-icons.icon_types.svg', []));
        });

        // FontAwesome chỉ được register khi cần thiết
        $app->singleton('font-icons.fontawesome', function($app) {
            return new FontAwesomeProvider(Config::get('font-icons.icon_types.fontawesome', []));
        });
    }

    public function boot(Application $app)
    {
        // Register admin menu
        add_action('admin_menu', [$this, 'registerAdminMenu']);

        // Register Gutenberg integration
        add_action('enqueue_block_editor_assets', [$this, 'enqueueGutenbergAssets']);

        // Auto-load active icon types (không bao gồm FontAwesome mặc định)
        add_action('wp_enqueue_scripts', [$this, 'autoLoadActiveIcons']);
        add_action('admin_enqueue_scripts', [$this, 'autoLoadActiveIcons']);

        // Không schedule auto-update cho FontAwesome mặc định
        add_action('init', [$this, 'scheduleAutoUpdate']);
        add_action('jankx_icons_auto_update', [$this, 'autoUpdateIcons']);
    }

    public function registerAdminMenu()
    {
        add_submenu_page(
            'jankx-settings', // Parent slug
            'Icons Repository', // Page title
            'Icons Repository', // Menu title
            'manage_options', // Capability
            'jankx-icons', // Menu slug
            [$this, 'renderAdminPage'] // Callback
        );
    }

    public function autoLoadActiveIcons()
    {
        $app = app();
        $activeTypes = $app->make('font-icons.manager')->getActiveTypes();

        foreach ($activeTypes as $type) {
            // Không auto-load FontAwesome
            if ($type === 'fontawesome') {
                continue;
            }

            try {
                $provider = $app->make("font-icons.{$type}");
                $provider->enqueue();
            } catch (\Exception $e) {
                // Log error but don't break
                error_log("Failed to load icon provider {$type}: " . $e->getMessage());
            }
        }
    }

    public function enqueueGutenbergAssets()
    {
        $app = app();

        wp_enqueue_script(
            'jankx-gutenberg-icons',
            $app->make('jankx.urls')['base'] . '/assets/js/gutenberg-icons.js',
            ['wp-blocks', 'wp-element', 'wp-components'],
            $app->make('jankx.version'),
            true
        );

        // Localize script with icon data
        $iconData = $app->make('font-icons.repository')->getIconTypes();
        wp_localize_script('jankx-gutenberg-icons', 'jankxIcons', [
            'types' => $iconData,
            'apiUrl' => rest_url('jankx/v1/icons/')
        ]);
    }

    public function scheduleAutoUpdate()
    {
        if (!wp_next_scheduled('jankx_icons_auto_update')) {
            wp_schedule_event(time(), 'weekly', 'jankx_icons_auto_update');
        }
    }

    public function autoUpdateIcons()
    {
        $app = app();
        $transformer = $app->make('font-icons.transformer');

        // Chỉ update các icon types mặc định, không bao gồm FontAwesome
        $iconTypes = Config::get('font-icons.auto_update.types', ['material', 'custom']);

        foreach ($iconTypes as $type) {
            $typeConfig = Config::get("font-icons.icon_types.{$type}", []);
            if (isset($typeConfig['cdn_url'])) {
                try {
                    $cssUrl = $typeConfig['cdn_url'];
                    $outputPath = $app->make('jankx.paths')['base'] . "/resources/icons/{$type}/icons.json";

                    $transformer->transformAndSave($cssUrl, $type, $outputPath);
                } catch (\Exception $e) {
                    error_log("Failed to auto-update icons for {$type}: " . $e->getMessage());
                }
            }
        }
    }

    public function renderAdminPage()
    {
        $app = app();
        $activeTab = $_GET['tab'] ?? 'icon-sets';
        $iconTypes = $app->make('font-icons.repository')->getIconTypes();

        $templatePath = $app->make('jankx.paths')['base'] . '/templates/admin/icons-repository.php';

        if (file_exists($templatePath)) {
            include $templatePath;
        } else {
            echo '<div class="wrap"><h1>Icons Repository</h1><p>Template file not found.</p></div>';
        }
    }
}
