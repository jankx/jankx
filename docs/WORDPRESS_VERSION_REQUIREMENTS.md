# WordPress Version Requirements

## Overview

Jankx Framework 2.0 requires specific WordPress versions for different Gutenberg features. This document outlines the version requirements and compatibility checks.

## Core Requirements

### Minimum WordPress Version
- **WordPress 5.0+** - Required for basic Gutenberg support
- **WordPress 5.3+** - Required for block styles
- **WordPress 5.5+** - Required for block patterns
- **WordPress 5.8+** - Required for block variations

## Feature Compatibility

### 1. Block Registration
- **Function:** `register_block_type()`
- **WordPress Version:** 5.0+
- **Status:** ✅ Required
- **Fallback:** None - core Gutenberg function

### 2. Block Categories
- **Function:** `block_categories_all` (5.8+) / `block_categories` (5.0-5.7)
- **WordPress Version:** 5.0+
- **Status:** ✅ Required
- **Fallback:** Automatic detection and use of appropriate filter

### 3. Block Styles
- **Function:** `register_block_style()`
- **WordPress Version:** 5.3+
- **Status:** ✅ Optional
- **Fallback:** Function check before registration

### 4. Block Patterns
- **Function:** `register_block_pattern()`
- **WordPress Version:** 5.5+
- **Status:** ✅ Optional
- **Fallback:** Function check before registration

### 5. Block Variations
- **Function:** `register_block_variation()`
- **WordPress Version:** 5.8+
- **Status:** ✅ Optional
- **Fallback:** Function check before registration

## Implementation Details

### Version Detection

```php
// Check for block registration
if (function_exists('register_block_type')) {
    // Safe to register blocks
}

// Check for block categories
if (function_exists('block_categories_all')) {
    // WordPress 5.8+ - use block_categories_all
    add_filter('block_categories_all', [$this, 'registerBlockCategories']);
} else {
    // WordPress 5.0-5.7 - use block_categories
    add_filter('block_categories', [$this, 'registerBlockCategories']);
}

// Check for block styles
if (function_exists('register_block_style')) {
    // Safe to register block styles
    register_block_style('jankx/testimonial', [...]);
}

// Check for block patterns
if (function_exists('register_block_pattern')) {
    // Safe to register block patterns
    register_block_pattern('jankx/testimonial-pattern', [...]);
}

// Check for block variations
if (function_exists('register_block_variation')) {
    // Safe to register block variations
    register_block_variation('jankx/testimonial', [...]);
}
```

### Error Handling

```php
// Graceful degradation for missing functions
if (!function_exists('register_block_type')) {
    error_log("Jankx Gutenberg: register_block_type function not available");
    return;
}

// Log missing optional features
if (!function_exists('register_block_style')) {
    Logger::debug('Block styles not available - WordPress version too old');
}
```

## Compatibility Matrix

| WordPress Version | Block Registration | Block Categories | Block Styles | Block Patterns | Block Variations |
|------------------|-------------------|------------------|--------------|----------------|------------------|
| 5.0-5.2         | ✅                | ✅               | ❌           | ❌             | ❌               |
| 5.3-5.4         | ✅                | ✅               | ✅           | ❌             | ❌               |
| 5.5-5.7         | ✅                | ✅               | ✅           | ✅             | ❌               |
| 5.8+            | ✅                | ✅               | ✅           | ✅             | ✅               |

## Recommended WordPress Version

### For Full Feature Support
- **WordPress 5.8+** - All features available
- **WordPress 6.0+** - Recommended for best performance

### For Basic Support
- **WordPress 5.0+** - Core block registration only
- **WordPress 5.3+** - Includes block styles

## Testing Strategy

### Version Compatibility Testing
```php
// Test function availability
$tests = [
    'register_block_type' => '5.0+',
    'register_block_style' => '5.3+',
    'register_block_pattern' => '5.5+',
    'register_block_variation' => '5.8+',
    'block_categories_all' => '5.8+'
];

foreach ($tests as $function => $version) {
    if (function_exists($function)) {
        Logger::debug("✅ {$function} available ({$version})");
    } else {
        Logger::debug("❌ {$function} not available (requires {$version})");
    }
}
```

### Feature Detection
```php
// Detect available features
$features = [
    'block_registration' => function_exists('register_block_type'),
    'block_styles' => function_exists('register_block_style'),
    'block_patterns' => function_exists('register_block_pattern'),
    'block_variations' => function_exists('register_block_variation'),
    'block_categories_all' => function_exists('block_categories_all')
];

// Log feature availability
foreach ($features as $feature => $available) {
    Logger::debug("Feature {$feature}: " . ($available ? 'Available' : 'Not Available'));
}
```

## Migration Guide

### From WordPress 5.0-5.2
- ✅ Block registration works
- ❌ Block styles not available
- ❌ Block patterns not available
- ❌ Block variations not available

### From WordPress 5.3-5.4
- ✅ Block registration works
- ✅ Block styles available
- ❌ Block patterns not available
- ❌ Block variations not available

### From WordPress 5.5-5.7
- ✅ Block registration works
- ✅ Block styles available
- ✅ Block patterns available
- ❌ Block variations not available

### From WordPress 5.8+
- ✅ All features available
- ✅ Full functionality

## Troubleshooting

### Common Issues

1. **"Call to undefined function register_block_variation()"**
   - **Cause:** WordPress version below 5.8
   - **Solution:** Upgrade to WordPress 5.8+ or disable block variations

2. **"Call to undefined function register_block_pattern()"**
   - **Cause:** WordPress version below 5.5
   - **Solution:** Upgrade to WordPress 5.5+ or disable block patterns

3. **"Call to undefined function register_block_style()"**
   - **Cause:** WordPress version below 5.3
   - **Solution:** Upgrade to WordPress 5.3+ or disable block styles

### Debug Mode

Enable debug mode to see feature availability:

```php
// In wp-config.php
define('JANKX_DEBUG_FEATURES', true);
```

### Logging

Check logs for feature availability:

```php
// Check WordPress version
Logger::debug('WordPress version', ['version' => get_bloginfo('version')]);

// Check Gutenberg features
Logger::debug('Gutenberg features', [
    'block_registration' => function_exists('register_block_type'),
    'block_styles' => function_exists('register_block_style'),
    'block_patterns' => function_exists('register_block_pattern'),
    'block_variations' => function_exists('register_block_variation')
]);
```

## Future Considerations

### WordPress 6.0+ Features
- Enhanced block editor APIs
- Improved performance
- Better developer experience
- More block customization options

### Backward Compatibility
- Maintain support for WordPress 5.0+
- Graceful degradation for missing features
- Clear error messages for unsupported features
- Alternative implementations where possible

## Support

For version compatibility issues:

1. **Check WordPress Version** - Ensure minimum version requirements
2. **Review Error Logs** - Look for function availability errors
3. **Test Feature Detection** - Use debug mode to check features
4. **Upgrade WordPress** - Consider upgrading for full feature support

## Related Documentation

- [Gutenberg Blocks](./gutenberg/GUTENBERG_BLOCKS.md)
- [Gutenberg Frontend System](./gutenberg/GUTENBERG_FRONTEND_SYSTEM.md)
- [Gutenberg AJAX System](./gutenberg/GUTENBERG_AJAX_SYSTEM.md)
- [Performance Optimization](./PERFORMANCE.md)