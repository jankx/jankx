<?php

namespace Jankx\Kernel\Strategies;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Strategy for CLI context
 *
 * @package Jankx\Kernel\Strategies
 * @since 2.0.0
 */
class CLIKernelStrategy extends KernelContextStrategy
{
    /**
     * Check if this strategy can handle the current context
     *
     * @return bool
     * @since 2.0.0
     */
    public function canHandle(): bool
    {
        return defined('WP_CLI') && WP_CLI;
    }

    /**
     * Get CLI context name
     *
     * @return string
     * @since 2.0.0
     */
    public function getContext(): string
    {
        return 'cli';
    }

    /**
     * CLI has high priority
     *
     * @return int
     * @since 2.0.0
     */
    public function getPriority(): int
    {
        return 1;
    }
}
