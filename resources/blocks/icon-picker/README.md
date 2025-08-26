# Icon Picker Block

Block Gutenberg cho phép chọn và hiển thị icon với khả năng thêm link và text.

## 🚀 Tính năng

### ✅ Icon Selection
- **Multiple Icon Sets**: Material Icons, FontAwesome, Dashicons
- **Modal Layout**: Sidebar icon sets + Main panel icon grid
- **Category Filtering**: Filter icons theo categories
- **Full-text Search**: Tìm kiếm icon theo tên và tags
- **Real-time Preview**: Xem trước icon khi chọn

### ✅ Link Integration
- Thêm URL cho icon
- Tùy chọn target (_self, _blank, _parent, _top)
- Custom rel attributes
- Preview link trong editor

### ✅ Text/Label Support
- Thêm text label cho icon
- 4 vị trí: before, after, above, below
- Toggle hiển thị/ẩn label
- **Slider UI cho text size với unit selection (px, em, rem, %)**
- **Text color control với auto-sync với icon color**
- Styling riêng cho label

### ✅ Styling Options
- **Slider UI cho icon size với unit selection (px, em, rem, %)**
- Màu sắc icon và text
- Alignment (left, center, right)
- Icon style (filled, outlined, rounded, sharp, two-tone)
- Responsive design

## 📖 Cách sử dụng

### 1. Thêm Block
```
1. Mở Gutenberg Editor
2. Thêm block "Icon Picker"
3. Chọn icon từ modal picker
```

### 2. Chọn Icon từ Modal
```
1. Click "Chọn Icon" button
2. Chọn icon set từ sidebar bên trái:
   - Material Icons
   - FontAwesome
   - Dashicons
3. Sử dụng category filter và search
4. Click icon để chọn
```

### 3. Cấu hình Link
```
1. Mở Inspector Controls (sidebar)
2. Tab "Link Settings"
3. Nhập URL
4. Chọn target window
5. Thêm rel attributes (tùy chọn)
```

### 4. Thêm Text Label
```
1. Tab "Icon Settings"
2. Bật "Show Label"
3. Nhập text label
4. Chọn vị trí (before/after/above/below)
5. Điều chỉnh text size bằng slider với unit selection:
   - px: 8px - 100px
   - em: 0.5em - 10em
   - rem: 0.5rem - 10rem
   - %: 10% - 200%
6. Tùy chỉnh text color (mặc định giống icon color)
```

### 5. Tùy chỉnh Style
```
1. Tab "Icon Settings"
2. Điều chỉnh icon size bằng slider với unit selection:
   - px: 8px - 100px
   - em: 0.5em - 10em
   - rem: 0.5rem - 10rem
   - %: 10% - 200%
3. Chọn màu sắc từ color picker
4. Căn chỉnh alignment
5. Chọn icon style
6. Sử dụng Block Controls cho alignment
```

## 🎨 CSS Classes

### Block Structure
```html
<div class="jankx-icon-picker-block jankx-icon-picker-block--{alignment}">
    <div class="jankx-icon-picker-block__content">
        <!-- Icon + Label -->
    </div>
</div>
```

### Link Structure
```html
<a class="jankx-icon-picker-block__link" href="..." target="...">
    <span class="material-icons" style="font-size: 24px; color: #333;">icon_name</span>
    <span class="jankx-icon-picker-block__label jankx-icon-picker-block__label--{position}" style="font-size: 14px; color: #333;">
        Label Text
    </span>
</a>
```

### Label Positions
- `jankx-icon-picker-block__label--before`
- `jankx-icon-picker-block__label--after`
- `jankx-icon-picker-block__label--above`
- `jankx-icon-picker-block__label--below`

## 🔧 Development

### TypeScript Strict
- Tất cả components đã được chuyển sang TypeScript strict
- Type safety cho tất cả props và functions
- Interfaces được định nghĩa rõ ràng

### File Structure
```
icon-picker/
├── components/
│   ├── IconPicker.tsx          # Main picker component
│   ├── IconSettings.tsx        # Icon styling controls (với slider UI + unit selection)
│   ├── LinkSettings.tsx        # Link configuration
│   └── ShadcnIconPicker.tsx    # Modal picker với layout mới
├── index.tsx                   # Main block file
├── editor.scss                # Editor styles
├── style.scss                # Frontend styles
└── block.json                # Block metadata
```

### Build
```bash
npm run build:webpack
```

## 📱 Responsive

Block tự động responsive với:
- Mobile-friendly modal picker
- Flexible layout cho icon + label
- Touch-friendly controls
- Optimized spacing cho mobile
- Responsive text sizing

## ♿ Accessibility

- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Semantic HTML structure
- ARIA labels và descriptions
- High contrast mode support
- Reduced motion support

## 🎯 Use Cases

1. **Navigation Icons**: Menu items với icons
2. **Social Media Links**: Icons cho social platforms
3. **Feature Highlights**: Icons cho product features
4. **Call-to-Action**: Button icons với labels
5. **Contact Information**: Phone, email, location icons

## 🆕 New Features

### Modal Icon Picker Layout
- **Left Sidebar**: Icon sets selection (Material, FontAwesome, Dashicons)
- **Right Main Panel**: Icon grid với controls
- **Category Filter**: Dropdown filter theo categories
- **Search Bar**: Full-text search cho icon names và tags
- **Responsive Design**: Mobile-friendly layout

### Advanced Size Controls
- **Icon Size Slider**: Với unit selection (px, em, rem, %)
  - px: 8px - 100px (step: 1px)
  - em: 0.5em - 10em (step: 0.1em)
  - rem: 0.5rem - 10rem (step: 0.1rem)
  - %: 10% - 200% (step: 5%)
- **Text Size Slider**: Với unit selection (px, em, rem, %)
  - px: 8px - 100px (step: 1px)
  - em: 0.5em - 10em (step: 0.1em)
  - rem: 0.5rem - 10rem (step: 0.1rem)
  - %: 10% - 200% (step: 5%)
- Real-time preview khi điều chỉnh
- Intuitive unit button selection
- Automatic value conversion khi đổi unit

### Enhanced Text Styling
- Dynamic font-size control với multiple units
- **Text Color Control**: Tùy chỉnh màu text riêng biệt
- **Auto-sync**: Text color tự động sync với icon color
- Responsive text sizing
- Text overflow handling
- Better typography support
- Flexible sizing options

### Size Control UI
- **Unit Button Group**: px, em, rem, % buttons
- **Range Slider**: Với min/max/step tự động theo unit
- **Value Display**: Hiển thị giá trị hiện tại
- **Smart Conversion**: Tự động chuyển đổi giá trị khi đổi unit

## 🔄 Updates

- ✅ TypeScript strict conversion
- ✅ Enhanced link functionality
- ✅ Improved text/label support
- ✅ **Slider UI cho size controls**
- ✅ **Text size control với unit selection**
- ✅ **Icon size control với unit selection**
- ✅ **Advanced unit conversion system**
- ✅ **Modal layout với sidebar + main panel**
- ✅ **Multiple icon sets support**
- ✅ **Category filtering và search**
- ✅ **Text color control với auto-sync**
- ✅ Better responsive design
- ✅ Accessibility improvements
- ✅ High contrast mode support
- ✅ Reduced motion support
