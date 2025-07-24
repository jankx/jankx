# Views Directory - Jankx 1.0 Template System

> **Template Engine System for Jankx 1.0**

Thư mục `views` chứa hệ thống template của Jankx 1.0, được thiết kế để cung cấp một cách tiếp cận linh hoạt và mạnh mẽ cho việc render các template trong WordPress theme.

## 🎯 Overview

Hệ thống template của Jankx 1.0 sử dụng một template engine tùy chỉnh để render các view, cho phép tách biệt logic và presentation một cách hiệu quả.

## 📁 Directory Structure

```
views/
├── README.md          # This documentation file
├── layouts/           # Layout templates (if exists)
├── partials/          # Partial templates (if exists)
├── components/        # Reusable components (if exists)
└── pages/            # Page-specific templates (if exists)
```

## 🔧 Template Engine Features

### Core Functionality
- **Template Inheritance**: Hỗ trợ kế thừa template
- **Partial Rendering**: Render các phần template riêng biệt
- **Variable Passing**: Truyền biến từ controller đến view
- **Conditional Rendering**: Render có điều kiện
- **Loop Support**: Hỗ trợ vòng lặp trong template

### Template Syntax
```php
// Basic template rendering
jankx_template('template-name', $data);

// Template with variables
jankx_template('user-profile', [
    'user' => $user,
    'posts' => $posts
]);

// Conditional rendering
<?php if ($condition): ?>
    <!-- content -->
<?php endif; ?>

// Loop rendering
<?php foreach ($items as $item): ?>
    <!-- item content -->
<?php endforeach; ?>
```

## 🚀 Usage Examples

### Basic Template
```php
// In your PHP file
$data = [
    'title' => 'Welcome to Jankx',
    'content' => 'This is the main content'
];

jankx_template('welcome', $data);
```

### Template with Layout
```php
// Using layout template
jankx_template('layouts/main', [
    'content' => 'Page content here',
    'sidebar' => 'Sidebar content'
]);
```

### Partial Template
```php
// Render partial template
jankx_template('partials/header', [
    'site_title' => get_bloginfo('name'),
    'navigation' => wp_nav_menu(['echo' => false])
]);
```

## 🔄 Migration from Jankx 1.0 to 2.0

### Key Changes
- **Jankx 1.0**: Sử dụng template engine tùy chỉnh với thư mục `views`
- **Jankx 2.0**: Chuyển sang Gutenberg-first architecture với thư mục `templates`

### Migration Path
1. **Template Conversion**: Chuyển đổi từ PHP templates sang HTML templates
2. **Block Integration**: Tích hợp với Gutenberg blocks
3. **Asset Management**: Sử dụng modern asset pipeline

### Template Mapping
| Jankx 1.0 (views/) | Jankx 2.0 (templates/) |
|-------------------|----------------------|
| `views/layouts/main.php` | `templates/layouts/main.html` |
| `views/partials/header.php` | `templates/parts/header.html` |
| `views/pages/home.php` | `templates/front-page.html` |

## 📋 Best Practices

### Template Organization
- **Consistent Naming**: Sử dụng naming convention nhất quán
- **Modular Design**: Tách biệt các component có thể tái sử dụng
- **Clear Hierarchy**: Tổ chức thư mục rõ ràng

### Performance Considerations
- **Caching**: Implement template caching khi cần thiết
- **Minimal Logic**: Giữ logic tối thiểu trong template
- **Efficient Queries**: Tối ưu hóa database queries

### Security Guidelines
- **Escape Output**: Luôn escape output trong template
- **Validate Input**: Validate tất cả input data
- **CSRF Protection**: Implement CSRF protection

## 🛠 Development Workflow

### Creating New Templates
1. Tạo file template trong thư mục phù hợp
2. Định nghĩa template structure
3. Implement logic rendering
4. Test template functionality

### Debugging Templates
```php
// Enable template debugging
define('JANKX_TEMPLATE_DEBUG', true);

// Debug template path
jankx_template_debug('template-name');
```

## 📚 Related Documentation

- [Jankx 2.0 Migration Guide](../docs/migration-guide.md)
- [Template System Architecture](../docs/architecture/template-system.md)
- [Gutenberg Integration](../docs/gutenberg/blocks.md)

## 🔗 Integration Points

### WordPress Integration
- **Theme Hooks**: Tích hợp với WordPress theme hooks
- **Plugin Compatibility**: Tương thích với WordPress plugins
- **Custom Post Types**: Hỗ trợ custom post types

### Framework Integration
- **Service Container**: Tích hợp với service container
- **Event System**: Sử dụng event system cho template events
- **Cache System**: Tích hợp với cache system

---

**Note**: Đây là hệ thống template của Jankx 1.0. Để sử dụng Jankx 2.0 với Gutenberg-first architecture, vui lòng tham khảo thư mục `templates/` và documentation trong `docs/`.
