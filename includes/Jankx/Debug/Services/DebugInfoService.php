<?php

namespace Jankx\Debug\Services;

/**
 * Debug Info Service
 *
 * Manages basic debug information like response time and memory usage
 *
 * @package Jankx\Debug\Services
 * @since 2.0.0
 */
class DebugInfoService
{
    /**
     * @var float
     * @since 2.0.0
     */
    private $startTime;

    /**
     * @var bool
     * @since 2.0.0
     */
    private $isTracking = false;

    /**
     * Start tracking debug information
     *
     * @since 2.0.0
     */
    public function startTracking(): void
    {
        $this->startTime = microtime(true);
        $this->isTracking = true;
    }

    /**
     * Get response time
     *
     * @return float
     * @since 2.0.0
     */
    public function getResponseTime(): float
    {
        if (!$this->isTracking) {
            return 0.0;
        }

        return microtime(true) - $this->startTime;
    }

    /**
     * Get memory usage
     *
     * @return int
     * @since 2.0.0
     */
    public function getMemoryUsage(): int
    {
        return memory_get_usage(true);
    }

    /**
     * Get memory limit
     *
     * @return int
     * @since 2.0.0
     */
    public function getMemoryLimit(): int
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
     * Format bytes to human readable format
     *
     * @param int $bytes
     * @param int $precision
     * @return string
     * @since 2.0.0
     */
    public function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        if ($bytes === 0) {
            return '0 B';
        }

        $i = 0;
        $bytesFloat = (float) $bytes;

        while ($bytesFloat >= 1024 && $i < count($units) - 1) {
            $bytesFloat /= 1024;
            $i++;
        }

        return number_format($bytesFloat, $precision) . ' ' . $units[$i];
    }
}