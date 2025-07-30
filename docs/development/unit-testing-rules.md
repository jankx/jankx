# Testing Rules & Guidelines - Jankx 2.0

> **Comprehensive Testing Strategy for Jankx 2.0**

Jankx 2.0 tuân thủ testing best practices với unit tests, integration tests, và automated testing workflows. Tất cả code phải tuân thủ các testing rules này.

## 🧪 Testing Strategy

### Testing Pyramid
```
┌─────────────────────────────────────┐
│           E2E Tests                │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   User      │  │   Critical  │  │
│  │  Flows      │  │   Paths     │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Integration Tests           │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Service   │  │   Component │  │
│  │ Integration │  │ Integration │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           Unit Tests                │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Classes   │  │   Methods   │  │
│  │   Services  │  │  Functions  │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

## 🎯 Core Requirements

### 1. Mandatory Unit Tests

**All classes and helpers must have comprehensive unit tests.**

- ✅ **Required**: Every class must have a corresponding test file
- ✅ **Required**: All public methods must be tested
- ✅ **Required**: Test both success and failure scenarios
- ✅ **Required**: Use proper mocking for external dependencies

### 2. Test Coverage

- **Test Quality**: Comprehensive test coverage for all classes
- **Test Types**: Unit tests, integration tests, and functional tests
- **Test Execution**: Run tests with proper assertions

### 3. Test Structure

```
tests/
├── Unit/
│   ├── Helpers/
│   │   ├── BootstrapperHelperTest.php
│   │   └── DeferredServiceHelperTest.php
│   ├── Services/
│   │   ├── UserServiceTest.php
│   │   ├── BlockParserServiceTest.php
│   │   └── GutenbergBlocksServiceTest.php
│   ├── Facades/
│   │   ├── UserFacadeTest.php
│   │   └── KernelFacadeTest.php
│   └── Bootstrappers/
│       ├── CoreBootstrapperTest.php
│       └── FrontendBootstrapperTest.php
├── Integration/
│   ├── ServiceIntegrationTest.php
│   └── WorkflowIntegrationTest.php
├── E2E/
│   └── GutenbergE2ETest.php
└── Performance/
    └── PerformanceTest.php
```

## 🔧 Unit Testing

### 1. Helper Class Testing

Helper classes contain static methods and must be tested thoroughly:

```php
class ExampleHelperTest extends TestCase
{
    public function testFormatDataWithValidInput(): void
    {
        $input = ['test', 'data'];
        $result = ExampleHelper::formatData($input);

        $this->assertIsArray($result);
        $this->assertCount(2, $result);
    }

    public function testFormatDataWithEmptyInput(): void
    {
        $input = [];
        $result = ExampleHelper::formatData($input);

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function testValidateInputWithValidString(): void
    {
        $input = 'valid input';
        $result = ExampleHelper::validateInput($input);

        $this->assertTrue($result);
    }

    public function testValidateInputWithEmptyString(): void
    {
        $input = '';
        $result = ExampleHelper::validateInput($input);

        $this->assertFalse($result);
    }
}
```

### 2. Service Class Testing

Service classes contain instance methods and require dependency mocking:

```php
class ExampleServiceTest extends TestCase
{
    private $mockRepository;
    private $service;

    protected function setUp(): void
    {
        $this->mockRepository = $this->createMock(ExampleRepository::class);
        $this->service = new ExampleService($this->mockRepository);
    }

    public function testProcessDataSuccessfully(): void
    {
        $inputData = ['test' => 'data'];
        $expectedResult = ['test' => 'data', 'id' => 123];

        $this->mockRepository
            ->expects($this->once())
            ->method('save')
            ->with($this->arrayHasKey('test'))
            ->willReturn($expectedResult);

        $result = $this->service->processData($inputData);

        $this->assertEquals($expectedResult, $result);
    }

    public function testProcessDataThrowsException(): void
    {
        $inputData = ['invalid' => 'data'];

        $this->mockRepository
            ->expects($this->once())
            ->method('save')
            ->willThrowException(new \Exception('Database error'));

        $this->expectException(\Exception::class);
        $this->service->processData($inputData);
    }
}
```

### 3. WordPress Function Mocking

Mock WordPress functions to isolate tests:

```php
class WordPressMockTest extends TestCase
{
    public function testGetUserDataWithMockedWordPressFunctions(): void
    {
        // Mock WordPress functions
        $this->mockFunction('get_user_by', function($field, $value) {
            return (object) [
                'ID' => 1,
                'user_login' => 'testuser',
                'user_email' => 'test@example.com'
            ];
        });

        $this->mockFunction('wp_cache_get', function($key) {
            return false; // Simulate cache miss
        });

        $this->mockFunction('wp_cache_set', function($key, $data) {
            return true; // Simulate successful cache set
        });

        $userService = new UserService();
        $result = $userService->getUser(1);

        $this->assertIsArray($result);
        $this->assertEquals(1, $result['id']);
    }
}
```

### 4. Exception Testing

Test both success and failure scenarios:

```php
public function testGetUserWithInvalidId(): void
{
    $this->expectException(\InvalidArgumentException::class);
    $this->expectExceptionMessage('Invalid user ID');

    $userService = new UserService();
    $userService->getUser(-1);
}

public function testGetUserWithNonExistentId(): void
{
    $this->mockFunction('get_user_by', function($field, $value) {
        return false;
    });

    $userService = new UserService();
    $result = $userService->getUser(999);

    $this->assertNull($result);
}
```

### 5. Block Testing

Test Gutenberg blocks thoroughly:

```php
class TestimonialBlockTest extends TestCase
{
    private $block;

    protected function setUp(): void
    {
        $this->block = new TestimonialBlock();
    }

    public function testBlockRegistration()
    {
        // Act
        $this->block->register();

        // Assert
        $this->assertTrue(block_type_exists('jankx/testimonial'));
    }

    public function testBlockRendering()
    {
        // Arrange
        $attributes = [
            'author' => 'John Doe',
            'content' => 'Great product!',
            'avatar' => 'https://example.com/avatar.jpg',
            'authorTitle' => 'CEO',
            'alignment' => 'center',
            'backgroundColor' => '#f0f0f0'
        ];

        // Act
        $output = $this->block->render($attributes, '');

        // Assert
        $this->assertStringContainsString('John Doe', $output);
        $this->assertStringContainsString('Great product!', $output);
        $this->assertStringContainsString('https://example.com/avatar.jpg', $output);
        $this->assertStringContainsString('CEO', $output);
        $this->assertStringContainsString('text-align: center', $output);
        $this->assertStringContainsString('background-color: #f0f0f0', $output);
    }

    public function testBlockRenderingWithEmptyAttributes()
    {
        // Arrange
        $attributes = [];

        // Act
        $output = $this->block->render($attributes, '');

        // Assert
        $this->assertStringContainsString('jankx-testimonial', $output);
        $this->assertStringNotContainsString('undefined', $output);
    }

    public function testBlockAttributesSanitization()
    {
        // Arrange
        $attributes = [
            'author' => '<script>alert("xss")</script>John Doe',
            'content' => '<script>alert("xss")</script>Great product!',
            'avatar' => 'javascript:alert("xss")',
        ];

        // Act
        $output = $this->block->render($attributes, '');

        // Assert
        $this->assertStringNotContainsString('<script>', $output);
        $this->assertStringNotContainsString('javascript:', $output);
        $this->assertStringContainsString('John Doe', $output);
        $this->assertStringContainsString('Great product!', $output);
    }
}
```

## 🔄 Integration Testing

### 1. Service Integration Tests

Test complete workflows and interactions:

```php
class UserServiceIntegrationTest extends TestCase
{
    private $userService;
    private $cacheService;

    protected function setUp(): void
    {
        $this->cacheService = new CacheService();
        $this->userService = new UserService($this->cacheService);
    }

    public function testCompleteUserWorkflow(): void
    {
        // Test user creation
        $userData = ['name' => 'John Doe', 'email' => 'john@example.com'];
        $user = $this->userService->createUser($userData);

        $this->assertIsArray($user);
        $this->assertEquals('John Doe', $user['name']);

        // Test user retrieval
        $retrievedUser = $this->userService->getUser($user['id']);

        $this->assertEquals($user['id'], $retrievedUser['id']);
        $this->assertEquals($user['name'], $retrievedUser['name']);

        // Test cache functionality
        $cachedUser = $this->userService->getUser($user['id']);

        $this->assertEquals($retrievedUser, $cachedUser);
    }
}
```

### 2. Service Provider Integration Tests

```php
class ServiceIntegrationTest extends TestCase
{
    private $container;

    protected function setUp(): void
    {
        $this->container = new ServiceContainer();
    }

    public function testAssetServiceProviderIntegration()
    {
        // Arrange
        $provider = new AssetServiceProvider($this->container);

        // Act
        $provider->register();
        $provider->boot();

        // Assert
        $this->assertTrue($this->container->has(\Jankx\Assets\AssetManager::class));
        $this->assertTrue($this->container->has(\Jankx\Assets\AssetOptimizer::class));

        $assetManager = $this->container->make(\Jankx\Assets\AssetManager::class);
        $this->assertInstanceOf(\Jankx\Assets\AssetManager::class, $assetManager);
    }

    public function testGutenbergServiceProviderIntegration()
    {
        // Arrange
        $provider = new GutenbergServiceProvider($this->container);

        // Act
        $provider->register();
        $provider->boot();

        // Assert
        $this->assertTrue($this->container->has(\Jankx\Gutenberg\BlockRegistry::class));
        $this->assertTrue($this->container->has(\Jankx\Gutenberg\BlockRenderer::class));

        $blockRegistry = $this->container->make(\Jankx\Gutenberg\BlockRegistry::class);
        $this->assertInstanceOf(\Jankx\Gutenberg\BlockRegistry::class, $blockRegistry);
    }
}
```

### 3. AJAX Integration Tests

```php
class AJAXIntegrationTest extends TestCase
{
    private $renderer;
    private $securityManager;

    protected function setUp(): void
    {
        $this->renderer = $this->createMock(ContentRenderer::class);
        $this->securityManager = $this->createMock(SecurityManager::class);
    }

    public function testLoadContentWithValidRequest()
    {
        // Arrange
        $_POST = [
            'action' => 'jankx_load_content',
            'block' => 'jankx/testimonial',
            'attributes' => json_encode(['author' => 'John Doe']),
            'nonce' => wp_create_nonce('jankx_ajax_nonce'),
            'placeholder_id' => 'test-123'
        ];

        $expectedContent = '<div class="testimonial">John Doe</div>';

        $this->renderer->expects($this->once())
            ->method('renderContent')
            ->with('jankx/testimonial', ['author' => 'John Doe'])
            ->willReturn($expectedContent);

        // Act
        ob_start();
        $this->handler->handleLoadContent();
        $output = ob_get_clean();

        // Assert
        $response = json_decode($output, true);
        $this->assertTrue($response['success']);
        $this->assertEquals($expectedContent, $response['data']['content']);
    }

    public function testLoadContentWithInvalidNonce()
    {
        // Arrange
        $_POST = [
            'action' => 'jankx_load_content',
            'block' => 'jankx/testimonial',
            'attributes' => json_encode([]),
            'nonce' => 'invalid-nonce',
            'placeholder_id' => 'test-123'
        ];

        // Act & Assert
        $this->expectException(\Exception::class);
        $this->handler->handleLoadContent();
    }
}
```

## 🌐 End-to-End Testing

### E2E Test Setup
```php
class GutenbergE2ETest extends TestCase
{
    private $driver;

    protected function setUp(): void
    {
        $this->driver = RemoteWebDriver::create(
            'http://localhost:4444/wd/hub',
            \Facebook\WebDriver\Remote\DesiredCapabilities::chrome()
        );
    }

    protected function tearDown(): void
    {
        $this->driver->quit();
    }

    public function testCreateTestimonialBlock()
    {
        // Navigate to post editor
        $this->driver->get('http://localhost/wp-admin/post-new.php');

        // Login if needed
        $this->loginAsAdmin();

        // Wait for editor to load
        $this->driver->wait(10)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::className('block-editor')
            )
        );

        // Add testimonial block
        $this->addBlock('testimonial');

        // Fill in block content
        $this->fillTestimonialContent();

        // Save post
        $this->savePost();

        // Verify block was saved
        $this->verifyBlockSaved();
    }

    private function loginAsAdmin()
    {
        $usernameField = $this->driver->findElement(WebDriverBy::id('user_login'));
        $passwordField = $this->driver->findElement(WebDriverBy::id('user_pass'));

        $usernameField->sendKeys('admin');
        $passwordField->sendKeys('password');

        $this->driver->findElement(WebDriverBy::id('wp-submit'))->click();
    }

    private function addBlock(string $blockName)
    {
        // Click add block button
        $addBlockButton = $this->driver->findElement(
            WebDriverBy::className('block-editor-inserter__toggle')
        );
        $addBlockButton->click();

        // Search for block
        $searchField = $this->driver->findElement(
            WebDriverBy::className('block-editor-inserter__search-input')
        );
        $searchField->sendKeys($blockName);

        // Click on block
        $blockOption = $this->driver->findElement(
            WebDriverBy::xpath("//div[contains(text(), 'Testimonial')]")
        );
        $blockOption->click();
    }

    private function fillTestimonialContent()
    {
        // Fill author field
        $authorField = $this->driver->findElement(
            WebDriverBy::cssSelector('[data-testid="testimonial-author"]')
        );
        $authorField->sendKeys('John Doe');

        // Fill content field
        $contentField = $this->driver->findElement(
            WebDriverBy::cssSelector('[data-testid="testimonial-content"]')
        );
        $contentField->sendKeys('Great product!');
    }

    private function savePost()
    {
        $saveButton = $this->driver->findElement(
            WebDriverBy::className('editor-post-publish-button')
        );
        $saveButton->click();

        // Wait for save to complete
        $this->driver->wait(10)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::className('editor-post-publish-panel')
            )
        );
    }

    private function verifyBlockSaved()
    {
        // Navigate to frontend
        $viewPostLink = $this->driver->findElement(
            WebDriverBy::className('post-publish-panel__post-link')
        );
        $viewPostLink->click();

        // Verify testimonial block is present
        $testimonialBlock = $this->driver->findElement(
            WebDriverBy::className('jankx-testimonial')
        );

        $this->assertTrue($testimonialBlock->isDisplayed());
        $this->assertStringContainsString('John Doe', $testimonialBlock->getText());
        $this->assertStringContainsString('Great product!', $testimonialBlock->getText());
    }
}
```

## 🧪 Performance Testing

### Performance Test Suite
```php
class PerformanceTest extends TestCase
{
    public function testBlockRenderingPerformance()
    {
        $startTime = microtime(true);

        $block = new TestimonialBlock();
        $attributes = [
            'author' => 'John Doe',
            'content' => 'Great product!',
            'avatar' => 'https://example.com/avatar.jpg'
        ];

        for ($i = 0; $i < 100; $i++) {
            $block->render($attributes, '');
        }

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Assert rendering 100 blocks takes less than 1 second
        $this->assertLessThan(1.0, $executionTime);
    }

    public function testAJAXResponseTime()
    {
        $startTime = microtime(true);

        // Simulate AJAX request
        $_POST = [
            'action' => 'jankx_load_content',
            'block' => 'jankx/testimonials-grid',
            'attributes' => json_encode(['postsPerPage' => 6]),
            'nonce' => wp_create_nonce('jankx_ajax_nonce')
        ];

        $handler->handleLoadContent();

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Assert AJAX response time is less than 500ms
        $this->assertLessThan(0.5, $executionTime);
    }

    public function testMemoryUsage()
    {
        $initialMemory = memory_get_usage();

        $block = new TestimonialBlock();
        $attributes = [
            'author' => 'John Doe',
            'content' => 'Great product!'
        ];

        for ($i = 0; $i < 1000; $i++) {
            $block->render($attributes, '');
        }

        $finalMemory = memory_get_usage();
        $memoryIncrease = $finalMemory - $initialMemory;

        // Assert memory increase is less than 10MB
        $this->assertLessThan(10 * 1024 * 1024, $memoryIncrease);
    }
}
```

## 🔧 Test Configuration

### PHPUnit Configuration
```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="https://schema.phpunit.de/9.5/phpunit.xsd"
         bootstrap="tests/bootstrap.php"
         colors="true"
         verbose="true">

    <testsuites>
        <testsuite name="Unit Tests">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Integration Tests">
            <directory>tests/Integration</directory>
        </testsuite>
        <testsuite name="E2E Tests">
            <directory>tests/E2E</directory>
        </testsuite>
        <testsuite name="Performance Tests">
            <directory>tests/Performance</directory>
        </testsuite>
    </testsuites>

    <coverage>
        <include>
            <directory suffix=".php">includes/Jankx/</directory>
        </include>
        <exclude>
            <directory>includes/Jankx/I18n/</directory>
            <directory>includes/Jankx/Views/</directory>
            <directory>includes/Jankx/Tests</directory>
            <directory>vendor</directory>
        </exclude>
        
    </coverage>

    <filter>
        <whitelist>
            <include>
                <directory suffix=".php">includes/Jankx/</directory>
            </include>
        </whitelist>
    </filter>

    <php>
        <env name="WP_ENV" value="testing"/>
        <env name="DB_DATABASE" value="jankx_test"/>
    </php>
</phpunit>
```

### Test Bootstrap
```php
<?php
// tests/bootstrap.php

// Load WordPress test environment
require_once getenv('WP_TESTS_DIR') . '/includes/functions.php';
require_once getenv('WP_TESTS_DIR') . '/includes/bootstrap.php';

// Load Jankx framework
require_once dirname(__DIR__) . '/includes/framework.php';

// Set up test environment
define('JANKX_TESTING', true);

// Initialize test database
if (!defined('WP_TESTS_DIR')) {
    define('WP_TESTS_DIR', '/tmp/wordpress-tests-lib');
}

// Load test helpers
require_once __DIR__ . '/helpers/TestHelper.php';
require_once __DIR__ . '/helpers/BlockTestHelper.php';
require_once __DIR__ . '/helpers/AJAXTestHelper.php';
```

## 🚀 Running Tests

### Basic Test Execution
```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Unit/Services/UserServiceTest.php

# Run specific test method
vendor/bin/phpunit --filter testGetUser tests/Unit/Services/UserServiceTest.php

# Run specific test suite
vendor/bin/phpunit --testsuite "Unit Tests"
```



### Continuous Integration
```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.1'

    - name: Install dependencies
      run: composer install --prefer-dist --no-progress

    - name: Run tests
      run: vendor/bin/phpunit
```

## 📊 Code Review Checklist

When reviewing code, ensure:

- [ ] **All classes have corresponding test files**
- [ ] **All public methods are tested**
- [ ] **Both success and failure scenarios are covered**
- [ ] **External dependencies are properly mocked**
- [ ] **Test coverage is adequate**
- [ ] **Tests are independent and isolated**
- [ ] **Test names are descriptive and clear**
- [ ] **Integration tests cover complex workflows**
- [ ] **Exception handling is tested**
- [ ] **Edge cases are covered**
- [ ] **Performance tests are included**
- [ ] **E2E tests cover critical user flows**

## 🔄 Migration from Jankx 1.x

When migrating from Jankx 1.x to 2.0:

1. **Create Test Files**: Create test files for all classes
2. **Add Test Coverage**: Ensure adequate test coverage
3. **Mock Dependencies**: Mock WordPress functions and external dependencies
4. **Test Both Scenarios**: Test both success and failure cases
5. **Update CI/CD**: Update continuous integration to include test coverage
6. **Add Performance Tests**: Include performance benchmarks
7. **Add E2E Tests**: Test critical user workflows

## 🎯 Examples

### Helper Class Example
```php
<?php
namespace Jankx\Tests\Unit\Helpers;

use PHPUnit\Framework\TestCase;
use Jankx\Helpers\ExampleHelper;

class ExampleHelperTest extends TestCase
{
    public function testFormatDataWithValidInput(): void
    {
        $input = ['test', 'data'];
        $result = ExampleHelper::formatData($input);

        $this->assertIsArray($result);
        $this->assertCount(2, $result);
    }

    public function testFormatDataWithEmptyInput(): void
    {
        $input = [];
        $result = ExampleHelper::formatData($input);

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }
}
```

### Service Class Example
```php
<?php
namespace Jankx\Tests\Unit\Services;

use PHPUnit\Framework\TestCase;
use Jankx\Services\ExampleService;
use Jankx\Repositories\ExampleRepository;

class ExampleServiceTest extends TestCase
{
    private $mockRepository;
    private $service;

    protected function setUp(): void
    {
        $this->mockRepository = $this->createMock(ExampleRepository::class);
        $this->service = new ExampleService($this->mockRepository);
    }

    public function testProcessDataSuccessfully(): void
    {
        $inputData = ['test' => 'data'];
        $expectedResult = ['processed' => 'data'];

        $this->mockRepository
            ->expects($this->once())
            ->method('save')
            ->with($this->arrayHasKey('test'))
            ->willReturn($expectedResult);

        $result = $this->service->processData($inputData);

        $this->assertEquals($expectedResult, $result);
    }
}
```

## 🎉 Conclusion

Following these testing rules ensures:

- **Code Quality**: Comprehensive testing prevents bugs and regressions
- **Maintainability**: Tests serve as documentation and prevent breaking changes
- **Confidence**: High test coverage gives confidence in code changes
- **Refactoring**: Tests enable safe refactoring and improvements
- **Documentation**: Tests serve as living documentation of expected behavior
- **Performance**: Performance tests ensure optimal execution
- **User Experience**: E2E tests ensure critical user flows work correctly

Remember: **All classes must have comprehensive unit tests with 90%+ coverage, and tests must cover both success and failure scenarios. Performance and E2E tests are also mandatory for critical components.**

---

**Jankx 2.0** - Modern WordPress Theme Framework (Development Version) 🚧

*Last updated: Development Phase*
*Framework version: 2.0.0-dev*