# Deferred Services System

Hệ thống Deferred Services cho phép bạn đăng ký các service nhưng chỉ khởi tạo chúng khi thực sự cần thiết, giúp tối ưu hóa hiệu suất và tiết kiệm tài nguyên.

## Cấu trúc

```
app/
├── Services/
│   ├── DeferredServiceManager.php    # Quản lý các deferred services
│   ├── ServiceInterface.php          # Interface cho các service
│   ├── AbstractService.php           # Abstract class cho services
│   ├── ExampleService.php            # Service ví dụ
│   └── CacheService.php              # Service cache
├── Providers/
│   └── DeferredServiceProvider.php   # Provider đăng ký services
├── Helpers/
│   └── ServiceHelper.php             # Helper để dễ sử dụng
└── Examples/
    └── DeferredServiceUsage.php      # Ví dụ sử dụng
```

## Tính năng chính

### 1. Lazy Loading
- Services chỉ được khởi tạo khi cần thiết
- Tiết kiệm memory và CPU
- Tối ưu hóa thời gian khởi động

### 2. Dependency Injection
- Hỗ trợ dependencies giữa các services
- Tự động resolve dependencies
- Tránh circular dependencies

### 3. WordPress Integration
- Tích hợp với WordPress hooks
- Hỗ trợ admin/frontend contexts
- Debug tools cho development

### 4. Cache Integration
- Tích hợp với WordPress transients
- TTL (Time To Live) support
- Remember pattern cho expensive operations

## Cách sử dụng

### 1. Đăng ký Provider

Trong file `functions.php` hoặc theme bootstrap:

```php
// Đăng ký DeferredServiceProvider
add_action('after_setup_theme', function () {
    $app = jankx_app(); // hoặc cách lấy app instance của bạn
    $app->register(\App\Providers\DeferredServiceProvider::class);

    // Khởi tạo ServiceHelper
    \App\Helpers\ServiceHelper::init($app);
});
```

### 2. Sử dụng cơ bản

```php
// Lấy service khi cần
if (\App\Helpers\ServiceHelper::hasService('example')) {
    $exampleService = \App\Helpers\ServiceHelper::service('example');
    $exampleService->initialize();

    $data = $exampleService->getData();
    echo json_encode($data);
}
```

### 3. Sử dụng Cache Service

```php
// Lấy cache service
$cacheService = \App\Helpers\ServiceHelper::cache();
$cacheService->initialize();

// Lưu dữ liệu
$cacheService->set('key', 'value', 3600); // Cache 1 giờ

// Lấy dữ liệu
$value = $cacheService->get('key', 'default');

// Remember pattern
$expensiveData = $cacheService->remember('expensive', function () {
    // Tính toán tốn kém
    return expensive_calculation();
}, 3600);
```

### 4. Tạo Custom Service

```php
class CustomService extends \App\Services\AbstractService
{
    protected $name = 'custom';

    protected function boot(): void
    {
        // Logic khởi tạo service
        $this->setData('custom_feature', true);
    }

    public function customMethod()
    {
        return "Custom method called";
    }
}
```

### 5. Đăng ký Custom Service

```php
// Trong DeferredServiceProvider hoặc nơi khác
$deferredManager = $app->make(\App\Services\DeferredServiceManager::class);

$deferredManager->register('custom', function () use ($app) {
    return new CustomService($app);
});
```

## WordPress Hooks

### 1. Frontend Hooks

```php
add_action('wp_head', function () {
    if (\App\Helpers\ServiceHelper::hasService('example')) {
        $exampleService = \App\Helpers\ServiceHelper::example();
        $exampleService->initialize();

        // Thêm meta tags hoặc scripts
        echo '<meta name="service-status" content="initialized">';
    }
});
```

### 2. Admin Hooks

```php
add_action('admin_init', function () {
    if (\App\Helpers\ServiceHelper::hasService('cache')) {
        $cacheService = \App\Helpers\ServiceHelper::cache();
        $cacheService->initialize();

        // Hiển thị thống kê trong admin
        $stats = $cacheService->getStats();
        add_action('admin_notices', function () use ($stats) {
            echo '<div class="notice notice-info">';
            echo '<p>Cache: ' . $stats['valid'] . ' valid items</p>';
            echo '</div>';
        });
    }
});
```

### 3. AJAX Hooks

```php
add_action('wp_ajax_get_service_stats', function () {
    $stats = \App\Helpers\ServiceHelper::getStats();
    wp_send_json_success($stats);
});
```

## Debug và Monitoring

### 1. Debug Panel

```php
// Hiển thị debug panel (chỉ khi WP_DEBUG = true)
\App\Helpers\ServiceHelper::debug();
```

### 2. Thống kê Services

```php
$stats = \App\Helpers\ServiceHelper::getStats();
echo json_encode($stats, JSON_PRETTY_PRINT);
```

### 3. Resolve All Services

```php
// Khởi tạo tất cả services (cho debug)
\App\Helpers\ServiceHelper::resolveAll();
```

## Best Practices

### 1. Service Design
- Luôn extend `AbstractService`
- Implement `ServiceInterface`
- Sử dụng `boot()` method cho initialization
- Kiểm tra `isInitialized()` trước khi sử dụng

### 2. Performance
- Chỉ initialize services khi cần
- Sử dụng cache cho expensive operations
- Monitor memory usage với debug tools

### 3. WordPress Integration
- Sử dụng WordPress hooks appropriately
- Kiểm tra context (admin/frontend)
- Handle AJAX requests properly

### 4. Error Handling
- Luôn kiểm tra service tồn tại trước khi sử dụng
- Handle exceptions gracefully
- Log errors trong development

## API Reference

### DeferredServiceManager

```php
// Đăng ký service
$manager->register($name, $callback, $dependencies);

// Lấy service
$service = $manager->get($name);

// Kiểm tra service
$manager->isRegistered($name);
$manager->isResolved($name);

// Resolve tất cả
$manager->resolveAll();

// Thống kê
$manager->getRegisteredServices();
$manager->getResolvedServices();
```

### ServiceHelper

```php
// Lấy service
ServiceHelper::service($name);

// Kiểm tra
ServiceHelper::hasService($name);
ServiceHelper::isResolved($name);

// Helper methods
ServiceHelper::cache();
ServiceHelper::example();
ServiceHelper::advancedExample();

// Debug
ServiceHelper::debug();
ServiceHelper::getStats();
ServiceHelper::resolveAll();
```

### AbstractService

```php
// Khởi tạo
$service->initialize();

// Kiểm tra
$service->isInitialized();

// Lấy tên
$service->getName();

// Lấy app
$service->getApp();
```

## Troubleshooting

### 1. Service không được đăng ký
- Kiểm tra provider đã được register chưa
- Kiểm tra namespace và autoload
- Kiểm tra ServiceHelper đã được init chưa

### 2. Service không initialize
- Kiểm tra `initialize()` method đã được gọi chưa
- Kiểm tra `boot()` method có lỗi không
- Kiểm tra dependencies có resolve được không

### 3. Memory issues
- Sử dụng debug tools để monitor
- Kiểm tra services có bị leak không
- Sử dụng `flush()` method để cleanup

### 4. WordPress conflicts
- Kiểm tra hook priorities
- Kiểm tra context (admin/frontend)
- Kiểm tra AJAX handling

## Examples

Xem file `app/Examples/DeferredServiceUsage.php` để có thêm ví dụ chi tiết về cách sử dụng hệ thống Deferred Services.