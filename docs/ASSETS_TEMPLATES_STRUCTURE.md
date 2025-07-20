# Cấu trúc Assets & Views - Hướng dẫn Copy

## Mục tiêu
Đảm bảo cấu trúc `assets/` và `views/` rõ ràng để copy dễ dàng giữa các package mà không gặp vấn đề. Sử dụng `views/` thay vì `templates/` để tránh xung đột với Gutenberg templates.

## Cấu trúc Assets chuẩn

```
assets/
├── css/
│   ├── main.css              # CSS chính của theme
│   ├── admin.css             # CSS cho admin
│   └── woocommerce.css       # CSS cho WooCommerce
├── js/
│   ├── app.js                # JavaScript chính
│   ├── admin.js              # JS cho admin
│   └── vendor/               # Thư viện bên thứ 3
│       ├── jquery.min.js
│       └── bootstrap.min.js
├── img/
│   ├── logo.svg              # Logo theme
│   ├── placeholder.jpg       # Ảnh placeholder
│   └── icons/                # Icons
│       ├── menu.svg
│       └── search.svg
├── fonts/
│   ├── fontawesome/          # Font Awesome
│   └── custom-fonts/         # Font tùy chỉnh
└── vendor/                   # Thư viện bên thứ 3
    ├── bootstrap/
    └── jquery/
```

## Cấu trúc Views chuẩn

```
views/
├── blocks/                   # Gutenberg blocks
│   ├── header/
│   ├── hero/
│   ├── featured-categories/
│   ├── deals/
│   ├── popular-books/
│   ├── testimonials/
│   ├── newsletter/
│   └── footer/
├── parts/                    # Template parts
│   ├── header.php
│   ├── footer.php
│   ├── sidebar.php
│   └── navigation.php
├── single/                   # Single post templates
│   ├── book.php
│   ├── author.php
│   └── category.php
├── archive/                  # Archive templates
│   ├── books.php
│   ├── authors.php
│   └── categories.php
└── woocommerce/              # WooCommerce templates
    ├── single-product.php
    ├── archive-product.php
    └── cart.php
```

## Quy tắc đặt tên file

### CSS Files
- `main.css` - CSS chính
- `admin.css` - CSS admin
- `woocommerce.css` - CSS WooCommerce
- `responsive.css` - CSS responsive

### JavaScript Files
- `app.js` - JS chính
- `admin.js` - JS admin
- `vendor.js` - JS thư viện

### View Files
- `header.php` - Header template
- `footer.php` - Footer template
- `sidebar.php` - Sidebar template
- `single-book.php` - Single book template

## Quy tắc Copy Package

### 1. Assets
```bash
# Copy toàn bộ assets
cp -r source-theme/assets/* target-theme/assets/

# Copy từng phần
cp -r source-theme/assets/css/* target-theme/assets/css/
cp -r source-theme/assets/js/* target-theme/assets/js/
cp -r source-theme/assets/img/* target-theme/assets/img/
```

### 2. Views
```bash
# Copy toàn bộ views
cp -r source-theme/views/* target-theme/views/

# Copy từng phần
cp -r source-theme/views/blocks/* target-theme/views/blocks/
cp -r source-theme/views/parts/* target-theme/views/parts/
```

## Checklist Copy

### Trước khi copy
- [ ] Kiểm tra cấu trúc thư mục đích
- [ ] Backup theme đích
- [ ] Kiểm tra conflicts về tên file

### Sau khi copy
- [ ] Kiểm tra đường dẫn trong code
- [ ] Test load assets
- [ ] Test views
- [ ] Kiểm tra responsive

## Lưu ý quan trọng

1. **Không copy file config** - Chỉ copy assets và views
2. **Giữ nguyên cấu trúc** - Không thay đổi tên thư mục
3. **Test ngay** - Test sau khi copy
4. **Backup** - Luôn backup trước khi copy

## Script Copy tự động

```bash
#!/bin/bash
# copy-assets-views.sh

SOURCE_THEME=$1
TARGET_THEME=$2

if [ -z "$SOURCE_THEME" ] || [ -z "$TARGET_THEME" ]; then
    echo "Usage: ./copy-assets-views.sh source-theme target-theme"
    exit 1
fi

# Backup target theme
cp -r $TARGET_THEME $TARGET_THEME.backup

# Copy assets
cp -r $SOURCE_THEME/assets/* $TARGET_THEME/assets/

# Copy views
cp -r $SOURCE_THEME/views/* $TARGET_THEME/views/

echo "Copy completed!"
echo "Please test the theme now."
```

## Troubleshooting

### Lỗi thường gặp
1. **File không tồn tại** - Kiểm tra đường dẫn
2. **Permission denied** - Kiểm tra quyền thư mục
3. **CSS/JS không load** - Kiểm tra enqueue trong functions.php
4. **View không hiển thị** - Kiểm tra template hierarchy

### Giải pháp
1. **Chạy script với sudo** nếu cần
2. **Kiểm tra file permissions**
3. **Clear cache** sau khi copy
4. **Test từng phần** thay vì toàn bộ