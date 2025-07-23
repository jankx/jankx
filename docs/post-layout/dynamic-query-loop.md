# Dynamic Query Loop Implementation

## Overview

Dynamic Query Loop là core component của Jankx 2.0 Post Layout system. Khác với Gutenberg Query Loop mặc định (render static HTML), Dynamic Query Loop luôn thực hiện query và render dữ liệu mới nhất mỗi lần load trang.

## Key Differences from Gutenberg Query Loop

| Feature | Gutenberg Query Loop | Jankx Dynamic Query Loop |
|---------|---------------------|--------------------------|
| **Data Storage** | Static HTML trong post_content | Chỉ lưu query configuration |
| **Data Freshness** | "Frozen" tại thời điểm save | Luôn cập nhật mới nhất |
| **Performance** | Fast load (static) | Dynamic query (có thể cache) |
| **Flexibility** | Limited customization | Full customization |
| **Real-time Updates** | Không | Có |

## Block Structure

### Block Registration
```php
register_block_type('jankx/dynamic-query-loop', [
    'attributes' => [
        'postType' => [
            'type' => 'string',
            'default' => 'post'
        ],
        'perPage' => [
            'type' => 'number',
            'default' => 6
        ],
        'layoutPattern' => [
            'type' => 'string',
            'default' => 'jankx/post-card'
        ],
        'gridColumns' => [
            'type' => 'number',
            'default' => 3
        ],
        'orderBy' => [
            'type' => 'string',
            'default' => 'date'
        ],
        'order' => [
            'type' => 'string',
            'default' => 'DESC'
        ],
        'taxonomy' => [
            'type' => 'string',
            'default' => ''
        ],
        'terms' => [
            'type' => 'array',
            'default' => []
        ],
        'showPagination' => [
            'type' => 'boolean',
            'default' => false
        ],
        'paginationType' => [
            'type' => 'string',
            'default' => 'numbers' // numbers, load-more, infinite-scroll
        ],
        'excludeCurrentPost' => [
            'type' => 'boolean',
            'default' => false
        ],
        'offset' => [
            'type' => 'number',
            'default' => 0
        ],
        'metaQuery' => [
            'type' => 'object',
            'default' => []
        ],
        'dateQuery' => [
            'type' => 'object',
            'default' => []
        ]
    ],
    'render_callback' => 'jankx_dynamic_query_loop_render',
    'editor_script' => 'jankx-dynamic-query-loop-editor',
    'editor_style' => 'jankx-dynamic-query-loop-editor-style',
    'style' => 'jankx-dynamic-query-loop-style'
]);
```

### Render Callback Implementation
```php
function jankx_dynamic_query_loop_render($attributes, $content) {
    // Build query arguments
    $query_args = [
        'post_type' => $attributes['postType'] ?? 'post',
        'posts_per_page' => $attributes['perPage'] ?? 6,
        'orderby' => $attributes['orderBy'] ?? 'date',
        'order' => $attributes['order'] ?? 'DESC',
        'offset' => $attributes['offset'] ?? 0,
        'post_status' => 'publish'
    ];

    // Handle taxonomy filtering
    if (!empty($attributes['taxonomy']) && !empty($attributes['terms'])) {
        $query_args['tax_query'] = [
            [
                'taxonomy' => $attributes['taxonomy'],
                'field' => 'term_id',
                'terms' => $attributes['terms']
            ]
        ];
    }

    // Handle meta query
    if (!empty($attributes['metaQuery'])) {
        $query_args['meta_query'] = $attributes['metaQuery'];
    }

    // Handle date query
    if (!empty($attributes['dateQuery'])) {
        $query_args['date_query'] = $attributes['dateQuery'];
    }

    // Exclude current post if needed
    if (!empty($attributes['excludeCurrentPost']) && is_singular()) {
        $query_args['post__not_in'] = [get_the_ID()];
    }

    // Execute query
    $query = new WP_Query($query_args);

    if (!$query->have_posts()) {
        return '<div class="jankx-query-loop-empty">No posts found.</div>';
    }

    // Get layout pattern
    $layout_pattern = $attributes['layoutPattern'] ?? 'jankx/post-card';
    $grid_columns = $attributes['gridColumns'] ?? 3;

    // Start output
    ob_start();

    echo '<div class="jankx-dynamic-query-loop jankx-grid-' . $grid_columns . '">';

    // Loop through posts
    while ($query->have_posts()) {
        $query->the_post();
        echo jankx_render_pattern_for_post($layout_pattern, get_the_ID());
    }

    echo '</div>';

    // Handle pagination
    if (!empty($attributes['showPagination']) && $query->max_num_pages > 1) {
        echo jankx_render_query_pagination($query, $attributes['paginationType']);
    }

    wp_reset_postdata();

    return ob_get_clean();
}
```

## Pattern Rendering

### Pattern Render Function
```php
function jankx_render_pattern_for_post($pattern_name, $post_id) {
    // Set up post data
    setup_postdata($post_id);

    // Get pattern content
    $pattern = get_block_pattern($pattern_name);
    if (!$pattern) {
        return '<div class="jankx-pattern-not-found">Pattern not found: ' . $pattern_name . '</div>';
    }

    // Parse and render pattern
    $blocks = parse_blocks($pattern['content']);

    ob_start();
    foreach ($blocks as $block) {
        // Replace post-related blocks with current post data
        $block = jankx_replace_post_blocks($block, $post_id);
        echo render_block($block);
    }

    return ob_get_clean();
}
```

### Post Block Replacement
```php
function jankx_replace_post_blocks($block, $post_id) {
    // Handle post-specific blocks
    $post_blocks = [
        'core/post-title',
        'core/post-excerpt',
        'core/post-featured-image',
        'core/post-date',
        'core/post-terms',
        'core/post-author'
    ];

    if (in_array($block['blockName'], $post_blocks)) {
        // Set current post for block rendering
        global $post;
        $post = get_post($post_id);
        setup_postdata($post);
    }

    // Handle nested blocks
    if (!empty($block['innerBlocks'])) {
        foreach ($block['innerBlocks'] as &$inner_block) {
            $inner_block = jankx_replace_post_blocks($inner_block, $post_id);
        }
    }

    return $block;
}
```

## Editor Interface

### Inspector Controls
```javascript
// editor.js
const { InspectorControls } = wp.blockEditor;
const { PanelBody, SelectControl, RangeControl, ToggleControl } = wp.components;

function DynamicQueryLoopEdit(props) {
    const { attributes, setAttributes } = props;

    return (
        <div className="jankx-dynamic-query-loop-editor">
            <InspectorControls>
                <PanelBody title="Query Settings">
                    <SelectControl
                        label="Post Type"
                        value={attributes.postType}
                        options={[
                            { label: 'Posts', value: 'post' },
                            { label: 'Pages', value: 'page' },
                            { label: 'Custom Post Type', value: 'custom' }
                        ]}
                        onChange={(value) => setAttributes({ postType: value })}
                    />

                    <RangeControl
                        label="Posts Per Page"
                        value={attributes.perPage}
                        onChange={(value) => setAttributes({ perPage: value })}
                        min={1}
                        max={50}
                    />

                    <SelectControl
                        label="Order By"
                        value={attributes.orderBy}
                        options={[
                            { label: 'Date', value: 'date' },
                            { label: 'Title', value: 'title' },
                            { label: 'Menu Order', value: 'menu_order' },
                            { label: 'Random', value: 'rand' }
                        ]}
                        onChange={(value) => setAttributes({ orderBy: value })}
                    />

                    <SelectControl
                        label="Order"
                        value={attributes.order}
                        options={[
                            { label: 'Descending', value: 'DESC' },
                            { label: 'Ascending', value: 'ASC' }
                        ]}
                        onChange={(value) => setAttributes({ order: value })}
                    />
                </PanelBody>

                <PanelBody title="Layout Settings">
                    <SelectControl
                        label="Layout Pattern"
                        value={attributes.layoutPattern}
                        options={jankx_get_pattern_options()}
                        onChange={(value) => setAttributes({ layoutPattern: value })}
                    />

                    <RangeControl
                        label="Grid Columns"
                        value={attributes.gridColumns}
                        onChange={(value) => setAttributes({ gridColumns: value })}
                        min={1}
                        max={6}
                    />
                </PanelBody>

                <PanelBody title="Pagination">
                    <ToggleControl
                        label="Show Pagination"
                        checked={attributes.showPagination}
                        onChange={(value) => setAttributes({ showPagination: value })}
                    />

                    {attributes.showPagination && (
                        <SelectControl
                            label="Pagination Type"
                            value={attributes.paginationType}
                            options={[
                                { label: 'Numbers', value: 'numbers' },
                                { label: 'Load More', value: 'load-more' },
                                { label: 'Infinite Scroll', value: 'infinite-scroll' }
                            ]}
                            onChange={(value) => setAttributes({ paginationType: value })}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            {/* Preview area */}
            <div className="jankx-query-loop-preview">
                {jankx_render_query_preview(attributes)}
            </div>
        </div>
    );
}
```

## Performance Optimization

### Caching Strategy
```php
function jankx_get_cached_query_results($query_args, $cache_key) {
    // Check for cached results
    $cached = wp_cache_get($cache_key, 'jankx_query_loop');

    if ($cached !== false) {
        return $cached;
    }

    // Execute query
    $query = new WP_Query($query_args);
    $results = [
        'posts' => $query->posts,
        'found_posts' => $query->found_posts,
        'max_num_pages' => $query->max_num_pages
    ];

    // Cache results for 5 minutes
    wp_cache_set($cache_key, $results, 'jankx_query_loop', 300);

    return $results;
}
```

### Lazy Loading
```php
function jankx_lazy_load_query_loop($attributes, $page = 1) {
    // AJAX endpoint for lazy loading
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
        'hasMore' => $page < $query->max_num_pages
    ];
}
```

## Error Handling

### Query Error Handling
```php
function jankx_handle_query_errors($query_args) {
    try {
        $query = new WP_Query($query_args);

        if (is_wp_error($query)) {
            return [
                'error' => true,
                'message' => 'Query error: ' . $query->get_error_message()
            ];
        }

        return [
            'error' => false,
            'query' => $query
        ];

    } catch (Exception $e) {
        return [
            'error' => true,
            'message' => 'Exception: ' . $e->getMessage()
        ];
    }
}
```

### Pattern Error Handling
```php
function jankx_safe_pattern_render($pattern_name, $post_id) {
    try {
        return jankx_render_pattern_for_post($pattern_name, $post_id);
    } catch (Exception $e) {
        error_log('Jankx pattern render error: ' . $e->getMessage());
        return '<div class="jankx-pattern-error">Pattern render error</div>';
    }
}
```

## Best Practices

### 1. Query Optimization
- Sử dụng `posts_per_page` hợp lý (6-12 posts)
- Implement caching cho queries phức tạp
- Sử dụng `no_found_rows` nếu không cần pagination
- Optimize meta queries và tax queries

### 2. Pattern Design
- Patterns nên lightweight và reusable
- Sử dụng CSS Grid/Flexbox cho responsive layouts
- Implement lazy loading cho images
- Optimize for mobile performance

### 3. Error Handling
- Always handle query errors gracefully
- Provide fallback patterns
- Log errors for debugging
- Show user-friendly error messages

### 4. Performance
- Cache query results khi có thể
- Implement lazy loading cho large lists
- Optimize database queries
- Use CDN cho assets

## Migration from Jankx 1.0

### Convert Old Layout Classes
```php
function jankx_convert_layout_to_query_loop($old_layout_data) {
    $migration_map = [
        'Card' => 'jankx/post-card',
        'Grid' => 'jankx/grid-2-columns',
        'Hero' => 'jankx/hero-post'
    ];

    $new_attributes = [
        'postType' => $old_layout_data['post_type'] ?? 'post',
        'perPage' => $old_layout_data['posts_per_page'] ?? 6,
        'layoutPattern' => $migration_map[$old_layout_data['layout']] ?? 'jankx/post-card',
        'orderBy' => $old_layout_data['orderby'] ?? 'date',
        'order' => $old_layout_data['order'] ?? 'DESC'
    ];

    return $new_attributes;
}
```

### Migration Helper
```php
class Jankx_Query_Loop_Migration {
    public function migrate_content($content) {
        // Find old layout shortcodes
        $pattern = '/\[jankx_layout([^\]]*)\](.*?)\[\/jankx_layout\]/s';

        return preg_replace_callback($pattern, function($matches) {
            $attributes = shortcode_parse_atts($matches[1]);
            $new_attributes = $this->convert_attributes($attributes);

            return $this->render_query_loop_block($new_attributes);
        }, $content);
    }
}
```