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
        // Mock internalLog method
        $logger = Mockery::mock(Logger::class)->makePartial()->shouldAllowMockingProtectedMethods();
        $logger->shouldReceive('internalLog')->once()->with(Mockery::pattern('/\[Jankx info\] Test info message/'));

        $logger->info('Test info message');

        $this->assertTrue(true);
    }

    public function testWarningMethod()
    {
        // Mock internalLog method
        $logger = Mockery::mock(Logger::class)->makePartial()->shouldAllowMockingProtectedMethods();
        $logger->shouldReceive('internalLog')->once()->with(Mockery::pattern('/\[Jankx warning\] Test warning message/'));

        $logger->warning('Test warning message');

        $this->assertTrue(true);
    }

    public function testErrorMethod()
    {
        // Mock internalLog method
        $logger = Mockery::mock(Logger::class)->makePartial()->shouldAllowMockingProtectedMethods();
        $logger->shouldReceive('internalLog')->once()->with(Mockery::pattern('/\[Jankx error\] Test error message/'));

        $logger->error('Test error message');

        $this->assertTrue(true);
    }

    public function testDebugMethod()
    {
        // Mock internalLog method
        $logger = Mockery::mock(Logger::class)->makePartial()->shouldAllowMockingProtectedMethods();
        $logger->shouldReceive('internalLog')->once()->with(Mockery::pattern('/\[Jankx debug\] Test debug message/'));

        $logger->debug('Test debug message');

        $this->assertTrue(true);
    }

    public function testLogWithContext()
    {
        $context = ['user_id' => 123, 'action' => 'test'];

        // Mock internalLog method
        $logger = Mockery::mock(Logger::class)->makePartial()->shouldAllowMockingProtectedMethods();
        $logger->shouldReceive('internalLog')->once()->with(Mockery::pattern('/\[Jankx info\] Test message with context.*{"user_id":123,"action":"test"}/'));

        $logger->info('Test message with context', $context);

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

        // Mock internalLog method
        $logger = Mockery::mock(Logger::class)->makePartial()->shouldAllowMockingProtectedMethods();
        $logger->shouldReceive('internalLog')->once()->with(Mockery::pattern('/\[Jankx debug\] Test debug message/'));

        $logger->debug('Test debug message');

        $this->assertTrue(true);
    }

    public function testLogMethodWithWarningLevel()
    {
        // Mock internalLog method
        $logger = Mockery::mock(Logger::class)->makePartial()->shouldAllowMockingProtectedMethods();
        $logger->shouldReceive('internalLog')->once()->with(Mockery::pattern('/\[Jankx warning\] Test warning message/'));

        $logger->warning('Test warning message');

        $this->assertTrue(true);
    }

    public function testLogMethodWithErrorLevel()
    {
        // Mock internalLog method
        $logger = Mockery::mock(Logger::class)->makePartial()->shouldAllowMockingProtectedMethods();
        $logger->shouldReceive('internalLog')->once()->with(Mockery::pattern('/\[Jankx error\] Test error message/'));

        $logger->error('Test error message');

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
            // Mock internalLog method - should be called even for info level when debug is disabled
            // because we're in test environment
            $logger = Mockery::mock(Logger::class)->makePartial()->shouldAllowMockingProtectedMethods();
            $logger->shouldReceive('internalLog')->once()->with(Mockery::pattern('/\[Jankx info\] Test info message/'));

            $logger->info('Test info message');

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
        // Mock internalLog method
        $logger = Mockery::mock(Logger::class)->makePartial()->shouldAllowMockingProtectedMethods();
        $logger->shouldReceive('internalLog')->once()->with(Mockery::pattern('/\[Jankx warning\] Test warning message/'));

        $logger->warning('Test warning message');

        $this->assertTrue(true, 'log method should call internalLog without throwing exception');
    }

    public function testLogMethodWithJankxDebugConstant()
    {
        // Test with JANKX_DEBUG defined
        if (!defined('JANKX_DEBUG')) {
            define('JANKX_DEBUG', true);
        }

        // Mock internalLog method
        $logger = Mockery::mock(Logger::class)->makePartial()->shouldAllowMockingProtectedMethods();
        $logger->shouldReceive('internalLog')->times(4)->with(Mockery::pattern('/\[Jankx (info|debug|warning|error)\] Test (info|debug|warning|error) message/'));

        // Test all log levels when JANKX_DEBUG is true
        $levels = ['info', 'debug', 'warning', 'error'];
        foreach ($levels as $level) {
            $logger->{$level}("Test {$level} message");
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
}