# Swiper Banner & Swiper Slide - Image Size Fullwidth Feature Test

## Tổng quan
Đã thêm option `imageSize` với 3 giá trị:
- `cover` (default): Ảnh phủ toàn bộ area, có thể bị crop
- `contain`: Ảnh fit toàn bộ, không bị crop
- `fullwidth`: Ảnh stretch 100% width và 100% height

## Files đã thay đổi

### Swiper Banner Block
1. `block.json` - Thêm attribute `imageSize`
2. `types.ts` - Thêm `imageSize` vào interface
3. `edit.tsx` - Thêm SelectControl trong InspectorControls
4. `save.tsx` - Lưu `imageSize` và apply styles
5. `index.tsx` - Update deprecated version
6. `style.scss` - Thêm CSS cho fullwidth
7. `editor.scss` - Thêm CSS cho editor
8. `SwiperBannerBlock.php` - Update PHP render để xử lý fullwidth

### Swiper Slide Block
1. `block.json` - Thêm attribute `imageSize`
2. `types.ts` - Thêm `imageSize` vào interface
3. `edit.tsx` - Thêm SelectControl trong InspectorControls
4. `index.tsx` - Update save function để lưu `imageSize`
5. `style.scss` - Thêm CSS cho fullwidth
6. `editor.scss` - Thêm CSS cho editor
7. `SwiperSlideBlock.php` - Update PHP render để xử lý fullwidth

## Test Flow

### 1. Build Blocks
```bash
cd wp-content/themes/jankx
npm run build
```

### 2. Test Swiper Banner
1. Mở Gutenberg editor
2. Thêm block `jankx/swiper`
3. Thêm block `jankx/swiper-banner` vào trong swiper
4. Chọn image
5. Vào Settings sidebar → Image Settings
6. Chọn "Image Size" → "Fullwidth"
7. Kiểm tra preview trong editor
8. Save và kiểm tra frontend

### 3. Test Swiper Slide
1. Thêm block `jankx/swiper-slide` vào trong swiper
2. Thêm background image (sử dụng block supports)
3. Vào Settings sidebar → Image Settings
4. Chọn "Background Image Size" → "Fullwidth"
5. Kiểm tra preview trong editor
6. Save và kiểm tra frontend

### 4. Test các giá trị khác
- Test `cover`: Ảnh phủ toàn bộ, có thể bị crop
- Test `contain`: Ảnh fit toàn bộ, không bị crop
- Test `fullwidth`: Ảnh stretch 100% width và height

## Expected Results

### Swiper Banner
- Editor preview hiển thị đúng image size đã chọn
- Frontend render đúng với PHP render_callback
- CSS classes được apply: `image-size-cover`, `image-size-contain`, `image-size-fullwidth`
- Inline styles được apply đúng cho fullwidth: `background-size: 100% 100%`

### Swiper Slide
- Editor preview hiển thị đúng background image size
- Frontend render đúng với PHP render_callback
- CSS classes được apply trên wrapper
- Background image size được override đúng

## CSS Classes Applied

### Swiper Banner
- Wrapper: `.image-size-{value}`
- Image: `.swiper-banner__image.image-size-{value}`

### Swiper Slide
- Wrapper: `.swiper-slide.image-size-{value}`

## Notes
- Fullwidth sẽ stretch ảnh để fill 100% width và height, có thể làm ảnh bị méo
- Cover là default và phù hợp cho hầu hết trường hợp
- Contain phù hợp khi muốn hiển thị toàn bộ ảnh không bị crop

