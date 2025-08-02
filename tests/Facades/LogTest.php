<?php

namespace Tests\Facades;

use PHPUnit\Framework\TestCase;
use Jankx\Facades\Log;
use Jankx\Foundation\Application;
use Jankx\Foundation\Log\Logger;

class LogTest extends TestCase
{
    private Application $app;

    protected function setUp(): void
    {
        $this->app = new Application();
        Log::setFacadeApplication($this->app);
    }

        public function testLogFacadeCanLogMessages()
    {
        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        Log::info('Test message');
    }

    public function testLogFacadeCanLogWithContext()
    {
        $context = ['user_id' => 123];

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        Log::error('Error message', $context);
    }

    public function testLogFacadeCanLogDifferentLevels()
    {
        // Should not throw any exception
        $this->expectNotToPerformAssertions();

        Log::debug('Debug message');
        Log::info('Info message');
        Log::warning('Warning message');
        Log::error('Error message');
        Log::critical('Critical message');
    }

    public function testLogFacadeCanLogExceptions()
    {
        $exception = new \Exception('Test exception');

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        Log::error('Test exception', ['exception' => $exception]);
    }
}