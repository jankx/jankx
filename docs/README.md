# Jankx Framework

Jankx là một WordPress theme framework được xây dựng với kiến trúc Laravel-style, cung cấp cấu trúc mạnh mẽ và linh hoạt cho việc phát triển WordPress themes.

## Tổng quan

Jankx Framework kết hợp sức mạnh của Laravel với tính linh hoạt của WordPress, tạo ra một môi trường phát triển hiện đại cho WordPress themes.

### Đặc điểm chính

- **Laravel-style Architecture**: Container, Service Providers, Facades
- **WordPress Native**: Tương thích hoàn toàn với WordPress ecosystem
- **Gutenberg Ready**: Hỗ trợ đầy đủ cho Gutenberg blocks
- **CLI Support**: WP CLI và WP Cron integration
- **Modular Design**: Cấu trúc module hóa, dễ mở rộng

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
│   ├── Facade.php
│   └── Log.php
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
- Configuration loading
- Bootstrap process
- Service providers

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
        // Service providers
    ],
    'aliases' => [
        // Container aliases for dependency injection
        'app' => [
            \Jankx\Foundation\Application::class,
        ],
        'config' => [
            \Jankx\Config\Repository::class,
        ],
        'log' => [
            \Jankx\Foundation\Log\Logger::class,
        ],
    ],
];
```

**Lưu ý**: Aliases trong config được sử dụng cho container bindings. Facades được register riêng trong bootstrap process.

### Providers Configuration (`config/providers.php`)

```php
return [
    'http' => [
        'frontend' => [
            // Frontend providers
        ],
        'admin' => [
            // Admin providers
        ],
        'rest_api' => [
            // REST API providers
        ],
        'admin_ajax' => [
            // Admin AJAX providers
        ],
    ],
    'console' => [
        'wp_cli' => [
            // WP CLI providers
        ],
        'wp_cron' => [
            // WP Cron providers
        ],
    ],
    'global' => [
        // Global providers
    ],
];
```

## Bootstrap Process

Framework bootstrap theo thứ tự:

1. **LoadConfiguration**: Load config từ files và database
2. **HandleExceptions**: Setup exception handling
3. **RegisterLogger**: Register logging system
4. **RegisterFacades**: Register facade classes
5. **RegisterProviders**: Register service providers
6. **BootProviders**: Boot all service providers

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

## Development

### Adding Service Providers

1. Tạo service provider class
2. Register trong `config/providers.php`
3. Implement `register()` và `boot()` methods

### Creating Custom Kernels

1. Extend base Kernel class
2. Implement `handle()` và `registerHooks()` methods
3. Register trong framework

### Configuration

- Sử dụng `Config::get()` để access configuration
- Database config được load từ WordPress options
- File config được load từ `config/` directory

## Best Practices

1. **Service Providers**: Sử dụng service providers cho business logic
2. **Configuration**: Sử dụng Config facade thay vì global variables
3. **Logging**: Sử dụng Log facade cho debugging
4. **WordPress Hooks**: Register hooks trong kernel `registerHooks()` method
5. **Environment**: Kiểm tra environment trước khi execute code

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

Xem thêm: [Package Architecture Documentation](package-architecture.md)

## License

MIT License