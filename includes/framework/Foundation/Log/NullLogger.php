<?php

namespace Jankx\Foundation\Log;

use Jankx\Contracts\LoggerInterface;

class NullLogger implements LoggerInterface
{
    /**
     * Log a message (does nothing).
     *
     * @param  string  $level
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function log($level, $message, array $context = [])
    {
        // Do nothing
    }

    /**
     * Log an emergency message (does nothing).
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function emergency($message, array $context = [])
    {
        // Do nothing
    }

    /**
     * Log an alert message (does nothing).
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function alert($message, array $context = [])
    {
        // Do nothing
    }

    /**
     * Log a critical message (does nothing).
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function critical($message, array $context = [])
    {
        // Do nothing
    }

    /**
     * Log an error message (does nothing).
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function error($message, array $context = [])
    {
        // Do nothing
    }

    /**
     * Log a warning message (does nothing).
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function warning($message, array $context = [])
    {
        // Do nothing
    }

    /**
     * Log a notice message (does nothing).
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function notice($message, array $context = [])
    {
        // Do nothing
    }

    /**
     * Log an info message (does nothing).
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function info($message, array $context = [])
    {
        // Do nothing
    }

    /**
     * Log a debug message (does nothing).
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function debug($message, array $context = [])
    {
        // Do nothing
    }
}
