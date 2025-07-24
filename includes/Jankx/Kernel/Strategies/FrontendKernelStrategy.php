<?php

namespace Jankx\Kernel\Strategies;

/**
 * Strategy for Frontend context (default fallback)
 *
 * @package Jankx\Kernel\Strategies
 */
class FrontendKernelStrategy extends KernelContextStrategy
{
    /**
     * Frontend strategy always returns true as it's the default fallback
     *
     * @return bool
     */
    public function canHandle(): bool
    {
        return true; // Always true as default fallback
    }

    /**
     * Get Frontend context name
     *
     * @return string
     */
    public function getContext(): string
    {
        return 'frontend';
    }

    /**
     * Frontend has lowest priority as it's the default fallback
     *
     * @return int
     */
    public function getPriority(): int
    {
        return 100;
    }
}