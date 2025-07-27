# Troubleshooting - Post Layout System

## Overview

Tài liệu này cung cấp hướng dẫn troubleshooting cho các vấn đề thường gặp trong Post Layout system của Jankx 2.0.

## Common Issues

### 1. Query Loop Not Rendering

#### Symptoms
- Query loop block hiển thị trống
- Không có posts nào được hiển thị
- Error message "No posts found"

#### Diagnosis
```php
// Debug query parameters
function jankx_debug_query_parameters($attributes) {
    error_log('Jankx Query Debug:');
    error_log('Attributes: ' . print_r($attributes, true));

    $query_args = jankx_build_query_args($attributes);
    error_log('Query Args: ' . print_r($query_args, true));

    $query = new WP_Query($query_args);
    error_log('Query Results: ' . $query->found_posts . ' posts found');

    return $query;
}
```

#### Solutions

**1. Check if posts exist**
```php
function jankx_check_posts_exist($post_type = 'post') {
    $posts = get_posts([
        'post_type' => $post_type,
        'post_status' => 'publish',
        'numberposts' => 1
    ]);

    if (empty($posts)) {
        return false;
    }

    return true;
}
```

**2. Verify query arguments**
```php
function jankx_verify_query_args($attributes) {
    $issues = [];

    // Check post type
    if (!empty($attributes['postType'])) {
        $post_types = get_post_types(['public' => true]);
        if (!in_array($attributes['postType'], $post_types)) {
            $issues[] = 'Invalid post type: ' . $attributes['postType'];
        }
    }

    // Check taxonomy
    if (!empty($attributes['taxonomy'])) {
        $taxonomies = get_taxonomies(['public' => true]);
        if (!in_array($attributes['taxonomy'], $taxonomies)) {
            $issues[] = 'Invalid taxonomy: ' . $attributes['taxonomy'];
        }
    }

    // Check terms
    if (!empty($attributes['terms']) && !empty($attributes['taxonomy'])) {
        $terms = get_terms([
            'taxonomy' => $attributes['taxonomy'],
            'include' => $attributes['terms'],
            'hide_empty' => false
        ]);

        if (empty($terms)) {
            $issues[] = 'No terms found for taxonomy: ' . $attributes['taxonomy'];
        }
    }

    return $issues;
}
```

### 2. Pattern Not Rendering

#### Symptoms
- Pattern không hiển thị đúng
- Missing content trong pattern
- Pattern hiển thị "Pattern not found"

#### Diagnosis
```php
// Debug pattern rendering
function jankx_debug_pattern_rendering($pattern_name, $post_id) {
    error_log('Jankx Pattern Debug:');
    error_log('Pattern: ' . $pattern_name);
    error_log('Post ID: ' . $post_id);

    // Check if pattern exists
    $pattern = get_block_pattern($pattern_name);
    if (!$pattern) {
        error_log('Pattern not found: ' . $pattern_name);
        return false;
    }

    error_log('Pattern content: ' . $pattern['content']);

    // Check if post exists
    $post = get_post($post_id);
    if (!$post) {
        error_log('Post not found: ' . $post_id);
        return false;
    }

    return true;
}
```

#### Solutions

**1. Register missing patterns**
```php
function jankx_register_missing_patterns() {
    $required_patterns = [
        'jankx/post-card',
        'jankx/post-card-meta',
        'jankx/hero-post',
        'jankx/grid-2-columns',
        'jankx/grid-3-columns'
    ];

    foreach ($required_patterns as $pattern_name) {
        if (!get_block_pattern($pattern_name)) {
            jankx_register_default_pattern($pattern_name);
        }
    }
}
```

**2. Fallback pattern**
```php
function jankx_get_fallback_pattern($pattern_name) {
    $fallback_patterns = [
        'jankx/post-card' => 'jankx/post-card-meta',
        'jankx/hero-post' => 'jankx/post-card',
        'jankx/grid-2-columns' => 'jankx/post-card',
    ];

    return $fallback_patterns[$pattern_name] ?? 'jankx/post-card';
}
```

### 3. Performance Issues

#### Symptoms
- Query loop load chậm
- High memory usage
- Timeout errors
- Slow page load

#### Diagnosis
```php
// Monitor query performance
function jankx_monitor_query_performance($attributes) {
    $start_time = microtime(true);
    $start_memory = memory_get_usage();

    $query = jankx_build_query_args($attributes);
    $wp_query = new WP_Query($query);

    $end_time = microtime(true);
    $end_memory = memory_get_usage();

    $performance_data = [
        'execution_time' => $end_time - $start_time,
        'memory_usage' => $end_memory - $start_memory,
        'posts_found' => $wp_query->found_posts,
        'posts_returned' => $wp_query->post_count,
    ];

    error_log('Jankx Performance: ' . json_encode($performance_data));

    return $performance_data;
}
```

#### Solutions

**1. Implement caching**
```php
function jankx_cache_query_results($attributes, $html) {
    $cache_key = 'jankx_query_' . md5(serialize($attributes));
    wp_cache_set($cache_key, $html, 'jankx_query_loop', 300); // 5 minutes

    return $html;
}
```

**2. Optimize query arguments**
```php
function jankx_optimize_query_args($attributes) {
    $query_args = jankx_build_query_args($attributes);

    // Disable unnecessary queries if not using pagination
    if (empty($attributes['showPagination'])) {
        $query_args['no_found_rows'] = true;
    }

    // Disable term cache if not using terms
    if (empty($attributes['taxonomy'])) {
        $query_args['update_post_term_cache'] = false;
    }

    // Disable meta cache if not using meta
    if (empty($attributes['metaQuery'])) {
        $query_args['update_post_meta_cache'] = false;
    }

    return $query_args;
}
```

**3. Implement lazy loading**
```php
function jankx_lazy_load_implementation($attributes) {
    $per_page = min($attributes['perPage'] ?? 6, 12); // Limit initial load

    $attributes['perPage'] = $per_page;

    return jankx_safe_query_loop_render($attributes);
}
```

### 4. Editor Issues

#### Symptoms
- Block không hiển thị trong editor
- Inspector controls không hoạt động
- Preview không load
- JavaScript errors

#### Diagnosis
```javascript
// Debug editor issues
function jankxDebugEditorIssues() {
    console.log('Jankx Editor Debug:');

    // Check if block is registered
    const blocks = wp.blocks.getBlockTypes();
    const jankxBlocks = blocks.filter(block => block.name.startsWith('jankx/'));
    console.log('Registered Jankx blocks:', jankxBlocks);

    // Check if patterns are available
    const patterns = wp.blocks.getBlockPatterns();
    const jankxPatterns = patterns.filter(pattern => pattern.name.startsWith('jankx/'));
    console.log('Available Jankx patterns:', jankxPatterns);

    // Check for JavaScript errors
    window.addEventListener('error', function(e) {
        console.error('Jankx JavaScript error:', e.error);
    });
}
```

#### Solutions

**1. Ensure block registration**
```php
function jankx_ensure_block_registration() {
    if (!function_exists('register_block_type')) {
        return;
    }

    register_block_type('jankx/dynamic-query-loop', [
        'attributes' => jankx_get_query_loop_attributes(),
        'render_callback' => 'jankx_dynamic_query_loop_render',
        'editor_script' => 'jankx-dynamic-query-loop-editor',
        'editor_style' => 'jankx-dynamic-query-loop-editor-style',
    ]);
}
```

**2. Enqueue editor assets**
```php
function jankx_enqueue_editor_assets() {
    if (!is_admin()) {
        return;
    }

    wp_enqueue_script(
        'jankx-dynamic-query-loop-editor',
        get_template_directory_uri() . '/assets/js/editor.js',
        ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components'],
        \Jankx\Jankx::getFrameworkVersion()
    );

    wp_enqueue_style(
        'jankx-dynamic-query-loop-editor-style',
        get_template_directory_uri() . '/assets/css/editor.css',
        ['wp-edit-blocks'],
        \Jankx\Jankx::getFrameworkVersion()
    );
}
add_action('enqueue_block_editor_assets', 'jankx_enqueue_editor_assets');
```

### 5. Migration Issues

#### Symptoms
- Old shortcodes không được convert
- Missing content sau migration
- Block attributes không đúng
- Layout bị broken

#### Diagnosis
```php
// Debug migration issues
function jankx_debug_migration_issues() {
    global $wpdb;

    // Check for old shortcodes
    $posts_with_old_shortcodes = $wpdb->get_results("
        SELECT ID, post_title, post_content
        FROM {$wpdb->posts}
        WHERE post_content LIKE '%[jankx_layout%'
        LIMIT 10
    ");

    foreach ($posts_with_old_shortcodes as $post) {
        error_log('Post with old shortcodes: ' . $post->post_title);
        error_log('Content preview: ' . substr($post->post_content, 0, 200));
    }

    // Check for new blocks
    $posts_with_new_blocks = $wpdb->get_results("
        SELECT ID, post_title, post_content
        FROM {$wpdb->posts}
        WHERE post_content LIKE '%jankx/dynamic-query-loop%'
        LIMIT 10
    ");

    foreach ($posts_with_new_blocks as $post) {
        error_log('Post with new blocks: ' . $post->post_title);
    }

    return [
        'old_shortcodes' => count($posts_with_old_shortcodes),
        'new_blocks' => count($posts_with_new_blocks)
    ];
}
```

#### Solutions

**1. Re-run migration**
```php
function jankx_rerun_migration($post_id) {
    $post = get_post($post_id);
    $content = $post->post_content;

    // Find old shortcodes
    $pattern = '/\[jankx_layout([^\]]*)\](.*?)\[\/jankx_layout\]/s';

    if (preg_match($pattern, $content)) {
        $migration = new Jankx_Layout_Migration();
        $new_content = $migration->migrate_post($post_id);

        return $new_content;
    }

    return $content;
}
```

**2. Manual migration helper**
```php
function jankx_manual_migration_helper($old_shortcode) {
    // Parse old shortcode
    preg_match('/\[jankx_layout([^\]]*)\](.*?)\[\/jankx_layout\]/s', $old_shortcode, $matches);

    if (empty($matches)) {
        return false;
    }

    $attributes = shortcode_parse_atts($matches[1]);
    $new_attributes = jankx_convert_layout_attributes($attributes);

    return jankx_render_query_loop_block($new_attributes);
}
```

## Debug Tools

### 1. Debug Mode
```php
// Enable debug mode
define('JANKX_DEBUG', true);

if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
    function jankx_debug_log($message, $data = null) {
        if ($data) {
            error_log('Jankx Debug: ' . $message . ' - ' . print_r($data, true));
        } else {
            error_log('Jankx Debug: ' . $message);
        }
    }
} else {
    function jankx_debug_log($message, $data = null) {
        // No-op in production
    }
}
```

### 2. Health Check
```php
function jankx_health_check() {
    $health_report = [
        'patterns_registered' => false,
        'blocks_registered' => false,
        'posts_available' => false,
        'cache_working' => false,
        'errors' => []
    ];

    // Check patterns
    $patterns = get_block_patterns();
    $jankx_patterns = array_filter($patterns, function($pattern) {
        return strpos($pattern['name'], 'jankx/') === 0;
    });

    if (!empty($jankx_patterns)) {
        $health_report['patterns_registered'] = true;
    } else {
        $health_report['errors'][] = 'No Jankx patterns registered';
    }

    // Check blocks
    $blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();
    $jankx_blocks = array_filter($blocks, function($block) {
        return strpos($block->name, 'jankx/') === 0;
    });

    if (!empty($jankx_blocks)) {
        $health_report['blocks_registered'] = true;
    } else {
        $health_report['errors'][] = 'No Jankx blocks registered';
    }

    // Check posts
    $posts = get_posts(['post_type' => 'post', 'numberposts' => 1]);
    if (!empty($posts)) {
        $health_report['posts_available'] = true;
    } else {
        $health_report['errors'][] = 'No posts available';
    }

    // Check cache
    $test_key = 'jankx_health_check';
    wp_cache_set($test_key, 'test', 'jankx', 60);
    $cached = wp_cache_get($test_key, 'jankx');

    if ($cached === 'test') {
        $health_report['cache_working'] = true;
    } else {
        $health_report['errors'][] = 'Cache not working';
    }

    return $health_report;
}
```

### 3. Emergency Fixes

#### Fix Missing Patterns
```php
function jankx_emergency_fix_patterns() {
    // Re-register all default patterns
    jankx_register_default_patterns();

    // Clear any cached pattern data
    wp_cache_flush_group('jankx_patterns');

    return 'Patterns re-registered successfully';
}
```

#### Fix Block Registration
```php
function jankx_emergency_fix_blocks() {
    // Re-register all blocks
    jankx_register_all_blocks();

    // Clear block registry cache
    if (function_exists('wp_blocks_clear_cache')) {
        wp_blocks_clear_cache();
    }

    return 'Blocks re-registered successfully';
}
```

#### Fix Migration Issues
```php
function jankx_emergency_fix_migration() {
    global $wpdb;

    // Find all posts with old shortcodes
    $posts = $wpdb->get_results("
        SELECT ID, post_content
        FROM {$wpdb->posts}
        WHERE post_content LIKE '%[jankx_layout%'
    ");

    $fixed_count = 0;
    foreach ($posts as $post) {
        $migration = new Jankx_Layout_Migration();
        $new_content = $migration->migrate_post($post->ID);

        if ($new_content !== $post->post_content) {
            $fixed_count++;
        }
    }

    return "Fixed {$fixed_count} posts";
}
```

## Support Resources

### 1. Log Files
```php
// Enable detailed logging
function jankx_enable_detailed_logging() {
    if (!defined('WP_DEBUG') || !WP_DEBUG) {
        return;
    }

    // Log all Jankx operations
    add_action('jankx/frontend/used_blocks', function($used_blocks, $content) {
        error_log('Jankx Used Blocks: ' . json_encode([
            'blocks' => $used_blocks,
            'content_length' => strlen($content),
            'timestamp' => current_time('mysql')
        ]));
    }, 10, 2);

    // Log partial hydration settings
    add_action('jankx/frontend/partial_hydration_settings', function($settings) {
        error_log('Jankx Partial Hydration: ' . json_encode([
            'settings' => $settings,
            'timestamp' => current_time('mysql')
        ]));
    }, 10, 1);
}
```

### 2. Error Reporting
```php
// Custom error handler for Jankx
function jankx_error_handler($errno, $errstr, $errfile, $errline) {
    if (strpos($errfile, 'jankx') !== false) {
        error_log("Jankx Error: {$errstr} in {$errfile} on line {$errline}");

        // Send to admin if critical
        if ($errno === E_ERROR || $errno === E_PARSE) {
            wp_mail(
                get_option('admin_email'),
                'Jankx Critical Error',
                "Error: {$errstr}\nFile: {$errfile}\nLine: {$errline}"
            );
        }
    }

    return false; // Let PHP handle other errors
}
set_error_handler('jankx_error_handler');
```

### 3. Performance Monitoring
```php
// Monitor performance in production
function jankx_performance_monitor() {
    if (!is_admin()) {
        return;
    }

    $performance_data = [
        'memory_usage' => memory_get_usage(),
        'peak_memory' => memory_get_peak_usage(),
        'load_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'],
        'query_count' => get_num_queries(),
    ];

    // Log if performance is poor
    if ($performance_data['memory_usage'] > 50 * 1024 * 1024) { // 50MB
        error_log('Jankx High Memory Usage: ' . json_encode($performance_data));
    }

    if ($performance_data['load_time'] > 5) { // 5 seconds
        error_log('Jankx Slow Load Time: ' . json_encode($performance_data));
    }
}
add_action('wp_footer', 'jankx_performance_monitor');
```