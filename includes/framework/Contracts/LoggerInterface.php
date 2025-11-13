<?php

namespace Jankx\Contracts;

interface LoggerInterface
{
    /**
     * Log a message.
     *
     * @param  string  $level
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function log($level, $message, array $context = []);

    /**
     * Log an emergency message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function emergency($message, array $context = []);

    /**
     * Log an alert message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function alert($message, array $context = []);

    /**
     * Log a critical message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function critical($message, array $context = []);

    /**
     * Log an error message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function error($message, array $context = []);

    /**
     * Log a warning message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function warning($message, array $context = []);

    /**
     * Log a notice message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function notice($message, array $context = []);

    /**
     * Log an info message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function info($message, array $context = []);

    /**
     * Log a debug message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function debug($message, array $context = []);
}

