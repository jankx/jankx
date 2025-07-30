<?php

namespace Jankx\Facades;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Kernel Facade
 *
 * Provides easy access to KernelManager and current kernel information
 *
 * @package Jankx\Facades
 * @since 2.0.0
 */
class Kernel extends Facade
{
    /**
     * Get the registered name of the component.
     * @since 2.0.0
     */
    protected static function getFacadeAccessor()
    {
        return \Jankx\Kernel\KernelManager::class;
    }

    /**
     * Get current context from the current kernel
     * @since 2.0.0
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
     * @since 2.0.0
     */
    public static function getCurrentKernel()
    {
        $kernelManager = static::getFacadeRoot();
        return $kernelManager->getCurrentKernel();
    }

    /**
     * Check if kernel is booted
     * @since 2.0.0
     */
    public static function isBooted(): bool
    {
        $kernelManager = static::getFacadeRoot();
        return $kernelManager->booted;
    }

    /**
     * Get kernel type
     * @since 2.0.0
     */
    public static function getType(): string
    {
        $currentKernel = self::getCurrentKernel();
        return $currentKernel ? $currentKernel->getType() : 'unknown';
    }

    /**
     * Get container instance
     * @since 2.0.0
     */
    public static function getContainer()
    {
        $kernelManager = static::getFacadeRoot();
        return $kernelManager->container;
    }
}
