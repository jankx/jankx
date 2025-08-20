<?php

namespace Jankx\Foundation\Log;

class Logger
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

    const SUCCESS     = 'success';


    /**
     * Log a message.
     *
     * @param  string  $level
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function log($level, $message, array $context = [])
    {
        // Only log if level is warning or above, or if JANKX_LOG_ALL is defined
        if ($this->shouldLog($level)) {
            $this->writeLog($level, $message, $context);
        }
    }

    /**
     * Determine if the message should be logged.
     *
     * @param  string  $level
     * @return bool
     */
    protected function shouldLog($level)
    {
        if (defined('JANKX_LOG_ALL')) {
            return true;
        }

        // Debug level only shows when JANKX_DEBUG_LOG is defined and true
        if ($level === self::DEBUG) {
            return defined('JANKX_DEBUG_LOG') && JANKX_DEBUG_LOG === true;
        }

        $levels = [
            self::EMERGENCY => 0,
            self::ALERT     => 1,
            self::CRITICAL  => 2,
            self::ERROR     => 3,
            self::WARNING   => 4,
            self::NOTICE    => 5,
            self::INFO      => 6,
            self::SUCCESS   => 7,
        ];

        $currentLevel = $levels[self::WARNING] ?? 4;
        $messageLevel = $levels[$level] ?? 7;

        return $messageLevel <= $currentLevel;
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
     * Log a notice message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function notice($message, array $context = [])
    {
        $this->log(self::NOTICE, $message, $context);
    }

    /**
     * Log an info message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function info($message, array $context = [])
    {
        $this->log(self::INFO, $message, $context);
    }

    /**
     * Log a debug message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function debug($message, array $context = [])
    {
        $this->log(self::DEBUG, $message, $context);
    }

    /**
     * Log a success message.
     *
     * @param  string  $message
     * @param  array   $context
     * @return void
     */
    public function success($message, array $context = [])
    {
        $this->log(self::SUCCESS, $message, $context);
    }
}
