# WordPress Asset Enqueuing Best Practices

## Overview

This document outlines the best practices for enqueuing scripts and styles in WordPress, specifically for Jankx Framework 2.0 Gutenberg integration.

## WordPress Enqueue Hooks

### Proper Hook Usage

WordPress provides specific hooks for enqueuing assets:

1. **`wp_enqueue_scripts`** - For frontend scripts and styles
2. **`admin_enqueue_scripts`** - For admin scripts and styles
3. **`enqueue_block_editor_assets`** - For Gutenberg editor assets
4. **`login_enqueue_scripts`** - For login page assets

### ❌ Incorrect Usage

```php
// WRONG - Enqueuing during bootstrap
public function bootstrap(Container $container): void
{
    // This will cause WordPress notices
    wp_enqueue_script('my-script', 'script.js');
    wp_enqueue_style('my-style', 'style.css');
}
```

### ✅ Correct Usage

```php
// RIGHT - Using proper WordPress hooks
public function bootstrap(Container $container): void
{
    // Register hooks for proper enqueuing
    add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);
    add_action('admin_enqueue_scripts', [$this, 'enqueueAdminAssets']);
    add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets']);
}
```

## Jankx Framework Implementation

### 1. GutenbergBootstrapper (Admin Context)

```php
public function bootstrap(Container $container): void
{
    // Initialize BlockRegistry
    BlockRegistry::boot();

    // Register block categories
    if (function_exists('block_categories_all')) {
        add_filter('block_categories_all', [$this, 'registerBlockCategories']);
    } else {
        add_filter('block_categories', [$this, 'registerBlockCategories']);
    }

    // Register block patterns, styles, variations
    add_action('init', [$this, 'registerBlockPatterns']);
    add_action('init', [$this, 'registerBlockStyles']);

    if (function_exists('register_block_variation')) {
        add_action('init', [$this, 'registerBlockVariations']);
    }
}
```

**Note:** GutenbergBootstrapper doesn't enqueue assets directly. BlockRegistry handles editor assets via `enqueue_block_editor_assets`.

### 2. GutenbergFrontendBootstrapper (Frontend Context)

```php
public function bootstrap(Container $container): void
{
    // Parse and register used blocks
    $used_blocks = $this->parseUsedBlocks();
    $this->registerUsedBlocks($used_blocks);

    // Initialize partial hydration
    $this->initializePartialHydration();

    // Enqueue assets via proper WordPress hook
    add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);
}

public function enqueueFrontendAssets(): void
{
    // Only enqueue if blocks are used
    $used_blocks = $this->getUsedBlocks();
    if (empty($used_blocks)) {
        return;
    }

    // Enqueue frontend assets
    wp_enqueue_script('jankx-frontend', '...');
    wp_enqueue_style('jankx-gutenberg-frontend-style', '...');
    wp_enqueue_style('jankx-partial-hydration', '...');
    wp_enqueue_style('jankx-layout-themes', '...');
}
```

### 3. BlockRegistry (Central Asset Management)

```php
public static function init()
{
    add_action('init', [self::class, 'registerBlocks']);
    add_action('enqueue_block_editor_assets', [self::class, 'enqueueEditorAssets']);
    // Frontend assets handled by GutenbergFrontendBootstrapper
}

public static function enqueueEditorAssets()
{
    wp_enqueue_script('jankx-gutenberg-editor', '...');
    wp_enqueue_style('jankx-gutenberg-editor-style', '...');
}
```

## Asset Organization

### 1. Editor Assets (Admin)

**Location:** `assets/gutenberg/`
- `js/editor.js` - Main editor script
- `css/editor.css` - Editor styles
- `js/blocks/` - Block-specific editor scripts
- `css/blocks/` - Block-specific editor styles

**Enqueued via:** `enqueue_block_editor_assets`

### 2. Frontend Assets (Public)

**Location:** `assets/`
- `js/partial-hydration.js` - Frontend functionality
- `css/partial-hydration.css` - Partial hydration styles
- `css/layout-themes.css` - Layout theme styles

**Enqueued via:** `wp_enqueue_scripts`

### 3. Block-Specific Assets

**Location:** `assets/gutenberg/`
- `css/frontend.css` - Block frontend styles
- `js/blocks/` - Block-specific scripts

**Enqueued via:** `register_block_type` with `style` parameter

## Performance Optimization

### 1. Conditional Loading

```php
public function enqueueFrontendAssets(): void
{
    // Only enqueue if blocks are used
    $used_blocks = $this->getUsedBlocks();
    if (empty($used_blocks)) {
        return;
    }

    // Enqueue assets only when needed
    wp_enqueue_script('jankx-frontend', '...');
}
```

### 2. Dependency Management

```php
wp_enqueue_script(
    'jankx-frontend',
    get_template_directory_uri() . '/assets/js/partial-hydration.js',
    ['jquery'], // Dependencies
    JANKX_VERSION,
    true // In footer
);
```

### 3. Version Control

```php
wp_enqueue_style(
    'jankx-gutenberg-frontend-style',
    get_template_directory_uri() . '/assets/gutenberg/css/frontend.css',
    [],
    JANKX_VERSION // Version for cache busting
);
```

## Common Issues and Solutions

### 1. "Scripts and styles should not be registered or enqueued until..."

**Cause:** Enqueuing assets outside of proper WordPress hooks

**Solution:**
```php
// Instead of direct enqueuing
wp_enqueue_script('my-script', 'script.js');

// Use proper hooks
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_script('my-script', 'script.js');
});
```

### 2. Duplicate Asset Enqueuing

**Cause:** Multiple components enqueuing the same assets

**Solution:**
```php
// Centralize asset management
class AssetManager {
    public static function enqueueFrontendAssets() {
        // Single point of enqueuing
    }
}

// Use in bootstrappers
add_action('wp_enqueue_scripts', [AssetManager::class, 'enqueueFrontendAssets']);
```

### 3. Missing Dependencies

**Cause:** Scripts loaded before their dependencies

**Solution:**
```php
wp_enqueue_script(
    'jankx-frontend',
    'script.js',
    ['jquery', 'wp-blocks'], // Explicit dependencies
    JANKX_VERSION,
    true
);
```

## Best Practices

### 1. Hook Organization

```php
class GutenbergFrontendBootstrapper extends AbstractBootstrapper
{
    public function bootstrap(Container $container): void
    {
        // Parse content and register blocks
        $this->parseAndRegisterBlocks();

        // Initialize features
        $this->initializeFeatures();

        // Register asset hooks
        $this->registerAssetHooks();
    }

    protected function registerAssetHooks(): void
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);
        add_action('wp_head', [$this, 'addInlineData']);
    }
}
```

### 2. Conditional Asset Loading

```php
public function enqueueFrontendAssets(): void
{
    // Check if assets are needed
    if (!$this->shouldEnqueueAssets()) {
        return;
    }

    // Enqueue assets
    $this->enqueueScripts();
    $this->enqueueStyles();
}

protected function shouldEnqueueAssets(): bool
{
    return !empty($this->getUsedBlocks()) && !is_admin();
}
```

### 3. Asset Versioning

```php
// Use framework version for cache busting
wp_enqueue_script(
    'jankx-frontend',
    get_template_directory_uri() . '/assets/js/partial-hydration.js',
    ['jquery'],
    JANKX_VERSION, // Framework version
    true
);
```

### 4. Error Handling

```php
public function enqueueFrontendAssets(): void
{
    try {
        // Check if files exist
        $script_path = get_template_directory() . '/assets/js/partial-hydration.js';
        if (!file_exists($script_path)) {
            Logger::error('Frontend script not found', ['path' => $script_path]);
            return;
        }

        // Enqueue assets
        wp_enqueue_script('jankx-frontend', get_template_directory_uri() . '/assets/js/partial-hydration.js');

    } catch (\Exception $e) {
        Logger::error('Asset enqueuing failed', ['error' => $e->getMessage()]);
    }
}
```

## Debugging

### 1. Enable WordPress Debug

```php
// In wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

### 2. Check Asset Loading

```php
// Add debug information
add_action('wp_enqueue_scripts', function() {
    Logger::debug('Frontend assets enqueued', [
        'used_blocks' => $this->getUsedBlocks(),
        'assets_loaded' => true
    ]);
}, 999);
```

### 3. Monitor Performance

```php
// Track asset loading performance
$start_time = microtime(true);
wp_enqueue_script('jankx-frontend', '...');
$load_time = microtime(true) - $start_time;

Logger::debug('Asset loading performance', [
    'script' => 'jankx-frontend',
    'load_time' => $load_time
]);
```

## Related Documentation

- [WordPress Version Requirements](./WORDPRESS_VERSION_REQUIREMENTS.md)
- [Gutenberg Frontend System](./gutenberg/GUTENBERG_FRONTEND_SYSTEM.md)
- [Performance Optimization](./PERFORMANCE.md)