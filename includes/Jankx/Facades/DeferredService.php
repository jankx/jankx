<?php

namespace Jankx\Facades;

use Jankx\Services\DeferredServiceResolver;
use Jankx\Context\ContextualServiceRegistry;

/**
 * Deferred Service Facade
 *
 * Provides easy access to deferred service resolution
 *
 * @package Jankx\Facades
 */
class DeferredService extends Facade
{
    /**
     * Get the registered name of the component.
     */
    protected static function getFacadeAccessor()
    {
        return 'deferred.resolver';
    }

    /**
     * Resolve a service with deferred loading
     */
    public static function resolve(string $serviceName): mixed
    {
        $resolver = static::getFacadeRoot();
        return $resolver->resolve($serviceName);
    }

    /**
     * Check if service is available in current context
     */
    public static function has(string $serviceName): bool
    {
        $resolver = static::getFacadeRoot();
        return $resolver->has($serviceName);
    }

    /**
     * Get all resolved services
     */
    public static function getResolvedServices(): array
    {
        $resolver = static::getFacadeRoot();
        return $resolver->getResolvedServices();
    }

    /**
     * Get service resolution statistics
     */
    public static function getStats(): array
    {
        $resolver = static::getFacadeRoot();
        return $resolver->getResolutionStats();
    }

    /**
     * Get current context
     */
    public static function getCurrentContext(): string
    {
        return ContextualServiceRegistry::getCurrentContext();
    }

    /**
     * Register a service for specific context
     */
    public static function register(string $context, string $serviceClass, array $options = []): void
    {
        ContextualServiceRegistry::register($context, $serviceClass, $options);
    }

    /**
     * Register multiple services for a context
     */
    public static function registerMultiple(string $context, array $services, array $options = []): void
    {
        ContextualServiceRegistry::registerMultiple($context, $services, $options);
    }

    /**
     * Defer a service for specific context
     */
    public static function defer(string $context, callable $factory, array $options = []): void
    {
        ContextualServiceRegistry::defer($context, $factory, $options);
    }

    /**
     * Get registry statistics
     */
    public static function getRegistryStats(): array
    {
        return ContextualServiceRegistry::getStats();
    }

    /**
     * Clear resolved services cache
     */
    public static function clearCache(): void
    {
        $resolver = static::getFacadeRoot();
        $resolver->clearCache();
    }

    /**
     * Get performance metrics
     */
    public static function getPerformanceMetrics(): array
    {
        $resolver = static::getFacadeRoot();
        $monitor = $resolver->getMonitor();
        return $monitor->getPerformanceSummary();
    }

    /**
     * Log performance metrics
     */
    public static function logMetrics(): void
    {
        $resolver = static::getFacadeRoot();
        $monitor = $resolver->getMonitor();
        $monitor->logMetrics();
    }
}