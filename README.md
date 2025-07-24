# Jankx WordPress Theme Framework

> **Modern, High-Performance WordPress Theme Framework**

Jankx is a powerful WordPress theme framework built with modern architecture, focusing on performance, maintainability, and developer experience. It provides a robust foundation for creating WordPress themes with advanced features like Gutenberg integration, deferred service loading, and context-aware bootstrapping.

## 🚀 Quick Start

### Requirements
- **PHP**: >= 7.4
- **WordPress**: >= 5.0
- **Composer**: For dependency management

### Installation

#### Via Composer (Recommended)
```bash
composer create-project jankx/jankx my-theme -s dev
```

#### Manual Installation
```bash
# Clone the repository
git clone https://github.com/jankx/jankx.git my-theme

# Install dependencies
composer install

# Activate the theme in WordPress admin
```

## 🏗 Architecture Overview

Jankx 2.0 features a modern layered architecture designed for optimal performance and maintainability:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Blocks    │  │   Layouts   │  │  Templates  │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Services  │  │   Helpers   │  │   Managers  │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │    Kernel   │  │   Container │  │  Bootstrap  │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                     WordPress Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │    Hooks    │  │   Filters   │  │   Actions   │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Key Features

### 🎯 **Context-Aware Bootstrapping**
- **Smart Context Detection**: Automatically detects and loads appropriate services based on current context (Admin, Frontend, API, CLI, Gutenberg)
- **Deferred Service Loading**: Only loads services when actually needed, improving performance
- **Priority-Based Execution**: Bootstrappers execute in optimal order for maximum efficiency

### 🧩 **Modern Gutenberg Integration**
- **Block Registry System**: Easy registration and management of custom blocks
- **Layout Manager**: Advanced layout system with drag-and-drop capabilities
- **Partial Hydration**: Optimized frontend rendering for better performance
- **AJAX Handler**: Seamless communication between editor and frontend

### ⚡ **Performance Optimizations**
- **Lazy Loading**: Services are loaded only when required
- **Context-Aware Loading**: Loads only context-relevant services
- **Performance Monitoring**: Built-in metrics for load times and memory usage
- **Service Caching**: Intelligent caching to avoid redundant loading

### 🔧 **Developer Experience**
- **Service Container**: Dependency injection with Illuminate Container
- **Facade Pattern**: Clean, expressive API for common operations
- **Comprehensive Logging**: Built-in logging system with multiple levels
- **Error Handling**: Graceful error handling with detailed reporting

## 🏛 Core Components

### Kernel System
```php
// Context detection and kernel bootstrapping
$kernelManager = new KernelManager($container);
$kernelManager->boot();

// Automatic context detection
// CLI → Gutenberg AJAX → Cron → REST API → Admin → Frontend
```

### Bootstrapper System
```php
// Priority-based execution order
CoreBootstrapper (5) → ThemeBootstrapper (10) → FrontendBootstrapper (15)
→ AdminBootstrapper (20) → APIBootstrapper (25) → CLIBootstrapper (30)
→ WooCommerceBootstrapper (40)
```

### Service Management
```php
// Context-aware service registration
ContextualServiceRegistry::register('admin', AdminServiceProvider::class);
ContextualServiceRegistry::register('frontend', FrontendServiceProvider::class);

// Deferred service loading
DeferredService::resolve('service.name');
```

## 📚 Documentation

Comprehensive documentation is available at [https://jankx.github.io](https://jankx.github.io)

### Architecture Guides
- [Bootstrapper Structure](./docs/architecture/bootstrapper-structure.md)
- [Kernel System](./docs/architecture/kernel-system.md)
- [Service Container](./docs/architecture/service-container.md)
- [Deferred Service Context](./docs/architecture/deferred-service-context.md)

### Development Guides
- [Best Practices](./docs/development/best-practices.md)
- [Testing](./docs/development/testing.md)
- [Troubleshooting](./docs/development/troubleshooting.md)

### Gutenberg Guides
- [Block Registration](./docs/gutenberg/block-registration.md)
- [Layout System](./docs/gutenberg/layout-system.md)
- [AJAX System](./docs/gutenberg/ajax-system.md)

## 🛠 Usage Examples

### Creating a Custom Block
```php
<?php
namespace MyTheme\Blocks;

use Jankx\Gutenberg\Blocks\AbstractBlock;

class MyCustomBlock extends AbstractBlock
{
    public static function getBlockName()
    {
        return 'my-theme/my-custom-block';
    }

    public static function render($attributes, $content)
    {
        return '<div class="my-custom-block">' . $content . '</div>';
    }
}
```

### Registering Services
```php
<?php
// Register services for specific contexts
ContextualServiceRegistry::register('admin', AdminServiceProvider::class);
ContextualServiceRegistry::register('frontend', FrontendServiceProvider::class);

// Defer heavy services
DeferredService::defer('frontend', function() {
    return new HeavyService();
});
```

### Creating Custom Bootstrappers
```php
<?php
namespace MyTheme\Bootstrappers;

use Jankx\Bootstrappers\AbstractBootstrapper;

class CustomBootstrapper extends AbstractBootstrapper
{
    protected $priority = 15;

    public function getName(): string
    {
        return 'custom';
    }

    public function shouldRun(): bool
    {
        return !is_admin();
    }

    public function bootstrap(Container $container): void
    {
        // Your initialization logic here
    }
}
```

## 🔄 Migration Guide

If you're upgrading from Jankx 1.x, check our [Migration Guide](./docs/migration-guide.md) for detailed upgrade instructions.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### Development Setup
```bash
# Clone the repository
git clone https://github.com/jankx/jankx.git

# Install dependencies
composer install

# Run tests
composer test

# Build assets
npm install && npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./license.txt) file for details.

## 🙏 Acknowledgments

- Built on top of [Illuminate Container](https://github.com/illuminate/container)
- Inspired by modern PHP frameworks like Laravel
- Designed for WordPress developers who want modern tooling

## 📞 Support

- **Documentation**: [https://jankx.github.io](https://jankx.github.io)
- **Issues**: [GitHub Issues](https://github.com/jankx/jankx/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jankx/jankx/discussions)

---

**Made with ❤️ for the WordPress community**