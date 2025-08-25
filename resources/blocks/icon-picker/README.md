# 🎨 Icon Picker Block - Jankx Font Icons Integration

Gutenberg block cho phép chọn và hiển thị icon từ **Jankx Font Icons System** với khả năng thêm link và tùy chỉnh style.

## 🎯 **Tính năng chính**

- **🎨 Jankx Font Icons Integration**: Sử dụng hệ thống Font Icons của Jankx Framework
- **🔗 Link Support**: Thêm link vào icon (có thể mở trong tab mới)
- **🎭 Multiple Icon Types**: Material Icons, FontAwesome, Custom Icons
- **🎨 Icon Styles**: Filled, Outlined, Rounded, Sharp, Two-tone
- **📱 Responsive**: Tự động responsive trên mobile/tablet/desktop
- **♿ Accessibility**: Hỗ trợ screen reader và keyboard navigation

## 🚀 **Cài đặt & Build**

### 1. **Install Dependencies**
```bash
cd resources/blocks/icon-picker
npm install
```

### 2. **Build Block**
```bash
# Build production
npm run build

# Development mode với hot reload
npm run dev

# Watch mode
npm run watch
```

### 3. **Auto-registration**
Block sẽ tự động được đăng ký khi theme được kích hoạt thông qua Jankx Framework.

## 🏗️ **Kiến trúc**

### **File Structure**
```
icon-picker/
├── block.json              # Block metadata & attributes
├── index.js                # Main editor component
├── save.js                 # Frontend render component
├── index.css               # Editor styles
├── block.php               # PHP registration & render
├── webpack.mix.js          # Build configuration
├── package.json            # Dependencies
├── components/             # React components
│   ├── IconPicker.js       # Icon selection interface
│   ├── IconSettings.js     # Icon customization panel
│   └── LinkSettings.js     # Link configuration panel
└── build/                  # Built assets (generated)
```

### **Jankx Integration**
- **Font Icons System**: Sử dụng `FontIconsServiceProvider`
- **Icon Repository**: Lấy icon data từ `IconRepository`
- **REST API**: Endpoint `/jankx/v1/icons/available`
- **Auto-discovery**: Tự động được Jankx Framework phát hiện

## 📖 **Sử dụng**

### **Trong Gutenberg Editor**

1. Thêm block "Icon Picker" vào page/post
2. Chọn icon từ Jankx Font Icons System
3. Tùy chỉnh size, color, alignment, style
4. Thêm link nếu cần
5. Thêm label text (tùy chọn)

### **Trong Code**

```php
// Sử dụng block trong template
echo do_blocks('<!-- wp:jankx/icon-picker {
    "iconName": "heart",
    "iconType": "material",
    "iconStyle": "filled",
    "iconSize": "32px",
    "iconColor": "#e74c3c",
    "linkUrl": "https://example.com",
    "showLabel": true,
    "iconLabel": "Like us"
} /-->');

// Hoặc sử dụng PHP class
$iconBlock = new \Jankx\Support\Blocks\IconPickerBlock();
echo $iconBlock->render([
    'iconName' => 'star',
    'iconType' => 'material',
    'iconStyle' => 'outlined'
]);
```

## ⚙️ **Attributes**

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `iconName` | string | 'home' | Tên icon |
| `iconType` | string | 'material' | Loại icon (material/fontawesome/custom) |
| `iconCategory` | string | 'navigation' | Danh mục icon |
| `iconSize` | string | '24px' | Kích thước icon |
| `iconColor` | string | '#333333' | Màu icon |
| `iconAlignment` | string | 'left' | Căn chỉnh (left/center/right) |
| `iconStyle` | string | 'filled' | Style icon (filled/outlined/rounded/sharp/two-tone) |
| `linkUrl` | string | '' | URL link |
| `linkTarget` | string | '_self' | Target link (_self/_blank/_parent/_top) |
| `linkRel` | string | '' | Rel attributes |
| `showLabel` | boolean | false | Hiển thị label |
| `iconLabel` | string | '' | Text label |
| `labelPosition` | string | 'after' | Vị trí label (before/after/above/below) |
| `customClassName` | string | '' | CSS class tùy chỉnh |

## 🎨 **Icon Types & Styles**

### **Material Icons (Default)**
- **Styles**: filled, outlined, rounded, sharp, two-tone
- **Categories**: navigation, action, toggle, social, communication, maps
- **Examples**: home, search, favorite, settings, person

### **FontAwesome (Optional)**
- **Categories**: solid, regular, brands, light, thin
- **Prefixes**: fas, far, fab, fal, fat
- **Examples**: home, heart, star, cog, user

### **Custom Icons**
- **Categories**: general, navigation, action, status
- **Prefix**: icon
- **Examples**: logo, custom-icon, brand-icon

## 🔗 **Link Features**

- **URL**: Nhập URL bất kỳ
- **Target**: Mở trong tab mới hoặc cùng tab
- **Rel**: Thêm rel attributes (nofollow, noreferrer)
- **Preview**: Xem trước link trong editor
- **Security**: Sanitization và escaping

## 🎯 **Label Options**

- **Position**: Trước/sau/trên/dưới icon
- **Text**: Tùy chỉnh nội dung
- **Style**: Kế thừa typography từ theme
- **Responsive**: Tự động điều chỉnh trên mobile

## 🎨 **Customization**

### **CSS Classes**
```css
.jankx-icon-picker-block {
    /* Block container */
}

.jankx-icon-picker-block__icon {
    /* Icon element */
}

.jankx-icon-picker-block__label {
    /* Label text */
}

.jankx-icon-picker-block__link {
    /* Link wrapper */
}
```

### **CSS Variables**
```css
.jankx-icon-picker-block {
    --icon-size: 24px;
    --icon-color: #333333;
    --icon-alignment: left;
}
```

### **Alignment Classes**
- `.jankx-icon-picker-block--left`
- `.jankx-icon-picker-block--center`
- `.jankx-icon-picker-block--right`

## 📱 **Responsive Design**

Block tự động responsive với breakpoints:

- **Desktop**: Grid layout đầy đủ
- **Tablet**: Grid thu nhỏ
- **Mobile**: Single column layout

## ♿ **Accessibility**

- **Screen Reader**: Icon được ẩn khỏi screen reader
- **Keyboard**: Hỗ trợ tab navigation
- **Focus**: Focus indicator rõ ràng
- **High Contrast**: Hỗ trợ high contrast mode
- **Reduced Motion**: Tôn trọng user preferences

## 🌍 **Internationalization**

- **RTL Support**: Hỗ trợ right-to-left languages
- **Translation Ready**: Sử dụng WordPress i18n
- **Language Detection**: Tự động detect ngôn ngữ

## 🔧 **Development**

### **Build Commands**
```bash
# Build production
npm run build

# Development mode
npm run dev

# Watch mode
npm run watch

# Hot reload
npm run hot
```

### **Adding New Icons**

1. Cập nhật Jankx Font Icons System
2. Thêm icon vào thư viện tương ứng
3. Test trong editor

### **Extending Block**

```php
// Extend IconPickerBlock class
class CustomIconPickerBlock extends IconPickerBlock
{
    public function __construct()
    {
        parent::__construct();
        // Add custom functionality
    }
}
```

## 🐛 **Troubleshooting**

### **Icon không hiển thị**
1. Kiểm tra Jankx Font Icons System đã load
2. Verify icon name và category
3. Check console errors

### **Link không hoạt động**
1. Kiểm tra URL format
2. Verify link target
3. Test trong frontend

### **Style không apply**
1. Kiểm tra CSS đã build
2. Verify CSS classes
3. Check CSS specificity

## 📚 **Examples**

### **Basic Material Icon**
```php
<!-- wp:jankx/icon-picker {
    "iconName": "star",
    "iconType": "material",
    "iconStyle": "filled"
} /-->
```

### **Icon with Link**
```php
<!-- wp:jankx/icon-picker {
    "iconName": "heart",
    "iconType": "material",
    "iconStyle": "outlined",
    "iconSize": "32px",
    "iconColor": "#e74c3c",
    "linkUrl": "https://example.com",
    "linkTarget": "_blank"
} /-->
```

### **Icon with Label**
```php
<!-- wp:jankx/icon-picker {
    "iconName": "phone",
    "iconType": "material",
    "iconStyle": "rounded",
    "showLabel": true,
    "iconLabel": "Call us",
    "labelPosition": "after"
} /-->
```

## 🤝 **Contributing**

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 **License**

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 🆘 **Support**

- **Documentation**: Xem tài liệu Jankx Framework
- **Issues**: Tạo issue trên GitHub
- **Community**: Tham gia Jankx community

---

**Icon Picker Block** - Modern Gutenberg block with Jankx Font Icons System integration.
