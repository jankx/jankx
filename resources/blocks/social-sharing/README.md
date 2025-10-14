# Social Sharing Block

Gutenberg block cho phép chia sẻ nội dung lên các mạng xã hội sử dụng [vanilla-sharing](https://www.npmjs.com/package/vanilla-sharing) library.

## Tính năng

- ✅ Hỗ trợ 12 mạng xã hội phổ biến
- ✅ Tùy chỉnh kích thước icon (nhỏ/trung bình/lớn)
- ✅ Hiển thị/ẩn nhãn
- ✅ 4 kiểu hiển thị (mặc định/có viền/đầy màu/tròn)
- ✅ Căn chỉnh (trái/giữa/phải)
- ✅ Hỗ trợ đầy đủ color, spacing, border, typography settings như core/group
- ✅ Copy link to clipboard
- ✅ Tích hợp vanilla-sharing library

## Các mạng xã hội được hỗ trợ

1. **Facebook** - Chia sẻ lên Facebook
2. **Twitter/X** - Tweet nội dung
3. **LinkedIn** - Chia sẻ lên LinkedIn
4. **WhatsApp** - Gửi qua WhatsApp
5. **Telegram** - Gửi qua Telegram
6. **Pinterest** - Pin lên Pinterest
7. **Reddit** - Post lên Reddit
8. **Email** - Gửi qua email
9. **Copy Link** - Sao chép link vào clipboard
10. **Messenger** - Gửi qua Facebook Messenger
11. **Viber** - Gửi qua Viber
12. **Line** - Gửi qua Line

## Settings Panel

### 1. Cài đặt mạng xã hội
- Checkbox để chọn/bỏ chọn từng mạng xã hội
- Mặc định: Facebook, Twitter, LinkedIn, WhatsApp, Telegram

### 2. Hiển thị
- **Kích thước icon**: Nhỏ / Trung bình / Lớn
- **Hiển thị nhãn**: Bật/Tắt
- **Kiểu hiển thị**:
  - Mặc định (màu xám)
  - Có viền (transparent background với border)
  - Đầy màu (màu brand của từng mạng xã hội)
  - Tròn (circular buttons, ẩn nhãn)
- **Căn chỉnh**: Trái / Giữa / Phải

### 3. WordPress Core Supports
- Color settings (background, text, link, gradients)
- Background image
- Spacing (margin, padding, block gap)
- Typography (font size, line height)
- Border (color, radius, style, width)
- Alignment (wide, full)

## Cấu trúc file

```
social-sharing/
├── block.json              # Block metadata và attributes
├── index.tsx               # Editor component với settings panel
├── frontend.ts             # Frontend JavaScript với vanilla-sharing
├── style.scss              # Frontend styles
├── editor.scss             # Editor styles
├── build/                  # Build output (generated)
│   ├── index.js
│   ├── index.asset.php
│   ├── frontend.js
│   ├── frontend.asset.php
│   ├── style.css
│   └── editor.css
└── README.md               # Documentation
```

## PHP Class

**Location**: `wp-content/themes/jankx/includes/framework/Gutenberg/Blocks/SocialSharingBlock.php`

**Class**: `Jankx\Gutenberg\Blocks\SocialSharingBlock`

**Extends**: `Jankx\Gutenberg\Block`

### Filters

#### `jankx/social-sharing/network-labels`
Tùy chỉnh nhãn cho các mạng xã hội.

```php
add_filter('jankx/social-sharing/network-labels', function($labels) {
    $labels['facebook'] = 'Chia sẻ Facebook';
    $labels['twitter'] = 'Tweet';
    return $labels;
});
```

#### `jankx/social-sharing/network-icons`
Tùy chỉnh SVG icons cho các mạng xã hội.

```php
add_filter('jankx/social-sharing/network-icons', function($icons) {
    $icons['custom-network'] = '<svg>...</svg>';
    return $icons;
});
```

## Sử dụng

### 1. Trong Gutenberg Editor
- Thêm block "Social Sharing" vào trang/bài viết
- Mở panel bên phải để cấu hình
- Chọn các mạng xã hội muốn hiển thị
- Tùy chỉnh kích thước, kiểu hiển thị, căn chỉnh
- Tùy chỉnh màu sắc, spacing, border từ block settings

### 2. Trong Code (PHP)
```php
// Render block programmatically
echo do_blocks('<!-- wp:jankx/social-sharing /-->');
```

### 3. JavaScript API
```javascript
// Update configuration dynamically (nếu cần)
const sharingBlock = document.querySelector('.wp-block-jankx-social-sharing');
```

## Development

### Build
```bash
cd wp-content/themes/jankx/resources
npm run build:webpack
```

### Watch mode
```bash
npm run watch:webpack
```

## Vanilla Sharing Integration

Block này sử dụng [vanilla-sharing](https://www.npmjs.com/package/vanilla-sharing) v5.2.1 để xử lý việc chia sẻ lên các mạng xã hội.

### Cách hoạt động:
1. User click vào button chia sẻ
2. JavaScript lấy `data-network`, `data-url`, `data-title` từ button
3. Gọi function tương ứng từ vanilla-sharing
4. Mở popup/window chia sẻ

### Special cases:
- **Copy Link**: Sử dụng Clipboard API của browser
- **Pinterest**: Custom implementation vì vanilla-sharing không hỗ trợ đầy đủ

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

**Note**: Clipboard API yêu cầu HTTPS hoặc localhost.

## License

MIT

