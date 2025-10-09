<?php

namespace Jankx\Foundation\Log;

use Jankx\Contracts\LoggerInterface;

class IntegrationLogger implements LoggerInterface
{
    /**
     * Log levels
     */
    const EMERGENCY = 'emergency';
    const ALERT     = 'alert';
    const CRITICAL  = 'critical';
    const ERROR     = 'error';
    const WARNING   = 'warning';
    const NOTICE    = 'notice';
    const INFO      = 'info';
    const DEBUG     = 'debug';
    const SUCCESS   = 'success';

    /**
     * Log a message.
     * Only logs warning, error, critical, alert, and emergency levels.
     *
     * @param  string  $level
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function log($level, $message, array $context = [])
    {
        // Chỉ log các level quan trọng: warning trở lên
        $importantLevels = [
            self::EMERGENCY,
            self::ALERT,
            self::CRITICAL,
            self::ERROR,
            self::WARNING,
        ];

        if (in_array($level, $importantLevels)) {
            $this->writeLog($level, $message, $context);
        }
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
     * Log an emergency message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function emergency($message, array $context = [])
    {
        $this->log(self::EMERGENCY, $message, $context);
    }

    /**
     * Log an alert message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function alert($message, array $context = [])
    {
        $this->log(self::ALERT, $message, $context);
    }

    /**
     * Log a critical message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function critical($message, array $context = [])
    {
        $this->log(self::CRITICAL, $message, $context);
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
        $this->log(self::ERROR, $message, $context);
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
        $this->log(self::WARNING, $message, $context);
    }

    /**
     * Log a notice message (does nothing in IntegrationLogger).
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function notice($message, array $context = [])
    {
        // Do nothing - không log notice level
    }

    /**
     * Log an info message (does nothing in IntegrationLogger).
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function info($message, array $context = [])
    {
        // Do nothing - không log info level
    }

    /**
     * Log a debug message (does nothing in IntegrationLogger).
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function debug($message, array $context = [])
    {
        // Do nothing - không log debug level
    }
}

