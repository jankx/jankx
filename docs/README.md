# Jankx Framework Documentation

Welcome to the Jankx Framework documentation. This framework provides a modern, Laravel-inspired architecture for WordPress theme development.

## 📚 Documentation

### Core Documentation
- **[Getting Started](getting-started.md)** - Quick start guide for Jankx Framework
- **[Architecture](architecture.md)** - Framework architecture overview
- **[Coding Rules](coding-rules.md)** - Coding standards and best practices

### API & Development
- **[API Reference](api-reference.md)** - Complete API documentation
- **[Development Guide](development-guide.md)** - Comprehensive development guide

### Features
- **[Gutenberg Blocks](gutenberg/)** - Block development documentation
- **[Child Theme Boot](child-theme-boot.md)** - Child theme composer support
- **[Child Theme Quick Start](child-theme-quick-start.md)** - Quick setup for child themes

### Testing & Quality
- **[Testing Guide](testing-guide.md)** - Unit and integration testing
- **[Performance Guide](performance-guide.md)** - Optimization and caching
- **[Deployment Guide](deployment-guide.md)** - Production deployment

## 🚀 Quick Start

### Installation

```bash
# Clone the framework
git clone https://github.com/your-org/jankx-framework.git
cd jankx-framework

# Install dependencies
composer install
npm install

# Build assets
npm run build:dev
```

### Creating a Theme

```bash
# Create new theme
php wp-cli jankx make:theme my-theme

# Activate theme
wp theme activate my-theme
```

### Development

```bash
# Start development
npm run watch

# Run tests
composer test

# Build for production
npm run build:prod
```

## 🏗️ Architecture

Jankx Framework follows a Laravel-inspired architecture:

- **Service Container** - Dependency injection and service management
- **Service Providers** - Modular service registration
- **Facades** - Static-like access to services
- **Bootstrappers** - Application initialization
- **Kernels** - Request handling and routing

## 📖 Key Features

- **Modern PHP** - PSR-4 autoloading, namespaces, type hints
- **WordPress Integration** - Seamless WordPress compatibility
- **Asset Management** - Laravel Mix for CSS/JS compilation
- **Testing Support** - PHPUnit integration
- **Child Theme Support** - Composer autoloading for child themes
- **Gutenberg Ready** - Block editor support
- **Performance Optimized** - Caching and optimization features

## 🔧 Configuration

### Basic Configuration

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

### Environment Setup

```php
// wp-config.php
define('WP_DEBUG', true);
define('JANKX_DEBUG', true);
```

## 🧪 Testing

```bash
# Run all tests
composer test

# Run specific test
composer test -- --filter=MyTest

# Generate coverage report
composer test -- --coverage-html coverage/
```

## 📦 Package Management

### PHP Dependencies

```bash
# Install dependencies
composer install

# Add new package
composer require vendor/package

# Update dependencies
composer update
```

### Node.js Dependencies

```bash
# Install dependencies
npm install

# Add new package
npm install package-name

# Update dependencies
npm update
```

## 🚀 Deployment

### Production Build

```bash
# Build assets
npm run build:prod

# Optimize autoloader
composer install --optimize-autoloader --no-dev

# Clear caches
wp cache flush
```

### Environment Variables

```bash
# Production environment
WP_DEBUG=false
JANKX_DEBUG=false
JANKX_CACHE=true
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](contributing.md) for details.

### Development Setup

```bash
# Fork and clone
git clone https://github.com/your-username/jankx-framework.git
cd jankx-framework

# Install dependencies
composer install
npm install

# Run tests
composer test

# Check code style
composer cs-check
```

## 📞 Support

- **Documentation**: Check the docs folder
- **Issues**: [GitHub Issues](https://github.com/your-org/jankx-framework/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/jankx-framework/discussions)
- **Community**: [Discord Server](https://discord.gg/jankx)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Laravel](https://laravel.com/) - For architectural inspiration
- [WordPress](https://wordpress.org/) - For the amazing platform
- [PHP](https://php.net/) - For the language
- [Composer](https://getcomposer.org/) - For dependency management
- [Laravel Mix](https://laravel-mix.com/) - For asset compilation

---

**Made with ❤️ by the Jankx Framework Team**