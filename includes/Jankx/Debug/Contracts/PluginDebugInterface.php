<?php

namespace Jankx\Debug\Contracts;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Plugin Debug Interface
 *
 * @package Jankx\Debug\Contracts
 * @since 2.0.0
 */
interface PluginDebugInterface
{
    /**
     * Capture plugin debug information
     *
     * @since 2.0.0
     */
    public function captureInfo(): void;

    /**
     * Get plugin debug information
     *
     * @return array
     * @since 2.0.0
     */
    public function getPluginDebugInfo(): array;

    /**
     * Add plugin debug info
     *
     * @param string $pluginName
     * @param string $info
     * @since 2.0.0
     */
    public function addDebugInfo(string $pluginName, string $info): void;
}
