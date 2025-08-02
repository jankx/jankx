<?php

namespace Tests\Foundation\Log;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Log\Logger;

class LoggerTest extends TestCase
{
    private Logger $logger;

    protected function setUp(): void
    {
        $this->logger = new Logger();
    }

    public function testLoggerCanBeInstantiated()
    {
        $this->assertInstanceOf(Logger::class, $this->logger);
    }

    public function testLoggerCanLogMessages()
    {
        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $this->logger->log('info', 'Test message');
    }

    public function testLoggerCanLogWithContext()
    {
        $context = ['user_id' => 123];

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $this->logger->log('error', 'Error message', $context);
    }

    public function testLoggerCanLogDifferentLevels()
    {
        // Should not throw any exception
        $this->expectNotToPerformAssertions();

        $this->logger->debug('Debug message');
        $this->logger->info('Info message');
        $this->logger->warning('Warning message');
        $this->logger->error('Error message');
        $this->logger->critical('Critical message');
    }

    public function testLoggerCanLogExceptions()
    {
        $exception = new \Exception('Test exception');

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $this->logger->error('Test exception', ['exception' => $exception]);
    }

    public function testLoggerCanLogEmergency()
    {
        $this->expectNotToPerformAssertions();
        $this->logger->emergency('Emergency message');
    }

    public function testLoggerCanLogAlert()
    {
        $this->expectNotToPerformAssertions();
        $this->logger->alert('Alert message');
    }

    public function testLoggerCanLogNotice()
    {
        $this->expectNotToPerformAssertions();
        $this->logger->notice('Notice message');
    }
}