<?php

namespace Jankx\Services;

use Jankx\Facades\Logger;

/**
 * Deferred Service Monitor
 *
 * Monitors and tracks deferred service performance and usage
 *
 * @package Jankx\Services
 * @since 2.0.1
 */
class DeferredServiceMonitor
{
    private $metrics = [];
    private $startTimes = [];

    /**
     * Start monitoring a service
     */
    public function startMonitoring(string $serviceName): void
    {
        $this->startTimes[$serviceName] = [
            'start_time' => microtime(true),
            'memory_before' => memory_get_usage(true),
            'peak_memory_before' => memory_get_peak_usage(true),
        ];
    }

    /**
     * End monitoring a service
     */
    public function endMonitoring(string $serviceName): void
    {
        if (!isset($this->startTimes[$serviceName])) {
            return;
        }

        $startData = $this->startTimes[$serviceName];
        $endTime = microtime(true);
        $memoryAfter = memory_get_usage(true);
        $peakMemoryAfter = memory_get_peak_usage(true);

        $this->metrics[$serviceName] = [
            'load_time' => $endTime - $startData['start_time'],
            'memory_usage' => $memoryAfter - $startData['memory_before'],
            'peak_memory_usage' => $peakMemoryAfter - $startData['peak_memory_before'],
            'memory_before' => $startData['memory_before'],
            'memory_after' => $memoryAfter,
            'peak_memory_before' => $startData['peak_memory_before'],
            'peak_memory_after' => $peakMemoryAfter,
            'timestamp' => time(),
        ];

        // Clean up start time data
        unset($this->startTimes[$serviceName]);
    }

    /**
     * Get all metrics
     */
    public function getMetrics(): array
    {
        return $this->metrics;
    }

    /**
     * Get metrics for a specific service
     */
    public function getServiceMetrics(string $serviceName): ?array
    {
        return $this->metrics[$serviceName] ?? null;
    }

    /**
     * Get total load time for all services
     */
    public function getTotalLoadTime(): float
    {
        return array_sum(array_column($this->metrics, 'load_time'));
    }

    /**
     * Get total memory usage for all services
     */
    public function getTotalMemoryUsage(): int
    {
        return array_sum(array_column($this->metrics, 'memory_usage'));
    }

    /**
     * Get average load time
     */
    public function getAverageLoadTime(): float
    {
        if (empty($this->metrics)) {
            return 0.0;
        }

        return $this->getTotalLoadTime() / count($this->metrics);
    }

    /**
     * Get average memory usage
     */
    public function getAverageMemoryUsage(): float
    {
        if (empty($this->metrics)) {
            return 0.0;
        }

        return $this->getTotalMemoryUsage() / count($this->metrics);
    }

    /**
     * Get slowest service
     */
    public function getSlowestService(): ?array
    {
        if (empty($this->metrics)) {
            return null;
        }

        $slowest = null;
        $maxTime = 0;

        foreach ($this->metrics as $serviceName => $metrics) {
            if ($metrics['load_time'] > $maxTime) {
                $maxTime = $metrics['load_time'];
                $slowest = [
                    'service' => $serviceName,
                    'load_time' => $metrics['load_time'],
                    'memory_usage' => $metrics['memory_usage'],
                ];
            }
        }

        return $slowest;
    }

    /**
     * Get service with highest memory usage
     */
    public function getHighestMemoryService(): ?array
    {
        if (empty($this->metrics)) {
            return null;
        }

        $highest = null;
        $maxMemory = 0;

        foreach ($this->metrics as $serviceName => $metrics) {
            if ($metrics['memory_usage'] > $maxMemory) {
                $maxMemory = $metrics['memory_usage'];
                $highest = [
                    'service' => $serviceName,
                    'memory_usage' => $metrics['memory_usage'],
                    'load_time' => $metrics['load_time'],
                ];
            }
        }

        return $highest;
    }

    /**
     * Get performance summary
     */
    public function getPerformanceSummary(): array
    {
        return [
            'total_services' => count($this->metrics),
            'total_load_time' => $this->getTotalLoadTime(),
            'total_memory_usage' => $this->getTotalMemoryUsage(),
            'average_load_time' => $this->getAverageLoadTime(),
            'average_memory_usage' => $this->getAverageMemoryUsage(),
            'slowest_service' => $this->getSlowestService(),
            'highest_memory_service' => $this->getHighestMemoryService(),
        ];
    }

    /**
     * Log metrics to error log (for debugging)
     */
    public function logMetrics(): void
    {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            $summary = $this->getPerformanceSummary();
            Logger::error('JANKX DEFERRED SERVICE METRICS: ' . json_encode($summary));
        }
    }

    /**
     * Clear all metrics
     */
    public function clearMetrics(): void
    {
        $this->metrics = [];
        $this->startTimes = [];
    }

    /**
     * Check if monitoring is active for a service
     */
    public function isMonitoring(string $serviceName): bool
    {
        return isset($this->startTimes[$serviceName]);
    }

    /**
     * Get currently monitoring services
     */
    public function getCurrentlyMonitoring(): array
    {
        return array_keys($this->startTimes);
    }
}