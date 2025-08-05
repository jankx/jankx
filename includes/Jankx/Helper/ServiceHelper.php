<?php

namespace App\Helpers;

use App\Managers\DeferredServiceManager;
use Jankx\Foundation\Application;

class ServiceHelper
{
    /**
     * @var Application
     */
    protected static $app;

    /**
     * @var DeferredServiceManager
     */
    protected static $deferredManager;

    /**
     * Khởi tạo helper
     *
     * @param Application $app
     * @return void
     */
    public static function init(Application $app)
    {
        self::$app = $app;
        self::$deferredManager = $app->make(DeferredServiceManager::class);
    }

    /**
     * Lấy service từ deferred manager
     *
     * @param string $serviceName
     * @return mixed
     */
    public static function service(string $serviceName)
    {
        if (!self::$deferredManager) {
            throw new \Exception('ServiceHelper chưa được khởi tạo. Gọi ServiceHelper::init() trước.');
        }

        return self::$deferredManager->get($serviceName);
    }

    /**
     * Kiểm tra service đã được đăng ký chưa
     *
     * @param string $serviceName
     * @return bool
     */
    public static function hasService(string $serviceName): bool
    {
        if (!self::$deferredManager) {
            return false;
        }

        return self::$deferredManager->isRegistered($serviceName);
    }

    /**
     * Kiểm tra service đã được resolve chưa
     *
     * @param string $serviceName
     * @return bool
     */
    public static function isResolved(string $serviceName): bool
    {
        if (!self::$deferredManager) {
            return false;
        }

        return self::$deferredManager->isResolved($serviceName);
    }

    /**
     * Lấy tất cả services đã đăng ký
     *
     * @return array
     */
    public static function getRegisteredServices(): array
    {
        if (!self::$deferredManager) {
            return [];
        }

        return self::$deferredManager->getRegisteredServices();
    }

    /**
     * Lấy tất cả services đã được resolve
     *
     * @return array
     */
    public static function getResolvedServices(): array
    {
        if (!self::$deferredManager) {
            return [];
        }

        return self::$deferredManager->getResolvedServices();
    }

    /**
     * Resolve tất cả services
     *
     * @return void
     */
    public static function resolveAll(): void
    {
        if (self::$deferredManager) {
            self::$deferredManager->resolveAll();
        }
    }

    /**
     * Helper function để lấy cache service
     *
     * @return \App\Services\CacheService|null
     */
    public static function cache()
    {
        if (self::hasService('cache')) {
            return self::service('cache');
        }

        return null;
    }

    /**
     * Helper function để lấy example service
     *
     * @return \App\Services\ExampleService|null
     */
    public static function example()
    {
        if (self::hasService('example')) {
            return self::service('example');
        }

        return null;
    }

    /**
     * Helper function để lấy advanced example service
     *
     * @return \App\Services\ExampleService|null
     */
    public static function advancedExample()
    {
        if (self::hasService('advanced_example')) {
            return self::service('advanced_example');
        }

        return null;
    }

    /**
     * Lấy thống kê services
     *
     * @return array
     */
    public static function getStats(): array
    {
        return [
            'registered' => self::getRegisteredServices(),
            'resolved' => self::getResolvedServices(),
            'total_registered' => count(self::getRegisteredServices()),
            'total_resolved' => count(self::getResolvedServices()),
            'memory_usage' => memory_get_usage(true),
            'peak_memory' => memory_get_peak_usage(true)
        ];
    }

    /**
     * Debug function để in thống kê services
     *
     * @return void
     */
    public static function debug(): void
    {
        if (!defined('WP_DEBUG') || !WP_DEBUG) {
            return;
        }

        $stats = self::getStats();

        echo '<div style="position: fixed; top: 10px; right: 10px; background: #333; color: white; padding: 15px; border-radius: 5px; z-index: 9999; font-family: monospace; font-size: 12px;">';
        echo '<h4 style="margin: 0 0 10px 0;">Deferred Services Debug</h4>';
        echo '<p><strong>Registered:</strong> ' . implode(', ', $stats['registered']) . '</p>';
        echo '<p><strong>Resolved:</strong> ' . implode(', ', $stats['resolved']) . '</p>';
        echo '<p><strong>Memory:</strong> ' . number_format($stats['memory_usage'] / 1024 / 1024, 2) . ' MB</p>';
        echo '<p><strong>Peak:</strong> ' . number_format($stats['peak_memory'] / 1024 / 1024, 2) . ' MB</p>';
        echo '</div>';
    }
}