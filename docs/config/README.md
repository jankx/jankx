# Config Repository

Jankx Framework cung cấp một hệ thống Config Repository mạnh mẽ với khả năng deep merge cho child theme override parent theme, tương tự như Laravel nhưng được tối ưu cho WordPress themes.

## Tổng quan

Config Repository của Jankx cho phép:

- **Deep Merge**: Child theme có thể override từng thuộc tính cụ thể trong config của parent theme
- **Dot Notation**: Truy cập nested config values bằng dot notation
- **Automatic Loading**: Tự động load config từ parent và child themes
- **Type Safety**: Hỗ trợ type hints và validation
- **Performance**: Caching và lazy loading

## Cách sử dụng cơ bản

### 1. Sử dụng Facade

```php
use Jankx\Facades\Config;

// Lấy giá trị config
$themeName = Config::get('theme.info.name', 'Default Theme');

// Lấy nested value
$primaryColor = Config::get('theme.colors.primary', '#000000');

// Kiểm tra config có tồn tại
if (Config::has('theme.layout.sidebar_position')) {
    $position = Config::get('theme.layout.sidebar_position');
}
```

### 2. Deep Merge Example

**Parent Theme Config:**
```php
return [
    'layout' => [
        'sidebar_position' => 'right',
        'blog_columns' => 3,
    ],
    'colors' => [
        'primary' => '#007cba',
    ],
];
```

**Child Theme Config:**
```php
return [
    'layout' => [
        'sidebar_position' => 'left', // Override
        'blog_columns' => 2, // Override
    ],
    'colors' => [
        'primary' => '#e74c3c', // Override
    ],
];
```

**Kết quả Merged:**
```php
[
    'layout' => [
        'sidebar_position' => 'left', // Từ child
        'blog_columns' => 2, // Từ child
    ],
    'colors' => [
        'primary' => '#e74c3c', // Từ child
    ],
]
```

## API Reference

| Method | Description |
|--------|-------------|
| `Config::get($key, $default)` | Lấy giá trị config |
| `Config::set($key, $value)` | Set giá trị config |
| `Config::has($key)` | Kiểm tra config tồn tại |
| `Config::all()` | Lấy tất cả config |
| `Config::section($section)` | Lấy config section |
| `Config::isChildTheme()` | Kiểm tra child theme |
| `Config::getDifferences()` | Lấy differences |

## Cache System

Config Repository sử dụng intelligent caching system với CRC32 checksum:

### **Cache Mechanism:**
```php
// 1. Generate cache key từ file checksum
$checksum = crc32(file_get_contents($file));
$cacheKey = 'jankx_config_' . md5($file . '_' . $checksum);

// 2. Check cache trước khi parse
$cached = wp_cache_get($cacheKey, 'jankx_config');
if ($cached !== false) {
    return $cached; // Return cached config
}

// 3. Parse và cache config
$config = require $file;
wp_cache_set($cacheKey, $config, 'jankx_config', 3600);
```

### **Cache Management:**
```php
// Clear specific file cache
Config::clearCache('/path/to/config.php');

// Clear all caches
Config::clearCache();

// Get cache statistics
$stats = Config::getCacheStats();

// Check if file changed
if (Config::hasFileChanged($file)) {
    Config::clearCache($file);
}
```

### **Performance Benefits:**
- ✅ **First Load**: Parse và cache config
- ✅ **Subsequent Loads**: Load từ cache (nhanh hơn 90%+)
- ✅ **File Change Detection**: Tự động invalidate cache khi file thay đổi
- ✅ **Memory Efficient**: Sử dụng WordPress object cache

## Best Practices

1. **Cấu trúc Config Files**: Sử dụng descriptive names và group related settings
2. **Child Theme Overrides**: Chỉ override settings cần thiết
3. **Performance**: Sử dụng dot notation và cache khi cần
4. **Security**: Validate và sanitize config values
5. **Cache Management**: Clear cache khi update config files