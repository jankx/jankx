<?php

namespace Jankx\Services\FontIcons\Transformers;

abstract class CssToJsonTransformer
{
    protected $cssContent;
    protected $iconData = [];
    protected $categories = [];

    public function transform($cssUrl, $type = 'custom')
    {
        $this->cssContent = $this->fetchCss($cssUrl);

        switch ($type) {
            case 'fontawesome':
                return $this->transformFontAwesome();
            case 'material':
                return $this->transformMaterialIcons();
            case 'custom':
                return $this->transformCustomIcons();
            case 'svg':
                return $this->transformSvgIcons();
            default:
                return $this->transformGeneric();
        }
    }

    protected function fetchCss($url)
    {
        $response = wp_remote_get($url);

        if (is_wp_error($response)) {
            throw new \Exception("Failed to fetch CSS: " . $response->get_error_message());
        }

        return wp_remote_retrieve_body($response);
    }

    protected function transformFontAwesome()
    {
        // Override in FontAwesomeTransformer
        return [];
    }

    protected function transformMaterialIcons()
    {
        // Override in MaterialIconsTransformer
        return [];
    }

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

    protected function transformGeneric()
    {
        // Generic CSS parsing
        $this->parseGenericIconClasses();

        return [
            'icons' => $this->iconData,
            'categories' => $this->categories,
            'metadata' => [
                'type' => 'generic',
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

    protected function parseGenericIconClasses()
    {
        // Parse generic icon patterns
        preg_match_all('/\.([a-zA-Z0-9-]+)-icon\s*\{[^}]*\}/i', $this->cssContent, $matches);

        foreach ($matches[1] as $iconName) {
            $this->iconData[] = [
                'name' => $iconName,
                'class' => "{$iconName}-icon",
                'type' => 'generic',
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

    protected function parseSvgIconCategories()
    {
        // Auto-categorize SVG icons
        $this->categories = [
            'general' => ['id' => 'general', 'name' => 'General', 'description' => 'General SVG icons'],
            'brands' => ['id' => 'brands', 'name' => 'Brands', 'description' => 'Brand SVG icons'],
            'ui' => ['id' => 'ui', 'name' => 'UI', 'description' => 'UI SVG icons']
        ];
    }

    protected function generateTags($iconName)
    {
        // Generate searchable tags based on icon name
        $tags = [$iconName];

        // Split camelCase or kebab-case names
        $parts = preg_split('/[-_]/', $iconName);
        $tags = array_merge($tags, $parts);

        // Add common synonyms
        $synonyms = $this->getIconSynonyms($iconName);
        $tags = array_merge($tags, $synonyms);

        return array_unique($tags);
    }

    protected function getIconSynonyms($iconName)
    {
        $synonyms = [
            'home' => ['house', 'building', 'main'],
            'user' => ['person', 'profile', 'account'],
            'search' => ['find', 'magnifier', 'lookup'],
            'heart' => ['love', 'favorite', 'like'],
            'star' => ['favorite', 'rating', 'bookmark'],
            'cog' => ['settings', 'gear', 'configuration'],
            'envelope' => ['mail', 'email', 'message'],
            'phone' => ['call', 'telephone', 'contact'],
            'map' => ['location', 'place', 'marker'],
            'calendar' => ['date', 'schedule', 'event']
        ];

        return $synonyms[$iconName] ?? [];
    }

    protected function detectCategory($iconName)
    {
        // Auto-detect category based on icon name patterns
        if (in_array($iconName, ['facebook', 'twitter', 'instagram', 'youtube', 'github'])) {
            return 'brands';
        }

        if (in_array($iconName, ['home', 'user', 'cog', 'envelope'])) {
            return 'general';
        }

        if (in_array($iconName, ['search', 'menu', 'close', 'arrow'])) {
            return 'navigation';
        }

        if (in_array($iconName, ['play', 'pause', 'stop', 'next', 'prev'])) {
            return 'action';
        }

        if (in_array($iconName, ['check', 'error', 'warning', 'info'])) {
            return 'status';
        }

        return 'general'; // Default category
    }
}
