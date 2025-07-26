# Jankx Logger Documentation

## Overview

Jankx Logger provides a centralized logging system for the Jankx Framework. It offers structured logging with different levels and context support.

## Features

- **Multiple Log Levels**: info, warning, error, debug
- **Context Support**: Include structured data with messages
- **Performance Optimized**: Debug messages only logged when `JANKX_DEBUG` is true
- **Consistent Formatting**: Standardized log output format
- **Easy Integration**: Simple facade interface

## Usage

### Basic Usage

```php
<?php

namespace YourNamespace;

use Jankx\Facades\Logger;

class YourClass
{
    public function someMethod()
    {
        // Info level - general information
        Logger::info('User logged in successfully');

        // Warning level - something to watch out for
        Logger::warning('Database connection slow');

        // Error level - actual errors
        Logger::error('Failed to save user data');

        // Debug level - detailed debugging info
        Logger::debug('Processing user request', [
            'user_id' => 123,
            'action' => 'login'
        ]);
    }
}
```

### Log Levels

#### 1. Info Level
```php
Logger::info('Message here');
Logger::info('User action completed', ['user_id' => 123]);
```

#### 2. Warning Level
```php
Logger::warning('Something to watch out for');
Logger::warning('Performance issue detected', [
    'query_time' => 2.5,
    'threshold' => 1.0
]);
```

#### 3. Error Level
```php
Logger::error('Error occurred');
Logger::error('Service failed', [
    'service' => 'DatabaseService',
    'exception' => $e->getMessage()
]);
```

#### 4. Debug Level
```php
Logger::debug('Debug information');
Logger::debug('Processing data', [
    'input' => $data,
    'step' => 'validation'
]);
```

### Context Data

Always include relevant context data as the second parameter:

```php
Logger::error('API request failed', [
    'endpoint' => '/api/users',
    'method' => 'POST',
    'status_code' => 500,
    'response_time' => 2.3,
    'user_id' => 123
]);
```

### Debug Mode

To enable debug logging, define the constant:

```php
define('JANKX_DEBUG', true);
```

When `JANKX_DEBUG` is true:
- `Logger::debug()` messages are logged
- More verbose logging is enabled
- Additional context information is included

### Log Output Format

```
[2024-01-15 10:30:45] [Jankx info] User logged in successfully
[2024-01-15 10:30:46] [Jankx warning] Database connection slow {"query_time":2.5,"threshold":1.0}
[2024-01-15 10:30:47] [Jankx error] Service failed {"service":"DatabaseService","exception":"Connection timeout"}
[2024-01-15 10:30:48] [Jankx debug] Processing data {"input":{"id":123},"step":"validation"}
```

## Migration from error_log()

### Before (using error_log)
```php
error_log('User logged in');
error_log('ERROR: ' . $e->getMessage());
error_log('Debug: ' . json_encode($data));
```

### After (using Jankx Logger)
```php
Logger::info('User logged in');
Logger::error('Error occurred', ['exception' => $e->getMessage()]);
Logger::debug('Debug information', $data);
```

## Best Practices

### 1. Use Appropriate Log Levels
- **Info**: General application flow
- **Warning**: Potential issues that don't break functionality
- **Error**: Actual errors that affect functionality
- **Debug**: Detailed information for troubleshooting

### 2. Include Context
```php
// Good
Logger::error('Database query failed', [
    'query' => $sql,
    'params' => $params,
    'exception' => $e->getMessage()
]);

// Avoid
Logger::error('Database query failed');
```

### 3. Don't Log Sensitive Information
```php
// Good
Logger::info('User authenticated', ['user_id' => 123]);

// Avoid
Logger::info('User authenticated', [
    'user_id' => 123,
    'password' => 'secret123'  // Never log passwords!
]);
```

### 4. Use Debug Level for Development
```php
// Only logged when JANKX_DEBUG is true
Logger::debug('Processing request', [
    'request_data' => $data,
    'processing_steps' => $steps
]);
```

## Configuration

### Enable Debug Mode
```php
// In wp-config.php or theme setup
define('JANKX_DEBUG', true);
```

### Custom Log Levels
The logger automatically filters messages based on:
- **Always logged**: warning, error
- **Conditional**: info, debug (when `JANKX_DEBUG` is true)

## Integration Examples

### WordPress Hook Example
```php
add_action('wp_loaded', function() {
    Logger::info('WordPress loaded', [
        'is_admin' => is_admin(),
        'current_user' => get_current_user_id()
    ]);
});
```

### Exception Handling
```php
try {
    $result = $service->process($data);
    Logger::info('Service processed successfully', ['result' => $result]);
} catch (Exception $e) {
    Logger::error('Service processing failed', [
        'service' => get_class($service),
        'exception' => $e->getMessage(),
        'data' => $data
    ]);
}
```

### Performance Monitoring
```php
$start = microtime(true);
// ... your code ...
$duration = microtime(true) - $start;

Logger::debug('Operation completed', [
    'duration' => $duration,
    'memory_usage' => memory_get_usage(true)
]);
```

## Troubleshooting

### Logs Not Appearing
1. Check if `JANKX_DEBUG` is defined and true for debug messages
2. Verify the Logger facade is properly imported
3. Check WordPress error log location

### Performance Issues
1. Use debug level sparingly in production
2. Avoid logging large data structures
3. Consider log rotation for high-traffic sites

## API Reference

### Logger::info($message, $context = [])
Logs an informational message.

### Logger::warning($message, $context = [])
Logs a warning message (always logged).

### Logger::error($message, $context = [])
Logs an error message (always logged).

### Logger::debug($message, $context = [])
Logs a debug message (only when `JANKX_DEBUG` is true).