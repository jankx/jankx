# Jankx Fonts System

## Tổng Quan

Jankx Fonts System là một hệ thống quản lý fonts hoàn chỉnh cho Jankx theme, hỗ trợ Google Fonts, Adobe Fonts và Custom Fonts. Hệ thống này tích hợp hoàn toàn với Gutenberg editor và WordPress.

## Tính Năng Chính

- ✅ **Google Fonts**: Tích hợp với Google Fonts API
- ✅ **Adobe Fonts**: Hỗ trợ Adobe Fonts (Typekit)
- ✅ **Custom Fonts**: Upload và quản lý fonts tùy chỉnh
- ✅ **Gutenberg Integration**: Tích hợp hoàn toàn với Gutenberg editor
- ✅ **REST API**: API endpoints để quản lý fonts
- ✅ **Admin Interface**: Giao diện quản lý fonts trong admin
- ✅ **Font Preview**: Xem trước fonts trước khi sử dụng
- ✅ **Performance**: Cache và tối ưu hóa hiệu suất

## Cấu Trúc Hệ Thống

```
jankx/
├── includes/
│   ├── Support/Providers/
│   │   └── FontsServiceProvider.php      # Service Provider
│   ├── Services/
│   │   ├── FontsService.php              # Service chính
│   │   └── Fonts/
│   │       ├── FontManager.php           # Quản lý fonts
│   │       ├── GoogleFontsProvider.php   # Google Fonts
│   │       ├── AdobeFontsProvider.php    # Adobe Fonts
│   │       └── CustomFontsProvider.php   # Custom Fonts
│   └── Facades/
│       └── Fonts.php                     # Fonts Facade
├── assets/
│   └── js/
│       └── gutenberg-fonts.js            # Gutenberg integration
└── docs/
    └── FONTS_SYSTEM.md                   # Documentation này
```

## Cách Sử Dụng

### 1. Sử Dụng Facade (Khuyến Nghị)

```php
use Jankx\Facades\Fonts;

// Đăng ký Google Font
Fonts::google('Roboto', ['300', '400', '700'], ['latin', 'latin-ext']);

// Đăng ký Adobe Font
Fonts::adobe('Adobe Garamond Pro', 'abc123');

// Đăng ký Custom Font
Fonts::custom('MyCustomFont', 'My Custom Font Family', [
    'woff2' => '/path/to/font.woff2',
    'woff' => '/path/to/font.woff',
]);

// Lấy tất cả fonts
$allFonts = Fonts::all();

// Lấy fonts theo category
$googleFonts = Fonts::category('google');

// Lấy fonts cho Gutenberg
$gutenbergFonts = Fonts::forGutenberg();
```

### 2. Sử Dụng Service Trực Tiếp

```php
$app = \Jankx\Foundation\Application::getInstance();
$fontsService = $app->make(\Jankx\Services\FontsService::class);

// Đăng ký font
$fontData = [
    'name' => 'My Font',
    'family' => 'My Font Family',
    'category' => 'custom',
    'files' => [
        'woff2' => '/path/to/font.woff2',
    ],
];

$fontsService->registerFont($fontData);
```

### 3. Sử Dụng Trong Child Theme

```php
// Trong functions.php của child theme
add_action('init', function() {
    // Đăng ký Google Fonts
    Fonts::google('Poppins', ['300', '400', '600', '700']);
    Fonts::google('Playfair Display', ['400', '700']);

    // Đăng ký Custom Fonts
    Fonts::custom('VietnameseFont', 'Vietnamese Font', [
        'woff2' => get_stylesheet_directory_uri() . '/fonts/vietnamese.woff2',
    ]);
});
```

## Các Loại Font

### 1. Google Fonts

```php
// Đăng ký với variants và subsets
Fonts::google('Roboto', ['300', '400', '500', '700'], ['latin', 'latin-ext']);

// Đăng ký đơn giản (chỉ regular weight)
Fonts::google('Open Sans');
```

**Lưu ý**: Cần có Google Fonts API key để sử dụng đầy đủ tính năng.

### 2. Adobe Fonts

```php
// Đăng ký với project ID
Fonts::adobe('Adobe Garamond Pro', 'abc123');

// Sử dụng project ID mặc định
Fonts::adobe('Minion Pro');
```

**Lưu ý**: Cần có Adobe Fonts project ID để sử dụng.

### 3. Custom Fonts

```php
// Đăng ký với font files
Fonts::custom('MyFont', 'My Font Family', [
    'woff2' => '/path/to/font.woff2',
    'woff' => '/path/to/font.woff',
    'ttf' => '/path/to/font.ttf',
]);

// Upload font file
$customProvider = Fonts::customProvider();
$fontUrl = $customProvider->uploadFontFile($_FILES['font_file'], 'MyFont');
```

**Formats được hỗ trợ**: WOFF2, WOFF, TTF, OTF, EOT

## Tích Hợp Với Gutenberg

### 1. Font Family Attribute

Hệ thống tự động thêm `fontFamily` attribute cho tất cả blocks:

```javascript
// Trong Gutenberg block
attributes: {
    fontFamily: {
        type: 'string',
        default: '',
    },
}
```

### 2. Font Picker Component

```javascript
import { SelectControl } from '@wordpress/components';

const FontPicker = ({ value, onChange }) => (
    <SelectControl
        label="Font Family"
        value={value}
        options={window.JankxFonts.getFontOptions()}
        onChange={onChange}
    />
);
```

### 3. Áp Dụng Font

```javascript
// Trong block save function
const blockProps = useBlockProps.save({
    style: {
        fontFamily: attributes.fontFamily ?
            window.JankxFonts.getFontFamily(attributes.fontFamily) :
            undefined,
    },
});
```

## REST API Endpoints

### 1. Lấy Tất Cả Fonts

```
GET /wp-json/jankx/v1/fonts
```

### 2. Lấy Font Cụ Thể

```
GET /wp-json/jankx/v1/fonts/{font_name}
```

### 3. Tạo Font Mới

```
POST /wp-json/jankx/v1/fonts
Content-Type: application/json

{
    "name": "My Font",
    "family": "My Font Family",
    "category": "custom",
    "files": {
        "woff2": "/path/to/font.woff2"
    }
}
```

### 4. Cập Nhật Font

```
PUT /wp-json/jankx/v1/fonts/{font_name}
```

### 5. Xóa Font

```
DELETE /wp-json/jankx/v1/fonts/{font_name}
```

## Admin Interface

### 1. Fonts Management Page

Truy cập: **Jankx Settings > Fonts**

### 2. Thêm Font Mới

1. Chọn loại font (Google, Adobe, Custom)
2. Nhập thông tin font
3. Upload font files (nếu là custom font)
4. Lưu font

### 3. Quản Lý Fonts

- Xem danh sách fonts
- Chỉnh sửa thông tin font
- Xóa font
- Preview font

## Performance & Optimization

### 1. Font Loading

- **Google Fonts**: Sử dụng CSS2 API với font-display: swap
- **Adobe Fonts**: Sử dụng Typekit với async loading
- **Custom Fonts**: Sử dụng @font-face với font-display: swap

### 2. Caching

- Font lists được cache trong 24 giờ
- CSS được lưu trong WordPress options
- Font files được serve từ uploads directory

### 3. Optimization Tips

```php
// Chỉ load fonts cần thiết
Fonts::google('Roboto', ['400', '700']); // Không load tất cả weights

// Sử dụng WOFF2 format cho custom fonts
Fonts::custom('MyFont', 'My Font', [
    'woff2' => '/path/to/font.woff2', // Ưu tiên WOFF2
    'woff' => '/path/to/font.woff',   // Fallback
]);
```

## Troubleshooting

### 1. Font Không Hiển Thị

- Kiểm tra font có được đăng ký thành công không
- Kiểm tra console errors
- Kiểm tra font files có accessible không

### 2. Gutenberg Không Hiển Thị Fonts

- Kiểm tra `gutenberg-fonts.js` có được load không
- Kiểm tra `jankxFonts` object trong console
- Kiểm tra font data có được pass đúng không

### 3. Performance Issues

- Giới hạn số lượng fonts được load
- Sử dụng font-display: swap
- Optimize font files (WOFF2 format)

## Examples

### 1. Complete Font Setup

```php
// Trong child theme functions.php
add_action('init', function() {
    // Google Fonts
    Fonts::google('Poppins', ['300', '400', '600', '700']);
    Fonts::google('Playfair Display', ['400', '700']);

    // Adobe Fonts
    Fonts::adobe('Adobe Garamond Pro', 'abc123');

    // Custom Fonts
    Fonts::custom('VietnameseFont', 'Vietnamese Font', [
        'woff2' => get_stylesheet_directory_uri() . '/fonts/vietnamese.woff2',
    ]);
});
```

### 2. Conditional Font Loading

```php
// Chỉ load fonts trên specific pages
if (is_page('about')) {
    Fonts::google('Merriweather', ['300', '400', '700']);
}

// Load fonts theo user role
if (current_user_can('administrator')) {
    Fonts::google('Source Code Pro', ['400', '600']);
}
```

### 3. Custom Font Implementation

```php
// Upload và đăng ký custom font
add_action('wp_ajax_upload_custom_font', function() {
    $file = $_FILES['font_file'];
    $fontName = sanitize_text_field($_POST['font_name']);

    $customProvider = Fonts::customProvider();
    $fontUrl = $customProvider->uploadFontFile($file, $fontName);

    if ($fontUrl) {
        Fonts::custom($fontName, $fontName, [
            'woff2' => $fontUrl,
        ]);

        wp_send_json_success('Font uploaded successfully');
    } else {
        wp_send_json_error('Failed to upload font');
    }
});
```

## Kết Luận

Jankx Fonts System cung cấp một giải pháp hoàn chỉnh để quản lý fonts trong WordPress theme. Với tích hợp Gutenberg, REST API và admin interface, hệ thống này giúp developers và users dễ dàng quản lý và sử dụng fonts một cách hiệu quả.

Để biết thêm thông tin hoặc hỗ trợ, vui lòng tham khảo source code hoặc liên hệ team phát triển.
