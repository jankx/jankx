# Testing Gutenberg Blocks

## Overview

This document provides step-by-step instructions for testing Gutenberg blocks in Jankx Framework 2.0.

## Current Issue: Testimonial Block Not Appearing

The testimonial block is not appearing in the Gutenberg editor. Let's debug this step by step.

## Debug Steps

### 1. Check Block Registration

Add this to your theme's `functions.php` temporarily:

```php
// Debug block registration
add_action('init', function() {
    echo "<!-- Debug: Block registration check -->\n";

    // Check if our classes exist
    if (class_exists('Jankx\Gutenberg\Blocks\TestimonialBlock')) {
        echo "<!-- Debug: TestimonialBlock class exists -->\n";

        // Check if register_block_type exists
        if (function_exists('register_block_type')) {
            echo "<!-- Debug: register_block_type function exists -->\n";

            // Try to register block manually
            $result = register_block_type('jankx/testimonial', [
                'editor_script' => 'jankx-gutenberg-editor',
                'editor_style' => 'jankx-gutenberg-editor-style',
                'style' => 'jankx-gutenberg-frontend-style',
                'render_callback' => ['Jankx\Gutenberg\Blocks\TestimonialBlock', 'render'],
                'attributes' => \Jankx\Gutenberg\Blocks\TestimonialBlock::getAttributes(),
            ]);

            if ($result) {
                echo "<!-- Debug: Block registered successfully -->\n";
            } else {
                echo "<!-- Debug: Block registration failed -->\n";
            }
        } else {
            echo "<!-- Debug: register_block_type function NOT found -->\n";
        }
    } else {
        echo "<!-- Debug: TestimonialBlock class NOT found -->\n";
    }

    // Check what blocks are registered
    $registered_blocks = \WP_Block_Type_Registry::get_instance()->get_all_registered();
    $block_names = array_keys($registered_blocks);
    echo "<!-- Debug: Registered blocks: " . implode(', ', $block_names) . " -->\n";

    // Check if our block is in the list
    if (in_array('jankx/testimonial', $block_names)) {
        echo "<!-- Debug: jankx/testimonial block is registered -->\n";
    } else {
        echo "<!-- Debug: jankx/testimonial block is NOT registered -->\n";
    }
}, 999);
```

### 2. Check Asset Loading

Add this to debug asset enqueuing:

```php
// Debug asset enqueuing
add_action('enqueue_block_editor_assets', function() {
    echo "<!-- Debug: Enqueuing editor assets -->\n";

    // Enqueue main editor script
    wp_enqueue_script(
        'jankx-gutenberg-editor',
        get_template_directory_uri() . '/assets/gutenberg/js/editor.js',
        ['wp-blocks', 'wp-dom-ready', 'wp-edit-post'],
        '1.0.0'
    );

    // Enqueue testimonial block script
    wp_enqueue_script(
        'jankx-testimonial-block',
        get_template_directory_uri() . '/assets/gutenberg/js/blocks/testimonial/index.js',
        ['jankx-gutenberg-editor', 'wp-blocks', 'wp-block-editor', 'wp-components', 'wp-i18n'],
        '1.0.0'
    );

    // Enqueue editor styles
    wp_enqueue_style(
        'jankx-gutenberg-editor-style',
        get_template_directory_uri() . '/assets/gutenberg/css/editor.css',
        [],
        '1.0.0'
    );

    echo "<!-- Debug: Editor assets enqueued -->\n";
}, 999);
```

### 3. Check Browser Console

1. Open WordPress admin
2. Go to Posts → Add New (or edit any post)
3. Open browser developer tools (F12)
4. Check Console tab for any JavaScript errors
5. Check Network tab to see if assets are loading

### 4. Check Page Source

1. In the Gutenberg editor, right-click → View Page Source
2. Search for "Debug:" to see our debug comments
3. Look for any error messages

## Expected Results

### If Block Registration Works:

```
<!-- Debug: TestimonialBlock class exists -->
<!-- Debug: register_block_type function exists -->
<!-- Debug: Block registered successfully -->
<!-- Debug: Registered blocks: core/paragraph, core/heading, jankx/testimonial, ... -->
<!-- Debug: jankx/testimonial block is registered -->
```

### If Assets Load Correctly:

```
<!-- Debug: Enqueuing editor assets -->
<!-- Debug: Editor assets enqueued -->
```

## Common Issues and Solutions

### Issue 1: TestimonialBlock class not found

**Cause:** Autoloader not working or class file missing

**Solution:**
```php
// Check if autoloader is working
if (!class_exists('Jankx\Gutenberg\Blocks\TestimonialBlock')) {
    // Manually include the file
    require_once get_template_directory() . '/includes/Jankx/Gutenberg/Blocks/TestimonialBlock.php';
}
```

### Issue 2: register_block_type function not found

**Cause:** WordPress version too old or Gutenberg not active

**Solution:**
```php
// Check WordPress version
if (version_compare(get_bloginfo('version'), '5.0', '<')) {
    echo "<!-- Debug: WordPress version too old for Gutenberg -->\n";
    return;
}

// Check if Gutenberg is active
if (!function_exists('register_block_type')) {
    echo "<!-- Debug: Gutenberg not available -->\n";
    return;
}
```

### Issue 3: Assets not loading

**Cause:** File paths incorrect or files missing

**Solution:**
```php
// Check if files exist
$editor_js = get_template_directory() . '/assets/gutenberg/js/editor.js';
$testimonial_js = get_template_directory() . '/assets/gutenberg/js/blocks/testimonial/index.js';
$editor_css = get_template_directory() . '/assets/gutenberg/css/editor.css';

if (!file_exists($editor_js)) {
    echo "<!-- Debug: editor.js not found at: " . $editor_js . " -->\n";
}
if (!file_exists($testimonial_js)) {
    echo "<!-- Debug: testimonial block JS not found at: " . $testimonial_js . " -->\n";
}
if (!file_exists($editor_css)) {
    echo "<!-- Debug: editor.css not found at: " . $editor_css . " -->\n";
}
```

### Issue 4: JavaScript errors

**Cause:** Dependencies missing or syntax errors

**Solution:**
```php
// Enqueue with proper dependencies
wp_enqueue_script(
    'jankx-testimonial-block',
    get_template_directory_uri() . '/assets/gutenberg/js/blocks/testimonial/index.js',
    [
        'wp-blocks',
        'wp-block-editor',
        'wp-components',
        'wp-i18n',
        'wp-element',
        'wp-data'
    ],
    '1.0.0'
);
```

## Testing Checklist

- [ ] TestimonialBlock class exists
- [ ] register_block_type function available
- [ ] Block registers successfully
- [ ] Assets load without errors
- [ ] JavaScript console shows no errors
- [ ] Block appears in block inserter
- [ ] Block renders correctly in editor
- [ ] Block saves and loads correctly

## Next Steps

1. **If block registers but doesn't appear:** Check JavaScript console for errors
2. **If assets don't load:** Check file paths and permissions
3. **If JavaScript errors:** Check dependencies and syntax
4. **If block appears but doesn't work:** Check render callback

## Manual Block Registration

If the framework registration doesn't work, try manual registration:

```php
add_action('init', function() {
    register_block_type('jankx/testimonial', [
        'editor_script' => 'jankx-gutenberg-editor',
        'editor_style' => 'jankx-gutenberg-editor-style',
        'style' => 'jankx-gutenberg-frontend-style',
        'render_callback' => function($attributes, $content) {
            return '<div class="jankx-testimonial">Testimonial content</div>';
        },
        'attributes' => [
            'content' => ['type' => 'string', 'default' => ''],
            'author' => ['type' => 'string', 'default' => ''],
        ],
    ]);
});
```

## Related Documentation

- [WordPress Asset Enqueuing](./WORDPRESS_ASSET_ENQUEUING.md)
- [Gutenberg Frontend System](./gutenberg/GUTENBERG_FRONTEND_SYSTEM.md)
- [WordPress Version Requirements](./WORDPRESS_VERSION_REQUIREMENTS.md)