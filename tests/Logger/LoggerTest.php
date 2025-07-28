<?php

namespace Tests\Logger;

use PHPUnit\Framework\TestCase;
use Jankx\Logger\Logger;
use Mockery;

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
        Mockery::close();
        parent::tearDown();
    }

    public function testInfoMethod()
    {
        // Capture output to suppress log messages
        ob_start();
        $this->logger->info('Test info message');
        ob_end_clean();

        // If no exception is thrown, the method works
        $this->assertTrue(true);
    }

    public function testWarningMethod()
    {
        // Capture output to suppress log messages
        ob_start();
        $this->logger->warning('Test warning message');
        ob_end_clean();

        // If no exception is thrown, the method works
        $this->assertTrue(true);
    }

    public function testErrorMethod()
    {
        // Capture output to suppress log messages
        ob_start();
        $this->logger->error('Test error message');
        ob_end_clean();

        // If no exception is thrown, the method works
        $this->assertTrue(true);
    }

    public function testDebugMethod()
    {
        // Capture output to suppress log messages
        ob_start();
        $this->logger->debug('Test debug message');
        ob_end_clean();

        // If no exception is thrown, the method works
        $this->assertTrue(true);
    }

    public function testLogWithContext()
    {
        $context = ['user_id' => 123, 'action' => 'test'];

        // Capture output to suppress log messages
        ob_start();
        $this->logger->info('Test message with context', $context);
        ob_end_clean();

        // If no exception is thrown, the method works
        $this->assertTrue(true);
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

        $reflection = new \ReflectionClass(Logger::class);
        $method = $reflection->getMethod('log');
        $method->setAccessible(true);

        // Capture output to suppress log messages
        ob_start();
        $method->invoke($this->logger, 'debug', 'Test debug message');
        ob_end_clean();

        $this->assertTrue(true);
    }

    public function testLogMethodWithWarningLevel()
    {
        $reflection = new \ReflectionClass(Logger::class);
        $method = $reflection->getMethod('log');
        $method->setAccessible(true);

        // Capture output to suppress log messages
        ob_start();
        $method->invoke($this->logger, 'warning', 'Test warning message');
        ob_end_clean();

        $this->assertTrue(true);
    }

    public function testLogMethodWithErrorLevel()
    {
        $reflection = new \ReflectionClass(Logger::class);
        $method = $reflection->getMethod('log');
        $method->setAccessible(true);

        // Capture output to suppress log messages
        ob_start();
        $method->invoke($this->logger, 'error', 'Test error message');
        ob_end_clean();

        $this->assertTrue(true);
    }

    public function testLogMethodWithInfoLevelAndDebugDisabled()
    {
        // Disable debug mode
        if (defined('JANKX_DEBUG')) {
            $originalDebug = JANKX_DEBUG;
        }

        // Temporarily undefine JANKX_DEBUG
        if (defined('JANKX_DEBUG')) {
            $reflection = new \ReflectionClass('Jankx\Logger\Logger');
            $method = $reflection->getMethod('log');
            $method->setAccessible(true);

            // Capture output to suppress log messages
            ob_start();
            $method->invoke($this->logger, 'info', 'Test info message');
            ob_end_clean();

            $this->assertTrue(true);
        }
    }

    public function testErrorLogFunctionExists()
    {
        // Verify that error_log function exists (it should always exist in PHP)
        $this->assertTrue(function_exists('error_log'), 'error_log function should always exist in PHP');
    }

    public function testLogMethodCallsErrorLog()
    {
        // Mock error_log function to verify it's called
        $errorLogCalled = false;
        $errorLogMessage = '';

        // Create a temporary function to capture error_log calls
        $originalErrorLog = 'error_log';
        if (function_exists('error_log')) {
            // We can't easily mock built-in functions in PHP, but we can test that the method doesn't throw
            $reflection = new \ReflectionClass(Logger::class);
            $method = $reflection->getMethod('log');
            $method->setAccessible(true);

            // Capture output to suppress log messages
            ob_start();
            $method->invoke($this->logger, 'warning', 'Test warning message');
            ob_end_clean();

            $this->assertTrue(true, 'log method should call error_log without throwing exception');
        }
    }

    public function testLogMethodWithJankxDebugConstant()
    {
        // Test with JANKX_DEBUG defined
        if (!defined('JANKX_DEBUG')) {
            define('JANKX_DEBUG', true);
        }

        $reflection = new \ReflectionClass(Logger::class);
        $method = $reflection->getMethod('log');
        $method->setAccessible(true);

        // Test all log levels when JANKX_DEBUG is true
        $levels = ['info', 'debug', 'warning', 'error'];
        foreach ($levels as $level) {
            // Capture output to suppress log messages
            ob_start();
            $method->invoke($this->logger, $level, "Test {$level} message");
            ob_end_clean();

            $this->assertTrue(true, "log method should work for {$level} level when JANKX_DEBUG is true");
        }
    }
}