# Jankx Layout Options System

## Overview

Jankx Layout Options System provides a flexible and extensible way to manage layout customization options. It allows developers to register options that can be used across different layouts, with support for various input types and validation.

## Architecture

### Core Components

1. **LayoutOptions** - Main class for managing options and their configurations
2. **Options Facade** - Easy access to options functionality
3. **React Components** - UI components for the Gutenberg editor
4. **GutenbergBootstrapper** - Integration with the Gutenberg system

### Option Types

The system supports various option types:

- **select** - Dropdown selection
- **range** - Numeric range slider
- **toggle** - Boolean toggle switch
- **color** - Color picker
- **image** - Media upload
- **text** - Text input

## Option Groups

Options are organized into logical groups:

### 1. Layout Group
- **alignment** - Text alignment (left, center, right)
- **width** - Layout width (narrow, default, wide, full)

### 2. Spacing Group
- **spacing** - General spacing (compact, default, loose)
- **padding** - Padding in pixels (0-100px)
- **margin** - Margin in pixels (0-100px)

### 3. Background Group
- **background** - Background color (none, light, dark, primary, secondary)
- **backgroundImage** - Background image URL
- **overlay** - Background overlay toggle

### 4. Typography Group
- **textColor** - Text color (hex value)
- **fontSize** - Font size (small, medium, large, xlarge)

### 5. Animation Group
- **animation** - Animation type (none, fadeIn, slideUp, slideDown, zoomIn)
- **animationDelay** - Animation delay in milliseconds

### 6. Performance Group
- **partialHydration** - AJAX loading toggle
- **lazyLoad** - Lazy loading toggle

## Usage Examples

### Register Default Options

```php
use Jankx\Facades\Options;

// Register a new option group
Options::registerGroup('custom', [
    'name' => 'Custom Options',
    'icon' => 'custom',
    'description' => 'Custom layout options'
]);

// Register an option
Options::register('customBorder', [
    'group' => 'custom',
    'type' => 'select',
    'label' => 'Border Style',
    'description' => 'Choose the border style for this layout',
    'default' => 'none',
    'options' => [
        'none' => 'None',
        'solid' => 'Solid',
        'dashed' => 'Dashed',
        'dotted' => 'Dotted'
    ]
]);
```

### Layout-Specific Options

```php
// Register hero-specific options
Options::register('heroOverlay', [
    'group' => 'background',
    'type' => 'toggle',
    'label' => 'Hero Overlay',
    'description' => 'Add a dark overlay to the background image',
    'default' => false,
    'supports' => ['hero-section'] // Only available for hero layouts
]);
```

### Get Option Values

```php
// Get option value with fallback to default
$alignment = Options::getValue('alignment', $attributes);

// Get all values for a layout
$heroValues = Options::getValues('hero-section', $attributes);

// Generate CSS classes and styles
$classes = Options::generateClasses($heroValues);
$styles = Options::generateStyles($heroValues);
```

## React Integration

### Layout Options Component

The system includes a React component that automatically adds option controls to Jankx layout blocks:

```javascript
// Automatically added to jankx/layout-* blocks
<LayoutOptions
    attributes={attributes}
    setAttributes={setAttributes}
/>
```

### Option Controls

Each option type has a corresponding React control:

- **SelectControl** - For select options
- **RangeControl** - For range options
- **ToggleControl** - For toggle options
- **ColorPicker** - For color options
- **MediaUpload** - For image options

## CSS Generation

### Automatic Class Generation

The system automatically generates CSS classes based on option values:

```php
// Input values
$values = [
    'alignment' => 'center',
    'spacing' => 'loose',
    'background' => 'primary',
    'animation' => 'fadeIn'
];

// Generated classes
$classes = Options::generateClasses($values);
// Result: "jankx-align-center jankx-spacing-loose jankx-bg-primary jankx-animation-fadeIn"
```

### Automatic Style Generation

The system also generates inline styles for numeric values:

```php
// Input values
$values = [
    'padding' => 20,
    'textColor' => '#ff0000',
    'backgroundImage' => 'https://example.com/image.jpg'
];

// Generated styles
$styles = Options::generateStyles($values);
// Result: "padding: 20px; color: #ff0000; background-image: url('https://example.com/image.jpg');"
```

## Validation

### Built-in Validation

Each option type has built-in validation:

```php
// Validate option values
$isValid = Options::validate('alignment', 'center'); // true
$isValid = Options::validate('alignment', 'invalid'); // false
$isValid = Options::validate('textColor', '#ff0000'); // true
$isValid = Options::validate('textColor', 'invalid'); // false
```

### Custom Validation

You can add custom validation by extending the LayoutOptions class:

```php
class CustomLayoutOptions extends LayoutOptions
{
    public static function validateOption($optionName, $value)
    {
        // Custom validation logic
        if ($optionName === 'customOption') {
            return customValidationLogic($value);
        }

        return parent::validateOption($optionName, $value);
    }
}
```

## Performance Features

### Partial Hydration

Layout options support partial hydration for better performance:

```php
Options::register('partialHydration', [
    'group' => 'performance',
    'type' => 'toggle',
    'label' => 'Partial Hydration',
    'description' => 'Load this layout via AJAX when visible',
    'default' => false,
    'note' => 'First layout is always server-rendered'
]);
```

### Lazy Loading

Options can control lazy loading behavior:

```php
Options::register('lazyLoad', [
    'group' => 'performance',
    'type' => 'toggle',
    'label' => 'Lazy Load',
    'description' => 'Load this layout when it comes into view',
    'default' => false
]);
```

## Integration with Gutenberg

### Automatic Integration

The Layout Options system automatically integrates with Gutenberg through the GutenbergBootstrapper:

1. **Script Loading** - Automatically loads the React components
2. **Data Localization** - Passes option data to JavaScript
3. **Block Filtering** - Adds options to Jankx layout blocks
4. **AJAX Handling** - Manages option updates via AJAX

### Editor Experience

Users see layout options in the Gutenberg sidebar:

1. **Grouped Options** - Options are organized by group
2. **Contextual Help** - Each option has description and help text
3. **Real-time Preview** - Changes are reflected immediately
4. **Validation** - Invalid values are prevented

## Advanced Features

### Conditional Options

Options can be conditional based on other options:

```php
Options::register('conditionalOption', [
    'group' => 'custom',
    'type' => 'select',
    'label' => 'Conditional Option',
    'description' => 'This option depends on another option',
    'default' => 'default',
    'options' => [...],
    'condition' => [
        'option' => 'parentOption',
        'value' => 'enabled'
    ]
]);
```

### Dynamic Options

Options can be dynamically generated:

```php
Options::register('dynamicOption', [
    'group' => 'custom',
    'type' => 'select',
    'label' => 'Dynamic Option',
    'description' => 'Options loaded dynamically',
    'default' => '',
    'options' => function() {
        return getDynamicOptions();
    }
]);
```

## Best Practices

### 1. Option Naming

Use descriptive, consistent names:

```php
// Good
Options::register('heroOverlay', [...]);
Options::register('testimonialAvatarSize', [...]);

// Avoid
Options::register('overlay', [...]);
Options::register('avatar', [...]);
```

### 2. Group Organization

Organize options logically:

```php
// Layout-specific options
Options::register('heroOverlay', [
    'group' => 'background',
    'supports' => ['hero-section']
]);

// General options
Options::register('alignment', [
    'group' => 'layout',
    'supports' => [] // Available for all layouts
]);
```

### 3. Default Values

Always provide sensible defaults:

```php
Options::register('spacing', [
    'default' => 'default', // Sensible default
    'options' => [
        'compact' => 'Compact',
        'default' => 'Default',
        'loose' => 'Loose'
    ]
]);
```

### 4. Validation

Validate option values:

```php
// In your layout render function
$values = Options::getValues('hero-section', $attributes);
foreach ($values as $name => $value) {
    if (!Options::validate($name, $value)) {
        // Handle invalid value
        $values[$name] = Options::get($name)['default'];
    }
}
```

## Future Enhancements

1. **Option Dependencies** - Options that depend on other options
2. **Custom Option Types** - Developer-defined option types
3. **Option Presets** - Pre-configured option combinations
4. **Option Import/Export** - Save and load option configurations
5. **Option Analytics** - Track which options are most used