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
     * Check if this strategy can handle the current context
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
     * CLI has high priority
     *
     * @return int
     */
    public function getPriority(): int
    {
        return 1;
    }
}
