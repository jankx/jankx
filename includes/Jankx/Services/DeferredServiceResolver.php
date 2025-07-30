<?php

namespace Jankx\Services;

use Illuminate\Container\Container;
use Jankx\Facades\Kernel;
use Jankx\Facades\Logger;

/**
 * Deferred Service Resolver
 *
 * Handles resolution of deferred services in different contexts
 *
 * @package Jankx\Services
 * @since 2.0.0
 */
class DeferredServiceResolver
{
    private $container;
    private $resolved = [];
    private $monitor;

    public function __construct(Container $container, DeferredServiceMonitor $monitor)
    {
        $this->container = $container;
        $this->monitor = $monitor;
    }

    /**
     * Resolve a service with deferred loading
     * @since 2.0.0\n     */
    public function resolve(string $serviceName): mixed
    {
        // Check if already resolved
        if (isset($this->resolved[$serviceName])) {
            return $this->resolved[$serviceName];
        }

        // Start monitoring
        $this->monitor->startMonitoring($serviceName);

        try {
            // Get current context using Kernel facade
            $context = Kernel::getCurrentContext();

            // Try to resolve from container
            if ($this->container->bound($serviceName)) {
                $service = $this->container->make($serviceName);
                $this->resolved[$serviceName] = $service;
                $this->monitor->endMonitoring($serviceName);
                return $service;
            }

            // Try to resolve from deferred registry
            $service = $this->container->make($serviceName);
            $this->resolved[$serviceName] = $service;
            $this->monitor->endMonitoring($serviceName);
            return $service;
        } catch (\Exception $e) {
            $this->monitor->endMonitoring($serviceName);

            // Log the error
            Logger::error("Failed to resolve service: {$serviceName} in context: {$context}", [
                'service_name' => $serviceName,
                'context' => $context,
                'exception' => $e,
            ]);
            throw $e;
        }
    }

    /**
     * Check if service is available in current context
     * @since 2.0.0\n     */
    public function has(string $serviceName): bool
    {
        try {
            $this->resolve($serviceName);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get all resolved services
     * @since 2.0.0\n     */
    public function getResolvedServices(): array
    {
        return array_keys($this->resolved);
    }

    /**
     * Get service resolution statistics
     * @since 2.0.0\n     */
    public function getResolutionStats(): array
    {
        return [
            'resolved_services' => $this->getResolvedServices(),
            'total_resolved' => count($this->resolved),
            'monitoring_metrics' => $this->monitor->getMetrics(),
        ];
    }

    /**
     * Clear resolved services cache
     * @since 2.0.0\n     */
    public function clearCache(): void
    {
        $this->resolved = [];
        $this->monitor->clearMetrics();
    }


    /**
     * Get monitor instance
     * @since 2.0.0\n     */
    public function getMonitor(): DeferredServiceMonitor
    {
        return $this->monitor;
    }
}
