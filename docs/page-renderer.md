# PageRenderer - Legacy Template Support

## Overview

PageRenderer là một class trong Jankx framework được thiết kế để hỗ trợ legacy template cho WordPress, đặc biệt hữu ích cho các plugin như bbPress chưa hỗ trợ Gutenberg.

## Features

- **Legacy Template Support**: Hỗ trợ template cũ của WordPress
- **Gutenberg Compatibility**: Tương thích với Gutenberg khi cần thiết
- **Template Hierarchy**: Tự động xây dựng template hierarchy
- **Context Detection**: Tự động detect page context
- **Plugin Compatibility**: Tương thích với các plugin chưa hỗ trợ Gutenberg

## Usage

### Basic Usage

```php
// Get PageRenderer instance
$renderer = jankx_page_renderer();

// Set context and render
$renderer->setContext('single');
$renderer->render();
```

### Using Helper Functions

```php
// Render a single post page
jankx_render_page('single');

// Render with custom templates
jankx_render_page('archive', ['custom-archive', 'archive']);

// Check if Gutenberg is supported
if (jankx_is_support_block_template()) {
    // Use Gutenberg templates
} else {
    // Use legacy templates
}
```

### Template Hierarchy

PageRenderer tự động xây dựng template hierarchy dựa trên context:

- **Single**: `single-{post_type}`, `single`, `index`
- **Archive**: `archive-{post_type}`, `archive`, `index`
- **Category**: `category-{slug}`, `category-{id}`, `category`, `index`
- **Tag**: `tag-{slug}`, `tag-{id}`, `tag`, `index`
- **Author**: `author-{nicename}`, `author-{id}`, `author`, `index`
- **Taxonomy**: `taxonomy-{taxonomy}-{slug}`, `taxonomy-{taxonomy}`, `taxonomy`, `index`

## Configuration

### Enable/Disable Legacy Template

```php
// Disable legacy template loading
add_filter('jankx/legacy/template/enabled', '__return_false');
```

### Custom Template Hierarchy

```php
// Customize template hierarchy
add_filter('jankx/legacy/template/hierarchy', function($templates, $context) {
    if ($context === 'single') {
        array_unshift($templates, 'custom-single');
    }
    return $templates;
}, 10, 2);
```

## Integration with Plugins

### bbPress Integration

PageRenderer tự động detect và hỗ trợ bbPress templates:

```php
// bbPress templates sẽ được load thông qua legacy system
// khi plugin chưa hỗ trợ Gutenberg
```

### WooCommerce Integration

```php
// WooCommerce product pages
jankx_render_page('single', ['single-product', 'single']);

// WooCommerce shop pages
jankx_render_page('archive', ['archive-product', 'archive']);
```

## Hooks and Filters

### Action Hooks

- `jankx/template/page/render/start` - Before page render
- `jankx/template/page/render/end` - After page render
- `jankx/template/page/content/before` - Before content render
- `jankx/template/page/content/after` - After content render

### Filter Hooks

- `jankx/template/page/template_names` - Customize template names
- `jankx/template/page/{context}/data` - Customize template data
- `jankx/legacy/template/enabled` - Enable/disable legacy template
- `jankx/legacy/template/hierarchy` - Customize template hierarchy

## Examples

### Custom Single Post Template

```php
// In your theme's functions.php
add_action('jankx/template/page/content/before', function($context, $templates) {
    if ($context === 'single' && in_array('single-post', $templates)) {
        // Custom logic for single post
        echo '<div class="custom-single-wrapper">';
    }
}, 10, 2);

add_action('jankx/template/page/content/after', function($context, $templates) {
    if ($context === 'single' && in_array('single-post', $templates)) {
        echo '</div>';
    }
}, 10, 2);
```

### Custom Archive Template

```php
// Customize archive template data
add_filter('jankx/template/page/archive/data', function($data) {
    $data['custom_archive_data'] = 'Custom archive data';
    return $data;
});
```

## Best Practices

1. **Use Helper Functions**: Sử dụng helper functions thay vì trực tiếp gọi class
2. **Check Gutenberg Support**: Luôn check `jankx_is_support_block_template()` trước khi render
3. **Customize via Hooks**: Sử dụng hooks và filters để customize thay vì modify core code
4. **Template Hierarchy**: Hiểu rõ template hierarchy để tạo templates phù hợp

## Troubleshooting

### Template Not Found

```php
// Check if template exists
$templates = jankx_page_renderer()->getTemplateHierarchy();
var_dump($templates);
```

### Gutenberg Not Working

```php
// Check Gutenberg support
if (!jankx_is_support_block_template()) {
    // Use legacy templates
    jankx_render_page('single');
}
```

### Plugin Compatibility Issues

```php
// Disable legacy template for specific plugins
add_filter('jankx/legacy/template/enabled', function($enabled) {
    if (is_plugin_active('some-plugin/some-plugin.php')) {
        return false;
    }
    return $enabled;
});
```
