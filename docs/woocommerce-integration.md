# WooCommerce Integration Guide

## Tổng quan

Jankx Framework cung cấp tích hợp mạnh mẽ với WooCommerce, bao gồm các tính năng tùy chỉnh cho việc hiển thị sản phẩm, xử lý giá cả, và tối ưu hóa trải nghiệm người dùng.

## Cấu trúc thư mục

```
includes/
├── app/
│   ├── Providers/
│   │   └── WooCommerce/
│   │       └── EmptyPriceServiceProvider.php
│   └── Services/
│       └── WooCommerce/
│           └── EmptyPriceService.php
├── framework/
│   └── Gutenberg/
│       └── Patterns/
│           └── BrandListPattern.php
└── config/
    └── woocommerce.php
```

## Tính năng chính

### 1. Empty Price Handling

#### Tổng quan
Tự động hiển thị text thay thế cho các sản phẩm không có giá, thay vì để trống.

#### Cách hoạt động
- **Service Provider**: `EmptyPriceServiceProvider` đăng ký các hooks WooCommerce
- **Service**: `EmptyPriceService` xử lý logic hiển thị empty price
- **Config**: `woocommerce.php` chứa cấu hình mặc định

#### Hỗ trợ Product Types
- ✅ Simple Products
- ✅ Variable Products
- ✅ Grouped Products
- ✅ External Products

#### Cấu hình

```php
// config/woocommerce.php
return [
    'product' => [
        'price' => [
            'empty_text' => __('Liên hệ', 'jankx'),
            'empty_classes' => [
                'price',
                'empty-price',
                'jankx-empty-price'
            ],
            'empty_html' => '<span class="{classes}" {attributes}>{text}</span>',
        ],
    ],
];
```

#### Sử dụng

```php
// Lấy text từ theme options (priority cao nhất)
$text = jankx_option('woocommerce_empty_price_text', '');

// Lấy từ config (fallback)
$text = Config::get('woocommerce.product.price.empty_text', 'Liên hệ');
```

#### Customization

```php
// Customize HTML output
add_filter('jankx_woocommerce_empty_price_html', function($html, $product, $text) {
    return '<div class="custom-empty-price">' . $text . '</div>';
}, 10, 3);

// Customize CSS classes
add_filter('jankx_woocommerce_empty_price_classes', function($classes, $product) {
    $classes[] = 'my-custom-class';
    return $classes;
}, 10, 2);

// Customize attributes
add_filter('jankx_woocommerce_empty_price_attributes', function($attributes, $product) {
    $attributes['data-custom'] = 'value';
    return $attributes;
}, 10, 2);
```

### 2. Brand List Pattern

#### Tổng quan
Gutenberg pattern để hiển thị danh sách thương hiệu WooCommerce với giao diện radio button selection.

#### Cách sử dụng
1. Mở Gutenberg Editor
2. Thêm Pattern mới
3. Chọn "Brand List - WooCommerce"
4. Pattern sẽ tự động load danh sách thương hiệu

#### Template Structure
```php
// templates/brand-list.php
<div class="brand-list-pattern">
    <h3><?php echo esc_html($title); ?></h3>
    <div class="brands-container">
        <?php foreach ($brands as $brand): ?>
            <label class="brand-item">
                <input type="radio" name="brand" value="<?php echo esc_attr($brand['id']); ?>">
                <?php if ($brand['featured_image']): ?>
                    <img src="<?php echo esc_url($brand['featured_image']); ?>" alt="<?php echo esc_attr($brand['name']); ?>">
                <?php endif; ?>
                <span class="brand-name"><?php echo esc_html($brand['name']); ?></span>
            </label>
        <?php endforeach; ?>
    </div>
</div>
```

#### Data Structure
```php
$brands = [
    [
        'id' => 1,
        'name' => 'Brand Name',
        'slug' => 'brand-slug',
        'description' => 'Brand description',
        'count' => 10,
        'featured_image' => 'image-url',
        'url' => 'brand-url'
    ],
    // ...
];
```

## Hooks và Filters

### WooCommerce Hooks
```php
// Price display hooks
add_filter('woocommerce_get_price_html', [$service, 'handleEmptyPrice'], 10, 2);
add_filter('woocommerce_variable_price_html', [$service, 'handleVariableEmptyPrice'], 10, 2);
add_filter('woocommerce_grouped_price_html', [$service, 'handleGroupedEmptyPrice'], 10, 2);
add_filter('woocommerce_external_price_html', [$service, 'handleExternalEmptyPrice'], 10, 2);
```

### Custom Filters
```php
// Empty price HTML
apply_filters('jankx_woocommerce_empty_price_html', $html, $product, $emptyText);

// Empty price CSS classes
apply_filters('jankx_woocommerce_empty_price_classes', $classes, $product);

// Empty price attributes
apply_filters('jankx_woocommerce_empty_price_attributes', $attributes, $product);
```

## Service Providers

### EmptyPriceServiceProvider

#### Đăng ký Service
```php
$app->singleton('woocommerce.empty_price.service', function ($app) {
    return new EmptyPriceService($app);
});
```

#### Bootstrap Hooks
```php
public function boot(Application $app)
{
    if (!class_exists('WooCommerce')) {
        return;
    }

    $emptyPriceService = $app->make('woocommerce.empty_price.service');

    add_filter('woocommerce_get_price_html', [$emptyPriceService, 'handleEmptyPrice'], 10, 2);
    // ... other hooks
}
```

## Configuration

### WooCommerce Config File
```php
// config/woocommerce.php
return [
    'product' => [
        'price' => [
            'empty_text' => __('Liên hệ', 'jankx'),
            'empty_classes' => ['price', 'empty-price', 'jankx-empty-price'],
            'empty_html' => '<span class="{classes}" {attributes}>{text}</span>',
        ],
        'display' => [
            'show_empty_price' => true,
            'hide_add_to_cart' => false,
            'show_contact_button' => true,
        ],
        'supported_types' => ['simple', 'variable', 'grouped', 'external'],
    ],
    'hooks' => [
        'price_html' => ['priority' => 10, 'accepted_args' => 2],
        // ... other hooks
    ],
    'filters' => [
        'empty_price_html' => [
            'name' => 'jankx_woocommerce_empty_price_html',
            'priority' => 10,
            'accepted_args' => 3,
        ],
        // ... other filters
    ],
];
```

### Provider Registration
```php
// config/providers.php
'http' => [
    'frontend' => [
        // ... other providers
        App\Providers\WooCommerce\EmptyPriceServiceProvider::class,
    ],
    'admin' => [
        // ... other providers
        App\Providers\WooCommerce\EmptyPriceServiceProvider::class,
    ],
    'admin_ajax' => [
        // ... other providers
        App\Providers\WooCommerce\EmptyPriceServiceProvider::class,
    ],
],
```

## Development Guide

### Thêm tính năng mới

#### 1. Tạo Service Provider
```php
// includes/app/Providers/WooCommerce/NewFeatureServiceProvider.php
<?php
namespace App\Providers\WooCommerce;

use App\Services\WooCommerce\NewFeatureService;
use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class NewFeatureServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        $app->singleton('woocommerce.new_feature.service', function ($app) {
            return new NewFeatureService($app);
        });
    }

    public function boot(Application $app)
    {
        if (!class_exists('WooCommerce')) {
            return;
        }

        $service = $app->make('woocommerce.new_feature.service');
        // Add hooks here
    }
}
```

#### 2. Tạo Service
```php
// includes/app/Services/WooCommerce/NewFeatureService.php
<?php
namespace App\Services\WooCommerce;

use Jankx\Foundation\Application;

class NewFeatureService
{
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    // Add your methods here
}
```

#### 3. Đăng ký Provider
```php
// config/providers.php
'frontend' => [
    // ... existing providers
    App\Providers\WooCommerce\NewFeatureServiceProvider::class,
],
```

### Testing

#### Unit Tests
```php
// tests/Unit/WooCommerce/EmptyPriceServiceTest.php
<?php
namespace Tests\Unit\WooCommerce;

use App\Services\WooCommerce\EmptyPriceService;
use PHPUnit\Framework\TestCase;

class EmptyPriceServiceTest extends TestCase
{
    public function test_handles_empty_price()
    {
        // Test implementation
    }
}
```

#### Integration Tests
```php
// tests/Integration/WooCommerce/EmptyPriceIntegrationTest.php
<?php
namespace Tests\Integration\WooCommerce;

use Tests\TestCase;

class EmptyPriceIntegrationTest extends TestCase
{
    public function test_empty_price_display()
    {
        // Test integration
    }
}
```

## Best Practices

### 1. Performance
- Sử dụng caching cho template rendering
- Lazy load cho large brand lists
- Optimize database queries

### 2. Security
- Escape tất cả output
- Validate input data
- Sanitize user inputs

### 3. Compatibility
- Kiểm tra WooCommerce version
- Fallback cho older versions
- Test với different themes

### 4. Maintainability
- Sử dụng dependency injection
- Follow PSR standards
- Document code properly

## Troubleshooting

### Common Issues

#### 1. Empty Price không hiển thị
```php
// Kiểm tra WooCommerce có active không
if (!class_exists('WooCommerce')) {
    // WooCommerce not active
}

// Kiểm tra provider có được đăng ký không
$app->bound('woocommerce.empty_price.service');
```

#### 2. Text không đúng
```php
// Kiểm tra theme options
$text = jankx_option('woocommerce_empty_price_text', '');

// Kiểm tra config
$text = Config::get('woocommerce.product.price.empty_text');
```

#### 3. CSS không apply
```php
// Kiểm tra CSS classes
$classes = apply_filters('jankx_woocommerce_empty_price_classes', $classes, $product);
```

### Debug Mode
```php
// Bật debug mode
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);

// Check logs
tail -f wp-content/debug.log
```

## API Reference

### EmptyPriceService Methods

#### `handleEmptyPrice($price, $product)`
Xử lý empty price cho simple products.

**Parameters:**
- `$price` (string): Original price HTML
- `$product` (WC_Product): Product object

**Returns:** string - Modified price HTML

#### `handleVariableEmptyPrice($price, $product)`
Xử lý empty price cho variable products.

**Parameters:**
- `$price` (string): Original price HTML
- `$product` (WC_Product_Variable): Variable product object

**Returns:** string - Modified price HTML

#### `getEmptyPriceHtml($product)`
Tạo HTML cho empty price display.

**Parameters:**
- `$product` (WC_Product): Product object

**Returns:** string - Empty price HTML

### Configuration Options

#### `woocommerce.product.price.empty_text`
Default text hiển thị khi product không có giá.

**Type:** string
**Default:** 'Liên hệ'

#### `woocommerce.product.price.empty_classes`
CSS classes cho empty price element.

**Type:** array
**Default:** ['price', 'empty-price', 'jankx-empty-price']

#### `woocommerce.product.supported_types`
Product types được hỗ trợ empty price handling.

**Type:** array
**Default:** ['simple', 'variable', 'grouped', 'external']

## Changelog

### Version 2.0.0
- ✅ Initial WooCommerce integration
- ✅ Empty price handling
- ✅ Brand list pattern
- ✅ Service provider architecture
- ✅ Configuration system
- ✅ Custom filters và hooks

## Support

Để được hỗ trợ, vui lòng:
1. Kiểm tra documentation này
2. Tìm kiếm trong GitHub issues
3. Tạo issue mới nếu cần
4. Liên hệ team development

---

**Tài liệu này được cập nhật thường xuyên. Vui lòng kiểm tra phiên bản mới nhất.**
