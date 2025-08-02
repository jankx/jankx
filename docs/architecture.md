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
- Configuration management
- Bootstrap orchestration
- Service provider lifecycle

### 2. Bootstrap Process

Framework sử dụng 6 bootstrap classes theo thứ tự:

```php
protected $bootstrappers = [
    LoadConfiguration::class,      // Load config files
    HandleExceptions::class,       // Setup error handling
    RegisterLogger::class,         // Register logging
    RegisterFacades::class,        // Register facades
    RegisterProviders::class,      // Register service providers
    BootProviders::class,          // Boot all providers
];
```

**Bootstrap Flow:**
1. **LoadConfiguration**: Load config từ `config/` directory và database
2. **HandleExceptions**: Setup exception handlers và error reporting
3. **RegisterLogger**: Register logging system với WordPress
4. **RegisterFacades**: Register App, Config, Log facades
5. **RegisterProviders**: Load và register service providers từ config
6. **BootProviders**: Call `boot()` method trên tất cả providers

### 3. Request Flow

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

### 4. Kernel Architecture

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

### 5. Service Provider System

#### Contract

```php
interface ServiceProvider
{
    public function register(Application $app);
    public function boot(Application $app);
}
```

#### Abstract Implementation

```php
abstract class ServiceProvider implements ServiceProviderContract
{
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }
}
```

#### Provider Registration

Providers được đăng ký theo request type:

```php
'http' => [
    'frontend' => [FrontendServiceProvider::class],
    'admin' => [AdminServiceProvider::class],
    'rest_api' => [RestApiServiceProvider::class],
    'admin_ajax' => [AdminAjaxServiceProvider::class],
],
'console' => [
    'wp_cli' => [WpCliServiceProvider::class],
    'wp_cron' => [WpCronServiceProvider::class],
]
```

### 6. Configuration System

#### Repository Pattern

```php
class Repository implements ArrayAccess, RepositoryContract
{
    protected $items = [];

    public function get($key, $default = null);
    public function set($key, $value = null);
    public function has($key);
    public function all();
}
```

#### Configuration Sources

1. **File Configuration**: `config/app.php`, `config/providers.php`
2. **Database Configuration**: WordPress options với key `jankx_config`
3. **Runtime Configuration**: Dynamic configuration via Config facade

#### Configuration Access

```php
// Via Facade
$value = Config::get('app.name');

// Via Container
$config = $app->make('config');
$value = $config->get('app.name');
```

### 7. Facade System

#### Base Facade

```php
abstract class Facade
{
    protected static $app;
    protected static $resolvedInstance;

    public static function setFacadeApplication($app);
    public static function getFacadeRoot();
    public static function __callStatic($method, $args);
}
```

#### Available Facades

- **App**: Application container access
- **Config**: Configuration management
- **Log**: Logging functionality

### 8. Logging System

#### Logger Implementation

```php
class Logger
{
    const EMERGENCY = 'emergency';
    const ALERT     = 'alert';
    const CRITICAL  = 'critical';
    const ERROR     = 'error';
    const WARNING   = 'warning';
    const NOTICE    = 'notice';
    const INFO      = 'info';
    const DEBUG     = 'debug';
}
```

#### Logging Rules

- Chỉ log warning level trở lên
- Debug logs chỉ khi `WP_DEBUG = true`
- Có thể enable tất cả logs với `JANKX_LOG_ALL`

### 9. Environment Detection

```php
class Environment
{
    public static function isDebugLog();
    public static function isDevelopment();
    public static function isProduction();
    public static function isWpCli();
    public static function isWpCron();
    public static function isAdmin();
    public static function isFrontend();
}
```

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
```

### 4. Repository Pattern

Configuration management sử dụng repository pattern:

```php
$config = new Repository($items);
$value = $config->get('nested.key', 'default');
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

Framework hỗ trợ Gutenberg blocks thông qua kernels:

```php
public function registerHooks()
{
    add_action('after_setup_theme', [$this, 'setupGutenbergSupport']);
    add_action('enqueue_block_editor_assets', [$this, 'enqueueBlockEditorAssets']);
    add_action('wp_loaded', [$this, 'registerBlockTypes']);
}
```

## Performance Considerations

### 1. Lazy Loading

- Service providers chỉ được load khi cần thiết
- Facades sử dụng lazy resolution
- Configuration được cached trong memory

### 2. Bootstrap Optimization

- Bootstrap chỉ chạy một lần per request
- Service providers được cached sau khi register
- Configuration được load từ cache khi có thể

### 3. Memory Management

- Container sử dụng weak references cho resolved instances
- Configuration repository sử dụng array access
- Logging system có level filtering để giảm overhead

## Security Considerations

### 1. Configuration Security

- Sensitive data được lưu trong WordPress options
- Configuration keys được validate
- Database config được sanitize

### 2. Request Validation

- Request type detection sử dụng WordPress constants
- AJAX requests được validate action parameter
- REST API requests được handle bởi WordPress

### 3. Error Handling

- Exceptions được catch và log
- Production mode ẩn sensitive information
- Debug mode chỉ hiển thị khi `WP_DEBUG = true`