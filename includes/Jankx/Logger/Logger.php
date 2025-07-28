<?php

namespace Jankx\Logger;

/**
 * Logger class for Jankx Framework
 *
 * Handles logging of messages at different levels.
 *
 * @package Jankx\Logger
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @version 2.0.0
 * @license MIT
 */
class Logger
{
    /**
     * Log an info message
     * @param string $message
     * @param array $context
     */
    public function info($message, array $context = [])
    {
        $this->log('info', $message, $context);
    }

    /**
     * Log a warning message
     * @param string $message
     * @param array $context
     */
    public function warning($message, array $context = [])
    {
        $this->log('warning', $message, $context);
    }

    /**
     * Log an error message
     * @param string $message
     * @param array $context
     */
    public function error($message, array $context = [])
    {
        $this->log('error', $message, $context);
    }

    /**
     * Log a debug message
     * @param string $message
     * @param array $context
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
     */
    protected function log($level, $message, array $context = [])
    {
        // Only log warning, error, or if JANKX_DEBUG is true
        $shouldLog = (
            (defined('JANKX_DEBUG') && constant('JANKX_DEBUG') === true) ||
            in_array($level, ['warning', 'error'])
        );
        if (!$shouldLog) {
            return;
        }
        $formattedMessage = $this->formatMessage($level, $message, $context);

        // Use WordPress error logging instead of error_log
        if (function_exists('error_log')) {
            error_log($formattedMessage);
        } else {
            // Fallback for environments without error_log
            if (defined('WP_DEBUG') && WP_DEBUG) {
                trigger_error($formattedMessage, E_USER_NOTICE);
            }
        }
    }

    /**
     * Format the log message
     * @param string $level
     * @param string $message
     * @param array $context
     * @return string
     */
    protected function formatMessage($level, $message, array $context = []): string
    {
        $timestamp = date('Y-m-d H:i:s');
        $contextString = !empty($context) ? json_encode($context) : '';
        return "[{$timestamp}] [Jankx {$level}] {$message}" . ($contextString ? " {$contextString}" : '');
    }
}
