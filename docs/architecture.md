# Jankx Framework Architecture

## Tổng quan kiến trúc

Jankx Framework được xây dựng theo mô hình Laravel-style với các thành phần chính:

```
┌─────────────────────────────────────────────────────────────┐
│                    WordPress Theme                         │
├─────────────────────────────────────────────────────────────┤
│                    Jankx Framework                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   HTTP      │  │    CLI      │  │   Support   │      │
│  │  Kernels    │  │  Kernels    │  │   Classes   │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                 Application Container                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  Service    │  │   Config    │  │   Facades   │      │
│  │ Providers   │  │ Repository  │  │             │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                    Bootstrap Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Load      │  │  Register   │  │     Boot    │      │
│  │   Config    │  │  Providers  │  │  Providers  │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Application Container

Application container là trung tâm của framework, kế thừa từ `Illuminate\Container\Container`:

```php
class Application extends Container
{
    protected $basePath;
    protected $hasBeenBootstrapped = false;
    protected $serviceProviders = [];
    protected $loadedProviders = [];
    protected $deferredServices = [];
}
```

**Chức năng chính:**
- Service registration và resolution
- Configuration management với caching system
- Bootstrap orchestration
- Service provider lifecycle
- Kernel instance management

### 2. Bootstrap Process

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
{
    abstract public function handle($request);
    abstract public function registerHooks();

    public function init($request)
    {
        $this->bootstrap();
        $this->handle($request);
        $this->registerHooks();
    }
}
```

**Kernel Types:**
- **FrontendKernel**: Frontend requests, Gutenberg blocks
- **DashboardKernel**: Admin dashboard, settings pages
- **RestApiKernel**: REST API endpoints
- **AdminAjaxKernel**: Admin AJAX requests

#### CLI Kernels

```php
abstract class Kernel
{
    abstract public function handle($args);

    public function bootstrap()
    {
        if (!$this->app->hasBeenBootstrapped()) {
            $this->app->bootstrapWith($this->bootstrappers);
        }
    }
}
```

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
{
    public function register(Application $app)
    {
        $app->singleton('my-service', MyService::class);
    }

    public function boot(Application $app)
    {
        // Bootstrap logic
    }
}
```

### 3. Facade Pattern

Simplified access to complex subsystems:

```php
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
{
    add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
    add_action('wp_head', [$this, 'addHeadMeta']);
}
```

### 2. Request Detection

Framework detect request type sử dụng WordPress constants:

```php
protected static function detectRequestType(Request $request)
{
    if (defined('DOING_AJAX') && DOING_AJAX && is_admin()) {
        return 'admin_ajax';
    }

    if (defined('REST_REQUEST') && REST_REQUEST) {
        return 'rest_api';
    }

    if (is_admin() && !defined('DOING_AJAX')) {
        return 'dashboard';
    }

    return 'frontend';
}
```

### 3. Gutenberg Support

Framework hỗ trợ Gutenberg blocks thông qua kernels với conditional loading:

```php
public function registerHooks()
{
    if ($this->shouldLoadGutenbergFeatures()) {
        add_action('after_setup_theme', [$this, 'setupGutenbergSupport']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueueBlockEditorAssets']);
        add_action('wp_loaded', [$this, 'registerBlockTypes']);
    }
}
```

## Performance Considerations

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

- Service providers chỉ được load khi cần thiết
- Facades sử dụng lazy resolution
- Configuration được cached trong memory

### 4. Bootstrap Optimization

- Bootstrap chỉ chạy một lần per request
- Service providers được cached sau khi register
- Configuration được load từ cache khi có thể

### 5. Memory Management

- Container sử dụng weak references cho resolved instances
- Configuration repository sử dụng array access
- Logging system có level filtering để giảm overhead

## Security Considerations

### 1. Configuration Security

- Sensitive data được lưu trong WordPress options
- Configuration keys được validate
- Database config được sanitize
- Cache keys được prefix để tránh conflicts

### 2. Request Validation

- Request type detection sử dụng WordPress constants
- AJAX requests được validate action parameter
- REST API requests được handle bởi WordPress

### 3. Error Handling

- Exceptions được catch và log
- Production mode ẩn sensitive information
- Debug mode chỉ hiển thị khi `WP_DEBUG = true`
- Error suppression system để filter unwanted messages

### 4. Cache Security

- Cache keys được prefix với `jankx_` để tránh conflicts
- Cache groups được sử dụng để isolate data
- Cache duration được limit để tránh stale data