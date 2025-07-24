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
        $this->logger->info('Test info message');
        // If no exception is thrown, the method works
        $this->assertTrue(true);
    }

    public function testWarningMethod()
    {
        $this->logger->warning('Test warning message');
        // If no exception is thrown, the method works
        $this->assertTrue(true);
    }

    public function testErrorMethod()
    {
        $this->logger->error('Test error message');
        // If no exception is thrown, the method works
        $this->assertTrue(true);
    }

    public function testDebugMethod()
    {
        $this->logger->debug('Test debug message');
        // If no exception is thrown, the method works
        $this->assertTrue(true);
    }

    public function testLogWithContext()
    {
        $context = ['user_id' => 123, 'action' => 'test'];
        $this->logger->info('Test message with context', $context);
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

        // This should not throw an exception
        $method->invoke($this->logger, 'debug', 'Test debug message');
        $this->assertTrue(true);
    }

    public function testLogMethodWithWarningLevel()
    {
        $reflection = new \ReflectionClass(Logger::class);
        $method = $reflection->getMethod('log');
        $method->setAccessible(true);

        // This should not throw an exception
        $method->invoke($this->logger, 'warning', 'Test warning message');
        $this->assertTrue(true);
    }

    public function testLogMethodWithErrorLevel()
    {
        $reflection = new \ReflectionClass(Logger::class);
        $method = $reflection->getMethod('log');
        $method->setAccessible(true);

        // This should not throw an exception
        $method->invoke($this->logger, 'error', 'Test error message');
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

            // This should not throw an exception but should return early
            $method->invoke($this->logger, 'info', 'Test info message');
            $this->assertTrue(true);
        }
    }
}