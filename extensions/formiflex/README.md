# Formiflex Extension

## Mô tả

Formiflex là extension form builder cho Jankx theme, được clone từ plugin Formello gốc. Extension này cung cấp khả năng tạo form liên hệ một cách dễ dàng thông qua Gutenberg editor.

## Tính năng

- Form validation (cả frontend và backend)
- ReCaptcha protection (v2 và v3 invisible)
- hCaptcha protection (checkbox và invisible)
- Lưu trữ submissions: xem tất cả form đã submit
- Email notification: nhận thông báo khi có form submit
- Ẩn form hoặc redirect sau khi submit thành công
- Tùy chỉnh form: sắp xếp field, hiển thị stacked field hoặc trong hàng với label bên cạnh
- Thay đổi màu button và chọn loading icon
- Form Library: chọn từ các form có sẵn

## Các loại input được hỗ trợ

- Text
- Email
- Tel
- Url
- Hidden
- Checkbox
- Radio
- Date
- Advanced date (multiple, range)
- Time
- Textarea
- Richtext editor
- Number
- Range
- Color

## Cấu trúc Extension

```
extensions/formiflex/
├── manifest.json          # Cấu hình extension
├── formello.php          # File chính của plugin gốc
├── includes/             # PHP classes
├── assets/               # CSS, JS, images
├── build/                # Build files
├── vendor/               # Dependencies
└── readme.txt            # Documentation gốc
```

## Cách sử dụng

1. Extension sẽ tự động được load bởi Jankx theme framework
2. Sử dụng các Gutenberg blocks để tạo form
3. Cấu hình form trong admin panel
4. Xem submissions trong admin

## Lưu ý

- Extension này là bản clone hoàn toàn từ plugin Formello gốc
- Không có chỉnh sửa nào so với code gốc
- Hoạt động giống hệt plugin gốc
- Tích hợp vào hệ thống extension của Jankx theme
