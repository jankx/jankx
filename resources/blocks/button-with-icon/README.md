# 🎯 Button with Icon Block - Jankx Framework

Gutenberg block tạo button với khả năng thêm icon từ **Jankx Font Icons System**, tương tự core/button của WordPress nhưng có thêm tính năng icon.

## 🚀 **Tính năng chính**

- **🎨 Multiple Button Types**: Primary, Secondary, Success, Warning, Danger, Info, Light, Dark
- **📏 Button Sizes**: Small, Medium, Large, Extra Large
- **🎭 Button Styles**: Filled, Outlined, Text, Rounded
- **🔗 Link Support**: URL, target, rel attributes
- **🎯 Icon Integration**: Icon từ Jankx Font Icons System
- **📱 Responsive**: Tự động responsive trên mobile/tablet/desktop
- **♿ Accessibility**: Hỗ trợ screen reader và keyboard navigation

## 🏗️ **Cấu trúc file**

```
button-with-icon/
├── block.json              # Block metadata & attributes
├── index.js                # Main editor component
├── save.js                 # Frontend render component
├── index.css               # Editor styles
├── style-index.css         # Frontend styles
├── README.md               # Documentation
└── build/                  # Built assets (generated)
```

## ⚙️ **Attributes**

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `text` | string | 'Click me' | Button text |
| `url` | string | '' | URL link |
| `linkTarget` | string | '_self' | Target link (_self/_blank/_parent/_top) |
| `rel` | string | '' | Rel attributes |
| `buttonType` | string | 'primary' | Button type (primary/secondary/success/warning/danger/info/light/dark) |
| `buttonSize` | string | 'medium' | Button size (small/medium/large/xlarge) |
| `buttonStyle` | string | 'filled' | Button style (filled/outlined/text/rounded) |
| `buttonWidth` | string | 'auto' | Button width (auto/full/custom) |
| `iconPosition` | string | 'left' | Icon position (left/right/top/bottom) |
| `iconSpacing` | string | '8px' | Icon spacing |
| `showIcon` | boolean | false | Show icon |
| `customClassName` | string | '' | CSS class tùy chỉnh |
| `anchor` | string | '' | HTML anchor |

## 🎨 **Button Types & Styles**

### **Button Types**
- **Primary**: Blue button (default)
- **Secondary**: Gray button
- **Success**: Green button
- **Warning**: Yellow button
- **Danger**: Red button
- **Info**: Cyan button
- **Light**: Light gray button
- **Dark**: Dark button

### **Button Styles**
- **Filled**: Solid background (default)
- **Outlined**: Transparent background với border
- **Text**: Text-only button
- **Rounded**: Rounded corners

### **Button Sizes**
- **Small**: 36px height
- **Medium**: 44px height (default)
- **Large**: 52px height
- **Extra Large**: 60px height

## 🔗 **Link Features**

- **URL**: Nhập URL bất kỳ
- **Target**: Mở trong tab mới hoặc cùng tab
- **Rel**: Thêm rel attributes (nofollow, noreferrer)
- **Auto-convert**: Tự động chuyển button thành link khi có URL

## 🎯 **Icon Integration**

### **Icon Picker Nested Block**
- Sử dụng IconPicker component từ icon-picker block
- Chọn icon từ Jankx Font Icons System
- 4 vị trí: left, right, top, bottom
- Tùy chỉnh khoảng cách icon-text

### **Icon Position Options**
- **Left**: Icon bên trái text
- **Right**: Icon bên phải text
- **Top**: Icon trên text
- **Bottom**: Icon dưới text

## 🎨 **Customization**

### **CSS Classes**
```css
.jankx-button-with-icon {
    /* Block container */
}

.jankx-button-with-icon__button {
    /* Button element */
}

.jankx-button-with-icon__icon {
    /* Icon element */
}

.jankx-button-with-icon__text {
    /* Text element */
}
```

### **CSS Variables**
```css
.jankx-button-with-icon {
    --button-padding: 12px 24px;
    --button-border-radius: 6px;
    --button-transition: all 0.2s ease;
}
```

### **Button Type Classes**
- `.jankx-button-with-icon__button--primary`
- `.jankx-button-with-icon__button--secondary`
- `.jankx-button-with-icon__button--success`
- `.jankx-button-with-icon__button--warning`
- `.jankx-button-with-icon__button--danger`
- `.jankx-button-with-icon__button--info`
- `.jankx-button-with-icon__button--light`
- `.jankx-button-with-icon__button--dark`

## 📱 **Responsive Design**

Block tự động responsive với breakpoints:

- **Desktop**: Full button styles
- **Tablet**: Medium button styles
- **Mobile**: Small button styles, full-width option

## ♿ **Accessibility**

- **Screen Reader**: Button được mô tả đầy đủ
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
```

### **Adding New Button Types**

1. Thêm button type vào `buttonTypeOptions`
2. Thêm CSS styles cho button type mới
3. Test trong editor và frontend

### **Extending Block**

```php
// Extend ButtonWithIconBlock class
class CustomButtonBlock extends ButtonWithIconBlock
{
    public function __construct()
    {
        parent::__construct();
        // Add custom functionality
    }
}
```

## 📚 **Examples**

### **Basic Button**
```php
<!-- wp:jankx/button-with-icon {
    "text": "Click me",
    "buttonType": "primary",
    "buttonSize": "medium"
} /-->
```

### **Button with Link**
```php
<!-- wp:jankx/button-with-icon {
    "text": "Learn More",
    "url": "https://example.com",
    "linkTarget": "_blank",
    "buttonType": "success",
    "buttonSize": "large"
} /-->
```

### **Button with Icon**
```php
<!-- wp:jankx/button-with-icon {
    "text": "Download",
    "buttonType": "info",
    "buttonStyle": "outlined",
    "showIcon": true,
    "iconPosition": "left"
} /-->
```

### **Full Width Button**
```php
<!-- wp:jankx/button-with-icon {
    "text": "Submit Form",
    "buttonType": "primary",
    "buttonWidth": "full",
    "buttonSize": "large"
} /-->
```

## 🐛 **Troubleshooting**

### **Button không hiển thị**
1. Kiểm tra block đã được đăng ký
2. Verify CSS đã load
3. Check console errors

### **Icon không hiển thị**
1. Kiểm tra showIcon = true
2. Verify icon position
3. Check icon spacing

### **Link không hoạt động**
1. Kiểm tra URL format
2. Verify link target
3. Test trong frontend

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

**Button with Icon Block** - Modern Gutenberg button block với Jankx Font Icons System integration.
