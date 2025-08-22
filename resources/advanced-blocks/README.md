# CheepHub Advanced Blocks - Responsive Controls

Hệ thống mở rộng core blocks của Gutenberg với responsive controls, cho phép tùy chỉnh padding, margin, typography và các thuộc tính khác cho từng thiết bị (desktop, tablet, mobile).

## Tính Năng

- **Extend Core Blocks**: Mở rộng các block mặc định của WordPress mà không cần tạo block mới
- **Responsive Controls**: Điều khiển riêng biệt cho desktop, tablet và mobile
- **Dynamic CSS Generation**: Tự động tạo CSS responsive với media queries
- **Easy Integration**: Tích hợp dễ dàng vào theme hiện tại

## Blocks Được Hỗ Trợ

- `core/heading` - Tiêu đề với responsive typography
- `core/paragraph` - Đoạn văn với responsive spacing
- `core/button` - Nút với responsive sizing
- `core/image` - Hình ảnh với responsive dimensions
- `core/columns` - Cột với responsive layout
- `core/group` - Nhóm với responsive spacing
- `core/spacer` - Khoảng cách với responsive height

## Responsive Attributes

Mỗi block được mở rộng với các thuộc tính responsive:

### Typography
- `fontSize` → `fontSizeTablet`, `fontSizeMobile`
- `lineHeight` → `lineHeightTablet`, `lineHeightMobile`
- `letterSpacing` → `letterSpacingTablet`, `letterSpacingMobile`

### Spacing
- `margin` → `marginTablet`, `marginMobile`
- `padding` → `paddingTablet`, `paddingMobile`

### Dimensions
- `width` → `widthTablet`, `widthMobile`
- `height` → `heightTablet`, `heightMobile`

### Borders
- `borderRadius` → `borderRadiusTablet`, `borderRadiusMobile`
- `borderWidth` → `borderWidthTablet`, `borderWidthMobile`

## Cách Sử Dụng

### 1. Trong Gutenberg Editor

1. Chọn một core block (ví dụ: Heading)
2. Mở **Block Settings** (sidebar bên phải)
3. Tìm panel **"Responsive Settings"**
4. Chọn thiết bị muốn tùy chỉnh:
   - 🖥️ **Desktop**: Thiết lập mặc định
   - 📱 **Tablet**: Áp dụng cho màn hình ≤768px
   - 📱 **Mobile**: Áp dụng cho màn hình ≤480px

### 2. Ví Dụ Responsive Typography

**Heading Block:**
- Desktop: Font size 32px
- Tablet: Font size 28px
- Mobile: Font size 24px

**Kết quả CSS được tạo:**
```css
.wp-block-heading h2 {
    font-size: 32px; /* Desktop default */
}

@media (max-width: 768px) {
    .wp-block-heading h2 {
        font-size: 28px; /* Tablet override */
    }
}

@media (max-width: 480px) {
    .wp-block-heading h2 {
        font-size: 24px; /* Mobile override */
    }
}
```

### 3. Ví Dụ Responsive Spacing

**Paragraph Block:**
- Desktop: Margin 20px
- Tablet: Margin 15px
- Mobile: Margin 10px

**Kết quả CSS được tạo:**
```css
.wp-block-paragraph p {
    margin: 20px; /* Desktop default */
}

@media (max-width: 768px) {
    .wp-block-paragraph p {
        margin: 15px; /* Tablet override */
    }
}

@media (max-width: 480px) {
    .wp-block-paragraph p {
        margin: 10px; /* Mobile override */
    }
}
```

## Cài Đặt

### 1. Build Assets

```bash
cd resources/advanced-blocks
npm install
npm run build
```

### 2. Tích Hợp Vào Theme

**Tự động boot qua Jankx Framework:**

Service sẽ tự động được boot qua `GutenbergServiceProvider` khi theme khởi động.

**Manual integration (nếu cần):**

```php
// Load Advanced Gutenberg Service
$advancedService = new \Jankx\Framework\Services\AdvancedGutenbergService();

// Hoặc sử dụng container
$advancedService = jankx()->make('advanced.gutenberg.service');
```

### 3. Tích Hợp Vào Jankx Framework

**Tự động boot:**

Service sẽ tự động được boot qua `GutenbergServiceProvider` khi theme khởi động.

**Manual access:**

```php
// Truy cập service qua container
$advancedService = jankx()->make('advanced.gutenberg.service');

// Lấy responsive extension
$responsiveExtension = $advancedService->getResponsiveExtension();

// Lấy CSS generator
$cssGenerator = $advancedService->getCSSGenerator();

// Kiểm tra cấu hình
$config = $advancedService->getConfig();
```

## Cấu Trúc Thư Mục

```
resources/advanced-blocks/          # Frontend assets và React components
├── components/
│   └── ResponsiveControls.js      # React component cho responsive controls
├── build/                         # Generated files (sau khi build)
│   ├── editor.js                  # Editor script
│   ├── editor.css                 # Editor styles
│   └── frontend.css               # Frontend styles
├── editor.js                      # Main editor script
├── editor.css                     # Editor styles
├── frontend.css                   # Frontend base styles
├── package.json                   # NPM dependencies
└── README.md                      # This file

includes/framework/                 # PHP services và logic
├── Services/
│   └── AdvancedGutenbergService.php  # Main service để quản lý responsive blocks
└── Support/Blocks/Advanced/
    ├── ResponsiveBlockExtension.php   # PHP service để extend blocks
    └── ResponsiveCSSGenerator.php     # PHP service để generate CSS
```

## Development

### Build Commands

```bash
# Build production
npm run build

# Development mode với watch
npm run dev

# Lint code
npm run lint:js
npm run lint:css

# Format code
npm run format
```

### Adding New Block Types

1. Thêm block name vào `$extendableBlocks` trong `ResponsiveBlockExtension.php`
2. Thêm controls vào `getControls()` trong `editor.js`
3. Thêm CSS selector vào `getBlockSelector()` trong `ResponsiveCSSGenerator.php`

### Adding New Responsive Attributes

1. Thêm attribute mapping vào `$responsiveAttributes`
2. Thêm CSS property vào `getCSSProperty()`
3. Thêm value formatting vào `formatCSSValue()`

## Breakpoints

- **Desktop**: > 768px (default)
- **Tablet**: ≤ 768px
- **Mobile**: ≤ 480px

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

### Responsive Controls Không Hiển Thị

1. Kiểm tra console errors
2. Đảm bảo assets đã được build
3. Kiểm tra block có trong `$extendableBlocks` không

### CSS Không Được Áp Dụng

1. Kiểm tra `render_block` filter
2. Đảm bảo `wp_add_inline_style` được gọi
3. Kiểm tra CSS selector có đúng không

### Performance Issues

1. Sử dụng CSS minification
2. Cache generated CSS
3. Limit số lượng responsive attributes

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

GPL v2 hoặc cao hơn

## Support

- **Documentation**: Xem file này
- **Issues**: Tạo issue trên GitHub
- **Questions**: Liên hệ development team

---

**Lưu ý**: Hệ thống này extend core blocks hiện có, không tạo block mới. Điều này đảm bảo tương thích tốt với WordPress core và các plugin khác.
