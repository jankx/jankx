# Jankx Gutenberg AJAX System

## Overview

Jankx Gutenberg AJAX System provides a dedicated kernel for handling AJAX requests related to Gutenberg blocks and partial hydration. This system is designed to be lightweight and focused, ensuring optimal performance for AJAX operations.

## Architecture

### Core Components

1. **GutenbergAjaxKernel** - Dedicated kernel for AJAX requests
2. **GutenbergAjaxBootstrapper** - AJAX-specific bootstrapper
3. **AjaxHandler** - Central AJAX request handler
4. **Performance Monitoring** - Real-time performance tracking

### Context Detection

The system automatically detects Gutenberg AJAX requests by checking:

```php
wp_doing_ajax() &&
(isset($_POST['action']) || isset($_GET['action'])) &&
(strpos($_POST['action'] ?? $_GET['action'] ?? '', 'jankx_gutenberg') === 0)
```

## AJAX Endpoints

### 1. Block Rendering

**Endpoint:** `wp_ajax_jankx_gutenberg_render_block`

**Purpose:** Render blocks dynamically via AJAX

**Request:**
```javascript
fetch(ajaxurl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
        action: 'jankx_gutenberg_render_block',
        nonce: jankxGutenberg.nonce,
        block_name: 'jankx/testimonial',
        attributes: JSON.stringify(attributes),
        content: content
    })
});
```

**Response:**
```json
{
    "success": true,
    "data": {
        "html": "<div class=\"jankx-testimonial\">...</div>",
        "block_name": "jankx/testimonial",
        "attributes": {...}
    }
}
```

### 2. Layout Loading

**Endpoint:** `wp_ajax_jankx_gutenberg_load_layout`

**Purpose:** Load layouts for partial hydration

**Request:**
```javascript
fetch(ajaxurl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
        action: 'jankx_gutenberg_load_layout',
        nonce: jankxGutenberg.nonce,
        layout_name: 'hero-section',
        layout_data: JSON.stringify(layoutData)
    })
});
```

**Response:**
```json
{
    "success": true,
    "data": {
        "html": "<div class=\"jankx-layout-hero\">...</div>",
        "layout_name": "hero-section",
        "performance": {
            "render_time": 0.045,
            "memory_usage": 2048576
        }
    }
}
```

### 3. Block Data Retrieval

**Endpoint:** `wp_ajax_jankx_gutenberg_get_block_data`

**Purpose:** Get block metadata and configuration

**Request:**
```javascript
fetch(ajaxurl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
        action: 'jankx_gutenberg_get_block_data',
        nonce: jankxGutenberg.nonce,
        block_name: 'jankx/testimonial'
    })
});
```

**Response:**
```json
{
    "success": true,
    "data": {
        "block_data": {
            "name": "jankx/testimonial",
            "title": "Testimonial",
            "description": "Display customer testimonials",
            "category": "jankx-blocks",
            "icon": "format-quote",
            "keywords": ["testimonial", "quote", "review"],
            "supports": {...}
        }
    }
}
```

### 4. Block Options Retrieval

**Endpoint:** `wp_ajax_jankx_gutenberg_get_block_options`

**Purpose:** Get block-specific options and settings

**Request:**
```javascript
fetch(ajaxurl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
        action: 'jankx_gutenberg_get_block_options',
        nonce: jankxGutenberg.nonce,
        block_name: 'jankx/testimonial'
    })
});
```

**Response:**
```json
{
    "success": true,
    "data": {
        "options": {
            "style": {
                "type": "select",
                "label": "Style",
                "default": "default",
                "options": {
                    "default": "Default",
                    "card": "Card",
                    "minimal": "Minimal",
                    "modern": "Modern"
                }
            },
            "alignment": {
                "type": "select",
                "label": "Alignment",
                "default": "center",
                "options": {
                    "left": "Left",
                    "center": "Center",
                    "right": "Right"
                }
            }
        }
    }
}
```

### 5. Performance Monitoring

**Endpoint:** `wp_ajax_jankx_gutenberg_performance_stats`

**Purpose:** Get real-time performance statistics

**Request:**
```javascript
fetch(ajaxurl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
        action: 'jankx_gutenberg_performance_stats',
        nonce: jankxGutenberg.nonce
    })
});
```

**Response:**
```json
{
    "success": true,
    "data": {
        "stats": {
            "memory_usage": 2048576,
            "peak_memory": 3145728,
            "load_time": 0.123,
            "blocks_loaded": 5,
            "layouts_loaded": 3,
            "timestamp": 1640995200
        }
    }
}
```

## Security Features

### Nonce Verification

All AJAX endpoints require valid nonce verification:

```php
if (!wp_verify_nonce($_POST['nonce'] ?? '', 'jankx_gutenberg_nonce')) {
    wp_die('Security check failed', 'Security Error', ['response' => 403]);
}
```

### Input Sanitization

All input data is properly sanitized:

```php
$block_name = sanitize_text_field($_POST['block_name'] ?? '');
$attributes = json_decode(stripslashes($_POST['attributes'] ?? '{}'), true);
$content = wp_kses_post($_POST['content'] ?? '');
```

### Error Handling

Comprehensive error handling with logging:

```php
try {
    // Process request
    $result = $this->processRequest();
    wp_send_json_success($result);
} catch (\Exception $e) {
    Logger::error('AJAX request failed', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
    wp_send_json_error([
        'message' => 'Request failed',
        'error' => $e->getMessage()
    ]);
}
```

## Performance Optimization

### Lightweight Kernel

The GutenbergAjaxKernel is designed to be minimal:

- Only loads essential services
- No frontend assets
- Minimal database queries
- Optimized for speed

### Caching Strategy

```php
// Cache block rendering results
$cache_key = 'jankx_block_' . md5($block_name . serialize($attributes));
$cached_result = wp_cache_get($cache_key);

if ($cached_result !== false) {
    wp_send_json_success($cached_result);
}

// Render and cache
$result = $block_class::render($attributes, $content);
wp_cache_set($cache_key, $result, '', 3600); // Cache for 1 hour
```

### Memory Management

```php
// Monitor memory usage
$memory_limit = ini_get('memory_limit');
$memory_usage = memory_get_usage(true);

if ($memory_usage > 0.8 * $this->parseMemoryLimit($memory_limit)) {
    Logger::warning('High memory usage detected', [
        'usage' => $memory_usage,
        'limit' => $memory_limit
    ]);
}
```

## Integration with Frontend

### JavaScript Integration

```javascript
class JankxGutenbergAjax {
    constructor() {
        this.ajaxUrl = jankxGutenberg.ajaxUrl;
        this.nonce = jankxGutenberg.nonce;
    }

    async renderBlock(blockName, attributes, content) {
        try {
            const response = await fetch(this.ajaxUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'jankx_gutenberg_render_block',
                    nonce: this.nonce,
                    block_name: blockName,
                    attributes: JSON.stringify(attributes),
                    content: content
                })
            });

            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Block rendering failed:', error);
            return null;
        }
    }

    async loadLayout(layoutName, layoutData) {
        try {
            const response = await fetch(this.ajaxUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'jankx_gutenberg_load_layout',
                    nonce: this.nonce,
                    layout_name: layoutName,
                    layout_data: JSON.stringify(layoutData)
                })
            });

            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Layout loading failed:', error);
            return null;
        }
    }

    async getPerformanceStats() {
        try {
            const response = await fetch(this.ajaxUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'jankx_gutenberg_performance_stats',
                    nonce: this.nonce
                })
            });

            const data = await response.json();
            return data.success ? data.data.stats : null;
        } catch (error) {
            console.error('Performance stats failed:', error);
            return null;
        }
    }
}

// Initialize
window.JankxGutenbergAjax = new JankxGutenbergAjax();
```

### Partial Hydration Integration

```javascript
class PartialHydrationManager {
    constructor() {
        this.ajax = window.JankxGutenbergAjax;
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            { threshold: 0.1 }
        );
    }

    async handleIntersection(entries) {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const block = entry.target;
                const blockName = block.dataset.blockName;
                const attributes = JSON.parse(block.dataset.attributes || '{}');
                const content = block.dataset.content || '';

                // Show loading state
                block.classList.add('loading');

                // Render block via AJAX
                const result = await this.ajax.renderBlock(blockName, attributes, content);

                if (result) {
                    // Replace placeholder with rendered content
                    block.innerHTML = result.html;
                    block.classList.remove('loading');
                    block.classList.add('loaded');

                    // Stop observing
                    this.observer.unobserve(block);
                }
            }
        }
    }

    observeBlocks() {
        const blocks = document.querySelectorAll('[data-block-name]');
        blocks.forEach(block => this.observer.observe(block));
    }
}
```

## Monitoring and Debugging

### Logging

All AJAX operations are logged:

```php
Logger::debug('AJAX request processed', [
    'action' => $_POST['action'],
    'block_name' => $block_name,
    'response_time' => microtime(true) - $start_time,
    'memory_usage' => memory_get_usage(true)
]);
```

### Performance Monitoring

```php
// Track performance metrics
$metrics = [
    'request_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'],
    'memory_usage' => memory_get_usage(true),
    'peak_memory' => memory_get_peak_usage(true),
    'blocks_rendered' => $this->getRenderedBlocksCount(),
    'layouts_loaded' => $this->getLoadedLayoutsCount()
];

// Store metrics for analysis
$this->storeMetrics($metrics);
```

### Error Tracking

```php
// Track errors for debugging
add_action('wp_ajax_jankx_gutenberg_error', function() {
    $error_data = [
        'message' => $_POST['message'] ?? '',
        'stack' => $_POST['stack'] ?? '',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
        'url' => $_POST['url'] ?? '',
        'timestamp' => time()
    ];

    Logger::error('Frontend error reported', $error_data);
});
```

## Best Practices

### 1. Request Optimization

- **Batch Requests** - Combine multiple requests when possible
- **Caching** - Cache frequently requested data
- **Compression** - Use gzip compression for responses
- **Minimal Payload** - Send only necessary data

### 2. Error Handling

- **Graceful Degradation** - Provide fallbacks for failed requests
- **User Feedback** - Show loading states and error messages
- **Retry Logic** - Implement automatic retry for failed requests
- **Error Logging** - Log all errors for debugging

### 3. Security

- **Nonce Verification** - Always verify nonces
- **Input Validation** - Validate all input data
- **Output Sanitization** - Sanitize all output
- **Rate Limiting** - Implement rate limiting for AJAX endpoints

### 4. Performance

- **Async Processing** - Use async/await for better performance
- **Memory Management** - Monitor and optimize memory usage
- **Database Optimization** - Minimize database queries
- **Asset Optimization** - Load only necessary assets

## Configuration

### AJAX Settings

```php
// In your theme's functions.php or plugin
add_action('wp_enqueue_scripts', function() {
    wp_localize_script('jankx-gutenberg', 'jankxGutenberg', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('jankx_gutenberg_nonce'),
        'timeout' => 30000, // 30 seconds
        'retryAttempts' => 3,
        'debug' => defined('WP_DEBUG') && WP_DEBUG
    ]);
});
```

### Performance Settings

```php
// Configure performance limits
define('JANKX_AJAX_MEMORY_LIMIT', '256M');
define('JANKX_AJAX_TIMEOUT', 30);
define('JANKX_AJAX_MAX_REQUESTS_PER_MINUTE', 60);
```

## Troubleshooting

### Common Issues

1. **Nonce Verification Failed**
   - Check if nonce is properly generated and passed
   - Verify nonce lifetime and regeneration

2. **Memory Limit Exceeded**
   - Increase PHP memory limit
   - Optimize block rendering
   - Implement caching

3. **Timeout Issues**
   - Increase AJAX timeout
   - Optimize database queries
   - Use async processing

4. **CORS Issues**
   - Configure proper CORS headers
   - Check domain restrictions
   - Verify SSL certificates

### Debug Mode

Enable debug mode for detailed logging:

```php
// In wp-config.php
define('JANKX_AJAX_DEBUG', true);
define('JANKX_AJAX_LOG_LEVEL', 'debug');
```

## Future Enhancements

1. **WebSocket Support** - Real-time communication
2. **GraphQL Integration** - More efficient data fetching
3. **Service Worker** - Offline support and caching
4. **Progressive Enhancement** - Better fallback support
5. **Analytics Integration** - Usage tracking and analytics
6. **A/B Testing** - Test different AJAX strategies
7. **Load Balancing** - Distribute AJAX load
8. **CDN Integration** - Faster global delivery

## Support

For support and questions:

1. **Documentation** - Check this documentation first
2. **Error Logs** - Review error logs for issues
3. **Performance Monitoring** - Use built-in monitoring tools
4. **Community Forum** - Ask questions and share solutions

## Related Documentation

- [Gutenberg Blocks](./GUTENBERG_BLOCKS.md)
- [Gutenberg Layout System](./GUTENBERG_LAYOUT_SYSTEM.md)
- [Partial Hydration System](./PARTIAL_HYDRATION_SYSTEM.md)
- [Performance Optimization](./PERFORMANCE.md)