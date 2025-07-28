# Service Container

> **Dependency Injection & Service Management**

Service Container là core component của Jankx 2.0, quản lý dependency injection và service lifecycle.

## 🏗 Container Architecture

### Container Structure
```
┌─────────────────────────────────────┐
│         Service Container           │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Bindings  │  │  Instances  │  │
│  │   Registry  │  │   Cache     │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Service Resolution          │
│  ┌─────────────┐  ┌─────────────┐  │
│  │ Dependency  │  │   Factory   │  │
│  │ Resolution  │  │   Pattern   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Lifecycle Management        │
│  ┌─────────────┐  ┌─────────────┐  │
│  │ Singleton   │  │   Scoped    │  │
│  │ Services    │  │  Services   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

## 🔧 Container Access Patterns

Jankx 2.0 cung cấp nhiều cách để truy cập container, tùy theo context và preference:

### 1. Direct Container Injection (Recommended)
```php
// ✅ RECOMMENDED - Trong Bootstrapper classes
class AdminBootstrapper extends AbstractBootstrapper
{
    public function bootstrap(Container $container): void
    {
        $this->container = $container;

        // Sử dụng container trực tiếp
        $service = $this->container->make(\Jankx\Services\BlockParserService::class);
    }
}
```

### 2. Application Facade (Static Access)
```php
// ✅ CONVENIENT - Static access từ bất kỳ đâu
use Jankx\Facades\Application;

$service = Application::make(\Jankx\Services\BlockParserService::class);
$service = Application::bound('service.name');
Application::singleton('service.name', ServiceClass::class);
```

### 3. Jankx Singleton (Global Access)
```php
// ✅ SIMPLE - Truy cập global container
$service = \Jankx\Jankx::getInstance()->make(\Jankx\Services\BlockParserService::class);
```

### 4. Helper Function (Proposed)
```php
// ✅ CONVENIENT - Helper function (có thể thêm)
function jankx() {
    return \Jankx\Jankx::getInstance();
}

// Sử dụng
$service = jankx()->make(\Jankx\Services\BlockParserService::class);
```

### 5. Service-Specific Facades
```php
// ✅ SPECIALIZED - Facades cho specific services
use Jankx\Facades\User;
use Jankx\Facades\Logger;

$user = User::get(1);
Logger::info('Message');
```

## 🎯 Usage Guidelines

### **Khi nào dùng cách nào:**

#### **1. Direct Container Injection** ✅ **BEST PRACTICE**
```php
// Trong Bootstrapper classes
class FrontendBootstrapper extends AbstractBootstrapper
{
    public function bootstrap(Container $container): void
    {
        $this->container = $container;

        // Sử dụng injected container
        $assetManager = $this->container->make(\Jankx\Assets\AssetManager::class);
        $seoManager = $this->container->make(\Jankx\SEO\SEOManager::class);
    }
}
```

**Ưu điểm:**
- Dependency injection rõ ràng
- Dễ test
- Type hinting
- Performance tốt nhất

#### **2. Application Facade** ✅ **CONVENIENT**
```php
// Trong các helper functions hoặc global context
use Jankx\Facades\Application;

function getBlockService() {
    return Application::make(\Jankx\Services\BlockParserService::class);
}

// Hoặc trong template files
$userService = Application::make(\Jankx\Services\UserService::class);
```

**Ưu điểm:**
- Static access từ bất kỳ đâu
- Clean API
- Không cần inject container

#### **3. Jankx Singleton** ✅ **SIMPLE**
```php
// Trong legacy code hoặc quick access
$service = \Jankx\Jankx::getInstance()->make(Service::class);

// Hoặc với helper function
function jankx() {
    return \Jankx\Jankx::getInstance();
}

$service = jankx()->make(Service::class);
```

**Ưu điểm:**
- Đơn giản nhất
- Tương thích với code cũ
- Global access

#### **4. Service-Specific Facades** ✅ **SPECIALIZED**
```php
// Cho các services có API phức tạp
use Jankx\Facades\User;
use Jankx\Facades\Logger;

$user = User::get(1, ['name', 'email']);
Logger::error('Error message', ['context' => 'debug']);
```

**Ưu điểm:**
- API chuyên biệt cho từng service
- Method chaining
- Type safety

## 📊 Performance Comparison

| Method | Performance | Testability | Clean Code | Global Access |
|--------|-------------|-------------|------------|---------------|
| **Direct Injection** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ |
| **Application Facade** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ |
| **Jankx Singleton** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ✅ |
| **Helper Function** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ |
| **Service Facades** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ |

## 🔧 Container Implementation

### Service Container Class
```php
<?php
namespace Jankx\Container;

use Jankx\Container\Exceptions\BindingResolutionException;

class ServiceContainer
{
    private $bindings = [];
    private $singletons = [];
    private $instances = [];
    private $resolving = [];

    public function bind(string $abstract, $concrete = null, bool $shared = false): void
    {
        $this->bindings[$abstract] = [
            'concrete' => $concrete,
            'shared' => $shared,
            'resolved' => false,
        ];
    }

    public function singleton(string $abstract, $concrete = null): void
    {
        $this->bind($abstract, $concrete, true);
    }

    public function instance(string $abstract, $instance): void
    {
        $this->instances[$abstract] = $instance;
    }

    public function make(string $abstract)
    {
        // Check if already resolved
        if (isset($this->instances[$abstract])) {
            return $this->instances[$abstract];
        }

        // Check if singleton exists
        if (isset($this->singletons[$abstract])) {
            return $this->singletons[$abstract];
        }

        // Check for circular dependency
        if (isset($this->resolving[$abstract])) {
            throw new BindingResolutionException("Circular dependency detected for {$abstract}");
        }

        $this->resolving[$abstract] = true;

        try {
            $concrete = $this->resolve($abstract);

            // Store if singleton
            if (isset($this->bindings[$abstract]['shared']) && $this->bindings[$abstract]['shared']) {
                $this->singletons[$abstract] = $concrete;
            }

            return $concrete;
        } finally {
            unset($this->resolving[$abstract]);
        }
    }

    private function resolve(string $abstract)
    {
        if (!isset($this->bindings[$abstract])) {
            throw new BindingResolutionException("No binding found for {$abstract}");
        }

        $binding = $this->bindings[$abstract];
        $concrete = $binding['concrete'];

        if (is_callable($concrete)) {
            return $concrete($this);
        }

        if (is_string($concrete)) {
            return $this->build($concrete);
        }

        return $concrete;
    }

    private function build(string $concrete)
    {
        $reflector = new \ReflectionClass($concrete);

        if (!$reflector->isInstantiable()) {
            throw new BindingResolutionException("Class {$concrete} is not instantiable");
        }

        $constructor = $reflector->getConstructor();

        if (is_null($constructor)) {
            return new $concrete;
        }

        $dependencies = $this->resolveDependencies($constructor->getParameters());

        return $reflector->newInstanceArgs($dependencies);
    }

    private function resolveDependencies(array $dependencies): array
    {
        $results = [];

        foreach ($dependencies as $dependency) {
            $results[] = $this->resolveDependency($dependency);
        }

        return $results;
    }

    private function resolveDependency(\ReflectionParameter $dependency)
    {
        $type = $dependency->getType();

        if ($type && !$type->isBuiltin()) {
            return $this->make($type->getName());
        }

        if ($dependency->isDefaultValueAvailable()) {
            return $dependency->getDefaultValue();
        }

        if ($dependency->isVariadic()) {
            return [];
        }

        throw new BindingResolutionException("Unresolvable dependency {$dependency->getName()}");
    }

    public function has(string $abstract): bool
    {
        return isset($this->bindings[$abstract]) || isset($this->instances[$abstract]);
    }

    public function forget(string $abstract): void
    {
        unset($this->bindings[$abstract], $this->singletons[$abstract], $this->instances[$abstract]);
    }

    public function flush(): void
    {
        $this->bindings = [];
        $this->singletons = [];
        $this->instances = [];
        $this->resolving = [];
    }
}
```

## 🔄 Service Registration

### Service Provider Pattern
```php
<?php
namespace Jankx\Providers;

use Jankx\Container\ServiceContainer;

abstract class ServiceProvider
{
    protected $container;

    public function __construct(ServiceContainer $container)
    {
        $this->container = $container;
    }

    abstract public function register(): void;

    public function boot(): void
    {
        // Optional boot method
    }

    protected function bind(string $abstract, $concrete = null, bool $shared = false): void
    {
        $this->container->bind($abstract, $concrete, $shared);
    }

    protected function singleton(string $abstract, $concrete = null): void
    {
        $this->container->singleton($abstract, $concrete);
    }

    protected function instance(string $abstract, $instance): void
    {
        $this->container->instance($abstract, $instance);
    }
}
```

### Core Service Providers
```php
<?php
namespace Jankx\Providers;

class AssetServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->singleton(\Jankx\Assets\AssetManager::class);
        $this->singleton(\Jankx\Assets\AssetOptimizer::class);
        $this->singleton(\Jankx\Assets\CriticalCSSGenerator::class);
        $this->singleton(\Jankx\Assets\ImageOptimizer::class);
    }

    public function boot(): void
    {
        $assetManager = $this->container->make(\Jankx\Assets\AssetManager::class);
        $assetManager->initialize();
    }
}

class GutenbergServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->singleton(\Jankx\Gutenberg\BlockRegistry::class);
        $this->singleton(\Jankx\Gutenberg\BlockRenderer::class);
        // LayoutManager removed - only core Gutenberg system remains
    }

    public function boot(): void
    {
        $blockRegistry = $this->container->make(\Jankx\Gutenberg\BlockRegistry::class);
        $blockRegistry->registerBlocks();
    }
}

class SecurityServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->singleton(\Jankx\Security\SecurityManager::class);
        $this->singleton(\Jankx\Security\InputValidator::class);
        $this->singleton(\Jankx\Security\OutputEscaper::class);
        $this->singleton(\Jankx\Security\NonceManager::class);
        $this->singleton(\Jankx\Security\CSRFProtector::class);
    }

    public function boot(): void
    {
        $securityManager = $this->container->make(\Jankx\Security\SecurityManager::class);
        $securityManager->initialize();
    }
}

class PerformanceServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->singleton(\Jankx\Performance\PerformanceMonitor::class);
        $this->singleton(\Jankx\Performance\CoreWebVitalsMonitor::class);
        $this->singleton(\Jankx\Performance\LazyLoader::class);
        $this->singleton(\Jankx\Performance\CacheManager::class);
    }

    public function boot(): void
    {
        $performanceMonitor = $this->container->make(\Jankx\Performance\PerformanceMonitor::class);
        $performanceMonitor->initialize();
    }
}
```

## 🔧 Service Resolution

### Dependency Resolution
```php
class DependencyResolver
{
    private $container;

    public function __construct(ServiceContainer $container)
    {
        $this->container = $container;
    }

    public function resolve(string $abstract)
    {
        return $this->container->make($abstract);
    }

    public function resolveMethod($object, string $method)
    {
        $reflector = new \ReflectionMethod($object, $method);
        $dependencies = $this->resolveDependencies($reflector->getParameters());

        return $reflector->invokeArgs($object, $dependencies);
    }

    private function resolveDependencies(array $parameters): array
    {
        $dependencies = [];

        foreach ($parameters as $parameter) {
            $dependencies[] = $this->resolveParameter($parameter);
        }

        return $dependencies;
    }

    private function resolveParameter(\ReflectionParameter $parameter)
    {
        $type = $parameter->getType();

        if ($type && !$type->isBuiltin()) {
            return $this->container->make($type->getName());
        }

        if ($parameter->isDefaultValueAvailable()) {
            return $parameter->getDefaultValue();
        }

        throw new \Exception("Cannot resolve parameter {$parameter->getName()}");
    }
}
```

### Factory Pattern
```php
class ServiceFactory
{
    private $container;

    public function __construct(ServiceContainer $container)
    {
        $this->container = $container;
    }

    public function create(string $abstract, array $parameters = [])
    {
        $reflector = new \ReflectionClass($abstract);

        if (!$reflector->isInstantiable()) {
            throw new \Exception("Class {$abstract} is not instantiable");
        }

        $constructor = $reflector->getConstructor();

        if (is_null($constructor)) {
            return new $abstract;
        }

        $dependencies = $this->resolveDependencies($constructor->getParameters(), $parameters);

        return $reflector->newInstanceArgs($dependencies);
    }

    private function resolveDependencies(array $parameters, array $provided = []): array
    {
        $dependencies = [];

        foreach ($parameters as $parameter) {
            $name = $parameter->getName();

            if (isset($provided[$name])) {
                $dependencies[] = $provided[$name];
                continue;
            }

            $dependencies[] = $this->resolveParameter($parameter);
        }

        return $dependencies;
    }

    private function resolveParameter(\ReflectionParameter $parameter)
    {
        $type = $parameter->getType();

        if ($type && !$type->isBuiltin()) {
            return $this->container->make($type->getName());
        }

        if ($parameter->isDefaultValueAvailable()) {
            return $parameter->getDefaultValue();
        }

        throw new \Exception("Cannot resolve parameter {$parameter->getName()}");
    }
}
```

## 🔄 Service Lifecycle

### Service Lifecycle Management
```php
class ServiceLifecycleManager
{
    private $container;
    private $lifecycles = [];

    public function __construct(ServiceContainer $container)
    {
        $this->container = $container;
    }

    public function registerLifecycle(string $service, callable $callback): void
    {
        $this->lifecycles[$service] = $callback;
    }

    public function bootService(string $service): void
    {
        if (isset($this->lifecycles[$service])) {
            $instance = $this->container->make($service);
            $this->lifecycles[$service]($instance);
        }
    }

    public function shutdownService(string $service): void
    {
        if (isset($this->lifecycles[$service])) {
            $instance = $this->container->make($service);
            if (method_exists($instance, 'shutdown')) {
                $instance->shutdown();
            }
        }
    }
}
```

### Deferred Services
```php
class DeferredServiceProvider extends ServiceProvider
{
    private $deferred = [];

    public function register(): void
    {
        // Register services but don't instantiate
        $this->deferred = [
            \Jankx\Performance\HeavyService::class,
            \Jankx\Analytics\AnalyticsService::class,
            \Jankx\Cache\CacheService::class,
        ];

        foreach ($this->deferred as $service) {
            $this->singleton($service);
        }
    }

    public function boot(): void
    {
        // Only instantiate when needed
        foreach ($this->deferred as $service) {
            if ($this->isServiceNeeded($service)) {
                $this->container->make($service);
            }
        }
    }

    private function isServiceNeeded(string $service): bool
    {
        // Check if service is actually used
        return $this->checkServiceUsage($service);
    }
}
```

## 📊 Container Monitoring

### Service Usage Tracking
```php
class ServiceUsageTracker
{
    private $usage = [];
    private $performance = [];

    public function trackServiceUsage(string $service): void
    {
        $this->usage[$service] = ($this->usage[$service] ?? 0) + 1;
    }

    public function trackServicePerformance(string $service, float $time): void
    {
        if (!isset($this->performance[$service])) {
            $this->performance[$service] = [];
        }

        $this->performance[$service][] = $time;
    }

    public function getServiceUsage(): array
    {
        return $this->usage;
    }

    public function getServicePerformance(): array
    {
        $averages = [];

        foreach ($this->performance as $service => $times) {
            $averages[$service] = array_sum($times) / count($times);
        }

        return $averages;
    }

    public function getMostUsedServices(int $limit = 10): array
    {
        arsort($this->usage);
        return array_slice($this->usage, 0, $limit, true);
    }
}
```

### Container Performance Monitor
```php
class ContainerPerformanceMonitor
{
    private $startTimes = [];
    private $metrics = [];

    public function startResolution(string $service): void
    {
        $this->startTimes[$service] = microtime(true);
    }

    public function endResolution(string $service): void
    {
        if (isset($this->startTimes[$service])) {
            $time = microtime(true) - $this->startTimes[$service];

            if (!isset($this->metrics[$service])) {
                $this->metrics[$service] = [];
            }

            $this->metrics[$service][] = $time;

            unset($this->startTimes[$service]);
        }
    }

    public function getMetrics(): array
    {
        $averages = [];

        foreach ($this->metrics as $service => $times) {
            $averages[$service] = [
                'average' => array_sum($times) / count($times),
                'min' => min($times),
                'max' => max($times),
                'count' => count($times)
            ];
        }

        return $averages;
    }
}
```

## 🔧 Container Configuration

### Configuration Loading
```php
class ContainerConfigLoader
{
    private $container;

    public function __construct(ServiceContainer $container)
    {
        $this->container = $container;
    }

    public function loadFromConfig(array $config): void
    {
        foreach ($config['bindings'] ?? [] as $abstract => $binding) {
            $this->container->bind(
                $abstract,
                $binding['concrete'] ?? null,
                $binding['shared'] ?? false
            );
        }

        foreach ($config['singletons'] ?? [] as $abstract => $concrete) {
            $this->container->singleton($abstract, $concrete);
        }

        foreach ($config['instances'] ?? [] as $abstract => $instance) {
            $this->container->instance($abstract, $instance);
        }
    }

    public function loadFromFile(string $file): void
    {
        if (file_exists($file)) {
            $config = require $file;
            $this->loadFromConfig($config);
        }
    }
}
```

### Environment Configuration
```php
// config/container.php
return [
    'bindings' => [
        \Jankx\Assets\AssetManager::class => [
            'concrete' => \Jankx\Assets\AssetManager::class,
            'shared' => true,
        ],
        \Jankx\Gutenberg\BlockRegistry::class => [
            'concrete' => \Jankx\Gutenberg\BlockRegistry::class,
            'shared' => true,
        ],
    ],
    'singletons' => [
        \Jankx\Security\SecurityManager::class => \Jankx\Security\SecurityManager::class,
        \Jankx\Performance\PerformanceMonitor::class => \Jankx\Performance\PerformanceMonitor::class,
    ],
    'instances' => [
        'config' => new \Jankx\Config\ConfigManager(),
    ],
];
```

---

**Next**: [Bootstrapping Flow](./bootstrapping-flow.md)