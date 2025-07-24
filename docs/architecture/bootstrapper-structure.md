# Bootstrapper Structure

> **Cấu trúc Bootstrapper sau khi Refactor**

Jankx 2.0 sử dụng hệ thống bootstrapper có cấu trúc rõ ràng với namespace được tổ chức theo chức năng.

## 📁 Cấu trúc Thư mục

```
includes/Jankx/Bootstrappers/
├── AbstractBootstrapper.php          # Base class cho tất cả bootstrapper
├── API/
│   └── APIBootstrapper.php          # API context bootstrapper
├── CLI/
│   └── CLIBootstrapper.php          # CLI context bootstrapper
├── Dashboard/
│   └── AdminBootstrapper.php        # Admin dashboard bootstrapper
├── Frontend/
│   ├── FrontendBootstrapper.php     # Frontend bootstrapper
│   └── WooCommerceBootstrapper.php  # WooCommerce bootstrapper
├── Global/
│   ├── CoreBootstrapper.php         # Core system bootstrapper
│   └── ThemeBootstrapper.php        # Theme setup bootstrapper
└── Gutenberg/
    ├── GutenbergBootstrapper.php    # Gutenberg editor bootstrapper
    ├── GutenbergAjaxBootstrapper.php # Gutenberg AJAX bootstrapper
    └── GutenbergFrontendBootstrapper.php # Gutenberg frontend bootstrapper
```

## 🔧 Namespace Structure

### Base Namespace
```php
namespace Jankx\Bootstrappers;
```

### Sub-namespaces theo Context
```php
// API Context
namespace Jankx\Bootstrappers\API;

// CLI Context
namespace Jankx\Bootstrappers\CLI;

// Dashboard Context
namespace Jankx\Bootstrappers\Dashboard;

// Frontend Context
namespace Jankx\Bootstrappers\Frontend;

// Global Context
namespace Jankx\Bootstrappers\Global;

// Gutenberg Context
namespace Jankx\Bootstrappers\Gutenberg;
```

## 🎯 Bootstrapper Classes

### AbstractBootstrapper
```php
<?php
namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;
use Jankx\Contracts\BootstrapperInterface;

abstract class AbstractBootstrapper implements BootstrapperInterface
{
    /**
     * @var int
     */
    protected $priority = 10;

    /**
     * @var array
     */
    protected $dependencies = [];

    /**
     * Get bootstrapper priority
     */
    public function getPriority(): int
    {
        return $this->priority;
    }

    /**
     * Get bootstrapper dependencies
     */
    public function getDependencies(): array
    {
        return $this->dependencies;
    }

    /**
     * Get bootstrapper name (must be implemented by child)
     */
    abstract public function getName(): string;

    /**
     * Check if bootstrapper should run (must be implemented by child)
     */
    abstract public function shouldRun(): bool;

    /**
     * Bootstrap the application (must be implemented by child)
     */
    abstract public function bootstrap(Container $container): void;
}
```

### Core Bootstrapper (Global)
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

        // Setup WordPress hooks
        $this->setupWordPressHooks();
    }
}
```

### Theme Bootstrapper (Global)
```php
<?php
namespace Jankx\Bootstrappers\Global;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

class ThemeBootstrapper extends AbstractBootstrapper
{
    protected $priority = 10;

    public function getName(): string
    {
        return 'theme';
    }

    public function shouldRun(): bool
    {
        return true; // Always runs
    }

    public function bootstrap(Container $container): void
    {
        add_action('after_setup_theme', [$this, 'setupTheme']);
        add_action('init', [$this, 'initializeThemeFeatures']);
    }
}
```

### Admin Bootstrapper (Dashboard)
```php
<?php
namespace Jankx\Bootstrappers\Dashboard;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

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
        // Initialize admin-specific services
        $this->initializeAdminServices($container);

        // Setup admin hooks
        $this->setupAdminHooks();
    }
}
```

### Frontend Bootstrapper (Frontend)
```php
<?php
namespace Jankx\Bootstrappers\Frontend;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

class FrontendBootstrapper extends AbstractBootstrapper
{
    protected $priority = 15;

    public function getName(): string
    {
        return 'frontend';
    }

    public function shouldRun(): bool
    {
        return !is_admin() && !wp_doing_ajax() && !wp_doing_cron();
    }

    public function bootstrap(Container $container): void
    {
        // Initialize frontend-specific services
        $this->initializeFrontendServices($container);

        // Setup frontend hooks
        $this->setupFrontendHooks();
    }
}
```

### WooCommerce Bootstrapper (Frontend)
```php
<?php
namespace Jankx\Bootstrappers\Frontend;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

class WooCommerceBootstrapper extends AbstractBootstrapper
{
    protected $priority = 40;

    public function getName(): string
    {
        return 'woocommerce';
    }

    public function shouldRun(): bool
    {
        return class_exists('WooCommerce');
    }

    public function bootstrap(Container $container): void
    {
        // Initialize WooCommerce-specific services
        $this->initializeWooCommerceServices($container);

        // Setup WooCommerce hooks
        $this->setupWooCommerceHooks();
    }
}
```

### API Bootstrapper (API)
```php
<?php
namespace Jankx\Bootstrappers\API;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

class APIBootstrapper extends AbstractBootstrapper
{
    protected $priority = 25;

    public function getName(): string
    {
        return 'api';
    }

    public function shouldRun(): bool
    {
        return defined('REST_REQUEST') && REST_REQUEST;
    }

    public function bootstrap(Container $container): void
    {
        // Initialize API-specific services
        $this->initializeAPIServices($container);

        // Setup API hooks
        $this->setupAPIHooks();
    }
}
```

### CLI Bootstrapper (CLI)
```php
<?php
namespace Jankx\Bootstrappers\CLI;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

class CLIBootstrapper extends AbstractBootstrapper
{
    protected $priority = 30;

    public function getName(): string
    {
        return 'cli';
    }

    public function shouldRun(): bool
    {
        return defined('WP_CLI') && WP_CLI;
    }

    public function bootstrap(Container $container): void
    {
        // Initialize CLI-specific services
        $this->initializeCLIServices($container);

        // Setup CLI commands
        $this->setupCLICommands();
    }
}
```

### Gutenberg Bootstrappers (Gutenberg)

#### GutenbergBootstrapper
```php
<?php
namespace Jankx\Bootstrappers\Gutenberg;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

class GutenbergBootstrapper extends AbstractBootstrapper
{
    protected $priority = 10;

    public function getName(): string
    {
        return 'gutenberg';
    }

    public function shouldRun(): bool
    {
        return function_exists('register_block_type') && is_admin();
    }

    public function bootstrap(Container $container): void
    {
        // Initialize Gutenberg Block Registry
        BlockRegistry::boot();

        // Register block categories
        $this->registerBlockCategories();
    }
}
```

#### GutenbergAjaxBootstrapper
```php
<?php
namespace Jankx\Bootstrappers\Gutenberg;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

class GutenbergAjaxBootstrapper extends AbstractBootstrapper
{
    protected $priority = 5;

    public function getName(): string
    {
        return 'gutenberg-ajax';
    }

    public function shouldRun(): bool
    {
        return wp_doing_ajax() &&
               (isset($_POST['action']) || isset($_GET['action'])) &&
               (strpos($_POST['action'] ?? $_GET['action'] ?? '', 'jankx_gutenberg') === 0);
    }

    public function bootstrap(Container $container): void
    {
        // Initialize AJAX Handler
        AjaxHandler::init();

        // Register AJAX hooks for Gutenberg
        $this->registerAjaxHooks();
    }
}
```

#### GutenbergFrontendBootstrapper
```php
<?php
namespace Jankx\Bootstrappers\Gutenberg;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

class GutenbergFrontendBootstrapper extends AbstractBootstrapper
{
    protected $priority = 15;

    public function getName(): string
    {
        return 'gutenberg-frontend';
    }

    public function shouldRun(): bool
    {
        return !is_admin() && !wp_doing_ajax() && !wp_doing_cron();
    }

    public function bootstrap(Container $container): void
    {
        // Parse and register used blocks
        $this->parseAndRegisterUsedBlocks();

        // Initialize partial hydration
        $this->initializePartialHydration();

        // Enqueue frontend assets
        $this->enqueueFrontendAssets();
    }
}
```

## 🚀 Execution Order

### Priority Levels
1. **Priority 5**: CoreBootstrapper, GutenbergAjaxBootstrapper
2. **Priority 10**: ThemeBootstrapper, GutenbergBootstrapper
3. **Priority 15**: FrontendBootstrapper, GutenbergFrontendBootstrapper
4. **Priority 20**: AdminBootstrapper
5. **Priority 25**: APIBootstrapper
6. **Priority 30**: CLIBootstrapper
7. **Priority 40**: WooCommerceBootstrapper

### Context Detection
```php
// Global Context (always runs)
CoreBootstrapper::shouldRun() => true
ThemeBootstrapper::shouldRun() => true

// Admin Context
AdminBootstrapper::shouldRun() => is_admin()

// Frontend Context
FrontendBootstrapper::shouldRun() => !is_admin() && !wp_doing_ajax() && !wp_doing_cron()
WooCommerceBootstrapper::shouldRun() => class_exists('WooCommerce')

// API Context
APIBootstrapper::shouldRun() => defined('REST_REQUEST') && REST_REQUEST

// CLI Context
CLIBootstrapper::shouldRun() => defined('WP_CLI') && WP_CLI

// Gutenberg Context
GutenbergBootstrapper::shouldRun() => function_exists('register_block_type') && is_admin()
GutenbergAjaxBootstrapper::shouldRun() => wp_doing_ajax() && jankx_gutenberg action
GutenbergFrontendBootstrapper::shouldRun() => !is_admin() && !wp_doing_ajax() && !wp_doing_cron()
```

## 🔄 Integration với Kernel System

### Kernel Registration
```php
// AdminKernel.php
protected function registerBootstrappers(): void
{
    $this->addBootstrapper(ThemeBootstrapper::class);
    $this->addBootstrapper(AdminBootstrapper::class);

    // Gutenberg bootstrapper (only when in Gutenberg editor)
    if ($this->isGutenbergEditor()) {
        $this->addBootstrapper(GutenbergBootstrapper::class);
    }
}

// FrontendKernel.php
protected function registerBootstrappers(): void
{
    $this->addBootstrapper(ThemeBootstrapper::class);
    $this->addBootstrapper(GutenbergFrontendBootstrapper::class);
    $this->addBootstrapper(FrontendBootstrapper::class);

    // WooCommerce bootstrapper (if WooCommerce is active)
    if (class_exists('WooCommerce')) {
        $this->addBootstrapper(WooCommerceBootstrapper::class);
    }
}
```

## 📋 Best Practices

### 1. Namespace Organization
- Sử dụng namespace theo chức năng
- Tách biệt rõ ràng giữa các context
- Dễ dàng mở rộng và maintain

### 2. Priority Management
- Core bootstrapper có priority cao nhất (5)
- Context-specific bootstrapper có priority phù hợp
- WooCommerce có priority thấp nhất (40) vì là optional

### 3. Context Detection
- Sử dụng WordPress constants và functions
- Kiểm tra điều kiện chính xác
- Tránh conflict giữa các context

### 4. Service Container Integration
- Sử dụng Illuminate Container
- Dependency injection pattern
- Lazy loading services

### 5. Error Handling
- Graceful degradation
- Logging errors
- Fallback mechanisms

## 🔧 Migration Guide

### Từ cấu trúc cũ
```php
// Old structure
namespace Jankx\Bootstrap;
class CoreBootstrapper { ... }

// New structure
namespace Jankx\Bootstrappers\Global;
class CoreBootstrapper extends AbstractBootstrapper { ... }
```

### Cập nhật Kernel
```php
// Old
use Jankx\Bootstrappers\System\CoreBootstrapper;

// New
use Jankx\Bootstrappers\Global\CoreBootstrapper;
```

### Cập nhật Service Registration
```php
// Old
$container->make(CoreBootstrapper::class);

// New
$container->make(\Jankx\Bootstrappers\Global\CoreBootstrapper::class);
```

---

**Next**: [Kernel System](./kernel-system.md) | [Service Container](./service-container.md)