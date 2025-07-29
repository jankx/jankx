# Coding Rules - Jankx Framework

## Tổng quan

Coding Rules định nghĩa các quy tắc và chuẩn code cho Jankx Framework, đảm bảo tính nhất quán, bảo trì và mở rộng.

## Kiến trúc Framework

### 🔄 **Bootstrapping Flow**

```
Kernel → App → Bootstrapper → Service Provider → Service Boot
```

#### **Flow chi tiết:**

1. **Kernel tạo App**
   ```php
   // Kernel constructor
   public function __construct(Container $container = null)
   {
       $this->container = $container ?: Jankx::getInstance();
       $this->registerBootstrappers();
       $this->registerServices();
   }
   ```

2. **App gọi Bootstrapper**
   ```php
   // Kernel::boot() method
   public function boot(): void
   {
       $this->runBootstrappers();
       $this->loadServices();
       $this->loadHooks();
       $this->loadFilters();
   }
   ```

3. **Bootstrapper gọi Service Provider**
   ```php
   // Kernel::loadServices()
   protected function loadServices()
   {
       foreach ($this->getServiceProviders() as $providerClass) {
           $provider = new $providerClass($this->container);
           $provider->register();  // Đăng ký services
           $provider->boot();      // Boot services
       }
   }
   ```

4. **Service Provider boot services cần thiết**
   ```php
   // ServiceProvider abstract class
   abstract class ServiceProvider
   {
       abstract public function register();  // Đăng ký services

       public function boot()               // Boot services
       {
           // Override if needed
       }
   }
   ```

### 🏗️ **Kiến trúc Components:**

#### **Kernel (Core)**
- Quản lý Container (IoC)
- Điều phối toàn bộ framework
- Chạy bootstrappers theo priority
- Load service providers

#### **Bootstrapper (Bootstrap)**
- Khởi tạo các thành phần cơ bản
- Setup environment
- Register core services
- Có priority system để chạy theo thứ tự

#### **Service Provider (Services)**
- Đăng ký services vào container
- Boot services khi cần
- Quản lý dependencies
- Context-aware (Admin, Frontend, CLI)

## Naming Conventions

### 📝 **Class Names**
```php
// ✅ Đúng
class FrontendKernel extends Kernel
class AdminBootstrapper extends AbstractBootstrapper
class DebugServiceProvider extends ServiceProvider
class TemplateRenderer
class AssetManager

// ❌ Sai
class frontend_kernel
class admin_bootstrapper
class debug_service_provider
class template_renderer
class asset_manager
```

### 📝 **Method Names**
```php
// ✅ Đúng
public function boot(): void
public function register(): void
public function shouldRun(): bool
public function bootstrap(Container $container): void
public function getContainer(): Container

// ❌ Sai
public function Boot(): void
public function Register(): void
public function should_run(): bool
public function Bootstrap(Container $container): void
public function get_container(): Container
```

### 📝 **Property Names**
```php
// ✅ Đúng
protected $container;
protected $bootstrappers = [];
protected $serviceProviders = [];
protected $booted = false;
protected $priority = 10;

// ❌ Sai
protected $Container;
protected $bootstrappers_array = [];
protected $service_providers = [];
protected $Booted = false;
protected $Priority = 10;
```

### 📝 **Constant Names**
```php
// ✅ Đúng
const FRAMEWORK_NAME = 'Jankx';
const FRAMEWORK_VERSION = '2.0.0';
const DEFAULT_PRIORITY = 10;
const DEBUG_MODE = true;

// ❌ Sai
const framework_name = 'Jankx';
const Framework_Version = '2.0.0';
const default_priority = 10;
const debug_mode = true;
```

## File Structure

### 📁 **Directory Structure**
```
includes/Jankx/
├── Kernel/
│   ├── Kernel.php
│   ├── FrontendKernel.php
│   ├── AdminKernel.php
│   └── CLIKernel.php
├── Bootstrappers/
│   ├── AbstractBootstrapper.php
│   ├── Global/
│   ├── Frontend/
│   ├── Admin/
│   └── CLI/
├── Providers/
│   ├── ServiceProvider.php
│   ├── FrontendServiceProvider.php (bao gồm debug services)
│   ├── AdminServiceProvider.php
│   ├── APIServiceProvider.php
│   ├── CLIServiceProvider.php
│   ├── DebugServiceProvider.php (chỉ frontend context)
│   └── ContextualServiceProvider.php
├── Services/
│   ├── DebugInfo.php
│   ├── TemplateRenderer.php
│   └── AssetManager.php
└── Contracts/
    ├── KernelInterface.php
    ├── BootstrapperInterface.php
    └── ServiceProviderInterface.php
```

### 📁 **File Naming**
```php
// ✅ Đúng
Kernel.php
FrontendKernel.php
AdminBootstrapper.php
DebugServiceProvider.php
TemplateRenderer.php

// ❌ Sai
kernel.php
frontend_kernel.php
admin_bootstrapper.php
debug_service_provider.php
template_renderer.php
```

## Code Organization

### 🏗️ **Class Structure**
```php
<?php

namespace Jankx\Kernel;

use Jankx\Contracts\KernelInterface;
use Jankx\Contracts\BootstrapperInterface;
use Illuminate\Container\Container;
use Jankx\Facades\Logger;

/**
 * Abstract Kernel Class
 *
 * Base class for all kernel types in Jankx framework
 *
 * @package Jankx\Kernel
 */
abstract class Kernel implements KernelInterface
{
    // 1. Properties
    protected $container;
    protected $bootstrappers = [];
    protected $serviceProviders = [];
    protected $booted = false;

    // 2. Constructor
    public function __construct(Container $container = null)
    {
        $this->container = $container ?: Jankx::getInstance();
        $this->registerBootstrappers();
        $this->registerServices();
    }

    // 3. Abstract methods
    abstract protected function registerBootstrappers(): void;
    abstract protected function registerServices(): void;

    // 4. Public methods
    public function boot(): void
    {
        if ($this->booted) {
            return;
        }

        $this->runBootstrappers();
        $this->loadServices();
        $this->loadHooks();
        $this->loadFilters();

        $this->booted = true;
    }

    // 5. Protected methods
    protected function runBootstrappers(): void
    {
        // Implementation
    }

    // 6. Private methods
    private function sortBootstrappersByPriority(): array
    {
        // Implementation
    }
}
```

### 🔧 **Method Organization**
```php
class ExampleClass
{
    // 1. Properties
    protected $property;

    // 2. Constructor
    public function __construct()
    {
        // Constructor logic
    }

    // 3. Public methods
    public function publicMethod(): void
    {
        // Public method logic
    }

    // 4. Protected methods
    protected function protectedMethod(): void
    {
        // Protected method logic
    }

    // 5. Private methods
    private function privateMethod(): void
    {
        // Private method logic
    }
}
```

## Type Declarations

### 📝 **Property Types**
```php
// ✅ Đúng
protected Container $container;
protected array $bootstrappers = [];
protected bool $booted = false;
protected int $priority = 10;
protected string $kernelType;

// ❌ Sai
protected $container;
protected $bootstrappers = [];
protected $booted = false;
protected $priority = 10;
protected $kernelType;
```

### 📝 **Method Return Types**
```php
// ✅ Đúng
public function boot(): void
public function getContainer(): Container
public function getBootstrappers(): array
public function isBooted(): bool
public function getPriority(): int

// ❌ Sai
public function boot()
public function getContainer()
public function getBootstrappers()
public function isBooted()
public function getPriority()
```

### 📝 **Parameter Types**
```php
// ✅ Đúng
public function bootstrap(Container $container): void
public function addBootstrapper(string $bootstrapper): void
public function hasBootstrapper(string $bootstrapper): bool
public function setPriority(int $priority): void

// ❌ Sai
public function bootstrap($container): void
public function addBootstrapper($bootstrapper): void
public function hasBootstrapper($bootstrapper): bool
public function setPriority($priority): void
```

## Error Handling

### ⚠️ **Exception Handling**
```php
// ✅ Đúng
try {
    $provider = new $providerClass($this->container);
    $provider->register();
    $provider->boot();
} catch (\Exception $e) {
    Logger::error("Service Provider {$providerClass} failed: " . $e->getMessage());
}

// ❌ Sai
$provider = new $providerClass($this->container);
$provider->register();
$provider->boot();
```

### ⚠️ **Error Logging**
```php
// ✅ Đúng
Logger::error("Bootstrapper {$bootstrapperClass} failed: " . $e->getMessage());
Logger::debug('Kernel booted', ['type' => $this->kernelType]);

// ❌ Sai
error_log("Bootstrapper failed");
echo "Kernel booted";
```

## Performance Rules

### ⚡ **Lazy Loading**
```php
// ✅ Đúng
public function boot(): void
{
    if ($this->booted) {
        return;
    }

    // Boot logic here
    $this->booted = true;
}

// ❌ Sai
public function boot(): void
{
    // Always run boot logic
    $this->booted = true;
}
```

### ⚡ **Conditional Loading**
```php
// ✅ Đúng
public function shouldRun(): bool
{
    return is_admin() && current_user_can('manage_options');
}

// ❌ Sai
public function shouldRun(): bool
{
    return true; // Always run
}
```

### ⚡ **Memory Management**
```php
// ✅ Đúng
protected function loadServices()
{
    foreach ($this->getServiceProviders() as $providerClass) {
        if (class_exists($providerClass)) {
            $provider = new $providerClass($this->container);
            $provider->register();
            $provider->boot();
        }
    }
}

// ❌ Sai
protected function loadServices()
{
    $providers = $this->getServiceProviders();
    foreach ($providers as $providerClass) {
        $provider = new $providerClass($this->container);
        $provider->register();
        $provider->boot();
    }
}
```

## Security Rules

### 🔒 **Input Validation**
```php
// ✅ Đúng
public function addBootstrapper(string $bootstrapper): void
{
    if (!class_exists($bootstrapper)) {
        throw new \InvalidArgumentException("Bootstrapper {$bootstrapper} does not exist");
    }

    if (!in_array($bootstrapper, $this->bootstrappers)) {
        $this->bootstrappers[] = $bootstrapper;
    }
}

// ❌ Sai
public function addBootstrapper(string $bootstrapper): void
{
    $this->bootstrappers[] = $bootstrapper;
}
```

### 🔒 **Permission Checks**
```php
// ✅ Đúng
public function shouldRun(): bool
{
    return is_admin() && current_user_can('manage_options');
}

// ❌ Sai
public function shouldRun(): bool
{
    return true;
}
```

### 🔒 **Data Sanitization**
```php
// ✅ Đúng
public function setKernelType(string $type): void
{
    $this->kernelType = sanitize_text_field($type);
}

// ❌ Sai
public function setKernelType(string $type): void
{
    $this->kernelType = $type;
}
```

## Testing Rules

### 🧪 **Unit Testing**
```php
// ✅ Đúng
class KernelTest extends TestCase
{
    public function test_kernel_boots_correctly()
    {
        $kernel = new FrontendKernel();
        $kernel->boot();

        $this->assertTrue($kernel->isBooted());
    }
}

// ❌ Sai
class KernelTest extends TestCase
{
    public function test_kernel_boots_correctly()
    {
        $kernel = new FrontendKernel();
        $kernel->boot();

        // No assertions
    }
}
```

### 🧪 **Integration Testing**
```php
// ✅ Đúng
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

## Documentation Rules

### 📝 **Class Documentation**
```php
/**
 * Abstract Kernel Class
 *
 * Base class for all kernel types in Jankx framework.
 * Provides common functionality and enforces contract implementation.
 *
 * @package Jankx\Kernel
 * @since 2.0.0
 */
abstract class Kernel implements KernelInterface
{
    // Class implementation
}
```

### 📝 **Method Documentation**
```php
/**
 * Boot the kernel
 *
 * Initializes all bootstrappers, loads services, and sets up hooks.
 * This method should only be called once per kernel instance.
 *
 * @return void
 * @throws \RuntimeException If bootstrapping fails
 */
public function boot(): void
{
    // Method implementation
}
```

### 📝 **Property Documentation**
```php
/**
 * @var Container The service container instance
 */
protected $container;

/**
 * @var array List of registered bootstrappers
 */
protected $bootstrappers = [];

/**
 * @var bool Whether the kernel has been booted
 */
protected $booted = false;
```

## Best Practices

### ✅ **Do's**
- Sử dụng type declarations cho tất cả properties và methods
- Implement proper error handling với try-catch
- Log errors và debug information
- Use lazy loading cho performance
- Follow naming conventions
- Write comprehensive tests
- Document all public methods và classes

### ❌ **Don'ts**
- Không sử dụng global variables
- Không hardcode values
- Không ignore exceptions
- Không use magic numbers
- Không write code without tests
- Không skip documentation

## Code Review Checklist

### 🔍 **Architecture**
- [ ] Follows bootstrapping flow: Kernel → App → Bootstrapper → Service Provider
- [ ] Uses proper dependency injection
- [ ] Implements interfaces correctly
- [ ] Follows separation of concerns

### 🔍 **Code Quality**
- [ ] Uses type declarations
- [ ] Follows naming conventions
- [ ] Implements proper error handling
- [ ] Includes comprehensive tests
- [ ] Has proper documentation

### 🔍 **Performance**
- [ ] Uses lazy loading where appropriate
- [ ] Implements conditional loading
- [ ] Avoids memory leaks
- [ ] Optimizes database queries

### 🔍 **Security**
- [ ] Validates all inputs
- [ ] Checks permissions
- [ ] Sanitizes data
- [ ] Uses prepared statements

---

**Version**: 2.0.0
**Last Updated**: 2024
**Compatibility**: WordPress 5.0+, PHP 7.4+

## Service Registration Rules

### 🔄 **Service Provider Pattern (Bắt buộc)**

Tất cả services phải được register và boot thông qua **Service Provider**:

```php
// ✅ Đúng - Thông qua Service Provider
class AdminServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->singleton('admin.dashboard', Dashboard::class);
        $this->singleton('admin.menu', MenuManager::class);
    }

    public function boot()
    {
        if ($this->container->has('admin.dashboard')) {
            $dashboard = $this->container->make('admin.dashboard');
            $dashboard->initialize();
        }
    }
}

// ❌ Sai - Register trực tiếp
protected function registerServices(): void
{
    $this->addService('admin.dashboard', [
        'class' => \Jankx\Admin\Dashboard::class,
        'params' => []
    ]);
}
```

### 🏗️ **Service Provider Types**

#### **1. Context-Specific Providers**
```php
// AdminServiceProvider - Admin context
// FrontendServiceProvider - Frontend context
// CLIServiceProvider - CLI context
// APIServiceProvider - API context
// DebugServiceProvider - Debug context (chỉ frontend)
```

#### **2. Feature-Specific Providers**
```php
// GutenbergServiceProvider - Gutenberg features
// WooCommerceServiceProvider - WooCommerce features
// SecurityServiceProvider - Security features
// PerformanceServiceProvider - Performance features
```

### 🔧 **Kernel Integration**

```php
// ✅ Đúng - Register Service Provider trong Kernel
protected function registerServices(): void
{
    $this->addServiceProvider(\Jankx\Providers\AdminServiceProvider::class);
    $this->addServiceProvider(\Jankx\Providers\FrontendServiceProvider::class);
}

// ❌ Sai - Register services trực tiếp
protected function registerServices(): void
{
    $this->addService('admin.dashboard', [
        'class' => \Jankx\Admin\Dashboard::class,
        'params' => []
    ]);
}
```

### 🚫 **Không được phép**

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

### ✅ **Phải làm**

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
    $this->addServiceProvider(\Jankx\Providers\AdminServiceProvider::class);
    $this->addServiceProvider(\Jankx\Providers\FrontendServiceProvider::class);
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

### 📋 **Service Provider Checklist**

- [ ] Extend `ServiceProvider` class
- [ ] Implement `register()` method
- [ ] Implement `boot()` method
- [ ] Use `$this->singleton()` for registration
- [ ] Check container has service before booting
- [ ] Handle exceptions in boot process
- [ ] Add proper documentation
- [ ] Register in appropriate Kernel

### 🎯 **Best Practices**

1. **One Provider per Context**: Mỗi context (admin, frontend, cli) có một Provider riêng
2. **Feature Grouping**: Nhóm các services liên quan trong cùng một Provider
3. **Lazy Loading**: Sử dụng singleton pattern cho performance
4. **Error Handling**: Xử lý lỗi trong boot process
5. **Documentation**: Comment rõ ràng cho mỗi service
6. **Testing**: Test từng Service Provider riêng biệt