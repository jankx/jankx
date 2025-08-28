# Hệ Thống Modules - Jankx Theme

## Tổng Quan

Jankx theme sử dụng hệ thống modules để tổ chức và quản lý các tính năng một cách modular. Mỗi module là một đơn vị độc lập có thể được kích hoạt/vô hiệu hóa và có cấu trúc riêng biệt.

## Cấu Trúc Module

### 1. Thư Mục Module
```
includes/modules/
├── module-name/
│   ├── manifest.json          # Cấu hình module
│   ├── includes/              # PHP classes
│   ├── assets/                # CSS, JS, images
│   ├── blocks/                # Gutenberg blocks
│   ├── templates/             # Template files
│   └── screenshots/           # Screenshots cho documentation
```

### 2. File Manifest.json

File `manifest.json` là trung tâm cấu hình của mỗi module, định nghĩa tất cả thông tin cần thiết:

```json
{
    "module_id": "unique-module-id",
    "name": "Module Display Name",
    "version": "1.0.0",
    "description": "Mô tả module",
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
    "class": "Jankx\\Modules\\ModuleName\\ModuleClass",
    "file": "includes/ModuleClass.php",
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
        "class": "Jankx\\Modules\\ModuleName\\Blocks\\BlockClass",
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

## Ví Dụ Thực Tế: Formiflex Module

Dựa trên module Formiflex, đây là cách một module hoàn chỉnh được cấu hình:

### Manifest.json của Formiflex
```json
{
    "module_id": "formiflex",
    "name": "Formiflex",
    "version": "1.0.0",
    "description": "Advanced form builder module for Jankx theme with drag and drop interface",
    "author": "Jankx Team",
    "license": "GPL v2 or later",
    "requires": "5.0",
    "tested": "6.4",
    "requires_php": "7.4",
    "dependencies": {
        "jankx": "2.0.0"
    },
    "caller": {
        "class": "Jankx\\Modules\\Formiflex\\FormiflexModule",
        "file": "includes/FormiflexModule.php",
        "method": "register_hooks",
        "args": [],
        "autoload": true,
        "priority": 10
    },
    "blocks": [
        {
            "name": "formiflex/form",
            "class": "Jankx\\Modules\\Formiflex\\Blocks\\FormiflexBlock",
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

## Cách Tạo Module Mới

### 1. Tạo Cấu Trúc Thư Mục
```bash
mkdir -p includes/modules/your-module-name/{includes,assets/{css,js},blocks,templates,screenshots}
```

### 2. Tạo Manifest.json
```json
{
    "module_id": "your-module-name",
    "name": "Your Module Name",
    "version": "1.0.0",
    "description": "Mô tả module của bạn",
    "author": "Your Name",
    "license": "GPL v2 or later",
    "requires": "5.0",
    "tested": "6.4",
    "requires_php": "7.4",
    "dependencies": {
        "jankx": "2.0.0"
    },
    "caller": {
        "class": "Jankx\\Modules\\YourModule\\YourModuleClass",
        "file": "includes/YourModuleClass.php",
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

### 3. Tạo Main Module Class
```php
<?php
namespace Jankx\Modules\YourModule;

use Jankx\Framework\Module\AbstractModule;

class YourModuleClass extends AbstractModule
{
    public function register_hooks()
    {
        add_action('init', [$this, 'init_module']);
    }

    public function init_module()
    {
        // Khởi tạo module
    }
}
```

## Best Practices

### 1. Naming Convention
- Module ID: lowercase, hyphens
- Class names: PascalCase
- File names: PascalCase.php
- Namespace: `Jankx\Modules\ModuleName`

### 2. File Organization
- Tách biệt admin và frontend assets
- Sử dụng autoloading cho classes
- Tổ chức blocks trong thư mục riêng

### 3. Documentation
- Luôn có screenshots
- Cập nhật changelog
- Cung cấp documentation URL

## Kết Luận

Hệ thống modules của Jankx theme cung cấp một cách tổ chức và quản lý code hiệu quả, cho phép:
- Phát triển tính năng độc lập
- Dễ dàng maintain và update
- Tái sử dụng code
- Quản lý dependencies
- Documentation tự động
