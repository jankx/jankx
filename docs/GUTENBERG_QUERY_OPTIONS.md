# Gutenberg Query Options

Hướng dẫn customize query options cho Post Type Layout block.

## Overview

Query options được quản lý bởi class `Jankx\Gutenberg\QueryOptions` và được output ra JavaScript để editor có thể sử dụng.

## Available Filters

### 1. Order By Options

Filter: `jankx/gutenberg/query-options/order-by`

**Example: Thêm custom order by option**

```php
add_filter('jankx/gutenberg/query-options/order-by', function($options) {
    $options[] = [
        'value' => 'views',
        'label' => __('Views (Lượt xem)', 'my-plugin'),
    ];
    return $options;
});
```

**Example: Xóa một option**

```php
add_filter('jankx/gutenberg/query-options/order-by', function($options) {
    return array_filter($options, function($option) {
        return $option['value'] !== 'rand'; // Xóa Random option
    });
});
```

### 2. Order Options

Filter: `jankx/gutenberg/query-options/order`

**Example: Thêm option mới**

```php
add_filter('jankx/gutenberg/query-options/order', function($options) {
    // Default có DESC và ASC
    // Thêm option khác nếu cần
    return $options;
});
```

### 3. Meta Query Compare Operators

Filter: `jankx/gutenberg/query-options/meta-compare`

**Example: Thêm custom operator**

```php
add_filter('jankx/gutenberg/query-options/meta-compare', function($operators) {
    $operators[] = [
        'value' => 'BETWEEN',
        'label' => __('Between (BETWEEN)', 'my-plugin'),
    ];
    return $operators;
});
```

### 4. Meta Query Types

Filter: `jankx/gutenberg/query-options/meta-types`

**Example: Customize types**

```php
add_filter('jankx/gutenberg/query-options/meta-types', function($types) {
    $types[] = [
        'value' => 'BINARY',
        'label' => 'BINARY',
    ];
    return $types;
});
```

### 5. Taxonomy Query Operators

Filter: `jankx/gutenberg/query-options/taxonomy-operators`

**Example: Xóa EXISTS/NOT EXISTS**

```php
add_filter('jankx/gutenberg/query-options/taxonomy-operators', function($operators) {
    return array_filter($operators, function($op) {
        return !in_array($op['value'], ['EXISTS', 'NOT EXISTS']);
    });
});
```

## Data Structure

### Order By Option

```php
[
    'value' => 'date',          // Value được lưu vào database
    'label' => 'Date (Ngày đăng)', // Label hiển thị trong UI
]
```

### Meta Compare Operator

```php
[
    'value' => '=',
    'label' => 'Equal (=)',
]
```

## JavaScript Access

Trong editor, data được access qua:

```javascript
window.jankxQueryOptions = {
    orderBy: [...],
    order: [...],
    metaCompare: [...],
    metaTypes: [...],
    taxonomyOperators: [...]
}
```

## Example: Plugin mở rộng query options

```php
<?php
/**
 * Plugin Name: My Query Options Extension
 * Description: Thêm custom query options cho Jankx blocks
 */

// Thêm order by theo custom field
add_filter('jankx/gutenberg/query-options/order-by', function($options) {
    $options[] = [
        'value' => 'price',
        'label' => __('Price (Giá)', 'my-plugin'),
    ];
    $options[] = [
        'value' => 'stock',
        'label' => __('Stock (Tồn kho)', 'my-plugin'),
    ];
    return $options;
});

// Thêm meta compare operator
add_filter('jankx/gutenberg/query-options/meta-compare', function($operators) {
    $operators[] = [
        'value' => 'BETWEEN',
        'label' => __('Between (BETWEEN)', 'my-plugin'),
    ];
    $operators[] = [
        'value' => 'NOT BETWEEN',
        'label' => __('Not Between (NOT BETWEEN)', 'my-plugin'),
    ];
    return $operators;
});

// Xóa các options không cần thiết
add_filter('jankx/gutenberg/query-options/order-by', function($options) {
    $remove = ['relevance', 'post_name__in', 'post_parent__in'];
    return array_filter($options, function($option) use ($remove) {
        return !in_array($option['value'], $remove);
    });
}, 20); // Priority 20 để chạy sau
```

## Example: Order by với Meta Key

**Ví dụ từ MetricServiceProvider - Order by Post Views**

```php
class MetricServiceProvider extends ServiceProvider
{
    public function boot(Application $app)
    {
        // Add "Post Views" option to order by
        add_filter('jankx/gutenberg/query-options/order-by', function($options) {
            $options[] = [
                'value' => 'post_views',
                'label' => __('Post Views (Lượt xem)', 'jankx'),
            ];
            return $options;
        });

        // Handle WP_Query modification
        add_action('pre_get_posts', function($query) {
            if ($query->get('orderby') !== 'post_views') {
                return;
            }

            // Set meta query parameters
            $query->set('meta_key', 'post_views_count');
            $query->set('orderby', 'meta_value_num');

            // Default to DESC
            if (!$query->get('order')) {
                $query->set('order', 'DESC');
            }
        });
    }
}
```

**Workflow:**
1. User chọn "Post Views" trong Order By dropdown
2. Block gửi `orderby=post_views` trong query
3. `pre_get_posts` hook catch và convert thành meta query
4. WP_Query execute với `meta_key=post_views_count` và `orderby=meta_value_num`

## Best Practices

1. ✅ **Luôn return array** từ filter
2. ✅ **Dùng `__()` cho i18n** để support đa ngôn ngữ
3. ✅ **Kiểm tra existing values** trước khi thêm để tránh duplicate
4. ✅ **Dùng priority cao** (>10) nếu muốn override default options
5. ✅ **Document các custom options** cho team

## Troubleshooting

**Q: Options không hiển thị trong editor?**

A: Kiểm tra:
1. Filter có chạy trong `admin_head` hook không?
2. JavaScript console có `window.jankxQueryOptions` không?
3. Clear browser cache

**Q: Thêm option nhưng query không hoạt động?**

A: Custom order by options cần implement thêm logic trong `WP_Query`. Sử dụng filter `posts_orderby` hoặc `pre_get_posts`.

**Q: Làm sao để remove tất cả options và tạo lại từ đầu?**

A:
```php
add_filter('jankx/gutenberg/query-options/order-by', function($options) {
    return [
        ['value' => 'date', 'label' => 'Date'],
        ['value' => 'title', 'label' => 'Title'],
    ];
}, 999); // Priority cao nhất
```

## See Also

- [WP_Query Order & Orderby Parameters](https://developer.wordpress.org/reference/classes/wp_query/#order-orderby-parameters)
- [WP_Query Meta Query](https://developer.wordpress.org/reference/classes/wp_query/#custom-field-post-meta-parameters)
- [WP_Query Tax Query](https://developer.wordpress.org/reference/classes/wp_query/#taxonomy-parameters)

