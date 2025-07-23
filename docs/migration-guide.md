# Migration Guide

> **Hướng dẫn chuyển đổi từ theme cũ sang Jankx 2.0**

## 🚀 Quick Migration Checklist

### 1. **Pre-Migration Analysis**
```bash
# Kiểm tra theme hiện tại
wp theme list
wp plugin list

# Backup database
wp db export backup.sql

# Backup theme files
cp -r wp-content/themes/old-theme wp-content/themes/old-theme-backup
```

### 2. **Installation Steps**
```bash
# 1. Install Jankx 2.0
wp theme install jankx --activate

# 2. Install required plugins
wp plugin install gutenberg --activate
wp plugin install classic-editor --activate

# 3. Verify installation
wp theme status
wp plugin status
```

### 3. **Content Migration**

#### Migrate Posts & Pages
```php
// functions.php - Migration helper
class ContentMigrator
{
    public function migrateContent()
    {
        // Migrate posts
        $this->migratePosts();

        // Migrate pages
        $this->migratePages();

        // Migrate menus
        $this->migrateMenus();

        // Migrate widgets
        $this->migrateWidgets();
    }

    private function migratePosts()
    {
        $posts = get_posts([
            'numberposts' => -1,
            'post_type' => 'post'
        ]);

        foreach ($posts as $post) {
            // Convert old shortcodes to blocks
            $content = $this->convertShortcodesToBlocks($post->post_content);

            wp_update_post([
                'ID' => $post->ID,
                'post_content' => $content
            ]);
        }
    }

    private function convertShortcodesToBlocks($content)
    {
        // Convert [testimonial] to Gutenberg block
        $content = preg_replace(
            '/\[testimonial\s+author="([^"]+)"\](.*?)\[\/testimonial\]/s',
            '<!-- wp:jankx/testimonial {"author":"$1"} --><div class="wp-block-jankx-testimonial">$2</div><!-- /wp:jankx/testimonial -->',
            $content
        );

        return $content;
    }
}
```

#### Migrate Custom Fields
```php
// Migrate ACF fields to Gutenberg blocks
class ACFMigrator
{
    public function migrateACFFields()
    {
        if (!function_exists('get_field_objects')) {
            return;
        }

        $posts = get_posts(['numberposts' => -1]);

        foreach ($posts as $post) {
            $fields = get_field_objects($post->ID);

            if ($fields) {
                $blocks = $this->convertACFToBlocks($fields);
                $this->updatePostBlocks($post->ID, $blocks);
            }
        }
    }

    private function convertACFToBlocks($fields)
    {
        $blocks = [];

        foreach ($fields as $field) {
            switch ($field['type']) {
                case 'text':
                    $blocks[] = $this->createTextBlock($field);
                    break;
                case 'image':
                    $blocks[] = $this->createImageBlock($field);
                    break;
                case 'wysiwyg':
                    $blocks[] = $this->createParagraphBlock($field);
                    break;
            }
        }

        return $blocks;
    }
}
```

### 4. **Theme Customization Migration**

#### Migrate Custom CSS
```css
/* old-theme-style.css → assets/css/custom.css */
.old-header {
    /* Convert to Jankx CSS variables */
    background-color: var(--color-primary);
    padding: var(--spacing-lg);
}

.old-navigation {
    /* Convert to Jankx navigation styles */
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);
}
```

#### Migrate Custom Functions
```php
// functions.php - Migrate custom functions
class FunctionMigrator
{
    public function migrateCustomFunctions()
    {
        // Old: function custom_post_query() { ... }
        // New: Use Jankx Query Service
        $this->migrateCustomQueries();

        // Old: function custom_shortcode() { ... }
        // New: Use Gutenberg blocks
        $this->migrateShortcodes();

        // Old: function custom_hook() { ... }
        // New: Use Jankx Hook System
        $this->migrateHooks();
    }

    private function migrateCustomQueries()
    {
        // Old way
        // function get_featured_posts() {
        //     return get_posts(['meta_key' => 'featured', 'meta_value' => '1']);
        // }

        // New way - Use Jankx Query Service
        class FeaturedPostsService
        {
            public function getFeaturedPosts(): array
            {
                return $this->queryService->getPosts([
                    'meta_query' => [
                        ['key' => 'featured', 'value' => '1']
                    ]
                ]);
            }
        }
    }
}
```

### 5. **Plugin Compatibility**

#### Check Plugin Compatibility
```php
// Check if plugins work with Jankx
class PluginCompatibilityChecker
{
    private $incompatiblePlugins = [
        'old-page-builder',
        'deprecated-shortcode-plugin',
        'incompatible-theme-plugin'
    ];

    public function checkCompatibility()
    {
        $activePlugins = get_option('active_plugins');

        foreach ($activePlugins as $plugin) {
            if (in_array($plugin, $this->incompatiblePlugins)) {
                $this->deactivatePlugin($plugin);
                $this->notifyIncompatiblePlugin($plugin);
            }
        }
    }

    public function findAlternatives($plugin)
    {
        $alternatives = [
            'old-page-builder' => 'Use Gutenberg blocks',
            'deprecated-shortcode-plugin' => 'Use Jankx blocks',
            'incompatible-theme-plugin' => 'Use Jankx theme features'
        ];

        return $alternatives[$plugin] ?? 'Check Jankx documentation';
    }
}
```

### 6. **Performance Optimization**

#### Optimize Images
```php
// Migrate and optimize images
class ImageOptimizer
{
    public function optimizeImages()
    {
        $images = $this->getAllImages();

        foreach ($images as $image) {
            // Generate WebP versions
            $this->generateWebP($image);

            // Generate responsive sizes
            $this->generateResponsiveSizes($image);

            // Update image references
            $this->updateImageReferences($image);
        }
    }

    private function generateWebP($imagePath)
    {
        $webpPath = str_replace(['.jpg', '.png'], '.webp', $imagePath);

        if (!file_exists($webpPath)) {
            // Convert to WebP
            $image = imagecreatefromstring(file_get_contents($imagePath));
            imagewebp($image, $webpPath, 85);
            imagedestroy($image);
        }
    }
}
```

### 7. **Testing & Validation**

#### Migration Testing
```php
// Test migration results
class MigrationTester
{
    public function testMigration()
    {
        $tests = [
            'testPostsMigrated' => $this->testPostsMigrated(),
            'testPagesMigrated' => $this->testPagesMigrated(),
            'testMenusMigrated' => $this->testMenusMigrated(),
            'testBlocksWorking' => $this->testBlocksWorking(),
            'testPerformance' => $this->testPerformance(),
        ];

        foreach ($tests as $test => $result) {
            if (!$result) {
                $this->logTestFailure($test);
            }
        }
    }

    private function testPerformance()
    {
        // Test Core Web Vitals
        $lcp = $this->measureLCP();
        $fid = $this->measureFID();
        $cls = $this->measureCLS();

        return $lcp < 2.5 && $fid < 100 && $cls < 0.1;
    }
}
```

## 🔧 Common Migration Issues

### Issue 1: Shortcodes Not Working
```php
// Solution: Convert shortcodes to blocks
add_filter('the_content', function($content) {
    // Convert [testimonial] to block
    $content = preg_replace(
        '/\[testimonial\](.*?)\[\/testimonial\]/s',
        '<!-- wp:jankx/testimonial --><div class="wp-block-jankx-testimonial">$1</div><!-- /wp:jankx/testimonial -->',
        $content
    );

    return $content;
});
```

### Issue 2: Custom Fields Missing
```php
// Solution: Use Jankx Meta Service
class MetaMigrator
{
    public function migrateCustomFields()
    {
        global $wpdb;

        $customFields = $wpdb->get_results("
            SELECT post_id, meta_key, meta_value
            FROM {$wpdb->postmeta}
            WHERE meta_key LIKE 'custom_%'
        ");

        foreach ($customFields as $field) {
            // Convert to Jankx meta format
            $this->convertToJankxMeta($field);
        }
    }
}
```

### Issue 3: Performance Issues
```php
// Solution: Enable Jankx optimizations
class PerformanceOptimizer
{
    public function enableOptimizations()
    {
        // Enable lazy loading
        add_filter('wp_get_attachment_image_attributes', function($attr) {
            $attr['loading'] = 'lazy';
            return $attr;
        });

        // Enable critical CSS
        add_action('wp_head', function() {
            echo '<style>' . $this->getCriticalCSS() . '</style>';
        });

        // Enable asset optimization
        add_filter('script_loader_tag', function($tag, $handle) {
            if (strpos($handle, 'jankx-') === 0) {
                return str_replace('<script ', '<script defer ', $tag);
            }
            return $tag;
        }, 10, 2);
    }
}
```

## 📊 Migration Checklist

### ✅ Pre-Migration
- [ ] Backup database
- [ ] Backup theme files
- [ ] Document customizations
- [ ] List active plugins
- [ ] Test in staging environment

### ✅ Installation
- [ ] Install Jankx 2.0
- [ ] Activate theme
- [ ] Install required plugins
- [ ] Verify installation

### ✅ Content Migration
- [ ] Migrate posts and pages
- [ ] Convert shortcodes to blocks
- [ ] Migrate custom fields
- [ ] Update image references
- [ ] Test content display

### ✅ Customization Migration
- [ ] Migrate custom CSS
- [ ] Convert custom functions
- [ ] Update theme customizations
- [ ] Test custom features

### ✅ Post-Migration
- [ ] Test all functionality
- [ ] Optimize performance
- [ ] Update SEO settings
- [ ] Test mobile responsiveness
- [ ] Verify security

## 🚀 Quick Start Commands

```bash
# 1. Install Jankx
wp theme install jankx --activate

# 2. Run migration
wp eval-file migration-script.php

# 3. Test migration
wp eval-file test-migration.php

# 4. Optimize performance
wp eval-file optimize-performance.php
```

---

**Next**: [Development Rules](./development/rules.md) | [Gutenberg Blocks](./gutenberg/blocks.md)