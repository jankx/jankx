<?php

namespace Jankx\Services\FontIcons;

use Jankx\Foundation\Application;
use Jankx\Facades\Config;

class IconRepository
{
    protected $cache;
    protected $iconTypes = [];
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->loadIconTypes();
    }

    protected function loadIconTypes()
    {
        $this->iconTypes = [];

        $iconTypes = Config::get('font-icons.icon_types', []);
        foreach ($iconTypes as $type => $typeConfig) {
            if ($typeConfig['enabled']) {
                $this->iconTypes[$type] = $this->loadIconTypeData($type, $typeConfig);
            }
        }
    }

    protected function loadIconTypeData($type, $config)
    {
        // Sử dụng container để lấy base path
        $basePath = $this->app->make('jankx.paths')['base'];
        $dataFile = $basePath . "/resources/icons/{$type}/icons.json";

        if (file_exists($dataFile)) {
            $data = json_decode(file_get_contents($dataFile), true);
            if ($data) {
                $data['config'] = $config;
                return $data;
            }
        }

        return null;
    }

    public function getIconTypes()
    {
        return $this->iconTypes;
    }

    public function getIconsByType($type, $filters = [])
    {
        if (!isset($this->iconTypes[$type])) {
            return [];
        }

        $icons = $this->iconTypes[$type]['icons'] ?? [];

        // Apply filters
        if (!empty($filters)) {
            $icons = $this->applyFilters($icons, $filters);
        }

        return $icons;
    }

    public function searchIcons($query, $type = null)
    {
        $results = [];

        foreach ($this->iconTypes as $iconType => $typeData) {
            if ($type && $type !== $iconType) {
                continue;
            }

            $icons = $typeData['icons'] ?? [];
            foreach ($icons as $icon) {
                if ($this->iconMatchesQuery($icon, $query)) {
                    $icon['type'] = $iconType;
                    $results[] = $icon;
                }
            }
        }

        return $results;
    }

    protected function iconMatchesQuery($icon, $query)
    {
        $query = strtolower($query);

        // Search in name
        if (strpos(strtolower($icon['name']), $query) !== false) {
            return true;
        }

        // Search in tags
        if (isset($icon['tags'])) {
            foreach ($icon['tags'] as $tag) {
                if (strpos(strtolower($tag), $query) !== false) {
                    return true;
                }
            }
        }

        // Search in category
        if (isset($icon['category']) && strpos(strtolower($icon['category']), $query) !== false) {
            return true;
        }

        return false;
    }

    protected function applyFilters($icons, $filters)
    {
        $filtered = $icons;

        // Filter by category
        if (isset($filters['category'])) {
            $filtered = array_filter($filtered, function($icon) use ($filters) {
                return isset($icon['category']) && $icon['category'] === $filters['category'];
            });
        }

        // Filter by type
        if (isset($filters['type'])) {
            $filtered = array_filter($filtered, function($icon) use ($filters) {
                return isset($icon['type']) && $icon['type'] === $filters['type'];
            });
        }

        // Filter by search query
        if (isset($filters['search'])) {
            $filtered = array_filter($filtered, function($icon) use ($filters) {
                return $this->iconMatchesQuery($icon, $filters['search']);
            });
        }

        return array_values($filtered);
    }

    public function getIconInfo($iconName, $type)
    {
        if (!isset($this->iconTypes[$type])) {
            return null;
        }

        $icons = $this->iconTypes[$type]['icons'] ?? [];
        foreach ($icons as $icon) {
            if ($icon['name'] === $iconName) {
                $icon['type'] = $type;
                return $icon;
            }
        }

        return null;
    }

    public function getCategories($type = null)
    {
        $categories = [];

        foreach ($this->iconTypes as $iconType => $typeData) {
            if ($type && $type !== $iconType) {
                continue;
            }

            $typeCategories = $typeData['categories'] ?? [];
            foreach ($typeCategories as $category) {
                $category['type'] = $iconType;
                $categories[] = $category;
            }
        }

        return $categories;
    }

    public function clearCache()
    {
        // Clear WordPress object cache for icons
        wp_cache_flush_group('jankx_font_icons');

        // Clear any transient options
        delete_transient('jankx_icons_cache');

        return true;
    }

    public function refreshIconData()
    {
        // Reload icon types
        $this->loadIconTypes();

        // Clear cache
        $this->clearCache();

        return true;
    }
}
