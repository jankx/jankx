# Content Templates

Thư mục này chứa các template HTML mặc định cho các post types. Khi tạo một post mới thuộc một post type, hệ thống sẽ tự động load nội dung từ file template tương ứng.

## Cách sử dụng

### 1. Tạo file template

Tạo file HTML với tên theo format: `<post-type-name>.html`

**Ví dụ:**
- `tour.html` - Template cho post type "tour"
- `product.html` - Template cho post type "product"
- `event.html` - Template cho post type "event"

### 2. Nội dung template

File template sử dụng cú pháp **Block Editor (Gutenberg)** của WordPress:

```html
<!-- wp:paragraph -->
<p>Nội dung mẫu của bạn</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Tiêu đề</h2>
<!-- /wp:heading -->
```

### 3. Thứ tự ưu tiên

Hệ thống sẽ tìm kiếm template theo thứ tự sau:

1. **Child Theme** (Ưu tiên cao nhất): `wp-content/themes/buocchandisan/resources/content-templates/<post-type>.html`
2. **Parent Theme**: `wp-content/themes/jankx/resources/content-templates/<post-type>.html`

### 4. Hoạt động

- Template chỉ được load **1 lần duy nhất** khi mở trang tạo post mới (auto-draft status)
- Nếu post đã có nội dung, template sẽ không ghi đè
- Hệ thống sử dụng:
  - **Block Editor (Gutenberg)**: REST API filter `rest_prepare_{post_type}`
  - **Classic Editor**: Filter `default_content`
- Template không tự động save, chỉ hiển thị trong editor cho user chỉnh sửa

## Ví dụ thực tế

### File: `tour.html`

```html
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
    <!-- wp:heading -->
    <h2 class="wp-block-heading">Giới thiệu Tour</h2>
    <!-- /wp:heading -->

    <!-- wp:paragraph -->
    <p>Mô tả tour của bạn...</p>
    <!-- /wp:paragraph -->

    <!-- wp:columns -->
    <div class="wp-block-columns">
        <!-- wp:column -->
        <div class="wp-block-column">
            <!-- wp:post-featured-image /-->
        </div>
        <!-- /wp:column -->
    </div>
    <!-- /wp:columns -->
</div>
<!-- /wp:group -->
```

## Lưu ý

- Template phải là HTML hợp lệ theo chuẩn Block Editor
- Sử dụng các block có sẵn trong WordPress hoặc custom blocks đã đăng ký
- Child theme có quyền override template từ parent theme
- File template không bắt buộc phải tồn tại cho tất cả post types

## Hỗ trợ kỹ thuật

Feature này được quản lý bởi `ContentTemplateServiceProvider` trong `features/content-templates/`

Service class: `Jankx\Features\ContentTemplates\Services\ContentTemplateService`

