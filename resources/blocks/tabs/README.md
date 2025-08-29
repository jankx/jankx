# Tabs Block

Một block Gutenberg mạnh mẽ để tạo và quản lý tabs với nhiều tùy chọn tùy chỉnh.

## Tính năng

### 🎨 **Tùy chỉnh Layout**
- **Horizontal/Vertical Layout**: Chọn hướng hiển thị tabs
- **Position Options**: Top, Bottom, Left, Right
- **Responsive Design**: Tự động điều chỉnh trên mobile

### 🎯 **Styling Options**
- **Border Controls**: Style, width, color, radius
- **Color Management**: Background, text, active tab colors
- **Padding Controls**: Individual hoặc linked padding
- **Separator Options**: Tùy chỉnh separator giữa tabs và content

### ⚡ **Interactive Features**
- **Keyboard Navigation**: Arrow keys, Home, End, Enter, Space
- **Auto-switch**: Tự động chuyển tab theo thời gian
- **Focus Management**: Quản lý focus accessibility
- **Smooth Animations**: Transition mượt mà

### 🔧 **Advanced Features**
- **Custom CSS Classes**: Thêm class tùy chỉnh
- **Anchor ID**: Deep linking support
- **Z-index Control**: Quản lý stacking order
- **Dynamic Content**: Hỗ trợ content động

## Cách sử dụng

### 1. Thêm Tabs Block
1. Mở Gutenberg Editor
2. Tìm "Tabs Block" trong block library
3. Thêm vào trang

### 2. Thêm Tab Content
1. Click vào "+ Add Tab" button
2. Hoặc thêm "Tab" block trực tiếp vào tabs content area
3. Đặt tên cho tab trong tab label
4. Thêm content vào tab panel

### 3. Tùy chỉnh Settings

#### General Settings
- **Tab Layout**: Horizontal/Vertical
- **Labels Position**: Top/Bottom/Left/Right
- **Show Separator**: Bật/tắt separator
- **Separator Style**: Solid/Dashed/Dotted/Double
- **Separator Color & Height**: Tùy chỉnh separator

#### Style Settings
- **Container Style**: Border, radius, shadow
- **Labels Style**: Background, color, padding
- **Content Style**: Background, color, padding
- **Active Tab Colors**: Màu sắc cho tab đang active

#### Advanced Settings
- **Anchor ID**: ID cho deep linking
- **Custom CSS Class**: Thêm class tùy chỉnh
- **Z-Index**: Quản lý stacking order

## Cấu trúc Files

```
resources/blocks/tabs/
├── block.json          # Block metadata
├── index.tsx           # Block registration
├── edit.tsx            # Editor component
├── save.tsx            # Save component
├── tab.tsx             # Tab child block
├── editor.scss         # Editor styles
├── style.scss          # Frontend styles
├── frontend.ts         # Frontend JavaScript
└── README.md           # Documentation
```

## JavaScript API

### Global Access
```javascript
// Access tabs instance
window.jankxTabs

// Access specific block
const block = window.jankxTabs.getBlock('block-id');

// Show specific tab
window.jankxTabs.showTab('block-id', 0);
```

### Event Listeners
```javascript
// Listen for tab changes
document.addEventListener('jankx-tab-changed', (event) => {
    console.log('Tab changed:', event.detail);
    // event.detail contains: blockId, index, label, panel
});
```

### Custom Options
```javascript
// Set custom options via data attributes
<div class="jankx-tabs-block"
     data-auto-switch="true"
     data-auto-switch-interval="3000"
     data-keyboard-navigation="true">
```

## CSS Custom Properties

Block sử dụng CSS custom properties để tùy chỉnh:

```css
.jankx-tabs-block {
    --jankx-tabs-layout: horizontal;
    --jankx-tabs-labels-position: top;
    --jankx-tabs-separator-style: solid;
    --jankx-tabs-separator-color: #E1E1E1;
    --jankx-tabs-separator-height: 1px;
    --jankx-tabs-labels-separator-style: solid;
    --jankx-tabs-labels-separator-color: #E1E1E1;
    --jankx-tabs-labels-separator-width: 1px;
    --jankx-tabs-active-color: #44677A;
    --jankx-tabs-active-bg: #fff;
    --jankx-tabs-active-separate-less: 1;
}
```

## Accessibility

Block được thiết kế với accessibility tốt:

- **ARIA Attributes**: role, aria-selected, aria-controls, aria-hidden
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus handling
- **Screen Reader Support**: Semantic HTML structure

## Responsive Design

- **Mobile**: Tự động chuyển vertical layout thành horizontal
- **Tablet**: Tối ưu padding và font size
- **Desktop**: Full feature set

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **IE11+**: Basic functionality (no CSS custom properties)
- **Mobile Browsers**: iOS Safari, Chrome Mobile

## Performance

- **Lazy Loading**: JavaScript chỉ load khi cần
- **Efficient DOM**: Minimal DOM manipulation
- **Memory Management**: Proper cleanup và event handling

## Troubleshooting

### Tab không hiển thị
1. Kiểm tra JavaScript console cho errors
2. Đảm bảo frontend.js được load
3. Kiểm tra CSS conflicts

### Styling không apply
1. Kiểm tra CSS custom properties
2. Đảm bảo style.css được load
3. Kiểm tra CSS specificity

### Keyboard navigation không hoạt động
1. Đảm bảo tab có focus
2. Kiểm tra data-keyboard-navigation attribute
3. Kiểm tra JavaScript errors

## Development

### Build Process
```bash
# Build all blocks
npm run build:webpack

# Build only tabs block
npm run build:webpack -- --entry blocks/tabs
```

### File Structure
- **TypeScript**: Tất cả logic chính
- **SCSS**: Styling với variables và mixins
- **PHP**: Server-side rendering và block registration

### Adding Features
1. Update `block.json` cho attributes mới
2. Modify `edit.tsx` cho UI controls
3. Update `save.tsx` cho frontend rendering
4. Add styles trong `editor.scss` và `style.scss`
5. Update `frontend.ts` cho JavaScript logic

## License

MIT License - Xem file LICENSE để biết thêm chi tiết.
