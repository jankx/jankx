<?php

namespace App\Providers;

use Jankx\Facades\Log;
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
        Log::debug('ThemeOptionsServiceProvider: Boot method called');
        Log::debug('ThemeOptionsServiceProvider: Registering init hook');

        // Đăng ký init hook để khởi tạo theme options
        add_action('init', function () use ($app) {
            Log::debug('ThemeOptionsServiceProvider: init hook triggered');

            try {
                $themeOptions = $app->get('theme-options');
                Log::debug('ThemeOptionsServiceProvider: ThemeOptionsService retrieved');

                $themeOptions->init();
                Log::debug('ThemeOptionsServiceProvider: ThemeOptionsService initialized');
            } catch (\Exception $e) {
                error_log('Theme Options Error: ' . $e->getMessage());
            }
        }, 10);

        // Đăng ký admin menu với try-catch để tránh lỗi
        add_action('admin_menu', function () use ($app) {
            Log::debug('ThemeOptionsServiceProvider: admin_menu hook triggered');

            try {
                $themeOptions = $app->get('theme-options');
                $themeOptions->registerAdminMenu();
                Log::debug('ThemeOptionsServiceProvider: Admin menu registered');
            } catch (\Exception $e) {
                Log::error('Theme Options Error: ' . $e->getMessage());
            }
        }, 10);

        Log::debug('ThemeOptionsServiceProvider: hooks registered');
    }
}
