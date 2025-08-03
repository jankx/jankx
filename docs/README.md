# Jankx Framework Documentation

## 📚 Tài liệu chính

### 🚀 Getting Started
- [Getting Started](./getting-started.md) - Hướng dẫn bắt đầu với Jankx Framework
- [Architecture](./architecture.md) - Kiến trúc tổng quan của framework
- [Coding Rules](./coding-rules.md) - Quy tắc coding và best practices

### 🔧 Core Components
- [Package Architecture](./package-architecture.md) - Kiến trúc package system
- [Translation Guide](./translation-guide.md) - Hướng dẫn đa ngôn ngữ
- [WP CLI Commands](./wp-cli-commands.md) - Các lệnh WP CLI

### 🎨 Gutenberg Integration
- [Gutenberg Block Development Flow](./gutenberg/gutenberg-block-development-flow.md)
- [Gutenberg Simple Architecture](./gutenberg/gutenberg-simple-architecture.md)
- [Jankx Query Loop Block](./gutenberg/jankx-query-loop-block.md)
- [Jankx Query Loop Classes](./gutenberg/jankx-query-loop-classes.md)
- [Register Custom Patterns](./gutenberg/register-custom-patterns.md)

### 🌟 Child Theme Boot
- [Child Theme Boot](./child-theme-boot.md) - Tài liệu chi tiết về Child Theme Boot
- [Child Theme Quick Start](./child-theme-quick-start.md) - Hướng dẫn nhanh cho Child Theme Boot

## 🎯 Tính năng chính

### ✅ Framework Features
- **Dependency Injection Container** - Quản lý services và dependencies
- **Service Providers** - Modular service registration
- **Facades** - Simplified access to framework services
- **Configuration Management** - Centralized configuration system
- **Logging System** - Advanced logging with multiple handlers
- **Asset Management** - CSS/JS asset optimization
- **Menu & Sidebar Management** - Dynamic menu and sidebar system

### ✅ Gutenberg Integration
- **Custom Blocks** - Tạo custom Gutenberg blocks
- **Block Patterns** - Reusable block patterns
- **Query Loop Blocks** - Advanced query loop functionality
- **Block Registration** - Easy block registration system

### ✅ Child Theme Boot
- **Composer Integration** - Child theme composer dependencies
- **PSR-4 Autoloading** - Modern PHP autoloading
- **Service Classes** - Business logic organization
- **Helper Functions** - Global helper functions
- **Error Handling** - Graceful error handling
- **Testing Support** - Comprehensive unit testing

## 🚀 Quick Start

### 1. Cài đặt Jankx Framework
```bash
# Clone repository
git clone https://github.com/your-org/jankx-framework.git

# Install dependencies
composer install
```

### 2. Tạo Child Theme với Composer
```bash
# Tạo child theme
mkdir wp-content/themes/my-child-theme
cd wp-content/themes/my-child-theme

# Tạo composer.json
cat > composer.json << 'EOF'
{
    "name": "my-theme/child-theme",
    "autoload": {
        "psr-4": {
            "MyChildTheme\\": "src/"
        }
    }
}
EOF

# Install dependencies
composer install
```

### 3. Tạo Service Class
```php
// src/Services/ExampleService.php
<?php

namespace MyChildTheme\Services;

class ExampleService
{
    public function test() {
        return 'Child theme is working!';
    }
}
```

### 4. Sử dụng trong Functions.php
```php
// functions.php
<?php

require_once get_template_directory() . '/includes/framework.php';

if (bookix_child_has_composer()) {
    $service = new \MyChildTheme\Services\ExampleService();
    echo $service->test();
}
```

## 🧪 Testing

### Unit Tests
```bash
# Chạy tất cả tests
vendor/bin/phpunit

# Chạy specific test
vendor/bin/phpunit tests/Foundation/Bootstrap/BootChildThemeTest.php
```

### Child Theme Testing
```bash
# Test child theme composer
php wp-content/themes/my-child-theme/test-composer.php
```

## 📖 Examples

### Gutenberg Block
```php
// Tạo custom block
class MyCustomBlock extends Block
{
    public function render($attributes, $content)
    {
        return '<div class="my-block">' . $content . '</div>';
    }
}
```

### Service Provider
```php
// Tạo service provider
class MyServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton('my-service', MyService::class);
    }
}
```

### Child Theme Service
```php
// Child theme service
namespace MyChildTheme\Services;

class ThemeService
{
    public function getOption($key, $default = null)
    {
        return get_option("child_theme_{$key}", $default);
    }
}
```

## 🔧 Development

### Debug Mode
```php
// Enable debug logging
define('JANKX_DEBUG_LOG', true);
```

### Asset Development
```bash
# Watch assets for development
npm run watch

# Build for production
npm run build
```

### Composer Development
```bash
# Update autoloader
composer dump-autoload

# Install new package
composer require monolog/monolog
```

## 📚 API Reference

### Facades
- `App` - Application container access
- `Config` - Configuration management
- `Log` - Logging system
- `Asset` - Asset management
- `Menu` - Menu management
- `Sidebar` - Sidebar management

### Helper Functions
- `jankx_app()` - Get application instance
- `jankx_config()` - Get configuration value
- `bookix_child_has_composer()` - Check child theme composer
- `bookix_child_get_composer_info()` - Get composer info

### Bootstrap Classes
- `LoadConfiguration` - Load framework configuration
- `RegisterFacades` - Register framework facades
- `BootChildTheme` - Child theme composer boot
- `RegisterProviders` - Register service providers

## 🐛 Troubleshooting

### Common Issues
1. **Composer not loading** - Check composer.json and vendor directory
2. **Classes not autoloading** - Run `composer dump-autoload`
3. **Assets not loading** - Check asset paths and permissions
4. **Configuration not loading** - Check config files and permissions

### Debug Commands
```bash
# Check framework status
wp jankx status

# Clear cache
wp jankx cache:clear

# Debug composer
wp jankx debug:composer
```

## 🤝 Contributing

### Development Setup
```bash
# Clone repository
git clone https://github.com/your-org/jankx-framework.git

# Install dependencies
composer install
npm install

# Run tests
vendor/bin/phpunit
```

### Code Standards
- Follow PSR-4 autoloading standards
- Use PHP 7.4+ features
- Follow WordPress coding standards
- Write comprehensive tests

## 📄 License

Jankx Framework is licensed under the GPL v2 or later.

## 🆘 Support

- **Documentation**: [docs/](./)
- **Issues**: [GitHub Issues](https://github.com/your-org/jankx-framework/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/jankx-framework/discussions)

---

**Jankx Framework** - Modern WordPress theme framework with Gutenberg integration and Child Theme Boot support.