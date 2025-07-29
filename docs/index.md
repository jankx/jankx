# Jankx Framework Documentation

## Tổng quan

Jankx Framework là một WordPress theme framework mạnh mẽ với các tính năng hiện đại và kiến trúc linh hoạt.

## Documentation Sections

### 🚀 **Getting Started**
- [Quick Start Guide](../README.md) - Bắt đầu nhanh với Jankx Framework
- [Installation Guide](installation.md) - Hướng dẫn cài đặt
- [Configuration](configuration.md) - Cấu hình framework

### 🏗️ **Architecture**
- [Framework Overview](architecture/overview.md) - Tổng quan kiến trúc
- [Bootstrapping Flow](architecture/bootstrapping-flow.md) - Quy trình khởi tạo
- [Service Container](architecture/service-container.md) - Container quản lý services
- [Deferred Services](architecture/deferred-service-context.md) - Services trì hoãn

### 🔧 **Development**
- [Development Guide](development/development-guide.md) - Hướng dẫn phát triển
- [Best Practices](development/best-practices.md) - Thực hành tốt nhất
- [Coding Standards](development/coding-standards.md) - Tiêu chuẩn code
- [Testing Guide](development/testing.md) - Hướng dẫn testing

### 🐛 **Debug System**
- [Debug Overview](debug/readme.md) - Tổng quan hệ thống debug
- [Quick Start](debug/quick-start.md) - Bắt đầu nhanh với debug
- [Performance Monitoring](debug/performance-monitoring.md) - Theo dõi hiệu suất
- [Cache Comparison](debug/cache-comparison.md) - So sánh cache

### 📝 **Gutenberg**
- [Gutenberg Overview](gutenberg/overview.md) - Tổng quan Gutenberg
- [Block Development](gutenberg/block-development.md) - Phát triển blocks
- [Block Templates](gutenberg/block-templates.md) - Templates cho blocks
- [AJAX System](gutenberg/ajax-system.md) - Hệ thống AJAX

### 🎨 **Design System**
- [Design Overview](designer/overview.md) - Tổng quan design system
- [Quick Start](designer/quick-start.md) - Bắt đầu thiết kế
- [Components](designer/components.md) - Các component
- [Theming](designer/theming.md) - Tùy chỉnh theme

### 🔒 **Security**
- [Security Guidelines](security/guidelines.md) - Hướng dẫn bảo mật
- [Best Practices](security/best-practices.md) - Thực hành bảo mật tốt nhất
- [Vulnerability Prevention](security/vulnerability-prevention.md) - Ngăn chặn lỗ hổng

### ⚡ **Performance**
- [Performance Overview](performance/overview.md) - Tổng quan hiệu suất
- [Asset Management](performance/asset-management.md) - Quản lý assets
- [Core Web Vitals](performance/core-web-vitals.md) - Core Web Vitals
- [Caching Strategies](performance/caching.md) - Chiến lược cache

### 🛠️ **CLI Tools**
- [CLI Overview](cli/overview.md) - Tổng quan CLI
- [Commands Reference](cli/commands-reference.md) - Tham khảo commands
- [Development](cli/development.md) - Phát triển CLI
- [Examples](cli/examples.md) - Ví dụ sử dụng

### 📊 **Services**
- [Services Overview](services/overview.md) - Tổng quan services
- [Deferred Services](services/deferred-service-resolver.md) - Services trì hoãn
- [Custom Services](services/custom-services.md) - Services tùy chỉnh
- [Service Lifecycle](services/lifecycle.md) - Vòng đời service

### 🎯 **Templates**
- [Template System](templates/overview.md) - Hệ thống template
- [Page Templates](templates/page-templates.md) - Templates trang
- [Block Templates](templates/block-templates.md) - Templates blocks
- [Layout Templates](templates/layout-templates.md) - Templates layout

### 🔌 **Plugins**
- [Plugin Development](plugins/development.md) - Phát triển plugin
- [Integration Guide](plugins/integration.md) - Hướng dẫn tích hợp
- [API Reference](plugins/api-reference.md) - Tham khảo API
- [Best Practices](plugins/best-practices.md) - Thực hành tốt nhất

### 🌐 **Internationalization**
- [i18n Overview](i18n/overview.md) - Tổng quan đa ngôn ngữ
- [Translation Guide](i18n/translation.md) - Hướng dẫn dịch thuật
- [Localization](i18n/localization.md) - Bản địa hóa
- [RTL Support](i18n/rtl-support.md) - Hỗ trợ RTL

## Quick Navigation

### 🔥 **Most Popular**
- [Getting Started](../README.md)
- [Debug System](debug/readme.md)
- [Development Guide](development/development-guide.md)
- [Gutenberg Blocks](gutenberg/overview.md)

### 🆕 **New Features**
- [Cache Comparison](debug/cache-comparison.md)
- [Performance Monitoring](debug/performance-monitoring.md)
- [Deferred Services](services/deferred-service-resolver.md)
- [CLI Tools](cli/overview.md)

### 🔄 **Recent Architecture Changes**
- [Service Provider Consolidation](architecture/bootstrapping-flow.md#service-provider-consolidation) - Loại bỏ duplicate Service Provider initialization
- [Context-Aware Debug System](debug/readme.md#context-aware-debug-system) - Debug chỉ hoạt động ở frontend context
- [Kernel-Based Service Registration](development/coding-rules.md#service-provider-types) - Service Provider chỉ được register qua Kernel

### 🔧 **Developer Tools**
- [CLI Commands](cli/commands-reference.md)
- [Testing Guide](development/testing.md)
- [API Reference](plugins/api-reference.md)
- [Debug System](debug/readme.md)

## Contributing

### 📝 **Writing Documentation**
1. Follow the existing structure
2. Use clear and concise language
3. Include code examples
4. Add screenshots when helpful
5. Keep documentation up to date

### 🔄 **Updating Documentation**
- Update docs when adding new features
- Review and update existing docs regularly
- Ensure all links work correctly
- Test code examples

### 📋 **Documentation Standards**
- Use consistent formatting
- Include table of contents for long docs
- Add version information
- Include troubleshooting sections

## Support

### 📚 **Documentation**
- [GitHub Issues](https://github.com/jankx/jankx/issues)
- [Community Forum](https://community.jankx.com)
- [Developer Chat](https://chat.jankx.com)

### 🆘 **Getting Help**
- Check existing documentation first
- Search GitHub issues
- Ask in community forum
- Contact core team

## Version Information

- **Framework Version**: 2.0.0
- **Documentation Version**: 2.0.0
- **Last Updated**: 2024
- **Compatibility**: WordPress 5.0+, PHP 7.4+

---

**Need help?** Check our [Support Guide](support.md) or [Contact Us](contact.md).