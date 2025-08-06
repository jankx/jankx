# Theme Options System

Bookix Theme sử dụng Jankx Option Adapter để quản lý theme options với cấu trúc linh hoạt và dễ tùy chỉnh. Hệ thống này cho phép chuyển đổi dễ dàng giữa các option framework khác nhau (Redux, Kirki, WordPress Settings API, Jankx Dashboard).

## 📋 **Tổng quan**

### **Kiến trúc hệ thống:**
```
Theme Options System
├── Service Provider (ThemeOptionsServiceProvider)
├── Service (ThemeOptionsService)
├── Options Data (Child Theme)
├── Jankx Option Adapter
│   ├── Redux Framework
│   ├── Kirki Framework
│   ├── WordPress Settings API
│   └── Jankx Dashboard
└── Helper Functions
```

### **Luồng hoạt động:**
1. **Service Provider** đăng ký service khi WordPress khởi tạo
2. **Service** load options data từ child theme
3. **Jankx Option Adapter** tự động detect và load framework phù hợp theo thứ tự ưu tiên:
   - **Priority 1**: `Config::get('app.options.framework')`
   - **Priority 2**: `Framework::setFrameworkFromExternal()`
   - **Priority 3**: WordPress option `jankx_option_framework`
   - **Priority 4**: Auto-detection (Jankx Dashboard → Redux → WordPress Settings API)
4. **Adapter** chuyển đổi data sang format của framework được chọn
5. **Helper Functions** cung cấp API để truy cập options

## 🚀 **Cài đặt và Sử dụng**

### **1. Cấu trúc Options Data**

Options data được lưu trong child theme tại `resources/options/`:

```
child-theme/
└── resources/
    └── options/
        ├── pages.php (Định nghĩa pages)
        ├── general/
        │   ├── site_info.php
        │   └── social_media.php
        ├── typography/
        │   ├── body_typography.php
        │   └── headings_typography.php
        ├── colors/
        │   ├── primary_colors.php
        │   └── background_colors.php
        ├── layout/
        │   └── container_settings.php
        ├── header/
        │   └── header_layout.php
        ├── blog/
        │   └── blog_layout.php
        └── advanced/
            └── performance.php
```

### **2. Format Options Data**

#### **Pages Configuration (`pages.php`):**
```php
<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    [
        'id' => 'general',
        'name' => 'General Settings',
        'args' => [
            'description' => 'General theme settings',
            'icon' => 'dashicons-admin-generic',
        ],
    ],
    // ... more pages
];
```

#### **Section Configuration:**
```php
<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'site_info',
    'name' => 'Site Information',
    'description' => 'Configure basic site information',
    'fields' => [
        [
            'id' => 'site_title',
            'name' => 'Site Title',
            'type' => 'text',
            'value' => 'Bookix - Book Store',
            'default_value' => 'Bookix - Book Store',
            'sub_title' => 'Main site title',
            'description' => 'Enter your site title',
        ],
        // ... more fields
    ],
];
```

### **3. Field Types Hỗ Trợ**

| Field Type | Redux Type | Description |
|------------|------------|-------------|
| `text` | `text` | Text input |
| `textarea` | `textarea` | Multi-line text |
| `select` | `select` | Dropdown select |
| `radio` | `radio` | Radio buttons |
| `checkbox` | `checkbox` | Checkbox field |
| `switch` | `switch` | Toggle switch |
| `slider` | `slider` | Range slider |
| `color` | `color` | Color picker |
| `typography` | `typography` | Typography settings |
| `background` | `background` | Background settings |
| `spacing` | `spacing` | Spacing/dimensions |
| `image` | `media` | Image upload |
| `icon` | `icon_select` | Icon selector |

### **4. Helper Functions**

#### **Basic Options Access:**
```php
// Lấy option value
$site_title = bookix_get_option('site_title', 'Default Title');

// Lấy site information
$site_title = bookix_get_site_title();
$site_description = bookix_get_site_description();
$site_logo = bookix_get_site_logo();
$site_favicon = bookix_get_site_favicon();
```

#### **Layout Settings:**
```php
// Lấy layout settings
$layout = bookix_get_layout_settings();
$container_width = $layout['container_width'];
$sidebar_width = $layout['sidebar_width'];
$boxed_layout = $layout['boxed_layout'];
```

#### **Header Settings:**
```php
// Lấy header settings
$header = bookix_get_header_settings();
$header_style = $header['style'];
$header_height = $header['height'];
$logo_position = $header['logo_position'];
```

#### **Typography Settings:**
```php
// Lấy typography settings
$body_typography = bookix_get_typography('body');
$h1_typography = bookix_get_typography('h1');
$h2_typography = bookix_get_typography('h2');
```

#### **Color Settings:**
```php
// Lấy primary colors
$colors = bookix_get_primary_colors();
$primary_color = $colors['primary'];
$secondary_color = $colors['secondary'];
$accent_color = $colors['accent'];

// Lấy specific color
$text_color = bookix_get_color('text_color');
$link_color = bookix_get_color('link_color');
```

#### **Background Settings:**
```php
// Lấy background settings
$body_background = bookix_get_background('body');
$header_background = bookix_get_background('header');
$footer_background = bookix_get_background('footer');
```

#### **Blog Settings:**
```php
// Lấy blog settings
$blog = bookix_get_blog_settings();
$blog_layout = $blog['layout'];
$blog_columns = $blog['columns'];
$excerpt_length = $blog['excerpt_length'];
```

#### **Performance Settings:**
```php
// Lấy performance settings
$performance = bookix_get_performance_settings();
$lazy_loading = $performance['lazy_loading'];
$minification = $performance['minification'];
$caching = $performance['caching'];
```

#### **Social Media:**
```php
// Lấy social media URLs
$social_urls = bookix_get_social_media_urls();
$facebook_url = $social_urls['facebook'];
$twitter_url = $social_urls['twitter'];

// Kiểm tra social icons
$social_enabled = bookix_is_social_icons_enabled();
```

#### **Feature Checks:**
```php
// Kiểm tra các tính năng
$sticky_header = bookix_is_sticky_header_enabled();
$back_to_top = bookix_is_back_to_top_enabled();
```

### **5. CSS Variables**

Theme options tự động tạo CSS variables:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #e74c3c;
    --accent-color: #f39c12;
    --text-color: #333333;
    --link-color: #3498db;
    --link-hover-color: #2980b9;
    --body-font-family: 'Open Sans, sans-serif';
    --body-font-size: 16px;
    --body-font-weight: 400;
    --body-line-height: 1.6;
    --body-color: #333333;
    --container-width: 1200px;
    --sidebar-width: 300px;
    --header-height: 80px;
}
```

## 🔧 **Tùy Chỉnh và Mở Rộng**

### **1. Chuyển Đổi Option Framework**

Để chuyển đổi giữa các framework khác nhau, bạn có thể:

#### **Cách 1: Sử dụng Jankx Framework Config (Ưu tiên cao nhất)**
```php
// Trong config/app.php
return [
    'app' => [
        'options' => [
            'framework' => 'redux', // hoặc 'kirki', 'wordpress', 'jankx'
        ],
    ],
];
```

#### **Cách 2: Sử dụng External Config**
```php
// Trong functions.php hoặc service provider
\Jankx\Adapter\Options\Framework::setFrameworkFromExternal('redux');
```

#### **Cách 3: Sử dụng WordPress Option**
```php
// Lưu framework preference
update_option('jankx_option_framework', 'redux'); // hoặc 'kirki', 'wordpress', 'jankx'
```

#### **Cách 4: Auto-detection**
Hệ thống sẽ tự động detect framework có sẵn theo thứ tự ưu tiên:
1. Jankx Dashboard (nếu có)
2. Redux Framework (nếu có)
3. WordPress Settings API (fallback)

### **2. Thêm Field Types Mới**

```php
protected function mapFieldType($type): string
{
    $typeMap = [
        // ... existing types
        'new_field_type' => 'redux_field_type',
    ];

    return $typeMap[$type] ?? 'text';
}
```

### **2. Thêm Helper Functions**

Tạo helper functions mới trong `includes/theme-options.php`:

```php
function bookix_get_custom_option($key, $default = null)
{
    return bookix_get_option($key, $default);
}
```

### **3. Tùy Chỉnh Redux Arguments**

Cập nhật `setupReduxArgs()` trong `ThemeOptionsService`:

```php
protected function setupReduxArgs(): void
{
    $this->reduxArgs = [
        // ... existing args
        'custom_setting' => 'custom_value',
    ];
}
```

## 📊 **Performance và Caching**

### **1. Options Caching**

Options được cache trong static variable:

```php
function bookix_get_option($key, $default = null)
{
    static $options = null;

    if ($options === null) {
        $options = get_option('bookix_theme_options', []);
    }

    return isset($options[$key]) ? $options[$key] : $default;
}
```

### **2. CSS Variables Optimization**

CSS variables được output một lần trong `<head>`:

```php
add_action('wp_head', 'bookix_output_css_variables');
```

## 🛠 **Debug và Troubleshooting**

### **1. Kiểm tra Options Data**

```php
// Debug options data
$options_data = $app->get('theme-options')->getOptionsData();
var_dump($options_data);
```

### **2. Kiểm tra Option Framework**

```php
// Kiểm tra framework hiện tại
$currentMode = \Jankx\Adapter\Options\Framework::getCurrentMode();
echo 'Current framework: ' . $currentMode;

// Kiểm tra adapter
$adapter = \Jankx\Adapter\Options\Framework::getActiveFramework();
if ($adapter) {
    echo 'Adapter is loaded: ' . get_class($adapter);
} else {
    echo 'No adapter loaded';
}

// Debug framework detection
if (class_exists('Jankx\Foundation\Config')) {
    $configFramework = \Jankx\Foundation\Config::get('app.options.framework');
    echo 'Config framework: ' . ($configFramework ?: 'not set');
}

$wpOptionFramework = get_option('jankx_option_framework');
echo 'WordPress option framework: ' . ($wpOptionFramework ?: 'not set');
```

### **3. Kiểm tra Options Values**

```php
// Lấy tất cả options
$all_options = get_option('bookix_theme_options', []);
var_dump($all_options);
```

## 📝 **Best Practices**

### **1. Child Theme Override**

Luôn tạo options trong child theme để dễ maintain:

```
child-theme/
└── resources/
    └── options/
        └── your_custom_options.php
```

### **2. Default Values**

Luôn cung cấp default values cho helper functions:

```php
function bookix_get_custom_option($key, $default = 'Default Value')
{
    return bookix_get_option($key, $default);
}
```

### **3. Security**

Luôn kiểm tra ABSPATH trong options files:

```php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}
```

### **4. Framework Configuration**

Luôn sử dụng Jankx Framework Config để cấu hình framework:

```php
// Trong config/app.php
'options' => [
    'framework' => 'redux', // Ưu tiên cao nhất
],
```

### **5. Performance**

Sử dụng static caching cho options:

```php
static $options = null;
if ($options === null) {
    $options = get_option('bookix_theme_options', []);
}
```

## 🎯 **Kết luận**

Theme Options System của Bookix cung cấp:

- ✅ **Framework Agnostic**: Hỗ trợ nhiều option framework (Redux, Kirki, WordPress Settings API, Jankx Dashboard)
- ✅ **Auto-detection**: Tự động detect framework phù hợp
- ✅ **Linh hoạt**: Dễ dàng chuyển đổi giữa các framework
- ✅ **Performance**: Caching và optimization
- ✅ **User-friendly**: UI của framework được chọn
- ✅ **Developer-friendly**: Helper functions và adapter pattern
- ✅ **Maintainable**: Child theme override
- ✅ **Secure**: ABSPATH checks và validation

Hệ thống này cho phép developers và users tùy chỉnh theme một cách dễ dàng và hiệu quả, đồng thời không bị ràng buộc vào một framework cụ thể!