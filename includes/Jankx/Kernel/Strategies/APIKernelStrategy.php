<?php

namespace Jankx\Kernel\Strategies;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Strategy for API context
 *
 * @package Jankx\Kernel\Strategies
 * @since 2.0.0
 */
class APIKernelStrategy extends KernelContextStrategy
{
    /**
     * Check if current context is API
     *
     * @return bool
     * @since 2.0.0
     */
    public function canHandle(): bool
    {
        return defined('REST_REQUEST') && REST_REQUEST;
    }

    /**
     * Get API context name
     *
     * @return string
     * @since 2.0.0
     */
    public function getContext(): string
    {
        return 'api';
    }

    /**
     * API has medium priority
     *
     * @return int
     * @since 2.0.0
     */
    public function getPriority(): int
    {
        return 30;
    }
}
