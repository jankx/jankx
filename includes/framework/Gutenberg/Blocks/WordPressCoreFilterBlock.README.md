# WordPress Core Filter Block

## Giới thiệu

Class `WordPressCoreFilterBlock` cho phép bạn chèn thêm content (như icons, images, SVG) vào các WordPress core blocks như `core/button` và `core/read-more`.

## Các blocks được hỗ trợ

### Core Blocks (được filter)
- `core/button` - Button blocks
- `core/read-more` - Read more links

### Jankx Blocks (có thể chèn vào)
- `jankx/icon-button` - Material Icons
- `jankx/image-button` - Image icons
- `jankx/svg-icon` - SVG icons

## Cách sử dụng

### 1. Sử dụng trong Gutenberg Editor

Khi tạo một `core/button` hoặc `core/read-more` block, bạn có thể thêm các attributes sau vào block:

```json
{
  "hasIcon": true,
  "iconType": "jankx/icon-button",
  "iconName": "arrow_forward",
  "iconStyle": "filled",
  "iconSize": "20px",
  "iconColor": "#ffffff",
  "iconPosition": "after"
}
```

### 2. Ví dụ với Material Icon (jankx/icon-button)

```html
<!-- wp:button {"hasIcon":true,"iconType":"jankx/icon-button","iconName":"shopping_cart","iconStyle":"filled","iconSize":"18px","iconPosition":"before"} -->
<div class="wp-block-button">
  <a class="wp-block-button__link">Add to Cart</a>
</div>
<!-- /wp:button -->
```

Kết quả sẽ render:
```html
<div class="wp-block-button">
  <a class="wp-block-button__link has-icon icon-position-before">
    <span class="material-icons" style="font-size: 18px;">shopping_cart</span>
    Add to Cart
  </a>
</div>
```

### 3. Ví dụ với Image Icon (jankx/image-button)

```html
<!-- wp:button {"hasIcon":true,"iconType":"jankx/image-button","imageUrl":"https://example.com/icon.png","imageAlt":"Icon","imageSize":"20px","iconPosition":"before"} -->
<div class="wp-block-button">
  <a class="wp-block-button__link">Learn More</a>
</div>
<!-- /wp:button -->
```

### 4. Ví dụ với SVG Icon (jankx/svg-icon)

```html
<!-- wp:button {"hasIcon":true,"iconType":"jankx/svg-icon","icon":"<svg>...</svg>","width":"20px","iconPosition":"after"} -->
<div class="wp-block-button">
  <a class="wp-block-button__link">Download</a>
</div>
<!-- /wp:button -->
```

### 5. Ví dụ với Read More Block

```html
<!-- wp:read-more {"hasIcon":true,"iconType":"jankx/icon-button","iconName":"arrow_forward","iconPosition":"after"} /-->
```

## Tùy chỉnh và mở rộng

### Thêm supported block mới

Bạn có thể thêm block mới vào danh sách supported blocks:

```php
// Trong functions.php hoặc plugin của bạn
add_action('init', function() {
    $gutenberg = app('gutenberg.service');

    $gutenberg->addSupportedBlockToFilter('custom/my-icon-block', [
        'path' => get_template_directory() . '/resources/blocks/my-icon-block',
        'priority' => 10,
    ]);
});
```

### Thêm core block mới cần filter

```php
add_action('init', function() {
    $gutenberg = app('gutenberg.service');

    // Thêm core/buttons để filter
    $gutenberg->addCoreBlockToFilter('core/buttons');
});
```

### Custom filter cho block content

```php
add_filter('jankx/gutenberg/core-filter/block-content', function($content, $block, $supportedBlocks) {
    // Custom logic ở đây
    return $content;
}, 10, 3);
```

### Custom filter cho icon HTML

```php
add_filter('jankx/gutenberg/core-filter/icon-html', function($iconHtml, $iconType, $attrs) {
    // Custom icon rendering
    return $iconHtml;
}, 10, 3);
```

### Filter danh sách supported blocks

```php
add_filter('jankx/gutenberg/core-filter/supported-blocks', function($blocks) {
    // Thêm hoặc xóa blocks
    $blocks['custom/icon-block'] = [
        'path' => '/path/to/block',
        'priority' => 10,
    ];

    return $blocks;
});
```

## API Methods

### GutenbergService Methods

```php
// Get Core Filter Block instance
$coreFilter = $gutenberg->getCoreFilterBlock();

// Get supported blocks
$supportedBlocks = $gutenberg->getSupportedBlocks();

// Add supported block
$gutenberg->addSupportedBlockToFilter('block-name', $config);

// Add core block to filter
$gutenberg->addCoreBlockToFilter('core/button');
```

### WordPressCoreFilterBlock Methods

```php
$coreFilter = app('gutenberg.service')->getCoreFilterBlock();

// Get supported blocks
$blocks = $coreFilter->getSupportedBlocks();

// Get core blocks
$coreBlocks = $coreFilter->getCoreBlocks();

// Add supported block
$coreFilter->addSupportedBlock('block-name', [
    'path' => '/path',
    'priority' => 10,
]);

// Add core block
$coreFilter->addCoreBlock('core/paragraph');
```

## Attributes Reference

### Common Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `hasIcon` | `boolean` | `false` | Có hiển thị icon không |
| `iconType` | `string` | `''` | Loại icon: `jankx/icon-button`, `jankx/image-button`, `jankx/svg-icon` |
| `iconPosition` | `string` | `'before'` | Vị trí icon: `before` hoặc `after` |

### Material Icon Attributes (jankx/icon-button)

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `iconName` | `string` | `''` | Tên Material Icon |
| `iconStyle` | `string` | `'filled'` | Style: `filled`, `outlined`, `rounded`, `sharp`, `two-tone` |
| `iconSize` | `string` | `'16px'` | Kích thước icon |
| `iconColor` | `string` | `''` | Màu icon (CSS color) |

### Image Icon Attributes (jankx/image-button)

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `imageUrl` | `string` | `''` | URL của image |
| `imageAlt` | `string` | `''` | Alt text |
| `imageSize` | `string` | `'20px'` | Chiều cao image |
| `imageMarginRight` | `string` | `'5px'` | Margin bên phải |

### SVG Icon Attributes (jankx/svg-icon)

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `icon` | `string` | `''` | SVG HTML code |
| `iconColor` | `string` | `''` | Màu SVG |
| `width` | `string` | `'20px'` | Chiều rộng SVG |

## CSS Classes

Các class CSS được tự động thêm vào elements:

- `.has-icon` - Element có icon
- `.icon-position-before` - Icon ở vị trí trước
- `.icon-position-after` - Icon ở vị trí sau

Ví dụ CSS:

```css
.wp-block-button__link.has-icon {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.wp-block-button__link.icon-position-before {
    flex-direction: row;
}

.wp-block-button__link.icon-position-after {
    flex-direction: row-reverse;
}
```

## Debugging

Class sử dụng Jankx Log facade để log thông tin:

```php
// Check logs
Log::info('WordPressCoreFilterBlock: Đã đăng ký filters cho X core blocks');
```

Để bật debug, thêm vào `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## Lưu ý

1. **Performance**: Filter được áp dụng cho mọi block render, nên cẩn thận với performance
2. **Caching**: Block output có thể được cache, clear cache khi cần thiết
3. **Compatibility**: Đảm bảo các Jankx blocks đã được đăng ký trước khi sử dụng filter
4. **Security**: Tất cả output đều được escape với `esc_attr()`, `esc_url()`, `esc_html()`

## Troubleshooting

### Icon không hiển thị

1. Kiểm tra `hasIcon` attribute có được set chưa
2. Kiểm tra `iconType` có hợp lệ không
3. Kiểm tra các attributes cần thiết (iconName, imageUrl, icon) có giá trị chưa
4. Check browser console cho lỗi JavaScript
5. Check WordPress debug log

### CSS không đúng

1. Thêm CSS custom cho `.has-icon` class
2. Kiểm tra theme CSS có override không
3. Use browser DevTools để debug

### Performance issues

1. Giảm số lượng core blocks cần filter
2. Cache block output nếu có thể
3. Optimize icon rendering code

