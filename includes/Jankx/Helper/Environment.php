<?php

namespace Jankx\Helper;

class Environment
{
    /**
     * Check if debug logging is enabled.
     *
     * @return bool
     */
    public static function isDebugLog()
    {
        return defined('WP_DEBUG') && WP_DEBUG;
    }

    /**
     * Check if the application is in development mode.
     *
     * @return bool
     */
    public static function isDevelopment()
    {
        return defined('WP_DEBUG') && WP_DEBUG;
    }

    /**
     * Check if the application is in production mode.
     *
     * @return bool
     */
    public static function isProduction()
    {
        return !self::isDevelopment();
    }

    /**
     * Check if WP CLI is running.
     *
     * @return bool
     */
    public static function isWpCli()
    {
        return defined('WP_CLI') && WP_CLI;
    }

    /**
     * Check if WP Cron is running.
     *
     * @return bool
     */
    public static function isWpCron()
    {
        return defined('DOING_CRON') && DOING_CRON;
    }

    /**
     * Check if the application is running in admin area.
     *
     * @return bool
     */
    public static function isAdmin()
    {
        return is_admin();
    }

    /**
     * Check if the application is running in frontend area.
     *
     * @return bool
     */
    public static function isFrontend()
    {
        return !self::isAdmin();
    }
}
