<?php

namespace Jankx\Foundation\Log;

use Jankx\Contracts\LoggerInterface;

class Logger implements LoggerInterface
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
     * Telegram logger instance
     *
     * @var TelegramLogger|null
     */
    protected $telegramLogger = null;

    /**
     * Constructor
     */
    public function __construct()
    {
        // Initialize Telegram logger if enabled via config
        if (defined('JANKX_USE_TELEGRAM_LOGGER') && \JANKX_USE_TELEGRAM_LOGGER) {
            $telegramLogger = new TelegramLogger();
            if ($telegramLogger->isEnabled()) {
                $this->telegramLogger = $telegramLogger;
            }
        }
    }


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
        $this->writeLog($level, $message, $context);
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

        // Also send to Telegram if available
        if ($this->telegramLogger) {
            $this->telegramLogger->log($level, $message, $context);
        }
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
