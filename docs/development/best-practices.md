# Development Best Practices

> **Thực hành tốt nhất cho Jankx 2.0 Development**

## 🎯 Core Principles

### 1. **Service-Oriented Architecture**
```php
// ✅ GOOD - Service-based approach
class PostService
{
    private $repository;
    private $validator;
    private $cache;

    public function __construct(
        PostRepository $repository,
        PostValidator $validator,
        CacheManager $cache
    ) {
        $this->repository = $repository;
        $this->validator = $validator;
        $this->cache = $cache;
    }

    public function getFeaturedPosts(): array
    {
        $cacheKey = 'featured_posts';

        if ($this->cache->has($cacheKey)) {
            return $this->cache->get($cacheKey);
        }

        $posts = $this->repository->findBy(['featured' => true]);
        $this->cache->set($cacheKey, $posts, 3600);

        return $posts;
    }
}

// ❌ BAD - Procedural approach
function get_featured_posts() {
    global $wpdb;
    return $wpdb->get_results("SELECT * FROM {$wpdb->posts} WHERE featured = 1");
}
```

### 2. **Dependency Injection**
```php
// ✅ GOOD - Constructor injection
class BlockRenderer
{
    private $templateEngine;
    private $assetManager;
    private $securityManager;

    public function __construct(
        TemplateEngine $templateEngine,
        AssetManager $assetManager,
        SecurityManager $securityManager
    ) {
        $this->templateEngine = $templateEngine;
        $this->assetManager = $assetManager;
        $this->securityManager = $securityManager;
    }

    public function render(string $blockName, array $attributes): string
    {
        $template = $this->templateEngine->getTemplate($blockName);
        $data = $this->securityManager->sanitize($attributes);

        return $this->templateEngine->render($template, $data);
    }
}
```

### 3. **Error Handling**
```php
// ✅ GOOD - Proper error handling
class DataProcessor
{
    public function process(array $data): Result
    {
        try {
            $this->validate($data);
            $result = $this->transform($data);
            $this->save($result);

            return Result::success($result);
        } catch (ValidationException $e) {
            return Result::error('Validation failed: ' . $e->getMessage());
        } catch (DatabaseException $e) {
            return Result::error('Database error: ' . $e->getMessage());
        } catch (Exception $e) {
            return Result::error('Unexpected error: ' . $e->getMessage());
        }
    }
}
```

## 🧩 Block Development

### 1. **Block Structure**
```php
// ✅ GOOD - Proper block structure
class TestimonialBlock extends AbstractBlock
{
    protected $blockName = 'jankx/testimonial';
    protected $attributes = [
        'author' => ['type' => 'string', 'default' => ''],
        'content' => ['type' => 'string', 'default' => ''],
        'avatar' => ['type' => 'string', 'default' => ''],
        'rating' => ['type' => 'number', 'default' => 5]
    ];

    public function register(): void
    {
        register_block_type($this->getBlockPath(), [
            'attributes' => $this->attributes,
            'render_callback' => [$this, 'render'],
            'editor_script' => $this->getEditorScript(),
            'editor_style' => $this->getEditorStyle(),
            'style' => $this->getFrontendStyle(),
        ]);
    }

    public function render(array $attributes, string $content): string
    {
        $data = [
            'author' => $this->sanitize($attributes['author']),
            'content' => $this->sanitize($attributes['content']),
            'avatar' => $this->sanitize($attributes['avatar']),
            'rating' => (int) $attributes['rating']
        ];

        return $this->renderTemplate('testimonial', $data);
    }
}
```

### 2. **Block Assets**
```javascript
// ✅ GOOD - Proper asset organization
// assets/js/blocks/testimonial/editor.js
import { registerBlockType } from '@wordpress/blocks';
import { RichText, MediaUpload } from '@wordpress/block-editor';

registerBlockType('jankx/testimonial', {
    edit: function(props) {
        const { attributes, setAttributes } = props;

        return (
            <div className="jankx-testimonial-editor">
                <RichText
                    tagName="p"
                    value={attributes.content}
                    onChange={(content) => setAttributes({ content })}
                    placeholder="Enter testimonial content..."
                />
                <RichText
                    tagName="cite"
                    value={attributes.author}
                    onChange={(author) => setAttributes({ author })}
                    placeholder="Author name..."
                />
            </div>
        );
    },

    save: function() {
        return <InnerBlocks.Content />;
    }
});
```

## 🔧 Performance Optimization

### 1. **Lazy Loading**
```php
// ✅ GOOD - Lazy loading implementation
class LazyLoader
{
    public function lazyLoadImages(): void
    {
        add_filter('wp_get_attachment_image_attributes', function($attr) {
            $attr['loading'] = 'lazy';
            $attr['decoding'] = 'async';
            return $attr;
        });
    }

    public function lazyLoadBlocks(): void
    {
        add_action('wp_footer', function() {
            ?>
            <script>
            document.addEventListener('DOMContentLoaded', function() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('loaded');
                            observer.unobserve(entry.target);
                        }
                    });
                });

                document.querySelectorAll('.jankx-lazy-block').forEach(block => {
                    observer.observe(block);
                });
            });
            </script>
            <?php
        });
    }
}
```

### 2. **Asset Optimization**
```php
// ✅ GOOD - Asset optimization
class AssetOptimizer
{
    public function optimizeCSS(): void
    {
        add_action('wp_head', function() {
            // Inline critical CSS
            $criticalCSS = $this->getCriticalCSS();
            echo '<style>' . $criticalCSS . '</style>';
        });

        add_action('wp_enqueue_scripts', function() {
            // Defer non-critical CSS
            wp_enqueue_style('jankx-main', get_theme_file_uri('assets/css/main.css'), [], null, 'print');
            wp_style_add_data('jankx-main', 'onload', "this.onload=null;this.rel='stylesheet'");
        });
    }

    public function optimizeJS(): void
    {
        add_filter('script_loader_tag', function($tag, $handle) {
            if (strpos($handle, 'jankx-') === 0) {
                return str_replace('<script ', '<script defer ', $tag);
            }
            return $tag;
        }, 10, 2);
    }
}
```

## 🔒 Security Best Practices

### 1. **Input Sanitization**
```php
// ✅ GOOD - Proper sanitization
class InputSanitizer
{
    public function sanitizeText(string $text): string
    {
        return sanitize_text_field($text);
    }

    public function sanitizeHTML(string $html): string
    {
        return wp_kses($html, [
            'p' => [],
            'br' => [],
            'strong' => [],
            'em' => [],
            'a' => ['href' => [], 'target' => []]
        ]);
    }

    public function sanitizeURL(string $url): string
    {
        return esc_url_raw($url);
    }

    public function sanitizeEmail(string $email): string
    {
        return sanitize_email($email);
    }
}
```

### 2. **Nonce Verification**
```php
// ✅ GOOD - Nonce verification
class SecurityManager
{
    public function verifyNonce(string $nonce, string $action): bool
    {
        return wp_verify_nonce($nonce, $action);
    }

    public function createNonce(string $action): string
    {
        return wp_create_nonce($action);
    }

    public function checkCapability(string $capability): bool
    {
        return current_user_can($capability);
    }
}
```

## 📊 Testing Best Practices

### 1. **Unit Testing**
```php
// ✅ GOOD - Unit tests
class PostServiceTest extends TestCase
{
    private $postService;
    private $mockRepository;
    private $mockCache;

    protected function setUp(): void
    {
        $this->mockRepository = $this->createMock(PostRepository::class);
        $this->mockCache = $this->createMock(CacheManager::class);
        $this->postService = new PostService($this->mockRepository, $this->mockCache);
    }

    public function testGetFeaturedPostsReturnsCachedData(): void
    {
        $expectedPosts = [['id' => 1, 'title' => 'Test Post']];

        $this->mockCache->expects($this->once())
            ->method('has')
            ->with('featured_posts')
            ->willReturn(true);

        $this->mockCache->expects($this->once())
            ->method('get')
            ->with('featured_posts')
            ->willReturn($expectedPosts);

        $result = $this->postService->getFeaturedPosts();

        $this->assertEquals($expectedPosts, $result);
    }
}
```

### 2. **Integration Testing**
```php
// ✅ GOOD - Integration tests
class BlockRenderingTest extends TestCase
{
    public function testTestimonialBlockRendersCorrectly(): void
    {
        $attributes = [
            'author' => 'John Doe',
            'content' => 'Great product!',
            'rating' => 5
        ];

        $block = new TestimonialBlock();
        $html = $block->render($attributes, '');

        $this->assertStringContainsString('John Doe', $html);
        $this->assertStringContainsString('Great product!', $html);
        $this->assertStringContainsString('jankx-testimonial', $html);
    }
}
```

## 🚀 Performance Tips

### 1. **Database Optimization**
```php
// ✅ GOOD - Optimized queries
class OptimizedQueryService
{
    public function getPostsWithMeta(): array
    {
        // Use single query instead of multiple
        return get_posts([
            'numberposts' => -1,
            'meta_query' => [
                ['key' => 'featured', 'value' => '1']
            ],
            'update_post_meta_cache' => false,
            'update_post_term_cache' => false
        ]);
    }

    public function getPostsWithTerms(): array
    {
        // Use tax_query for better performance
        return get_posts([
            'tax_query' => [
                ['taxonomy' => 'category', 'field' => 'slug', 'terms' => 'featured']
            ]
        ]);
    }
}
```

### 2. **Caching Strategy**
```php
// ✅ GOOD - Smart caching
class SmartCacheManager
{
    public function getWithCache(string $key, callable $callback, int $ttl = 3600)
    {
        $cached = wp_cache_get($key);

        if ($cached !== false) {
            return $cached;
        }

        $data = $callback();
        wp_cache_set($key, $data, '', $ttl);

        return $data;
    }

    public function invalidateCache(string $pattern): void
    {
        global $wp_object_cache;

        if (method_exists($wp_object_cache, 'flush_group')) {
            $wp_object_cache->flush_group($pattern);
        }
    }
}
```

## 🔧 Debugging Tips

### 1. **Logging**
```php
// ✅ GOOD - Proper logging
class Logger
{
    public function log(string $level, string $message, array $context = []): void
    {
        if (!defined('WP_DEBUG') || !WP_DEBUG) {
            return;
        }

        $logEntry = [
            'timestamp' => current_time('mysql'),
            'level' => $level,
            'message' => $message,
            'context' => $context
        ];

        error_log('JANKX_LOG: ' . json_encode($logEntry));
    }

    public function debug(string $message, array $context = []): void
    {
        $this->log('DEBUG', $message, $context);
    }

    public function error(string $message, array $context = []): void
    {
        $this->log('ERROR', $message, $context);
    }
}
```

### 2. **Performance Monitoring**
```php
// ✅ GOOD - Performance monitoring
class PerformanceMonitor
{
    private $startTime;
    private $metrics = [];

    public function startTimer(string $name): void
    {
        $this->startTime[$name] = microtime(true);
    }

    public function endTimer(string $name): float
    {
        if (!isset($this->startTime[$name])) {
            return 0;
        }

        $duration = microtime(true) - $this->startTime[$name];
        $this->metrics[$name] = $duration;

        return $duration;
    }

    public function getMetrics(): array
    {
        return $this->metrics;
    }
}
```

## 📋 Development Checklist

### ✅ Code Quality
- [ ] Follow PSR-12 coding standards
- [ ] Use type hints and return types
- [ ] Write meaningful comments
- [ ] Keep functions small and focused
- [ ] Use dependency injection

### ✅ Performance
- [ ] Optimize database queries
- [ ] Implement caching where appropriate
- [ ] Use lazy loading for assets
- [ ] Minimize HTTP requests
- [ ] Optimize images

### ✅ Security
- [ ] Sanitize all inputs
- [ ] Escape all outputs
- [ ] Use nonces for forms
- [ ] Check user capabilities
- [ ] Validate file uploads

### ✅ Testing
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Test error scenarios
- [ ] Test performance
- [ ] Test security

---

**Next**: [Coding Rules](./rules.md) | [Testing Guidelines](./testing.md)