<?php

/**
 * Filter Renderer Interface
 *
 * Contract cho các filter renderer implementations
 * Strategy Pattern implementation
 *
 * @package Jankx\Layouts\AdvancedFilters\Contracts
 * @since 1.0.0
 */

namespace Jankx\Layouts\AdvancedFilters\Contracts;

interface FilterRendererInterface
{
    /**
     * Get filter type this renderer handles
     *
     * @return string
     */
    public function getFilterType(): string;

    /**
     * Check if renderer can handle this filter
     *
     * @param array $filter Filter configuration
     * @return bool
     */
    public function canHandle(array $filter): bool;

    /**
     * Render filter HTML
     *
     * @param array $filter Filter configuration
     * @param array $global_settings Global settings
     * @return void
     */
    public function render(array $filter, array $global_settings): void;
}

