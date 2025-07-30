<?php

namespace Jankx\Helpers;

use Illuminate\Container\Container;

/**
 * Bootstrapper Helper
 *
 * Helper class for bootstrapper operations across all contexts
 *
 * @package Jankx\Helpers
 * @since 2.0.0
 */
class BootstrapperHelper
{
    /**
     * Fire loaded action for bootstrapper
     *
     * @param string $bootstrapperName
     * @param Container $container
     * @since 2.0.0
     */
    public static function fireLoadedAction(string $bootstrapperName, Container $container): void
    {
        do_action("jankx/bootstrapper/{$bootstrapperName}/loaded", $container);
    }

    /**
     * Check if bootstrapper is enabled
     *
     * @param string $bootstrapperName
     * @return bool
     * @since 2.0.0
     */
    public static function isEnabled(string $bootstrapperName): bool
    {
        return apply_filters("jankx/bootstrapper/{$bootstrapperName}/enabled", true);
    }

    /**
     * Get bootstrapper priority
     *
     * @param string $bootstrapperName
     * @return int
     * @since 2.0.0
     */
    public static function getPriority(string $bootstrapperName): int
    {
        return apply_filters("jankx/bootstrapper/{$bootstrapperName}/priority", 10);
    }

    /**
     * Setup deferred service resolver
     *
     * @param Container $container
     * @since 2.0.0
     */
    public static function setupDeferredResolver(Container $container): void
    {
        // Register deferred service resolver if not already registered
        if (!$container->bound('deferred.resolver')) {
            $container->singleton('deferred.resolver', function ($container) {
                return new \Jankx\Services\DeferredServiceResolver($container);
            });
        }
    }

    /**
     * Get bootstrapper context from class name
     *
     * @param string $className Full class name
     * @return string
     * @since 2.0.0
     */
    public static function getContextFromClassName(string $className): string
    {
        $parts = explode('\\', $className);

        // Look for context in namespace parts
        foreach ($parts as $part) {
            if (in_array(strtolower($part), ['global', 'frontend', 'admin', 'cli', 'api', 'ajax', 'gutenberg'])) {
                return strtolower($part);
            }
        }

        return 'global';
    }

    /**
     * Validate bootstrapper class
     *
     * @param string $className
     * @return bool
     * @since 2.0.0
     */
    public static function isValidBootstrapper(string $className): bool
    {
        return class_exists($className) &&
               is_subclass_of($className, \Jankx\Contracts\BootstrapperInterface::class);
    }

    /**
     * Get bootstrapper dependencies
     *
     * @param string $className
     * @return array
     * @since 2.0.0
     */
    public static function getDependencies(string $className): array
    {
        if (!self::isValidBootstrapper($className)) {
            return [];
        }

        $reflection = new \ReflectionClass($className);
        $instance = $reflection->newInstanceWithoutConstructor();

        if (method_exists($instance, 'getDependencies')) {
            return $instance->getDependencies();
        }

        return [];
    }

    /**
     * Check if bootstrapper has dependencies
     *
     * @param string $className
     * @return bool
     * @since 2.0.0
     */
    public static function hasDependencies(string $className): bool
    {
        return !empty(self::getDependencies($className));
    }

    /**
     * Get bootstrapper name from class
     *
     * @param string $className
     * @return string
     * @since 2.0.0
     */
    public static function getNameFromClass(string $className): string
    {
        if (!self::isValidBootstrapper($className)) {
            return '';
        }

        $reflection = new \ReflectionClass($className);
        $instance = $reflection->newInstanceWithoutConstructor();

        if (method_exists($instance, 'getName')) {
            return $instance->getName();
        }

        // Fallback: extract name from class name
        $shortName = $reflection->getShortName();
        return strtolower(str_replace('Bootstrapper', '', $shortName));
    }

    /**
     * Get container from global instance
     *
     * @return mixed
     * @since 2.0.0
     */
    public static function getGlobalContainer()
    {
        return \Jankx\Jankx::getInstance();
    }

    /**
     * Check if container and resolver are available
     *
     * @param mixed $container
     * @return bool
     * @since 2.0.0
     */
    public static function isContainerReady($container): bool
    {
        return $container && $container->bound('deferred.resolver');
    }

    /**
     * Get deferred resolver from container
     *
     * @param Container $container
     * @return mixed
     * @since 2.0.0
     */
    public static function getDeferredResolver(Container $container)
    {
        if (!self::isContainerReady($container)) {
            return null;
        }

        return $container->make('deferred.resolver');
    }
}
