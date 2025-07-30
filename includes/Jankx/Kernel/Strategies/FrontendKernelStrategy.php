<?php

namespace Jankx\Kernel\Strategies;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Strategy for Frontend context (default fallback)
 *
 * @package Jankx\Kernel\Strategies
 * @since 2.0.0
 */
class FrontendKernelStrategy extends KernelContextStrategy
{
    /**
     * Frontend strategy always returns true as it's the default fallback
     *
     * @return bool
     * @since 2.0.0
     */
    public function canHandle(): bool
    {
        return true; // Always true as default fallback
    }

    /**
     * Get Frontend context name
     *
     * @return string
     * @since 2.0.0
     */
    public function getContext(): string
    {
        return 'frontend';
    }

    /**
     * Frontend has lowest priority as it's the default fallback
     *
     * @return int
     * @since 2.0.0
     */
    public function getPriority(): int
    {
        return 100;
    }
}
