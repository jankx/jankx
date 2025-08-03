# Register Custom Patterns

Hướng dẫn cách đăng ký custom patterns trong Jankx Framework sử dụng action hook.

## 📋 Mục lục

- [Cách sử dụng](#cách-sử-dụng)
- [Ví dụ cơ bản](#ví-dụ-cơ-bản)
- [Custom Pattern Class](#custom-pattern-class)
- [Remove Default Patterns](#remove-default-patterns)
- [Conditional Registration](#conditional-registration)
- [Best Practices](#best-practices)

## 🚀 Cách sử dụng

Đặt code này trong `functions.php` của child theme hoặc trong plugin:

```php
<?php
/**
 * Register Custom Patterns
 *
 * Place this code in your child theme's functions.php or in a plugin.
 */

// Hook vào Jankx pattern registration
add_action('jankx/gutenberg/register-patterns', function($repository, $app) {

    // Đăng ký custom patterns ở đây
    $repository->registerPattern(\MyTheme\Patterns\CustomHeroPattern::class, $app);
    $repository->registerPattern(\MyTheme\Patterns\TestimonialGridPattern::class, $app);
    $repository->registerPattern(\MyTheme\Patterns\PricingTablePattern::class, $app);

}, 10, 2);
```

## 📝 Ví dụ cơ bản

### Hook vào Pattern Registration

```php
add_action('jankx/gutenberg/register-patterns', function($repository, $app) {
    // Đăng ký patterns
    $repository->registerPattern(\MyTheme\Patterns\CustomHeroPattern::class, $app);
}, 10, 2);
```

### Parameters

- `$repository`: Pattern repository instance
- `$app`: Jankx application instance
- Priority: `10` (default)
- Arguments: `2` (repository và app)

## 🏗️ Custom Pattern Class

Tạo class pattern kế thừa từ `GutenbergPattern`:

```php
<?php
/**
 * Example Custom Pattern Class
 */
class CustomHeroPattern extends \Jankx\Support\Blocks\Patterns\GutenbergPattern
{
    protected function getPatternSlug(): string
    {
        return 'mytheme/custom-hero';
    }

    protected function getPatternData(): array
    {
        return [
            'title' => 'Custom Hero Section',
            'description' => 'A custom hero section for your theme',
            'categories' => ['hero', 'mytheme'],
            'keywords' => ['hero', 'custom', 'banner'],
            'viewportWidth' => 1200,
        ];
    }

    protected function getTemplatePath(): string
    {
        return 'custom-hero';
    }

    protected function getTemplateData(): array
    {
        return [
            'title' => 'Your Custom Title',
            'subtitle' => 'Your custom subtitle here',
            'button_text' => 'Learn More',
            'button_url' => '#',
        ];
    }
}
```

### Required Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getPatternSlug()` | `string` | Unique pattern slug |
| `getPatternData()` | `array` | Pattern metadata |
| `getTemplatePath()` | `string` | Template file path |
| `getTemplateData()` | `array` | Data for template |

### Pattern Data Structure

```php
protected function getPatternData(): array
{
    return [
        'title' => 'Pattern Title',
        'description' => 'Pattern description',
        'categories' => ['category1', 'category2'],
        'keywords' => ['keyword1', 'keyword2'],
        'viewportWidth' => 1200,
        'content' => '<!-- wp:block -->', // Optional
        'blockTypes' => ['core/heading', 'core/paragraph'], // Optional
    ];
}
```

## 🗑️ Remove Default Patterns

Xóa patterns mặc định nếu cần:

```php
<?php
/**
 * Remove Default Patterns
 */
add_action('jankx/gutenberg/register-patterns', function($repository, $app) {

    // Xóa default patterns nếu cần
    $repository->removePattern('jankx/hero-section');
    $repository->removePattern('jankx/card-grid');

}, 5, 2); // Priority thấp hơn để chạy trước pattern registration
```

## 🔄 Conditional Registration

Đăng ký patterns có điều kiện:

```php
<?php
/**
 * Conditional Pattern Registration
 */
add_action('jankx/gutenberg/register-patterns', function($repository, $app) {

    // Chỉ đăng ký patterns cho specific post types
    if (is_singular('product')) {
        $repository->registerPattern(\MyTheme\Patterns\ProductHeroPattern::class, $app);
    }

    // Chỉ đăng ký patterns cho admin users
    if (current_user_can('manage_options')) {
        $repository->registerPattern(\MyTheme\Patterns\AdminOnlyPattern::class, $app);
    }

    // Đăng ký patterns theo theme
    if (get_template() === 'jankx') {
        $repository->registerPattern(\MyTheme\Patterns\ThemeSpecificPattern::class, $app);
    }

}, 15, 2); // Priority cao hơn để chạy sau pattern registration
```

## 🎯 Best Practices

### 1. Namespace Organization

```php
<?php
namespace MyTheme\Patterns;

class CustomHeroPattern extends \Jankx\Support\Blocks\Patterns\GutenbergPattern
{
    // Pattern implementation
}
```

### 2. Template Organization

```
themes/
├── jankx-child/
│   ├── patterns/
│   │   ├── custom-hero.html
│   │   ├── testimonial-grid.html
│   │   └── pricing-table.html
│   └── functions.php
```

### 3. Pattern Categories

```php
'categories' => [
    'hero',           // Hero sections
    'layout',         // Layout patterns
    'content',        // Content blocks
    'mytheme',        // Theme-specific
    'custom',         // Custom patterns
],
```

### 4. Error Handling

```php
add_action('jankx/gutenberg/register-patterns', function($repository, $app) {
    try {
        $repository->registerPattern(\MyTheme\Patterns\CustomPattern::class, $app);
    } catch (\Exception $e) {
        error_log('Failed to register pattern: ' . $e->getMessage());
    }
}, 10, 2);
```

### 5. Performance Optimization

```php
// Cache pattern registration
add_action('jankx/gutenberg/register-patterns', function($repository, $app) {
    $cache_key = 'jankx_patterns_registered';

    if (!wp_cache_get($cache_key)) {
        // Register patterns
        $repository->registerPattern(\MyTheme\Patterns\CustomPattern::class, $app);

        wp_cache_set($cache_key, true, '', 3600);
    }
}, 10, 2);
```

## 📁 File Structure Example

```
jankx-child/
├── functions.php
├── patterns/
│   ├── custom-hero.html
│   ├── testimonial-grid.html
│   └── pricing-table.html
└── includes/
    └── patterns/
        ├── CustomHeroPattern.php
        ├── TestimonialGridPattern.php
        └── PricingTablePattern.php
```

## 🔧 Debug & Troubleshooting

### Check Pattern Registration

```php
add_action('jankx/gutenberg/register-patterns', function($repository, $app) {
    // Debug pattern registration
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('Registering patterns...');
    }

    $repository->registerPattern(\MyTheme\Patterns\CustomPattern::class, $app);
}, 10, 2);
```

### Validate Pattern Data

```php
protected function getPatternData(): array
{
    $data = [
        'title' => 'Custom Pattern',
        'description' => 'Pattern description',
        'categories' => ['custom'],
    ];

    // Validate required fields
    if (empty($data['title']) || empty($data['categories'])) {
        throw new \InvalidArgumentException('Pattern data is invalid');
    }

    return $data;
}
```

## 📚 Related Documentation

- [Gutenberg Block Development](./gutenberg-block-development-flow.md)
- [Jankx Query Loop Block](./jankx-query-loop-block.md)
- [Gutenberg Architecture](./gutenberg-simple-architecture.md)

## 🆘 Support

Nếu gặp vấn đề, hãy kiểm tra:

1. **Pattern slug** có unique không
2. **Template file** có tồn tại không
3. **Namespace** có đúng không
4. **Hook priority** có phù hợp không
5. **Error logs** để debug

---

*Last updated: August 2025*