# Theme Configuration Files

## WooCommerce Layout Configuration

File: `woocomerce.php`

### Mục đích

File này định nghĩa configuration cho toàn bộ hệ thống WooCommerce Layouts, bao gồm:
- Default layouts cho mỗi loại
- Settings cho từng layout type
- Global settings
- Advanced options

### Cách sử dụng

#### 1. Set default layout

```php
'product_detail' => [
    'default_layout' => 'my-custom-layout', // Layout ID
    'enabled' => true,
],
```

#### 2. Configure settings

```php
'product_loop' => [
    'settings' => [
        'columns' => 4,              // 4 cột desktop
        'columns_mobile' => 2,       // 2 cột mobile
        'hover_effect' => 'zoom',    // Hiệu ứng hover
        'show_quick_view' => true,   // Hiển thị quick view
    ],
],
```

#### 3. Global settings

```php
'global' => [
    'primary_color' => '#0073aa',
    'border_radius' => 5,
    'spacing' => 20,
],
```

### Priority

Configuration có 3 levels:
1. **Theme Options** (highest priority) - Từ Redux/Titan/Theme Customizer
2. **Config File** (medium priority) - File này
3. **Defaults** (lowest priority) - Từ hệ thống

Nếu một value không được set trong Theme Options, sẽ fallback về Config File, sau đó mới đến Defaults.

### Empty Values

Nếu bạn muốn một setting fallback sang Theme Options, set value = `null`:

```php
'product_loop' => [
    'settings' => [
        'columns' => null,  // Will use theme option nếu có
    ],
],
```

### Disable layout type

```php
'quick_checkout' => [
    'enabled' => false,  // Tắt hoàn toàn quick checkout
],
```

### Available Layout Types

1. `product_detail` - Product detail pages
2. `product_loop` - Product listing/archive
3. `product_category_block` - Category blocks
4. `product_gallery` - Product image galleries
5. `cart_form` - Mini cart, cart widget
6. `cart_page` - Cart page
7. `checkout_page` - Checkout page
8. `quick_checkout` - Quick checkout (custom)

### Hooks

Bạn có thể hook vào configuration:

```php
// Modify config sau khi load
add_filter('jankx_woocommerce_config_loaded', function($config, $provider) {
    // Modify $config
    return $config;
}, 10, 2);

// After configuration applied
add_action('jankx_woocommerce_configuration_applied', function($config, $manager) {
    // Do something
}, 10, 2);
```

### Debugging

Enable debug mode để log configuration:

```php
'advanced' => [
    'debug_mode' => true,
],
```

Log sẽ xuất hiện trong WordPress debug.log khi config được load.

### Theme Options Integration

File này tự động integrate với:
- Redux Framework
- Titan Framework
- Kirki
- WordPress Customizer (Theme Mods)

Xem documentation để biết mapping giữa theme options và config structure.

---

**Note**: Sau khi thay đổi config file, CSS cache sẽ tự động được clear và regenerate.

