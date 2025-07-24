# Migration Guide - Jankx 1.x to 2.0

> **Hướng dẫn chuyển đổi từ Jankx 1.x lên Jankx 2.0**

## 🎯 Overview

Jankx 2.0 là một bước nhảy vọt từ Jankx 1.x, chuyển từ template engine tùy chỉnh sang kiến trúc Gutenberg-first hiện đại. Migration này đòi hỏi việc chuyển đổi toàn diện từ hệ thống `views` sang hệ thống `templates` dựa trên Gutenberg blocks.

## 🚀 Quick Migration Checklist

### 1. **Pre-Migration Analysis**
```bash
# Kiểm tra Jankx 1.x installation
wp theme list
wp plugin list

# Backup database
wp db export backup.sql

# Backup Jankx 1.x theme files
cp -r wp-content/themes/jankx-1x wp-content/themes/jankx-1x-backup

# Analyze current template structure
find wp-content/themes/jankx-1x/views -name "*.php" -type f
```

### 2. **Installation Steps**
```bash
# 1. Install Jankx 2.0
wp theme install jankx-2.0 --activate

# 2. Install required plugins
wp plugin install gutenberg --activate
wp plugin install classic-editor --activate

# 3. Verify installation
wp theme status
wp plugin status

# 4. Check Gutenberg compatibility
wp eval "echo 'Gutenberg version: ' . get_bloginfo('version');"
```

### 3. **Template System Migration**

#### Migrate from Views to Templates
```php
// Jankx 1.x Template System (views/)
class ViewsMigrator
{
    public function migrateViewsToTemplates()
    {
        $views = $this->getAllViews();

        foreach ($views as $view) {
            $template = $this->convertViewToTemplate($view);
            $this->saveTemplate($template);
        }
    }

    private function convertViewToTemplate($viewPath)
    {
        $viewContent = file_get_contents($viewPath);

        // Convert PHP template to HTML template
        $templateContent = $this->convertPHPToHTML($viewContent);

        return $templateContent;
    }

    private function convertPHPToHTML($phpContent)
    {
        // Convert PHP variables to Gutenberg blocks
        $htmlContent = preg_replace(
            '/<\?php echo \$(\w+); \?>/',
            '<!-- wp:jankx/dynamic-content {"field":"$1"} /-->',
            $phpContent
        );

        // Convert PHP loops to Gutenberg query blocks
        $htmlContent = preg_replace(
            '/<\?php foreach \(\$(\w+) as \$(\w+)\): \?>(.*?)<\?php endforeach; \?>/s',
            '<!-- wp:query {"queryId":1,"query":{"postType":"post"}} --><div class="wp-block-query">$3</div><!-- /wp:query -->',
            $htmlContent
        );

        // Convert PHP conditionals to Gutenberg conditional blocks
        $htmlContent = preg_replace(
            '/<\?php if \(\$(\w+)\): \?>(.*?)<\?php endif; \?>/s',
            '<!-- wp:jankx/conditional {"condition":"$1"} -->$2<!-- /wp:jankx/conditional -->',
            $htmlContent
        );

        return $htmlContent;
    }
}

// Template Mapping Examples
$templateMapping = [
    // Layout templates
    'views/layouts/main.php' => 'templates/layouts/main.html',
    'views/layouts/sidebar.php' => 'templates/layouts/sidebar.html',

    // Page templates
    'views/pages/home.php' => 'templates/front-page.html',
    'views/pages/archive.php' => 'templates/archive.html',
    'views/pages/single.php' => 'templates/single.html',

    // Partial templates
    'views/partials/header.php' => 'templates/parts/header.html',
    'views/partials/footer.php' => 'templates/parts/footer.html',
    'views/partials/sidebar.php' => 'templates/parts/sidebar.html',

    // Component templates
    'views/components/post-item.php' => 'templates/blocks/post-item.html',
    'views/components/testimonial.php' => 'templates/blocks/testimonial.html'
];
```

#### Convert PHP Templates to HTML Templates
```php
// Jankx 1.x PHP Template (views/layouts/main.php)
<?php
/**
 * Main layout template
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <header>
        <?php jankx_template('partials/header', ['site_title' => get_bloginfo('name')]); ?>
    </header>

    <main>
        <?php echo $content; ?>
    </main>

    <footer>
        <?php jankx_template('partials/footer'); ?>
    </footer>

    <?php wp_footer(); ?>
</body>
</html>

// Jankx 2.0 HTML Template (templates/layouts/main.html)
<!DOCTYPE html>
<html <?php echo get_language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <!-- wp:template-part {"slug":"header","tagName":"header"} /-->

    <!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
    <main class="wp-block-group">
        <!-- wp:post-content /-->
    </main>
    <!-- /wp:group -->

    <!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->

    <?php wp_footer(); ?>
</body>
</html>
```

#### Migrate Template Functions
```php
// Jankx 1.x Template Functions
class Jankx1xTemplateFunctions
{
    public function renderTemplate($template, $data = [])
    {
        extract($data);
        include get_template_directory() . "/views/{$template}.php";
    }

    public function getTemplatePath($template)
    {
        return get_template_directory() . "/views/{$template}.php";
    }
}

// Jankx 2.0 Template Functions
class Jankx2xTemplateFunctions
{
    public function renderTemplate($template, $data = [])
    {
        // Use WordPress template hierarchy
        get_template_part("templates/{$template}");
    }

    public function getTemplatePath($template)
    {
        return get_template_directory() . "/templates/{$template}.html";
    }
}
```

### 4. **Content Migration**

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
        // Convert Jankx 1.x shortcodes to Gutenberg blocks

        // Convert [testimonial] to Gutenberg block
        $content = preg_replace(
            '/\[testimonial\s+author="([^"]+)"\](.*?)\[\/testimonial\]/s',
            '<!-- wp:jankx/testimonial {"author":"$1"} --><div class="wp-block-jankx-testimonial">$2</div><!-- /wp:jankx/testimonial -->',
            $content
        );

        // Convert [post-grid] to Gutenberg query block
        $content = preg_replace(
            '/\[post-grid\s+posts_per_page="(\d+)"\s+category="([^"]+)"\]/',
            '<!-- wp:query {"queryId":1,"query":{"perPage":$1,"categories":["$2"],"postType":"post"}} --><div class="wp-block-query"><!-- wp:post-template --><!-- wp:post-title /--><!-- wp:post-excerpt /--><!-- /wp:post-template --></div><!-- /wp:query -->',
            $content
        );

        // Convert [hero-section] to Gutenberg hero block
        $content = preg_replace(
            '/\[hero-section\s+title="([^"]+)"\s+subtitle="([^"]+)"\]/',
            '<!-- wp:jankx/hero-section {"title":"$1","subtitle":"$2"} --><div class="wp-block-jankx-hero-section"></div><!-- /wp:jankx/hero-section -->',
            $content
        );

        // Convert [contact-form] to Gutenberg form block
        $content = preg_replace(
            '/\[contact-form\s+title="([^"]+)"\]/',
            '<!-- wp:jankx/contact-form {"title":"$1"} --><div class="wp-block-jankx-contact-form"></div><!-- /wp:jankx/contact-form -->',
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
        // Jankx 1.x - Procedural approach
        // function get_featured_posts() {
        //     return get_posts(['meta_key' => 'featured', 'meta_value' => '1']);
        // }

        // Jankx 2.0 - Service-based approach
        class FeaturedPostsService
        {
            private $queryService;
            private $cacheService;

            public function __construct(QueryService $queryService, CacheService $cacheService)
            {
                $this->queryService = $queryService;
                $this->cacheService = $cacheService;
            }

            public function getFeaturedPosts(): array
            {
                $cacheKey = 'featured_posts';

                return $this->cacheService->remember($cacheKey, function() {
                    return $this->queryService->getPosts([
                        'meta_query' => [
                            ['key' => 'featured', 'value' => '1']
                        ],
                        'posts_per_page' => 6,
                        'orderby' => 'date',
                        'order' => 'DESC'
                    ]);
                }, 3600); // Cache for 1 hour
            }
        }
    }

    private function migrateCustomHooks()
    {
        // Jankx 1.x - Direct hook usage
        // add_action('wp_head', 'custom_meta_tags');
        // add_filter('the_content', 'custom_content_filter');

        // Jankx 2.0 - Event-driven approach
        class CustomEventHandlers
        {
            public function handleMetaTags(Event $event)
            {
                $metaTags = [
                    'og:title' => get_the_title(),
                    'og:description' => get_the_excerpt(),
                    'og:image' => get_the_post_thumbnail_url()
                ];

                foreach ($metaTags as $property => $content) {
                    echo "<meta property=\"{$property}\" content=\"{$content}\">\n";
                }
            }

            public function handleContentFilter(Event $event)
            {
                $content = $event->getData('content');

                // Apply content filters using Jankx 2.0 services
                $content = $this->contentService->process($content);

                $event->setData('content', $content);
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

### 6. **Asset Management Migration**

#### Migrate from Old Asset System to Modern Pipeline
```php
// Jankx 1.x Asset Management
class Jankx1xAssetManager
{
    public function enqueueAssets()
    {
        // Old way - Direct enqueue
        wp_enqueue_style('jankx-style', get_template_directory_uri() . '/style.css');
        wp_enqueue_script('jankx-script', get_template_directory_uri() . '/assets/js/main.js', ['jquery']);
    }
}

// Jankx 2.0 Asset Management
class Jankx2xAssetManager
{
    private $assetService;
    private $performanceService;

    public function __construct(AssetService $assetService, PerformanceService $performanceService)
    {
        $this->assetService = $assetService;
        $this->performanceService = $performanceService;
    }

    public function enqueueAssets()
    {
        // Modern asset pipeline with optimization
        $this->assetService->enqueueCriticalCSS();
        $this->assetService->enqueueDeferredCSS();
        $this->assetService->enqueueDeferredJS();

        // Performance optimizations
        $this->performanceService->enableLazyLoading();
        $this->performanceService->enableResourceHints();
    }
}

// Asset Migration Examples
$assetMigration = [
    // CSS files
    'style.css' => 'assets/css/main.css',
    'assets/css/layout.css' => 'assets/css/layout-options.css',
    'assets/css/components.css' => 'assets/css/layout-themes.css',

    // JavaScript files
    'assets/js/main.js' => 'assets/js/layout-options.js',
    'assets/js/components.js' => 'assets/js/partial-hydration.js',

    // Gutenberg assets
    'assets/gutenberg/editor.css' => 'assets/gutenberg/css/editor.css',
    'assets/gutenberg/frontend.css' => 'assets/gutenberg/css/frontend.css'
];
```

#### Webpack Configuration Migration
```javascript
// Jankx 1.x - Basic webpack config
module.exports = {
    entry: './assets/js/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
};

// Jankx 2.0 - Modern webpack config with optimization
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        main: './assets/js/layout-options.js',
        gutenberg: './assets/gutenberg/js/editor.js',
        partialHydration: './assets/js/partial-hydration.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
    ]
};
```

### 7. **Performance Optimization**

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

### 8. **Testing & Validation**

#### Migration Testing
```php
// Test migration results
class MigrationTester
{
    public function testMigration()
    {
        $tests = [
            'testTemplateMigration' => $this->testTemplateMigration(),
            'testPostsMigrated' => $this->testPostsMigrated(),
            'testPagesMigrated' => $this->testPagesMigrated(),
            'testMenusMigrated' => $this->testMenusMigrated(),
            'testBlocksWorking' => $this->testBlocksWorking(),
            'testAssetMigration' => $this->testAssetMigration(),
            'testPerformance' => $this->testPerformance(),
        ];

        foreach ($tests as $test => $result) {
            if (!$result) {
                $this->logTestFailure($test);
            }
        }
    }

    private function testTemplateMigration()
    {
        // Test if all views were converted to templates
        $views = glob(get_template_directory() . '/views/**/*.php');
        $templates = glob(get_template_directory() . '/templates/**/*.html');

        return count($views) === 0 && count($templates) > 0;
    }

    private function testAssetMigration()
    {
        // Test if assets are properly migrated
        $oldAssets = [
            'style.css',
            'assets/js/main.js',
            'assets/css/layout.css'
        ];

        $newAssets = [
            'assets/css/layout-options.css',
            'assets/js/layout-options.js',
            'assets/gutenberg/css/editor.css'
        ];

        foreach ($oldAssets as $asset) {
            if (file_exists(get_template_directory() . '/' . $asset)) {
                return false; // Old assets should not exist
            }
        }

        foreach ($newAssets as $asset) {
            if (!file_exists(get_template_directory() . '/' . $asset)) {
                return false; // New assets should exist
            }
        }

        return true;
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

#### Migration Troubleshooting
```php
// Common migration issues and solutions
class MigrationTroubleshooter
{
    public function diagnoseIssues()
    {
        $issues = [];

        // Check template conversion
        if ($this->hasUnconvertedTemplates()) {
            $issues[] = 'Unconverted templates found';
        }

        // Check shortcode conversion
        if ($this->hasUnconvertedShortcodes()) {
            $issues[] = 'Unconverted shortcodes found';
        }

        // Check asset migration
        if ($this->hasMissingAssets()) {
            $issues[] = 'Missing assets after migration';
        }

        return $issues;
    }

    public function fixCommonIssues()
    {
        // Fix template conversion issues
        $this->fixTemplateConversion();

        // Fix shortcode conversion issues
        $this->fixShortcodeConversion();

        // Fix asset migration issues
        $this->fixAssetMigration();
    }

    private function fixTemplateConversion()
    {
        // Convert remaining PHP templates to HTML
        $phpTemplates = glob(get_template_directory() . '/views/**/*.php');

        foreach ($phpTemplates as $template) {
            $htmlTemplate = str_replace('.php', '.html', $template);
            $htmlTemplate = str_replace('/views/', '/templates/', $htmlTemplate);

            $content = file_get_contents($template);
            $htmlContent = $this->convertPHPToHTML($content);

            file_put_contents($htmlTemplate, $htmlContent);
        }
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

## 📊 Migration Checklist - Jankx 1.x to 2.0

### ✅ Pre-Migration Analysis
- [ ] Backup Jankx 1.x database
- [ ] Backup Jankx 1.x theme files
- [ ] Document current template structure (`views/` directory)
- [ ] List all custom shortcodes and functions
- [ ] Document current asset structure
- [ ] Test migration in staging environment

### ✅ Template System Migration
- [ ] Convert `views/` templates to `templates/` HTML files
- [ ] Migrate PHP templates to Gutenberg blocks
- [ ] Convert template functions to service-based architecture
- [ ] Update template hierarchy
- [ ] Test template rendering

### ✅ Content Migration
- [ ] Migrate posts and pages
- [ ] Convert Jankx 1.x shortcodes to Gutenberg blocks
- [ ] Migrate custom fields to block attributes
- [ ] Update image references for optimization
- [ ] Test content display in new system

### ✅ Asset Management Migration
- [ ] Migrate CSS files to new structure
- [ ] Update JavaScript files for modern pipeline
- [ ] Configure webpack for optimization
- [ ] Set up critical CSS delivery
- [ ] Test asset loading and performance

### ✅ Customization Migration
- [ ] Convert custom CSS to CSS variables
- [ ] Migrate custom functions to services
- [ ] Update theme customizations for Gutenberg
- [ ] Test custom features in new architecture

### ✅ Post-Migration Validation
- [ ] Test all functionality
- [ ] Verify Core Web Vitals performance
- [ ] Update SEO settings for new structure
- [ ] Test mobile responsiveness
- [ ] Verify security and compatibility
- [ ] Run performance optimization

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