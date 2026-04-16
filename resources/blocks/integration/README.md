# Gutenberg Controls Integration

Kết nối `jankx/gutenberg-controls` với các blocks hiện có trong `resources/blocks`.

## 📁 Files

```
integration/
├── gutenberg-controls-integration.php  # PHP Integration class
├── jankx-blocks-bridge.js             # JavaScript bridge
├── loader.php                          # Main loader
└── README.md                          # This file
```

## 🚀 Usage

### 1. Include trong theme

Thêm vào `functions.php`:

```php
require_once get_template_directory() . '/resources/blocks/integration/loader.php';
```

### 2. Blocks hỗ trợ tự động

Các blocks sau sẽ tự động có enhanced controls:

- `jankx/advanced-button`
- `jankx/advanced-image-box`
- `jankx/section`
- `jankx/divider`
- `jankx/modal`
- `jankx/slideshow`
- `jankx/sticky-box`
- `jankx/wrapper`
- `jankx/swiper`

### 3. Controls được thêm

#### For `jankx/advanced-button`:
- **Color** - Button colors, gradient support
- **Typography** - Button text styling, fluid sizing
- **Spacing** - Padding/margin with visual controls
- **Shadow** - Box shadow presets

#### For `jankx/wrapper`:
- **Color** - Background with gradient/duotone
- **Typography** - Font family, fluid sizing
- **Spacing** - Visual spacing controls
- **Shadow** - Box shadows
- **Border** - Border radius, style
- **Responsive** - Device visibility

## 🎯 API Functions

### Enable controls cho block

```php
jankx_enable_block_controls('jankx/my-block', [
    'color' => [
        'type' => 'jankx/color',
        'label' => __('Background', 'jankx'),
        'allowGradient' => true,
        'allowDuotone' => true,
    ],
    'typography' => [
        'type' => 'jankx/typography',
        'label' => __('Text Style', 'jankx'),
        'allowFluid' => true,
    ],
]);
```

### Register preset cho block

```php
jankx_register_block_preset('jankx/advanced-button', [
    'id' => 'my-preset',
    'title' => __('My Button Style', 'jankx'),
    'category' => 'buttons',
    'controls' => [
        'color' => [
            'colorType' => 'solid',
            'solidColor' => '#ff5722',
        ],
        'typography' => [
            'fontWeight' => '600',
        ],
    ],
]);
```

### Check integration active

```php
if (jankx_blocks_integration_active()) {
    // Integration is ready
}
```

## 🔧 Available Controls

| Control | Type | Features |
|---------|------|----------|
| Color | `jankx/color` | Solid, gradient, duotone, alpha, theme colors |
| Typography | `jankx/typography` | Font library, fluid sizing, responsive |
| Spacing | `jankx/visual-spacing` | Visual drag handles, margin/padding |
| Responsive | `jankx/responsive` | Device visibility, breakpoints |
| Shadow | `jankx/shadow` | Presets, custom shadows |
| Animation | `jankx/animation` | Scroll animations, effects |
| Icon | `jankx/icon-picker` | Icon library, search, favorites |

## 🎨 CSS Output

Controls tự động generate CSS cho frontend:

```php
// Example output
<div class="wp-block-jankx-advanced-button" style="
    background: linear-gradient(135deg, #ff5722 0%, #009688 100%);
    font-family: 'Inter', sans-serif;
    font-size: clamp(16px, 2vw + 1rem, 20px);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    padding: 12px 24px;
">
```

## 🔄 Operating Mechanism (Cơ chế vận hành)

Hệ thống integration hoạt động dựa trên 4 giai đoạn chính:

### 1. Khởi tạo & Đồng bộ (PHP Side)
- **Loader**: `loader.php` kiểm tra môi trường và nạp các class cần thiết.
- **Localization**: Chuyển cấu hình từ các hàm PHP như `jankx_enable_block_controls` sang JavaScript thông qua biến toàn cục `jankxBlocksConfig`.
- **Enqueuing**: Nạp file `jankx-blocks-bridge.js` vào editor với các dependency từ package core.

### 2. Mở rộng Block Schema (JS Bridge)
- **Attribute Injection**: Sử dụng filter `blocks.registerBlockType` để tiêm thêm attribute `jankxControls` vào schema của các block.
- **HOC Wrapper**: Sử dụng `createHigherOrderComponent` để bao bọc component `Edit` của block, cho phép can thiệp vào UI mà không cần sửa code gốc của từng block.

### 3. Hiển thị & Tương tác (Editor UI/Gutenberg Internals)
- **Attribute Persistence**: Dữ liệu được lưu trực tiếp vào DB thông qua attribute `jankxControls` (dưới dạng JSON comment trong `post_content`).
- **Sidebar Expansion**: Bridge sử dụng filter `editor.BlockEdit` để bao bọc (wrap) component edit của block, từ đó chèn thêm các component như `ColorControl`, `TypographyControl` vào thanh Sidebar của WordPress.
- **Control Mapping**: Ánh xạ các type như `jankx/color` tới các component React chuyên dụng từ thư viện core.

### 4. Hệ thống Live Preview & Frontend Render
- **Editor Live Preview (React Logic)**: HOC `withLivePreview` sử dụng `useEffect` để tính toán và inject trực tiếp các **CSS Variables** vào DOM element của block trong trình soạn thảo. Điều này giúp người dùng thấy thay đổi ngay lập tức mà không cần lưu bài viết hay render lại PHP.
- **Frontend Output (PHP Logic)**: Khi trang web được tải, phía PHP sẽ parse attribute `jankxControls` và tạo ra mã CSS tương ứng để render ra giao diện người dùng cuối.

## 🔌 Architecture

```
┌─────────────────────────────────────────┐
│  resources/blocks/                      │
│  ├── advanced-button/                   │
│  │   ├── block.json                      │
│  │   ├── edit.tsx                        │
│  │   └── ...                             │
│  └── integration/                         │
│      ├── loader.php       ← Include this │
│      ├── gutenberg-controls-integration.php
│      └── jankx-blocks-bridge.js
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  vendor/jankx/gutenberg-controls/         │
│  ├── src/Controls/                        │
│  │   ├── ColorControl.php                 │
│  │   ├── TypographyControl.php            │
│  │   └── ...                              │
│  ├── assets/src/                          │
│  │   ├── controls/                         │
│  │   │   ├── ColorControl.js               │
│  │   │   └── TypographyControl.js          │
│  │   └── editor.js                         │
│  └── Presets/PresetManager.php            │
└─────────────────────────────────────────┘
```

## ✅ Features

### Editor
- ✅ Live preview - Changes apply instantly
- ✅ Undo/Redo for presets
- ✅ Custom presets - Save user designs
- ✅ Template library - Import/export blocks

### Frontend
- ✅ CSS generation from controls
- ✅ Responsive styles
- ✅ Animation keyframes
- ✅ CSS variables

## 🧪 Testing

```bash
# Run PHPUnit tests
cd vendor/jankx/gutenberg-controls
./vendor/bin/phpunit

# Build JS assets
npm install
npm run build
```

## 📝 Example

```php
// In your theme functions.php
require_once get_template_directory() . '/resources/blocks/integration/loader.php';

// Add custom controls to existing block
add_action('after_setup_theme', function () {
    jankx_enable_block_controls('jankx/advanced-button', [
        'customColor' => [
            'type' => 'jankx/color',
            'label' => __('Custom Background', 'jankx'),
            'allowGradient' => true,
            'allowAlpha' => true,
        ],
    ]);
}, 20);
```

**Integration sẵn sàng sử dụng!** 🚀
