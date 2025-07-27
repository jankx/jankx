# Jankx Services Documentation

## Tổng quan

Jankx Framework cung cấp một hệ thống services mạnh mẽ với caching, filtering và deferred loading capabilities. Các services được thiết kế để tối ưu performance và cung cấp API dễ sử dụng cho developers.

## Built-in Services

### 🔧 Core Services

#### User Service
- **File**: [user-service.md](user-service.md)
- **Class**: `Jankx\Services\UserService`
- **Facade**: `Jankx\Facades\User`
- **Mô tả**: Quản lý user data với caching và filtering
- **Tính năng**:
  - Cache thông minh với memory và WordPress object cache
  - Filter hooks cho customization
  - Context-aware (admin, frontend, API)
  - Meta management
  - Role-based queries

#### Deferred Service Resolver
- **File**: [deferred-service-resolver.md](deferred-service-resolver.md)
- **Class**: `Jankx\Services\DeferredServiceResolver`
- **Facade**: `Jankx\Facades\DeferredService`
- **Mô tả**: Resolve deferred services với lazy loading
- **Tính năng**:
  - Context-aware service loading
  - Performance monitoring
  - Cache management
  - Service statistics

#### Deferred Service Monitor
- **Class**: `Jankx\Services\DeferredServiceMonitor`
- **Mô tả**: Monitor performance của deferred services
- **Tính năng**:
  - Load time tracking
  - Memory usage monitoring
  - Performance metrics
  - Cache hit/miss statistics

#### Block Parser Service
- **Class**: `Jankx\Services\BlockParserService`
- **Mô tả**: Parse và render Gutenberg blocks
- **Tính năng**:
  - Block content parsing
  - Dynamic block rendering
  - Block pattern support
  - Template integration

#### Gutenberg Blocks Service
- **Class**: `Jankx\Services\GutenbergBlocksService`
- **Mô tả**: Quản lý Gutenberg blocks và patterns
- **Tính năng**:
  - Block registration
  - Pattern management
  - Block rendering
  - Ajax integration

## Service Architecture

### Service Container
```php
// Service được đăng ký trong container
$container->singleton('user.service', UserService::class);
$container->singleton('deferred.resolver', DeferredServiceResolver::class);
```

### Facade Pattern
```php
// Sử dụng Facade để truy cập service
use Jankx\Facades\User;
use Jankx\Facades\DeferredService;

$user = User::get(1);
$service = DeferredService::resolve('user.service');
```

### Deferred Loading
```php
// Services được load khi cần thiết
DeferredService::register('admin', UserService::class);
$userService = DeferredService::resolve('user.service');
```

## Service Registration

### Frontend Context
```php
// includes/Jankx/Providers/FrontendServiceProvider.php
$this->singleton('user.service', UserService::class);
```

### Admin Context
```php
// includes/Jankx/Providers/AdminServiceProvider.php
$this->singleton('user.service', UserService::class);
```

### CLI Context
```php
// includes/Jankx/Providers/CLIServiceProvider.php
// CLI-specific services
```

## Service Configuration

### Cache Settings
```php
// Cấu hình cache cho services
User::setCacheExpiry(1800); // 30 phút
DeferredService::setCacheExpiry(3600); // 1 giờ
```

### Context Detection
```php
// Services tự động detect context
if (is_admin()) {
    // Admin context services
} elseif (wp_doing_ajax()) {
    // Ajax context services
} else {
    // Frontend context services
}
```

## Performance Features

### Caching Strategy
- **Memory Cache**: In-memory caching cho fast access
- **Object Cache**: WordPress object cache integration
- **Cache Expiry**: Configurable expiry times
- **Cache Invalidation**: Automatic cache clearing

### Lazy Loading
- **Deferred Services**: Load only when needed
- **Context Loading**: Load based on current context
- **Resource Optimization**: Minimize memory usage

### Monitoring
- **Performance Metrics**: Track service performance
- **Memory Usage**: Monitor memory consumption
- **Cache Statistics**: Cache hit/miss rates
- **Load Times**: Service resolution times

## Best Practices

### 1. Service Usage
```php
// ✅ Sử dụng Facade
$user = User::get(1);

// ❌ Tránh tạo instance trực tiếp
$userService = new UserService();
$user = $userService->getUser(1);
```

### 2. Cache Management
```php
// Clear cache khi data thay đổi
User::clearCache(1);

// Set appropriate expiry times
User::setCacheExpiry(1800); // 30 phút
```

### 3. Error Handling
```php
try {
    $user = User::get($userId);
    if (!$user) {
        // Handle user not found
    }
} catch (\Exception $e) {
    // Handle errors
}
```

### 4. Performance Monitoring
```php
// Monitor service performance
$startTime = microtime(true);
$user = User::get($userId);
$loadTime = microtime(true) - $startTime;

if ($loadTime > 0.1) {
    Logger::warning("Slow user loading: {$loadTime}s");
}
```

## Service Development

### Creating New Services
```php
namespace Jankx\Services;

class MyService
{
    public function __construct()
    {
        // Service initialization
    }

    public function doSomething()
    {
        // Service logic
    }
}
```

### Registering Services
```php
// Trong ServiceProvider
$this->singleton('my.service', MyService::class);
```

### Creating Facades
```php
namespace Jankx\Facades;

class MyService extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'my.service';
    }

    public static function doSomething()
    {
        $service = static::getFacadeRoot();
        return $service->doSomething();
    }
}
```

## Troubleshooting

### Common Issues

#### Service Not Found
```php
// Kiểm tra service registration
if (DeferredService::has('user.service')) {
    $service = DeferredService::resolve('user.service');
}
```

#### Cache Issues
```php
// Clear all cache
User::clearCache();
DeferredService::clearCache();
```

#### Performance Issues
```php
// Monitor performance
$metrics = DeferredService::getPerformanceMetrics();
Logger::info('Service performance', $metrics);
```

### Debug Tools
```php
// Get service statistics
$stats = DeferredService::getStats();
$registryStats = DeferredService::getRegistryStats();
```

## Integration Examples

### WordPress Hooks
```php
class ServiceHookIntegration
{
    public function __construct()
    {
        add_action('profile_update', [$this, 'clearUserCache']);
        add_action('user_register', [$this, 'clearUserCache']);
    }

    public function clearUserCache($userId)
    {
        User::clearCache($userId);
    }
}
```

### Template Integration
```php
class TemplateServiceHelper
{
    public function renderUserProfile($userId)
    {
        $user = User::get($userId, [
            'ID', 'display_name', 'user_email'
        ]);

        if (!$user) {
            return '<p>User not found</p>';
        }

        return $this->renderTemplate('user-profile', $user);
    }
}
```

## Future Services

### Planned Services
- **Post Service**: Post data management với caching
- **Term Service**: Taxonomy term management
- **Meta Service**: Generic meta data management
- **Cache Service**: Advanced caching system
- **Log Service**: Structured logging system

### Service Extensions
- **Custom Services**: Developer-defined services
- **Service Plugins**: Plugin-based service extensions
- **Service Hooks**: Service lifecycle hooks
- **Service Events**: Event-driven service communication

## Contributing

### Adding New Services
1. Create service class in `includes/Jankx/Services/`
2. Create facade in `includes/Jankx/Facades/`
3. Register in appropriate ServiceProvider
4. Add documentation in `docs/services/`
5. Create tests in `tests/Services/`

### Service Guidelines
- Follow PSR-4 autoloading
- Implement proper error handling
- Add comprehensive logging
- Include performance monitoring
- Write unit tests
- Document with examples

---

**Jankx Services** - Modern WordPress Service Architecture