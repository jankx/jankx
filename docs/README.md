# Jankx Framework Documentation

Chào mừng đến với tài liệu Jankx Framework! Đây là nơi chứa tất cả các hướng dẫn, API reference, và best practices cho việc phát triển với Jankx Framework.

## 📚 Tài liệu có sẵn

### Core Framework
- [Getting Started](getting-started.md) - Hướng dẫn bắt đầu với Jankx Framework
- [Architecture Overview](architecture.md) - Tổng quan kiến trúc framework
- [Service Providers](service-providers.md) - Hướng dẫn tạo và sử dụng service providers
- [Configuration](configuration.md) - Cấu hình framework và ứng dụng

### Integrations
- [WooCommerce Integration](woocommerce-integration.md) - Tích hợp với WooCommerce
- [Gutenberg Integration](gutenberg-integration.md) - Tích hợp với Gutenberg blocks
- [WordPress Integration](wordpress-integration.md) - Tích hợp với WordPress core

### Development
- [Block Development](block-development.md) - Phát triển custom blocks
- [Template Engine](template-engine.md) - Sử dụng template engine
- [Asset Management](asset-management.md) - Quản lý CSS, JS, và assets
- [Testing Guide](testing.md) - Hướng dẫn testing

### Advanced Topics
- [Performance Optimization](performance.md) - Tối ưu hóa hiệu suất
- [Security Best Practices](security.md) - Bảo mật và best practices
- [Deployment Guide](deployment.md) - Hướng dẫn deploy
- [Troubleshooting](troubleshooting.md) - Xử lý sự cố

## 🚀 Bắt đầu nhanh

### 1. Cài đặt
```bash
# Clone repository
git clone https://github.com/your-org/jankx-framework.git

# Install dependencies
composer install
npm install
```

### 2. Cấu hình
```php
// config/app.php
return [
    'name' => 'Your Theme',
    'version' => '1.0.0',
    // ... other config
];
```

### 3. Tạo Service Provider
```php
// includes/app/Providers/YourServiceProvider.php
<?php
namespace App\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class YourServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register services
    }

    public function boot(Application $app)
    {
        // Bootstrap services
    }
}
```

### 4. Đăng ký Provider
```php
// config/providers.php
'frontend' => [
    App\Providers\YourServiceProvider::class,
],
```

## 📖 Cấu trúc Framework

```
includes/
├── app/                    # Application code
│   ├── Providers/         # Service providers
│   ├── Services/          # Business logic
│   ├── Http/             # HTTP kernels
│   └── Console/          # Console commands
├── framework/             # Core framework
│   ├── Foundation/       # Application foundation
│   ├── Support/          # Support classes
│   ├── Gutenberg/        # Gutenberg integration
│   └── Services/         # Core services
└── config/               # Configuration files
    ├── app.php
    ├── providers.php
    └── ...
```

## 🛠️ Development Tools

### Composer Scripts
```bash
# Install dependencies
composer install

# Update dependencies
composer update

# Run tests
composer test

# Code style check
composer cs-check

# Code style fix
composer cs-fix
```

### NPM Scripts
```bash
# Install dependencies
npm install

# Build assets
npm run build

# Watch for changes
npm run watch

# Development build
npm run dev
```

## 🔧 Configuration

### Environment Variables
```bash
# .env
WP_DEBUG=true
JANKX_TEMPLATE_ENGINE=jankx
JANKX_TEMPLATE_CACHE=false
```

### Application Config
```php
// config/app.php
return [
    'name' => env('APP_NAME', 'Jankx Theme'),
    'version' => env('APP_VERSION', '1.0.0'),
    'debug' => env('WP_DEBUG', false),
    'template_engine' => env('JANKX_TEMPLATE_ENGINE', 'jankx'),
];
```

## 📝 Coding Standards

### PHP
- PSR-12 coding standard
- Type declarations
- DocBlocks for all methods
- Dependency injection

### JavaScript
- ES6+ syntax
- JSDoc comments
- ESLint configuration
- Prettier formatting

### CSS/SCSS
- BEM methodology
- SCSS variables
- Mobile-first approach
- Autoprefixer

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
composer test:unit

# Run with coverage
composer test:coverage
```

### Integration Tests
```bash
# Run integration tests
composer test:integration
```

### E2E Tests
```bash
# Run end-to-end tests
npm run test:e2e
```

## 📦 Deployment

### Production Build
```bash
# Build for production
npm run build:prod
composer install --no-dev --optimize-autoloader
```

### Docker
```dockerfile
# Dockerfile
FROM wordpress:latest
COPY . /var/www/html/wp-content/themes/jankx/
```

## 🤝 Contributing

### Pull Request Process
1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

### Code Review
- All code must be reviewed
- Tests must pass
- Documentation must be updated
- Coding standards must be followed

## 📞 Support

### Getting Help
- 📖 Check documentation
- 🐛 Search GitHub issues
- 💬 Join Discord community
- 📧 Contact team

### Reporting Issues
- Use GitHub issues
- Provide reproduction steps
- Include environment details
- Add relevant logs

## 📄 License

This project is licensed under the GPL v3 or later License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- WordPress community
- Laravel framework inspiration
- All contributors
- Beta testers

---

**Cập nhật lần cuối:** 2024-01-01
**Phiên bản:** 2.0.0
**Tác giả:** Jankx Team