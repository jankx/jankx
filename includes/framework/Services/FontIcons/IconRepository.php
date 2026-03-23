<?php

namespace Jankx\Services\FontIcons;

use Jankx\Foundation\Application;
use Jankx\Facades\Config;
use Jankx\Services\FontIcons\Transformers\GenericIconTransformer;

class IconRepository
{
    protected $cache;
    protected $iconTypes = [];
    protected $activeTypes = [];
    protected $app;

    protected $storage;

    public function __construct(Application $app)
    {
        $this->app = $app;
        
        $storageConfig = Config::get('font-icons.storage', []);
        $storageType = $storageConfig['type'] ?? 'json';
        $this->storage = \Jankx\Services\FontIcons\Storage\StorageFactory::create($storageType, $storageConfig);
        
        $this->loadActiveTypes();
        $this->loadIconTypes();
    }

    protected function loadActiveTypes()
    {
        $this->activeTypes = get_option('jankx_font_icons_active_types', []);

        // Set defaults from config if no active types are set
        if (empty($this->activeTypes)) {
            $iconTypes = Config::get('font-icons.icon_types', []);
            foreach ($iconTypes as $type => $typeConfig) {
                if ($typeConfig['enabled'] && ($typeConfig['auto_load'] ?? false)) {
                    $this->activeTypes[] = $type;
                }
            }
            update_option('jankx_font_icons_active_types', $this->activeTypes);
        }
    }

    protected function loadIconTypes()
    {
        $this->iconTypes = [];

        // Lấy config từ database và merge với config file
        $dbConfig = get_option('jankx_font_icons_config', []);
        $fileConfig = Config::get('font-icons.icon_types', []);
        
        $mergedConfig = array_merge($fileConfig, $dbConfig);

        foreach ($mergedConfig as $type => $typeConfig) {
            if ($typeConfig['enabled']) {
                $data = $this->loadIconTypeData($type, $typeConfig);
                $this->iconTypes[$type] = $data ?: ['config' => $typeConfig, 'icons' => []];
            }
        }
    }

    protected function loadIconTypeData($type, $config)
    {
        // Lấy storage key (hiện tại là MD5 của CSS URL)
        $cssUrl = $config['css_url'] ?? '';
        $storageKey = $cssUrl ? md5($cssUrl) : $type;

        $data = $this->storage->retrieve($storageKey);
        
        if ($data) {
            $data['config'] = $config;
            return $data;
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
            $filtered = array_filter($filtered, function ($icon) use ($filters) {
                return isset($icon['category']) && $icon['category'] === $filters['category'];
            });
        }

        // Filter by type
        if (isset($filters['type'])) {
            $filtered = array_filter($filtered, function ($icon) use ($filters) {
                return isset($icon['type']) && $icon['type'] === $filters['type'];
            });
        }

        // Filter by search query
        if (isset($filters['search'])) {
            $filtered = array_filter($filtered, function ($icon) use ($filters) {
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
        // Clear storage data
        $this->storage->clear();

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

    // Methods from IconTypeManager
    public function getActiveTypes()
    {
        return $this->activeTypes;
    }

    public function isTypeActive($type)
    {
        return in_array($type, $this->activeTypes);
    }

    public function activateType($type)
    {
        if (!in_array($type, $this->activeTypes)) {
            $this->activeTypes[] = $type;
            update_option('jankx_font_icons_active_types', $this->activeTypes);
        }

        return true;
    }

    public function deactivateType($type)
    {
        if (in_array($type, $this->activeTypes)) {
            $this->activeTypes = array_diff($this->activeTypes, [$type]);
            update_option('jankx_font_icons_active_types', $this->activeTypes);
        }

        return true;
    }

    public function getTypeConfig($type)
    {
        $iconTypes = $this->getAllTypes();
        return $iconTypes[$type] ?? null;
    }

    public function getAllTypes()
    {
        $dbConfig = get_option('jankx_font_icons_config', []);
        $fileConfig = Config::get('font-icons.icon_types', []);
        
        return array_replace_recursive($fileConfig, $dbConfig);
    }

    public function resolveCssUrl($type, $config = null)
    {
        if (!$config) {
            $allTypes = $this->getAllTypes();
            $config = $allTypes[$type] ?? [];
        }

        $cssUrl = $config['css_url'] ?? '';
        if (!$cssUrl && isset($config['cdn_url'])) {
            $version = $config['version'] ?? 'latest';
            $cssUrl = str_replace('{version}', $version, $config['cdn_url']);
        }

        return $cssUrl;
    }

    public function getAllActiveStyles()
    {
        $styles = [];
        $allTypes = $this->getAllTypes();
        
        foreach ($allTypes as $type => $config) {
            if ($config['enabled'] ?? false) {
                $url = $this->resolveCssUrl($type, $config);
                if ($url) {
                    $styles[$type] = $url;
                }
            }
        }
        
        return $styles;
    }

    public function getEnabledTypes()
    {
        $allTypes = $this->getAllTypes();
        $enabled = [];

        foreach ($allTypes as $type => $config) {
            if ($config['enabled'] ?? false) {
                $enabled[$type] = $config;
            }
        }

        return $enabled;
    }

    public function getAutoLoadTypes()
    {
        $iconTypes = get_option('jankx_font_icons_config', []);
        $autoLoad = [];

        foreach ($iconTypes as $type => $config) {
            if ($config['enabled'] && ($config['auto_load'] ?? false)) {
                $autoLoad[$type] = $config;
            }
        }

        return $autoLoad;
    }

    /**
     * Import font icon từ CSS URL
     */
    public function importFromCssUrl($cssUrl, $iconType, $displayName = null, $autoLoad = false, $transformer = null, $version = null)
    {
        try {
            // Validate URL
            if (!filter_var($cssUrl, FILTER_VALIDATE_URL)) {
                throw new \Exception('Invalid CSS URL provided');
            }

            $storageKey = md5($cssUrl);
            $jsonData = $this->storage->retrieve($storageKey);

            // Fetch and transform if not in storage
            if (!$jsonData) {
                $jsonData = $this->fetchAndTransformCss($cssUrl, $iconType, $transformer);
                $this->storage->store($storageKey, $jsonData);
            }

            // Cập nhật config
            $this->updateIconTypeConfig(
                $iconType, 
                $jsonData, 
                $cssUrl, 
                $displayName, 
                $autoLoad, 
                $transformer, 
                $jsonData['render_type'] ?? 'prefix',
                $version
            );

            // Reload icon types
            $this->loadIconTypes();

            return [
                'success' => true,
                'message' => sprintf('Successfully imported %d icons for "%s"', count($jsonData['icons']), $displayName ?: $iconType),
                'data' => $jsonData
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Lấy cache file path từ CSS URL
     */
    protected function getCacheFilePath($cssUrl)
    {
        $urlHash = md5($cssUrl);
        $cacheDir = $this->getCacheDirectory();

        return $cacheDir . '/' . $urlHash . '.json';
    }

    /**
     * Lấy cache directory
     */
    protected function getCacheDirectory()
    {
        $uploadDir = wp_upload_dir();
        $cacheDir = $uploadDir['basedir'] . '/jankx/icons';

        // Tạo thư mục nếu chưa có
        if (!is_dir($cacheDir)) {
            wp_mkdir_p($cacheDir);
        }

        return $cacheDir;
    }

    /**
     * Fetch CSS và transform thành JSON
     */
    protected function fetchAndTransformCss($cssUrl, $iconType, $transformer = null)
    {
        // Fetch CSS content
        $response = wp_remote_get($cssUrl);

        if (is_wp_error($response)) {
            throw new \Exception('Failed to fetch CSS: ' . $response->get_error_message());
        }

        $css = wp_remote_retrieve_body($response);

        if (empty($css)) {
            throw new \Exception('Empty CSS content received');
        }

        // Sử dụng transformer được cung cấp hoặc default
        if ($transformer === null) {
            $transformer = $this->getDefaultTransformer($iconType);
        }

        // Validate transformer
        if (!$transformer instanceof \Jankx\Services\FontIcons\Transformers\CssToJsonTransformer) {
            throw new \Exception('Invalid transformer provided');
        }

        // Transform CSS thành JSON
        $jsonData = $transformer->transform($css);

        return $jsonData;
    }

    /**
     * Lấy default transformer cho icon type
     */
    protected function getDefaultTransformer($iconType)
    {
        // Sử dụng GenericIconTransformer cho tất cả icon types
        // Có thể mở rộng sau này với các transformer chuyên biệt
        return new \Jankx\Services\FontIcons\Transformers\GenericIconTransformer($iconType);
    }

    /**
     * Lưu cache file
     */
    protected function saveCacheFile($jsonData, $cacheFile)
    {
        $json = json_encode($jsonData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        if (file_put_contents($cacheFile, $json) === false) {
            throw new \Exception('Failed to save cache file');
        }
    }

    /**
     * Cập nhật icon type config
     */
    protected function updateIconTypeConfig($iconType, $jsonData, $cssUrl, $displayName = null, $autoLoad = false, $transformer = null, $renderType = 'prefix', $version = null)
    {
        // Lấy config hiện tại
        $config = get_option('jankx_font_icons_config', []);

        // Tạo config mới (Không bao gồm mảng 'icons' lớn để tránh làm nặng database option)
        $newConfig = [
            'enabled' => true,
            'auto_load' => $autoLoad,
            'css_url' => $cssUrl,
            'display_name' => $displayName ?: ucfirst($iconType),
            'version' => $version ?: ($jsonData['version'] ?? '1.0.0'),
            'font_family' => $jsonData['font_family'] ?? 'Unknown',
            'prefixes' => $jsonData['prefixes'] ?? [$iconType],
            'total_icons' => count($jsonData['icons']),
            'transformer_class' => $transformer ? get_class($transformer) : null,
            'imported_at' => current_time('mysql'),
            'render_type' => $renderType,
        ];

        // Cập nhật config và đồng thời xóa field 'icons' cũ nếu có (ở các phiên bản code cũ)
        $config[$iconType] = $newConfig;
        update_option('jankx_font_icons_config', $config);
    }

    /**
     * Kiểm tra icon type có tồn tại không
     */
    public function hasIconType($iconType)
    {
        $config = get_option('jankx_font_icons_config', []);
        return isset($config[$iconType]);
    }

    /**
     * Xóa icon type
     */
    public function removeIconType($iconType)
    {
        $config = get_option('jankx_font_icons_config', []);

        if (isset($config[$iconType])) {
            $cssUrl = $config[$iconType]['css_url'] ?? '';
            unset($config[$iconType]);
            update_option('jankx_font_icons_config', $config);

            // Xóa data khỏi storage
            if ($cssUrl) {
                $this->storage->remove(md5($cssUrl));
            }

            // Reload icon types
            $this->loadIconTypes();

            return true;
        }

        return false;
    }

    /**
     * Lấy thống kê
     */
    public function getStats()
    {
        $config = get_option('jankx_font_icons_config', []);
        $stats = [
            'total_types' => count($config),
            'enabled_types' => 0,
            'auto_load_types' => 0,
            'total_icons' => 0,
            'storage' => $this->storage->getStats()
        ];

        foreach ($config as $type => $typeConfig) {
            if ($typeConfig['enabled']) {
                $stats['enabled_types']++;
            }
            if ($typeConfig['auto_load']) {
                $stats['auto_load_types']++;
            }
            $stats['total_icons'] += $typeConfig['total_icons'] ?? 0;
        }

        return $stats;
    }
}
