# Language Switcher Block

## Mô tả

Language Switcher Block là một Gutenberg block cho phép hiển thị language switcher cho plugin Polylang. Block này cung cấp giao diện để người dùng chuyển đổi giữa các ngôn ngữ khác nhau trên website.

## Tính năng

- **Dropdown Style**: Hiển thị dưới dạng dropdown với tùy chọn ngôn ngữ
- **List Style**: Hiển thị dưới dạng danh sách các ngôn ngữ
- **Flag Support**: Hỗ trợ hiển thị cờ quốc gia cho mỗi ngôn ngữ
- **Responsive**: Thiết kế responsive cho mobile và desktop
- **Customizable**: Có thể tùy chỉnh hiển thị flags, tên ngôn ngữ, và ngôn ngữ hiện tại
- **Editor Preview**: UI trong Gutenberg editor giống hệt frontend với dropdown menu hoàn chỉnh

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
- Hiển thị dưới dạng dropdown button với menu popup
- Phù hợp cho header hoặc sidebar
- Tiết kiệm không gian hiển thị
- Hỗ trợ hover effects và click để mở/đóng

#### List
- Hiển thị dưới dạng danh sách các liên kết
- Phù hợp cho footer hoặc menu
- Dễ dàng tùy chỉnh style

## Sử dụng

### Trong Gutenberg Editor

1. Thêm block "Language Switcher"
2. Cấu hình các tùy chọn trong sidebar
3. **Editor Preview**: Block hiển thị giống hệt frontend với:
   - Dropdown button có thể click để mở/đóng menu
   - Menu dropdown hiển thị tất cả ngôn ngữ
   - Hover effects và styling giống frontend
   - Responsive design trong editor
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

### Editor vs Frontend Consistency

**UI trong Gutenberg editor giờ đây giống hệt frontend:**

- **Dropdown**: Button với menu popup có thể click
- **Hover Effects**: Arrow rotation và menu visibility
- **Styling**: Font size, spacing, colors giống hệt
- **Responsive**: Mobile và desktop behavior giống nhau
- **Interactive**: Click để mở/đóng dropdown menu

### CSS Classes

Block có 2 implementation khác nhau với CSS classes riêng biệt:

#### Gutenberg Block (React)
- `.language-switcher-block`: Container chính
- `.language-switcher-dropdown-wrapper`: Dropdown container
- `.language-switcher-dropdown`: Dropdown button
- `.language-switcher-dropdown-menu`: Dropdown menu
- `.language-dropdown-item`: Mỗi item trong dropdown
- `.language-dropdown-link`: Liên kết trong dropdown
- `.language-switcher-list`: Danh sách ngôn ngữ
- `.language-item`: Mỗi item ngôn ngữ
- `.language-link`: Liên kết ngôn ngữ
- `.language-flag`: Cờ quốc gia
- `.language-name`: Tên ngôn ngữ
- `.language-arrow`: Mũi tên dropdown
- `.current-language`: Ngôn ngữ hiện tại

#### Jankx Framework Block (PHP)
- `.jankx-language-switcher`: Container chính
- `.jankx-language-switcher__dropdown`: Dropdown container
- `.jankx-language-switcher__current`: Dropdown button
- `.jankx-language-switcher__menu`: Dropdown menu
- `.jankx-language-switcher__item`: Mỗi item ngôn ngữ
- `.jankx-language-switcher__link`: Liên kết ngôn ngữ
- `.jankx-language-switcher__flag`: Cờ quốc gia
- `.jankx-language-switcher__name`: Tên ngôn ngữ
- `.jankx-language-switcher__arrow`: Mũi tên dropdown

**Lưu ý**: Jankx framework block sử dụng BEM methodology cho CSS classes.

## Responsive Design

- **Desktop**: Hiển thị theo chiều ngang với dropdown/list
- **Mobile**: Dropdown full-width, list chuyển thành dọc
- **Tablet**: Tự động điều chỉnh theo kích thước màn hình
- **Editor**: Responsive behavior giống hệt frontend

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

### Block đã được đăng ký (Duplicate Registration)
- **Lỗi**: "Block type 'jankx/language-switcher' is already registered"
- **Nguyên nhân**: Block được đăng ký từ nhiều nơi
- **Giải pháp**: Block chỉ được đăng ký từ `LanguageSwitcherBlock` class, không còn từ `LanguageSwitcherServiceProvider`
- **Kiểm tra**: Đảm bảo chỉ có một nơi đăng ký block trong `GutenbergService`

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
├── block.json                    # Block configuration
├── index.js                      # React component source (Gutenberg block)
├── index.css                     # Main CSS (Gutenberg block)
├── style.css                     # Block styles (Gutenberg block)
├── jankx-language-switcher.css   # CSS for Jankx framework block
├── editor.css                    # Editor-specific styles (giống frontend)
├── demo.html                     # Demo page for testing CSS
├── build/                        # Built files
│   ├── index.js                  # Compiled JavaScript
│   ├── editor.css                # Editor CSS (copied)
│   └── style.css                 # Compiled CSS
└── README.md                     # This file
```

## Changelog

### Version 1.1.0
- **Editor UI Enhancement**: UI trong Gutenberg editor giờ giống hệt frontend
- **Interactive Dropdown**: Dropdown menu có thể click để mở/đóng
- **Consistent Styling**: Font size, spacing, colors giống hệt frontend
- **Hover Effects**: Arrow rotation và menu visibility trong editor
- **Responsive Editor**: Mobile và desktop behavior giống frontend

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
