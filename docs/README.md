# Jankx 2.0 Documentation

> **Modern WordPress Theme Framework with Gutenberg-First Architecture**

Jankx 2.0 là một framework WordPress hiện đại được thiết kế với kiến trúc Gutenberg-first, tuân thủ các nguyên tắc software engineering nghiêm ngặt và tối ưu hóa Core Web Vitals.

## 🚀 Core Philosophy

- **Gutenberg-First**: Tất cả blocks và layouts đều được xây dựng trên Gutenberg
- **Atomic Design**: Hệ thống component modular và tái sử dụng
- **Performance-First**: Tối ưu Core Web Vitals (LCP, FID, CLS)
- **Security by Design**: Bảo mật tích hợp sâu vào kiến trúc
- **Developer Experience**: DX tối ưu với tooling hiện đại

## 📚 Documentation Structure

### 🏗 Architecture & System Design
- [Architecture Overview](./architecture/README.md) - Tổng quan kiến trúc và flow
- [Kernel System](./architecture/kernel-system.md) - Hệ thống kernel và bootstrapping
- [Service Container](./architecture/service-container.md) - Service container pattern
- [Bootstrapping Flow](./architecture/bootstrapping-flow.md) - Quy trình khởi tạo

### 🧩 Gutenberg System
- [Gutenberg Blocks](./gutenberg/blocks.md) - Hệ thống block development
- [Block Registration](./gutenberg/block-registration.md) - JSON-based registration
- [Layout System](./gutenberg/layout-system.md) - Layout management
- [AJAX System](./gutenberg/ajax-system.md) - Dynamic content loading

### ⚡ Performance & Optimization
- [Core Web Vitals](./performance/core-web-vitals.md) - LCP, FID, CLS optimization
- [Asset Management](./performance/asset-management.md) - Lazy loading và optimization

### 🔒 Security
- [Security Guidelines](./security/guidelines.md) - Security best practices

### 🛠 Development
- [Coding Rules](./development/rules.md) - Strict OOP principles
- [Best Practices](./development/best-practices.md) - Development guidelines
- [Testing Guidelines](./development/testing.md) - Testing strategies
- [Troubleshooting](./development/troubleshooting.md) - Common issues & solutions

### 📁 Assets & Templates
- [Asset Structure](./assets/structure.md) - Folder organization

### 🚀 Migration & Quick Start
- [Migration Guide](./migration-guide.md) - Chuyển từ theme cũ sang Jankx

## 🚀 Quick Start

### Requirements
- WordPress 6.0+
- PHP 7.4+
- Node.js 16+ (for development)

### Installation
```bash
# Clone theme
git clone [repository-url]

# Install dependencies
composer install
npm install

# Build assets
npm run build
```

### Development
```bash
# Watch mode
npm run dev

# Build for production
npm run build
```

## 🏗 Architecture Overview

```
Jankx 2.0
├── Kernel System (Bootstrapping)
├── Service Container (Dependency Injection)
├── Gutenberg Blocks (Atomic Design)
├── Performance Layer (Core Web Vitals)
├── Security Layer (XSS, CSRF, SVG)
└── Asset Management (Lazy Loading)
```

## 🎯 Key Features

- **Gutenberg-First**: Native block editor integration
- **Atomic Design**: Modular component system
- **Lazy Loading**: Partial hydration system
- **Core Web Vitals**: Performance optimization
- **Security by Design**: Built-in security measures
- **Developer Experience**: Modern tooling and workflows

## 📊 Performance Targets

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **TTFB**: < 600ms

## 🔒 Security Features

- XSS Prevention
- CSRF Protection
- SVG Sanitization
- Nonce Verification
- Input Sanitization
- Output Escaping

## 🚀 Migration Path

### From Old Theme
```bash
# 1. Install Jankx
wp theme install jankx --activate

# 2. Run migration script
wp eval-file migration-script.php

# 3. Test migration
wp eval-file test-migration.php
```

### From Jankx 1.0
```php
// Use migration helper
class JankxMigrator
{
    public function migrateFromV1()
    {
        // Migrate blocks
        $this->migrateBlocks();

        // Migrate templates
        $this->migrateTemplates();

        // Migrate assets
        $this->migrateAssets();
    }
}
```

## 🛠 Development Workflow

### 1. **Create New Block**
```bash
# Generate block scaffold
npm run create-block testimonial

# This creates:
# - blocks/testimonial/block.json
# - blocks/testimonial/TestimonialBlock.php
# - assets/blocks/testimonial/
```

### 2. **Development Mode**
```bash
# Start development server
npm run dev

# Watch for changes
npm run watch
```

### 3. **Testing**
```bash
# Run tests
npm run test

# Run performance tests
npm run test:performance
```

## 📖 Contributing

### Development Rules
1. **Strict OOP**: No procedural functions
2. **Service Pattern**: Use dependency injection
3. **Testing**: Write tests for all features
4. **Performance**: Optimize for Core Web Vitals
5. **Security**: Follow security guidelines

### Code Standards
- PSR-12 coding standards
- Type hints and return types
- Meaningful comments
- Small, focused functions
- Dependency injection

## 🔧 Troubleshooting

### Common Issues
1. **Block not registering**: Check namespace and registration
2. **Assets not loading**: Verify file paths and permissions
3. **Performance issues**: Use performance monitoring tools
4. **Security issues**: Follow security guidelines

### Debug Tools
```php
// Enable debug mode
define('WP_DEBUG', true);
define('JANKX_DEBUG', true);

// Use debug logger
$logger = new DebugLogger();
$logger->log('Debug message', ['context' => 'data']);
```

## 📄 License

GPL v2 or later

---

**Jankx 2.0** - Modern WordPress Theme Framework

> **Tài liệu này được thiết kế để:**
> - Cung cấp hướng dẫn thực tế cho development
> - Không có hứa suông hay benchmark giả
> - Là tài liệu tra cứu cho development team
> - Hướng dẫn chuyển đổi nhanh nhất có thể
> - Cách tiếp cận Jankx đúng đắn