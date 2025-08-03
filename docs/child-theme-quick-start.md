# Child Theme Boot - Quick Start Guide

## 🚀 Bắt đầu nhanh

Hướng dẫn nhanh để tạo và sử dụng Child Theme Boot trong Jankx Framework.

## 📋 Yêu cầu

- WordPress 5.0+
- PHP 7.4+
- Composer
- Jankx Framework theme

## ⚡ Setup trong 5 phút

### 1. Tạo Child Theme
```bash
# Tạo child theme directory
mkdir wp-content/themes/my-child-theme
cd wp-content/themes/my-child-theme

# Tạo style.css
cat > style.css << 'EOF'
/*
Theme Name: My Child Theme
Template: jankx
Version: 1.0.0
*/
EOF
```

### 2. Clone Config từ Parent Theme
```bash
# Clone config files từ parent theme
wp jankx config clone

# Hoặc force clone nếu files đã tồn tại
wp jankx config clone --force
```

**Files được clone:**
- `config/app.php` - App configuration
- `config/providers.php` - Service providers
- `config/error.php` - Error suppression
- `config/layout.php` - Layout configuration

### 3. Tạo Composer.json
```bash
# Tạo composer.json
cat > composer.json << 'EOF'
{
    "name": "my-theme/child-theme",
    "description": "My Child Theme with Composer",
    "type": "wordpress-theme",
    "version": "1.0.0",
    "autoload": {
        "psr-4": {
            "MyChildTheme\\": "src/"
        },
        "files": [
            "src/helpers.php"
        ]
    },
    "require": {
        "php": ">=7.4"
    }
}
EOF
```

### 4. Tạo Source Structure
```bash
# Tạo directories
mkdir -p src/{Services,Controllers,Models}

# Tạo helper file
cat > src/helpers.php << 'EOF'
<?php

if (!function_exists('my_child_theme_version')) {
    function my_child_theme_version() {
        return '1.0.0';
    }
}
EOF

# Tạo service class
cat > src/Services/ExampleService.php << 'EOF'
<?php

namespace MyChildTheme\Services;

class ExampleService
{
    public function test() {
        return 'Child theme is working!';
    }
}
EOF
```

### 5. Cài đặt Dependencies
```bash
# Cài đặt composer
composer install
```

### 6. Tạo Functions.php
```bash
# Tạo functions.php
cat > functions.php << 'EOF'
<?php

// Load Jankx Framework
require_once get_template_directory() . '/includes/framework.php';

// Initialize child theme
if (class_exists('Jankx\Foundation\Bootstrap\BootChildTheme') &&
    \Jankx\Foundation\Bootstrap\BootChildTheme::hasChildThemeComposer()) {
    // Load service
    $service = new \MyChildTheme\Services\ExampleService();

    // Test service
    add_action('wp_footer', function() use ($service) {
        echo '<!-- ' . $service->test() . ' -->';
    });
}
EOF
```

## 🧪 Test ngay lập tức

### 1. Kích hoạt Child Theme
- Vào WordPress Admin → Appearance → Themes
- Kích hoạt "My Child Theme"

### 2. Kiểm tra Console
- Mở Developer Tools (F12)
- Xem Console để thấy message: `<!-- Child theme is working! -->`

### 3. Test Helper Function
```php
// Thêm vào functions.php
add_action('wp_footer', function() {
    if (function_exists('my_child_theme_version')) {
        echo '<!-- Version: ' . my_child_theme_version() . ' -->';
    }
});
```

## 📁 Cấu trúc hoàn chỉnh

```
my-child-theme/
├── composer.json
├── functions.php
├── style.css
├── config/              # Cloned từ parent theme
│   ├── app.php         # App configuration
│   ├── providers.php   # Service providers
│   ├── error.php       # Error suppression
│   └── layout.php      # Layout configuration
├── vendor/
│   └── autoload.php
└── src/
    ├── Services/
    │   └── ExampleService.php
    ├── Controllers/
    ├── Models/
    └── helpers.php
```

## 🔧 Các lệnh hữu ích

### Cập nhật Autoloader
```bash
composer dump-autoload
```

### Cài đặt Package mới
```bash
composer require monolog/monolog
```

### Xem thông tin Composer
```php
// Thêm vào functions.php
add_action('wp_footer', function() {
    if (class_exists('Jankx\Foundation\Bootstrap\BootChildTheme')) {
        $info = \Jankx\Foundation\Bootstrap\BootChildTheme::getChildThemeComposerInfo();
        echo '<!-- Package: ' . $info['name'] . ' -->';
    }
});
```

## 🐛 Troubleshooting

### Composer không load
```bash
# Kiểm tra files
ls -la composer.json vendor/autoload.php

# Reinstall composer
composer install --no-dev
```

### Classes không autoload
```bash
# Regenerate autoloader
composer dump-autoload -o
```

### Helper functions không load
```bash
# Kiểm tra file path trong composer.json
# Chạy dump-autoload
composer dump-autoload
```

## 📚 Ví dụ nâng cao

### 1. Tạo Controller với WordPress Hooks
```php
// src/Controllers/ThemeController.php
<?php

namespace MyChildTheme\Controllers;

class ThemeController
{
    public function __construct()
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
        add_action('wp_head', [$this, 'addMeta']);
    }

    public function enqueueScripts()
    {
        wp_enqueue_style('child-style', get_stylesheet_uri());
    }

    public function addMeta()
    {
        echo '<meta name="child-theme" content="' . get_stylesheet() . '">';
    }
}
```

### 2. Sử dụng trong Functions.php
```php
// functions.php
if (class_exists('Jankx\Foundation\Bootstrap\BootChildTheme') &&
    \Jankx\Foundation\Bootstrap\BootChildTheme::hasChildThemeComposer()) {
    new \MyChildTheme\Controllers\ThemeController();
}
```

### 3. Tạo Service với Dependencies
```php
// src/Services/ThemeService.php
<?php

namespace MyChildTheme\Services;

class ThemeService
{
    public function getOption($key, $default = null)
    {
        return get_option("child_theme_{$key}", $default);
    }

    public function setOption($key, $value)
    {
        return update_option("child_theme_{$key}", $value);
    }
}
```

## 🎯 Best Practices

### 1. Namespace Convention
```php
// Luôn sử dụng namespace riêng
namespace MyChildTheme\Services;
namespace MyChildTheme\Controllers;
namespace MyChildTheme\Models;
```

### 2. Error Handling
```php
if (class_exists('Jankx\Foundation\Bootstrap\BootChildTheme') &&
    \Jankx\Foundation\Bootstrap\BootChildTheme::hasChildThemeComposer()) {
    try {
        $service = new \MyChildTheme\Services\ExampleService();
        $result = $service->test();
    } catch (Exception $e) {
        error_log('Child theme error: ' . $e->getMessage());
    }
}
```

### 3. Performance
```php
// Lazy loading
add_action('init', function() {
    if (class_exists('Jankx\Foundation\Bootstrap\BootChildTheme') &&
    \Jankx\Foundation\Bootstrap\BootChildTheme::hasChildThemeComposer()) {
    // Load services only when needed
}
});
```

## 📖 Tài liệu tham khảo

- [Child Theme Boot Documentation](./child-theme-boot.md)
- [Jankx Framework Documentation](./getting-started.md)
- [Composer Documentation](https://getcomposer.org/doc/)
- [PSR-4 Autoloading](https://www.php-fig.org/psr/psr-4/)

## 🆘 Hỗ trợ

### Debug Mode
```php
// Thêm vào functions.php để debug
add_action('wp_footer', function() {
    if (class_exists('Jankx\Foundation\Bootstrap\BootChildTheme')) {
        \Jankx\Foundation\Bootstrap\BootChildTheme::debugChildThemeComposer();
    }
});
```

### Test Page
Truy cập: `http://your-site.com/wp-content/themes/my-child-theme/test-composer.php`

### Unit Tests
```bash
cd jankx
vendor/bin/phpunit tests/Foundation/Bootstrap/BootChildThemeTest.php
```

## 🎉 Kết luận

Với Child Theme Boot, bạn có thể:
- ✅ Sử dụng composer dependencies trong child theme
- ✅ Tổ chức code theo PSR-4 standards
- ✅ Autoload classes và functions
- ✅ Tích hợp hoàn hảo với Jankx Framework
- ✅ Dễ dàng maintain và update

Bắt đầu ngay hôm nay để tạo ra những child themes mạnh mẽ và linh hoạt!