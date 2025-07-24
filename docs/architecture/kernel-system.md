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

use Jankx\Jankx;
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
    /**
     * @var Container
     */
    protected $container;

    /**
     * @var array
     */
    protected $services = [];

    /**
     * @var array
     */
    protected $hooks = [];

    /**
     * @var array
     */
    protected $filters = [];

    /**
     * @var array
     */
    protected $bootstrappers = [];

    /**
     * @var bool
     */
    protected $booted = false;

    /**
     * @var string
     */
    protected $kernelType;

    protected $serviceProviders = [];

    /**
     * Constructor
     */
    public function __construct(Container $container = null)
    {
        $this->container = $container ?: Jankx::getInstance();
        $this->kernelType = $this->getKernelType();

        $this->registerBootstrappers();
        $this->registerServices();
        $this->registerHooks();
        $this->registerFilters();
    }

    /**
     * Get kernel type
     */
    public function getKernelType(): string
    {
        return 'abstract';
    }

    /**
     * Register bootstrappers
     */
    abstract protected function registerBootstrappers(): void;

    /**
     * Register services
     */
    abstract protected function registerServices(): void;

    /**
     * Register hooks
     */
    abstract protected function registerHooks(): void;

    /**
     * Register filters
     */
    abstract protected function registerFilters(): void;

    /**
     * Boot the kernel
     */
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

    /**
     * Check if kernel is booted
     */
    public function isBooted(): bool
    {
        return $this->booted;
    }

    /**
     * Get kernel type
     */
    public function getType(): string
    {
        return $this->kernelType;
    }

    /**
     * Get container
     */
    public function getContainer(): \Illuminate\Container\Container
    {
        return $this->container;
    }
}
```

### Service Container (Illuminate Container)

Jankx sử dụng Illuminate Container từ Laravel framework để quản lý dependency injection:

```php
<?php
// Jankx extends Illuminate Container
namespace Jankx;

use Illuminate\Container\Container;

class Jankx extends Container
{
    /**
     * Instance của class Jankx
     * @var Jankx
     */
    protected static $instance;

    /**
     * Lấy instance của Jankx
     * @return Jankx
     */
    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Tên của framework
     * @return string
     */
    public static function getFrameworkName(): string
    {
        return FrameworkEnum::frameworkName();
    }

    /**
     * Phiên bản hiện tại của framework
     * @return string
     */
    public static function getFrameworkVersion(): string
    {
        return FrameworkEnum::frameworkVersion();
    }
}
```

## 🔄 Bootstrap Manager

### Bootstrap Manager Implementation
```php
<?php
namespace Jankx\Kernel;

/**
 * Bootstrap Manager trong Kernel
 */
protected function runBootstrappers(): void
{
    $bootstrappers = $this->sortBootstrappersByPriority();

    foreach ($bootstrappers as $bootstrapper) {
        if ($this->shouldRunBootstrapper($bootstrapper)) {
            $instance = $this->container->make($bootstrapper);

            if ($instance instanceof BootstrapperInterface) {
                // Check dependencies
                if ($this->checkBootstrapperDependencies($instance)) {
                    $instance->bootstrap($this->container);
                }
            }
        }
    }
}

/**
 * Sort bootstrappers by priority
 */
protected function sortBootstrappersByPriority(): array
{
    $bootstrappers = $this->bootstrappers;

    usort($bootstrappers, function($a, $b) {
        $aInstance = $this->container->make($a);
        $bInstance = $this->container->make($b);

        return $aInstance->getPriority() - $bInstance->getPriority();
    });

    return $bootstrappers;
}

/**
 * Check if bootstrapper should run
 */
protected function shouldRunBootstrapper(string $bootstrapper): bool
{
    $instance = $this->container->make($bootstrapper);

    if ($instance instanceof BootstrapperInterface) {
        return $instance->shouldRun();
    }

    return true;
}
```

### Core Bootstrapper Example
```php
<?php
namespace Jankx\Bootstrappers\Global;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

class CoreBootstrapper extends AbstractBootstrapper
{
    protected $priority = 5; // Highest priority

    public function getName(): string
    {
        return 'core';
    }

    public function shouldRun(): bool
    {
        return true; // Always runs
    }

    public function bootstrap(Container $container): void
    {
        // Initialize core services
        $this->initializeCoreServices($container);

        // Set up WordPress hooks
        $this->setupWordPressHooks();

        // Initialize error handling
        $this->initializeErrorHandling($container);

        // Set up logging
        $this->setupLogging($container);
    }

    private function initializeCoreServices(Container $container): void
    {
        // Initialize configuration
        $config = $container->make(\Jankx\Config\ConfigManager::class);
        $config->load();

        // Initialize asset manager
        $assetManager = $container->make(\Jankx\Assets\AssetManager::class);
        $assetManager->initialize();

        // Initialize security manager
        $securityManager = $container->make(\Jankx\Security\SecurityManager::class);
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

use Illuminate\Container\Container;

abstract class ServiceProvider
{
    protected $container;

    public function __construct(Container $container)
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

use Illuminate\Container\Container;

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

use Illuminate\Container\Container;

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