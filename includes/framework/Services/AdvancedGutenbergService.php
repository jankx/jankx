<?php

/**
 * Advanced Gutenberg Service
 *
 * Manages responsive block extensions and advanced Gutenberg features
 *
 * @package CheepHub
 * @subpackage Framework
 * @since 1.0.0
 */

namespace Jankx\Framework\Services;

use Jankx\Gutenberg\Blocks\Advanced\ResponsiveBlockExtension;
use Jankx\Gutenberg\Blocks\Advanced\ResponsiveCSSGenerator;

class AdvancedGutenbergService
{
    /**
     * Responsive block extension instance
     */
    protected $responsiveExtension;
/**
     * CSS generator instance
     */
    protected $cssGenerator;
/**
     * Constructor
     */
    public function __construct()
    {
        $this->init();
    }

    /**
     * Initialize the service
     */
    protected function init()
    {
        // Initialize responsive block extension
        $this->responsiveExtension = new ResponsiveBlockExtension();
// Initialize CSS generator
        $this->cssGenerator = new ResponsiveCSSGenerator();
    }

    /**
     * Get responsive block extension instance
     */
    public function getResponsiveExtension()
    {
        return $this->responsiveExtension;
    }

    /**
     * Get CSS generator instance
     */
    public function getCSSGenerator()
    {
        return $this->cssGenerator;
    }

    /**
     * Check if responsive controls are enabled
     */
    public function isResponsiveEnabled()
    {
        return true;
// Always enabled for now
    }

    /**
     * Get extendable blocks list
     */
    public function getExtendableBlocks()
    {
        if ($this->responsiveExtension) {
            return $this->responsiveExtension->getResponsiveAttributes('core/heading');
        }
        return [];
    }

    /**
     * Check if a block has responsive attributes
     */
    public function hasResponsiveAttributes($blockName, $attributeName)
    {
        if ($this->responsiveExtension) {
            return $this->responsiveExtension->hasResponsiveAttributes($blockName, $attributeName);
        }
        return false;
    }

    /**
     * Get responsive attributes for a block
     */
    public function getResponsiveAttributes($blockName)
    {
        if ($this->responsiveExtension) {
            return $this->responsiveExtension->getResponsiveAttributes($blockName);
        }
        return [];
    }

    /**
     * Enable responsive controls for a specific block
     */
    public function enableResponsiveForBlock($blockName)
    {
        // This method can be used to dynamically enable/disable responsive controls
        // for specific blocks based on configuration or user preferences
        return true;
    }

    /**
     * Disable responsive controls for a specific block
     */
    public function disableResponsiveForBlock($blockName)
    {
        // This method can be used to dynamically disable responsive controls
        // for specific blocks based on configuration or user preferences
        return true;
    }

    /**
     * Get service configuration
     */
    public function getConfig()
    {
        return [
            'responsive_enabled' => $this->isResponsiveEnabled(),
            'extendable_blocks' => $this->getExtendableBlocks(),
            'breakpoints' => [
                'desktop' => 1024,
                'tablet' => 768,
                'mobile' => 480
            ]
        ];
    }
}
