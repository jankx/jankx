<?php

namespace Jankx\Debug\Helpers;

use Jankx\Facades\Logger;
use Jankx\Debug\Facades\Debug;

/**
 * Debug Helper
 *
 * Provides utility functions for debugging
 *
 * @package Jankx\Debug\Helpers
 * @since 2.0.1
 */
class DebugHelper
{
    /**
     * Check if debug is enabled
     *
     * @return bool
     * @since 2.0.1
     */
    public static function isEnabled(): bool
    {
        return defined('JANKX_DEBUG') && JANKX_DEBUG;
    }

    /**
     * Get debug info
     *
     * @return array
     * @since 2.0.1
     */
    public static function getDebugInfo(): array
    {
        if (!self::isEnabled()) {
            return [];
        }

        return Debug::getInfo();
    }

    /**
     * Get query count
     *
     * @return int
     * @since 2.0.1
     */
    public static function getQueryCount(): int
    {
        if (!self::isEnabled()) {
            return 0;
        }

        return Debug::getQueryCount();
    }

    /**
     * Add plugin debug info
     *
     * @param string $pluginName
     * @param string $info
     * @since 2.0.1
     */
    public static function addPluginInfo(string $pluginName, string $info): void
    {
        if (!self::isEnabled()) {
            return;
        }

        Debug::addPluginInfo($pluginName, $info);
    }

    /**
     * Format memory usage
     *
     * @param int $bytes
     * @param int $precision
     * @return string
     * @since 2.0.1
     */
    public static function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }

    /**
     * Calculate memory usage percentage
     *
     * @param int $usage
     * @param int $limit
     * @return float
     * @since 2.0.1
     */
    public static function calculateMemoryUsagePercentage(int $usage, int $limit): float
    {
        if ($limit <= 0 || $limit === -1) {
            return 0.0;
        }

        return round(($usage / $limit) * 100, 2);
    }

    /**
     * Get current memory usage
     *
     * @return int
     * @since 2.0.1
     */
    public static function getCurrentMemoryUsage(): int
    {
        return memory_get_usage(true);
    }

    /**
     * Get memory limit
     *
     * @return int
     * @since 2.0.1
     */
    public static function getMemoryLimit(): int
    {
        $limit = ini_get('memory_limit');

        if ($limit === '-1') {
            return -1;
        }

        $unit = strtolower(substr($limit, -1));
        $value = (int) substr($limit, 0, -1);

        switch ($unit) {
            case 'g':
                $value *= 1024;
                // fall through
            case 'm':
                $value *= 1024;
                // fall through
            case 'k':
                $value *= 1024;
                break;
        }

        return $value;
    }

    /**
     * Get response time
     *
     * @param float $startTime
     * @return float
     * @since 2.0.1
     */
    public static function getResponseTime(float $startTime): float
    {
        return microtime(true) - $startTime;
    }

    /**
     * Log debug message
     *
     * @param string $message
     * @param array $context
     * @since 2.0.1
     */
    public static function log(string $message, array $context = []): void
    {
        if (!self::isEnabled()) {
            return;
        }

        $debugInfo = [
            'message' => $message,
            'context' => $context,
            'timestamp' => microtime(true),
            'memory_usage' => self::getCurrentMemoryUsage(),
            'query_count' => self::getQueryCount()
        ];

        Logger::debug('Jankx Debug Info', $debugInfo);
    }
}