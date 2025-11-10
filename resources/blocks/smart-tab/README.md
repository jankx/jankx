# Smart Tab Block

Block đại diện cho một tab đơn lẻ trong Smart Tabs container. Block này **chỉ có thể được sử dụng bên trong Smart Tabs block**.

## Tính năng

- ✅ Kiến trúc **Trigger** linh hoạt – tab có thể tự động thay đổi tiêu đề / nội dung dựa trên trigger (ví dụ: đánh giá sản phẩm).
- ✅ Triggers có thể đăng ký từ plugin / package bên ngoài thông qua PHP class.
- ✅ Hỗ trợ icon với nhiều tùy chọn (SVG code, Icon Picker).
- ✅ Chấp nhận mọi loại inner blocks (khi trigger cho phép).
- ✅ Tùy chỉnh icon position, size, color.
- ✅ Đồng bộ với Smart Tabs parent block và cung cấp dữ liệu JSON cho editor.
- ✅ Click-to-edit và xem preview trực tiếp trong editor.

## Không thể sử dụng độc lập

Smart Tab block **phải** nằm bên trong Smart Tabs block. Nếu cố gắng thêm Smart Tab ở nơi khác, block sẽ không hoạt động đúng.

## Trigger Overview

Tab trigger là “bộ điều khiển” xác định:

- Tiêu đề tab (hiển thị ở navigation).
- Nội dung tab (có thể override nội dung render).
- Khả năng cho phép/khóa việc chỉnh tay title, content, icon.
- Các thiết lập bổ sung thông qua `triggerSettings`.

### Trigger mặc định

- **Manual (custom content)**: Cho phép nhập title/icon/content thủ công như trước đây.

### Trigger từ WooCommerce (ví dụ)

- **Product Reviews** (`product-reviews`): hiển thị template đánh giá sản phẩm và tự động đổi title thành `Reviews (count)`.

Các trigger này được khai báo trong package `vendor/jankx/woocommerce`.

## Attributes

```typescript
{
  title: string;                    // Tiêu đề tab (nếu trigger cho phép)
  trigger: string;                  // Mã trigger, ví dụ 'manual', 'product-reviews'
  triggerSettings: Record<string, any>; // Dữ liệu cấu hình riêng cho trigger
  iconType: 'none' | 'svg' | 'picker';
  icon: string;                     // SVG code / HTML icon
  iconName: string;                 // Tên icon khi dùng picker
  iconSet: string;                  // Bộ icon (material, tabler, ...)
  iconPosition: 'before' | 'after';
  iconSize: string;                 // e.g., '16px'
  iconColor: string;                // Màu icon (hex)
  tabId?: string;                   // ID tùy chọn
  normalTabTextColor?: string;
  normalTabBackgroundColor?: string;
  normalTabGradient?: string;
  activeTabTextColor?: string;
  activeTabBackgroundColor?: string;
  activeTabGradient?: string;
  contentTextColor?: string;
  contentBackgroundColor?: string;
  contentGradient?: string;
  style?: any;
}
```

## Trigger Settings trong Editor

- **Trigger**: Cho phép chọn trigger đã được đăng ký thông qua PHP (dữ liệu lấy từ `window.JankxSmartTabTriggers`).
- **Tab Title**: Chỉ bật nếu trigger hỗ trợ `customTitle`. Nếu trigger quản lý tiêu đề, field này bị disable và hiển thị preview.
- **Icon Settings**: Chỉ bật nếu trigger hỗ trợ icon (`supports.icon !== false`).
- **Content Area**: Nếu trigger không cho phép chỉnh content (`supports.customContent === false`) thì khu vực nội dung bị khóa và hiển thị mô tả trigger.

## Register Trigger bằng PHP

```php
use Jankx\Gutenberg\SmartTabs\SmartTabTriggerRegistry;
use MyPlugin\SmartTabs\MyCustomTrigger;

add_action('jankx/smart-tabs/register-triggers', function (SmartTabTriggerRegistry $registry) {
    $registry->registerTrigger(new MyCustomTrigger());
});
```

### Tạo trigger mới

```php
use Jankx\Gutenberg\SmartTabs\AbstractSmartTabTrigger;

class MyCustomTrigger extends AbstractSmartTabTrigger {
    public function getKey(): string {
        return 'my-custom-trigger';
    }

    public function getLabel(): string {
        return __('My Trigger', 'text-domain');
    }

    public function getDescription(): string {
        return __('Description hiển thị trong editor.', 'text-domain');
    }

    public function isAvailable(array $context = []): bool {
        // Có thể kiểm tra context (post type, is_admin, ...)
        return true;
    }

    public function getEditorSettings(array $context = []): array {
        $settings = parent::getEditorSettings($context);
        $settings['supports'] = [
            'customTitle' => false,
            'customContent' => true,
            'icon' => true,
        ];
        $settings['settingsSchema'] = [
            // Khai báo schema nếu muốn render form trong editor (JS handle)
        ];
        return $settings;
    }

    public function resolveTitle(array $attributes, array $context = []): string {
        $postId = $context['post_id'] ?? 0;
        return sprintf(__('My Tab #%d', 'text-domain'), $postId);
    }

    public function filterContent(string $content, array $attributes, array $context = []): string {
        return '<p>'.esc_html__('Dynamic content here...', 'text-domain').'</p>';
    }
}
```

Các trigger có thể ghi đè:
- `prepareAttributes()` – chuẩn hóa dữ liệu trước khi render.
- `resolveTitle()` – set tiêu đề hiển thị.
- `filterContent()` – trả về HTML nội dung tab (bỏ qua inner blocks nếu cần).
- `getEditorSettings()` – cung cấp thông tin cho Gutenberg editor (label, description, supports, schema...).

## Context cung cấp cho trigger

Trong PHP, trigger nhận context gồm:
- `post_id`: ID bài viết hiện tại (0 nếu chưa có).
- `post_type`: post type của bài viết.
- `is_admin`: đang ở editor / admin hay frontend.
- `tab_index`: index của tab trong Smart Tabs.
- `tab_attributes`: attributes của tab trước khi trigger xử lý.
- `parent_attributes`: attributes của Smart Tabs parent.

## Giao diện JS (Editor)

`window.JankxSmartTabTriggers.items` được inject khi vào editor, có cấu trúc:

```json
{
  "manual": {
    "key": "manual",
    "label": "Custom Content",
    "description": "...",
    "previewTitle": "Tab",
    "supports": {
      "customTitle": true,
      "customContent": true,
      "icon": true
    },
    "settingsSchema": []
  },
  "product-reviews": {
    "key": "product-reviews",
    "label": "Product Reviews",
    "description": "Display WooCommerce reviews...",
    "previewTitle": "Reviews (12)",
    "supports": {
      "customTitle": false,
      "customContent": false,
      "icon": true
    }
  }
}
```

Bạn có thể render form tương ứng với `settingsSchema` trong editor (hiện tại block chưa xử lý schema động – có thể mở rộng trong tương lai).

## Flow render

1. Smart Tabs boot `SmartTabTriggerRegistry`, smart-tab block nhận trigger tương ứng.
2. Trong editor, JS đọc cấu hình trigger và disable các trường phù hợp.
3. Khi render frontend:
   - SmartTabBlock gọi `$trigger->prepareAttributes()` và `$trigger->filterContent()`.
   - SmartTabsBlock gọi `$trigger->resolveTitle()` để render navigation.
4. Triggers có thể inject dữ liệu via `data-trigger` và `data-trigger-settings`.

## Ví dụ cấu trúc nội dung

```
Smart Tabs
├─ Smart Tab: Trigger = manual
│  ├─ Paragraph: "Nội dung tuỳ chỉnh"
├─ Smart Tab: Trigger = product-reviews
│  └─ (Trigger tự render reviews, content trong editor bị khoá)
```

## Ví dụ

```
Smart Tabs
├─ Smart Tab: "Overview" (icon: dashboard)
│  ├─ Heading: "Welcome"
│  ├─ Paragraph: "Description..."
│  └─ Image
└─ Smart Tab: "Details" (icon: info)
   ├─ Columns
   │  ├─ Column: Content 1
   │  └─ Column: Content 2
   └─ Button
```

## Parent Context

Smart Tab nhận context từ Smart Tabs:
- `jankx/smartTabsId`: ID của parent tabs
- `jankx/activeTab`: Index của tab đang active

## Frontend Behavior

- Tab content chỉ hiển thị khi tab active
- Smooth animation khi switch tabs
- Hidden tabs không render (display: none)

## See Also

- [Smart Tabs README](../smart-tabs/README.md)

