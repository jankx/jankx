# Jankx Extension System

Hệ thống extension cho Jankx Theme Framework, cho phép tạo và quản lý các extension một cách linh hoạt.

## Cấu trúc Extension

Mỗi extension cần có cấu trúc thư mục như sau:

```
includes/extensions/
├── extension-name/
│   ├── manifest.json          # File cấu hình chính (bắt buộc)
│   ├── includes/
│   │   ├── ExtensionNameExtension.php
│   │   └── Blocks/
│   │       └── ExtensionNameBlock.php
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
    "extension_id": "unique-extension-identifier",
    "name": "Extension Name",
    "version": "1.0.0",
    "description": "Extension description",
    "author": "Author Name",
    "caller": {
        "class": "Jankx\\Extensions\\ExtensionName\\Includes\\ExtensionNameExtension",
        "file": "includes/ExtensionNameExtension.php",
        "method": "initialize",
        "args": ["feature1", "feature2"],
        "autoload": true,
        "priority": 10
    },
    "blocks": [
        {
            "name": "extension-name/block-name",
            "class": "Jankx\\Extensions\\ExtensionName\\Includes\\Blocks\\ExtensionNameBlock",
            "file": "includes/Blocks/ExtensionNameBlock.php"
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

### Extension ID (Unique Identifier)

Extension ID là trường bắt buộc để tránh việc load trùng lặp extension:

```json
{
    "extension_id": "formiflex",
    "name": "Formiflex",
    "version": "1.0.0"
}
```

**Tính năng:**
- **Tránh trùng lặp**: Nếu extension với cùng ID đã được load, extension sau sẽ bị bỏ qua
- **Child theme override**: Child theme extension với cùng ID sẽ override parent theme extension
- **Logging**: Hệ thống sẽ log khi phát hiện extension trùng lặp

**Quy tắc đặt tên:**
- Sử dụng lowercase và dấu gạch ngang
- Phải là unique trong toàn bộ hệ thống
- Ví dụ: `"formiflex"`, `"my-custom-extension"`, `"advanced-carousel"`

**Fallback:**
- Nếu không có `extension_id`, hệ thống sẽ sử dụng tên thư mục làm ID
- Khuyến nghị luôn khai báo `extension_id` để tránh xung đột

### Caller Method và Args

Caller có thể khai báo method và args để gọi sau khi extension được khởi tạo:

```json
{
    "caller": {
        "class": "Jankx\\Extensions\\MyExtension\\Includes\\MyExtensionExtension",
        "file": "includes/MyExtensionExtension.php",
        "method": "setup",
        "args": ["feature1", "feature2", {"option": "value"}],
        "autoload": true,
        "priority": 10
    }
}
```

**Cách hoạt động:**
1. Extension class được khởi tạo
2. Nếu có `method` trong caller, method đó sẽ được gọi
3. Nếu có `args`, chúng sẽ được truyền vào method
4. Args có thể là array hoặc single value

**Ví dụ method trong extension:**
```php
public function setup($feature1, $feature2, $options = [])
{
    // Configure extension based on manifest args
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
// Trong extension class
class MyExtension extends Extension
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

- **extension_id**: ID duy nhất của extension (bắt buộc)
  - Phải là unique để tránh load trùng lặp
  - Nếu không có, sẽ sử dụng tên thư mục làm ID
  - Ví dụ: `"formiflex"`, `"my-custom-extension"`
- **caller**: Cấu hình class chính của extension
  - `class`: Tên class của extension
  - `file`: Đường dẫn file chứa class
  - `method`: Method để gọi sau khi khởi tạo (tùy chọn)
  - `args`: Arguments để truyền vào method (tùy chọn)
  - `autoload`: Có tự động load không
  - `priority`: Độ ưu tiên load
- **blocks**: Danh sách các Gutenberg blocks
- **assets**: Cấu hình CSS/JS files
- **hooks**: Cấu hình WordPress hooks

## Tạo Extension Mới

### 1. Tạo thư mục extension

```bash
mkdir -p includes/extensions/my-extension
```

### 2. Tạo manifest.json

```json
{
    "extension_id": "my-extension",
    "name": "My Extension",
    "version": "1.0.0",
    "description": "My custom extension",
    "author": "Your Name",
    "caller": {
        "class": "Jankx\\Extensions\\MyExtension\\Includes\\MyExtensionExtension",
        "file": "includes/MyExtensionExtension.php",
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

### 3. Tạo Extension Class

```php
<?php
namespace Jankx\Extensions\MyExtension\Includes;

use Jankx\Framework\Extensions\Extension;

class MyExtensionExtension extends Extension
{
    protected function init()
    {
        // Extension initialization
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
        // Configure extension based on manifest args
        $this->set_setting('feature_1', $feature1);
        $this->set_setting('feature_2', $feature2);
    }
}
```

## API Functions

### Quản lý Extension

```php
// Kiểm tra extension tồn tại
if (jankx_extension_exists('my-extension')) {
    // Extension exists
}

// Kiểm tra extension active
if (jankx_extension_is_active('my-extension')) {
    // Extension is active
}

// Lấy instance extension
$extension = jankx_get_extension('my-extension');

// Enable/Disable extension
jankx_enable_extension('my-extension');
jankx_disable_extension('my-extension');
jankx_toggle_extension('my-extension');

// Lấy trạng thái extension
$status = jankx_get_extension_status('my-extension'); // 'enabled', 'disabled', 'auto'
```

### Quản lý User Settings

```php
// Lấy user setting
$api_key = jankx_get_extension_setting('my-extension', 'api_key', 'default_value');

// Lưu user setting
jankx_set_extension_setting('my-extension', 'api_key', 'new_api_key');

// Lấy tất cả settings của extension
$settings = jankx_get_extension_settings('my-extension');

// Lưu nhiều settings
jankx_set_extension_settings('my-extension', [
    'api_key' => 'new_key',
    'enabled' => true
]);
```

### Lấy thông tin

```php
// Lấy tất cả extensions
$extensions = jankx_get_extensions();

// Lấy active extensions
$active_extensions = jankx_get_active_extensions();

// Lấy thống kê
$stats = jankx_get_extension_stats();

// Lấy extension IDs mapping
$extension_ids = jankx_get_extension_ids();

// Kiểm tra extension ID tồn tại
if (jankx_has_extension_id('formiflex')) {
    // Extension exists
}

// Lấy đường dẫn extension theo ID
$path = jankx_get_extension_path_by_id('formiflex');
```

### Service Instances

```php
// Lấy Extension Service Provider
$serviceProvider = jankx_get_extension_service_provider();

// Lấy Extension Service
$service = jankx_get_extension_service();

// Lấy Extension Manager
$manager = jankx_get_extension_manager();
```

## Hooks và Filters

### Extension Hooks

```php
// Extension được enable
add_action('jankx/extension/enabled', function($extension_name, $extension) {
    // Extension was enabled
}, 10, 2);

// Extension được disable
add_action('jankx/extension/disabled', function($extension_name, $extension) {
    // Extension was disabled
}, 10, 2);

// Extension được boot
add_action('jankx/extension/booted', function($extension_name, $extension) {
    // Extension was booted
}, 10, 2);
```

### Extension Filters

```php
// Filter extension load
add_filter('jankx/extension/should_load', function($should_load, $extension_name, $extension) {
    // Custom logic to determine if extension should load
    return $should_load;
}, 10, 3);

// Filter specific extension
add_filter('jankx/extension/my-extension/should_load', function($should_load, $extension) {
    // Custom logic for specific extension
    return $should_load;
}, 10, 2);
```

## Child Theme Support

Extensions có thể được cài đặt trong child theme:

```
child-theme/
├── includes/
│   └── extensions/
│       └── my-extension/
│           ├── manifest.json
│           └── includes/
│               └── MyExtensionExtension.php
```

Child theme extensions sẽ override parent theme extensions.

## Admin Interface

Extension Manager có sẵn admin interface tại:
**Appearance > Extension Manager**

Tính năng:
- Xem danh sách extensions
- Enable/Disable extensions
- Xem thống kê
- Quản lý extension settings

## Best Practices

1. **Luôn sử dụng manifest.json**: Đây là cách duy nhất để extension được load
2. **Namespace đúng chuẩn**: Sử dụng namespace `Jankx\Extensions\ExtensionName`
3. **Child theme support**: Đặt extensions trong child theme để override
4. **Dependencies**: Khai báo dependencies trong manifest
5. **Hooks**: Sử dụng hooks configuration trong manifest
6. **Assets**: Quản lý CSS/JS thông qua assets configuration

## Troubleshooting

### Extension không load
- Kiểm tra file `manifest.json` tồn tại
- Kiểm tra `caller.class` và `caller.file` đúng
- Kiểm tra namespace và class name

### Extension không active
- Kiểm tra dependencies
- Kiểm tra extension settings trong admin
- Kiểm tra filters `jankx/extension/should_load`

### Lỗi namespace
- Đảm bảo namespace đúng chuẩn
- Kiểm tra autoloader
- Kiểm tra file path trong manifest
