# Jankx Framework Development Guide

## Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Creating Themes](#creating-themes)
- [Customization](#customization)
- [Testing](#testing)
- [Debugging](#debugging)
- [Performance](#performance)
- [Deployment](#deployment)
- [Best Practices](#best-practices)

## Getting Started

### Prerequisites

- PHP 7.4 or higher
- WordPress 5.0 or higher
- Composer
- Node.js and npm (for asset compilation)

### Installation

1. **Clone the framework**
```bash
git clone https://github.com/your-org/jankx-framework.git
cd jankx-framework
```

2. **Install PHP dependencies**
```bash
composer install
```

3. **Install Node.js dependencies**
```bash
cd resources
npm install
```

4. **Build assets**
```bash
npm run build:dev
```

### Quick Start

1. **Create a new theme**
```bash
php wp-cli jankx make:theme my-theme
```

2. **Activate the theme**
```bash
wp theme activate my-theme
```

3. **Start development**
```bash
npm run watch
```

## Project Structure

```
bookix/
├── app/                          # Application logic
│   ├── Console/                  # WP-CLI commands
│   ├── Http/                     # HTTP kernels
│   └── Providers/                # Service providers
├── assets/                       # Compiled assets
│   ├── css/
│   ├── js/
│   └── fonts/
├── config/                       # Configuration files
│   ├── app.php
│   ├── error.php
│   └── layout.php
├── docs/                         # Documentation
├── includes/                     # Framework core
│   ├── Jankx/                    # Framework classes
│   ├── boot/                     # Bootstrap files
│   └── framework.php
├── parts/                        # Template parts
│   ├── header.html
│   ├── footer.html
│   └── sidebar.html
├── resources/                    # Source assets
│   ├── assets/
│   ├── blocks/
│   └── patterns/
├── templates/                    # Page templates
├── tests/                        # Unit tests
├── vendor/                       # Composer dependencies
├── composer.json
├── functions.php
├── package.json
├── style.css
├── theme.json
└── webpack.mix.js
```

## Development Workflow

### 1. Local Development

```bash
# Start development server
npm run watch

# Build for production
npm run build:prod

# Run tests
composer test

# Check code style
composer cs-check
```

### 2. Asset Compilation

```bash
# Development with hot reload
npm run watch

# Production build
npm run build:prod

# Watch with polling (for Docker)
npm run watch-poll
```

### 3. Database Management

```bash
# Export database
wp db export backup.sql

# Import database
wp db import backup.sql

# Reset database
wp db reset --yes
```

### 4. Cache Management

```bash
# Clear all caches
wp cache flush

# Clear Jankx cache
wp jankx cache:clear

# Clear object cache
wp cache delete --all
```

## Creating Themes

### 1. Theme Structure

```
my-theme/
├── composer.json                 # PHP dependencies
├── functions.php                 # Theme functions
├── style.css                    # Theme stylesheet
├── theme.json                   # Block theme config
├── parts/                       # Template parts
├── templates/                   # Page templates
├── src/                         # PHP source code
│   ├── Providers/               # Service providers
│   ├── Services/                # Business logic
│   └── helpers.php              # Helper functions
└── resources/                   # Assets
    ├── scss/
    ├── js/
    └── webpack.mix.js
```

### 2. Theme Functions

```php
<?php
/**
 * Theme Name: My Theme
 * Template: bookix
 */

// Load Jankx Framework
require_once get_template_directory() . '/includes/framework.php';

// Theme setup
add_action('after_setup_theme', function() {
    // Add theme support
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');

    // Register menus
    register_nav_menus([
        'primary' => 'Primary Menu',
        'footer' => 'Footer Menu',
    ]);
});

// Load theme assets
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('my-theme-style', get_stylesheet_uri());
    wp_enqueue_script('my-theme-script', get_stylesheet_directory_uri() . '/assets/js/app.js');
});
```

### 3. Service Providers

```php
<?php

namespace MyTheme\Providers;

use Jankx\Support\Providers\ServiceProvider;

class ThemeServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register services
        $app->singleton('theme.config', function ($app) {
            return new ThemeConfig();
        });
    }

    public function boot(Application $app)
    {
        // Boot theme services
        add_action('wp_enqueue_scripts', [$this, 'enqueueAssets']);
    }

    public function enqueueAssets()
    {
        // Enqueue theme assets
    }
}
```

### 4. Lazy Service Providers

For expensive services that should only be loaded when needed:

```php
<?php

namespace MyTheme\Providers;

use Jankx\Support\Providers\ServiceProvider;

class LazyServiceProvider extends ServiceProvider
{
    protected $provides = [
        'expensive.service',
        'heavy.calculator'
    ];

    public function register(Application $app)
    {
        $app->singleton('expensive.service', function ($app) {
            return new ExpensiveService();
        });
    }

    public static function provides($service)
    {
        return in_array($service, [
            'expensive.service',
            'heavy.calculator'
        ]);
    }
}
```

### 5. Using Lazy Loading

```php
// Register lazy provider
$app->registerLazy(LazyServiceProvider::class);

// Use LazyLoader helper
use Jankx\Support\LazyLoader;

LazyLoader::setApp($app);

// Service is only created when requested
$service = LazyLoader::service('expensive.service');
```

## Customization

### 1. Custom Service Providers

```php
<?php

namespace MyTheme\Providers;

use Jankx\Support\Providers\ServiceProvider;

class CustomServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton('custom.service', function ($app) {
            return new CustomService();
        });
    }
}
```

### 2. Custom Facades

```php
<?php

namespace MyTheme\Facades;

use Jankx\Facades\Facade;

class CustomFacade extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'custom.service';
    }
}
```

### 3. Custom Bootstrappers

```php
<?php

namespace MyTheme\Bootstrap;

use Jankx\Foundation\Application;

class CustomBootstrapper
{
    public function bootstrap(Application $app)
    {
        // Custom bootstrap logic
    }
}
```

### 4. Custom Kernels

```php
<?php

namespace MyTheme\Http;

use Jankx\Foundation\Http\Kernel;

class CustomKernel extends Kernel
{
    protected $bootstrappers = [
        // Custom bootstrappers
    ];

    protected $middleware = [
        // Custom middleware
    ];
}
```

## Testing

### 1. Unit Tests (PHP)

```php
<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use MyTheme\Services\MyService;

class MyServiceTest extends TestCase
{
    public function test_my_service_works()
    {
        $service = new MyService();
        $result = $service->doSomething();

        $this->assertEquals('expected', $result);
    }
}
```

### 2. Block Unit Tests (JS)

For JavaScript unit tests (WordPress Blocks), please refer to [resources/UNIT_TESTING.md](../resources/UNIT_TESTING.md).

The tests use **Jest** and **React Testing Library**.

```bash
# Run all block tests
npm run test:unit
```

### 3. Integration Tests

```php
<?php

namespace Tests\Integration;

use Tests\TestCase;

class ThemeTest extends TestCase
{
    public function test_theme_loads_correctly()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('My Theme');
    }
}
```

### 4. Running Tests

```bash
# Run PHP tests
composer test

# Run JS block tests
npm run test:unit
```

## Debugging

### 1. Debug Mode

```php
// Enable debug mode
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

### 2. Logging

```php
use Jankx\Facades\Log;

// Log messages
Log::info('User logged in', ['user_id' => 123]);
Log::error('Database error', ['error' => $e->getMessage()]);
Log::debug('Debug info', ['data' => $data]);
```

### 3. Debug Helpers

```php
// Dump and die
dd($variable);

// Dump without die
dump($variable);

// Debug backtrace
debug_backtrace();
```

### 4. WordPress Debug

```php
// Enable WordPress debug
define('SAVEQUERIES', true);

// Display queries
global $wpdb;
print_r($wpdb->queries);
```

## Performance

### 1. Caching

```php
use Jankx\Facades\Cache;

// Cache expensive operations
$result = Cache::remember('key', 3600, function() {
    return expensive_operation();
});
```

### 2. Asset Optimization

```php
// Minify CSS/JS in production
if (mix.inProduction()) {
    mix.version();
}
```

### 3. Database Optimization

```php
// Use prepared statements
$stmt = $wpdb->prepare("SELECT * FROM posts WHERE ID = %d", $post_id);

// Use transients for caching
set_transient('key', $data, 3600);
get_transient('key');
```

### 4. Image Optimization

```php
// Use WebP images
add_filter('wp_get_attachment_image_src', function($image, $attachment_id) {
    // Convert to WebP if supported
    return $image;
}, 10, 2);
```

## Deployment

### 1. Production Build

```bash
# Build assets for production
npm run build:prod

# Optimize autoloader
composer install --optimize-autoloader --no-dev

# Clear caches
wp cache flush
```

### 2. Environment Configuration

```php
// config/app.php
return [
    'debug' => defined('WP_DEBUG') ? WP_DEBUG : false,
    'cache' => !defined('WP_DEBUG') || !WP_DEBUG,
    'minify' => !defined('WP_DEBUG') || !WP_DEBUG,
];
```

### 3. Deployment Checklist

- [ ] Build assets for production
- [ ] Optimize autoloader
- [ ] Clear all caches
- [ ] Update database if needed
- [ ] Test functionality
- [ ] Monitor performance

### 4. CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.0'
      - name: Install dependencies
        run: composer install --no-dev
      - name: Build assets
        run: npm run build:prod
      - name: Deploy
        run: |
          # Deployment script
```

## Best Practices

### 1. Code Organization

- **Follow PSR-4** autoloading standards
- **Use namespaces** for all classes
- **Separate concerns** (business logic, presentation, data)
- **Keep functions small** and focused
- **Use meaningful names** for variables and functions

### 2. Security

- **Sanitize inputs** using WordPress functions
- **Escape outputs** using WordPress functions
- **Use nonces** for forms
- **Validate permissions** before actions
- **Keep dependencies updated**

### 3. Performance

- **Cache expensive operations**
- **Optimize database queries**
- **Minify assets** in production
- **Use lazy loading** for images
- **Implement pagination** for large datasets

### 4. Maintainability

- **Write documentation** for complex code
- **Use consistent coding standards**
- **Write unit tests** for business logic
- **Version control** everything
- **Review code** before merging

### 5. WordPress Standards

- **Follow WordPress coding standards**
- **Use WordPress hooks** and filters
- **Respect WordPress database schema**
- **Test with different WordPress versions**
- **Follow WordPress security guidelines**

## Troubleshooting

### Common Issues

1. **Assets not loading**
   - Check file paths
   - Verify webpack build
   - Check browser console

2. **Service not found**
   - Check service provider registration
   - Verify namespace
   - Check autoloader

3. **Cache issues**
   - Clear all caches
   - Check cache configuration
   - Verify cache permissions

4. **Performance issues**
   - Enable query monitoring
   - Check asset sizes
   - Optimize database queries

### Getting Help

- **Documentation**: Check the docs folder
- **Issues**: Create GitHub issue
- **Discussions**: Use GitHub discussions
- **Community**: Join our Discord server

## Resources

- [WordPress Developer Handbook](https://developer.wordpress.org/)
- [PHP Documentation](https://www.php.net/docs.php)
- [Composer Documentation](https://getcomposer.org/doc/)
- [Laravel Mix Documentation](https://laravel-mix.com/docs/)
- [Jankx Framework Documentation](https://jankx.dev/docs)