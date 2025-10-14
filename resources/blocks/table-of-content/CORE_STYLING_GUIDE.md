# Table of Contents Block - Core Styling Integration

## Tích hợp WordPress Core Styling

Block Table of Contents đã được tích hợp đầy đủ với WordPress Core Styling API, cung cấp các tính năng styling giống như core/group block.

## ✅ Các tính năng Core Styling được hỗ trợ:

### 🎨 **Color Support**
- **Background Color**: Màu nền với color picker
- **Text Color**: Màu chữ với color picker
- **Gradients**: Hỗ trợ gradient backgrounds
- **Link Color**: Màu cho links trong TOC

### 📏 **Spacing Support**
- **Margin**: Margin trên/dưới/trái/phải
- **Padding**: Padding cho container
- **Block Gap**: Khoảng cách giữa các elements

### 🔲 **Border Support**
- **Border Color**: Màu viền
- **Border Radius**: Bo góc
- **Border Style**: Kiểu viền (solid, dashed, dotted)
- **Border Width**: Độ dày viền

### 🖼️ **Background Support**
- **Background Image**: Hình ảnh nền
- **Background Position**: Vị trí hình ảnh
- **Background Repeat**: Lặp lại hình ảnh
- **Background Size**: Kích thước hình ảnh

### 📐 **Dimensions Support**
- **Min Height**: Chiều cao tối thiểu

### ✍️ **Typography Support**
- **Font Size**: Kích thước chữ
- **Line Height**: Chiều cao dòng
- **Font Family**: Font chữ
- **Font Weight**: Độ đậm
- **Font Style**: Kiểu chữ (italic, normal)
- **Text Transform**: Chuyển đổi text (uppercase, lowercase)
- **Text Decoration**: Gạch chân, gạch ngang
- **Letter Spacing**: Khoảng cách chữ cái

## 🔧 Cách sử dụng:

### 1. **Trong Editor**
- Chọn block Table of Contents
- Mở **Block Settings** (sidebar bên phải)
- Sử dụng các panels:
  - **Color**: Background, Text, Link colors
  - **Typography**: Font settings
  - **Dimensions**: Min height
  - **Border**: Border styling
  - **Spacing**: Margin, Padding
  - **Background**: Background image

### 2. **Tương thích với Style Presets**
- Core styling hoạt động **cùng với** style presets
- Style presets cung cấp list markers
- Core styling cung cấp container styling
- Có thể kết hợp cả hai

### 3. **Ví dụ kết hợp**
```css
/* Style preset + Core styling */
.wp-block-jankx-table-of-content.toc-style-dark-red {
    /* Style preset: Plus markers */
    background: #8B0000;
    color: #ffffff;
}

/* + Core styling: Custom background image */
.wp-block-jankx-table-of-content.has-background {
    background-image: url('pattern.png');
    background-size: cover;
    padding: 2rem;
    border-radius: 12px;
    border: 2px solid #fff;
}
```

## 🎯 Lợi ích:

### **1. Consistency**
- Giống với core/group block
- Người dùng quen thuộc với interface
- Consistent UX across WordPress

### **2. Power**
- Tất cả tính năng styling của WordPress
- Theme color palette integration
- Responsive design support

### **3. Flexibility**
- Kết hợp với style presets
- Backward compatibility
- Future-proof

## 🔄 Backward Compatibility:

### **Legacy Attributes vẫn hoạt động:**
- `backgroundColor` (custom)
- `textColor` (custom)
- `borderColor` (custom)
- `customPadding` (custom)
- `customBorderRadius` (custom)
- `fontSize` (custom)

### **Core Attributes mới:**
- `style.color.background`
- `style.color.text`
- `style.spacing.margin`
- `style.spacing.padding`
- `style.border.*`
- `style.typography.*`

## 📝 Best Practices:

### **1. Sử dụng Core Styling cho:**
- Container styling (background, padding, margin)
- Typography (font, size, weight)
- Border và spacing
- Background images

### **2. Sử dụng Style Presets cho:**
- List markers (disc, arrows, stars, etc.)
- Marker colors và hierarchy
- Special effects (gradients, shadows)

### **3. Kết hợp cả hai:**
- Style preset cho markers
- Core styling cho container
- Tạo ra unique designs

## 🚀 Ví dụ Use Cases:

### **Corporate Style**
- Style Preset: "Numbered Markers"
- Core Background: Corporate blue
- Core Typography: Professional font
- Core Border: Subtle border

### **Creative Style**
- Style Preset: "Star Markers"
- Core Background: Gradient
- Core Border: Rounded corners
- Core Spacing: Generous padding

### **Minimal Style**
- Style Preset: "No Markers"
- Core Typography: Clean font
- Core Spacing: Minimal padding
- Core Border: None

Block Table of Contents giờ đây có đầy đủ sức mạnh styling của WordPress Core! 🎨
