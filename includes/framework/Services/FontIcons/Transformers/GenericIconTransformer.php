<?php

namespace Jankx\Services\FontIcons\Transformers;

/**
 * Generic Icon Transformer để transform CSS thành JSON
 */
class GenericIconTransformer extends CssToJsonTransformer
{
    protected $iconType;

    public function __construct($iconType = 'generic')
    {
        parent::__construct($iconType);
        $this->iconType = $iconType;
    }

    /**
     * Transform CSS content thành JSON data
     */
    public function transform($css)
    {
        $icons = $this->parseCssForIcons($css);

        return [
            'version' => $this->extractVersion($css),
            'font_family' => $this->extractFontFamily($css),
            'prefixes' => $this->extractPrefixes($css),
            'icons' => $icons,
            'categories' => $this->extractCategories($icons),
            'render_type' => ($this->iconType === 'material') ? 'content' : 'prefix',
        ];
    }

    /**
     * Parse CSS để extract icons
     */
    protected function parseCssForIcons($css)
    {
        $icons = [];

        // Note: In PHP single-quoted string, \\\\ results in a literal \\ for the regex engine
        // which matches a single literal backslash in the input CSS text.
        $patterns = [
            // Matches .icon-name:before { content: "\f123"; } or content: \f123;
            '/\\.([a-zA-Z0-9-_]+):{1,2}(?:before|after)\s*\{[^}]*content:\s*["\']?(?:\\\\|\\\\\\\\)?([0-9a-fA-F]{2,6})["\']?/i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match_all($pattern, $css, $matches)) {
                foreach ($matches[1] as $index => $iconName) {
                    $unicode = $matches[2][$index];

                    // Filter out common utility or base classes
                    if (in_array($iconName, ['fa-lg', 'fa-fw', 'fa-li', 'fa-ul', 'fa-spin', 'fa-pulse'])) {
                        continue;
                    }
                    if (strpos($iconName, 'fa-2x') === 0 || strpos($iconName, 'fa-3x') === 0 || strpos($iconName, 'fa-4x') === 0 || strpos($iconName, 'fa-5x') === 0) {
                        continue;
                    }

                    $icons[$iconName] = $this->createIconData($iconName, $unicode);
                }
            }
        }

        // Material Icons Ligatures Detection
        if (strpos($css, 'material') !== false || strpos($css, 'Material') !== false) {
            $materialIcons = $this->getMaterialIconsList();
            foreach ($materialIcons as $iconName) {
                if (!isset($icons[$iconName])) {
                    $icons[$iconName] = $this->createIconData($iconName, '', 'material');
                }
            }
        }

        return array_values($icons);
    }

    /**
     * Tạo icon data
     */
    protected function createIconData($name, $unicode = '', $category = 'regular')
    {
        $usageType = ($this->iconType === 'material') ? 'ligature' : 'class';
        
        return [
            'name' => $name,
            'unicode' => $unicode,
            'category' => $category,
            'tags' => $this->generateTags($name),
            'description' => $this->generateDescription($name),
            'usage_type' => $usageType,
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
     * Extract version từ CSS comments
     */
    protected function extractVersion($css)
    {
        // Thường version nằm trong comment header: /*! v1.2.3 ... */
        preg_match('/v?([0-9]+\.[0-9]+\.[0-9]+)/i', substr($css, 0, 1000), $matches);
        if (!empty($matches[1])) {
            return $matches[1];
        }

        return '1.0.0';
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
        
        // Cố gắng tìm các base prefixes phổ biến (như fa, bi, dashicons)
        // Dựa vào pattern .prefix-icon:
        if (preg_match_all('/\.([a-zA-Z0-9]{2,10})-[a-zA-Z0-9-_]+:/', $css, $matches)) {
            $counts = array_count_values($matches[1]);
            arsort($counts); // Sắp xếp theo số lượng xuất hiện nhiều nhất
            
            $totalMatches = count($matches[0]);
            foreach ($counts as $prefix => $count) {
                // Nếu prefix xuất hiện trong > 5% số icons hoặc > 20 lần
                if ($count > 20 || ($totalMatches > 0 && ($count / $totalMatches) > 0.05)) {
                    // Tránh bắt nhầm các icon names quá phổ biến nếu có
                    if (!in_array($prefix, ['icon', 'item', 'btn', 'nav'])) {
                        $prefixes[] = $prefix;
                    }
                }
            }
        }

        // Bổ sung các prefixes chuẩn cho các bộ icon phổ biến nếu chưa có
        if ($this->iconType === 'fontawesome') {
            $faPrefixes = ['fa', 'fas', 'far', 'fab', 'fal', 'fad', 'fat', 'fa-solid', 'fa-regular', 'fa-brands'];
            $prefixes = array_unique(array_merge($prefixes, $faPrefixes));
        } elseif ($this->iconType === 'material') {
            $prefixes[] = 'material-icons';
        }

        if (empty($prefixes)) {
            $prefixes[] = $this->iconType;
        }

        return array_values(array_unique($prefixes));
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
        // Phổ biến nhất (Expanded list)
        return [
            'home', 'user', 'settings', 'search', 'menu', 'close', 'add', 'remove',
            'edit', 'delete', 'save', 'cancel', 'check', 'warning', 'error', 'info',
            'star', 'favorite', 'share', 'download', 'upload', 'refresh', 'back',
            'forward', 'play', 'pause', 'stop', 'volume', 'mute', 'camera', 'image',
            'video', 'audio', 'file', 'folder', 'link', 'email', 'phone', 'location',
            'time', 'date', 'calendar', 'notification', 'bell', 'lock', 'unlock',
            'key', 'shield', 'security', 'privacy', 'visibility', 'visibility-off',
            'account_circle', 'shopping_cart', 'dashboard', 'assessment', 'credit_card',
            'receipt', 'attach_file', 'cloud', 'backup', 'build', 'reusable', 'code',
            'terminal', 'bug_report', 'thumb_up', 'thumb_down', 'verified_user', 'public',
            'language', 'translate', 'explore', 'map', 'navigation', 'directions',
            'place', 'local_shipping', 'flight', 'train', 'directions_bus', 'directions_car',
            'commute', 'ev_station', 'restaurant', 'local_cafe', 'hotel', 'wc', 'pool',
            'fitness_center', 'spa', 'local_hospital', 'work', 'domain', 'business', 'group',
            'person', 'people', 'supervisor_account', 'school', 'history_edu', 'contact_page',
            'support_agent', 'help', 'question_answer', 'chat', 'forum', 'mail', 'send',
            'drafts', 'inbox', 'outbox', 'archive', 'delete_sweep', 'report', 'flag', 'label',
            'bookmark', 'grade', 'dynamic_feed', 'rss_feed', 'wifi', 'bluetooth', 'usb',
            'storage', 'cpu', 'memory', 'mouse', 'keyboard', 'headset', 'mic', 'speaker',
            'tv', 'videogame_asset', 'smartphone', 'tablet', 'laptop', 'desktop_windows',
            'print', 'scanner', 'copy', 'paste', 'cut', 'save_alt', 'cloud_download',
            'cloud_upload', 'folder_open', 'create_new_folder', 'restore', 'update', 'event'
        ];
    }
}
