# Testing Guidelines

> **Comprehensive Testing Strategy for Jankx 2.0**

Jankx 2.0 tuân thủ testing best practices với unit tests, integration tests, và automated testing workflows.

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

## 🔧 Unit Testing

### Test Structure
```php
<?php
namespace Jankx\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Jankx\User\UserService;
use Jankx\User\UserRepository;
use Jankx\User\UserValidator;

class UserServiceTest extends TestCase
{
    private $userService;
    private $userRepository;
    private $userValidator;

    protected function setUp(): void
    {
        $this->userRepository = $this->createMock(UserRepository::class);
        $this->userValidator = $this->createMock(UserValidator::class);
        $this->userService = new UserService($this->userRepository, $this->userValidator);
    }

    public function testCreateUserWithValidData()
    {
        // Arrange
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'secure123'
        ];

        $user = new User(1, 'John Doe', 'john@example.com');

        $this->userValidator->expects($this->once())
            ->method('validate')
            ->with($userData)
            ->willReturn(true);

        $this->userRepository->expects($this->once())
            ->method('create')
            ->with($userData)
            ->willReturn($user);

        // Act
        $result = $this->userService->createUser($userData);

        // Assert
        $this->assertEquals($user, $result);
        $this->assertEquals('John Doe', $result->getName());
        $this->assertEquals('john@example.com', $result->getEmail());
    }

    public function testCreateUserWithInvalidData()
    {
        // Arrange
        $userData = [
            'name' => '',
            'email' => 'invalid-email',
            'password' => '123'
        ];

        $this->userValidator->expects($this->once())
            ->method('validate')
            ->with($userData)
            ->willReturn(false);

        // Act & Assert
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid user data');

        $this->userService->createUser($userData);
    }

    public function testGetUserById()
    {
        // Arrange
        $userId = 1;
        $user = new User($userId, 'John Doe', 'john@example.com');

        $this->userRepository->expects($this->once())
            ->method('find')
            ->with($userId)
            ->willReturn($user);

        // Act
        $result = $this->userService->getUser($userId);

        // Assert
        $this->assertEquals($user, $result);
    }

    public function testGetUserByIdNotFound()
    {
        // Arrange
        $userId = 999;

        $this->userRepository->expects($this->once())
            ->method('find')
            ->with($userId)
            ->willReturn(null);

        // Act
        $result = $this->userService->getUser($userId);

        // Assert
        $this->assertNull($result);
    }
}
```

### Block Testing
```php
<?php
namespace Jankx\Tests\Unit\Gutenberg;

use PHPUnit\Framework\TestCase;
use Jankx\Gutenberg\Blocks\TestimonialBlock;

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

### Service Integration Tests
```php
<?php
namespace Jankx\Tests\Integration;

use PHPUnit\Framework\TestCase;
use Jankx\Container\ServiceContainer;
use Jankx\Providers\AssetServiceProvider;
use Jankx\Providers\GutenbergServiceProvider;

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

### AJAX Integration Tests
```php
<?php
namespace Jankx\Tests\Integration;

use PHPUnit\Framework\TestCase;
// AJAXHandler removed - only core Gutenberg system remains
use Jankx\Gutenberg\AJAX\ContentRenderer;
use Jankx\Security\SecurityManager;

class AJAXIntegrationTest extends TestCase
{
    private $handler;
    private $renderer;
    private $securityManager;

    protected function setUp(): void
    {
        $this->renderer = $this->createMock(ContentRenderer::class);
        $this->securityManager = $this->createMock(SecurityManager::class);
        // AJAXHandler removed - only core Gutenberg system remains
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
<?php
namespace Jankx\Tests\E2E;

use PHPUnit\Framework\TestCase;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverExpectedCondition;

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
<?php
namespace Jankx\Tests\Performance;

use PHPUnit\Framework\TestCase;

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

        // AJAXHandler removed - only core Gutenberg system remains
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
<!-- phpunit.xml -->
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
            <directory suffix=".php">includes/Jankx</directory>
        </include>
        <exclude>
            <directory>includes/Jankx/Tests</directory>
            <directory>vendor</directory>
        </exclude>
    </coverage>

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
// Version is now handled by Jankx::getFrameworkVersion()

// Initialize test database
if (!defined('WP_TESTS_DIR')) {
    define('WP_TESTS_DIR', '/tmp/wordpress-tests-lib');
}

// Load test helpers
require_once __DIR__ . '/helpers/TestHelper.php';
require_once __DIR__ . '/helpers/BlockTestHelper.php';
require_once __DIR__ . '/helpers/AJAXTestHelper.php';
```

## 📊 Test Reporting

### Test Coverage Report
```php
class TestCoverageReporter
{
    private $coverageData = [];

    public function generateReport(): string
    {
        $report = "# Test Coverage Report\n\n";

        $report .= "## Overall Coverage\n";
        $report .= "- **Unit Tests**: {$this->getUnitTestCoverage()}%\n";
        $report .= "- **Integration Tests**: {$this->getIntegrationTestCoverage()}%\n";
        $report .= "- **E2E Tests**: {$this->getE2ETestCoverage()}%\n";

        $report .= "\n## Component Coverage\n";
        $report .= $this->getComponentCoverage();

        $report .= "\n## Performance Metrics\n";
        $report .= $this->getPerformanceMetrics();

        return $report;
    }

    private function getUnitTestCoverage(): int
    {
        // Calculate unit test coverage
        return 95; // Example value
    }

    private function getIntegrationTestCoverage(): int
    {
        // Calculate integration test coverage
        return 85; // Example value
    }

    private function getE2ETestCoverage(): int
    {
        // Calculate E2E test coverage
        return 70; // Example value
    }

    private function getComponentCoverage(): string
    {
        return "
- **Kernel System**: 98%
- **Service Container**: 95%
- **Gutenberg Blocks**: 92%
- **AJAX System**: 88%
- **Security System**: 96%
- **Performance System**: 90%
        ";
    }

    private function getPerformanceMetrics(): string
    {
        return "
- **Block Rendering**: < 100ms
- **AJAX Response**: < 500ms
- **Memory Usage**: < 10MB increase
- **Test Execution**: < 30 seconds
        ";
    }
}
```

---

**Next**: [Migration Guide](./migration.md)