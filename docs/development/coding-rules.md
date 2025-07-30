# Coding Rules & Standards

> **Jankx 2.0 Development Standards**

Tài liệu này định nghĩa các quy tắc coding và standards cho Jankx 2.0 framework.

## 🎯 Core Principles

### **1. KISS Principle**
- **Keep It Simple, Stupid**
- Tránh over-engineering
- Ưu tiên giải pháp đơn giản nhất có thể

### **2. SOLID Principles**
- **Single Responsibility**: Mỗi class chỉ có một trách nhiệm
- **Open/Closed**: Mở để mở rộng, đóng để sửa đổi
- **Liskov Substitution**: Subclass có thể thay thế base class
- **Interface Segregation**: Interface nhỏ, chuyên biệt
- **Dependency Inversion**: Phụ thuộc vào abstraction, không phải concrete

### **3. WordPress Integration**
- Sử dụng WordPress functions trực tiếp (không cần adapters)
- Tuân thủ WordPress coding standards
- Tương thích với WordPress hooks system

## 📋 Coding Standards

### **1. File Structure**
```
includes/
├── Jankx/
│   ├── Bootstrappers/     # Bootstrapper classes
│   ├── Config/           # Configuration system
│   ├── Contracts/        # Interfaces
│   ├── Debug/            # Debug system
│   ├── Facades/          # Facade classes
│   ├── Kernel/           # Kernel system
│   ├── Providers/        # Service providers
│   ├── Services/         # Business logic services
│   └── Helpers/          # Utility classes
```

### **2. Naming Conventions**

#### **Classes**
```php
// ✅ Đúng - PascalCase
class UserService
class GutenbergBlocksService
class ConfigBootstrapper

// ❌ Sai - camelCase
class userService
class gutenbergBlocksService
```

#### **Methods**
```php
// ✅ Đúng - camelCase
public function getUserData()
public function registerServices()
public function bootstrap()

// ❌ Sai - snake_case
public function get_user_data()
public function register_services()
```

#### **Properties**
```php
// ✅ Đúng - camelCase
private $container;
private $serviceProviders;
private $debugInfo;

// ❌ Sai - snake_case
private $service_providers;
private $debug_info;
```

#### **Constants**
```php
// ✅ Đúng - UPPER_SNAKE_CASE
const DEBUG_MODE = true;
const CACHE_EXPIRY = 3600;
const MAX_RETRIES = 3;
```

### **3. Code Organization**

#### **Class Structure**
```php
<?php

namespace Jankx\Services;

use Jankx\Contracts\ServiceInterface;
use Jankx\Facades\Config;

/**
 * Service class description
 *
 * @package Jankx\Services
 * @since 2.0.0
 */
class MyService implements ServiceInterface
{
    /**
     * @var Container
     */
    private $container;

    /**
     * Constructor
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * Public methods first
     */
    public function doSomething(): void
    {
        // Implementation
    }

    /**
     * Protected methods
     */
    protected function helperMethod(): void
    {
        // Implementation
    }

    /**
     * Private methods last
     */
    private function internalMethod(): void
    {
        // Implementation
    }
}
```

## 🔧 Framework-Specific Rules

### **1. Service Container Usage**

#### **✅ Đúng - Dependency Injection**
```php
class UserService
{
    private $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    public function getUser(int $userId): ?User
    {
        return $this->container->make(UserRepository::class)->find($userId);
    }
}
```

#### **❌ Sai - Direct instantiation**
```php
class UserService
{
    public function getUser(int $userId): ?User
    {
        return new UserRepository()->find($userId); // ❌ Không sử dụng container
    }
}
```

### **2. Facade Usage**

#### **✅ Facades được phép:**
```php
// ✅ Đúng - Config Facade
$value = \Jankx\Facades\Config::get('app.providers.frontend');
$allConfig = \Jankx\Facades\Config::all();

// ✅ Đúng - Logger Facade
\Jankx\Facades\Logger::debug('message', ['data' => $data]);
\Jankx\Facades\Logger::error('error message');

// ✅ Đúng - Kernel Facade
$context = \Jankx\Facades\Kernel::getCurrentContext();
```

#### **❌ Facades không được phép:**
```php
// ❌ Sai - Options Facade (đã bị loại bỏ)
$option = \Jankx\Facades\Options::get('option_name');
```

#### **✅ Direct Access Pattern:**
```php
// ✅ Đúng - Direct access cho Kernel
$kernelManager = \Jankx\Kernel\KernelManager::getInstance();
$version = $kernelManager->getFrameworkVersion();

// ✅ Đúng - Direct access cho services
$container = \Jankx\Jankx::getInstance();
$service = $container->make(MyService::class);
```

#### **✅ WordPress Function Usage:**
```php
// ✅ Đúng - Gọi WordPress functions trực tiếp
$content = \get_the_content() ?: '';
$excerpt = \get_the_excerpt() ?: '';
$hasBlocks = \has_blocks($content);
$isAdmin = \is_admin();

// ✅ Đúng - Sử dụng WordPress hooks
\add_action('init', [$this, 'initialize']);
\add_filter('the_content', [$this, 'processContent']);

// ✅ Đúng - WordPress constants
if (defined('WP_CLI') && WP_CLI) {
    // CLI context
}
```

#### **🎯 Facade Guidelines:**
- **Sử dụng Facades cho**: Config, Logger, Kernel
- **Tránh Facades cho**: Services phức tạp, Business logic
- **Ưu tiên DI cho**: Services có dependencies phức tạp

### **3. Bootstrapper Development**

#### **✅ Đúng - Bootstrapper Structure**
```php
class MyBootstrapper extends AbstractBootstrapper
{
    public function bootstrap(Container $container): void
    {
        // Register services
        $container->singleton(MyService::class);

        // Setup hooks
        add_action('init', [$this, 'initialize']);
    }

    public function getPriority(): int
    {
        return 10; // Lower = higher priority
    }

    public function shouldRun(): bool
    {
        return !is_admin(); // Only in frontend
    }
}
```

### **4. Service Provider Development**

#### **✅ Đúng - Service Provider**
```php
class MyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->singleton(MyService::class);
        $this->singleton(MyRepository::class);
    }

    public function boot(): void
    {
        // Boot logic here
    }
}
```

### **5. Configuration Management**

#### **✅ Đúng - Config Usage**
```php
// Access configuration
$providers = \Jankx\Facades\Config::get('app.providers.frontend', []);
$debugMode = \Jankx\Facades\Config::get('app.debug', false);

// Set configuration
\Jankx\Facades\Config::set('custom.key', 'value');

// Check if exists
if (\Jankx\Facades\Config::has('app.providers')) {
    // Do something
}
```

### **6. Context Detection**

#### **✅ Đúng - Context Usage**
```php
// Use Kernel Facade for context detection
$context = \Jankx\Facades\Kernel::getCurrentContext();

switch ($context) {
    case 'frontend':
        // Frontend logic
        break;
    case 'admin':
        // Admin logic
        break;
    case 'cli':
        // CLI logic
        break;
}
```

## 🐛 Error Handling

### **1. Exception Handling**
```php
// ✅ Đúng - Try-catch với specific exceptions
try {
    $service = $container->make(MyService::class);
    $result = $service->doSomething();
} catch (BindingResolutionException $e) {
    Logger::error('Service not found: ' . $e->getMessage());
} catch (Exception $e) {
    Logger::error('Unexpected error: ' . $e->getMessage());
}
```

### **2. Logging**
```php
// ✅ Đúng - Structured logging
Logger::debug('Service registered', [
    'service' => MyService::class,
    'context' => Kernel::getCurrentContext()
]);

Logger::error('Service failed', [
    'service' => MyService::class,
    'error' => $e->getMessage(),
    'trace' => $e->getTraceAsString()
]);
```

## 🧪 Testing Standards

### **1. Test Structure**
```php
class MyServiceTest extends TestCase
{
    private $container;
    private $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->container = new Container();
        $this->service = new MyService($this->container);
    }

    public function testServiceMethod(): void
    {
        $result = $this->service->doSomething();
        $this->assertNotNull($result);
    }
}
```

### **2. Mocking**
```php
// ✅ Đúng - Mock dependencies
$mockRepository = $this->createMock(UserRepository::class);
$mockRepository->method('find')->willReturn(new User());

$this->container->instance(UserRepository::class, $mockRepository);
```

## 📝 Documentation Standards

### **1. PHPDoc**
```php
/**
 * User service for managing user data
 *
 * @package Jankx\Services
 * @since 2.0.0
 */
class UserService
{
    /**
     * Get user by ID
     *
     * @param int $userId User ID
     * @return User|null User object or null if not found
     * @throws UserNotFoundException When user not found
     */
    public function getUser(int $userId): ?User
    {
        // Implementation
    }
}
```

### **2. Inline Comments**
```php
// ✅ Đúng - Explain why, not what
// Check if user has permission to access admin area
if (!current_user_can('manage_options')) {
    return;
}

// ❌ Sai - Redundant comments
$user = getUser(); // Get user
```

## 🚫 Anti-Patterns

### **1. ❌ Avoid Global State**
```php
// ❌ Sai - Global variables
global $myService;
$myService = new MyService();

// ✅ Đúng - Use container
$container->singleton(MyService::class);
$service = $container->make(MyService::class);
```

### **2. ❌ Avoid Direct WordPress Calls in Services**
```php
// ❌ Sai - Direct WordPress calls in business logic
class UserService
{
    public function getCurrentUser()
    {
        return wp_get_current_user(); // ❌ Direct call
    }
}

// ✅ Đúng - Use WordPress functions directly when needed
class UserService
{
    public function getCurrentUser()
    {
        return \wp_get_current_user(); // ✅ Direct call with namespace
    }
}
```

### **3. ❌ Avoid Complex Dependencies**
```php
// ❌ Sai - Too many dependencies
class ComplexService
{
    public function __construct(
        UserService $userService,
        ConfigService $configService,
        LoggerService $loggerService,
        CacheService $cacheService,
        DatabaseService $databaseService
    ) {
        // Too complex
    }
}

// ✅ Đúng - Break into smaller services
class SimpleService
{
    public function __construct(Container $container)
    {
        $this->container = $container;
    }
}
```

## 🎯 Best Practices Summary

### **✅ Do's:**
- Sử dụng Dependency Injection
- Tuân thủ SOLID principles
- Sử dụng Config Facade cho configuration
- Sử dụng Kernel Facade cho context detection
- Gọi WordPress functions trực tiếp
- Log structured data
- Write comprehensive tests

### **❌ Don'ts:**
- Không sử dụng global state
- Không tạo dependencies phức tạp
- Không sử dụng WordPressAdapter (đã loại bỏ)
- Không sử dụng ConfigManager (đã loại bỏ)
- Không viết comments thừa
- Không ignore exceptions

---

**Jankx 2.0 Coding Rules** - Modern WordPress Theme Framework Standards 🚀

*Last updated: Development Phase*
*Framework version: 2.0.0-dev*