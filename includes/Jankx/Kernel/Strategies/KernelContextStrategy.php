<?php

namespace Jankx\Kernel\Strategies;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Abstract base class for kernel context strategies
 *
 * @package Jankx\Kernel\Strategies
 * @since 2.0.0
 */
abstract class KernelContextStrategy
{
    /**
     * Check if this strategy can handle the current context
     *
     * @return bool
     * @since 2.0.0
     */
    abstract public function canHandle(): bool;

    /**
     * Get the context name for this strategy
     *
     * @return string
     * @since 2.0.0
     */
    abstract public function getContext(): string;

    /**
     * Get priority for this strategy (lower number = higher priority)
     *
     * @return int
     * @since 2.0.0
     */
    public function getPriority(): int
    {
        return 100; // Default priority
    }
}
