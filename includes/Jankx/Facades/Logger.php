<?php

namespace Jankx\Facades;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Logger Facade
 *
 * Provides a static interface for logging messages in Jankx Framework.
 *
 * @package Jankx\Facades
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @version 2.0.0
 * @license MIT
 * @since 2.0.0
 */
class Logger extends Facade
{
    /**
     * Get the registered name of the component
     * @return string
     * @since 2.0.0
     */
    protected static function getFacadeAccessor()
    {
        return 'Jankx\Logger\Logger';
    }

    /**
     * Log an info message
     * @param string $message
     * @param array $context
     * @since 2.0.0
     */
    public static function info($message, array $context = [])
    {
        static::__callStatic('info', [$message, $context]);
    }

    /**
     * Log a warning message
     * @param string $message
     * @param array $context
     * @since 2.0.0
     */
    public static function warning($message, array $context = [])
    {
        static::__callStatic('warning', [$message, $context]);
    }

    /**
     * Log an error message
     * @param string $message
     * @param array $context
     * @since 2.0.0
     */
    public static function error($message, array $context = [])
    {
        static::__callStatic('error', [$message, $context]);
    }

    /**
     * Log a debug message
     * @param string $message
     * @param array $context
     * @since 2.0.0
     */
    public static function debug($message, array $context = [])
    {
        static::__callStatic('debug', [$message, $context]);
    }
}
