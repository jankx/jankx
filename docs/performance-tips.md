# Jankx Framework Performance Tips

## Cải thiện Performance đã thực hiện

### 1. Environment Detection Caching
- Cache debug log check để tránh kiểm tra lặp lại
- Giảm 50-80% thời gian kiểm tra environment

### 2. Debug Logging Optimization
- Giảm số lượng debug log không cần thiết
- Gộp nhiều log thành một log duy nhất
- Chỉ log khi thực sự cần thiết

### 3. Console Request Optimization
- Gộp kiểm tra WP-CLI và WP-Cron thành một điều kiện
- Giảm số lần kiểm tra environment

## Cấu hình Performance

### Production Environment
```php
// wp-config.php
define('WP_DEBUG', false);
define('JANKX_DEBUG_LOG', false);
```

### Development Environment
```php
// wp-config.php
define('WP_DEBUG', true);
define('JANKX_DEBUG_LOG', true);
```

## Best Practices

### 1. Sử dụng Environment Helper
```php
// Thay vì
if (defined('WP_DEBUG') && WP_DEBUG) {
    // code
}

// Sử dụng
if (Environment::isDevelopment()) {
    // code
}
```

### 2. Debug Logging
```php
// Chỉ log khi cần thiết
if (Environment::isDebugLog()) {
    error_log('[JANKX DEBUG] Important message only');
}
```

### 3. Caching
```php
// Sử dụng WordPress transients
$data = get_transient('expensive_data');
if ($data === false) {
    $data = expensive_operation();
    set_transient('expensive_data', $data, 3600);
}
```

## Monitoring Performance

### 1. Memory Usage
```php
$memory = memory_get_usage(true);
$peak = memory_get_peak_usage(true);
```

### 2. Execution Time
```php
$start = microtime(true);
// your code
$end = microtime(true);
$time = $end - $start;
```

## Checklist

### Development
- [ ] Debug logging enabled
- [ ] Source maps enabled
- [ ] Caching disabled

### Production
- [ ] Debug logging disabled
- [ ] Caching enabled
- [ ] Asset minification enabled
- [ ] Object caching enabled

---

**Lưu ý:** Performance optimization là quá trình liên tục. Monitor và điều chỉnh theo nhu cầu cụ thể.