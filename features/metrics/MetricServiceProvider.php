<?php

namespace Jankx\Features\Metrics;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;
use Jankx\Features\Metrics\Services\PostViewService;

class MetricServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        $app->singleton(PostViewService::class, function ($app) {
            return new PostViewService();
        });
    }

    public function boot(Application $app)
    {
        $postViewService = $app->make(PostViewService::class);

        // Initialize AJAX handlers
        $postViewService->initAjax();

        // Initialize frontend functionality
        $postViewService->initFrontend();

        // Track post views on single post pages (fallback for non-JS users)
        add_action('wp_head', function () use ($postViewService) {
            if (is_single() && !is_admin()) {
                $postViewService->trackPostView();
            }
        });

        // Make service available globally
        add_action('init', function () use ($postViewService) {
            $GLOBALS['jankx_post_view_service'] = $postViewService;
        });
    }
}
