<?php

namespace Jankx\Kernel\Strategies;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Strategy for WordPress AJAX context
 *
 * Handles AJAX requests through wp-admin/admin-ajax.php
 *
 * @package Jankx\Kernel\Strategies
 * @since 2.0.0
 */
class AjaxKernelStrategy extends KernelContextStrategy
{
    /**
     * Check if current context is WordPress AJAX
     *
     * @return bool
     * @since 2.0.0
     */
    public function canHandle(): bool
    {
        return defined('DOING_AJAX') && DOING_AJAX;
    }

    /**
     * Get AJAX context name
     *
     * @return string
     * @since 2.0.0
     */
    public function getContext(): string
    {
        return 'ajax';
    }

    /**
     * AJAX has high priority
     *
     * @return int
     * @since 2.0.0
     */
    public function getPriority(): int
    {
        return 5;
    }
}
