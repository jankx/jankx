# Jankx Framework Documentation

Jankx là một WordPress theme framework được xây dựng với kiến trúc Laravel-style, cung cấp cấu trúc mạnh mẽ và linh hoạt cho việc phát triển WordPress themes.

## 📚 Tài liệu

### 🚀 Getting Started
- **[Getting Started Guide](getting-started.md)** - Hướng dẫn cài đặt và sử dụng cơ bản
- **[Architecture Overview](architecture.md)** - Tổng quan kiến trúc framework
- **[Package Architecture](package-architecture.md)** - Kiến trúc package tương lai

### 📋 Coding Standards
- **[Coding Rules](coding-rules.md)** - Quy tắc coding chi tiết (PSR-12 + WordPress)

## Tổng quan

Jankx Framework kết hợp sức mạnh của Laravel với tính linh hoạt của WordPress, tạo ra một môi trường phát triển hiện đại cho WordPress themes.

### Đặc điểm chính

- **Laravel-style Architecture**: Container, Service Providers, Facades
- **WordPress Native**: Tương thích hoàn toàn với WordPress ecosystem
- **Gutenberg Ready**: Hỗ trợ đầy đủ cho Gutenberg blocks với conditional loading
- **CLI Support**: WP CLI và WP Cron integration
- **Modular Design**: Cấu trúc module hóa, dễ mở rộng
- **Configuration Caching**: CRC32-based cache system cho performance
- **Error Suppression**: Configurable error suppression system
- **Layout Management**: Manager classes cho menu, sidebar, footer
- **System Services**: User và Cache services với caching

## Cấu trúc thư mục

```
includes/Jankx/
├── Config/                 # Configuration management
│   └── Repository.php
├── Contracts/              # Service contracts
│   └── ServiceProvider.php
├── Facades/                # Facade classes
│   ├── App.php
│   ├── Config.php
│   ├── Log.php
│   ├── User.php
│   ├── Cache.php
│   ├── Asset.php
│   ├── Menu.php
│   ├── Sidebar.php
│   └── Footer.php
├── Foundation/             # Core framework
│   ├── Application.php
│   ├── Bootstrap/          # Bootstrap classes
│   ├── Cli/               # CLI kernels
│   ├── Http/              # HTTP kernels
│   └── Log/               # Logging system
├── Helper/                 # Helper functions
│   └── Environment.php
├── Http/                   # HTTP components
│   └── Request.php
├── Managers/               # Layout managers
│   ├── MenuManager.php
│   ├── SidebarManager.php
│   └── FooterManager.php
├── Models/                 # Data models
│   ├── Model.php
│   └── User.php
├── Services/               # System services
│   ├── UserService.php
│   ├── CacheService.php
│   ├── AssetService.php
│   └── ErrorSuppressionService.php
└── Support/                # Support classes
    └── Providers/          # Service providers
```

## Core Components

### 1. Application Container

```php
use Jankx\Foundation\Application;

$app = new Application(get_template_directory());
```

Application container là trung tâm của framework, quản lý:
- Service registration và resolution
- Configuration loading với cache system
- Bootstrap process
- Service providers
- Kernel instance management

### 2. Service Providers

```php
use Jankx\Support\Providers\ServiceProvider;

class MyServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register services
    }

    public function boot(Application $app)
    {
        // Bootstrap services
    }
}
```

### 3. HTTP Kernels

Framework hỗ trợ 4 loại kernel:

- **FrontendKernel**: Xử lý frontend requests
- **DashboardKernel**: Xử lý admin dashboard
- **RestApiKernel**: Xử lý REST API requests
- **AdminAjaxKernel**: Xử lý admin AJAX requests

### 4. CLI Kernels

- **WpCliKernel**: WP CLI commands
- **WpCronKernel**: WordPress cron jobs

## Configuration

### App Configuration (`config/app.php`)

```php
return [
    'name' => 'Jankx',
    'env' => defined('WP_DEBUG') && WP_DEBUG ? 'local' : 'production',
    'debug' => defined('WP_DEBUG') && WP_DEBUG,
    'url' => get_site_url(),
    'timezone' => get_option('timezone_string', 'UTC'),
    'locale' => get_locale(),
    'fallback_locale' => 'en',
    'key' => defined('AUTH_KEY') ? AUTH_KEY : 'base64:'.base64_encode(random_bytes(32)),
    'providers' => [
        Jankx\Support\Providers\SystemServiceProvider::class,
        Jankx\Support\Providers\ThemeServiceProvider::class,
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
    ],
];
```

### Providers Configuration (`config/providers.php`)

```php
return [
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
    ],
];
```

### Error Suppression Configuration (`config/error.php`)

```php
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

### Layout Configuration (`config/layout.php`)

```php
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

## Configuration Cache System

Framework tự động cache configuration files với CRC32 checksum:

```php
// Cache key format: file_configs_{type}_{CRC32}
$cacheKey = 'file_configs_app_' . crc32($fileContent);

// Cache duration: 1 hour (3600 seconds)
wp_cache_set($cacheKey, $config, 'jankx_config', 3600);
```

### Cache Management

```php
// Clear all config cache
Jankx\Foundation\Bootstrap\LoadConfiguration::clearConfigCache();

// Clear specific config type
Jankx\Foundation\Bootstrap\LoadConfiguration::clearConfigCacheByType('app');
```

## Bootstrap Process

Framework bootstrap theo thứ tự:

1. **LoadConfiguration**: Load config từ files với cache system
2. **ThemeDataLoader**: Load theme data (name, version, textdomain)
3. **HandleExceptions**: Setup exception handling
4. **RegisterLogger**: Register logging system
5. **RegisterFacades**: Register facade classes
6. **RegisterProviders**: Register service providers
7. **BootProviders**: Boot all service providers

## Request Flow

### HTTP Requests

1. Request được detect bởi `JankxRequest::capture()`
2. Framework tạo kernel phù hợp dựa trên request type
3. Kernel bootstrap và register WordPress hooks
4. WordPress xử lý response

### Console Requests

1. WP CLI/WP Cron requests được detect
2. Console kernel được tạo
3. Kernel bootstrap và execute commands

## Facades

### App Facade

```php
use Jankx\Facades\App;

$app = App::getFacadeRoot();
$version = App::version();
```

### Config Facade

```php
use Jankx\Facades\Config;

$value = Config::get('app.name');
Config::set('custom.key', 'value');
```

### Log Facade

```php
use Jankx\Facades\Log;

Log::info('Application started');
Log::error('An error occurred', ['context' => 'data']);
```

### User Facade

```php
use Jankx\Facades\User;

$user = User::getById(1);
$currentUser = User::getCurrent();
```

### Cache Facade

```php
use Jankx\Facades\Cache;

Cache::set('key', 'value', 3600);
$value = Cache::get('key', 'default');
```

### Asset Facade

```php
use Jankx\Facades\Asset;

$url = \Jankx\Facades\Url::asset('file.css');
$themeUrl = Asset::themeUrl('/assets/style.css');
```

### Layout Facades

```php
use Jankx\Facades\Menu;
use Jankx\Facades\Sidebar;
use Jankx\Facades\Footer;

echo Menu::render('primary');
echo Sidebar::render('primary');
echo Footer::render();
```

## System Services

### User Service

```php
use Jankx\Facades\User;

// Get user by ID with caching
$user = User::getById(1);

// Get user by username
$user = User::getByUsername('admin');

// Get current user
$currentUser = User::getCurrent();

// Filter user data
add_filter('jankx/user/data', function($user) {
    $user->custom_field = 'value';
    return $user;
});
```

### Cache Service

```php
use Jankx\Facades\Cache;

// Set cache
Cache::set('key', 'value', 3600);

// Get cache
$value = Cache::get('key', 'default');

// Check if cache exists
if (Cache::has('key')) {
    // Do something
}
```

## Layout Management

### Menu Management

```php
use Jankx\Facades\Menu;

// Render menu
echo Menu::render('primary');

// Check if menu exists
if (Menu::has('primary')) {
    echo Menu::render('primary');
}
```

### Sidebar Management

```php
use Jankx\Facades\Sidebar;

// Render sidebar
echo Sidebar::render('primary');

// Check if sidebar is active
if (Sidebar::isActive('primary')) {
    echo Sidebar::render('primary');
}
```

### Footer Management

```php
use Jankx\Facades\Footer;

// Render footer
echo Footer::render();
```

## Environment Detection

```php
use Jankx\Helper\Environment;

if (Environment::isWpCli()) {
    // WP CLI context
}

if (Environment::isAdmin()) {
    // Admin context
}

if (Environment::isDebugLog()) {
    // Debug mode
}
```

## Logging

Framework sử dụng WordPress error_log với level filtering:

- Chỉ log warning level trở lên
- Có thể enable tất cả logs với `JANKX_LOG_ALL`
- Debug logs chỉ hiển thị khi `WP_DEBUG = true`

## Error Suppression System

Framework cung cấp hệ thống error suppression có thể cấu hình:

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

## Development

### Adding Service Providers

1. Tạo service provider class
2. Register trong `config/app.php` (global) hoặc `config/providers.php` (context-specific)
3. Implement `register()` và `boot()` methods

### Creating Custom Kernels

1. Extend base Kernel class
2. Implement `handle()` và `registerHooks()` methods
3. Register trong framework

### Configuration

- Sử dụng `Config::get()` để access configuration
- Database config được load từ WordPress options
- File config được load từ `config/` directory với caching
- Child theme config được deep merge với parent theme config

### Layout Management

- Sử dụng manager classes cho layout components
- Configure layout qua config files
- Sử dụng facades cho easy access
- Implement proper fallbacks

## Performance Features

### Configuration Caching

- CRC32 checksum-based caching
- Automatic cache invalidation khi files thay đổi
- Cache duration: 1 hour
- Cache groups để isolate data

### User Data Caching

- Cache user data với `user_{id}` format
- Cache duration: 1 hour
- Filter hook cho extensibility
- Automatic cache management

### Lazy Loading

- Service providers chỉ load khi cần thiết
- Facades sử dụng lazy resolution
- Configuration được cache trong memory

## Best Practices

1. **Service Providers**: Sử dụng service providers cho business logic
2. **Configuration**: Sử dụng Config facade thay vì global variables
3. **Logging**: Sử dụng Log facade cho debugging
4. **WordPress Hooks**: Register hooks trong kernel `registerHooks()` method
5. **Environment**: Kiểm tra environment trước khi execute code
6. **Caching**: Leverage configuration và user data caching
7. **Error Suppression**: Sử dụng error suppression system cho unwanted messages
8. **Layout Management**: Sử dụng manager classes và facades cho layout components

## Requirements

- PHP 7.4+
- WordPress 5.0+
- Composer (for autoloading)

## Package Architecture (Future)

Jankx Framework sẽ được tách thành package riêng (`jankx/core`) để có thể tái sử dụng cho nhiều WordPress themes:

### Installation via Composer

```bash
composer require jankx/core
```

### Theme Integration

```php
// functions.php
require_once get_template_directory() . '/includes/framework.php';
```

### Benefits

- **Reusability**: Core framework có thể được sử dụng cho nhiều themes
- **Maintainability**: Centralized updates và bug fixes
- **Consistency**: Shared architecture và best practices
- **Ecosystem**: Additional packages (jankx/blocks, jankx/admin, etc.)
- **Performance**: Built-in caching và optimization features

Xem thêm: [Package Architecture Documentation](package-architecture.md)

## License

MIT License