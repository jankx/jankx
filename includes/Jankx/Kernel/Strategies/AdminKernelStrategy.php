<?php

namespace Jankx\Kernel\Strategies;

/**
 * Strategy for Admin context
 *
 * @package Jankx\Kernel\Strategies
 */
class AdminKernelStrategy extends KernelContextStrategy
{
    /**
     * Check if current context is Admin
     *
     * @return bool
     */
    public function canHandle(): bool
    {
        return is_admin();
    }

    /**
     * Get Admin context name
     *
     * @return string
     */
    public function getContext(): string
    {
        return 'admin';
    }

    /**
     * Admin has medium priority
     *
     * @return int
     */
    public function getPriority(): int
    {
        return 40;
    }
}
