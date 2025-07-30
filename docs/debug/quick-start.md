# Quick Start Guide - Jankx Debug System

## Bắt đầu nhanh

Hướng dẫn này sẽ giúp bạn bắt đầu sử dụng Jankx Debug System trong 5 phút.

## Bước 1: Kích hoạt Debug Mode

Thêm dòng sau vào file `wp-config.php` hoặc `functions.php`:

```php
define('JANKX_DEBUG', true);
```

## Bước 2: Truy cập Debug Panel

### Frontend
1. Mở trang web của bạn
2. Debug panel sẽ xuất hiện ở góc dưới bên phải
3. Click vào panel để expand/collapse

### Admin
1. Đăng nhập vào WordPress admin
2. Click vào "📝 Gutenberg Blocks" trong admin bar
3. AJAX request sẽ load debug information

## Bước 3: Xem thông tin cơ bản

Debug panel hiển thị:

- **⏱️ Response Time**: Thời gian phản hồi
- **💾 Memory Usage**: Sử dụng bộ nhớ
- **🗄️ Database Queries**: Số lượng queries

## Bước 4: Cache Comparison

1. Refresh trang lần đầu (không có cache)
2. Refresh lại lần nữa (có cache)
3. Xem section "⚡ Cache vs No-Cache Comparison"

## Bước 5: Clear Cache

Click "🗑️ Clear Debug Cache" trong admin bar để reset cache data.

## Ví dụ thực tế

### Trang có cache
```
⚡ Performance Info
├── Response Time: 0.0456s
├── Memory Usage: 12.8 MB
├── Memory Limit: 256 MB
└── Memory Usage %: 5.0%

⚡ Cache vs No-Cache Comparison
├── Response Time:
│   ├── Current: 0.0456s
│   ├── Cached: 0.1234s
│   ├── Difference: -0.0778s
│   └── Improvement: 63.0%
```

### Trang không có cache
```
⚡ Performance Info
├── Response Time: 0.1234s
├── Memory Usage: 45.2 MB
├── Memory Limit: 256 MB
└── Memory Usage %: 17.7%

⚡ Cache vs No-Cache Comparison
├── Response Time:
│   ├── Current: 0.1234s
│   ├── Cached: 0.0456s
│   ├── Difference: +0.0778s
│   └── Improvement: -63.0%
```

## Troubleshooting

### Debug panel không hiển thị
```php
// Kiểm tra debug mode
if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
    echo 'Debug mode is active';
}
```

### Cache comparison không hoạt động
1. Clear debug cache
2. Refresh trang nhiều lần
3. Kiểm tra browser console

### AJAX errors
1. Kiểm tra quyền admin
2. Xem WordPress debug log
3. Verify AJAX endpoint

## Next Steps

- [Cache Comparison](cache-comparison.md) - Chi tiết về cache comparison
- [Performance Monitoring](performance-monitoring.md) - Theo dõi hiệu suất
- [API Reference](api-reference.md) - AJAX endpoints và methods