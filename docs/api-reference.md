# Jankx Framework API Reference

## Table of Contents
- [Application](#application)
- [Facades](#facades)
- [Service Providers](#service-providers)
- [Bootstrappers](#bootstrappers)
- [Kernels](#kernels)
- [Helpers](#helpers)
- [Configuration](#configuration)

## Application

### Jankx\Foundation\Application

The main application container that manages the framework lifecycle.

#### Methods

##### `version()`
Get the framework version.
```php
$version = app()->version(); // Returns "2.0.0"
```

##### `basePath($path = '')`
Get the base path of the application.
```php
$basePath = app()->basePath(); // Returns theme directory
$configPath = app()->basePath('config'); // Returns config directory
```

##### `configPath($path = '')`
Get the configuration path.
```php
$configPath = app()->configPath(); // Returns config directory
```

##### `bootstrapPath($path = '')`
Get the bootstrap path.
```php
$bootstrapPath = app()->bootstrapPath(); // Returns bootstrap directory
```

##### `bootstrapWith(array $bootstrappers)`
Bootstrap the application with given bootstrappers.
```php
app()->bootstrapWith([
    LoadConfiguration::class,
    RegisterFacades::class,
    BootProviders::class,
]);
```

##### `register($provider)`
Register a service provider.
```php
app()->register(MyServiceProvider::class);
```

##### `boot()`
Boot the application.
```php
app()->boot();
```

## Facades

### App Facade

Access the application instance.

```php
use Jankx\Facades\App;

// Get application instance
$app = App::getInstance();

// Check if application is booted
$booted = App::hasBeenBootstrapped();
```

### Config Facade

Access configuration values.

```php
use Jankx\Facades\Config;

// Get config value
$name = Config::get('app.name');

// Set config value
Config::set('app.debug', true);

// Check if config exists
$exists = Config::has('app.providers');
```

### Asset Facade

Manage theme assets.

```php
use Jankx\Facades\Asset;

// Enqueue stylesheet
Asset::enqueueStyle('theme-style', 'assets/css/style.css');

// Enqueue script
Asset::enqueueScript('theme-script', 'assets/js/app.js', ['jquery']);

// Add inline styles
Asset::addInlineStyle('custom-css', 'body { background: red; }');

// Add inline scripts
Asset::addInlineScript('custom-js', 'console.log("Hello");');
```

### Log Facade

Logging functionality.

```php
use Jankx\Facades\Log;

// Log messages
Log::info('User logged in');
Log::error('Database connection failed');
Log::debug('Debug information');
Log::warning('Deprecated function used');
```

### Cache Facade

Caching functionality.

```php
use Jankx\Facades\Cache;

// Store cache
Cache::put('key', 'value', 3600);

// Get cache
$value = Cache::get('key');

// Check if exists
$exists = Cache::has('key');

// Delete cache
Cache::forget('key');

// Clear all cache
Cache::flush();
```

### URL Facade

URL management.

```php
use Jankx\Facades\URL;

// Get current URL
$current = URL::current();

// Get home URL
$home = URL::home();

// Get theme URL
$theme = URL::theme();

// Get asset URL
$asset = URL::asset('css/style.css');
```

## Service Providers

### Creating a Service Provider

```php
<?php

namespace MyTheme\Providers;

use Jankx\Support\Providers\ServiceProvider;

class MyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->singleton('my-service', function ($app) {
            return new MyService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        // Boot logic here
    }
}
```

### Creating a Lazy Service Provider

```php
<?php

namespace MyTheme\Providers;

use Jankx\Support\Providers\ServiceProvider;

class LazyServiceProvider extends ServiceProvider
{
    /**
     * The services that this provider provides
     */
    protected $provides = [
        'expensive.service',
        'heavy.calculator'
    ];

    /**
     * Register any application services.
     */
    public function register(Application $app)
    {
        $app->singleton('expensive.service', function ($app) {
            return new ExpensiveService();
        });
    }

    /**
     * Check if this provider provides a specific service
     */
    public static function provides($service)
    {
        return in_array($service, [
            'expensive.service',
            'heavy.calculator'
        ]);
    }
}
```

### Registering Service Providers

```php
// In config/app.php
return [
    'providers' => [
        MyTheme\Providers\MyServiceProvider::class,
    ],
];
```

### Registering Lazy Service Providers

```php
// Register lazy service provider
$app->registerLazy(LazyServiceProvider::class);

// Use LazyLoader helper
use Jankx\Support\LazyLoader;

// Set application in LazyLoader
LazyLoader::setApp($app);

// Get lazy service
$service = LazyLoader::service('expensive.service');

// Check if service is lazy
if (LazyLoader::isLazy('expensive.service')) {
    // Service is lazy loaded
}

// Monitor performance
LazyLoader::monitor('expensive.service');

// Clear cache
LazyLoader::clearCache();
```

## Bootstrappers

### Creating a Bootstrapper

```php
<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Foundation\Application;

class MyBootstrapper
{
    /**
     * Bootstrap the given application.
     */
    public function bootstrap(Application $app)
    {
        // Bootstrap logic here
    }
}
```

### Available Bootstrappers

- `LoadConfiguration` - Load configuration files
- `RegisterLogger` - Register logging system
- `RegisterFacades` - Register facade aliases
- `ThemeDataLoader` - Load theme data
- `BootChildTheme` - Bootstrap child theme composer
- `RegisterProviders` - Register service providers
- `BootProviders` - Boot service providers

## Kernels

### HTTP Kernels

#### FrontendKernel
Handles frontend requests.

```php
use App\Http\FrontendKernel;

$kernel = new FrontendKernel($app);
$kernel->init($request);
```

#### DashboardKernel
Handles admin dashboard requests.

```php
use App\Http\DashboardKernel;

$kernel = new DashboardKernel($app);
$kernel->init($request);
```

#### AdminAjaxKernel
Handles AJAX requests.

```php
use App\Http\AdminAjaxKernel;

$kernel = new AdminAjaxKernel($app);
$kernel->init($request);
```

#### RestApiKernel
Handles REST API requests.

```php
use App\Http\RestApiKernel;

$kernel = new RestApiKernel($app);
$kernel->init($request);
```

### Console Kernels

#### WpCliKernel
Handles WP-CLI commands.

```php
use App\Console\WpCliKernel;

$kernel = new WpCliKernel($app);
$exitCode = $kernel->handle($args);
```

#### WpCronKernel
Handles WP-Cron tasks.

```php
use App\Console\WpCronKernel;

$kernel = new WpCronKernel($app);
$exitCode = $kernel->handle($args);
```

## Helpers

### Environment Helper

```php
use Jankx\Helper\Environment;

// Check if WP-CLI
$isCli = Environment::isWpCli();

// Check if WP-Cron
$isCron = Environment::isWpCron();

// Check if debug mode
$isDebug = Environment::isDebugLog();

// Check if development mode
$isDev = Environment::isDevelopment();
```

### LazyLoader Helper

```php
use Jankx\Support\LazyLoader;

// Set application
LazyLoader::setApp($app);

// Get lazy service
$service = LazyLoader::service('expensive.service');

// Check if service is lazy
$isLazy = LazyLoader::isLazy('expensive.service');

// Monitor performance
LazyLoader::monitor('expensive.service');

// Get cached services
$cached = LazyLoader::getCachedServices();

// Clear cache
LazyLoader::clearCache();
```

### Request Helper

```php
use Jankx\Http\Request;

// Capture current request
$request = Request::capture();

// Get request type
$type = $request->getRequestType(); // frontend, dashboard, admin_ajax, rest_api

// Get path info
$path = $request->getPathInfo();

// Get method
$method = $request->getMethod();
```

## Configuration

### App Configuration

```php
// config/app.php
return [
    'name' => 'Jankx Framework',
    'version' => '2.0.0',
    'providers' => [
        // Service providers
    ],
    'aliases' => [
        // Facade aliases
    ],
];
```

### Error Configuration

```php
// config/error.php
return [
    'display_errors' => WP_DEBUG,
    'log_errors' => true,
    'error_reporting' => E_ALL,
];
```

### Layout Configuration

```php
// config/layout.php
return [
    'default_layout' => 'default',
    'layouts' => [
        'default' => 'templates/default.html',
        'full-width' => 'templates/full-width.html',
    ],
];
```

### Theme Configuration

```php
// config/theme.php
return [
    'name' => 'Bookix',
    'version' => '1.0.0',
    'text_domain' => 'bookix',
    'supports' => [
        'post-thumbnails',
        'custom-logo',
        'html5',
    ],
];
```

## Examples

### Creating a Custom Service

```php
<?php

namespace MyTheme\Services;

class MyService
{
    public function doSomething()
    {
        return 'Hello from MyService!';
    }
}
```

### Registering the Service

```php
<?php

namespace MyTheme\Providers;

use Jankx\Support\Providers\ServiceProvider;
use MyTheme\Services\MyService;

class MyServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton('my-service', function ($app) {
            return new MyService();
        });
    }
}
```

### Using the Service

```php
// Via container
$service = app('my-service');
$result = $service->doSomething();

// Via dependency injection
public function __construct(MyService $service)
{
    $this->service = $service;
}
```

### Creating a Custom Facade

```php
<?php

namespace MyTheme\Facades;

use Jankx\Facades\Facade;

class MyFacade extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'my-service';
    }
}
```

### Using the Facade

```php
use MyTheme\Facades\MyFacade;

$result = MyFacade::doSomething();
```

## Best Practices

1. **Use Service Providers** for registering services
2. **Use Facades** for frequently accessed services
3. **Use Bootstrappers** for initialization logic
4. **Use Configuration** for settings
5. **Use Helpers** for common utilities
6. **Follow PSR-4** autoloading standards
7. **Use Dependency Injection** when possible
8. **Log important events** using Log facade
9. **Cache expensive operations** using Cache facade
10. **Handle errors gracefully** using try-catch blocks