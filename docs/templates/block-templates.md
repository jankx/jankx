# Block Templates Documentation

## Overview

Block templates trong Jankx 2.0 được sử dụng để render các Gutenberg blocks với PHP logic và dynamic content. Templates này cung cấp flexibility và customization options cho developers.

## Testimonial Block Template

### File Location
`templates/blocks/testimonial.html`

### Template Structure

```php
<?php
/**
 * Testimonial Block Template
 *
 * Available variables:
 * - $block_id: Unique block ID
 * - $class_name: CSS classes
 * - $content: Testimonial content
 * - $author: Author name
 * - $position: Author position
 * - $company: Author company
 * - $avatar_url: Avatar image URL
 * - $rating: Star rating (1-5)
 * - $style: Block style variant
 * - $alignment: Text alignment
 * - $show_avatar: Whether to show avatar
 * - $show_rating: Whether to show rating
 * - $background_color: Background color
 * - $text_color: Text color
 * - $style_attr: Inline styles
 */
?>
<div id="<?php echo esc_attr($block_id); ?>" class="<?php echo esc_attr($class_name); ?>"<?php echo $style_attr; ?>>
    <div class="jankx-testimonial-content">
        <!-- Rating Section -->
        <?php if ($show_rating && $rating > 0): ?>
            <div class="jankx-testimonial-rating">
                <?php for ($i = 1; $i <= 5; $i++): ?>
                    <span class="jankx-star <?php echo $i <= $rating ? 'filled' : 'empty'; ?>">★</span>
                <?php endfor; ?>
            </div>
        <?php endif; ?>

        <!-- Quote Content -->
        <blockquote class="jankx-testimonial-quote">
            <?php echo wp_kses_post($content); ?>
        </blockquote>

        <!-- Author Information -->
        <?php if ($author || $position || $company): ?>
            <div class="jankx-testimonial-author">
                <?php if ($show_avatar && $avatar_url): ?>
                    <div class="jankx-testimonial-avatar">
                        <img src="<?php echo esc_url($avatar_url); ?>" alt="<?php echo esc_attr($author); ?>" />
                    </div>
                <?php endif; ?>

                <div class="jankx-testimonial-author-info">
                    <?php if ($author): ?>
                        <div class="jankx-testimonial-author-name"><?php echo esc_html($author); ?></div>
                    <?php endif; ?>

                    <?php if ($position || $company): ?>
                        <div class="jankx-testimonial-author-meta">
                            <?php if ($position): ?>
                                <span class="jankx-testimonial-position"><?php echo esc_html($position); ?></span>
                            <?php endif; ?>

                            <?php if ($position && $company): ?>
                                <span class="jankx-testimonial-separator">, </span>
                            <?php endif; ?>

                            <?php if ($company): ?>
                                <span class="jankx-testimonial-company"><?php echo esc_html($company); ?></span>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>
```

### Variables Documentation

| Variable | Type | Description | Default |
|----------|------|-------------|---------|
| `$block_id` | string | Unique block identifier | Generated |
| `$class_name` | string | CSS classes for styling | `jankx-testimonial` |
| `$content` | string | Testimonial quote text | Empty |
| `$author` | string | Author name | Empty |
| `$position` | string | Author position/title | Empty |
| `$company` | string | Author company | Empty |
| `$avatar_url` | string | Avatar image URL | Empty |
| `$rating` | integer | Star rating (1-5) | 0 |
| `$style` | string | Block style variant | `default` |
| `$alignment` | string | Text alignment | `left` |
| `$show_avatar` | boolean | Show avatar image | `true` |
| `$show_rating` | boolean | Show star rating | `true` |
| `$background_color` | string | Background color | Empty |
| `$text_color` | string | Text color | Empty |
| `$style_attr` | string | Inline styles | Empty |

### Features

#### 1. Star Rating System
```php
<?php if ($show_rating && $rating > 0): ?>
    <div class="jankx-testimonial-rating">
        <?php for ($i = 1; $i <= 5; $i++): ?>
            <span class="jankx-star <?php echo $i <= $rating ? 'filled' : 'empty'; ?>">★</span>
        <?php endfor; ?>
    </div>
<?php endif; ?>
```

**CSS Classes:**
- `.jankx-star.filled`: Filled star styling
- `.jankx-star.empty`: Empty star styling

#### 2. Avatar Support
```php
<?php if ($show_avatar && $avatar_url): ?>
    <div class="jankx-testimonial-avatar">
        <img src="<?php echo esc_url($avatar_url); ?>" alt="<?php echo esc_attr($author); ?>" />
    </div>
<?php endif; ?>
```

**Features:**
- Conditional display
- Alt text for accessibility
- URL escaping for security

#### 3. Author Information
```php
<div class="jankx-testimonial-author-info">
    <?php if ($author): ?>
        <div class="jankx-testimonial-author-name"><?php echo esc_html($author); ?></div>
    <?php endif; ?>

    <?php if ($position || $company): ?>
        <div class="jankx-testimonial-author-meta">
            <!-- Position and company with separator -->
        </div>
    <?php endif; ?>
</div>
```

### Styling Options

#### 1. Alignment Classes
```css
.jankx-testimonial.text-left { text-align: left; }
.jankx-testimonial.text-center { text-align: center; }
.jankx-testimonial.text-right { text-align: right; }
```

#### 2. Style Variants
```css
.jankx-testimonial.style-default { /* Default styling */ }
.jankx-testimonial.style-minimal { /* Minimal styling */ }
.jankx-testimonial.style-card { /* Card styling */ }
.jankx-testimonial.style-quote { /* Quote styling */ }
```

#### 3. Rating Stars
```css
.jankx-star.filled {
    color: #ffd700;
}

.jankx-star.empty {
    color: #e0e0e0;
}
```

### Usage Examples

#### 1. Basic Testimonial
```php
$variables = [
    'content' => 'Amazing product! Highly recommended.',
    'author' => 'John Doe',
    'position' => 'CEO',
    'company' => 'Tech Corp',
    'rating' => 5,
    'show_rating' => true,
    'show_avatar' => false
];
```

#### 2. Testimonial with Avatar
```php
$variables = [
    'content' => 'Great service and support.',
    'author' => 'Jane Smith',
    'position' => 'Marketing Manager',
    'company' => 'Digital Agency',
    'avatar_url' => 'https://example.com/avatar.jpg',
    'rating' => 4,
    'show_avatar' => true,
    'show_rating' => true
];
```

#### 3. Minimal Testimonial
```php
$variables = [
    'content' => 'Simple and effective.',
    'author' => 'Bob Wilson',
    'style' => 'minimal',
    'show_rating' => false,
    'show_avatar' => false
];
```

### Customization

#### 1. Adding Custom Variables
```php
// In your block registration
function jankx_custom_testimonial_variables($variables) {
    $variables['custom_field'] = get_post_meta(get_the_ID(), 'custom_field', true);
    return $variables;
}
add_filter('jankx_testimonial_variables', 'jankx_custom_testimonial_variables');
```

#### 2. Custom Styling
```php
// Add custom CSS classes
$variables['class_name'] .= ' custom-testimonial-style';
```

#### 3. Conditional Logic
```php
<?php if ($custom_condition): ?>
    <div class="jankx-custom-element">
        <?php echo esc_html($custom_content); ?>
    </div>
<?php endif; ?>
```

### Security Considerations

#### 1. Output Escaping
```php
// Always escape output
echo esc_html($user_input);
echo esc_attr($attribute_value);
echo esc_url($url);
```

#### 2. Content Sanitization
```php
// Use wp_kses_post for HTML content
echo wp_kses_post($content);
```

#### 3. Input Validation
```php
// Validate rating
$rating = intval($rating);
if ($rating < 1 || $rating > 5) {
    $rating = 0;
}
```

### Performance Optimization

#### 1. Conditional Loading
```php
// Only load avatar if needed
<?php if ($show_avatar && $avatar_url): ?>
    <!-- Avatar code -->
<?php endif; ?>
```

#### 2. Caching
```php
// Cache testimonial data
$cache_key = 'jankx_testimonial_' . $block_id;
$cached_content = wp_cache_get($cache_key);

if ($cached_content === false) {
    $cached_content = render_testimonial($variables);
    wp_cache_set($cache_key, $cached_content, 'jankx_testimonials', 3600);
}
```

### Accessibility Features

#### 1. Semantic HTML
```php
<blockquote class="jankx-testimonial-quote">
    <?php echo wp_kses_post($content); ?>
</blockquote>
```

#### 2. Alt Text
```php
<img src="<?php echo esc_url($avatar_url); ?>"
     alt="<?php echo esc_attr($author); ?>" />
```

#### 3. ARIA Labels
```php
<div class="jankx-testimonial-rating" role="img" aria-label="Rating: <?php echo $rating; ?> out of 5 stars">
    <!-- Stars -->
</div>
```

### Testing

#### 1. Unit Tests
```php
function test_testimonial_template() {
    $variables = [
        'content' => 'Test content',
        'author' => 'Test Author',
        'rating' => 5
    ];

    ob_start();
    include 'templates/blocks/testimonial.html';
    $output = ob_get_clean();

    $this->assertContains('Test content', $output);
    $this->assertContains('Test Author', $output);
}
```

#### 2. Integration Tests
```php
function test_testimonial_block_rendering() {
    $block = new TestimonialBlock();
    $attributes = ['content' => 'Test', 'author' => 'Author'];

    $output = $block->render($attributes);

    $this->assertContains('jankx-testimonial', $output);
}
```

## Next Steps

1. **Create additional block templates** for other block types
2. **Add more customization options** to existing templates
3. **Implement template caching** for better performance
4. **Add comprehensive testing** for all templates
5. **Create template documentation** for developers