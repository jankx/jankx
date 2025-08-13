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

        // Đăng ký init hook để khởi tạo theme options
        add_action('init', function () use ($app) {

            try {
                $themeOptions = $app->get('theme-options');

                $themeOptions->init();
            } catch (\Exception $e) {
            }
        }, 10);

        // Đăng ký admin menu với try-catch để tránh lỗi
        add_action('admin_menu', function () use ($app) {

            try {
                $themeOptions = $app->get('theme-options');
                $themeOptions->registerAdminMenu();
            } catch (\Exception $e) {
                Log::error('Theme Options Error: ' . $e->getMessage());
            }
        }, 10);
    }
}
