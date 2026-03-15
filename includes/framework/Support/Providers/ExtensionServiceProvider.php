<?php

namespace Jankx\Support\Providers;

use Jankx\Services\ExtensionService;
use Jankx\Extensions\ExtensionManager;
use Jankx\Extensions\ThemeExtensionManager;
use Jankx\Extensions\MarketplaceManager;
use Jankx\Extensions\ExtensionManifest;
use Jankx\Extensions\AbstractExtension;
use Jankx\Facades\Log;

class ExtensionServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function register(\Jankx\Foundation\Application $app)
    {
        // Register extension system services
        $this->registerExtensionServices();
    }

    /**
     * Bootstrap any application services.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function boot(\Jankx\Foundation\Application $app)
    {
        // Boot Theme Extension Manager (active theme's extensions/ dir)
        $this->app->make('theme_extension.manager');

        // Register AJAX handlers for the marketplace (lazy - marketplace boots on demand)
        add_action('wp_ajax_jankx_install_extension', [$this, 'ajaxInstallExtension']);
        add_action('wp_ajax_jankx_check_theme_update', [$this, 'ajaxCheckThemeUpdate']);
    }

    /**
     * AJAX: Install an extension from Hub
     */
    public function ajaxInstallExtension()
    {
        check_ajax_referer('jankx_marketplace_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => __('Unauthorized.', 'jankx')], 403);
        }

        $slug = sanitize_key($_POST['slug'] ?? '');
        if (empty($slug)) {
            wp_send_json_error(['message' => __('Extension slug is required.', 'jankx')]);
        }

        /** @var MarketplaceManager $marketplace */
        $marketplace = $this->app->make('extension.marketplace');
        $result = $marketplace->installExtension($slug);

        if (is_wp_error($result)) {
            wp_send_json_error(['message' => $result->get_error_message()]);
        }

        wp_send_json_success(['message' => sprintf(__('Extension "%s" installed successfully.', 'jankx'), $slug)]);
    }

    /**
     * AJAX: Check for Jankx theme core update
     */
    public function ajaxCheckThemeUpdate()
    {
        check_ajax_referer('jankx_marketplace_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => __('Unauthorized.', 'jankx')], 403);
        }

        /** @var MarketplaceManager $marketplace */
        $marketplace = $this->app->make('extension.marketplace');
        $update = $marketplace->checkThemeCoreUpdate();

        if ($update) {
            wp_send_json_success(['has_update' => true, 'data' => $update]);
        } else {
            wp_send_json_success(['has_update' => false]);
        }
    }



    /**
     * Register extension system services
     */
    protected function registerExtensionServices()
    {
        // Register Extension Manager as singleton
        $this->app->singleton('extension.manager', function ($app) {
            return ExtensionManager::getInstance();
        });

        // Register Theme Extension Manager
        $this->app->singleton('theme_extension.manager', function ($app) {
            return ThemeExtensionManager::getInstance();
        });

        // Register Marketplace Manager
        $this->app->singleton('extension.marketplace', function ($app) {
            return new MarketplaceManager();
        });



        // Register Extension Service
        $this->app->singleton('extension.service', function ($app) {
            return new ExtensionService();
        });



        $this->app->singleton('jankx_extension_service', function ($app) {
            return $app->make('extension.service');
        });
    }

    /**
     * Get the active theme flag
     */
    protected function isChildThemeActive(): bool
    {
        return is_child_theme();
    }
}
