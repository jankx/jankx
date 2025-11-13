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

        $fontsService = $app->make(FontsService::class);

        // Khởi tạo fonts service
        add_action('init', function () use ($fontsService) {
            $fontsService->init();
        });

        // Đăng ký fonts với Gutenberg thông qua theme.json filter
        add_filter('theme_json_data', function ($themeJson) use ($fontsService) {
            return $fontsService->injectFontsIntoThemeJson($themeJson);
        }, 10, 1);

        // Đăng ký fonts với frontend
        add_action('wp_enqueue_scripts', function () use ($fontsService) {
            $activeFonts = $fontsService->getAllFonts();
            foreach ($activeFonts as $font) {
                $fontsService->enqueueFont($font->toArray());
            }
        });

        // Đăng ký fonts với admin
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

        // Đăng ký fonts với Gutenberg editor (block assets) - chỉ trong admin
        add_action('enqueue_block_assets', function () use ($fontsService) {
            if (is_admin()) {
                $fontsService->enqueueGutenbergFonts();
            }
        }, 5);
    }
}
