<?php

namespace Jankx\Facades;

/**
 * Kernel Facade
 *
 * Provides easy access to KernelManager and current kernel information
 *
 * @package Jankx\Facades
 */
class Kernel extends Facade
{
    /**
     * Get the registered name of the component.
     */
    protected static function getFacadeAccessor()
    {
        return \Jankx\Kernel\KernelManager::class;
    }

    /**
     * Get current context from the current kernel
     */
    public static function getCurrentContext(): string
    {
        $kernelManager = static::getFacadeRoot();
        $currentKernel = $kernelManager->getCurrentKernel();

        if ($currentKernel) {
            return $currentKernel->getCurrentContext();
        }

        // Fallback to default context detection
        if (defined('WP_CLI') && WP_CLI) {
            return 'cli';
        }

        if (defined('REST_REQUEST') && REST_REQUEST) {
            return 'api';
        }

        if (wp_doing_ajax()) {
            return 'ajax';
        }

        if (is_admin()) {
            return 'admin';
        }

        return 'frontend';
    }

    /**
     * Get current kernel instance
     */
    public static function getCurrentKernel()
    {
        $kernelManager = static::getFacadeRoot();
        return $kernelManager->getCurrentKernel();
    }

    /**
     * Check if kernel is booted
     */
    public static function isBooted(): bool
    {
        $kernelManager = static::getFacadeRoot();
        return $kernelManager->booted;
    }

    /**
     * Get kernel type
     */
    public static function getType(): string
    {
        $currentKernel = self::getCurrentKernel();
        return $currentKernel ? $currentKernel->getType() : 'unknown';
    }

    /**
     * Get container instance
     */
    public static function getContainer()
    {
        $kernelManager = static::getFacadeRoot();
        return $kernelManager->container;
    }
}
