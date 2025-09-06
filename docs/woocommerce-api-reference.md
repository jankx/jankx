# WooCommerce API Reference

## Service Providers

### EmptyPriceServiceProvider

#### Namespace
```php
App\Providers\WooCommerce\EmptyPriceServiceProvider
```

#### Methods

##### `register(Application $app)`
Đăng ký service vào container.

**Parameters:**
- `$app` (Application): Application instance

**Returns:** void

##### `boot(Application $app)`
Bootstrap service và đăng ký hooks.

**Parameters:**
- `$app` (Application): Application instance

**Returns:** void

## Services

### EmptyPriceService

#### Namespace
```php
App\Services\WooCommerce\EmptyPriceService
```

#### Constructor
```php
public function __construct(Application $app)
```

**Parameters:**
- `$app` (Application): Application instance

#### Methods

##### `handleEmptyPrice($price, $product)`
Xử lý empty price cho simple products.

**Parameters:**
- `$price` (string): Original price HTML
- `$product` (WC_Product): Product object

**Returns:** string - Modified price HTML

**Example:**
```php
$service = $app->make('woocommerce.empty_price.service');
$html = $service->handleEmptyPrice('', $product);
```

##### `handleVariableEmptyPrice($price, $product)`
Xử lý empty price cho variable products.

**Parameters:**
- `$price` (string): Original price HTML
- `$product` (WC_Product_Variable): Variable product object

**Returns:** string - Modified price HTML

##### `handleGroupedEmptyPrice($price, $product)`
Xử lý empty price cho grouped products.

**Parameters:**
- `$price` (string): Original price HTML
- `$product` (WC_Product_Grouped): Grouped product object

**Returns:** string - Modified price HTML

##### `handleExternalEmptyPrice($price, $product)`
Xử lý empty price cho external products.

**Parameters:**
- `$price` (string): Original price HTML
- `$product` (WC_Product_External): External product object

**Returns:** string - Modified price HTML

##### `hasPrice($product)`
Kiểm tra product có giá hay không.

**Parameters:**
- `$product` (WC_Product): Product object

**Returns:** bool - True nếu có giá

##### `hasVariablePrice($product)`
Kiểm tra variable product có giá hay không.

**Parameters:**
- `$product` (WC_Product_Variable): Variable product object

**Returns:** bool - True nếu có giá

##### `hasGroupedPrice($product)`
Kiểm tra grouped product có giá hay không.

**Parameters:**
- `$product` (WC_Product_Grouped): Grouped product object

**Returns:** bool - True nếu có giá

##### `getEmptyPriceHtml($product)`
Tạo HTML cho empty price display.

**Parameters:**
- `$product` (WC_Product): Product object

**Returns:** string - Empty price HTML

##### `getEmptyPriceText()`
Lấy text hiển thị cho empty price.

**Returns:** string - Empty price text

##### `getThemeOptionText()`
Lấy text từ theme options.

**Returns:** string - Theme option text

##### `getEmptyPriceClasses($product)`
Lấy CSS classes cho empty price element.

**Parameters:**
- `$product` (WC_Product): Product object

**Returns:** array - CSS classes

##### `getEmptyPriceAttributes($product)`
Lấy HTML attributes cho empty price element.

**Parameters:**
- `$product` (WC_Product): Product object

**Returns:** array - HTML attributes

## Hooks

### WooCommerce Hooks

#### `woocommerce_get_price_html`
Hook vào price display của simple products.

**Priority:** 10
**Accepted Args:** 2

**Parameters:**
- `$price` (string): Price HTML
- `$product` (WC_Product): Product object

#### `woocommerce_variable_price_html`
Hook vào price display của variable products.

**Priority:** 10
**Accepted Args:** 2

**Parameters:**
- `$price` (string): Price HTML
- `$product` (WC_Product_Variable): Variable product object

#### `woocommerce_grouped_price_html`
Hook vào price display của grouped products.

**Priority:** 10
**Accepted Args:** 2

**Parameters:**
- `$price` (string): Price HTML
- `$product` (WC_Product_Grouped): Grouped product object

#### `woocommerce_external_price_html`
Hook vào price display của external products.

**Priority:** 10
**Accepted Args:** 2

**Parameters:**
- `$price` (string): Price HTML
- `$product` (WC_Product_External): External product object

## Filters

### Custom Filters

#### `jankx_woocommerce_empty_price_html`
Filter HTML output của empty price.

**Priority:** 10
**Accepted Args:** 3

**Parameters:**
- `$html` (string): HTML output
- `$product` (WC_Product): Product object
- `$emptyText` (string): Empty price text

**Returns:** string - Modified HTML

**Example:**
```php
add_filter('jankx_woocommerce_empty_price_html', function($html, $product, $text) {
    return '<div class="custom-empty-price">' . $text . '</div>';
}, 10, 3);
```

#### `jankx_woocommerce_empty_price_classes`
Filter CSS classes của empty price element.

**Priority:** 10
**Accepted Args:** 2

**Parameters:**
- `$classes` (array): CSS classes
- `$product` (WC_Product): Product object

**Returns:** array - Modified classes

**Example:**
```php
add_filter('jankx_woocommerce_empty_price_classes', function($classes, $product) {
    $classes[] = 'my-custom-class';
    return $classes;
}, 10, 2);
```

#### `jankx_woocommerce_empty_price_attributes`
Filter HTML attributes của empty price element.

**Priority:** 10
**Accepted Args:** 2

**Parameters:**
- `$attributes` (array): HTML attributes
- `$product` (WC_Product): Product object

**Returns:** array - Modified attributes

**Example:**
```php
add_filter('jankx_woocommerce_empty_price_attributes', function($attributes, $product) {
    $attributes['data-custom'] = 'value';
    return $attributes;
}, 10, 2);
```

## Configuration

### WooCommerce Config

#### `woocommerce.product.price.empty_text`
Default text hiển thị khi product không có giá.

**Type:** string
**Default:** 'Liên hệ'
**Description:** Text sẽ được hiển thị thay vì để trống

#### `woocommerce.product.price.empty_classes`
CSS classes cho empty price element.

**Type:** array
**Default:** ['price', 'empty-price', 'jankx-empty-price']
**Description:** CSS classes sẽ được thêm vào element

#### `woocommerce.product.price.empty_html`
HTML structure cho empty price display.

**Type:** string
**Default:** '<span class="{classes}" {attributes}>{text}</span>'
**Description:** HTML template với placeholders

#### `woocommerce.product.display.show_empty_price`
Hiển thị empty price hay không.

**Type:** bool
**Default:** true
**Description:** Enable/disable empty price display

#### `woocommerce.product.display.hide_add_to_cart`
Ẩn nút Add to Cart khi không có giá.

**Type:** bool
**Default:** false
**Description:** Hide add to cart button for products without price

#### `woocommerce.product.display.show_contact_button`
Hiển thị nút liên hệ khi không có giá.

**Type:** bool
**Default:** true
**Description:** Show contact button for products without price

#### `woocommerce.product.supported_types`
Product types được hỗ trợ empty price handling.

**Type:** array
**Default:** ['simple', 'variable', 'grouped', 'external']
**Description:** List of supported product types

## Gutenberg Patterns

### BrandListPattern

#### Namespace
```php
Jankx\Gutenberg\Patterns\BrandListPattern
```

#### Methods

##### `getPatternSlug()`
Lấy pattern slug.

**Returns:** string - 'jankx/brand-list'

##### `getPatternData()`
Lấy pattern metadata.

**Returns:** array - Pattern data

##### `getTemplatePath()`
Lấy template path.

**Returns:** string - 'brand-list'

##### `getTemplateData()`
Lấy template data.

**Returns:** array - Template variables

##### `getWooCommerceBrands()`
Lấy danh sách thương hiệu WooCommerce.

**Returns:** array - Brands data

##### `getBrandFeaturedImage($term_id)`
Lấy featured image của thương hiệu.

**Parameters:**
- `$term_id` (int): Term ID

**Returns:** string - Image URL

## Utility Functions

### Helper Functions

#### `jankx_woocommerce_get_empty_price_text()`
Lấy empty price text từ theme options hoặc config.

**Returns:** string - Empty price text

**Example:**
```php
$text = jankx_woocommerce_get_empty_price_text();
```

#### `jankx_woocommerce_has_empty_price($product)`
Kiểm tra product có empty price hay không.

**Parameters:**
- `$product` (WC_Product): Product object

**Returns:** bool - True nếu có empty price

**Example:**
```php
if (jankx_woocommerce_has_empty_price($product)) {
    // Handle empty price
}
```

#### `jankx_woocommerce_get_empty_price_html($product)`
Lấy HTML cho empty price.

**Parameters:**
- `$product` (WC_Product): Product object

**Returns:** string - Empty price HTML

**Example:**
```php
$html = jankx_woocommerce_get_empty_price_html($product);
echo $html;
```

## Error Handling

### Exceptions

#### `WooCommerceNotActiveException`
Exception khi WooCommerce không active.

```php
if (!class_exists('WooCommerce')) {
    throw new WooCommerceNotActiveException('WooCommerce is not active');
}
```

#### `InvalidProductTypeException`
Exception khi product type không được hỗ trợ.

```php
if (!in_array($product->get_type(), $supportedTypes)) {
    throw new InvalidProductTypeException('Product type not supported');
}
```

## Debugging

### Debug Functions

#### `jankx_woocommerce_debug_empty_price($product)`
Debug empty price handling.

**Parameters:**
- `$product` (WC_Product): Product object

**Returns:** array - Debug information

**Example:**
```php
if (WP_DEBUG) {
    $debug = jankx_woocommerce_debug_empty_price($product);
    error_log(print_r($debug, true));
}
```

#### `jankx_woocommerce_log_empty_price($message, $product = null)`
Log empty price events.

**Parameters:**
- `$message` (string): Log message
- `$product` (WC_Product|null): Product object

**Returns:** void

**Example:**
```php
jankx_woocommerce_log_empty_price('Empty price handled', $product);
```

## Performance

### Caching

#### Template Caching
Empty price HTML được cache để tối ưu performance.

```php
// Cache key
$cacheKey = 'jankx_empty_price_' . $product->get_id() . '_' . md5($emptyText);

// Get from cache
$html = wp_cache_get($cacheKey, 'jankx_woocommerce');

// Set cache
wp_cache_set($cacheKey, $html, 'jankx_woocommerce', 3600);
```

#### Config Caching
Config được cache để tránh load lại.

```php
// Cache config
$config = wp_cache_get('jankx_woocommerce_config', 'jankx_config');
if (false === $config) {
    $config = require 'config/woocommerce.php';
    wp_cache_set('jankx_woocommerce_config', $config, 'jankx_config', 3600);
}
```

## Security

### Input Sanitization
Tất cả input được sanitize để tránh XSS.

```php
// Sanitize text
$text = sanitize_text_field($text);

// Escape HTML
$html = esc_html($html);

// Escape attributes
$attr = esc_attr($attr);
```

### Output Escaping
Tất cả output được escape.

```php
// Escape HTML output
echo esc_html($text);

// Escape attributes
echo esc_attr($attribute);

// Escape URL
echo esc_url($url);
```

---

**Cập nhật lần cuối:** 2024-01-01
**Phiên bản:** 2.0.0
