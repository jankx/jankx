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
        add_action('init', function() use ($fontsService) {
            $fontsService->init();
        });

        // Đăng ký fonts với Gutenberg thông qua theme.json filter
        add_filter('theme_json_data', function($themeJson) use ($fontsService) {
            return $fontsService->injectFontsIntoThemeJson($themeJson);
        }, 10, 1);

        // Đăng ký fonts với frontend
        add_action('wp_enqueue_scripts', function() use ($fontsService) {
            $fontsService->enqueueFrontendFonts();
        });

        // Đăng ký fonts với admin
        add_action('admin_enqueue_scripts', function() use ($fontsService) {
            $fontsService->enqueueAdminFonts();
        });

        // Đăng ký fonts với Gutenberg editor
        add_action('enqueue_block_editor_assets', function() use ($fontsService) {
            $fontsService->enqueueGutenbergFonts();
        }, 5);

        // Đăng ký fonts với Gutenberg editor (block assets) - chỉ trong admin
        add_action('enqueue_block_assets', function() use ($fontsService) {
            if (is_admin()) {
                $fontsService->enqueueGutenbergFonts();
            }
        }, 5);

        // Đăng ký fonts với Gutenberg editor (priority cao hơn)
        add_action('admin_enqueue_scripts', function() use ($fontsService) {
            global $pagenow;
            if ($pagenow === 'post.php' || $pagenow === 'post-new.php') {
                $fontsService->enqueueAdminFonts();
            }
        }, 5);

        // Đăng ký REST API endpoints
        add_action('rest_api_init', function() use ($fontsService) {
            $fontsService->registerRestEndpoints();
        });

        // Đăng ký AJAX handlers
        add_action('wp_ajax_jankx_register_font', [$fontsService, 'handleAjaxRegisterFont']);
        add_action('wp_ajax_jankx_delete_font', [$fontsService, 'handleAjaxDeleteFont']);
        add_action('wp_ajax_jankx_update_font', [$fontsService, 'handleAjaxUpdateFont']);

    }
}
