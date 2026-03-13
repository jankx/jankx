<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;

/**
 * Service Provider để đăng ký thông tin framework Jankx
 */
class JankxFrameworkServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Đăng ký framework version from Application constant
        $app->singleton('jankx.version', function () {
            return Application::VERSION;
        });

        // Đăng ký framework name
        $app->singleton('jankx.name', function () {
            return 'Jankx';
        });

        // Đăng ký framework description
        $app->singleton('jankx.description', function () {
            return 'Jankx is a powerful WordPress theme framework.';
        });

        // Đăng ký framework environment
        $app->singleton('jankx.environment', function () {
            return (defined('WP_DEBUG') && WP_DEBUG) ? 'development' : 'production';
        });

        // Đăng ký framework paths (calculating once)
        $basePath = $app->basePath();
        $paths = [
            'base' => $basePath,
            'includes' => $basePath . '/includes',
            'app' => $basePath . '/app',
            'resources' => $basePath . '/resources',
            'assets' => $basePath . '/assets',
        ];
        $app->instance('jankx.paths', $paths);

        // Đăng ký framework URLs (calculating once)
        $templateUrl = get_template_directory_uri();
        $urls = [
            'base' => $templateUrl,
            'includes' => $templateUrl . '/includes',
            'app' => $templateUrl . '/app',
            'resources' => $templateUrl . '/resources',
            'assets' => $templateUrl . '/assets',
        ];
        $app->instance('jankx.urls', $urls);

        // Đăng ký Jankx facade as lazy singleton
        $app->singleton('jankx.facade', function () {
            return new \Jankx\Jankx();
        });

        // Đăng ký Framework service as lazy singleton
        $app->singleton('framework', function ($app) {
            return new \Jankx\Services\FrameworkService($app);
        });
    }

    public function boot(Application $app)
    {
        // Không cần boot logic
    }
}
