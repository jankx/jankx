# Jankx Framework Architecture

## 🏗️ Tổng quan kiến trúc

Jankx Framework được xây dựng theo mô hình Laravel-style với các thành phần chính:

### Core Components

1. **Application Container** - Quản lý dependency injection và service registration
2. **Service Providers** - Modular hóa các tính năng framework
3. **Facades** - Cung cấp interface "static" cho các services
4. **Kernels** - Xử lý các loại request khác nhau
5. **Bootstrap Process** - Khởi tạo framework theo thứ tự
6. **Configuration System** - Quản lý cấu hình với cache system
7. **Gutenberg Blocks System** - Quản lý custom blocks với repository pattern

## 📁 Cấu trúc thư mục

```
bookix/
├── config/                     # Configuration files
│   ├── app.php                # Global providers & aliases
│   ├── providers.php          # Context-specific providers
│   ├── error.php              # Error suppression settings
│   └── layout.php             # Layout management config
├── resources/                  # Frontend resources
│   ├── assets/                # CSS, JS, images
│   │   ├── css/
│   │   └── js/
│   └── blocks/                # Gutenberg blocks
│       └── widget-renderer/   # Custom block example
│           ├── block.json     # Block configuration
│           ├── index.js       # Editor logic
│           └── style.css      # Block styles
├── includes/Jankx/
│   ├── Config/                # Configuration management
│   │   └── Repository.php
│   ├── Contracts/             # Service contracts
│   │   └── ServiceProvider.php
│   ├── Facades/               # Facade classes
│   │   ├── App.php
│   │   ├── Config.php
│   │   ├── Log.php
│   │   ├── User.php
│   │   ├── Cache.php
│   │   ├── Asset.php
│   │   ├── Menu.php
│   │   ├── Sidebar.php
│   │   └── Footer.php
│   ├── Foundation/            # Core framework
│   │   ├── Application.php
│   │   ├── Bootstrap/         # Bootstrap process
│   │   │   ├── LoadConfiguration.php
│   │   │   ├── ThemeDataLoader.php
│   │   │   ├── HandleExceptions.php
│   │   │   ├── RegisterLogger.php
│   │   │   ├── RegisterFacades.php
│   │   │   ├── RegisterProviders.php
│   │   │   └── BootProviders.php
│   │   ├── Cli/              # Console kernels
│   │   │   ├── Kernel.php
│   │   │   └── Kernels/
│   │   │       ├── WpCliKernel.php
│   │   │       └── WpCronKernel.php
│   │   └── Http/             # HTTP kernels
│   │       ├── Kernel.php
│   │       └── Kernels/
│   │           ├── FrontendKernel.php
│   │           ├── DashboardKernel.php
│   │           ├── RestApiKernel.php
│   │           └── AdminAjaxKernel.php
│   ├── Support/               # Support classes
│   │   ├── Providers/        # Service providers
│   │   │   ├── ServiceProvider.php
│   │   │   ├── AppServiceProvider.php
│   │   │   ├── SystemServiceProvider.php
│   │   │   ├── ThemeServiceProvider.php
│   │   │   ├── LayoutServiceProvider.php
│   │   │   ├── GutenbergServiceProvider.php
│   │   │   ├── PerformanceServiceProvider.php
│   │   │   ├── AjaxServiceProvider.php
│   │   │   └── ErrorSuppressionServiceProvider.php
│   │   ├── Blocks/           # Gutenberg blocks system
│   │   │   ├── Block.php     # Base block class
│   │   │   ├── WidgetRendererBlock.php
│   │   │   └── GutenbergRepository.php
│   │   ├── Managers/         # Business logic managers
│   │   │   ├── MenuManager.php
│   │   │   ├── SidebarManager.php
│   │   │   └── FooterManager.php
│   │   ├── Models/           # Data models
│   │   │   ├── Model.php
│   │   │   └── User.php
│   │   └── Services/         # System services
│   │       ├── AssetService.php
│   │       ├── CacheService.php
│   │       ├── UserService.php
│   │       └── ErrorSuppressionService.php
│   ├── Helper/               # Helper functions
│   │   └── Environment.php
│   ├── Http/                 # HTTP handling
│   │   └── Request.php
│   └── Log/                  # Logging system
│       └── Logger.php
```

## 🔄 Bootstrap Process (7 bước)

```php
// includes/Jankx/Foundation/Application.php
protected function bootstrap()
{
    $this->bootstrapWith([
        LoadConfiguration::class,      // 1. Load config files
        ThemeDataLoader::class,        // 2. Load theme data
        HandleExceptions::class,       // 3. Error handling
        RegisterLogger::class,         // 4. Setup logging
        RegisterFacades::class,        // 5. Register facades
        RegisterProviders::class,      // 6. Register providers
        BootProviders::class,          // 7. Boot providers
    ]);
}
```

### 1. LoadConfiguration
- Load `config/app.php`, `config/providers.php`, `config/error.php`, `config/layout.php`
- Support deep merging từ child theme
- **Configuration Cache System** với CRC32 checksums
- Cache TTL: 1 giờ, group: `jankx_config`

### 2. ThemeDataLoader
- Load parent và child theme data (name, version, textdomain)
- Store vào Config Repository với prefix: `template.` và `theme.`

### 3. HandleExceptions
- Setup error handling và logging
- Integrate với Error Suppression System

### 4. RegisterLogger
- Initialize Logger với Jankx\Log\Logger
- Setup log levels và handlers

### 5. RegisterFacades
- Register tất cả facades: Config, User, Cache, Asset, Menu, Sidebar, Footer
- Setup alias mapping

### 6. RegisterProviders
- Register global providers từ `config/app.php`
- Register context-specific providers từ `config/providers.php`
- **SystemServiceProvider** register User và Cache services

### 7. BootProviders
- Call `boot()` method trên tất cả providers
- Initialize Gutenberg blocks system

## 🎨 Gutenberg Blocks System

### Cấu trúc Blocks

```
resources/blocks/
├── widget-renderer/           # Custom block example
│   ├── block.json            # Block configuration
│   ├── index.js              # Editor logic (React)
│   └── style.css             # Block styles
└── [other-blocks]/           # Additional blocks
```

### Block Architecture

```php
// Base Block Class
abstract class Block
{
    abstract public function register();
    abstract public function render($attributes, $content = '');
}

// Concrete Block Implementation
class WidgetRendererBlock extends Block
{
    public function register()
    {
        // Register block với WordPress
        // Enqueue assets
        // Register REST endpoints
    }

    public function render($attributes, $content = '')
    {
        // Render widget content
        // Handle dynamic content
    }
}
```

### Gutenberg Repository

```php
class GutenbergRepository
{
    protected $blocks = [];
    protected $instances = [];

    public function registerBlock($blockClass)
    {
        // Register block class
    }

    public function discoverBlocks()
    {
        // Auto-discover blocks từ resources/blocks/
    }

    public function init()
    {
        // Initialize all blocks
        // Register with WordPress
        // Enqueue assets
    }
}
```

### Service Provider Integration

```php
class GutenbergServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        $app->singleton('gutenberg.repository', GutenbergRepository::class);
    }

    public function boot(Application $app)
    {
        $app->make('gutenberg.repository')->init();
    }
}
```

## ⚙️ Configuration System với Cache

### Cache Architecture

```php
class LoadConfiguration
{
    protected function loadCachedConfig($filePath, $type)
    {
        $content = file_get_contents($filePath);
        $checksum = crc32($content);
        $cacheKey = "file_configs_{$type}_{$checksum}";

        // Try cache first
        $cached = wp_cache_get($cacheKey, 'jankx_config');
        if ($cached !== false) {
            return $cached;
        }

        // Load from file and cache
        $config = include $filePath;
        wp_cache_set($cacheKey, $config, 'jankx_config', 3600);

        return $config;
    }
}
```

### Cache Management

```php
// Clear all config cache
clearConfigCache();

// Clear specific config type
clearConfigCacheByType('app');
```

## 🚫 Error Suppression System

### Configuration

```php
// config/error.php
return [
    'enabled' => true,
    'doing_it_wrong' => [
        'enabled' => true,
        'functions' => ['wp_enqueue_script'],
        'messages' => ['wp-editor script should not be enqueued']
    ],
    'php_errors' => [
        'enabled' => false,
        'levels' => [E_WARNING, E_NOTICE]
    ],
    'admin_notices' => [
        'enabled' => true,
        'patterns' => ['/update-nag/']
    ]
];
```

### Service Implementation

```php
class ErrorSuppressionService
{
    public function suppressDoingItWrong()
    {
        // Suppress specific doing_it_wrong messages
    }

    public function suppressPhpErrors()
    {
        // Suppress PHP errors based on config
    }

    public function suppressAdminNotices()
    {
        // Suppress admin notices based on patterns
    }
}
```

## 🎯 Layout Management System

### Configuration

```php
// config/layout.php
return [
    'menu' => [
        'primary' => ['location' => 'primary', 'description' => 'Primary Menu'],
        'secondary' => ['location' => 'secondary', 'description' => 'Secondary Menu'],
        'footer' => ['location' => 'footer', 'description' => 'Footer Menu'],
        'mobile' => ['location' => 'mobile', 'description' => 'Mobile Menu']
    ],
    'sidebar' => [
        'primary' => ['id' => 'primary', 'name' => 'Primary Sidebar'],
        'secondary' => ['id' => 'secondary', 'name' => 'Secondary Sidebar']
    ],
    'footer' => [
        'menu' => ['location' => 'footer-menu'],
        'widgets' => ['columns' => 3],
        'content' => ['copyright' => '© 2024'],
        'layout' => ['type' => 'columns']
    ]
];
```

### Manager Classes

```php
class MenuManager
{
    public function registerMenus()
    {
        // Register menus từ config
    }

    public function renderMenu($location)
    {
        // Render menu với proper markup
    }
}

class SidebarManager
{
    public function registerSidebars()
    {
        // Register sidebars từ config
    }

    public function renderSidebar($id)
    {
        // Render sidebar với widgets
    }
}

class FooterManager
{
    public function renderFooter()
    {
        // Render footer với menu, widgets, content
    }
}
```

## 🔧 System Services

### User Service

```php
class UserService
{
    public function getUser($id)
    {
        // Get user by ID với cache
        $cacheKey = "user_{$id}";
        $cached = wp_cache_get($cacheKey, 'jankx_users');

        if ($cached !== false) {
            return $cached;
        }

        $user = get_user_by('ID', $id);
        $userData = apply_filters('jankx/user/data', $user);

        wp_cache_set($cacheKey, $userData, 'jankx_users', 3600);
        return $userData;
    }
}
```

### Cache Service

```php
class CacheService
{
    public function get($key, $group = 'jankx_cache')
    {
        return wp_cache_get($key, $group);
    }

    public function set($key, $value, $group = 'jankx_cache', $ttl = 3600)
    {
        return wp_cache_set($key, $value, $group, $ttl);
    }
}
```

## 🎨 Service Provider System

### Global Providers (config/app.php)

```php
return [
    'providers' => [
        Jankx\Support\Providers\SystemServiceProvider::class,
        Jankx\Support\Providers\ThemeServiceProvider::class,
        Jankx\Support\Providers\GutenbergServiceProvider::class,
    ],
    'aliases' => [
        'App' => Jankx\Facades\App::class,
        'Config' => Jankx\Facades\Config::class,
        'Log' => Jankx\Facades\Log::class,
        'User' => Jankx\Facades\User::class,
        'Cache' => Jankx\Facades\Cache::class,
        'Asset' => Jankx\Facades\Asset::class,
        'Menu' => Jankx\Facades\Menu::class,
        'Sidebar' => Jankx\Facades\Sidebar::class,
        'Footer' => Jankx\Facades\Footer::class,
    ]
];
```

### Context-Specific Providers (config/providers.php)

```php
return [
    'http' => [
        'frontend' => [
            Jankx\Support\Providers\LayoutServiceProvider::class,
        ],
        'admin' => [
            Jankx\Support\Providers\GutenbergServiceProvider::class,
        ],
        'rest' => [
            Jankx\Support\Providers\AjaxServiceProvider::class,
        ],
        'ajax' => [
            Jankx\Support\Providers\AjaxServiceProvider::class,
        ]
    ],
    'console' => [
        'wp-cli' => [
            Jankx\Support\Providers\PerformanceServiceProvider::class,
        ],
        'wp-cron' => [
            Jankx\Support\Providers\PerformanceServiceProvider::class,
        ]
    ]
];
```

## 🎭 Facade System

### Usage Examples

```php
// Configuration
$appName = Config::get('app.name');
$debugMode = Config::get('app.debug', false);

// User Management
$user = User::get(1);
$currentUser = User::current();

// Caching
Cache::set('key', 'value', 3600);
$value = Cache::get('key');

// Asset Management
Asset::enqueue('style.css');
Asset::url('images/logo.png');

// Layout Management
Menu::render('primary');
Sidebar::render('primary');
Footer::render();
```

## 🔄 Request Flow

### 1. HTTP Request
```
Request → Kernel Detection → Bootstrap → Service Providers → Response
```

### 2. Console Request
```
Command → Console Kernel → Bootstrap → Service Providers → Output
```

## 🏗️ Kernel Architecture

### HTTP Kernels

```php
class FrontendKernel extends Kernel
{
    protected $middleware = [
        // Frontend specific middleware
    ];

    protected $providers = [
        // Frontend specific providers
    ];
}

class DashboardKernel extends Kernel
{
    protected $middleware = [
        // Admin specific middleware
    ];

    protected $providers = [
        // Admin specific providers
    ];
}
```

### Console Kernels

```php
class WpCliKernel extends Kernel
{
    protected $commands = [
        // WP-CLI commands
    ];
}

class WpCronKernel extends Kernel
{
    protected $tasks = [
        // Cron tasks
    ];
}
```

## 🎨 Design Patterns

### 1. Service Container Pattern
```php
$app->singleton('service', ServiceClass::class);
$service = $app->make('service');
```

### 2. Facade Pattern
```php
class Config extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'config';
    }
}
```

### 3. Repository Pattern (Gutenberg)
```php
class GutenbergRepository
{
    public function registerBlock($blockClass)
    {
        // Register block logic
    }
}
```

### 4. Manager Pattern
```php
class MenuManager
{
    public function registerMenus()
    {
        // Menu registration logic
    }
}
```

## 🔧 WordPress Integration

### Conditional Gutenberg Loading

```php
class GutenbergServiceProvider
{
    protected function shouldLoadGutenbergFeatures()
    {
        // Only load on post/page edit screens
        $screen = get_current_screen();
        return in_array($screen->id, ['post', 'page']);
    }
}
```

### Theme Integration

```php
// functions.php
require_once get_template_directory() . '/includes/framework.php';

$app = new Jankx_Framework();
$app->handleHttpRequest();
```

## ⚡ Performance Considerations

### Configuration Caching
- CRC32 checksums for config files
- 1-hour TTL for config cache
- Automatic cache invalidation on file changes

### User Data Caching
- Cache user data for 1 hour
- Filter hook for custom data
- Cache group: `jankx_users`

### Asset Optimization
- Conditional loading of Gutenberg features
- Lazy loading of block assets
- File modification time for cache busting

## 🔒 Security Considerations

### Input Sanitization
```php
// Always escape output
echo esc_html($userInput);
echo esc_attr($attribute);
echo esc_url($url);
```

### Error Suppression
- Granular control over error suppression
- Configurable patterns and functions
- Safe defaults for production

### REST API Security
```php
'permission_callback' => function() {
    return current_user_can('edit_posts');
}
```

## 🧪 Testing Strategy

### Unit Testing
```php
class LoadConfigurationTest extends TestCase
{
    public function testLoadCachedConfig()
    {
        // Test config caching functionality
    }
}
```

### Integration Testing
- Test service provider registration
- Test facade resolution
- Test kernel bootstrapping

## 📚 Documentation

### Architecture Documentation
- Complete system overview
- Component relationships
- Design patterns used

### Development Guidelines
- Coding standards (PSR-12)
- Naming conventions
- Best practices

### API Documentation
- Service provider interfaces
- Facade methods
- Block development guide

---

**Jankx Framework** cung cấp một kiến trúc clean, maintainable và performance-optimized cho WordPress theme development với focus vào modularity, extensibility và developer experience.