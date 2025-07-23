# Bootstrapping Flow

> **Framework Initialization & Service Loading**

Jankx 2.0 sử dụng bootstrapping flow hiện đại để khởi tạo framework, load services và setup environment.

## 🔄 Bootstrapping Architecture

### Flow Diagram
```
┌─────────────────────────────────────┐
│         WordPress Load              │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Theme     │  │  functions  │  │
│  │  Loading    │  │   .php      │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Framework Bootstrap         │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Jankx     │  │  Kernel     │  │
│  │ Bootstrap   │  │  Init       │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Service Registration        │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Service   │  │  Provider   │  │
│  │  Container  │  │  Loading    │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Bootstrappers               │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Admin     │  │  Frontend   │  │
│  │Bootstrap    │  │Bootstrap    │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

## 🔧 Bootstrapping Implementation

### WordPress Entry Point
```php
<?php
// functions.php
require_once get_template_directory() . '/includes/framework.php';

// Initialize Jankx framework
Jankx::getInstance()->bootstrap();
```

### Framework Bootstrap
```php
<?php
// framework.php
namespace Jankx;

class Jankx
{
    private static $instance = null;
    private $kernel;
    private $container;
    private $booted = false;

    private function __construct()
    {
        // Private constructor for singleton
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function bootstrap(): void
    {
        if ($this->booted) {
            return;
        }

        // 1. Initialize kernel
        $this->initializeKernel();

        // 2. Register core services
        $this->registerCoreServices();

        // 3. Run bootstrappers
        $this->runBootstrappers();

        // 4. Setup WordPress hooks
        $this->setupWordPressHooks();

        $this->booted = true;
    }

    private function initializeKernel(): void
    {
        $this->kernel = new Kernel();
        $this->container = $this->kernel->getContainer();
    }

    private function registerCoreServices(): void
    {
        $this->container->singleton(\Jankx\Config\ConfigManager::class);
        $this->container->singleton(\Jankx\Assets\AssetManager::class);
        $this->container->singleton(\Jankx\Security\SecurityManager::class);
        $this->container->singleton(\Jankx\Performance\PerformanceMonitor::class);
    }

    private function runBootstrappers(): void
    {
        $this->kernel->bootstrap();
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

## 🔄 Bootstrapper Classes

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

        // Initialize performance monitor
        $performanceMonitor = $this->container->make(\Jankx\Performance\PerformanceMonitor::class);
        $performanceMonitor->initialize();
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

        // Gutenberg
        add_action('init', [$this, 'registerGutenbergBlocks']);
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

        // Add image sizes
        add_image_size('jankx-hero', 1920, 1080, true);
        add_image_size('jankx-thumbnail', 400, 300, true);
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

    public function registerGutenbergBlocks(): void
    {
        $blockRegistry = $this->container->make(\Jankx\Gutenberg\BlockRegistry::class);
        $blockRegistry->registerBlocks();
    }
}
```

### Admin Bootstrapper
```php
<?php
namespace Jankx\Bootstrap;

use Jankx\Container\ServiceContainer;

class AdminBootstrapper
{
    private $container;

    public function __construct(ServiceContainer $container)
    {
        $this->container = $container;
    }

    public function bootstrap(): void
    {
        // Initialize admin-specific services
        $this->initializeAdminServices();

        // Set up admin hooks
        $this->setupAdminHooks();

        // Initialize admin menu
        $this->setupAdminMenu();

        // Initialize admin scripts
        $this->setupAdminScripts();
    }

    private function initializeAdminServices(): void
    {
        // Initialize admin manager
        $adminManager = $this->container->make(\Jankx\Admin\AdminManager::class);
        $adminManager->initialize();

        // Initialize settings manager
        $settingsManager = $this->container->make(\Jankx\Admin\SettingsManager::class);
        $settingsManager->initialize();
    }

    private function setupAdminHooks(): void
    {
        // Admin menu
        add_action('admin_menu', [$this, 'setupAdminMenu']);

        // Admin scripts
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminScripts']);

        // Admin styles
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminStyles']);

        // Admin notices
        add_action('admin_notices', [$this, 'displayAdminNotices']);
    }

    public function setupAdminMenu(): void
    {
        add_menu_page(
            'Jankx Settings',
            'Jankx',
            'manage_options',
            'jankx-settings',
            [$this, 'renderSettingsPage'],
            'dashicons-admin-generic',
            30
        );

        add_submenu_page(
            'jankx-settings',
            'General Settings',
            'General',
            'manage_options',
            'jankx-settings',
            [$this, 'renderSettingsPage']
        );

        add_submenu_page(
            'jankx-settings',
            'Performance',
            'Performance',
            'manage_options',
            'jankx-performance',
            [$this, 'renderPerformancePage']
        );

        add_submenu_page(
            'jankx-settings',
            'Security',
            'Security',
            'manage_options',
            'jankx-security',
            [$this, 'renderSecurityPage']
        );
    }

    public function enqueueAdminScripts(): void
    {
        $assetManager = $this->container->make(\Jankx\Assets\AssetManager::class);
        $assetManager->enqueueAdminScripts();
    }

    public function enqueueAdminStyles(): void
    {
        $assetManager = $this->container->make(\Jankx\Assets\AssetManager::class);
        $assetManager->enqueueAdminStyles();
    }

    public function displayAdminNotices(): void
    {
        $noticeManager = $this->container->make(\Jankx\Admin\NoticeManager::class);
        $noticeManager->displayNotices();
    }

    public function renderSettingsPage(): void
    {
        $settingsManager = $this->container->make(\Jankx\Admin\SettingsManager::class);
        $settingsManager->renderSettingsPage();
    }

    public function renderPerformancePage(): void
    {
        $performanceManager = $this->container->make(\Jankx\Performance\PerformanceManager::class);
        $performanceManager->renderPerformancePage();
    }

    public function renderSecurityPage(): void
    {
        $securityManager = $this->container->make(\Jankx\Security\SecurityManager::class);
        $securityManager->renderSecurityPage();
    }
}
```

### Frontend Bootstrapper
```php
<?php
namespace Jankx\Bootstrap;

use Jankx\Container\ServiceContainer;

class FrontendBootstrapper
{
    private $container;

    public function __construct(ServiceContainer $container)
    {
        $this->container = $container;
    }

    public function bootstrap(): void
    {
        // Initialize frontend-specific services
        $this->initializeFrontendServices();

        // Set up frontend hooks
        $this->setupFrontendHooks();

        // Initialize template system
        $this->setupTemplateSystem();

        // Initialize performance optimization
        $this->setupPerformanceOptimization();
    }

    private function initializeFrontendServices(): void
    {
        // Initialize template renderer
        $templateRenderer = $this->container->make(\Jankx\Template\TemplateRenderer::class);
        $templateRenderer->initialize();

        // Initialize SEO manager
        $seoManager = $this->container->make(\Jankx\SEO\SEOManager::class);
        $seoManager->initialize();

        // Initialize analytics
        $analyticsManager = $this->container->make(\Jankx\Analytics\AnalyticsManager::class);
        $analyticsManager->initialize();
    }

    private function setupFrontendHooks(): void
    {
        // Enqueue scripts and styles
        add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
        add_action('wp_enqueue_scripts', [$this, 'enqueueStyles']);

        // Template hooks
        add_action('wp_head', [$this, 'addHeadMeta']);
        add_action('wp_footer', [$this, 'addFooterScripts']);

        // Content hooks
        add_filter('the_content', [$this, 'filterContent']);
        add_filter('excerpt_more', [$this, 'filterExcerptMore']);

        // Performance hooks
        add_action('wp_head', [$this, 'addPerformanceMeta']);
        add_action('wp_footer', [$this, 'addPerformanceScripts']);
    }

    public function enqueueScripts(): void
    {
        $assetManager = $this->container->make(\Jankx\Assets\AssetManager::class);
        $assetManager->enqueueFrontendScripts();
    }

    public function enqueueStyles(): void
    {
        $assetManager = $this->container->make(\Jankx\Assets\AssetManager::class);
        $assetManager->enqueueFrontendStyles();
    }

    public function addHeadMeta(): void
    {
        $seoManager = $this->container->make(\Jankx\SEO\SEOManager::class);
        $seoManager->addHeadMeta();
    }

    public function addFooterScripts(): void
    {
        $analyticsManager = $this->container->make(\Jankx\Analytics\AnalyticsManager::class);
        $analyticsManager->addFooterScripts();
    }

    public function filterContent(string $content): string
    {
        $contentManager = $this->container->make(\Jankx\Content\ContentManager::class);
        return $contentManager->filterContent($content);
    }

    public function filterExcerptMore(string $more): string
    {
        $contentManager = $this->container->make(\Jankx\Content\ContentManager::class);
        return $contentManager->filterExcerptMore($more);
    }

    public function addPerformanceMeta(): void
    {
        $performanceManager = $this->container->make(\Jankx\Performance\PerformanceManager::class);
        $performanceManager->addPerformanceMeta();
    }

    public function addPerformanceScripts(): void
    {
        $performanceManager = $this->container->make(\Jankx\Performance\PerformanceManager::class);
        $performanceManager->addPerformanceScripts();
    }
}
```

## 🔄 Bootstrapping Flow

### Execution Order
```php
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

### Environment Detection
```php
class EnvironmentDetector
{
    public function isDevelopment(): bool
    {
        return defined('WP_DEBUG') && WP_DEBUG;
    }

    public function isProduction(): bool
    {
        return !$this->isDevelopment();
    }

    public function isAdmin(): bool
    {
        return is_admin();
    }

    public function isFrontend(): bool
    {
        return !is_admin();
    }

    public function isAJAX(): bool
    {
        return wp_doing_ajax();
    }

    public function isREST(): bool
    {
        return defined('REST_REQUEST') && REST_REQUEST;
    }

    public function getEnvironment(): string
    {
        if ($this->isDevelopment()) {
            return 'development';
        }

        return 'production';
    }
}
```

## 📊 Bootstrapping Monitoring

### Performance Monitoring
```php
class BootstrapPerformanceMonitor
{
    private $startTimes = [];
    private $metrics = [];

    public function startMonitoring(string $phase): void
    {
        $this->startTimes[$phase] = microtime(true);
    }

    public function endMonitoring(string $phase): void
    {
        if (isset($this->startTimes[$phase])) {
            $time = microtime(true) - $this->startTimes[$phase];
            $this->metrics[$phase] = $time;
        }
    }

    public function getMetrics(): array
    {
        return $this->metrics;
    }

    public function getTotalTime(): float
    {
        return array_sum($this->metrics);
    }

    public function logMetrics(): void
    {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('JANKX BOOTSTRAP METRICS: ' . json_encode($this->metrics));
        }
    }
}
```

### Error Handling
```php
class BootstrapErrorHandler
{
    public function handleBootstrapError(\Throwable $exception): void
    {
        $error = [
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString(),
            'timestamp' => current_time('mysql')
        ];

        error_log('JANKX BOOTSTRAP ERROR: ' . json_encode($error));

        if (defined('WP_DEBUG') && WP_DEBUG) {
            throw $exception;
        }
    }
}
```

---

**Next**: [Layout System](./layout-system.md) | [Frontend Rendering](./frontend-rendering.md)