# Jankx Framework Facades

## Tổng quan

Facades trong Jankx Framework cung cấp static interface cho các services phổ biến, giúp code ngắn gọn và dễ sử dụng hơn.

## 🎭 **Available Facades**

### **✅ Active Facades**

#### **1. Config Facade**
```php
use Jankx\Facades\Config;

// Get configuration value
$appName = Config::get('app.name');
$debugMode = Config::get('app.debug', false);

// Set configuration value
Config::set('app.version', '2.0.0');

// Check if config exists
if (Config::has('app.name')) {
    // Do something
}

// Get all configurations
$allConfigs = Config::all();
```

#### **2. Logger Facade**
```php
use Jankx\Facades\Logger;

// Log messages
Logger::info('Information message');
Logger::error('Error message');
Logger::warning('Warning message');
Logger::debug('Debug message');

// Log with context
Logger::info('User logged in', ['user_id' => 123]);
```

#### **3. Layout Facade**
```php
use Jankx\Facades\Layout;

// Register a new layout
Layout::register('sidebar-left', [
    'name' => 'Sidebar Left',
    'description' => 'Layout with sidebar on the left'
]);

// Get a registered layout
$layout = Layout::get('sidebar-left');

// Get all layouts
$allLayouts = Layout::all();

// Check if layout exists
if (Layout::has('sidebar-left')) {
    // Do something
}
```

#### **4. Application Facade**
```php
use Jankx\Facades\Application;

// Resolve a service from container
$service = Application::make('my.service');

// Check if service is bound
if (Application::bound('my.service')) {
    // Service is available
}

// Bind a service
Application::bind('my.service', MyService::class);

// Bind a singleton
Application::singleton('my.service', MyService::class);

// Get container instance
$container = Application::getContainer();
```

#### **5. User Facade**
```php
use Jankx\Facades\User;

// Get user by ID
$user = User::get(123);

// Get current user
$currentUser = User::current();

// Check if user exists
if (User::exists(123)) {
    // User exists
}

// Get user display name
$displayName = User::getDisplayName(123);

// Get user email
$email = User::getEmail(123);

// Get user roles
$roles = User::getRoles(123);

// Check user role
if (User::hasRole(123, 'administrator')) {
    // User is admin
}
```

#### **6. DeferredService Facade**
```php
use Jankx\Facades\DeferredService;

// Resolve a deferred service
$service = DeferredService::resolve('my.service');

// Check if service is available
if (DeferredService::has('my.service')) {
    // Service is available
}

// Register a service for specific context
DeferredService::register('frontend', MyService::class);

// Get current context
$context = DeferredService::getCurrentContext();

// Get resolved services
$resolved = DeferredService::getResolvedServices();
```

### **❌ Removed Facades**

#### **1. Kernel Facade (Removed)**
```php
// ❌ Sai - Đã bị loại bỏ
$version = \Jankx\Facades\Kernel::getFrameworkVersion();

// ✅ Đúng - Sử dụng direct access
$version = \Jankx\Jankx::getFrameworkVersion();
```

#### **2. Options Facade (Removed)**
```php
// ❌ Sai - Đã bị loại bỏ
$option = \Jankx\Facades\Options::get('option_name');

// ✅ Đúng - Sử dụng Config Facade
$option = \Jankx\Facades\Config::get('option_name');
```

#### **3. Debug Facade (Removed)**
```php
// ❌ Sai - Đã bị loại bỏ
\Jankx\Facades\Debug::info('Debug message');

// ✅ Đúng - Sử dụng Logger Facade
\Jankx\Facades\Logger::debug('Debug message');
```

#### **4. Template, Theme, Asset, Block Facades (Removed)**
```php
// ❌ Sai - Đã bị loại bỏ
$template = \Jankx\Facades\Template::render('template');
$theme = \Jankx\Facades\Theme::get();
$asset = \Jankx\Facades\Asset::enqueue('style.css');
$block = \Jankx\Facades\Block::render('block');

// ✅ Đúng - Sử dụng direct access hoặc services
$template = $container->make('template.service')->render('template');
$theme = $container->make('theme.service')->get();
$asset = $container->make('asset.service')->enqueue('style.css');
$block = $container->make('block.service')->render('block');
```

## 🏗️ **Architecture**

### **Facade Base Class**
```php
<?php

namespace Jankx\Facades;

abstract class Facade
{
    protected static function getFacadeAccessor()
    {
        throw new \RuntimeException('Facade does not implement getFacadeAccessor.');
    }

    public static function __callStatic($method, $args)
    {
        $instance = static::getFacadeAccessor();

        if (!is_object($instance)) {
            $instance = \Jankx\Jankx::getInstance()->make($instance);
        }

        return $instance->$method(...$args);
    }
}
```

### **Service Registration**
```php
// Service Provider
class ConfigServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->singleton('config', Repository::class);
        $this->singleton(ConfigRepositoryInterface::class, Repository::class);
    }
}

// Facade
class Config extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'config';
    }
}
```

## 🎯 **Best Practices**

### **1. Khi nào sử dụng Facade**
```php
// ✅ Đúng - Services phổ biến
$config = Config::get('app.name');
$debug = Debug::info('message');

// ✅ Đúng - Static interface cần thiết
$theme = Theme::get();
$logger = Logger::error('error');
```

### **2. Khi nào KHÔNG sử dụng Facade**
```php
// ❌ Sai - Core components
$kernel = \Jankx\Facades\Kernel::getInstance();

// ✅ Đúng - Direct access cho core
$kernel = \Jankx\Kernel\KernelManager::getInstance();

// ❌ Sai - Complex operations
$result = Config::complexOperation($data);

// ✅ Đúng - Inject service
$configService = $container->make(ConfigService::class);
$result = $configService->complexOperation($data);
```

### **3. Testing Facades**
```php
class ConfigTest extends TestCase
{
    public function testConfigGet()
    {
        // Mock the container
        $mockContainer = $this->createMock(Container::class);
        $mockConfig = $this->createMock(Repository::class);

        $mockConfig->expects($this->once())
            ->method('get')
            ->with('app.name')
            ->willReturn('Jankx');

        $mockContainer->expects($this->once())
            ->method('make')
            ->with('config')
            ->willReturn($mockConfig);

        // Set the container
        \Jankx\Jankx::setInstance($mockContainer);

        // Test facade
        $result = Config::get('app.name');
        $this->assertEquals('Jankx', $result);
    }
}
```

## 📋 **Facade Checklist**

### **Tạo Facade mới:**
- [ ] Extend `Jankx\Facades\Facade`
- [ ] Implement `getFacadeAccessor()` method
- [ ] Register service trong Service Provider
- [ ] Add unit tests
- [ ] Update documentation
- [ ] Follow naming conventions

### **Sử dụng Facade:**
- [ ] Import facade class
- [ ] Use static methods
- [ ] Handle exceptions
- [ ] Test facade calls
- [ ] Document usage

## 🚀 **Performance Considerations**

### **1. Lazy Loading**
```php
// ✅ Đúng - Service được load khi cần
$config = Config::get('app.name');

// ❌ Sai - Load service trước khi cần
$configService = $container->make('config');
$config = $configService->get('app.name');
```

### **2. Caching**
```php
// ✅ Đúng - Cache facade calls
$appName = Config::get('app.name'); // Cached
$appName = Config::get('app.name'); // From cache

// ❌ Sai - No caching
$config = $container->make('config');
$appName = $config->get('app.name');
```

## 🔧 **Debugging Facades**

### **1. Check Facade Registration**
```php
// Check if facade is registered
if (class_exists(\Jankx\Facades\Config::class)) {
    echo "Config facade exists";
}

// Check if service is bound
$container = \Jankx\Jankx::getInstance();
if ($container->has('config')) {
    echo "Config service is bound";
}
```

### **2. Debug Facade Calls**
```php
// Enable debug mode
define('JANKX_DEBUG', true);

// Facade calls will be logged
Config::get('app.name');
Debug::info('Debug message');
```

## 📚 **Examples**

### **Complete Example**
```php
<?php

use Jankx\Facades\Config;
use Jankx\Facades\Debug;
use Jankx\Facades\Logger;
use Jankx\Facades\Theme;

class MyController
{
    public function index()
    {
        // Get configuration
        $appName = Config::get('app.name', 'Jankx');

        // Log information
        Logger::info('Controller loaded', ['action' => 'index']);

        // Debug if enabled
        if (Debug::isEnabled()) {
            Debug::info('Controller data', $this->data);
        }

        // Get theme
        $theme = Theme::get();

        return view('index', compact('appName', 'theme'));
    }
}
```

### **Service Provider Integration**
```php
class MyServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Register services that facades will use
        $this->singleton('config', Repository::class);
        $this->singleton('logger', LoggerService::class);
        $this->singleton('debug', DebugService::class);
    }
}
```

---

**Lưu ý:** Facades chỉ nên được sử dụng cho các services phổ biến và có static interface rõ ràng. Với core components như Kernel, Container, Service Providers, nên sử dụng direct access pattern.