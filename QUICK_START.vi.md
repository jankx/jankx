# Jankx Quick Start Guide (Dành cho WP Developer)

Chào mừng bạn đến với Jankx! Nếu bạn đã quen với cách làm theme WordPress truyền thống, hướng dẫn này sẽ giúp bạn "nhập môn" Jankx chỉ trong 5 phút.

## 1. Cấu trúc thư mục "Cần Biết"
Thay vì bỏ mọi thứ vào `functions.php`, hãy chú ý:
- `app/`: Nơi bạn viết logic cho theme (tương đương functions.php nhưng sạch hơn).
- `resources/views/`: Nơi chứa file template `.latte` (thay cho file `.php` thông thường).
- `extensions/`: Nơi chứa các tính năng mở rộng.

## 2. Các hàm "Thần thánh" (Global Helpers)
Đừng bận tâm về Container hay Service Provider lúc mới bắt đầu. Hãy dùng các hàm này:

| Việc cần làm | Hàm trong Jankx | Thay thế cho WP |
| :--- | :--- | :--- |
| Lấy Option | `jankx_get_option($id, $default)` | `get_option()` / `get_theme_mod()` |
| Render Template | `jankx_render($template, $data)` | `get_template_part()` |
| Lấy App Instance | `jankx_app()` | (Global state) |
| Lấy URL Asset | `jankx_asset_url($path)` | `get_template_directory_uri()` |

## 3. Cách tạo một trang đơn giản (Template)
Thay vì file `page-contact.php`, bạn tạo:
1. File logic trong `app/Http/Controllers/ContactController.php` (Tùy chọn).
2. File giao diện trong `resources/views/contact.latte`.

**Ví dụ trong file `.latte`:**
```html
{layout "@layouts/main.latte"}

{block content}
    <h1>{$post->post_title}</h1>
    <div class="content">
        {$post->post_content|noescape}
    </div>
{/block}
```
*Lưu ý: Latte tự động bảo mật dữ liệu, dùng `|noescape` khi muốn in HTML.*

## 4. Hook vào hệ thống
Jankx vẫn tôn trọng các hook của WordPress. Bạn vẫn dùng `add_action()` và `add_filter()` bình thường trong `app/Providers/ThemeServiceProvider.php`.

## 5. Dùng CLI để tiết kiệm thời gian
Mở terminal và gõ:
- `php jankx demo:import`: Nhập dữ liệu mẫu.
- `php jankx cache:clear`: Xóa cache template.

---
**Mẹo nhỏ:** Nếu bạn thấy quá phức tạp, hãy cứ bắt đầu bằng cách viết code vào `functions.php` như cũ. Jankx hoàn toàn tương thích ngược!
