<?php

namespace Jankx\Kernel\Strategies;

/**
 * Abstract base class for kernel context strategies
 *
 * @package Jankx\Kernel\Strategies
 */
abstract class KernelContextStrategy
{
    /**
     * Check if this strategy can handle the current context
     *
     * @return bool
     */
    abstract public function canHandle(): bool;

    /**
     * Get the context name for this strategy
     *
     * @return string
     */
    abstract public function getContext(): string;

    /**
     * Get priority for this strategy (lower number = higher priority)
     *
     * @return int
     */
    public function getPriority(): int
    {
        return 100; // Default priority
    }
}
