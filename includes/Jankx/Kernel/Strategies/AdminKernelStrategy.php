<?php

namespace Jankx\Kernel\Strategies;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Strategy for Admin context
 *
 * @package Jankx\Kernel\Strategies
 * @since 2.0.0
 */
class AdminKernelStrategy extends KernelContextStrategy
{
    /**
     * Check if current context is Admin
     *
     * @return bool
     * @since 2.0.0
     */
    public function canHandle(): bool
    {
        return is_admin();
    }

    /**
     * Get Admin context name
     *
     * @return string
     * @since 2.0.0
     */
    public function getContext(): string
    {
        return 'admin';
    }

    /**
     * Admin has medium priority
     *
     * @return int
     * @since 2.0.0
     */
    public function getPriority(): int
    {
        return 40;
    }
}
