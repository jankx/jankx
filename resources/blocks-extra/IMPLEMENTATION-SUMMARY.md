# Jankx Advanced Settings - Flex Order Implementation Summary

## Tổng quan thay đổi

Đã thêm thành công tính năng **Flex Order (Responsive)** vào **Jankx Advanced Settings** panel trong Gutenberg Block Editor.

## Files đã thay đổi

### 1. `resources/blocks-extra/ts/editor.ts`

#### a) Attributes (Dòng 224-226)
```typescript
jankxFlexOrderDesktop: { type: 'number' },
jankxFlexOrderTablet: { type: 'number' },
jankxFlexOrderMobile: { type: 'number' },
```

#### b) Controls Panel (Dòng 350-395)
- Thêm `ToolsPanelItem` cho Flex Order
- Device switcher: Desktop 🖥️ / Tablet 📱 / Mobile 📱
- RangeControl với giá trị từ -10 đến 20
- `isShownByDefault: false` - không hiển thị mặc định

#### c) Save Props (Dòng 406-433)
```typescript
const hasFlexOrder = [
  attributes.jankxFlexOrderDesktop, 
  attributes.jankxFlexOrderTablet, 
  attributes.jankxFlexOrderMobile
].some((v: any) => typeof v === 'number');

// Thêm class
+ (hasFlexOrder && !/\bhas-jankx-flex-order\b/.test(props.className || '') 
    ? ' has-jankx-flex-order' 
    : '');

// Thêm CSS variables
if (typeof attributes.jankxFlexOrderDesktop === 'number') 
  style['--jankx-flex-order-desktop'] = attributes.jankxFlexOrderDesktop;
if (typeof attributes.jankxFlexOrderTablet === 'number')  
  style['--jankx-flex-order-tablet']  = attributes.jankxFlexOrderTablet;
if (typeof attributes.jankxFlexOrderMobile === 'number')  
  style['--jankx-flex-order-mobile']  = attributes.jankxFlexOrderMobile;
```

#### d) Injected CSS (Dòng 447-481)
```css
.has-jankx-responsive-dimensions.has-jankx-flex-order {
    order: var(--jankx-flex-order-desktop, initial);
}

@media (max-width: 1024px) {
    .has-jankx-responsive-dimensions.has-jankx-flex-order {
        order: var(--jankx-flex-order-tablet, var(--jankx-flex-order-desktop, initial));
    }
}

@media (max-width: 768px) {
    .has-jankx-responsive-dimensions.has-jankx-flex-order {
        order: var(--jankx-flex-order-mobile, var(--jankx-flex-order-tablet, var(--jankx-flex-order-desktop, initial)));
    }
}
```

### 2. `resources/blocks-extra/build/editor.js` (Auto-generated)
- File đã được build thành công từ TypeScript
- Kích thước: 20,013 bytes
- Đã verify code đã được compile đúng

### 3. `resources/blocks-extra/FLEX-ORDER-README.md` (New)
- File hướng dẫn sử dụng chi tiết
- Bao gồm ví dụ thực tế
- Giải thích breakpoints và CSS variables

## Cách sử dụng

### Trong Gutenberg Editor:

1. Chọn bất kỳ block nào
2. Mở **Block Settings** sidebar (bên phải)
3. Tìm panel **"Jankx Advanced Settings"**
4. Trong tab **Dimensions**, tìm **"Flex Order (Responsive)"**
5. Click để enable
6. Chọn device (Desktop/Tablet/Mobile)
7. Kéo slider để set giá trị (-10 đến 20)

### Output HTML:

```html
<div class="has-jankx-responsive-dimensions has-jankx-flex-order" 
     style="--jankx-flex-order-desktop: 2; --jankx-flex-order-mobile: 1;">
  <!-- Block content -->
</div>
```

## Breakpoints

- **Desktop**: Default (> 1024px)
- **Tablet**: `@media (max-width: 1024px)` - Fallback to Desktop
- **Mobile**: `@media (max-width: 768px)` - Fallback to Tablet → Desktop

## Tính năng

✅ Responsive với 3 breakpoints  
✅ Giá trị từ -10 đến 20  
✅ Auto-inject CSS  
✅ Fallback cascade (Mobile → Tablet → Desktop)  
✅ Chỉ hoạt động với flex/grid containers  
✅ Không hiển thị mặc định (opt-in)  

## Testing

### Build command:
```bash
cd resources
npm run build
```

### Verify:
1. ✅ TypeScript compiled successfully
2. ✅ No compilation errors
3. ✅ editor.js generated (20KB)
4. ✅ All attributes present in compiled code
5. ✅ CSS injection working

## Lưu ý

⚠️ **Quan trọng:**
- Flex Order chỉ có tác dụng khi parent block có `display: flex` hoặc `display: grid`
- Nếu parent không phải flex/grid container, CSS `order` sẽ không có hiệu lực

💡 **Tips:**
- Giá trị càng nhỏ → block hiển thị càng sớm
- Giá trị mặc định = 0 (nếu không set)
- Có thể dùng giá trị âm để ưu tiên cao nhất

## Next Steps

1. ✅ Code đã hoàn thành
2. ✅ Build thành công
3. ✅ Documentation đã tạo
4. ✅ **Frontend CSS đã được apply** (frontend.js: 13.7KB)
5. 🔄 Cần test trong WordPress admin
6. 🔄 Cần test responsive trên các devices

## Frontend Implementation

### Files Updated:
- ✅ `resources/blocks-extra/ts/frontend.ts` - Thêm flex order CSS
- ✅ `resources/blocks-extra/build/frontend.js` - Auto-generated (13.7KB)

### Frontend CSS Location:
```javascript
// File: frontend.js (Lines 398-429)
.has-jankx-responsive-dimensions.has-jankx-flex-order {
    order: var(--jankx-flex-order-desktop, initial);
}

@media (max-width: 1024px) {
    .has-jankx-responsive-dimensions.has-jankx-flex-order {
        order: var(--jankx-flex-order-tablet, var(--jankx-flex-order-desktop, initial));
    }
}

@media (max-width: 768px) {
    .has-jankx-responsive-dimensions.has-jankx-flex-order {
        order: var(--jankx-flex-order-mobile, var(--jankx-flex-order-tablet, var(--jankx-flex-order-desktop, initial)));
    }
}
```

### How It Works:

1. **Editor** (`editor.js`):
   - User sets flex order values in Gutenberg
   - Attributes saved: `jankxFlexOrderDesktop/Tablet/Mobile`
   - CSS variables added to block: `--jankx-flex-order-*`
   - Class added: `has-jankx-flex-order`

2. **Frontend** (`frontend.js`):
   - CSS injected on page load via `injectResponsiveDimensionsCSS()`
   - Reads CSS variables from block's inline styles
   - Applies `order` property responsively
   - Works automatically - no manual intervention needed

## Compatibility

- WordPress: 6.0+
- Gutenberg: Latest
- Jankx Theme: 2.0.0+
- Browsers: Modern browsers hỗ trợ CSS Grid/Flexbox

---

**Ngày tạo**: 2026-01-12  
**Version**: 1.0.0  
**Author**: Puleeno Nguyen
