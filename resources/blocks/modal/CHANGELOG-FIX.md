# Modal Block - Sửa lỗi và cập nhật

## Ngày: 12/10/2025

### Vấn đề
Modal block không hiển thị khi click vào trigger button.

### Nguyên nhân
1. Cấu trúc HTML không tuân theo chuẩn của Micromodal
2. Thiếu import và sử dụng thư viện Micromodal đúng cách
3. Thiếu các thuộc tính data attributes cần thiết
4. CSS display transition không hoạt động đúng

### Các thay đổi đã thực hiện

#### 1. File `edit.js`
- ✅ Thêm data attributes vào `blockProps`: `data-modal-id`, `data-close-on-overlay-click`, `data-close-on-escape`, `data-animation-type`, `data-backdrop-blur`
- ✅ Sửa class name từ `wp-block-jankx-modal` thành `wp-block-jankx-modal-wrapper` để đúng chuẩn
- ✅ Thêm header hiển thị Modal ID và thông tin cấu hình (size, animation)
- ✅ Đặt `isPreviewMode = true` mặc định để user có thể edit ngay
- ✅ Thêm toggle button để show/hide modal content trong editor
- ✅ Thêm placeholder khi modal content bị ẩn
- ✅ Cải thiện UI/UX trong editor với gradient header và thông tin rõ ràng

#### 2. File `save.js`
- ✅ Di chuyển logic tạo `finalModalId` lên trước khi sử dụng trong `blockProps`
- ✅ Thêm `data-backdrop-blur` và `data-modal-id` vào `blockProps`
- ✅ Loại bỏ `data-micromodal-close` khỏi thẻ root modal (chỉ giữ ở overlay và close button)
- ✅ Đảm bảo cấu trúc HTML tuân theo chuẩn Micromodal:
  ```html
  <div id="modal-id" aria-hidden="true">           <!-- [1] Modal container -->
    <div tabindex="-1" data-micromodal-close>      <!-- [2] Overlay -->
      <div role="dialog" aria-modal="true">        <!-- [3] Dialog -->
        <div class="content">                      <!-- Modal content -->
          ...
        </div>
      </div>
    </div>
  </div>
  ```

#### 2. File `view.js`
- ✅ Import thư viện `micromodal` từ npm package
- ✅ Cập nhật `initModals()` để sử dụng `MicroModal.init()` với cấu hình đầy đủ
- ✅ Thêm callbacks `onShow` và `onClose` để xử lý:
  - Shared data từ trigger element
  - Backdrop blur effect
  - Custom events (`jankx:modal:show`, `jankx:modal:close`)
- ✅ Xử lý custom selector triggers
- ✅ Cập nhật `window.JankxModal` API để sử dụng Micromodal hoặc fallback
- ✅ Enable `debugMode: true` để dễ dàng debug

#### 3. File `style.scss`
- ✅ Thêm `opacity` transition cho modal
- ✅ Đảm bảo modal hiển thị khi có class `.is-open`
- ✅ Cải thiện animation transitions

### Cách sử dụng

#### Sử dụng cơ bản
Block tự động tạo trigger button và modal. Chỉ cần thêm block vào editor và cấu hình:

1. **Trigger Settings**: Chọn loại trigger (Button, Link, hoặc Custom Selector)
2. **Modal Settings**: Cấu hình size, ID, close behaviors
3. **Animation Settings**: Chọn kiểu animation và duration
4. **Backdrop Settings**: Màu backdrop, blur effect, z-index

#### Sử dụng JavaScript API

```javascript
// Mở modal
window.JankxModal.show('modal-id');

// Đóng modal
window.JankxModal.hide('modal-id');

// Hoặc sử dụng trực tiếp Micromodal
window.JankxModal.MicroModal.show('modal-id', {
  onShow: (modal) => console.log('Modal opened!'),
  onClose: (modal) => console.log('Modal closed!')
});
```

#### Lắng nghe custom events

```javascript
// Khi modal mở
document.addEventListener('jankx:modal:show', (event) => {
  console.log('Modal ID:', event.detail.modalId);
  console.log('Modal Element:', event.detail.modalElement);
  console.log('Shared Data:', event.detail.sharedData);
});

// Khi modal đóng
document.addEventListener('jankx:modal:close', (event) => {
  console.log('Modal closed:', event.detail.modalId);
});
```

#### Sử dụng Custom Selector
Để trigger modal từ các elements khác trong trang:

1. Trong block settings, chọn **Trigger Type** = "Custom Selector"
2. Nhập CSS selector (ví dụ: `.my-button, #open-modal`)
3. Tất cả elements khớp với selector đó sẽ tự động trigger modal khi click

Hoặc thêm thuộc tính `data-micromodal-trigger` vào bất kỳ element nào:

```html
<button data-micromodal-trigger="modal-id">Open Modal</button>
```

### Integration với Button Block

#### File `button/save.tsx`
- ✅ Thêm `data-micromodal-trigger` attribute (chuẩn Micromodal)
- ✅ Giữ `data-modal-id` cho backward compatibility
- ✅ Support các data attributes để share data với modal:
  - `data-share-object-id` - Chia sẻ ID của post/page hiện tại
  - `data-share-post-title` - Chia sẻ title của post/page
  - `data-share-current-url` - Chia sẻ URL hiện tại

#### File `button/view.js`
- ✅ Thêm function `initModalTriggerButtons()` để xử lý modal triggers
- ✅ Tự động lấy current post data từ `window.jankxCurrentPost` (nếu có)
- ✅ Thêm data attributes động vào button triggers
- ✅ Log thông tin debug để dễ troubleshoot
- ✅ Expose `window.JankxButton.initModalTriggers` cho manual init

### Dependencies
- ✅ `micromodal` - Đã được cài đặt qua npm: `yarn add micromodal --save`

### Tính năng Data Sharing giữa Button và Modal

Button block giờ có thể chia sẻ dữ liệu với modal thông qua các settings:

1. **Share Object ID** - ID của post/page hiện tại (từ `window.jankxCurrentPost.ID`)
2. **Share Post Title** - Title của post/page hiện tại
3. **Share Current URL** - URL trang hiện tại

Dữ liệu này được lưu trong `window.jankxShareData[modalId]` và có thể truy cập qua event:

```javascript
document.addEventListener('jankx:modal:show', (event) => {
  const sharedData = event.detail.sharedData;
  console.log('Object ID:', sharedData.objectId);
  console.log('Post Title:', sharedData.postTitle);
  console.log('Current URL:', sharedData.currentUrl);
});
```

### Testing
Sau khi build, kiểm tra:
1. ✅ Build thành công (`npx webpack --config webpack.config.js`)
2. ⏳ Modal hiển thị khi click trigger button
3. ⏳ Modal đóng khi:
   - Click vào overlay (nếu `closeOnOverlayClick` = true)
   - Nhấn phím ESC (nếu `closeOnEscape` = true)
   - Click vào close button
4. ⏳ Animations hoạt động đúng
5. ⏳ Console log hiển thị debug messages

### Build command
```bash
cd C:/Users/puleeno/Projects/buocchandisan.vn/wp-content/themes/jankx/resources
npx webpack --config webpack.config.js
```

### Lưu ý
- Micromodal library sẽ tự động xử lý accessibility (ARIA attributes, focus management)
- Debug mode đang được enable, có thể tắt bằng cách set `debugMode: false` trong `MicroModal.init()`
- Block đã tương thích với chuẩn WAI-ARIA guidelines

### References
- [Micromodal Documentation](https://micromodal.vercel.app/)
- [Micromodal GitHub](https://github.com/micromodal/Micromodal)

