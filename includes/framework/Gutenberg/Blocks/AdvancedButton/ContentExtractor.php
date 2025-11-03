<?php

namespace Jankx\Gutenberg\Blocks\AdvancedButton;

/**
 * Content Extractor
 *
 * Extracts and processes button content from HTML
 * Removes wrapper divs and extracts inner content
 *
 * @package Jankx\Gutenberg\Blocks\AdvancedButton
 */
class ContentExtractor
{
    /**
     * Extract button content from wrapper div
     *
     * @param string $content Full HTML content
     * @return string Extracted button content
     */
    public static function extractButtonContent(string $content): string
    {
        // Remove wrapper div but preserve all content inside
        // Match opening wrapper div and remove it
        $content = preg_replace('/<div[^>]*class="[^"]*wp-block-jankx-advanced-button[^"]*"[^>]*>/', '', $content);
        // Match closing wrapper div at the end and remove it
        $content = preg_replace('/<\/div>\s*$/', '', $content);

        return trim($content);
    }

    /**
     * Extract existing wrapper classes from content
     *
     * @param string $content Full HTML content
     * @return array Array of class names
     */
    public static function extractWrapperClasses(string $content): array
    {
        $classes = [];
        
        if (preg_match('/<div[^>]*class="([^"]*)"[^>]*>/', $content, $matches)) {
            $classes = array_filter(explode(' ', $matches[1]));
        }

        return $classes;
    }

    /**
     * Check if content has inner blocks
     *
     * @param string $content Button content
     * @return bool True if has inner blocks
     */
    public static function hasInnerBlocks(string $content): bool
    {
        if (preg_match('/<span[^>]*class="[^"]*button-icon-wrapper[^"]*"[^>]*>.*?<\/span>/s', $content, $wrapper_match)) {
            // Check if wrapper has content (not just empty or whitespace)
            $wrapper_content = preg_replace('/<[^>]+>/', '', $wrapper_match[0]);
            return !empty(trim($wrapper_content));
        }

        return false;
    }

    /**
     * Get button element from content
     *
     * @param string $content Button content
     * @return array|null Button matches array or null
     */
    public static function getButtonElement(string $content): ?array
    {
        if (preg_match('/<(a|button)([^>]*class="[^"]*jankx-advanced-button__link[^"]*")([^>]*)>/', $content, $matches)) {
            return [
                'tag' => $matches[1],
                'class_attr' => $matches[2],
                'other_attrs' => $matches[3],
                'full' => $matches[0],
            ];
        }

        return null;
    }
}

