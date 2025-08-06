<?php

namespace App\Providers;

use Jankx\Foundation\Application;
use App\Services\ThemeOptionsService;

class ThemeOptionsServiceProvider extends \Jankx\Support\Providers\ServiceProvider
{
    /**
     * Register the service provider.
     */
    public function register(Application $app)
    {
        // Đăng ký ThemeOptionsService
        $app->singleton('theme-options', function ($app) {
            return new ThemeOptionsService($app);
        });

        // Đăng ký alias cho service
        $app->alias('theme-options', ThemeOptionsService::class);
    }

    /**
     * Bootstrap the application events.
     */
    public function boot(Application $app)
    {
        error_log('[JANKX DEBUG] ThemeOptionsServiceProvider: Boot method called');

                error_log('[JANKX DEBUG] ThemeOptionsServiceProvider: Registering init hook');

        // Đăng ký init hook để khởi tạo theme options
        add_action('init', function () use ($app) {
            error_log('[JANKX DEBUG] ThemeOptionsServiceProvider: init hook triggered');

            try {
                $themeOptions = $app->get('theme-options');
                error_log('[JANKX DEBUG] ThemeOptionsServiceProvider: ThemeOptionsService retrieved');

                $themeOptions->init();
                error_log('[JANKX DEBUG] ThemeOptionsServiceProvider: ThemeOptionsService initialized');
            } catch (\Exception $e) {
                error_log('Theme Options Error: ' . $e->getMessage());
            }
        }, 10);

        // Đăng ký admin menu với try-catch để tránh lỗi
        add_action('admin_menu', function () use ($app) {
            error_log('[JANKX DEBUG] ThemeOptionsServiceProvider: admin_menu hook triggered');

            try {
                $themeOptions = $app->get('theme-options');
                $themeOptions->registerAdminMenu();
                error_log('[JANKX DEBUG] ThemeOptionsServiceProvider: Admin menu registered');
            } catch (\Exception $e) {
                error_log('Theme Options Error: ' . $e->getMessage());
            }
        }, 10);

        error_log('[JANKX DEBUG] ThemeOptionsServiceProvider: hooks registered');

        // Debug: Kiểm tra xem service có được load không
        add_action('admin_notices', function () use ($app) {
            if (current_user_can('manage_options')) {
                try {
                    $themeOptions = $app->get('theme-options');
                    $adapter = $themeOptions->getAdapter();
                    $frameworkMode = $themeOptions->getCurrentFrameworkMode();

                    echo '<div class="notice notice-info">';
                    echo '<p><strong>Theme Options Debug:</strong></p>';
                    echo '<p>Framework Mode: ' . $frameworkMode . '</p>';
                    echo '<p>Adapter: ' . ($adapter ? get_class($adapter) : 'Not loaded') . '</p>';
                    echo '<p>Options Data: ' . (empty($themeOptions->getOptionsData()) ? 'Empty' : 'Loaded') . '</p>';
                    echo '<p>Service Provider: ' . get_class($this) . '</p>';
                    echo '</div>';
                } catch (\Exception $e) {
                    echo '<div class="notice notice-error">';
                    echo '<p><strong>Theme Options Error:</strong> ' . $e->getMessage() . '</p>';
                    echo '</div>';
                }
            }
        });
    }
}
