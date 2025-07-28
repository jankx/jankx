# Bootstrapping Flow - Jankx Framework

## Tổng quan

Bootstrapping Flow là quy trình khởi tạo và khởi động Jankx Framework. Flow này đảm bảo các thành phần được load theo đúng thứ tự và dependencies.

## Flow chính

```
Kernel → App → Bootstrapper → Service Provider → Service Boot
```

### 🔄 **Chi tiết từng bước:**

#### 1. **Kernel tạo App**
```php
// Kernel constructor
public function __construct(Container $container = null)
{
    $this->container = $container ?: Jankx::getInstance();
    $this->kernelType = $this->getKernelType();

    $this->registerBootstrappers();
    $this->registerServices();
    $this->registerHooks();
    $this->registerFilters();
}
```

#### 2. **App gọi Bootstrapper**
```php
// Kernel::boot() method
public function boot(): void
{
    if ($this->booted) {
        return;
    }

    // Run bootstrappers
    $this->runBootstrappers();

    // Load components
    $this->loadServices();
    $this->loadHooks();
    $this->loadFilters();

    $this->booted = true;

    do_action("jankx/kernel/{$this->kernelType}/booted", $this);
}
```

#### 3. **Bootstrapper gọi Service Provider**
```php
// Kernel::loadServices()
protected function loadServices()
{
    foreach ($this->getServiceProviders() as $providerClass) {
        if (class_exists($providerClass)) {
            try {
                $provider = new $providerClass($this->container);
                $provider->register();  // Đăng ký services
                $provider->boot();      // Boot services
            } catch (\Exception $e) {
                Logger::error("Không thể khởi tạo Service Provider {$providerClass}: " . $e->getMessage());
            }
        }
    }
}
```

#### 4. **Service Provider boot services cần thiết**
```php
// ServiceProvider abstract class
abstract class ServiceProvider
{
    protected $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    abstract public function register();  // Đăng ký services

    public function boot()               // Boot services
    {
        // Override if needed
    }

    protected function bind($abstract, $concrete = null, $shared = false)
    {
        $this->container->bind($abstract, $concrete, $shared);
    }

    protected function singleton($abstract, $concrete = null)
    {
        $this->bind($abstract, $concrete, true);
    }
}
```

## Kiến trúc chi tiết

### 🏗️ **Kernel (Core)**
- Quản lý Container (IoC)
- Điều phối toàn bộ framework
- Chạy bootstrappers theo priority
- Load service providers

**Kernel Types:**
- `FrontendKernel` - Cho frontend
- `AdminKernel` - Cho admin
- `CLIKernel` - Cho CLI

### 🔧 **Bootstrapper (Bootstrap)**
- Khởi tạo các thành phần cơ bản
- Setup environment
- Register core services
- Có priority system để chạy theo thứ tự

**Bootstrapper Types:**
- `GlobalBootstrapper` - Chạy mọi nơi
- `FrontendBootstrapper` - Chỉ frontend
- `AdminBootstrapper` - Chỉ admin
- `CLIBootstrapper` - Chỉ CLI

### 📦 **Service Provider (Services)**
- Đăng ký services vào container
- Boot services khi cần
- Quản lý dependencies
- Context-aware (Admin, Frontend, CLI)

**Service Provider Types:**
- `FrontendServiceProvider` - Services cho frontend
- `AdminServiceProvider` - Services cho admin
- `CLIServiceProvider` - Services cho CLI
- `DebugServiceProvider` - Services cho debug

## Flow thực tế

### 🔄 **Frontend Flow:**
```php
// 1. Kernel khởi tạo
$kernel = new FrontendKernel($container);

// 2. Kernel boot
$kernel->boot();

// 3. Chạy bootstrappers theo priority
foreach ($bootstrappers as $bootstrapper) {
    if ($bootstrapper->shouldRun()) {
        $bootstrapper->bootstrap($container);
    }
}

// 4. Load service providers
foreach ($serviceProviders as $provider) {
    $provider->register();  // Đăng ký services
    $provider->boot();      // Khởi động services
}
```

### 🔄 **Admin Flow:**
```php
// 1. Admin Kernel
$adminKernel = new AdminKernel($container);

// 2. Boot admin-specific components
$adminKernel->boot();

// 3. Load admin bootstrappers
// - AdminBootstrapper
// - GlobalBootstrapper

// 4. Load admin service providers
// - AdminServiceProvider
// - DebugServiceProvider (if debug mode)
```

### 🔄 **CLI Flow:**
```php
// 1. CLI Kernel
$cliKernel = new CLIKernel($container);

// 2. Boot CLI-specific components
$cliKernel->boot();

// 3. Load CLI bootstrappers
// - CLIBootstrapper
// - GlobalBootstrapper

// 4. Load CLI service providers
// - CLIServiceProvider
```

## Ví dụ thực tế

### 🐛 **Debug System Flow:**
```php
// 1. Kernel tạo app
$app = new Jankx();

// 2. App gọi bootstrapper
$bootstrapper = new DebugBootstrapper();
$bootstrapper->bootstrap($app);

// 3. Bootstrapper gọi service provider
$provider = new DebugServiceProvider($app);
$provider->register();  // Đăng ký DebugInfo service
$provider->boot();      // Khởi động debug system

// 4. Service provider boot service
$debugInfo = $app->make(DebugInfo::class);
$debugInfo->init();
```

### 🎨 **Frontend Flow:**
```php
// 1. Frontend Kernel
$frontendKernel = new FrontendKernel($container);

// 2. Register bootstrappers
$frontendKernel->addBootstrapper(FrontendBootstrapper::class);
$frontendKernel->addBootstrapper(GlobalBootstrapper::class);

// 3. Register service providers
$frontendKernel->addServiceProvider(FrontendServiceProvider::class);

// 4. Boot kernel
$frontendKernel->boot();

// 5. Services được load và sẵn sàng sử dụng
$templateEngine = $container->make(TemplateEngine::class);
$assetManager = $container->make(AssetManager::class);
```

## Priority System

### 📊 **Bootstrapper Priority:**
```php
// Lower number = higher priority
protected $priority = 1;   // Highest priority
protected $priority = 5;   // High priority
protected $priority = 10;  // Normal priority
protected $priority = 15;  // Low priority
protected $priority = 20;  // Lowest priority
```

### 🔄 **Execution Order:**
1. **Priority 1-5**: Core bootstrappers (Global, Environment)
2. **Priority 6-10**: Context bootstrappers (Frontend, Admin, CLI)
3. **Priority 11-15**: Feature bootstrappers (Debug, Cache, etc.)
4. **Priority 16-20**: Plugin bootstrappers

## Dependencies Management

### 🔗 **Bootstrapper Dependencies:**
```php
class DebugBootstrapper extends AbstractBootstrapper
{
    protected $dependencies = [
        'Jankx\Kernel\Kernel',
        'Jankx\Container\Container'
    ];

    public function shouldRun(): bool
    {
        return defined('JANKX_DEBUG') && JANKX_DEBUG;
    }

    public function bootstrap(Container $container): void
    {
        // Bootstrap debug system
        $debugInfo = new DebugInfo($container);
        $container->singleton(DebugInfo::class, $debugInfo);
    }
}
```

### 🔗 **Service Provider Dependencies:**
```php
class DebugServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Register debug services
        $this->singleton(DebugInfo::class);
        $this->singleton(DebugInfoRenderer::class);
        $this->singleton(DebugInfoService::class);
    }

    public function boot()
    {
        // Boot debug services
        $debugInfo = $this->container->make(DebugInfo::class);
        $debugInfo->init();
    }
}
```

## Error Handling

### ⚠️ **Bootstrapper Errors:**
```php
protected function runBootstrappers(): void
{
    foreach ($sortedBootstrappers as $bootstrapperClass) {
        try {
            $bootstrapper = $this->container->make($bootstrapperClass);

            if (!$bootstrapper->shouldRun()) {
                continue;
            }

            $bootstrapper->bootstrap($this->container);
        } catch (\Exception $e) {
            Logger::error("Bootstrapper {$bootstrapperClass} failed: " . $e->getMessage());
        }
    }
}
```

### ⚠️ **Service Provider Errors:**
```php
protected function loadServices()
{
    foreach ($this->getServiceProviders() as $providerClass) {
        try {
            $provider = new $providerClass($this->container);
            $provider->register();
            $provider->boot();
        } catch (\Exception $e) {
            Logger::error("Service Provider {$providerClass} failed: " . $e->getMessage());
        }
    }
}
```

## Best Practices

### ✅ **Kernel Design:**
- Mỗi context có kernel riêng
- Kernel quản lý container và dependencies
- Kernel chịu trách nhiệm bootstrapping flow

### ✅ **Bootstrapper Design:**
- Bootstrapper chỉ khởi tạo, không chứa business logic
- Sử dụng priority system để control execution order
- Check dependencies trước khi chạy

### ✅ **Service Provider Design:**
- Service provider đăng ký services vào container
- Boot method chỉ chạy khi cần thiết
- Handle errors gracefully

### ✅ **Error Handling:**
- Log errors nhưng không crash framework
- Continue execution nếu có lỗi
- Provide fallback mechanisms

## Performance Considerations

### ⚡ **Lazy Loading:**
```php
// Services chỉ được load khi cần
public function boot()
{
    if ($this->shouldBoot()) {
        $this->loadServices();
    }
}
```

### ⚡ **Conditional Loading:**
```php
// Chỉ load services cho context hiện tại
public function shouldRun(): bool
{
    return is_admin() && current_user_can('manage_options');
}
```

### ⚡ **Caching:**
```php
// Cache bootstrapped state
protected $booted = false;

public function boot(): void
{
    if ($this->booted) {
        return;
    }

    // Boot logic here
    $this->booted = true;
}
```

## Testing

### 🧪 **Kernel Testing:**
```php
class KernelTest extends TestCase
{
    public function test_kernel_boots_correctly()
    {
        $kernel = new FrontendKernel();
        $kernel->boot();

        $this->assertTrue($kernel->isBooted());
    }
}
```

### 🧪 **Bootstrapper Testing:**
```php
class BootstrapperTest extends TestCase
{
    public function test_bootstrapper_runs_in_order()
    {
        $kernel = new TestKernel();
        $kernel->addBootstrapper(TestBootstrapper::class);
        $kernel->boot();

        $this->assertTrue($kernel->hasBootstrapper(TestBootstrapper::class));
    }
}
```

### 🧪 **Service Provider Testing:**
```php
class ServiceProviderTest extends TestCase
{
    public function test_service_provider_registers_services()
    {
        $container = new Container();
        $provider = new TestServiceProvider($container);
        $provider->register();

        $this->assertTrue($container->bound(TestService::class));
    }
}
```

## Troubleshooting

### 🔍 **Common Issues:**

1. **Bootstrapper không chạy:**
   - Kiểm tra `shouldRun()` method
   - Verify dependencies
   - Check priority order

2. **Service Provider lỗi:**
   - Kiểm tra service registration
   - Verify container bindings
   - Check error logs

3. **Performance issues:**
   - Review bootstrapper priority
   - Optimize service loading
   - Use lazy loading

### 🔍 **Debug Tips:**
```php
// Enable debug logging
Logger::debug('Bootstrapper started', ['class' => get_class($this)]);
Logger::debug('Service Provider registered', ['provider' => $providerClass]);
Logger::debug('Kernel booted', ['type' => $this->kernelType]);
```

---

**Version**: 2.0.0
**Last Updated**: 2024
**Compatibility**: WordPress 5.0+, PHP 7.4+

## ✅ **Thống nhất Service Registration**

### 🔄 **Chuẩn mới:**

Tất cả services phải được register và boot thông qua **Service Provider**:

```php
// ✅ Đúng - Thông qua Service Provider
class AdminServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->singleton('admin.dashboard', Dashboard::class);
        $this->singleton('admin.menu', MenuManager::class);
        $this->singleton('admin.assets', AssetManager::class);
    }

    public function boot()
    {
        if ($this->container->has('admin.dashboard')) {
            $dashboard = $this->container->make('admin.dashboard');
            $dashboard->initialize();
        }
    }
}

// ❌ Sai - Register trực tiếp trong Kernel (Method addService đã bị xóa)
protected function registerServices(): void
{
    $this->addService('admin.dashboard', [
        'class' => \Jankx\Admin\Dashboard::class,
        'params' => []
    ]);
}
```

### 🏗️ **Service Provider Types:**

#### **1. AdminServiceProvider**
```php
// Admin-specific services
$this->singleton('admin.dashboard', Dashboard::class);
$this->singleton('admin.menu', MenuManager::class);
$this->singleton('admin.assets', AssetManager::class);
$this->singleton('admin.settings', SettingsManager::class);
$this->singleton('admin.notices', NoticeManager::class);
```

#### **2. FrontendServiceProvider**
```php
// Frontend-specific services
$this->singleton(TemplateRenderer::class);
$this->singleton(SEOManager::class);
$this->singleton(AnalyticsManager::class);
$this->singleton(AssetOptimizer::class);
$this->singleton(PerformanceMonitor::class);
```

#### **3. CLIServiceProvider**
```php
// CLI-specific services
$this->singleton('cli.commands', function ($container) {
    return new \Jankx\CLI\CLICommands($container);
});
$this->singleton('cli.command.code', function ($container) {
    return new CodeCommand($container);
});
```

#### **4. APIServiceProvider**
```php
// API-specific services
$this->singleton(APIManager::class);
$this->singleton(PostsEndpoint::class);
$this->singleton(PagesEndpoint::class);
$this->singleton(CategoriesEndpoint::class);
```

#### **5. DebugServiceProvider**
```php
// Debug-specific services
$this->singleton(DebugInfo::class);
$this->singleton(DebugInfoService::class);
$this->singleton(QueryCountService::class);
$this->singleton(CacheInfoService::class);
```

### 🔄 **Kernel Registration:**

```php
// AdminKernel.php
protected function registerServices(): void
{
    // Register AdminServiceProvider
    $this->addServiceProvider(\Jankx\Providers\AdminServiceProvider::class);
}

// FrontendKernel.php
protected function registerServices(): void
{
    // Register FrontendServiceProvider
    $this->addServiceProvider(\Jankx\Providers\FrontendServiceProvider::class);
}

// CLIKernel.php
protected function registerServices(): void
{
    // Register CLIServiceProvider
    $this->addServiceProvider(\Jankx\Providers\CLIServiceProvider::class);
}
```

### 🔧 **Kernel Loading:**

```php
// Kernel.php - loadServices method
protected function loadServices()
{
    // Load services from Service Providers
    foreach ($this->getServiceProviders() as $providerClass) {
        if (class_exists($providerClass)) {
            try {
                $provider = new $providerClass($this->container);
                $provider->register();  // Đăng ký services
                $provider->boot();      // Boot services
            } catch (\Exception $e) {
                Logger::error("Service Provider {$providerClass} failed: " . $e->getMessage());
            }
        }
    }

    // Load services registered directly in Kernel (backward compatibility)
    foreach ($this->services as $service) {
        try {
            if (is_array($service)) {
                $class = $service['class'];
                $params = $service['params'] ?? [];

                if (class_exists($class)) {
                    $this->container->singleton($class, function($container) use ($class, $params) {
                        return new $class(...$params);
                    });
                }
            } elseif (is_string($service)) {
                if (class_exists($service)) {
                    $this->container->singleton($service);
                }
            }
        } catch (\Exception $e) {
            Logger::error("Service {$service} failed: " . $e->getMessage());
        }
    }
}
```

### 🚫 **Không được phép:**

#### **1. Register trực tiếp trong Kernel**
```php
// ❌ Không được phép - Method addService đã bị xóa
protected function registerServices(): void
{
    $this->addService('admin.dashboard', [
        'class' => \Jankx\Admin\Dashboard::class,
        'params' => []
    ]);
}
```

#### **2. Register trực tiếp trong Bootstrapper**
```php
// ❌ Không được phép
public function bootstrap(Container $container): void
{
    $container->singleton(DebugInfo::class, $debugInfo);
}
```

#### **3. Register trực tiếp trong Helper**
```php
// ❌ Không được phép - Sử dụng Service Provider pattern thay thế
public static function registerServices(Container $container, array $services): void
{
    foreach ($services as $service) {
        $container->singleton($service);
    }
}
```

### ✅ **Phải làm:**

#### **1. Tạo Service Provider cho mỗi context**
```php
// ✅ Đúng
class MyCustomServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->singleton(MyService::class);
        $this->singleton(MyOtherService::class);
    }

    public function boot()
    {
        // Boot services if needed
    }

    public function shouldLoad(): bool
    {
        return true; // Logic để quyết định có load hay không
    }
}
```

#### **2. Register Service Provider trong Kernel**
```php
// ✅ Đúng
protected function registerServices(): void
{
    $this->addServiceProvider(\Jankx\Providers\MyCustomServiceProvider::class);
}
```

#### **3. Sử dụng Service Provider pattern**
```php
// ✅ Đúng
class AdminServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->singleton('admin.dashboard', \Jankx\Admin\Dashboard::class);
        $this->singleton(\Jankx\Services\UserService::class);
    }

    public function boot()
    {
        // Boot services if needed
    }
}
```

### 📊 **Tóm tắt thay đổi:**

| Trước | Sau |
|-------|-----|
| Register trực tiếp trong Kernel | Register qua Service Provider |
| Register trực tiếp trong Bootstrapper | Register qua Service Provider |
| Register trực tiếp trong Helper | Register qua Service Provider |
| Services scattered everywhere | Services centralized in Providers |
| No standard boot process | Standard boot process in Providers |

### 🎯 **Lợi ích:**

1. **Consistency**: Tất cả services đều được register theo cùng một cách
2. **Maintainability**: Dễ bảo trì và mở rộng
3. **Testability**: Dễ test từng Service Provider
4. **Separation of Concerns**: Mỗi Provider chịu trách nhiệm cho context riêng
5. **Standardization**: Chuẩn hóa cách register và boot services