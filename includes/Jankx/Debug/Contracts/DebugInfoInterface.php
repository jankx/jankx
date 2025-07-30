<?php

namespace Jankx\Debug\Contracts;

/**
 * Debug Info Interface
 *
 * @package Jankx\Debug\Contracts
 * @since 2.0.0
 */
interface DebugInfoInterface
{
    /**
     * Initialize debug tracking
     *
     * @since 2.0.0
     */
    public function init(): void;

    /**
     * Display debug information
     *
     * @since 2.0.0
     */
    public function displayDebugInfo(): void;

    /**
     * Get debug info for testing
     *
     * @return array
     * @since 2.0.0
     */
    public function getDebugInfo(): array;

    /**
     * Get query count for testing
     *
     * @return int
     * @since 2.0.0
     */
    public function getQueryCountForTesting(): int;

    /**
     * Add plugin debug info
     *
     * @param string $pluginName
     * @param string $info
     * @since 2.0.0
     */
    public function addPluginDebugInfo(string $pluginName, string $info): void;
}
