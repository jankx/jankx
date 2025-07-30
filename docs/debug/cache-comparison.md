# Cache Comparison Debug Feature

## Tổng quan

Tính năng Cache Comparison trong Jankx Debug cho phép bạn so sánh hiệu suất thực tế giữa trang có cache và không có cache. Điều này giúp bạn hiểu rõ tác động của các plugin tối ưu tốc độ.

## Cách hoạt động

### 1. Ngăn chặn cache thông tin debug

Hệ thống tự động ngăn chặn các plugin tối ưu tốc độ cache lại thông tin debug:

- **WP Rocket**: Tắt cache cho trang debug
- **W3 Total Cache**: Ngăn cache page và object
- **WP Super Cache**: Tắt output buffering
- **Autoptimize**: Loại trừ CSS/JS debug khỏi minification
- **LiteSpeed Cache**: Tắt cache API
- **Hummingbird**: Tắt cache control
- **SG Optimizer**: Loại trừ debug elements
- **Breeze**: Tắt cache control
- **Swift Performance**: Tắt cache control

### 2. So sánh hiệu suất

Hệ thống lưu trữ thông tin debug và so sánh:

- **Response Time**: Thời gian phản hồi
- **Memory Usage**: Sử dụng bộ nhớ
- **Query Count**: Số lượng database queries

### 3. Hiển thị kết quả

Thông tin so sánh được hiển thị trong debug panel:

```
⚡ Cache vs No-Cache Comparison
├── Response Time:
│   ├── Current: 0.1234s
│   ├── Cached: 0.0456s
│   ├── Difference: +0.0778s
│   └── Improvement: 63.0%
├── Memory Usage:
│   ├── Current: 45.2 MB
│   ├── Cached: 12.8 MB
│   ├── Difference: +32.4 MB
│   └── Improvement: 71.7%
└── Database Queries:
    ├── Current: 156 queries
    ├── Cached: 23 queries
    ├── Difference: +133 queries
    └── Improvement: 85.3%
```

## Cách sử dụng

### 1. Kích hoạt debug mode

```php
define('JANKX_DEBUG', true);
```

### 2. Truy cập debug panel

- **Frontend**: Debug panel xuất hiện ở góc dưới bên phải
- **Admin**: Click vào "📝 Gutenberg Blocks" trong admin bar

### 3. Xem thông tin cache comparison

- Thông tin so sánh xuất hiện trong section "⚡ Cache vs No-Cache Comparison"
- Màu xanh lá: Cải thiện hiệu suất
- Màu cam: Thông tin trung gian

### 4. Clear cache debug data

- Click vào "🗑️ Clear Debug Cache" trong admin bar
- Hoặc sử dụng AJAX endpoint: `wp_ajax_bookix_clear_debug_cache`

## API Endpoints

### Get Debug Info
```
POST /wp-admin/admin-ajax.php
Action: bookix_get_block_debug_info
```

### Clear Debug Cache
```
POST /wp-admin/admin-ajax.php
Action: bookix_clear_debug_cache
```

## Cache Storage

Debug data được lưu trong WordPress object cache:

- **Key**: `jankx_debug_cached_{md5(request_uri)}`
- **Group**: `jankx_debug`
- **Expiry**: 1 giờ
- **Data**: response_time, memory_usage, query_count, timestamp

## Troubleshooting

### Vấn đề thường gặp

1. **Không có dữ liệu cache để so sánh**
   - Lần đầu truy cập trang sẽ không có dữ liệu so sánh
   - Refresh trang để có dữ liệu cache

2. **Cache prevention không hoạt động**
   - Kiểm tra log để xem plugin nào được phát hiện
   - Đảm bảo `JANKX_DEBUG` được set đúng

3. **AJAX request lỗi**
   - Kiểm tra quyền admin
   - Xem log để debug

### Debug Logs

Hệ thống log các hoạt động:

```php
Logger::debug('Cache prevention applied for wp_rocket');
Logger::debug('Debug data saved for cache comparison');
Logger::debug('Cached debug data cleared');
```

## Tùy chỉnh

### Thêm plugin cache mới

```php
// Trong preventCachingByPlugins()
if (defined('YOUR_PLUGIN_VERSION')) {
    add_filter('your_plugin_cache_control', '__return_false');
    Logger::debug('Your Plugin Cache disabled for debug mode');
}
```

### Tùy chỉnh cache expiry

```php
// Trong saveDebugDataForComparison()
wp_cache_set($cacheKey, $cacheData, 'jankx_debug', DAY_IN_SECONDS);
```

## Best Practices

1. **Chỉ sử dụng trong development**
   - Không enable debug mode trên production
   - Có thể ảnh hưởng hiệu suất

2. **Clear cache định kỳ**
   - Cache data có thể cũ và không chính xác
   - Clear cache khi test plugin mới

3. **Monitor log**
   - Theo dõi log để phát hiện vấn đề
   - Debug info có thể giúp optimize

4. **Test nhiều lần**
   - Cache comparison cần nhiều lần test
   - Kết quả có thể thay đổi theo thời gian