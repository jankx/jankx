# Advanced Filters - PSR-4 Structure

## Cấu trúc PSR-4

Các file đã được tổ chức lại theo chuẩn PSR-4:

### Namespace
```
Jankx\Gutenberg\Blocks\AdvancedFilters
```

### Files Structure
```
AdvancedFilters/
├── AdvancedFilterHandler.php      # Xử lý AJAX requests và query logic
├── AdvancedFilterHooks.php        # Hệ thống hooks và filter types
├── AdvancedFilterIntegration.php  # Tích hợp với theme và register block
└── README.md                      # Tài liệu này
```

## Thay đổi chính

### 1. Tên file
- `class-advanced-filter-handler.php` → `AdvancedFilterHandler.php`
- `class-advanced-filter-hooks.php` → `AdvancedFilterHooks.php`
- `class-advanced-filter-integration.php` → `AdvancedFilterIntegration.php`

### 2. Namespace
- Tất cả class đều sử dụng namespace `Jankx\Gutenberg\Blocks\AdvancedFilters`
- Class names đã được đổi từ `Jankx_Advanced_Filter_*` thành `AdvancedFilter*`

### 3. Class Names
- `Jankx_Advanced_Filter_Handler` → `AdvancedFilterHandler`
- `Jankx_Advanced_Filter_Hooks` → `AdvancedFilterHooks`
- `Jankx_Advanced_Filter_Integration` → `AdvancedFilterIntegration`

### 4. Cập nhật References
- File `init.php` đã được cập nhật để sử dụng namespace mới
- File `README.md` đã được cập nhật với tên class mới

## Sử dụng

### Import Class
```php
use Jankx\Gutenberg\Blocks\AdvancedFilters\AdvancedFilterHandler;
use Jankx\Gutenberg\Blocks\AdvancedFilters\AdvancedFilterHooks;
use Jankx\Gutenberg\Blocks\AdvancedFilters\AdvancedFilterIntegration;
```

### Khởi tạo
```php
// Handler
$handler = AdvancedFilterHandler::getInstance();

// Hooks
$hooks = AdvancedFilterHooks::getInstance();

// Integration
$integration = AdvancedFilterIntegration::getInstance();
```

## Lợi ích của PSR-4

1. **Autoloading**: Tự động load class khi cần thiết
2. **Namespace**: Tránh xung đột tên class
3. **Cấu trúc rõ ràng**: Dễ dàng tìm kiếm và quản lý
4. **Chuẩn hóa**: Tuân thủ các chuẩn PHP hiện đại
5. **Tương thích**: Hoạt động tốt với các framework và library khác

## Migration Notes

- Các file cũ đã được xóa
- Tất cả references đã được cập nhật
- Không có breaking changes trong API
- Backward compatibility được duy trì thông qua helper functions
