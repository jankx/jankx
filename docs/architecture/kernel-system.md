# Kernel System

> **Core Framework Bootstrapping & Initialization**

Kernel System là trái tim của Jankx 2.0, quản lý việc khởi tạo framework, service container và bootstrapping process.

## 🏗 Kernel Architecture

### Core Components
```
┌─────────────────────────────────────┐
│              Kernel                 │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Service   │  │  Bootstrap  │  │
│  │  Container  │  │   Manager   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           Service Providers         │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Core      │  │   Feature   │  │
│  │  Services   │  │  Services   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           Bootstrappers             │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Admin     │  │  Frontend   │  │
│  │Bootstrap    │  │Bootstrap    │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

## 🔧 Kernel Implementation

### Main Kernel Class
```php
<?php
namespace Jankx\Kernel;

use Jankx\Container\ServiceContainer;
use Jankx\Bootstrap\BootstrapManager;
use Jankx\Providers\ServiceProvider;

class Kernel
{
    private $container;
    private $bootstrapManager;
    private $providers = [];
    private $booted = false;

    public function __construct()
    {
        $this->container = new ServiceContainer();
        $this->bootstrapManager = new BootstrapManager($this->container);
        $this->registerCoreProviders();
    }

    public function bootstrap(): void
    {
        if ($this->booted) {
            return;
        }

        // Register service providers
        $this->registerProviders();

        // Boot service providers
        $this->bootProviders();

        // Run bootstrappers
        $this->runBootstrappers();

        $this->booted = true;
    }

    private function registerCoreProviders(): void
    {
        $this->providers = [
            \Jankx\Providers\AssetServiceProvider::class,
            \Jankx\Providers\GutenbergServiceProvider::class,
            \Jankx\Providers\SecurityServiceProvider::class,
            \Jankx\Providers\PerformanceServiceProvider::class,
            \Jankx\Providers\TemplateServiceProvider::class,
        ];
    }

    private function registerProviders(): void
    {
        foreach ($this->providers as $provider) {
            $this->container->register($provider);
        }
    }

    private function bootProviders(): void
    {
        foreach ($this->providers as $provider) {
            $instance = $this->container->make($provider);
            if ($instance instanceof ServiceProvider) {
                $instance->boot();
            }
        }
    }

    private function runBootstrappers(): void
    {
        $this->bootstrapManager->run();
    }

    public function getContainer(): ServiceContainer
    {
        return $this->container;
    }

    public function isBooted(): bool
    {
        return $this->booted;
    }
}
```

### Service Container
```php
<?php
namespace Jankx\Container;

class ServiceContainer
{
    private $bindings = [];
    private $singletons = [];
    private $instances = [];

    public function bind(string $abstract, $concrete = null, bool $shared = false): void
    {
        $this->bindings[$abstract] = [
            'concrete' => $concrete,
            'shared' => $shared,
        ];
    }

    public function singleton(string $abstract, $concrete = null): void
    {
        $this->bind($abstract, $concrete, true);
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

        // Resolve the binding
        $concrete = $this->resolve($abstract);

        // Store if singleton
        if (isset($this->bindings[$abstract]['shared']) && $this->bindings[$abstract]['shared']) {
            $this->singletons[$abstract] = $concrete;
        }

        return $concrete;
    }

    private function resolve(string $abstract)
    {
        if (!isset($this->bindings[$abstract])) {
            throw new \Exception("No binding found for {$abstract}");
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
            throw new \Exception("Class {$concrete} is not instantiable");
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

        throw new \Exception("Unresolvable dependency {$dependency->getName()}");
    }

    public function register(string $provider): void
    {
        $instance = new $provider($this);
        $instance->register();
    }
}
```

## 🔄 Bootstrap Manager

### Bootstrap Manager Implementation
```php
<?php
namespace Jankx\Bootstrap;

use Jankx\Container\ServiceContainer;

class BootstrapManager
{
    private $container;
    private $bootstrappers = [];

    public function __construct(ServiceContainer $container)
    {
        $this->container = $container;
        $this->registerBootstrappers();
    }

    private function registerBootstrappers(): void
    {
        $this->bootstrappers = [
            CoreBootstrapper::class,
            AdminBootstrapper::class,
            FrontendBootstrapper::class,
            ThemeBootstrapper::class,
            WooCommerceBootstrapper::class,
        ];
    }

    public function run(): void
    {
        foreach ($this->bootstrappers as $bootstrapper) {
            if ($this->shouldRun($bootstrapper)) {
                $instance = $this->container->make($bootstrapper);
                $instance->bootstrap();
            }
        }
    }

    private function shouldRun(string $bootstrapper): bool
    {
        switch ($bootstrapper) {
            case AdminBootstrapper::class:
                return is_admin();
            case FrontendBootstrapper::class:
                return !is_admin();
            case WooCommerceBootstrapper::class:
                return class_exists('WooCommerce');
            default:
                return true;
        }
    }
}
```

### Core Bootstrapper
```php
<?php
namespace Jankx\Bootstrap;

use Jankx\Container\ServiceContainer;

class CoreBootstrapper
{
    private $container;

    public function __construct(ServiceContainer $container)
    {
        $this->container = $container;
    }

    public function bootstrap(): void
    {
        // Initialize core services
        $this->initializeCoreServices();

        // Set up WordPress hooks
        $this->setupWordPressHooks();

        // Initialize error handling
        $this->initializeErrorHandling();

        // Set up logging
        $this->setupLogging();
    }

    private function initializeCoreServices(): void
    {
        // Initialize configuration
        $config = $this->container->make(\Jankx\Config\ConfigManager::class);
        $config->load();

        // Initialize asset manager
        $assetManager = $this->container->make(\Jankx\Assets\AssetManager::class);
        $assetManager->initialize();

        // Initialize security manager
        $securityManager = $this->container->make(\Jankx\Security\SecurityManager::class);
        $securityManager->initialize();
    }

    private function setupWordPressHooks(): void
    {
        // Theme setup
        add_action('after_setup_theme', [$this, 'setupTheme']);

        // Enqueue scripts and styles
        add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminScripts']);

        // Widgets
        add_action('widgets_init', [$this, 'registerWidgets']);

        // Customizer
        add_action('customize_register', [$this, 'customizeRegister']);
    }

    public function setupTheme(): void
    {
        // Add theme support
        add_theme_support('post-thumbnails');
        add_theme_support('title-tag');
        add_theme_support('custom-logo');
        add_theme_support('html5', [
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
        ]);

        // Register navigation menus
        register_nav_menus([
            'primary' => __('Primary Menu', 'jankx'),
            'footer' => __('Footer Menu', 'jankx'),
        ]);
    }

    public function enqueueScripts(): void
    {
        $assetManager = $this->container->make(\Jankx\Assets\AssetManager::class);
        $assetManager->enqueueFrontendAssets();
    }

    public function enqueueAdminScripts(): void
    {
        $assetManager = $this->container->make(\Jankx\Assets\AssetManager::class);
        $assetManager->enqueueAdminAssets();
    }

    public function registerWidgets(): void
    {
        $widgetManager = $this->container->make(\Jankx\Widgets\WidgetManager::class);
        $widgetManager->registerWidgets();
    }

    public function customizeRegister(\WP_Customize_Manager $wp_customize): void
    {
        $customizer = $this->container->make(\Jankx\Customizer\CustomizerManager::class);
        $customizer->register($wp_customize);
    }
}
```

## 🔧 Service Providers

### Base Service Provider
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
}
```

### Asset Service Provider
```php
<?php
namespace Jankx\Providers;

use Jankx\Container\ServiceContainer;

class AssetServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->container->singleton(\Jankx\Assets\AssetManager::class);
        $this->container->singleton(\Jankx\Assets\AssetOptimizer::class);
        $this->container->singleton(\Jankx\Assets\CriticalCSSGenerator::class);
    }

    public function boot(): void
    {
        $assetManager = $this->container->make(\Jankx\Assets\AssetManager::class);
        $assetManager->initialize();
    }
}
```

### Gutenberg Service Provider
```php
<?php
namespace Jankx\Providers;

use Jankx\Container\ServiceContainer;

class GutenbergServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->container->singleton(\Jankx\Gutenberg\BlockRegistry::class);
        $this->container->singleton(\Jankx\Gutenberg\BlockRenderer::class);
        $this->container->singleton(\Jankx\Gutenberg\LayoutManager::class);
    }

    public function boot(): void
    {
        $blockRegistry = $this->container->make(\Jankx\Gutenberg\BlockRegistry::class);
        $blockRegistry->registerBlocks();
    }
}
```

## 🔄 Kernel Lifecycle

### Initialization Flow
```php
// 1. WordPress loads theme
// 2. functions.php is executed
require_once get_template_directory() . '/includes/framework.php';

// 3. Framework bootstrap
Jankx::getInstance()->bootstrap();

// 4. Kernel initialization
class Jankx {
    private $kernel;

    public function bootstrap(): void {
        $this->kernel = new Kernel();
        $this->kernel->bootstrap();
    }
}

// 5. Service container setup
// 6. Service providers registration
// 7. Service providers boot
// 8. Bootstrappers execution
```

### Service Resolution
```php
// Service resolution flow
Kernel → ServiceContainer → ServiceProvider → Service → Bootstrapper
```

## 📊 Kernel Monitoring

### Performance Monitoring
```php
class KernelMonitor
{
    private $startTime;
    private $metrics = [];

    public function startMonitoring(): void
    {
        $this->startTime = microtime(true);
    }

    public function recordMetric(string $name, float $value): void
    {
        $this->metrics[$name] = $value;
    }

    public function getMetrics(): array
    {
        return $this->metrics;
    }

    public function getBootTime(): float
    {
        return microtime(true) - $this->startTime;
    }
}
```

### Error Handling
```php
class KernelErrorHandler
{
    public function handleError(int $errno, string $errstr, string $errfile, int $errline): bool
    {
        if (!(error_reporting() & $errno)) {
            return false;
        }

        $error = [
            'type' => $errno,
            'message' => $errstr,
            'file' => $errfile,
            'line' => $errline,
            'timestamp' => current_time('mysql')
        ];

        $this->logError($error);

        return true;
    }

    public function handleException(\Throwable $exception): void
    {
        $error = [
            'type' => get_class($exception),
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString(),
            'timestamp' => current_time('mysql')
        ];

        $this->logError($error);
    }

    private function logError(array $error): void
    {
        error_log('JANKX ERROR: ' . json_encode($error));
    }
}
```

## 🔧 Configuration Management

### Configuration Loading
```php
class ConfigManager
{
    private $config = [];

    public function load(string $environment = 'production'): void
    {
        // Load base configuration
        $this->loadBaseConfig();

        // Load environment-specific configuration
        $this->loadEnvironmentConfig($environment);

        // Load user configuration
        $this->loadUserConfig();
    }

    private function loadBaseConfig(): void
    {
        $configFile = get_template_directory() . '/config/base.php';
        if (file_exists($configFile)) {
            $this->config = array_merge($this->config, require $configFile);
        }
    }

    private function loadEnvironmentConfig(string $environment): void
    {
        $configFile = get_template_directory() . "/config/{$environment}.php";
        if (file_exists($configFile)) {
            $this->config = array_merge($this->config, require $configFile);
        }
    }

    public function get(string $key, $default = null)
    {
        return $this->config[$key] ?? $default;
    }

    public function set(string $key, $value): void
    {
        $this->config[$key] = $value;
    }
}
```

---

**Next**: [Service Container](./service-container.md) | [Bootstrapping Flow](./bootstrapping-flow.md)