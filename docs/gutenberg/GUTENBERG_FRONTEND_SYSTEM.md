# Jankx Gutenberg Frontend System

## Overview

Jankx Gutenberg Frontend System provides intelligent block loading for frontend pages by parsing post content and only loading blocks that are actually used. This system optimizes performance by avoiding unnecessary block registration and asset loading.

## Architecture

### Core Components

1. **GutenbergFrontendBootstrapper** - Frontend-specific bootstrapper
2. **Post Content Parser** - Extracts used blocks from content
3. **Selective Block Registration** - Registers only used blocks
4. **Partial Hydration Integration** - Manages lazy loading
5. **Performance Monitoring** - Tracks block usage and performance

### Context Detection

The system automatically runs in frontend context:

```php
!is_admin() && !wp_doing_ajax() && !wp_doing_cron()
```

## Block Detection Process

### 1. Content Parsing

```php
// Parse post content
$content = $post->post_content;

// Also check widgets and other areas
$widget_content = $this->getWidgetContent();
$content .= $widget_content;

// Parse blocks from content
$blocks = parse_blocks($content);
$used_blocks = $this->extractJankxBlocks($blocks);
```

### 2. Block Extraction

```php
protected function extractJankxBlocks(array $blocks): array
{
    $jankx_blocks = [];

    foreach ($blocks as $block) {
        if (isset($block['blockName']) && strpos($block['blockName'], 'jankx/') === 0) {
            $jankx_blocks[] = $block['blockName'];
        }

        // Recursively check inner blocks
        if (isset($block['innerBlocks']) && is_array($block['innerBlocks'])) {
            $inner_blocks = $this->extractJankxBlocks($block['innerBlocks']);
            $jankx_blocks = array_merge($jankx_blocks, $inner_blocks);
        }
    }

    return $jankx_blocks;
}
```

### 3. Selective Registration

```php
// Register only used blocks
foreach ($used_blocks as $block_name) {
    $block_class = BlockRegistry::getBlock($block_name);
    if ($block_class) {
        register_block_type($block_name, [
            'render_callback' => [$block_class, 'render'],
            'attributes' => $block_class::getAttributes(),
        ]);
    }
}
```

## Features

### 1. Content Parsing

#### Post Content Analysis
- Parses current post content for Jankx blocks
- Extracts block names and attributes
- Handles nested blocks recursively
- Supports inner blocks and block variations

#### Widget Content Analysis
```php
protected function getWidgetContent(): string
{
    $widget_content = '';

    // Check active widgets
    $active_widgets = get_option('sidebars_widgets', []);

    foreach ($active_widgets as $sidebar => $widgets) {
        if (is_array($widgets)) {
            foreach ($widgets as $widget) {
                $widget_data = get_option('widget_' . $widget);
                if (is_array($widget_data)) {
                    foreach ($widget_data as $instance) {
                        if (isset($instance['content'])) {
                            $widget_content .= $instance['content'];
                        }
                    }
                }
            }
        }
    }

    return $widget_content;
}
```

#### Custom Content Areas
```php
// Allow developers to add custom content areas
$custom_content = apply_filters('jankx/frontend/custom_content', '');
$content .= $custom_content;
```

### 2. Selective Block Registration

#### Performance Optimization
- Only registers blocks that are actually used
- Reduces memory usage and load time
- Avoids unnecessary asset loading
- Optimizes database queries

#### Block Validation
```php
// Validate block exists before registration
$block_class = BlockRegistry::getBlock($block_name);
if ($block_class && class_exists($block_class)) {
    // Register block
    register_block_type($block_name, [
        'render_callback' => [$block_class, 'render'],
        'attributes' => $block_class::getAttributes(),
    ]);
}
```

### 3. Partial Hydration Integration

#### Settings Configuration
```php
protected function getPartialHydrationSettings(): array
{
    $default_settings = [
        'enabled' => true,
        'firstBlockServerRendered' => true,
        'lazyLoadThreshold' => 0.1,
        'retryAttempts' => 3,
        'timeout' => 30000,
    ];

    return apply_filters('jankx/frontend/partial_hydration_settings', $default_settings);
}
```

#### JavaScript Integration
```php
// Pass settings to JavaScript
wp_localize_script('jankx-frontend', 'jankxFrontend', [
    'usedBlocks' => $used_blocks,
    'partialHydration' => $this->getPartialHydrationSettings(),
    'ajaxUrl' => admin_url('admin-ajax.php'),
    'nonce' => wp_create_nonce('jankx_gutenberg_nonce'),
]);
```

### 4. Asset Management

#### Conditional Asset Loading
```php
protected function enqueueFrontendAssets(): void
{
    // Only enqueue if blocks are used
    if (!empty($this->getUsedBlocks())) {
        // Enqueue main frontend script
        wp_enqueue_script(
            'jankx-frontend',
            get_template_directory_uri() . '/assets/js/partial-hydration.js',
            ['jquery'],
            JANKX_VERSION,
            true
        );

        // Enqueue frontend styles
        wp_enqueue_style(
            'jankx-gutenberg-frontend',
            get_template_directory_uri() . '/assets/gutenberg/css/frontend.css',
            [],
            JANKX_VERSION
        );
    }
}
```

#### Block-Specific Assets
```php
// Enqueue block-specific assets
foreach ($used_blocks as $block_name) {
    $block_class = BlockRegistry::getBlock($block_name);
    if ($block_class && method_exists($block_class, 'enqueueAssets')) {
        $block_class::enqueueAssets();
    }
}
```

## Performance Features

### 1. Memory Optimization

#### Selective Loading
- Only loads blocks that are actually used
- Reduces memory footprint
- Optimizes asset loading
- Minimizes database queries

#### Caching Strategy
```php
// Cache parsed blocks
$cache_key = 'jankx_used_blocks_' . $post->ID;
$used_blocks = wp_cache_get($cache_key);

if ($used_blocks === false) {
    $used_blocks = $this->parseUsedBlocks();
    wp_cache_set($cache_key, $used_blocks, '', 3600); // Cache for 1 hour
}
```

### 2. Load Time Optimization

#### Asset Optimization
- Only loads CSS/JS for used blocks
- Minimizes HTTP requests
- Optimizes asset delivery
- Uses CDN when available

#### Critical Path Optimization
```php
// Load critical assets inline
if ($this->hasCriticalBlocks()) {
    add_action('wp_head', function() {
        echo '<style>';
        echo $this->getCriticalCSS();
        echo '</style>';
    });
}
```

### 3. Performance Monitoring

#### Block Statistics
```php
public function getBlockStats(): array
{
    $stats = [
        'total_blocks' => 0,
        'jankx_blocks' => 0,
        'used_blocks' => [],
        'partial_hydration_enabled' => false,
        'performance' => [
            'parse_time' => 0,
            'memory_usage' => memory_get_usage(true)
        ]
    ];

    if ($post && isset($post->post_content)) {
        $start_time = microtime(true);

        $blocks = parse_blocks($post->post_content);
        $used_blocks = $this->extractJankxBlocks($blocks);

        $stats['total_blocks'] = count($blocks);
        $stats['jankx_blocks'] = count($used_blocks);
        $stats['used_blocks'] = $used_blocks;
        $stats['performance']['parse_time'] = microtime(true) - $start_time;
    }

    return $stats;
}
```

## Integration with Other Systems

### 1. Block Registry Integration

#### Block Discovery
```php
// Get block from registry
$block_class = BlockRegistry::getBlock($block_name);
if ($block_class) {
    // Register for frontend rendering
    register_block_type($block_name, [
        'render_callback' => [$block_class, 'render'],
        'attributes' => $block_class::getAttributes(),
    ]);
}
```

#### Block Validation
```php
// Validate block before registration
if (class_exists($block_class) && method_exists($block_class, 'render')) {
    // Safe to register
    register_block_type($block_name, $config);
}
```

### 2. Partial Hydration Integration

#### AJAX Handler Registration
```php
// Register AJAX handlers for partial hydration
if ($settings['enabled']) {
    add_action('wp_ajax_jankx_gutenberg_render_block', [$this, 'handleBlockRender']);
    add_action('wp_ajax_nopriv_jankx_gutenberg_render_block', [$this, 'handleBlockRender']);
}
```

#### Block Rendering
```php
public function handleBlockRender(): void
{
    // Verify nonce
    if (!wp_verify_nonce($_POST['nonce'] ?? '', 'jankx_gutenberg_nonce')) {
        wp_die('Security check failed', 'Security Error', ['response' => 403]);
    }

    $block_name = sanitize_text_field($_POST['block_name'] ?? '');
    $attributes = json_decode(stripslashes($_POST['attributes'] ?? '{}'), true);
    $content = wp_kses_post($_POST['content'] ?? '');

    try {
        $block_class = BlockRegistry::getBlock($block_name);
        $rendered_content = $block_class::render($attributes, $content);

        wp_send_json_success([
            'html' => $rendered_content,
            'block_name' => $block_name,
            'attributes' => $attributes,
            'performance' => [
                'render_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'],
                'memory_usage' => memory_get_usage(true)
            ]
        ]);
    } catch (\Exception $e) {
        wp_send_json_error([
            'message' => 'Block rendering failed',
            'error' => $e->getMessage()
        ]);
    }
}
```

### 3. Layout System Integration

#### Layout Detection
```php
// Check if layout blocks are used
$layout_blocks = array_filter($used_blocks, function($block) {
    return strpos($block, 'jankx/layout-') === 0;
});

if (!empty($layout_blocks)) {
    // Load layout-specific assets
    $this->loadLayoutAssets($layout_blocks);
}
```

#### Layout Asset Loading
```php
protected function loadLayoutAssets(array $layout_blocks): void
{
    foreach ($layout_blocks as $layout_block) {
        $layout_name = str_replace('jankx/layout-', '', $layout_block);

        // Load layout-specific CSS
        wp_enqueue_style(
            "jankx-layout-{$layout_name}",
            get_template_directory_uri() . "/assets/css/layouts/{$layout_name}.css",
            [],
            JANKX_VERSION
        );
    }
}
```

## Configuration

### 1. Filter Hooks

#### Custom Content Areas
```php
// Add custom content areas for block parsing
add_filter('jankx/frontend/custom_content', function($content) {
    // Add custom content from other sources
    $custom_content = get_custom_field('blocks_content');
    return $content . $custom_content;
});
```

#### Used Blocks Filter
```php
// Filter used blocks
add_filter('jankx/frontend/used_blocks', function($used_blocks, $content) {
    // Add or remove blocks based on custom logic
    if (is_home()) {
        $used_blocks[] = 'jankx/hero-section';
    }
    return $used_blocks;
}, 10, 2);
```

#### Partial Hydration Settings
```php
// Customize partial hydration settings
add_filter('jankx/frontend/partial_hydration_settings', function($settings) {
    $settings['enabled'] = false; // Disable for specific pages
    $settings['lazyLoadThreshold'] = 0.5; // Custom threshold
    return $settings;
});
```

### 2. Action Hooks

#### Before Block Registration
```php
// Hook before block registration
add_action('jankx/frontend/before_block_registration', function($used_blocks) {
    // Custom logic before registration
    Logger::debug('Registering blocks', ['blocks' => $used_blocks]);
});
```

#### After Block Registration
```php
// Hook after block registration
add_action('jankx/frontend/after_block_registration', function($used_blocks) {
    // Custom logic after registration
    Logger::debug('Blocks registered', ['count' => count($used_blocks)]);
});
```

#### Asset Loading
```php
// Hook for custom asset loading
add_action('jankx/frontend/enqueue_assets', function($used_blocks) {
    // Load custom assets based on used blocks
    if (in_array('jankx/testimonial', $used_blocks)) {
        wp_enqueue_script('testimonial-carousel');
    }
});
```

## Usage Examples

### 1. Basic Implementation

#### Automatic Block Detection
```php
// The system automatically detects and loads used blocks
// No additional configuration needed
```

#### Manual Block Registration
```php
// Force register specific blocks
add_filter('jankx/frontend/used_blocks', function($used_blocks) {
    $used_blocks[] = 'jankx/hero-section';
    return $used_blocks;
});
```

### 2. Custom Content Areas

#### Widget Integration
```php
// Add widget content to block parsing
add_filter('jankx/frontend/custom_content', function($content) {
    $widget_content = get_widget_content();
    return $content . $widget_content;
});
```

#### Custom Fields Integration
```php
// Add custom fields to block parsing
add_filter('jankx/frontend/custom_content', function($content) {
    $custom_blocks = get_field('custom_blocks');
    if ($custom_blocks) {
        $content .= $custom_blocks;
    }
    return $content;
});
```

### 3. Performance Optimization

#### Caching Implementation
```php
// Implement custom caching
add_filter('jankx/frontend/used_blocks', function($used_blocks) {
    $cache_key = 'custom_used_blocks_' . get_the_ID();
    $cached_blocks = wp_cache_get($cache_key);

    if ($cached_blocks !== false) {
        return $cached_blocks;
    }

    wp_cache_set($cache_key, $used_blocks, '', 3600);
    return $used_blocks;
});
```

#### Asset Optimization
```php
// Optimize asset loading
add_action('jankx/frontend/enqueue_assets', function($used_blocks) {
    // Load only necessary assets
    foreach ($used_blocks as $block) {
        $asset_file = "assets/blocks/{$block}/style.css";
        if (file_exists($asset_file)) {
            wp_enqueue_style("jankx-{$block}", get_template_directory_uri() . "/{$asset_file}");
        }
    }
});
```

## Best Practices

### 1. Performance

#### Efficient Parsing
- Use caching for parsed blocks
- Optimize content parsing algorithms
- Minimize database queries
- Use lazy loading for non-critical blocks

#### Asset Optimization
- Load only necessary CSS/JS
- Use asset minification
- Implement critical CSS inlining
- Use CDN for static assets

### 2. Security

#### Input Validation
- Validate all parsed content
- Sanitize block attributes
- Verify block class existence
- Use nonce verification for AJAX

#### Output Sanitization
- Sanitize rendered HTML
- Escape dynamic content
- Validate block output
- Use WordPress security functions

### 3. Maintainability

#### Code Organization
- Use clear method names
- Implement proper error handling
- Add comprehensive logging
- Follow WordPress coding standards

#### Documentation
- Document all public methods
- Add inline comments
- Create usage examples
- Maintain API documentation

### 4. Extensibility

#### Hook System
- Provide comprehensive hooks
- Allow custom content areas
- Support custom block detection
- Enable custom asset loading

#### Plugin Integration
- Support third-party blocks
- Allow custom block registration
- Provide integration APIs
- Support custom rendering

## Troubleshooting

### Common Issues

1. **Blocks Not Loading**
   - Check if blocks are properly registered
   - Verify block class existence
   - Check for PHP errors
   - Review block parsing logic

2. **Performance Issues**
   - Monitor memory usage
   - Check parsing performance
   - Optimize asset loading
   - Implement caching

3. **AJAX Errors**
   - Verify nonce generation
   - Check AJAX endpoint registration
   - Review error handling
   - Test AJAX functionality

4. **Asset Loading Issues**
   - Check file paths
   - Verify asset dependencies
   - Review enqueue logic
   - Test asset loading

### Debug Mode

Enable debug mode for detailed logging:

```php
// In wp-config.php
define('JANKX_FRONTEND_DEBUG', true);
define('JANKX_FRONTEND_LOG_LEVEL', 'debug');
```

### Performance Monitoring

Monitor performance with built-in tools:

```php
// Get performance statistics
$stats = $this->getBlockStats();
Logger::debug('Frontend performance', $stats);
```

## Future Enhancements

1. **Advanced Caching** - Redis/Memcached integration
2. **Predictive Loading** - Load blocks based on user behavior
3. **Asset Optimization** - Automatic asset optimization
4. **Performance Analytics** - Detailed performance tracking
5. **Block Dependencies** - Automatic dependency resolution
6. **Custom Block Types** - Support for custom block types
7. **Multi-site Support** - Network-wide block management
8. **API Integration** - REST API for block management

## Related Documentation

- [Gutenberg Blocks](./GUTENBERG_BLOCKS.md)
- [Gutenberg AJAX System](./GUTENBERG_AJAX_SYSTEM.md)
- [Partial Hydration System](./PARTIAL_HYDRATION_SYSTEM.md)
- [Performance Optimization](./PERFORMANCE.md)