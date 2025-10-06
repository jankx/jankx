# Modal Block

Modal block cho phép tạo các popup modal với trigger và content areas. Hỗ trợ inner blocks và custom selectors.

## Tính năng

- **Trigger Types**: Button, Link, hoặc Custom Selector
- **Modal Sizes**: Small, Medium, Large, Fullscreen
- **Animations**: Fade, Slide, Zoom, None
- **Customizable**: Backdrop color, blur effect, z-index
- **Accessibility**: ARIA attributes, keyboard navigation
- **Inner Blocks**: Hỗ trợ nhúng bất kỳ block nào vào modal content

## Cách sử dụng

### 1. Thêm Modal Block

1. Trong Gutenberg editor, tìm kiếm "Modal" trong block inserter
2. Thêm block vào trang/post
3. Cấu hình trigger settings trong sidebar

### 2. Cấu hình Trigger

**Button Trigger:**
- Chọn "Button" trong Trigger Type
- Nhập text cho button
- Button sẽ hiển thị và khi click sẽ mở modal

**Link Trigger:**
- Chọn "Link" trong Trigger Type
- Nhập text và URL cho link
- Chọn target window (_self hoặc _blank)

**Custom Selector:**
- Chọn "Custom Selector" trong Trigger Type
- Nhập CSS selector (ví dụ: `.my-button`, `#trigger-element`)
- Các element khớp với selector sẽ trigger modal

### 3. Cấu hình Modal

**Modal Settings:**
- **Modal ID**: ID duy nhất cho modal (tự động generate nếu để trống)
- **Modal Size**: Chọn kích thước modal
- **Close on Overlay Click**: Đóng modal khi click vào backdrop
- **Close on Escape Key**: Đóng modal khi nhấn phím Escape
- **Show Close Button**: Hiển thị nút đóng

**Animation Settings:**
- **Animation Type**: Chọn loại animation (fade, slide, zoom, none)
- **Animation Duration**: Thời gian animation (100-1000ms)

**Backdrop Settings:**
- **Backdrop Color**: Màu nền backdrop
- **Backdrop Blur**: Hiệu ứng blur cho backdrop
- **Z-Index**: Thứ tự hiển thị (1000-99999)

### 4. Thêm Content

**Cách thêm nội dung vào modal:**
1. Trong editor, bạn sẽ thấy phần "Modal Content" bên dưới trigger
2. Click vào vùng "Click here to add modal content..." để thêm blocks
3. Có thể thêm bất kỳ block nào: heading, paragraph, image, button, columns, group, etc.
4. Sử dụng nút "Show Preview" để xem trước modal hoàn chỉnh

**Lưu ý quan trọng:**
- Inner blocks chỉ hiển thị trong editor mode, không hiển thị trên frontend
- Nội dung modal chỉ xuất hiện khi modal được mở
- Sử dụng preview mode để kiểm tra layout và styling

## JavaScript API

### Mở/Đóng Modal programmatically

```javascript
// Mở modal
JankxModal.show('modal-id');

// Đóng modal
JankxModal.hide('modal-id');

// Hoặc sử dụng function được tạo tự động
showModalModalId(); // Thay modalId bằng ID thực tế
hideModalModalId();
```

### Event Listeners

```javascript
// Lắng nghe khi modal mở
document.addEventListener('micromodal:open', function(event) {
    console.log('Modal opened:', event.detail);
});

// Lắng nghe khi modal đóng
document.addEventListener('micromodal:close', function(event) {
    console.log('Modal closed:', event.detail);
});
```

## CSS Customization

### CSS Variables

```css
.modal-id {
    --modal-backdrop-color: rgba(0, 0, 0, 0.5);
    --modal-animation-duration: 300ms;
    --modal-z-index: 9999;
    --modal-backdrop-blur: none;
}
```

### Custom Styling

```css
/* Tùy chỉnh modal content */
.wp-block-jankx-modal__content {
    border-radius: 12px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

/* Tùy chỉnh trigger button */
.wp-block-jankx-modal__trigger {
    background: linear-gradient(45deg, #007cba, #005a87);
    border-radius: 8px;
    padding: 12px 24px;
}
```

## Responsive Design

Modal block tự động responsive:
- Trên mobile: Modal chiếm toàn bộ màn hình
- Trên tablet: Modal có padding nhỏ hơn
- Trên desktop: Modal hiển thị theo kích thước đã chọn

## Accessibility

- ARIA attributes đầy đủ
- Keyboard navigation (Tab, Escape)
- Focus management
- Screen reader support
- High contrast mode support

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- Micromodal.js (tự động load)
- WordPress Gutenberg blocks
- Modern CSS features (CSS Grid, Flexbox, Custom Properties)

