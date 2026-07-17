# Smart Breadcrumb Block

Block breadcrumb thông minh với khả năng tương thích với các plugin SEO phổ biến.

## Tính năng

### 🔌 Tương thích SEO Plugins

Block tự động phát hiện và sử dụng breadcrumb từ các plugin SEO:

- **RankMath** - Sử dụng `rank_math_the_breadcrumbs()`
- **Yoast SEO** - Sử dụng `yoast_breadcrumb()`
- **SEOPress** - Sử dụng `seopress_display_breadcrumbs()`
- **Breadcrumb NavXT** - Sử dụng `bcn_display()`
- **WooCommerce** - Sử dụng `woocommerce_breadcrumb()`

### 🎨 Style Presets

6 style presets có sẵn:

1. **Default** - Breadcrumb đơn giản với styling mặc định
2. **Minimal** - Clean minimal design
3. **Modern** - Modern với hover effects
4. **Boxed** - Items với box background
5. **Underlined** - Links với underline decoration
6. **Badge** - Items hiển thị dạng badges

### ⚙️ Settings

#### Breadcrumb Settings:
- **Show Home Link** - Hiển thị link trang chủ
- **Home Text** - Text cho link trang chủ
- **Separator** - Ký tự phân cách (›, /, →, etc.)
- **Show Current Page** - Hiển thị trang hiện tại
- **Maximum Depth** - Độ sâu tối đa của breadcrumb (1-5)

#### SEO Plugin Integration:
- **Use SEO Plugin Breadcrumb** - Ưu tiên dùng breadcrumb từ SEO plugin
- **Fallback to Custom Breadcrumb** - Tự động tạo breadcrumb nếu plugin không hỗ trợ

#### Core Styling (WordPress):
- **Color** - Background, Text, Link colors
- **Typography** - Font, Size, Weight, Line Height, etc.
- **Spacing** - Margin, Padding, Block Gap
- **Border** - Color, Radius, Style, Width
- **Background** - Images, Position, Repeat, Size
- **Dimensions** - Min Height

## Cách hoạt động

### 1. **Kiểm tra SEO Plugin**
```
useSeoPlugin = true
↓
Kiểm tra RankMath → Yoast → SEOPress → NavXT → WooCommerce
↓
Có breadcrumb? → Sử dụng
```

### 2. **Fallback to Custom**
```
Không có SEO plugin breadcrumb
↓
fallbackToCustom = true
↓
Tự động tạo breadcrumb dựa trên:
- Post Type
- Taxonomy
- Category
- Page Hierarchy
- Archive
- Search
- 404
```

### 3. **Render Output**
```
Breadcrumb HTML
↓
Áp dụng Style Preset
↓
Áp dụng Core Styling (color, spacing, etc.)
↓
Output final HTML
```

## Custom Breadcrumb Logic

### Post Types được hỗ trợ:

#### Single Post:
```
Home › Category › Post Title
```

#### Page (with parents):
```
Home › Parent Page › Current Page
```

#### Category/Taxonomy:
```
Home › Parent Category › Child Category
```

#### Archive:
```
Home › Author: Name
Home › 2024 › January › 15
```

#### Search:
```
Home › Kết quả tìm kiếm cho: "keyword"
```

#### 404:
```
Home › Trang không tìm thấy
```

## Usage Example

### Trong editor:
1. Thêm block "Smart Breadcrumb"
2. Chọn Style Preset
3. Cấu hình settings
4. Customize với Core Styling

### Programmatically:
```php
<!-- wp:jankx/smart-breadcrumb {"stylePreset":"modern","separator":"→"} /-->
```

## CSS Classes

### Block classes:
- `.wp-block-jankx-smart-breadcrumb` - Main block class
- `.breadcrumb-style-{preset}` - Style preset class

### Element classes:
- `.separator` - Separator element
- `.current` - Current page element

### SEO Plugin classes:
- `.rank-math-breadcrumb` - RankMath
- `.yoast-breadcrumb` - Yoast
- `.seopress-breadcrumbs` - SEOPress
- `.breadcrumb-navxt` - NavXT
- `.woocommerce-breadcrumb` - WooCommerce

## Development

### File structure:
```
smart-breadcrumb/
├── block.json              # Block metadata & supports
├── src/
│   ├── index.js           # Block registration
│   ├── edit.js            # Editor component
│   ├── save.js            # Save function (null - server-side)
│   ├── style.scss         # Frontend styles
│   ├── editor.scss        # Editor styles
│   └── style-presets.js   # Style presets config
├── build/                 # Compiled assets
└── SmartBreadcrumbBlock.php  # Server-side render logic
```

### Adding new Style Preset:

1. **Update `style-presets.js`:**
```javascript
{
    value: 'custom-style',
    label: 'Custom Style',
    description: 'Your custom style description',
    preview: {
        separator: '›',
        textColor: '#333'
    }
}
```

2. **Add CSS in `style.scss` and `editor.scss`:**
```scss
.wp-block-jankx-smart-breadcrumb.breadcrumb-style-custom-style {
    // Your styles
}
```

### Adding SEO Plugin Support:

1. **Create method in `SmartBreadcrumbBlock.php`:**
```php
private function getMyPluginBreadcrumb() {
    if (!function_exists('my_plugin_breadcrumb')) {
        return '';
    }

    ob_start();
    my_plugin_breadcrumb();
    return ob_get_clean();
}
```

2. **Add to `getSeoPluginBreadcrumb()`:**
```php
// Try My Plugin
if (function_exists('my_plugin_breadcrumb')) {
    return $this->getMyPluginBreadcrumb();
}
```

## Performance

- **No JavaScript** - Pure PHP/HTML output
- **Conditional loading** - Styles only load when block is used
- **Cached output** - SEO plugins usually cache breadcrumbs
- **Lightweight** - Minimal DOM manipulation

## Accessibility

- Semantic `<nav>` element
- `role="navigation"`
- `aria-label="Breadcrumb"`
- `aria-hidden` on separators
- Keyboard navigation support
- Focus states

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills)
- Mobile responsive

## License

GPL v2 or later

