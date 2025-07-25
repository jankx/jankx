<?php

namespace Jankx\Services;

use Illuminate\Container\Container;
use Jankx\Context\ContextualServiceRegistry;

/**
 * Deferred Service Resolver
 *
 * Resolves services with lazy loading and context-aware resolution
 *
 * @package Jankx\Services
 * @since 2.0.0\n */
class DeferredServiceResolver
{
    private $container;
    private $resolved = [];
    private $monitor;

    public function __construct(Container $container)
    {
        $this->container = $container;
        $this->monitor = new DeferredServiceMonitor();
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
            // Get current context
            $context = ContextualServiceRegistry::getCurrentContext();

            // Try to resolve from container
            if ($this->container->bound($serviceName)) {
                $service = $this->container->make($serviceName);
                $this->resolved[$serviceName] = $service;
                $this->monitor->endMonitoring($serviceName);
                return $service;
            }

            // Try to resolve from deferred registry
            $service = ContextualServiceRegistry::resolve($this->container, $context, $serviceName);
            $this->resolved[$serviceName] = $service;
            $this->monitor->endMonitoring($serviceName);
            return $service;

        } catch (\Exception $e) {
            $this->monitor->endMonitoring($serviceName);

            // Log the error
            error_log("Failed to resolve service: {$serviceName} in context: {$context}");
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
     * Get current context
     * @since 2.0.0\n     */
    private function getCurrentContext(): string
    {
        return ContextualServiceRegistry::getCurrentContext();
    }

    /**
     * Get monitor instance
     * @since 2.0.0\n     */
    public function getMonitor(): DeferredServiceMonitor
    {
        return $this->monitor;
    }
}