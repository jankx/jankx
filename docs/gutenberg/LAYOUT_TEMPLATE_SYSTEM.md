# Jankx Layout Template System

## Overview

Jankx Layout Template System provides a flexible and powerful way to manage layout rendering and customization. It allows developers to create reusable templates with variables, blocks, and conditional rendering.

## Architecture

### Core Components

1. **LayoutTemplate** - Main class for managing templates and their rendering
2. **Template Facade** - Easy access to template functionality
3. **HTML Templates** - PHP-based template files
4. **Block Templates** - Individual block templates within layouts

### Template Structure

```php
Template::register('hero-section', [
    'name' => 'Hero Section',
    'description' => 'A prominent hero section',
    'template' => 'hero-section.html',
    'variables' => [
        'title' => '',
        'description' => '',
        'buttonText' => 'Learn More',
        'buttonUrl' => '#',
        'backgroundImage' => '',
        'overlay' => false
    ],
    'blocks' => [
        'hero-title' => [
            'required' => true,
            'order' => 1,
            'template' => 'blocks/hero-title.html'
        ],
        'hero-description' => [
            'required' => false,
            'order' => 2,
            'template' => 'blocks/hero-description.html'
        ]
    ]
]);
```

## Template Types

### 1. Layout Templates
Complete layout templates that render entire sections:

- **hero-section.html** - Hero section with background image
- **testimonial.html** - Testimonial with quote and author
- **feature-grid.html** - Grid of feature items
- **contact-form.html** - Contact form with validation

### 2. Block Templates
Individual block templates within layouts:

- **blocks/hero-title.html** - Hero title block
- **blocks/hero-description.html** - Hero description block
- **blocks/hero-button.html** - Hero button block

## Template Variables

### Default Variables

Each template has access to default variables:

```php
'variables' => [
    'title' => '',
    'description' => '',
    'buttonText' => 'Learn More',
    'buttonUrl' => '#',
    'backgroundImage' => '',
    'overlay' => false
]
```

### Option Variables

Templates automatically receive option values:

```php
// From Layout Options
$optionValues = [
    'alignment' => 'center',
    'spacing' => 'loose',
    'background' => 'primary',
    'textColor' => '#ffffff'
];
```

### Custom Variables

You can add custom variables to templates:

```php
'variables' => [
    'customField' => 'Custom Value',
    'dynamicData' => function() {
        return get_dynamic_data();
    }
]
```

## Template Rendering

### Basic Rendering

```php
// Render a layout template
$attributes = [
    'title' => 'Welcome to Our Site',
    'description' => 'Discover amazing features',
    'buttonText' => 'Get Started',
    'buttonUrl' => '#'
];

$html = Template::render('hero-section', $attributes, $content);
```

### Block Rendering

```php
// Render a specific block
$blockConfig = [
    'required' => true,
    'order' => 1,
    'template' => 'blocks/hero-title.html'
];

$variables = [
    'title' => 'Welcome to Our Site',
    'fontSize' => 'large',
    'textColor' => '#ffffff'
];

$blockHtml = Template::renderBlock('hero-title', $blockConfig, $variables);
```

### All Blocks Rendering

```php
// Render all blocks for a layout
$allBlocksHtml = Template::renderBlocks('hero-section', $variables);
```

## HTML Template Files

### Template File Structure

```
templates/
├── layouts/
│   ├── hero-section.html
│   ├── testimonial.html
│   ├── feature-grid.html
│   ├── contact-form.html
│   └── blocks/
│       ├── hero-title.html
│       ├── hero-description.html
│       └── hero-button.html
```

### Template File Example

```php
<?php
/**
 * Hero Section Template
 *
 * Variables available: $title, $description, $buttonText, $buttonUrl, $backgroundImage, $overlay
 */
?>

<div class="jankx-hero-section">
    <?php if (!empty($backgroundImage)): ?>
        <div class="jankx-hero-background">
            <img src="<?php echo esc_url($backgroundImage); ?>" alt="" class="jankx-hero-bg-image">
            <?php if ($overlay): ?>
                <div class="jankx-hero-overlay"></div>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <div class="jankx-hero-content">
        <div class="jankx-hero-container">
            <?php if (!empty($title)): ?>
                <h1 class="jankx-hero-title"><?php echo esc_html($title); ?></h1>
            <?php endif; ?>

            <?php if (!empty($description)): ?>
                <p class="jankx-hero-description"><?php echo esc_html($description); ?></p>
            <?php endif; ?>

            <?php if (!empty($buttonText)): ?>
                <div class="jankx-hero-actions">
                    <a href="<?php echo esc_url($buttonUrl ?? '#'); ?>" class="jankx-hero-button">
                        <?php echo esc_html($buttonText); ?>
                    </a>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>
```

## Block Templates

### Block Template Example

```php
<?php
/**
 * Hero Title Block Template
 *
 * Variables available: $title, $fontSize, $textColor, $alignment
 */
?>

<?php if (!empty($title)): ?>
    <h1 class="jankx-hero-title jankx-font-size-<?php echo esc_attr($fontSize ?? 'large'); ?> jankx-text-<?php echo esc_attr($alignment ?? 'left'); ?>" <?php if (!empty($textColor)): ?>style="color: <?php echo esc_attr($textColor); ?>;"<?php endif; ?>>
        <?php echo esc_html($title); ?>
    </h1>
<?php endif; ?>
```

## Template Management

### Register Templates

```php
use Jankx\Facades\Template;

// Register a new template
Template::register('custom-layout', [
    'name' => 'Custom Layout',
    'description' => 'A custom layout template',
    'template' => 'custom-layout.html',
    'variables' => [
        'customField' => '',
        'anotherField' => ''
    ],
    'blocks' => [
        'custom-block' => [
            'required' => true,
            'order' => 1,
            'template' => 'blocks/custom-block.html'
        ]
    ]
]);
```

### Get Template Information

```php
// Get all templates
$allTemplates = Template::all();

// Get specific template
$template = Template::get('hero-section');

// Check if template exists
if (Template::has('hero-section')) {
    // Template exists
}

// Get template variables
$variables = Template::getVariables('hero-section', $attributes);

// Get template blocks
$blocks = Template::getBlocks('hero-section');

// Check if template has specific block
if (Template::hasBlock('hero-section', 'hero-title')) {
    // Block exists
}

// Get block configuration
$blockConfig = Template::getBlock('hero-section', 'hero-title');
```

## Integration with Layout Options

### Automatic CSS Generation

Templates automatically receive CSS classes and styles from Layout Options:

```php
// In template file
<div class="jankx-layout jankx-layout-hero-section <?php echo esc_attr($classes); ?>" style="<?php echo esc_attr($styles); ?>">
    <!-- Template content -->
</div>
```

### Option Variables

Template variables are automatically merged with option values:

```php
// Template variables + Option values + Attributes
$variables = array_merge($template['variables'], $optionValues, $attributes);
```

## Advanced Features

### Conditional Blocks

Blocks can be conditional based on variables:

```php
'blocks' => [
    'conditional-block' => [
        'required' => false,
        'order' => 1,
        'template' => 'blocks/conditional-block.html',
        'condition' => [
            'variable' => 'showBlock',
            'value' => true
        ]
    ]
]
```

### Dynamic Templates

Templates can be created dynamically:

```php
// Create template based on data
$templateConfig = [
    'name' => 'Dynamic Template',
    'template' => 'dynamic-template.html',
    'variables' => $dynamicVariables,
    'blocks' => $dynamicBlocks
];

Template::register('dynamic-' . $id, $templateConfig);
```

### Template Inheritance

Templates can inherit from other templates:

```php
// Base template
Template::register('base-layout', [
    'template' => 'base-layout.html',
    'variables' => ['title', 'content'],
    'blocks' => ['header', 'content', 'footer']
]);

// Extended template
Template::register('extended-layout', [
    'extends' => 'base-layout',
    'template' => 'extended-layout.html',
    'variables' => ['title', 'content', 'extraField'],
    'blocks' => ['header', 'content', 'extraBlock', 'footer']
]);
```

## Performance Features

### Template Caching

Templates can be cached for better performance:

```php
// Cache template rendering
$cacheKey = 'jankx_template_' . md5($layoutName . serialize($attributes));
$cachedHtml = wp_cache_get($cacheKey);

if ($cachedHtml === false) {
    $cachedHtml = Template::render($layoutName, $attributes, $content);
    wp_cache_set($cacheKey, $cachedHtml, '', 3600);
}

echo $cachedHtml;
```

### Lazy Loading

Templates support lazy loading for better performance:

```php
// Lazy load template content
if ($lazyLoad) {
    echo '<div class="jankx-lazy-template" data-template="' . esc_attr($layoutName) . '" data-attributes="' . esc_attr(json_encode($attributes)) . '">';
    echo '<div class="jankx-loading">Loading...</div>';
    echo '</div>';
} else {
    echo Template::render($layoutName, $attributes, $content);
}
```

## Best Practices

### 1. Template Organization

Organize templates logically:

```
templates/
├── layouts/
│   ├── sections/
│   │   ├── hero-section.html
│   │   └── testimonial.html
│   ├── components/
│   │   ├── contact-form.html
│   │   └── feature-grid.html
│   └── blocks/
│       ├── hero/
│       │   ├── hero-title.html
│       │   └── hero-button.html
│       └── common/
│           ├── title.html
│           └── button.html
```

### 2. Variable Naming

Use descriptive variable names:

```php
// Good
'variables' => [
    'heroTitle' => '',
    'heroDescription' => '',
    'ctaButtonText' => ''
]

// Avoid
'variables' => [
    'title' => '',
    'desc' => '',
    'btn' => ''
]
```

### 3. Security

Always escape output in templates:

```php
// Good
<?php echo esc_html($title); ?>
<?php echo esc_url($buttonUrl); ?>
<?php echo esc_attr($className); ?>

// Avoid
<?php echo $title; ?>
<?php echo $buttonUrl; ?>
<?php echo $className; ?>
```

### 4. Conditional Rendering

Use conditional rendering for optional content:

```php
<?php if (!empty($title)): ?>
    <h1 class="jankx-title"><?php echo esc_html($title); ?></h1>
<?php endif; ?>

<?php if (!empty($description)): ?>
    <p class="jankx-description"><?php echo esc_html($description); ?></p>
<?php endif; ?>
```

## Future Enhancements

1. **Template Inheritance** - Templates that extend other templates
2. **Template Partials** - Reusable template parts
3. **Template Caching** - Built-in template caching
4. **Template Validation** - Validate template syntax
5. **Template Hot Reloading** - Auto-reload templates during development