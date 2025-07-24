# Templates Documentation - Jankx 2.0

## Overview

Jankx 2.0 sử dụng hệ thống templates hiện đại với Gutenberg block templates và PHP templates. Tài liệu này mô tả chi tiết cấu trúc và cách sử dụng các templates trong Jankx.

## Template Structure

### 1. Block Templates (HTML)

Block templates được viết bằng HTML với Gutenberg block markup và được lưu trong thư mục `templates/`.

#### Cấu trúc thư mục:
```
templates/
├── 404.html              # 404 error page
├── archive.html          # Archive pages
├── front-page.html       # Front page
├── home.html            # Blog home page
├── index.html           # Default template
├── page.html            # Static pages
├── search.html          # Search results
├── single.html          # Single post
├── blocks/              # Block templates
│   └── testimonial.html
└── layouts/             # Layout templates
    ├── blocks/
    │   ├── hero-button.html
    │   ├── hero-description.html
    │   └── hero-title.html
    ├── contact-form.html
    ├── feature-grid.html
    ├── hero-section.html
    └── testimonial.html
```

### 2. PHP Templates

PHP templates được sử dụng cho các block và layout phức tạp, cung cấp logic và dynamic content.

## Block Templates

### 1. Testimonial Block

**File:** `templates/blocks/testimonial.html`

**Mô tả:** Template cho testimonial block với rating, avatar, và author information.

**Variables:**
- `$block_id`: Unique block ID
- `$class_name`: CSS classes
- `$content`: Testimonial content
- `$author`: Author name
- `$position`: Author position
- `$company`: Author company
- `$avatar_url`: Avatar image URL
- `$rating`: Star rating (1-5)
- `$style`: Block style variant
- `$alignment`: Text alignment
- `$show_avatar`: Whether to show avatar
- `$show_rating`: Whether to show rating
- `$background_color`: Background color
- `$text_color`: Text color
- `$style_attr`: Inline styles

**Features:**
- ✅ Star rating system
- ✅ Avatar support
- ✅ Author information
- ✅ Customizable styling
- ✅ Responsive design

## Layout Templates

### 1. Hero Section Layout

**File:** `templates/layouts/hero-section.html`

**Mô tả:** Hero section layout với background image, overlay, và content.

**Variables:**
- `$title`: Hero title
- `$description`: Hero description
- `$buttonText`: Button text
- `$buttonUrl`: Button URL
- `$backgroundImage`: Background image URL
- `$overlay`: Overlay overlay

**Features:**
- ✅ Background image support
- ✅ Overlay option
- ✅ Call-to-action button
- ✅ Responsive design

### 2. Contact Form Layout

**File:** `templates/layouts/contact-form.html`

**Mô tả:** Contact form layout với validation và contact information.

**Variables:**
- `$title`: Form title
- `$description`: Form description
- `$email`: Contact email
- `$phone`: Contact phone
- `$address`: Contact address
- `$successMessage`: Success message

**Features:**
- ✅ Form validation
- ✅ Contact information display
- ✅ Nonce security
- ✅ Responsive form fields

### 3. Feature Grid Layout

**File:** `templates/layouts/feature-grid.html`

**Mô tả:** Feature grid layout với icons, titles, và descriptions.

**Variables:**
- `$title`: Grid title
- `$description`: Grid description
- `$columns`: Number of columns
- `$features`: Array of features

**Features:**
- ✅ Dynamic grid columns
- ✅ Icon support
- ✅ Feature links
- ✅ Responsive grid

### 4. Testimonial Layout

**File:** `templates/layouts/testimonial.html`

**Mô tả:** Testimonial layout với quote, author, và rating.

**Variables:**
- `$quote`: Testimonial quote
- `$author`: Author name
- `$position`: Author position
- `$company`: Author company
- `$avatar`: Author avatar
- `$rating`: Star rating

**Features:**
- ✅ Star rating display
- ✅ Author information
- ✅ Avatar support
- ✅ Clean typography

## Layout Block Templates

### 1. Hero Title Block

**File:** `templates/layouts/blocks/hero-title.html`

**Mô tả:** Hero title block với customizable styling.

**Variables:**
- `$title`: Title text
- `$fontSize`: Font size (small, medium, large)
- `$textColor`: Text color
- `$alignment`: Text alignment

### 2. Hero Description Block

**File:** `templates/layouts/blocks/hero-description.html`

**Mô tả:** Hero description block với customizable styling.

**Variables:**
- `$description`: Description text
- `$fontSize`: Font size
- `$textColor`: Text color
- `$alignment`: Text alignment

### 3. Hero Button Block

**File:** `templates/layouts/blocks/hero-button.html`

**Mô tả:** Hero button block với customizable styling.

**Variables:**
- `$buttonText`: Button text
- `$buttonUrl`: Button URL
- `$alignment`: Button alignment

## Page Templates

### 1. Single Post Template

**File:** `templates/single.html`

**Mô tả:** Template cho single post pages.

**Features:**
- ✅ Post title
- ✅ Post content
- ✅ Post author
- ✅ Post date
- ✅ Categories
- ✅ Tags
- ✅ Comments

### 2. Archive Template

**File:** `templates/archive.html`

**Mô tả:** Template cho archive pages.

**Features:**
- ✅ Archive title
- ✅ Post list
- ✅ Post excerpts
- ✅ Post dates

### 3. Front Page Template

**File:** `templates/front-page.html`

**Mô tả:** Template cho front page.

**Features:**
- ✅ Custom content
- ✅ Block editor support

### 4. 404 Template

**File:** `templates/404.html`

**Mô tả:** Template cho 404 error pages.

**Features:**
- ✅ Error message
- ✅ Search functionality

## Template Development

### 1. Creating New Block Templates

```php
<?php
/**
 * Custom Block Template
 *
 * Template for rendering custom blocks.
 * Variables available: $customVariable1, $customVariable2
 */
?>

<div class="jankx-custom-block">
    <?php if (!empty($customVariable1)): ?>
        <div class="jankx-custom-content">
            <?php echo esc_html($customVariable1); ?>
        </div>
    <?php endif; ?>
</div>
```

### 2. Creating New Layout Templates

```php
<?php
/**
 * Custom Layout Template
 *
 * Template for rendering custom layouts.
 * Variables available: $title, $description, $items
 */
?>

<div class="jankx-custom-layout">
    <?php if (!empty($title)): ?>
        <h2 class="jankx-custom-title"><?php echo esc_html($title); ?></h2>
    <?php endif; ?>

    <?php if (!empty($items) && is_array($items)): ?>
        <div class="jankx-custom-items">
            <?php foreach ($items as $item): ?>
                <div class="jankx-custom-item">
                    <?php echo esc_html($item); ?>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>
```

### 3. Template Best Practices

#### Security
- ✅ Always escape output with `esc_html()`, `esc_attr()`, `esc_url()`
- ✅ Use `wp_kses_post()` for HTML content
- ✅ Validate and sanitize input data
- ✅ Use nonces for forms

#### Performance
- ✅ Minimize database queries
- ✅ Use caching when appropriate
- ✅ Optimize images and assets
- ✅ Lazy load content when possible

#### Accessibility
- ✅ Use semantic HTML
- ✅ Include alt text for images
- ✅ Ensure keyboard navigation
- ✅ Maintain color contrast

#### Responsive Design
- ✅ Use mobile-first approach
- ✅ Test on multiple devices
- ✅ Optimize for different screen sizes
- ✅ Use flexible layouts

## Template Customization

### 1. Overriding Templates

Để override templates, tạo file trong child theme:

```
child-theme/
└── templates/
    ├── single.html
    ├── page.html
    └── layouts/
        └── custom-layout.html
```

### 2. Adding Custom Variables

```php
// In functions.php
function jankx_custom_template_variables($variables, $template_name) {
    if ($template_name === 'hero-section') {
        $variables['customVariable'] = 'Custom Value';
    }

    return $variables;
}
add_filter('jankx_template_variables', 'jankx_custom_template_variables', 10, 2);
```

### 3. Template Hooks

```php
// Before template render
do_action('jankx_before_template_render', $template_name, $variables);

// After template render
do_action('jankx_after_template_render', $template_name, $variables);

// Template specific hooks
do_action('jankx_before_hero_section', $variables);
do_action('jankx_after_hero_section', $variables);
```

## Template Debugging

### 1. Enable Template Debug

```php
// In wp-config.php
define('JANKX_TEMPLATE_DEBUG', true);
```

### 2. Template Debug Information

```php
// Show template variables
if (defined('JANKX_TEMPLATE_DEBUG') && JANKX_TEMPLATE_DEBUG) {
    echo '<pre>';
    print_r($variables);
    echo '</pre>';
}
```

### 3. Template Performance Monitoring

```php
function jankx_template_performance_monitor($template_name, $start_time) {
    $end_time = microtime(true);
    $execution_time = $end_time - $start_time;

    error_log("Jankx Template: {$template_name} took {$execution_time} seconds");
}
```

## Template Examples

### 1. Simple Block Template

```php
<?php
/**
 * Simple Block Template
 */
?>

<div class="jankx-simple-block">
    <h3><?php echo esc_html($title ?? 'Default Title'); ?></h3>
    <p><?php echo esc_html($description ?? 'Default description'); ?></p>
</div>
```

### 2. Complex Layout Template

```php
<?php
/**
 * Complex Layout Template
 */
?>

<div class="jankx-complex-layout">
    <header class="jankx-layout-header">
        <?php if (!empty($title)): ?>
            <h1><?php echo esc_html($title); ?></h1>
        <?php endif; ?>
    </header>

    <main class="jankx-layout-content">
        <?php if (!empty($items) && is_array($items)): ?>
            <div class="jankx-items-grid">
                <?php foreach ($items as $item): ?>
                    <div class="jankx-item">
                        <?php echo wp_kses_post($item); ?>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </main>

    <footer class="jankx-layout-footer">
        <?php if (!empty($footer_text)): ?>
            <p><?php echo esc_html($footer_text); ?></p>
        <?php endif; ?>
    </footer>
</div>
```

## Template Documentation Standards

### 1. File Header

Mỗi template file nên có header comment mô tả:

```php
<?php
/**
 * Template Name: Custom Template
 * Template Description: Description of what this template does
 *
 * Available variables:
 * - $variable1: Description of variable1
 * - $variable2: Description of variable2
 */
?>
```

### 2. Code Documentation

```php
// Always document complex logic
if ($condition) {
    // This condition handles specific edge case
    $result = process_edge_case($data);
} else {
    // Normal processing flow
    $result = process_normal_case($data);
}
```

### 3. Security Notes

```php
// Always escape output
echo esc_html($user_input);

// Use nonces for forms
wp_nonce_field('action_name', 'nonce_field');
```

## Next Steps

1. **Review existing templates** và identify areas for improvement
2. **Create new templates** cho specific use cases
3. **Optimize performance** của existing templates
4. **Add comprehensive testing** cho all templates
5. **Document custom templates** created by developers