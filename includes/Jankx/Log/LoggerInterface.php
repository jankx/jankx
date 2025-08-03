<?php

namespace Jankx\Log;

/**
 * Logger Handler Interface
 *
 * @package Jankx\Log
 * @since 2.0.0
 */
interface LoggerInterface
{
    /**
     * Set next handler in chain
     *
     * @param LoggerInterface $handler
     * @return LoggerInterface
     */
    public function setNext(LoggerInterface $handler): LoggerInterface;

    /**
     * Handle log message
     *
     * @param string $level
     * @param string $message
     * @param array $context
     * @return bool
     */
    public function handle(string $level, string $message, array $context = []): bool;

    /**
     * Check if handler can handle this log level
     *
     * @param string $level
     * @return bool
     */
    public function canHandle(string $level): bool;
}
