# Hệ Thống Extensions - Jankx Theme

## Tổng Quan

Jankx theme sử dụng hệ thống extensions để tổ chức và quản lý các tính năng một cách modular. Mỗi extension là một đơn vị độc lập có thể được kích hoạt/vô hiệu hóa và có cấu trúc riêng biệt.

## Cấu Trúc Extension

### 1. Thư Mục Extension
```
includes/extensions/
├── extension-name/
│   ├── manifest.json          # Cấu hình extension
│   ├── includes/              # PHP classes
│   ├── assets/                # CSS, JS, images
│   ├── blocks/                # Gutenberg blocks
│   ├── templates/             # Template files
│   └── screenshots/           # Screenshots cho documentation
```

### 2. File Manifest.json

File `manifest.json` là trung tâm cấu hình của mỗi extension, định nghĩa tất cả thông tin cần thiết:

```json
{
    "extension_id": "unique-extension-id",
    "name": "Extension Display Name",
    "version": "1.0.0",
    "description": "Mô tả extension",
    "author": "Author Name",
    "license": "GPL v2 or later",
    "requires": "5.0",
    "tested": "6.4",
    "requires_php": "7.4"
}
```

## Các Thành Phần Chính

### 1. Caller Configuration
```json
"caller": {
    "class": "Jankx\\Extensions\\ExtensionName\\ExtensionClass",
    "file": "includes/ExtensionClass.php",
    "method": "register_hooks",
    "args": [],
    "autoload": true,
    "priority": 10
}
```

### 2. Blocks Configuration
```json
"blocks": [
    {
        "name": "namespace/block-name",
        "class": "Jankx\\Extensions\\ExtensionName\\Blocks\\BlockClass",
        "file": "includes/Blocks/BlockClass.php"
    }
]
```

### 3. Assets Management
```json
"assets": {
    "admin": {
        "css": ["assets/css/admin.css"],
        "js": ["assets/js/admin.js"]
    },
    "frontend": {
        "css": ["assets/css/frontend.css"],
        "js": ["assets/js/frontend.js"]
    }
}
```

### 4. Hooks Registration
```json
"hooks": {
    "init": ["register_blocks"],
    "wp_enqueue_scripts": ["enqueue_frontend_assets"],
    "enqueue_block_editor_assets": ["enqueue_editor_assets"]
}
```

## Ví Dụ Thực Tế: Formiflex Extension

Dựa trên extension Formiflex, đây là cách một extension hoàn chỉnh được cấu hình:

### Manifest.json của Formiflex
```json
{
    "extension_id": "formiflex",
    "name": "Formiflex",
    "version": "1.0.0",
    "description": "Advanced form builder extension for Jankx theme with drag and drop interface",
    "author": "Jankx Team",
    "license": "GPL v2 or later",
    "requires": "5.0",
    "tested": "6.4",
    "requires_php": "7.4",
    "dependencies": {
        "jankx": "2.0.0"
    },
    "caller": {
        "class": "Jankx\\Extensions\\Formiflex\\FormiflexExtension",
        "file": "includes/FormiflexExtension.php",
        "method": "register_hooks",
        "args": [],
        "autoload": true,
        "priority": 10
    },
    "blocks": [
        {
            "name": "formiflex/form",
            "class": "Jankx\\Extensions\\Formiflex\\Blocks\\FormiflexBlock",
            "file": "includes/Blocks/FormiflexBlock.php"
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

## Cách Tạo Extension Mới

### 1. Tạo Cấu Trúc Thư Mục
```bash
mkdir -p includes/extensions/your-extension-name/{includes,assets/{css,js},blocks,templates,screenshots}
```

### 2. Tạo Manifest.json
```json
{
    "extension_id": "your-extension-name",
    "name": "Your Extension Name",
    "version": "1.0.0",
    "description": "Mô tả extension của bạn",
    "author": "Your Name",
    "license": "GPL v2 or later",
    "requires": "5.0",
    "tested": "6.4",
    "requires_php": "7.4",
    "dependencies": {
        "jankx": "2.0.0"
    },
    "caller": {
        "class": "Jankx\\Extensions\\YourExtension\\YourExtensionClass",
        "file": "includes/YourExtensionClass.php",
        "method": "register_hooks",
        "args": [],
        "autoload": true,
        "priority": 10
    },
    "blocks": [],
    "assets": {
        "admin": {
            "css": [],
            "js": []
        },
        "frontend": {
            "css": [],
            "js": []
        }
    },
    "hooks": {}
}
```

### 3. Tạo Main Extension Class
```php
<?php
namespace Jankx\Extensions\YourExtension;

use Jankx\Extension\AbstractExtension;

class YourExtensionClass extends AbstractExtension
{
    public function register_hooks()
    {
        add_action('init', [$this, 'init_extension']);
    }

    public function init_extension()
    {
        // Khởi tạo extension
    }
}
```

## Best Practices

### 1. Naming Convention
- Extension ID: lowercase, hyphens
- Class names: PascalCase
- File names: PascalCase.php
- Namespace: `Jankx\Extensions\ExtensionName`

### 2. File Organization
- Tách biệt admin và frontend assets
- Sử dụng autoloading cho classes
- Tổ chức blocks trong thư mục riêng

### 3. Documentation
- Luôn có screenshots
- Cập nhật changelog
- Cung cấp documentation URL

## Kết Luận

Hệ thống extensions của Jankx theme cung cấp một cách tổ chức và quản lý code hiệu quả, cho phép:
- Phát triển tính năng độc lập
- Dễ dàng maintain và update
- Tái sử dụng code
- Quản lý dependencies
- Documentation tự động
