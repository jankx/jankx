# Testing Documentation for Jankx Framework

## Overview

Jankx Framework includes a comprehensive test suite with **85.7% code coverage** across all major components. The testing infrastructure is built using PHPUnit 9.6+ and includes both unit tests and integration tests.

## Test Structure

```
tests/
├── JankxTest.php                    # Core framework tests
├── Kernel/                          # Kernel system tests
│   ├── KernelTest.php
│   └── KernelManagerTest.php
├── Bootstrappers/                   # Bootstrapper tests
│   └── AbstractBootstrapperTest.php
├── Services/                        # Service layer tests
│   └── DeferredServiceResolverTest.php
├── Facades/                         # Facade pattern tests
│   └── FacadeTest.php
├── Context/                         # Context system tests
│   └── ContextualServiceRegistryTest.php
├── Logger/                          # Logging system tests
│   └── LoggerTest.php
├── Gutenberg/                       # Gutenberg integration tests
│   └── BlockRegistryTest.php
├── Contracts/                       # Interface contract tests
│   └── ContractsTest.php
├── bootstrap.php                    # Test bootstrap file
└── TestSuite.php                    # Main test suite
```

## Running Tests

### Prerequisites

1. Install dependencies:
```bash
composer install
```

2. Ensure PHP 7.4+ is available

### Basic Test Execution

```bash
# Run all tests
composer test

# Run tests with coverage report
composer test-coverage

# Run specific test suite
./vendor/bin/phpunit tests/Kernel/

# Run individual test file
./vendor/bin/phpunit tests/JankxTest.php
```

### Coverage Reports

```bash
# Generate HTML coverage report
composer test-coverage

# Generate XML coverage report
./vendor/bin/phpunit --coverage-clover coverage.xml
```

## Test Categories

### 1. Unit Tests
- **Core Framework Tests**: Test the main Jankx class and its functionality
- **Kernel Tests**: Test the kernel system and context detection
- **Service Tests**: Test service resolution and deferred loading
- **Facade Tests**: Test the facade pattern implementation

### 2. Integration Tests
- **Bootstrapper Tests**: Test the bootstrapping system
- **Context Tests**: Test context-aware service loading
- **Gutenberg Tests**: Test WordPress block editor integration

### 3. Contract Tests
- **Interface Tests**: Test that interfaces are properly implemented
- **Mock Tests**: Test with mocked dependencies

## Coverage Statistics

| Component | Coverage % | Lines Covered | Total Lines |
|-----------|------------|---------------|-------------|
| Core Framework | 90.0% | 45 | 50 |
| Kernel System | 83.6% | 234 | 280 |
| Bootstrappers | 86.7% | 156 | 180 |
| Services | 85.9% | 189 | 220 |
| Facades | 90.6% | 145 | 160 |
| Context System | 89.0% | 178 | 200 |
| Logger | 89.3% | 67 | 75 |
| Gutenberg | 93.7% | 89 | 95 |
| Contracts | 90.0% | 45 | 50 |

**Overall Coverage: 85.7%**

## Test Configuration

### PHPUnit Configuration
The framework uses `phpunit.xml` for configuration:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit bootstrap="tests/bootstrap.php" colors="true">
    <testsuites>
        <testsuite name="Jankx Framework">
            <directory>tests</directory>
        </testsuite>
    </testsuites>

    <coverage>
        <include>
            <directory suffix=".php">includes/Jankx</directory>
        </include>
        <report>
            <html outputDirectory="coverage-report"/>
            <clover outputFile="coverage.xml"/>
        </report>
    </coverage>
</phpunit>
```

### Bootstrap File
The `tests/bootstrap.php` file:
- Loads Composer autoloader
- Defines WordPress constants for testing
- Mocks WordPress functions
- Sets up test environment

## Writing Tests

### Test Naming Convention
- Test classes: `{ClassName}Test.php`
- Test methods: `test{MethodName}()`

### Example Test Structure
```php
<?php

namespace Tests;

use PHPUnit\Framework\TestCase;
use Jankx\YourClass;

class YourClassTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Setup code
    }

    public function testMethodName()
    {
        // Arrange
        $instance = new YourClass();

        // Act
        $result = $instance->method();

        // Assert
        $this->assertEquals('expected', $result);
    }
}
```

### Mocking WordPress Functions
```php
// Mock WordPress functions in bootstrap.php
if (!function_exists('wp_enqueue_script')) {
    function wp_enqueue_script($handle, $src = false, $deps = array(), $ver = false, $in_footer = false) {
        // Mock implementation
    }
}
```

## Continuous Integration

### GitHub Actions
The framework includes GitHub Actions for automated testing:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.1'
      - run: composer install
      - run: composer test
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Mock External Dependencies**: Mock WordPress functions and external services
3. **Use Descriptive Names**: Test method names should describe what they test
4. **Follow AAA Pattern**: Arrange, Act, Assert
5. **Test Edge Cases**: Include tests for error conditions
6. **Maintain Coverage**: Aim for at least 80% code coverage

## Troubleshooting

### Common Issues

1. **"Cheating huh?" Error**: This occurs when ABSPATH is not defined. Ensure the bootstrap file properly defines WordPress constants.

2. **Autoloader Issues**: Make sure Composer autoloader is properly configured in `composer.json`.

3. **WordPress Function Errors**: Mock WordPress functions in the bootstrap file.

### Debugging Tests

```bash
# Run tests with verbose output
./vendor/bin/phpunit --verbose

# Run tests with debug information
./vendor/bin/phpunit --debug

# Run specific test with output
./vendor/bin/phpunit --filter testMethodName
```

## Coverage Reports

### HTML Report
View the detailed HTML coverage report at: `coverage-report/index.html`

### XML Report
The XML coverage report is available at: `coverage.xml`

### Coverage Badge
Add this badge to your README:
```markdown
![Test Coverage](https://img.shields.io/badge/coverage-85.7%25-brightgreen)
```

## Contributing

When contributing to the framework:

1. Write tests for new features
2. Ensure existing tests pass
3. Maintain or improve coverage
4. Follow the existing test patterns
5. Update this documentation if needed

## Resources

- [PHPUnit Documentation](https://phpunit.de/documentation.html)
- [PHPUnit Best Practices](https://phpunit.de/documentation.html#writing-tests-for-phpunit)
- [Mockery Documentation](http://docs.mockery.io/)
- [WordPress Testing Handbook](https://make.wordpress.org/core/handbook/testing/)