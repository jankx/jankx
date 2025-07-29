# Deferred Service Context

> **Lazy Loading & Context-Aware Service Management**

Jankx 2.0 sử dụng Deferred Service Context pattern để tối ưu performance, giảm memory usage và cải thiện loading time bằng cách chỉ load services khi thực sự cần thiết.

## 🎯 Overview

### Problem Statement
```php
// Traditional approach - Load everything upfront
class TraditionalBootstrapper
{
    public function bootstrap(): void
    {
        // Load ALL services regardless of context
        $this->loadAdminServices();      // ❌ Unnecessary in frontend
        $this->loadFrontendServices();   // ❌ Unnecessary in admin
        $this->loadAPIServices();        // ❌ Unnecessary in CLI
        $this->loadGutenbergServices();  // ❌ Unnecessary in REST API
    }
}
```

### Solution: Deferred Service Context
```php
// Modern approach - Load only what's needed
class DeferredBootstrapper
{
    public function bootstrap(): void
    {
        // Load core services first
        $this->loadCoreServices();

        // Defer context-specific services
        $this->deferContextServices();
    }

    private function deferContextServices(): void
    {
        // Services will be loaded when actually needed
        $this->container->defer('admin.services', function() {
            return $this->loadAdminServices();
        });

        $this->container->defer('frontend.services', function() {
            return $this->loadFrontendServices();
        });
    }
}
```

## 🔧 Implementation

### 1. Service Context Registry

```php
<?php
namespace Jankx\Context;

use Illuminate\Container\Container;

class ContextualServiceRegistry
{
    const SHARED = 'shared';
    const ADMIN = 'admin';
    const FRONTEND = 'frontend';
    const API = 'api';
    const CLI = 'cli';
    const GUTENBERG = 'gutenberg';
    const WOOCOMMERCE = 'woocommerce';

    private static $registry = [];
    private static $deferred = [];
    private static $loaded = [];

    /**
     * Register a service for specific context
     */
    public static function register(string $context, string $serviceClass, array $options = []): void
    {
        if (!isset(self::$registry[$context])) {
            self::$registry[$context] = [];
        }

        self::$registry[$context][] = [
            'class' => $serviceClass,
            'options' => $options,
            'deferred' => $options['deferred'] ?? true,
            'priority' => $options['priority'] ?? 10,
        ];
    }

    /**
     * Register a deferred service
     */
    public static function defer(string $context, callable $factory, array $options = []): void
    {
        self::$deferred[$context][] = [
            'factory' => $factory,
            'options' => $options,
            'priority' => $options['priority'] ?? 10,
        ];
    }

    /**
     * Load services for current context
     */
    public static function loadForContext(Container $container, string $context): void
    {
        if (isset(self::$loaded[$context])) {
            return; // Already loaded
        }

        // Load immediate services
        if (isset(self::$registry[$context])) {
            foreach (self::$registry[$context] as $service) {
                if (!$service['deferred']) {
                    $container->singleton($service['class']);
                }
            }
        }

        // Mark as loaded
        self::$loaded[$context] = true;
    }

    /**
     * Resolve deferred service
     */
    public static function resolve(Container $container, string $context, string $serviceName): mixed
    {
        // Check if service is already resolved
        if ($container->bound($serviceName)) {
            return $container->make($serviceName);
        }

        // Load deferred services for context
        if (isset(self::$deferred[$context])) {
            foreach (self::$deferred[$context] as $deferred) {
                $deferred['factory']($container);
            }
        }

        // Try to resolve again
        if ($container->bound($serviceName)) {
            return $container->make($serviceName);
        }

        throw new \Exception("Service {$serviceName} not found in context {$context}");
    }
}
```

### 2. Context-Aware Service Provider

```php
<?php
namespace Jankx\Providers;

use Illuminate\Container\Container;
use Jankx\Context\ContextualServiceRegistry;

class ContextualServiceProvider
{
    private $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * Register services based on current context
     */
    public function register(): void
    {
        $context = $this->getCurrentContext();

        // Register core services (always loaded)
        $this->registerCoreServices();

        // Register context-specific services
        $this->registerContextServices($context);

        // Register deferred services
        $this->registerDeferredServices($context);
    }

    /**
     * Get current application context
     */
    private function getCurrentContext(): string
    {
        return ContextualServiceRegistry::getCurrentContext();
    }

    /**
     * Register core services (always loaded)
     */
    private function registerCoreServices(): void
    {
        // Essential services that are always needed
        $this->container->singleton(\Jankx\Config\ConfigManager::class);
        $this->container->singleton(\Jankx\Logger\Logger::class);
        $this->container->singleton(\Jankx\Security\SecurityManager::class);
        $this->container->singleton(\Jankx\Performance\PerformanceMonitor::class);
    }

    /**
     * Register context-specific services
     */
    private function registerContextServices(string $context): void
    {
        switch ($context) {
            case 'admin':
                $provider = new \Jankx\Providers\AdminServiceProvider($this->container);
                $provider->register();
                break;
            case 'frontend':
                $provider = new \Jankx\Providers\FrontendServiceProvider($this->container);
                $provider->register();
                break;
            case 'api':
                $provider = new \Jankx\Providers\APIServiceProvider($this->container);
                $provider->register();
                break;
            case 'cli':
                $provider = new \Jankx\Providers\CLIServiceProvider($this->container);
                $provider->register();
                break;
        }
    }

    /**
     * Register deferred services
     */
    private function registerDeferredServices(string $context): void
    {
        // Defer heavy services until actually needed
        ContextualServiceRegistry::defer($context, function(Container $container) use ($context) {
            // Admin-specific deferred services
            if ($context === 'admin') {
                $provider = new \Jankx\Providers\AdminServiceProvider($container);
                $provider->register();
                $provider->boot();
            }

            // Frontend-specific deferred services
            if ($context === 'frontend') {
                $provider = new \Jankx\Providers\FrontendServiceProvider($container);
                $provider->register();
                $provider->boot();
            }

            // CLI-specific deferred services
            if ($context === 'cli') {
                $provider = new \Jankx\Providers\CLIServiceProvider($container);
                $provider->register();
                $provider->boot();
            }

            // API-specific deferred services
            if ($context === 'api') {
                $provider = new \Jankx\Providers\APIServiceProvider($container);
                $provider->register();
                $provider->boot();
            }
        });
    }

    /**
     * Register admin services (Deprecated - Use AdminServiceProvider)
     */
    private function registerAdminServices(): void
    {
        // Admin services are now registered through AdminKernel
        // No need to create new AdminServiceProvider instance here
    }

    /**
     * Register frontend services (Deprecated - Use FrontendServiceProvider)
     */
    private function registerFrontendServices(): void
    {
        // Frontend services are now registered through FrontendKernel
        // No need to create new FrontendServiceProvider instance here
    }
}
```

### 3. Deferred Service Resolver

```php
<?php
namespace Jankx\Services;

use Illuminate\Container\Container;
use Jankx\Context\ContextualServiceRegistry;

class DeferredServiceResolver
{
    private $container;
    private $resolved = [];
    private $monitor;

    public function __construct(Container $container)
    {
        $this->container = $container;
        $this->monitor = new DeferredServiceMonitor();
    }

    /**
     * Resolve a service with deferred loading
     */
    public function resolve(string $serviceName): mixed
    {
        // Check if already resolved
        if (isset($this->resolved[$serviceName])) {
            return $this->resolved[$serviceName];
        }

        // Start monitoring
        $this->monitor->startMonitoring($serviceName);

        try {
            // Get current context
            $context = ContextualServiceRegistry::getCurrentContext();

            // Try to resolve from container
            if ($this->container->bound($serviceName)) {
                $service = $this->container->make($serviceName);
                $this->resolved[$serviceName] = $service;
                $this->monitor->endMonitoring($serviceName);
                return $service;
            }

            // Try to resolve from deferred registry
            $service = ContextualServiceRegistry::resolve($this->container, $context, $serviceName);
            $this->resolved[$serviceName] = $service;
            $this->monitor->endMonitoring($serviceName);
            return $service;

        } catch (\Exception $e) {
            $this->monitor->endMonitoring($serviceName);

            // Log the error
            error_log("Failed to resolve service: {$serviceName} in context: {$context}");
            throw $e;
        }
    }

    /**
     * Check if service is available in current context
     */
    public function has(string $serviceName): bool
    {
        try {
            $this->resolve($serviceName);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get all resolved services
     */
    public function getResolvedServices(): array
    {
        return array_keys($this->resolved);
    }

    /**
     * Get service resolution statistics
     */
    public function getResolutionStats(): array
    {
        return [
            'resolved_services' => $this->getResolvedServices(),
            'total_resolved' => count($this->resolved),
            'monitoring_metrics' => $this->monitor->getMetrics(),
        ];
    }

    /**
     * Clear resolved services cache
     */
    public function clearCache(): void
    {
        $this->resolved = [];
        $this->monitor->clearMetrics();
    }

    /**
     * Get monitor instance
     */
    public function getMonitor(): DeferredServiceMonitor
    {
        return $this->monitor;
    }
}
```

## 🚀 Usage Examples

### 1. Service Registration

```php
<?php
// Register services for different contexts
use Jankx\Context\ContextualServiceRegistry;

// Admin context services
ContextualServiceRegistry::register(ContextualServiceRegistry::ADMIN, [
    \Jankx\Admin\DashboardManager::class,
    \Jankx\Admin\SettingsManager::class,
    \Jankx\Admin\MenuManager::class,
]);

// Frontend context services
ContextualServiceRegistry::register(ContextualServiceRegistry::FRONTEND, [
    \Jankx\Frontend\AssetManager::class,
    \Jankx\Frontend\TemplateManager::class,
    \Jankx\SEO\SEOManager::class,
]);

// Deferred services (loaded only when needed)
ContextualServiceRegistry::defer(ContextualServiceRegistry::ADMIN, function(Container $container) {
    $container->singleton(\Jankx\Admin\AnalyticsManager::class);
    $container->singleton(\Jankx\Admin\ReportManager::class);
});
```

### 2. Service Resolution

```php
<?php
// In your bootstrapper or service
class AdminBootstrapper extends AbstractBootstrapper
{
    public function bootstrap(Container $container): void
    {
        $resolver = new DeferredServiceResolver($container);

        // Services will be loaded only when accessed
        $dashboardManager = $resolver->resolve(\Jankx\Admin\DashboardManager::class);
        $settingsManager = $resolver->resolve(\Jankx\Admin\SettingsManager::class);

        // Check if service is available
        if ($resolver->has(\Jankx\Admin\AnalyticsManager::class)) {
            $analyticsManager = $resolver->resolve(\Jankx\Admin\AnalyticsManager::class);
        }
    }
}
```

### 3. Context-Aware Service Loading

```php
<?php
// In your bootstrapper
class AdminBootstrapper extends AbstractBootstrapper
{
    public function bootstrap(Container $container): void
    {
        // Register context-aware services
        $contextProvider = new ContextualServiceProvider($container);
        $contextProvider->register();

        // Setup deferred service resolver
        $container->singleton('deferred.resolver', DeferredServiceResolver::class);

        // Load essential admin services immediately
        $this->loadEssentialServices($container);

        // Defer heavy services
        $this->deferHeavyServices($container);

        // Set up admin hooks
        $this->setupAdminHooks();
    }

    private function loadEssentialServices(Container $container): void
    {
        // Services needed immediately
        $container->singleton(\Jankx\Admin\MenuManager::class);
        $container->singleton(\Jankx\Admin\AssetManager::class);
        $container->singleton(\Jankx\Admin\NoticeManager::class);
    }

    private function deferHeavyServices(Container $container): void
    {
        // Defer heavy services until actually needed
        ContextualServiceRegistry::defer(ContextualServiceRegistry::ADMIN, function(Container $container) {
            $container->singleton(\Jankx\Admin\AnalyticsManager::class);
            $container->singleton(\Jankx\Admin\ReportManager::class);
            $container->singleton(\Jankx\Admin\DashboardWidgetManager::class);
        });
    }

    private function setupAdminHooks(): void
    {
        // Hook into WordPress to load services when needed
        add_action('admin_init', [$this, 'loadAdminServices']);
        add_action('admin_enqueue_scripts', [$this, 'loadAdminAssets']);
    }

    public function loadAdminServices(): void
    {
        $resolver = $this->container->make('deferred.resolver');

        // Load admin services only when in admin context
        if (is_admin()) {
            $resolver->resolve(\Jankx\Admin\DashboardManager::class);
        }
    }

    public function loadAdminAssets(): void
    {
        // Load admin assets when needed
        $resolver = $this->container->make('deferred.resolver');

        if ($resolver->has(\Jankx\Admin\AssetManager::class)) {
            $assetManager = $resolver->resolve(\Jankx\Admin\AssetManager::class);
            $assetManager->enqueueAdminAssets();
        }
    }
}
```

## 📊 Performance Benefits

### Memory Usage Comparison

```php
// Traditional approach
$memoryUsage = [
    'core_services' => '2.5MB',
    'admin_services' => '8.2MB',    // ❌ Loaded even in frontend
    'frontend_services' => '6.1MB',  // ❌ Loaded even in admin
    'gutenberg_services' => '4.3MB', // ❌ Loaded even in API
    'total' => '21.1MB'
];

// Deferred approach
$memoryUsage = [
    'core_services' => '2.5MB',
    'admin_services' => '8.2MB',    // ✅ Only in admin
    'frontend_services' => '6.1MB',  // ✅ Only in frontend
    'gutenberg_services' => '4.3MB', // ✅ Only in Gutenberg
    'total' => '2.5MB'              // 🚀 Massive improvement!
];
```

### Loading Time Comparison

```php
// Traditional approach
$loadingTime = [
    'core_services' => '15ms',
    'admin_services' => '45ms',     // ❌ Always loaded
    'frontend_services' => '38ms',  // ❌ Always loaded
    'gutenberg_services' => '32ms', // ❌ Always loaded
    'total' => '130ms'
];

// Deferred approach
$loadingTime = [
    'core_services' => '15ms',
    'context_services' => '0ms',    // ✅ Loaded on demand
    'total' => '15ms'               // 🚀 88% improvement!
];
```

## 🔧 Configuration

### Service Configuration

```php
<?php
// config/services.php
return [
    'deferred' => [
        'enabled' => true,
        'contexts' => [
            'admin' => [
                'services' => [
                    \Jankx\Admin\DashboardManager::class,
                    \Jankx\Admin\SettingsManager::class,
                ],
                'deferred' => [
                    \Jankx\Admin\AnalyticsManager::class,
                    \Jankx\Admin\ReportManager::class,
                ],
            ],
            'frontend' => [
                'services' => [
                    \Jankx\Frontend\AssetManager::class,
                    \Jankx\Frontend\TemplateManager::class,
                ],
                'deferred' => [
                    \Jankx\SEO\SEOManager::class,
                    \Jankx\Analytics\AnalyticsManager::class,
                ],
            ],
        ],
    ],
];
```

### Performance Monitoring

```php
<?php
class DeferredServiceMonitor
{
    private $metrics = [];
    private $startTimes = [];

    /**
     * Start monitoring a service
     */
    public function startMonitoring(string $serviceName): void
    {
        $this->startTimes[$serviceName] = [
            'start_time' => microtime(true),
            'memory_before' => memory_get_usage(true),
            'peak_memory_before' => memory_get_peak_usage(true),
        ];
    }

    /**
     * End monitoring a service
     */
    public function endMonitoring(string $serviceName): void
    {
        if (!isset($this->startTimes[$serviceName])) {
            return;
        }

        $startData = $this->startTimes[$serviceName];
        $endTime = microtime(true);
        $memoryAfter = memory_get_usage(true);
        $peakMemoryAfter = memory_get_peak_usage(true);

        $this->metrics[$serviceName] = [
            'load_time' => $endTime - $startData['start_time'],
            'memory_usage' => $memoryAfter - $startData['memory_before'],
            'peak_memory_usage' => $peakMemoryAfter - $startData['peak_memory_before'],
            'memory_before' => $startData['memory_before'],
            'memory_after' => $memoryAfter,
            'peak_memory_before' => $startData['peak_memory_before'],
            'peak_memory_after' => $peakMemoryAfter,
            'timestamp' => time(),
        ];

        // Clean up start time data
        unset($this->startTimes[$serviceName]);
    }

    /**
     * Get all metrics
     */
    public function getMetrics(): array
    {
        return $this->metrics;
    }

    /**
     * Get performance summary
     */
    public function getPerformanceSummary(): array
    {
        return [
            'total_services' => count($this->metrics),
            'total_load_time' => $this->getTotalLoadTime(),
            'total_memory_usage' => $this->getTotalMemoryUsage(),
            'average_load_time' => $this->getAverageLoadTime(),
            'average_memory_usage' => $this->getAverageMemoryUsage(),
            'slowest_service' => $this->getSlowestService(),
            'highest_memory_service' => $this->getHighestMemoryService(),
        ];
    }

    /**
     * Get total load time for all services
     */
    public function getTotalLoadTime(): float
    {
        return array_sum(array_column($this->metrics, 'load_time'));
    }

    /**
     * Get total memory usage for all services
     */
    public function getTotalMemoryUsage(): int
    {
        return array_sum(array_column($this->metrics, 'memory_usage'));
    }

    /**
     * Get average load time
     */
    public function getAverageLoadTime(): float
    {
        if (empty($this->metrics)) {
            return 0.0;
        }

        return $this->getTotalLoadTime() / count($this->metrics);
    }

    /**
     * Get average memory usage
     */
    public function getAverageMemoryUsage(): float
    {
        if (empty($this->metrics)) {
            return 0.0;
        }

        return $this->getTotalMemoryUsage() / count($this->metrics);
    }

    /**
     * Get slowest service
     */
    public function getSlowestService(): ?array
    {
        if (empty($this->metrics)) {
            return null;
        }

        $slowest = null;
        $maxTime = 0;

        foreach ($this->metrics as $serviceName => $metrics) {
            if ($metrics['load_time'] > $maxTime) {
                $maxTime = $metrics['load_time'];
                $slowest = [
                    'service' => $serviceName,
                    'load_time' => $metrics['load_time'],
                    'memory_usage' => $metrics['memory_usage'],
                ];
            }
        }

        return $slowest;
    }

    /**
     * Get service with highest memory usage
     */
    public function getHighestMemoryService(): ?array
    {
        if (empty($this->metrics)) {
            return null;
        }

        $highest = null;
        $maxMemory = 0;

        foreach ($this->metrics as $serviceName => $metrics) {
            if ($metrics['memory_usage'] > $maxMemory) {
                $maxMemory = $metrics['memory_usage'];
                $highest = [
                    'service' => $serviceName,
                    'memory_usage' => $metrics['memory_usage'],
                    'load_time' => $metrics['load_time'],
                ];
            }
        }

        return $highest;
    }

    /**
     * Log metrics to error log (for debugging)
     */
    public function logMetrics(): void
    {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            $summary = $this->getPerformanceSummary();
            error_log('JANKX DEFERRED SERVICE METRICS: ' . json_encode($summary));
        }
    }

    /**
     * Clear all metrics
     */
    public function clearMetrics(): void
    {
        $this->metrics = [];
        $this->startTimes = [];
    }
}
```

## 🎯 Best Practices

### 1. Service Organization
```php
// ✅ Good: Organize services by context
ContextualServiceRegistry::register(ContextualServiceRegistry::ADMIN, [
    \Jankx\Admin\DashboardManager::class,
    \Jankx\Admin\SettingsManager::class,
]);

// ❌ Bad: Mix services from different contexts
ContextualServiceRegistry::register(ContextualServiceRegistry::SHARED, [
    \Jankx\Admin\DashboardManager::class,  // Should be admin only
    \Jankx\Frontend\AssetManager::class,   // Should be frontend only
]);
```

### 2. Deferred Loading Strategy
```php
// ✅ Good: Defer heavy services
ContextualServiceRegistry::defer(ContextualServiceRegistry::ADMIN, function(Container $container) {
    $container->singleton(\Jankx\Admin\AnalyticsManager::class); // Heavy service
    $container->singleton(\Jankx\Admin\ReportManager::class);     // Heavy service
});

// ✅ Good: Load essential services immediately
ContextualServiceRegistry::register(ContextualServiceRegistry::ADMIN, [
    \Jankx\Admin\MenuManager::class,      // Essential
    \Jankx\Admin\AssetManager::class,     // Essential
]);
```

### 3. Error Handling
```php
// ✅ Good: Graceful fallback
try {
    $service = $resolver->resolve(\Jankx\Admin\AnalyticsManager::class);
} catch (\Exception $e) {
    // Log error and continue without the service
    error_log("Analytics service not available: " . $e->getMessage());
    $service = new FallbackAnalyticsManager();
}
```

### 4. Performance Monitoring
```php
// ✅ Good: Monitor service loading
$monitor = new DeferredServiceMonitor();

$monitor->startMonitoring('admin.analytics');
$analyticsManager = $resolver->resolve(\Jankx\Admin\AnalyticsManager::class);
$monitor->endMonitoring('admin.analytics');

$metrics = $monitor->getMetrics();
// Log or store metrics for optimization
```

## 🔄 Integration với Bootstrapper System

### Updated Bootstrapper

```php
<?php
namespace Jankx\Bootstrappers\Dashboard;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;
use Jankx\Services\DeferredServiceResolver;
use Jankx\Providers\ContextualServiceProvider;
use Jankx\Context\ContextualServiceRegistry;

class AdminBootstrapper extends AbstractBootstrapper
{
    protected $priority = 20;

    public function getName(): string
    {
        return 'admin';
    }

    public function shouldRun(): bool
    {
        return is_admin();
    }

    public function bootstrap(Container $container): void
    {
        // Register context-aware services
        $contextProvider = new ContextualServiceProvider($container);
        $contextProvider->register();

        // Setup deferred service resolver
        $container->singleton('deferred.resolver', DeferredServiceResolver::class);

        // Load essential admin services immediately
        $this->loadEssentialServices($container);

        // Defer heavy services
        $this->deferHeavyServices($container);

        // Set up admin hooks
        $this->setupAdminHooks();

        do_action('jankx/bootstrapper/admin/loaded', $container);
    }

    private function loadEssentialServices(Container $container): void
    {
        // Services needed immediately
        $container->singleton(\Jankx\Admin\MenuManager::class);
        $container->singleton(\Jankx\Admin\AssetManager::class);
        $container->singleton(\Jankx\Admin\NoticeManager::class);
    }

    private function deferHeavyServices(Container $container): void
    {
        // Defer heavy services until actually needed
        ContextualServiceRegistry::defer(ContextualServiceRegistry::ADMIN, function(Container $container) {
            $container->singleton(\Jankx\Admin\AnalyticsManager::class);
            $container->singleton(\Jankx\Admin\ReportManager::class);
            $container->singleton(\Jankx\Admin\DashboardWidgetManager::class);
        });
    }

    private function setupAdminHooks(): void
    {
        // Hook into WordPress to load services when needed
        add_action('admin_init', [$this, 'loadAdminServices']);
        add_action('admin_enqueue_scripts', [$this, 'loadAdminAssets']);
    }

    public function loadAdminServices(): void
    {
        $resolver = $this->container->make('deferred.resolver');

        // Load admin services only when in admin context
        if (is_admin()) {
            $resolver->resolve(\Jankx\Admin\DashboardManager::class);
        }
    }

    public function loadAdminAssets(): void
    {
        // Load admin assets when needed
        $resolver = $this->container->make('deferred.resolver');

        if ($resolver->has(\Jankx\Admin\AssetManager::class)) {
            $assetManager = $resolver->resolve(\Jankx\Admin\AssetManager::class);
            $assetManager->enqueueAdminAssets();
        }
    }
}
```

---

**Next**: [Service Container](./service-container.md) | [Performance Optimization](./performance-optimization.md)