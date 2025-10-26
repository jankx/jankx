<?php

namespace Jankx\Foundation\Log;

use Jankx\Contracts\LoggerInterface;

/**
 * Telegram Logger
 *
 * Send logs to Telegram bot for real-time monitoring on production servers
 *
 * Configuration in wp-config.php:
 * define('JANKX_TELEGRAM_BOT_TOKEN', 'your-bot-token');
 * define('JANKX_TELEGRAM_CHAT_ID', 'your-chat-id');
 *
 * @package Jankx\Foundation\Log
 */
class TelegramLogger implements LoggerInterface
{
    /**
     * Telegram API URL
     *
     * @var string
     */
    protected $apiUrl = 'https://api.telegram.org/bot';

    /**
     * Bot token
     *
     * @var string|null
     */
    protected $botToken;

    /**
     * Chat ID
     *
     * @var string|null
     */
    protected $chatId;

    /**
     * Enabled flag
     *
     * @var bool
     */
    protected $enabled = false;

    /**
     * Constructor
     *
     * Note: JANKX_USE_TELEGRAM_LOGGER should be checked before instantiating this class
     */
    public function __construct()
    {
        $this->botToken = defined('JANKX_TELEGRAM_BOT_TOKEN') ? \JANKX_TELEGRAM_BOT_TOKEN : null;
        $this->chatId = defined('JANKX_TELEGRAM_CHAT_ID') ? \JANKX_TELEGRAM_CHAT_ID : null;

        // Only enable if both token and chat ID are configured
        $this->enabled = !empty($this->botToken) && !empty($this->chatId);
    }

    /**
     * Check if logger is enabled
     *
     * @return bool
     */
    public function isEnabled(): bool
    {
        return $this->enabled;
    }

    /**
     * Send message to Telegram
     *
     * @param string $message Message text
     * @param string $level Log level
     * @return bool
     */
    protected function sendMessage(string $message, string $level = 'INFO'): bool
    {
        if (!$this->enabled) {
            return false;
        }

        // Format message with emoji based on level
        $emoji = $this->getLevelEmoji($level);
        $formattedMessage = sprintf(
            "%s *%s*\n\n%s\n\n_Time:_ %s\n_Server:_ %s",
            $emoji,
            strtoupper($level),
            $message,
            current_time('Y-m-d H:i:s'),
            $_SERVER['HTTP_HOST'] ?? 'localhost'
        );

        $url = $this->apiUrl . $this->botToken . '/sendMessage';

        $data = [
            'chat_id' => $this->chatId,
            'text' => $formattedMessage,
            'parse_mode' => 'Markdown',
        ];

        // Use wp_remote_post for WordPress compatibility
        $response = wp_remote_post($url, [
            'body' => $data,
            'timeout' => 5,
            'blocking' => false, // Non-blocking to avoid slowing down the site
        ]);

        return !is_wp_error($response);
    }

    /**
     * Get emoji for log level
     *
     * @param string $level Log level
     * @return string
     */
    protected function getLevelEmoji(string $level): string
    {
        $emojis = [
            'debug' => '🔍',
            'info' => 'ℹ️',
            'notice' => '📢',
            'warning' => '⚠️',
            'error' => '❌',
            'critical' => '🚨',
            'alert' => '🔴',
            'emergency' => '💥',
        ];

        return $emojis[strtolower($level)] ?? 'ℹ️';
    }

    /**
     * Format context array to readable string
     *
     * @param array $context Context data
     * @return string
     */
    protected function formatContext(array $context): string
    {
        if (empty($context)) {
            return '';
        }

        $lines = [];
        foreach ($context as $key => $value) {
            if (is_array($value)) {
                $value = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            } elseif (is_bool($value)) {
                $value = $value ? 'true' : 'false';
            } elseif (is_null($value)) {
                $value = 'null';
            }

            $lines[] = sprintf('• *%s:* %s', $key, $value);
        }

        return "\n" . implode("\n", $lines);
    }

    /**
     * {@inheritDoc}
     */
    public function emergency($message, array $context = [])
    {
        $fullMessage = $message . $this->formatContext($context);
        $this->sendMessage($fullMessage, 'emergency');
    }

    /**
     * {@inheritDoc}
     */
    public function alert($message, array $context = [])
    {
        $fullMessage = $message . $this->formatContext($context);
        $this->sendMessage($fullMessage, 'alert');
    }

    /**
     * {@inheritDoc}
     */
    public function critical($message, array $context = [])
    {
        $fullMessage = $message . $this->formatContext($context);
        $this->sendMessage($fullMessage, 'critical');
    }

    /**
     * {@inheritDoc}
     */
    public function error($message, array $context = [])
    {
        $fullMessage = $message . $this->formatContext($context);
        $this->sendMessage($fullMessage, 'error');
    }

    /**
     * {@inheritDoc}
     */
    public function warning($message, array $context = [])
    {
        $fullMessage = $message . $this->formatContext($context);
        $this->sendMessage($fullMessage, 'warning');
    }

    /**
     * {@inheritDoc}
     */
    public function notice($message, array $context = [])
    {
        $fullMessage = $message . $this->formatContext($context);
        $this->sendMessage($fullMessage, 'notice');
    }

    /**
     * {@inheritDoc}
     */
    public function info($message, array $context = [])
    {
        // Only send if JANKX_LOG_ALL is enabled
        if (!defined('JANKX_LOG_ALL') || !\JANKX_LOG_ALL) {
            return;
        }

        $fullMessage = $message . $this->formatContext($context);
        $this->sendMessage($fullMessage, 'info');
    }

    /**
     * {@inheritDoc}
     */
    public function debug($message, array $context = [])
    {
        // Only send if JANKX_LOG_ALL is enabled
        if (!defined('JANKX_LOG_ALL') || !\JANKX_LOG_ALL) {
            return;
        }

        $fullMessage = $message . $this->formatContext($context);
        $this->sendMessage($fullMessage, 'debug');
    }

    /**
     * {@inheritDoc}
     */
    public function log($level, $message, array $context = [])
    {
        $method = strtolower($level);
        if (method_exists($this, $method)) {
            $this->$method($message, $context);
        }
    }
}

