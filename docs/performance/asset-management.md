# Asset Management

> **Modern Asset Loading & Optimization**

Jankx 2.0 sử dụng hệ thống asset management hiện đại với lazy loading, optimization và selective loading.

## 🏗 Asset Architecture

### Asset System Structure
```
┌─────────────────────────────────────┐
│         Asset Manager              │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Asset     │  │   Asset     │  │
│  │  Registry   │  │  Optimizer  │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Asset Loading              │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Lazy      │  │  Selective  │  │
│  │  Loading    │  │   Loading   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Asset Optimization         │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Minify    │  │   Combine   │  │
│  │   Assets    │  │   Assets    │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

## 🔧 Asset Manager

### Asset Manager Implementation
```php
<?php
namespace Jankx\Assets;

class AssetManager
{
    private $assets = [];
    private $optimizer;
    private $lazyLoader;
    private $blockAssets = [];

    public function __construct(AssetOptimizer $optimizer, LazyAssetLoader $lazyLoader)
    {
        $this->optimizer = $optimizer;
        $this->lazyLoader = $lazyLoader;
        $this->registerDefaultAssets();
    }

    public function registerAsset(string $handle, array $config): void
    {
        $this->assets[$handle] = $config;
    }

    public function enqueueAsset(string $handle): void
    {
        if (!isset($this->assets[$handle])) {
            return;
        }

        $asset = $this->assets[$handle];

        if (isset($asset['script'])) {
            wp_enqueue_script(
                $handle,
                $asset['script'],
                $asset['dependencies'] ?? [],
                $asset['version'] ?? JANKX_VERSION,
                $asset['in_footer'] ?? true
            );
        }

        if (isset($asset['style'])) {
            wp_enqueue_style(
                $handle,
                $asset['style'],
                $asset['dependencies'] ?? [],
                $asset['version'] ?? JANKX_VERSION
            );
        }
    }

    public function enqueueFrontendAssets(): void
    {
        // Enqueue critical assets
        $this->enqueueCriticalAssets();

        // Enqueue main assets
        $this->enqueueMainAssets();

        // Enqueue block-specific assets
        $this->enqueueBlockAssets();

        // Enqueue lazy assets
        $this->enqueueLazyAssets();
    }

    public function enqueueAdminAssets(): void
    {
        // Enqueue admin-specific assets
        $this->enqueueAsset('jankx-admin');
        $this->enqueueAsset('jankx-admin-style');
    }

    private function enqueueCriticalAssets(): void
    {
        // Inline critical CSS
        $this->inlineCriticalCSS();

        // Preload critical fonts
        $this->preloadCriticalFonts();

        // Preload critical images
        $this->preloadCriticalImages();
    }

    private function enqueueMainAssets(): void
    {
        $this->enqueueAsset('jankx-main');
        $this->enqueueAsset('jankx-style');
    }

    private function enqueueBlockAssets(): void
    {
        $usedBlocks = $this->getUsedBlocks();

        foreach ($usedBlocks as $blockName) {
            $this->enqueueBlockAsset($blockName);
        }
    }

    private function enqueueLazyAssets(): void
    {
        $this->lazyLoader->enqueueLazyAssets();
    }

    private function registerDefaultAssets(): void
    {
        // Main assets
        $this->registerAsset('jankx-main', [
            'script' => get_theme_file_uri('assets/dist/js/main.min.js'),
            'dependencies' => ['jquery'],
            'version' => JANKX_VERSION,
            'in_footer' => true,
        ]);

        $this->registerAsset('jankx-style', [
            'style' => get_theme_file_uri('assets/dist/css/main.min.css'),
            'dependencies' => [],
            'version' => JANKX_VERSION,
        ]);

        // Admin assets
        $this->registerAsset('jankx-admin', [
            'script' => get_theme_file_uri('assets/dist/js/admin.min.js'),
            'dependencies' => ['jquery', 'wp-color-picker'],
            'version' => JANKX_VERSION,
            'in_footer' => true,
        ]);

        $this->registerAsset('jankx-admin-style', [
            'style' => get_theme_file_uri('assets/dist/css/admin.min.css'),
            'dependencies' => ['wp-color-picker'],
            'version' => JANKX_VERSION,
        ]);
    }
}
```

## 🚀 Asset Optimizer

### Asset Optimizer Implementation
```php
<?php
namespace Jankx\Assets;

class AssetOptimizer
{
    private $config;

    public function __construct(array $config = [])
    {
        $this->config = array_merge([
            'minify_css' => true,
            'minify_js' => true,
            'combine_css' => true,
            'combine_js' => true,
            'optimize_images' => true,
            'generate_webp' => true,
        ], $config);
    }

    public function optimizeCSS(string $css): string
    {
        if ($this->config['minify_css']) {
            $css = $this->minifyCSS($css);
        }

        return $css;
    }

    public function optimizeJS(string $js): string
    {
        if ($this->config['minify_js']) {
            $js = $this->minifyJS($js);
        }

        return $js;
    }

    public function combineCSS(array $files): string
    {
        if (!$this->config['combine_css']) {
            return '';
        }

        $combined = '';

        foreach ($files as $file) {
            if (file_exists($file)) {
                $combined .= file_get_contents($file) . "\n";
            }
        }

        return $this->optimizeCSS($combined);
    }

    public function combineJS(array $files): string
    {
        if (!$this->config['combine_js']) {
            return '';
        }

        $combined = '';

        foreach ($files as $file) {
            if (file_exists($file)) {
                $combined .= file_get_contents($file) . ";\n";
            }
        }

        return $this->optimizeJS($combined);
    }

    public function optimizeImage(string $imagePath): array
    {
        $optimized = [];

        if ($this->config['optimize_images']) {
            $optimized['original'] = $this->compressImage($imagePath);
        }

        if ($this->config['generate_webp']) {
            $optimized['webp'] = $this->generateWebP($imagePath);
        }

        return $optimized;
    }

    private function minifyCSS(string $css): string
    {
        // Remove comments
        $css = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css);

        // Remove whitespace
        $css = preg_replace('/\s+/', ' ', $css);

        // Remove unnecessary semicolons
        $css = str_replace(';}', '}', $css);

        return trim($css);
    }

    private function minifyJS(string $js): string
    {
        // Remove comments
        $js = preg_replace('/\/\*.*?\*\//s', '', $js);
        $js = preg_replace('/\/\/.*$/m', '', $js);

        // Remove whitespace
        $js = preg_replace('/\s+/', ' ', $js);

        return trim($js);
    }

    private function compressImage(string $imagePath): string
    {
        $image = imagecreatefromstring(file_get_contents($imagePath));

        if (!$image) {
            return $imagePath;
        }

        $quality = 85;
        $outputPath = str_replace(['.jpg', '.jpeg', '.png'], '_optimized.jpg', $imagePath);

        imagejpeg($image, $outputPath, $quality);
        imagedestroy($image);

        return $outputPath;
    }

    private function generateWebP(string $imagePath): string
    {
        $image = imagecreatefromstring(file_get_contents($imagePath));

        if (!$image) {
            return $imagePath;
        }

        $outputPath = str_replace(['.jpg', '.jpeg', '.png'], '.webp', $imagePath);

        imagewebp($image, $outputPath, 85);
        imagedestroy($image);

        return $outputPath;
    }
}
```

## 🔄 Lazy Asset Loader

### Lazy Asset Loader Implementation
```php
<?php
namespace Jankx\Assets;

class LazyAssetLoader
{
    private $lazyAssets = [];
    private $loadedAssets = [];

    public function __construct()
    {
        $this->registerLazyAssets();
    }

    public function registerLazyAsset(string $name, array $config): void
    {
        $this->lazyAssets[$name] = $config;
    }

    public function enqueueLazyAssets(): void
    {
        add_action('wp_footer', [$this, 'addLazyAssetScripts']);
    }

    public function addLazyAssetScripts(): void
    {
        ?>
        <script>
        // Lazy asset loader
        class JankxLazyAssetLoader {
            constructor() {
                this.loadedAssets = new Set();
                this.init();
            }

            init() {
                this.observeIntersection();
                this.bindEvents();
            }

            observeIntersection() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadAssetsForElement(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    rootMargin: '50px',
                    threshold: 0.1
                });

                // Observe elements that need lazy assets
                document.querySelectorAll('[data-lazy-assets]').forEach(element => {
                    observer.observe(element);
                });
            }

            bindEvents() {
                // Load assets on user interaction
                document.addEventListener('click', (e) => {
                    if (e.target.matches('[data-lazy-assets]')) {
                        this.loadAssetsForElement(e.target);
                    }
                });

                // Load assets on scroll
                let scrollTimeout;
                window.addEventListener('scroll', () => {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        this.loadVisibleAssets();
                    }, 100);
                });
            }

            loadAssetsForElement(element) {
                const assetNames = element.dataset.lazyAssets?.split(',') || [];

                assetNames.forEach(assetName => {
                    if (!this.loadedAssets.has(assetName)) {
                        this.loadAsset(assetName);
                        this.loadedAssets.add(assetName);
                    }
                });
            }

            loadVisibleAssets() {
                const visibleElements = document.querySelectorAll('[data-lazy-assets]:not([data-assets-loaded])');

                visibleElements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

                    if (isVisible) {
                        this.loadAssetsForElement(element);
                        element.setAttribute('data-assets-loaded', 'true');
                    }
                });
            }

            loadAsset(assetName) {
                const assetConfig = <?php echo json_encode($this->lazyAssets); ?>[assetName];

                if (!assetConfig) {
                    return;
                }

                if (assetConfig.css) {
                    this.loadCSS(assetConfig.css);
                }

                if (assetConfig.js) {
                    this.loadJS(assetConfig.js);
                }
            }

            loadCSS(href) {
                if (document.querySelector(`link[href="${href}"]`)) {
                    return;
                }

                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            }

            loadJS(src) {
                if (document.querySelector(`script[src="${src}"]`)) {
                    return;
                }

                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                document.head.appendChild(script);
            }
        }

        // Initialize lazy asset loader
        const jankxLazyLoader = new JankxLazyAssetLoader();
        </script>
        <?php
    }

    private function registerLazyAssets(): void
    {
        // Register lazy assets
        $this->registerLazyAsset('lightbox', [
            'css' => get_theme_file_uri('assets/dist/css/lightbox.min.css'),
            'js' => get_theme_file_uri('assets/dist/js/lightbox.min.js'),
        ]);

        $this->registerLazyAsset('slider', [
            'css' => get_theme_file_uri('assets/dist/css/slider.min.css'),
            'js' => get_theme_file_uri('assets/dist/js/slider.min.js'),
        ]);

        $this->registerLazyAsset('modal', [
            'css' => get_theme_file_uri('assets/dist/css/modal.min.css'),
            'js' => get_theme_file_uri('assets/dist/js/modal.min.js'),
        ]);

        $this->registerLazyAsset('form-validation', [
            'css' => get_theme_file_uri('assets/dist/css/form-validation.min.css'),
            'js' => get_theme_file_uri('assets/dist/js/form-validation.min.js'),
        ]);
    }
}
```

## 🎯 Critical CSS Generator

### Critical CSS Generator Implementation
```php
<?php
namespace Jankx\Assets;

class CriticalCSSGenerator
{
    private $criticalSelectors = [];
    private $criticalCSS = '';

    public function __construct()
    {
        $this->setCriticalSelectors();
    }

    public function generateCriticalCSS(): string
    {
        $this->extractCriticalCSS();
        return $this->optimizeCriticalCSS();
    }

    public function inlineCriticalCSS(): void
    {
        $criticalCSS = $this->generateCriticalCSS();

        add_action('wp_head', function() use ($criticalCSS) {
            echo '<style id="jankx-critical-css">' . $criticalCSS . '</style>';
        });
    }

    private function setCriticalSelectors(): void
    {
        $this->criticalSelectors = [
            // Layout
            '.jankx-layout',
            '.jankx-layout-header',
            '.jankx-layout-main',
            '.jankx-layout-footer',

            // Navigation
            '.jankx-navigation',
            '.jankx-navigation-menu',
            '.jankx-navigation-toggle',

            // Typography
            'body',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'a', 'strong', 'em',

            // Buttons
            '.jankx-button',
            '.jankx-button-primary',
            '.jankx-button-secondary',

            // Forms
            '.jankx-form',
            '.jankx-input',
            '.jankx-textarea',
            '.jankx-select',

            // Hero section
            '.jankx-hero',
            '.jankx-hero-title',
            '.jankx-hero-description',

            // Blocks
            '.jankx-block',
            '.jankx-block-testimonial',
            '.jankx-block-hero',
        ];
    }

    private function extractCriticalCSS(): void
    {
        $cssFiles = [
            get_template_directory() . '/assets/css/main.css',
            get_template_directory() . '/assets/css/layouts.css',
            get_template_directory() . '/assets/css/components.css',
        ];

        $allCSS = '';

        foreach ($cssFiles as $file) {
            if (file_exists($file)) {
                $allCSS .= file_get_contents($file) . "\n";
            }
        }

        $this->criticalCSS = $this->extractCSSForSelectors($allCSS, $this->criticalSelectors);
    }

    private function extractCSSForSelectors(string $css, array $selectors): string
    {
        $criticalCSS = '';

        // Split CSS into rules
        $rules = $this->parseCSSRules($css);

        foreach ($rules as $rule) {
            if ($this->isCriticalRule($rule, $selectors)) {
                $criticalCSS .= $rule . "\n";
            }
        }

        return $criticalCSS;
    }

    private function parseCSSRules(string $css): array
    {
        // Basic CSS parser
        $rules = [];
        $currentRule = '';
        $braceCount = 0;

        for ($i = 0; $i < strlen($css); $i++) {
            $char = $css[$i];
            $currentRule .= $char;

            if ($char === '{') {
                $braceCount++;
            } elseif ($char === '}') {
                $braceCount--;

                if ($braceCount === 0) {
                    $rules[] = trim($currentRule);
                    $currentRule = '';
                }
            }
        }

        return $rules;
    }

    private function isCriticalRule(string $rule, array $selectors): bool
    {
        foreach ($selectors as $selector) {
            if (strpos($rule, $selector) !== false) {
                return true;
            }
        }

        return false;
    }

    private function optimizeCriticalCSS(): string
    {
        // Remove comments
        $css = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $this->criticalCSS);

        // Remove whitespace
        $css = preg_replace('/\s+/', ' ', $css);

        // Remove unnecessary semicolons
        $css = str_replace(';}', '}', $css);

        return trim($css);
    }
}
```

## 📊 Asset Performance Monitor

### Asset Performance Monitor Implementation
```php
<?php
namespace Jankx\Assets;

class AssetPerformanceMonitor
{
    private $metrics = [];

    public function trackAssetLoad(string $assetName, float $loadTime): void
    {
        $this->metrics[$assetName] = [
            'load_time' => $loadTime,
            'timestamp' => microtime(true),
        ];
    }

    public function getAssetMetrics(): array
    {
        return $this->metrics;
    }

    public function getAverageLoadTime(): float
    {
        if (empty($this->metrics)) {
            return 0;
        }

        $totalTime = array_sum(array_column($this->metrics, 'load_time'));
        return $totalTime / count($this->metrics);
    }

    public function getSlowestAssets(int $limit = 5): array
    {
        uasort($this->metrics, function($a, $b) {
            return $b['load_time'] <=> $a['load_time'];
        });

        return array_slice($this->metrics, 0, $limit, true);
    }

    public function generateReport(): string
    {
        $report = "# Asset Performance Report\n\n";

        $report .= "## Overall Metrics\n";
        $report .= "- **Total Assets**: " . count($this->metrics) . "\n";
        $report .= "- **Average Load Time**: " . number_format($this->getAverageLoadTime() * 1000, 2) . "ms\n";

        $report .= "\n## Slowest Assets\n";
        $slowestAssets = $this->getSlowestAssets();

        foreach ($slowestAssets as $assetName => $metrics) {
            $report .= "- **{$assetName}**: " . number_format($metrics['load_time'] * 1000, 2) . "ms\n";
        }

        return $report;
    }
}
```

---

**Next**: [Caching Strategy](./caching-strategy.md) | [Lazy Loading](./lazy-loading.md)