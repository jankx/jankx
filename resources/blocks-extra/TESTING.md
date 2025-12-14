# Hướng dẫn Test Gutenberg và Blocks Extra

## Cài đặt và Kiểm tra

### 1. Kích hoạt Blocks Extra

Thêm dòng này vào file `functions.php` của theme:

```php
require_once get_template_directory() . '/resources/blocks-extra/php/blocks-extra-filters.php';
```

### 2. Kiểm tra trong WordPress Admin

#### A. Kiểm tra Block Editor
1. Vào **Posts → Add New** hoặc **Pages → Add New**
2. Mở Block Editor
3. Thêm một block bất kỳ (ví dụ: Paragraph, Image, Heading)

#### B. Kiểm tra Blocks Extra Controls
1. Click vào block vừa thêm
2. Mở **Inspector** (panel bên phải)
3. Tìm panel **"Jankx Advanced Settings"**
4. Kiểm tra dropdown **"Render Mode"** có:
   - **SSR (Server-Side Rendering)**
   - **CSR (Client-Side Rendering)**

#### C. Kiểm tra Visual Indicators
1. Trong editor, block sẽ hiển thị badge:
   - **SSR** (màu xanh) cho Server-Side Rendering
   - **CSR** (màu cam) cho Client-Side Rendering

### 3. Test Frontend

#### A. Test SSR Mode
1. Chọn **SSR** cho một block
2. Save/Publish page
3. View page ở frontend
4. Kiểm tra:
   - Block hiển thị bình thường
   - Không có loading animation
   - Source HTML có nội dung đầy đủ

#### B. Test CSR Mode
1. Chọn **CSR** cho một block
2. Save/Publish page
3. View page ở frontend
4. Kiểm tra:
   - Block hiển thị loading animation ban đầu
   - Sau 100ms, block fade-in với nội dung
   - Có class `jankx-csr-loaded` khi đã load xong

### 4. Test Interactive Features (CSR Mode)

#### A. Test Image Block
1. Thêm Image block với CSR mode
2. Click vào ảnh
3. Kiểm tra:
   - Ảnh zoom lên 1.5x khi click
   - Click lại để zoom về normal

#### B. Test Gallery Block
1. Thêm Gallery block với CSR mode
2. Click vào bất kỳ ảnh nào
3. Kiểm tra:
   - Lightbox mở ra
   - Dùng arrow keys để navigate
   - ESC để đóng lightbox

#### C. Test Heading Block
1. Thêm Heading block với CSR mode
2. Click vào heading
3. Kiểm tra:
   - Text được copy vào clipboard
   - Background flash green khi copy thành công

### 5. Test Responsive

#### A. Test Mobile View
1. Dùng Chrome DevTools (Ctrl+Shift+I)
2. Switch sang mobile view
3. Kiểm tra:
   - Loading state hiển thị đúng trên mobile
   - Hover effects disabled trên mobile
   - Responsive containers hoạt động

#### B. Test Tablet/Desktop
1. Test ở các viewport khác nhau
2. Kiểm tra responsive containers và spacing

### 6. Debug Tools

#### A. Browser Console
Mở console và kiểm tra:

```javascript
// Kiểm tra Blocks Extra API
console.log(window.JankxBlocksExtra);

// Kiểm tra CSR blocks
console.log(document.querySelectorAll('.jankx-csr-block'));

// Kiểm tra render mode badges
console.log(document.querySelectorAll('.jankx-render-mode-ssr, .jankx-render-mode-csr'));
```

#### B. Network Tab
1. Mở Network tab trong DevTools
2. Refresh page
3. Kiểm tra:
   - `jankx-blocks-extra-editor.js` load trong admin
   - `jankx-blocks-extra-frontend.js` load ở frontend
   - SCSS files được compiled và load

### 7. Test Accessibility

#### A. High Contrast Mode
1. Bật high contrast mode trong Windows/macOS
2. Kiểm tra colors và contrast

#### B. Reduced Motion
1. Bắt đầu reduced motion trong browser settings
2. Kiểm tra animations disabled

#### C. Keyboard Navigation
1. Tab qua các blocks
2. Kiểm tra focus states

### 8. Common Issues & Solutions

#### Issue: Không thấy Jankx Advanced Settings
**Solution:**
- Kiểm tra file `blocks-extra-filters.php` được include
- Clear browser cache
- Kiểm tra console có error không

#### Issue: CSR blocks không load
**Solution:**
- Kiểm tra `jankx-blocks-extra-frontend.js` load
- Kiểm tra console có JavaScript error không
- Verify block có `data-block-name` và `data-block-attrs`

#### Issue: Styles không apply
**Solution:**
- Kiểm tra SCSS files được compiled
- Verify asset paths trong PHP
- Clear browser cache

### 9. Performance Testing

#### A. Page Load Time
1. Dùng Lighthouse để test performance
2. So sánh SSR vs CSR mode
3. Kiểm tra Core Web Vitals

#### B. Memory Usage
1. Monitor browser memory usage
2. Kiểm tra có memory leak không

### 10. Advanced Testing

#### A. Test Multiple Blocks
1. Tạo page với nhiều blocks khác nhau
2. Mix SSR và CSR modes
3. Kiểm tra interactions giữa blocks

#### B. Test Edge Cases
1. Empty blocks
2. Large content blocks
3. Nested blocks

### Quick Test Checklist

- [ ] Blocks Extra được load trong admin
- [ ] Render mode dropdown xuất hiện
- [ ] Visual indicators hiển thị đúng
- [ ] SSR mode hoạt động bình thường
- [ ] CSR mode có loading animation
- [ ] Interactive features hoạt động (image zoom, gallery lightbox, heading copy)
- [ ] Responsive design hoạt động
- [ ] Accessibility features hoạt động
- [ ] No JavaScript errors
- [ ] Performance acceptable

### Troubleshooting Commands

```bash
# Clear WordPress cache
wp cache flush

# Regenerate assets (nếu có build system)
npm run build

# Check file permissions
chmod 644 resources/blocks-extra/php/blocks-extra-filters.php
```

Nếu có vấn đề, kiểm tra:
1. WordPress version (cần 5.0+ cho Gutenberg)
2. PHP version (cần 7.4+)
3. Browser console errors
4. Network tab cho failed requests
