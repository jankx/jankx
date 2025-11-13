# Post Layout System - Usage Examples

## 📚 Cách sử dụng Post Layout System

### 1. **Sử dụng trong Gutenberg Block**

Block `jankx/post-type-layout` tự động sử dụng hệ thống này.

### 2. **Sử dụng trực tiếp trong PHP**

#### Via Facade (Recommended):
```php
use Jankx\Facades\PostLayout;

// Render layout
$html = PostLayout::render('grid', [
    'postType' => 'post',
    'postsPerPage' => 10,
    'columns' => 3,
    'showFeaturedImage' => true,
    'showTitle' => true,
    'showExcerpt' => true,
    'showDate' => true,
    'orderBy' => 'date',
    'order' => 'DESC',
]);

echo $html;
```

#### Via Container:
```php
use Jankx\Facades\App;

$manager = App::make('post.layout.manager');
$html = $manager->render('list', $attributes);
echo $html;
```

#### Via Singleton:
```php
use Jankx\Layouts\PostLayout\PostLayoutManager;

$manager = PostLayoutManager::getInstance();
$html = $manager->render('masonry', $attributes);
echo $html;
```

### 3. **Đăng ký Custom Layout**

```php
use Jankx\Layouts\PostLayout\PostLayout;
use Jankx\Facades\PostLayout as PostLayoutFacade;

// Create custom layout class
class FeaturedLayout extends PostLayout
{
    protected $name = 'featured';
    protected $title = 'Featured Layout';

    public function render(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        ob_start();
        ?>
        <div class="featured-layout">
            <?php while ($this->query->have_posts()): $this->query->the_post(); ?>
                <div class="featured-post">
                    <?php echo $this->renderPostItem(); ?>
                </div>
            <?php endwhile; ?>
        </div>
        <?php
        wp_reset_postdata();
        return ob_get_clean();
    }

    public function renderPreview(): array
    {
        return [
            'name' => $this->name,
            'title' => $this->title,
            'type' => 'featured',
            'supportedOptions' => $this->getSupportedOptions(),
            'previewItems' => [],
        ];
    }
}

// Register layout
add_action('init', function() {
    PostLayoutFacade::registerLayout('featured', FeaturedLayout::class);
}, 5);
```

### 4. **Get Available Layouts**

```php
use Jankx\Facades\PostLayout;

// Get all layouts
$layouts = PostLayout::getLayouts(['field' => 'all']);

// Get layout names only
$names = PostLayout::getLayouts(['field' => 'names']);

// Get layout classes only
$classes = PostLayout::getLayouts(['field' => 'classes']);

// Check if layout exists
$exists = PostLayout::hasLayout('grid'); // true
```

### 5. **Create Layout Object Manual**

```php
use Jankx\Facades\PostLayout;

// Create layout with attributes
$decorator = PostLayout::createLayout('grid', [
    'columns' => 4,
    'showTitle' => true,
    'showExcerpt' => false,
]);

// Build query
$query = new WP_Query([
    'post_type' => 'post',
    'posts_per_page' => 12,
]);

// Set query and render
$decorator->withQuery($query);
$html = $decorator->render();

echo $html;
```

### 6. **Get Preview Data (for AJAX/REST API)**

```php
use Jankx\Facades\PostLayout;

// Get preview data for editor
$preview = PostLayout::renderPreview('grid', [
    'columns' => 3,
    'postsPerPage' => 6,
]);

wp_send_json($preview);
```

### 7. **Filter Query Args**

```php
// Customize query args for all layouts
add_filter('jankx/post-layout/query-args', function($args, $attributes) {
    // Add custom tax query
    $args['tax_query'] = [
        [
            'taxonomy' => 'category',
            'field' => 'slug',
            'terms' => 'featured',
        ],
    ];
    return $args;
}, 10, 2);

// Customize query args for specific layout
add_filter('jankx/post-layout/query-args/grid', function($args, $attributes) {
    // Only for grid layout
    $args['meta_key'] = 'view_count';
    $args['orderby'] = 'meta_value_num';
    return $args;
}, 10, 2);
```

### 8. **Sử dụng trong Template**

```php
<?php
// In single.php or any template file
use Jankx\Facades\PostLayout;

$related_posts = PostLayout::render('card', [
    'postType' => 'post',
    'postsPerPage' => 3,
    'columns' => 3,
    'showFeaturedImage' => true,
    'showTitle' => true,
    'showExcerpt' => false,
    'orderBy' => 'rand',
]);

if ($related_posts) {
    echo '<section class="related-posts">';
    echo '<h2>' . esc_html__('Related Posts', 'jankx') . '</h2>';
    echo $related_posts;
    echo '</section>';
}
?>
```

### 9. **Get Layout Options**

```php
use Jankx\Facades\PostLayout;

// Get supported options for a layout
$options = PostLayout::getLayoutOptions('grid');
// Returns: ['columns', 'showFeaturedImage', 'showTitle', ...]
```

## 🔧 Advanced Usage

### Custom Post Item Template

Override `renderPostItem()` method trong custom layout:

```php
class MyCustomLayout extends PostLayout
{
    protected $name = 'my-custom';
    protected $title = 'My Custom Layout';

    protected function renderPostItem($post = null): string
    {
        // Custom rendering logic
        ob_start();
        ?>
        <div class="my-custom-post">
            <h2><?php echo esc_html(get_the_title($post)); ?></h2>
            <!-- Custom HTML here -->
        </div>
        <?php
        return ob_get_clean();
    }

    public function render(): string { /* ... */ }
    public function renderPreview(): array { /* ... */ }
}
```

### With Custom Query

```php
use Jankx\Facades\PostLayout;

$decorator = PostLayout::createLayout('grid', ['columns' => 4]);

// Custom query
$query = new WP_Query([
    'post_type' => 'product',
    'posts_per_page' => 8,
    'meta_query' => [
        [
            'key' => 'price',
            'value' => 1000,
            'compare' => '<',
            'type' => 'NUMERIC',
        ],
    ],
]);

$decorator->withQuery($query);
echo $decorator->render();
```

## 🎯 Integration with Other Systems

### With Shortcode:

```php
add_shortcode('jankx_posts', function($atts) {
    $atts = shortcode_atts([
        'layout' => 'grid',
        'post_type' => 'post',
        'posts_per_page' => 10,
        'columns' => 3,
    ], $atts);

    return PostLayout::render($atts['layout'], $atts);
});

// Usage: [jankx_posts layout="card" columns="4"]
```

### With Widget:

```php
class JankxPostLayoutWidget extends WP_Widget
{
    public function widget($args, $instance)
    {
        echo $args['before_widget'];

        if (!empty($instance['title'])) {
            echo $args['before_title'] . $instance['title'] . $args['after_title'];
        }

        echo PostLayout::render($instance['layout'], $instance);

        echo $args['after_widget'];
    }
}
```
