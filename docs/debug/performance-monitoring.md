# Performance Monitoring - Jankx Debug System

## Tổng quan

Performance Monitoring trong Jankx Debug System cung cấp các metrics chi tiết để theo dõi hiệu suất WordPress site.

## Metrics được theo dõi

### 1. Response Time
- **Đo lường**: Thời gian từ request đến response hoàn thành
- **Đơn vị**: Giây (với độ chính xác 4 chữ số thập phân)
- **Ví dụ**: `0.1234s`

### 2. Memory Usage
- **Đo lường**: Bộ nhớ PHP đã sử dụng
- **Đơn vị**: Bytes (được format thành KB, MB, GB)
- **Ví dụ**: `45.2 MB`

### 3. Memory Limit
- **Đo lường**: Giới hạn bộ nhớ PHP
- **Đơn vị**: Bytes
- **Ví dụ**: `256 MB`

### 4. Memory Usage Percentage
- **Tính toán**: `(Memory Usage / Memory Limit) * 100`
- **Đơn vị**: Phần trăm
- **Ví dụ**: `17.7%`

### 5. Database Queries
- **Đo lường**: Số lượng SQL queries được thực thi
- **Đơn vị**: Count
- **Ví dụ**: `156 queries`

## Cách hoạt động

### Data Collection

```php
// DebugInfoService tracks performance
class DebugInfoService {
    private $startTime;
    private $startMemory;

    public function startTracking() {
        $this->startTime = microtime(true);
        $this->startMemory = memory_get_usage();
    }

    public function getResponseTime() {
        return microtime(true) - $this->startTime;
    }

    public function getMemoryUsage() {
        return memory_get_usage() - $this->startMemory;
    }
}
```

### Query Counting

```php
// QueryCountService monitors database
class QueryCountService {
    private $queryCount = 0;

    public function startTracking() {
        add_filter('query', [$this, 'countQuery']);
    }

    public function countQuery($query) {
        $this->queryCount++;
        return $query;
    }
}
```

## Hiển thị Performance Data

### Frontend Display

```html
<div class="jankx-debug-section">
    <div class="jankx-debug-section-title">⚡ Performance Info</div>
    <ul class="jankx-debug-list">
        <li><strong>Response Time:</strong> 0.1234s</li>
        <li><strong>Memory Usage:</strong> 45.2 MB</li>
        <li><strong>Memory Limit:</strong> 256 MB</li>
        <li><strong>Memory Usage %:</strong> 17.7%</li>
    </ul>
</div>
```

### Cache Comparison

```html
<div class="jankx-debug-section">
    <div class="jankx-debug-section-title">⚡ Cache vs No-Cache Comparison</div>
    <ul class="jankx-debug-list">
        <li><strong>Response Time:</strong></li>
        <li><ul class="jankx-debug-sublist">
            <li>Current: 0.1234s</li>
            <li>Cached: 0.0456s</li>
            <li>Difference: +0.0778s</li>
            <li>Improvement: -63.0%</li>
        </ul></li>
    </ul>
</div>
```

## Performance Thresholds

### Memory Usage Warnings

```php
// Memory usage thresholds
$memoryUsagePercent = ($memoryUsage / $memoryLimit) * 100;

if ($memoryUsagePercent > 80) {
    // Critical: Memory usage too high
    $status = 'critical';
} elseif ($memoryUsagePercent > 60) {
    // Warning: Memory usage high
    $status = 'warning';
} else {
    // Normal: Memory usage OK
    $status = 'normal';
}
```

### Response Time Thresholds

```php
// Response time thresholds
if ($responseTime > 2.0) {
    // Critical: Very slow response
    $status = 'critical';
} elseif ($responseTime > 1.0) {
    // Warning: Slow response
    $status = 'warning';
} else {
    // Normal: Good response time
    $status = 'normal';
}
```

## Real-time Monitoring

### AJAX Updates

```javascript
// Real-time performance monitoring
function updatePerformanceData() {
    fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=bookix_get_block_debug_info'
    })
    .then(response => response.text())
    .then(html => {
        // Update debug panel with new data
        updateDebugPanel(html);
    });
}

// Auto-refresh every 30 seconds
setInterval(updatePerformanceData, 30000);
```

### Continuous Monitoring

```php
// Continuous performance tracking
class PerformanceTracker {
    private $metrics = [];

    public function track($metric, $value) {
        $this->metrics[$metric][] = [
            'value' => $value,
            'timestamp' => microtime(true)
        ];
    }

    public function getAverage($metric) {
        $values = array_column($this->metrics[$metric], 'value');
        return array_sum($values) / count($values);
    }
}
```

## Performance Optimization

### Memory Optimization

```php
// Memory optimization tips
class MemoryOptimizer {
    public function optimize() {
        // Clear unnecessary variables
        unset($unusedVariables);

        // Force garbage collection
        gc_collect_cycles();

        // Clear object cache if needed
        if (memory_get_usage() > $this->threshold) {
            wp_cache_flush();
        }
    }
}
```

### Query Optimization

```php
// Query optimization
class QueryOptimizer {
    public function optimize() {
        // Use object caching
        $data = wp_cache_get('key', 'group');
        if ($data === false) {
            $data = $this->expensiveQuery();
            wp_cache_set('key', $data, 'group', HOUR_IN_SECONDS);
        }

        // Limit queries
        add_filter('posts_pre_query', [$this, 'limitQueries']);
    }
}
```

## Performance Reports

### Daily Report

```php
// Generate daily performance report
class PerformanceReporter {
    public function generateDailyReport() {
        $report = [
            'date' => date('Y-m-d'),
            'average_response_time' => $this->getAverageResponseTime(),
            'peak_memory_usage' => $this->getPeakMemoryUsage(),
            'total_queries' => $this->getTotalQueries(),
            'cache_hit_rate' => $this->getCacheHitRate()
        ];

        return $report;
    }
}
```

### Performance Alerts

```php
// Performance alerts
class PerformanceAlerts {
    public function checkAlerts() {
        $alerts = [];

        if ($this->responseTime > 2.0) {
            $alerts[] = 'Response time is too slow: ' . $this->responseTime . 's';
        }

        if ($this->memoryUsagePercent > 80) {
            $alerts[] = 'Memory usage is critical: ' . $this->memoryUsagePercent . '%';
        }

        if ($this->queryCount > 100) {
            $alerts[] = 'Too many database queries: ' . $this->queryCount;
        }

        return $alerts;
    }
}
```

## Best Practices

### 1. Regular Monitoring
- Monitor performance metrics daily
- Set up alerts for critical thresholds
- Track performance trends over time

### 2. Optimization
- Optimize database queries
- Use object caching
- Minimize memory usage
- Enable compression

### 3. Testing
- Test performance under load
- Compare before/after optimizations
- Monitor cache effectiveness

### 4. Documentation
- Document performance baselines
- Track optimization changes
- Maintain performance history

## Troubleshooting

### High Memory Usage
1. Check for memory leaks
2. Optimize database queries
3. Use object caching
4. Increase memory limit if needed

### Slow Response Time
1. Optimize database queries
2. Enable page caching
3. Use CDN for static assets
4. Optimize images

### Too Many Queries
1. Use object caching
2. Optimize WordPress queries
3. Reduce plugin usage
4. Use query monitoring tools

## API Reference

### Performance Data Structure

```php
$performanceData = [
    'response_time' => 0.1234,
    'memory_usage' => 47185920, // bytes
    'memory_limit' => 268435456, // bytes
    'memory_usage_percent' => 17.7,
    'query_count' => 156,
    'cache_hit_rate' => 85.3,
    'timestamp' => 1640995200
];
```

### Performance Methods

```php
// Get current performance data
$debugInfo = new Jankx\Debug\DebugInfo();
$data = $debugInfo->getDebugInfo();

// Get specific metrics
$responseTime = $data['response_time'];
$memoryUsage = $data['memory_usage'];
$queryCount = $data['query_count'];
```

## Configuration

### Performance Settings

```php
// Performance monitoring settings
define('JANKX_PERFORMANCE_MONITORING', true);
define('JANKX_PERFORMANCE_ALERTS', true);
define('JANKX_PERFORMANCE_LOG', true);

// Thresholds
define('JANKX_RESPONSE_TIME_THRESHOLD', 2.0);
define('JANKX_MEMORY_USAGE_THRESHOLD', 80);
define('JANKX_QUERY_COUNT_THRESHOLD', 100);
```

### Custom Metrics

```php
// Add custom performance metrics
$debugInfo->addPluginDebugInfo('custom-metric', [
    'custom_response_time' => $customTime,
    'custom_memory_usage' => $customMemory
]);
```