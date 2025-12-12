<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Layouts\AdvancedButton\ButtonRendererFactory;
use Jankx\Layouts\AdvancedButton\ContentExtractor;
use Jankx\Layouts\AdvancedButton\ButtonStyler;
use Jankx\Layouts\AdvancedButton\InnerBlocksHandler;
use Jankx\Layouts\AdvancedButton\WrapperRenderer;

/**
 * Advanced Button Block
 *
 * An enhanced button block with advanced styling and functionality options.
 * Uses Strategy Pattern for button rendering based on trigger type.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class AdvancedButtonBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/advanced-button';

    /**
     * Render the block content
     *
     * Uses Strategy Pattern to delegate rendering to specific renderers
     * based on trigger type. Matches JavaScript save function structure.
     *
     * @param array $attributes Block attributes
     * @param string $content Block content (HTML from save function)
     * @param \WP_Block $block Block instance
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        // Handle empty content with inner blocks (fallback case)
        if (empty($content) && $block && !empty($block->inner_blocks)) {
            $content = $this->renderFallbackContent($attributes, $block);
        }

        // Detect trigger type
        $triggerType = ButtonRendererFactory::detectTriggerType($attributes, $content);

        // Extract wrapper classes before processing
        $existingClasses = ContentExtractor::extractWrapperClasses($content);

        // Extract button content from wrapper div
        $buttonContent = ContentExtractor::extractButtonContent($content);

        // If content is empty or invalid, render using renderer
        if (empty($buttonContent) || !ContentExtractor::getButtonElement($buttonContent)) {
            $renderedButton = $this->renderFromScratch($attributes, $block, $triggerType);
        } else {
            // Content exists from JS save function, just apply PHP-specific processing
            $renderedButton = $this->processExistingContent($buttonContent, $attributes, $block, $triggerType);
        }

        // Render wrapper
        return WrapperRenderer::render($renderedButton, $attributes, $existingClasses);
    }

    /**
     * Render button from scratch when content is missing
     *
     * @param array $attributes Block attributes
     * @param \WP_Block|null $block Block instance
     * @param string $triggerType Trigger type
     * @return string Rendered button HTML
     */
    protected function renderFromScratch(array $attributes, ?\WP_Block $block, string $triggerType): string
    {
        // Render inner blocks
        $innerContent = '';
        if ($block && !empty($block->inner_blocks)) {
            $innerContent = InnerBlocksHandler::renderInnerBlocks($block);
        }

        // Build button content
        $text = $attributes['text'] ?? '';
        $showLabel = $attributes['showLabel'] ?? true;
        $buttonInnerContent = '';
        
        if ($showLabel && !empty($text)) {
            $buttonInnerContent .= '<span class="button-text">' . esc_html($text) . '</span>';
        }
        
        if (!empty($innerContent)) {
            $buttonInnerContent .= '<span class="button-icon-wrapper">' . $innerContent . '</span>';
        }

        // Build button classes and styles
        $buttonClasses = ButtonStyler::buildButtonClasses($attributes);
        $buttonStyles = ButtonStyler::buildButtonStyles($attributes);

        // Render using appropriate renderer
        $renderer = ButtonRendererFactory::create($triggerType);
        
        return $renderer->render($attributes, $buttonInnerContent, $buttonClasses, $buttonStyles);
    }

    /**
     * Process existing content from JS save function
     *
     * @param string $buttonContent Button content HTML
     * @param array $attributes Block attributes
     * @param \WP_Block|null $block Block instance
     * @param string $triggerType Trigger type
     * @return string Processed button HTML
     */
    protected function processExistingContent(string $buttonContent, array $attributes, ?\WP_Block $block, string $triggerType): string
    {
        // Inject inner blocks if missing
        if ($block && !ContentExtractor::hasInnerBlocks($buttonContent)) {
            $buttonContent = InnerBlocksHandler::injectInnerBlocks($buttonContent, $block, $attributes);
        }

        // Apply PHP-specific processing based on trigger type
        // For detail-link and modal, use renderers to handle placeholders
        if ($triggerType === 'detail-link') {
            $renderer = new \Jankx\Layouts\AdvancedButton\DetailLinkRenderer();
            $innerContent = $this->extractButtonInnerContent($buttonContent);
            $buttonElement = ContentExtractor::getButtonElement($buttonContent);
            
            if ($buttonElement) {
                // Extract existing classes and styles
                preg_match('/class="([^"]*)"/', $buttonElement['full'], $classMatches);
                $classes = $classMatches[1] ?? '';
                preg_match('/style="([^"]*)"/', $buttonElement['other_attrs'], $styleMatches);
                $existingStylesString = $styleMatches[1] ?? '';
                
                // Parse styles
                $styles = $this->parseStylesString($existingStylesString);
                $attributeStyles = ButtonStyler::buildButtonStyles($attributes);
                $styles = array_merge($styles, $attributeStyles);
                
                return $renderer->render($attributes, $innerContent, $classes, $styles);
            }
        } elseif ($triggerType === 'modal') {
            $renderer = new \Jankx\Layouts\AdvancedButton\ModalRenderer();
            $innerContent = $this->extractButtonInnerContent($buttonContent);
            $buttonElement = ContentExtractor::getButtonElement($buttonContent);
            
            if ($buttonElement) {
                // Extract existing classes and styles
                preg_match('/class="([^"]*)"/', $buttonElement['full'], $classMatches);
                $classes = $classMatches[1] ?? '';
                preg_match('/style="([^"]*)"/', $buttonElement['other_attrs'], $styleMatches);
                $existingStylesString = $styleMatches[1] ?? '';
                
                // Parse styles
                $styles = $this->parseStylesString($existingStylesString);
                $attributeStyles = ButtonStyler::buildButtonStyles($attributes);
                $styles = array_merge($styles, $attributeStyles);
                
                return $renderer->render($attributes, $innerContent, $classes, $styles);
            }
        }

        // For link and button, just apply styling to existing content
        $existingClasses = ContentExtractor::extractWrapperClasses($buttonContent);
        return $this->applyStyling($buttonContent, $attributes, $existingClasses);
    }

    /**
     * Parse styles string into array
     *
     * @param string $stylesString Styles string
     * @return array Styles array
     */
    protected function parseStylesString(string $stylesString): array
    {
        $styles = [];
        
        if (empty($stylesString)) {
            return $styles;
        }

        foreach (explode(';', $stylesString) as $style) {
            $style = trim($style);
            if (strpos($style, ':') !== false) {
                [$prop, $value] = explode(':', $style, 2);
                $styles[trim($prop)] = trim($value);
            }
        }

        return $styles;
    }

    /**
     * Render fallback content when content is empty
     *
     * @param array $attributes Block attributes
     * @param \WP_Block $block Block instance
     * @return string Fallback HTML content
     */
    protected function renderFallbackContent(array $attributes, \WP_Block $block): string
    {
        $innerContent = InnerBlocksHandler::renderInnerBlocks($block);
        
        if (empty($innerContent)) {
            return '';
        }

                    $text = $attributes['text'] ?? '';
                    $showLabel = $attributes['showLabel'] ?? true;
        $buttonText = ($showLabel && !empty($text)) ? '<span class="button-text">' . esc_html($text) . '</span>' : '';
        
        return sprintf(
            '<a class="jankx-advanced-button__link" href="%s" data-trigger-type="link">%s<span class="button-icon-wrapper">%s</span></a>',
            esc_url($attributes['url'] ?? '#'),
            $buttonText,
            $innerContent
        );
    }

    /**
     * Apply styling to button content
     *
     * @param string $content Button content HTML
     * @param array $attributes Block attributes
     * @param array $existingClasses Existing wrapper classes
     * @return string Updated content
     */
    protected function applyStyling(string $content, array $attributes, array $existingClasses): string
    {
        // Check background color and outline mode
        $hasBackgroundColor = ButtonStyler::hasBackgroundColor($attributes, $content);
        $isOutlineMode = ButtonStyler::isOutlineMode($existingClasses);

        // Apply default colors if needed
        $content = ButtonStyler::applyDefaultColors(
            $content,
            $attributes,
            $isOutlineMode,
            $hasBackgroundColor
        );

        // Apply border radius
        $borderRadius = ButtonStyler::getBorderRadius($attributes, $content);
        if ($borderRadius) {
            $content = ButtonStyler::applyBorderRadius($content, $borderRadius);
        }

        return $content;
    }

    /**
     * Extract inner content from button element
     *
     * @param string $buttonContent Full button HTML
     * @return string Inner content (text and icon wrapper)
     */
    protected function extractButtonInnerContent(string $buttonContent): string
    {
        // Extract content between opening and closing tags
        if (preg_match('/<(a|button)[^>]*>(.*?)<\/(a|button)>/s', $buttonContent, $matches)) {
            return $matches[2];
        }

        // If no match, return as-is (should not happen with valid HTML)
        return $buttonContent;
    }

    /**
     * Apply post-processing to rendered button
     *
     * Ensures all styles are correctly applied after renderer processes it
     *
     * @param string $renderedButton Rendered button HTML
     * @param string $originalContent Original button content (for reference)
     * @param array $attributes Block attributes
     * @return string Updated button HTML
     */
    protected function applyPostProcessing(string $renderedButton, string $originalContent, array $attributes): string
    {
        // Ensure border radius is applied (in case renderer didn't apply it)
        $borderRadius = ButtonStyler::getBorderRadius($attributes, $renderedButton);
        if ($borderRadius) {
            $renderedButton = ButtonStyler::applyBorderRadius($renderedButton, $borderRadius);
        }

        return $renderedButton;
    }
}
