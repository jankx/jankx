<?php

namespace Jankx\Kernel\Strategies;

/**
 * Strategy for WordPress AJAX context
 *
 * Handles AJAX requests through wp-admin/admin-ajax.php
 *
 * @package Jankx\Kernel\Strategies
 */
class AjaxKernelStrategy extends KernelContextStrategy
{
    /**
     * Check if current context is WordPress AJAX
     *
     * @return bool
     */
    public function canHandle(): bool
    {
        return defined('DOING_AJAX') && DOING_AJAX;
    }

    /**
     * Get AJAX context name
     *
     * @return string
     */
    public function getContext(): string
    {
        return 'ajax';
    }

    /**
     * AJAX has high priority
     *
     * @return int
     */
    public function getPriority(): int
    {
        return 5;
    }
}
