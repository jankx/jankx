# Hướng dẫn sử dụng Core Filters

## Tổng quan

Core Filters là hệ thống mở rộng WordPress core blocks (Button và Read More) với khả năng thêm icons. Hệ thống bao gồm:

- **PHP Backend**: Filter content khi render blocks
- **JavaScript Frontend**: UI controls trong Gutenberg Editor

## Workflow

```
1. User chọn icon trong Editor
   ↓
2. Attributes được lưu vào block
   ↓
3. Frontend render với icon (PHP filter)
```

## Bước 1: Build JavaScript

```bash
cd C:/Users/puleeno/Projects/buocchandisan.vn/wp-content/themes/jankx/resources
npx webpack
```

Kiểm tra files được tạo:
```
resources/blocks/core-filters/build/
├── index.js           ← JavaScript cho editor
├── index.asset.php    ← Dependencies
└── editor.css         ← Styles cho editor
```

## Bước 2: Sử dụng trong Editor

### Button Block với Material Icon

1. Thêm Button block vào page/post
2. Mở Block Inspector (sidebar phải)
3. Tìm panel "Icon Settings"
4. Cấu hình:
   ```
   ✓ Enable Icon: ON
   ✓ Icon Type: Material Icon
   ✓ Icon Name: shopping_cart (hoặc chọn từ picker)
   ✓ Icon Style: Filled
   ✓ Icon Size: 20px
   ✓ Icon Position: Before Text
   ```

**Kết quả:**
```html
<a class="wp-block-button__link has-icon icon-position-before">
  <span class="material-icons">shopping_cart</span>
  Add to Cart
</a>
```

### Button Block với Image Icon

1. Thêm Button block
2. Icon Settings:
   ```
   ✓ Enable Icon: ON
   ✓ Icon Type: Image Icon
   ✓ Click "Select Image" → chọn từ Media Library
   ✓ Image Height: 24px
   ✓ Icon Position: Before Text
   ```

**Kết quả:**
```html
<a class="wp-block-button__link has-icon icon-position-before">
  <img src="https://example.com/icon.png" alt="Icon" style="height: 24px;" />
  Learn More
</a>
```

### Button Block với SVG Icon

1. Thêm Button block
2. Icon Settings:
   ```
   ✓ Enable Icon: ON
   ✓ Icon Type: SVG Icon
   ✓ Paste SVG code vào textarea
   ✓ Icon Width: 20px
   ✓ Icon Position: After Text
   ```

**Kết quả:**
```html
<a class="wp-block-button__link has-icon icon-position-after">
  Download
  <svg width="20px">...</svg>
</a>
```

### Read More Block với Icon

1. Thêm Read More block (trong Query Loop hoặc Posts block)
2. Icon Settings:
   ```
   ✓ Enable Icon: ON
   ✓ Icon Type: Material Icon
   ✓ Icon Name: arrow_forward
   ✓ Icon Position: After Text (default)
   ```

**Kết quả:**
```html
<a class="wp-block-read-more has-icon icon-position-after" href="...">
  Read more
  <span class="material-icons">arrow_forward</span>
</a>
```

## Bước 3: Frontend Styling

Thêm CSS vào theme của bạn:

```css
/* Button với icon */
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

/* Read more với icon */
.wp-block-read-more.has-icon {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

/* Material icons */
.material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
}

/* Icon animations */
.has-icon:hover .material-icons {
    transform: translateX(3px);
    transition: transform 0.2s ease;
}
```

## Examples

### Example 1: CTA Button với Shopping Cart Icon

```
Block Settings:
- Button Text: "Add to Cart"
- Icon Type: Material Icon
- Icon Name: shopping_cart
- Icon Position: Before
- Icon Size: 20px
- Button Style: Fill
- Button Color: #ff6b6b
```

### Example 2: Download Button với Arrow Icon

```
Block Settings:
- Button Text: "Download PDF"
- Icon Type: Material Icon
- Icon Name: download
- Icon Position: Before
- Icon Style: Outlined
- Button Style: Outline
```

### Example 3: Read More với Custom Image

```
Block Settings:
- Icon Type: Image Icon
- Image: arrow-right.svg (uploaded)
- Image Height: 16px
- Icon Position: After
```

### Example 4: Social Button với SVG

```
Block Settings:
- Button Text: "Share on Twitter"
- Icon Type: SVG Icon
- Icon: <svg>...Twitter icon...</svg>
- Icon Width: 18px
- Icon Position: Before
```

## Tips & Tricks

### 1. Material Icons

- Browse icons: https://fonts.google.com/icons
- Copy icon name exactly (e.g., `arrow_forward`, không phải `arrow-forward`)
- Thử các styles khác nhau: Filled, Outlined, Rounded, Sharp, Two Tone

### 2. Image Icons

- Sử dụng SVG images cho best quality
- Keep file size nhỏ (< 50KB)
- Use transparent background
- Optimize images trước khi upload

### 3. SVG Icons

- Minify SVG code
- Remove unnecessary attributes
- Set viewBox for responsive scaling
- Use currentColor để icon inherit text color

### 4. Performance

- Material Icons: Load từ Google Fonts (cached)
- Image Icons: Use WebP format khi có thể
- SVG Icons: Inline SVG (no HTTP request)

### 5. Accessibility

- Image Icons: Luôn set alt text
- Material Icons: Automatically accessible
- Use semantic button text, icon là decoration

## Customization

### Thêm custom icon type

Trong child theme `functions.php`:

```php
add_filter('jankx/gutenberg/core-filter/supported-blocks', function($blocks) {
    $blocks['my-theme/custom-icon'] = [
        'path' => get_stylesheet_directory() . '/blocks/custom-icon',
        'priority' => 10,
    ];
    return $blocks;
});
```

### Custom icon rendering

```php
add_filter('jankx/gutenberg/core-filter/icon-html', function($html, $type, $attrs) {
    if ($type === 'my-theme/custom-icon') {
        return '<i class="my-icon">' . esc_html($attrs['iconName']) . '</i>';
    }
    return $html;
}, 10, 3);
```

### Thêm core blocks khác

```php
add_action('init', function() {
    $gutenberg = app('gutenberg.service');
    $gutenberg->addCoreBlockToFilter('core/post-title');
    $gutenberg->addCoreBlockToFilter('core/heading');
});
```

## Troubleshooting

### Icons không hiển thị

**Checklist:**
- ✓ Đã build webpack? (`npx webpack`)
- ✓ Files trong `build/` tồn tại?
- ✓ Clear browser cache (Ctrl+Shift+R)
- ✓ Check browser console cho errors
- ✓ Verify icon name chính xác

### Material Icons không load

**Solutions:**
1. Check Google Fonts có bị block không
2. Thêm vào theme CSS:
   ```css
   @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
   ```
3. Hoặc self-host Material Icons font

### Editor không show Icon Settings panel

**Solutions:**
1. Rebuild webpack: `npx webpack`
2. Clear WordPress cache
3. Check PHP errors trong `debug.log`
4. Verify `enqueue_block_editor_assets` hook được call

### Icon hiển thị trong editor nhưng không có frontend

**Solutions:**
1. Check PHP filter đã được registered
2. Verify `render_block_*` filters
3. Check `debug.log` cho warnings
4. Test với default theme để isolate issue

## Best Practices

1. **Consistency**: Sử dụng cùng một icon style trong toàn bộ site
2. **Size**: Icon size nên tương xứng với text size
3. **Color**: Icon color match với brand colors
4. **Position**: Be consistent - trước hoặc sau, không mix
5. **Semantics**: Icon nên support meaning của text, không thay thế

## FAQ

**Q: Có thể dùng FontAwesome không?**
A: Có, thêm FontAwesome support vào `renderIcon()` method trong PHP.

**Q: Icons có responsive không?**
A: Có, sử dụng relative units (em, rem) cho size.

**Q: Performance impact?**
A: Minimal. Material Icons cached by Google, SVG inline, image icons optimized.

**Q: Có thể animate icons không?**
A: Có, thêm CSS animations/transitions.

**Q: Work với classic editor?**
A: Không, chỉ cho Gutenberg blocks.

## Resources

- [Material Icons](https://fonts.google.com/icons)
- [SVG Optimizer](https://jakearchibald.github.io/svgomg/)
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Jankx Framework Docs](../../docs/)

## Support

Nếu cần hỗ trợ:
1. Check logs: `wp-content/debug.log`
2. Browser console
3. GitHub issues
4. Email: puleeno@gmail.com

