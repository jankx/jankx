<?php

namespace Jankx\Services\FontIcons\Transformers;

class FontAwesomeTransformer extends CssToJsonTransformer
{
    protected $prefixes = ['fa', 'fas', 'far', 'fab', 'fal', 'fat'];
    protected $detectedPrefix = 'fa';

    protected function transformFontAwesome()
    {
        $this->detectPrefixes();
        $this->parseFontAwesomeV7();
        $this->parseTraditionalSelectors();
        $this->parseFontAwesomeCategories();
        $this->parseFontAwesomeUnicodeRanges();

        return [
            'icons' => $this->iconData,
            'categories' => $this->categories,
            'metadata' => [
                'type' => 'fontawesome',
                'version' => $this->detectVersion(),
                'prefixes' => $this->detectedPrefixes,
                'main_prefix' => $this->detectedPrefix,
                'parsed_at' => current_time('mysql'),
                'source' => 'css_parser',
                'total_icons' => count($this->iconData)
            ]
        ];
    }

    protected function detectPrefixes()
    {
        $this->detectedPrefixes = [];

        // Detect all available prefixes from CSS
        foreach ($this->prefixes as $prefix) {
            if (strpos($this->cssContent, ".{$prefix}-") !== false) {
                $this->detectedPrefixes[] = $prefix;
            }
        }

        // Set main prefix (usually 'fa')
        if (in_array('fa', $this->detectedPrefixes)) {
            $this->detectedPrefix = 'fa';
        } elseif (!empty($this->detectedPrefixes)) {
            $this->detectedPrefix = $this->detectedPrefixes[0];
        }
    }

    protected function parseFontAwesomeV7()
    {
        // Parse Font Awesome 7 specific patterns
        // Look for CSS custom properties like --fa: "\f015"

        preg_match_all('/--fa:\s*["\']\\([^)]+\\)["\']/i', $this->cssContent, $matches);

        foreach ($matches[0] as $match) {
            // Extract icon information from CSS custom properties
            $this->parseFontAwesomeIcon($match);
        }
    }

    protected function parseTraditionalSelectors()
    {
        // Parse patterns with different prefixes
        foreach ($this->detectedPrefixes as $prefix) {
            $this->parseSelectorsWithPrefix($prefix);
        }
    }

    protected function parseSelectorsWithPrefix($prefix)
    {
        // Parse patterns like .fa-home:before { content: "\f015"; }
        // or .fas-home:before { content: "\f015"; }
        $pattern = "/\.{$prefix}-([a-zA-Z0-9-]+):before\s*\{[^}]*content:\s*[\"']\\([^)]+\\)[\"']/i";
        preg_match_all($pattern, $this->cssContent, $matches);

        foreach ($matches[1] as $index => $iconName) {
            $unicode = $matches[2][$index] ?? '';

            $this->iconData[] = [
                'name' => $iconName,
                'unicode' => $unicode,
                'prefix' => $prefix,
                'class' => "{$prefix}-{$iconName}",
                'styles' => $this->detectAvailableStyles($iconName, $prefix),
                'tags' => $this->generateTags($iconName),
                'category' => $this->detectCategory($iconName, $prefix)
            ];
        }
    }

    protected function detectAvailableStyles($iconName, $prefix = null)
    {
        $styles = [];

        // Check for different style variations based on detected prefixes
        $stylePatterns = [
            'solid' => ['.fa-solid.fa-', '.fas.fa-'],
            'regular' => ['.fa-regular.fa-', '.far.fa-'],
            'brands' => ['.fa-brands.fa-', '.fab.fa-'],
            'light' => ['.fa-light.fa-', '.fal.fa-'],
            'thin' => ['.fa-thin.fa-', '.fat.fa-']
        ];

        foreach ($stylePatterns as $style => $patterns) {
            foreach ($patterns as $pattern) {
                if (strpos($this->cssContent, $pattern . $iconName) !== false) {
                    $styles[] = $style;
                    break; // Found this style, move to next
                }
            }
        }

        // Also check prefix-specific styles
        if ($prefix && $prefix !== 'fa') {
            $prefixStyle = $this->getPrefixStyle($prefix);
            if ($prefixStyle && !in_array($prefixStyle, $styles)) {
                $styles[] = $prefixStyle;
            }
        }

        return $styles;
    }

    protected function getPrefixStyle($prefix)
    {
        $prefixStyles = [
            'fas' => 'solid',
            'far' => 'regular',
            'fab' => 'brands',
            'fal' => 'light',
            'fat' => 'thin'
        ];

        return $prefixStyles[$prefix] ?? null;
    }

    protected function detectVersion()
    {
        // Try to detect Font Awesome version from CSS
        if (preg_match('/Font Awesome (Free )?(\d+\.\d+\.\d+)/i', $this->cssContent, $matches)) {
            return $matches[2];
        }

        return '7.0.0'; // Default version
    }

    protected function parseFontAwesomeCategories()
    {
        // Auto-categorize based on icon names and patterns
        $this->categories = [
            'solid' => ['id' => 'solid', 'name' => 'Solid', 'description' => 'Solid style icons'],
            'regular' => ['id' => 'regular', 'name' => 'Regular', 'description' => 'Regular style icons'],
            'brands' => ['id' => 'brands', 'name' => 'Brands', 'description' => 'Brand icons'],
            'light' => ['id' => 'light', 'name' => 'Light', 'description' => 'Light style icons'],
            'thin' => ['id' => 'thin', 'name' => 'Thin', 'description' => 'Thin style icons']
        ];
    }

    protected function parseFontAwesomeUnicodeRanges()
    {
        // Parse @font-face declarations to get unicode ranges
        preg_match_all('/unicode-range:\s*u\+([a-f0-9,]+)/i', $this->cssContent, $matches);

        if (!empty($matches[1])) {
            $this->parseUnicodeRanges($matches[1]);
        }
    }

    protected function parseUnicodeRanges($ranges)
    {
        // Parse unicode ranges to extract additional icon information
        foreach ($ranges as $range) {
            $rangeParts = explode(',', $range);
            foreach ($rangeParts as $part) {
                $this->processUnicodeRange($part);
            }
        }
    }

    protected function processUnicodeRange($range)
    {
        // Process individual unicode range
        // This can be used to extract additional icon metadata
        if (preg_match('/^([a-f0-9]+)-([a-f0-9]+)$/i', $range, $matches)) {
            $start = hexdec($matches[1]);
            $end = hexdec($matches[2]);

            // Process range if needed
        }
    }

    protected function parseFontAwesomeIcon($cssProperty)
    {
        // Parse individual Font Awesome icon from CSS property
        if (preg_match('/--fa:\s*["\']\\(([^)]+)\\)["\']/i', $cssProperty, $matches)) {
            $unicode = $matches[1];

            // Try to find the icon name from the CSS selector
            // This is a simplified approach - in practice, you'd need more context
            $iconName = $this->extractIconNameFromContext($cssProperty);

            if ($iconName) {
                $this->iconData[] = [
                    'name' => $iconName,
                    'unicode' => $unicode,
                    'prefix' => $this->detectedPrefix,
                    'class' => "{$this->detectedPrefix}-{$iconName}",
                    'styles' => ['solid'], // Default to solid
                    'tags' => $this->generateTags($iconName),
                    'category' => $this->detectCategory($iconName, $this->detectedPrefix)
                ];
            }
        }
    }

    protected function extractIconNameFromContext($cssProperty)
    {
        // Extract icon name from CSS context
        // This is a simplified implementation
        if (preg_match('/\.fa-([a-zA-Z0-9-]+)/', $cssProperty, $matches)) {
            return $matches[1];
        }

        return null;
    }

    protected function detectCategory($iconName, $prefix = null)
    {
        // Auto-detect category based on icon name patterns and prefix
        if ($prefix === 'fab' || in_array($iconName, ['facebook', 'twitter', 'instagram', 'youtube', 'github'])) {
            return 'brands';
        }

        if ($prefix === 'far') {
            return 'regular';
        }

        if ($prefix === 'fal') {
            return 'light';
        }

        if ($prefix === 'fat') {
            return 'thin';
        }

        if (in_array($iconName, ['home', 'user', 'cog', 'envelope'])) {
            return 'solid';
        }

        return 'solid'; // Default category
    }
}
