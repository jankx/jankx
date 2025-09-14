<?php

namespace Jankx\Services\FontIcons\Transformers;

/**
 * Generic Icon Transformer để transform CSS thành JSON
 */
class GenericIconTransformer extends CssToJsonTransformer
{
    protected $iconType;

    public function __construct($iconType)
    {
        $this->iconType = $iconType;
    }

    /**
     * Transform CSS content thành JSON data
     */
    public function transform($css)
    {
        $icons = $this->parseCssForIcons($css);
        $fontFamily = $this->extractFontFamily($css);
        $prefixes = $this->extractPrefixes($css);

        return [
            'version' => '1.0.0',
            'font_family' => $fontFamily,
            'prefixes' => $prefixes,
            'categories' => $this->extractCategories($icons),
            'icons' => $icons
        ];
    }

    /**
     * Parse CSS để extract icons
     */
    protected function parseCssForIcons($css)
    {
        $icons = [];

        // Pattern 1: .icon-name:before { content: "\unicode"; }
        preg_match_all('/\.([a-zA-Z0-9-_]+):before\s*\{[^}]*content:\s*["\']\\\\([0-9a-fA-F]+)["\']/', $css, $matches1);

        if (!empty($matches1[1])) {
            for ($i = 0; $i < count($matches1[1]); $i++) {
                $iconName = $matches1[1][$i];
                $unicode = $matches1[2][$i];

                $icons[] = $this->createIconData($iconName, $unicode);
            }
        }

        // Pattern 2: .fa-icon:before { content: "\f000"; }
        preg_match_all('/\.fa-([a-zA-Z0-9-_]+):before\s*\{[^}]*content:\s*["\']\\\\([0-9a-fA-F]+)["\']/', $css, $matches2);

        if (!empty($matches2[1])) {
            for ($i = 0; $i < count($matches2[1]); $i++) {
                $iconName = $matches2[1][$i];
                $unicode = $matches2[2][$i];

                $icons[] = $this->createIconData($iconName, $unicode);
            }
        }

        // Pattern 3: .material-icons { font-family: "Material Icons"; }
        if (strpos($css, 'material-icons') !== false) {
            $materialIcons = $this->getMaterialIconsList();
            foreach ($materialIcons as $iconName) {
                $icons[] = $this->createIconData($iconName, '', 'material');
            }
        }

        // Pattern 4: .bi-icon::before { content: "\unicode"; }
        preg_match_all('/\.bi-([a-zA-Z0-9-_]+)::before\s*\{[^}]*content:\s*["\']\\\\([0-9a-fA-F]+)["\']/', $css, $matches3);

        if (!empty($matches3[1])) {
            for ($i = 0; $i < count($matches3[1]); $i++) {
                $iconName = $matches3[1][$i];
                $unicode = $matches3[2][$i];

                $icons[] = $this->createIconData($iconName, $unicode);
            }
        }

        // Remove duplicates
        $icons = array_unique($icons, SORT_REGULAR);

        return array_values($icons);
    }

    /**
     * Tạo icon data
     */
    protected function createIconData($iconName, $unicode = '', $category = 'general')
    {
        return [
            'name' => $iconName,
            'unicode' => $unicode,
            'category' => $category,
            'tags' => $this->generateTags($iconName),
            'description' => $this->generateDescription($iconName)
        ];
    }

    /**
     * Generate tags từ icon name
     */
    protected function generateTags($iconName)
    {
        $tags = [$iconName];

        // Thêm tags từ tên icon
        $words = explode('-', $iconName);
        foreach ($words as $word) {
            if (strlen($word) > 2) {
                $tags[] = $word;
            }
        }

        return array_unique($tags);
    }

    /**
     * Generate description từ icon name
     */
    protected function generateDescription($iconName)
    {
        return ucfirst(str_replace('-', ' ', $iconName)) . ' icon';
    }

    /**
     * Extract font family từ CSS
     */
    protected function extractFontFamily($css)
    {
        // Pattern 1: font-family: "Font Name";
        preg_match('/font-family:\s*["\']([^"\']+)["\']/', $css, $matches);
        if (!empty($matches[1])) {
            return $matches[1];
        }

        // Pattern 2: font-family: Font Name;
        preg_match('/font-family:\s*([^;]+);/', $css, $matches);
        if (!empty($matches[1])) {
            return trim($matches[1]);
        }

        // Default based on icon type
        switch ($this->iconType) {
            case 'fontawesome':
                return 'Font Awesome';
            case 'material':
                return 'Material Icons';
            case 'bootstrap':
                return 'Bootstrap Icons';
            case 'feather':
                return 'Feather Icons';
            default:
                return ucfirst($this->iconType) . ' Icons';
        }
    }

    /**
     * Extract prefixes từ CSS
     */
    protected function extractPrefixes($css)
    {
        $prefixes = [];

        // Tìm các class prefixes
        preg_match_all('/\.([a-zA-Z0-9-_]+)-[a-zA-Z0-9-_]+:/', $css, $matches);

        foreach ($matches[1] as $prefix) {
            if (strlen($prefix) > 1 && !in_array($prefix, $prefixes)) {
                $prefixes[] = $prefix;
            }
        }

        // Default prefixes
        if (empty($prefixes)) {
            switch ($this->iconType) {
                case 'fontawesome':
                    $prefixes = ['fa', 'fas', 'far', 'fab'];
                    break;
                case 'material':
                    $prefixes = ['material-icons'];
                    break;
                case 'bootstrap':
                    $prefixes = ['bi'];
                    break;
                default:
                    $prefixes = [$this->iconType];
            }
        }

        return array_unique($prefixes);
    }

    /**
     * Extract categories từ icons
     */
    protected function extractCategories($icons)
    {
        $categories = [];
        $categoryNames = array_unique(array_column($icons, 'category'));

        foreach ($categoryNames as $category) {
            $categories[] = [
                'name' => $category,
                'display_name' => ucfirst($category),
                'description' => ucfirst($category) . ' icons'
            ];
        }

        return $categories;
    }

    /**
     * Get Material Icons list (fallback)
     */
    protected function getMaterialIconsList()
    {
        return [
            'home', 'user', 'settings', 'search', 'menu', 'close', 'add', 'remove',
            'edit', 'delete', 'save', 'cancel', 'check', 'warning', 'error', 'info',
            'star', 'favorite', 'share', 'download', 'upload', 'refresh', 'back',
            'forward', 'play', 'pause', 'stop', 'volume', 'mute', 'camera', 'image',
            'video', 'audio', 'file', 'folder', 'link', 'email', 'phone', 'location',
            'time', 'date', 'calendar', 'notification', 'bell', 'lock', 'unlock',
            'key', 'shield', 'security', 'privacy', 'visibility', 'visibility-off'
        ];
    }
}