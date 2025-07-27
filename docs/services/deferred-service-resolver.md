# Deferred Service Resolver

## Tổng quan

Deferred Service Resolver là một component quan trọng trong Jankx Framework, chịu trách nhiệm quản lý việc resolve các deferred services với lazy loading và context-aware loading.

## Tính năng chính

- **Lazy Loading**: Services chỉ được load khi thực sự cần thiết
- **Context-aware**: Load services dựa trên context hiện tại
- **Performance Monitoring**: Theo dõi performance của service resolution
- **Cache Management**: Quản lý cache cho resolved services
- **Error Handling**: Xử lý lỗi khi resolve services

## Cách sử dụng

### 1. Sử dụng Facade

```php
use Jankx\Facades\DeferredService;

// Resolve service
$userService = DeferredService::resolve('user.service');

// Check if service exists
if (DeferredService::has('user.service')) {
    $service = DeferredService::resolve('user.service');
}

// Get resolved services
$resolvedServices = DeferredService::getResolvedServices();

// Get performance metrics
$metrics = DeferredService::getPerformanceMetrics();
```

### 2. Service Registration

```php
// Register service for specific context
DeferredService::register('admin', UserService::class);

// Register multiple services
DeferredService::registerMultiple('frontend', [
    UserService::class,
    PostService::class,
]);

// Defer service with factory
DeferredService::defer('admin', function($container) {
    return new HeavyService($container);
});
```

### 3. Context Management

```php
// Get current context
$context = DeferredService::getCurrentContext();

// Register for specific context
DeferredService::register('admin', AdminService::class);
DeferredService::register('frontend', FrontendService::class);
```

## Performance Monitoring

### Get Statistics

```php
// Get resolution statistics
$stats = DeferredService::getStats();

// Get registry statistics
$registryStats = DeferredService::getRegistryStats();

// Get performance metrics
$metrics = DeferredService::getPerformanceMetrics();
```

### Monitor Performance

```php
// Log performance metrics
DeferredService::logMetrics();

// Get performance summary
$summary = DeferredService::getPerformanceMetrics();
```

## Cache Management

### Clear Cache

```php
// Clear all resolved services cache
DeferredService::clearCache();

// Clear specific service cache
DeferredService::clearCache('user.service');
```

### Cache Configuration

```php
// Set cache expiry
DeferredService::setCacheExpiry(3600); // 1 hour

// Get cache expiry
$expiry = DeferredService::getCacheExpiry();
```

## Error Handling

```php
try {
    $service = DeferredService::resolve('user.service');
} catch (\Exception $e) {
    Logger::error('Failed to resolve service', [
        'service' => 'user.service',
        'error' => $e->getMessage(),
    ]);
}
```

## Integration Examples

### WordPress Hooks

```php
class ServiceHookIntegration
{
    public function __construct()
    {
        add_action('init', [$this, 'registerServices']);
        add_action('wp_loaded', [$this, 'loadContextServices']);
    }

    public function registerServices()
    {
        // Register core services
        DeferredService::register('shared', UserService::class);
        DeferredService::register('shared', PostService::class);
    }

    public function loadContextServices()
    {
        $context = DeferredService::getCurrentContext();

        // Load context-specific services
        switch ($context) {
            case 'admin':
                DeferredService::register('admin', AdminService::class);
                break;
            case 'frontend':
                DeferredService::register('frontend', FrontendService::class);
                break;
        }
    }
}
```

### Service Provider Integration

```php
class CustomServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Register deferred services
        DeferredService::register('admin', CustomAdminService::class);
        DeferredService::register('frontend', CustomFrontendService::class);
    }
}
```

## Best Practices

### 1. Service Registration

```php
// ✅ Register services early
add_action('init', function() {
    DeferredService::register('shared', CoreService::class);
});

// ❌ Avoid late registration
add_action('wp_loaded', function() {
    DeferredService::register('shared', CoreService::class);
});
```

### 2. Context Management

```php
// ✅ Use appropriate contexts
DeferredService::register('admin', AdminService::class);
DeferredService::register('frontend', FrontendService::class);

// ❌ Avoid registering everything as shared
DeferredService::register('shared', HeavyService::class);
```

### 3. Performance Monitoring

```php
// Monitor service resolution performance
$startTime = microtime(true);
$service = DeferredService::resolve('user.service');
$loadTime = microtime(true) - $startTime;

if ($loadTime > 0.1) {
    Logger::warning("Slow service resolution: {$loadTime}s");
}
```

## Troubleshooting

### Service Not Found

```php
// Check if service is registered
if (!DeferredService::has('user.service')) {
    // Register the service
    DeferredService::register('shared', UserService::class);
}

// Check current context
$context = DeferredService::getCurrentContext();
Logger::info("Current context: {$context}");
```

### Performance Issues

```php
// Get performance metrics
$metrics = DeferredService::getPerformanceMetrics();

// Check cache hit rates
$stats = DeferredService::getStats();

// Clear cache if needed
DeferredService::clearCache();
```

### Memory Issues

```php
// Monitor memory usage
$memoryUsage = memory_get_usage(true);

// Clear resolved services
DeferredService::clearCache();

// Check memory after cleanup
$memoryAfter = memory_get_usage(true);
Logger::info("Memory freed: " . ($memoryUsage - $memoryAfter));
```

## Advanced Usage

### Custom Service Factory

```php
DeferredService::defer('admin', function($container) {
    $config = $container->make('config');
    return new CustomService($config);
});
```

### Service Dependencies

```php
DeferredService::defer('admin', function($container) {
    $userService = $container->make('user.service');
    $postService = $container->make('post.service');

    return new ComplexService($userService, $postService);
});
```

### Conditional Service Loading

```php
DeferredService::defer('admin', function($container) {
    if (is_super_admin()) {
        return new AdminService($container);
    } else {
        return new LimitedAdminService($container);
    }
});
```

## Configuration

### Environment Variables

```php
// Enable/disable deferred services
define('JANKX_DEFERRED_SERVICES', true);

// Enable service monitoring
define('JANKX_SERVICE_MONITORING', true);

// Enable service metrics logging
define('JANKX_LOG_SERVICE_METRICS', false);
```

### Service Configuration

```php
// Configure service options
DeferredService::register('admin', UserService::class, [
    'deferred' => true,
    'priority' => 10,
    'cache' => true,
]);
```

---

**Deferred Service Resolver** - Smart Service Resolution System