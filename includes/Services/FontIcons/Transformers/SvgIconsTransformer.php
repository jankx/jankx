<?php

namespace Jankx\Services\FontIcons\Transformers;

class SvgIconsTransformer extends CssToJsonTransformer
{
    protected function transformSvgIcons()
    {
        // Parse SVG icon patterns
        $this->parseSvgIconClasses();
        $this->parseSvgIconCategories();

        return [
            'icons' => $this->iconData,
            'categories' => $this->categories,
            'metadata' => [
                'type' => 'svg',
                'parsed_at' => current_time('mysql'),
                'source' => 'css_parser'
            ]
        ];
    }

    protected function parseSvgIconClasses()
    {
        // Parse SVG icon patterns
        preg_match_all('/\.svg-icon-([a-zA-Z0-9-]+)\s*\{[^}]*\}/i', $this->cssContent, $matches);

        foreach ($matches[1] as $iconName) {
            $this->iconData[] = [
                'name' => $iconName,
                'class' => "svg-icon-{$iconName}",
                'type' => 'svg',
                'tags' => $this->generateTags($iconName),
                'category' => $this->detectCategory($iconName)
            ];
        }
    }

    protected function parseSvgIconCategories()
    {
        // Auto-categorize SVG icons
        $this->categories = [
            'general' => ['id' => 'general', 'name' => 'General', 'description' => 'General SVG icons'],
            'brands' => ['id' => 'brands', 'name' => 'Brands', 'description' => 'Brand SVG icons'],
            'ui' => ['id' => 'ui', 'name' => 'UI', 'description' => 'UI SVG icons']
        ];
    }
}
