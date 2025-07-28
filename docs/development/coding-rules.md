# Coding Rules - Jankx 2.0

## Overview

This document outlines the coding rules and standards for Jankx 2.0 framework development.

## Core Principles

### 1. Object-Oriented Programming (OOP)

- **Single Responsibility Principle (SRP)**: Each class should have only one reason to change
- **Dependency Injection (DI)**: Use constructor injection for dependencies
- **Avoid Static Methods for Business Logic**: Static methods should only be used for utility functions and helper classes

### 2. Helper Classes

**All helper classes must be static classes with static methods only.**

```php
// ✅ Correct - Static helper class
class BootstrapperHelper
{
    public static function fireLoadedAction(string $bootstrapperName, Container $container): void
    {
        do_action("jankx/bootstrapper/{$bootstrapperName}/loaded", $container);
    }
}

// ❌ Incorrect - Instance methods in helper
class BootstrapperHelper
{
    private $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    public function fireLoadedAction(string $bootstrapperName): void
    {
        // This violates the static helper rule
    }
}
```

### 3. Logging

- **Use Centralized Logger**: Always use `Jankx\Facades\Logger` instead of `error_log()`
- **Log Levels**: Use appropriate log levels (debug, info, warning, error)
- **Context Information**: Include relevant context in log messages

```php
// ✅ Correct
Logger::debug('User service initialized', ['user_id' => $userId]);

// ❌ Incorrect
error_log('User service initialized');
```

### 4. WordPress Hook Naming

- **Package-Style Naming**: Use `jankx/package/name` format for all hooks
- **Consistent Naming**: Follow the same pattern across all hooks

```php
// ✅ Correct
do_action('jankx/user/loaded', $user, $user_id);
apply_filters('jankx/user/data', $userData, $user_id, $fields);

// ❌ Incorrect
do_action('jankx_user_loaded', $user, $user_id);
apply_filters('jankx_user_data', $userData, $user_id, $fields);
```

### 5. Database Queries

- **Use WordPress Functions**: Prefer WordPress functions over direct database queries
- **Repository Pattern**: Use repository pattern for data access
- **Exception**: Debug services may use `global $wpdb` for performance monitoring

```php
// ✅ Correct - WordPress functions
$posts = get_posts(['post_status' => 'publish']);
wp_delete_post($post_id, true);

// ❌ Incorrect - Direct database queries
global $wpdb;
$posts = $wpdb->get_results("SELECT * FROM {$wpdb->posts} WHERE post_status = 'publish'");
```

### 6. Service Classes

- **Instance Methods**: Service classes should use instance methods, not static methods
- **Dependency Injection**: Inject dependencies through constructor
- **Single Responsibility**: Each service should have a single, well-defined purpose

```php
// ✅ Correct - Service class with instance methods
class UserService
{
    private $cache;

    public function __construct(CacheInterface $cache)
    {
        $this->cache = $cache;
    }

    public function getUser(int $userId): ?array
    {
        // Implementation
    }
}

// ❌ Incorrect - Static methods in service class
class UserService
{
    public static function getUser(int $userId): ?array
    {
        // This violates service class rules
    }
}
```

### 7. Error Handling

- **Custom Exceptions**: Use custom exceptions for domain-specific errors
- **Graceful Degradation**: Handle errors gracefully without breaking the application
- **Proper Error Messages**: Provide clear, actionable error messages

```php
// ✅ Correct
try {
    $user = $this->userService->getUser($userId);
} catch (UserNotFoundException $e) {
    Logger::warning('User not found', ['user_id' => $userId]);
    return null;
}

// ❌ Incorrect
$user = $this->userService->getUser($userId); // No error handling
```

### 8. Constants vs Static Methods

- **Version Management**: Use static methods instead of global constants for version information
- **Encapsulation**: Keep version logic within the main framework class

```php
// ✅ Correct
$version = Jankx::getFrameworkVersion();

// ❌ Incorrect
$version = JANKX_VERSION; // Global constant
```

## File Organization

### Helper Classes Location
- **Path**: `includes/Jankx/Helpers/`
- **Naming**: `*Helper.php`
- **Methods**: All methods must be static

### Service Classes Location
- **Path**: `includes/Jankx/Services/`
- **Naming**: `*Service.php`
- **Methods**: Instance methods only

### Bootstrapper Classes Location
- **Path**: `includes/Jankx/Bootstrappers/`
- **Naming**: `*Bootstrapper.php`
- **Methods**: Instance methods for business logic, static calls to helpers

## Testing Guidelines

- **Unit Tests**: Write unit tests for all classes
- **Mocking**: Use mocks for external dependencies
- **Test Coverage**: Aim for high test coverage
- **Test Naming**: Use descriptive test method names

## Performance Guidelines

- **Lazy Loading**: Use deferred services for heavy operations
- **Caching**: Implement appropriate caching strategies
- **Memory Management**: Clean up resources properly
- **Query Optimization**: Minimize database queries

## Security Guidelines

- **Input Validation**: Always validate and sanitize input
- **Output Escaping**: Escape output to prevent XSS
- **Nonce Verification**: Use nonces for form submissions
- **Capability Checks**: Check user capabilities before sensitive operations

## Documentation

- **PHPDoc**: Include comprehensive PHPDoc comments
- **Inline Comments**: Add comments for complex logic
- **README Files**: Maintain README files for each module
- **Examples**: Provide usage examples in documentation

## Code Review Checklist

- [ ] Follows OOP principles
- [ ] Uses appropriate helper classes (static methods only)
- [ ] Implements proper error handling
- [ ] Uses centralized logging
- [ ] Follows WordPress hook naming conventions
- [ ] Uses WordPress functions instead of direct database queries
- [ ] Includes proper documentation
- [ ] Has corresponding unit tests
- [ ] Follows security best practices
- [ ] Implements performance optimizations where appropriate

## Migration from Jankx 1.x

When migrating from Jankx 1.x to 2.0:

1. **Convert Helper Methods**: Ensure all helper methods are static
2. **Update Hook Names**: Convert hook names to package-style format
3. **Replace Constants**: Replace global constants with static method calls
4. **Update Logging**: Replace `error_log()` with `Logger` facade
5. **Refactor Services**: Ensure service classes use instance methods
6. **Update Database Queries**: Replace direct queries with WordPress functions

## Examples

### Helper Class Example

```php
<?php

namespace Jankx\Helpers;

class ExampleHelper
{
    public static function formatData(array $data): array
    {
        return array_map('sanitize_text_field', $data);
    }

    public static function validateInput(string $input): bool
    {
        return !empty(trim($input));
    }
}
```

### Service Class Example

```php
<?php

namespace Jankx\Services;

use Jankx\Facades\Logger;

class ExampleService
{
    private $repository;

    public function __construct(ExampleRepository $repository)
    {
        $this->repository = $repository;
    }

    public function processData(array $data): array
    {
        try {
            $formattedData = ExampleHelper::formatData($data);
            return $this->repository->save($formattedData);
        } catch (\Exception $e) {
            Logger::error('Failed to process data', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
}
```

### Bootstrapper Example

```php
<?php

namespace Jankx\Bootstrappers;

use Jankx\Helpers\BootstrapperHelper;

class ExampleBootstrapper extends AbstractBootstrapper
{
    public function bootstrap(Container $container): void
    {
        // Use static helper methods
        BootstrapperHelper::fireLoadedAction($this->getName(), $container);
    }
}
```

## Conclusion

Following these coding rules ensures:

- **Consistency**: All code follows the same patterns
- **Maintainability**: Code is easy to understand and modify
- **Performance**: Optimized for WordPress environment
- **Security**: Follows WordPress security best practices
- **Testability**: Code is easy to test and debug

Remember: **Helper classes are static, Service classes are instance-based, and always use the appropriate patterns for each type of class.**