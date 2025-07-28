# Jankx Debug System - Quick Start Guide

## Kích hoạt nhanh

### 1. **Thêm vào wp-config.php**
```php
define('JANKX_DEBUG', true);
```

### 2. **Hoặc thêm vào functions.php**
```php
if (!defined('JANKX_DEBUG')) {
    define('JANKX_DEBUG', true);
}
```

## Tính năng chính

### 1. **Performance Metrics**
- ⏱️ **Response Time**: Thời gian phản hồi trang
- 💾 **Memory Usage**: Sử dụng bộ nhớ hiện tại
- 🗄️ **Database Queries**: Tổng queries và queries từ `functions.php`
- 🔌 **Plugin Debug Info**: Thông tin từ plugins tích hợp

### 2. **Cache Systems Detection**
- **OPcache**: PHP OPcache status và statistics
- **Redis**: Redis server information và memory usage
- **Memcached**: Memcached connection và statistics
- **APCu**: APCu cache information
- **WP Object Cache**: WordPress native object cache

### 3. **Interactive UI**
- **Toggle Button**: Chuyển đổi minimize/maximize với icon thay đổi
- **Fullscreen Mode**: Xem toàn màn hình với scrollable content
- **Mini-bar**: Thu nhỏ thành bar nhỏ ở cuối màn hình
- **State Persistence**: Nhớ trạng thái qua localStorage

## Cách sử dụng

### 1. **Toggle Panel**
- Click nút toggle để minimize/maximize
- **Icon "−"**: Panel maximized
- **Icon "□"**: Panel minimized
- Click mini-bar để maximize lại

### 2. **Fullscreen Mode**
- Click nút "⛶" để xem fullscreen
- Tự động thoát fullscreen khi click toggle
- Scrollable content area
- Sticky header với controls

### 3. **Đọc thông tin**
```
⏱️ Response Time: 245.67ms
💾 Memory Usage: 45.2 MB / 256M
🗄️ Database: 25 total queries (+13 since functions.php)
```

## Plugin Integration

### 1. **Thêm Debug Info**
```php
// Sử dụng action hook
add_action('jankx/debug/add_info', function(&$debugInfo) {
    $debugInfo['My Plugin'] = 'Version 1.0.0, Active Features: 5';
});

// Sử dụng helper method
use Jankx\Debug\DebugInfo;

add_action('jankx/debug/add_info', function(&$debugInfo) {
    DebugInfo::addPluginDebugInfo($debugInfo, 'My Plugin', 'Version 1.0.0');
});
```

### 2. **Best Practice**
```php
class MyPlugin {
    public function __construct() {
        if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
            add_action('jankx/debug/add_info', [$this, 'addDebugInfo']);
        }
    }

    public function addDebugInfo(&$debugInfo) {
        try {
            $info = $this->getDebugData();
            DebugInfo::addPluginDebugInfo($debugInfo, 'My Plugin', $info);
        } catch (Exception $e) {
            DebugInfo::addPluginDebugInfo($debugInfo, 'My Plugin', 'Error: ' . $e->getMessage());
        }
    }
}
```

## Troubleshooting

### 1. **Debug Panel không hiển thị**
- Kiểm tra `JANKX_DEBUG` đã được define và có giá trị `true`
- Debug panel ẩn trong Gutenberg editor để tránh conflict

### 2. **Database Queries = 0**
- Kiểm tra `SAVEQUERIES` constant đã được enable
- System sử dụng multiple fallback mechanisms

### 3. **CSS Conflicts**
- Debug panel được thiết kế để tránh conflict với Gutenberg
- Sử dụng CSS specificity cao với `!important`

## Use Cases

### 1. **Development**
- Debug performance issues
- Optimize database queries
- Monitor memory usage
- Test cache effectiveness

### 2. **Plugin Development**
- Test plugin performance
- Debug plugin integration
- Monitor plugin impact
- Optimize plugin code

### 3. **Theme Development**
- Optimize theme performance
- Debug theme issues
- Monitor theme impact
- Test theme compatibility

## Security Notes

- **Chỉ sử dụng trên development environment**
- Không kích hoạt trên public production sites
- Debug panel có thể expose sensitive information
- Tất cả data được escape và sanitize

## Performance Impact

- **Minimal overhead**: 1-2% performance impact
- **Memory usage**: Khoảng 1-2MB
- **Lazy loading**: Debug info được load khi cần
- **Efficient collection**: Sử dụng optimized data collection methods

## Related Documentation

- [Complete Debug System Guide](debug-system.md)
- [Plugin Debug Integration Guide](plugin-debug-integration.md)
- [Performance Optimization Guide](../performance/README.md)