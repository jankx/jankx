<?php

namespace Jankx\Services\FontIcons\Transformers;

class GenericIconTransformer extends CssToJsonTransformer
{
        /**
     * Transform CSS content to JSON metadata
     */
    public function transform($cssContent)
    {

        $this->cssContent = $cssContent;

        // Extract icon classes
                $iconClasses = $this->extractIconClasses($cssContent);

        // Extract font information
                $fontInfo = $this->extractFontInfo($cssContent);

        // Generate metadata
                $metadata = [
            'type' => $this->iconType,
            'version' => $this->extractVersion($cssContent),
            'font_family' => $fontInfo['font_family'] ?? 'Unknown',
            'prefixes' => $this->extractPrefixes($iconClasses),
            'categories' => $this->extractCategories($iconClasses),
            'icons' => $this->formatIcons($iconClasses),
            'metadata' => [
                'parsed_at' => current_time('mysql'),
                'source' => 'css_parser',
                'total_icons' => count($iconClasses)
            ]
                ];


                return $metadata;
    }

    /**
     * Extract font information from CSS
     */
    protected function extractFontInfo($cssContent)
    {
        $fontInfo = [];

        // Extract @font-face information
        if (preg_match('/@font-face\s*\{[^}]*font-family:\s*["\']([^"\']+)["\'][^}]*\}/', $cssContent, $matches)) {
            $fontInfo['font_family'] = $matches[1];
        }

        return $fontInfo;
    }

    /**
     * Extract version from CSS
     */
    protected function extractVersion($cssContent)
    {
        // Look for version in comments or URLs
        if (preg_match('/version\s*[=:]\s*([0-9.]+)/i', $cssContent, $matches)) {
            return $matches[1];
        }

        if (preg_match('/v=([0-9.]+)/', $cssContent, $matches)) {
            return $matches[1];
        }

        return '1.0.0';
    }

    /**
     * Extract prefixes from icon classes
     */
    protected function extractPrefixes($iconClasses)
    {
        $prefixes = [];

        foreach ($iconClasses as $icon) {
            $className = $icon['name'];

            // Extract prefix (e.g., 'el' from 'el-home')
            if (preg_match('/^([a-zA-Z]+)-/', $className, $matches)) {
                $prefix = $matches[1];
                if (!in_array($prefix, $prefixes)) {
                    $prefixes[] = $prefix;
                }
            }
        }

        // If no prefixes found, use icon type as default
        if (empty($prefixes)) {
            $prefixes[] = $this->iconType;
        }

        return $prefixes;
    }

    /**
     * Extract categories from icon classes
     */
    protected function extractCategories($iconClasses)
    {
        $categories = [];

        foreach ($iconClasses as $icon) {
            $category = $icon['category'];
            if (!in_array($category, $categories)) {
                $categories[] = $category;
            }
        }

        return $categories;
    }

    /**
     * Format icons for output
     */
    protected function formatIcons($iconClasses)
    {
        $formattedIcons = [];

        foreach ($iconClasses as $icon) {
            $formattedIcons[] = [
                'name' => $icon['name'],
                'category' => $icon['category'],
                'unicode' => $this->extractUnicode($icon['content']),
                'prefixes' => $this->getPrefixesForIcon($icon['name'])
            ];
        }

        return $formattedIcons;
    }

    /**
     * Extract unicode from content
     */
    protected function extractUnicode($content)
    {
        // Remove quotes and backslashes
        $content = trim($content, '"\'');

        // Convert hex to unicode
        if (preg_match('/^\\\\([0-9a-fA-F]{4})/', $content, $matches)) {
            return $matches[1];
        }

        // If no hex found, return content as is
        return $content;
    }

    /**
     * Get prefixes for specific icon
     */
    protected function getPrefixesForIcon($iconName)
    {
        $prefixes = [];

        // Extract prefix from icon name
        if (preg_match('/^([a-zA-Z]+)-/', $iconName, $matches)) {
            $prefixes[] = $matches[1];
        }

        // Add icon type as fallback
        if (empty($prefixes)) {
            $prefixes[] = $this->iconType;
        }

        return $prefixes;
    }
}
