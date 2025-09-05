<?php

namespace App\Providers;

use App\Services\NavigationBlockService;
use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class NavigationBlockServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register Navigation Block service
        $app->singleton('navigation.block.service', function ($app) {
            return new NavigationBlockService($app);
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {
        $navigationService = $app->make('navigation.block.service');

        // Khắc phục vấn đề navigation blocks
        add_action('after_setup_theme', [$navigationService, 'initPatches']);

        // Khắc phục vấn đề plugin conflicts
        add_action('init', [$navigationService, 'handlePluginConflicts'], 5);

        // Khắc phục vấn đề navigation blocks attributes
        add_filter('render_block_core/navigation-link', [$navigationService, 'fixNavigationLinkAttributes'], 10, 2);
        add_filter('render_block_core/navigation-submenu', [$navigationService, 'fixNavigationSubmenuAttributes'], 10, 2);

        // Error handling để bỏ qua warnings về undefined array key
        $navigationService->setupErrorHandling();
    }
}
