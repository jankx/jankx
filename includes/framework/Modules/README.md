# Jankx Module System

Hệ thống module cho Jankx Theme Framework, cho phép tạo và quản lý các module một cách linh hoạt.

## Cấu trúc Module

Mỗi module cần có cấu trúc thư mục như sau:

```
includes/modules/
├── module-name/
│   ├── manifest.json          # File cấu hình chính (bắt buộc)
│   ├── includes/
│   │   ├── ModuleNameModule.php
│   │   └── Blocks/
│   │       └── ModuleNameBlock.php
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   └── blocks/
│       └── block-name/
│           ├── block.json
│           ├── index.tsx
│           └── style.scss
```

## Manifest.json vs User Settings

### Manifest.json (Developer Configuration)

File `manifest.json` là file cấu hình từ nhà phát triển, **KHÔNG** nên chỉnh sửa bởi user:

```json
{
    "module_id": "unique-module-identifier",
    "name": "Module Name",
    "version": "1.0.0",
    "description": "Module description",
    "author": "Author Name",
    "caller": {
        "class": "Jankx\\Modules\\ModuleName\\Includes\\ModuleNameModule",
        "file": "includes/ModuleNameModule.php",
        "method": "initialize",
        "args": ["feature1", "feature2"],
        "autoload": true,
        "priority": 10
    },
    "blocks": [
        {
            "name": "module-name/block-name",
            "class": "Jankx\\Modules\\ModuleName\\Includes\\Blocks\\ModuleNameBlock",
            "file": "includes/Blocks/ModuleNameBlock.php"
        }
    ],
    "assets": {
        "admin": {
            "css": ["assets/css/admin.css"],
            "js": ["assets/js/admin.js"]
        },
        "frontend": {
            "css": ["assets/css/frontend.css"],
            "js": ["assets/js/frontend.js"]
        }
    },
    "hooks": {
        "init": ["register_blocks"],
        "wp_enqueue_scripts": ["enqueue_frontend_assets"],
        "enqueue_block_editor_assets": ["enqueue_editor_assets"]
    }
}
```

**⚠️ Lưu ý**: Manifest.json chứa cấu hình kỹ thuật từ developer, không nên chỉnh sửa.

### Module ID (Unique Identifier)

Module ID là trường bắt buộc để tránh việc load trùng lặp module:

```json
{
    "module_id": "formiflex",
    "name": "Formiflex",
    "version": "1.0.0"
}
```

**Tính năng:**
- **Tránh trùng lặp**: Nếu module với cùng ID đã được load, module sau sẽ bị bỏ qua
- **Child theme override**: Child theme module với cùng ID sẽ override parent theme module
- **Logging**: Hệ thống sẽ log khi phát hiện module trùng lặp

**Quy tắc đặt tên:**
- Sử dụng lowercase và dấu gạch ngang
- Phải là unique trong toàn bộ hệ thống
- Ví dụ: `"formiflex"`, `"my-custom-module"`, `"advanced-carousel"`

**Fallback:**
- Nếu không có `module_id`, hệ thống sẽ sử dụng tên thư mục làm ID
- Khuyến nghị luôn khai báo `module_id` để tránh xung đột

### Caller Method và Args

Caller có thể khai báo method và args để gọi sau khi module được khởi tạo:

```json
{
    "caller": {
        "class": "Jankx\\Modules\\MyModule\\Includes\\MyModuleModule",
        "file": "includes/MyModuleModule.php",
        "method": "setup",
        "args": ["feature1", "feature2", {"option": "value"}],
        "autoload": true,
        "priority": 10
    }
}
```

**Cách hoạt động:**
1. Module class được khởi tạo
2. Nếu có `method` trong caller, method đó sẽ được gọi
3. Nếu có `args`, chúng sẽ được truyền vào method
4. Args có thể là array hoặc single value

**Ví dụ method trong module:**
```php
public function setup($feature1, $feature2, $options = [])
{
    // Configure module based on manifest args
    $this->set_setting('feature_1', $feature1);
    $this->set_setting('feature_2', $feature2);

    if (is_array($options)) {
        foreach ($options as $key => $value) {
            $this->set_setting($key, $value);
        }
    }
}
```

### User Settings (User Configuration)

User settings được lưu trong database và có thể chỉnh sửa qua admin interface:

```php
// Trong module class
class MyModule extends Module
{
    public function some_method()
    {
        // Lấy user setting
        $api_key = $this->get_setting('api_key', 'default_value');
        $enabled = $this->get_setting('enabled', true);

        // Lưu user setting
        $this->set_setting('api_key', 'new_api_key');
        $this->set_setting('enabled', false);
    }
}
```

### Các trường quan trọng trong Manifest:

- **module_id**: ID duy nhất của module (bắt buộc)
  - Phải là unique để tránh load trùng lặp
  - Nếu không có, sẽ sử dụng tên thư mục làm ID
  - Ví dụ: `"formiflex"`, `"my-custom-module"`
- **caller**: Cấu hình class chính của module
  - `class`: Tên class của module
  - `file`: Đường dẫn file chứa class
  - `method`: Method để gọi sau khi khởi tạo (tùy chọn)
  - `args`: Arguments để truyền vào method (tùy chọn)
  - `autoload`: Có tự động load không
  - `priority`: Độ ưu tiên load
- **blocks**: Danh sách các Gutenberg blocks
- **assets**: Cấu hình CSS/JS files
- **hooks**: Cấu hình WordPress hooks

## Tạo Module Mới

### 1. Tạo thư mục module

```bash
mkdir -p includes/modules/my-module
```

### 2. Tạo manifest.json

```json
{
    "module_id": "my-module",
    "name": "My Module",
    "version": "1.0.0",
    "description": "My custom module",
    "author": "Your Name",
    "caller": {
        "class": "Jankx\\Modules\\MyModule\\Includes\\MyModuleModule",
        "file": "includes/MyModuleModule.php",
        "method": "setup",
        "args": ["feature1", "feature2"],
        "autoload": true,
        "priority": 10
    },
    "hooks": {
        "init": ["register_blocks"]
    }
}
```

### 3. Tạo Module Class

```php
<?php
namespace Jankx\Modules\MyModule\Includes;

use Jankx\Framework\Modules\Module;

class MyModuleModule extends Module
{
    protected function init()
    {
        // Module initialization
    }

    protected function register_hooks()
    {
        // Register WordPress hooks
    }

    public function register_blocks()
    {
        // Register Gutenberg blocks
    }

    /**
     * Setup method called from manifest
     */
    public function setup($feature1, $feature2)
    {
        // Configure module based on manifest args
        $this->set_setting('feature_1', $feature1);
        $this->set_setting('feature_2', $feature2);
    }
}
```

## API Functions

### Quản lý Module

```php
// Kiểm tra module tồn tại
if (jankx_module_exists('my-module')) {
    // Module exists
}

// Kiểm tra module active
if (jankx_module_is_active('my-module')) {
    // Module is active
}

// Lấy instance module
$module = jankx_get_module('my-module');

// Enable/Disable module
jankx_enable_module('my-module');
jankx_disable_module('my-module');
jankx_toggle_module('my-module');

// Lấy trạng thái module
$status = jankx_get_module_status('my-module'); // 'enabled', 'disabled', 'auto'
```

### Quản lý User Settings

```php
// Lấy user setting
$api_key = jankx_get_module_setting('my-module', 'api_key', 'default_value');

// Lưu user setting
jankx_set_module_setting('my-module', 'api_key', 'new_api_key');

// Lấy tất cả settings của module
$settings = jankx_get_module_settings('my-module');

// Lưu nhiều settings
jankx_set_module_settings('my-module', [
    'api_key' => 'new_key',
    'enabled' => true
]);
```

### Lấy thông tin

```php
// Lấy tất cả modules
$modules = jankx_get_modules();

// Lấy active modules
$active_modules = jankx_get_active_modules();

// Lấy thống kê
$stats = jankx_get_module_stats();

// Lấy module IDs mapping
$module_ids = jankx_get_module_ids();

// Kiểm tra module ID tồn tại
if (jankx_has_module_id('formiflex')) {
    // Module exists
}

// Lấy đường dẫn module theo ID
$path = jankx_get_module_path_by_id('formiflex');
```

### Service Instances

```php
// Lấy Module Service Provider
$serviceProvider = jankx_get_module_service_provider();

// Lấy Module Service
$service = jankx_get_module_service();

// Lấy Module Manager
$manager = jankx_get_module_manager();
```

## Hooks và Filters

### Module Hooks

```php
// Module được enable
add_action('jankx/module/enabled', function($module_name, $module) {
    // Module was enabled
}, 10, 2);

// Module được disable
add_action('jankx/module/disabled', function($module_name, $module) {
    // Module was disabled
}, 10, 2);

// Module được boot
add_action('jankx/module/booted', function($module_name, $module) {
    // Module was booted
}, 10, 2);
```

### Module Filters

```php
// Filter module load
add_filter('jankx/module/should_load', function($should_load, $module_name, $module) {
    // Custom logic to determine if module should load
    return $should_load;
}, 10, 3);

// Filter specific module
add_filter('jankx/module/my-module/should_load', function($should_load, $module) {
    // Custom logic for specific module
    return $should_load;
}, 10, 2);
```

## Child Theme Support

Modules có thể được cài đặt trong child theme:

```
child-theme/
├── includes/
│   └── modules/
│       └── my-module/
│           ├── manifest.json
│           └── includes/
│               └── MyModuleModule.php
```

Child theme modules sẽ override parent theme modules.

## Admin Interface

Module Manager có sẵn admin interface tại:
**Appearance > Module Manager**

Tính năng:
- Xem danh sách modules
- Enable/Disable modules
- Xem thống kê
- Quản lý module settings

## Best Practices

1. **Luôn sử dụng manifest.json**: Đây là cách duy nhất để module được load
2. **Namespace đúng chuẩn**: Sử dụng namespace `Jankx\Modules\ModuleName`
3. **Child theme support**: Đặt modules trong child theme để override
4. **Dependencies**: Khai báo dependencies trong manifest
5. **Hooks**: Sử dụng hooks configuration trong manifest
6. **Assets**: Quản lý CSS/JS thông qua assets configuration

## Troubleshooting

### Module không load
- Kiểm tra file `manifest.json` tồn tại
- Kiểm tra `caller.class` và `caller.file` đúng
- Kiểm tra namespace và class name

### Module không active
- Kiểm tra dependencies
- Kiểm tra module settings trong admin
- Kiểm tra filters `jankx/module/should_load`

### Lỗi namespace
- Đảm bảo namespace đúng chuẩn
- Kiểm tra autoloader
- Kiểm tra file path trong manifest
