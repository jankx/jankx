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

<<<<<<< HEAD
**Chức năng chính:**
- Service registration và resolution
- Configuration management với caching system
- Bootstrap orchestration
- Service provider lifecycle
- Kernel instance management
=======
### 1. LoadConfiguration
- Load `config/app.php`, `config/providers.php`, `config/error.php`, `config/layout.php`
- Support deep merging từ child theme
- **Configuration Cache System** với CRC32 checksums
- Cache TTL: 1 giờ, group: `jankx_config`
>>>>>>> 687e866

### 2. ThemeDataLoader
- Load parent và child theme data (name, version, textdomain)
- Store vào Config Repository với prefix: `template.` và `theme.`

<<<<<<< HEAD
Framework sử dụng 7 bootstrap classes theo thứ tự:

```php
protected $bootstrappers = [
    LoadConfiguration::class,      // Load config files với cache
    ThemeDataLoader::class,        // Load theme data (name, version, textdomain)
    HandleExceptions::class,       // Setup error handling
    RegisterLogger::class,         // Register logging
    RegisterFacades::class,        // Register facades
    RegisterProviders::class,      // Register service providers
    BootProviders::class,          // Boot all providers
];
```

**Bootstrap Flow:**
1. **LoadConfiguration**: Load config từ `config/` directory với CRC32 cache system
2. **ThemeDataLoader**: Load theme data từ parent/child themes vào config
3. **HandleExceptions**: Setup exception handlers và error reporting
4. **RegisterLogger**: Register logging system với WordPress
5. **RegisterFacades**: Register App, Config, Log, User, Cache, Asset, Menu, Sidebar, Footer facades
6. **RegisterProviders**: Register app-level providers trước, sau đó register kernel-specific providers
7. **BootProviders**: Call `boot()` method trên tất cả providers

### 3. Configuration System với Cache

#### Cache Architecture

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

#### Configuration Sources

1. **File Configuration**: `config/app.php`, `config/providers.php`, `config/error.php`, `config/layout.php`
2. **Child Theme Override**: Deep merge từ child theme config files
3. **Database Configuration**: WordPress options với key `jankx_config`
4. **Runtime Configuration**: Dynamic configuration via Config facade
5. **Environment Variables**: `JANKX_CONFIG_PATH`, `JANKX_CHILD_CONFIG_PATH` cho testing

#### Cache Management

```php
// Clear all config cache
LoadConfiguration::clearConfigCache();

// Clear specific config type
LoadConfiguration::clearConfigCacheByType('app');
```

### 4. Error Suppression System

#### ErrorSuppressionServiceProvider

```php
class ErrorSuppressionServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        $app->singleton('error.suppression', ErrorSuppressionService::class);
    }

    public function boot(Application $app)
    {
        $this->suppressDoingItWrong();
        $this->suppressPhpErrors();
        $this->suppressAdminNotices();
    }
}
```

#### Configuration

```php
// config/error.php
return [
    'suppression' => [
        'doing_it_wrong' => [
            'enabled' => true,
            'functions' => ['wp_enqueue_script'],
            'patterns' => ['wp-editor.*should not be enqueued']
        ],
        'php_errors' => [
            'enabled' => true,
            'messages' => ['Deprecated:', 'Notice:']
        ],
        'admin_notices' => [
            'enabled' => true,
            'notices' => ['Plugin compatibility']
        ]
    ]
];
```

### 5. Layout Management System

#### LayoutServiceProvider

```php
class LayoutServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        $app->singleton('menu.manager', MenuManager::class);
        $app->singleton('sidebar.manager', SidebarManager::class);
        $app->singleton('footer.manager', FooterManager::class);
    }

    public function boot(Application $app)
    {
        $this->registerMenus();
        $this->registerSidebars();
        $this->registerFooterWidgets();
    }
}
```

#### Layout Configuration

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

### 6. System Services

#### UserService

```php
class UserService
{
    public function getById($id)
    {
        $cacheKey = "user_{$id}";
        $cached = wp_cache_get($cacheKey, 'jankx_users');

        if ($cached !== false) {
            return $cached;
        }

        $user = get_user_by('id', $id);
        if ($user) {
            $userData = apply_filters('jankx/user/data', $user);
            wp_cache_set($cacheKey, $userData, 'jankx_users', 3600);
            return $userData;
        }

        return null;
    }
}
```

#### CacheService

```php
class CacheService
{
    public function get($key, $default = null)
    {
        return wp_cache_get($key, 'jankx_cache') ?: $default;
    }

    public function set($key, $value, $ttl = 3600)
    {
        return wp_cache_set($key, $value, 'jankx_cache', $ttl);
    }
}
```

### 7. Manager Classes

#### MenuManager

```php
class MenuManager
{
    public function render($location)
    {
        if (!has_nav_menu($location)) {
            return '';
        }

        return wp_nav_menu([
            'theme_location' => $location,
            'echo' => false,
            'container' => false
        ]);
    }
}
```

#### SidebarManager

```php
class SidebarManager
{
    public function render($id)
    {
        if (!is_active_sidebar($id)) {
            return '';
        }

        ob_start();
        dynamic_sidebar($id);
        return ob_get_clean();
    }
}
```

#### FooterManager

```php
class FooterManager
{
    public function render()
    {
        $layout = Config::get('layout.footer.layout.type', 'default');
        return $this->{"render{$layout}"}();
    }
}
```

### 8. Service Provider System

#### Updated Provider Structure

```php
// config/app.php - Global providers
'providers' => [
    Jankx\Support\Providers\SystemServiceProvider::class,
    Jankx\Support\Providers\ThemeServiceProvider::class,
],

// config/providers.php - Context-specific providers
'http' => [
    'frontend' => [
        Jankx\Support\Providers\AssetServiceProvider::class,
        Jankx\Support\Providers\LayoutServiceProvider::class,
        Jankx\Support\Providers\ErrorSuppressionServiceProvider::class,
        Jankx\Support\Providers\GutenbergServiceProvider::class,
    ],
    'admin' => [
        Jankx\Support\Providers\AssetServiceProvider::class,
        Jankx\Support\Providers\LayoutServiceProvider::class,
        Jankx\Support\Providers\ErrorSuppressionServiceProvider::class,
        Jankx\Support\Providers\GutenbergServiceProvider::class,
    ],
    'rest_api' => [
        Jankx\Support\Providers\GutenbergServiceProvider::class,
    ],
    'admin_ajax' => [
        Jankx\Support\Providers\AjaxServiceProvider::class,
    ],
],
'console' => [
    'wp_cli' => [
        Jankx\Support\Providers\PerformanceServiceProvider::class,
    ],
    'wp_cron' => [
        Jankx\Support\Providers\PerformanceServiceProvider::class,
    ],
]
```

### 9. Facade System

#### Available Facades

- **App**: Application container access
- **Config**: Configuration management với cache
- **Log**: Logging functionality
- **User**: User data access với cache
- **Cache**: Generic caching operations
- **Asset**: Asset management và URL helpers
- **Menu**: Menu rendering và management
- **Sidebar**: Sidebar rendering và management
- **Footer**: Footer rendering và management

#### Facade Usage

```php
// User management
$user = User::getById(1);
$currentUser = User::getCurrent();

// Caching
Cache::set('key', 'value', 3600);
$value = Cache::get('key', 'default');

// Asset management
$url = Asset::urlFromPath('/path/to/file.css');
$themeUrl = Asset::themeUrl('/assets/style.css');

// Layout rendering
echo Menu::render('primary');
echo Sidebar::render('primary');
echo Footer::render();
```

### 10. Request Flow

#### HTTP Request Flow

```
WordPress Request
       ↓
JankxRequest::capture()
       ↓
Request Type Detection
       ↓
Kernel Selection
       ↓
Kernel::init()
       ↓
Bootstrap + Handle + RegisterHooks
       ↓
WordPress Response
```

#### Console Request Flow

```
WP CLI/Cron Request
       ↓
Environment Detection
       ↓
Console Kernel Selection
       ↓
Kernel::handle()
       ↓
Command Execution
```

### 11. Kernel Architecture

#### HTTP Kernels

```php
abstract class Kernel
=======
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
>>>>>>> 687e866
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

<<<<<<< HEAD
**Kernel Types:**
- **WpCliKernel**: WP CLI commands
- **WpCronKernel**: WordPress cron jobs

## Design Patterns

### 1. Dependency Injection

Framework sử dụng container-based dependency injection:

```php
$app->singleton('service', ServiceClass::class);
$app->bind('interface', Implementation::class);
$service = $app->make('service');
```

### 2. Service Provider Pattern

Business logic được tổ chức trong service providers:

```php
class MyServiceProvider extends ServiceProvider
=======
### Service Provider Integration

```php
class GutenbergServiceProvider extends ServiceProvider
>>>>>>> 687e866
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
<<<<<<< HEAD
Config::get('app.name');  // Instead of $app->make('config')->get('app.name')
Log::info('message');      // Instead of $app->make('log')->info('message')
User::getById(1);         // Instead of $app->make('user')->getById(1)
```

### 4. Repository Pattern

Configuration management sử dụng repository pattern với cache:

```php
$config = new Repository($items);
$value = $config->get('nested.key', 'default');
```

### 5. Manager Pattern

Layout components sử dụng manager pattern:

```php
$menuManager = $app->make('menu.manager');
$sidebarManager = $app->make('sidebar.manager');
$footerManager = $app->make('footer.manager');
```

## WordPress Integration

### 1. Hook System Integration

Kernels register WordPress hooks thay vì return responses:

```php
public function registerHooks()
=======
class LoadConfiguration
>>>>>>> 687e866
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

<<<<<<< HEAD
Framework hỗ trợ Gutenberg blocks thông qua kernels với conditional loading:
=======
### Configuration
>>>>>>> 687e866

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
<<<<<<< HEAD
    if ($this->shouldLoadGutenbergFeatures()) {
        add_action('after_setup_theme', [$this, 'setupGutenbergSupport']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueueBlockEditorAssets']);
        add_action('wp_loaded', [$this, 'registerBlockTypes']);
=======
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
>>>>>>> 687e866
    }
}
```

## 🎯 Layout Management System

<<<<<<< HEAD
### 1. Configuration Caching

- **CRC32 Checksum**: Cache key dựa trên file content checksum
- **Cache Duration**: 1 hour (3600 seconds)
- **Cache Group**: `jankx_config` để isolate
- **Automatic Invalidation**: Khi file thay đổi, checksum khác → cache miss

### 2. User Data Caching

- **Cache Key**: `user_{id}` format
- **Cache Duration**: 1 hour
- **Cache Group**: `jankx_users`
- **Filter Hook**: `jankx/user/data` cho extensibility

### 3. Lazy Loading
=======
### Configuration
>>>>>>> 687e866

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

<<<<<<< HEAD
### 4. Bootstrap Optimization
=======
### Manager Classes
>>>>>>> 687e866

```php
class MenuManager
{
    public function registerMenus()
    {
        // Register menus từ config
    }

<<<<<<< HEAD
### 5. Memory Management
=======
    public function renderMenu($location)
    {
        // Render menu với proper markup
    }
}
>>>>>>> 687e866

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

<<<<<<< HEAD
- Sensitive data được lưu trong WordPress options
- Configuration keys được validate
- Database config được sanitize
- Cache keys được prefix để tránh conflicts
=======
## 🔧 System Services
>>>>>>> 687e866

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

<<<<<<< HEAD
- Exceptions được catch và log
- Production mode ẩn sensitive information
- Debug mode chỉ hiển thị khi `WP_DEBUG = true`
- Error suppression system để filter unwanted messages

### 4. Cache Security

- Cache keys được prefix với `jankx_` để tránh conflicts
- Cache groups được sử dụng để isolate data
- Cache duration được limit để tránh stale data
=======
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
>>>>>>> 687e866
