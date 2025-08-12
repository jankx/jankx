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
        add_action('init', [$fontsService, 'init']);

        // Đăng ký fonts với Gutenberg thông qua theme.json filter
        add_filter('theme_json_data', [$fontsService, 'injectFontsIntoThemeJson'], 10, 1);

        // Không cần enqueue JavaScript nữa - fonts sẽ được inject qua theme.json filter

        // Đăng ký fonts với frontend
        add_action('wp_enqueue_scripts', [$fontsService, 'enqueueFrontendFonts']);

        // Đăng ký fonts với admin
        add_action('admin_enqueue_scripts', [$fontsService, 'enqueueAdminFonts']);

        // Đăng ký fonts với Gutenberg editor (thêm hook này để đảm bảo fonts được load)
        add_action('enqueue_block_editor_assets', [$fontsService, 'enqueueAdminFonts']);

        // Đăng ký REST API endpoints
        add_action('rest_api_init', [$fontsService, 'registerRestEndpoints']);

        // Admin menu được quản lý bởi JankxAdminPagesServiceProvider
        // add_action('admin_menu', [$fontsService, 'addAdminMenu']);

        // Đăng ký AJAX handlers
        add_action('wp_ajax_jankx_register_font', [$fontsService, 'handleAjaxRegisterFont']);
        add_action('wp_ajax_jankx_delete_font', [$fontsService, 'handleAjaxDeleteFont']);
        add_action('wp_ajax_jankx_update_font', [$fontsService, 'handleAjaxUpdateFont']);
    }
}
