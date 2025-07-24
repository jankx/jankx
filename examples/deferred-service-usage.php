<?php
/**
 * Deferred Service Context Usage Examples
 *
 * This file demonstrates how to use the Deferred Service Context pattern
 * in Jankx 2.0 for optimal performance and resource management.
 */

// Example 1: Basic Service Registration
use Jankx\Context\ContextualServiceRegistry;
use Jankx\Facades\DeferredService;

// Register services for different contexts
ContextualServiceRegistry::register(ContextualServiceRegistry::ADMIN, [
    \Jankx\Admin\DashboardManager::class,
    \Jankx\Admin\SettingsManager::class,
    \Jankx\Admin\MenuManager::class,
]);

ContextualServiceRegistry::register(ContextualServiceRegistry::FRONTEND, [
    \Jankx\Frontend\AssetManager::class,
    \Jankx\Frontend\TemplateManager::class,
    \Jankx\SEO\SEOManager::class,
]);

// Defer heavy services
ContextualServiceRegistry::defer(ContextualServiceRegistry::ADMIN, function($container) {
    $container->singleton(\Jankx\Admin\AnalyticsManager::class);
    $container->singleton(\Jankx\Admin\ReportManager::class);
});

// Example 2: Service Resolution
class AdminController
{
    public function dashboard()
    {
        // Services will be loaded only when accessed
        $dashboardManager = DeferredService::resolve(\Jankx\Admin\DashboardManager::class);
        $settingsManager = DeferredService::resolve(\Jankx\Admin\SettingsManager::class);

        // Check if service is available
        if (DeferredService::has(\Jankx\Admin\AnalyticsManager::class)) {
            $analyticsManager = DeferredService::resolve(\Jankx\Admin\AnalyticsManager::class);
            $analyticsManager->trackPageView();
        }

        return $dashboardManager->render();
    }
}

// Example 3: Context-Aware Service Loading
class FrontendController
{
    public function render()
    {
        // Get current context
        $context = DeferredService::getCurrentContext();

        if ($context === ContextualServiceRegistry::FRONTEND) {
            $templateManager = DeferredService::resolve(\Jankx\Frontend\TemplateManager::class);
            $seoManager = DeferredService::resolve(\Jankx\SEO\SEOManager::class);

            return $templateManager->render('home', [
                'seo' => $seoManager->getMetaTags()
            ]);
        }

        return 'Context not supported';
    }
}

// Example 4: Performance Monitoring
class PerformanceMonitor
{
    public function monitorServiceLoading()
    {
        // Start monitoring
        $startTime = microtime(true);
        $startMemory = memory_get_usage(true);

        // Load services
        $dashboardManager = DeferredService::resolve(\Jankx\Admin\DashboardManager::class);
        $analyticsManager = DeferredService::resolve(\Jankx\Admin\AnalyticsManager::class);

        // Get performance metrics
        $metrics = DeferredService::getPerformanceMetrics();

        // Log metrics if debugging is enabled
        if (defined('WP_DEBUG') && WP_DEBUG) {
            DeferredService::logMetrics();
        }

        return [
            'load_time' => microtime(true) - $startTime,
            'memory_usage' => memory_get_usage(true) - $startMemory,
            'metrics' => $metrics
        ];
    }
}

// Example 5: Service Registration in Bootstrapper
class CustomBootstrapper extends \Jankx\Bootstrappers\AbstractBootstrapper
{
    protected $priority = 25;

    public function getName(): string
    {
        return 'custom';
    }

    public function shouldRun(): bool
    {
        return true; // Always run for this example
    }

    public function bootstrap(\Illuminate\Container\Container $container): void
    {
        // Register context-aware services
        $contextProvider = new \Jankx\Providers\ContextualServiceProvider($container);
        $contextProvider->register();

        // Setup deferred service resolver
        $container->singleton('deferred.resolver', \Jankx\Services\DeferredServiceResolver::class);

        // Load essential services immediately
        $this->loadEssentialServices($container);

        // Defer heavy services
        $this->deferHeavyServices($container);
    }

    private function loadEssentialServices($container): void
    {
        // Services needed immediately
        $container->singleton(\Jankx\Custom\EssentialService::class);
    }

    private function deferHeavyServices($container): void
    {
        // Defer heavy services until actually needed
        ContextualServiceRegistry::defer(ContextualServiceRegistry::ADMIN, function($container) {
            $container->singleton(\Jankx\Custom\HeavyService::class);
        });
    }
}

// Example 6: Error Handling
class SafeServiceLoader
{
    public function loadService(string $serviceName)
    {
        try {
            $service = DeferredService::resolve($serviceName);
            return $service;
        } catch (\Exception $e) {
            // Log error and provide fallback
            error_log("Failed to load service: {$serviceName} - " . $e->getMessage());

            // Return fallback service
            return new FallbackService();
        }
    }
}

// Example 7: Service Statistics
class ServiceStatistics
{
    public function getStats()
    {
        return [
            'current_context' => DeferredService::getCurrentContext(),
            'resolved_services' => DeferredService::getResolvedServices(),
            'registry_stats' => DeferredService::getRegistryStats(),
            'performance_metrics' => DeferredService::getPerformanceMetrics(),
        ];
    }
}

// Example 8: Cache Management
class CacheManager
{
    public function clearServiceCache()
    {
        DeferredService::clearCache();

        // Also clear WordPress object cache if available
        if (function_exists('wp_cache_flush')) {
            wp_cache_flush();
        }
    }
}

// Example 9: Conditional Service Loading
class ConditionalServiceLoader
{
    public function loadServicesBasedOnUserRole()
    {
        $user = wp_get_current_user();

        if (user_can($user, 'manage_options')) {
            // Load admin services for administrators
            $adminService = DeferredService::resolve(\Jankx\Admin\AdminManager::class);
            $adminService->initialize();
        } else {
            // Load frontend services for regular users
            $frontendService = DeferredService::resolve(\Jankx\Frontend\TemplateManager::class);
            $frontendService->render();
        }
    }
}

// Example 10: Plugin Integration
class PluginServiceLoader
{
    public function loadPluginServices()
    {
        // Check if WooCommerce is active
        if (class_exists('WooCommerce')) {
            $wooService = DeferredService::resolve(\Jankx\WooCommerce\WooCommerceManager::class);
            $wooService->initialize();
        }

        // Check if Gutenberg is active
        if (function_exists('register_block_type')) {
            $gutenbergService = DeferredService::resolve(\Jankx\Gutenberg\EditorManager::class);
            $gutenbergService->registerBlocks();
        }
    }
}

// Usage in WordPress hooks
add_action('init', function() {
    // Example: Load services based on current page
    if (is_admin()) {
        $adminService = DeferredService::resolve(\Jankx\Admin\AdminManager::class);
        $adminService->initialize();
    } else {
        $frontendService = DeferredService::resolve(\Jankx\Frontend\TemplateManager::class);
        $frontendService->setup();
    }
});

add_action('wp_footer', function() {
    // Log performance metrics at the end of the page
    if (defined('WP_DEBUG') && WP_DEBUG) {
        DeferredService::logMetrics();
    }
});