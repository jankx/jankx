<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Services\FontsService;

class FontsServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Đăng ký FontsService
        $app->singleton(FontsService::class, function ($app) {
            return new FontsService();
        });
    }

    public function boot(Application $app)
    {
        $context = $this->getLoadingContext();

        // Skip for background/non-ui requests
        if (in_array($context, ['cli', 'cron', 'rest'])) {
            return;
        }

        $fontsService = $app->make(FontsService::class);

        // Khởi tạo fonts service
        add_action('init', function () use ($fontsService) {
            $fontsService->init();
        });

        // Đăng ký fonts với Gutenberg thông qua theme.json filter
        add_filter('theme_json_data', function ($themeJson) use ($fontsService) {
            return $fontsService->injectFontsIntoThemeJson($themeJson);
        }, 10, 1);

        // Register default parent theme fonts
        add_action('jankx/fonts/register', function ($service) {
            $service->registerFont([
                'id' => 'inter',
                'name' => 'Inter',
                'family' => '"Inter", sans-serif',
                'category' => 'google',
                'variants' => ['400', '500', '600', '700', '800'],
            ]);
            $service->registerFont([
                'id' => 'montserrat',
                'name' => 'Montserrat',
                'family' => '"Montserrat", sans-serif',
                'category' => 'google',
                'variants' => ['700', '800'],
            ]);
        });

        // Frontend specific
        if ($context === 'frontend') {
            add_action('wp_enqueue_scripts', function () use ($fontsService) {
                $activeFonts = $fontsService->getAllFonts();
                foreach ($activeFonts as $font) {
                    $fontsService->enqueueFont($font->toArray());
                }
            });
        }

        // Admin specific
        if ($context === 'admin') {
            add_action('admin_enqueue_scripts', function () use ($fontsService) {
                $activeFonts = $fontsService->getAllFonts();
                foreach ($activeFonts as $font) {
                    $fontsService->enqueueFont($font->toArray());
                }
            });

            // Đăng ký fonts với Gutenberg editor
            add_action('enqueue_block_editor_assets', function () use ($fontsService) {
                $fontsService->enqueueGutenbergFonts();
            }, 5);

            add_action('enqueue_block_assets', function () use ($fontsService) {
                $fontsService->enqueueGutenbergFonts();
            }, 5);
        }
    }
}
