<?php

namespace App\Providers;

use Jankx\Facades\Log;
use Jankx\Foundation\Application;
use App\Services\LanguageSwitcherService;

class LanguageSwitcherServiceProvider extends \Jankx\Support\Providers\ServiceProvider
{
    /**
     * Register the service provider.
     */
    public function register(Application $app)
    {
        // Đăng ký LanguageSwitcherService
        $app->singleton('language-switcher', function ($app) {
            return new LanguageSwitcherService($app);
        });

        // Đăng ký alias cho service
        $app->alias('language-switcher', LanguageSwitcherService::class);
    }

    /**
     * Bootstrap the application events.
     */
    public function boot(Application $app)
    {

        // Kiểm tra Polylang plugin có được kích hoạt không
        if (!function_exists('pll_current_language')) {
            Log::warning('LanguageSwitcherServiceProvider: Polylang plugin not active');
            return;
        }

        // Đăng ký init hook để khởi tạo language switcher
        add_action('init', function () use ($app) {

            try {
                $languageSwitcher = $app->get('language-switcher');

                $languageSwitcher->init();
            } catch (\Exception $e) {
                Log::error('Language Switcher Error: ' . $e->getMessage());
            }
        }, 10);

        // Đăng ký block
        add_action('init', function () use ($app) {
            try {
                $languageSwitcher = $app->get('language-switcher');
                $languageSwitcher->registerBlock();
            } catch (\Exception $e) {
                Log::error('Language Switcher Block Error: ' . $e->getMessage());
            }
        }, 20);

        // Đăng ký REST API endpoints
        add_action('rest_api_init', function () use ($app) {
            try {
                $languageSwitcher = $app->get('language-switcher');
                $languageSwitcher->registerRestRoutes();
            } catch (\Exception $e) {
                Log::error('Language Switcher REST Error: ' . $e->getMessage());
            }
        });
    }
}
