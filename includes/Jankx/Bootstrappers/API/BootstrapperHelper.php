<?php

namespace Jankx\Bootstrappers\API;

use Illuminate\Container\Container;

/**
 * Bootstrapper Helper
 *
 * Helper class for bootstrapper operations
 *
 * @package Jankx\Bootstrappers\API
 */
class BootstrapperHelper
{
    /**
     * Fire loaded action for bootstrapper
     *
     * @param string $bootstrapperName
     * @param Container $container
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
     */
    public static function getPriority(string $bootstrapperName): int
    {
        return apply_filters("jankx/bootstrapper/{$bootstrapperName}/priority", 10);
    }
}
