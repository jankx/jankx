# Advanced Tabs Block

## Mô tả

Advanced Tabs Block là một Gutenberg block cho phép hiển thị nội dung trong các tab tương tác với khả năng tùy chỉnh styling cao. Block này cung cấp giao diện tab hiện đại với hỗ trợ icon, separator và các tùy chọn layout khác nhau.

## Tính năng

- **Interactive Tabs**: Tab có thể click để chuyển đổi nội dung
- **Icon Support**: Hỗ trợ icon từ Bootstrap Icons và custom SVG
- **Responsive Design**: Thiết kế responsive cho mobile và desktop
- **Accessibility**: Hỗ trợ đầy đủ keyboard navigation và ARIA attributes
- **Customizable Styling**: Có thể tùy chỉnh màu sắc, padding, border radius
- **Separator Support**: Hiển thị separator giữa các tab
- **Icon Position**: Icon có thể đặt bên trái hoặc bên phải text
- **Editor Preview**: UI trong Gutenberg editor giống hệt frontend

## Yêu cầu

- WordPress 5.0+
- Theme Jankx
- Bootstrap Icons (cho icon library)

## Cài đặt

1. Block sẽ tự động được đăng ký khi theme được load
2. Tìm block "Advanced Tabs" trong Gutenberg editor
3. Kéo thả block vào vị trí mong muốn

## Cấu hình

### Attributes

- `uniqueId` (string): ID duy nhất của block
- `tabTitles` (array): Mảng các tab với cấu hình:
  - `id` (string): ID của tab
  - `title` (string): Tiêu đề tab
  - `hasMedia` (boolean): Hiển thị icon
  - `mediaType` (string): Loại media - 'iconLibrary' hoặc 'uploadSVG'
  - `icon` (string): Tên icon (cho iconLibrary)
  - `customSVG` (string): Code SVG tùy chỉnh
- `tabChildCount` (number): Số lượng tab con
- `activeTab` (string): ID tab đang active
- `iconPosition` (string): Vị trí icon - 'left' hoặc 'right'
- `showSeparator` (boolean): Hiển thị separator giữa các tab
- `className` (string): CSS class tùy chỉnh

### Inspector Controls

#### Tab Settings
- **Icon Position**: Chọn vị trí icon (trái/phải)
- **Show Separator**: Bật/tắt separator giữa các tab

#### Manage Tabs
- **Tab Title**: Chỉnh sửa tiêu đề tab
- **Show Icon**: Bật/tắt hiển thị icon
- **Icon Type**: Chọn loại icon (Icon Library/Custom SVG)
- **Icon Name**: Nhập tên icon Bootstrap
- **Custom SVG Code**: Dán code SVG tùy chỉnh
- **Add New Tab**: Thêm tab mới
- **Remove**: Xóa tab

## Sử dụng

### Trong Gutenberg Editor

1. Thêm block "Advanced Tabs"
2. Cấu hình các tùy chọn trong sidebar
3. Thêm nội dung cho từng tab
4. Lưu trang/post

### Trong Code

```php
// Sử dụng shortcode
echo do_shortcode('[advanced_tabs]');

// Sử dụng block render
echo do_blocks('<!-- wp:jankx/advanced-tabs {"activeTab":"1","iconPosition":"left"} /-->');
```

## Styling

### CSS Classes

Block sử dụng các CSS classes sau:

- `.advanced-tabs-block`: Container chính
- `.tabs-container`: Container tabs
- `.tabs-nav`: Navigation tabs
- `.tabs-titles`: Danh sách tab titles
- `.tab-title`: Mỗi tab title
- `.tab-title-media`: Container icon
- `.tab-title-text`: Text của tab
- `.tabs-content`: Container nội dung
- `.single-tab`: Mỗi tab content
- `.tab-content-inner`: Nội dung bên trong tab

### Responsive Design

- **Desktop**: Hiển thị tabs theo chiều ngang
- **Mobile**: Tabs chuyển thành dọc
- **Tablet**: Tự động điều chỉnh theo kích thước màn hình

## JavaScript API

### Events

Block dispatch các custom events:

```javascript
// Lắng nghe sự kiện chuyển tab
document.addEventListener('jankx-tab-switched', function(event) {
    console.log('Tab switched:', event.detail);
    // event.detail.tabId - ID của tab được chọn
    // event.detail.index - Index của tab
    // event.detail.tabBlock - Element của block
});
```

### Keyboard Navigation

- **Arrow Keys**: Di chuyển giữa các tab
- **Home/End**: Đi đến tab đầu/cuối
- **Enter/Space**: Kích hoạt tab
- **Tab**: Di chuyển focus

## Accessibility

Block được thiết kế với accessibility tốt:

- **ARIA Attributes**: Đầy đủ role, aria-selected, aria-hidden
- **Keyboard Navigation**: Hỗ trợ đầy đủ keyboard
- **Screen Reader**: Tương thích với screen reader
- **Focus Management**: Quản lý focus hợp lý
- **High Contrast**: Hỗ trợ high contrast mode
- **Reduced Motion**: Tôn trọng prefers-reduced-motion

## Troubleshooting

### Block không hiển thị
- Kiểm tra console browser có lỗi JavaScript không
- Kiểm tra CSS có được load không
- Kiểm tra block có được đăng ký đúng không

### Icon không hiển thị
- Kiểm tra Bootstrap Icons có được load không
- Kiểm tra tên icon có đúng không
- Kiểm tra custom SVG có hợp lệ không

### Tab không chuyển được
- Kiểm tra JavaScript có được load không
- Kiểm tra console có lỗi không
- Kiểm tra event listeners có được attach không

## Development

### Build Process

```bash
# Development mode
npm run dev

# Build production
npm run build
```

### File Structure

```
advanced-tabs/
├── block.json                    # Block configuration
├── index.tsx                     # Main React component
├── tab.tsx                       # Tab child component
├── style.scss                    # Frontend styles
├── editor.scss                   # Editor styles
├── view.js                       # Frontend JavaScript
├── build/                        # Built files
│   ├── index.js                  # Compiled JavaScript
│   ├── tab.js                    # Compiled tab JavaScript
│   ├── style.css                 # Compiled CSS
│   ├── editor.css                # Editor CSS
│   └── view.js                   # Frontend JavaScript
└── README.md                     # This file
```

## Changelog

### Version 1.0.0
- Initial release
- Support for interactive tabs
- Icon support (Bootstrap Icons + Custom SVG)
- Responsive design
- Accessibility features
- Editor preview functionality

## Support

Nếu gặp vấn đề hoặc có câu hỏi, vui lòng:

1. Kiểm tra documentation này
2. Kiểm tra console browser
3. Kiểm tra WordPress debug log
4. Liên hệ developer team

## License

Block này là một phần của theme Jankx và tuân theo license của theme.
