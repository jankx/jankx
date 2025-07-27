# Jankx 2.0 Documentation

## Overview

Jankx 2.0 là một WordPress theme framework hiện đại được xây dựng với kiến trúc modular và hệ thống bootstrapping tiên tiến. Tài liệu này cung cấp hướng dẫn chi tiết cho việc phát triển và sử dụng Jankx 2.0.

## Table of Contents

### 🚀 Getting Started
- [Quick Start Guide](development/README.md) - Hướng dẫn bắt đầu nhanh
- [Installation](development/README.md#installation) - Cài đặt và setup
- [Configuration](development/README.md#configuration) - Cấu hình cơ bản

### 🏗️ Architecture
- [Bootstrapper Structure](architecture/bootstrapper-structure.md) - Cấu trúc bootstrapper
- [Bootstrapping Flow](architecture/bootstrapping-flow.md) - Luồng bootstrapping
- [Deferred Service Context](architecture/deferred-service-context.md) - Context cho deferred services
- [Kernel System](architecture/kernel-system.md) - Hệ thống kernel
- [Service Container](architecture/service-container.md) - Service container
- [Framework Principles](framework-principles.md) - Nguyên tắc framework
- [Comprehensive Principles](comprehensive-principles.md) - Nguyên tắc toàn diện
- [Core Principles](principles.md) - Nguyên tắc cốt lõi

### 🎨 Templates System
- [Templates Overview](templates/README.md) - Tổng quan về templates
- [Block Templates](templates/block-templates.md) - Templates cho blocks
- [Layout Templates](templates/layout-templates.md) - Templates cho layouts
- [Page Templates](templates/page-templates.md) - Templates cho pages

### 🔧 Development
- [Development Guidelines](development/best-practices.md) - Hướng dẫn phát triển
- [Coding Standards](development/rules.md) - Tiêu chuẩn code
- [Code Review Guidelines](development/code-review-guidelines.md) - Hướng dẫn review code
- [Testing Guidelines](development/testing.md) - Hướng dẫn testing
- [Logging System](development/logging.md) - Hệ thống logging
- [Troubleshooting](development/troubleshooting.md) - Xử lý sự cố
- [Cleanup Summary](development/cleanup-summary.md) - Tóm tắt cleanup
- [CLI Development](cli/development.md) - Phát triển CLI
- [CLI Examples](cli/examples.md) - Ví dụ CLI
- [CLI Commands Reference](cli/commands-reference.md) - Tham khảo lệnh CLI
- [Release Command](cli/release-command.md) - Lệnh release
- [User Service](services/user-service.md) - User Service với caching và filtering

### 🎯 Gutenberg Integration
- [Block Registration](gutenberg/block-registration.md) - Đăng ký blocks
- [Blocks Overview](gutenberg/blocks.md) - Tổng quan về blocks
- [Ajax System](gutenberg/ajax-system.md) - Hệ thống Ajax
- [Layout System](gutenberg/layout-system.md) - Hệ thống layout
- [Pattern Library](post-layout/pattern-library.md) - Thư viện patterns

### 🔧 Services
- [Services Overview](services/README.md) - Tổng quan về services
- [User Service](services/user-service.md) - User Service với caching và filtering

### 📊 Post Layout System
- [Post Layout Overview](post-layout/README.md) - Tổng quan post layout
- [Dynamic Query Loop](post-layout/dynamic-query-loop.md) - Query loop động
- [Best Practices](post-layout/best-practices.md) - Best practices
- [Troubleshooting](post-layout/troubleshooting.md) - Xử lý sự cố
- [Migration Guide](post-layout/migration-guide.md) - Hướng dẫn migration

### 🎨 Design System
- [Design System Overview](designer/design-system.md) - Tổng quan design system
- [Quick Start](designer/quick-start.md) - Bắt đầu nhanh
- [Advanced Workflow](designer/advanced-workflow.md) - Workflow nâng cao
- [Workflow Guide](designer/workflow.md) - Hướng dẫn workflow
- [Speed Optimization](designer/speed-optimization.md) - Tối ưu tốc độ

### ⚡ Performance
- [Performance Overview](performance/README.md) - Tổng quan performance
- [Asset Management](performance/asset-management.md) - Quản lý assets
- [Core Web Vitals](performance/core-web-vitals.md) - Core Web Vitals

### 🔒 Security
- [Security Guidelines](security/guidelines.md) - Hướng dẫn bảo mật
- [Security Overview](security/README.md) - Tổng quan bảo mật

### 🔄 Migration
- [Migration Guide](migration-guide.md) - Hướng dẫn migration tổng quát
- [Hooks Migration](hooks-migration-summary.md) - Migration hooks
- [Update Summary](UPDATE_SUMMARY.md) - Tóm tắt cập nhật

### 🐛 Debug & Troubleshooting
- [Debug System](debug-system.md) - Hệ thống debug
- [Debug Quick Start](debug-quick-start.md) - Bắt đầu debug nhanh
- [Plugin Debug Integration](plugin-debug-integration.md) - Tích hợp debug plugin
- [Gutenberg Blocks Debug](debug/gutenberg-blocks-debug.md) - Debug Gutenberg blocks

## Quick Navigation

### For Developers
- [Development Guide](development/README.md) - Hướng dẫn phát triển
- [Architecture Overview](architecture/bootstrapper-structure.md) - Tổng quan kiến trúc
- [CLI Tools](cli/development.md) - Công cụ CLI
- [Gutenberg Integration](gutenberg/blocks.md) - Tích hợp Gutenberg
- [Services Overview](services/README.md) - Tổng quan services
- [User Service](services/user-service.md) - User Service với caching
- [Debug System](debug-system.md) - Hệ thống debug

### For Designers
- [Design System](designer/design-system.md) - Hệ thống thiết kế
- [Component Library](designer/component-library.md) - Thư viện components
- [Quick Start](designer/quick-start.md) - Bắt đầu nhanh

### For Content Creators
- [Post Layout System](post-layout/README.md) - Hệ thống post layout
- [Pattern Library](post-layout/pattern-library.md) - Thư viện patterns
- [Templates](templates/README.md) - Templates

### For Administrators
- [Installation Guide](development/README.md#installation) - Hướng dẫn cài đặt
- [Configuration](development/README.md#configuration) - Cấu hình
- [Troubleshooting](post-layout/troubleshooting.md) - Xử lý sự cố

## Key Features

### 🚀 Modern Architecture
- **Modular Design**: Kiến trúc modular với bootstrappers
- **Service Container**: Dependency injection container
- **Kernel System**: Multi-kernel system cho different contexts
- **Deferred Services**: Lazy loading services
- **User Service**: Caching và filtering cho user data

### 🎨 Advanced Templates
- **Block Templates**: PHP templates cho Gutenberg blocks
- **Layout Templates**: Templates cho complex layouts
- **Page Templates**: HTML templates với Gutenberg markup
- **Template Hierarchy**: Flexible template system

### 🔧 Developer Tools
- **CLI Commands**: Command-line interface
- **Debug Tools**: Comprehensive debugging
- **Performance Monitoring**: Built-in performance tools
- **Code Generation**: Scaffolding tools

### 📊 Post Layout System
- **Dynamic Query Loop**: Advanced query system
- **Pattern Library**: Reusable patterns
- **Layout Manager**: Flexible layout management
- **Migration Tools**: Easy migration from old systems

### 🎯 Gutenberg Integration
- **Custom Blocks**: Easy block creation
- **Ajax System**: Dynamic content loading
- **Block Patterns**: Reusable block patterns
- **Editor Enhancements**: Enhanced editor experience

## Getting Started

### 1. Installation
```bash
# Clone repository
git clone https://github.com/jankx/jankx.git my-theme

# Install dependencies
composer install
npm install
```

### 2. Development Setup
```bash
# Start development server
npm run dev

# Build for production
npm run build
```

### 3. CLI Usage
```bash
# Generate new block
wp jankx generate:block my-block

# Create new layout
wp jankx generate:layout my-layout

# Run performance test
wp jankx performance:test
```

## Architecture Overview

### Bootstrapper System
```
Bootstrapper
├── CoreBootstrapper
├── ThemeBootstrapper
├── FrontendBootstrapper
├── AdminBootstrapper
├── APIBootstrapper
├── CLIBootstrapper
└── GutenbergBootstrapper
```

### Kernel System
```
Kernel
├── FrontendKernel
├── AdminKernel
├── APIKernel
├── CLIKernel
└── CronKernel
```

### Template System
```
Templates
├── Page Templates (HTML)
├── Block Templates (PHP)
├── Layout Templates (PHP)
└── Template Parts
```

## Development Workflow

### 1. Create New Block
```php
// Register block
add_action('init', function() {
    register_block_type('jankx/my-block', [
        'render_callback' => 'render_my_block'
    ]);
});

// Render function
function render_my_block($attributes) {
    return include_template('blocks/my-block.html', $attributes);
}
```

### 2. Create New Layout
```php
// Register layout
add_action('init', function() {
    register_block_pattern('jankx/my-layout', [
        'content' => include_template('layouts/my-layout.html')
    ]);
});
```

### 3. Custom Template
```php
// Create custom template
function my_custom_template($variables) {
    return include_template('custom/my-template.html', $variables);
}
```

### 4. User Service Usage
```php
// Get user with caching
$user = User::get(1, ['ID', 'display_name', 'user_email']);

// Get current user
$currentUser = User::current(['ID', 'display_name']);

// Search users
$results = User::search('john', ['ID', 'display_name'], 5);
```

## Performance Features

### 1. Asset Optimization
- **Lazy Loading**: Automatic lazy loading
- **Code Splitting**: Dynamic code splitting
- **Caching**: Built-in caching system
- **Minification**: Automatic asset minification

### 2. Database Optimization
- **Query Optimization**: Optimized database queries
- **Caching**: Object and page caching
- **Indexing**: Automatic index optimization
- **Cleanup**: Regular cleanup tasks

### 3. Frontend Performance
- **Critical CSS**: Inline critical CSS
- **Image Optimization**: Automatic image optimization
- **CDN Support**: Built-in CDN support
- **Service Workers**: PWA capabilities

## Security Features

### 1. Input Validation
- **Sanitization**: Automatic input sanitization
- **Validation**: Comprehensive validation
- **Escaping**: Output escaping
- **Nonces**: CSRF protection

### 2. Access Control
- **Role-based Access**: Granular permissions
- **API Security**: Secure API endpoints
- **File Protection**: Protected file access
- **HTTPS Enforcement**: SSL enforcement

## Migration Support

### 1. From Jankx 1.x
- **Automatic Migration**: One-click migration
- **Hook Compatibility**: Backward compatibility
- **Template Conversion**: Template migration tools
- **Data Preservation**: Data integrity

### 2. From Other Themes
- **Import Tools**: Import from other themes
- **Template Conversion**: Template conversion
- **Data Migration**: Data migration tools
- **Customization Preservation**: Preserve customizations

## Support & Community

### 📚 Documentation
- **Comprehensive Guides**: Detailed documentation
- **Code Examples**: Practical examples
- **Best Practices**: Development best practices
- **Troubleshooting**: Common issues and solutions

### 🛠️ Development Tools
- **CLI Commands**: Command-line tools
- **Debug Tools**: Debugging utilities
- **Performance Tools**: Performance monitoring
- **Code Generators**: Scaffolding tools

### 🤝 Community
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community discussions
- **Contributions**: Contribution guidelines
- **Support**: Technical support

## Version Information

- **Current Version**: 2.0.0
- **PHP Requirement**: 7.4+
- **WordPress Requirement**: 5.8+
- **Gutenberg Requirement**: 10.0+

## License

Jankx 2.0 is licensed under the GPL v2 or later.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## Support

- **Documentation**: [docs.jankx.com](https://docs.jankx.com)
- **Issues**: [GitHub Issues](https://github.com/jankx/jankx/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jankx/jankx/discussions)
- **Community**: [Community Forum](https://community.jankx.com)

---

**Jankx 2.0** - Modern WordPress Theme Framework