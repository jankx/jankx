# Table of Contents Block - Style Guide

## Cách thêm Style Preset mới (List Marker Style)

### 1. Thêm vào `src/style-presets.js`

```javascript
{
    value: 'your-marker-style',
    label: 'Your Marker Style',
    description: 'Description of your marker style',
    preview: {
        backgroundColor: '#your-color',
        textColor: '#your-color',
        borderColor: '#your-color'
    }
}
```

### 2. Thêm CSS vào `src/style.css`

```css
/* Your Marker Style */
.wp-block-jankx-table-of-content.toc-style-your-marker-style {
    /* Container styles */
    background: #your-background;
    color: #your-text-color;
    padding: 1.5em;
    border-radius: 8px;
}

.wp-block-jankx-table-of-content.toc-style-your-marker-style .toc-title {
    color: #your-title-color;
    /* Title specific styles */
}

/* List marker styles */
.wp-block-jankx-table-of-content.toc-style-your-marker-style .toc-list {
    list-style: none; /* Remove default markers */
}

.wp-block-jankx-table-of-content.toc-style-your-marker-style .toc-list li {
    position: relative;
    padding-left: 1.5em;
}

/* Level 1 markers */
.wp-block-jankx-table-of-content.toc-style-your-marker-style .toc-list li::before {
    content: "●"; /* Your marker character */
    position: absolute;
    left: 0;
    color: #your-marker-color;
    font-weight: bold;
}

/* Level 2 markers */
.wp-block-jankx-table-of-content.toc-style-your-marker-style .toc-list ul li::before {
    content: "○"; /* Different marker for nested */
    color: #your-nested-marker-color;
}

/* Level 3 markers */
.wp-block-jankx-table-of-content.toc-style-your-marker-style .toc-list ul ul li::before {
    content: "▪"; /* Third level marker */
    color: #your-third-level-color;
}
```

### 3. Style sẽ tự động xuất hiện trong editor

Không cần thay đổi gì thêm! Style mới sẽ tự động:
- Xuất hiện trong dropdown Style Preset
- Được áp dụng khi người dùng chọn
- Hoạt động với tất cả các tính năng khác (custom colors, padding, etc.)

## Các Style hiện có (List Marker Types)

### 1. **Disc Markers** (Default)
- **Level 1**: `disc` (●)
- **Level 2**: `circle` (○)
- **Level 3**: `square` (■)
- Standard HTML list markers

### 2. **Numbered Markers** (Boxed)
- **Level 1**: `decimal` (1, 2, 3)
- **Level 2**: `lower-alpha` (a, b, c)
- **Level 3**: `lower-roman` (i, ii, iii)
- Boxed container với background

### 3. **No Markers** (Minimal)
- Không có markers
- Clean, minimal design
- Title uppercase

### 4. **Arrow Markers** (Bordered)
- **Level 1**: `→` (right arrow)
- **Level 2**: `▶` (filled triangle)
- **Level 3**: `▷` (outline triangle)
- Left border accent

### 5. **Check Markers** (Card)
- **Level 1**: `✓` (check mark - green)
- **Level 2**: `○` (circle - gray)
- **Level 3**: `▪` (square - light gray)
- Card styling với shadow

### 6. **Star Markers** (Highlight)
- **Level 1**: `★` (filled star - gold)
- **Level 2**: `☆` (outline star - gold)
- **Level 3**: `✦` (sparkle - gold)
- Gradient background

### 7. **Plus Markers** (Dark Red)
- **Level 1**: `+` (plus - white)
- **Level 2**: `−` (minus - white)
- **Level 3**: `•` (bullet - white)
- Dark red background

## Best Practices

### Màu sắc
- Sử dụng màu có độ tương phản tốt cho accessibility
- Test trên cả light và dark mode
- Cung cấp hover states rõ ràng

### Spacing
- Sử dụng padding nhất quán (1.5em thường là tốt)
- Đảm bảo margin giữa các items phù hợp
- Responsive trên mobile

### Typography
- Font weight phù hợp cho title
- Line height tốt cho readability
- Font size responsive

### Effects
- Transition mượt mà (0.2s ease)
- Hover effects không quá mạnh
- Shadow phù hợp với design

## Ví dụ Style mới

### Ocean Blue Style
```css
/* Ocean Blue Style */
.wp-block-jankx-table-of-content.toc-style-ocean-blue {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
    padding: 1.5em;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.wp-block-jankx-table-of-content.toc-style-ocean-blue .toc-title {
    color: #ffffff;
    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
    padding-bottom: 0.5em;
    margin-bottom: 1em;
}

.wp-block-jankx-table-of-content.toc-style-ocean-blue .toc-list a {
    color: rgba(255, 255, 255, 0.9);
    padding: 0.3em 0;
    transition: all 0.2s ease;
}

.wp-block-jankx-table-of-content.toc-style-ocean-blue .toc-list a:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
    padding-left: 0.5em;
    border-radius: 4px;
}
```

Và thêm vào `style-presets.js`:
```javascript
{
    value: 'ocean-blue',
    label: 'Ocean Blue',
    description: 'Ocean blue gradient with white text',
    preview: {
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: '#ffffff',
        borderColor: 'transparent'
    }
}
```
