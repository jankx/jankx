<?php

namespace Jankx\Debug\Contracts;

/**
 * Debug Info Renderer Interface
 *
 * @package Jankx\Debug\Contracts
 * @since 2.0.1
 */
interface DebugInfoRendererInterface
{
    /**
     * Render debug information
     *
     * @param array $debugData
     * @return string
     * @since 2.0.1
     */
    public function render(array $debugData): string;
}