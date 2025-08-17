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

                if (WP_DEBUG) {
                    Log::info('Language Switcher initialized successfully');
                }
            } catch (\Exception $e) {
                Log::error('Language Switcher Error: ' . $e->getMessage());
            }
        }, 20); // Tăng priority để đảm bảo Polylang đã được load

        // Thêm hook để khởi tạo lại sau khi plugins được load
        add_action('plugins_loaded', function () use ($app) {
            try {
                $languageSwitcher = $app->get('language-switcher');

                // Khởi tạo lại nếu chưa có dữ liệu
                if (empty($languageSwitcher->getLanguages())) {
                    $languageSwitcher->init();

                    if (WP_DEBUG) {
                        Log::info('Language Switcher re-initialized after plugins loaded');
                    }
                }
            } catch (\Exception $e) {
                Log::error('Language Switcher Re-init Error: ' . $e->getMessage());
            }
        }, 20);

        // Block registration is now handled by LanguageSwitcherBlock class
        // No need to register here to avoid duplicate registration

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
