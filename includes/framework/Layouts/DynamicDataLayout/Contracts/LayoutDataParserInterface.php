<?php

namespace Jankx\Layouts\DynamicDataLayout\Contracts;

/**
 * Interface LayoutDataParserInterface
 * 
 * Defines the contract for parsing layout-specific data into a format 
 * suitable for view templates.
 */
interface LayoutDataParserInterface
{
    /**
     * Parse layout data for the view
     * 
     * @return array
     */
    public function parse(): array;
}
