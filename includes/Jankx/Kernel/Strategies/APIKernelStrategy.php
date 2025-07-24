<?php

namespace Jankx\Kernel\Strategies;

/**
 * Strategy for API context
 *
 * @package Jankx\Kernel\Strategies
 */
class APIKernelStrategy extends KernelContextStrategy
{
    /**
     * Check if current context is API
     *
     * @return bool
     */
    public function canHandle(): bool
    {
        return defined('REST_REQUEST') && REST_REQUEST;
    }

    /**
     * Get API context name
     *
     * @return string
     */
    public function getContext(): string
    {
        return 'api';
    }

    /**
     * API has medium priority
     *
     * @return int
     */
    public function getPriority(): int
    {
        return 30;
    }
}