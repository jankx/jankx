# Test Flex Order - Example HTML

Đây là ví dụ HTML để test tính năng Flex Order responsive đã được implement.

## Test Case 1: Đảo ngược 2 cột trên Mobile

### HTML Output từ Gutenberg:

```html
\u003c!-- Parent Container (phải có display: flex hoặc grid) --\u003e
\u003cdiv class="wp-block-columns" style="display: flex; gap: 20px;"\u003e
    
    \u003c!-- Column A: Desktop order = 1, Mobile order = 2 --\u003e
    \u003cdiv class="wp-block-column has-jankx-responsive-dimensions has-jankx-flex-order" 
         style="--jankx-flex-order-desktop: 1; --jankx-flex-order-mobile: 2;"\u003e
        \u003ch3\u003eColumn A (Content)\u003c/h3\u003e
        \u003cp\u003eThis is the main content. On desktop it shows first, on mobile it shows second.\u003c/p\u003e
    \u003c/div\u003e
    
    \u003c!-- Column B: Desktop order = 2, Mobile order = 1 --\u003e
    \u003cdiv class="wp-block-column has-jankx-responsive-dimensions has-jankx-flex-order" 
         style="--jankx-flex-order-desktop: 2; --jankx-flex-order-mobile: 1;"\u003e
        \u003ch3\u003eColumn B (Sidebar)\u003c/h3\u003e
        \u003cp\u003eThis is the sidebar. On desktop it shows second, on mobile it shows first.\u003c/p\u003e
    \u003c/div\u003e
    
\u003c/div\u003e
```

### Expected Behavior:

- **Desktop (> 1024px)**: Column A → Column B
- **Mobile (< 768px)**: Column B → Column A

---

## Test Case 2: 3 Blocks với thứ tự khác nhau

```html
\u003cdiv class="wp-block-group" style="display: flex; flex-direction: column;"\u003e
    
    \u003c!-- Block 1: Always first --\u003e
    \u003cdiv class="wp-block-paragraph has-jankx-responsive-dimensions has-jankx-flex-order" 
         style="--jankx-flex-order-desktop: 1; --jankx-flex-order-tablet: 1; --jankx-flex-order-mobile: 1;"\u003e
        \u003cp\u003e📱 Block 1: Always first on all devices\u003c/p\u003e
    \u003c/div\u003e
    
    \u003c!-- Block 2: Desktop=2, Tablet=3, Mobile=3 --\u003e
    \u003cdiv class="wp-block-paragraph has-jankx-responsive-dimensions has-jankx-flex-order" 
         style="--jankx-flex-order-desktop: 2; --jankx-flex-order-tablet: 3; --jankx-flex-order-mobile: 3;"\u003e
        \u003cp\u003e💻 Block 2: Second on desktop, third on tablet/mobile\u003c/p\u003e
    \u003c/div\u003e
    
    \u003c!-- Block 3: Desktop=3, Tablet=2, Mobile=2 --\u003e
    \u003cdiv class="wp-block-paragraph has-jankx-responsive-dimensions has-jankx-flex-order" 
         style="--jankx-flex-order-desktop: 3; --jankx-flex-order-tablet: 2; --jankx-flex-order-mobile: 2;"\u003e
        \u003cp\u003e📊 Block 3: Third on desktop, second on tablet/mobile\u003c/p\u003e
    \u003c/div\u003e
    
\u003c/div\u003e
```

### Expected Behavior:

- **Desktop**: Block 1 → Block 2 → Block 3
- **Tablet**: Block 1 → Block 3 → Block 2
- **Mobile**: Block 1 → Block 3 → Block 2

---

## Test Case 3: Grid Layout

```html
\u003cdiv class="wp-block-group" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;"\u003e
    
    \u003cdiv class="wp-block-image has-jankx-responsive-dimensions has-jankx-flex-order" 
         style="--jankx-flex-order-desktop: 1; --jankx-flex-order-mobile: 3;"\u003e
        \u003cimg src="image1.jpg" alt="Image 1"\u003e
    \u003c/div\u003e
    
    \u003cdiv class="wp-block-image has-jankx-responsive-dimensions has-jankx-flex-order" 
         style="--jankx-flex-order-desktop: 2; --jankx-flex-order-mobile: 1;"\u003e
        \u003cimg src="image2.jpg" alt="Image 2"\u003e
    \u003c/div\u003e
    
    \u003cdiv class="wp-block-image has-jankx-responsive-dimensions has-jankx-flex-order" 
         style="--jankx-flex-order-desktop: 3; --jankx-flex-order-mobile: 2;"\u003e
        \u003cimg src="image3.jpg" alt="Image 3"\u003e
    \u003c/div\u003e
    
\u003c/div\u003e
```

### Expected Behavior:

- **Desktop**: Image 1 → Image 2 → Image 3
- **Mobile**: Image 2 → Image 3 → Image 1

---

## Cách Test trong WordPress

### 1. Tạo Page mới

1. Vào WordPress Admin → Pages → Add New
2. Thêm **Columns Block** (2 columns)
3. Chọn Column đầu tiên
4. Mở **Block Settings** sidebar
5. Tìm **"Jankx Advanced Settings"**
6. Trong **Dimensions** tab, enable **"Flex Order (Responsive)"**

### 2. Thiết lập Flex Order

**Column 1 (Content):**
- Desktop: 1
- Mobile: 2

**Column 2 (Sidebar):**
- Desktop: 2
- Mobile: 1

### 3. Verify trong Editor

- Trong editor, bạn sẽ thấy columns theo thứ tự desktop
- CSS variables sẽ được thêm vào inline style

### 4. Test Frontend

1. Save và Preview page
2. Mở DevTools (F12)
3. Toggle device toolbar (Ctrl+Shift+M)
4. Chuyển giữa Desktop/Tablet/Mobile
5. Verify thứ tự columns thay đổi

### 5. Inspect HTML

Mở DevTools và inspect column, bạn sẽ thấy:

```html
\u003cdiv class="wp-block-column has-jankx-responsive-dimensions has-jankx-flex-order" 
     style="--jankx-flex-order-desktop: 1; --jankx-flex-order-mobile: 2;"\u003e
    ...
\u003c/div\u003e
```

### 6. Verify CSS

Trong DevTools → Elements → Computed, tìm property `order`:

- Desktop: `order: 1`
- Mobile: `order: 2`

---

## Troubleshooting

### ❌ Flex Order không hoạt động?

**Kiểm tra:**

1. ✅ Parent block có `display: flex` hoặc `display: grid`?
2. ✅ Block có class `has-jankx-flex-order`?
3. ✅ CSS variables có trong inline style?
4. ✅ Frontend script `frontend.js` đã được enqueue?

### ❌ CSS không apply?

**Kiểm tra:**

1. Hard refresh browser (Ctrl+Shift+R)
2. Clear WordPress cache
3. Verify `frontend.js` đã load trong DevTools → Network
4. Check Console cho errors

### ❌ Thứ tự không đổi trên mobile?

**Kiểm tra:**

1. Breakpoint đúng chưa? (Mobile < 768px)
2. Parent có `flex-direction: row` hay `column`?
3. Có CSS nào override `order` không?

---

## Debug Commands

### Check if frontend.js loaded:
```javascript
console.log(window.JankxBlocksExtra);
```

### Check if CSS injected:
```javascript
console.log(document.getElementById('jankx-responsive-dimensions-css'));
```

### Get computed order value:
```javascript
const block = document.querySelector('.has-jankx-flex-order');
console.log(window.getComputedStyle(block).order);
```

---

**Happy Testing! 🚀**
