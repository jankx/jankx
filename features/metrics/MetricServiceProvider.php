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

        // Add "Post Views" option to Gutenberg query options
        add_filter('jankx/gutenberg/query-options/order-by', [$this, 'addPostViewsOrderByOption']);

        // Filter WP_Query to handle post_views orderby
        add_action('pre_get_posts', [$this, 'handlePostViewsOrderBy'], 10);
    }

    /**
     * Add "Post Views" option to order by dropdown
     *
     * @param array $options Existing order by options
     * @return array Modified options
     */
    public function addPostViewsOrderByOption(array $options): array
    {
        $options[] = [
            'value' => 'post_views',
            'label' => __('Post Views (Lượt xem)', 'jankx'),
        ];

        return $options;
    }

    /**
     * Handle post views orderby in WP_Query
     *
     * @param \WP_Query $query The WP_Query instance
     * @return void
     */
    public function handlePostViewsOrderBy(\WP_Query $query): void
    {
        // Only modify if orderby is post_views
        if ($query->get('orderby') !== 'post_views') {
            return;
        }

        // Set meta query parameters
        $query->set('meta_key', 'post_views_count');
        $query->set('orderby', 'meta_value_num');

        // Default to DESC if order not specified
        if (!$query->get('order')) {
            $query->set('order', 'DESC');
        }
    }
}
