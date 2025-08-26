# Icon Button Block

Block Gutenberg button với icon, hỗ trợ tất cả tính năng của core button plus icon selection.

## 🚀 Tính năng

### ✅ Core Button Features (100% tương thích)
- **Rich Text Editing**: Chỉnh sửa text trực tiếp trong editor
- **Link Management**: URL, target, rel attributes
- **Color Support**: Background, text, gradient colors
- **Typography**: Font size, weight, transform, letter spacing, line height
- **Layout**: Border radius, width, alignment
- **Spacing**: Margin, padding controls
- **Responsive**: Mobile-friendly design

### ✅ Icon Integration
- **Multiple Icon Sets**: Material Icons, FontAwesome, Dashicons
- **Icon Selection**: Modal picker với sidebar và main panel
- **Icon Positioning**: Before/after text
- **Icon Styling**: Size, color, style variants
- **Advanced Controls**: Slider UI với unit selection (px, em, rem, %)

### ✅ Enhanced UX
- **Visual Feedback**: Hover effects, focus states
- **Accessibility**: Keyboard navigation, screen reader support
- **Responsive Design**: Mobile-optimized layout
- **Performance**: Optimized rendering và asset loading

## 📖 Cách sử dụng

### 1. Thêm Block
```
1. Mở Gutenberg Editor
2. Thêm block "Icon Button"
3. Nhập button text
4. Cấu hình link (tùy chọn)
```

### 2. Thêm Icon
```
1. Mở Inspector Controls (sidebar)
2. Tab "Icon Settings"
3. Bật "Show Icon"
4. Chọn icon set và style
5. Điều chỉnh position (before/after)
6. Tùy chỉnh size và color
```

### 3. Chọn Icon từ Modal
```
1. Tab "Icon Selection"
2. Click "Chọn Icon" button
3. Chọn icon set từ sidebar bên trái
4. Sử dụng category filter và search
5. Click icon để chọn
```

### 4. Cấu hình Link
```
1. Tab "Button Settings"
2. Nhập URL
3. Chọn target window
4. Thêm rel attributes (tùy chọn)
```

### 5. Tùy chỉnh Style
```
1. Sử dụng Block Controls cho alignment
2. Tab "Typography" cho font settings
3. Tab "Layout" cho border radius và width
4. Sử dụng Color Settings cho colors
```

## 🎨 CSS Classes

### Block Structure
```html
<div class="jankx-icon-button-block">
    <a class="jankx-icon-button" href="..." target="...">
        <!-- Icon + Text -->
    </a>
</div>
```

### Button Content
```html
<a class="jankx-icon-button">
    <span class="material-icons" style="font-size: 18px; color: #fff;">icon_name</span>
    <span style="font-size: 16px; color: #fff;">Button Text</span>
</a>
```

## 🔧 Development

### Shared Components
Block sử dụng shared components từ `resources/shared/components/`:
- `IconPicker.tsx`: Icon selection component
- `ShadcnIconPicker.tsx`: Modal picker với layout mới

### File Structure
```
icon-button/
├── components/
│   └── IconSettings.tsx        # Icon styling controls
├── index.tsx                   # Main block file
├── editor.scss                # Editor styles
├── style.scss                # Frontend styles
├── block.json                # Block metadata
└── README.md                 # Documentation
```

### Build
```bash
npm run build:webpack
```

## 📱 Responsive

Block tự động responsive với:
- **Desktop**: Full button với hover effects
- **Tablet**: Optimized padding và font sizes
- **Mobile**: Compact layout với touch-friendly sizing

## ♿ Accessibility

- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Semantic HTML structure
- ARIA labels và descriptions
- High contrast mode support

## 🎯 Use Cases

1. **Call-to-Action Buttons**: Primary actions với icons
2. **Navigation Links**: Menu items với visual indicators
3. **Social Media Links**: Platform-specific icons
4. **Download Buttons**: File type icons
5. **Contact Buttons**: Phone, email, location icons

## 🆕 Features

### Modal Icon Picker Layout
- **Left Sidebar**: Icon sets selection
- **Right Main Panel**: Icon grid với controls
- **Category Filter**: Dropdown filter theo categories
- **Search Bar**: Full-text search cho icon names và tags

### Advanced Size Controls
- **Icon Size Slider**: Với unit selection (px, em, rem, %)
- **Real-time Preview**: Xem trước khi điều chỉnh
- **Intuitive UI**: Core block-like controls

### Enhanced Button Styling
- **Hover Effects**: Transform và shadow animations
- **Focus States**: Clear visual feedback
- **Active States**: Press feedback
- **Responsive Sizing**: Adaptive cho mobile

## 🔄 Updates

- ✅ Core button functionality (100% tương thích)
- ✅ Icon integration với modal picker
- ✅ Advanced size controls với unit selection
- ✅ Responsive design
- ✅ Accessibility improvements
- ✅ Shared component architecture (DRY principle)
- ✅ TypeScript strict typing
- ✅ SCSS modular styling
