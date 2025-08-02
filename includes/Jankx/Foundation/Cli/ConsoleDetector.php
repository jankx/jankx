<?php

namespace Jankx\Foundation\Cli;

class ConsoleDetector
{
    /**
     * Detect the type of console request.
     *
     * @param  array  $args
     * @return string
     */
    public static function detect($args)
    {
        // Check for WP CLI
        if (self::isWpCli($args)) {
            return 'wp_cli';
        }

        // Check for WP Cron
        if (self::isWpCron($args)) {
            return 'wp_cron';
        }

        // Default to unknown
        return 'unknown';
    }

    /**
     * Check if the request is a WP CLI command.
     *
     * @param  array  $args
     * @return bool
     */
    protected static function isWpCli($args)
    {
        return defined('WP_CLI') && WP_CLI;
    }

    /**
     * Check if the request is a WP Cron job.
     *
     * @param  array  $args
     * @return bool
     */
    protected static function isWpCron($args)
    {
        return defined('DOING_CRON') && DOING_CRON;
    }
}
