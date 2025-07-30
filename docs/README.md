# Jankx 2.0 Documentation

> **Modern WordPress Theme Framework - Development Version**

Jankx 2.0 là một WordPress theme framework hiện đại đang trong giai đoạn phát triển, sử dụng kiến trúc layered architecture với dependency injection, service container và context-aware bootstrapping.

## 🚧 Development Status

**⚠️ Lưu ý:** Jankx 2.0 hiện đang trong giai đoạn **phát triển** (Development). Tài liệu này mô tả kiến trúc và tính năng đang được implement.

### Current Version: `2.0.0-dev`
- ✅ **Core Architecture**: Hoàn thành
- ✅ **Service Container**: Hoàn thành
- ✅ **Bootstrapper System**: Hoàn thành
- ✅ **Kernel System**: Hoàn thành
- ✅ **Configuration System**: Hoàn thành (Config Facade + Repository)
- ✅ **WordPress Integration**: Hoàn thành (Direct function calls)
- 🔄 **Gutenberg Integration**: Đang phát triển
- 🔄 **Performance System**: Đang phát triển
- 🔄 **Designer Tools**: Đang phát triển

## 🏗 Architecture Overview

### Core Components
```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Blocks    │  │   Layouts   │  │
│  │   (Dev)     │  │   (Dev)     │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Business Logic Layer        │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Services  │  │   Helpers   │  │
│  │   (Ready)   │  │   (Ready)   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Infrastructure Layer        │
│  ┌─────────────┐  ┌─────────────┐  │
│  │    Kernel   │  │   Container │  │
│  │   (Ready)   │  │   (Ready)   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         WordPress Layer             │
│  ┌─────────────┐  ┌─────────────┐  │
│  │    Hooks    │  │   Filters   │  │
│  │   (Ready)   │  │   (Ready)   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

## 🔧 Core Systems (Ready)

### 1. **Service Container** ✅
- Dependency Injection pattern
- Service lifecycle management
- Context-aware service loading
- Deferred service resolution

### 2. **Kernel System** ✅
- Context-aware bootstrapping
- Multiple kernel types (Admin, Frontend, CLI, API)
- Service registration and management
- Performance monitoring

### 3. **Bootstrapper System** ✅
- Priority-based execution
- Context detection
- Service registration
- Hook management

### 4. **Configuration System** ✅
- Config Facade for easy access
- Repository pattern implementation
- Context-aware configuration loading
- File-based configuration management

### 5. **Debug System** ✅
- Gutenberg blocks debug
- Performance monitoring
- Service resolution tracking
- Error handling

### 6. **WordPress Integration** ✅
- Direct WordPress function calls (no adapters)
- Centralized context detection via Kernel Facade
- Simplified service architecture
- Reduced complexity

## 🔄 Systems in Development

### 1. **Gutenberg Integration** 🔄
- Block registry system
- Frontend block rendering
- AJAX block handling
- Layout system

### 2. **Performance System** 🔄
- Asset optimization
- Core Web Vitals monitoring
- Lazy loading implementation
- Cache management

### 3. **Designer Tools** 🔄
- Figma integration
- Design token generation
- Component library
- Visual page builder

## 📚 Documentation Structure

### 🏗 Architecture (Core Systems)
- [Architecture Overview](./architecture/README.md) - Tổng quan kiến trúc
- [Kernel System](./architecture/kernel-system.md) - Core framework bootstrapping
- [Service Container](./architecture/service-container.md) - Dependency injection system
- [Bootstrapping Flow](./architecture/bootstrapping-flow.md) - Framework initialization
- [Bootstrapper Structure](./architecture/bootstrapper-structure.md) - Bootstrapper organization
- [Deferred Service Context](./architecture/deferred-service-context.md) - Lazy loading system

### 🔧 Development (Guidelines & Rules)
- [Development Overview](./development/README.md) - Tổng quan development
- [Coding Rules & Standards](./development/coding-rules.md) - **Comprehensive coding rules**
- [Unit Testing Rules](./development/unit-testing-rules.md) - **Complete testing guidelines**
- [Best Practices](./development/best-practices.md) - Development best practices
- [Code Review Guidelines](./development/code-review-guidelines.md) - Code review process
- [Logging Guidelines](./development/logging.md) - Logging standards
- [Troubleshooting](./development/troubleshooting.md) - Common issues and solutions

### 🐛 Debug & Monitoring
- [Debug System](./debug/debug-system.md) - Debug information system
- [Debug Quick Start](./debug/debug-quick-start.md) - Quick debug setup
- [Gutenberg Blocks Debug](./debug/gutenberg-blocks-debug.md) - Block debugging
- [Plugin Debug Integration](./debug/plugin-debug-integration.md) - Plugin integration

### 🎨 Systems in Development
- [Gutenberg Integration](./gutenberg/README.md) - Block editor integration (Dev)
- [Performance System](./performance/README.md) - Performance optimization (Dev)
- [Designer Tools](./designer/README.md) - Design-to-code tools (Dev)

### 🛠 Services & Components
- [Services Overview](./services/README.md) - Service architecture
- [User Service](./services/user-service.md) - User management service
- [Deferred Service Resolver](./services/deferred-service-resolver.md) - Lazy loading service

### 📄 Templates & Layouts
- [Templates Overview](./templates/README.md) - Template system
- [Block Templates](./templates/block-templates.md) - Gutenberg block templates
- [Layout Templates](./templates/layout-templates.md) - Layout system
- [Page Templates](./templates/page-templates.md) - Page templates

### 📝 Post Layout System
- [Post Layout Overview](./post-layout/README.md) - Post layout system
- [Dynamic Query Loop](./post-layout/dynamic-query-loop.md) - Dynamic content
- [Pattern Library](./post-layout/pattern-library.md) - Reusable patterns
- [Best Practices](./post-layout/best-practices.md) - Layout best practices
- [Migration Guide](./post-layout/migration-guide.md) - Migration from 1.x
- [Troubleshooting](./post-layout/troubleshooting.md) - Layout issues

### 🎯 CLI Tools
- [CLI Overview](./cli/README.md) - Command line tools
- [Commands Reference](./cli/commands-reference.md) - Available commands
- [Development Commands](./cli/development.md) - Development tools
- [Release Command](./cli/release-command.md) - Release management
- [CLI Examples](./cli/examples.md) - Usage examples

### 🎨 Assets & Design
- [Assets Overview](./assets/README.md) - Asset management
- [Asset Structure](./assets/structure.md) - Asset organization
- [Design System](./designer/design-system.md) - Design system
- [Advanced Workflow](./designer/advanced-workflow.md) - Advanced design workflow
- [Quick Start](./designer/quick-start.md) - Design quick start
- [Speed Optimization](./designer/speed-optimization.md) - Performance optimization
- [Workflow](./designer/workflow.md) - Design workflow

### 🔒 Security
- [Security Overview](./security/README.md) - Security guidelines
- [Security Guidelines](./security/guidelines.md) - Security best practices

### 📋 Core Documents
- [Principles](./principles.md) - **Core development principles**
- [Migration Guide](./migration-guide.md) - Migration from Jankx 1.x

## 🚀 Getting Started

### Prerequisites
- PHP 7.4+
- WordPress 5.0+
- Composer

### Installation (Development)
```bash
# Clone repository
git clone https://github.com/jankx/jankx-2.0.git

# Install dependencies
composer install

# Setup development environment
cp .env.example .env
```

### Basic Usage
```php
// Initialize framework
require_once get_template_directory() . '/includes/framework.php';

// Framework auto-bootstraps based on context
```

## 🔧 Development Guidelines

### 1. **Configuration Management**
```php
// Access configuration via Config Facade
$value = \Jankx\Facades\Config::get('app.providers.frontend');
$allConfig = \Jankx\Facades\Config::all();

// Set configuration
\Jankx\Facades\Config::set('custom.key', 'value');
```

### 2. **Service Development**
```php
// Create new service
class MyService
{
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    public function doSomething(): void
    {
        // Implementation
    }
}

// Register in bootstrapper
$this->container->singleton(MyService::class);
```

### 3. **WordPress Integration**
```php
// Direct WordPress function calls (no adapters)
$content = \get_the_content() ?: '';
$excerpt = \get_the_excerpt() ?: '';
$hasBlocks = \has_blocks($content);
$isAdmin = \is_admin();

// WordPress hooks
\add_action('init', [$this, 'initialize']);
\add_filter('the_content', [$this, 'processContent']);
```

### 4. **Context Detection**
```php
// Use Kernel Facade for context detection
$context = \Jankx\Facades\Kernel::getCurrentContext();

// Available contexts: frontend, admin, cli, api, ajax, not_found
```

### 5. **Bootstrapper Development**
```php
class MyBootstrapper extends AbstractBootstrapper
{
    public function bootstrap(Container $container): void
    {
        // Register services
        $container->singleton(MyService::class);

        // Setup hooks
        add_action('init', [$this, 'initialize']);
    }
}
```

### 6. **Testing**
```php
class MyServiceTest extends TestCase
{
    public function testServiceMethod(): void
    {
        $service = new MyService($this->container);
        $result = $service->doSomething();

        $this->assertNotNull($result);
    }
}
```

## 🐛 Known Issues

### Current Limitations
1. **Gutenberg Integration**: Chưa hoàn thiện, một số blocks chưa hoạt động
2. **Performance System**: Chưa implement đầy đủ
3. **Designer Tools**: Chưa có CLI tools
4. **Documentation**: Một số tài liệu mô tả tính năng chưa implement

### Workarounds
- Sử dụng WordPress core blocks thay vì custom blocks
- Implement performance optimization manually
- Sử dụng traditional theme development workflow

## 🤝 Contributing

### Development Setup
```bash
# Install development dependencies
composer install --dev

# Run tests
./vendor/bin/phpunit

# Run coding standards check
./vendor/bin/phpcs
```

### Code Standards
- PSR-4 autoloading
- PSR-12 coding style
- PHP 7.4+ features
- WordPress coding standards

## 📝 Changelog

### Version 2.0.0-dev (Current)
- ✅ Core architecture implementation
- ✅ Service container system
- ✅ Kernel and bootstrapper system
- ✅ Configuration system (Config Facade + Repository)
- ✅ WordPress integration (Direct function calls)
- ✅ Debug system
- 🔄 Gutenberg integration (in progress)
- 🔄 Performance system (in progress)
- 🔄 Designer tools (planned)

## 📞 Support

### Development Support
- **GitHub Issues**: [Submit issues](https://github.com/jankx/jankx-2.0/issues)
- **Discord**: [Development community](https://discord.gg/jankx)
- **Documentation**: [Development docs](./development/README.md)

### Production Use
⚠️ **Không khuyến nghị sử dụng trong production** cho đến khi release chính thức.

---

**Jankx 2.0** - Modern WordPress Theme Framework (Development Version) 🚧

*Last updated: Development Phase*
*Framework version: 2.0.0-dev*