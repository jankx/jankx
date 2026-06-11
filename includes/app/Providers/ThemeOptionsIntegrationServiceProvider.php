<?php

namespace App\Providers;

use App\Services\ThemeOptionsCSSGenerator;
use App\Services\ThemeOptionsBridge;
use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

/**
 * Theme Options Integration Service Provider
 *
 * Integrates theme options with:
 * - CSS generation (dynamic CSS variables)
 * - Gutenberg blocks (passing options to JS)
 * - theme.json (syncing palette and layout)
 *
 * @package App\Providers
 */
class ThemeOptionsIntegrationServiceProvider extends ServiceProvider
{
    /**
     * Register services
     *
     * @param Application $app
     * @return void
     */
    public function register(Application $app): void
    {
        // Register CSS Generator
        $app->singleton('theme-options.css-generator', function ($app) {
            return new ThemeOptionsCSSGenerator(
                $app->make('theme-options')
            );
        });

        // Register Theme Options Bridge
        $app->singleton('theme-options.bridge', function ($app) {
            return new ThemeOptionsBridge(
                $app->make('theme-options'),
                $app->make('theme-options.css-generator')
            );
        });

        // Register aliases
        $app->alias('theme-options.css-generator', ThemeOptionsCSSGenerator::class);
        $app->alias('theme-options.bridge', ThemeOptionsBridge::class);
    }

    /**
     * Bootstrap services
     *
     * @param Application $app
     * @return void
     */
    public function boot(Application $app): void
    {
        // Wait for translations to be loaded (priority 5) but run before ThemeOptions (priority 10)
        add_action('after_setup_theme', function () use ($app) {
            $this->bootServices($app);
        }, 8);

        // Clear cache when theme options are updated
        add_action('jankx/options/updated', function () use ($app) {
            if ($app->bound('theme-options.bridge')) {
                $bridge = $app->make('theme-options.bridge');
                $bridge->clearCache();
            }
        });
    }

    /**
     * Boot individual services
     *
     * @param Application $app
     * @return void
     */
    protected function bootServices(Application $app): void
    {
        // Only initialize if theme options service is available
        if (!$app->bound('theme-options')) {
            return;
        }

        // Initialize CSS Generator
        if ($app->bound('theme-options.css-generator')) {
            $cssGenerator = $app->make('theme-options.css-generator');
            $cssGenerator->init();
        }

        // Initialize Bridge
        if ($app->bound('theme-options.bridge')) {
            $bridge = $app->make('theme-options.bridge');
            $bridge->init();
        }

        // Add admin bar menu
        $this->addAdminBarMenu();

        // Log integration status
        do_action('jankx/theme-options-integration/initialized');
    }

    /**
     * Add Jankx admin bar menu
     *
     * @return void
     */
    protected function addAdminBarMenu(): void
    {
        add_action('admin_bar_menu', function (\WP_Admin_Bar $wp_admin_bar) {
            if (!current_user_can('manage_options')) {
                return;
            }

            $optionsUrl = admin_url('admin.php?page=jankx-theme-options');

            // Top-level Jankx menu
            $wp_admin_bar->add_node([
                'id'    => 'jankx',
                'title' => '<span class="ab-icon dashicons-admin-generic"></span> Jankx',
                'href'  => $optionsUrl,
                'meta'  => ['class' => 'jankx-admin-bar'],
            ]);

            // Theme Options child
            $wp_admin_bar->add_node([
                'parent' => 'jankx',
                'id'     => 'jankx-theme-options',
                'title'  => __('Theme Options', 'jankx'),
                'href'   => $optionsUrl,
            ]);

            // Extensions
            $wp_admin_bar->add_node([
                'parent' => 'jankx',
                'id'     => 'jankx-extensions',
                'title'  => __('Extensions', 'jankx'),
                'href'   => admin_url('admin.php?page=jankx-extensions'),
            ]);

            // Marketplace
            $wp_admin_bar->add_node([
                'parent' => 'jankx',
                'id'     => 'jankx-marketplace',
                'title'  => __('Marketplace', 'jankx'),
                'href'   => admin_url('admin.php?page=jankx-marketplace'),
            ]);

            // Utilities
            $wp_admin_bar->add_node([
                'parent' => 'jankx',
                'id'     => 'jankx-utilities',
                'title'  => __('Utilities', 'jankx'),
                'href'   => admin_url('admin.php?page=jankx-utilities'),
            ]);
        }, 90);
    }
}
