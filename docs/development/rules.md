# Coding Rules & Standards

> **Strict OOP Principles for Jankx 2.0**

Jankx 2.0 tuân thủ nghiêm ngặt các nguyên tắc OOP và software engineering để đảm bảo code maintainable, testable và scalable.

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

## ✅ Required Patterns

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

## 🔧 Code Quality Rules

### 1. Type Declarations
```php
// ✅ REQUIRED - Type declarations
class UserService
{
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

    public function updateUser(int $id, array $data): User
    {
        return $this->repository->update($id, $data);
    }
}
```

### 2. Exception Handling
```php
// ✅ GOOD - Proper exception handling
class UserService
{
    public function createUser(array $data): User
    {
        try {
            if (!$this->validator->validate($data)) {
                throw new ValidationException('Invalid user data');
            }

            return $this->repository->create($data);
        } catch (DatabaseException $e) {
            throw new ServiceException('Failed to create user', 0, $e);
        }
    }
}

// Custom exceptions
class ValidationException extends Exception {}
class ServiceException extends Exception {}
class DatabaseException extends Exception {}
```

### 3. Immutability
```php
// ✅ GOOD - Immutable objects
class User
{
    private $id;
    private $name;
    private $email;

    public function __construct(int $id, string $name, string $email)
    {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    // No setters - immutable
}
```

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

## 📊 Code Metrics

### 1. Complexity Limits
```php
// ✅ GOOD - Low complexity
class BasicValidator
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

// ❌ BAD - High complexity
class ComplexValidator
{
    public function validate(array $data): bool
    {
        // 50+ lines of complex validation logic
        // Multiple nested conditions
        // Complex business rules
    }
}
```

### 2. Method Length
```php
// ✅ GOOD - Short methods
class UserService
{
    public function createUser(array $data): User
    {
        $this->validateData($data);
        $this->checkDuplicateEmail($data['email']);
        return $this->repository->create($data);
    }

    private function validateData(array $data): void
    {
        if (!$this->validator->validate($data)) {
            throw new ValidationException('Invalid data');
        }
    }

    private function checkDuplicateEmail(string $email): void
    {
        if ($this->repository->findByEmail($email)) {
            throw new DuplicateEmailException('Email already exists');
        }
    }
}
```

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

### 3. Hook Priority and Parameter Rules
```php
// ✅ GOOD - Proper hook usage with priority and parameters
class UserController
{
    public function handleUserCreation(array $data): void
    {
        // Action with priority and parameters
        do_action('jankx/user/before_validation', $data, 10);

        $validatedData = apply_filters('jankx/user/validate_input', $data, 10, 2);

        if ($this->validator->validate($validatedData)) {
            do_action('jankx/user/before_create', $validatedData, 10);

            $user = $this->service->createUser($validatedData);

            do_action('jankx/user/after_create', $user, $validatedData, 10);
        }
    }
}

// ✅ GOOD - Filter with default value
class ConfigManager
{
    public function getConfig(string $key, $default = null)
    {
        return apply_filters(
            'jankx/config/get_value',
            $default,
            $key,
            $this->context
        );
    }
}
```

### 4. Hook Documentation Standards
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
        do_action('jankx/user/before_create', $data);

        $user = $this->repository->create($data);

        do_action('jankx/user/after_create', $user, $data);

        return $user;
    }
}
```

### 5. Hook Registration Rules
```php
// ✅ GOOD - Hook registration in service providers
class UserServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Register hooks in service provider
        add_action('jankx/user/before_create', [$this, 'logUserCreation'], 10, 1);
        add_filter('jankx/user/validation_rules', [$this, 'addCustomValidation'], 10, 2);
    }

    public function logUserCreation(array $data): void
    {
        error_log('User creation started: ' . json_encode($data));
    }

    public function addCustomValidation(array $rules, string $context): array
    {
        if ($context === 'registration') {
            $rules['terms_accepted'] = 'required|boolean';
        }

        return $rules;
    }
}

// ❌ FORBIDDEN - Direct hook registration in classes
class UserService
{
    public function __construct()
    {
        // Don't register hooks in constructor
        add_action('jankx/user/created', [$this, 'sendEmail']); // WRONG
    }
}
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

---

**Next**: [Software Engineering Principles](./principles.md) | [Testing Guidelines](./testing.md) | [Migration Guide](./migration.md)