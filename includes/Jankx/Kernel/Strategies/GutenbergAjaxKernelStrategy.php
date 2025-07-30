<?php

namespace Jankx\Kernel\Strategies;

/**
 * Strategy for Gutenberg AJAX context
 *
 * @package Jankx\Kernel\Strategies
 */
class GutenbergAjaxKernelStrategy extends KernelContextStrategy
{
    /**
     * Check if current context is Gutenberg AJAX
     *
     * @return bool
     */
    public function canHandle(): bool
    {
        if (!defined('DOING_AJAX') || !DOING_AJAX) {
            return false;
        }

        $action = $_POST['action'] ?? $_GET['action'] ?? '';
        return strpos($action, 'jankx/gutenberg') === 0;
    }

    /**
     * Get Gutenberg AJAX context name
     *
     * @return string
     */
    public function getContext(): string
    {
        return 'gutenberg-ajax';
    }

    /**
     * Gutenberg AJAX has high priority
     *
     * @return int
     */
    public function getPriority(): int
    {
        return 10;
    }
}
