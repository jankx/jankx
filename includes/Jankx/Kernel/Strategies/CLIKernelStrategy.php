<?php

namespace Jankx\Kernel\Strategies;

/**
 * Strategy for CLI context
 *
 * @package Jankx\Kernel\Strategies
 */
class CLIKernelStrategy extends KernelContextStrategy
{
    /**
     * Check if current context is CLI
     *
     * @return bool
     */
    public function canHandle(): bool
    {
        return defined('WP_CLI') && WP_CLI;
    }

    /**
     * Get CLI context name
     *
     * @return string
     */
    public function getContext(): string
    {
        return 'cli';
    }

    /**
     * CLI has highest priority
     *
     * @return int
     */
    public function getPriority(): int
    {
        return 1;
    }
}