# API Reference - Jankx Debug System

## Tổng quan

API Reference cho Jankx Debug System cung cấp thông tin chi tiết về các endpoints, methods, và data structures.

## AJAX Endpoints

### Get Debug Information

**Endpoint**: `POST /wp-admin/admin-ajax.php`
**Action**: `bookix_get_block_debug_info`
**Permissions**: `manage_options`

**Request**:
```php
$data = [
    'action' => 'bookix_get_block_debug_info'
];
```

**Response**: HTML debug panel

**Example**:
```javascript
fetch('/wp-admin/admin-ajax.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=bookix_get_block_debug_info'
})
.then(response => response.text())
.then(html => {
    // Insert debug panel into page
    document.body.insertAdjacentHTML('beforeend', html);
});
```

### Clear Debug Cache

**Endpoint**: `POST /wp-admin/admin-ajax.php`
**Action**: `bookix_clear_debug_cache`
**Permissions**: `manage_options`

**Request**:
```php
$data = [
    'action' => 'bookix_clear_debug_cache'
];
```

**Response**: `'success'` or error message

**Example**:
```javascript
fetch('/wp-admin/admin-ajax.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=bookix_clear_debug_cache'
})
.then(response => response.text())
.then(result => {
    if (result === 'success') {
        alert('Debug cache cleared successfully!');
    }
});
```

## PHP Classes & Methods

### DebugInfo Class

#### Constructor
```php
public function __construct(
    DebugInfoService $debugInfoService,
    QueryCountService $queryCountService,
    CacheInfoService $cacheInfoService,
    GutenbergBlocksService $gutenbergBlocksService,
    PluginDebugService $pluginDebugService,
    DebugInfoRenderer $renderer
)
```

#### Core Methods

##### init()
```php
public function init(): void
```
Khởi tạo debug system và bắt đầu tracking.

##### displayDebugInfo()
```php
public function displayDebugInfo(): void
```
Hiển thị debug panel trong footer.

##### getDebugInfo()
```php
public function getDebugInfo(): array
```
Lấy debug data hiện tại.

**Returns**: Array với debug information

##### addPluginDebugInfo()
```php
public function addPluginDebugInfo(string $pluginName, string $info): void
```
Thêm debug information từ plugin.

**Parameters**:
- `$pluginName` (string): Tên plugin
- `$info` (string): Debug information

##### initAdminBarDebugInfo()
```php
public function initAdminBarDebugInfo(): void
```
Khởi tạo admin bar debug functionality.

#### Cache Management Methods

##### addCachePreventionHeaders()
```php
public function addCachePreventionHeaders(): void
```
Thêm headers ngăn chặn cache.

##### preventCachingByPlugins()
```php
public function preventCachingByPlugins(): void
```
Ngăn chặn cache từ các plugin tối ưu tốc độ.

##### clearCachedDebugData()
```php
public function clearCachedDebugData(): void
```
Xóa cached debug data.

#### AJAX Handlers

##### handleAjaxRequest()
```php
public function handleAjaxRequest(): void
```
Xử lý AJAX request cho debug information.

##### handleClearCacheRequest()
```php
public function handleClearCacheRequest(): void
```
Xử lý AJAX request để clear cache.

## Data Structures

### Debug Data Array

```php
$debugData = [
    'response_time' => 0.1234,           // float - seconds
    'memory_usage' => 47185920,          // int - bytes
    'memory_limit' => 268435456,         // int - bytes
    'query_count' => 156,                // int
    'cache_info' => [                    // array
        'object_cache' => [
            'enabled' => true,
            'type' => 'Redis',
            'stats' => [
                'hit_rate' => 85.3,
                'hits' => 1234,
                'misses' => 212
            ]
        ],
        'transients' => [
            'count' => 45,
            'size' => 1024000
        ],
        'plugins' => [
            'wp-rocket' => ['status' => 'active'],
            'w3-total-cache' => ['status' => 'inactive']
        ]
    ],
    'gutenberg_blocks' => [              // array
        'total_blocks' => 12,
        'unique_block_types' => 8,
        'block_types' => [
            'core/paragraph' => 5,
            'core/heading' => 3,
            'core/image' => 2,
            'core/gallery' => 1,
            'custom/block' => 1
        ]
    ],
    'plugin_debug' => [                  // array
        'my-plugin' => 'Custom debug info',
        'another-plugin' => 'More debug data'
    ],
    'cache_comparison' => [              // array
        'has_cached_data' => true,
        'response_time' => [
            'current' => 0.1234,
            'cached' => 0.0456,
            'difference' => 0.0778,
            'improvement' => 63.0
        ],
        'memory_usage' => [
            'current' => 47185920,
            'cached' => 13421772,
            'difference' => 33764148,
            'improvement' => 71.7
        ],
        'query_count' => [
            'current' => 156,
            'cached' => 23,
            'difference' => 133,
            'improvement' => 85.3
        ]
    ]
];
```

### Cache Data Structure

```php
$cacheData = [
    'response_time' => 0.1234,
    'memory_usage' => 47185920,
    'query_count' => 156,
    'timestamp' => 1640995200
];
```

## Service Classes

### DebugInfoService

```php
class DebugInfoService {
    public function startTracking(): void
    public function getResponseTime(): float
    public function getMemoryUsage(): int
    public function getMemoryLimit(): int
}
```

### QueryCountService

```php
class QueryCountService {
    public function startTracking(): void
    public function getQueryCount(): int
}
```

### CacheInfoService

```php
class CacheInfoService {
    public function captureInfo(): void
    public function getCacheInfo(): array
}
```

### GutenbergBlocksService

```php
class GutenbergBlocksService {
    public function captureInfo(): void
    public function forceRefreshBlocksInfo(): array
}
```

### PluginDebugService

```php
class PluginDebugService {
    public function captureInfo(): void
    public function getPluginDebugInfo(): array
    public function addDebugInfo(string $pluginName, string $info): void
}
```

## Renderer Classes

### DebugInfoRenderer

```php
class DebugInfoRenderer implements DebugInfoRendererInterface {
    public function render(array $debugData): string
    private function generateDebugHtml(array $debugData): string
    private function renderCacheInfo(array $cacheInfo): string
    private function renderGutenbergBlocksInfo(array $gutenbergBlocks): string
    private function renderPluginDebugInfo(array $pluginDebugInfo): string
    private function renderCacheComparisonInfo(array $cacheComparison): string
    private function renderStyles(): string
    private function renderScripts(): string
    private function formatBytes(int $bytes, int $precision = 2): string
    private function calculateMemoryUsagePercentage(int $usage, int $limit): float
}
```

## Configuration Constants

### Debug Mode
```php
define('JANKX_DEBUG', true);
```

### Logging
```php
define('JANKX_LOG_ALL', true);
```

### Cache Settings
```php
define('JANKX_DEBUG_CACHE_EXPIRY', HOUR_IN_SECONDS);
define('JANKX_DEBUG_AUTO_HIDE', 10000); // milliseconds
```

### Performance Thresholds
```php
define('JANKX_RESPONSE_TIME_THRESHOLD', 2.0);
define('JANKX_MEMORY_USAGE_THRESHOLD', 80);
define('JANKX_QUERY_COUNT_THRESHOLD', 100);
```

## WordPress Hooks

### Actions
```php
// Debug panel display
add_action('wp_footer', [$debugInfo, 'displayDebugInfo'], 999);
add_action('admin_footer', [$debugInfo, 'displayDebugInfo'], 999);

// Cache prevention
add_action('wp_head', [$debugInfo, 'addCachePreventionHeaders'], 1);
add_action('admin_head', [$debugInfo, 'addCachePreventionHeaders'], 1);
add_action('init', [$debugInfo, 'preventCachingByPlugins']);

// Admin bar
add_action('admin_bar_menu', [$debugInfo, 'addAdminBarMenu'], 999);
add_action('admin_footer', [$debugInfo, 'addAdminBarJavaScript']);

// AJAX handlers
add_action('wp_ajax_bookix_get_block_debug_info', [$debugInfo, 'handleAjaxRequest']);
add_action('wp_ajax_bookix_clear_debug_cache', [$debugInfo, 'handleClearCacheRequest']);
```

### Filters
```php
// Cache prevention filters
add_filter('rocket_override_donotcachepage', '__return_true');
add_filter('w3tc_can_cache', '__return_false');
add_filter('autoptimize_filter_js_exclude', 'addJankxDebugToExclude');
```

## Error Handling

### Exception Handling
```php
try {
    $debugData = $this->getDebugInfo();
    $html = $this->renderer->render($debugData);
    echo $html;
} catch (\Exception $e) {
    Logger::error('Debug system error', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
    wp_die('Debug system error');
}
```

### Permission Checks
```php
if (!current_user_can('manage_options')) {
    Logger::warning('Unauthorized debug access', [
        'user_id' => get_current_user_id()
    ]);
    wp_die('Unauthorized');
}
```

## JavaScript API

### Global Functions
```javascript
// Show debug panel
window.bookix_show_block_debug();

// Clear debug cache
window.bookix_clear_debug_cache();

// Toggle debug panel
window.toggleJankxDebug();
```

### Event Listeners
```javascript
// Admin bar button click
document.querySelector('#wp-admin-bar-block-debug-info a')
    .addEventListener('click', function(e) {
        e.preventDefault();
        bookix_show_block_debug();
    });

// Debug panel close
document.querySelector('.jankx-debug-close')
    .addEventListener('click', function() {
        toggleJankxDebug();
    });
```

## Cache Keys

### WordPress Object Cache
```php
// Debug data cache key
$cacheKey = 'jankx_debug_cached_' . md5($_SERVER['REQUEST_URI'] ?? '');

// Cache group
$cacheGroup = 'jankx_debug';

// Cache expiry
$cacheExpiry = HOUR_IN_SECONDS;
```

## Performance Impact

### Memory Usage
- **Debug System**: ~2-5 MB additional memory
- **Cache Prevention**: Minimal overhead
- **AJAX Requests**: ~50-100 KB per request

### Response Time
- **Debug Panel**: ~10-50ms additional time
- **Cache Prevention**: ~1-5ms overhead
- **AJAX Loading**: ~100-500ms for full debug data

## Best Practices

### 1. Production Usage
```php
// Only enable in development
if (defined('WP_DEBUG') && WP_DEBUG) {
    define('JANKX_DEBUG', true);
}
```

### 2. Performance Monitoring
```php
// Monitor debug system performance
$startTime = microtime(true);
$debugInfo->displayDebugInfo();
$debugTime = microtime(true) - $startTime;

if ($debugTime > 0.1) {
    Logger::warning('Debug system slow', ['time' => $debugTime]);
}
```

### 3. Error Handling
```php
// Graceful error handling
try {
    $debugInfo->init();
} catch (\Exception $e) {
    // Log error but don't break site
    Logger::error('Debug init failed', ['error' => $e->getMessage()]);
}
```

## Troubleshooting

### Common Issues

1. **Debug panel không hiển thị**
   ```php
   // Check debug mode
   if (!defined('JANKX_DEBUG') || !JANKX_DEBUG) {
       echo 'Debug mode not enabled';
   }
   ```

2. **AJAX errors**
   ```php
   // Check permissions
   if (!current_user_can('manage_options')) {
       echo 'Insufficient permissions';
   }
   ```

3. **Cache prevention không hoạt động**
   ```php
   // Check if plugin is active
   if (defined('WP_ROCKET_VERSION')) {
       echo 'WP Rocket detected';
   }
   ```

### Debug Logs
```php
// Enable detailed logging
Logger::debug('Debug system initialized');
Logger::debug('Cache prevention applied');
Logger::debug('Performance data collected');
```