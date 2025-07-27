<?php

namespace Tests\Helpers;

use PHPUnit\Framework\TestCase;
use Jankx\Helpers\ErrorHandlingHelper;
use Jankx\Facades\Logger;
use Brain\Monkey\Functions;

class ErrorHandlingHelperTest extends TestCase
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

    public function testHandleBootstrapperError()
    {
        $exception = new \Exception('Test bootstrapper error');
        $bootstrapperName = 'test-bootstrapper';

        Functions\expect('Logger::error')
            ->once()
            ->with('Bootstrapper error: ' . $exception->getMessage(), [
                'bootstrapper' => $bootstrapperName,
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]);

        ErrorHandlingHelper::handleBootstrapperError($exception, $bootstrapperName);

        $this->assertTrue(true);
    }

    public function testHandleServiceResolutionError()
    {
        $exception = new \Exception('Service resolution error');
        $serviceName = 'test-service';
        $context = 'admin';

        Functions\expect('Logger::error')
            ->once()
            ->with('Service resolution error: ' . $exception->getMessage(), [
                'service' => $serviceName,
                'context' => $context,
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]);

        ErrorHandlingHelper::handleServiceResolutionError($exception, $serviceName, $context);

        $this->assertTrue(true);
    }

    public function testHandleAjaxError()
    {
        $exception = new \Exception('AJAX error');
        $action = 'test_action';

        Functions\expect('Logger::error')
            ->once()
            ->with('AJAX error: ' . $exception->getMessage(), [
                'action' => $action,
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]);

        Functions\expect('wp_send_json_error')
            ->once()
            ->with('An error occurred while processing your request');

        ErrorHandlingHelper::handleAjaxError($exception, $action);

        $this->assertTrue(true);
    }

    public function testHandleCLIError()
    {
        $exception = new \Exception('CLI error');
        $command = 'test-command';

        Functions\expect('Logger::error')
            ->once()
            ->with('CLI error: ' . $exception->getMessage(), [
                'command' => $command,
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]);

        Functions\expect('WP_CLI::error')
            ->once()
            ->with('Command failed: ' . $exception->getMessage());

        ErrorHandlingHelper::handleCLIError($exception, $command);

        $this->assertTrue(true);
    }

    public function testHandleDebugError()
    {
        $exception = new \Exception('Debug error');
        $operation = 'test-operation';

        Functions\expect('Logger::error')
            ->once()
            ->with('Debug error: ' . $exception->getMessage(), [
                'operation' => $operation,
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]);

        ErrorHandlingHelper::handleDebugError($exception, $operation);

        $this->assertTrue(true);
    }

    public function testSafeResolveWithValidContainer()
    {
        $container = new \stdClass();
        $serviceName = 'test-service';
        $expectedResult = 'test-result';

        $fallback = function () use ($expectedResult) {
            return $expectedResult;
        };

        $result = ErrorHandlingHelper::safeResolve($container, $serviceName, $fallback);

        $this->assertEquals($expectedResult, $result);
    }

    public function testSafeResolveWithNullContainer()
    {
        $serviceName = 'test-service';
        $expectedResult = 'fallback-result';

        $fallback = function () use ($expectedResult) {
            return $expectedResult;
        };

        $result = ErrorHandlingHelper::safeResolve(null, $serviceName, $fallback);

        $this->assertEquals($expectedResult, $result);
    }

    public function testSafeResolveWithoutFallback()
    {
        $container = new \stdClass();
        $serviceName = 'test-service';

        $result = ErrorHandlingHelper::safeResolve($container, $serviceName);

        $this->assertNull($result);
    }

    public function testSafeExecuteWithSuccessfulCallback()
    {
        $callback = function () {
            return 'success';
        };
        $operation = 'test-operation';

        $result = ErrorHandlingHelper::safeExecute($callback, $operation);

        $this->assertEquals('success', $result);
    }

    public function testSafeExecuteWithException()
    {
        $callback = function () {
            throw new \Exception('Test exception');
        };
        $operation = 'test-operation';
        $fallback = function () {
            return 'fallback-result';
        };

        Functions\expect('Logger::error')
            ->once()
            ->with('Operation failed: Test exception', [
                'operation' => $operation,
                'file' => \Mockery::any(),
                'line' => \Mockery::any(),
            ]);

        $result = ErrorHandlingHelper::safeExecute($callback, $operation, $fallback);

        $this->assertEquals('fallback-result', $result);
    }

    public function testSafeExecuteWithExceptionAndNoFallback()
    {
        $callback = function () {
            throw new \Exception('Test exception');
        };
        $operation = 'test-operation';

        Functions\expect('Logger::error')
            ->once()
            ->with('Operation failed: Test exception', [
                'operation' => $operation,
                'file' => \Mockery::any(),
                'line' => \Mockery::any(),
            ]);

        $result = ErrorHandlingHelper::safeExecute($callback, $operation);

        $this->assertNull($result);
    }
} 