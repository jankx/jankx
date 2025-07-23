# Migration Guide - Jankx 1.0 to 2.0

## Overview

Hướng dẫn migration từ Jankx 1.0 Post Layout system (PHP classes + template engine) sang Jankx 2.0 (Gutenberg Patterns + Dynamic Query Loop).

## Key Changes

| Component | Jankx 1.0 | Jankx 2.0 |
|-----------|------------|------------|
| **Layout System** | PHP Classes (Card, Grid, Carousel) | Gutenberg Patterns |
| **Rendering** | Template Engine | Dynamic Query Loop |
| **Data Storage** | Serialized layout data | Block attributes |
| **Editor Support** | Custom admin interface | Gutenberg editor |
| **Performance** | Static rendering | Dynamic with caching |

## Migration Process

### Phase 1: Analysis and Planning

#### 1.1 Audit Existing Content
```php
function jankx_audit_existing_layouts() {
    global $wpdb;

    // Find posts with Jankx 1.0 layout shortcodes
    $posts_with_layouts = $wpdb->get_results("
        SELECT ID, post_content
        FROM {$wpdb->posts}
        WHERE post_content LIKE '%[jankx_layout%'
    ");

    $layout_usage = [];
    foreach ($posts_with_layouts as $post) {
        // Extract layout information
        preg_match_all('/\[jankx_layout([^\]]*)\](.*?)\[\/jankx_layout\]/s', $post->post_content, $matches);

        foreach ($matches[1] as $index => $attributes) {
            $attrs = shortcode_parse_atts($attributes);
            $layout_type = $attrs['type'] ?? 'card';

            if (!isset($layout_usage[$layout_type])) {
                $layout_usage[$layout_type] = 0;
            }
            $layout_usage[$layout_type]++;
        }
    }

    return $layout_usage;
}
```

#### 1.2 Layout Mapping
```php
$layout_migration_map = [
    // Basic layouts
    'card' => 'jankx/post-card',
    'card-meta' => 'jankx/post-card-meta',
    'hero' => 'jankx/hero-post',

    // Grid layouts
    'grid-2' => 'jankx/grid-2-columns',
    'grid-3' => 'jankx/grid-3-columns',
    'grid-4' => 'jankx/grid-4-columns',

    // Advanced layouts
    'carousel' => 'jankx/carousel-basic',
    'tabs' => 'jankx/tabs-basic',
    'masonry' => 'jankx/masonry-grid',

    // Custom layouts
    'testimonial' => 'jankx/testimonial-card',
    'product' => 'jankx/product-card',
    'event' => 'jankx/event-card',
];
```

### Phase 2: Data Migration

#### 2.1 Convert Layout Attributes
```php
function jankx_convert_layout_attributes($old_attributes) {
    $new_attributes = [
        'postType' => $old_attributes['post_type'] ?? 'post',
        'perPage' => $old_attributes['posts_per_page'] ?? 6,
        'orderBy' => $old_attributes['orderby'] ?? 'date',
        'order' => $old_attributes['order'] ?? 'DESC',
        'layoutPattern' => jankx_map_layout_type($old_attributes['type'] ?? 'card'),
        'gridColumns' => $old_attributes['columns'] ?? 3,
        'showPagination' => !empty($old_attributes['pagination']),
        'paginationType' => $old_attributes['pagination_type'] ?? 'numbers',
    ];

    // Handle taxonomy filtering
    if (!empty($old_attributes['taxonomy']) && !empty($old_attributes['terms'])) {
        $new_attributes['taxonomy'] = $old_attributes['taxonomy'];
        $new_attributes['terms'] = explode(',', $old_attributes['terms']);
    }

    // Handle custom query
    if (!empty($old_attributes['custom_query'])) {
        $new_attributes['customQuery'] = $old_attributes['custom_query'];
    }

    return $new_attributes;
}
```

#### 2.2 Migration Helper Class
```php
class Jankx_Layout_Migration {
    private $migration_map;
    private $converted_posts = [];

    public function __construct() {
        $this->migration_map = $this->get_migration_map();
    }

    public function migrate_post($post_id) {
        $post = get_post($post_id);
        $content = $post->post_content;

        // Find and replace layout shortcodes
        $pattern = '/\[jankx_layout([^\]]*)\](.*?)\[\/jankx_layout\]/s';

        $new_content = preg_replace_callback($pattern, function($matches) {
            return $this->convert_shortcode_to_block($matches[1], $matches[2]);
        }, $content);

        // Update post content
        if ($new_content !== $content) {
            wp_update_post([
                'ID' => $post_id,
                'post_content' => $new_content
            ]);

            $this->converted_posts[] = $post_id;
        }

        return $new_content;
    }

    private function convert_shortcode_to_block($attributes_string, $inner_content) {
        $attributes = shortcode_parse_atts($attributes_string);
        $new_attributes = $this->convert_attributes($attributes);

        return $this->render_query_loop_block($new_attributes);
    }

    private function render_query_loop_block($attributes) {
        $block_content = '<!-- wp:jankx/dynamic-query-loop ';
        $block_content .= json_encode($attributes);
        $block_content .= ' -->';
        $block_content .= '<div class="wp-block-jankx-dynamic-query-loop">';
        $block_content .= '</div>';
        $block_content .= '<!-- /wp:jankx/dynamic-query-loop -->';

        return $block_content;
    }

    public function get_migration_report() {
        return [
            'total_converted' => count($this->converted_posts),
            'converted_posts' => $this->converted_posts,
            'migration_map' => $this->migration_map,
        ];
    }
}
```

### Phase 3: Content Migration

#### 3.1 Batch Migration Script
```php
function jankx_batch_migrate_layouts() {
    global $wpdb;

    // Get all posts with Jankx 1.0 layouts
    $posts_to_migrate = $wpdb->get_results("
        SELECT ID, post_title, post_content
        FROM {$wpdb->posts}
        WHERE post_content LIKE '%[jankx_layout%'
        AND post_status = 'publish'
    ");

    $migration = new Jankx_Layout_Migration();
    $results = [
        'success' => 0,
        'failed' => 0,
        'errors' => [],
    ];

    foreach ($posts_to_migrate as $post) {
        try {
            $migration->migrate_post($post->ID);
            $results['success']++;
        } catch (Exception $e) {
            $results['failed']++;
            $results['errors'][] = [
                'post_id' => $post->ID,
                'post_title' => $post->post_title,
                'error' => $e->getMessage(),
            ];
        }
    }

    return $results;
}
```

#### 3.2 Migration Validation
```php
function jankx_validate_migration($post_id) {
    $post = get_post($post_id);
    $content = $post->post_content;

    $validation_results = [
        'has_old_shortcodes' => false,
        'has_new_blocks' => false,
        'block_count' => 0,
        'errors' => [],
    ];

    // Check for old shortcodes
    if (strpos($content, '[jankx_layout') !== false) {
        $validation_results['has_old_shortcodes'] = true;
        $validation_results['errors'][] = 'Contains old Jankx 1.0 shortcodes';
    }

    // Check for new blocks
    if (strpos($content, 'jankx/dynamic-query-loop') !== false) {
        $validation_results['has_new_blocks'] = true;

        // Count blocks
        preg_match_all('/<!-- wp:jankx\/dynamic-query-loop/', $content, $matches);
        $validation_results['block_count'] = count($matches[0]);
    }

    return $validation_results;
}
```

### Phase 4: Testing and Validation

#### 4.1 Migration Testing
```php
function jankx_test_migration() {
    // Create test post with old layout
    $test_post_id = wp_insert_post([
        'post_title' => 'Migration Test Post',
        'post_content' => '[jankx_layout type="card" posts_per_page="3" columns="2"]Test content[/jankx_layout]',
        'post_status' => 'publish',
    ]);

    // Perform migration
    $migration = new Jankx_Layout_Migration();
    $migrated_content = $migration->migrate_post($test_post_id);

    // Validate migration
    $validation = jankx_validate_migration($test_post_id);

    // Clean up test post
    wp_delete_post($test_post_id, true);

    return [
        'original_content' => get_post($test_post_id)->post_content,
        'migrated_content' => $migrated_content,
        'validation' => $validation,
    ];
}
```

#### 4.2 Rollback Strategy
```php
function jankx_create_migration_backup() {
    global $wpdb;

    $backup_table = $wpdb->prefix . 'jankx_layout_backup';

    // Create backup table
    $wpdb->query("
        CREATE TABLE IF NOT EXISTS {$backup_table} (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            post_id bigint(20) NOT NULL,
            original_content longtext NOT NULL,
            migration_date datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY post_id (post_id)
        )
    ");

    // Backup posts with old layouts
    $posts_to_backup = $wpdb->get_results("
        SELECT ID, post_content
        FROM {$wpdb->posts}
        WHERE post_content LIKE '%[jankx_layout%'
    ");

    foreach ($posts_to_backup as $post) {
        $wpdb->insert($backup_table, [
            'post_id' => $post->ID,
            'original_content' => $post->post_content,
        ]);
    }

    return count($posts_to_backup);
}
```

## Migration Tools

### 1. Migration Dashboard
```php
function jankx_migration_dashboard() {
    ?>
    <div class="wrap">
        <h1>Jankx Layout Migration</h1>

        <div class="jankx-migration-status">
            <h2>Migration Status</h2>
            <?php
            $audit_results = jankx_audit_existing_layouts();
            $total_posts = array_sum($audit_results);
            ?>
            <p>Found <?php echo $total_posts; ?> posts with Jankx 1.0 layouts</p>

            <ul>
                <?php foreach ($audit_results as $layout_type => $count): ?>
                <li><?php echo ucfirst($layout_type); ?>: <?php echo $count; ?> posts</li>
                <?php endforeach; ?>
            </ul>
        </div>

        <div class="jankx-migration-actions">
            <h2>Migration Actions</h2>

            <form method="post" action="">
                <?php wp_nonce_field('jankx_migration', 'jankx_migration_nonce'); ?>

                <p>
                    <button type="submit" name="action" value="create_backup" class="button">
                        Create Backup
                    </button>
                    <button type="submit" name="action" value="test_migration" class="button">
                        Test Migration
                    </button>
                    <button type="submit" name="action" value="start_migration" class="button button-primary">
                        Start Migration
                    </button>
                </p>
            </form>
        </div>

        <div class="jankx-migration-results">
            <h2>Migration Results</h2>
            <?php
            if (isset($_POST['action']) && wp_verify_nonce($_POST['jankx_migration_nonce'], 'jankx_migration')) {
                switch ($_POST['action']) {
                    case 'create_backup':
                        $backup_count = jankx_create_migration_backup();
                        echo '<div class="notice notice-success"><p>Backup created for ' . $backup_count . ' posts.</p></div>';
                        break;

                    case 'test_migration':
                        $test_results = jankx_test_migration();
                        echo '<div class="notice notice-info"><p>Test migration completed. Check results below.</p></div>';
                        echo '<pre>' . print_r($test_results, true) . '</pre>';
                        break;

                    case 'start_migration':
                        $migration_results = jankx_batch_migrate_layouts();
                        echo '<div class="notice notice-success"><p>Migration completed: ' . $migration_results['success'] . ' successful, ' . $migration_results['failed'] . ' failed.</p></div>';
                        break;
                }
            }
            ?>
        </div>
    </div>
    <?php
}
```

### 2. Migration CLI Commands
```php
// WP-CLI commands for migration
if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('jankx migrate-layouts', function($args, $assoc_args) {
        WP_CLI::log('Starting Jankx layout migration...');

        $migration = new Jankx_Layout_Migration();
        $results = jankx_batch_migrate_layouts();

        WP_CLI::success("Migration completed: {$results['success']} successful, {$results['failed']} failed");

        if (!empty($results['errors'])) {
            WP_CLI::warning('Some migrations failed:');
            foreach ($results['errors'] as $error) {
                WP_CLI::log("- Post {$error['post_id']}: {$error['error']}");
            }
        }
    });

    WP_CLI::add_command('jankx test-migration', function($args, $assoc_args) {
        WP_CLI::log('Testing Jankx layout migration...');

        $test_results = jankx_test_migration();

        WP_CLI::log('Test results:');
        WP_CLI::log(print_r($test_results, true));
    });
}
```

## Post-Migration Checklist

### 1. Content Verification
- [ ] All old shortcodes have been converted to blocks
- [ ] New blocks render correctly in editor
- [ ] New blocks render correctly on frontend
- [ ] No broken links or missing content

### 2. Functionality Testing
- [ ] Query loops display correct posts
- [ ] Pagination works correctly
- [ ] Filters and sorting work
- [ ] Responsive design works
- [ ] Performance is acceptable

### 3. User Experience
- [ ] Editor interface is intuitive
- [ ] Patterns are easy to customize
- [ ] Migration didn't break user workflows
- [ ] New features are discoverable

### 4. Performance Optimization
- [ ] Implement caching for dynamic queries
- [ ] Optimize database queries
- [ ] Minimize asset loading
- [ ] Test with large datasets

## Troubleshooting

### Common Issues

#### 1. Shortcodes Not Converting
```php
// Check if shortcode pattern is correct
function jankx_debug_shortcode_pattern() {
    global $wpdb;

    $posts = $wpdb->get_results("
        SELECT ID, post_content
        FROM {$wpdb->posts}
        WHERE post_content LIKE '%jankx_layout%'
        LIMIT 5
    ");

    foreach ($posts as $post) {
        preg_match_all('/\[jankx_layout([^\]]*)\]/', $post->post_content, $matches);
        echo "Post {$post->ID}: " . count($matches[0]) . " shortcodes found\n";
    }
}
```

#### 2. Block Rendering Issues
```php
// Check block registration
function jankx_debug_block_registration() {
    $blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();

    foreach ($blocks as $name => $block) {
        if (strpos($name, 'jankx') !== false) {
            echo "Block: {$name}\n";
            echo "Attributes: " . print_r($block->attributes, true) . "\n";
        }
    }
}
```

#### 3. Performance Issues
```php
// Monitor query performance
function jankx_monitor_query_performance() {
    global $wpdb;

    $start_time = microtime(true);

    // Your query here
    $query = new WP_Query(['post_type' => 'post', 'posts_per_page' => 10]);

    $end_time = microtime(true);
    $execution_time = $end_time - $start_time;

    error_log("Jankx query execution time: {$execution_time} seconds");

    return $execution_time;
}
```

## Best Practices

### 1. Migration Planning
- **Test thoroughly** before production migration
- **Create backups** of all content
- **Migrate in phases** for large sites
- **Monitor performance** during migration

### 2. Content Preservation
- **Preserve user customizations** during migration
- **Maintain SEO-friendly URLs** and structure
- **Keep metadata intact** (custom fields, etc.)
- **Document all changes** for future reference

### 3. User Communication
- **Notify users** about upcoming changes
- **Provide training** on new interface
- **Offer support** during transition period
- **Gather feedback** for improvements

### 4. Performance Optimization
- **Implement caching** for dynamic queries
- **Optimize database queries** for large datasets
- **Use lazy loading** for images and content
- **Monitor server resources** during migration