# Jankx Icon Management System

## Tổng quan

Hệ thống quản lý icons của Jankx Framework cung cấp giao diện admin hoàn chỉnh để quản lý các bộ icons khác nhau, bao gồm Material Icons, Font Awesome, Custom Icons và SVG Icons.

## Tính năng chính

### 1. Dashboard
- **Quick Actions**: Liên kết nhanh đến các trang quản lý
- **System Status**: Thông tin về framework, PHP, WordPress
- **Services Status**: Kiểm tra trạng thái các services

### 2. Icons Repository
- **Icon Sets**: Hiển thị tất cả các icon types được cấu hình
- **Status Management**: Bật/tắt và quản lý auto-load cho từng type
- **Quick Actions**: Quản lý icons và import/export

### 3. Icon Management (Tab Manage)
- **Type Selection**: Chọn icon type để quản lý
- **Icon Grid**: Hiển thị icons dạng grid với preview
- **Search & Filter**: Tìm kiếm và lọc theo category
- **Icon Preview**: Xem trước icon và copy code HTML

### 4. Import/Export (Tab Import)
- **CSS Import**: Import icons từ CSS file URL hoặc upload file
- **Icon Export**: Export dữ liệu icons hiện tại
- **Type Selection**: Chọn icon type để import/export

## Cách sử dụng

### Truy cập hệ thống
1. Vào WordPress Admin → Jankx Framework
2. Chọn "Icons Repository" từ menu
3. Sử dụng các tabs để điều hướng

### Quản lý Icons
1. Chọn tab "Manage"
2. Chọn icon type muốn quản lý
3. Sử dụng search và filter để tìm icons
4. Click "Preview" để xem icon
5. Click "Copy Code" để copy HTML code

### Import Icons
1. Chọn tab "Import"
2. Chọn icon type
3. Nhập CSS URL hoặc upload file CSS
4. Điền icon prefix
5. Click "Import Icons"

## Cấu hình

### Icon Types
```php
// config/font-icons.php
'icon_types' => [
    'material' => [
        'enabled' => true,
        'auto_load' => true,
        'version' => '1.3.0',
        'cdn_url' => 'https://fonts.googleapis.com/icon?family=Material+Icons',
        'prefixes' => ['material-icons'],
        'categories' => ['outlined', 'filled', 'rounded', 'sharp', 'two-tone']
    ],
    // ... other types
]
```

### Admin Settings
```php
'admin_settings' => [
    'per_page' => 50,
    'search_enabled' => true,
    'categories_enabled' => true,
    'preview_enabled' => true,
    'import_export_enabled' => true
]
```

## Cấu trúc file

```
jankx/
├── assets/
│   └── css/
│       └── admin-pages.css          # CSS cho admin pages
├── config/
│   └── font-icons.php               # Cấu hình icon system
├── includes/Jankx/
│   ├── Services/
│   │   └── AdminPageService.php     # Service quản lý admin pages
│   └── Support/Providers/
│       └── JankxAdminPagesServiceProvider.php  # Service provider
└── docs/
    └── ICON_MANAGEMENT_SYSTEM.md    # Documentation này
```

## API Usage

### Trong code PHP
```php
// Lấy admin pages service
$adminPages = app()->make('jankx.admin-pages');

// Render page cụ thể
$adminPages->renderPage('jankx-icons');

// Thêm page mới
$adminPages->addPage([
    'id' => 'custom-page',
    'title' => 'Custom Page',
    'callback' => [$this, 'renderCustomPage']
]);
```

### Trong templates
```php
// Sử dụng trong template files
<?php
$adminPages = app()->make('jankx.admin-pages');
$adminPages->renderPage('jankx-icons');
?>
```

## Customization

### Thêm Icon Type mới
1. Cập nhật `config/font-icons.php`
2. Thêm cấu hình cho type mới
3. Hệ thống sẽ tự động hiển thị trong admin

### Tùy chỉnh giao diện
1. Sửa `AdminPageService.php`
2. Override các methods render
3. Cập nhật CSS trong `admin-pages.css`

### Thêm tính năng mới
1. Extend `AdminPageService` class
2. Thêm methods mới
3. Cập nhật service provider

## Troubleshooting

### Icons không hiển thị
- Kiểm tra icon type có được enable không
- Kiểm tra CSS có được load không
- Kiểm tra console errors

### Import không hoạt động
- Kiểm tra quyền upload
- Kiểm tra format CSS file
- Kiểm tra icon prefix

### Performance issues
- Kiểm tra cache settings
- Giảm số lượng icons hiển thị
- Sử dụng lazy loading

## Future Enhancements

- [ ] AJAX loading cho icons
- [ ] Drag & drop icon management
- [ ] Icon collections và favorites
- [ ] Bulk operations
- [ ] Icon analytics và usage tracking
- [ ] Integration với Gutenberg blocks
- [ ] REST API endpoints
- [ ] CLI commands cho icon management

## Support

Nếu gặp vấn đề, hãy:
1. Kiểm tra WordPress debug log
2. Kiểm tra browser console
3. Kiểm tra cấu hình icon types
4. Liên hệ support team
