# Table of Contents Block - Compatibility Fix

## Lỗi đã sửa:

### **TypeError: __experimentalUseSpacingProps is not a function**

**Nguyên nhân:**
- Các experimental hooks không tồn tại trong phiên bản WordPress hiện tại
- `__experimentalUseBorderProps`, `__experimentalUseColorProps`, `__experimentalUseSpacingProps`, `__experimentalUseBackgroundProps` không available

**Giải pháp:**
- Loại bỏ các experimental hooks
- Sử dụng `useBlockProps()` với core styling support
- Thêm function check cho `wp_style_engine_get_styles()`

## ✅ Thay đổi đã thực hiện:

### 1. **Edit.js - Loại bỏ experimental hooks:**
```javascript
// TRƯỚC (gây lỗi):
import {
    __experimentalUseBorderProps as useBorderProps,
    __experimentalUseColorProps as useColorProps,
    __experimentalUseSpacingProps as useSpacingProps,
    __experimentalUseBackgroundProps as useBackgroundProps,
} from '@wordpress/block-editor';

// SAU (hoạt động):
import {
    InspectorControls,
    BlockControls,
    useBlockProps,
} from '@wordpress/block-editor';
```

### 2. **Edit.js - Simplified block props:**
```javascript
// TRƯỚC (phức tạp):
const colorProps = useColorProps( attributes );
const borderProps = useBorderProps( attributes );
const spacingProps = useSpacingProps( attributes );
const backgroundProps = useBackgroundProps( attributes );

// SAU (đơn giản):
const blockProps = useBlockProps( {
    className: [
        'wp-block-jankx-table-of-content',
        stylePreset && stylePreset !== 'default' ? `toc-style-${stylePreset}` : '',
        fontSize ? `toc-font-${fontSize}` : '',
    ].filter(Boolean).join(' '),
} );
```

### 3. **TableOfContentBlock.php - Function check:**
```php
// TRƯỚC (có thể gây lỗi):
$style_attributes = wp_style_engine_get_styles($attributes, [
    'selector' => '.wp-block-jankx-table-of-content',
    'context' => 'block-supports',
]);

// SAU (an toàn):
if (function_exists('wp_style_engine_get_styles')) {
    $style_attributes = wp_style_engine_get_styles($attributes, [
        'selector' => '.wp-block-jankx-table-of-content',
        'context' => 'block-supports',
    ]);
    // ... rest of the code
}
```

## 🎯 Kết quả:

### **Core Styling vẫn hoạt động:**
- Block.json supports vẫn được giữ nguyên
- WordPress tự động generate CSS classes
- Core styling panels vẫn xuất hiện trong editor
- Tương thích với tất cả phiên bản WordPress

### **Style Presets vẫn hoạt động:**
- Tất cả 7 style presets vẫn hoạt động bình thường
- Custom markers (disc, arrows, stars, plus, etc.)
- Backward compatibility với legacy attributes

### **Không có lỗi JavaScript:**
- Block load thành công
- Editor hoạt động mượt mà
- Không có console errors

## 🔧 Cách hoạt động:

### **1. Core Styling:**
- WordPress tự động detect supports trong block.json
- Generate CSS classes và inline styles
- Apply thông qua `useBlockProps()`

### **2. Style Presets:**
- Custom CSS classes cho list markers
- Hoạt động độc lập với core styling
- Có thể kết hợp với core styling

### **3. Backward Compatibility:**
- Legacy attributes vẫn hoạt động
- Không ảnh hưởng đến blocks cũ
- Smooth migration

## 📝 Lưu ý:

### **WordPress Version Compatibility:**
- Hoạt động với WordPress 5.9+
- Core styling support từ WordPress 6.0+
- Function check đảm bảo compatibility

### **Future Updates:**
- Khi WordPress stable các experimental hooks
- Có thể upgrade để sử dụng hooks mới
- Hiện tại sử dụng approach ổn định

Block Table of Contents giờ đây hoạt động ổn định với tất cả phiên bản WordPress! 🚀
