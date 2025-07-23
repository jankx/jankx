# Core Web Vitals Optimization

> **Performance-First Approach for Modern Web**

Jankx 2.0 được thiết kế để tối ưu hóa Core Web Vitals (LCP, FID, CLS) và đảm bảo trải nghiệm người dùng tốt nhất.

## 📊 Core Web Vitals Targets

### Performance Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 600ms

### Monitoring Setup
```php
class CoreWebVitalsMonitor
{
    private $metrics = [];

    public function trackLCP(float $value): void
    {
        $this->metrics['lcp'] = $value;
        $this->logMetric('lcp', $value);
    }

    public function trackFID(float $value): void
    {
        $this->metrics['fid'] = $value;
        $this->logMetric('fid', $value);
    }

    public function trackCLS(float $value): void
    {
        $this->metrics['cls'] = $value;
        $this->logMetric('cls', $value);
    }

    public function getMetrics(): array
    {
        return $this->metrics;
    }
}
```

## 🚀 LCP Optimization

### Critical Resource Loading
```php
class CriticalResourceLoader
{
    public function loadCriticalCSS(): void
    {
        $criticalCSS = $this->generateCriticalCSS();
        $this->inlineCSS($criticalCSS);
    }

    public function preloadCriticalResources(): void
    {
        // Preload hero image
        add_action('wp_head', function() {
            echo '<link rel="preload" as="image" href="' . esc_url(get_theme_file_uri('assets/images/hero.jpg')) . '">';
        });

        // Preload critical fonts
        add_action('wp_head', function() {
            echo '<link rel="preload" href="' . esc_url(get_theme_file_uri('assets/fonts/main.woff2')) . '" as="font" type="font/woff2" crossorigin>';
        });
    }

    private function generateCriticalCSS(): string
    {
        $criticalSelectors = [
            '.hero-section',
            '.main-navigation',
            '.site-header',
            '.hero-title',
            '.hero-description'
        ];

        return $this->extractCSSForSelectors($criticalSelectors);
    }
}
```

### Image Optimization
```php
class ImageOptimizer
{
    public function optimizeHeroImage(string $imageUrl): string
    {
        // Generate WebP version
        $webpUrl = $this->generateWebP($imageUrl);

        // Generate responsive images
        $responsiveImages = $this->generateResponsiveImages($imageUrl);

        return $this->buildPictureElement($imageUrl, $webpUrl, $responsiveImages);
    }

    public function lazyLoadImages(): void
    {
        add_filter('wp_get_attachment_image_attributes', function($attr, $attachment) {
            $attr['loading'] = 'lazy';
            $attr['decoding'] = 'async';
            return $attr;
        }, 10, 2);
    }

    private function buildPictureElement(string $original, string $webp, array $responsive): string
    {
        return sprintf(
            '<picture>
                <source srcset="%s" type="image/webp">
                <source srcset="%s" type="image/jpeg">
                <img src="%s" alt="" loading="lazy" decoding="async">
            </picture>',
            $webp,
            $responsive['srcset'],
            $original
        );
    }
}
```

## ⚡ FID Optimization

### JavaScript Optimization
```php
class JavaScriptOptimizer
{
    public function deferNonCriticalJS(): void
    {
        add_filter('script_loader_tag', function($tag, $handle) {
            if ($this->isNonCriticalScript($handle)) {
                return str_replace('<script ', '<script defer ', $tag);
            }
            return $tag;
        }, 10, 2);
    }

    public function inlineCriticalJS(): void
    {
        $criticalJS = $this->extractCriticalJS();
        add_action('wp_head', function() use ($criticalJS) {
            echo '<script>' . $criticalJS . '</script>';
        });
    }

    private function isNonCriticalScript(string $handle): bool
    {
        $nonCriticalScripts = [
            'jankx-analytics',
            'jankx-social-share',
            'jankx-comments'
        ];

        return in_array($handle, $nonCriticalScripts);
    }
}
```

### Event Handler Optimization
```php
class EventHandlerOptimizer
{
    public function optimizeEventHandlers(): void
    {
        // Use passive event listeners
        add_action('wp_footer', function() {
            ?>
            <script>
            document.addEventListener('scroll', function() {
                // Scroll handling
            }, { passive: true });

            document.addEventListener('touchstart', function() {
                // Touch handling
            }, { passive: true });
            </script>
            <?php
        });
    }

    public function debounceEventHandlers(): void
    {
        add_action('wp_footer', function() {
            ?>
            <script>
            function debounce(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            }

            // Debounce scroll events
            const debouncedScrollHandler = debounce(function() {
                // Handle scroll
            }, 16);

            window.addEventListener('scroll', debouncedScrollHandler);
            </script>
            <?php
        });
    }
}
```

## 📐 CLS Optimization

### Layout Stability
```php
class LayoutStabilityOptimizer
{
    public function reserveSpaceForImages(): void
    {
        add_filter('wp_get_attachment_image_attributes', function($attr, $attachment) {
            $metadata = wp_get_attachment_metadata($attachment->ID);
            if ($metadata) {
                $aspectRatio = $metadata['height'] / $metadata['width'];
                $attr['style'] = 'aspect-ratio: ' . $aspectRatio . ';';
            }
            return $attr;
        }, 10, 2);
    }

    public function reserveSpaceForFonts(): void
    {
        add_action('wp_head', function() {
            ?>
            <style>
            /* Reserve space for custom fonts */
            .font-loaded {
                font-family: 'Custom Font', sans-serif;
            }

            .font-loading {
                font-family: 'Fallback Font', sans-serif;
                font-size: 1.2em; /* Adjust for font metrics */
            }
            </style>
            <?php
        });
    }

    public function preventLayoutShift(): void
    {
        add_action('wp_head', function() {
            ?>
            <style>
            /* Prevent layout shift for dynamic content */
            .dynamic-content {
                min-height: 200px; /* Reserve space */
            }

            .advertisement {
                min-height: 250px; /* Reserve space for ads */
            }

            .social-share {
                min-height: 40px; /* Reserve space for social buttons */
            }
            </style>
            <?php
        });
    }
}
```

### Font Loading Strategy
```php
class FontLoadingOptimizer
{
    public function optimizeFontLoading(): void
    {
        add_action('wp_head', function() {
            ?>
            <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
            <style>
            /* Font display swap for better performance */
            @font-face {
                font-family: 'Custom Font';
                src: url('/fonts/main.woff2') format('woff2');
                font-display: swap;
            }

            /* Font fallback with similar metrics */
            .font-fallback {
                font-family: 'Arial', sans-serif;
                font-size: 1.1em; /* Adjust for similar metrics */
            }
            </style>
            <?php
        });
    }

    public function implementFontLoading(): void
    {
        add_action('wp_footer', function() {
            ?>
            <script>
            // Font loading with fallback
            if ('fonts' in document) {
                document.fonts.load('1em Custom Font').then(function() {
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

## 🔄 Resource Loading Strategy

### Critical Path Optimization
```php
class CriticalPathOptimizer
{
    public function inlineCriticalResources(): void
    {
        // Inline critical CSS
        $criticalCSS = $this->extractCriticalCSS();
        add_action('wp_head', function() use ($criticalCSS) {
            echo '<style>' . $criticalCSS . '</style>';
        });

        // Inline critical JavaScript
        $criticalJS = $this->extractCriticalJS();
        add_action('wp_head', function() use ($criticalJS) {
            echo '<script>' . $criticalJS . '</script>';
        });
    }

    public function deferNonCriticalResources(): void
    {
        // Defer non-critical CSS
        add_filter('style_loader_tag', function($tag, $handle) {
            if ($this->isNonCriticalStyle($handle)) {
                return str_replace('<link ', '<link media="print" onload="this.media=\'all\'" ', $tag);
            }
            return $tag;
        }, 10, 2);

        // Defer non-critical JavaScript
        add_filter('script_loader_tag', function($tag, $handle) {
            if ($this->isNonCriticalScript($handle)) {
                return str_replace('<script ', '<script defer ', $tag);
            }
            return $tag;
        }, 10, 2);
    }
}
```

### Asset Loading Optimization
```php
class AssetLoadingOptimizer
{
    public function optimizeCSSLoading(): void
    {
        // Combine and minify CSS
        $this->combineCSS();

        // Remove unused CSS
        $this->purgeUnusedCSS();

        // Compress CSS
        $this->compressCSS();
    }

    public function optimizeJSLoading(): void
    {
        // Bundle JavaScript
        $this->bundleJavaScript();

        // Minify JavaScript
        $this->minifyJavaScript();

        // Tree shake unused code
        $this->treeShakeJavaScript();
    }

    public function optimizeImageLoading(): void
    {
        // Generate WebP images
        $this->generateWebPImages();

        // Generate responsive images
        $this->generateResponsiveImages();

        // Optimize image compression
        $this->optimizeImageCompression();
    }
}
```

## 📈 Performance Monitoring

### Real User Monitoring (RUM)
```php
class PerformanceMonitor
{
    public function trackCoreWebVitals(): void
    {
        add_action('wp_footer', function() {
            ?>
            <script>
            // Track LCP
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                        // Send to analytics
                        this.sendMetric('lcp', entry.startTime);
                    }
                }
            }).observe({entryTypes: ['largest-contentful-paint']});

            // Track FID
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (entry.entryType === 'first-input') {
                        // Send to analytics
                        this.sendMetric('fid', entry.processingStart - entry.startTime);
                    }
                }
            }).observe({entryTypes: ['first-input']});

            // Track CLS
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        // Send to analytics
                        this.sendMetric('cls', clsValue);
                    }
                }
            }).observe({entryTypes: ['layout-shift']});
            </script>
            <?php
        });
    }

    private function sendMetric(string $metric, float $value): void
    {
        // Send to analytics service
        if ('gtag' in window) {
            gtag('event', 'web_vitals', {
                event_category: 'Web Vitals',
                event_label: metric,
                value: Math.round(value),
                non_interaction: true
            });
        }
    }
}
```

### Performance Budget
```php
class PerformanceBudget
{
    private $budgets = [
        'lcp' => 2500, // 2.5 seconds
        'fid' => 100,   // 100 milliseconds
        'cls' => 0.1,   // 0.1
        'ttfb' => 600,  // 600 milliseconds
        'js_size' => 300000, // 300KB
        'css_size' => 50000, // 50KB
        'image_size' => 1000000 // 1MB
    ];

    public function checkPerformanceBudget(): array
    {
        $violations = [];

        foreach ($this->budgets as $metric => $budget) {
            $currentValue = $this->getCurrentValue($metric);
            if ($currentValue > $budget) {
                $violations[$metric] = [
                    'budget' => $budget,
                    'actual' => $currentValue,
                    'excess' => $currentValue - $budget
                ];
            }
        }

        return $violations;
    }

    public function generateReport(): string
    {
        $violations = $this->checkPerformanceBudget();

        if (empty($violations)) {
            return '✅ All performance budgets met';
        }

        $report = "❌ Performance budget violations:\n";
        foreach ($violations as $metric => $data) {
            $report .= sprintf(
                "- %s: %s (budget: %s, excess: %s)\n",
                strtoupper($metric),
                $data['actual'],
                $data['budget'],
                $data['excess']
            );
        }

        return $report;
    }
}
```

## 🛠 Optimization Tools

### Build Process
```json
// package.json
{
  "scripts": {
    "build": "npm run build:css && npm run build:js && npm run optimize:images",
    "build:css": "postcss src/css/main.css -o dist/css/main.min.css",
    "build:js": "webpack --mode=production",
    "optimize:images": "imagemin src/images/* --out-dir=dist/images",
    "analyze": "webpack-bundle-analyzer dist/js/bundle.js",
    "lighthouse": "lighthouse https://example.com --output=html --output-path=./lighthouse-report.html"
  },
  "devDependencies": {
    "postcss": "^8.4.0",
    "postcss-purgecss": "^5.0.0",
    "webpack": "^5.0.0",
    "imagemin": "^8.0.0",
    "lighthouse": "^10.0.0"
  }
}
```

### Webpack Configuration
```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  entry: './src/js/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/js')
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
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
      }
    ]
  }
};
```

---

**Next**: [Asset Management](./asset-management.md) | [Caching Strategy](./caching-strategy.md) | [Lazy Loading](./lazy-loading.md)