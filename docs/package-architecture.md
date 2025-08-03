# Jankx Core Package Architecture

## Tổng quan

Jankx Core sẽ được tách thành một package riêng biệt (`jankx/core`) để có thể tái sử dụng cho nhiều WordPress themes khác nhau.

## Kiến trúc Package

### 1. Package Structure

```
jankx/core/
├── src/
│   ├── Config/
│   │   └── Repository.php
│   ├── Contracts/
│   │   └── ServiceProvider.php
│   ├── Facades/
│   │   ├── App.php
│   │   ├── Config.php
│   │   ├── Facade.php
│   │   └── Log.php
│   ├── Foundation/
│   │   ├── Application.php
│   │   ├── Bootstrap/
│   │   ├── Cli/
│   │   ├── Http/
│   │   └── Log/
│   ├── Helper/
│   │   └── Environment.php
│   ├── Http/
│   │   └── Request.php
│   └── Support/
│       └── Providers/
├── composer.json
├── README.md
└── LICENSE
```

### 2. Theme Integration

```
your-theme/
├── composer.json
├── functions.php
├── config/
│   ├── app.php
│   └── providers.php
├── includes/
│   ├── framework.php
│   ├── boot/
│   │   └── app.php
│   └── Jankx/
│       └── Support/
│           └── Providers/
└── vendor/
    └── jankx/
        └── core/
```

## Composer Integration

### 1. Package composer.json

```json
{
    "name": "jankx/core",
    "description": "WordPress theme framework with Laravel-style architecture",
    "type": "library",
    "license": "MIT",
    "authors": [
        {
            "name": "Puleeno Nguyen",
            "email": "team@jankx.com"
        }
    ],
    "require": {
        "php": "^7.4|^8.0",
        "illuminate/container": "^8.0|^9.0|^10.0"
    },
    "require-dev": {
        "phpunit/phpunit": "^9.0",
        "mockery/mockery": "^1.0"
    },
    "autoload": {
        "psr-4": {
            "Jankx\\": "src/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Jankx\\Tests\\": "tests/"
        }
    },
    "extra": {
        "branch-alias": {
            "dev-master": "2.0-dev"
        }
    },
    "minimum-stability": "dev",
    "prefer-stable": true
}
```

### 2. Theme composer.json

```json
{
    "name": "your-theme/theme-name",
    "description": "Your WordPress theme using Jankx Framework",
    "type": "wordpress-theme",
    "require": {
        "php": "^7.4|^8.0",
        "jankx/core": "^2.0"
    },
    "autoload": {
        "psr-4": {
            "YourTheme\\": "includes/"
        }
    }
}
```

## Framework Loading

### 1. Updated framework.php

```php
<?php

use Jankx\Http\Request as JankxRequest;
use App\Http\AdminAjaxKernel;
use App\Http\RestApiKernel;
use App\Http\DashboardKernel;
use App\Http\FrontendKernel;
use Jankx\Foundation\Cli\ConsoleDetector;
use App\Console\WpCronKernel;
use App\Console\WpCliKernel;
use Jankx\Helper\Environment;

/**
 * Jankx Framework Class
 *
 * This class handles the framework initialization and request routing
 * based on the type of request (HTTP or Console).
 */
class Jankx_Framework
{
    protected $app;
    protected $loaded = false;

    public function __construct()
    {
        $this->loadComposer();
    }

    public function setApp(&$app): self
    {
        $this->app = $app;
        return $this;
    }

    public function init()
    {
        // Handle console requests first
        if (Environment::isWpCli()) {
            $this->handleConsoleRequest();
            return;
        }

        if (Environment::isWpCron()) {
            $this->handleConsoleRequest();
            return;
        }

        // Handle HTTP requests
        $request = JankxRequest::capture();
        $requestType = $request->getRequestType();

        $this->handleHttpRequest();
    }

    public function handleHttpRequest()
    {
        $request = JankxRequest::capture();
        $requestType = $request->getRequestType();

        // Create appropriate kernel based on request type
        switch ($requestType) {
            case 'admin_ajax':
                $kernel = new AdminAjaxKernel($this->app);
                break;
            case 'rest_api':
                $kernel = new RestApiKernel($this->app);
                break;
            case 'dashboard':
                $kernel = new DashboardKernel($this->app);
                break;
            case 'frontend':
            default:
                $kernel = new FrontendKernel($this->app);
                break;
        }

        // Initialize the kernel with WordPress hooks
        try {
            $kernel->init($request);
        } catch (Exception $e) {
            if (Environment::isDebugLog()) {
                throw $e;
            }
            error_log('Jankx HTTP Error: ' . $e->getMessage());
        }
    }

    public function handleConsoleRequest($args = [])
    {
        $consoleType = ConsoleDetector::detect($args);

        switch ($consoleType) {
            case 'wp_cli':
                $kernel = new WpCliKernel($this->app);
                break;
            case 'wp_cron':
                $kernel = new WpCronKernel($this->app);
                break;
            default:
                return 1;
        }

        try {
            return $kernel->handle($args);
        } catch (Exception $e) {
            if (Environment::isDebugLog()) {
                throw $e;
            }
            error_log('Jankx Console Error: ' . $e->getMessage());
            return 1;
        }
    }

    protected function loadComposer()
    {
        $composerAutoload = dirname(__FILE__) . '/../vendor/autoload.php';
        if (file_exists($composerAutoload)) {
            require_once $composerAutoload;
            $this->loaded = true;
        }
    }

    public function getApp()
    {
        return $this->app;
    }

    public function isLoaded()
    {
        return $this->loaded;
    }
}

// Boot framework
$framework = new Jankx_Framework();
if (!$framework->isLoaded()) {
    error_log('[JANKX ERROR] Composer autoloader not loaded');
    return;
}

$app = require dirname(__FILE__) . '/boot/app.php';
$framework->setApp($app);
$framework->init();
```

### 2. Updated boot/app.php

```php
<?php

use Jankx\Foundation\Application;
use Jankx\Helper\Environment;

/**
 * Initialize Jankx Application
 *
 * This file initializes the Jankx application with Laravel-style architecture
 * for WordPress theme development.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get the Jankx application instance.
 *
 * @return \Jankx\Foundation\Application
 */
App::getFacadeRoot()
{
    static $app = null;

    if ($app === null) {
        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Initializing Jankx Application...');
        }

        $app = new Application(get_template_directory());

        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Jankx Application initialized successfully');
        }
    }

    return $app;
}

// Initialize the application
$app = \Jankx\Facades\App::getFacadeRoot();

// Return the application instance
return $app;
```

## Theme-Specific Extensions

### 1. Theme Service Providers

```php
<?php

namespace YourTheme\Support\Providers;

use Jankx\Support\Providers\ServiceProvider;
use Jankx\Foundation\Application;

class ThemeServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register theme-specific services
        $app->singleton('theme.assets', ThemeAssetsManager::class);
        $app->singleton('theme.menu', ThemeMenuManager::class);
        $app->singleton('theme.sidebar', ThemeSidebarManager::class);
    }

    public function boot(Application $app)
    {
        // Bootstrap theme-specific features
        $this->setupTheme();
        $this->registerAssets();
        $this->registerMenus();
        $this->registerSidebars();
    }

    protected function setupTheme()
    {
        add_action('after_setup_theme', function () {
            add_theme_support('post-thumbnails');
            add_theme_support('title-tag');
            add_theme_support('custom-logo');
        });
    }

    protected function registerAssets()
    {
        add_action('wp_enqueue_scripts', function () {
            wp_enqueue_style('theme-style', get_stylesheet_uri());
            wp_enqueue_script('theme-script', get_template_directory_uri() . '/assets/js/theme.js');
        });
    }

    protected function registerMenus()
    {
        add_action('init', function () {
            register_nav_menus([
                'primary' => 'Primary Menu',
                'footer' => 'Footer Menu',
            ]);
        });
    }

    protected function registerSidebars()
    {
        add_action('widgets_init', function () {
            register_sidebar([
                'name' => 'Main Sidebar',
                'id' => 'main-sidebar',
            ]);
        });
    }
}
```

### 2. Theme Configuration

```php
<?php
// config/app.php
return [
    'name' => 'Your Theme Name',
    'env' => defined('WP_DEBUG') && WP_DEBUG ? 'local' : 'production',
    'debug' => defined('WP_DEBUG') && WP_DEBUG,
    'url' => get_site_url(),
    'timezone' => get_option('timezone_string', 'UTC'),
    'locale' => get_locale(),
    'fallback_locale' => 'en',
    'key' => defined('AUTH_KEY') ? AUTH_KEY : 'base64:'.base64_encode(random_bytes(32)),
    'providers' => [
        // Core providers (from jankx/core)
    ],
    'aliases' => [
        'App' => Jankx\Facades\App::class,
        'Config' => Jankx\Facades\Config::class,
        'Log' => Jankx\Facades\Log::class,
    ],
];
```

```php
<?php
// config/providers.php
return [
    'http' => [
        'frontend' => [
            YourTheme\Support\Providers\ThemeServiceProvider::class,
        ],
        'admin' => [
            YourTheme\Support\Providers\AdminServiceProvider::class,
        ],
        'rest_api' => [
            YourTheme\Support\Providers\RestApiServiceProvider::class,
        ],
        'admin_ajax' => [
            YourTheme\Support\Providers\AdminAjaxServiceProvider::class,
        ],
    ],
    'console' => [
        'wp_cli' => [
            YourTheme\Support\Providers\WpCliServiceProvider::class,
        ],
        'wp_cron' => [
            YourTheme\Support\Providers\WpCronServiceProvider::class,
        ],
    ],
    'global' => [
        // Global service providers
    ],
];
```

## Benefits of Package Architecture

### 1. Reusability

- Core framework có thể được sử dụng cho nhiều themes
- Consistent architecture across projects
- Shared functionality và best practices

### 2. Maintainability

- Core updates được manage centrally
- Bug fixes và security patches được apply cho tất cả themes
- Version control cho core framework

### 3. Development Efficiency

- Faster theme development với pre-built framework
- Consistent development patterns
- Shared tooling và documentation

### 4. Quality Assurance

- Centralized testing cho core functionality
- Consistent code quality standards
- Automated CI/CD cho core package

## Migration Strategy

### 1. Phase 1: Package Creation

1. Extract core classes vào separate package
2. Create composer.json cho package
3. Setup autoloading và namespaces
4. Create package documentation

### 2. Phase 2: Theme Integration

1. Update theme composer.json
2. Update theme autoloading
3. Test integration với package
4. Update theme documentation

### 3. Phase 3: Distribution

1. Publish package to Packagist
2. Create installation guide
3. Provide migration guide
4. Setup support channels

## Package Versioning

### 1. Semantic Versioning

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### 2. Version Constraints

```json
{
    "require": {
        "jankx/core": "^2.0"
    }
}
```

- `^2.0`: Allow 2.0.0 to 2.9.9
- `~2.0`: Allow 2.0.0 to 2.0.9
- `>=2.0`: Allow 2.0.0 and above

## Future Considerations

### 1. Plugin Support

- Core framework có thể được extend cho plugins
- Shared functionality giữa themes và plugins
- Consistent architecture across WordPress ecosystem

### 2. Ecosystem Development

- Additional packages (jankx/blocks, jankx/admin, etc.)
- Community contributions
- Third-party integrations

### 3. Performance Optimization

- Lazy loading improvements
- Caching strategies
- Memory optimization

### 4. Developer Experience

- IDE support và autocompletion
- Debugging tools
- Development utilities

## Conclusion

Tách Jankx Core thành package riêng sẽ tạo ra một ecosystem mạnh mẽ cho WordPress theme development, với khả năng tái sử dụng cao và maintainability tốt hơn.