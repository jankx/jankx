# Content Generator Pattern

Content Generator Pattern cho phép tách biệt logic render khỏi PostLayout, giúp tái sử dụng và mở rộng dễ dàng.

## Kiến trúc

### 1. ContentGeneratorInterface
Contract cho tất cả content generators:
- `generate(WP_Query $query, array $options)`: Render content
- `generatePreview(array $options)`: Render preview cho editor
- `getName()`: Tên generator
- `getTitle()`: Tiêu đề hiển thị
- `supportsOptions(array $options)`: Kiểm tra hỗ trợ options

### 2. DefaultContentGenerator
Generator mặc định sử dụng logic render cũ của PostLayout.

### 3. CustomContentGenerator
Generator cho phép custom logic render hoàn toàn.

## Sử dụng

### Sử dụng Default Generator (mặc định)
```php
$layout = new GridLayout();
// Mặc định sử dụng DefaultContentGenerator
$html = $layout->render();
```

### Sử dụng Custom Generator
```php
use Jankx\Layouts\PostLayout\Generators\CustomContentGenerator;

$layout = new GridLayout();

// Tạo custom generator
$generator = new CustomContentGenerator(
    'my-custom-generator',
    'My Custom Generator',
    function($query, $options) {
        // Custom render logic
        return '<div>Custom content</div>';
    },
    function($options) {
        // Custom preview logic
        return ['name' => 'my-custom-generator'];
    },
    ['columns', 'customOption'] // Supported options
);

// Set generator
$layout->setContentGenerator($generator);
$html = $layout->render();
```

### Ví dụ WooCommerce
```php
use Jankx\Layouts\PostLayout\Examples\WooCommerceProductGenerator;

$layout = new GridLayout();
$layout->setContentGenerator(WooCommerceProductGenerator::create());

// Render WooCommerce products với custom logic
$html = $layout->render();
```

## Lợi ích

1. **Tách biệt concerns**: Logic render tách khỏi PostLayout
2. **Tái sử dụng**: Generator có thể dùng cho nhiều layouts
3. **Mở rộng**: Dễ dàng thêm generator mới
4. **Backward compatibility**: Layout cũ vẫn hoạt động với DefaultContentGenerator
5. **Performance**: Chỉ load logic cần thiết

## Design Patterns sử dụng

- **Strategy Pattern**: ContentGeneratorInterface định nghĩa các chiến lược render khác nhau
- **Decorator Pattern**: PostLayoutDecorator bọc layout với attributes
- **Factory Pattern**: PostLayoutFactory tạo layout instances
- **Template Method**: PostLayout định nghĩa template, concrete classes implement chi tiết
