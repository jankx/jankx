# Mega Menu Block

Một Gutenberg block mạnh mẽ để tạo mega menu với giao diện thiết kế trực quan trong editor.

## 🚀 Tính năng

### ✨ **Core Features**
- **Visual Menu Builder**: Thiết kế menu trực tiếp trong Gutenberg editor
- **Mega Menu Support**: Tạo mega menu với nhiều cột và nội dung tùy chỉnh
- **Multi-level Navigation**: Hỗ trợ menu nhiều cấp độ không giới hạn
- **Responsive Design**: Tự động thích ứng với mọi thiết bị

### 🎨 **Styling & Customization**
- **Color Controls**: Tùy chỉnh màu nền, chữ, hover, border
- **Typography**: Font family, size, weight, line-height, letter-spacing
- **Layout Options**: Width, alignment, border radius
- **CSS Variables**: Sử dụng CSS custom properties cho styling

### 📱 **Mobile Features**
- **Mobile Toggle**: Nút toggle cho mobile với text tùy chỉnh
- **Accordion Mode**: Chế độ accordion cho mobile menu
- **Breakpoint Control**: Tùy chỉnh breakpoint mobile
- **Touch Friendly**: Tối ưu cho thiết bị cảm ứng

### 🔧 **Advanced Features**
- **Flyout Menus**: Submenu hiển thị theo hướng tùy chỉnh
- **Custom Icons**: Hỗ trợ Font Awesome, Dashicons, Custom SVG
- **WordPress Integration**: Tích hợp với WordPress menus
- **Accessibility**: Hỗ trợ keyboard navigation và screen readers

## 📁 Cấu trúc file

```
mega-menu/
├── block.json              # Cấu hình block
├── index.js                # React component cho editor
├── index.css               # Styles cho editor
├── style.css               # Styles cho frontend
├── mega-menu.php           # PHP render callback
└── README.md               # Hướng dẫn sử dụng
```

## 🛠️ Cài đặt

### 1. **Tự động (Auto-discovery)**
Block sẽ được tự động phát hiện và đăng ký bởi Jankx Framework.

### 2. **Thủ công**
```php
// Trong functions.php
add_action('init', function() {
    register_block_type(__DIR__ . '/resources/blocks/mega-menu', array(
        'render_callback' => 'jankx_mega_menu_render'
    ));
});
```

## 📖 Cách sử dụng

### 1. **Thêm Block**
- Mở Gutenberg editor
- Tìm "Mega Menu" block
- Thêm vào trang/post

### 2. **Cấu hình cơ bản**
- **Menu**: Chọn menu WordPress có sẵn
- **Menu Location**: Vị trí menu (primary, secondary, footer)
- **Menu Style**: Kiểu hiển thị (horizontal, vertical, dropdown)

### 3. **Thêm Menu Items**
- Click "Add Menu Item" để thêm item mới
- Click icon edit để cấu hình chi tiết
- Sử dụng icon toggle để ẩn/hiện submenu

### 4. **Cấu hình Mega Menu**
- Bật "Enable Mega Menu" cho item chính
- Chọn số cột (1-6)
- Thêm nội dung HTML tùy chỉnh

### 5. **Tùy chỉnh Style**
- **Colors**: Background, text, hover, border
- **Typography**: Font, size, weight, spacing
- **Layout**: Width, alignment, border radius

## 🎯 Các thuộc tính

### **General Settings**
| Thuộc tính | Type | Default | Mô tả |
|------------|------|---------|-------|
| `menuId` | string | "" | ID của WordPress menu |
| `menuLocation` | string | "primary" | Vị trí menu |
| `menuStyle` | string | "horizontal" | Kiểu hiển thị menu |
| `mobileBreakpoint` | number | 768 | Breakpoint mobile (px) |

### **Mobile Settings**
| Thuộc tính | Type | Default | Mô tả |
|------------|------|---------|-------|
| `showMobileToggle` | boolean | true | Hiển thị nút mobile toggle |
| `mobileToggleText` | string | "Menu" | Text nút mobile toggle |

### **Mega Menu Settings**
| Thuộc tính | Type | Default | Mô tả |
|------------|------|---------|-------|
| `megaMenuWidth` | string | "container" | Chiều rộng mega menu |
| `megaMenuAlignment` | string | "left" | Căn chỉnh mega menu |
| `enableAccordion` | boolean | false | Bật chế độ accordion |
| `enableFlyout` | boolean | true | Bật chế độ flyout |
| `flyoutDirection` | string | "right" | Hướng flyout |

### **Icon Settings**
| Thuộc tính | Type | Default | Mô tả |
|------------|------|---------|-------|
| `customIcons` | boolean | false | Bật custom icons |
| `iconLibrary` | string | "fontawesome" | Thư viện icon |

### **Style Attributes**
| Thuộc tính | Type | Default | Mô tả |
|------------|------|---------|-------|
| `backgroundColor` | string | "" | Màu nền |
| `textColor` | string | "" | Màu chữ |
| `hoverBackgroundColor` | string | "" | Màu nền hover |
| `hoverTextColor` | string | "" | Màu chữ hover |
| `borderColor` | string | "" | Màu border |
| `borderRadius` | number | 0 | Border radius (px) |
| `fontFamily` | string | "inherit" | Font family |
| `fontSize` | number | 16 | Font size (px) |
| `fontWeight` | string | "400" | Font weight |
| `lineHeight` | number | 1.5 | Line height |
| `letterSpacing` | number | 0 | Letter spacing (px) |
| `textTransform` | string | "none" | Text transform |

## 🎨 CSS Classes

### **Block Classes**
- `.mega-menu-block` - Container chính
- `.mega-menu` - Menu container
- `.mega-menu-list` - Danh sách menu items
- `.mega-menu-item` - Menu item
- `.mega-menu-link` - Link menu
- `.mega-menu-panel` - Mega menu panel
- `.sub-menu` - Submenu
- `.sub-menu-item` - Submenu item
- `.sub-menu-link` - Submenu link

### **State Classes**
- `.has-mega-menu` - Item có mega menu
- `.has-children` - Item có submenu
- `.mobile-open` - Mobile menu đang mở
- `.active` - Item đang active (accordion)

### **Style Classes**
- `.horizontal` - Menu ngang
- `.vertical` - Menu dọc
- `.dropdown` - Menu dropdown
- `.accordion` - Chế độ accordion
- `.flyout` - Chế độ flyout
- `.container` - Width container
- `.full` - Width full
- `.align-left` - Căn trái
- `.align-center` - Căn giữa
- `.align-right` - Căn phải

## 🔧 JavaScript API

### **Events**
```javascript
// Mobile menu events
document.addEventListener('mmm:showMobileMenu', function() {
    console.log('Mobile menu opened');
});

document.addEventListener('mmm:hideMobileMenu', function() {
    console.log('Mobile menu closed');
});

// Panel events
document.addEventListener('mmm:openPanel', function() {
    console.log('Panel opened');
});

document.addEventListener('mmm:closePanel', function() {
    console.log('Panel closed');
});
```

### **Methods**
```javascript
// Get mega menu instance
const megaMenu = document.querySelector('.mega-menu-block');

// Toggle mobile menu
megaMenu.classList.toggle('mobile-open');

// Close all panels
megaMenu.querySelectorAll('.mega-menu-item').forEach(item => {
    item.classList.remove('active');
});
```

## 📱 Responsive Behavior

### **Desktop (> 768px)**
- Menu hiển thị ngang
- Mega menu panels hiển thị khi hover
- Submenu hiển thị bên phải (flyout)

### **Mobile (≤ 768px)**
- Menu chuyển thành dọc
- Mobile toggle button hiển thị
- Accordion mode cho submenu
- Touch-friendly interactions

## ♿ Accessibility

### **Keyboard Navigation**
- Tab để di chuyển giữa các menu items
- Enter/Space để mở submenu
- Escape để đóng menu
- Arrow keys để di chuyển trong submenu

### **Screen Reader Support**
- ARIA labels cho mobile toggle
- Proper heading structure
- Descriptive link text
- Focus management

### **High Contrast Mode**
- Tự động thích ứng với high contrast
- Border indicators khi cần thiết
- Color contrast compliance

## 🚀 Performance

### **Optimizations**
- CSS variables cho dynamic styling
- Minimal JavaScript footprint
- Efficient DOM queries
- Event delegation
- Lazy loading cho complex menus

### **Best Practices**
- Sử dụng CSS transforms thay vì position changes
- Debounced resize handlers
- Efficient event listeners
- Minimal DOM manipulation

## 🔒 Security

### **Data Sanitization**
- URL validation và escaping
- HTML content filtering
- XSS prevention
- CSRF protection

### **Input Validation**
- Menu ID validation
- Breakpoint range checking
- Color value validation
- Font family whitelist

## 🐛 Troubleshooting

### **Common Issues**

#### **Menu không hiển thị**
- Kiểm tra menu ID có đúng không
- Đảm bảo menu location đã được đăng ký
- Kiểm tra console errors

#### **Mega menu không hoạt động**
- Kiểm tra "Enable Mega Menu" đã bật
- Đảm bảo có nội dung trong mega menu
- Kiểm tra CSS conflicts

#### **Mobile menu không responsive**
- Kiểm tra mobile breakpoint setting
- Đảm bảo CSS media queries hoạt động
- Kiểm tra JavaScript errors

### **Debug Mode**
```php
// Bật debug mode
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);

// Kiểm tra log file
tail -f wp-content/debug.log
```

## 📚 Examples

### **Basic Mega Menu**
```json
{
    "menuStyle": "horizontal",
    "megaMenuWidth": "container",
    "enableFlyout": true,
    "menuItems": [
        {
            "title": "Products",
            "url": "/products",
            "isMegaMenu": true,
            "megaMenuColumns": 3,
            "megaMenuContent": "<h3>Our Products</h3><p>Discover our amazing products...</p>"
        }
    ]
}
```

### **Vertical Menu với Icons**
```json
{
    "menuStyle": "vertical",
    "customIcons": true,
    "iconLibrary": "fontawesome",
    "menuItems": [
        {
            "title": "Home",
            "url": "/",
            "icon": "fas fa-home"
        }
    ]
}
```

### **Mobile-First Accordion Menu**
```json
{
    "menuStyle": "dropdown",
    "enableAccordion": true,
    "mobileBreakpoint": 1024,
    "showMobileToggle": true,
    "mobileToggleText": "Navigation"
}
```

## 🤝 Contributing

### **Development Setup**
1. Clone repository
2. Install dependencies: `npm install`
3. Build assets: `npm run build`
4. Test trong WordPress

### **Code Standards**
- PSR-12 coding standards
- WordPress coding standards
- ESLint configuration
- Prettier formatting

### **Testing**
- PHPUnit tests
- JavaScript tests
- Browser testing
- Accessibility testing

## 📄 License

GPL v2 hoặc mới hơn

## 🆘 Support

- **Documentation**: Xem file này
- **Issues**: Tạo issue trên GitHub
- **Discussions**: Tham gia thảo luận
- **Email**: support@jankx.com

---

**Version**: 1.0.0
**Last Updated**: December 2024
**Compatibility**: WordPress 5.0+, Jankx Framework 2.0+
