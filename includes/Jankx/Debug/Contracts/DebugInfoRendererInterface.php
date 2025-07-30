<?php

namespace Jankx\Debug\Contracts;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Debug Info Renderer Interface
 *
 * @package Jankx\Debug\Contracts
 * @since 2.0.0
 */
interface DebugInfoRendererInterface
{
    /**
     * Render debug information
     *
     * @param array $debugData
     * @return string
     * @since 2.0.0
     */
    public function render(array $debugData): string;
}
