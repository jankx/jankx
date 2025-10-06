# Advanced Filter Block

Bộ lọc nâng cao với khả năng tương tác AJAX và tích hợp với Post Layout block.

## Tính năng

- **Tương tác AJAX**: Lọc dữ liệu mà không cần tải lại trang
- **Tích hợp Post Layout**: Tương thích hoàn toàn với block Post Layout
- **Builder Interface**: Giao diện builder dễ sử dụng trong editor
- **Nhiều loại filter**: Taxonomy, Meta, Date, Price, Custom
- **Hệ thống hooks mở rộng**: Dễ dàng custom và mở rộng
- **Responsive**: Tự động thích ứng với các thiết bị khác nhau

## Cài đặt

Block đã được đăng ký tự động trong `GutenbergService.php`. Chỉ cần:

1. Chạy build để compile assets:

```bash
cd wp-content/themes/jankx/resources/blocks/advanced-filter/
npm install
npm run build
```

2. Block sẽ xuất hiện trong editor WordPress với tên "Advanced Filter"

## Sử dụng

### 1. Thêm block vào editor

1. Mở editor WordPress
2. Thêm block "Advanced Filter"
3. Cấu hình các loại filter trong Inspector Controls

### 2. Cấu hình Filter

#### Taxonomy Filter
- Chọn taxonomy (category, tag, etc.)
- Cấu hình layout (dropdown, checkbox, radio, button-group, tag-cloud)
- Thiết lập các tùy chọn hiển thị

#### Meta Filter
- Chọn meta key
- Cấu hình loại input (text, number, date, select, checkbox)
- Thiết lập toán tử so sánh

#### Custom Filter
- Tạo filter tùy chỉnh
- Cấu hình field và toán tử
- Thiết lập giá trị mặc định

### 3. Cấu hình Target Blocks

1. Chọn các block Post Layout làm target
2. Thiết lập CSS selector
3. Kích hoạt filter cho target

### 4. Cấu hình AJAX

- Bật/tắt AJAX
- Thiết lập text loading và error
- Cấu hình animation và debounce

## Hooks và Filters

### PHP Hooks

#### Register Filter Type
```php
add_action('jankx_advanced_filter_init', function($hooks) {
    $hooks->register_filter_type('custom_type', [
        'name' => 'Custom Filter Type',
        'description' => 'Description of custom filter',
        'fields' => [
            'field1' => [
                'type' => 'text',
                'label' => 'Field 1',
                'required' => true
            ]
        ],
        'query_callback' => 'my_custom_query_handler',
        'render_callback' => 'my_custom_render_handler'
    ]);
});
```

#### Custom Query Handler
```php
add_filter('jankx_advanced_filter_query_args', function($query_args, $filters, $block_attrs) {
    // Custom query logic
    return $query_args;
}, 10, 3);
```

#### Custom Render Handler
```php
add_filter('jankx_advanced_filter_render_posts', function($output, $posts, $display_options, $styling) {
    // Custom render logic
    return $output;
}, 10, 4);
```

### JavaScript Hooks

#### Custom Filter Handler
```javascript
jQuery(document).on('jankx:filter:before', function(e, filterData) {
    // Custom logic before filter
});

jQuery(document).on('jankx:filter:after', function(e, results) {
    // Custom logic after filter
});
```

## API Reference

### PHP Classes

#### AdvancedFilterHandler
Xử lý AJAX requests và query logic.

#### AdvancedFilterHooks
Quản lý hệ thống hooks và filter types.

#### AdvancedFilterIntegration
Tích hợp với theme và register block.

### JavaScript Classes

#### AdvancedFilter
Class chính xử lý tương tác frontend.

## Styling

### CSS Classes

- `.jankx-advanced-filter`: Container chính
- `.jankx-filter-taxonomy`: Taxonomy filter
- `.jankx-filter-meta`: Meta filter
- `.jankx-filter-custom`: Custom filter
- `.jankx-filter-date`: Date filter
- `.jankx-filter-price`: Price filter
- `.jankx-filter-option`: Filter option
- `.jankx-filter-input`: Input field
- `.jankx-filter-reset`: Reset button

### SCSS Variables

```scss
$jankx-filter-primary-color: #007cba;
$jankx-filter-border-color: #ddd;
$jankx-filter-border-radius: 4px;
$jankx-filter-gap: 15px;
```

## Troubleshooting

### Lỗi thường gặp

1. **Filter không hoạt động**: Kiểm tra target blocks và CSS selector
2. **AJAX lỗi**: Kiểm tra nonce và AJAX URL
3. **Styling không đúng**: Kiểm tra CSS classes và SCSS compilation

### Debug

Bật debug mode để xem log:

```php
define('JANKX_DEBUG', true);
```

## Changelog

### Version 1.0.0
- Initial release
- Basic filter functionality
- AJAX integration
- Post Layout compatibility
- Hooks system

## License

GPL-2.0-or-later
