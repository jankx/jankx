# Quick Fix - Modal Block Validation Errors

## Vấn đề

Block validation errors xảy ra vì blocks đã được lưu trước khi update code.

## Giải pháp nhanh

### Option 1: Xóa và tạo lại blocks (Khuyến nghị)

1. **Backup nội dung** của modal và button
2. **Xóa** modal block và button block cũ
3. **Thêm mới** modal block và button block
4. **Paste lại nội dung** đã backup
5. **Save** post

### Option 2: Click "Attempt Block Recovery"

1. Khi thấy validation error, click "Attempt Block Recovery"
2. WordPress sẽ tự động migrate block sang format mới
3. Kiểm tra lại block có hoạt động đúng không
4. Save post

### Option 3: Clear cache và reload

1. **Hard refresh browser**: Ctrl + Shift + R (Windows) / Cmd + Shift + R (Mac)
2. Clear WordPress cache (nếu dùng caching plugin)
3. Reload editor

## Kiểm tra sau khi fix

### Modal Block phải có:

✅ Header màu gradient với Modal ID rõ ràng
✅ Toolbar button (icon 👁️) để toggle preview
✅ Modal content hiển thị để edit
✅ Settings sidebar đầy đủ

### Button Block phải có:

✅ Trigger Type = Modal option
✅ Modal ID input field
✅ Share data options (Object ID, Post Title, URL)

### Frontend phải có:

✅ Modal hiển thị khi click button
✅ Modal đóng khi click overlay hoặc ESC
✅ Console logs (nếu debugMode = true):
- "Modal opened: modal-id"
- "Micromodal initialized"
- "Modal trigger button initialized"

## Troubleshooting

### Không thấy toolbar button?

```
Nguyên nhân: Browser cache hoặc build chưa được load
Giải pháp:
1. Hard refresh: Ctrl + Shift + R
2. Check browser console có errors không
3. Clear browser cache
4. Reload editor
```

### Không thấy Modal ID?

```
Nguyên nhân: Build chưa được apply
Giải pháp:
1. cd C:/Users/puleeno/Projects/buocchandisan.vn/wp-content/themes/jankx/resources
2. npm run build:blocks
3. Hard refresh editor
```

### Modal không mở trên frontend?

```
Nguyên nhân: Modal ID không khớp hoặc Micromodal chưa init
Giải pháp:
1. Mở Console (F12)
2. Check errors
3. Verify Modal ID trong button = Modal ID trong modal block
4. Check có "Micromodal initialized" log không
```

### Block validation error vẫn còn?

```
Nguyên nhân: Block đã được lưu với format cũ
Giải pháp:
1. Click "Attempt Block Recovery"
2. Hoặc xóa block và tạo mới
3. Save lại post
```

## Build Command

```bash
cd C:/Users/puleeno/Projects/buocchandisan.vn/wp-content/themes/jankx/resources
npm run build:blocks
```

Build thành công sẽ show:
```
webpack 5.102.0 compiled successfully in ~20000 ms
```

## Test Checklist

- [ ] Build thành công
- [ ] Hard refresh editor
- [ ] Xóa block cũ
- [ ] Thêm modal block mới
- [ ] Thấy header gradient với Modal ID
- [ ] Thấy toolbar button show/hide
- [ ] Modal content hiển thị
- [ ] Thêm button block mới
- [ ] Chọn trigger type = Modal
- [ ] Nhập Modal ID
- [ ] Save post
- [ ] Test trên frontend
- [ ] Modal mở/đóng OK
- [ ] Check Console logs

