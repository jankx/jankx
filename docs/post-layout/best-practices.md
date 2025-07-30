# Best Practices - Post Layout System

## Overview

Tài liệu này cung cấp các best practices cho việc phát triển và sử dụng Post Layout system trong Jankx 2.0.

## Development Best Practices

### 1. Pattern Design

#### 1.1 Keep Patterns Simple
```php
// ✅ Good: Simple, focused pattern
register_block_pattern('jankx/simple-card', [
    'title' => 'Simple Post Card',
    'content' => '<!-- wp:group {"className":"jankx-simple-card"} -->
<div class="wp-block-group jankx-simple-card">
    <!-- wp:post-featured-image {"className":"jankx-card-image"} /-->
    <!-- wp:post-title {"className":"jankx-card-title","level":3} /-->
    <!-- wp:post-excerpt {"className":"jankx-card-excerpt"} /-->
</div>
<!-- /wp:group -->'
]);

// ❌ Avoid: Overly complex pattern
register_block_pattern('jankx/complex-card', [
    'title' => 'Complex Post Card',
    'content' => '<!-- wp:group {"className":"jankx-complex-card"} -->
<div class="wp-block-group jankx-complex-card">
    <!-- wp:post-featured-image {"className":"jankx-card-image"} /-->
    <!-- wp:group {"className":"jankx-card-header"} -->
    <div class="wp-block-group jankx-card-header">
        <!-- wp:post-title {"className":"jankx-card-title","level":3} /-->
        <!-- wp:post-date {"className":"jankx-card-date"} /-->
    </div>
    <!-- /wp:group -->
    <!-- wp:group {"className":"jankx-card-content"} -->
    <div class="wp-block-group jankx-card-content">
        <!-- wp:post-excerpt {"className":"jankx-card-excerpt"} /-->
        <!-- wp:post-terms {"term":"category","className":"jankx-card-category"} /-->
    </div>
    <!-- /wp:group -->
    <!-- wp:group {"className":"jankx-card-footer"} -->
    <div class="wp-block-group jankx-card-footer">
        <!-- wp:post-author {"className":"jankx-card-author"} /-->
        <!-- wp:buttons {"className":"jankx-card-buttons"} -->
        <div class="wp-block-buttons jankx-card-buttons">
            <!-- wp:button {"className":"jankx-card-button"} -->
            <div class="wp-block-button jankx-card-button">
                <a class="wp-block-button__link">Read More</a>
            </div>
            <!-- /wp:button -->
        </div>
        <!-- /wp:buttons -->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->'
]);
```

#### 1.2 Use Semantic HTML
```php
// ✅ Good: Semantic structure
register_block_pattern('jankx/semantic-card', [
    'title' => 'Semantic Post Card',
    'content' => '<!-- wp:article {"className":"jankx-post-card"} -->
<article class="wp-block-article jankx-post-card">
    <!-- wp:post-featured-image {"className":"jankx-card-image"} /-->
    <!-- wp:header {"className":"jankx-card-header"} -->
    <header class="wp-block-header jankx-card-header">
        <!-- wp:post-title {"className":"jankx-card-title","level":2} /-->
        <!-- wp:post-date {"className":"jankx-card-date"} /-->
    </header>
    <!-- /wp:header -->
    <!-- wp:post-excerpt {"className":"jankx-card-excerpt"} /-->
</article>
<!-- /wp:article -->'
]);
```

#### 1.3 Responsive Design
```php
// ✅ Good: Responsive pattern
register_block_pattern('jankx/responsive-card', [
    'title' => 'Responsive Post Card',
    'content' => '<!-- wp:group {"className":"jankx-responsive-card"} -->
<div class="wp-block-group jankx-responsive-card">
    <!-- wp:post-featured-image {"className":"jankx-card-image","sizeSlug":"medium"} /-->
    <!-- wp:group {"className":"jankx-card-content"} -->
    <div class="wp-block-group jankx-card-content">
        <!-- wp:post-title {"className":"jankx-card-title","level":3} /-->
        <!-- wp:post-excerpt {"className":"jankx-card-excerpt"} /-->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->'
]);
```

### 2. Query Loop Optimization

#### 2.1 Efficient Query Building
```php
// ✅ Good: Optimized query
function jankx_optimized_query_loop_render($attributes) {
    $query_args = [
        'post_type' => $attributes['postType'] ?? 'post',
        'posts_per_page' => min($attributes['perPage'] ?? 6, 50), // Limit max posts
        'orderby' => $attributes['orderBy'] ?? 'date',
        'order' => $attributes['order'] ?? 'DESC',
        'post_status' => 'publish',
        'no_found_rows' => empty($attributes['showPagination']), // Optimize if no pagination
        'update_post_term_cache' => false, // Disable if not using terms
        'update_post_meta_cache' => false, // Disable if not using meta
    ];

    // Only add tax_query if needed
    if (!empty($attributes['taxonomy']) && !empty($attributes['terms'])) {
        $query_args['tax_query'] = [
            [
                'taxonomy' => $attributes['taxonomy'],
                'field' => 'term_id',
                'terms' => $attributes['terms']
            ]
        ];
    }

    return new WP_Query($query_args);
}
```

#### 2.2 Caching Strategy
```php
// ✅ Good: Implement caching
function jankx_cached_query_loop_render($attributes) {
    $cache_key = 'jankx_query_' . md5(serialize($attributes));
    $cached_result = wp_cache_get($cache_key, 'jankx_query_loop');

    if ($cached_result !== false) {
        return $cached_result;
    }

    $query = jankx_optimized_query_loop_render($attributes);
    $html = jankx_render_query_results($query, $attributes);

    // Cache for 5 minutes
    wp_cache_set($cache_key, $html, 'jankx_query_loop', 300);

    return $html;
}
```

#### 2.3 Error Handling
```php
// ✅ Good: Proper error handling
function jankx_safe_query_loop_render($attributes) {
    try {
        $query = jankx_optimized_query_loop_render($attributes);

        if (is_wp_error($query)) {
            return '<div class="jankx-query-error">Query error: ' . $query->get_error_message() . '</div>';
        }

        if (!$query->have_posts()) {
            return '<div class="jankx-query-empty">No posts found.</div>';
        }

        return jankx_render_query_results($query, $attributes);

    } catch (Exception $e) {
        error_log('Jankx query loop error: ' . $e->getMessage());
        return '<div class="jankx-query-error">An error occurred while loading posts.</div>';
    }
}
```

### 3. Performance Optimization

#### 3.1 Lazy Loading
```php
// ✅ Good: Implement lazy loading
function jankx_lazy_load_query_loop($attributes, $page = 1) {
    $query_args = jankx_build_query_args($attributes);
    $query_args['paged'] = $page;

    $query = new WP_Query($query_args);

    $html = '';
    while ($query->have_posts()) {
        $query->the_post();
        $html .= jankx_render_pattern_for_post($attributes['layoutPattern'], get_the_ID());
    }

    wp_reset_postdata();

    return [
        'html' => $html,
        'hasMore' => $page < $query->max_num_pages,
        'totalPages' => $query->max_num_pages
    ];
}
```

#### 3.2 Asset Optimization
```php
// ✅ Good: Optimize asset loading
function jankx_optimize_pattern_assets() {
    // Only load pattern styles when needed
    if (has_block('jankx/dynamic-query-loop')) {
        wp_enqueue_style(
            'jankx-patterns',
            get_template_directory_uri() . '/assets/css/patterns.min.css',
            [],
            \Jankx\Jankx::getFrameworkVersion()
        );

        // Inline critical CSS
        wp_add_inline_style('jankx-patterns', '
            .jankx-post-card {
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
        ');
    }
}
add_action('wp_enqueue_scripts', 'jankx_optimize_pattern_assets');
```

## User Experience Best Practices

### 1. Editor Interface

#### 1.1 Intuitive Controls
```javascript
// ✅ Good: Clear, organized controls
function JankxQueryLoopInspector({ attributes, setAttributes }) {
    return (
        <InspectorControls>
            <PanelBody title="Query Settings" initialOpen={true}>
                <SelectControl
                    label="Post Type"
                    value={attributes.postType}
                    options={[
                        { label: 'Posts', value: 'post' },
                        { label: 'Pages', value: 'page' },
                        { label: 'Custom Post Type', value: 'custom' }
                    ]}
                    onChange={(value) => setAttributes({ postType: value })}
                    help="Select the type of content to display"
                />

                <RangeControl
                    label="Posts Per Page"
                    value={attributes.perPage}
                    onChange={(value) => setAttributes({ perPage: value })}
                    min={1}
                    max={50}
                    help="Number of posts to display (1-50)"
                />
            </PanelBody>

            <PanelBody title="Layout Settings">
                <SelectControl
                    label="Layout Pattern"
                    value={attributes.layoutPattern}
                    options={jankx_get_pattern_options()}
                    onChange={(value) => setAttributes({ layoutPattern: value })}
                    help="Choose how posts are displayed"
                />
            </PanelBody>
        </InspectorControls>
    );
}
```

#### 1.2 Live Preview
```javascript
// ✅ Good: Real-time preview
function JankxQueryLoopPreview({ attributes }) {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch preview data
        jankx_fetch_preview_data(attributes)
            .then(data => {
                setPreviewData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Preview error:', error);
                setLoading(false);
            });
    }, [attributes]);

    if (loading) {
        return <div className="jankx-preview-loading">Loading preview...</div>;
    }

    if (!previewData) {
        return <div className="jankx-preview-error">Preview not available</div>;
    }

    return (
        <div className="jankx-query-loop-preview">
            {previewData.map(post => (
                <div key={post.id} className="jankx-preview-item">
                    {jankx_render_preview_pattern(attributes.layoutPattern, post)}
                </div>
            ))}
        </div>
    );
}
```

### 2. Frontend Experience

#### 2.1 Loading States
```php
// ✅ Good: Show loading state
function jankx_query_loop_with_loading($attributes) {
    $loading_html = '<div class="jankx-query-loading">
        <div class="jankx-loading-spinner"></div>
        <p>Loading posts...</p>
    </div>';

    $content = jankx_safe_query_loop_render($attributes);

    return '<div class="jankx-query-loop-container" data-attributes="' . esc_attr(json_encode($attributes)) . '">
        <div class="jankx-query-content">' . $content . '</div>
        <div class="jankx-query-loading" style="display: none;">' . $loading_html . '</div>
    </div>';
}
```

#### 2.2 Error States
```php
// ✅ Good: Handle errors gracefully
function jankx_query_loop_error_handling($attributes) {
    try {
        $query = jankx_optimized_query_loop_render($attributes);

        if (!$query->have_posts()) {
            return '<div class="jankx-query-empty">
                <p>No posts found matching your criteria.</p>
                <p>Try adjusting your search or filter settings.</p>
            </div>';
        }

        return jankx_render_query_results($query, $attributes);

    } catch (Exception $e) {
        return '<div class="jankx-query-error">
            <p>Sorry, we encountered an error while loading posts.</p>
            <p>Please try refreshing the page or contact support if the problem persists.</p>
        </div>';
    }
}
```

## Security Best Practices

### 1. Input Validation
```php
// ✅ Good: Validate user input
function jankx_validate_query_attributes($attributes) {
    $validated = [];

    // Validate post type
    $valid_post_types = get_post_types(['public' => true]);
    $validated['postType'] = in_array($attributes['postType'], $valid_post_types)
        ? $attributes['postType']
        : 'post';

    // Validate per page (limit to reasonable range)
    $validated['perPage'] = min(max((int)$attributes['perPage'], 1), 50);

    // Validate order
    $valid_orders = ['ASC', 'DESC'];
    $validated['order'] = in_array(strtoupper($attributes['order']), $valid_orders)
        ? strtoupper($attributes['order'])
        : 'DESC';

    // Validate orderby
    $valid_orderby = ['date', 'title', 'menu_order', 'rand'];
    $validated['orderBy'] = in_array($attributes['orderBy'], $valid_orderby)
        ? $attributes['orderBy']
        : 'date';

    return $validated;
}
```

### 2. SQL Injection Prevention
```php
// ✅ Good: Use WordPress query methods
function jankx_safe_query_building($attributes) {
    $query_args = [
        'post_type' => sanitize_text_field($attributes['postType']),
        'posts_per_page' => (int)$attributes['perPage'],
        'orderby' => sanitize_text_field($attributes['orderBy']),
        'order' => sanitize_text_field($attributes['order']),
    ];

    // Use WordPress sanitization for taxonomy terms
    if (!empty($attributes['terms'])) {
        $terms = array_map('intval', $attributes['terms']);
        $query_args['post__in'] = $terms;
    }

    return new WP_Query($query_args);
}
```

### 3. XSS Prevention
```php
// ✅ Good: Escape output
function jankx_safe_pattern_render($pattern_name, $post_id) {
    $pattern = get_block_pattern($pattern_name);
    if (!$pattern) {
        return '<div class="jankx-pattern-error">Pattern not found</div>';
    }

    // Set up post data safely
    setup_postdata($post_id);

    $blocks = parse_blocks($pattern['content']);
    ob_start();

    foreach ($blocks as $block) {
        // Ensure blocks are rendered safely
        echo wp_kses_post(render_block($block));
    }

    return ob_get_clean();
}
```

## Testing Best Practices

### 1. Unit Testing
```php
// ✅ Good: Test pattern rendering
class Jankx_Pattern_Test extends WP_UnitTestCase {
    public function test_pattern_rendering() {
        $post_id = $this->factory->post->create([
            'post_title' => 'Test Post',
            'post_content' => 'Test content',
        ]);

        $pattern_name = 'jankx/post-card';
        $rendered = jankx_render_pattern_for_post($pattern_name, $post_id);

        $this->assertNotEmpty($rendered);
        $this->assertContains('Test Post', $rendered);
        $this->assertContains('jankx-post-card', $rendered);
    }

    public function test_query_loop_attributes() {
        $attributes = [
            'postType' => 'post',
            'perPage' => 5,
            'orderBy' => 'date',
            'order' => 'DESC',
        ];

        $validated = jankx_validate_query_attributes($attributes);

        $this->assertEquals('post', $validated['postType']);
        $this->assertEquals(5, $validated['perPage']);
        $this->assertEquals('date', $validated['orderBy']);
        $this->assertEquals('DESC', $validated['order']);
    }
}
```

### 2. Integration Testing
```php
// ✅ Good: Test full query loop
class Jankx_Query_Loop_Test extends WP_UnitTestCase {
    public function test_query_loop_rendering() {
        // Create test posts
        $post_ids = [];
        for ($i = 1; $i <= 5; $i++) {
            $post_ids[] = $this->factory->post->create([
                'post_title' => "Test Post {$i}",
                'post_content' => "Content {$i}",
            ]);
        }

        $attributes = [
            'postType' => 'post',
            'perPage' => 3,
            'layoutPattern' => 'jankx/post-card',
        ];

        $rendered = jankx_safe_query_loop_render($attributes);

        $this->assertNotEmpty($rendered);
        $this->assertContains('jankx-dynamic-query-loop', $rendered);

        // Check that correct number of posts are rendered
        $post_count = substr_count($rendered, 'jankx-post-card');
        $this->assertEquals(3, $post_count);
    }
}
```

### 3. Performance Testing
```php
// ✅ Good: Test query performance
function jankx_test_query_performance($attributes) {
    $start_time = microtime(true);

    $query = jankx_optimized_query_loop_render($attributes);
    $html = jankx_render_query_results($query, $attributes);

    $end_time = microtime(true);
    $execution_time = $end_time - $start_time;

    // Log performance metrics
    error_log("Jankx query performance: {$execution_time} seconds for " . $query->found_posts . " posts");

    return [
        'execution_time' => $execution_time,
        'post_count' => $query->found_posts,
        'html_length' => strlen($html)
    ];
}
```

## Documentation Best Practices

### 1. Code Documentation
```php
/**
 * Render a pattern for a specific post
 *
 * @param string $pattern_name The name of the pattern to render
 * @param int    $post_id      The post ID to render the pattern for
 * @return string The rendered HTML
 * @throws Exception If pattern rendering fails
 */
function jankx_render_pattern_for_post($pattern_name, $post_id) {
    // Implementation...
}

/**
 * Build optimized query arguments for Jankx query loop
 *
 * @param array $attributes Block attributes containing query configuration
 * @return array Query arguments for WP_Query
 */
function jankx_build_query_args($attributes) {
    // Implementation...
}
```

### 2. User Documentation
```markdown
# Using Jankx Post Layouts

## Adding a Query Loop

1. In the Gutenberg editor, click the "+" button
2. Search for "Jankx Query Loop"
3. Select the block to add it to your page

## Configuring the Query

- **Post Type**: Choose which type of content to display
- **Posts Per Page**: Set how many posts to show (1-50)
- **Layout Pattern**: Choose how posts are displayed
- **Order**: Sort posts by date, title, or other criteria

## Customizing Layouts

- Patterns can be edited directly in the Gutenberg editor
- Use the block inspector to modify pattern settings
- Add custom CSS classes for styling
```

## Maintenance Best Practices

### 1. Version Control
```php
// ✅ Good: Track pattern versions
function jankx_get_pattern_version($pattern_name) {
    $pattern = get_block_pattern($pattern_name);
    return $pattern['version'] ?? '1.0.0';
}

function jankx_update_pattern_version($pattern_name, $new_version) {
    $pattern = get_block_pattern($pattern_name);
    $pattern['version'] = $new_version;

    // Update pattern registration
    unregister_block_pattern($pattern_name);
    register_block_pattern($pattern_name, $pattern);
}
```

### 2. Backward Compatibility
```php
// ✅ Good: Maintain backward compatibility
function jankx_ensure_backward_compatibility($attributes) {
    // Handle old attribute names
    if (isset($attributes['posts_per_page']) && !isset($attributes['perPage'])) {
        $attributes['perPage'] = $attributes['posts_per_page'];
    }

    if (isset($attributes['post_type']) && !isset($attributes['postType'])) {
        $attributes['postType'] = $attributes['post_type'];
    }

    return $attributes;
}
```

### 3. Monitoring and Logging
```php
// ✅ Good: Monitor system health
function jankx_monitor_query_performance() {
    $performance_data = [
        'query_time' => 0,
        'memory_usage' => memory_get_usage(),
        'post_count' => 0,
        'cache_hits' => 0,
        'cache_misses' => 0,
    ];

    // Log performance data
    error_log('Jankx performance: ' . json_encode($performance_data));

    return $performance_data;
}
```