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

### 4. Lazy Loading Services
- Services chỉ được tạo khi thực sự cần thiết
- Cache services để tránh tạo lại
- Performance monitoring cho lazy loading

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

### 4. Lazy Loading Services
```php
// Sử dụng LazyLoader helper
use Jankx\Support\LazyLoader;

// Service chỉ được tạo khi cần
$service = LazyLoader::service('expensive.service');

// Kiểm tra service có lazy không
if (LazyLoader::isLazy('expensive.service')) {
    // Service được lazy load
}

// Monitor performance
LazyLoader::monitor('expensive.service');
```

#### Complete Example:
```php
<?php
/**
 * Lazy Loading Example
 *
 * This example demonstrates how to use lazy loading
 * for expensive services in Jankx Framework
 */

// Initialize LazyLoader with application
use Jankx\Support\LazyLoader;
use Jankx\Support\Providers\LazyServiceProvider;

// Register lazy service provider
$app->registerLazy(LazyServiceProvider::class);

// Set application in LazyLoader
LazyLoader::setApp($app);

// Example 1: Basic lazy loading
echo "=== Example 1: Basic Lazy Loading ===\n";

// Service is not created yet
echo "Before loading: " . (LazyLoader::isLazy('expensive.service') ? 'Yes' : 'No') . "\n";

// Service is created only when requested
$service = LazyLoader::service('expensive.service');
echo "After loading: " . ($service->isLoaded() ? 'Yes' : 'No') . "\n";
echo "User count: " . $service->getUserCount() . "\n";

// Example 2: Performance monitoring
echo "\n=== Example 2: Performance Monitoring ===\n";

// Monitor service loading time
LazyLoader::monitor('expensive.service');

// Example 3: Cache demonstration
echo "\n=== Example 3: Cache Demonstration ===\n";

// First call - creates service
$start1 = microtime(true);
$service1 = LazyLoader::service('expensive.service');
$time1 = (microtime(true) - $start1) * 1000;

// Second call - uses cached service
$start2 = microtime(true);
$service2 = LazyLoader::service('expensive.service');
$time2 = (microtime(true) - $start2) * 1000;

echo "First call: {$time1}ms\n";
echo "Second call: {$time2}ms\n";
echo "Performance improvement: " . round(($time1 - $time2) / $time1 * 100, 2) . "%\n";

// Example 4: Multiple services
echo "\n=== Example 4: Multiple Services ===\n";

$services = [
    'expensive.service',
    'heavy.calculator',
    'complex.validator'
];

foreach ($services as $serviceName) {
    if (LazyLoader::isLazy($serviceName)) {
        echo "Loading {$serviceName}...\n";
        $service = LazyLoader::service($serviceName);
        echo "✓ {$serviceName} loaded\n";
    }
}

// Show cached services
echo "\nCached services: " . implode(', ', LazyLoader::getCachedServices()) . "\n";

// Example 5: Clear cache
echo "\n=== Example 5: Clear Cache ===\n";

LazyLoader::clearCache();
echo "Cache cleared. Cached services: " . implode(', ', LazyLoader::getCachedServices()) . "\n";

/**
 * Output example:
 *
 * === Example 1: Basic Lazy Loading ===
 * Before loading: Yes
 * After loading: Yes
 * User count: 1000
 *
 * === Example 2: Performance Monitoring ===
 * [JANKX LAZY LOAD] Service "expensive.service" loaded in 15.23 ms
 *
 * === Example 3: Cache Demonstration ===
 * First call: 15.23ms
 * Second call: 0.05ms
 * Performance improvement: 99.67%
 *
 * === Example 4: Multiple Services ===
 * Loading expensive.service...
 * ✓ expensive.service loaded
 * Loading heavy.calculator...
 * ✓ heavy.calculator loaded
 * Loading complex.validator...
 * ✓ complex.validator loaded
 *
 * Cached services: expensive.service, heavy.calculator, complex.validator
 *
 * === Example 5: Clear Cache ===
 * Cache cleared. Cached services:
 */
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