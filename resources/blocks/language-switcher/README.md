# Language Switcher Block

## Mô tả

Language Switcher Block là một Gutenberg block cho phép hiển thị language switcher cho plugin Polylang. Block này cung cấp giao diện để người dùng chuyển đổi giữa các ngôn ngữ khác nhau trên website.

## Tính năng

- **Dropdown Style**: Hiển thị dưới dạng dropdown với tùy chọn ngôn ngữ
- **List Style**: Hiển thị dưới dạng danh sách các ngôn ngữ
- **Flag Support**: Hỗ trợ hiển thị cờ quốc gia cho mỗi ngôn ngữ
- **Responsive**: Thiết kế responsive cho mobile và desktop
- **Customizable**: Có thể tùy chỉnh hiển thị flags, tên ngôn ngữ, và ngôn ngữ hiện tại

## Yêu cầu

- WordPress 5.0+
- Plugin Polylang được kích hoạt
- Theme Jankx

## Cài đặt

1. Block sẽ tự động được đăng ký khi theme được load
2. Tìm block "Language Switcher" trong Gutenberg editor
3. Kéo thả block vào vị trí mong muốn

## Cấu hình

### Attributes

- `showFlags` (boolean): Hiển thị cờ quốc gia (mặc định: true)
- `showNames` (boolean): Hiển thị tên ngôn ngữ (mặc định: true)
- `showCurrent` (boolean): Hiển thị ngôn ngữ hiện tại (mặc định: true)
- `displayType` (string): Kiểu hiển thị - 'dropdown' hoặc 'list' (mặc định: 'dropdown')
- `className` (string): CSS class tùy chỉnh

### Display Types

#### Dropdown
- Hiển thị dưới dạng dropdown select
- Phù hợp cho header hoặc sidebar
- Tiết kiệm không gian hiển thị

#### List
- Hiển thị dưới dạng danh sách các liên kết
- Phù hợp cho footer hoặc menu
- Dễ dàng tùy chỉnh style

## Sử dụng

### Trong Gutenberg Editor

1. Thêm block "Language Switcher"
2. Cấu hình các tùy chọn trong sidebar
3. Preview block trong editor
4. Lưu trang/post

### Trong Code

```php
// Sử dụng shortcode
echo do_shortcode('[language_switcher]');

// Sử dụng block render
echo do_blocks('<!-- wp:jankx/language-switcher {"showFlags":true,"showNames":true,"displayType":"dropdown"} /-->');
```

## API Endpoints

### GET /wp-json/jankx/v1/languages

Trả về danh sách các ngôn ngữ có sẵn:

```json
[
    {
        "code": "vi",
        "name": "Tiếng Việt",
        "url": "https://example.com/vi/",
        "flag": "https://example.com/flags/vi.png",
        "current": true
    },
    {
        "code": "en",
        "name": "English",
        "url": "https://example.com/en/",
        "flag": "https://example.com/flags/en.png",
        "current": false
    }
]
```

## Styling

Block sử dụng CSS classes để styling:

- `.language-switcher-block`: Container chính
- `.language-switcher-dropdown`: Dropdown select
- `.language-switcher-list`: Danh sách ngôn ngữ
- `.language-item`: Mỗi item ngôn ngữ
- `.language-link`: Liên kết ngôn ngữ
- `.language-flag`: Cờ quốc gia
- `.language-name`: Tên ngôn ngữ
- `.current-language`: Ngôn ngữ hiện tại

## Responsive Design

- **Desktop**: Hiển thị theo chiều ngang với dropdown/list
- **Mobile**: Dropdown full-width, list chuyển thành dọc
- **Tablet**: Tự động điều chỉnh theo kích thước màn hình

## Troubleshooting

### Block không hiển thị
- Kiểm tra plugin Polylang có được kích hoạt không
- Kiểm tra có ngôn ngữ nào được cấu hình không
- Kiểm tra console browser có lỗi JavaScript không

### Không có flags
- Kiểm tra Polylang có cấu hình flags không
- Kiểm tra đường dẫn flags có đúng không

### REST API lỗi
- Kiểm tra WordPress REST API có được enable không
- Kiểm tra permalink settings
- Kiểm tra user có quyền truy cập không

## Development

### Build Process

```bash
# Development mode
npm run dev:language-switcher

# Build production
npm run build:language-switcher
```

### File Structure

```
language-switcher/
├── block.json          # Block configuration
├── index.js            # React component source
├── index.css           # Main CSS
├── style.css           # Block styles
├── build/              # Built files
│   ├── index.js        # Compiled JavaScript
│   └── index.css       # Compiled CSS
└── README.md           # This file
```

## Changelog

### Version 1.0.0
- Initial release
- Support for dropdown and list display types
- Flag and name display options
- Responsive design
- REST API integration

## Support

Nếu gặp vấn đề hoặc có câu hỏi, vui lòng:

1. Kiểm tra documentation này
2. Kiểm tra console browser
3. Kiểm tra WordPress debug log
4. Liên hệ developer team

## License

Block này là một phần của theme Jankx và tuân theo license của theme.
