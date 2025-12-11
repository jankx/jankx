<?php

namespace Jankx\Gutenberg\Blocks\DynamicDataLayout;

use Jankx\Layouts\DynamicDataLayout\DynamicDataLayoutManager;

/**
 * Attribute Sanitizer for Dynamic Data Layout Block
 *
 * Sanitizes block attributes based on selected layout
 *
 * @package Jankx\Gutenberg\Blocks\DynamicDataLayout
 * @since 2.0.0
 */
class AttributeSanitizer
{
    protected DynamicDataLayoutManager $layoutManager;

    public function __construct(DynamicDataLayoutManager $layoutManager)
    {
        $this->layoutManager = $layoutManager;
    }

    /**
     * Sanitize attributes for a specific layout
     *
     * @param string $layoutName Layout name
     * @param array $attributes Block attributes
     * @param bool $forRender Whether sanitizing for render (true) or editor (false)
     * @return array Sanitized attributes
     */
    public function sanitize(string $layoutName, array $attributes, bool $forRender = true): array
    {
        // Get layout instance to check supported options
        $postType = $attributes['postType'] ?? 'post';
        $layout = $this->layoutManager->createLayout($layoutName, $postType, []);
        
        if (!$layout) {
            return $attributes;
        }

        $layoutInstance = $layout->getLayout();
        
        // Get supported options from layout
        $supportedOptions = [];
        if (method_exists($layoutInstance, 'getSupportedOptions')) {
            $supportedOptions = $layoutInstance->getSupportedOptions();
        }

        // Sanitize based on layout type
        $sanitized = $attributes;

        // Grid/List/Card layouts
        if (in_array($layoutName, ['grid', 'list', 'card'])) {
            // Ensure columns are valid
            if (isset($sanitized['columns'])) {
                $sanitized['columns'] = max(1, min(6, (int) $sanitized['columns']));
            }
            if (isset($sanitized['columnsTablet'])) {
                $sanitized['columnsTablet'] = max(1, min(4, (int) $sanitized['columnsTablet']));
            }
            if (isset($sanitized['columnsMobile'])) {
                $sanitized['columnsMobile'] = max(1, min(2, (int) $sanitized['columnsMobile']));
            }
        }

        // Carousel layout
        if ($layoutName === 'carousel') {
            // Ensure carousel settings are valid
            if (isset($sanitized['slidesToScroll'])) {
                $sanitized['slidesToScroll'] = max(1, (int) $sanitized['slidesToScroll']);
            }
            if (isset($sanitized['autoplayDelay'])) {
                $sanitized['autoplayDelay'] = max(1000, (int) $sanitized['autoplayDelay']);
            }
        }

        // Ensure postsPerPage is valid
        if (isset($sanitized['postsPerPage'])) {
            $sanitized['postsPerPage'] = max(1, min(100, (int) $sanitized['postsPerPage']));
        }

        // Ensure offset is valid
        if (isset($sanitized['offset'])) {
            $sanitized['offset'] = max(0, (int) $sanitized['offset']);
        }

        return $sanitized;
    }
}

