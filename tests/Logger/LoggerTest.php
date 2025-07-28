<?php

namespace Tests\Logger;

use PHPUnit\Framework\TestCase;
use Jankx\Logger\Logger;

/**
 * Test class for Logger
 */
class LoggerTest extends TestCase
{
    protected $logger;

    protected function setUp(): void
    {
        parent::setUp();
        $this->logger = new Logger();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }

    public function testInfoMethod()
    {
        // In test environment, info should work
        $this->logger->info('Test info message');
        $this->assertTrue(true, 'info method should work without exception');
    }

    public function testWarningMethod()
    {
        // Warning should always work
        $this->logger->warning('Test warning message');
        $this->assertTrue(true, 'warning method should work without exception');
    }

    public function testErrorMethod()
    {
        // Error should always work
        $this->logger->error('Test error message');
        $this->assertTrue(true, 'error method should work without exception');
    }

    public function testDebugMethod()
    {
        // Debug should work in test environment
        $this->logger->debug('Test debug message');
        $this->assertTrue(true, 'debug method should work without exception');
    }

    public function testLogWithContext()
    {
        $context = ['user_id' => 123, 'action' => 'test'];

        // Test with context
        $this->logger->info('Test message with context', $context);
        $this->assertTrue(true, 'log with context should work without exception');
    }

    public function testFormatMessage()
    {
        $reflection = new \ReflectionClass(Logger::class);
        $method = $reflection->getMethod('formatMessage');
        $method->setAccessible(true);

        $result = $method->invoke($this->logger, 'info', 'Test message', ['key' => 'value']);

        $this->assertStringContainsString('[Jankx info]', $result);
        $this->assertStringContainsString('Test message', $result);
        $this->assertStringContainsString('{"key":"value"}', $result);
    }

    public function testFormatMessageWithoutContext()
    {
        $reflection = new \ReflectionClass(Logger::class);
        $method = $reflection->getMethod('formatMessage');
        $method->setAccessible(true);

        $result = $method->invoke($this->logger, 'error', 'Test message');

        $this->assertStringContainsString('[Jankx error]', $result);
        $this->assertStringContainsString('Test message', $result);
        $this->assertStringNotContainsString('{}', $result);
    }

    public function testLogMethodWithDebugEnabled()
    {
        // Enable debug mode
        if (!defined('JANKX_DEBUG')) {
            define('JANKX_DEBUG', true);
        }

        $this->logger->debug('Test debug message');
        $this->assertTrue(true, 'debug should work when JANKX_DEBUG is enabled');
    }

    public function testLogMethodWithWarningLevel()
    {
        $this->logger->warning('Test warning message');
        $this->assertTrue(true, 'warning should always work');
    }

    public function testLogMethodWithErrorLevel()
    {
        $this->logger->error('Test error message');
        $this->assertTrue(true, 'error should always work');
    }

    public function testLogMethodWithInfoLevelAndDebugDisabled()
    {
        // In test environment, info should still work
        $this->logger->info('Test info message');
        $this->assertTrue(true, 'info should work in test environment even without JANKX_DEBUG');
    }

    public function testErrorLogFunctionExists()
    {
        $this->assertTrue(function_exists('error_log'), 'error_log function should always exist in PHP');
    }

    public function testLogMethodCallsErrorLog()
    {
        // Test that log method doesn't throw exception
        $this->logger->warning('Test warning message');
        $this->assertTrue(true, 'log method should work without throwing exception');
    }

    public function testLogMethodWithJankxDebugConstant()
    {
        // Test with JANKX_DEBUG defined
        if (!defined('JANKX_DEBUG')) {
            define('JANKX_DEBUG', true);
        }

        // Test all log levels when JANKX_DEBUG is true
        $levels = ['info', 'debug', 'warning', 'error'];
        foreach ($levels as $level) {
            $this->logger->{$level}("Test {$level} message");
        }

        $this->assertTrue(true, "log method should work for all levels when JANKX_DEBUG is true");
    }

    public function testIsRunningTestsMethod()
    {
        $reflection = new \ReflectionClass(Logger::class);
        $method = $reflection->getMethod('isRunningTests');
        $method->setAccessible(true);

        $result = $method->invoke($this->logger);

        $this->assertTrue($result, 'isRunningTests should return true in test environment');
    }

    public function testInternalLogMethod()
    {
        $reflection = new \ReflectionClass(Logger::class);
        $method = $reflection->getMethod('internalLog');
        $method->setAccessible(true);

        // Test that internalLog doesn't throw exception
        $method->invoke($this->logger, 'Test internal log message');
        $this->assertTrue(true, 'internalLog should work without exception');
    }
}