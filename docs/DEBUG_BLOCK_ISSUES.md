# Debug Block Issues

## Current Issues Found

### 1. **Block Registration Duplication**
```
Jankx Gutenberg: Registering block jankx/testimonial with class Jankx\Gutenberg\Blocks\TestimonialBlock
Jankx Gutenberg: Block jankx/testimonial registered successfully
Jankx Gutenberg: Registering block jankx/testimonial with class Jankx\Gutenberg\Blocks\TestimonialBlock
Jankx Gutenberg: Block jankx/testimonial registered successfully
```

**Fixed:** Added check to prevent duplicate registration

### 2. **Deprecated Hook Warning**
```
PHP Deprecated: Hook block_categories is deprecated since version 5.8.0! Use block_categories_all instead.
```

**Fixed:** Removed deprecated `block_categories` hook

## Debug Steps

### Step 1: Add Debug Code

Add this to your `functions.php`:

```php
// Add debug inspector
require_once get_template_directory() . '/test-block-inspector.php';

// Add simple test block
require_once get_template_directory() . '/test-simple-block.php';
```

### Step 2: Check Browser Console

1. Open WordPress admin
2. Go to Posts → Add New
3. Open Developer Tools (F12)
4. Check Console tab
5. Look for:
   ```
   === Block Inspector Started ===
   wp.blocks is available
   Total registered blocks: [number]
   Jankx blocks found: [number]
   ✅ Testimonial block found: [object]
   ✅ Test Simple block found: [object]
   ```

### Step 3: Check Page Source

1. In Gutenberg editor, right-click → View Page Source
2. Search for "Debug:" comments
3. Look for:
   ```
   <!-- Debug: Block inserter test -->
   <!-- Debug: Block inspector script enqueued -->
   <!-- Debug: Checking registered blocks -->
   <!-- Debug: Total registered blocks: [number] -->
   <!-- Debug: Block names: [list] -->
   <!-- Debug: Block jankx/testimonial is registered -->
   <!-- Debug: Block jankx/test-simple is registered -->
   ```

### Step 4: Test Block Inserter

1. In Gutenberg editor
2. Click the "+" button to add block
3. Search for:
   - "Testimonial"
   - "Test Simple Block"
4. Check if blocks appear in "Common" category

## Expected Results

### ✅ If Working:
```
=== Block Inspector Started ===
wp.blocks is available
Total registered blocks: 150+
Jankx blocks found: 2
✅ Testimonial block found: {name: "jankx/testimonial", ...}
✅ Test Simple block found: {name: "jankx/test-simple", ...}
✅ Block inserter found
Found Jankx block in inserter: jankx/testimonial
Found Jankx block in inserter: jankx/test-simple
```

### ❌ If Not Working:
```
=== Block Inspector Started ===
wp.blocks is available
Total registered blocks: 150+
Jankx blocks found: 0
❌ Testimonial block NOT found
❌ Test Simple block NOT found
❌ Block inserter NOT found
```

## Troubleshooting

### Issue 1: Blocks not found in JavaScript

**Possible causes:**
- JavaScript registration failed
- Dependencies missing
- Syntax errors

**Solutions:**
```javascript
// Check if block registration worked
console.log('wp.blocks.getBlockTypes():', wp.blocks.getBlockTypes());

// Check for JavaScript errors
// Look in Console tab for red error messages
```

### Issue 2: Blocks not in inserter

**Possible causes:**
- Category not registered
- Block not properly registered
- Inserter filtering

**Solutions:**
```php
// Force register in common category
register_block_type('jankx/testimonial', [
    'category' => 'common',
    'editor_script' => 'jankx-testimonial-block',
    // ... other options
]);
```

### Issue 3: PHP errors

**Check debug.log for:**
- Class not found errors
- Function not found errors
- File not found errors

**Solutions:**
```php
// Check if classes exist
if (!class_exists('Jankx\Gutenberg\Blocks\TestimonialBlock')) {
    error_log('TestimonialBlock class not found');
}

// Check if functions exist
if (!function_exists('register_block_type')) {
    error_log('register_block_type function not found');
}
```

## Files to Check

### **PHP Files:**
- `includes/Jankx/Gutenberg/BlockRegistry.php` - Block registration
- `includes/Jankx/Bootstrappers/GutenbergBootstrapper.php` - Bootstrapper
- `includes/Jankx/Gutenberg/Blocks/TestimonialBlock.php` - Block class

### **JavaScript Files:**
- `assets/gutenberg/js/blocks/testimonial/index.js` - Testimonial block
- `assets/gutenberg/js/test-simple.js` - Simple test block
- `assets/gutenberg/js/block-inspector.js` - Debug inspector

### **CSS Files:**
- `assets/gutenberg/css/editor.css` - Editor styles
- `assets/gutenberg/css/test-simple.css` - Simple block styles

## Debug Commands

```bash
# Check PHP syntax
php -l includes/Jankx/Gutenberg/BlockRegistry.php
php -l includes/Jankx/Bootstrappers/GutenbergBootstrapper.php

# Check if files exist
ls -la assets/gutenberg/js/
ls -la assets/gutenberg/css/

# Check WordPress debug log
tail -f wp-content/debug.log
```

## Next Steps

1. **Add debug code** to functions.php
2. **Check browser console** for JavaScript errors
3. **Check page source** for debug comments
4. **Test block inserter** for block appearance
5. **Report results** with console output

## Common Solutions

### **If blocks register but don't appear:**
- Check category registration
- Use 'common' category instead of custom
- Check JavaScript dependencies

### **If JavaScript errors:**
- Check file paths
- Check dependencies
- Check syntax

### **If PHP errors:**
- Check class autoloading
- Check WordPress version compatibility
- Check file permissions