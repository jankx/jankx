<?php

namespace Jankx\Helper;

use Jankx\Foundation\Application;

class ServiceHelper
{
    /**
     * @var Application
     */
    protected static $app;


    public static function getApp()
    {
        if (is_null(self::$app)) {
            self::$app = Application::getInstance();
        }
        return self::$app;
    }


    /**
     * Lấy service từ lazy loading system
     *
     * @param string $serviceName
     * @param mixed $default
     * @return mixed
     */
    public static function service(string $serviceName, $default = null)
    {
        if (!self::getApp()) {
            throw new \Exception(__('ServiceHelper has not been initialized. Call ServiceHelper::init() first.', 'jankx'));
        }

        try {
            return self::getApp()->lazy($serviceName, $default);
        } catch (\Exception $e) {
            return $default;
        }
    }

    /**
     * Kiểm tra service đã được đăng ký chưa
     *
     * @param string $serviceName
     * @return bool
     */
    public static function hasService(string $serviceName): bool
    {
        if (!self::$app) {
            return false;
        }

        return self::getApp()->hasLazy($serviceName);
    }

    /**
     * Kiểm tra service đã được load chưa
     *
     * @param string $serviceName
     * @return bool
     */
    public static function isResolved(string $serviceName): bool
    {
        if (!self::$app) {
            return false;
        }

        return self::getApp()->isLazyService($serviceName);
    }

    /**
     * Lấy tất cả services đã đăng ký
     *
     * @return array
     */
    public static function getRegisteredServices(): array
    {
        if (!self::$app) {
            return [];
        }

        $stats = self::getApp()->getLazyStats();
        return array_keys($stats['providers'] ?? []);
    }

    /**
     * Lấy tất cả services đã được load
     *
     * @return array
     */
    public static function getResolvedServices(): array
    {
        if (!self::$app) {
            return [];
        }

        $stats = self::getApp()->getLazyStats();
        return array_keys($stats['loaded'] ?? []);
    }

    /**
     * Load tất cả lazy services
     *
     * @return void
     */
    public static function resolveAll(): void
    {
        if (self::$app) {
            // Lazy services được load tự động khi cần
            // Không cần load tất cả cùng lúc
        }
    }

    /**
     * Helper function để lấy cache service
     *
     * @return mixed
     */
    public static function cache()
    {
        return self::service('cache');
    }

    /**
     * Helper function để lấy icon service
     *
     * @return mixed
     */
    public static function icon()
    {
        return self::service('font-icons.repository');
    }

    /**
     * Helper function để lấy gutenberg service
     *
     * @return mixed
     */
    public static function gutenberg()
    {
        return self::service('gutenberg.service');
    }

    /**
     * Lấy thống kê services
     *
     * @return array
     */
    public static function getStats(): array
    {
        if (!self::$app) {
            return [
                'registered' => [],
                'resolved' => [],
                'total_registered' => 0,
                'total_resolved' => 0,
                'memory_usage' => memory_get_usage(true),
                'peak_memory' => memory_get_peak_usage(true)
            ];
        }

        $lazyStats = self::getApp()->getLazyStats();

        return [
            'registered' => self::getRegisteredServices(),
            'resolved' => self::getResolvedServices(),
            'total_registered' => $lazyStats['providers'] ?? 0,
            'total_resolved' => $lazyStats['loaded'] ?? 0,
            'memory_usage' => memory_get_usage(true),
            'peak_memory' => memory_get_peak_usage(true),
            'lazy_stats' => $lazyStats
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
        echo '<h4 style="margin: 0 0 10px 0;">' . __('Lazy Services Debug', 'jankx') . '</h4>';
        echo '<p><strong>' . __('Registered:', 'jankx') . '</strong> ' . implode(', ', $stats['registered']) . '</p>';
        echo '<p><strong>' . __('Loaded:', 'jankx') . '</strong> ' . implode(', ', $stats['resolved']) . '</p>';
        echo '<p><strong>' . __('Total Providers:', 'jankx') . '</strong> ' . $stats['total_registered'] . '</p>';
        echo '<p><strong>' . __('Total Loaded:', 'jankx') . '</strong> ' . $stats['total_resolved'] . '</p>';
        echo '<p><strong>' . __('Memory:', 'jankx') . '</strong> ' . number_format($stats['memory_usage'] / 1024 / 1024, 2) . ' MB</p>';
        echo '<p><strong>' . __('Peak:', 'jankx') . '</strong> ' . number_format($stats['peak_memory'] / 1024 / 1024, 2) . ' MB</p>';
        echo '</div>';
    }
}
