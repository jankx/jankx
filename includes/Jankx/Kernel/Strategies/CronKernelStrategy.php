<?php

namespace Jankx\Kernel\Strategies;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Strategy for Cron context
 *
 * @package Jankx\Kernel\Strategies
 * @since 2.0.0
 */
class CronKernelStrategy extends KernelContextStrategy
{
    /**
     * Check if current context is Cron
     *
     * @return bool
     * @since 2.0.0
     */
    public function canHandle(): bool
    {
        $isCron = wp_doing_cron();

        // Debug logging
        if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
            \Jankx\Facades\Logger::debug("CronKernelStrategy: wp_doing_cron() = " . ($isCron ? 'true' : 'false'));
        }

        return $isCron;
    }

    /**
     * Get Cron context name
     *
     * @return string
     * @since 2.0.0
     */
    public function getContext(): string
    {
        return 'cron';
    }

    /**
     * Cron has medium priority
     *
     * @return int
     * @since 2.0.0
     */
    public function getPriority(): int
    {
        return 20;
    }
}
