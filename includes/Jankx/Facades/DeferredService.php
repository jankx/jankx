<?php

namespace Jankx\Facades;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Jankx\Services\DeferredServiceResolver;

/**
 * Deferred Service Facade
 *
 * Provides easy access to deferred service resolution
 *
 * @package Jankx\Facades
 * @since 2.0.0
 */
class DeferredService extends Facade
{
    /**
     * Get the registered name of the component.
     * @since 2.0.0
     */
    protected static function getFacadeAccessor()
    {
        return 'deferred.resolver';
    }

    /**
     * Resolve a service with deferred loading
     * @since 2.0.0
     */
    public static function resolve(string $serviceName): mixed
    {
        $resolver = static::getFacadeRoot();
        return $resolver->resolve($serviceName);
    }

    /**
     * Check if service is available in current context
     * @since 2.0.0
     */
    public static function has(string $serviceName): bool
    {
        $resolver = static::getFacadeRoot();
        return $resolver->has($serviceName);
    }

    /**
     * Get all resolved services
     * @since 2.0.0
     */
    public static function getResolvedServices(): array
    {
        $resolver = static::getFacadeRoot();
        return $resolver->getResolvedServices();
    }

    /**
     * Get service resolution statistics
     * @since 2.0.0
     */
    public static function getStats(): array
    {
        $resolver = static::getFacadeRoot();
        return $resolver->getResolutionStats();
    }


    /**
     * Register a service for specific context
     * @since 2.0.0
     */
    public static function register(string $context, string $serviceClass, array $options = []): void
    {
        // Use Config system instead
        \Jankx\Facades\Config::set("services.{$context}.{$serviceClass}", $options);
    }

    /**
     * Register multiple services for a context
     * @since 2.0.0
     */
    public static function registerMultiple(string $context, array $services, array $options = []): void
    {
        foreach ($services as $service) {
            self::register($context, $service, $options);
        }
    }

    /**
     * Defer a service for specific context
     * @since 2.0.0
     */
    public static function defer(string $context, callable $factory, array $options = []): void
    {
        // Use Config system instead
        \Jankx\Facades\Config::set("deferred.{$context}", $factory);
    }

    /**
     * Get registry statistics
     * @since 2.0.0
     */
    public static function getRegistryStats(): array
    {
        return [
            'context' => Kernel::getCurrentContext(),
            'services' => Config::get('services', []),
            'deferred' => Config::get('deferred', []),
        ];
    }

    /**
     * Clear resolved services cache
     * @since 2.0.0
     */
    public static function clearCache(): void
    {
        $resolver = static::getFacadeRoot();
        $resolver->clearCache();
    }

    /**
     * Get performance metrics
     * @since 2.0.0
     */
    public static function getPerformanceMetrics(): array
    {
        $resolver = static::getFacadeRoot();
        $monitor = $resolver->getMonitor();
        return $monitor->getPerformanceSummary();
    }

    /**
     * Log performance metrics
     * @since 2.0.0
     */
    public static function logMetrics(): void
    {
        $resolver = static::getFacadeRoot();
        $monitor = $resolver->getMonitor();
        $monitor->logMetrics();
    }
}
