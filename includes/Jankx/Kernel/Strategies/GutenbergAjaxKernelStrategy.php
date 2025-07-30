<?php

namespace Jankx\Kernel\Strategies;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Strategy for Gutenberg AJAX context
 *
 * @package Jankx\Kernel\Strategies
 * @since 2.0.0
 */
class GutenbergAjaxKernelStrategy extends KernelContextStrategy
{
    /**
     * Check if current context is Gutenberg AJAX
     *
     * @return bool
     * @since 2.0.0
     */
    public function canHandle(): bool
    {
        if (!defined('DOING_AJAX') || !DOING_AJAX) {
            return false;
        }

        $action = sanitize_text_field($_POST['action']) ?? sanitize_text_field($_GET['action']) ?? '';
        return strpos($action, 'jankx/gutenberg') === 0;
    }

    /**
     * Get Gutenberg AJAX context name
     *
     * @return string
     * @since 2.0.0
     */
    public function getContext(): string
    {
        return 'gutenberg-ajax';
    }

    /**
     * Gutenberg AJAX has high priority
     *
     * @return int
     * @since 2.0.0
     */
    public function getPriority(): int
    {
        return 10;
    }
}
