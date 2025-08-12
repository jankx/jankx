<?php

namespace Jankx\Services\FontIcons\Transformers;

class CustomIconsTransformer extends CssToJsonTransformer
{
    protected function transformCustomIcons()
    {
        // Parse custom icon patterns
        $this->parseCustomIconClasses();
        $this->parseCustomIconCategories();

        return [
            'icons' => $this->iconData,
            'categories' => $this->categories,
            'metadata' => [
                'type' => 'custom',
                'parsed_at' => current_time('mysql'),
                'source' => 'css_parser'
            ]
        ];
    }

    protected function parseCustomIconClasses()
    {
        // Parse custom icon patterns
        preg_match_all('/\.icon-([a-zA-Z0-9-]+)\s*\{[^}]*\}/i', $this->cssContent, $matches);

        foreach ($matches[1] as $iconName) {
            $this->iconData[] = [
                'name' => $iconName,
                'class' => "icon-{$iconName}",
                'type' => 'custom',
                'tags' => $this->generateTags($iconName),
                'category' => $this->detectCategory($iconName)
            ];
        }
    }

    protected function parseCustomIconCategories()
    {
        // Auto-categorize custom icons
        $this->categories = [
            'general' => ['id' => 'general', 'name' => 'General', 'description' => 'General icons'],
            'navigation' => ['id' => 'navigation', 'name' => 'Navigation', 'description' => 'Navigation icons'],
            'action' => ['id' => 'action', 'name' => 'Action', 'description' => 'Action icons'],
            'status' => ['id' => 'status', 'name' => 'Status', 'description' => 'Status icons']
        ];
    }
}
