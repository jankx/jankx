# Migration Guide

> **Jankx 1.x to 2.0 Migration Guide**

Hướng dẫn migration từ Jankx 1.x lên Jankx 2.0 framework.

## 🚀 Quick Migration Checklist

### 1. **Pre-Migration Analysis**
- [ ] Audit existing code for deprecated patterns
- [ ] Identify WordPress function usage
- [ ] Review service dependencies
- [ ] Check configuration access patterns

### 2. **Core Framework Changes**
- [ ] Update to new bootstrapping system
- [ ] Migrate to Config Facade
- [ ] Remove WordPressAdapter usage
- [ ] Update context detection

### 3. **Service Layer Updates**
- [ ] Convert to Service Provider pattern
- [ ] Implement proper DI
- [ ] Update error handling
- [ ] Add structured logging

### 4. **Testing & Validation**
- [ ] Update test suites
- [ ] Verify WordPress integration
- [ ] Test configuration loading
- [ ] Validate debug system

## 🔄 Major Architectural Changes

### **1. Configuration System**

#### **Old Pattern (1.x)**
```php
// ❌ OLD - Direct config access
$config = $this->config['app']['providers'];
$debugMode = $this->config['debug'] ?? false;

// ❌ OLD - ConfigManager usage
$configManager = new ConfigManager();
$value = $configManager->get('app.providers');
```

#### **New Pattern (2.0)**
```php
// ✅ NEW - Config Facade
$providers = \Jankx\Facades\Config::get('app.providers.frontend', []);
$debugMode = \Jankx\Facades\Config::get('app.debug', false);

// ✅ NEW - Repository pattern
$allConfig = \Jankx\Facades\Config::all();
\Jankx\Facades\Config::set('custom.key', 'value');
```

### **2. WordPress Integration**

#### **Old Pattern (1.x)**
```php
// ❌ OLD - WordPressAdapter dependency injection
class GutenbergBlocksService
{
    private $wordPressAdapter;

    public function __construct(WordPressAdapter $adapter)
    {
        $this->wordPressAdapter = $adapter;
    }

    public function getBlocksInfo(): array
    {
        $content = $this->wordPressAdapter->getCurrentContent();
        return $this->wordPressAdapter->hasBlocks($content) ? [] : [];
    }
}
```

#### **New Pattern (2.0)**
```php
// ✅ NEW - Direct WordPress function calls
class GutenbergBlocksService
{
    public function getBlocksInfo(): array
    {
        $content = \get_the_content() ?: '';
        return \has_blocks($content) ? $this->parseBlocks($content) : [];
    }

    private function isBlockEditor(): bool
    {
        return \is_admin() && \get_current_screen() && \get_current_screen()->is_block_editor;
    }
}
```

### **3. Context Detection**

#### **Old Pattern (1.x)**
```php
// ❌ OLD - Multiple context detection methods
class DeferredServiceResolver
{
    private function getCurrentContext(): string
    {
        if (defined('WP_CLI') && WP_CLI) return 'cli';
        if (wp_doing_ajax()) return 'ajax';
        if (is_admin()) return 'admin';
        return 'frontend';
    }
}

class UserService
{
    private function getCurrentContext(): string
    {
        // Duplicate logic
        if (defined('WP_CLI') && WP_CLI) return 'cli';
        if (wp_doing_ajax()) return 'ajax';
        if (is_admin()) return 'admin';
        return 'frontend';
    }
}
```

#### **New Pattern (2.0)**
```php
// ✅ NEW - Centralized via Kernel Facade
class DeferredServiceResolver
{
    public function resolve($serviceName)
    {
        $context = \Jankx\Facades\Kernel::getCurrentContext();
        // ... rest of logic
    }
}

class UserService
{
    public function getUserData()
    {
        $context = \Jankx\Facades\Kernel::getCurrentContext();
        // ... context-specific logic
    }
}
```

### **4. Service Registration**

#### **Old Pattern (1.x)**
```php
// ❌ OLD - Direct service registration in Kernel
class FrontendKernel extends Kernel
{
    protected function registerServices(): void
    {
        $this->addService('user.service', [
            'class' => UserService::class,
            'params' => []
        ]);

        $this->addService('debug.info', [
            'class' => DebugInfo::class,
            'params' => []
        ]);
    }
}
```

#### **New Pattern (2.0)**
```php
// ✅ NEW - Service Provider pattern
class FrontendServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->singleton('user.service', UserService::class);
        $this->singleton(DebugInfo::class);
    }

    public function boot(): void
    {
        // Boot logic if needed
    }
}

// Kernel only registers Service Providers
class FrontendKernel extends Kernel
{
    protected function registerServices(): void
    {
        parent::registerServices(); // Loads from Config
    }
}
```

### **5. Error Handling**

#### **Old Pattern (1.x)**
```php
// ❌ OLD - Basic error handling
public function loadService(string $serviceClass): void
{
    $service = new $serviceClass($this->container);
    $service->register();
}
```

#### **New Pattern (2.0)**
```php
// ✅ NEW - Comprehensive error handling
public function loadService(string $serviceClass): void
{
    try {
        if (!class_exists($serviceClass)) {
            throw new \InvalidArgumentException("Service {$serviceClass} does not exist");
        }

        $reflection = new \ReflectionClass($serviceClass);
        if ($reflection->isAbstract()) {
            Logger::warning("Service Provider {$serviceClass} is abstract and cannot be instantiated");
            return;
        }

        $service = new $serviceClass($this->container);
        $service->register();
        $service->boot();

        Logger::debug('providerLoaded', [
            'provider' => $serviceClass,
            'status' => 'success'
        ]);
    } catch (\Exception $e) {
        Logger::error("Failed to load service {$serviceClass}: " . $e->getMessage());
    }
}
```

## 📋 Step-by-Step Migration

### **Step 1: Update Configuration Access**

#### **Before (1.x)**
```php
// functions.php
$config = [
    'app' => [
        'providers' => [
            'frontend' => [
                'FrontendServiceProvider',
                'DebugServiceProvider'
            ]
        ]
    ]
];
```

#### **After (2.0)**
```php
// config/app.php
return [
    'providers' => [
        'frontend' => [
            'Jankx\Providers\FrontendServiceProvider',
            'Jankx\Providers\DebugServiceProvider',
        ],
    ],
];
```

### **Step 2: Remove WordPressAdapter Dependencies**

#### **Before (1.x)**
```php
// Service Provider
class FrontendServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->singleton(WordPressAdapter::class);
        $this->singleton(GutenbergBlocksService::class);
    }
}

// Service
class GutenbergBlocksService
{
    private $wordPressAdapter;

    public function __construct(WordPressAdapter $adapter)
    {
        $this->wordPressAdapter = $adapter;
    }
}
```

#### **After (2.0)**
```php
// Service Provider
class FrontendServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->singleton(GutenbergBlocksService::class);
    }
}

// Service
class GutenbergBlocksService
{
    public function getBlocksInfo(): array
    {
        $content = \get_the_content() ?: '';
        return \has_blocks($content) ? $this->parseBlocks($content) : [];
    }
}
```

### **Step 3: Update Context Detection**

#### **Before (1.x)**
```php
// Multiple classes with duplicate logic
class ServiceA
{
    private function getCurrentContext(): string
    {
        if (defined('WP_CLI') && WP_CLI) return 'cli';
        if (wp_doing_ajax()) return 'ajax';
        if (is_admin()) return 'admin';
        return 'frontend';
    }
}

class ServiceB
{
    private function getCurrentContext(): string
    {
        // Same logic duplicated
        if (defined('WP_CLI') && WP_CLI) return 'cli';
        if (wp_doing_ajax()) return 'ajax';
        if (is_admin()) return 'admin';
        return 'frontend';
    }
}
```

#### **After (2.0)**
```php
// Centralized context detection
class ServiceA
{
    public function doSomething()
    {
        $context = \Jankx\Facades\Kernel::getCurrentContext();
        // Use context
    }
}

class ServiceB
{
    public function doSomething()
    {
        $context = \Jankx\Facades\Kernel::getCurrentContext();
        // Use context
    }
}
```

### **Step 4: Update Error Handling**

#### **Before (1.x)**
```php
// Basic error handling
public function loadServices(): void
{
    foreach ($this->serviceProviders as $providerClass) {
        $provider = new $providerClass($this->container);
        $provider->register();
        $provider->boot();
    }
}
```

#### **After (2.0)**
```php
// Comprehensive error handling
public function loadServices(): void
{
    foreach ($this->getServiceProviders() as $providerClass) {
        Logger::debug('loadingProvider', ['provider' => $providerClass]);

        if (class_exists($providerClass)) {
            try {
                $reflection = new \ReflectionClass($providerClass);
                if ($reflection->isAbstract()) {
                    Logger::warning("Service Provider {$providerClass} is abstract");
                    continue;
                }

                $provider = new $providerClass($this->container);
                $provider->register();
                $provider->boot();

                Logger::debug('providerLoaded', [
                    'provider' => $providerClass,
                    'status' => 'success'
                ]);
            } catch (\Exception $e) {
                Logger::error("Failed to load service {$providerClass}: " . $e->getMessage());
            }
        } else {
            Logger::error("Service Provider {$providerClass} does not exist");
        }
    }
}
```

## 🧪 Testing Migration

### **1. Update Test Suites**

#### **Before (1.x)**
```php
class GutenbergBlocksServiceTest extends TestCase
{
    public function testGetBlocksInfo()
    {
        $adapter = $this->createMock(WordPressAdapter::class);
        $adapter->method('getCurrentContent')->willReturn('<!-- wp:paragraph -->');
        $adapter->method('hasBlocks')->willReturn(true);

        $service = new GutenbergBlocksService($adapter);
        $result = $service->getBlocksInfo();

        $this->assertNotEmpty($result);
    }
}
```

#### **After (2.0)**
```php
class GutenbergBlocksServiceTest extends TestCase
{
    public function testGetBlocksInfo()
    {
        // Mock WordPress functions
        $this->mockFunction('get_the_content', function() {
            return '<!-- wp:paragraph -->';
        });

        $this->mockFunction('has_blocks', function($content) {
            return strpos($content, '<!-- wp:') !== false;
        });

        $service = new GutenbergBlocksService();
        $result = $service->getBlocksInfo();

        $this->assertNotEmpty($result);
    }
}
```

### **2. Update Integration Tests**

#### **Before (1.x)**
```php
class WordPressIntegrationTest extends TestCase
{
    public function testWordPressAdapterIntegration()
    {
        $adapter = new WordPressAdapter();
        $service = new GutenbergBlocksService($adapter);

        $this->assertInstanceOf(GutenbergBlocksService::class, $service);
    }
}
```

#### **After (2.0)**
```php
class WordPressIntegrationTest extends TestCase
{
    public function testDirectWordPressFunctionCalls()
    {
        $service = new GutenbergBlocksService();

        // Test actual WordPress function calls
        $content = \get_the_content() ?: '';
        $hasBlocks = \has_blocks($content);

        $this->assertIsString($content);
        $this->assertIsBool($hasBlocks);
    }
}
```

## 🚨 Breaking Changes

### **1. Removed Classes**
- `WordPressAdapter` - Use direct WordPress function calls
- `ConfigManager` - Use Config Facade
- `ContextualServiceRegistry` - Use Kernel Facade

### **2. Changed Method Signatures**
- `Kernel::registerServices()` - Now loads from Config
- `ServiceProvider::register()` - Must return void
- `Bootstrapper::bootstrap()` - Must accept Container parameter

### **3. New Requirements**
- All services must be registered via Service Providers
- Configuration must be accessed via Config Facade
- Context detection must use Kernel Facade
- Error handling must include structured logging

## 🔧 Migration Tools

### **1. Automated Migration Script**
```bash
# Run migration analysis
php bin/migrate-analyze.php

# Apply automated fixes
php bin/migrate-apply.php
```

### **2. Manual Migration Checklist**
- [ ] Replace `WordPressAdapter` usage with direct function calls
- [ ] Update configuration access to use Config Facade
- [ ] Replace context detection with Kernel Facade
- [ ] Convert direct service registration to Service Providers
- [ ] Add comprehensive error handling
- [ ] Update test suites
- [ ] Verify WordPress integration

## 📊 Migration Metrics

### **Success Criteria**
- [ ] All WordPressAdapter dependencies removed
- [ ] Config Facade used for all configuration access
- [ ] Kernel Facade used for context detection
- [ ] Service Providers implemented for all services
- [ ] Error handling includes structured logging
- [ ] Test coverage > 80%
- [ ] No deprecated patterns remain

### **Performance Impact**
- **Memory Usage**: Reduced (no adapter overhead)
- **Execution Time**: Improved (direct function calls)
- **Code Complexity**: Reduced (fewer abstractions)

## 🆘 Troubleshooting

### **Common Migration Issues**

#### **1. "Class WordPressAdapter not found"**
```php
// ❌ Problem
class MyService
{
    public function __construct(WordPressAdapter $adapter)
    {
        $this->adapter = $adapter;
    }
}

// ✅ Solution
class MyService
{
    public function getCurrentContent(): string
    {
        return \get_the_content() ?: '';
    }
}
```

#### **2. "Config not accessible"**
```php
// ❌ Problem
$config = $this->config['app']['providers'];

// ✅ Solution
$providers = \Jankx\Facades\Config::get('app.providers', []);
```

#### **3. "Context detection not working"**
```php
// ❌ Problem
private function getCurrentContext(): string
{
    // Manual detection
}

// ✅ Solution
$context = \Jankx\Facades\Kernel::getCurrentContext();
```

## 📚 Additional Resources

### **Documentation**
- [Architecture Overview](./architecture/README.md)
- [Coding Rules](./development/coding-rules.md)
- [Service Provider Guide](./services/README.md)
- [Configuration Guide](./config/README.md)

### **Examples**
- [Service Migration Examples](./examples/service-migration.md)
- [Configuration Migration Examples](./examples/config-migration.md)
- [Testing Migration Examples](./examples/testing-migration.md)

---

**Jankx 2.0 Migration Guide** - Modern WordPress Theme Framework Migration 🚀

*Last updated: Development Phase*
*Framework version: 2.0.0-dev*