<?php

namespace Jankx\Logger;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Logger class for Jankx Framework
 *
 * Handles logging of messages at different levels.
 *
 * @package Jankx\Logger
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @version 2.0.0
 * @license MIT
 * @since 2.0.0
 */
class Logger
{
    /**
     * Check if currently running in unit test environment
     * @return bool
     * @since 2.0.0
     */
    protected function isRunningTests(): bool
    {
        return defined('IS_TESTING') && boolval(IS_TESTING);
    }

    /**
     * Log an info message
     * @param string $message
     * @param array $context
     * @since 2.0.0
     */
    public function info($message, array $context = [])
    {
        $this->log('info', $message, $context);
    }

    /**
     * Log a warning message
     * @param string $message
     * @param array $context
     * @since 2.0.0
     */
    public function warning($message, array $context = [])
    {
        $this->log('warning', $message, $context);
    }

    /**
     * Log an error message
     * @param string $message
     * @param array $context
     * @since 2.0.0
     */
    public function error($message, array $context = [])
    {
        $this->log('error', $message, $context);
    }

    /**
     * Log a debug message
     * @param string $message
     * @param array $context
     * @since 2.0.0
     */
    public function debug($message, array $context = [])
    {
        $this->log('debug', $message, $context);
    }

    /**
     * Internal method to log messages
     * @param string $level
     * @param string $message
     * @param array $context
     * @since 2.0.0
     */
    protected function log($level, $message, array $context = [])
    {
        // If running tests, always log for testing purposes
        if ($this->isRunningTests()) {
            $formattedMessage = $this->formatMessage($level, $message, $context);
            $this->internalLog($formattedMessage);
            return;
        }

        // Only log warning, error, or if JANKX_DEBUG is true
        $shouldLog = (
            (defined('JANKX_DEBUG') && constant('JANKX_DEBUG') === true) ||
            in_array($level, ['warning', 'error'])
        );
        if (!$shouldLog) {
            return;
        }
        $formattedMessage = $this->formatMessage($level, $message, $context);

        // Use WordPress error logging
        error_log($formattedMessage);
    }

    /**
     * Internal logging method for tests
     * @param string $message
     * @since 2.0.0
     */
    protected function internalLog($message)
    {
        // In test environment, do nothing or store for verification
        // This method can be mocked in tests
    }

    /**
     * Format the log message
     * @param string $level
     * @param string $message
     * @param array $context
     * @return string
     * @since 2.0.0
     */
    protected function formatMessage($level, $message, array $context = []): string
    {
        $timestamp = date('Y-m-d H:i:s');
        $contextString = !empty($context) ? json_encode($context) : '';
        return "[{$timestamp}] [Jankx {$level}] {$message}" . ($contextString ? " {$contextString}" : '');
    }
}
