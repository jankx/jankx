# Child Theme Boot - Jankx Framework

## Tổng quan

Child Theme Boot là một tính năng mạnh mẽ trong Jankx Framework cho phép child themes có thể sử dụng composer dependencies và autoloading riêng của mình. Tính năng này được thực hiện thông qua Bootstrap `BootChildTheme` và tích hợp hoàn hảo với Jankx Framework architecture.

## Kiến trúc

### Bootstrap System
```
Jankx Framework Bootstrap Flow:
┌─────────────────┐
│ LoadConfiguration│
├─────────────────┤
│ RegisterLogger  │
├─────────────────┤
│ RegisterFacades │
├─────────────────┤
│ ThemeDataLoader │
├─────────────────┤
│ BootChildTheme  │ ← Child Theme Composer
├─────────────────┤
│ RegisterProviders│
└─────────────────┘
│ BootProviders   │
└─────────────────┘
```

### Child Theme Boot Process
```
1. Kiểm tra Child Theme
   ├── get_stylesheet_directory() != get_template_directory()
   └── Child theme tồn tại

2. Kiểm tra Composer Setup
   ├── composer.json tồn tại
   ├── vendor/ directory tồn tại
   └── vendor/autoload.php tồn tại

3. Load Composer Autoloader
   ├── require_once vendor/autoload.php
   └── Parse composer.json

4. Đăng ký với Application
   ├── Singleton: 'child_theme.composer'
   └── Package info registration
```

## Cấu trúc Child Theme

### File Structure
```
child-theme/
├── composer.json          # Package configuration
├── vendor/               # Composer dependencies
│   └── autoload.php     # Composer autoloader
├── src/                  # Source code (PSR-4)
│   ├── Services/         # Service classes
│   ├── Controllers/      # Controller classes
│   ├── Models/           # Model classes
│   └── helpers.php       # Helper functions
├── functions.php         # WordPress functions
└── style.css            # Child theme stylesheet
```

### Composer.json Configuration
```json
{
    "name": "your-theme/child-theme",
    "description": "Your Child Theme with custom dependencies",
    "type": "wordpress-theme",
    "version": "1.0.0",
    "license": "GPL-2.0-or-later",
    "authors": [
        {
            "name": "Your Name",
            "email": "your@email.com"
        }
    ],
    "require": {
        "php": ">=7.4",
        "monolog/monolog": "^2.0",
        "guzzlehttp/guzzle": "^7.0"
    },
    "require-dev": {
        "phpunit/phpunit": "^9.0",
        "squizlabs/php_codesniffer": "^3.0"
    },
    "autoload": {
        "psr-4": {
            "YourChildTheme\\": "src/",
            "YourChildTheme\\Services\\": "src/Services/",
            "YourChildTheme\\Controllers\\": "src/Controllers/",
            "YourChildTheme\\Models\\": "src/Models/"
        },
        "files": [
            "src/helpers.php"
        ]
    },
    "autoload-dev": {
        "psr-4": {
            "YourChildTheme\\Tests\\": "tests/"
        }
    },
    "config": {
        "optimize-autoloader": true
    }
}
```

## Cách hoạt động

### 1. Bootstrap Detection
Bootstrap `BootChildTheme` được chạy trong quá trình Jankx Framework bootstrap:

```php
// Trong HTTP Kernel
protected $bootstrappers = [
    LoadConfiguration::class,
    RegisterLogger::class,
    RegisterFacades::class,
    ThemeDataLoader::class,
    BootChildTheme::class,        // ← Child Theme Boot
    RegisterProviders::class,
    BootProviders::class,
];
```

### 2. Child Theme Detection
```php
// Kiểm tra xem có đang sử dụng child theme không
$childThemePath = get_stylesheet_directory();
$parentThemePath = get_template_directory();

if ($childThemePath === $parentThemePath) {
    // Không phải child theme
    return;
}
```

### 3. Composer Setup Validation
```php
// Kiểm tra composer.json
$composerJsonPath = $childThemePath . '/composer.json';
if (!file_exists($composerJsonPath)) {
    return;
}

// Kiểm tra vendor directory
$vendorPath = $childThemePath . '/vendor';
if (!is_dir($vendorPath)) {
    return;
}

// Kiểm tra autoload.php
$autoloadPath = $vendorPath . '/autoload.php';
if (!file_exists($autoloadPath)) {
    return;
}
```

### 4. Autoloader Loading
```php
// Load composer autoloader
require_once $autoloadPath;

// Parse composer.json
$composerData = json_decode(file_get_contents($composerJsonPath), true);
```

### 5. Application Registration
```php
// Đăng ký với Jankx Application
$app->singleton('child_theme.composer', function () use ($packageInfo) {
    return $packageInfo;
});
```

## Sử dụng trong Code

### 1. Kiểm tra Child Theme Composer
```php
// Kiểm tra xem child theme có composer không
if (function_exists('bookix_child_has_composer') && bookix_child_has_composer()) {
    // Child theme có composer dependencies
    $composerInfo = bookix_child_get_composer_info();
    echo 'Package: ' . $composerInfo['name'];
}
```

### 2. Sử dụng Classes từ Child Theme
```php
// Sử dụng classes từ child theme
if (class_exists('YourChildTheme\Services\ExampleService')) {
    $service = new \YourChildTheme\Services\ExampleService();
    $result = $service->doSomething();
}
```

### 3. Helper Functions
```php
// Helper functions được autoload từ child theme
if (function_exists('child_theme_helper_function')) {
    $result = child_theme_helper_function();
}
```

## Helper Functions

### WordPress Helper Functions
```php
/**
 * Kiểm tra xem child theme có composer dependencies không
 */
function bookix_child_has_composer()

/**
 * Lấy thông tin composer package
 */
function bookix_child_get_composer_info()

/**
 * Lấy đường dẫn đến vendor directory
 */
function bookix_child_get_vendor_path()

/**
 * Lấy đường dẫn đến composer.json
 */
function bookix_child_get_composer_json_path()

/**
 * Debug thông tin composer (development only)
 */
function bookix_child_debug_composer()
```

### Static Methods
```php
// Kiểm tra child theme composer
BootChildTheme::hasChildThemeComposer()

// Lấy thông tin composer
BootChildTheme::getChildThemeComposerInfo()

// Lấy vendor path
BootChildTheme::getChildThemeVendorPath()

// Lấy composer.json path
BootChildTheme::getChildThemeComposerJsonPath()
```

## Ví dụ thực tế

### 1. Tạo Service Class
```php
// src/Services/ThemeService.php
namespace YourChildTheme\Services;

class ThemeService
{
    protected $name;

    public function __construct($name = 'Theme Service')
    {
        $this->name = $name;
    }

    public function getThemeOption($key, $default = null)
    {
        return get_option("child_theme_{$key}", $default);
    }

    public function setThemeOption($key, $value)
    {
        return update_option("child_theme_{$key}", $value);
    }

    public function getInfo()
    {
        return [
            'name' => $this->name,
            'class' => get_class($this),
            'namespace' => __NAMESPACE__,
            'loaded_at' => date('Y-m-d H:i:s')
        ];
    }
}
```

### 2. Tạo Controller
```php
// src/Controllers/ThemeController.php
namespace YourChildTheme\Controllers;

class ThemeController
{
    public function __construct()
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
        add_action('wp_head', [$this, 'addCustomMeta']);
    }

    public function enqueueScripts()
    {
        wp_enqueue_style('child-theme-style', get_stylesheet_uri());
    }

    public function addCustomMeta()
    {
        echo '<meta name="child-theme" content="' . get_stylesheet() . '">';
    }
}
```

### 3. Tạo Helper Functions
```php
// src/helpers.php
<?php

if (!function_exists('child_theme_get_option')) {
    function child_theme_get_option($key, $default = null)
    {
        return get_option("child_theme_{$key}", $default);
    }
}

if (!function_exists('child_theme_set_option')) {
    function child_theme_set_option($key, $value)
    {
        return update_option("child_theme_{$key}", $value);
    }
}

if (!function_exists('child_theme_get_version')) {
    function child_theme_get_version()
    {
        if (function_exists('bookix_child_get_composer_info')) {
            $composerInfo = bookix_child_get_composer_info();
            return $composerInfo['version'] ?? '1.0.0';
        }
        return '1.0.0';
    }
}
```

### 4. Sử dụng trong functions.php
```php
// functions.php
<?php

// Load Jankx Framework
require_once get_template_directory() . '/includes/framework.php';

// Initialize child theme
if (bookix_child_has_composer()) {
    // Load theme service
    $themeService = new \YourChildTheme\Services\ThemeService('Child Theme Service');

    // Initialize controller
    new \YourChildTheme\Controllers\ThemeController();

    // Set default options
    $themeService->setThemeOption('primary_color', '#007cba');
    $themeService->setThemeOption('secondary_color', '#6c757d');
}

// Add custom functionality
add_action('wp_footer', function() {
    if (function_exists('child_theme_get_version')) {
        echo '<!-- Child Theme Version: ' . child_theme_get_version() . ' -->';
    }
});
```

## Cài đặt và Setup

### 1. Tạo Child Theme
```bash
# Tạo child theme directory
mkdir wp-content/themes/your-child-theme
cd wp-content/themes/your-child-theme

# Tạo style.css
echo "/*
Theme Name: Your Child Theme
Template: bookix
Version: 1.0.0
*/" > style.css

# Tạo functions.php
touch functions.php
```

### 2. Tạo Composer.json
```bash
# Tạo composer.json
cat > composer.json << 'EOF'
{
    "name": "your-theme/child-theme",
    "description": "Your Child Theme with custom dependencies",
    "type": "wordpress-theme",
    "version": "1.0.0",
    "autoload": {
        "psr-4": {
            "YourChildTheme\\": "src/"
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

### 3. Tạo Source Structure
```bash
# Tạo source directories
mkdir -p src/{Services,Controllers,Models}

# Tạo helper file
touch src/helpers.php

# Tạo service class
cat > src/Services/ExampleService.php << 'EOF'
<?php

namespace YourChildTheme\Services;

class ExampleService
{
    public function test()
    {
        return 'Child theme service is working!';
    }
}
EOF
```

### 4. Cài đặt Dependencies
```bash
# Cài đặt composer dependencies
composer install

# Hoặc nếu chưa có composer
curl -sS https://getcomposer.org/installer | php
php composer.phar install
```

## Testing

### 1. Test Page
Truy cập test page để kiểm tra:
```
http://your-site.com/wp-content/themes/your-child-theme/test-composer.php
```

### 2. Manual Test
```php
// Thêm vào functions.php để test
add_action('wp_footer', function() {
    if (function_exists('bookix_child_has_composer')) {
        echo '<!-- Child Theme Composer: ' . (bookix_child_has_composer() ? 'Loaded' : 'Not loaded') . ' -->';
    }
});
```

### 3. Unit Tests
```bash
# Chạy unit tests
cd bookix
vendor/bin/phpunit tests/Foundation/Bootstrap/BootChildThemeTest.php
```

## Troubleshooting

### 1. Composer không load
**Vấn đề**: Child theme composer không được load
**Giải pháp**:
- Kiểm tra `composer.json` có tồn tại không
- Kiểm tra `vendor/autoload.php` có tồn tại không
- Chạy `composer install` trong child theme directory

### 2. Classes không autoload
**Vấn đề**: Classes từ child theme không được autoload
**Giải pháp**:
- Kiểm tra namespace trong `composer.json`
- Kiểm tra file structure có đúng PSR-4 không
- Chạy `composer dump-autoload`

### 3. Helper functions không load
**Vấn đề**: Helper functions không được load
**Giải pháp**:
- Kiểm tra `autoload.files` trong `composer.json`
- Kiểm tra file path có đúng không
- Chạy `composer dump-autoload`

### 4. Permission Issues
**Vấn đề**: Không thể tạo hoặc đọc files
**Giải pháp**:
```bash
# Đảm bảo quyền đọc/ghi
chmod 755 wp-content/themes/your-child-theme
chmod 644 wp-content/themes/your-child-theme/composer.json
```

## Best Practices

### 1. Namespace Convention
```php
// Sử dụng namespace riêng cho child theme
namespace YourChildTheme\Services;
namespace YourChildTheme\Controllers;
namespace YourChildTheme\Models;
```

### 2. File Organization
```
src/
├── Services/          # Business logic
├── Controllers/       # WordPress hooks & actions
├── Models/           # Data models
├── Helpers/          # Helper functions
└── helpers.php       # Global helpers
```

### 3. Error Handling
```php
if (bookix_child_has_composer()) {
    try {
        $service = new \YourChildTheme\Services\ExampleService();
        $result = $service->doSomething();
    } catch (Exception $e) {
        // Handle error
        error_log('Child theme service error: ' . $e->getMessage());
    }
}
```

### 4. Performance
- Chỉ load dependencies khi cần thiết
- Sử dụng lazy loading cho services
- Cache kết quả khi có thể

### 5. Security
- Validate input data
- Sanitize output data
- Use WordPress nonces for forms
- Follow WordPress coding standards

## Integration với Jankx Framework

### 1. Bootstrap Integration
Child Theme Boot được tích hợp vào Jankx Framework bootstrap system:
- Chạy sau `ThemeDataLoader`
- Chạy trước `RegisterProviders`
- Đăng ký với application container

### 2. Service Container
```php
// Truy cập child theme composer info
$app = jankx_app();
$composerInfo = $app->make('child_theme.composer');
```

### 3. Logging
```php
// Sử dụng Jankx Log Facade
use Jankx\Facades\Log;

Log::debug('Child theme composer loaded: ' . $composerInfo['name']);
```

## Changelog

### Version 1.0.0
- ✅ Tạo Bootstrap BootChildTheme
- ✅ Tích hợp vào HTTP và Console Kernels
- ✅ Thêm helper functions
- ✅ Tạo test page và documentation
- ✅ Hỗ trợ PSR-4 autoloading
- ✅ Error handling và logging
- ✅ Package info registration với application

## Kết luận

Child Theme Boot là một tính năng mạnh mẽ trong Jankx Framework cho phép child themes có thể sử dụng composer dependencies và autoloading riêng, đồng thời tích hợp hoàn hảo với Jankx Framework architecture. Tính năng này cung cấp:

- **Flexibility**: Child themes có thể có dependencies riêng
- **Modularity**: Code được tổ chức theo PSR-4 standards
- **Maintainability**: Dễ dàng quản lý và update
- **Performance**: Autoloading hiệu quả
- **Integration**: Tích hợp hoàn hảo với Jankx Framework

Với Child Theme Boot, developers có thể tạo ra những child themes mạnh mẽ và linh hoạt, đồng thời tận dụng được tất cả tính năng của Jankx Framework.