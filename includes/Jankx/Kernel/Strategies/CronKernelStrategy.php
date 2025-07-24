<?php

namespace Jankx\Kernel\Strategies;

/**
 * Strategy for Cron context
 *
 * @package Jankx\Kernel\Strategies
 */
class CronKernelStrategy extends KernelContextStrategy
{
    /**
     * Check if current context is Cron
     *
     * @return bool
     */
    public function canHandle(): bool
    {
        return wp_doing_cron();
    }

    /**
     * Get Cron context name
     *
     * @return string
     */
    public function getContext(): string
    {
        return 'cron';
    }

    /**
     * Cron has medium priority
     *
     * @return int
     */
    public function getPriority(): int
    {
        return 20;
    }
}