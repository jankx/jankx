# Offcanvas Sidebar Block

## Mô tả

Offcanvas Sidebar Block là một Gutenberg block mạnh mẽ cho phép tạo sidebar với 14 animation effects khác nhau, được lấy cảm hứng từ SidebarTransitions. Block này cung cấp giao diện offcanvas hoàn chỉnh với khả năng tùy chỉnh cao.

## Tính năng

### 🎨 Animation Effects (14 effects)
- **Slide In**: Hiệu ứng trượt vào từ bên trái/phải
- **Reveal**: Hiệu ứng lộ ra
- **Push**: Hiệu ứng đẩy
- **Slide Along**: Hiệu ứng trượt dọc theo
- **Reverse Slide Out**: Hiệu ứng trượt ra ngược
- **Rotate Pusher**: Hiệu ứng xoay pusher
- **3D Rotate In**: Hiệu ứng xoay 3D vào
- **3D Rotate Out**: Hiệu ứng xoay 3D ra
- **Scale Down Pusher**: Hiệu ứng thu nhỏ pusher
- **Scale Up**: Hiệu ứng phóng to
- **Scale and Rotate Pusher**: Hiệu ứng thu nhỏ và xoay pusher
- **Open Door**: Hiệu ứng mở cửa
- **Fall Down**: Hiệu ứng rơi xuống
- **Delayed 3D Rotate**: Hiệu ứng xoay 3D có độ trễ

### ⚙️ Tùy chỉnh
- **Position**: Left/Right sidebar
- **Width**: Tùy chỉnh chiều rộng sidebar
- **Colors**: Background, text, overlay colors
- **Trigger Button**: Text và icon tùy chỉnh
- **Menu Items**: Thêm/sửa/xóa menu items
- **Behavior**: Overlay, auto close, escape key

### 📱 Responsive
- Mobile-friendly design
- Adaptive sidebar width
- Touch-friendly interactions

## Yêu cầu

- WordPress 5.0+
- Theme Jankx
- Modern browser với CSS3 support

## Cài đặt

1. Block sẽ tự động được đăng ký khi theme được load
2. Tìm block "Offcanvas Sidebar" trong Gutenberg editor
3. Kéo thả block vào vị trí mong muốn

## Cấu hình

### Attributes

#### Sidebar Settings
- `sidebarPosition` (string): Vị trí sidebar - 'left' hoặc 'right' (mặc định: 'left')
- `animationEffect` (string): Hiệu ứng animation (mặc định: 'slide-in')
- `sidebarWidth` (string): Chiều rộng sidebar (mặc định: '300px')
- `overlayColor` (string): Màu overlay (mặc định: 'rgba(0,0,0,0.2)')
- `sidebarBackground` (string): Màu nền sidebar (mặc định: '#48a770')
- `textColor` (string): Màu chữ (mặc định: '#f3efe0')

#### Trigger Button
- `triggerText` (string): Text của button trigger (mặc định: 'Menu')
- `triggerIcon` (string): Icon của button trigger (mặc định: 'menu')

#### Behavior
- `showOverlay` (boolean): Hiển thị overlay (mặc định: true)
- `closeOnOverlayClick` (boolean): Đóng khi click overlay (mặc định: true)
- `closeOnEscape` (boolean): Đóng khi nhấn Escape (mặc định: true)
- `autoClose` (boolean): Tự động đóng (mặc định: false)
- `autoCloseDelay` (number): Thời gian tự động đóng (mặc định: 5000ms)

#### Menu Items
- `menuItems` (array): Danh sách menu items với cấu trúc:
  ```json
  {
    "id": "unique-id",
    "text": "Menu Text",
    "url": "https://example.com",
    "icon": "home"
  }
  ```

## Sử dụng

### Trong Gutenberg Editor

1. **Thêm Block**: Tìm và thêm "Offcanvas Sidebar" block
2. **Cấu hình Sidebar**:
   - Chọn position (Left/Right)
   - Chọn animation effect từ 14 options
   - Điều chỉnh width và colors
3. **Cấu hình Trigger Button**:
   - Thay đổi text và icon
4. **Quản lý Menu Items**:
   - Thêm/sửa/xóa menu items
   - Chọn icon cho từng item
5. **Cấu hình Behavior**:
   - Bật/tắt overlay
   - Cài đặt auto close
6. **Thêm Content**: Sử dụng InnerBlocks để thêm nội dung vào sidebar

### Trong Code

```php
// Sử dụng shortcode
echo do_shortcode('[offcanvas_sidebar]');

// Sử dụng block render
echo do_blocks('<!-- wp:jankx/offcanvas-sidebar {"sidebarPosition":"left","animationEffect":"slide-in","sidebarWidth":"300px"} /-->');
```

## Animation Effects Chi tiết

### 1. Slide In
- **Mô tả**: Sidebar trượt vào từ bên trái/phải
- **Sử dụng**: Phù hợp cho navigation menu cơ bản
- **Performance**: Tốt nhất

### 2. Reveal
- **Mô tả**: Sidebar lộ ra từ bên dưới
- **Sử dụng**: Phù hợp cho content panels
- **Performance**: Tốt

### 3. Push
- **Mô tả**: Sidebar đẩy content ra
- **Sử dụng**: Phù hợp cho mobile navigation
- **Performance**: Tốt

### 4. Slide Along
- **Mô tả**: Sidebar trượt dọc theo content
- **Sử dụng**: Phù hợp cho sidebar tools
- **Performance**: Tốt

### 5. Reverse Slide Out
- **Mô tả**: Sidebar trượt ra theo hướng ngược
- **Sử dụng**: Phù hợp cho notifications
- **Performance**: Tốt

### 6. Rotate Pusher
- **Mô tả**: Content xoay khi sidebar mở
- **Sử dụng**: Phù hợp cho immersive experiences
- **Performance**: Trung bình

### 7. 3D Rotate In
- **Mô tả**: Sidebar xoay 3D vào
- **Sử dụng**: Phù hợp cho modern UI
- **Performance**: Trung bình

### 8. 3D Rotate Out
- **Mô tả**: Sidebar xoay 3D ra
- **Sử dụng**: Phù hợp cho modern UI
- **Performance**: Trung bình

### 9. Scale Down Pusher
- **Mô tả**: Content thu nhỏ khi sidebar mở
- **Sử dụng**: Phù hợp cho focus mode
- **Performance**: Trung bình

### 10. Scale Up
- **Mô tả**: Sidebar phóng to từ nhỏ
- **Sử dụng**: Phù hợp cho modal-like sidebar
- **Performance**: Trung bình

### 11. Scale and Rotate Pusher
- **Mô tả**: Content thu nhỏ và xoay
- **Sử dụng**: Phù hợp cho immersive experiences
- **Performance**: Thấp

### 12. Open Door
- **Mô tả**: Sidebar mở như cánh cửa
- **Sử dụng**: Phù hợp cho creative designs
- **Performance**: Trung bình

### 13. Fall Down
- **Mô tả**: Sidebar rơi xuống từ trên
- **Sử dụng**: Phù hợp cho notifications
- **Performance**: Tốt

### 14. Delayed 3D Rotate
- **Mô tả**: Sidebar xoay 3D với độ trễ
- **Sử dụng**: Phù hợp cho modern UI
- **Performance**: Trung bình

## Styling

### CSS Classes

```scss
.offcanvas-sidebar-block {
    // Main container
}

.offcanvas-sidebar-preview {
    // Preview container

    &.effect-{effect-name} {
        // Animation effect styles
    }

    &.position-{left|right} {
        // Position styles
    }

    &.sidebar-open {
        // Open state styles
    }
}

.offcanvas-trigger {
    // Trigger button
}

.offcanvas-overlay {
    // Overlay
}

.offcanvas-sidebar {
    // Sidebar container

    .sidebar-header {
        // Header section
    }

    .sidebar-menu {
        // Menu section
    }

    .sidebar-content {
        // Content section
    }
}
```

### Customization

```scss
// Override default styles
.offcanvas-sidebar-block {
    .offcanvas-trigger {
        background: #your-color;
        border-radius: 8px;
    }

    .offcanvas-sidebar {
        background: linear-gradient(45deg, #color1, #color2);
    }
}
```

## JavaScript API

### Events

```javascript
// Sidebar opened
document.addEventListener('offcanvasSidebarOpened', function(e) {
    console.log('Sidebar opened:', e.detail);
});

// Sidebar closed
document.addEventListener('offcanvasSidebarClosed', function(e) {
    console.log('Sidebar closed:', e.detail);
});
```

### Methods

```javascript
// Open sidebar
window.openOffcanvasSidebar(blockId);

// Close sidebar
window.closeOffcanvasSidebar(blockId);

// Toggle sidebar
window.toggleOffcanvasSidebar(blockId);
```

## Performance

### Recommendations

1. **Animation Effects**: Sử dụng "Slide In" hoặc "Reveal" cho performance tốt nhất
2. **3D Effects**: Tránh sử dụng trên mobile devices
3. **Content**: Giới hạn nội dung trong sidebar để tránh lag
4. **Images**: Tối ưu hóa images trong sidebar content

### Browser Support

- **Modern Browsers**: Tất cả effects
- **Older Browsers**: Fallback to "Slide In" effect
- **Mobile**: Limited 3D effects

## Troubleshooting

### Sidebar không mở
- Kiểm tra JavaScript console
- Đảm bảo không có CSS conflicts
- Kiểm tra z-index values

### Animation không hoạt động
- Kiểm tra browser support
- Đảm bảo CSS3 transforms được enable
- Kiểm tra performance issues

### Mobile issues
- Sử dụng simpler effects trên mobile
- Kiểm tra touch events
- Test trên real devices

## Development

### Build Process

```bash
# Development mode
npm run dev:offcanvas-sidebar

# Build production
npm run build:offcanvas-sidebar
```

### File Structure

```
offcanvas-sidebar/
├── block.json                    # Block configuration
├── index.tsx                     # React component
├── style.scss                    # Main styles
├── editor.scss                   # Editor styles
├── README.md                     # Documentation
└── build/                        # Built files
    ├── index.js
    ├── style.css
    └── editor.css
```

## Changelog

### Version 1.0.0
- Initial release
- 14 animation effects
- Full customization options
- Responsive design
- TypeScript support
- SCSS styling

## Support

Nếu gặp vấn đề hoặc có câu hỏi:

1. Kiểm tra documentation này
2. Kiểm tra browser console
3. Test trên different devices
4. Liên hệ developer team

## License

Block này là một phần của theme Jankx và tuân theo license của theme.
