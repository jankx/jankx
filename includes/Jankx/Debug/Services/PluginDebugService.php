<?php

namespace Jankx\Debug\Services;

use Jankx\Debug\Contracts\PluginDebugInterface;

/**
 * Plugin Debug Service
 *
 * Manages plugin debug information collection and storage
 *
 * @package Jankx\Debug\Services
 * @since 2.0.0
 */
class PluginDebugService implements PluginDebugInterface
{
    /**
     * @var array
     * @since 2.0.0
     */
    private $pluginDebugInfo = [];

    /**
     * Capture plugin debug information
     *
     * @since 2.0.0
     */
    public function captureInfo(): void
    {
        // Allow plugins to add their debug info via action hook
        do_action('jankx/debug/collect_plugin_info', $this);
    }

    /**
     * Get plugin debug information
     *
     * @return array
     * @since 2.0.0
     */
    public function getPluginDebugInfo(): array
    {
        return $this->pluginDebugInfo;
    }

    /**
     * Add plugin debug info
     *
     * @param string $pluginName
     * @param string $info
     * @since 2.0.0
     */
    public function addDebugInfo(string $pluginName, string $info): void
    {
        $this->pluginDebugInfo[$pluginName] = $info;
    }
}
