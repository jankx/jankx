# Configuration System

Jankx Framework sử dụng hệ thống configuration linh hoạt để quản lý service providers và bootstrappers theo context.

## 📁 File Structure

```
config/
├── app.php          # Service providers và bootstrappers theo context
└── theme.php        # Theme-specific settings
```

## 🏗️ Configuration Files

### `config/app.php`

File này định nghĩa service providers và bootstrappers cho từng context:

```php
<?php

return [
    'providers' => [
        // Global providers (loaded in all contexts)
        'global' => [
            'Jankx\Providers\ServiceProvider',
        ],

        // Admin context providers
        'admin' => [
            'Jankx\Providers\AdminServiceProvider',
            'Jankx\Providers\GutenbergServiceProvider',
        ],

        // Frontend context providers
        'frontend' => [
            'Jankx\Providers\FrontendServiceProvider',
            'Jankx\Providers\AssetServiceProvider',
            'Jankx\Providers\DebugServiceProvider',
        ],

        // CLI context providers
        'cli' => [
            'Jankx\Providers\CLIServiceProvider',
        ],
    ],

    'bootstrappers' => [
        // Global bootstrappers (loaded in all contexts)
        'global' => [
            'Jankx\Bootstrappers\Global\CoreBootstrapper',
        ],

        // Admin context bootstrappers
        'admin' => [
            'Jankx\Bootstrappers\Dashboard\AdminBootstrapper',
            'Jankx\Bootstrappers\Gutenberg\GutenbergBootstrapper',
        ],

        // Frontend context bootstrappers
        'frontend' => [
            'Jankx\Bootstrappers\Frontend\FrontendBootstrapper',
            'Jankx\Bootstrappers\Frontend\AssetBootstrapper',
            'Jankx\Bootstrappers\Global\DebugBootstrapper',
        ],

        // CLI context bootstrappers
        'cli' => [
            'Jankx\Bootstrappers\CLI\CLIBootstrapper',
        ],
    ],

    'context_detection' => [
        'admin' => 'is_admin()',
        'frontend' => '!is_admin() && !(defined("REST_REQUEST") && REST_REQUEST) && !(defined("WP_CLI") && WP_CLI)',
        'cli' => 'defined("WP_CLI") && WP_CLI',
        'api' => 'wp_doing_ajax()',
        'ajax' => 'wp_doing_ajax()',
        'not_found' => 'is_404()',
    ],

    'provider_priority' => [
        'Jankx\Providers\ServiceProvider' => 1,
        'Jankx\Providers\DebugServiceProvider' => 2,
        'Jankx\Providers\AdminServiceProvider' => 10,
        'Jankx\Providers\FrontendServiceProvider' => 10,
    ],

    'bootstrapper_priority' => [
        'Jankx\Bootstrappers\Global\CoreBootstrapper' => 1,
        'Jankx\Bootstrappers\Global\DebugBootstrapper' => 2,
        'Jankx\Bootstrappers\Dashboard\AdminBootstrapper' => 20,
        'Jankx\Bootstrappers\Frontend\FrontendBootstrapper' => 15,
    ],
];
```

## 🔧 Context Detection

Framework tự động detect context dựa trên các rules:

- **admin**: `is_admin()`
- **frontend**: `!is_admin() && !REST_REQUEST && !WP_CLI`
- **cli**: `defined('WP_CLI') && WP_CLI`
- **api**: `wp_doing_ajax()`
- **ajax**: `wp_doing_ajax()`
- **not_found**: `is_404()`

## 🐛 Debug Services

Debug services (`DebugServiceProvider` và `DebugBootstrapper`) chỉ được load trong **frontend context** để:

- **Tối ưu performance**: Không load debug tools trong admin
- **Bảo mật**: Không expose debug info trong admin area
- **User experience**: Chỉ hiển thị debug info cho developers trên frontend

```php
// Debug services chỉ load trong frontend
'frontend' => [
    'Jankx\Providers\FrontendServiceProvider',
    'Jankx\Providers\AssetServiceProvider',
    'Jankx\Providers\DebugServiceProvider',  // ← Chỉ frontend
],
'frontend' => [
    'Jankx\Bootstrappers\Frontend\FrontendBootstrapper',
    'Jankx\Bootstrappers\Frontend\AssetBootstrapper',
    'Jankx\Bootstrappers\Global\DebugBootstrapper',  // ← Chỉ frontend
],
```

## 📦 Priority System

Service providers và bootstrappers được load theo priority:

- **Lower numbers = Higher priority**
- **Global items** được load trước
- **Context-specific items** được load sau

## 🎨 Child Theme Customization

### Thêm Custom Service Providers

```php
// config/app.php trong child theme
return [
    'providers' => [
        'admin' => [
            'MyTheme\Providers\CustomAdminServiceProvider',
        ],
        'frontend' => [
            'MyTheme\Providers\CustomFrontendServiceProvider',
        ],
    ],
];
```

### Thêm Custom Bootstrappers

```php
// config/app.php trong child theme
return [
    'bootstrappers' => [
        'admin' => [
            'MyTheme\Bootstrappers\CustomAdminBootstrapper',
        ],
        'frontend' => [
            'MyTheme\Bootstrappers\CustomFrontendBootstrapper',
        ],
    ],
];
```

### Override Priority

```php
// config/app.php trong child theme
return [
    'provider_priority' => [
        'MyTheme\Providers\CustomServiceProvider' => 5,
    ],
    'bootstrapper_priority' => [
        'MyTheme\Bootstrappers\CustomBootstrapper' => 25,
    ],
];
```

## 🔍 Usage Examples

### Kiểm tra context hiện tại

```php
use Jankx\Config\ConfigManager;

$context = ConfigManager::getCurrentContext();
echo "Current context: {$context}";
```

### Lấy service providers cho context

```php
use Jankx\Config\ConfigManager;

$providers = ConfigManager::getServiceProviders();
foreach ($providers as $provider) {
    echo "Loading provider: {$provider}";
}
```

### Lấy bootstrappers cho context

```php
use Jankx\Config\ConfigManager;

$bootstrappers = ConfigManager::getBootstrappers();
foreach ($bootstrappers as $bootstrapper) {
    echo "Loading bootstrapper: {$bootstrapper}";
}
```

### Kiểm tra xem provider có được load không

```php
use Jankx\Config\ConfigManager;

if (ConfigManager::shouldLoadProvider('MyTheme\Providers\CustomProvider')) {
    echo "Custom provider will be loaded";
}
```

## 🚀 Benefits

### ✅ **Flexibility**
- Dễ dàng thêm/xóa service providers và bootstrappers
- Child themes có thể customize mà không cần modify parent theme

### ✅ **Performance**
- Chỉ load những gì cần thiết cho context hiện tại
- Priority system đảm bảo load đúng thứ tự

### ✅ **Maintainability**
- Configuration tách biệt khỏi code
- Dễ dàng debug và troubleshoot

### ✅ **Extensibility**
- Child themes có thể extend mà không override
- Plugin có thể hook vào configuration system

## 🔧 Advanced Usage

### Custom Context Detection

```php
// Trong child theme
add_filter('jankx_context_detection', function($detection) {
    $detection['custom'] = 'my_custom_condition()';
    return $detection;
});
```

### Dynamic Configuration

```php
// Thêm configuration động
ConfigManager::set('app.providers.admin', [
    'MyTheme\Providers\DynamicProvider',
]);
```

### Conditional Loading

```php
// Trong service provider
public function register()
{
    if (ConfigManager::getCurrentContext() === 'admin') {
        $this->app->singleton(AdminService::class);
    }
}
```

---

**Next**: [Service Providers](./service-providers.md) | [Bootstrappers](./bootstrappers.md)