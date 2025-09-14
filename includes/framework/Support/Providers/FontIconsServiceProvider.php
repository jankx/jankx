<?php

namespace Jankx\Support\Providers;

use Jankx\Support\Providers\ServiceProvider;
use Jankx\Foundation\Application;
use Jankx\Facades\Config;
use Jankx\Services\FontIcons\IconRepository;
use Jankx\Services\FontIcons\IconRenderer;
use Jankx\Services\FontIcons\IconTransformerService;
use Jankx\Facades\FontIcons;

class FontIconsServiceProvider extends ServiceProvider
{
    protected $app;

    public function register(Application $app)
    {
        $this->app = $app;

        // Register core services
        $app->singleton('font-icons.repository', function ($app) {
            return new IconRepository($app);
        });


        $app->singleton('font-icons.renderer', function ($app) {
            return new IconRenderer();
        });

        $app->singleton('font-icons.transformer', function ($app) {
            return new IconTransformerService($app);
        });
    }

    public function boot(Application $app)
    {
        // Register default icons
        add_action('init', [$this, 'registerDefaultIcons'], 5);

        // Action hook để register thêm icons
        add_action('jankx_register_font_icons', [$this, 'registerAdditionalIcons']);

        // Auto-load active icon types
        add_action('wp_enqueue_scripts', [$this, 'autoLoadActiveIcons']);
        add_action('admin_enqueue_scripts', [$this, 'autoLoadActiveIcons']);

        // Schedule auto-update
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

    /**
     * Register default icons (FontAwesome và Material Icons)
     */
    public function registerDefaultIcons()
    {
        // Register FontAwesome (không auto-load)
        if (!FontIcons::has('fontawesome')) {
            FontIcons::fontAwesome('6.5.1', false);
        }

        // Register Material Icons (auto-load)
        if (!FontIcons::has('material')) {
            FontIcons::materialIcons(true);
        }
    }

    /**
     * Register additional icons từ action hook
     */
    public function registerAdditionalIcons()
    {
        // Có thể được extend bởi themes/plugins
        do_action('jankx_register_additional_font_icons');
    }

    public function autoLoadActiveIcons()
    {
        $autoLoadTypes = $this->app->make('font-icons.repository')->getAutoLoadTypes();

        foreach ($autoLoadTypes as $type => $config) {
            $cssUrl = $config['css_url'] ?? '';
            if ($cssUrl) {
                $this->enqueueIconCss($cssUrl, $type);
            }
        }
    }

    /**
     * Enqueue icon CSS
     */
    protected function enqueueIconCss($cssUrl, $type)
    {
        $sanitizedType = sanitize_title($type);
        
        add_action('wp_head', function() use ($cssUrl, $sanitizedType) {
            echo "<link rel=\"stylesheet\" id=\"jankx-icon-{$sanitizedType}-css\" href=\"{$cssUrl}\" media=\"all\" />\n";
        });
        
        add_action('admin_head', function() use ($cssUrl, $sanitizedType) {
            echo "<link rel=\"stylesheet\" id=\"jankx-icon-{$sanitizedType}-css\" href=\"{$cssUrl}\" media=\"all\" />\n";
        });
    }


    public function scheduleAutoUpdate()
    {
        if (!wp_next_scheduled('jankx_icons_auto_update')) {
            wp_schedule_event(time(), 'weekly', 'jankx_icons_auto_update');
        }
    }

    public function autoUpdateIcons()
    {
        $repository = $this->app->make('font-icons.repository');
        $autoLoadTypes = $repository->getAutoLoadTypes();

        foreach ($autoLoadTypes as $type => $config) {
            $cssUrl = $config['css_url'] ?? '';
            if ($cssUrl) {
                try {
                    // Re-import để update cache
                    $repository->importFromCssUrl($cssUrl, $type, $config['display_name'], $config['auto_load']);
                } catch (\Exception $e) {
                    // Log error but don't break
                }
            }
        }
    }

    public function renderAdminPage()
    {
        $activeTab = $_GET['tab'] ?? 'icon-sets';
        $iconTypes = $this->app->make('font-icons.repository')->getIconTypes();

        echo '<div class="wrap">';
        echo '<h1>Font Icons Repository</h1>';
        echo '<p>Manage your font icons collection.</p>';
        
        if (!empty($iconTypes)) {
            echo '<h2>Registered Icon Types:</h2>';
            echo '<ul>';
            foreach ($iconTypes as $type => $data) {
                $config = $data['config'] ?? [];
                echo '<li>';
                echo '<strong>' . ($config['display_name'] ?? $type) . '</strong> ';
                echo '(' . count($data['icons'] ?? []) . ' icons) ';
                echo $config['auto_load'] ? '[Auto-load]' : '[Manual]';
                echo '</li>';
            }
            echo '</ul>';
        } else {
            echo '<p>No icon types registered yet.</p>';
        }
        
        echo '</div>';
    }
}
