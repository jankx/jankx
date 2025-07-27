# Pattern Library - Jankx 2.0

## Overview

Jankx 2.0 Pattern Library cung cấp collection các Gutenberg patterns được thiết kế đặc biệt cho post layouts. Patterns được tổ chức theo categories và có thể được sử dụng với Dynamic Query Loop.

## Pattern Categories

| Category | Description |
|----------|-------------|
| `jankx-post-layouts` | Patterns cơ bản cho hiển thị posts |
| `jankx-card-layouts` | Patterns cho card-based layouts |
| `jankx-grid-layouts` | Patterns cho grid-based layouts |
| `jankx-hero-layouts` | Patterns cho hero sections |
| `jankx-carousel-layouts` | Patterns cho carousel/slider layouts |
| `jankx-tabs-layouts` | Patterns cho tabbed layouts |

## Core Patterns

### 1. Basic Post Card

```php
register_block_pattern(
    'jankx/post-card',
    [
        'title' => 'Post Card',
        'categories' => ['jankx-post-layouts', 'jankx-card-layouts'],
        'content' => '<!-- wp:group {"className":"jankx-post-card"} -->
<div class="wp-block-group jankx-post-card">
    <!-- wp:post-featured-image {"className":"jankx-card-image","linkTarget":"_blank"} /-->
    <!-- wp:group {"className":"jankx-card-content"} -->
    <div class="wp-block-group jankx-card-content">
        <!-- wp:post-title {"className":"jankx-card-title","level":3,"linkTarget":"_blank"} /-->
        <!-- wp:post-excerpt {"className":"jankx-card-excerpt","moreText":"Read More"} /-->
        <!-- wp:post-date {"className":"jankx-card-date"} /-->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->',
        'keywords' => ['post', 'card', 'jankx'],
    ]
);
```

### 2. Post Card with Meta

```php
register_block_pattern(
    'jankx/post-card-meta',
    [
        'title' => 'Post Card with Meta',
        'categories' => ['jankx-post-layouts', 'jankx-card-layouts'],
        'content' => '<!-- wp:group {"className":"jankx-post-card-meta"} -->
<div class="wp-block-group jankx-post-card-meta">
    <!-- wp:post-featured-image {"className":"jankx-card-image","linkTarget":"_blank"} /-->
    <!-- wp:group {"className":"jankx-card-content"} -->
    <div class="wp-block-group jankx-card-content">
        <!-- wp:post-title {"className":"jankx-card-title","level":3,"linkTarget":"_blank"} /-->
        <!-- wp:post-excerpt {"className":"jankx-card-excerpt","moreText":"Read More"} /-->
        <!-- wp:group {"className":"jankx-card-meta"} -->
        <div class="wp-block-group jankx-card-meta">
            <!-- wp:post-date {"className":"jankx-card-date"} /-->
            <!-- wp:post-terms {"term":"category","className":"jankx-card-category"} /-->
            <!-- wp:post-author {"className":"jankx-card-author"} /-->
        </div>
        <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->',
        'keywords' => ['post', 'card', 'meta', 'jankx'],
    ]
);
```

### 3. Hero Post Layout

```php
register_block_pattern(
    'jankx/hero-post',
    [
        'title' => 'Hero Post Layout',
        'categories' => ['jankx-post-layouts', 'jankx-hero-layouts'],
        'content' => '<!-- wp:group {"className":"jankx-hero-post"} -->
<div class="wp-block-group jankx-hero-post">
    <!-- wp:post-featured-image {"className":"jankx-hero-image","linkTarget":"_blank"} /-->
    <!-- wp:group {"className":"jankx-hero-content"} -->
    <div class="wp-block-group jankx-hero-content">
        <!-- wp:post-title {"className":"jankx-hero-title","level":1,"linkTarget":"_blank"} /-->
        <!-- wp:post-excerpt {"className":"jankx-hero-excerpt"} /-->
        <!-- wp:buttons {"className":"jankx-hero-buttons"} -->
        <div class="wp-block-buttons jankx-hero-buttons">
            <!-- wp:button {"className":"jankx-hero-button"} -->
            <div class="wp-block-button jankx-hero-button">
                <a class="wp-block-button__link">Read More</a>
            </div>
            <!-- /wp:button -->
        </div>
        <!-- /wp:buttons -->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->',
        'keywords' => ['post', 'hero', 'jankx'],
    ]
);
```

## Grid Layout Patterns

### 1. 2-Column Grid

```php
register_block_pattern(
    'jankx/grid-2-columns',
    [
        'title' => '2-Column Grid',
        'categories' => ['jankx-post-layouts', 'jankx-grid-layouts'],
        'content' => '<!-- wp:columns {"className":"jankx-grid-2"} -->
<div class="wp-block-columns jankx-grid-2">
    <!-- wp:column {"className":"jankx-grid-column"} -->
    <div class="wp-block-column jankx-grid-column">
        <!-- wp:post-featured-image {"className":"jankx-grid-image","linkTarget":"_blank"} /-->
        <!-- wp:post-title {"className":"jankx-grid-title","level":3,"linkTarget":"_blank"} /-->
        <!-- wp:post-excerpt {"className":"jankx-grid-excerpt"} /-->
    </div>
    <!-- /wp:column -->
    <!-- wp:column {"className":"jankx-grid-column"} -->
    <div class="wp-block-column jankx-grid-column">
        <!-- wp:post-featured-image {"className":"jankx-grid-image","linkTarget":"_blank"} /-->
        <!-- wp:post-title {"className":"jankx-grid-title","level":3,"linkTarget":"_blank"} /-->
        <!-- wp:post-excerpt {"className":"jankx-grid-excerpt"} /-->
    </div>
    <!-- /wp:column -->
</div>
<!-- /wp:columns -->',
        'keywords' => ['grid', '2-columns', 'jankx'],
    ]
);
```

### 2. 3-Column Grid

```php
register_block_pattern(
    'jankx/grid-3-columns',
    [
        'title' => '3-Column Grid',
        'categories' => ['jankx-post-layouts', 'jankx-grid-layouts'],
        'content' => '<!-- wp:columns {"className":"jankx-grid-3"} -->
<div class="wp-block-columns jankx-grid-3">
    <!-- wp:column {"className":"jankx-grid-column"} -->
    <div class="wp-block-column jankx-grid-column">
        <!-- wp:post-featured-image {"className":"jankx-grid-image","linkTarget":"_blank"} /-->
        <!-- wp:post-title {"className":"jankx-grid-title","level":4,"linkTarget":"_blank"} /-->
        <!-- wp:post-excerpt {"className":"jankx-grid-excerpt"} /-->
    </div>
    <!-- /wp:column -->
    <!-- wp:column {"className":"jankx-grid-column"} -->
    <div class="wp-block-column jankx-grid-column">
        <!-- wp:post-featured-image {"className":"jankx-grid-image","linkTarget":"_blank"} /-->
        <!-- wp:post-title {"className":"jankx-grid-title","level":4,"linkTarget":"_blank"} /-->
        <!-- wp:post-excerpt {"className":"jankx-grid-excerpt"} /-->
    </div>
    <!-- /wp:column -->
    <!-- wp:column {"className":"jankx-grid-column"} -->
    <div class="wp-block-column jankx-grid-column">
        <!-- wp:post-featured-image {"className":"jankx-grid-image","linkTarget":"_blank"} /-->
        <!-- wp:post-title {"className":"jankx-grid-title","level":4,"linkTarget":"_blank"} /-->
        <!-- wp:post-excerpt {"className":"jankx-grid-excerpt"} /-->
    </div>
    <!-- /wp:column -->
</div>
<!-- /wp:columns -->',
        'keywords' => ['grid', '3-columns', 'jankx'],
    ]
);
```

## Carousel Patterns

### 1. Basic Carousel

```php
register_block_pattern(
    'jankx/carousel-basic',
    [
        'title' => 'Basic Carousel',
        'categories' => ['jankx-post-layouts', 'jankx-carousel-layouts'],
        'content' => '<!-- wp:group {"className":"jankx-carousel-basic"} -->
<div class="wp-block-group jankx-carousel-basic">
    <!-- wp:group {"className":"jankx-carousel-container"} -->
    <div class="wp-block-group jankx-carousel-container">
        <!-- wp:post-featured-image {"className":"jankx-carousel-image","linkTarget":"_blank"} /-->
        <!-- wp:group {"className":"jankx-carousel-content"} -->
        <div class="wp-block-group jankx-carousel-content">
            <!-- wp:post-title {"className":"jankx-carousel-title","level":2,"linkTarget":"_blank"} /-->
            <!-- wp:post-excerpt {"className":"jankx-carousel-excerpt"} /-->
        </div>
        <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
    <!-- wp:buttons {"className":"jankx-carousel-nav"} -->
    <div class="wp-block-buttons jankx-carousel-nav">
        <!-- wp:button {"className":"jankx-carousel-prev"} -->
        <div class="wp-block-button jankx-carousel-prev">
            <a class="wp-block-button__link">Previous</a>
        </div>
        <!-- /wp:button -->
        <!-- wp:button {"className":"jankx-carousel-next"} -->
        <div class="wp-block-button jankx-carousel-next">
            <a class="wp-block-button__link">Next</a>
        </div>
        <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->
</div>
<!-- /wp:group -->',
        'keywords' => ['carousel', 'slider', 'jankx'],
    ]
);
```

## Tabs Patterns

### 1. Basic Tabs

```php
register_block_pattern(
    'jankx/tabs-basic',
    [
        'title' => 'Basic Tabs',
        'categories' => ['jankx-post-layouts', 'jankx-tabs-layouts'],
        'content' => '<!-- wp:group {"className":"jankx-tabs-basic"} -->
<div class="wp-block-group jankx-tabs-basic">
    <!-- wp:group {"className":"jankx-tabs-nav"} -->
    <div class="wp-block-group jankx-tabs-nav">
        <!-- wp:buttons {"className":"jankx-tab-buttons"} -->
        <div class="wp-block-buttons jankx-tab-buttons">
            <!-- wp:button {"className":"jankx-tab-button active"} -->
            <div class="wp-block-button jankx-tab-button active">
                <a class="wp-block-button__link">Tab 1</a>
            </div>
            <!-- /wp:button -->
            <!-- wp:button {"className":"jankx-tab-button"} -->
            <div class="wp-block-button jankx-tab-button">
                <a class="wp-block-button__link">Tab 2</a>
            </div>
            <!-- /wp:button -->
        </div>
        <!-- /wp:buttons -->
    </div>
    <!-- /wp:group -->
    <!-- wp:group {"className":"jankx-tabs-content"} -->
    <div class="wp-block-group jankx-tabs-content">
        <!-- wp:group {"className":"jankx-tab-panel active"} -->
        <div class="wp-block-group jankx-tab-panel active">
            <!-- wp:post-featured-image {"className":"jankx-tab-image","linkTarget":"_blank"} /-->
            <!-- wp:post-title {"className":"jankx-tab-title","level":3,"linkTarget":"_blank"} /-->
            <!-- wp:post-excerpt {"className":"jankx-tab-excerpt"} /-->
        </div>
        <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->',
        'keywords' => ['tabs', 'jankx'],
    ]
);
```

## Pattern Registration System

### 1. Pattern Categories Registration

```php
function jankx_register_pattern_categories() {
    register_block_pattern_category(
        'jankx-post-layouts',
        ['label' => 'Jankx Post Layouts']
    );

    register_block_pattern_category(
        'jankx-card-layouts',
        ['label' => 'Jankx Card Layouts']
    );

    register_block_pattern_category(
        'jankx-grid-layouts',
        ['label' => 'Jankx Grid Layouts']
    );

    register_block_pattern_category(
        'jankx-hero-layouts',
        ['label' => 'Jankx Hero Layouts']
    );

    register_block_pattern_category(
        'jankx-carousel-layouts',
        ['label' => 'Jankx Carousel Layouts']
    );

    register_block_pattern_category(
        'jankx-tabs-layouts',
        ['label' => 'Jankx Tabs Layouts']
    );
}
add_action('init', 'jankx_register_pattern_categories');
```

### 2. Pattern Registration Helper

```php
class Jankx_Pattern_Registry {
    private $patterns = [];

    public function register_pattern($name, $config) {
        $this->patterns[$name] = $config;
        register_block_pattern($name, $config);
    }

    public function get_pattern($name) {
        return $this->patterns[$name] ?? null;
    }

    public function get_patterns_by_category($category) {
        return array_filter($this->patterns, function($pattern) use ($category) {
            return in_array($category, $pattern['categories']);
        });
    }

    public function register_all_patterns() {
        // Register all patterns
        foreach ($this->patterns as $name => $config) {
            register_block_pattern($name, $config);
        }
    }
}
```

## Pattern Customization

### 1. Pattern Variables

```php
function jankx_pattern_variables($pattern_content, $post_id) {
    $variables = [
        '{{post_title}}' => get_the_title($post_id),
        '{{post_excerpt}}' => get_the_excerpt($post_id),
        '{{post_date}}' => get_the_date('', $post_id),
        '{{post_author}}' => get_the_author_meta('display_name', get_post_field('post_author', $post_id)),
        '{{post_permalink}}' => get_permalink($post_id),
        '{{featured_image}}' => get_the_post_thumbnail_url($post_id, 'medium'),
    ];

    return str_replace(array_keys($variables), array_values($variables), $pattern_content);
}
```

### 2. Pattern Styling

```php
function jankx_pattern_styles() {
    wp_register_style(
        'jankx-patterns',
        get_template_directory_uri() . '/assets/css/patterns.css',
        [],
        \Jankx\Jankx::getFrameworkVersion()
    );

    // Add pattern-specific styles
    wp_add_inline_style('jankx-patterns', '
        .jankx-post-card {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.2s ease;
        }

        .jankx-post-card:hover {
            transform: translateY(-2px);
        }

        .jankx-grid-2 {
            gap: 2rem;
        }

        .jankx-grid-3 {
            gap: 1.5rem;
        }
    ');
}
add_action('wp_enqueue_scripts', 'jankx_pattern_styles');
```

## Pattern Development

### 1. Creating Custom Patterns

```php
function jankx_create_custom_pattern($name, $content, $category = 'jankx-post-layouts') {
    register_block_pattern(
        'jankx/' . $name,
        [
            'title' => ucfirst(str_replace('-', ' ', $name)),
            'categories' => [$category],
            'content' => $content,
            'keywords' => ['jankx', $name],
        ]
    );
}
```

### 2. Pattern Validation

```php
function jankx_validate_pattern($content) {
    // Check for required blocks
    $required_blocks = ['core/post-title', 'core/post-excerpt'];

    foreach ($required_blocks as $block) {
        if (strpos($content, $block) === false) {
            return false;
        }
    }

    return true;
}
```

### 3. Pattern Testing

```php
function jankx_test_pattern($pattern_name, $post_id) {
    $pattern = get_block_pattern($pattern_name);
    if (!$pattern) {
        return false;
    }

    // Test pattern rendering
    $rendered = jankx_render_pattern_for_post($pattern_name, $post_id);

    return !empty($rendered);
}
```

## Best Practices

### 1. Pattern Design

| Principle | Description |
|-----------|-------------|
| **Keep patterns simple** | Focus on core functionality |
| **Use semantic HTML** | Proper heading levels, alt text, etc. |
| **Responsive design** | Mobile-first approach |
| **Accessibility** | ARIA labels, keyboard navigation |

### 2. Performance

| Optimization | Description |
|-------------|-------------|
| **Optimize images** | Use appropriate image sizes |
| **Minimize CSS** | Use utility classes when possible |
| **Lazy loading** | Implement for images and content |
| **Caching** | Cache pattern rendering when appropriate |

### 3. Maintainability

| Practice | Description |
|----------|-------------|
| **Consistent naming** | Use clear, descriptive names |
| **Documentation** | Comment complex patterns |
| **Version control** | Track pattern changes |
| **Testing** | Test patterns across different scenarios |

### 4. Extensibility

| Feature | Description |
|---------|-------------|
| **Modular design** | Break complex patterns into smaller parts |
| **Variable support** | Use placeholders for dynamic content |
| **Customization options** | Allow for easy modification |
| **Plugin support** | Design for third-party extensions |