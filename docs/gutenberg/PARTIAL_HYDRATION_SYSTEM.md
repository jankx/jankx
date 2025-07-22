# Jankx Partial Hydration System

## Overview

Jankx Partial Hydration System provides lazy loading and AJAX loading capabilities for Gutenberg layouts. It improves performance by loading layouts only when they become visible in the viewport, reducing initial page load time.

## Architecture

### Core Components

1. **PartialHydrationManager** - Main JavaScript class for managing lazy loading
2. **PerformanceMonitor** - Tracks loading performance and metrics
3. **AjaxHandler** - PHP class for handling AJAX requests
4. **CSS Animations** - Smooth loading animations and skeleton screens

### Key Features

- **Intersection Observer** - Modern API for viewport detection
- **Fallback Support** - Scroll-based detection for older browsers
- **Error Handling** - Retry mechanism and error states
- **Performance Monitoring** - Track load times and success rates
- **Skeleton Loading** - Placeholder content while loading
- **Responsive Design** - Mobile-optimized loading states

## JavaScript Implementation

### PartialHydrationManager

```javascript
// Initialize the manager
const manager = new PartialHydrationManager();

// Load a specific layout
manager.loadLayout(element);

// Get statistics
const stats = manager.getStats();

// Force load all layouts
manager.forceLoadAll();
```

### Configuration

```javascript
const CONFIG = {
    // Selectors
    selectors: {
        lazyLayout: '.jankx-layout-lazy',
        loadingPlaceholder: '.jankx-layout-placeholder',
        partialHydration: '.jankx-partial-hydration',
        loadingSpinner: '.jankx-loading-spinner',
        errorContainer: '.jankx-error-container'
    },

    // Classes
    classes: {
        loaded: 'jankx-layout-loaded',
        loading: 'jankx-layout-loading',
        error: 'jankx-layout-error',
        hidden: 'jankx-layout-hidden'
    },

    // Intersection Observer
    observer: {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    },

    // AJAX
    ajax: {
        timeout: 10000,
        retryAttempts: 3,
        retryDelay: 1000
    }
};
```

### Loading Process

1. **Detection** - Intersection Observer detects when layout enters viewport
2. **Request** - AJAX request sent to server with layout data
3. **Processing** - Server renders layout with template system
4. **Response** - HTML, CSS, and JavaScript returned
5. **Injection** - Content injected into page with animations
6. **Cleanup** - Loading states removed, observer disconnected

## PHP Implementation

### AjaxHandler

```php
// Initialize AJAX handlers
AjaxHandler::init();

// Handle layout loading
AjaxHandler::loadLayout();

// Get layout options
AjaxHandler::getLayoutOptions();

// Validate layout settings
AjaxHandler::validateLayout();
```

### AJAX Endpoints

- `jankx_load_layout` - Load layout content
- `jankx_get_layout_options` - Get layout options
- `jankx_validate_layout` - Validate layout settings
- `jankx_get_layout_stats` - Get performance statistics

## CSS Implementation

### Loading States

```css
.jankx-layout-lazy {
    position: relative;
    min-height: 200px;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.jankx-layout-lazy.jankx-layout-loaded {
    opacity: 1;
    transform: translateY(0);
}

.jankx-layout-lazy.jankx-layout-loading {
    opacity: 0.7;
}
```

### Skeleton Loading

```css
.jankx-layout-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: jankx-loading-shimmer 1.5s infinite;
    border-radius: 8px;
    margin: 20px 0;
}

@keyframes jankx-loading-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
```

### Error States

```css
.jankx-layout-error {
    background: #fff5f5;
    border: 1px solid #fed7d7;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

.jankx-retry-button {
    background: #007cba;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s ease;
}
```

## Usage Examples

### Basic Implementation

```php
// In LayoutManager.php
protected function renderPartialHydrationLayout($layoutName, $settings, $content)
{
    $layoutId = uniqid('jankx-layout-');

    return sprintf(
        '<div class="jankx-layout-lazy" data-layout="%s" data-settings="%s" id="%s">
            <div class="jankx-layout-placeholder">
                <div class="jankx-loading-spinner"></div>
            </div>
        </div>',
        esc_attr($layoutName),
        esc_attr(json_encode($settings)),
        esc_attr($layoutId)
    );
}
```

### JavaScript Integration

```javascript
// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Partial hydration is automatically initialized
    console.log('Jankx Partial Hydration ready');

    // Access the manager
    const manager = window.JankxPartialHydration.manager;

    // Get statistics
    const stats = manager.getStats();
    console.log('Loaded layouts:', stats.loaded);

    // Get performance metrics
    const metrics = window.JankxPartialHydration.getMetrics();
    console.log('Average load time:', metrics.averageLoadTime);
});
```

### Custom Loading States

```javascript
// Custom loading state
const customLayout = document.querySelector('.custom-layout');
if (customLayout) {
    customLayout.classList.add('jankx-layout-loading');

    // Add custom loading content
    customLayout.innerHTML = `
        <div class="custom-loading">
            <div class="custom-spinner"></div>
            <p>Loading custom content...</p>
        </div>
    `;
}
```

## Performance Features

### Caching

```php
// Cache layout rendering
$cacheKey = 'jankx_layout_' . md5($layoutName . serialize($settings));
$cachedHtml = wp_cache_get($cacheKey);

if ($cachedHtml === false) {
    $cachedHtml = Template::render($layoutName, $settings, $content);
    wp_cache_set($cacheKey, $cachedHtml, '', 3600);
}

echo $cachedHtml;
```

### Lazy Loading

```javascript
// Lazy load with custom threshold
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadLayout(entry.target);
        }
    });
}, {
    rootMargin: '100px',
    threshold: 0.1
});
```

### Performance Monitoring

```javascript
// Monitor loading performance
const monitor = new PerformanceMonitor(manager);

// Get metrics
const metrics = monitor.getMetrics();
console.log('Performance metrics:', metrics);

// Track custom events
document.addEventListener('jankx:layout:loaded', (event) => {
    console.log('Layout loaded:', event.detail.layout);
});
```

## Error Handling

### Retry Mechanism

```javascript
// Automatic retry on failure
const retryLoad = (element, maxAttempts = 3) => {
    let attempts = 0;

    const attemptLoad = () => {
        attempts++;

        loadLayout(element).catch(error => {
            if (attempts < maxAttempts) {
                setTimeout(attemptLoad, 1000 * attempts);
            } else {
                showError(element, error);
            }
        });
    };

    attemptLoad();
};
```

### Error States

```javascript
// Handle loading errors
const handleError = (element, message) => {
    element.classList.add('jankx-layout-error');

    const errorHtml = `
        <div class="jankx-layout-error">
            <div class="jankx-error-message">
                <p>Failed to load layout: ${message}</p>
                <button class="jankx-retry-button" data-jankx-retry>
                    Try Again
                </button>
            </div>
        </div>
    `;

    element.innerHTML = errorHtml;
};
```

## Accessibility Features

### Screen Reader Support

```css
/* Screen reader only content */
.jankx-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* Loading announcement */
.jankx-loading-announcement {
    @extend .jankx-sr-only;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
    .jankx-layout-lazy {
        transition: none;
    }

    .jankx-layout-placeholder {
        animation: none;
    }

    .jankx-loading-spinner {
        animation: none;
    }
}
```

## Browser Support

### Modern Browsers

- **Intersection Observer** - Native support
- **Fetch API** - Modern AJAX requests
- **CSS Grid/Flexbox** - Layout support
- **ES6+ Features** - Modern JavaScript

### Fallback Support

```javascript
// Fallback for older browsers
if (!window.IntersectionObserver) {
    // Use scroll events
    setupScrollFallback();
}

// Fallback for fetch
if (!window.fetch) {
    // Use XMLHttpRequest
    setupXHRFallback();
}
```

## Configuration Options

### WordPress Integration

```php
// Add to functions.php
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_script('jankx-partial-hydration');
    wp_enqueue_style('jankx-partial-hydration');

    wp_localize_script('jankx-partial-hydration', 'jankxPartialHydration', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('jankx_partial_hydration'),
        'debug' => WP_DEBUG,
        'strings' => [
            'loading' => __('Loading...', 'jankx'),
            'error' => __('Error loading layout', 'jankx'),
            'retry' => __('Try Again', 'jankx')
        ]
    ]);
});
```

### Custom Configuration

```javascript
// Override default configuration
window.jankxPartialHydrationConfig = {
    observer: {
        rootMargin: '100px',
        threshold: 0.2
    },
    ajax: {
        timeout: 15000,
        retryAttempts: 5
    },
    animation: {
        duration: 500,
        easing: 'ease-out'
    }
};
```

## Best Practices

### 1. Performance Optimization

- Use skeleton screens for better perceived performance
- Implement proper caching strategies
- Monitor and optimize load times
- Use CDN for static assets

### 2. Error Handling

- Provide meaningful error messages
- Implement retry mechanisms
- Log errors for debugging
- Graceful degradation

### 3. Accessibility

- Support screen readers
- Respect reduced motion preferences
- Provide keyboard navigation
- Use semantic HTML

### 4. Mobile Optimization

- Optimize for mobile networks
- Use appropriate image sizes
- Implement touch-friendly interactions
- Test on various devices

## Future Enhancements

1. **Service Worker Integration** - Offline support and caching
2. **Progressive Loading** - Load critical content first
3. **Predictive Loading** - Preload based on user behavior
4. **Analytics Integration** - Track loading performance
5. **A/B Testing** - Test different loading strategies