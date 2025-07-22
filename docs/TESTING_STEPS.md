# Testing Steps for Gutenberg Blocks

## Current Status

✅ **Block Registration:** Working
✅ **JavaScript Loading:** Working
✅ **Asset Enqueuing:** Working
⚠️ **Block Inserter:** Need to test

## Test Steps

### Step 1: Test Simple Block

1. **Add test code to `functions.php`:**
```php
// Add this to your theme's functions.php
require_once get_template_directory() . '/test-simple-block.php';
```

2. **Check if files exist:**
- `assets/gutenberg/js/test-simple.js` ✅
- `assets/gutenberg/css/test-simple.css` ✅

3. **Test in Gutenberg Editor:**
- Go to Posts → Add New
- Click the "+" button to add block
- Search for "Test Simple Block"
- Should appear in "Common" category

### Step 2: Test Testimonial Block

1. **Check if testimonial block appears:**
- In Gutenberg editor
- Click "+" to add block
- Search for "Testimonial"
- Should appear in "Common" category (changed from jankx-blocks)

2. **Check browser console:**
- Open Developer Tools (F12)
- Look for:
  ```
  Testimonial block registered
  Jankx Gutenberg blocks loaded
  Jankx blocks data: Object { "jankx/testimonial": {…} }
  ```

### Step 3: Debug Block Categories

If blocks don't appear, check category registration:

```php
// Add this to functions.php to debug categories
add_action('init', function() {
    echo "<!-- Debug: Checking block categories -->\n";

    // Check if jankx-blocks category is registered
    $categories = get_block_categories(get_post());
    foreach ($categories as $category) {
        echo "<!-- Debug: Category: " . $category['slug'] . " - " . $category['title'] . " -->\n";
    }
}, 999);
```

### Step 4: Test Block Rendering

1. **Add testimonial block to post**
2. **Fill in some content**
3. **Save and preview**
4. **Check if block renders correctly**

## Expected Results

### ✅ If Working:
- Blocks appear in block inserter
- No JavaScript errors in console
- Blocks render correctly in editor
- Blocks save and display on frontend

### ❌ If Not Working:
- Blocks don't appear in inserter
- JavaScript errors in console
- Blocks don't render
- Blocks don't save

## Troubleshooting

### Issue 1: Blocks don't appear in inserter

**Possible causes:**
- Category not registered
- JavaScript errors
- Block registration failed

**Solutions:**
```php
// Force register in common category
register_block_type('jankx/testimonial', [
    'category' => 'common',
    // ... other options
]);
```

### Issue 2: JavaScript errors

**Check console for:**
- Missing dependencies
- Syntax errors
- File not found errors

**Solutions:**
```php
// Add proper dependencies
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

### Issue 3: Block doesn't render

**Check:**
- render_callback function exists
- PHP errors in logs
- Block attributes correct

**Solutions:**
```php
// Test render callback
register_block_type('jankx/testimonial', [
    'render_callback' => function($attributes, $content) {
        return '<div class="jankx-testimonial">Testimonial content</div>';
    },
]);
```

## Next Steps

1. **Test simple block first** - If it works, the system is working
2. **Test testimonial block** - If it doesn't work, check specific issues
3. **Check browser console** - Look for any errors
4. **Check WordPress debug log** - Look for PHP errors

## Files to Check

- `assets/gutenberg/js/test-simple.js` - Simple test block
- `assets/gutenberg/js/blocks/testimonial/index.js` - Testimonial block
- `assets/gutenberg/css/test-simple.css` - Simple block styles
- `assets/gutenberg/css/editor.css` - Editor styles
- `includes/Jankx/Gutenberg/BlockRegistry.php` - Block registration
- `includes/Jankx/Bootstrappers/GutenbergBootstrapper.php` - Bootstrapper

## Debug Commands

```bash
# Check PHP syntax
php -l includes/Jankx/Gutenberg/BlockRegistry.php

# Check if files exist
ls -la assets/gutenberg/js/
ls -la assets/gutenberg/css/

# Check WordPress debug log
tail -f wp-content/debug.log
```