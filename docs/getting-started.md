# Getting Started with Jankx Framework

## Cài đặt

### 1. Yêu cầu hệ thống

- PHP 7.4 hoặc cao hơn
- WordPress 5.0 hoặc cao hơn
- Composer (cho autoloading)

### 2. Tích hợp vào WordPress Theme

Thêm vào `functions.php`:

```php
<?php
// Load Jankx Framework
require_once get_template_directory() . '/includes/framework.php';
```

### 3. Cấu trúc thư mục

```
your-theme/
├── functions.php
├── config/
│   ├── app.php
│   └── providers.php
├── includes/
│   ├── framework.php
│   ├── boot/
│   │   └── app.php
│   └── Jankx/
│       ├── Config/
│       ├── Contracts/
│       ├── Facades/
│       ├── Foundation/
│       ├── Helper/
│       ├── Http/
│       └── Support/
└── vendor/ (Composer dependencies)
```

## Cấu hình cơ bản

### 1. App Configuration

Tạo file `config/app.php`:

```php
<?php

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
        // Service providers sẽ được thêm ở đây
    ],
    'aliases' => [
        'App' => Jankx\Facades\App::class,
        'Config' => Jankx\Facades\Config::class,
        'Log' => Jankx\Facades\Log::class,
    ],
];
```

### 2. Providers Configuration

Tạo file `config/providers.php`:

```php
<?php

return [
    'http' => [
        'frontend' => [
            // Frontend service providers
        ],
        'admin' => [
            // Admin service providers
        ],
        'rest_api' => [
            // REST API service providers
        ],
        'admin_ajax' => [
            // Admin AJAX service providers
        ],
    ],
    'console' => [
        'wp_cli' => [
            // WP CLI service providers
        ],
        'wp_cron' => [
            // WP Cron service providers
        ],
    ],
    'global' => [
        // Global service providers
    ],
];
```

## Tạo Service Provider đầu tiên

### 1. Tạo Service Provider

Tạo file `includes/Jankx/Support/Providers/ThemeServiceProvider.php`:

```php
<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;

class ThemeServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register theme services
        $app->singleton('theme.assets', function ($app) {
            return new ThemeAssetsManager();
        });
    }

    public function boot(Application $app)
    {
        // Bootstrap theme features
        add_action('after_setup_theme', [$this, 'setupTheme']);
        add_action('wp_enqueue_scripts', [$this, 'enqueueAssets']);
    }

    public function setupTheme()
    {
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
    }

    public function enqueueAssets()
    {
        wp_enqueue_style('theme-style', get_stylesheet_uri());
        wp_enqueue_script('theme-script', get_template_directory_uri() . '/assets/js/theme.js', [], '1.0.0', true);
    }
}
```

### 2. Đăng ký Service Provider

Thêm vào `config/providers.php`:

```php
'global' => [
    Jankx\Support\Providers\ThemeServiceProvider::class,
],
```

## Sử dụng Facades

### 1. Configuration Access

```php
use Jankx\Facades\Config;

// Lấy giá trị config
$themeName = Config::get('app.name');

// Set giá trị config
Config::set('theme.custom_setting', 'value');

// Kiểm tra config có tồn tại
if (Config::has('theme.feature')) {
    // Do something
}
```

### 2. Logging

```php
use Jankx\Facades\Log;

// Log các level khác nhau
Log::info('Theme loaded successfully');
Log::warning('Deprecated feature used');
Log::error('An error occurred', ['context' => 'data']);
Log::debug('Debug information', ['data' => $data]);
```

### 3. Application Access

```php
use Jankx\Facades\App;

// Lấy application instance
$app = App::getFacadeRoot();

// Lấy version
$version = App::version();

// Resolve service
$service = App::make('theme.assets');
```

## Environment Detection

```php
use Jankx\Helper\Environment;

// Kiểm tra environment
if (Environment::isDevelopment()) {
    // Development specific code
}

if (Environment::isWpCli()) {
    // WP CLI specific code
}

if (Environment::isAdmin()) {
    // Admin specific code
}

if (Environment::isFrontend()) {
    // Frontend specific code
}
```

## Tạo Custom Kernel

### 1. Tạo Custom HTTP Kernel

```php
<?php

namespace Jankx\Support\Kernels;

use Jankx\Foundation\Http\Kernel;
use Jankx\Http\Request;

class CustomKernel extends Kernel
{
    public function handle($request)
    {
        // Custom request handling logic
    }

    public function registerHooks()
    {
        // Register custom WordPress hooks
        add_action('wp_head', [$this, 'addCustomMeta']);
        add_action('wp_footer', [$this, 'addCustomScripts']);
    }

    public function addCustomMeta()
    {
        echo '<meta name="custom" content="value">';
    }

    public function addCustomScripts()
    {
        echo '<script>console.log("Custom script");</script>';
    }
}
```

### 2. Đăng ký Custom Kernel

Trong `includes/framework.php`, thêm logic để sử dụng custom kernel:

```php
// Trong handleHttpRequest() method
switch ($requestType) {
    case 'custom':
        $kernel = new CustomKernel($this->app);
        break;
    // ... other cases
}
```

## Tạo Custom Service

### 1. Tạo Service Class

```php
<?php

namespace Jankx\Support\Services;

class ThemeService
{
    protected $config;

    public function __construct($config)
    {
        $this->config = $config;
    }

    public function getThemeOption($key, $default = null)
    {
        return get_option("theme_{$key}", $default);
    }

    public function setThemeOption($key, $value)
    {
        return update_option("theme_{$key}", $value);
    }

    public function getThemeConfig($key, $default = null)
    {
        return $this->config->get("theme.{$key}", $default);
    }
}
```

### 2. Đăng ký Service

Trong service provider:

```php
public function register(Application $app)
{
    $app->singleton('theme.service', function ($app) {
        return new ThemeService($app->make('config'));
    });
}
```

### 3. Sử dụng Service

```php
// Via container
$themeService = $app->make('theme.service');

// Via facade (nếu có facade)
$themeService = App::make('theme.service');

// Sử dụng service
$option = $themeService->getThemeOption('color_scheme', 'default');
```

## Debug và Troubleshooting

### 1. Enable Debug Logging

Thêm vào `wp-config.php`:

```php
define('WP_DEBUG', true);
define('JANKX_LOG_ALL', true);
```

### 2. Kiểm tra Bootstrap Process

```php
use Jankx\Facades\Log;

// Trong service provider
public function boot(Application $app)
{
    Log::info('Service provider booted', [
        'provider' => get_class($this),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
```

### 3. Kiểm tra Configuration

```php
use Jankx\Facades\Config;

// Debug configuration
Log::debug('App configuration', Config::get('app'));
Log::debug('Providers configuration', Config::get('providers'));
```

## Best Practices

### 1. Service Provider Organization

- Tách biệt logic theo domain
- Sử dụng meaningful names
- Document public methods

### 2. Configuration Management

- Sử dụng Config facade thay vì global variables
- Group related settings
- Validate configuration values

### 3. Error Handling

- Sử dụng Log facade cho debugging
- Catch và handle exceptions properly
- Provide meaningful error messages

### 4. Performance

- Lazy load services khi có thể
- Cache expensive operations
- Minimize WordPress hook calls

### 5. Security

- Validate user input
- Sanitize configuration data
- Use WordPress security functions

## Examples

### 1. Complete Theme Setup

```php
<?php
// functions.php
require_once get_template_directory() . '/includes/framework.php';

// ThemeServiceProvider.php
class ThemeServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        $app->singleton('theme.assets', ThemeAssetsManager::class);
        $app->singleton('theme.menu', ThemeMenuManager::class);
        $app->singleton('theme.sidebar', ThemeSidebarManager::class);
    }

    public function boot(Application $app)
    {
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

### 2. Custom Block Registration

```php
class GutenbergServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        $app->singleton('blocks.registry', BlockRegistry::class);
    }

    public function boot(Application $app)
    {
        add_action('init', [$this, 'registerBlocks']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueueBlockAssets']);
    }

    public function registerBlocks()
    {
        $registry = $this->app->make('blocks.registry');

        $registry->register('custom/hero', [
            'editor_script' => 'custom-blocks',
            'editor_style' => 'custom-blocks-editor',
            'style' => 'custom-blocks',
        ]);
    }

    public function enqueueBlockAssets()
    {
        wp_enqueue_script('custom-blocks', get_template_directory_uri() . '/assets/js/blocks.js');
        wp_enqueue_style('custom-blocks-editor', get_template_directory_uri() . '/assets/css/blocks-editor.css');
    }
}
```

## Next Steps

1. **Explore Core Components**: Đọc hiểu Application, Container, Service Providers
2. **Create Custom Services**: Tạo services cho business logic
3. **Implement Custom Kernels**: Tạo kernels cho specific use cases
4. **Add Configuration**: Cấu hình theme settings
5. **Integrate with WordPress**: Sử dụng WordPress hooks và functions
6. **Test and Debug**: Sử dụng logging và debugging tools

Framework này cung cấp foundation vững chắc để build WordPress themes hiện đại với kiến trúc clean và maintainable.