# Modal Block - Hướng dẫn sử dụng nhanh

## ✅ Đã hoàn thành

Tất cả các thay đổi đã được implement và build thành công!

## 🎯 Sử dụng trong WordPress Editor

### 1. Thêm Modal Block

1. Mở WordPress Editor
2. Thêm block "Modal" (tìm kiếm `modal` hoặc tìm trong category "Jankx Blocks")
3. Modal ID sẽ tự động được tạo (dạng `modal-xxxxx`)
4. Modal content sẽ hiển thị ngay để bạn có thể edit

### 2. Cấu hình Modal

**Trigger Settings:**
- Chọn loại trigger: Button, Link, hoặc Custom Selector
- Nhập text cho trigger button

**Modal Settings:**
- Modal ID: ID duy nhất (tự động tạo hoặc tự đặt)
- Size: Small, Medium, Large, Fullscreen
- Close on overlay click: Có/Không
- Close on ESC key: Có/Không
- Show close button: Có/Không

**Animation Settings:**
- Animation type: Fade, Slide, Zoom, None
- Duration: 100ms - 1000ms

**Backdrop Settings:**
- Backdrop color: Chọn màu
- Backdrop blur: Có/Không
- Z-index: 1000 - 99999

### 3. Thêm Button để mở Modal

1. Thêm block "Button" (Jankx Button)
2. Trong sidebar settings → **Trigger Settings**
3. Chọn **Trigger Type** = "🪟 Modal - Open Modal"
4. Nhập **Modal ID** (copy từ modal block header)
5. (Optional) Bật các options để share data:
   - Share Object ID ✓
   - Share Post Title ✓
   - Share Current URL ✓

### 4. Show/Hide Modal Content trong Editor

- Click icon 👁️ trên toolbar để toggle preview mode
- Hoặc click vào trigger button trong editor
- Hoặc click button "Show Modal Content to Edit" khi modal bị ẩn

## 💻 Sử dụng với JavaScript

### Mở modal programmatically

```javascript
// Cách 1: Dùng Jankx Modal API
window.JankxModal.show('modal-id');

// Cách 2: Dùng Micromodal trực tiếp
window.JankxModal.MicroModal.show('modal-id');
```

### Đóng modal programmatically

```javascript
window.JankxModal.hide('modal-id');
```

### Lắng nghe events

```javascript
// Khi modal mở
document.addEventListener('jankx:modal:show', (event) => {
  console.log('Modal opened:', event.detail.modalId);
  console.log('Shared data:', event.detail.sharedData);
});

// Khi modal đóng
document.addEventListener('jankx:modal:close', (event) => {
  console.log('Modal closed:', event.detail.modalId);
});
```

### Truy cập shared data

```javascript
// Data được share từ button
const modalId = 'modal-123';
const sharedData = window.jankxShareData[modalId];

console.log('Object ID:', sharedData.objectId);
console.log('Post Title:', sharedData.postTitle);
console.log('Current URL:', sharedData.currentUrl);
```

## 🔧 Debug

### Kiểm tra Console

Mở Console (F12) và xem các log messages:

✅ **Modal opened:** modal-id
✅ **Micromodal initialized with configs:** {...}
✅ **Modal trigger button initialized:** {...}
✅ **Shared data for modal:** {...}

### Common Issues

**Modal không hiển thị?**
- Kiểm tra Modal ID có đúng không
- Kiểm tra Console có errors không
- Đảm bảo `debugMode: true` trong Micromodal config
- Clear cache và reload page

**Button không trigger modal?**
- Kiểm tra button có `data-micromodal-trigger` attribute
- Kiểm tra Modal ID match với button's modal-id
- Kiểm tra Console logs

**Shared data không có?**
- Kiểm tra button settings có bật share options
- Kiểm tra `window.jankxCurrentPost` có data không
- Xem Console log "Modal trigger button initialized"

## 📝 Ví dụ HTML Output

### Modal Block HTML (Frontend)

```html
<div class="wp-block-jankx-modal-wrapper"
     data-modal-id="modal-123"
     data-close-on-overlay-click="true"
     data-close-on-escape="true"
     data-animation-type="fade"
     data-backdrop-blur="false">

  <!-- Trigger Button -->
  <button class="wp-block-jankx-modal__trigger"
          data-micromodal-trigger="modal-123">
    Open Modal
  </button>

  <!-- Modal -->
  <div id="modal-123" class="wp-block-jankx-modal" aria-hidden="true">
    <div class="wp-block-jankx-modal__overlay" tabindex="-1" data-micromodal-close>
      <div class="wp-block-jankx-modal__container wp-block-jankx-modal__container--medium"
           role="dialog"
           aria-modal="true">
        <div class="wp-block-jankx-modal__content">
          <button class="wp-block-jankx-modal__close"
                  aria-label="Close modal"
                  data-micromodal-close></button>
          <!-- Your content here -->
        </div>
      </div>
    </div>
  </div>
</div>
```

### Button Trigger HTML (Frontend)

```html
<div class="wp-block-button">
  <button class="wp-block-button__link jankx-button-modal-trigger"
          type="button"
          data-micromodal-trigger="modal-123"
          data-modal-id="modal-123"
          data-trigger-type="modal"
          data-share-object-id="true"
          data-share-post-title="true"
          data-share-current-url="true">
    Open Modal
  </button>
</div>
```

## 🎨 Custom Styling

Modal block không có default styles, bạn có thể tự styling trong theme:

```css
/* Custom modal styles */
.wp-block-jankx-modal__content {
  padding: 40px;
  background: white;
  border-radius: 12px;
}

.wp-block-jankx-modal__overlay {
  background: rgba(0, 0, 0, 0.8);
}

/* Custom animation */
.modal-animation-fade .wp-block-jankx-modal__content {
  opacity: 0;
  transition: opacity 300ms ease;
}

.modal-animation-fade.is-open .wp-block-jankx-modal__content {
  opacity: 1;
}
```

## 📚 Tài liệu tham khảo

- [Micromodal Documentation](https://micromodal.vercel.app/)
- [WAI-ARIA Modal Pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal)
- File `CHANGELOG-FIX.md` - Chi tiết tất cả thay đổi

---

**Chúc bạn sử dụng vui vẻ! 🎉**

