<?php

namespace Tests\Facades;

use PHPUnit\Framework\TestCase;
use Jankx\Facades\Logger;
use Brain\Monkey\Functions;

class LoggerFacadeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Brain\Monkey\setUp();
    }

    protected function tearDown(): void
    {
        Brain\Monkey\tearDown();
        parent::tearDown();
    }

    public function testLog()
    {
        $message = 'Test log message';
        $context = ['key' => 'value'];

        Functions\expect('error_log')
            ->once()
            ->with($message);

        Logger::log('info', $message, $context);

        $this->assertTrue(true);
    }

    public function testInfo()
    {
        $message = 'Test info message';
        $context = ['key' => 'value'];

        Functions\expect('error_log')
            ->once()
            ->with('[INFO] ' . $message);

        Logger::info($message, $context);

        $this->assertTrue(true);
    }

    public function testWarning()
    {
        $message = 'Test warning message';
        $context = ['key' => 'value'];

        Functions\expect('error_log')
            ->once()
            ->with('[WARNING] ' . $message);

        Logger::warning($message, $context);

        $this->assertTrue(true);
    }

    public function testError()
    {
        $message = 'Test error message';
        $context = ['key' => 'value'];

        Functions\expect('error_log')
            ->once()
            ->with('[ERROR] ' . $message);

        Logger::error($message, $context);

        $this->assertTrue(true);
    }

    public function testDebug()
    {
        $message = 'Test debug message';
        $context = ['key' => 'value'];

        Functions\expect('error_log')
            ->once()
            ->with('[DEBUG] ' . $message);

        Logger::debug($message, $context);

        $this->assertTrue(true);
    }

    public function testCritical()
    {
        $message = 'Test critical message';
        $context = ['key' => 'value'];

        Functions\expect('error_log')
            ->once()
            ->with('[CRITICAL] ' . $message);

        Logger::critical($message, $context);

        $this->assertTrue(true);
    }

    public function testEmergency()
    {
        $message = 'Test emergency message';
        $context = ['key' => 'value'];

        Functions\expect('error_log')
            ->once()
            ->with('[EMERGENCY] ' . $message);

        Logger::emergency($message, $context);

        $this->assertTrue(true);
    }

    public function testAlert()
    {
        $message = 'Test alert message';
        $context = ['key' => 'value'];

        Functions\expect('error_log')
            ->once()
            ->with('[ALERT] ' . $message);

        Logger::alert($message, $context);

        $this->assertTrue(true);
    }

    public function testNotice()
    {
        $message = 'Test notice message';
        $context = ['key' => 'value'];

        Functions\expect('error_log')
            ->once()
            ->with('[NOTICE] ' . $message);

        Logger::notice($message, $context);

        $this->assertTrue(true);
    }

    public function testLogWithContext()
    {
        $message = 'Test message with context';
        $context = [
            'user_id' => 123,
            'action' => 'login',
            'ip' => '192.168.1.1',
        ];

        Functions\expect('error_log')
            ->once()
            ->with('[INFO] ' . $message . ' ' . json_encode($context));

        Logger::info($message, $context);

        $this->assertTrue(true);
    }

    public function testLogWithoutContext()
    {
        $message = 'Test message without context';

        Functions\expect('error_log')
            ->once()
            ->with('[INFO] ' . $message);

        Logger::info($message);

        $this->assertTrue(true);
    }

    public function testSetLogLevel()
    {
        $level = 'warning';

        Logger::setLogLevel($level);

        $this->assertTrue(true);
    }

    public function testGetLogLevel()
    {
        $expectedLevel = 'info';

        $result = Logger::getLogLevel();

        $this->assertEquals($expectedLevel, $result);
    }

    public function testIsLoggable()
    {
        $level = 'error';

        $result = Logger::isLoggable($level);

        $this->assertTrue($result);
    }

    public function testIsLoggableWithLowerLevel()
    {
        $level = 'debug';

        $result = Logger::isLoggable($level);

        $this->assertFalse($result);
    }

    public function testFormatMessage()
    {
        $level = 'info';
        $message = 'Test message';
        $context = ['key' => 'value'];

        $result = Logger::formatMessage($level, $message, $context);

        $this->assertStringContainsString('[INFO]', $result);
        $this->assertStringContainsString($message, $result);
        $this->assertStringContainsString(json_encode($context), $result);
    }

    public function testFormatMessageWithoutContext()
    {
        $level = 'error';
        $message = 'Test message';

        $result = Logger::formatMessage($level, $message);

        $this->assertStringContainsString('[ERROR]', $result);
        $this->assertStringContainsString($message, $result);
        $this->assertStringNotContainsString('{}', $result);
    }
} 