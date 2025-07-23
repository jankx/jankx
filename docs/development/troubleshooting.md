# Troubleshooting Guide

> **Xử lý lỗi thường gặp trong Jankx 2.0 Development**

## 🔍 Common Issues & Solutions

### 1. **Block Not Registering**

#### Problem: Block không hiển thị trong editor
```php
// ❌ WRONG - Missing proper registration
class TestimonialBlock
{
    public function register()
    {
        register_block_type('testimonial'); // Missing namespace
    }
}

// ✅ SOLUTION - Proper registration
class TestimonialBlock extends AbstractBlock
{
    protected $blockName = 'jankx/testimonial'; // Use namespace

    public function register(): void
    {
        register_block_type($this->getBlockPath(), [
            'attributes' => $this->getAttributes(),
            'render_callback' => [$this, 'render'],
            'editor_script' => $this->getEditorScript(),
            'style' => $this->getFrontendStyle(),
        ]);
    }
}
```

#### Debug Steps:
```php
// Add debugging to check registration
add_action('init', function() {
    $registeredBlocks = WP_Block_Type_Registry::get_instance()->get_all_registered();
    error_log('Registered blocks: ' . print_r($registeredBlocks, true));
});
```

### 2. **Assets Not Loading**

#### Problem: CSS/JS không load
```php
// ❌ WRONG - Wrong asset path
wp_enqueue_style('testimonial', 'assets/css/testimonial.css');

// ✅ SOLUTION - Use proper asset loading
class AssetLoader
{
    public function enqueueBlockAssets(string $blockName): void
    {
        $assetPath = get_theme_file_uri("assets/blocks/{$blockName}/style.css");
        $assetVersion = filemtime(get_theme_file_path("assets/blocks/{$blockName}/style.css"));

        wp_enqueue_style(
            "jankx-{$blockName}",
            $assetPath,
            [],
            $assetVersion
        );
    }
}
```

#### Debug Steps:
```php
// Check if assets exist
add_action('wp_enqueue_scripts', function() {
    $cssPath = get_theme_file_path('assets/css/main.css');
    if (!file_exists($cssPath)) {
        error_log("CSS file not found: {$cssPath}");
    }
});
```

### 3. **Service Container Issues**

#### Problem: Service không resolve được
```php
// ❌ WRONG - Circular dependency
class ServiceA
{
    public function __construct(ServiceB $serviceB) {}
}

class ServiceB
{
    public function __construct(ServiceA $serviceA) {} // Circular!
}

// ✅ SOLUTION - Use interfaces or lazy loading
class ServiceA
{
    private $serviceBFactory;

    public function __construct(callable $serviceBFactory)
    {
        $this->serviceBFactory = $serviceBFactory;
    }

    public function doSomething()
    {
        $serviceB = ($this->serviceBFactory)();
        // Use serviceB
    }
}
```

#### Debug Steps:
```php
// Add container debugging
class DebugContainer extends ServiceContainer
{
    public function make(string $abstract)
    {
        error_log("Resolving: {$abstract}");
        try {
            return parent::make($abstract);
        } catch (Exception $e) {
            error_log("Failed to resolve {$abstract}: " . $e->getMessage());
            throw $e;
        }
    }
}
```

### 4. **Performance Issues**

#### Problem: Page load chậm
```php
// ❌ WRONG - N+1 queries
foreach ($posts as $post) {
    $author = get_user($post->post_author); // Query for each post
}

// ✅ SOLUTION - Batch queries
class OptimizedPostService
{
    public function getPostsWithAuthors(): array
    {
        $posts = get_posts(['numberposts' => -1]);
        $authorIds = array_unique(array_column($posts, 'post_author'));

        // Single query for all authors
        $authors = get_users(['include' => $authorIds]);
        $authorsMap = array_column($authors, null, 'ID');

        foreach ($posts as $post) {
            $post->author = $authorsMap[$post->post_author] ?? null;
        }

        return $posts;
    }
}
```

#### Debug Steps:
```php
// Monitor query performance
add_action('wp_footer', function() {
    global $wpdb;
    echo "<!-- Queries: " . count($wpdb->queries) . " -->";
    echo "<!-- Query time: " . array_sum(array_column($wpdb->queries, 1)) . "s -->";
});
```

### 5. **Security Issues**

#### Problem: XSS vulnerabilities
```php
// ❌ WRONG - Unsafe output
echo $userInput; // Dangerous!

// ✅ SOLUTION - Proper escaping
class SafeRenderer
{
    public function renderUserContent(string $content): string
    {
        return wp_kses($content, [
            'p' => [],
            'br' => [],
            'strong' => [],
            'em' => [],
            'a' => ['href' => [], 'target' => []]
        ]);
    }

    public function renderAttribute(string $value): string
    {
        return esc_attr($value);
    }

    public function renderURL(string $url): string
    {
        return esc_url($url);
    }
}
```

### 6. **Template Issues**

#### Problem: Template không render
```php
// ❌ WRONG - Wrong template path
$template = 'templates/testimonial.php';

// ✅ SOLUTION - Use template engine
class TemplateRenderer
{
    public function render(string $template, array $data): string
    {
        $templatePath = $this->getTemplatePath($template);

        if (!file_exists($templatePath)) {
            throw new TemplateNotFoundException("Template not found: {$template}");
        }

        extract($data);
        ob_start();
        include $templatePath;
        return ob_get_clean();
    }

    private function getTemplatePath(string $template): string
    {
        return get_template_directory() . "/templates/{$template}.php";
    }
}
```

## 🔧 Debug Tools

### 1. **Debug Logger**
```php
class DebugLogger
{
    public function log(string $message, array $context = []): void
    {
        if (!defined('WP_DEBUG') || !WP_DEBUG) {
            return;
        }

        $logEntry = [
            'timestamp' => current_time('mysql'),
            'message' => $message,
            'context' => $context,
            'backtrace' => debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 3)
        ];

        error_log('JANKX_DEBUG: ' . json_encode($logEntry));
    }
}
```

### 2. **Performance Profiler**
```php
class PerformanceProfiler
{
    private $timers = [];
    private $memory = [];

    public function start(string $name): void
    {
        $this->timers[$name] = microtime(true);
        $this->memory[$name] = memory_get_usage();
    }

    public function end(string $name): array
    {
        if (!isset($this->timers[$name])) {
            return [];
        }

        $time = microtime(true) - $this->timers[$name];
        $memory = memory_get_usage() - $this->memory[$name];

        return [
            'time' => $time,
            'memory' => $memory
        ];
    }

    public function getReport(): array
    {
        $report = [];
        foreach ($this->timers as $name => $startTime) {
            $report[$name] = $this->end($name);
        }
        return $report;
    }
}
```

### 3. **Error Handler**
```php
class ErrorHandler
{
    public function handleError(int $errno, string $errstr, string $errfile, int $errline): bool
    {
        if (!(error_reporting() & $errno)) {
            return false;
        }

        $error = [
            'type' => $errno,
            'message' => $errstr,
            'file' => $errfile,
            'line' => $errline,
            'timestamp' => current_time('mysql')
        ];

        error_log('JANKX_ERROR: ' . json_encode($error));

        if (defined('WP_DEBUG') && WP_DEBUG) {
            throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
        }

        return true;
    }
}
```

## 🚨 Emergency Fixes

### 1. **Disable Problematic Features**
```php
// Emergency disable for production
add_action('init', function() {
    // Disable problematic blocks
    unregister_block_type('jankx/problematic-block');

    // Disable problematic scripts
    wp_dequeue_script('problematic-script');
    wp_deregister_script('problematic-script');
}, 20);
```

### 2. **Fallback Templates**
```php
// Emergency template fallback
add_filter('template_include', function($template) {
    if (is_page() && !file_exists($template)) {
        return get_template_directory() . '/templates/fallback.php';
    }
    return $template;
});
```

### 3. **Database Recovery**
```php
// Emergency database cleanup
class DatabaseRecovery
{
    public function cleanupOrphanedData(): void
    {
        global $wpdb;

        // Clean orphaned post meta
        $wpdb->query("
            DELETE pm FROM {$wpdb->postmeta} pm
            LEFT JOIN {$wpdb->posts} p ON pm.post_id = p.ID
            WHERE p.ID IS NULL
        ");

        // Clean orphaned term meta
        $wpdb->query("
            DELETE tm FROM {$wpdb->termmeta} tm
            LEFT JOIN {$wpdb->terms} t ON tm.term_id = t.term_id
            WHERE t.term_id IS NULL
        ");
    }
}
```

## 📊 Monitoring & Alerts

### 1. **Health Check**
```php
class HealthChecker
{
    public function runHealthCheck(): array
    {
        $checks = [
            'database' => $this->checkDatabase(),
            'filesystem' => $this->checkFilesystem(),
            'permissions' => $this->checkPermissions(),
            'performance' => $this->checkPerformance(),
            'security' => $this->checkSecurity(),
        ];

        $failedChecks = array_filter($checks, function($check) {
            return !$check['status'];
        });

        if (!empty($failedChecks)) {
            $this->sendAlert($failedChecks);
        }

        return $checks;
    }

    private function checkDatabase(): array
    {
        global $wpdb;

        $result = $wpdb->get_var("SELECT 1");

        return [
            'status' => $result === '1',
            'message' => $result === '1' ? 'OK' : 'Database connection failed'
        ];
    }
}
```

### 2. **Performance Monitoring**
```php
class PerformanceMonitor
{
    public function monitorPageLoad(): void
    {
        $startTime = microtime(true);
        $startMemory = memory_get_usage();

        add_action('wp_footer', function() use ($startTime, $startMemory) {
            $loadTime = microtime(true) - $startTime;
            $memoryUsed = memory_get_usage() - $startMemory;

            if ($loadTime > 2.0) {
                error_log("Slow page load: {$loadTime}s");
            }

            if ($memoryUsed > 50 * 1024 * 1024) { // 50MB
                error_log("High memory usage: " . round($memoryUsed / 1024 / 1024, 2) . "MB");
            }
        });
    }
}
```

## 🔧 Quick Fixes

### 1. **Clear All Caches**
```php
// Emergency cache clear
wp_cache_flush();
delete_transient('jankx_cache');
wp_clear_scheduled_hook('jankx_cache_cleanup');
```

### 2. **Reset Permissions**
```php
// Fix file permissions
chmod(get_template_directory() . '/assets', 0755);
chmod(get_template_directory() . '/templates', 0755);
```

### 3. **Reinstall Assets**
```php
// Rebuild assets
if (function_exists('wp_enqueue_scripts')) {
    wp_enqueue_scripts();
}
```

---

**Next**: [Best Practices](./best-practices.md) | [Testing Guidelines](./testing.md)