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
        // Đăng ký framework version
        $app->singleton('jankx.version', function ($app) {
            $composerFile = dirname(dirname(dirname(dirname(__DIR__)))) . '/composer.json';
            if (file_exists($composerFile)) {
                $composerData = json_decode(file_get_contents($composerFile), true);
                if (isset($composerData['version'])) {
                    return $composerData['version'];
                }
            }
            return '2.0.0';
        });

        // Đăng ký framework name
        $app->singleton('jankx.name', function ($app) {
            return 'Jankx';
        });

        // Đăng ký framework description
        $app->singleton('jankx.description', function ($app) {
            return 'Jankx is a powerful WordPress theme framework. High performance, compatible, easy to use and develop';
        });

        // Đăng ký framework environment
        $app->singleton('jankx.environment', function ($app) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                return 'development';
            }
            return 'production';
        });

        // Đăng ký framework paths
        $app->singleton('jankx.paths', function ($app) {
            $basePath = dirname(dirname(dirname(dirname(__DIR__))));
            return [
                'base' => $basePath,
                'includes' => $basePath . '/includes',
                'app' => $basePath . '/app',
                'resources' => $basePath . '/resources',
                'assets' => $basePath . '/assets',
            ];
        });

        // Đăng ký framework URLs
        $app->singleton('jankx.urls', function ($app) {
            $templateUrl = get_template_directory_uri();
            return [
                'base' => $templateUrl,
                'includes' => $templateUrl . '/includes',
                'app' => $templateUrl . '/app',
                'resources' => $templateUrl . '/resources',
                'assets' => $templateUrl . '/assets',
            ];
        });

        // Đăng ký Jankx facade
        $app->singleton('jankx.facade', function ($app) {
            return new \Jankx\Jankx();
        });

        // Đăng ký Framework service
        $app->singleton('framework', function ($app) {
            return new \Jankx\Services\FrameworkService($app);
        });
    }

    public function boot(Application $app)
    {
        // Không cần boot logic
    }
}
