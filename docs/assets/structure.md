# Asset Structure & Organization

> **Modern Asset Management for WordPress Themes**

Jankx 2.0 sử dụng cấu trúc asset hiện đại, tối ưu cho performance và maintainability.

## 📁 Asset Directory Structure

### Root Asset Structure
```
assets/
├── css/
│   ├── main.css
│   ├── critical.css
│   ├── components/
│   │   ├── blocks.css
│   │   ├── forms.css
│   │   └── navigation.css
│   └── utilities/
│       ├── spacing.css
│       ├── typography.css
│       └── colors.css
├── js/
│   ├── main.js
│   ├── critical.js
│   ├── components/
│   │   ├── blocks.js
│   │   ├── forms.js
│   │   └── navigation.js
│   └── utilities/
│       ├── lazy-loading.js
│       ├── performance.js
│       └── security.js
├── images/
│   ├── logo.svg
│   ├── icons/
│   │   ├── menu.svg
│   │   ├── search.svg
│   │   └── close.svg
│   ├── backgrounds/
│   │   ├── hero-bg.jpg
│   │   └── pattern.svg
│   └── placeholders/
│       ├── image-placeholder.jpg
│       └── avatar-placeholder.jpg
├── fonts/
│   ├── main.woff2
│   ├── main.woff
│   └── fallback.woff2
├── gutenberg/
│   ├── css/
│   │   ├── editor.css
│   │   └── blocks.css
│   ├── js/
│   │   ├── editor.js
│   │   └── blocks.js
│   └── blocks/
│       ├── testimonial/
│       │   ├── assets/
│       │   │   ├── js/
│       │   │   │   ├── editor.js
│       │   │   │   └── frontend.js
│       │   │   └── css/
│       │   │       ├── editor.css
│       │   │       └── frontend.css
│       │   └── block.json
│       └── hero/
│           ├── assets/
│           │   ├── js/
│           │   │   ├── editor.js
│           │   │   └── frontend.js
│           │   └── css/
│           │       ├── editor.css
│           │       └── frontend.css
│           └── block.json
└── dist/
    ├── css/
    │   ├── main.min.css
    │   ├── critical.min.css
    │   └── gutenberg.min.css
    ├── js/
    │   ├── main.min.js
    │   ├── critical.min.js
    │   └── gutenberg.min.js
    └── images/
        ├── optimized/
        └── webp/
```

## 🎨 CSS Organization

### Main CSS Structure
```scss
// assets/css/main.css
@import 'utilities/variables';
@import 'utilities/mixins';
@import 'utilities/functions';

// Base styles
@import 'base/reset';
@import 'base/typography';
@import 'base/colors';
@import 'base/spacing';

// Layout components
@import 'layout/header';
@import 'layout/footer';
@import 'layout/sidebar';
@import 'layout/grid';

// Components
@import 'components/blocks';
@import 'components/forms';
@import 'components/navigation';
@import 'components/buttons';

// Utilities
@import 'utilities/spacing';
@import 'utilities/typography';
@import 'utilities/colors';
@import 'utilities/animations';
```

### Critical CSS
```scss
// assets/css/critical.css
// Only include above-the-fold styles
@import 'utilities/variables';
@import 'base/reset';
@import 'base/typography';
@import 'layout/header';
@import 'components/navigation';
@import 'utilities/spacing';
```

### Component CSS
```scss
// assets/css/components/blocks.css
.jankx-block {
    // Base block styles
}

.jankx-block-testimonial {
    background: var(--color-background);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius);

    .testimonial-content {
        font-size: var(--font-size-lg);
        line-height: var(--line-height-relaxed);
        margin-bottom: var(--spacing-md);
    }

    .testimonial-author {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);

        .author-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
        }

        .author-info {
            .author-name {
                font-weight: var(--font-weight-bold);
                margin-bottom: var(--spacing-xs);
            }

            .author-title {
                color: var(--color-text-muted);
                font-size: var(--font-size-sm);
            }
        }
    }
}
```

## 🚀 JavaScript Organization

### Main JavaScript Structure
```javascript
// assets/js/main.js
import { PerformanceMonitor } from './utilities/performance.js';
import { SecurityManager } from './utilities/security.js';
import { LazyLoader } from './utilities/lazy-loading.js';

// Initialize core functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize performance monitoring
    const performanceMonitor = new PerformanceMonitor();
    performanceMonitor.init();

    // Initialize security manager
    const securityManager = new SecurityManager();
    securityManager.init();

    // Initialize lazy loading
    const lazyLoader = new LazyLoader();
    lazyLoader.init();

    // Initialize components
    initializeComponents();
});

function initializeComponents() {
    // Initialize navigation
    initializeNavigation();

    // Initialize forms
    initializeForms();

    // Initialize blocks
    initializeBlocks();
}
```

### Component JavaScript
```javascript
// assets/js/components/blocks.js
export class BlockManager {
    constructor() {
        this.blocks = new Map();
        this.init();
    }

    init() {
        this.registerBlocks();
        this.bindEvents();
    }

    registerBlocks() {
        // Register testimonial blocks
        this.registerTestimonialBlocks();

        // Register hero blocks
        this.registerHeroBlocks();

        // Register form blocks
        this.registerFormBlocks();
    }

    registerTestimonialBlocks() {
        const testimonials = document.querySelectorAll('.jankx-block-testimonial');

        testimonials.forEach(testimonial => {
            const testimonialBlock = new TestimonialBlock(testimonial);
            this.blocks.set(testimonial, testimonialBlock);
        });
    }

    bindEvents() {
        // Bind block-specific events
        this.blocks.forEach(block => {
            block.bindEvents();
        });
    }
}

class TestimonialBlock {
    constructor(element) {
        this.element = element;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.element.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(event) {
        // Handle testimonial interactions
        console.log('Testimonial clicked');
    }
}
```

## 🖼️ Image Organization

### Image Optimization Strategy
```php
class ImageOptimizer
{
    private $imageFormats = ['jpg', 'jpeg', 'png', 'webp'];
    private $quality = 85;

    public function optimizeImage(string $imagePath): array
    {
        $optimizedImages = [];

        foreach ($this->imageFormats as $format) {
            $optimizedPath = $this->generateOptimizedImage($imagePath, $format);
            $optimizedImages[$format] = $optimizedPath;
        }

        return $optimizedImages;
    }

    public function generateResponsiveImages(string $imagePath): array
    {
        $sizes = [
            'thumbnail' => [150, 150],
            'medium' => [300, 300],
            'large' => [1024, 1024],
            'hero' => [1920, 1080]
        ];

        $responsiveImages = [];

        foreach ($sizes as $size => $dimensions) {
            $responsiveImages[$size] = $this->resizeImage($imagePath, $dimensions[0], $dimensions[1]);
        }

        return $responsiveImages;
    }

    public function generateWebP(string $imagePath): string
    {
        $webpPath = str_replace(['.jpg', '.jpeg', '.png'], '.webp', $imagePath);

        // Convert to WebP
        $image = imagecreatefromstring(file_get_contents($imagePath));
        imagewebp($image, $webpPath, $this->quality);
        imagedestroy($image);

        return $webpPath;
    }
}
```

### Image Loading Strategy
```php
class ImageLoader
{
    public function lazyLoadImages(): void
    {
        add_filter('wp_get_attachment_image_attributes', function($attr, $attachment) {
            $attr['loading'] = 'lazy';
            $attr['decoding'] = 'async';
            return $attr;
        }, 10, 2);
    }

    public function preloadCriticalImages(): void
    {
        add_action('wp_head', function() {
            $criticalImages = [
                get_theme_file_uri('assets/images/logo.svg'),
                get_theme_file_uri('assets/images/hero-bg.jpg')
            ];

            foreach ($criticalImages as $image) {
                echo '<link rel="preload" as="image" href="' . esc_url($image) . '">';
            }
        });
    }

    public function generatePictureElement(string $imagePath): string
    {
        $webpPath = $this->generateWebP($imagePath);
        $responsiveImages = $this->generateResponsiveImages($imagePath);

        $srcset = [];
        foreach ($responsiveImages as $size => $path) {
            $srcset[] = $path . ' ' . $size;
        }

        return sprintf(
            '<picture>
                <source srcset="%s" type="image/webp">
                <source srcset="%s" type="image/jpeg">
                <img src="%s" alt="" loading="lazy" decoding="async">
            </picture>',
            $webpPath,
            implode(', ', $srcset),
            $imagePath
        );
    }
}
```

## 🔤 Font Management

### Font Loading Strategy
```php
class FontLoader
{
    private $fonts = [
        'main' => [
            'woff2' => 'assets/fonts/main.woff2',
            'woff' => 'assets/fonts/main.woff',
            'fallback' => 'Arial, sans-serif'
        ]
    ];

    public function loadFonts(): void
    {
        add_action('wp_head', function() {
            foreach ($this->fonts as $fontName => $fontFiles) {
                $this->loadFont($fontName, $fontFiles);
            }
        });
    }

    private function loadFont(string $fontName, array $fontFiles): void
    {
        ?>
        <link rel="preload" href="<?php echo esc_url(get_theme_file_uri($fontFiles['woff2'])); ?>" as="font" type="font/woff2" crossorigin>
        <style>
        @font-face {
            font-family: '<?php echo esc_attr($fontName); ?>';
            src: url('<?php echo esc_url(get_theme_file_uri($fontFiles['woff2'])); ?>') format('woff2'),
                 url('<?php echo esc_url(get_theme_file_uri($fontFiles['woff'])); ?>') format('woff');
            font-display: swap;
        }

        .font-<?php echo esc_attr($fontName); ?> {
            font-family: '<?php echo esc_attr($fontName); ?>', <?php echo esc_attr($fontFiles['fallback']); ?>;
        }
        </style>
        <?php
    }

    public function implementFontLoading(): void
    {
        add_action('wp_footer', function() {
            ?>
            <script>
            if ('fonts' in document) {
                document.fonts.load('1em main').then(function() {
                    document.documentElement.classList.add('font-loaded');
                }).catch(function() {
                    document.documentElement.classList.add('font-fallback');
                });
            }
            </script>
            <?php
        });
    }
}
```

## 🎯 Gutenberg Asset Management

### Block Asset Loading
```php
class GutenbergAssetManager
{
    private $blocks = [];

    public function registerBlockAssets(): void
    {
        $blocksDir = get_template_directory() . '/assets/gutenberg/blocks/';
        $blockDirs = glob($blocksDir . '*/block.json');

        foreach ($blockDirs as $blockJson) {
            $blockData = json_decode(file_get_contents($blockJson), true);
            $this->registerBlock($blockData);
        }
    }

    private function registerBlock(array $blockData): void
    {
        $blockName = $blockData['name'];
        $blockPath = dirname($blockData['editorScript']);

        // Register editor assets
        if (isset($blockData['editorScript'])) {
            wp_register_script(
                'jankx-block-' . $blockName . '-editor',
                get_theme_file_uri($blockData['editorScript']),
                ['wp-blocks', 'wp-element', 'wp-editor'],
                \Jankx\Jankx::getFrameworkVersion(),
                true
            );
        }

        // Register editor styles
        if (isset($blockData['editorStyle'])) {
            wp_register_style(
                'jankx-block-' . $blockName . '-editor',
                get_theme_file_uri($blockData['editorStyle']),
                [],
                \Jankx\Jankx::getFrameworkVersion()
            );
        }

        // Register frontend styles
        if (isset($blockData['style'])) {
            wp_register_style(
                'jankx-block-' . $blockName . '-frontend',
                get_theme_file_uri($blockData['style']),
                [],
                \Jankx\Jankx::getFrameworkVersion()
            );
        }
    }

    public function enqueueBlockAssets(string $blockName): void
    {
        if ($this->isBlockUsed($blockName)) {
            wp_enqueue_style('jankx-block-' . $blockName . '-frontend');
            wp_enqueue_script('jankx-block-' . $blockName . '-frontend');
        }
    }
}
```

## 🛠 Build Process

### Webpack Configuration
```javascript
// webpack.config.js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    entry: {
        main: './assets/js/main.js',
        critical: './assets/js/critical.js',
        gutenberg: './assets/js/gutenberg.js'
    },
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'assets/dist/js')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '../css/[name].min.css'
        })
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true
                    }
                }
            }),
            new CssMinimizerPlugin()
        ],
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
    }
};
```

### PostCSS Configuration
```javascript
// postcss.config.js
module.exports = {
    plugins: [
        require('autoprefixer'),
        require('postcss-preset-env')({
            stage: 3,
            features: {
                'custom-properties': true,
                'custom-media-queries': true,
                'nesting-rules': true
            }
        }),
        require('cssnano')({
            preset: 'default'
        })
    ]
};
```

## 📊 Asset Performance

### Asset Optimization
```php
class AssetOptimizer
{
    public function optimizeAssets(): void
    {
        // Combine CSS files
        $this->combineCSS();

        // Minify CSS
        $this->minifyCSS();

        // Combine JavaScript files
        $this->combineJS();

        // Minify JavaScript
        $this->minifyJS();

        // Optimize images
        $this->optimizeImages();

        // Generate critical CSS
        $this->generateCriticalCSS();
    }

    public function generateCriticalCSS(): string
    {
        $criticalSelectors = [
            '.site-header',
            '.main-navigation',
            '.hero-section',
            '.hero-title',
            '.hero-description'
        ];

        return $this->extractCSSForSelectors($criticalSelectors);
    }

    public function inlineCriticalCSS(): void
    {
        $criticalCSS = $this->generateCriticalCSS();

        add_action('wp_head', function() use ($criticalCSS) {
            echo '<style>' . $criticalCSS . '</style>';
        });
    }
}
```

---

**Next**: [Template System](./templates.md) | [WordPress Integration](./wordpress-integration.md)