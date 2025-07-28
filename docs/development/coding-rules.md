# Coding Rules & Standards - Jankx 2.0

> **Comprehensive Coding Rules for Jankx 2.0 Framework**

This document outlines the comprehensive coding rules and standards for Jankx 2.0 framework development, including OOP principles, service class rules, and WordPress integration guidelines.

## 🎯 Overview

Jankx 2.0 tuân thủ nghiêm ngặt các nguyên tắc OOP và software engineering để đảm bảo code maintainable, testable và scalable. Tất cả code phải tuân thủ các rules này.

## 🏗 Core Principles

### 1. Object-Oriented Programming (OOP)

- **Single Responsibility Principle (SRP)**: Each class should have only one reason to change
- **Dependency Injection (DI)**: Use constructor injection for dependencies
- **Avoid Static Methods for Business Logic**: Static methods should only be used for utility functions and helper classes

### 2. Service Class Rules

**Service classes must be resolved through Container and have no static methods.**

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

### 3. Helper Classes

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

## 🚫 Forbidden Patterns

### ❌ No Procedural Functions
```php
// FORBIDDEN - Procedural functions
function get_user_data($user_id) {
    return get_user_meta($user_id, 'data', true);
}

function render_template($template, $data) {
    // Template rendering logic
}
```

### ❌ No Global Variables
```php
// FORBIDDEN - Global variables
$global_config = [];
$theme_options = get_option('theme_options');
```

### ❌ No Direct Database Queries
```php
// FORBIDDEN - Direct database queries
function get_posts_data() {
    global $wpdb;
    return $wpdb->get_results("SELECT * FROM {$wpdb->posts}");
}
```

### ✅ WordPress Functions Are Allowed
```php
// ALLOWED - Direct WordPress function calls
class PostService
{
    public function getPost(int $postId): ?WP_Post
    {
        return get_post($postId);
    }

    public function getPosts(array $args): array
    {
        return get_posts($args);
    }

    public function hasBlocks(string $content): bool
    {
        return has_blocks($content);
    }
}
```

## ✅ Required Patterns

### ✅ WordPress Integration
```php
// ENCOURAGED - Direct WordPress function usage
class GutenbergService
{
    public function hasBlocks(string $content): bool
    {
        return has_blocks($content);
    }

    public function parseBlocks(string $content): array
    {
        return parse_blocks($content);
    }

    public function isBlockEditor(): bool
    {
        $screen = get_current_screen();
        return $screen && method_exists($screen, 'is_block_editor') && $screen->is_block_editor();
    }
}
```

### ✅ Static Helper Classes
```php
// REQUIRED - Static helper classes
class UserHelper
{
    public static function getData(int $userId): array
    {
        return get_user_meta($userId, 'data', true) ?: [];
    }

    public static function updateData(int $userId, array $data): bool
    {
        return update_user_meta($userId, 'data', $data);
    }

    public static function validateData(array $data): bool
    {
        return !empty($data['name']) && !empty($data['email']);
    }
}
```

### ✅ Service Classes
```php
// REQUIRED - Service classes with dependency injection
class UserService
{
    private $repository;
    private $validator;

    public function __construct(UserRepository $repository, UserValidator $validator)
    {
        $this->repository = $repository;
        $this->validator = $validator;
    }

    public function createUser(array $data): User
    {
        if (!$this->validator->validate($data)) {
            throw new InvalidArgumentException('Invalid user data');
        }

        return $this->repository->create($data);
    }

    public function getUser(int $id): ?User
    {
        return $this->repository->find($id);
    }
}
```

### ✅ Repository Pattern
```php
// REQUIRED - Repository pattern for data access
// WordPress functions are allowed and encouraged
class UserRepository
{
    public function find(int $id): ?User
    {
        $userData = get_user($id);
        return $userData ? new User($userData) : null;
    }

    public function create(array $data): User
    {
        $userId = wp_insert_user($data);
        return $this->find($userId);
    }

    public function update(int $id, array $data): User
    {
        $data['ID'] = $id;
        wp_update_user($data);
        return $this->find($id);
    }

    public function delete(int $id): bool
    {
        return wp_delete_user($id);
    }
}
```

## 🔧 Code Quality Rules

### 1. Logging

- **Use Centralized Logger**: Always use `Jankx\Facades\Logger` instead of `error_log()`
- **Log Levels**: Use appropriate log levels (debug, info, warning, error)
- **Context Information**: Include relevant context in log messages

```php
// ✅ Correct
Logger::debug('User service initialized', ['user_id' => $userId]);

// ❌ Incorrect
error_log('User service initialized');
```

### 2. WordPress Hook Naming

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

### 3. Error Handling

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

### 4. Constants vs Static Methods

- **Version Management**: Use static methods instead of global constants for version information
- **Encapsulation**: Keep version logic within the main framework class

```php
// ✅ Correct
$version = Jankx::getFrameworkVersion();

// ❌ Incorrect
$version = JANKX_VERSION; // Global constant
```

## 🏗 Class Structure Rules

### 1. Single Responsibility Principle
```php
// ✅ GOOD - Single responsibility
class UserValidator
{
    public function validate(array $data): bool
    {
        return $this->validateEmail($data['email'])
            && $this->validateName($data['name']);
    }

    private function validateEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    private function validateName(string $name): bool
    {
        return strlen(trim($name)) >= 2;
    }
}

// ❌ BAD - Multiple responsibilities
class UserManager
{
    public function validate() { /* validation logic */ }
    public function save() { /* database logic */ }
    public function sendEmail() { /* email logic */ }
    public function renderTemplate() { /* template logic */ }
}
```

### 2. Dependency Injection
```php
// ✅ GOOD - Dependency injection
class UserController
{
    private $userService;
    private $templateRenderer;

    public function __construct(UserService $userService, TemplateRenderer $templateRenderer)
    {
        $this->userService = $userService;
        $this->templateRenderer = $templateRenderer;
    }

    public function createUser(array $data): string
    {
        $user = $this->userService->createUser($data);
        return $this->templateRenderer->render('user/created', ['user' => $user]);
    }
}

// ❌ BAD - Direct instantiation
class UserController
{
    public function createUser(array $data): string
    {
        $userService = new UserService(); // Direct instantiation
        $templateRenderer = new TemplateRenderer(); // Direct instantiation
        // ...
    }
}
```

### 3. Interface Segregation
```php
// ✅ GOOD - Specific interfaces
interface UserReader
{
    public function find(int $id): ?User;
    public function findByEmail(string $email): ?User;
}

interface UserWriter
{
    public function create(array $data): User;
    public function update(int $id, array $data): User;
    public function delete(int $id): bool;
}

interface UserRepository extends UserReader, UserWriter
{
    // Combines both interfaces
}

// ❌ BAD - Fat interface
interface UserManager
{
    public function find(int $id): ?User;
    public function create(array $data): User;
    public function update(int $id, array $data): User;
    public function delete(int $id): bool;
    public function sendEmail(User $user): bool; // Not related to data access
    public function renderTemplate(User $user): string; // Not related to data access
}
```

## 📁 File Organization Rules

### 1. PSR-4 Autoloading
```php
// ✅ GOOD - PSR-4 structure
namespace Jankx\User;

class UserService
{
    // Service implementation
}

// File location: includes/Jankx/User/UserService.php
```

### 2. Directory Structure
```
includes/
├── Jankx/
│   ├── User/
│   │   ├── UserService.php
│   │   ├── UserRepository.php
│   │   ├── UserValidator.php
│   │   └── Interfaces/
│   │       ├── UserReader.php
│   │       └── UserWriter.php
│   ├── Template/
│   │   ├── TemplateRenderer.php
│   │   └── TemplateEngine.php
│   └── Security/
│       ├── SecurityManager.php
│       └── Sanitizer.php
```

### 3. Naming Conventions
```php
// ✅ GOOD - Clear naming
class UserService {} // Service classes
class UserRepository {} // Repository classes
class UserValidator {} // Validator classes
class UserController {} // Controller classes
class UserInterface {} // Interface classes
class UserException {} // Exception classes

// File names match class names exactly
UserService.php
UserRepository.php
UserValidator.php
```

### 4. Helper Classes Location
- **Path**: `includes/Jankx/Helpers/`
- **Naming**: `*Helper.php`
- **Methods**: All methods must be static

### 5. Service Classes Location
- **Path**: `includes/Jankx/Services/`
- **Naming**: `*Service.php`
- **Methods**: Instance methods only

### 6. Bootstrapper Classes Location
- **Path**: `includes/Jankx/Bootstrappers/`
- **Naming**: `*Bootstrapper.php`
- **Methods**: Instance methods for business logic, static calls to helpers

## 🧪 Testing Rules

### 1. Unit Testing
```php
// ✅ REQUIRED - Unit tests for all classes
class UserServiceTest extends TestCase
{
    private $userService;
    private $repository;
    private $validator;

    protected function setUp(): void
    {
        $this->repository = $this->createMock(UserRepository::class);
        $this->validator = $this->createMock(UserValidator::class);
        $this->userService = new UserService($this->repository, $this->validator);
    }

    public function testCreateUserWithValidData()
    {
        $data = ['name' => 'John Doe', 'email' => 'john@example.com'];
        $user = new User(1, 'John Doe', 'john@example.com');

        $this->validator->expects($this->once())
            ->method('validate')
            ->with($data)
            ->willReturn(true);

        $this->repository->expects($this->once())
            ->method('create')
            ->with($data)
            ->willReturn($user);

        $result = $this->userService->createUser($data);

        $this->assertEquals($user, $result);
    }

    public function testCreateUserWithInvalidData()
    {
        $data = ['name' => '', 'email' => 'invalid-email'];

        $this->validator->expects($this->once())
            ->method('validate')
            ->with($data)
            ->willReturn(false);

        $this->expectException(ValidationException::class);

        $this->userService->createUser($data);
    }
}
```

### 2. Integration Testing
```php
// ✅ REQUIRED - Integration tests
class UserIntegrationTest extends TestCase
{
    public function testUserCreationFlow()
    {
        $container = new ServiceContainer();
        $userService = $container->get(UserService::class);

        $data = ['name' => 'John Doe', 'email' => 'john@example.com'];
        $user = $userService->createUser($data);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('John Doe', $user->getName());
        $this->assertEquals('john@example.com', $user->getEmail());
    }
}
```

### 3. Testing Guidelines

- **Mandatory Unit Tests**: **All classes and helpers must have comprehensive unit tests**
- **Test Coverage**: Aim for 90%+ test coverage for all classes
- **Test Structure**: Follow the pattern `tests/{Namespace}/{ClassName}Test.php`
- **Mocking**: Use mocks for external dependencies (WordPress functions, database, etc.)
- **Test Naming**: Use descriptive test method names that explain the scenario
- **Test Isolation**: Each test should be independent and not rely on other tests
- **Helper Testing**: Test all static methods in helper classes
- **Service Testing**: Test all instance methods in service classes
- **Exception Testing**: Test both success and failure scenarios
- **Integration Testing**: Write integration tests for complex workflows

## 🔒 Security Rules

### 1. Input Sanitization
```php
// ✅ REQUIRED - Input sanitization
class UserValidator
{
    public function validate(array $data): bool
    {
        $sanitizedData = $this->sanitizeInput($data);
        return $this->validateSanitizedData($sanitizedData);
    }

    private function sanitizeInput(array $data): array
    {
        return [
            'name' => sanitize_text_field($data['name'] ?? ''),
            'email' => sanitize_email($data['email'] ?? ''),
            'description' => wp_kses_post($data['description'] ?? ''),
        ];
    }
}
```

### 2. Output Escaping
```php
// ✅ REQUIRED - Output escaping
class TemplateRenderer
{
    public function render(string $template, array $data): string
    {
        $escapedData = $this->escapeOutput($data);
        return $this->renderTemplate($template, $escapedData);
    }

    private function escapeOutput(array $data): array
    {
        return [
            'name' => esc_html($data['name']),
            'email' => esc_attr($data['email']),
            'description' => wp_kses_post($data['description']),
        ];
    }
}
```

## 🎯 WordPress Hook Naming Rules

### 1. Action Hook Naming Convention
```php
// ✅ REQUIRED - Package-style action hook names
class UserService
{
    public function createUser(array $data): User
    {
        // Pre-action hook
        do_action('jankx/user/before_create', $data);

        $user = $this->repository->create($data);

        // Post-action hook
        do_action('jankx/user/after_create', $user, $data);

        return $user;
    }
}

// ✅ GOOD - Consistent package naming
do_action('jankx/template/before_render', $template, $data);
do_action('jankx/security/before_validation', $input);
do_action('jankx/admin/after_save_settings', $settings);
do_action('jankx/frontend/before_enqueue_assets');
do_action('jankx/api/before_response', $response);

// ❌ FORBIDDEN - Generic hook names
do_action('user_created', $user); // Too generic
do_action('before_save', $data); // No package prefix
do_action('jankx_user_created', $user); // Wrong separator
```

### 2. Filter Hook Naming Convention
```php
// ✅ REQUIRED - Package-style filter hook names
class TemplateRenderer
{
    public function render(string $template, array $data): string
    {
        // Pre-filter hook
        $data = apply_filters('jankx/template/render_data', $data, $template);

        $content = $this->renderTemplate($template, $data);

        // Post-filter hook
        $content = apply_filters('jankx/template/render_content', $content, $template, $data);

        return $content;
    }
}

// ✅ GOOD - Consistent filter naming
$userData = apply_filters('jankx/user/validation_rules', $rules, $context);
$templatePath = apply_filters('jankx/template/locate_template', $path, $template);
$settings = apply_filters('jankx/admin/default_settings', $defaults);
$assets = apply_filters('jankx/frontend/enqueue_assets', $assets);

// ❌ FORBIDDEN - Generic filter names
$data = apply_filters('user_data', $data); // Too generic
$content = apply_filters('render_content', $content); // No package prefix
$settings = apply_filters('jankx_settings', $settings); // Wrong separator
```

## 📝 Documentation Rules

### 1. PHPDoc Comments
```php
/**
 * User service for managing user operations
 *
 * @package Jankx\User
 */
class UserService
{
    /**
     * Create a new user
     *
     * Fires the following hooks:
     * - `jankx/user/before_create` (array $data) - Before user creation
     * - `jankx/user/after_create` (User $user, array $data) - After user creation
     *
     * @param array $data User data
     * @return User Created user
     * @throws ValidationException When data is invalid
     * @throws ServiceException When creation fails
     */
    public function createUser(array $data): User
    {
        // Implementation
    }
}
```

### 2. README Files
```markdown
# User Module

## Overview
User module provides user management functionality.

## Classes
- `UserService`: Main service for user operations
- `UserRepository`: Data access layer
- `UserValidator`: Input validation

## Hooks
- `jankx/user/before_create` - Fired before user creation
- `jankx/user/after_create` - Fired after user creation
- `jankx/user/validation_rules` - Filter for validation rules

## Usage
```php
$userService = $container->get(UserService::class);
$user = $userService->createUser(['name' => 'John', 'email' => 'john@example.com']);
```

## Testing
Run tests with: `composer test -- --filter=User`
```

## 📊 Code Review Checklist

- [ ] Follows OOP principles
- [ ] Uses appropriate helper classes (static methods only)
- [ ] Implements proper error handling
- [ ] Uses centralized logging
- [ ] Follows WordPress hook naming conventions
- [ ] Uses WordPress functions instead of direct database queries
- [ ] Includes proper documentation
- [ ] **Has comprehensive unit tests for all classes and helpers**
- [ ] **Tests cover both success and failure scenarios**
- [ ] **Tests use proper mocking for external dependencies**
- [ ] **Test coverage is 90%+ for all classes**
- [ ] Follows security best practices
- [ ] Implements performance optimizations where appropriate

## 🔄 Migration from Jankx 1.x

When migrating from Jankx 1.x to 2.0:

1. **Convert Helper Methods**: Ensure all helper methods are static
2. **Update Hook Names**: Convert hook names to package-style format
3. **Replace Constants**: Replace global constants with static method calls
4. **Update Logging**: Replace `error_log()` with `Logger` facade
5. **Refactor Services**: Ensure service classes use instance methods
6. **Update Database Queries**: Replace direct queries with WordPress functions
7. **Add Unit Tests**: **Create comprehensive unit tests for all classes and helpers**
8. **Test Coverage**: Ensure 90%+ test coverage for all migrated code

## 🎯 Examples

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

## 🎉 Conclusion

Following these coding rules ensures:

- **Consistency**: All code follows the same patterns
- **Maintainability**: Code is easy to understand and modify
- **Performance**: Optimized for WordPress environment
- **Security**: Follows WordPress security best practices
- **Testability**: Code is easy to test and debug
- **Reliability**: Comprehensive unit tests ensure code quality and prevent regressions

Remember: **Helper classes are static, Service classes are instance-based, all classes must have comprehensive unit tests, and always use the appropriate patterns for each type of class.**

---

**Jankx 2.0** - Modern WordPress Theme Framework (Development Version) 🚧

*Last updated: Development Phase*
*Framework version: 2.0.0-dev*