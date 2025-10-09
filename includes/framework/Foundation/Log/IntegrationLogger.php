<?php

namespace Jankx\Foundation\Log;

use Jankx\Contracts\LoggerInterface;

class IntegrationLogger implements LoggerInterface
{
    /**
     * Log a message (internal use only).
     *
     * @param  string  $level
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function log($level, $message, array $context = [])
    {
        // Internal method - không nên gọi trực tiếp
    }

    /**
     * Write the log message.
     *
     * @param  string  $level
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    protected function writeLog($level, $message, array $context = [])
    {
        $logMessage = sprintf(
            '[%s] %s: %s %s',
            date('Y-m-d H:i:s'),
            strtoupper($level),
            $message,
            !empty($context) ? json_encode($context) : ''
        );

        error_log($logMessage);
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
     * Log an error message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function error($message, array $context = [])
    {
        $this->writeLog('error', $message, $context);
    }

    /**
     * Log a warning message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function warning($message, array $context = [])
    {
        $this->writeLog('warning', $message, $context);
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

