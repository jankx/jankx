# Product Collection Block

Một Gutenberg block đơn giản để hiển thị collection sản phẩm WooCommerce.

## Tính năng

- Hiển thị sản phẩm theo grid layout
- Tùy chỉnh số cột và hàng
- Sắp xếp theo nhiều tiêu chí (date, title, price, popularity, rating)
- Responsive design
- Hỗ trợ alignment (wide, full)

## Cài đặt

1. Đảm bảo WooCommerce đã được cài đặt và kích hoạt
2. Copy file `block.php` vào thư mục theme của bạn
3. Include file trong `functions.php`:

```php
require_once get_template_directory() . '/blocks/product-collection/block.php';
```

## Sử dụng

### Trong Gutenberg Editor

1. Thêm block "Product Collection" từ block inserter
2. Cấu hình các tùy chọn trong sidebar:
   - **Columns**: Số cột hiển thị (1-6)
   - **Rows**: Số hàng hiển thị (1-6)
   - **Order By**: Sắp xếp theo (Date, Title, Price, Popularity, Rating)
   - **Order**: Thứ tự sắp xếp (Ascending/Descending)
   - **Products to Show**: Số sản phẩm hiển thị (1-50)

### Trong Code

```php
echo do_blocks('<!-- wp:cheephub/product-collection {"columns":3,"rows":2,"orderby":"price","order":"ASC","productsToShow":6} /-->');
```

## Cấu trúc Files

```
resources/blocks/product-collection/
├── index.tsx              # React component chính
├── block.php              # PHP registration và render
├── style.scss             # Frontend styling
├── editor.scss            # Editor styling
├── frontend.ts            # Frontend JavaScript
├── product-collection.config.js  # Webpack config
└── build/                 # Built files
    ├── index.js           # Main JavaScript
    ├── index.asset.php    # Dependencies
    ├── style.css          # Frontend CSS
    └── editor.css         # Editor CSS
```

## Troubleshooting

### Lỗi "can't access property getSetting"

Lỗi này xảy ra khi `window.wcSettings` không được khởi tạo. Đảm bảo:

1. WooCommerce đã được cài đặt và kích hoạt
2. Block được đăng ký đúng cách trong WordPress
3. Dependencies được load đúng thứ tự

### Block không hiển thị

1. Kiểm tra console để xem có lỗi JavaScript không
2. Đảm bảo file `block.php` đã được include trong `functions.php`
3. Kiểm tra quyền truy cập file trong thư mục build
