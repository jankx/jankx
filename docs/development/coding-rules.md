# Coding Rules for Jankx Framework

## Logging Standards

### 1. Use Jankx Logger Instead of error_log()

**❌ DON'T:**
```php
error_log('Debug message');
error_log('Error occurred: ' . $error);
```

**✅ DO:**
```php
use Jankx\Facades\Logger;

// Info level
Logger::info('Debug message');

// Warning level  
Logger::warning('Something to watch out for');

// Error level
Logger::error('Error occurred', ['error' => $error]);

// Debug level (only shown when JANKX_DEBUG is true)
Logger::debug('Debug information', ['context' => $data]);
```

### 2. Logger Levels

- **`Logger::info()`** - General information messages
- **`Logger::warning()`** - Warning messages (always logged)
- **`Logger::error()`** - Error messages (always logged)  
- **`Logger::debug()`** - Debug messages (only when `JANKX_DEBUG` is true)

### 3. Context Data

Always include relevant context data as second parameter:

```php
Logger::error('Failed to load service', [
    'service' => $serviceName,
    'context' => $context,
    'exception' => $e->getMessage()
]);
```

### 4. Import Statement

Always include the import at the top of your file:

```php
<?php

namespace YourNamespace;

use Jankx\Facades\Logger;

class YourClass
{
    // Your code here
}
```

### 5. Migration from error_log()

When migrating existing `error_log()` calls:

1. Replace `error_log('message')` with `Logger::info('message')`
2. Replace `error_log('ERROR: ' . $error)` with `Logger::error('Error occurred', ['error' => $error])`
3. Replace debug logs with `Logger::debug('Debug info', ['data' => $data])`

### 6. Benefits of Jankx Logger

- **Consistent formatting**: `[2024-01-15 10:30:45] [Jankx info] Your message`
- **Context support**: Include structured data with messages
- **Level filtering**: Only log what's needed based on environment
- **Performance**: Debug messages only logged when `JANKX_DEBUG` is true
- **Centralized control**: Easy to modify logging behavior globally

### 7. Debug Mode

To enable debug logging, define the constant:

```php
define('JANKX_DEBUG', true);
```

This will enable `Logger::debug()` messages and provide more verbose logging.

---

## Other Coding Standards

### File Naming
- Use PascalCase for class names: `MyClass.php`
- Use camelCase for method names: `getUserData()`
- Use snake_case for file names: `my_file.php`

### Namespace Structure
```
Jankx\
├── Services\          # Business logic services
├── Bootstrappers\     # Framework bootstrappers  
├── Facades\          # Static interfaces
├── Logger\           # Logging functionality
└── Debug\            # Debug tools
```

### Documentation
- Use PHPDoc for all public methods
- Include `@since` tags for version tracking
- Document parameters and return types

### Error Handling
- Use try-catch blocks for external operations
- Log errors with context using Jankx Logger
- Don't expose sensitive information in error messages 