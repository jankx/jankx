<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use App\Services\ExampleService;
use App\Services\CacheService;
use Jankx\Managers\DeferredServiceManager;

class DeferredServiceProvider extends ServiceProvider
{
    /**
     * Đăng ký các services
     *
     * @param Application $app
     * @return void
     */
    public function register(Application $app)
    {
        // Đăng ký DeferredServiceManager
        $app->singleton(DeferredServiceManager::class, function ($app) {
            return new DeferredServiceManager($app);
        });

        // Đăng ký DeferredServiceManager với alias
        $app->singleton('deferred.services', function ($app) {
            return $app->make(DeferredServiceManager::class);
        });

        // Register deferred services
        $deferredServiceProvider = &$this;
        add_action('after_setup_theme', function() use($deferredServiceProvider, $app) {
            $deferredServiceProvider->registerDeferredServices($app);
        });
    }

    /**
     * Boot các services
     *
     * @param Application $app
     * @return void
     */
    public function boot(Application $app)
    {
        // Khởi tạo các services khi cần
        $this->initializeServices($app);
    }

    /**
     * Đăng ký các deferred services
     *
     * @param Application $app
     * @return void
     */
    protected function registerDeferredServices(Application $app)
    {
        $deferredManager = $app->make(DeferredServiceManager::class);

        // Đăng ký ExampleService
        $deferredManager->register('example', function () use ($app) {
            return new ExampleService($app);
        });

        // Đăng ký CacheService
        $deferredManager->register('cache', function () use ($app) {
            return new CacheService($app);
        });

        // Đăng ký CacheService với dependency vào ExampleService
        $deferredManager->register('cache_with_example', function ($exampleService) use ($app) {
            $cacheService = new CacheService($app);

            // Có thể sử dụng example service trong cache service
            if ($exampleService instanceof ExampleService) {
                $cacheService->set('example_data', $exampleService->getData());
            }

            return $cacheService;
        }, ['example']);

        // Đăng ký service với callback phức tạp
        $deferredManager->register('advanced_example', function () use ($app) {
            return new class($app) extends ExampleService {
                protected $name = 'advanced_example';

                protected function boot(): void
                {
                    parent::boot();

                    // Thêm logic nâng cao
                    $this->setData('advanced', true);
                    $this->setData('features', ['deferred', 'lazy_loading', 'optimized']);
                }
            };
        });
    }

    /**
     * Khởi tạo các services khi cần
     *
     * @param Application $app
     * @return void
     */
    protected function initializeServices(Application $app)
    {
        $deferredManager = $app->make(DeferredServiceManager::class);
        // Hook để khởi tạo tất cả services khi shutdown (debug)
        if (defined('WP_DEBUG') && WP_DEBUG) {
            add_action('shutdown', function () use ($deferredManager) {
                // Log thống kê services
                error_log('Deferred Services Stats:');
                error_log('- Registered: ' . implode(', ', $deferredManager->getRegisteredServices()));
                error_log('- Resolved: ' . implode(', ', $deferredManager->getResolvedServices()));
            });
        }
    }

    /**
     * Helper function để kiểm tra frontend
     *
     * @return bool
     */
    protected function is_frontend(): bool
    {
        return !is_admin() && !wp_doing_ajax() && !wp_doing_cron();
    }
}